# 🚀 Resumo do Projeto: CRUD Full Stack com Automação no Xeon

Este documento resume a configuração do ambiente de desenvolvimento para a aplicação de gerenciamento de usuários, utilizando Docker, SQL Server e Node.js.

## 🏗️ 1. Infraestrutura (Banco de Dados)
O banco de dados **SQL Server 2022** foi isolado em um container Docker para garantir performance no Xeon sem poluir o sistema operacional (Linux Mint).
* **Container:** `sql_server`
* **Porta:** `1433`
* **Database:** `SistemaCloud`
* **Comando manual:** `sudo docker start sql_server`

## 🌐 2. Backend (API)
Construído em **Node.js** dentro da pasta `/App` para organizar as dependências.
* **Dependências:** `express`, `mssql`, `cors`.
* **Conexão:** Gerenciada pelo driver `mssql` com autenticação SQL Login.
* **Destaque:** O servidor só libera a porta `3000` após confirmar a conexão com o banco.

## 🎨 3. Frontend (Interface)
Separado seguindo as melhores práticas de **Clean Code**.
* `index.html`: Estrutura da Dashboard.
* `style.css`: Design Dark Mode personalizado.
* `script.js`: Lógica de consumo da API (Fetch API) para as funções de Criar, Ler, Atualizar e Deletar (CRUD).
* **Favicon:** Adicionado via SVG para identificação na aba do navegador.

## 🛠️ 4. Automação e Atalhos (O "Pulo do Gato")
Para agilizar o fluxo de trabalho, foram criados atalhos no sistema (`.bashrc`):

### Alias no Terminal
1. `projeto`: Salta direto para a pasta do repositório no GitHub.
2. `ligar`: Executa o fluxo completo de inicialização.

### Script de Inicialização (`iniciar_projeto.sh`)
O script que automatiza o "boot" do projeto:

#!/bin/bash

echo "🚀 Iniciando ambiente de desenvolvimento no Xeon..."

# 1. Iniciar o container do SQL Server
echo "📦 Ligando o motor SQL Server (Docker)..."
sudo docker start sql_server

# Aguarda 2 segundos para o banco respirar
sleep 2

# 2. Iniciar a API Node.js entrando na pasta correta
echo "🌐 Iniciando a API..."
cd App && node server.js


Pedfro@bmil.com
123456
gerson@exemplo.com
