import config from './Configuration.js';

const getBaseUrl = config.getBaseUrl();

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM completamente carregado e analisado");

    const eventDetails = document.getElementById("eventDetails");
    const ticketOptions = document.getElementById("ticketOptions");
    const checkoutSection = document.getElementById("checkoutSection");

    console.log("Elemento #eventDetails:", eventDetails);
    console.log("Elemento #ticketOptions:", ticketOptions);
    console.log("Elemento #checkoutSection:", checkoutSection);

    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            tenantId: params.get('tenantId'),
            eventId: params.get('eventId')
        };
    }

    async function fetchEventConfiguration(tenantId, eventId) {
        const url = `${getBaseUrl}/api/tenants/${tenantId}/events/${eventId}/config`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const configuration = await response.json();
            return configuration;
        } catch (error) {
            console.error('Erro ao buscar configuração do evento:', error);
        }
    }

    async function fetchEventDetails(tenantId, eventId) {
        const url = `${getBaseUrl}/api/tenants/${tenantId}/events/${eventId}`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const event = await response.json();
            displayEventDetails(event);

            if (event.imageEvent) {
                const imageUrl = `${getBaseUrl}${event.imageEvent}`;
                fetchEventImage(imageUrl);
            }

        } catch (error) {
            console.error('Erro ao buscar detalhes do evento:', error);
        }
    }

    async function fetchEventImage(imageUrl) {
        try {
            const response = await fetch(imageUrl, {
                method: "GET",
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const imageBlob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = function () {
                const base64data = reader.result;
                displayEventImage(base64data);
            }
            reader.readAsDataURL(imageBlob);
        } catch (error) {
            console.error('Erro ao buscar a imagem do evento:', error);
        }
    }

    function displayEventImage(base64Image) {
        const container = document.querySelector("#eventDetails");
        if (!container) {
            console.error("Elemento #eventDetails não encontrado ao exibir imagem.");
            return;
        }
        container.innerHTML = '';
        const image = document.createElement("img");
        image.src = base64Image;
        image.alt = "Imagem do Evento";
        image.classList.add("w-full", "h-64", "object-cover", "rounded-lg");
        
        container.appendChild(image);

    }

    function displayEventDetails(event) {
        const container = document.querySelector("#eventDetails");
        if (!container) {
            console.error("Elemento #eventDetails não encontrado ao exibir detalhes.");
            return;
        }
    
        // Log do objeto completo do evento para inspeção
        console.log("Detalhes completos do evento:", event);
    
        container.innerHTML = '';
    
        const title = document.createElement("h2");
        title.classList.add("text-2xl", "font-bold", "mt-4");
        title.style.color = "var(--secondary-color)";
        title.textContent = event.titleEvent || "Título não disponível";
    
        const date = document.createElement("p");
        date.style.color = "var(--primary-text-color)";
        date.textContent = event.date ? new Date(event.date).toLocaleDateString() : "Data não disponível";
    
        const address = document.createElement("p");
        address.style.color = "var(--primary-text-color)";
        address.textContent = event.local || "Local não disponível";
    
        const description = document.createElement("p");
        description.style.color = "var(--primary-text-color)";
        description.textContent = event.description || "Descrição não disponível";
    
        container.appendChild(title);
        container.appendChild(date);
        container.appendChild(address);
        container.appendChild(description);
    
        // Log para verificar se os elementos foram adicionados corretamente
        console.log("Elementos de detalhes do evento adicionados ao DOM.");
    }
    

    async function viewDetails(tenantId, eventId) {
        const ticketsUrl = `${getBaseUrl}/api/tenants/${tenantId}/events/${eventId}/tickets`;

        try {
            const response = await fetch(ticketsUrl, {
                method: 'GET',
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            const text = await response.text();

            if (text.startsWith('<')) {
                throw new Error('Received HTML response instead of JSON. Please check the endpoint URL.');
            }

            const tickets = JSON.parse(text);

            ticketOptions.innerHTML = '';

            tickets.forEach(ticket => {
                const ticketDiv = document.createElement("div");
                ticketDiv.classList.add("bg-gray-100", "rounded-lg", "shadow-md", "p-4", "mb-4");
                ticketDiv.innerHTML = `
                 <h3>Selecione os lugares</h3>
                 <h5>Você pode selecionar até 10 lugares</h5>
                 <hr>
                 <div class="flex items-start">
                    <h4 class="text-lg font-semibold mb-2 mr-4">${ticket.nameTicket}</h4>
                    <details id="lots_${ticket.id}">
                        <summary class="font-semibold cursor-pointer"></summary>
                        <!-- Lotes serão carregados aqui -->
                    </details>
                </div>
                `;

                ticketOptions.appendChild(ticketDiv);

                fetchLots(tenantId, eventId, ticket.id);
            });

        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    }

    async function fetchLots(tenantId, eventId, ticketId) {
        const lotsUrl = `${getBaseUrl}/api/tenants/${tenantId}/events/${eventId}/tickets/${ticketId}/lots`;

        try {
            const response = await fetch(lotsUrl, {
                method: 'GET',
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            const text = await response.text();

            if (text.startsWith('<')) {
                throw new Error('Received HTML response instead of JSON. Please check the endpoint URL.');
            }

            const lots = JSON.parse(text);

            const lotsDiv = document.getElementById(`lots_${ticketId}`);
            lots.forEach(lot => {
                const lotDiv = document.createElement("div");
                lotDiv.classList.add("bg-white", "rounded-lg", "shadow-md", "p-2", "mb-2");
                lotDiv.innerHTML = `
                <p>${lot.nameLot}</p>
                <p>R$ ${lot.priceTicket} + R$ ${(lot.priceTicket * (lot.taxPriceTicket / 100)).toFixed(2)}</p>
                <label for="quantity_${lot.id}" class="block text-sm font-medium text-gray-700">Quantidade:</label>
                <input type="number" id="quantity_${lot.id}" name="quantity_${lot.id}" min="1" max="${lot.amountTicket}" value="1" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                `;
                lotsDiv.appendChild(lotDiv);
            });

            // Add checkout button if it doesn't exist already
            if (!document.getElementById("checkoutButton")) {
                const checkoutButton = document.createElement("button");
                checkoutButton.id = "checkoutButton";
                checkoutButton.textContent = "Proceed to Payment";
                checkoutButton.classList.add("mt-4", "w-full", "py-2", "px-4", "bg-blue-500", "text-white", "rounded-lg", "hover:bg-blue-700");
                checkoutButton.addEventListener("click", () => proceedToPayment(tenantId, eventId, ticketId));
                checkoutSection.appendChild(checkoutButton);
            }

        } catch (error) {
            console.error('Error fetching lots:', error);
        }
    }

    function proceedToPayment(tenantId, eventId, ticketId) {
        // Collect selected quantities
        const quantities = {};
        document.querySelectorAll(`input[id^="quantity_"]`).forEach(input => {
            quantities[input.id.replace("quantity_", "")] = input.value;
        });

        console.log('Selected quantities:', quantities);

        // Proceed to payment step (this is where you would implement your payment logic)
        // For now, let's log the quantities and redirect to a mock payment page
        window.location.href = `payment.html?tenantId=${tenantId}&eventId=${eventId}&quantities=${JSON.stringify(quantities)}`;
    }

    const { tenantId, eventId } = getUrlParams();
    if (tenantId && eventId) {
        fetchEventDetails(tenantId, eventId);
        viewDetails(tenantId, eventId);
        fetchEventConfiguration(tenantId, eventId);
    } else {
        console.error('Parâmetros tenantId e eventId não encontrados na URL.');
    }
});
