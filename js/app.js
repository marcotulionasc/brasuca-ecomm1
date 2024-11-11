import config from '../Configuration.js';

const getBaseUrl = config.getBaseUrl();

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

document.addEventListener('DOMContentLoaded', function () {
    const cadastroForm = document.getElementById('cadastroForm');

    cadastroForm.addEventListener('submit', function (event) {
        // Limpar mensagens de erro anteriores
        const errorMessages = cadastroForm.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());

        let isValid = true;

        // Validação da Senha
        const senhaInput = document.getElementById('cadastroSenha');
        if (senhaInput.value.length < 8) {
            mostrarErro(senhaInput, 'A senha deve ter pelo menos 8 caracteres.');
            isValid = false;
        }

        // Validação do CPF
        const cpfInput = document.getElementById('cadastroCPF');
        if (!validarCPF(cpfInput.value)) {
            mostrarErro(cpfInput, 'CPF inválido.');
            isValid = false;
        }

        // Você pode adicionar outras validações aqui se necessário

        if (!isValid) {
            event.preventDefault(); // Impede o envio do formulário
        }
    });

    /**
     * Função para mostrar mensagens de erro abaixo do campo
     * @param {HTMLElement} input - O campo de entrada que teve o erro
     * @param {string} mensagem - A mensagem de erro a ser exibida
     */
    function mostrarErro(input, mensagem) {
        const erro = document.createElement('div');
        erro.className = 'error-message';
        erro.innerText = mensagem;
        input.parentNode.appendChild(erro);
    }

    /**
     * Função para validar CPF
     * @param {string} strCPF - O CPF a ser validado
     * @returns {boolean} - Retorna true se o CPF for válido, caso contrário, false
     */
    function validarCPF(strCPF) {
        // Remover pontos e traço
        strCPF = strCPF.replace(/[^\d]+/g, '');

        if (strCPF.length !== 11 ||
            /^(\d)\1{10}$/.test(strCPF)) {
            return false;
        }

        let soma = 0;
        let resto;

        // Validação do primeiro dígito
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(strCPF.substring(i - 1, i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) {
            resto = 0;
        }
        if (resto !== parseInt(strCPF.substring(9, 10))) {
            return false;
        }

        // Validação do segundo dígito
        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(strCPF.substring(i - 1, i)) * (12 - i);
        }
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) {
            resto = 0;
        }
        if (resto !== parseInt(strCPF.substring(10, 11))) {
            return false;
        }

        return true;
    }
});
