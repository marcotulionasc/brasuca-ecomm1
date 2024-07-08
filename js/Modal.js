import config from './Config/config.js';

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    const mainContent = document.querySelector('.main-content');

    modal.classList.toggle('hidden');
    mainContent.classList.toggle('blurred');
}

function toggleSidebarCart(sidebarId) {
    const sidebar = document.getElementById(sidebarId);
    sidebar.classList.toggle('translate-x-full');
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.toggle-login').forEach(button => {
        button.addEventListener('click', () => toggleModal('loginModal'));
    });

    document.querySelectorAll('.toggle-cadastro').forEach(button => {
        button.addEventListener('click', () => toggleModal('cadastroModal'));
    });

    document.querySelectorAll('.toggle-cart').forEach(button => {
        button.addEventListener('click', () => toggleSidebarCart('cartSidebar'));
    });

    const cpfInput = document.getElementById('cadastroCPF');
    if (cpfInput) {
        cpfInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    }

    document.getElementById('cadastroForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const tenantId = 1; // Altere conforme necessário
        const url = `${config.apiBaseUrl}/api/tenants/${tenantId}/user/create`;
        
        const formData = new FormData(this);
        const imageFile = formData.get('imageProfile');
    
        if (imageFile && imageFile.size > 0) {
            const reader = new FileReader();
            reader.onloadend = async function () {
                const imageBase64 = reader.result.split(',')[1]; // Pega apenas a parte base64 da string
    
                const data = {
                    name: formData.get('nome'),
                    cpf: formData.get('cpf'),
                    birthDate: formData.get('dataNascimento'),
                    email: formData.get('email'),
                    password: formData.get('senha'),
                    phone: formData.get('phone'), // Adicione se necessário
                    imageProfileBase64: imageBase64 // Garante que a imagem convertida em base64 seja enviada
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
                        throw new Error('Erro ao cadastrar usuário');
                    }
    
                    const result = await response.json();
                    console.log('Usuário cadastrado com sucesso:', result);
                    toggleModal('cadastroModal'); // Fechar o modal após o sucesso
    
                } catch (error) {
                    console.error('Erro:', error);
                    alert('Erro ao cadastrar usuário');
                }
            };
            reader.readAsDataURL(imageFile);
        } else {
            alert('Por favor, selecione uma imagem de perfil.');
        }
    });
    
    
});
