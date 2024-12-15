
export function showPreloader() {
    const preloader = document.getElementById('preloader-active');
    preloader.style.display = 'flex';
}

export function hidePreloader() {
    const preloader = document.getElementById('preloader-active');
    preloader.style.display = 'none';
}
