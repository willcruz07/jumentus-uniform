# Jumentus Uniform - Sistema de Cadastro de Uniformes

Sistema web para cadastro de uniformes do Jumentus Sport Club, desenvolvido com React, TypeScript, Tailwind CSS e shadcn/ui.

## 🚀 Funcionalidades

- **Formulário de Cadastro**: Campos para tamanho, nome do atleta, tipo de uniforme (Jogador/Goleiro) e número
- **Validação**: Validação de formulário com Zod e React Hook Form
- **Integração Firebase**: Armazenamento de dados com autenticação anônima
- **Interface Responsiva**: Design moderno com Tailwind CSS e shadcn/ui
- **Efeitos Visuais**: Background dinâmico que muda conforme a seleção do tipo de uniforme

## 🛠️ Tecnologias

- **Frontend**: React 19 + TypeScript
- **Estilização**: Tailwind CSS
- **Componentes**: shadcn/ui
- **Validação**: Zod + React Hook Form
- **Backend**: Firebase (Firestore + Auth)
- **Build Tool**: Vite

## 📦 Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd jumentus-uniform
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o Firebase**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Ative o Firestore Database
   - Ative a Authentication (método anônimo)
   - Copie as credenciais para `src/config/firebase.ts`

4. **Execute o projeto**
   ```bash
   npm run dev
   ```

## ⚙️ Configuração do Firebase

Edite o arquivo `src/config/firebase.ts` com suas credenciais:

```typescript
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "seu-messaging-sender-id",
  appId: "seu-app-id"
};
```

## 🎨 Personalização

### Cores
- **Primária**: #D4B301 (dourado)
- **Secundária**: #2C2E30 (cinza escuro)
- **Input Background**: #D7D6D1 (cinza claro)

### Fontes
- **Primária**: Roboto
- **Secundária**: Exo 2

## 📱 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/           # Componentes shadcn/ui
│   └── UniformForm.tsx
├── config/
│   └── firebase.ts   # Configuração Firebase
├── lib/
│   └── utils.ts      # Utilitários
├── schemas/
│   └── uniformSchema.ts # Schema Zod
└── services/
    └── uniformService.ts # Serviços Firebase
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## 📊 Estrutura dos Dados

Os dados são salvos no Firestore com a seguinte estrutura:

```typescript
interface Uniforme {
  tamanho: 'P' | 'M' | 'G' | 'GG';
  nome: string;
  tipo: 'Jogador' | 'Goleiro';
  numero: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**ID do Documento**: Gerado automaticamente baseado no nome do atleta (lowercase + underscores)

## 🎯 Funcionalidades Principais

1. **Cadastro de Uniformes**: Formulário completo com validação
2. **Atualização Automática**: Se um nome já existe, atualiza os dados
3. **Autenticação Anônima**: Login automático para salvar dados
4. **Validação em Tempo Real**: Feedback imediato de erros
5. **Interface Responsiva**: Funciona em desktop e mobile
6. **Efeitos Visuais**: Background dinâmico baseado na seleção

## 🚀 Deploy

Para fazer deploy:

1. **Build de produção**
   ```bash
   npm run build
   ```

2. **Deploy no Firebase Hosting** (opcional)
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```

## 📝 Licença

Este projeto é desenvolvido para o Jumentus Sport Club.

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido com ❤️ para o Jumentus Sport Club**
