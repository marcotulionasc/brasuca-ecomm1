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

function startCountdown(duration, display) {
    var timer = duration, minutes, seconds;
    var countdownInterval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = "00:" + minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(countdownInterval);
            showModalAndRedirect();
        } else {
            localStorage.setItem('timer', timer); // Save remaining time to local storage
        }
    }, 1000);
}

function showModalAndRedirect() {
   
    alert('O tempo expirou! Você será redirecionado para a página inicial.');

    localStorage.removeItem('timer');

    window.location.href = 'index.html';
}


window.onload = function () {
    var tenMinutes = 60 * 10;
    var savedTime = localStorage.getItem('timer');
    var remainingTime = savedTime !== null ? parseInt(savedTime) : tenMinutes;

    var display = document.querySelector('#countdown-timer');
    startCountdown(remainingTime, display);
};



