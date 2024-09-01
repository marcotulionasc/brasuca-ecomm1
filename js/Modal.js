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

});
