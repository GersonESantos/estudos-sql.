const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const path = require('path');

const app = express();

// --- CONFIGURAÇÕES DO SERVIDOR ---
app.use(express.json());
app.use(cors()); // Permite que o Live Server e o Browser falem com a API

// Faz a API entregar os arquivos HTML, CSS e JS que estão na pasta /00
const publicPath = path.resolve(__dirname, '..');
app.use(express.static(publicPath));

const config = {
    user: 'sa',
    password: 'Gerson#2026',
    server: 'localhost',
    database: 'SistemaCloud',
    options: { 
        encrypt: false, 
        trustServerCertificate: true 
    }
};

// --- ROTAS DA API ---

app.get('/', (_, res) => {
  res.write('Hello World!')
  res.end()
})

// Rota para VALIDAR LOGIN
app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        await sql.connect(config);
        
        // Busca o usuário que tenha esse email e essa senha (usando a coluna SenhaHash que você criou)
        const result = await sql.query`SELECT Nome FROM Usuarios 
                                       WHERE Email = ${email} AND SenhaHash = ${senha}`;

        if (result.recordset.length > 0) {
            res.json({ success: true, nome: result.recordset[0].Nome });
        } else {
            res.status(401).json({ success: false, message: "E-mail ou senha incorretos!" });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Rota para buscar todos os usuários
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
        const { nome, email, senha } = req.body;
        await sql.connect(config);
        await sql.query`INSERT INTO Usuarios (Nome, Email, SenhaHash) 
                        VALUES (${nome}, ${email}, ${senha})`;
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Rota para EXCLUIR
app.delete('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await sql.connect(config);
        await sql.query`DELETE FROM Usuarios WHERE UsuarioId = ${id}`;
        res.json({ message: 'Usuário removido com sucesso!' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Rota para EDITAR
app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email } = req.body;
        await sql.connect(config);
        await sql.query`UPDATE Usuarios SET Nome = ${nome}, Email = ${email} WHERE UsuarioId = ${id}`;
        res.json({ message: 'Usuário atualizado com sucesso!' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// --- INICIALIZAÇÃO DO SERVIÇO ---

const iniciarServidor = async () => {
    try {
        await sql.connect(config);
        console.log('✅ Conectado ao SQL Server com sucesso!');
        console.log('📂 Servindo arquivos de:', publicPath);

        app.listen(3000, () => {
            console.log('🚀 API rodando na porta 3000');
            console.log('🔗 Acesse seu projeto em: http://localhost:3000/index.html');
        });
    } catch (err) {
        console.error('❌ Erro ao iniciar:', err.message);
        process.exit(1);
    }
};

iniciarServidor();