# ES Card — Site institucional (Cloudflare Pages + D1)

Migrado do stack Next.js/Vercel/Neon para arquivos estáticos + Cloudflare
Pages Functions + D1, seguindo o mesmo padrão do Escard Formulários.

## Estrutura

```
public/
  index.html        ← site público (HTML+CSS+JS único, igual antes)
  admin.html         ← painel administrativo (HTML+CSS+JS único, novo)
  logos/, *.png       ← imagens
functions/
  api/content.js      ← GET/POST conteúdo editável do site
  api/leads.js        ← POST (formulário público) / GET (admin, autenticado)
  api/admin/login.js
  api/admin/session.js
  api/admin/logout.js
  _lib/auth.js         ← login/sessão (cookie assinado, sem libs externas)
schema.sql             ← schema do banco D1 (site_content + leads)
wrangler.toml
```

## Passo a passo para colocar no ar

### 1. Criar o banco D1
No terminal (`wrangler` instalado: `npm i -g wrangler`), dentro desta pasta:

```bash
wrangler login
wrangler d1 create escard-db
```

Isso devolve um `database_id`. Copie esse id e cole no `wrangler.toml`,
no campo `database_id`.

### 2. Rodar o schema no banco
```bash
wrangler d1 execute escard-db --remote --file=schema.sql
```

### 3. Criar o projeto no Cloudflare Pages
- No painel da Cloudflare → **Workers & Pages → Create → Pages**
- Conecte ao repositório do GitHub (depois que subirmos os arquivos lá)
- **Build output directory**: `public`
- Não precisa de build command (são arquivos estáticos)

### 4. Configurar variável de ambiente
Em **Settings → Environment variables** do projeto Pages:
- `ADMIN_PASSWORD` = a senha que você quer usar para entrar no `/admin.html`

### 5. Vincular o banco D1
Em **Settings → Functions → D1 database bindings**:
- Variable name: `DB`
- D1 database: `escard-db` (a que você criou no passo 1)

### 6. Deploy
Cada push no GitHub gera um deploy automático. Ou manualmente:
```bash
wrangler pages deploy public
```

## Como editar o conteúdo do site no dia a dia

Acesse `https://SEU-DOMINIO/admin.html`, entre com a senha (`ADMIN_PASSWORD`),
edite os textos nas abas e clique em **Salvar alterações**. A mudança
aparece no site imediatamente (sem precisar de novo deploy).

## O que foi corrigido na migração

O site antigo (Vercel) tinha um bug de uma linha: a função que buscava
o conteúdo do banco lia a resposta da API no formato errado
(`content.empresa` em vez de `content.content.empresa`), então as
edições salvas no admin nunca apareciam no site. Esse bug foi corrigido
nesta versão.
