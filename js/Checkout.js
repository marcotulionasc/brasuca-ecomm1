import config from './Configuration.js';

const getBaseUrl = config.getBaseUrl();

document.addEventListener("DOMContentLoaded", () => {

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
        ticketDiv.classList.add("bg-gradient-to-r", "from-blue-400", "to-indigo-500", "rounded-xl", "shadow-xl", "p-6", "mb-8", "text-white", "relative", "hover:shadow-2xl", "transition", "duration-300", "ease-in-out");

        ticketDiv.innerHTML = `
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-bold">${ticket.areaTicket}</h3>
                <span class="bg-yellow-500 text-black text-xs font-semibold px-3 py-1 rounded-full">Novo</span> <!-- Opção -->
            </div>
            <p class="mt-4 text-sm">Selecione os lugares:</p>
            <p class="mb-4 text-xs text-gray-200">Você pode selecionar até 10 lugares</p>
            <p class="mb-4 text-sm font-semibold">(Nenhum selecionado)</p>
            <details id="lots_${ticket.id}" class="bg-white text-black rounded-lg p-4 shadow-sm">
                <summary class="font-semibold cursor-pointer hover:text-indigo-500 bg-gray-100 p-2 rounded-lg transition duration-300 ease-in-out">
                    ${ticket.areaTicket}
                </summary>
            </details>
        `;
        return ticketDiv;
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
                lotDiv.classList.add("bg-gray-50", "rounded-xl", "shadow-lg", "p-4", "mb-4", "hover:shadow-xl", "transition", "duration-300", "ease-in-out");

                lotDiv.innerHTML = `
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="text-lg font-semibold text-gray-800">${lot.nameLot}</h4>
                        <span class="text-sm text-gray-600">R$ ${lot.priceTicket} + Taxa: R$ ${(lot.priceTicket * (lot.taxPriceTicket / 100)).toFixed(2)}</span>
                    </div>
                    <div class="flex justify-center items-center mt-2">
                        <div class="flex items-center">
                            <button id="decrement_${lot.id}" class="bg-blue-500 text-white rounded-l-md px-3 py-1 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-red-300"
                            style="height: 43px">-</button>
                            <input type="number" id="quantity_${lot.id}" name="quantity_${lot.id}" min="1" max="${lot.amountTicket}" value="0" class="text-center w-16 px-3 py-2 bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 sm:text-sm text-right no-spinner">
                            <button id="increment_${lot.id}" class="bg-blue-500 text-white rounded-r-md px-3 py-1 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-green-300"
                            style="height: 43px">+</button>
                        </div>
                    </div>
                `;

                lotsDiv.appendChild(lotDiv);

                const decrementButton = lotDiv.querySelector(`#decrement_${lot.id}`);
                const incrementButton = lotDiv.querySelector(`#increment_${lot.id}`);
                const quantityInput = lotDiv.querySelector(`#quantity_${lot.id}`);

                decrementButton.addEventListener('click', () => {
                    const currentValue = parseInt(quantityInput.value, 10);
                    if (currentValue > 1) {
                        quantityInput.value = currentValue - 1;
                        calculateTotals(); // Atualiza os totais após cada mudança
                    }
                });

                incrementButton.addEventListener('click', () => {
                    const currentValue = parseInt(quantityInput.value, 10);
                    if (currentValue < lot.amountTicket) {
                        quantityInput.value = currentValue + 1;
                        calculateTotals(); // Atualiza os totais após cada mudança
                    }
                });
            });

            // CSS customizado para remover os botões de incremento/decremento nativos
            const style = document.createElement('style');
            style.innerHTML = `
                /* Remove os botões de incremento/decremento no input de número */
                input[type="number"]::-webkit-outer-spin-button,
                input[type="number"]::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
            
                input[type="number"] {
                    -moz-appearance: textfield; /* Firefox */
                }
            `;
            document.head.appendChild(style);

            // Configura os eventos de clique ao carregar os lotes
        setupEventListenersForLots();

        } catch (error) {
            console.error('Error fetching lots:', error);
        }
    }

    function updateNavDisplay(totalQuantity, totalPrice) {
        const totalQuantityElement = document.querySelector('.custom-nav .text-center .font-bold');
        const totalPriceElement = document.querySelector('.custom-nav .text-center .text-2xl');

        totalQuantityElement.textContent = `${totalQuantity} Ingressos por`;
        totalPriceElement.textContent = `R$ ${totalPrice.toFixed(2)}`;
    }

    function calculateTotals() {
        let totalQuantity = 0;
        let totalPrice = 0;
    
        document.querySelectorAll('[id^=quantity_]').forEach(input => {
            const quantity = parseInt(input.value, 10);
            const lotId = input.id.split('_')[1];
    
            // Seleciona o contêiner principal do lote
            const lotDiv = document.querySelector(`#increment_${lotId}`).closest('.flex').parentElement;
    
            // Extrai o preço diretamente do elemento do preço
            const priceElement = lotDiv ? lotDiv.querySelector('span') : null;
    
            if (priceElement) {
                // Extrai o preço do texto do elemento
                const priceText = priceElement.textContent.match(/R\$\s*([\d,.]+)/);
                const lotPrice = priceText ? parseFloat(priceText[1].replace('.', '').replace(',', '.')) : 0;
    
                totalQuantity += quantity;
                totalPrice += quantity * lotPrice;
            }
        });
    
        // Atualiza a exibição na barra de navegação
        updateNavDisplay(totalQuantity, totalPrice);
    }
    
    function setupEventListenersForLots() {
        document.querySelectorAll('[id^=decrement_], [id^=increment_]').forEach(button => {
            button.addEventListener('click', function () {
                calculateTotals();
            });
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
        fetchEventConfiguration(tenantId, eventId);
    } else {
        console.error('Parâmetros tenantId e eventId não encontrados na URL.');
    }
});
