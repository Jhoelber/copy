# CopyForge MVP

Aplicação React para gerar variações de copy com o Gemini. O navegador chama apenas a rota interna `POST /api/generate-copy`; a chave da API permanece no ambiente server-side.

## Requisitos

- Node.js 20 ou superior
- Uma chave válida da Gemini API

## Desenvolvimento local

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie `.env.example` para `.env` e preencha a variável:

   ```env
   GEMINI_API_KEY=sua_chave_aqui
   ```

   Não use o prefixo `VITE_`. Arquivos `.env` estão ignorados pelo Git.

3. Inicie a aplicação:

   ```bash
   npm run dev
   ```

O servidor de desenvolvimento do Vite expõe localmente a mesma lógica usada pela Function em `/api/generate-copy`. Sem uma chave configurada, a interface abre normalmente e mostra uma mensagem segura somente ao tentar gerar.

## Validação

```bash
npm run typecheck
npm run lint
npm run build
```

## Deploy na Vercel

1. Importe este repositório em um novo projeto na Vercel.
2. Acesse **Project → Settings → Environment Variables**.
3. Cadastre `GEMINI_API_KEY` nos ambientes desejados (Production e, se necessário, Preview).
4. Faça um novo deploy após salvar a variável.

A Vercel detecta o Vite e publica `api/generate-copy.ts` como Function Node.js. O modelo utilizado é `gemini-3.6-flash`.

## Limites e privacidade

- No máximo 10 copies por requisição.
- Payload e tamanho de cada campo são validados novamente no servidor.
- O histórico guarda as últimas 10 gerações exclusivamente no `localStorage` do navegador.
- Não há login, banco de dados, cobrança ou mocks no fluxo principal.
- Revise o conteúdo gerado antes de publicar; a IA recebe instruções explícitas para não fabricar provas, números ou promessas.
"# copy" 
