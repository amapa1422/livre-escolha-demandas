"""Importação local; requer Pillow apenas para preparar os assets.
Uso: python scripts/process_client_logos.py CAMINHO_DO_ZIP
Não sobrescreve catálogo, logos ou originais existentes.
"""
import hashlib
import io
import json
import re
import stat
import sys
import unicodedata
import uuid
import zipfile
from datetime import datetime, timezone, timedelta
from pathlib import Path, PurePosixPath
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]


def normalized(value):
    return ''.join(c for c in unicodedata.normalize('NFD', value) if not unicodedata.combining(c)).lower().strip()


def identity(value):
    return re.sub(r'[^a-z0-9]+', ' ', normalized(value)).strip()


def safe_member(name):
    path = PurePosixPath(name.replace('\\', '/'))
    if path.is_absolute() or '..' in path.parts or ':' in name or not path.parts:
        raise ValueError(f'Caminho inseguro no ZIP: {name!r}')
    reserved = {'CON', 'PRN', 'AUX', 'NUL', *(f'COM{i}' for i in range(1, 10)), *(f'LPT{i}' for i in range(1, 10))}
    if any(part.endswith(('.', ' ')) or part.split('.')[0].upper() in reserved
           or any(ord(char) < 32 or char in '<>"|?*' for char in part) for part in path.parts):
        raise ValueError(f'Nome de arquivo inseguro no Windows: {name!r}')
    return path


def process(archive):
    output = ROOT / 'central-demandas/assets/clientes'
    if output.exists():
        raise SystemExit('O destino já existe. Preserve-o antes de uma nova importação.')
    stamp = datetime.now(timezone(timedelta(hours=-3))).strftime('%Y-%m-%d_%H%M%S')
    originals = ROOT / '_CONTROLE_PROJETO/backups' / f'{stamp}_originais-logos_{uuid.uuid4().hex[:8]}'
    report = {'zip': archive.name, 'zip_sha256': hashlib.sha256(archive.read_bytes()).hexdigest(),
              'originais': originals.relative_to(ROOT).as_posix(), 'arquivos': [], 'revisao_manual': []}
    catalog, names, images = [], {}, {}
    # As abreviações coexistem com nomes completos: confirmar antes de criar duplicatas.
    ambiguous = {'Comercial_Agricola_Cornelio', 'Comercial_Agricola_Jardim'}
    with zipfile.ZipFile(archive) as source:
        entries = [entry for entry in source.infolist() if not entry.is_dir()]
        if len(entries) > 2000 or sum(entry.file_size for entry in entries) > 100 * 1024 * 1024:
            raise ValueError('Arquivo excede os limites da importação.')
        seen = set()
        for entry in entries:
            path = safe_member(entry.filename)
            if stat.S_ISLNK(entry.external_attr >> 16) or str(path).casefold() in seen:
                raise ValueError('Link simbólico ou caminho duplicado no ZIP.')
            seen.add(str(path).casefold())
        originals.mkdir(parents=True, exist_ok=False)
        (output / 'logos').mkdir(parents=True, exist_ok=False)
        for entry in sorted(entries, key=lambda item: item.filename.casefold()):
            relative = safe_member(entry.filename)
            target = originals.joinpath(*relative.parts).resolve()
            if not target.is_relative_to(originals.resolve()):
                raise ValueError('Destino fora da pasta de originais.')
            target.parent.mkdir(parents=True, exist_ok=True)
            content = source.read(entry)
            with target.open('xb') as stream:
                stream.write(content)
            digest = hashlib.sha256(content).hexdigest()
            assert hashlib.sha256(target.read_bytes()).hexdigest() == digest
            row = {'arquivo_original': entry.filename, 'bytes_original': len(content), 'sha256_original': digest}
            report['arquivos'].append(row)
            try:
                if target.suffix.lower() not in ('.png', '.jpg', '.jpeg', '.webp'):
                    raise ValueError('Formato não suportado; solicitar imagem PNG/JPEG/WebP.')
                with Image.open(io.BytesIO(content)) as opened:
                    if opened.format not in ('PNG', 'JPEG', 'WEBP') or getattr(opened, 'n_frames', 1) != 1:
                        raise ValueError('Formato ou animação exige revisão manual.')
                    opened.load()
                    picture = ImageOps.exif_transpose(opened).convert('RGBA')
                name = re.sub(r'[_\s]+', ' ', target.stem).strip()
                key = identity(name)
                if target.stem in ambiguous or not re.search(r'[a-zA-Z]', name):
                    raise ValueError('Identificação abreviada/ambígua: confirmar antes de cadastrar.')
                if key in names:
                    row.update(status='cadastro_duplicado', cliente_id=names[key])
                    continue
                if digest in images:
                    logo, first = images[digest]
                    row.update(status='imagem_reutilizada', duplicada_de=first)
                else:
                    encoded = io.BytesIO()
                    picture.save(encoded, format='WEBP', lossless=True, method=6, exact=True)
                    webp = encoded.getvalue()
                    with Image.open(io.BytesIO(webp)) as decoded:
                        assert decoded.size == picture.size and decoded.convert('RGBA').tobytes() == picture.tobytes()
                    use_webp = len(webp) < len(content) * .95
                    extension = '.webp' if use_webp else target.suffix.lower()
                    logo = f'logos/logo-{digest[:20]}{extension}'
                    with (output / logo).open('xb') as stream:
                        stream.write(webp if use_webp else content)
                    images[digest] = (logo, entry.filename)
                    row['status'] = 'webp_sem_perda' if use_webp else 'original_menor_preservado'
                row.update(logo=logo, largura=picture.width, altura=picture.height,
                           bytes_publicado=(output / logo).stat().st_size)
                client_id = 'cliente-' + hashlib.sha256(key.encode()).hexdigest()[:16]
                names[key] = client_id
                catalog.append({'id': client_id, 'nome': name, 'nome_normalizado': normalized(name),
                                'logo': logo, 'arquivo_original': entry.filename})
                row['cliente_id'] = client_id
            except Exception as error:
                row.update(status='revisao_manual', motivo=str(error))
                report['revisao_manual'].append({'arquivo_original': entry.filename, 'motivo': str(error)})
    catalog.sort(key=lambda client: client['nome_normalizado'])
    assert len({client['id'] for client in catalog}) == len(catalog)
    (output / 'clientes.json').write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    report['resumo'] = {'arquivos_originais': len(entries), 'clientes': len(catalog), 'logos_unicas': len(images),
                        'webp_gerados': sum(path.suffix == '.webp' for path in (output / 'logos').iterdir()),
                        'revisao_manual': len(report['revisao_manual']),
                        'bytes_logos_publicadas': sum(path.stat().st_size for path in (output / 'logos').iterdir()),
                        'bytes_originais_unicos': sum(row['bytes_original'] for row in report['arquivos'] if row['status'] in ('webp_sem_perda', 'original_menor_preservado'))}
    report_path = ROOT / '_CONTROLE_PROJETO/LOGOS_PROCESSADAS.json'
    with report_path.open('x', encoding='utf-8') as stream:
        json.dump(report, stream, ensure_ascii=False, indent=2)
    (originals / 'MANIFESTO.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(report['resumo'], ensure_ascii=False))


if __name__ == '__main__':
    process(Path(sys.argv[1]).resolve())
