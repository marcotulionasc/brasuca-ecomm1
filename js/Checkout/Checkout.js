import config from '../Configuration.js';
import { updatePriceAndQuantity } from './TicketTotal.js';

const getBaseUrl = config.getBaseUrl();

document.addEventListener("DOMContentLoaded", () => {

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
        image.classList.add(
            "w-full",
            "h-64",
            "object-cover",
            "rounded-lg",
            "relative",
            "z-10");

        container.appendChild(backgroundContainer);
        container.appendChild(image);
    }

    function displayEventDetails(event) {
        const container = document.querySelector("#eventDetailsContainer");
        if (!container) {
            console.error("Elemento #eventDetailsContainer não encontrado ao exibir detalhes.");
            return;
        }
        container.innerHTML = '';

        const title = document.createElement("h2");
        title.id = 'eventName';
        title.classList.add("text-2xl", "font-bold", "mt-4", "text-white");
        title.textContent = event.titleEvent || "Título não disponível";

        const date = document.createElement("p");
        date.classList.add("text-white");

        const dateObj = event.date.split('-');
        const dateFormatted = `${dateObj[2]}/${dateObj[1]}/${dateObj[0]}`;

        date.textContent = dateFormatted || "Data não disponível";

        const address = document.createElement("p");
        address.classList.add("text-white");
        address.textContent = event.local || "Local não disponível";

        const description = document.createElement("p");
        description.classList.add("text-white");
        description.textContent = event.description || "Descrição não disponível";

        container.appendChild(title);
        container.appendChild(date);
        container.appendChild(address);
        container.appendChild(description);
    }

    async function viewDetails(tenantId, eventId) {
        const ticketsUrl = `${getBaseUrl}/api/tenants/${tenantId}/events/${eventId}/tickets`;

        try {
            const response = await fetch(ticketsUrl, {
                method: 'GET',
            });

            const text = await response.text();

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

        const ticketsByArea = {};

        tickets.forEach(ticket => {
            const area = ticket.areaTicket;
            if (!ticketsByArea[area]) {
                ticketsByArea[area] = [];
            }
            ticketsByArea[area].push(ticket);
        });

        for (const area in ticketsByArea) {
            const ticketsInArea = ticketsByArea[area];
            const ticketDiv = createTicketElement(area);
            ticketOptions.appendChild(ticketDiv);

            fetchLotsForArea(tenantId, eventId, ticketsInArea, ticketDiv, area);
        }
    }

    function createTicketElement(areaTicket) {
        const ticketDiv = document.createElement("div");
        ticketDiv.classList.add(
            "bg-gray-900",
            "p-4",
            "rounded-lg",
            "shadow-lg",
            "text-white",
        );

        const areaId = areaTicket.replace(/\s+/g, '_');

        ticketDiv.innerHTML = `
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-bold">${areaTicket}</h3>
            </div>
            <p class="mt-4 text-sm">Selecione os ingressos disponíveis nesta área:</p>
            <details id="lots_${areaId}" class="bg-gray-800 text-white rounded-lg p-4 shadow-sm">
                <summary class="font-semibold cursor-pointer hover:text-indigo-500 bg-gray-950 p-2 rounded-lg transition duration-300 ease-in-out">
                    Ver ingressos
                </summary>
                <div id="tickets_container_${areaId}"></div>
            </details>
        `;
        return ticketDiv;
    }

    async function fetchLotsForArea(tenantId, eventId, ticketsInArea, ticketDiv, areaTicket) {
        const areaId = areaTicket.replace(/\s+/g, '_');
        const ticketsContainer = ticketDiv.querySelector(`#tickets_container_${areaId}`);
    
        let allActiveLots = [];
    
        for (const ticket of ticketsInArea) {
            const ticketId = ticket.id;
            const nameTicket = ticket.nameTicket || ticket.name || ticket.title || 'Ingresso';
    
            const lotsUrl = `${getBaseUrl}/api/tenants/${tenantId}/events/${eventId}/tickets/${ticketId}/lots`;
    
            try {
                const response = await fetch(lotsUrl, { method: 'GET' });
                const text = await response.text();
    
                if (text.startsWith('<')) {
                    throw new Error('Recebeu resposta HTML em vez de JSON. Por favor, verifique a URL do endpoint.');
                }
    
                const lots = JSON.parse(text);

                console.log(lots);
    
                // Filtrar lotes ativos com order_lot igual a 1
                const activeLots = lots.filter(lot => lot.isLotActive === "ACTIVE" && lot.order_lot === 1);
    
                if (activeLots.length > 0) {
                    // Adicionar informações do ingresso a cada lote, se necessário
                    activeLots.forEach(lot => {
                        lot.ticketId = ticketId;
                        lot.nameTicket = nameTicket;
                    });
    
                    // Coletar todos os lotes ativos com order_lot igual a 1
                    allActiveLots.push(...activeLots);
                } else {
                    console.log(`Nenhum lote ativo com order_lot igual a 1 encontrado para ticketId: ${ticketId}`);
                }
            } catch (error) {
                console.error(`Erro ao buscar lotes para ticketId ${ticketId}:`, error);
            }
        }
    
        if (allActiveLots.length > 0) {
            // Exibir apenas os lotes com order_lot igual a 1
            for (const lot of allActiveLots) {
                const lotDiv = createLotElement(lot, lot.nameTicket);
                ticketsContainer.appendChild(lotDiv);
                setupLotEventListeners(lotDiv, lot);
            }
        } else {
            console.log("Nenhum lote ativo com order_lot igual a 1 encontrado.");
        }
    }


    function createLotElement(lot, nameTicket) {
        const lotDiv = document.createElement("div");
        lotDiv.classList.add(
            "bg-gray-950",
            "rounded-xl",
            "shadow-lg",
            "p-4",
            "mb-4",
            "hover:shadow-xl",
            "transition",
            "duration-300",
            "ease-in-out"
        );

        const totalPrice = parseFloat(lot.priceTicket) * (1 + parseFloat(lot.taxPriceTicket) / 100);

        lotDiv.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <h5 class="text-md font-semibold text-white">${nameTicket}</h5>
                <h6 class="text-md text-white">${lot.nameLot}</h6>
            </div>
            <div class="flex flex-col items-start mb-2">
                <span class="text-sm text-gray-200">
                    R$ ${parseFloat(lot.priceTicket).toFixed(2).replace('.', ',')} + Taxa: R$ ${(parseFloat(lot.priceTicket) * (parseFloat(lot.taxPriceTicket) / 100)).toFixed(2).replace('.', ',')}
                </span>
            </div>
            <div class="flex justify-center items-center mt-2">
                <div class="flex items-center">
                    <button id="decrement_${lot.id}" class="bg-blue-500 text-white rounded-l-md px-3 py-1 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-red-300" style="height: 43px">-</button>
                    <input type="number"
                        id="quantity_${lot.id}" 
                        name="quantity_${lot.id}" 
                        min="0" 
                        max="${lot.amountTicket}" 
                        value="0" 
                        class="ticket-quantity text-center w-16 px-3 py-2 bg-gray-950 text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 sm:text-sm text-right no-spinner"
                        data-ticket-id="${lot.id}"
                        data-ticket-name="${nameTicket}"
                        data-ticket-price="${totalPrice.toFixed(2)}">
                    <button id="increment_${lot.id}" class="bg-blue-500 text-white rounded-r-md px-3 py-1 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-green-300" style="height: 43px">+</button>
                </div>
            </div>
        `;

        return lotDiv;
    }

    function setupLotEventListeners(lotDiv, lot) {
        const decrementButton = lotDiv.querySelector(`#decrement_${lot.id}`);
        const incrementButton = lotDiv.querySelector(`#increment_${lot.id}`);
        const quantityInput = lotDiv.querySelector(`#quantity_${lot.id}`);

        decrementButton.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value, 10);
            if (currentValue > 0) {
                quantityInput.value = currentValue - 1;
                updatePriceAndQuantity(lot.priceTicket, lot.taxPriceTicket, -1);
            }
        });

        incrementButton.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value, 10);
            if (currentValue < lot.amountTicket) {
                quantityInput.value = currentValue + 1;
                updatePriceAndQuantity(lot.priceTicket, lot.taxPriceTicket, 1);
            }
        });
    }

    function displayError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('bg-red-500', 'text-white', 'p-4', 'rounded-lg', 'mb-6');
        errorDiv.textContent = message;
        ticketOptions.innerHTML = '';
        ticketOptions.appendChild(errorDiv);
    }

    const { tenantId, eventId } = getUrlParams();
    if (tenantId && eventId) {
        fetchEventDetails(tenantId, eventId);
        viewDetails(tenantId, eventId);
    } else {
        console.error('Parâmetros tenantId e eventId não encontrados na URL.');
    }
});
