"""Servidor de QA local; não disponibiliza backend, segredos ou backups."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parents[2]


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        path = unquote(urlsplit(self.path).path)
        prefix = '/livre-escolha-demandas'
        if path.startswith(prefix + '/'):
            self.path = self.path[len(prefix):]
            path = path[len(prefix):]
        resolved = (ROOT / path.lstrip('/')).resolve()
        allowed = path in ('/', '/index.html') or path.startswith(('/central-demandas/', '/.qa/logos-pages/'))
        if not allowed or not resolved.is_relative_to(ROOT) or '..' in Path(path).parts:
            self.send_error(404)
            return
        super().do_GET()


if __name__ == '__main__':
    ThreadingHTTPServer(('127.0.0.1', 8765), Handler).serve_forever()
