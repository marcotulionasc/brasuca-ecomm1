document.addEventListener("DOMContentLoaded", function () {
    fetchEvents();
});

let currentPage = 1;
const eventsPerPage = 12; // 4 colunas * 3 linhas

async function fetchEvents() {
    const tenantId = 1; // Substitua pelo ID real do tenant
    const url = `https://concrete-logically-kit.ngrok-free.app/api/tenants/${tenantId}/events/image`;

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

        const events = await response.json();
        displayEvents(events);
        setupPagination(events);
    } catch (error) {
        console.error('Erro ao buscar eventos:', error);
    }
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
    img.src = event.base64Image;
    img.alt = event.titleEvent ? event.titleEvent : 'Imagem do Evento';
    img.classList.add("w-full", "h-48", "object-cover", "rounded-lg");

    const textContainer = document.createElement("div");
    textContainer.classList.add("mt-4", "text-center");

    const title = document.createElement("h2");
    title.classList.add("text-xl", "font-bold");
    title.style.color = "var(--secondary-color)";
    title.textContent = event.titleEvent;

    const date = document.createElement("p");
    date.style.color = "var(--primary-text-color)";
    date.textContent = new Date(event.date).toLocaleDateString();

    const address = document.createElement("p");
    address.style.color = "var(--primary-text-color)";
    address.textContent = event.address;

    textContainer.appendChild(title);
    textContainer.appendChild(date);
    textContainer.appendChild(address);

    const button = document.createElement("button");
    button.classList.add("px-4", "py-2", "rounded", "mt-4");
    button.style.backgroundColor = "var(--primary-color)";
    button.style.color = "var(--background-color)";
    button.textContent = "COMPRAR";
    button.addEventListener("click", () => {
        window.location.href = `../index.html`;
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
