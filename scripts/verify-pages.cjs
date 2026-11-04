/* Verifica somente o artefato público; não imprime possíveis valores secretos. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(process.argv[2] || '.pages-build');
const files = [];
function walk(dir) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
  const file = path.join(dir, entry.name); if (entry.isDirectory()) walk(file); else files.push(file);
} }
walk(root);
const findings = [];
for (const file of files) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  if (relative !== 'index.html' && relative !== '.nojekyll' && !relative.startsWith('central-demandas/')) findings.push([relative, 'arquivo fora do front-end']);
  if (relative.split('/').some(part => ['backend', 'node_modules', '_CONTROLE_PROJETO', '.git', '.env', '.qa'].includes(part))) findings.push([relative, 'arquivo privado']);
  if (!/\.(js|json|html|css)$/.test(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  if (/sb_secret_[A-Za-z0-9_-]{8,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@/.test(content)) findings.push([relative, 'possível segredo privado']);
  if (/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/.test(content)) findings.push([relative, 'JWT literal não permitido no artefato']);
  if (/["']\/api(?:\/|["'])|\/socket\.io|window\.io\s*\(/.test(content)) findings.push([relative, 'dependência do backend legado']);
}
if (findings.length) { console.error(JSON.stringify({ findings }, null, 2)); process.exitCode = 1; }
else console.log(JSON.stringify({ files: files.length, privateKeyPatterns: 0, legacyDependencies: 0, result: 'passed' }));
