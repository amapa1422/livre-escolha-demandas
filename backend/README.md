# Backend LivreEscolha — Demandas

Implementação integrada à versão aprovada de `central-demandas/`. Usa Express 5, PostgreSQL existente e Socket.IO, com as dependências já instaladas. Não executa migrações ao iniciar.

## Executar

No PowerShell, dentro de `Demandas/backend`:

```powershell
npm.cmd start
```

Abra **http://127.0.0.1:3000** e entre com seu e-mail e senha já cadastrados. `localhost` redireciona para a origem configurada. O `.env` existente é carregado por `src/config.js`; não precisa substituir o arquivo. O padrão é porta 3000 e acesso local. Ctrl+C encerra HTTP, Socket.IO, sessões e pool de conexões. Uma porta ocupada ou banco inacessível interrompe a inicialização com mensagem sem credenciais.

Para outra máquina acessar, configure conscientemente `HOST` e `APP_ORIGIN` no ambiente. Produção exige HTTPS, `COOKIE_SECURE=true` e origem HTTPS; `TRUST_PROXY=1` apenas atrás de proxy confiável. O endereço do navegador deve corresponder a `APP_ORIGIN`. GitHub Pages não executa este servidor.

## Autenticação e permissões

- Login usa o `senha_hash` scrypt já existente. Nenhuma senha padrão, redefinição ou alteração de usuário.
- Sessões na tabela `sessoes`, cookie HttpOnly/SameSite=Strict, duração máxima de oito horas, ID e CSRF novos após login, revogação no logout. Usuários inativos não acessam API/Socket.IO.
- Todos os usuários ativos consultam/criam demandas e consultam seus anexos e histórico.
- Funcionário assume para si e finaliza somente as demandas atribuídas ao seu ID. Administrador atribui a usuários ativos e pode finalizar qualquer demanda em andamento.
- Somente administrador exclui. Exclusão é lógica: preserva demanda, anexo e histórico. Histórico de registros excluídos é acessível ao administrador.
- Um anexo por demanda, até 1 MB; PNG/JPEG/WebP decodificado no servidor, até 40 milhões de pixels, sem animação. Arquivos privados em `backend/storage/anexos/`, fora do diretório público. Upload separado permitido ao criador ou administrador, sem substituir print existente.
- Helmet/CSP, limitação de requisições/tentativas, parâmetros SQL, verificação de origem e token CSRF em toda mutação, inclusive login/logout. Anexos e dados exigem sessão válida.

O responsável visual mantém seu nome. A autorização para finalizar usa o ID registrado no histórico de atribuição, inclusive quando duas pessoas têm o mesmo nome. Demandas anteriores sem esse histórico podem ser finalizadas pelo administrador; nenhum vínculo antigo é inferido pelo nome.

## API

| Método | Caminho | Comportamento |
| --- | --- | --- |
| GET | `/api/health` | Verifica conexão PostgreSQL, sem dados privados |
| GET | `/api/auth/session` | Usuário atual ou null, token CSRF |
| POST | `/api/auth/login` | JSON `{email,password}` |
| POST | `/api/auth/logout` | Revoga sessão e desconecta sockets |
| GET | `/api/usuarios` | Admin: usuários ativos; funcionário: sua conta |
| GET | `/api/clientes` | Catálogo aprovado para seleção e logos |
| GET/POST | `/api/demandas` | Lista/cria |
| GET | `/api/demandas/:id` | Detalhes |
| POST | `/api/demandas/:id/assumir` | JSON opcional `{assigneeId}` |
| POST | `/api/demandas/:id/finalizar` | Finaliza em andamento |
| DELETE | `/api/demandas/:id` | Exclusão lógica, admin |
| GET | `/api/demandas/:id/historico` | Ações, ator, data, antes/depois |
| POST | `/api/demandas/:id/anexo` | Multipart, campo `anexo` |
| GET | `/api/anexos/:id` | Imagem privada autenticada |

