document.addEventListener("DOMContentLoaded", function () {
    fetchEvents();
});

function fetchEvents() {
    const tenantId = 1; // Substitua pelo ID real do tenant
    fetch(`https://concrete-logically-kit.ngrok-free.app/api/tenants/${tenantId}/events`)
        .then(response => response.json())
        .then(events => {
            const container = document.querySelector(".grid");
            container.innerHTML = ''; // Limpar o conteúdo existente

            events.forEach(event => {
                const eventElement = createEventElement(event);
                container.appendChild(eventElement);
            });
        })
        .catch(error => console.error('Erro ao buscar eventos:', error));
}

function createEventElement(event) {
    const eventDiv = document.createElement("div");
    eventDiv.classList.add("relative", "group", "border", "border-gray-300", "rounded-lg", "p-4");

    const img = document.createElement("img");
    img.src = `data:image/jpeg;base64,${event.imageEvent}`;
    img.alt = event.nameEvent;
    img.classList.add("w-full", "h-auto", "rounded-lg");

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
    address.textContent = event.address;

    textContainer.appendChild(title);
    textContainer.appendChild(date);
    textContainer.appendChild(local);
    textContainer.appendChild(address);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("absolute", "inset-0", "bg-background-color", "bg-opacity-75", "flex", "justify-center", "items-center", "opacity-0", "group-hover:opacity-100", "transition-opacity", "duration-300");

    const button = document.createElement("button");
    button.classList.add("px-4", "py-2", "rounded");
    button.style.backgroundColor = "var(--primary-color)";
    button.style.color = "var(--background-color)";
    button.textContent = "COMPRAR";
    button.addEventListener("click", () => {
        // Redirecionar para a página de compra do evento específico
        window.location.href = `../index.html}`; // comprar-evento/${event.id}
    });

    buttonContainer.appendChild(button);

    eventDiv.appendChild(img);
    eventDiv.appendChild(textContainer);
    eventDiv.appendChild(buttonContainer);

    return eventDiv;
}
