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

        const backgroundContainer = document.createElement("div");
        backgroundContainer.style.backgroundImage = `url('${base64Image}')`;
        backgroundContainer.classList.add("blur-scale", "absolute", "top-0", "left-0", "right-0", "bottom-0", "z-0");

        const image = document.createElement("img");
        image.src = base64Image;
        image.alt = "Imagem do Evento";
        image.classList.add("w-full", "h-64", "object-cover", "rounded-lg", "relative", "z-10");

        container.appendChild(backgroundContainer);
        container.appendChild(image);
    }


    function displayEventDetails(event) {
        const container = document.querySelector("#eventDetailsContainer");
        if (!container) {
            console.error("Elemento #eventDetailsContainer não encontrado ao exibir detalhes.");
            return;
        }

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
            console.log('Tickets response:', text);

            if (text.startsWith('<')) {
                throw new Error('Received HTML response instead of JSON. Please check the endpoint URL.');
            }

            const tickets = JSON.parse(text);

            renderTickets(tickets, tenantId, eventId);

        } catch (error) {
            console.error('Error fetching tickets:', error);
            displayError('Failed to load ticket details. Please try again later.');
        }
    }

    function renderTickets(tickets, tenantId, eventId) {
        ticketOptions.innerHTML = '';

        tickets.forEach(ticket => {
            const ticketDiv = createTicketElement(ticket);
            ticketOptions.appendChild(ticketDiv);
            fetchLots(tenantId, eventId, ticket.id);
        });
    }

    function createTicketElement(ticket) {
        const ticketDiv = document.createElement("div");
        ticketDiv.classList.add("custom-bg-ticket", "rounded-xl", "shadow-lg", "p-6", "mb-6", "text-white", "relative");

        ticketDiv.innerHTML = `
            <p class="mb-2">Selecione os lugares:</p>
            <p class="mb-4 text-sm">Você pode selecionar até 10 lugares</p>
            <p class="mb-4 text-sm-bold">(Nenhum selecionado)</p>
            <details id="lots_${ticket.id}" class="bg-gray-200 text-black rounded-md p-4">
                <summary class="font-semibold cursor-pointer">
                    ${ticket.areaTicket}
                </summary>
                <!-- Lotes serão carregados aqui -->
            </details>
        `;
        return ticketDiv;
    }

    function displayError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('bg-red-500', 'text-white', 'p-4', 'rounded-lg', 'mb-6');
        errorDiv.textContent = message;
        ticketOptions.innerHTML = '';
        ticketOptions.appendChild(errorDiv);
    }

    async function fetchTicket(tenantId, eventId, ticketId) {
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

        } catch (error) {
            console.error('Error fetching lots:', error);
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
        } catch (error) {
            console.error('Error fetching lots:', error);
        }
    }

    function proceedToPayment(tenantId, eventId, ticketId) {

        const quantities = {};
        document.querySelectorAll(`input[id^="quantity_"]`).forEach(input => {
            quantities[input.id.replace("quantity_", "")] = input.value;
        });

        console.log('Selected quantities:', quantities);

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
