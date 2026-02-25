const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();

const path = require('path');

// Esta linha faz a API servir seus arquivos HTML, CSS e JS automaticamente
// Ela aponta para a pasta /00 (um nível acima da pasta App)
app.use(express.static(path.join(__dirname, '../')));

app.use(express.json());
app.use(cors()); // Permite que o HTML fale com a API

const config = {
    user: 'sa',
    password: 'Gerson#2026', // <--- Verifique se esta senha é a mesma do Passo 2
    server: 'localhost',
    database: 'SistemaCloud',
    options: { 
        encrypt: false, 
        trustServerCertificate: true 
    }
};

// Rota para buscar usuários
app.get('/usuarios', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT * FROM Usuarios');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Rota para CADASTRAR novo usuário
app.post('/usuarios', async (req, res) => {
    try {
        const { nome, email, senha } = req.body; // Pega os dados do formulário
        await sql.connect(config);
        
        await sql.query`INSERT INTO Usuarios (Nome, Email, SenhaHash) 
                        VALUES (${nome}, ${email}, ${senha})`;
        
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Rota para EXCLUIR um usuário pelo ID
app.delete('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params; // Pega o ID que vem na URL
        await sql.connect(config);
        
        await sql.query`DELETE FROM Usuarios WHERE UsuarioId = ${id}`;
        
        res.json({ message: 'Usuário removido com sucesso!' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Rota para EDITAR um usuário (UPDATE)
app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email } = req.body;
        await sql.connect(config);
        
        await sql.query`UPDATE Usuarios 
                        SET Nome = ${nome}, Email = ${email} 
                        WHERE UsuarioId = ${id}`;
        
        res.json({ message: 'Usuário atualizado com sucesso!' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        await sql.connect(config);
        const result = await sql.query`SELECT Nome FROM Usuarios WHERE Email = ${email} AND Senha = ${senha}`;

        if (result.recordset.length > 0) {
            res.json({ success: true, nome: result.recordset[0].Nome });
        } else {
            res.status(401).json({ success: false, message: "Usuário ou senha inválidos" });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});


app.listen(3000, () => console.log('API rodando na porta 3000'));
// Substitua o final do seu arquivo por este bloco:

const iniciarServidor = async () => {
    try {
        // Tenta conectar ao banco de dados antes de abrir a porta
        await sql.connect(config);
        console.log('✅ Conectado ao SQL Server com sucesso!');

        // Só abre a porta 3000 se a conexão acima funcionar
        app.listen(3000, () => {
            console.log('🚀 API rodando na porta 3000');
            console.log('🔗 Acesse em: http://localhost:3000');
        });
    } catch (err) {
        console.error('❌ Erro ao conectar no banco de dados:', err.message);
        console.log('Dica: Verifique se o Docker está rodando (sudo docker start sql_server)');
        process.exit(1); // Fecha o processo com erro
    }
};

iniciarServidor();