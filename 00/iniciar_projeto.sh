#!/bin/bash

echo "🚀 Iniciando ambiente de desenvolvimento no Xeon..."

# 1. Iniciar o container do SQL Server
echo "📦 Ligando o motor SQL Server (Docker)..."
sudo docker start sql_server


# 1. Iniciar o container
sudo docker start sql_server

echo "⏳ Aguardando o SQL Server ficar disponível..."
# Tenta conectar na porta 1433 a cada 1 segundo
while ! nc -z localhost 1433; do   
  sleep 1
done

echo "✅ Banco de dados online!"

# 2. Iniciar a API
cd App && node server.js

# 2. Iniciar a API Node.js
echo "🌐 Iniciando a API..."
cd App && node server.js
