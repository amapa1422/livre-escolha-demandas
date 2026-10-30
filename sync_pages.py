"""Gera a entrada Pages e o catálogo JS a partir das fontes canônicas.
Uso: python sync_pages.py [--check]. Sem dependências externas.
"""
import argparse
import json
import re
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent


def build(root):
    source_dir = root / 'central-demandas'
    html = (source_dir / 'index.html').read_text(encoding='utf-8')
    catalog = json.loads((source_dir / 'assets/clientes/clientes.json').read_text(encoding='utf-8'))
    if not isinstance(catalog, list):
        raise ValueError('Catálogo precisa ser uma lista.')
    ids, names = set(), set()
    for client in catalog:
        if not isinstance(client, dict) or not all(isinstance(client.get(key), str) and client[key] for key in ('id', 'nome', 'nome_normalizado', 'logo', 'arquivo_original')):
            raise ValueError('Cliente inválido.')
        if client['id'] in ids or client['nome_normalizado'] in names:
            raise ValueError('Cliente duplicado.')
        ids.add(client['id']); names.add(client['nome_normalizado'])
        if not re.fullmatch(r'logos/[a-z0-9-]+\.(webp|png|jpg|jpeg)', client['logo']):
            raise ValueError('Caminho de logo inválido.')
        if not (source_dir / 'assets/clientes' / client['logo']).is_file():
            raise ValueError('Logo ausente: ' + client['logo'])
    generated = '// Gerado de clientes.json por sync_pages.py. Não editar manualmente.\nwindow.LivreEscolhaClientes=' + json.dumps(catalog, ensure_ascii=True, separators=(',', ':')) + ';\n'
    expected = {'css/style.css', 'js/app.js', 'assets/clientes/catalogo.js'}
    found = set()

    def rewrite(match):
        attribute, value = match.groups()
        url = urlsplit(value)
        if url.scheme or url.netloc or value.startswith('#'):
            return match.group(0)
        if value.startswith('/') or '..' in Path(url.path).parts:
            raise ValueError('Use recursos locais relativos à fonte principal: ' + value)
        found.add(url.path)
        if url.path != 'assets/clientes/catalogo.js' and not (source_dir / url.path).is_file():
            raise ValueError('Recurso ausente: ' + value)
        return f'{attribute}="central-demandas/{value}"'

    html = re.sub(r'\b(href|src)="([^"]+)"', rewrite, html)
    if not expected.issubset(found):
        raise ValueError('HTML principal sem CSS, app ou catálogo esperados.')
    return {root / 'index.html': '<!-- Gerado por sync_pages.py; editar central-demandas/index.html. -->\n' + html,
            source_dir / 'assets/clientes/catalogo.js': generated}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    try:
        outputs = build(ROOT)
        stale = [path for path, content in outputs.items() if not path.exists() or path.read_text(encoding='utf-8') != content]
        if args.check and stale:
            raise ValueError('Arquivos gerados desatualizados. Execute: python sync_pages.py')
        for path in stale:
            path.write_text(outputs[path], encoding='utf-8')
        print('OK: entrada Pages, catálogo, CSS, JS e logos verificados.' if args.check else f'OK: {len(stale)} arquivo(s) gerado(s).')
    except (ValueError, OSError, KeyError, TypeError) as error:
        raise SystemExit(f'Erro: {error}')


if __name__ == '__main__':
    main()
