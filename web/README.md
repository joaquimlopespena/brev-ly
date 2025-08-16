# 🔗 URL Shortener - Frontend

Uma aplicação web moderna para encurtamento de URLs, desenvolvida com React, TypeScript e Vite. Esta aplicação permite criar, gerenciar e acompanhar estatísticas de links encurtados de forma intuitiva e responsiva.

## ✨ Funcionalidades

### 🎯 Funcionalidades Principais
- [x] **Criação de Links**: Crie links encurtados personalizados ou automáticos
  - [x] Não deve ser possível criar um link com encurtamento mal formatado
  - [x] Não deve ser possível criar um link com encurtamento já existente
- [x] **Deletar Links**: Delete links conforme necessário
- [x] **Redirecionamento**: Acesso direto às URLs originais via encurtamento
- [x] **Listagem Completa**: Visualize todas as URLs cadastradas
- [x] **Estatísticas**: Incremente a quantidade de acessos de um link
- [x] **Relatórios**: Baixe um CSV com o relatório dos links criados

### 🎨 Experiência do Usuário
- [x] **Interface Responsiva**: Otimizada para desktop e dispositivos móveis
- [x] **Estados Visuais**: Empty states, loaders e feedback visual
- [x] **Validação em Tempo Real**: Feedback imediato sobre erros e sucessos
- [x] **Design Moderno**: Interface limpa e intuitiva seguindo o layout do Figma

## 🚀 Tecnologias Utilizadas

- [x] **Frontend**: React 19 + TypeScript
- [x] **Build Tool**: Vite
- [x] **Styling**: Tailwind CSS
- [x] **Linting**: ESLint
- [x] **Package Manager**: npm

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório**
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd web
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   # Crie um arquivo .env na raiz do projeto
   VITE_BACKEND_URL=http://localhost:3000
   ```

## 🚀 Como Executar

### Desenvolvimento
```bash
npm run dev
```
A aplicação estará disponível em `http://localhost:5173`

### Build de Produção
```bash
npm run build
```

### Preview da Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 📱 Funcionalidades da Aplicação

### ✅ Criação de Links
- [x] Validação de formato de URL
- [x] Verificação de duplicatas
- [x] Encurtamento personalizado ou automático

### ✅ Gerenciamento
- [x] Listagem de todos os links
- [x] Exclusão de links
- [x] Visualização de estatísticas

### ✅ Acesso aos Links
- [x] Redirecionamento automático
- [x] Contagem de acessos
- [x] Histórico de uso

### ✅ Relatórios
- [x] Exportação em CSV
- [x] Dados completos dos links
- [x] Estatísticas de performance

## 🎨 Design e UX

- [x] **Responsividade**: Layout adaptável para todos os dispositivos
- [x] **Estados Visuais**: Feedback claro para todas as ações
- [x] **Acessibilidade**: Navegação por teclado e leitores de tela
- [x] **Performance**: Carregamento rápido e transições suaves

## 📁 Estrutura do Projeto

```
web/
├── 📁 src/                    # Código fonte da aplicação
│   ├── 📁 components/         # Componentes reutilizáveis
│   ├── 📁 hooks/              # Custom hooks React
│   ├── 📁 services/           # Serviços de API e lógica de negócio
│   ├── 📁 types/              # Definições de tipos TypeScript
│   ├── 📁 utils/              # Funções utilitárias e helpers
│   ├── 📁 pages/              # Páginas/rotas da aplicação
│   ├── 📁 contexts/           # Contextos React para estado global
│   ├── 📁 assets/             # Recursos estáticos
│   │   └── react.svg          # Logo React
│   ├── App.tsx                # Componente principal da aplicação
│   ├── App.css                # Estilos específicos do App
│   ├── index.css              # Estilos globais e base
│   ├── main.tsx               # Ponto de entrada da aplicação
│   └── vite-env.d.ts          # Tipos do Vite
├── 📁 public/                  # Arquivos públicos estáticos
│   └── vite.svg               # Logo Vite
├── 📁 node_modules/            # Dependências instaladas
├── 📄 index.html               # HTML principal da aplicação
├── 📄 package.json             # Configurações e dependências do projeto
├── 📄 package-lock.json        # Lock das versões das dependências
├── 📄 tailwind.config.js       # Configuração do Tailwind CSS
├── 📄 vite.config.ts           # Configuração do Vite
├── 📄 tsconfig.json            # Configuração base do TypeScript
├── 📄 tsconfig.app.json        # Configuração TypeScript para a aplicação
├── 📄 tsconfig.node.json       # Configuração TypeScript para Node
├── 📄 eslint.config.js         # Configuração do ESLint
├── 📄 .gitignore               # Arquivos ignorados pelo Git
└── 📄 README.md                # Este arquivo de documentação
```

### 📂 **Descrição dos Diretórios:**

- **`components/`** - Componentes React reutilizáveis (botões, inputs, modais, etc.)
- **`hooks/`** - Custom hooks para lógica reutilizável (useLinks, useForm, etc.)
- **`services/`** - Serviços de API, validações e lógica de negócio
- **`types/`** - Interfaces e tipos TypeScript para tipagem forte
- **`utils/`** - Funções utilitárias, formatação, validações e helpers
- **`pages/`** - Componentes de página e roteamento da aplicação
- **`contexts/`** - Contextos React para gerenciamento de estado global
- **`assets/`** - Imagens, ícones e recursos estáticos

## 🔧 Configuração

### Tailwind CSS
O projeto utiliza Tailwind CSS v4 para estilização, configurado para otimização de produção.

### TypeScript
Configuração estrita de TypeScript para melhor qualidade de código e detecção de erros.

### ESLint
Regras de linting configuradas para React e TypeScript, garantindo padrões de código consistentes.

## 📱 Responsividade

A aplicação foi desenvolvida com foco total na responsividade:
- [ ] **Mobile First**: Design otimizado para dispositivos móveis
- [ ] **Breakpoints**: Adaptação para tablets e desktops
- [ ] **Touch Friendly**: Interface otimizada para toque
- [ ] **Performance**: Carregamento otimizado para conexões lentas

## 🚀 Deploy

### Build para Produção
```bash
npm run build
```

### Servidor Estático
Após o build, os arquivos estarão em `dist/` e podem ser servidos por qualquer servidor web estático.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

## 👨‍💻 Autor

**Seu Nome**
- GitHub: [@seuusername](https://github.com/seuusername)

## 🙏 Agradecimentos

- Equipe de desenvolvimento
- Comunidade React
- Figma para o design
- Vite pela ferramenta de build

---

⭐ Se este projeto te ajudou, considere dar uma estrela!
