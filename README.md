# Projeto 1 – Programação Web Back-End

# E-commerce (Node.js e MongoDB) — Projeto 1

**Disciplina:** Programação Web Back-End
**Professores:** Monique Emídio de Oliveira, Willian Massami Watanabe
**Alunos:** Beatriz Cristina de Faria RA: 2349710; Pedro Henrique da Rocha RA: 2346575


## 📌 Descrição

Este projeto simula um sistema de e-commerce com funcionalidades de gerenciamento de clientes, produtos e pedidos. Ele foi desenvolvido com Node.js puro e MongoDB, utilizando apenas o driver oficial do MongoDB, sem o uso de bibliotecas externas (exceto o necessário para a API REST).

Seu principal objetivo é demonstrar a construção de uma aplicação back-end utilizando modelagem orientada a objetos, com:

- Operações CRUD básicas

- Validação de campos obrigatórios

- Tratamento de exceções e geração de logs

- Autenticação por sessão com Express.js

- API RESTful funcional

## 🏗️ Estrutura do Projeto

```
ecommerce2/
├── app.js                 # Arquivo principal da aplicação
├── package.json           # Dependências e scripts
├── .env                   # Variáveis de ambiente
├── database/
│   └── connection.js      # Configuração do MongoDB
├── models/
│   ├── Cliente.js         # Model do Cliente (com senha hash)
│   ├── Produto.js         # Model do Produto
│   └── Pedido.js          # Model do Pedido
├── routes/
│   ├── authRoutes.js      # Rotas de autenticação
│   ├── clienteRoutes.js   # Rotas de clientes
│   ├── produtoRoutes.js   # Rotas de produtos
│   └── pedidoRoutes.js    # Rotas de pedidos
├── middlewares/
│   ├── auth.js            # Middlewares de autenticação
│   └── validation.js      # Middlewares de validação
├── utils/
│   ├── logger.js          # Sistema de logs
│   └── createCollection.js # Utilitários do banco
└── logs/
    └── error.log          # Arquivo de logs de erro
```

## 📦 Entidades e Atributos

O projeto implementa 3 entidades principais:

### Cliente
- `nome` (obrigatório)
- `email` (obrigatório)
- `senha` (obrigatório)
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

- Operações CRUD para todas as entidades

- Validação de dados obrigatórios

- Autenticação por sessão

- Hash de senhas com bcrypt

- Middleware de autenticação

- Controle de estoque

- Logs de erros (logs/error.log)

- API RESTful com Express.js

- CORS habilitado

## 💾 Requisitos

- Node.js instalado
- MongoDB local ou em nuvem (URI de conexão deve ser configurada em `database/connection.js`)

## 🚀 Como Executar

Clone o repositório:

```bash
git clone https://github.com/seu_usuario/web-backend_projeto-1.git
cd ecommerce2
```

Configure o arquivo .env com os dados abaixo:
```bash
MONGODB_URI=mongodb://localhost:27017/ecommerce
SESSION_SECRET=ecommerce-secret-key-2024-super-secure
PORT=3000
NODE_ENV=development
BCRYPT_ROUNDS=12
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

- Criação e edição de clientes, produtos e pedidos

- Buscas por ID e por filtros

- Validações de campos obrigatórios

- Simulação de erros com tratamento e log

## 📁 Observações Finais

- O projeto foi desenvolvido sem frameworks ou bibliotecas adicionais.
- Toda a lógica de persistência foi feita manualmente com o driver nativo do MongoDB.
- Os logs são armazenados no arquivo `logs/error.log` de forma simples e direta.
- Desenvolvido como parte do Projeto 1 da disciplina Programação Web Back-End.


# API RESFUL 

## Endpoints da API

### Autenticação

- `POST /api/auth/register` — Registro de cliente

- `POST /api/auth/login` — Login

- `POST /api/auth/logout` — Logout

- `GET /api/auth/me` — Dados do cliente logado

#### POST /api/auth/register
Registrar novo cliente
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456",
  "endereco": {
    "rua": "Rua das Flores",
    "numero": "123",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567"
  }
}
```
#### RESPOSTA /api/auth/register:
```json
{
  "success": true,
  "message": "Cliente registrado com sucesso",
  "cliente": {
      "nome": "João Silva",
      "email": "joao@email.com",
      "endereco": {
          "rua": "Rua das Flores",
          "numero": "123",
          "cidade": "São Paulo",
          "estado": "SP",
          "cep": "01234-567",
          "_id": "6861ce45f69261b65f1255f4"
      },
      "ativo": true,
      "_id": "6861ce45f69261b65f1255f3",
      "dataCriacao": "2025-06-29T23:37:41.477Z",
      "__v": 0
  }
}
```

