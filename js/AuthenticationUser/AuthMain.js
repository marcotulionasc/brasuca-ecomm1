import { loginUser } from './AuthApi.js';
import { toggleLoginModal, updateLoginGreeting, toggleAuthButtons, updateProfilePicture, clearProfilePicture, showLoginError } from './AuthUiHandlers.js';

export function saveUserSession(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
}

function getUserSession() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function clearUserSession() {
    localStorage.removeItem('user');
}

document.addEventListener("DOMContentLoaded", function () {
    const user = getUserSession(); 

    if (user) {
       
        updateLoginGreeting(user.name);
        toggleAuthButtons(false); 
        if (user.imageUrl) {
            updateProfilePicture(user.imageUrl);
        }
    } else {
     
        updateLoginGreeting('Visitante');
        toggleAuthButtons(true); 
        clearProfilePicture(); 
    }
});

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

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
            updateProfilePicture(result.imageUrl);
        }

        saveUserSession({
            id: result.id,
            name: result.name,
            imageUrl: result.imageUrl
        });

    } catch (error) {
        showLoginError('Erro ao fazer login');
    }
});

document.getElementById('logoutLink').addEventListener('click', function(event) {
    event.preventDefault();
    logoutUser();
});

function logoutUser() {
    updateLoginGreeting('Visitante');
    toggleAuthButtons(true); 
    clearProfilePicture(); 
    clearUserSession(); 
    showLoginError('Logout successful');
}
