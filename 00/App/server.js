const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
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

app.listen(3000, () => console.log('API rodando na porta 3000'));