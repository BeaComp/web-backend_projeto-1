# Projeto 1 – Programação Web Back-End

## 🧾 Descrição Geral

Este projeto consiste no desenvolvimento de uma biblioteca de acesso a SGBDs (Sistemas Gerenciadores de Banco de Dados), utilizando Node.js. A biblioteca é composta por um conjunto de classes que representam entidades de um banco de dados, relacionadas a uma temática de e-commerce, com foco em **armazenamento e busca de produtos** em uma loja virtual.

O projeto contempla a implementação de métodos para **inserção, busca, atualização e exclusão de dados**, além do **tratamento e registro de erros** por meio de logs.

## 🛒 Temática: E-commerce

A aplicação simula uma estrutura de dados semelhante a plataformas como Mercado Livre, abrangendo:

- Cadastro de produtos e categorias
- Registro de usuários e vendedores
- Gerenciamento de pedidos e carrinho de compras

## 🧩 Funcionalidades da Biblioteca

- Definição de entidades com estrutura orientada a objetos:
  - `Produto`
  - `Categoria`
  - `Usuario`
  - `Pedido`
  - `Carrinho`
- Métodos CRUD para interação com o banco de dados
- Conexão e execução de queries com segurança (uso de queries parametrizadas)
- Implementação de tratamento de erros e geração de logs com detalhamento de exceções
- Modularização do código e boas práticas de desenvolvimento

## ⚙️ Tecnologias Utilizadas

- **Node.js**
- **MySQL** ou **PostgreSQL** (dependendo da escolha do grupo)
- **npm packages**:
  - `mysql2` ou `pg`
  - `dotenv`
  - `winston` (para logging)
  - `nodemon` (em desenvolvimento)

## 🎯 Objetivo Pedagógico

Este projeto tem como objetivo capacitar os alunos a:

- Desenvolver classes orientadas a objetos com Node.js
- Implementar a persistência de dados em um banco relacional
- Aplicar técnicas de tratamento de erros e geração de logs
- Trabalhar com estrutura modular e boas práticas em projetos back-end

