// Função para abrir modais genéricos
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('hidden');
}

// Função para fechar modais genéricos
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('hidden');
}

// Função combinada para fechar qualquer modal ao clicar fora
window.onclick = function (event) {
    const loginModal = document.getElementById('loginModal');
    const cadastroModal = document.getElementById('cadastroModal');
    const searchModal = document.getElementById('searchModal');

    // Verifica se o clique é fora dos modais e fecha se for
    if (event.target === loginModal) {
        closeModal('loginModal');
    } else if (event.target === cadastroModal) {
        closeModal('cadastroModal');
    } else if (event.target === searchModal) {
        closeModal('searchModal');
    }
};

function openSearchModal() {
    openModal('searchModal');
}

function closeSearchModal() {
    closeModal('searchModal');
}
