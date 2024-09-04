import config from '../Configuration.js';

const getBaseUrl = config.getBaseUrl();

// Função para capturar o userId da URL
function getUserIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id'); // Supondo que o parâmetro na URL seja 'id'
}

// Função para buscar os dados do usuário
async function fetchUserData(userId) {
    const tenantId = 1; // Supondo que o tenantId seja 1
    const userApiUrl = `${getBaseUrl}/api/tenants/${tenantId}/users/${userId}`;

    try {
        const response = await fetch(userApiUrl);
        const userData = await response.json();

        // Preencher os campos do formulário com os dados do usuário
        document.querySelector('input[name="name"]').value = userData.name;
        document.querySelector('input[name="email"]').value = userData.email;
        document.querySelector('input[name="phone"]').value = userData.phone;
        document.querySelector('input[name="birth_date"]').value = userData.birth_date;
        document.querySelector('input[name="street"]').value = userData.street;
        document.querySelector('input[name="number_address"]').value = userData.numberAddress;
        document.querySelector('input[name="complement"]').value = userData.complement;
        document.querySelector('input[name="cep"]').value = userData.cep;
        document.querySelector('input[name="uf"]').value = userData.uf;
        document.querySelector('input[name="city"]').value = userData.city;


        // Atualizar o nome do usuário no título
        const userNameDisplay = document.querySelector('.name');
        userNameDisplay.textContent = userData.name;


        // Se houver imagem de perfil, substitui a imagem do placeholder
        const profileImg = document.querySelector('.profile-img');
        if (userData.imageProfileBase64) {
            profileImg.src = userData.imageProfileBase64;
        }

    } catch (error) {
        console.error('Erro ao buscar os dados do usuário:', error);
    }
}

// Executar a função quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
    const userId = getUserIdFromUrl();
    if (userId) {
        fetchUserData(userId);
    }
});
