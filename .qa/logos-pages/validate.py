"""Verificações de publicação, originais e conversão sem tocar dados do navegador."""
import hashlib
import json
import sys
import uuid
from contextlib import nullcontext
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
import sync_pages
from scripts.process_client_logos import safe_member

results = []


def check(name, condition):
    results.append({'name': name, 'passed': bool(condition)})
    if not condition:
        raise AssertionError(name)


report = json.loads((ROOT / '_CONTROLE_PROJETO/LOGOS_PROCESSADAS.json').read_text(encoding='utf-8'))
originals = ROOT / report['originais']
assets = ROOT / 'central-demandas/assets/clientes'
catalog = json.loads((assets / 'clientes.json').read_text(encoding='utf-8'))
for row in report['arquivos']:
    original = originals / row['arquivo_original']
    check('Original preservado: ' + original.name, original.stat().st_size == row['bytes_original'] and hashlib.sha256(original.read_bytes()).hexdigest() == row['sha256_original'])
    if row['status'] not in ('webp_sem_perda', 'original_menor_preservado'):
        continue
    published = assets / row['logo']
    if published.suffix == '.webp':
        with Image.open(original) as source, Image.open(published) as target:
            expected = ImageOps.exif_transpose(source).convert('RGBA')
            actual = target.convert('RGBA')
            check('WebP preserva pixels RGBA e resolução: ' + original.name, expected.size == actual.size and expected.tobytes() == actual.tobytes())
        check('WebP menor: ' + original.name, published.stat().st_size < original.stat().st_size * .95)
    else:
        check('Formato original mantido byte a byte: ' + original.name, published.read_bytes() == original.read_bytes())
check('Catálogo sem IDs duplicados', len(catalog) == len({row['id'] for row in catalog}))
check('Catálogo somente com arquivos fornecidos', all((originals / row['arquivo_original']).is_file() for row in catalog))
check('Todos os recursos gerados sincronizados', all(path.read_text(encoding='utf-8') == content for path, content in sync_pages.build(ROOT).items()))

for unsafe in ('../escape.png', '/absolute.png', 'C:/escape.png', 'logos/../../escape.png', '..\\escape.png', '//host/share.png', 'CON.png', 'logos/foo.png ', 'logos/NUL', 'logos/a:stream'):
    try:
        safe_member(unsafe)
    except ValueError:
        check('ZIP rejeita caminho inseguro: ' + unsafe, True)
    else:
        check('ZIP rejeita caminho inseguro: ' + unsafe, False)

with nullcontext(ROOT / '.qa/logos-pages/fixtures' / uuid.uuid4().hex) as temporary:
    fixture = Path(temporary)
    source = fixture / 'central-demandas'
    for folder in ('css', 'js', 'assets/clientes/logos'):
        (source / folder).mkdir(parents=True, exist_ok=True)
    (source / 'css/style.css').write_text('body{}')
    (source / 'js/app.js').write_text('void 0')
    html = '<link href="css/style.css"><script src="assets/clientes/catalogo.js"></script><script src="js/app.js"></script>'
    (source / 'index.html').write_text(html)
    (source / 'assets/clientes/clientes.json').write_text('[]')
    (fixture / 'index.html').write_text('versão obsoleta na raiz')
    outputs = sync_pages.build(fixture)
    check('Raiz antiga nunca sobrescreve fonte principal', (source / 'index.html').read_text() == html and 'central-demandas/css/style.css' in outputs[fixture / 'index.html'])
    check('Catálogo vazio aceito', 'window.LivreEscolhaClientes=[];' in outputs[source / 'assets/clientes/catalogo.js'])
    (source / 'index.html').write_text(html.replace('css/style.css','/css/style.css'))
    try:
        sync_pages.build(fixture)
    except ValueError:
        check('Publicação rejeita caminho absoluto que quebra subpasta', True)
    else:
        check('Publicação rejeita caminho absoluto que quebra subpasta', False)
    (source / 'index.html').write_text(html)
    (source / 'assets/clientes/clientes.json').write_text(json.dumps([{'id':'a','nome':'A','nome_normalizado':'a','logo':'logos/ausente.webp','arquivo_original':'A.png'}]))
    try:
        sync_pages.build(fixture)
    except ValueError:
        check('Publicação rejeita logo ausente', True)
    else:
        check('Publicação rejeita logo ausente', False)

backup = ROOT / '_CONTROLE_PROJETO/backups/2026-10-30_093340_logos-pages_a78d5ba2'
manifest = json.loads((backup / 'MANIFESTO_SHA256.json').read_text(encoding='utf-8-sig'))
for row in manifest['files']:
    copy = backup / row['path']
    check('Backup íntegro: ' + row['path'], hashlib.sha256(copy.read_bytes()).hexdigest().upper() == row['sha256'] and copy.stat().st_size == row['bytes'])
for row in manifest['backend_integrity']:
    check('Backend inalterado: ' + row['path'], hashlib.sha256((ROOT / row['path']).read_bytes()).hexdigest().upper() == row['sha256'])
row = next(row for row in manifest['files'] if row['path'] == 'demandas_otimizado (1).html')
check('HTML original e alteração anterior preservados', hashlib.sha256((ROOT / row['path']).read_bytes()).hexdigest().upper() == row['sha256'])

result = {'passed': len(results), 'failed': 0, 'results': results}
(ROOT / '.qa/logos-pages/integrity-results.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'{len(results)} verificações aprovadas; zero falhas.')
