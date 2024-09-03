import { loginUser, fetchUserProfileImage } from './AuthApi.js';
import { toggleLoginModal, updateLoginGreeting, toggleAuthButtons, updateProfilePicture, clearProfilePicture, showLoginError } from './AuthUiHandlers.js';

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita o recarregamento da página

    const tenantId = 1;
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const result = await loginUser(tenantId, email, password);
        console.log('Login result:', result);
        toggleLoginModal('loginModal');
        updateLoginGreeting(result.name);
        toggleAuthButtons(false);

        if (result.imageUrl) {
            updateProfilePicture(result.imageUrl); // Atualiza a imagem do perfil com a URL
        }

    } catch (error) {
        showLoginError('Erro ao fazer login');
    }
});

document.getElementById('logoutLink').addEventListener('click', function(event) {
    event.preventDefault();
    logoutUser();
});

function logoutUser() {
    updateLoginGreeting('Olá, Visitante');
    toggleAuthButtons(true);
    clearProfilePicture();
    showLoginError('Logout successful');
}
