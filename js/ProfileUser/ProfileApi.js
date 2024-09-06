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
        document.querySelector('input[name="cpf"]').value = userData.cpf;
        document.querySelector('input[name="email"]').value = userData.email;
        document.querySelector('input[name="phone"]').value = userData.phone;
        document.querySelector('input[name="birth_date"]').value = userData.birthDate;
        document.querySelector('input[name="street"]').value = userData.street;
        document.querySelector('input[name="number_address"]').value = userData.numberAddress;
        document.querySelector('input[name="complement"]').value = userData.complement;
        document.querySelector('input[name="cep"]').value = userData.cep;
        document.querySelector('input[name="uf"]').value = userData.uf;
        document.querySelector('input[name="city"]').value = userData.city;
        document.querySelector('input[name="neighborhood"]').value = userData.neighborhood; // Adicionando bairro
        document.querySelector('input[name="password"]').value = ''; // Senha deve ser deixada vazia por segurança

        console.log("Data de nascimento: ", userData);




        const userNameDisplay = document.querySelector('.name');
        userNameDisplay.textContent = userData.name;

        const profileImg = document.querySelector('.profile-img');
        if (userData.imageProfileBase64) {
            profileImg.src = `${userData.imageProfileBase64}`;  // Ajuste para pegar a imagem atualizada
        }

    } catch (error) {
        console.error('Erro ao buscar os dados do usuário:', error);
    }
}

// Função para salvar as alterações do usuário
async function saveUserChanges(userId) {
    const tenantId = 1; // Supondo que o tenantId seja 1
    const userApiUrl = `${getBaseUrl}/api/tenants/${tenantId}/users/${userId}`;

    // Obter os valores dos campos
    const name = document.querySelector('input[name="name"]').value;
    const cpf = document.querySelector('input[name="cpf"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const phone = document.querySelector('input[name="phone"]').value;
    const birth_date = document.querySelector('input[name="birth_date"]').value;
    const street = document.querySelector('input[name="street"]').value;
    const number_address = document.querySelector('input[name="number_address"]').value;
    const complement = document.querySelector('input[name="complement"]').value;
    const cep = document.querySelector('input[name="cep"]').value;
    const uf = document.querySelector('input[name="uf"]').value;
    const city = document.querySelector('input[name="city"]').value;
    const neighborhood = document.querySelector('input[name="neighborhood"]').value; // Adicionando bairro
    const password = document.querySelector('input[name="password"]').value; // Adicionando senha
    const profileImg = document.querySelector('.profile-img').src;

    // Utiliza a classe URL para manipular a URL da imagem
    const url = new URL(profileImg);

    // Obter apenas o caminho relativo
    const relativePath = url.pathname;

    console.log(relativePath);

    // Criar objeto com os dados do usuário
    const updateUserDTO = {
        name: name || undefined,
        email: email || undefined,
        cpf: cpf || undefined,
        phone: phone || undefined,
        birthDate: birth_date || undefined,
        password: password || undefined, // Incluindo o campo de senha
        imageProfileBase64: relativePath || undefined,
        address: {
            street: street || undefined,
            numberAddress: number_address || undefined,
            complement: complement || undefined,
            cep: cep || undefined,
            uf: uf || undefined,
            city: city || undefined,
            neighborhood: neighborhood || undefined // Incluindo bairro
        }
    };

    try {
        const response = await fetch(userApiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateUserDTO)
        });

        if (response.ok) {
            alert('Seus dados foram alterados com sucesso!');
            window.location.reload();
        } else {
            console.error('Erro ao atualizar o usuário:', response.statusText);
            alert('Erro ao atualizar o usuário.');
        }
    } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
        alert('Erro ao atualizar o usuário.');
    }
}

// Função para fazer o upload da imagem
async function uploadProfileImage(file) {
    const uploadUrl = `${getBaseUrl}/api/upload`;
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            const profileImg = document.querySelector('.profile-img');
            profileImg.src = `${getBaseUrl}${result.filePath}`; // Atualiza a imagem no frontend
            alert(`Imagem de perfil atualizada com sucesso!`);
        } else {
            console.error('Erro ao fazer upload da imagem:', response.statusText);
            alert('Erro ao fazer upload da imagem.');
        }
    } catch (error) {
        console.error('Erro ao fazer a requisição de upload:', error);
        alert('Erro ao fazer upload da imagem.');
    }
}

// Adiciona o event listener para o botão de salvar
document.querySelector('button.bg-blue-400').addEventListener('click', function (event) {
    event.preventDefault();
    const userId = getUserIdFromUrl();
    if (userId) {
        saveUserChanges(userId);
    }
});

// Adiciona o event listener para o botão de upload da imagem
document.getElementById('uploadImageButton').addEventListener('click', function (event) {
    event.preventDefault();
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = () => {
        const file = fileInput.files[0];
        if (file) {
            uploadProfileImage(file); // Chama a função para fazer o upload
        }
    };
    fileInput.click(); // Abre o seletor de arquivo
});

// Carregar os dados do usuário quando o documento for carregado
document.addEventListener("DOMContentLoaded", function () {
    const userId = getUserIdFromUrl();
    if (userId) {
        fetchUserData(userId);
    }
});

