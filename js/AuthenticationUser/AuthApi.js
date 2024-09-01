import config from '../Configuration.js';

const getBaseUrl = config.getBaseUrl();

export async function loginUser(tenantId, email, password) {
    const url = `${getBaseUrl}/api/tenants/${tenantId}/users/login`;
    const data = { email, password };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Erro ao fazer login');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

export async function fetchUserProfileImage(imageUrl) {
    try {
        const response = await fetch(imageUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar a imagem de perfil');
        }

        return await response.blob();
    } catch (error) {
        console.error('Erro ao buscar a imagem de perfil:', error);
        throw error;
    }
}
