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
            localStorage.setItem('timer', timer); // Salva o tempo restante no local storage
        }
    }, 1000);
}

function showModalAndRedirect() {
    alert('O tempo expirou! Você será redirecionado para a página inicial.');
    localStorage.removeItem('timer');
    window.location.href = 'index.html';
}

window.onload = function () {
    var tenMinutes = 60 * 10; // 10 minutos em segundos
    var savedTime = localStorage.getItem('timer');
    var remainingTime = savedTime !== null ? parseInt(savedTime) : tenMinutes;

    var display = document.querySelector('#countdown-timer');
    if (display) {
        startCountdown(remainingTime, display);
    }
};

document.addEventListener('DOMContentLoaded', () => {

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
});

function redirectToHome() {
    window.location.href = 'index.html';
}


