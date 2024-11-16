import config from './Configuration.js';

const getBaseUrl = config.getBaseUrl();

document.addEventListener("DOMContentLoaded", function () {
    fetchEvents();
});

let currentPage = 1;
const eventsPerPage = 12;

async function fetchEvents() {
    const tenantId = 1;
    const url = `${getBaseUrl}/api/tenants/${tenantId}/events/image`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
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
    container.innerHTML = '';

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
    eventDiv.classList.add(
        "relative",
        "group",
        "border",
        "border-gray-700",
        "rounded-lg",
        "p-4",
        "bg-gray-950",
        "shadow-lg",
        "transition-transform",
        "duration-300",
        "hover:scale-105",
        "hover:shadow-xl"
    );

    const img = document.createElement("img");
    img.src = event.base64Image ? event.base64Image : 'path/to/default-image.jpg'; // Imagem padrão caso não tenha
    img.alt = event.titleEvent ? event.titleEvent : 'Imagem do Evento';
    img.classList.add("w-full", "h-48", "object-cover", "rounded-lg");

    const textContainer = document.createElement("div");
    textContainer.classList.add("mt-4", "text-center");

    const title = document.createElement("h2");
    title.classList.add("text-lg", "font-bold", "text-white"); // Texto claro para melhor contraste
    title.textContent = event.titleEvent;

    const date = document.createElement("p");
    date.classList.add("text-gray-400", "text-sm", "mt-2"); // Texto claro
    const dateObj = event.date.split('-');
    const dateFormatted = `${dateObj[2]}/${dateObj[1]}/${dateObj[0]}`;

    date.textContent = dateFormatted || "Data não disponível";

    const address = document.createElement("p");
    address.classList.add("text-gray-400", "text-sm"); // Texto claro
    address.textContent = event.address;

    const button = document.createElement("button");
    button.classList.add(
        "px-6",
        "py-2",
        "bg-green-500",
        "text-white",
        "rounded-lg",
        "mt-4",
        "hover:bg-green-600",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-green-500",
        "transition",
        "duration-300"
    );
    button.textContent = "COMPRAR";
    button.addEventListener("click", () => {
        handleEventClick(1, event.id);
    });

    textContainer.appendChild(title);
    textContainer.appendChild(date);
    textContainer.appendChild(address);
    textContainer.appendChild(button);

    eventDiv.appendChild(img);
    eventDiv.appendChild(textContainer);

    return eventDiv;
}


function handleEventClick(tenantId, eventId) {
    window.location.href = `event.html?tenantId=${tenantId}&eventId=${eventId}`;
}

function setupPagination(events) {
    const paginationContainer = document.querySelector("#pagination");
    paginationContainer.innerHTML = '';

    const pageCount = Math.ceil(events.length / eventsPerPage);

    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.classList.add(
            "mx-1",
            "px-4",
            "py-2",
            "rounded-lg",
            "border",
            "border-gray-300",
            "transition-colors",
            "duration-300",
            "hover:bg-secondary-color",
            "hover:text-white"
        );
        if (i === currentPage) {
            button.classList.add("bg-secondary-color", "text-white");
        } else {
            button.classList.add("bg-white", "text-gray-800");
        }

        button.addEventListener("click", () => {
            currentPage = i;
            displayEvents(events);
            setupPagination(events);
        });

        paginationContainer.appendChild(button);
    }
}
