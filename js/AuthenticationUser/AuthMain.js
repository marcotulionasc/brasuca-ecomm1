import { loginUser } from './AuthApi.js';
import { toggleLoginModal, updateLoginGreeting, toggleAuthButtons, updateProfilePicture, clearProfilePicture, showLoginError } from './AuthUiHandlers.js';

export function saveUserSession(userData) {
    const currentTime = new Date().getTime();
    const dataToStore = {
        user: userData,
        timestamp: currentTime
    };
    localStorage.setItem('user', JSON.stringify(dataToStore));
}

function getUserSession() {
    const data = localStorage.getItem('user');
    if (data) {
        const parsedData = JSON.parse(data);
        const currentTime = new Date().getTime();
        const time = 60 * 60 * 1000; // 1 hour
        if (currentTime - parsedData.timestamp > time) {
            clearUserSession();
            return null;
        }
        return parsedData.user;
    }
    return null;
}

function clearUserSession() {
    localStorage.removeItem('user');
}

document.addEventListener("DOMContentLoaded", function () {
    const user = getUserSession();

    if (user) {
        updateLoginGreeting(user.name);
        toggleAuthButtons(true); // Mostra o estado de logado
        if (user.imageUrl) {
            updateProfilePicture(user.imageUrl);
        }
    } else {
        updateLoginGreeting('Visitante');
        toggleAuthButtons(false); // Mostra o estado de deslogado
        clearProfilePicture();
    }
});

document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const tenantId = 1;
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const result = await loginUser(tenantId, email, password);
        console.log('Login result:', result);

        toggleLoginModal('loginModal');
        updateLoginGreeting(result.name);
        toggleAuthButtons(true); // Altera para estado logado

        if (result.imageUrl) {
            updateProfilePicture(result.imageUrl);
        }

        saveUserSession({
            id: result.id,
            name: result.name,
            imageUrl: result.imageUrl
        });

    } catch (error) {
        showLoginError(error);
    }
});

document.getElementById('logoutLink').addEventListener('click', function (event) {
    event.preventDefault();
    logoutUser();
});

function logoutUser() {
    updateLoginGreeting('Visitante');
    toggleAuthButtons(false); // Altera para estado deslogado
    clearProfilePicture();
    clearUserSession();
    alert('Logout realizado com sucesso!');
}
