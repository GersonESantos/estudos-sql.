/**
 * Xeon Cloud Lab - script.js
 * Lógica do Frontend para CRUD e Controle de Acesso
 */

// --- 1. PROTEÇÃO DE ACESSO ---
// Verifica imediatamente se o usuário passou pela tela de login
const usuarioLogado = localStorage.getItem('usuarioLogado');

if (!usuarioLogado) {
    // Se não houver registro no localStorage, manda de volta para o login
    window.location.href = 'login.html';
} else {
    console.log("🚀 Sessão ativa: " + usuarioLogado);
}

// --- 2. CONFIGURAÇÕES GERAIS ---
const API_URL = 'http://localhost:3000/usuarios';
const listaDiv = document.getElementById('lista-usuarios');
let idSendoEditado = null;

// --- 3. FUNÇÃO: BUSCAR USUÁRIOS (READ) ---
async function buscarUsuarios() {
    try {
        const resp = await fetch(API_URL);
        const dados = await resp.json();
        
        if (dados.length === 0) {
            listaDiv.innerHTML = "<p>Nenhum usuário cadastrado no banco.</p>";
            return;
        }

        // Renderiza os cards de usuários
        listaDiv.innerHTML = dados.map(u => `
            <div class="user-item">
                <div>
                    <strong>${u.Nome}</strong><br>
                    <small style="color: #aaa;">${u.Email}</small>
                </div>
                <div class="actions">
                    <button class="btn-edit" onclick="prepararEdicao(${u.UsuarioId}, '${u.Nome}', '${u.Email}')">Editar</button>
                    <button class="btn-delete" onclick="excluirUsuario(${u.UsuarioId})">Excluir</button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        listaDiv.innerHTML = "<p style='color:red;'>Erro ao conectar com a API no Xeon. Verifique o Docker!</p>";
    }
}

// --- 4. FUNÇÃO: CADASTRAR OU SALVAR (CREATE & UPDATE) ---
async function executarAcao() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!nome || !email) {
        alert("Obrigatório preencher Nome e E-mail.");
        return;
    }

    try {
        if (idSendoEditado) {
            // Lógica de UPDATE (PUT)
            await fetch(`${API_URL}/${idSendoEditado}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email })
            });
            alert("Usuário atualizado com sucesso!");
        } else {
            // Lógica de CREATE (POST)
            if (!senha) { alert("Senha é obrigatória para novos cadastros!"); return; }
            
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha })
            });
            alert("Usuário cadastrado com sucesso!");
        }

        resetarFormulario();
        buscarUsuarios();
    } catch (err) {
        alert("Erro ao salvar dados: " + err.message);
    }
}

// --- 5. FUNÇÃO: PREPARAR INTERFACE PARA EDIÇÃO ---
function prepararEdicao(id, nome, email) {
    idSendoEditado = id;
    document.getElementById('nome').value = nome;
    document.getElementById('email').value = email;
    
    // Esconde o campo de senha na edição para manter a segurança básica
    document.getElementById('senha-group').style.display = 'none';
    
    document.getElementById('form-title').innerText = "Editando Usuário";
    document.getElementById('btn-submit').innerText = "Salvar Alterações";
    document.getElementById('btn-cancelar').style.display = 'block';
    
    // Rola a página para o topo para facilitar a visualização do formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- 6. FUNÇÃO: EXCLUIR USUÁRIO (DELETE) ---
async function excluirUsuario(id) {
    if (confirm("Deseja realmente apagar este registro do SQL Server?")) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            buscarUsuarios();
        } catch (err) {
            alert("Erro ao excluir: " + err.message);
        }
    }
}

// --- 7. FUNÇÃO: RESETAR FORMULÁRIO ---
function resetarFormulario() {
    idSendoEditado = null;
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    document.getElementById('senha').value = '';
    document.getElementById('senha-group').style.display = 'block';
    
    document.getElementById('form-title').innerText = "Cadastrar Novo Usuário";
    document.getElementById('btn-submit').innerText = "Cadastrar Usuário";
    document.getElementById('btn-cancelar').style.display = 'none';
}

// --- 8. FUNÇÃO: LOGOUT (SAIR) ---
function sair() {
    if (confirm("Deseja encerrar sua sessão?")) {
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'login.html';
    }
}

// --- INICIALIZAÇÃO ---
// Carrega a lista de usuários assim que a página abre
buscarUsuarios();