# Publicação no GitHub Pages — Central de Demandas

**Atualização BACKEND-003, 30/10/2026:** o sistema integrado agora é iniciado por `npm.cmd start` dentro de `backend/`, em `http://127.0.0.1:3000`. Login, API, PostgreSQL e Socket.IO dependem desse servidor; GitHub Pages/Live Server não os executam. Não publique a aplicação operacional como se fosse apenas um site estático. As instruções históricas de geração abaixo continuam válidas para sincronizar HTML/catálogo, mas não substituem a execução do backend. Abertura `file://` mantém o modo local anterior, com dados independentes. Veja [backend/README.md](backend/README.md).

**Fonte de verdade do front-end:** `central-demandas/index.html`, `central-demandas/css/style.css` e `central-demandas/js/app.js`.

**Entrada para GitHub Pages:** `index.html` na raiz. É gerada pelo `sync_pages.py`, com caminhos de CSS/JS/catálogo ajustados para `central-demandas/...`. **Não edite os dois HTMLs manualmente**: altere a versão de `central-demandas/` e execute o script. A geração é sempre da fonte principal para a raiz, nunca no sentido inverso.

**Catálogo canônico:** `central-demandas/assets/clientes/clientes.json`. O mesmo script gera `catalogo.js` a partir do JSON, permitindo uso local por `file://` sem fetch/CORS. A aplicação resolve logos em relação ao próprio `app.js`, incluindo o prefixo do repositório. Ao atualizar empresas, edite o JSON e gere novamente; não mantenha duas listas manualmente.

## Após cada mudança na interface

1. Altere arquivos em `central-demandas/`.
2. Rode `python sync_pages.py` na raiz `Demandas/`.
3. Rode `python sync_pages.py --check`.
4. Teste o `index.html` da raiz por um servidor local (por exemplo, Live Server), verificando Estilos, Console e Rede.
5. Revise os arquivos selecionados, faça commit e publique conforme o fluxo do repositório. Inclua os dois arquivos gerados e as logos referenciadas; exclua segredos, originais privados e temporários.

`--check` falha se as saídas estiverem desatualizadas, faltar CSS/JS/logo, houver IDs/nomes duplicados ou caminhos locais inválidos. Funciona sem bibliotecas externas; Python 3 é necessário apenas para geração/verificação, não para abrir o site. Nesta máquina, a validação utilizou um Python temporário isolado, pois o comando `python` do sistema aponta para o instalador da Microsoft Store.

## Resultado local de 30/10/2026

Raiz, `central-demandas/index.html`, `/livre-escolha-demandas/index.html` e `/livre-escolha-demandas/central-demandas/index.html` foram exercitados em servidor local com CSS, JS, catálogo e imagens. Abertura direta da raiz por arquivo também passou. A nova versão ainda não foi enviada ao remoto nem implantada; esse teste local não comprova o deploy hospedado. Consulte `_CONTROLE_PROJETO/RELATORIO_LOGOS_PAGES.md`.

No GitHub: **Settings → Pages → Deploy from a branch → main → /(root)**.

Site: `https://amapa1422.github.io/livre-escolha-demandas/`.

### Importante

- GitHub Pages **não executa Node.js nem PostgreSQL**. O backend foi implementado e testado localmente; hospedagem externa não foi realizada.
- HTTP operacional usa PostgreSQL. Abertura direta por arquivo usa `localStorage` independente; não utilize dados reais de clientes no site público.
- Nunca publique `.env`, senhas ou dados de clientes. Não envie arquivos de `backend/storage`, backups privados nem `.git` em ZIPs compartilhados.
- O `demandas_otimizado (1).html` é uma referência original independente, não a versão para publicar.
