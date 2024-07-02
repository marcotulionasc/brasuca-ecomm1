document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const tenantId = 1; // Altere conforme necessário
    const url = `http://localhost:9090/api/tenants/${tenantId}/users/login`;

    const data = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Erro ao fazer login');
        }

        const result = await response.json();
        console.log('Login successful:', result);
        toggleModal('loginModal'); // Fechar o modal após o sucesso

        // Atualizar a interface com as informações do usuário
        document.getElementById('userGreeting').innerText = `Olá, ${result.name}`;
        document.querySelector('.toggle-login').style.display = 'none';
        document.querySelector('.toggle-cadastro').style.display = 'none';
        document.getElementById('logoutLink').style.display = 'flex';

        // Exibir a imagem de perfil
        if (result.imageProfileBase64) {
            const img = document.createElement('img');
            img.src = `data:image/png;base64,${result.imageProfileBase64}`;
            img.classList.add('profile-image');

            const profileImageContainer = document.getElementById('profileImageContainer');
            profileImageContainer.innerHTML = '';
            profileImageContainer.appendChild(img);
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
