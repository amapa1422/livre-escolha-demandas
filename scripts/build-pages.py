"""Empacota somente o front-end público. Uso: python scripts/build-pages.py DESTINO_NOVO"""
import importlib.util
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def build(destination):
    destination = destination.resolve()
    if destination == ROOT or ROOT in destination.parents and destination.parts[len(ROOT.parts)] in ('central-demandas', 'backend', '_CONTROLE_PROJETO', '.git'):
        raise ValueError('Destino deve ser uma pasta nova de build, fora das fontes.')
    if destination.exists() and any(destination.iterdir()):
        raise ValueError('Destino deve estar vazio. Nenhum arquivo foi apagado.')
    spec = importlib.util.spec_from_file_location('sync_pages', ROOT / 'sync_pages.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    for file, expected in module.build(ROOT).items():
        if not file.exists() or file.read_text(encoding='utf-8') != expected:
            raise ValueError('Execute sync_pages.py antes de empacotar.')
    files = [ROOT / 'index.html']
    public = ROOT / 'central-demandas'
    files.extend(file for file in public.rglob('*') if file.is_file()
                 and file.suffix.lower() in ('.html', '.css', '.js', '.json', '.webp', '.png', '.jpg', '.jpeg')
                 and not any(part.startswith('.') for part in file.relative_to(public).parts))
    destination.mkdir(parents=True, exist_ok=True)
    for file in files:
        target = destination / file.relative_to(ROOT)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(file, target)
    (destination / '.nojekyll').write_text('', encoding='utf-8')
    print(f'OK: {len(files)} arquivos públicos em {destination}. Sem backend, .env, backups ou QA.')


if __name__ == '__main__':
    try:
        if len(sys.argv) != 2:
            raise ValueError('Informe um diretório de saída novo/vazio.')
        build(Path(sys.argv[1]))
    except (ValueError, OSError) as error:
        raise SystemExit(str(error))
