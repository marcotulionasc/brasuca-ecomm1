export function toggleLoginModal(modalId) {
    const modal = document.getElementById(modalId);
    const mainContent = document.querySelector('.main-content');

    console.log("Toggle Login Modal:", { modalId, modal, mainContent });

    modal.classList.toggle('hidden');
    mainContent.classList.toggle('blurred');
}

export function updateLoginGreeting(name) {
    console.log("Updating login greeting for:", name);

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


export function toggleAuthButtons(showLogin) {
    console.log("Toggle Auth Buttons:", { showLogin });
    document.querySelector('.toggle-login').style.display = showLogin ? 'flex' : 'none';
    document.querySelector('.toggle-cadastro').style.display = showLogin ? 'flex' : 'none';
    // document.getElementById('loginSideBarLink').style.display = showLogin ? 'flex' : 'none';
    // document.getElementById('cadastroSideBarLink').style.display = showLogin ? 'flex' : 'none';
    // document.getElementById('logoutLink').style.display = showLogin ? 'none' : 'flex';
}

export function updateProfilePicture(imageUrl) {
    console.log("Updating profile picture with image URL:", imageUrl);

    const img = document.createElement('img');
    img.src = imageUrl;
    img.classList.add('profile-image');

    // Atualiza a imagem no Header (Desktop)
    const desktopProfileImageContainer = document.getElementById('profileImageContainerDesktop');
    if (desktopProfileImageContainer) {
        desktopProfileImageContainer.innerHTML = '';
        desktopProfileImageContainer.appendChild(img.cloneNode());  // Clona a imagem
    }

    // Atualiza a imagem na Sidebar (Mobile)
    const mobileProfileImageContainer = document.getElementById('profileImageContainerMobile');
    if (mobileProfileImageContainer) {
        mobileProfileImageContainer.innerHTML = '';
        mobileProfileImageContainer.appendChild(img.cloneNode());  // Clona a imagem
    }
}

export function clearProfilePicture() {
    console.log("Clearing profile picture");
    const profileImageContainer = document.getElementById('profileImageContainer');
    profileImageContainer.innerHTML = '';
}



