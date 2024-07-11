document.addEventListener("DOMContentLoaded", function () {
    fetchEvents();
});

let currentPage = 1;
const eventsPerPage = 12; // 4 colunas * 3 linhas

function fetchEvents() {
    const tenantId = 1; // Substitua pelo ID real do tenant
    fetch(`https://concrete-logically-kit.ngrok-free.app/api/tenants/${tenantId}/events`, {
        method: "GET",
        headers: {
            'ngrok-skip-browser-warning': 'true',
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(events => {
        displayEvents(events);
        setupPagination(events);
    })
    .catch(error => console.error('Erro ao buscar eventos:', error));
}

function displayEvents(events) {
    const container = document.querySelector("#eventGrid");
    container.innerHTML = ''; // Limpar o conteúdo existente

    const start = (currentPage - 1) * eventsPerPage;
    const end = start + eventsPerPage;
    const paginatedEvents = events.slice(start, end);

    paginatedEvents.forEach(event => {
        const eventElement = createEventElement(event);
        container.appendChild(eventElement);
    });
}

function createEventElement(event) {
    const eventDiv = document.createElement("div");
    eventDiv.classList.add("relative", "group", "border", "border-gray-300", "rounded-lg", "p-4");

    const img = document.createElement("img");
    const imagePath = event.imageFlyer 
        ? `https://concrete-logically-kit.ngrok-free.app${event.imageFlyer}` 
        : 'https://via.placeholder.com/300x150.png?text=Imagem+Indisponível';
    img.src = imagePath;
    img.alt = event.titleEvent ? event.titleEvent : 'Imagem do Evento';
    img.classList.add("w-full", "h-48", "object-cover", "rounded-lg"); // Definindo altura fixa

    // Adicionando cabeçalho de aceitação para imagens
    img.addEventListener('load', () => {
        fetch(imagePath, {
            method: "GET",
            headers: {
                'Accept': 'image/*'
            }
        });
    });

    const textContainer = document.createElement("div");
    textContainer.classList.add("mt-4", "text-center");

    const title = document.createElement("h2");
    title.classList.add("text-xl", "font-bold");
    title.style.color = "var(--secondary-color)";
    title.textContent = event.titleEvent;

    const date = document.createElement("p");
    date.style.color = "var(--primary-text-color)";
    date.textContent = new Date(event.date).toLocaleDateString();

    const local = document.createElement("p");
    local.style.color = "var(--primary-text-color)";
    local.textContent = event.local;

    const address = document.createElement("p");
    address.style.color = "var(--primary-text-color)";
    address.textContent = event.address ? `${event.address.street}, ${event.address.city}` : 'Endereço não disponível';

    textContainer.appendChild(title);
    textContainer.appendChild(date);
    textContainer.appendChild(local);
    textContainer.appendChild(address);

    const button = document.createElement("button");
    button.classList.add("px-4", "py-2", "rounded", "mt-4");
    button.style.backgroundColor = "var(--primary-color)";
    button.style.color = "var(--background-color)";
    button.textContent = "COMPRAR";
    button.addEventListener("click", () => {
        // Redirecionar para a página de compra do evento específico
        window.location.href = `../index.html`; // Substitua pela URL correta
    });

    textContainer.appendChild(button);

    eventDiv.appendChild(img);
    eventDiv.appendChild(textContainer);

    return eventDiv;
}

function setupPagination(events) {
    const paginationContainer = document.querySelector("#pagination");
    paginationContainer.innerHTML = ''; // Limpar a paginação existente

    const pageCount = Math.ceil(events.length / eventsPerPage);

    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        if (i === currentPage) {
            button.style.backgroundColor = "var(--secondary-color)";
        }
        button.addEventListener("click", () => {
            currentPage = i;
            displayEvents(events);
            setupPagination(events);
        });
        paginationContainer.appendChild(button);
    }
}
