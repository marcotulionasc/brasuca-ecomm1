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
