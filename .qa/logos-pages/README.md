# QA — LOGOS-PAGES-002

Execute exclusivamente em perfil de navegador descartável: o roteiro escreve registros sintéticos no localStorage da origem de teste.

1. Inicie `serve.py` com Python 3. O servidor atende somente `127.0.0.1:8765`, frontend e esta pasta, inclusive sob `/livre-escolha-demandas/`; não serve backend nem backups.
2. Inicie Chrome headless com perfil temporário próprio e porta CDP 9228 em `http://127.0.0.1:8765/.qa/logos-pages/runner.html`.
3. Execute `powershell -NoProfile -ExecutionPolicy Bypass -File .qa/logos-pages/run-browser.ps1` a partir da raiz do projeto.
4. Na mesma página, execute o runner com `-TestFile extra-tests.js -OutputFile extra-results.json`.
5. `validate.py` verifica assets/backups/extração/publicação; requer Pillow no ambiente de QA. O aplicativo não depende de Python/Pillow.

O runner mantém uma sessão CDP com Page/Runtime/Log habilitados e injeta a captura de erros antes do carregamento dos iframes. Os resultados finais contêm `consoleEvents`. A captura precisa estar ativa; não interpretar uma lista ausente como ausência de erros.

Resultados de 30/10/2026: 57 testes principais + 5 complementares, zero falhas e eventos de erro. `file-results.json` registra o teste adicional via arquivo local. `integrity-results.json` registra 514 verificações aprovadas. Capturas contêm somente dados sintéticos.

Relatório e limites: [RELATORIO_LOGOS_PAGES.md](../../_CONTROLE_PROJETO/RELATORIO_LOGOS_PAGES.md).