#### POST /api/auth/login
Fazer login
```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

#### RESPOSTA /api/auth/login:
```json
{
    "success": true,
    "message": "Login realizado com sucesso",
    "cliente": {
        "id": "6861ce45f69261b65f1255f3",
        "nome": "João Silva",
        "email": "joao@email.com",
        "endereco": {
            "rua": "Rua das Flores",
            "numero": "123",
            "cidade": "São Paulo",
            "estado": "SP",
            "cep": "01234-567",
            "_id": "6861ce45f69261b65f1255f4"
        }
    }
}
```

#### POST /api/auth/logout
Fazer logout (requer autenticação)

#### GET /api/auth/me
Obter dados do usuário logado (requer autenticação). Se não estiver autenticado, aparecerá:
```json
{
    "success": false,
    "message": "Usuário não autenticado"
}
```

### Clientes

- `GET /api/clientes`

- `GET /api/clientes/:id`

- `PUT /api/clientes/:id`

- `DELETE /api/clientes/:id`

- `POST /api/clientes/buscar-email`

#### GET /api/clientes
Listar clientes (requer autenticação)
- Query params: `page`, `limit`, `search`

#### RESPOSTA /api/clientes:
```json
{
    "success": true,
    "clientes": [
        {
            "_id": "6861ce45f69261b65f1255f3",
            "nome": "João Silva",
            "email": "joao@email.com",
            "endereco": {
                "rua": "Rua das Flores",
                "numero": "123",
                "cidade": "São Paulo",
                "estado": "SP",
                "cep": "01234-567",
                "_id": "6861ce45f69261b65f1255f4"
            },
            "ativo": true,
            "dataCriacao": "2025-06-29T23:37:41.477Z",
            "__v": 0
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 1,
        "pages": 1
    }
}
```

#### GET /api/clientes/:id
Buscar cliente por ID (requer autenticação e ownership)

#### PUT /api/clientes/:id
Atualizar dados do cliente (requer autenticação e ownership)
```json
{
  "nome": "João Silva Santos",
  "endereco": {
    "rua": "Rua Nova",
    "numero": "456",
    "cidade": "Rio de Janeiro",
    "estado": "RJ",
    "cep": "20000-000"
  }
}
```

#### DELETE /api/clientes/:id
Desativar conta (requer autenticação e ownership)

#### POST /api/clientes/buscar-email
Buscar cliente por email (requer autenticação)
```json
{
  "email": "joao@email.com"
}
```

#### RESPOSTA /api/clientes/buscar-email:
```json
{
    "success": true,
    "cliente": {
        "_id": "6861ce45f69261b65f1255f3",
        "nome": "João Silva Santos",
        "email": "joao@email.com",
        "endereco": {
            "rua": "Rua Nova",
            "numero": "456",
            "cidade": "Rio de Janeiro",
            "estado": "RJ",
            "cep": "20000-000",
            "_id": "6861d05df69261b65f1255fb"
        },
        "ativo": true,
        "dataCriacao": "2025-06-29T23:37:41.477Z",
        "__v": 0
    }
} 
```

### Produtos

- `GET /api/produtos`

- `GET /api/produtos/:id`

- `POST /api/produtos`

 - `PUT /api/produtos/:id`

- `DELETE /api/produtos/:id`

- `POST /api/produtos/buscar-nome`

- `PATCH /api/produtos/:id/estoque`

#### GET /api/produtos
Listar produtos
- Query params: `page`, `limit`, `search`, `ativo`

#### GET /api/produtos/:id
Buscar produto por ID

#### POST /api/produtos
Criar novo produto (requer autenticação)
```json
{
  "nome": "Notebook Dell",
  "descricao": "Notebook Dell Inspiron 15",
  "estoque": 10
}
```

#### PUT /api/produtos/:id
Atualizar produto (requer autenticação)
```json
{
  "nome": "Notebook Dell Atualizado",
  "descricao": "Notebook Dell Inspiron 15 - Nova versão",
  "estoque": 15
}
```

#### DELETE /api/produtos/:id
Desativar produto (requer autenticação)

#### POST /api/produtos/buscar-nome
Buscar produtos por nome
```json
{
  "nome": "Notebook"
}
```

#### PATCH /api/produtos/:id/estoque
Atualizar apenas o estoque (requer autenticação)
```json
{
  "estoque": 20
}
```

### Pedidos

- `GET /api/pedidos`

- `GET /api/pedidos/:id`

- `POST /api/pedidos`

- `PUT /api/pedidos/:id/status`

- `DELETE /api/pedidos/:id`

- `GET /api/pedidos/admin/todos`

#### GET /api/pedidos
Listar pedidos do cliente logado (requer autenticação)
- Query params: `page`, `limit`, `status`

#### GET /api/pedidos/:id
Buscar pedido específico (requer autenticação e ownership)

#### POST /api/pedidos
Criar novo pedido (requer autenticação)
```json
{
  "produtos": [
    {
      "produtoId": "60d5ecb74b24a1234567890a",
      "quantidade": 2
    },
    {
      "produtoId": "60d5ecb74b24a1234567890b",
      "quantidade": 1
    }
  ]
}
```

#### RESPOSTA /api/pedidos:
```json
{
    "success": true,
    "message": "Pedido criado com sucesso",
    "pedido": {
        "_id": "6861d33a9a6cd5b53ab1aecd",
        "clienteId": "6861ce45f69261b65f1255f3",
        "produtos": [
            {
                "produtoId": {
                    "_id": "6861d119f69261b65f12560b",
                    "nome": "Notebook ACER",
                    "descricao": "Notebook Dell Inspiron 15"
                },
                "quantidade": 2,
                "_id": "6861d33a9a6cd5b53ab1aece"
            },
            {
                "produtoId": {
                    "_id": "6861d0d1f69261b65f125601",
                    "nome": "Notebook Dell",
                    "descricao": "Notebook Dell Inspiron 15"
                },
                "quantidade": 1,
                "_id": "6861d33a9a6cd5b53ab1aecf"
            }
        ],
        "status": "pendente",
        "dataPedido": "2025-06-29T23:58:50.691Z",
        "__v": 0
    }
} 
```


#### PUT /api/pedidos/:id/status
Atualizar status do pedido (requer autenticação)
```json
{
  "status": "aprovado"
}
```
Status válidos: `pendente`, `aprovado`, `enviado`, `entregue`

#### DELETE /api/pedidos/:id
Cancelar pedido (apenas se status for 'pendente', requer autenticação e ownership)

#### GET /api/pedidos/admin/todos
Listar todos os pedidos (admin)
- Query params: `page`, `limit`, `status`, `clienteId`
- 
#### RESPOSTA /api/pedidos/admin/todos:
```json
{
    "success": true,
    "pedidos": [
        {
            "_id": "6861d33a9a6cd5b53ab1aecd",
            "clienteId": {
                "_id": "6861ce45f69261b65f1255f3",
                "nome": "João Silva Santos",
                "email": "joao@email.com"
            },
            "produtos": [
                {
                    "produtoId": {
                        "_id": "6861d119f69261b65f12560b",
                        "nome": "Notebook ACER",
                        "descricao": "Notebook Dell Inspiron 15"
                    },
                    "quantidade": 2,
                    "_id": "6861d33a9a6cd5b53ab1aece"
                },
                {
                    "produtoId": {
                        "_id": "6861d0d1f69261b65f125601",
                        "nome": "Notebook Dell",
                        "descricao": "Notebook Dell Inspiron 15"
                    },
                    "quantidade": 1,
                    "_id": "6861d33a9a6cd5b53ab1aecf"
                }
            ],
            "status": "pendente",
            "dataPedido": "2025-06-29T23:58:50.691Z",
            "__v": 0
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 1,
        "pages": 1
    }
} 
```

## Segurança

- Senhas são criptografadas com bcrypt (12 rounds)
- Sessões seguras com express-session
- Validação de dados de entrada
- Middleware de autenticação
- CORS configurado
- Logs de erro

## Tecnologias Utilizadas

- Node.js
- Express.js
- MongoDB com Mongoose
- bcryptjs para hash de senhas
- express-session para sessões
- cors para CORS
- dotenv para variáveis de ambiente

## Status Codes

- 200: Sucesso
- 201: Criado com sucesso
- 400: Dados inválidos
- 401: Não autenticado
- 403: Acesso negado
- 404: Não encontrado
- 500: Erro interno do servidor