Cliente HTTP deve primeiro obter `/api/auth/session`, guardar o cookie, enviar o cabeçalho `X-CSRF-Token` recebido e `Origin` igual a `APP_ORIGIN` nos POST/DELETE. Após login, usar o novo token retornado. Não há CORS para origens externas.

Criação recebe `client`, `category`, `requester`, `priority`, `description`, `chaveCriacao` UUID e, opcionalmente, `clientId`, `image` (data URL), `imageName`. Repetir a mesma chave para o mesmo usuário retorna a criação original, sem duplicar demanda/histórico. A transação inclui anexo e histórico; falhas removem o arquivo recém-criado. O catálogo estático usa IDs textuais: a ligação com `clientes.id` UUID é determinística e só é criada quando o usuário seleciona explicitamente um cliente. Clientes preexistentes não são sobrescritos nem associados por semelhança.

Socket.IO autentica a mesma sessão e CSRF e emite `demandas:alterada` com `{id,action}` após COMMIT. O cliente recarrega os dados mantendo filtros e modais. Reconexão consulta novamente a API para recuperar eventos perdidos. Atribuição usa `SELECT ... FOR UPDATE`: duas tomadas simultâneas resultam em um sucesso e um HTTP 409. Erros usuais: 400 validação, 401 sessão, 403 permissão/CSRF, 404 inexistente, 409 conflito, 429 limite.

## Dados locais e interface

HTTP usa exclusivamente PostgreSQL. Não lê, importa, apaga ou sobrescreve a chave antiga de demandas no navegador. `file://` mantém o funcionamento local anterior, independente do servidor. Sem backend em HTTP (Live Server/Pages), a aplicação informa indisponibilidade; não grava silenciosamente em um armazenamento alternativo.

CSS aprovado preservado byte a byte. Acrescentados login na mesma identidade, botão Sair e consulta de histórico nos detalhes. A lista de responsáveis passa a representar contas ativas: funcionário vê sua própria conta; admin vê as contas disponíveis. Cards, filtros, logos, modais e zoom reutilizam a implementação existente. O HTML original monolítico permanece independente e intacto.

## Testes

```powershell
npm.cmd test
npm.cmd run test:integration
```

O teste de imagens cobre formatos válidos, conteúdo falso/truncado e limite. A integração cria um **esquema temporário isolado** no mesmo banco configurado, com contas sintéticas, e o remove ao terminar. Não recria o banco nem altera tabelas/usuários de `public`. A conta PostgreSQL de teste precisa de permissão de criação de esquema; não amplie as permissões da conta de produção só para executar testes. Requer porta 3001 livre e Chrome instalado (alternativa: variável `QA_BROWSER` com caminho do executável).

Comparação visual utiliza o snapshot local `_CONTROLE_PROJETO/backups/2026-10-30_105255_backend_1b8df768/central-demandas`. Este backup privado não vai ao GitHub. A execução visual depende dessa referência; preserve-a. Evidências: `.qa/backend/results.json`, `desktop-1366.png`, `desktop-390.png`. Testes abrem perfis descartáveis; não utilizam o perfil habitual.

Validação de 30/10/2026: inicialização real com `npm.cmd start`, conexão ao banco existente, teste de imagens e 16 grupos de integração aprovados, dois contextos independentes de Chrome, zero erros de console/JavaScript, comparação de componentes em 1920/1366/768/390/320 px e dados reais preservados. Logins funcionais usam contas sintéticas com os mesmos papéis e algoritmo: as senhas reais não foram solicitadas nem testadas. Conferir o primeiro acesso com as contas existentes é uma verificação manual restante. Não houve publicação, migração, commit ou push.

Referências técnicas consultadas: [segurança Express](https://expressjs.com/advanced/best-practice-security/), [express-session](https://expressjs.com/en/resources/middleware/session/), [Socket.IO Server API](https://socket.io/docs/v4/server-api/).
