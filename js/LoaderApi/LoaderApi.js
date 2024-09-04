// Função para ativar o preloader
export function showPreloader() {
    const preloader = document.getElementById('preloader-active');
    preloader.style.display = 'flex';
}

// Função para desativar o preloader
export function hidePreloader() {
    const preloader = document.getElementById('preloader-active');
    preloader.style.display = 'none';
}
