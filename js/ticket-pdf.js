import { PDFDocument, rgb } from 'pdf-lib';
import QRCode from 'qrcode';

async function generatePDF(ticketData, email) {
    const pdfDoc = await PDFDocument.create();

    for (const ticket of ticketData) {
        const page = pdfDoc.addPage([400, 600]);
        const { nomeEvento, dataEvento, localEvento, nomeIngresso, areaIngresso, valorLote, taxaLote, dataCompra, nomeComprador, textoNoIngresso } = ticket;

        page.drawText(`Evento: ${nomeEvento}`, { x: 50, y: 550, size: 14, color: rgb(0, 0, 0) });
        page.drawText(`Data: ${dataEvento}`, { x: 50, y: 530, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`Local: ${localEvento}`, { x: 50, y: 510, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`Ingresso: ${nomeIngresso}`, { x: 50, y: 490, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`Área: ${areaIngresso}`, { x: 50, y: 470, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`Valor: R$${valorLote} + Taxa: R$${taxaLote}`, { x: 50, y: 450, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`Comprado por: ${nomeComprador}`, { x: 50, y: 430, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`Data da compra: ${dataCompra}`, { x: 50, y: 410, size: 12, color: rgb(0, 0, 0) });
        page.drawText(textoNoIngresso, { x: 50, y: 390, size: 12, color: rgb(0, 0, 0) });

        const qrCodeData = JSON.stringify({ ticketId: ticket.idIngresso, userEmail: email });
        const qrCodeImageUrl = await QRCode.toDataURL(qrCodeData);
        const qrCodeImage = await pdfDoc.embedPng(qrCodeImageUrl);
        page.drawImage(qrCodeImage, { x: 150, y: 200, width: 100, height: 100 });
    }

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
}

async function uploadPDF(pdfBlob, email) {
    const formData = new FormData();
    formData.append('file', pdfBlob, `${email}_ticket.pdf`);

    try {
        const response = await fetch('https://backend-ingressar.onrender.com/api/upload', {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        return result.filePath;
    } catch (error) {
        console.error('Erro ao fazer upload do PDF:', error);
        return null;
    }
}

function fetchTicketData(paymentId) {
    return fetch(`https://backend-ingressar.onrender.com/api/${paymentId}/ticketdata`)
        .then(response => response.json())
        .catch(error => {
            console.error('Erro ao buscar dados do ingresso:', error);
            return null;
        });
}

const tenantId = localStorage.getItem('tenantId');
const eventId = localStorage.getItem('eventId');

function calculateTotalAmount(tickets) {
    return tickets.reduce((total, ticket) => total + (ticket.price * ticket.quantity), 0);
}

function savePaymentInDatabase() {
    const selectedTickets = JSON.parse(localStorage.getItem('selectedTickets'));
    const userData = JSON.parse(localStorage.getItem('user'));
    const userId = userData?.user?.id;

    if (!userId) {
        console.error("User ID is missing. Cannot save payment.");
        return;
    }

    const name = userData.user.name || '';
    const email = userData.user.email || '';
    const totalAmount = calculateTotalAmount(selectedTickets);

    const paymentData = {
        userId: userId,
        name: name,
        email: email,
        eventId: eventId,
        tenantId: tenantId,
        totalAmount: totalAmount,
        selectedTickets: selectedTickets.map(ticket => ({
            ticketId: ticket.ticketId || ticket.id,
            quantity: ticket.quantity
        }))
    };

    fetch('https://backend-ingressar.onrender.com/api/payments/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
    })
        .then(response => response.json())
        .then(data => {
            const paymentId = data.paymentId;
            localStorage.setItem('paymentId', paymentId);
            return processTicketPDF(paymentId, email);
        })
        .catch(error => {
            console.error('Erro ao salvar pagamento:', error);
        });
}

async function processTicketPDF(paymentId, email) {
    const ticketData = await fetchTicketData(paymentId);
    if (!ticketData) return;

    const pdfBlob = await generatePDF(ticketData, email);
    if (pdfBlob) {
        await uploadPDF(pdfBlob, email);
    }
}

function animateProgress() {
    savePaymentInDatabase();

    const checkIcon = document.getElementById('check-icon');
    let size = 50;

    const interval = setInterval(() => {
        size += 25;
        checkIcon.style.width = `${size}px`;
        checkIcon.style.height = `${size}px`;

        if (size >= 1000) {
            clearInterval(interval);
            window.location.href = "form-ticket.html";
        }
    }, 100);
}

window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('status');

    if (paymentStatus === 'approved') {
        animateProgress();
    } else {
        console.error('Pagamento não aprovado:', paymentStatus);
    }
};