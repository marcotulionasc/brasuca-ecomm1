import config from '../Configuration.js';

const getBaseUrl = config.getBaseUrl();

const cadastroForm = document.getElementById('cadastroForm');
if (cadastroForm) {
    cadastroForm.addEventListener('submit', async function (event) {
        event.preventDefault();

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
            if (imageUser && imageUser.size > 0) {
                data.imageProfileBase64 = await uploadImage(imageUser);
            }

            const response = await fetch(userCreateUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso',
                    text: result.message || 'Usuário cadastrado com sucesso! Acesse seu e-mail para ativar sua conta. Se não encontrar o e-mail, verifique a caixa de spam. Você entendeu que deve verificar o seu e-mail?',
                    showCancelButton: true,
                    confirmButtonText: 'Ok, vou verificar!',
                }).then((res) => {
                    if (res.isConfirmed) {
                        window.location.href = 'index.html';
                    }
                });
            } else {
                const errorMessage = result.error || 'Erro ao cadastrar usuário. Por favor, tente novamente.';
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: errorMessage,
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Erro ao cadastrar usuário. Por favor, tente novamente mais tarde.',
                confirmButtonText: 'OK'
            });
        }
    });
}

async function uploadImage(file) {
    const maxSizeMB = 5;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
        Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: `O arquivo excede o limite de ${maxSizeMB} MB. Por favor, envie uma imagem menor.`,
            confirmButtonText: 'OK'
        });
        throw new Error(`Arquivo muito grande: ${file.size} bytes.`);
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
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Erro ao fazer upload da imagem. Por favor, tente novamente.',
                confirmButtonText: 'OK'
            });
            throw new Error('Erro ao fazer upload da imagem');
        }
    } catch (error) {
        console.error('Erro no upload da imagem:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Erro ao fazer upload da imagem. Por favor, tente novamente.',
            confirmButtonText: 'OK'
        });
        throw error;
    }
}
