import config from '../Configuration.js';

const getBaseUrl = config.getBaseUrl();


const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const tenantId = 1; // Altere conforme necessário
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

                if(imageUser){
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
                    alert('Usuário cadastrado com sucesso');
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