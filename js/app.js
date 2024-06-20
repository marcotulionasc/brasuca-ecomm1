function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("open");
}

// Script to switch between desktop and mobile headers
function checkScreenSize() {
    if (window.innerWidth <= 768) {
        document.querySelector('.desktop-header').classList.add('hidden');
        document.querySelector('.mobile-header').classList.remove('hidden');
        document.querySelector('.desktop-navbar').classList.add('hidden');
        document.querySelector('.mobile-navbar').classList.remove('hidden');
    } else {
        document.querySelector('.desktop-header').classList.remove('hidden');
        document.querySelector('.mobile-header').classList.add('hidden');
        document.querySelector('.desktop-navbar').classList.remove('hidden');
        document.querySelector('.mobile-navbar').classList.add('hidden');
    }
}

window.addEventListener('resize', checkScreenSize);
window.addEventListener('DOMContentLoaded', checkScreenSize);

