import config from './Configuration.js';

const getBaseUrl = config.getBaseUrl();

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    const mainContent = document.querySelector('.main-content');

    modal.classList.toggle('hidden');
    mainContent.classList.toggle('blurred');
}

document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const tenantId = 1; // Altere conforme necessário
    const url = `${getBaseUrl}/api/tenants/${tenantId}/users/login`;

    const data = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true' // Adicionando o cabeçalho para ignorar o aviso do ngrok
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Erro ao fazer login');
        }

        const result = await response.json();
        console.log('Login result:', result);
        toggleModal('loginModal'); // Fechar o modal após o sucesso

        // Atualizar a interface com as informações do usuário
        document.getElementById('userGreeting').innerText = `Olá, ${result.name}`;
        document.querySelector('.toggle-login').style.display = 'none';
        document.querySelector('.toggle-cadastro').style.display = 'none';
        document.getElementById('logoutLink').style.display = 'flex';

        // Buscar a imagem de perfil
        if (result.imageProfileBase64) {
            try {
                const imgResponse = await fetch(result.imageProfileBase64, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                });

                if (imgResponse.ok) {
                    const imageBlob = await imgResponse.blob();
                    const reader = new FileReader();
                    reader.readAsDataURL(imageBlob);
                    reader.onloadend = function () {
                        const base64data = reader.result;
                        const img = document.createElement('img');
                        img.src = base64data; // Usar a URL base64 da imagem
                        img.classList.add('profile-image');

                        const profileImageContainer = document.getElementById('profileImageContainer');
                        profileImageContainer.innerHTML = '';
                        profileImageContainer.appendChild(img);
                    };
                } else {
                    console.error('Erro ao buscar a imagem de perfil:', imgResponse.statusText);
                }
            } catch (imgError) {
                console.error('Erro ao buscar a imagem de perfil:', imgError);
            }
        }

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao fazer login');
    }
});

document.getElementById('logoutLink').addEventListener('click', function (event) {
    event.preventDefault();
    logout();
});

function logout() {
    // Lógica de logout, como remover o token do armazenamento local
    document.getElementById('userGreeting').innerText = 'Olá, Visitante';
    document.querySelector('.toggle-login').style.display = 'flex';
    document.querySelector('.toggle-cadastro').style.display = 'flex';
    document.getElementById('logoutLink').style.display = 'none';
    const profileImageContainer = document.getElementById('profileImageContainer');
    profileImageContainer.innerHTML = ''; // Remover a imagem de perfil
    alert('Logout successful');
}
