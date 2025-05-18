# Projeto 1 – Programação Web Back-End

# E-commerce (Node.js e MongoDB) — Projeto 1

**Disciplina:** Programação Web Back-End
**Professores:** Monique Emídio de Oliveira, Willian Massami Watanabe

## 📌 Descrição

Este projeto simula um e-commerce (armazenamento de produtos, pedidos, clientes), desenvolvido com Node.js puro e MongoDB, sem uso de bibliotecas externas além do driver oficial do Mongo. O objetivo é demonstrar o uso de classes para representar entidades de um banco de dados, com operações básicas (inserção, busca e deleção), validação de campos obrigatórios e tratamento de exceções com geração de logs.

## 🏗️ Estrutura do Projeto

```
/ecommerce
  ├── database/
  │   └── connection.js           # Conexão com MongoDB
  ├── models/
  │   ├── Cliente.js         # Classe Cliente
  │   ├── Produto.js         # Classe Produto
  │   └── Pedido.js          # Classe Pedido
  ├── utils/
  │   ├── createCollection.js # Funções prontas para criar e simular erros
  │   └── logger.js           # Logger de erros
  ├── logs/
  │   └── error.log          # Arquivo de log de erros
  └── app.js                 # Script de testes
```

## 📦 Entidades e Atributos

O projeto implementa 3 entidades principais:

### Cliente
- `nome` (obrigatório)
- `email` (obrigatório)
- `endereco` (obrigatório)

### Produto
- `nome` (obrigatório)
- `descricao`
- `estoque`
- `ativo`

### Pedido
- `cliente_id` (referência ao cliente)
- `produtos` (Lista de produtos, onde cada item contém): 
-- - `produto_id` (Referência ao produto)
-- - `quantidade` (Número inteiro representando a quantidade desse produto no pedido (mínimo 1))
- `dataPedido` (timestamp ISO)
- `status` (pendente, aprovado, enviado, entregue)

## ✅ Funcionalidades Implementadas

- Criação de registros no banco
- Atualiza/Edita/Exclui os dados
- Validação de campos obrigatórios
- Tratamento de exceções com try/catch
- Registro de erros em `logs/error.log`

## 💾 Requisitos

- Node.js instalado
- MongoDB local ou em nuvem (URI de conexão deve ser configurada em `database/connection.js`)

## 🚀 Como Executar

Clone o repositório:

```bash
git clone https://github.com/seu_usuario/web-backend_projeto-1.git
cd ecommerce
```

Instale a dependência do MongoDB:

```bash
npm install
```

Configure a URI de conexão no arquivo:  
`./database/connection.js`

Execute o arquivo de testes:

```bash
node index.js
```

O console mostrará os resultados das operações e, em caso de erros, eles serão registrados em `logs/error.log`.

## 🧪 Teste

O arquivo `app.js` contém um teste simulando:

- Criação de clientes, produto e pedidos
- Edição dos dados do cliente
- Busca pelo cliente
- Busca pelo produto
- Edição do produto
- Remoção do produto
- Atualização dos pedidos para aprovado/enviado
- Tentativa de criar registros com campos faltantes (para gerar erros)

## 📁 Observações Finais

- O projeto foi desenvolvido sem frameworks ou bibliotecas adicionais.
- Toda a lógica de persistência foi feita manualmente com o driver nativo do MongoDB.
- Os logs são armazenados no arquivo `logs/error.log` de forma simples e direta.
- Desenvolvido como parte do Projeto 1 da disciplina Programação Web Back-End.

**Alunos:** Beatriz Cristina de Faria RA: 2349710; Pedro Henrique da Rocha RA: 2346575
