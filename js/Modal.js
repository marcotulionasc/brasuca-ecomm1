import config from './Configuration.js';

const getBaseUrl = config.getBaseUrl();

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

    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const tenantId = 1; // Altere conforme necessário
            const userCreateUrl = `${getBaseUrl}/tenants/${tenantId}/user/create`;

            const formData = new FormData(this);
            const imageFile = formData.get('imageProfileBase64');

            const data = {
                name: formData.get('nome'),
                cpf: formData.get('cpf'),
                birthDate: formData.get('dataNascimento'),
                email: formData.get('email'),
                password: formData.get('senha'),
                phone: formData.get('phone') // Adicione se necessário
            };

            try {
                // Faz o upload da imagem e obtém a URL
                if (imageFile && imageFile.size > 0) {
                    console.log('Iniciando upload da imagem...');
                    data.imageProfileBase64 = await uploadImage(imageFile);
                    console.log('Imagem enviada:', data.imageProfileBase64);
                } else {
                    console.log('Nenhuma imagem foi selecionada ou o arquivo está vazio.');
                    data.imageProfileBase64 = "https://via.placeholder.com/300x150.png?text=Imagem+Indisponível";
                }

                // Enviar os dados do usuário
                console.log('Enviando dados do usuário para', userCreateUrl);
                const response = await fetch(userCreateUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Usuário cadastrado com sucesso:', result);
                    toggleModal('cadastroModal'); // Fechar o modal após o sucesso
                } else {
                    const errorData = await response.json();
                    console.error('Erro ao cadastrar usuário', errorData);
                }
            } catch (error) {
                console.error('Erro ao cadastrar usuário:', error);
                alert('Erro ao cadastrar usuário');
            }
        });
    }

    async function uploadImage(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${getBaseUrl}/api/upload`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Upload result:', result);
                return result.filePath; // Assumindo que a resposta contém a URL do arquivo
            } else {
                const errorText = await response.text();
                console.error('Erro ao fazer upload da imagem:', errorText);
                throw new Error('Erro ao fazer upload da imagem');
            }
        } catch (error) {
            console.error('Erro no upload da imagem:', error);
            alert('Erro ao fazer upload da imagem');
            throw error; // Rethrow to handle the error in the caller
        }
    }
});
