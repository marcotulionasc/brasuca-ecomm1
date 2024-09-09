const mp = new MercadoPago('PUBLIC_KEY', { locale: 'pt-BR' });

document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const valor = params.get('valor');
    console.log(valor);
    document.getElementById('valor-ingresso').value = valor;
});

document.getElementById('payment-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const cardData = {
        cardNumber: document.getElementById('cardNumber').value,
        cardholderName: document.getElementById('cardholderName').value,
        cardExpirationMonth: document.getElementById('cardExpirationMonth').value,
        cardExpirationYear: document.getElementById('cardExpirationYear').value,
        securityCode: document.getElementById('securityCode').value,
        email: document.getElementById('installments').value,
    }; 
    }