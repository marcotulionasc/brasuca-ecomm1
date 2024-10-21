import config from './Configuration.js';

const getBaseUrl = config.getBaseUrl();

async function fetchImageFlyers(tenantId) {
    const url = `${getBaseUrl}/api/tenants/${tenantId}/flyers`;
    const options = {
        method: "GET",
        headers: {
            'ngrok-skip-browser-warning': 'true',
            'Accept': 'application/json'
        }
    };
    
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const imagePaths = await response.json();
        return imagePaths;
    } catch (error) {
        console.error("Failed to fetch image flyers:", error);
    }
}

function initializeSwiper() {
    new Swiper('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2, // Mostra dois slides em telas médias
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3, // Mostra três slides em telas grandes
                spaceBetween: 30,
            }
        }
    });
}

async function loadFlyers() {
    const tenantId = 1;
    const imagePaths = await fetchImageFlyers(tenantId);
    if (imagePaths) {
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        imagePaths.forEach(imagePath => {
            const slide = document.createElement('div');
            slide.classList.add(
                'mt-4',
                'swiper-slide', 
                'bg-gray-950', 
                'rounded-md', 
                'shadow-lg', 
                'overflow-hidden', 
                'p-3', 
                'flex', 
                'items-center', 
                'justify-center', 
                'transition-transform', 
                'duration-300', 
                'hover:scale-105', 
                'hover:shadow-xl');
            
            slide.innerHTML = `
                <img src="${imagePath}" alt="Flyer Image" class="w-full h-64 object-cover rounded-md">
            `;
            swiperWrapper.appendChild(slide);
        });
        initializeSwiper();
    }
}


document.addEventListener('DOMContentLoaded', loadFlyers);

document.getElementById('copyrightYear').textContent = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', () => {

    const cpfInput = document.getElementById('cadastroCPF');
    if (cpfInput) {
        cpfInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    }
});

function formatDate(date) {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date).replace(/ /g, ' ').toUpperCase();
}

document.addEventListener('DOMContentLoaded', function () {
    const today = new Date();
    document.getElementById('startDate').placeholder = formatDate(today);
    document.getElementById('endDate').placeholder = formatDate(today);

    flatpickr(".datepicker", {});
});