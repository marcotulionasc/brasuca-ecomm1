export function toggleLoginModal(modalId) {
    const modal = document.getElementById(modalId);
    const mainContent = document.querySelector('.main-content');

    modal.classList.toggle('hidden');
}

export function updateLoginGreeting(name) {

    // Atualiza o nome no Header (Desktop)
    const desktopGreeting = document.getElementById('userGreetingDesktop');
    if (desktopGreeting) {
        desktopGreeting.innerText = `Olá, ${name}`;
    }

    // Atualiza o nome na Sidebar (Mobile)
    const mobileGreeting = document.getElementById('userGreetingMobile');
    if (mobileGreeting) {
        mobileGreeting.innerText = `Olá, ${name}`;
    }
}

export function toggleAuthButtons(isLoggedIn) {
    
    // Mostra/Esconde botões de login/cadastro (Header e Sidebar)
    document.querySelectorAll('.toggle-login').forEach(el => el.style.display = isLoggedIn ? 'none' : 'flex');
    document.querySelectorAll('.toggle-cadastro').forEach(el => el.style.display = isLoggedIn ? 'none' : 'flex');
    
    // Mostra/Esconde botão de logout (Sidebar)
    document.getElementById('logoutLink').style.display = isLoggedIn ? 'flex' : 'none';
}

export function updateProfilePicture(imageUrl) {

    const img = document.createElement('img');
    img.src = imageUrl;
    img.classList.add('profile-image');

    // Atualiza a imagem no Header (Desktop)
    const desktopProfileImageContainer = document.getElementById('profileImageContainerDesktop');
    if (desktopProfileImageContainer) {
        desktopProfileImageContainer.innerHTML = '';
        desktopProfileImageContainer.appendChild(img.cloneNode(true));
    }

    // Atualiza a imagem na Sidebar (Mobile)
    const mobileProfileImageContainer = document.getElementById('profileImageContainerMobile');
    if (mobileProfileImageContainer) {
        mobileProfileImageContainer.innerHTML = '';
        mobileProfileImageContainer.appendChild(img.cloneNode(true));
    }
}

export function clearProfilePicture() {

    // Limpa a imagem de perfil no Header (Desktop)
    const desktopProfileImageContainer = document.getElementById('profileImageContainerDesktop');
    if (desktopProfileImageContainer) {
        desktopProfileImageContainer.innerHTML = '';  // Limpa a área de imagem do Header
    }

    // Limpa a imagem de perfil na Sidebar (Mobile)
    const mobileProfileImageContainer = document.getElementById('profileImageContainerMobile');
    if (mobileProfileImageContainer) {
        mobileProfileImageContainer.innerHTML = '';  // Limpa a área de imagem da Sidebar
    }
}

export function showLoginError(error) {
    console.error('Erro de login:', error.message || error);
    // alert('Erro ao fazer login, tente novamente.');
}
