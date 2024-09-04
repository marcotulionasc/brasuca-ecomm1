import { loginUser } from './AuthApi.js';
import { toggleLoginModal, updateLoginGreeting, toggleAuthButtons, updateProfilePicture, clearProfilePicture, showLoginError } from './AuthUiHandlers.js';

// Função para salvar o estado do usuário no localStorage
export function saveUserSession(userData) {
    localStorage.setItem('user', JSON.stringify(userData)); // Salva o estado do usuário, incluindo o id
}

// Função para recuperar o estado do usuário do localStorage
function getUserSession() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null; // Retorna os dados do usuário ou null se não estiver logado
}

// Função para remover o estado do usuário do localStorage (usado no logout)
function clearUserSession() {
    localStorage.removeItem('user'); // Limpa o estado do usuário
}

// Função para verificar o estado de login ao carregar a página
document.addEventListener("DOMContentLoaded", function () {
    const user = getUserSession(); // Recupera o estado de login do localStorage

    if (user) {
        // Se o usuário estiver logado, atualiza a interface
        updateLoginGreeting(user.name);
        toggleAuthButtons(false); // Exibe o botão de logout, oculta login/cadastro
        if (user.imageUrl) {
            updateProfilePicture(user.imageUrl); // Atualiza a foto de perfil, se existir
        }
    } else {
        // Se o usuário não estiver logado, exibe login e cadastro
        updateLoginGreeting('Visitante');
        toggleAuthButtons(true); // Exibe os botões de login/cadastro
        clearProfilePicture(); // Limpa a foto de perfil, se existir
    }
});

// Função de login
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const tenantId = 1;
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const result = await loginUser(tenantId, email, password); // Faz login usando a API
        console.log('Login result:', result);
        
        // Atualiza a UI após o login bem-sucedido
        toggleLoginModal('loginModal');
        updateLoginGreeting(result.name);
        toggleAuthButtons(false);

        if (result.imageUrl) {
            updateProfilePicture(result.imageUrl);
        }

        // Salva o estado do usuário no localStorage (incluindo o ID)
        saveUserSession({
            id: result.id, // Salva o ID do usuário
            name: result.name,
            imageUrl: result.imageUrl
        });

    } catch (error) {
        showLoginError('Erro ao fazer login');
    }
});

// Função de logout
document.getElementById('logoutLink').addEventListener('click', function(event) {
    event.preventDefault();
    logoutUser();
});

function logoutUser() {
    updateLoginGreeting('Visitante'); // Volta a saudação para "Visitante"
    toggleAuthButtons(true); // Mostra os botões de login/cadastro
    clearProfilePicture(); // Limpa a foto de perfil
    clearUserSession(); // Limpa o estado do usuário no localStorage
    showLoginError('Logout successful'); // Mostra uma mensagem de logout (ou sucesso)
}
