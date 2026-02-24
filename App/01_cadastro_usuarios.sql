-- 1. Criar o Banco de Dados para seus estudos
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SistemaCloud')
BEGIN
    CREATE DATABASE SistemaCloud;
END
GO

-- Usar o banco criado
USE SistemaCloud;
GO

-- 2. Criar a tabela de Usuários
-- Como você estuda CS, note o uso de tipos de dados corretos (VARCHAR, DATETIME)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Usuarios]') AND type in (N'U'))
BEGIN
    CREATE TABLE Usuarios (
        UsuarioId INT PRIMARY KEY IDENTITY(1,1),
        Nome VARCHAR(100) NOT NULL,
        Email VARCHAR(100) UNIQUE NOT NULL,
        SenhaHash VARCHAR(255) NOT NULL, -- Em nuvem, nunca salvamos senha pura!
        DataCadastro DATETIME DEFAULT GETDATE(),
        Ativo BIT DEFAULT 1
    );
END
GO

-- 3. Inserir um usuário de teste (O seu primeiro cadastro no Xeon!)
INSERT INTO Usuarios (Nome, Email, SenhaHash)
VALUES ('Gerson Dev', 'gerson@exemplo.com', 'hash_da_senha_123');
GO

-- 4. Consultar para ver se funcionou
SELECT * FROM Usuarios;