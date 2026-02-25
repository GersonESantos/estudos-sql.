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

// Rota de Login
app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        await sql.connect(config);

        // Busca o usuário que tenha o email E a senha informados
        const result = await sql.query`SELECT UsuarioId, Nome FROM Usuarios 
                                       WHERE Email = ${email} AND Senha = ${senha}`;

        if (result.recordset.length > 0) {
            // Login com sucesso! Retornamos os dados do usuário (menos a senha)
            res.json({ success: true, user: result.recordset[0] });
        } else {
            // Se não encontrar ninguém, as credenciais estão erradas
            res.status(401).json({ success: false, message: "E-mail ou senha incorretos." });
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