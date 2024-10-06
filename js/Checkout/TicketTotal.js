// Variáveis globais para armazenar o total de ingressos e o valor total
let totalTickets = 0;
let totalAmount = 0;

/**
 * Função que atualiza o preço total e a quantidade de ingressos
 * @param {number} price - O preço base do lote
 * @param {number} taxRate - A taxa aplicada sobre o preço (em %)
 * @param {number} quantity - A quantidade a ser adicionada ou subtraída
 */
export function updatePriceAndQuantity(price, taxRate, quantity) {
    const numericPrice = parseFloat(price);  // Converte o preço para número
    const numericTax = parseFloat(taxRate);  // Converte a taxa para número
    const priceWithTax = numericPrice + (numericPrice * (numericTax / 100));  // Calcula o preço com a taxa

    totalTickets += quantity;  // Atualiza a quantidade total de ingressos
    totalAmount += (priceWithTax * quantity);  // Atualiza o valor total com a taxa incluída

    // Impede que o total de ingressos ou o valor total sejam negativos
    if (totalTickets < 0) {
        totalTickets = 0;
    }
    if (totalAmount < 0) {
        totalAmount = 0;
    }

    // Chama a função que atualiza a exibição no nav
    updateNavDisplay(totalTickets, totalAmount);
}
/**
 * Função que atualiza o conteúdo do nav com o número de ingressos e o valor total
 * @param {number} totalTickets - O número total de ingressos
 * @param {number} totalAmount - O valor total dos ingressos
 */
export function updateNavDisplay(totalTickets, totalAmount) {
    const ticketCountElement = document.getElementById("ticketCount");
    const totalAmountElement = document.getElementById("amountTotalTicket");

    // Formata o valor total com duas casas decimais e substitui o ponto por vírgula
    const formattedTotalAmount = totalAmount >= 0 ? `R$ ${totalAmount.toFixed(2).replace('.', ',')}` : "R$ 0,00";

    // Atualiza o texto no nav com a quantidade de ingressos e o valor total
    ticketCountElement.textContent = `${totalTickets} Ingressos por`;
    totalAmountElement.textContent = formattedTotalAmount;
}

