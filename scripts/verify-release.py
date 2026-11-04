"""Auditoria local sem imprimir valores sensíveis. Não faz staging, commit ou push."""
import argparse
import hashlib
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def private_local_values():
    """Compara segredos locais em memória; nunca imprime nem grava seus valores."""
    file = ROOT / 'backend/.env'
    values = []
    if file.is_file():
        for line in file.read_text(encoding='utf-8-sig').splitlines():
            if '=' not in line or line.lstrip().startswith('#'):
                continue
            name, value = line.split('=', 1)
            if name.strip() not in ('PGPASSWORD', 'SESSION_SECRET', 'DATABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SECRET_KEY'):
                continue
            value = value.strip().strip('\'"')
            if len(value) >= 6:
                values.append(value.encode('utf-8'))
    return values

LOCAL_VALUES = private_local_values()
PATTERNS = {
    'supabase_secret': re.compile(rb'sb_secret_[A-Za-z0-9_-]{8,}'),
    'private_key': re.compile(rb'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'),
    'database_password_url': re.compile(rb'postgres(?:ql)?://[^:\s]+:[^@\s]+@'),
    'literal_jwt': re.compile(rb'eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+'),
    'github_token': re.compile(rb'(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})'),
    'aws_access_id': re.compile(rb'\b(?:AKIA|ASIA)[A-Z0-9]{16}\b'),
    'dotenv_secret': re.compile(rb'(?im)^\s*(?:PGPASSWORD|SESSION_SECRET|SUPABASE_SERVICE_ROLE_KEY|SUPABASE_SECRET_KEY)\s*=\s*[^\s#]{6,}'),
}

def known_test_fixture(name, kind, match):
    # Valor obviamente fictício usado exclusivamente para testar a rejeição.
    # Não ignora o arquivo inteiro nem outras ocorrências do mesmo prefixo.
    return name == 'scripts/test-supabase-client.cjs' and kind == 'supabase_secret' and match.group() == b'sb_' + b'secret_synthetic'

def git_files(*args):
    data = subprocess.check_output(['git', 'ls-files', '-z', *args], cwd=ROOT)
    return [p.decode('utf-8') for p in data.split(b'\0') if p]

def release_files():
    selected = ['index.html', 'sync_pages.py', '.gitignore', '.github/workflows/pages.yml', 'README_PUBLICACAO.md',
                '_CONTROLE_PROJETO/PUBLICACAO_FINAL.md', 'scripts/build-pages.py', 'scripts/verify-pages.cjs',
                'scripts/verify-release.py', 'scripts/qa-supabase-fixture.cjs']
    selected += [p.relative_to(ROOT).as_posix() for p in (ROOT / 'central-demandas').rglob('*')
                 if p.is_file() and p.suffix.lower() in ('.html', '.css', '.js', '.json', '.webp', '.png', '.jpg', '.jpeg')
                 and not any(s.startswith('.') for s in p.relative_to(ROOT / 'central-demandas').parts)]
    selected += [p.relative_to(ROOT).as_posix() for p in (ROOT / 'scripts').glob('test-supabase-*.cjs')]
    selected += [p.relative_to(ROOT).as_posix() for p in (ROOT / 'supabase/migrations').glob('*.sql')]
    return sorted(set(selected))

def scan(paths):
    findings = []
    for name in paths:
        file = ROOT / name
        if not file.is_file():
            continue
        if file.name.startswith('.env') and not file.name.endswith('.example'):
            findings.append({'path': name, 'kind': 'private_env_tracked_or_selected'})
            continue
        data = file.read_bytes()
        if any(value in data for value in LOCAL_VALUES):
            findings.append({'path': name, 'kind': 'matches_private_local_value'})
        if b'\0' in data[:1024]:
            continue
        for kind, pattern in PATTERNS.items():
            if kind == 'dotenv_secret' and file.name.endswith('.example'):
                continue
            for match in pattern.finditer(data):
                if not known_test_fixture(name, kind, match):
                    findings.append({'path': name, 'kind': kind, 'line': data[:match.start()].count(b'\n') + 1})
    return findings

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--prepare', action='store_true')
    args = parser.parse_args()
    selected = release_files()
    missing = [p for p in selected if not (ROOT / p).is_file()]
    tracked = git_files()
    untracked = git_files('--others', '--exclude-standard')
    findings = scan(sorted(set(tracked + untracked + selected)))
    if missing or findings:
        print(json.dumps({'result': 'failed', 'missing': missing, 'findings': findings}, ensure_ascii=False, indent=2))
        raise SystemExit(1)
    # Verifica também blobs já colocados no índice, sem tocar nele.
    entries = subprocess.check_output(['git', 'ls-files', '--stage', '-z'], cwd=ROOT).split(b'\0')
    blobs = []
    for entry in entries:
        if not entry:
            continue
        meta, name = entry.split(b'\t', 1)
        _mode, digest, stage = meta.split()
        if stage != b'0':
            raise SystemExit('Índice contém conflito não resolvido; não preparar release.')
        blobs.append((name.decode('utf-8'), digest))
    packed = subprocess.check_output(['git', 'cat-file', '--batch'], cwd=ROOT,
                                     input=b''.join(digest + b'\n' for _, digest in blobs))
    cursor = 0
    for name, _digest in blobs:
        end = packed.index(b'\n', cursor)
        size = int(packed[cursor:end].split()[-1])
        data = packed[end + 1:end + 1 + size]
        cursor = end + 1 + size + 1
        if any(value in data for value in LOCAL_VALUES):
            findings.append({'path': name, 'kind': 'matches_private_local_value', 'source': 'git_index'})
        for kind, pattern in PATTERNS.items():
            if kind == 'dotenv_secret' and name.endswith('.example'):
                continue
            if any(not known_test_fixture(name, kind, m) for m in pattern.finditer(data)):
                findings.append({'path': name, 'kind': kind, 'source': 'git_index'})
    if findings:
        print(json.dumps({'result': 'failed', 'findings': findings}, ensure_ascii=False, indent=2))
        raise SystemExit(1)
    result = {'result': 'passed', 'selectedFiles': len(selected), 'trackedFiles': len(tracked),
              'untrackedFilesAudited': len(untracked), 'secretPatterns': 0,
              'knownLocalPrivateValuesCompared': len(LOCAL_VALUES), 'knownPrivateMatches': 0,
              'knownSyntheticFixture': 'test-supabase-client: one explicit synthetic invalid key used only for rejection',
              'scope': 'working tree, selected release files and current git index; not remote history'}
    if args.prepare:
        folder = ROOT / '.release'
        folder.mkdir(exist_ok=True)
        manifest = [{'path': p, 'bytes': (ROOT / p).stat().st_size,
                     'sha256': hashlib.sha256((ROOT / p).read_bytes()).hexdigest()} for p in selected]
        (folder / 'source-manifest.json').write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding='utf-8')
        (folder / 'source-paths.txt').write_text('\n'.join(selected) + '\n', encoding='utf-8')
        (folder / 'audit.json').write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding='utf-8')
    print(json.dumps(result, ensure_ascii=False))

if __name__ == '__main__':
    main()
