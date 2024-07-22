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
                slidesPerView: 3,
                spaceBetween: 30,
            }
        }
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
            slide.innerHTML = `<img src="${imagePath}" alt="Flyer Image">`;
            swiperWrapper.appendChild(slide);
        });
        initializeSwiper();
    }
}

// Chama a função para carregar os flyers ao carregar a página
document.addEventListener('DOMContentLoaded', loadFlyers);

document.getElementById("toggle-text").addEventListener("click", function (event) {
    event.preventDefault();
    var extraText = document.getElementById("extra-text");
    var toggleText = document.getElementById("toggle-text");
    if (extraText.style.display === "none") {
        extraText.style.display = "block";
        toggleText.innerHTML = "<strong>Leia menos</strong>";
    } else {
        extraText.style.display = "none";
        toggleText.innerHTML = "<strong>Leia mais</strong>";
    }
});

document.getElementById('copyrightYear').textContent = new Date().getFullYear();

let mybutton = document.getElementById("scrollToTopBtn");

window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

mybutton.onclick = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle('-translate-x-full');
}

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    const mainContent = document.querySelector('.main-content');

    modal.classList.toggle('hidden');
    mainContent.classList.toggle('blurred');
}

function toggleSidebarCart(sidebarId) {
    const sidebar = document.getElementById(sidebarId);
    sidebar.classList.toggle('translate-x-full');
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.toggle-login').forEach(button => {
        button.addEventListener('click', () => toggleModal('loginModal'));
    });

    document.querySelectorAll('.toggle-cadastro').forEach(button => {
        button.addEventListener('click', () => toggleModal('cadastroModal'));
    });

    document.querySelectorAll('.toggle-cart').forEach(button => {
        button.addEventListener('click', () => toggleSidebarCart('cartSidebar'));
    });

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