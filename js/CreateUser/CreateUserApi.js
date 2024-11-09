import config from '../Configuration.js';
import { loginUser } from '../AuthenticationUser/AuthApi.js';
import { saveUserSession } from '../AuthenticationUser/AuthMain.js'; // Importa a função de login
import { showPreloader } from '../LoaderApi/LoaderApi.js';

const getBaseUrl = config.getBaseUrl();

const cadastroForm = document.getElementById('cadastroForm');
if (cadastroForm) {
    cadastroForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        showPreloader();
        const tenantId = 1;
        const userCreateUrl = `${getBaseUrl}/api/tenants/${tenantId}/user/create`;

        const formData = new FormData(this);

        const data = {
            name: formData.get('nome'),
            cpf: formData.get('cpf'),
            birthDate: formData.get('dataNascimento'),
            email: formData.get('email'),
            password: formData.get('senha'),
            phone: formData.get('phone')
        };

        try {

            const imageUser = formData.get('imageProfileBase64');

            if (imageUser) {
                data.imageProfileBase64 = await uploadImage(imageUser);
            }

            const response = await fetch(userCreateUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                alert('Usuário cadastrado com sucesso! Acesse seu e-mail para ativar sua conta.');
                window.location.href = 'index.html';

            } else {
                const errorData = await response.json();
                console.error('Erro ao cadastrar usuário', errorData);
                alert('Erro ao cadastrar usuário');
            }
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            alert('Erro ao cadastrar usuário');
        } finally {
            hidePreloader();
        }
    });
}

async function uploadImage(file) {
    const maxSizeMB = 5;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
        alert(`O arquivo excede o limite de ${maxSizeMB} MB. Por favor, envie uma imagem menor.`);
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${getBaseUrl}/api/upload`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            return result.filePath;
        } else {
            const errorText = await response.text();
            console.error('Erro ao fazer upload da imagem:', errorText);
            throw new Error('Erro ao fazer upload da imagem');
        }
    } catch (error) {
        console.error('Erro no upload da imagem:', error);
        alert('Erro ao fazer upload da imagem');
        throw error;
    }
}


