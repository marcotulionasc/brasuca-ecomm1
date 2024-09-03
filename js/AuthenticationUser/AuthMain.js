export function toggleLoginModal(modalId) {
    const modal = document.getElementById(modalId);
    const mainContent = document.querySelector('.main-content');

    console.log("Toggle Login Modal:", { modalId, modal, mainContent });

    modal.classList.toggle('hidden');
    mainContent.classList.toggle('blurred');
}

export function updateLoginGreeting(name) {
    console.log("Updating login greeting for:", name);
    document.getElementById('userGreeting').innerText = `Olá, ${name}`;
}

export function toggleAuthButtons(showLogin) {
    console.log("Toggle Auth Buttons:", { showLogin });
    document.querySelector('.toggle-login').style.display = showLogin ? 'flex' : 'none';
    document.querySelector('.toggle-cadastro').style.display = showLogin ? 'flex' : 'none';
    document.getElementById('logoutLink').style.display = showLogin ? 'none' : 'flex';
}

export function updateProfilePicture(imageUrl) {
    console.log("Updating profile picture with image URL:", imageUrl);

    const img = document.createElement('img');
    img.src = imageUrl; // Usa diretamente a URL da imagem
    console.log("Profile Image URL:", img.src);
    img.classList.add('profile-image');

    const profileImageContainer = document.getElementById('profileImageContainer');
    console.log("Profile Image Container:", profileImageContainer);

    profileImageContainer.innerHTML = ''; // Limpa o conteúdo anterior
    profileImageContainer.appendChild(img); // Adiciona a nova imagem
}


export function clearProfilePicture() {
    console.log("Clearing profile picture");
    const profileImageContainer = document.getElementById('profileImageContainer');
    profileImageContainer.innerHTML = '';
}

export function showLoginError(message) {
    console.log("Login Error:", message);
    alert(message);
}
