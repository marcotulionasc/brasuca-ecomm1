async function fetchImageFlyers(tenantId) {
    const url = `https://concrete-logically-kit.ngrok-free.app/api/tenants/${tenantId}/flyers`;
    const options = {
        method: "GET",
        headers: {
            'ngrok-skip-browser-warning': 'true',
            'Accept': 'application/json'
        }
    };
    
    try {
        const response = await fetch(url, options);
        console.log("URL:", url);
        console.log("Response:", response);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const imagePaths = await response.json();
        console.log("Image Flyers:", imagePaths);
        return imagePaths;
    } catch (error) {
        console.error("Failed to fetch image flyers:", error);
    }
}

function initializeSwiper() {
    new Swiper('.swiper-container', {
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}

async function loadFlyers() {
    const tenantId = 1; // Substitua pelo tenantId real
    const imagePaths = await fetchImageFlyers(tenantId);
    if (imagePaths) {
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        imagePaths.forEach(imagePath => {
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');
            slide.innerHTML = `<img src="${imagePath}" alt="Flyer Image" class="w-full h-auto">`;
            swiperWrapper.appendChild(slide);
        });
        initializeSwiper();
    }
}

// Chama a função para carregar os flyers ao carregar a página
document.addEventListener('DOMContentLoaded', loadFlyers);