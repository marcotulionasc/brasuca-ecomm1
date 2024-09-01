export function toggleLoginModal(modalId) {
    const modal = document.getElementById(modalId);
    const mainContent = document.querySelector('.main-content');

    modal.classList.toggle('hidden');
    mainContent.classList.toggle('blurred');
}

export function updateLoginGreeting(name) {
    document.getElementById('userGreeting').innerText = `Olá, ${name}`;
}

export function toggleAuthButtons(showLogin) {
    document.querySelector('.toggle-login').style.display = showLogin ? 'flex' : 'none';
    document.querySelector('.toggle-cadastro').style.display = showLogin ? 'flex' : 'none';
    document.getElementById('logoutLink').style.display = showLogin ? 'none' : 'flex';
}

export function updateProfilePicture(imageBlob) {
    const reader = new FileReader();
    reader.readAsDataURL(imageBlob);
    reader.onloadend = function () {
        const base64data = reader.result;
        const img = document.createElement('img');
        img.src = base64data;
        img.classList.add('profile-image');

        const profileImageContainer = document.getElementById('profileImageContainer');
        profileImageContainer.innerHTML = '';
        profileImageContainer.appendChild(img);
    };
}

export function clearProfilePicture() {
    const profileImageContainer = document.getElementById('profileImageContainer');
    profileImageContainer.innerHTML = '';
}

export function showLoginError(message) {
    alert(message);
}
