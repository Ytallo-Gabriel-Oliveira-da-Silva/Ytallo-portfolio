# 🔐 Configuração de Variáveis de Ambiente - Portfólio Ytallo Gabriel

Este documento contém todas as variáveis de ambiente necessárias para fazer o backend funcionar 100% no seu servidor.

## ⚠️ IMPORTANTE

**NUNCA** commit o arquivo `.env` com dados reais no GitHub. Adicione `.env` ao `.gitignore`.

---

## 📋 Variáveis de Ambiente Necessárias

### 1️⃣ Banco de Dados MySQL/TiDB

```
DATABASE_URL=mysql://odw1YsyXcxY9dvg.root:LrceS08HCN413APbz3Wu@gateway02.us-east-1.prod.aws.tidbcloud.com:4000/Ua6XZrs2NKxhiZbp6DEDwc?ssl={"rejectUnauthorized":true}
```

**O que é:** String de conexão com o banco de dados MySQL/TiDB onde as mensagens de contato são armazenadas.

---

### 2️⃣ Autenticação JWT

```
JWT_SECRET=5tdmqLMnXHSjhXcSWq8qVk
```

**O que é:** Chave secreta para assinar tokens JWT de sessão.

---

### 3️⃣ OAuth - Manus

```
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im
```

**O que é:** URLs para autenticação OAuth (login no sistema).

---

### 4️⃣ API Forge - Backend

```
BUILT_IN_FORGE_API_KEY=hEhDm9anpVwTLDxtPCtGFS
BUILT_IN_FORGE_API_URL=https://forge.manus.ai
```

**O que é:** Credenciais para acessar serviços backend (notificações, emails, etc).

---

### 5️⃣ API Forge - Frontend

```
VITE_FRONTEND_FORGE_API_KEY=UXzQVQuaxG2FyWaHXBKJh7
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.ai
```

**O que é:** Credenciais para o frontend acessar serviços (analytics, etc).

---

### 6️⃣ Aplicação - Informações Gerais

```
VITE_APP_ID=Ua6XZrs2NKxhiZbp6DEDwc
VITE_APP_TITLE=Portfólio Ytallo Gabriel
VITE_APP_LOGO=https://files.manuscdn.com/user_upload_by_module/web_dev_logo/310519663061203385/vyWSEOWJqUnjbCYj.png
```

**O que é:** Identificadores e branding da aplicação.

---

### 7️⃣ Analytics

```
VITE_ANALYTICS_ENDPOINT=https://manus-analytics.com
VITE_ANALYTICS_WEBSITE_ID=71098ece-9aed-4521-a5b6-c7b3ce872b81
```

**O que é:** Configuração para rastreamento de visitantes.

---

### 8️⃣ Proprietário

```
OWNER_NAME=Max Cine
OWNER_OPEN_ID=Kk7npwNJUDCa5mrmb4LA8h
```

**O que é:** Informações do proprietário para receber notificações de mensagens.

---

### 9️⃣ Email de Contato (ADICIONAL)

```
CONTACT_EMAIL=ytallok644549@gmail.com
```

**O que é:** Email onde as mensagens do formulário serão enviadas (opcional, você já tem no código).

---

## 🚀 Como Configurar no Seu Servidor

### Opção 1: Arquivo `.env` Local

1. Na raiz do projeto, crie um arquivo chamado `.env`
2. Copie e cole todas as variáveis acima
3. Salve o arquivo

### Opção 2: Variáveis de Ambiente do Sistema

Se estiver usando Docker, Heroku, Vercel, ou outro serviço:

1. Vá para as configurações de ambiente da plataforma
2. Adicione cada variável como uma chave-valor
3. Redeploy a aplicação

### Opção 3: Arquivo `.env.production`

Para produção:

```bash
# Crie um arquivo .env.production com as mesmas variáveis
cp .env.example .env.production
# Edite com suas chaves de produção
```

---

## ✅ Verificar se Tudo Está Funcionando

Depois de configurar as variáveis, execute:

```bash
# Instalar dependências
pnpm install

# Sincronizar banco de dados
pnpm db:push

# Iniciar servidor de desenvolvimento
pnpm dev

# Ou fazer build para produção
pnpm build
```

---

## 🔗 Sistema de Emails - Como Funciona

1. **Visitante preenche o formulário** → Nome, Email, Mensagem
2. **Validação** → Verifica se os dados estão corretos
3. **Armazenamento** → Salva no banco de dados (`contactMessages`)
4. **Notificação** → Você recebe uma notificação no painel Manus
5. **Confirmação** → Visitante vê mensagem de sucesso

---

## 🛡️ Segurança

- ✅ Nunca compartilhe as chaves JWT_SECRET e API_KEY
- ✅ Adicione `.env` ao `.gitignore`
- ✅ Use HTTPS em produção
- ✅ Mantenha as chaves seguras no servidor

---

## 📞 Suporte

Se tiver problemas:

1. Verifique se todas as variáveis estão configuradas
2. Confirme que o banco de dados está acessível
3. Verifique os logs do servidor: `pnpm dev`

---

**Pronto!** Seu backend deve estar 100% funcional agora! 🎉
