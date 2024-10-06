import config from '../Configuration.js';

const getBaseUrl = config.getBaseUrl();

const mp = new MercadoPago('PUBLIC_KEY', { locale: 'pt-BR' });

document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const valor = params.get('valor');
    console.log(valor);
    document.getElementById('valor-ingresso').value = valor; // Assumindo que é um campo de input
});

document.getElementById('payment-form').addEventListener('submit', async function (event) { // Adicionado async
    event.preventDefault();

    const cardData = {
        cardNumber: document.getElementById('cardNumber').value,
        cardholderName: document.getElementById('cardholderName').value,
        cardExpirationMonth: document.getElementById('cardExpirationMonth').value,
        cardExpirationYear: document.getElementById('cardExpirationYear').value,
        securityCode: document.getElementById('securityCode').value,
        installments: document.getElementById('installments').value,
        paymentMethodId: document.getElementById('paymentMethodId').value,
    };

    try {
        const tokenResponse = await mp.createCardToken(cardData);

        const rawAmount = document.getElementById('valor-ingresso').value; // Aqui deve ser .value, não .textContent
        console.log(rawAmount);

        const transactionAmount = parseFloat(rawAmount);
        console.log(transactionAmount);

        if (isNaN(transactionAmount)) {
            throw new Error('Invalid amount');
        }

        const paymentData = {
            token: tokenResponse.id,
            transactionAmount: transactionAmount,
            description: 'Compra de ingresso',
            installments: parseInt(document.getElementById('installments').value),
            paymentMethodId: document.getElementById('paymentMethodId').value,
        };

        const paymentResponse = await fetch(`${getBaseUrl}/api/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
        });

        const paymentResult = await paymentResponse.json();
        console.log(paymentResult);
        alert('Pagamento realizado com sucesso!');
    } catch (error) {
        console.error('Erro capturado:', error.message);
        alert('Erro ao processar o pagamento.');
    }
});
