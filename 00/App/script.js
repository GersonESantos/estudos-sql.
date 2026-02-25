// script.js
const API_URL = 'http://localhost:3000/usuarios';
const listaDiv = document.getElementById('lista-usuarios');
let idSendoEditado = null;

async function buscarUsuarios() {
    try {
        const resp = await fetch(API_URL);
        const dados = await resp.json();
        
        if (dados.length === 0) {
            listaDiv.innerHTML = "<p>Nenhum usuário encontrado.</p>";
            return;
        }

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
        listaDiv.innerHTML = "<p style='color:red;'>Erro ao conectar com a API no Xeon.</p>";
    }
}

async function executarAcao() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!nome || !email) {
        alert("Preencha nome e email!");
        return;
    }

    if (idSendoEditado) {
        await fetch(`${API_URL}/${idSendoEditado}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email })
        });
    } else {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });
    }

    resetarFormulario();
    buscarUsuarios();
}

function prepararEdicao(id, nome, email) {
    idSendoEditado = id;
    document.getElementById('nome').value = nome;
    document.getElementById('email').value = email;
    document.getElementById('senha-group').style.display = 'none';
    
    document.getElementById('form-title').innerText = "Editando Usuário";
    document.getElementById('btn-submit').innerText = "Salvar Alterações";
    document.getElementById('btn-cancelar').style.display = 'block';
}

async function excluirUsuario(id) {
    if (confirm("Deseja realmente excluir este usuário?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        buscarUsuarios();
    }
}

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

buscarUsuarios();