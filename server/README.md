# Brev.ly - Gerenciador de URLs

Um sistema de encurtamento de URLs desenvolvido com Node.js, Fastify, TypeScript e PostgreSQL.

## 📋 Regras e Funcionalidades

### ✅ Funcionalidades Implementadas

- [x] **Criar um link**
  - [x] Validação de URL mal formatada
  - [x] Validação de URL encurtada já existente
  - [x] Validação de formato de nome (apenas letras, números, hífens e underscores)
  - [x] Limite de 50 caracteres para o nome
  - [x] Listar todas as URL's cadastradas
  - [x] Deletar um link
  - [x] Obter a URL original por meio de uma URL encurtada
  - [x] Incrementar a quantidade de acessos de um link
  - [x] Exportar os links criados em um CSV
  - [x] Acesso ao CSV por meio de uma CDN (Amazon S3, Cloudflare R2, etc)
  - [ ] Nome aleatório e único para o arquivo
  - [x] Listagem performática
  - [ ] Campos: URL original, URL encurtada, contagem de acessos e data de criação


## 🏗️ Arquitetura

### Estrutura do Projeto
```
src/
├── app/
│   ├── Http/
│   │   └── Controller/
│   │       ├── StoreUrlController.ts ✅
│   │       ├── GetUrlController.ts ⚠️ (parcial)
│   │       ├── DeleteUrlController.ts ❌
│   │       └── UpdateUrlController.ts ❌
│   └── Repository/
│       └── UrlRepository.ts ✅
├── infra/
│   └── db/
│       ├── schemas/
│       │   └── urls.ts ✅
│       └── migrations/ ✅
└── routes/
    └── url/
        └── url-route.ts ✅
```

### Tecnologias Utilizadas

- **Runtime**: Node.js
- **Framework**: Fastify
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM**: Drizzle ORM
- **Validação**: Zod
- **Testes**: Vitest
- **Documentação**: Swagger/OpenAPI

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- Docker (opcional)

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd server
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Execute as migrações do banco**
```bash
npm run db:migrate
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

### Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run test` - Executa todos os testes
- `npm run test:watch` - Executa testes em modo watch
- `npm run test:coverage` - Executa testes com cobertura
- `npm run build` - Compila o projeto
- `npm start` - Inicia o servidor em produção

## 📊 Banco de Dados

### Schema da Tabela `link_shorteners`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | text (UUID) | Chave primária |
| `name` | text | Nome único da URL encurtada |
| `url` | text | URL original |
| `count_access` | integer | Contador de acessos (default: 0) |
| `created_at` | timestamp | Data de criação |

## 🔗 Endpoints Disponíveis

### POST `/url/store`
Cria uma nova URL encurtada.

**Body:**
```json
{
  "url": "https://www.example.com",
  "name": "exemplo"
}
```

**Validações:**
- URL deve ser válida e começar com `http://` ou `https://`
- Nome deve ter entre 1 e 50 caracteres
- Nome deve conter apenas letras, números, hífens e underscores
- Nome deve ser único no sistema

**Resposta de Sucesso:**
```json
{
  "message": "URL criada com sucesso"
}
```

### GET `/url`
Lista URLs (funcionalidade parcial - retorna dados mockados)

## 🧪 Testes

O projeto possui uma estrutura de testes completa:

- **Testes Unitários**: `src/test/unit/`
- **Testes de Integração**: `src/test/integration/`
- **Cobertura de Código**: Disponível via `npm run test:coverage`

## 📝 Próximos Passos

### Prioridade Alta
1. Implementar endpoint para deletar URLs
2. Implementar redirecionamento de URLs encurtadas
3. Implementar listagem de todas as URLs
4. Implementar contador de acessos

### Prioridade Média
1. Implementar exportação para CSV
2. Integração com CDN para armazenamento de arquivos
3. Implementar cache para melhor performance

### Melhorias Futuras
1. Sistema de autenticação
2. Analytics detalhados
3. API rate limiting
4. Logs estruturados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Joaquim** - Desenvolvedor do projeto Brev.ly

---

*Última atualização: Dezembro 2024* 