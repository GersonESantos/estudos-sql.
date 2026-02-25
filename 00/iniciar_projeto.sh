#!/bin/bash

echo "🚀 Iniciando ambiente de desenvolvimento no Xeon..."

# 1. Iniciar o container do SQL Server
echo "📦 Ligando o motor SQL Server (Docker)..."
sudo docker start sql_server

# Aguarda 2 segundos para o banco respirar
sleep 2

# 2. Iniciar a API Node.js
echo "🌐 Iniciando a API..."
node server.js
