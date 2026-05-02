// ==================== HEADER: SCROLL EFFECT ====================
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ==================== BURGER MENU ====================
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('active');
});

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        nav.classList.remove('active');
    });
});

// ==================== PARALLAX EFFECT ====================
const parallaxElement = document.querySelector('.hero__parallax');

window.addEventListener('scroll', () => {
    if (parallaxElement) {
        const scrolled = window.scrollY;
        parallaxElement.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ==================== SCROLL ANIMATION ====================
const animatedElements = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

animatedElements.forEach(el => observer.observe(el));

// ==================== CALCULATOR TABS ====================
const tabs = document.querySelectorAll('.calculator__tab');
const panels = document.querySelectorAll('.calculator__panel');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        
        tab.classList.add('active');
        const target = tab.getAttribute('data-tab');
        document.getElementById(`panel-${target}`).classList.add('active');
    });
});

// ==================== ROAD CALCULATOR ====================
const asphaltSlider = document.getElementById('asphalt-slider');
const pgsSlider = document.getElementById('pgs-slider');
const gravelSlider = document.getElementById('gravel-slider');

const asphaltValue = document.getElementById('asphalt-value');
const pgsValue = document.getElementById('pgs-value');
const gravelValue = document.getElementById('gravel-value');

const roadTotal = document.getElementById('road-total');
const roadDetails = document.getElementById('road-details');

function updateRoadCalculator() {
    const asphalt = parseInt(asphaltSlider.value);
    const pgs = parseInt(pgsSlider.value);
    const gravel = parseInt(gravelSlider.value);
    
    const asphaltCost = asphalt * 1000;
    const pgsCost = pgs * 200;
    const gravelCost = gravel * 150;
    const groundCost = 1000;
    
    const total = asphaltCost + pgsCost + gravelCost + groundCost;
    
    asphaltValue.textContent = `${asphalt} см`;
    pgsValue.textContent = `${pgs} см`;
    gravelValue.textContent = `${gravel} см`;
    
    roadTotal.textContent = `${total.toLocaleString('ru-RU')} ₸`;
    roadDetails.textContent = `Асфальт: ${asphalt} × 1 000 = ${asphaltCost.toLocaleString('ru-RU')} ₸ · ПГС: ${pgs} × 200 = ${pgsCost.toLocaleString('ru-RU')} ₸ · Щебень: ${gravel} × 150 = ${gravelCost.toLocaleString('ru-RU')} ₸ · Грунт: ${groundCost.toLocaleString('ru-RU')} ₸`;
}

asphaltSlider.addEventListener('input', updateRoadCalculator);
pgsSlider.addEventListener('input', updateRoadCalculator);
gravelSlider.addEventListener('input', updateRoadCalculator);

// ==================== TILE CALCULATOR ====================
const tileOptions = document.querySelectorAll('.calculator__option');
const tileAreaSlider = document.getElementById('tile-area-slider');
const tileAreaValue = document.getElementById('tile-area-value');
const tileTotal = document.getElementById('tile-total');
const tileDetails = document.getElementById('tile-details');

let selectedTilePrice = 6000;

tileOptions.forEach(option => {
    option.addEventListener('click', () => {
        tileOptions.forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        selectedTilePrice = parseInt(option.getAttribute('data-price'));
        updateTileCalculator();
    });
});

function updateTileCalculator() {
    const area = parseInt(tileAreaSlider.value);
    const materialCost = area * selectedTilePrice;
    const workMin = area * 3000;
    const workMax = area * 8000;
    
    tileAreaValue.textContent = `${area} м²`;
    tileTotal.textContent = `${(materialCost + workMin).toLocaleString('ru-RU')} - ${(materialCost + workMax).toLocaleString('ru-RU')} ₸`;
    tileDetails.textContent = `Материал: ${materialCost.toLocaleString('ru-RU')} ₸ · Работа: ${workMin.toLocaleString('ru-RU')} - ${workMax.toLocaleString('ru-RU')} ₸`;
}

tileAreaSlider.addEventListener('input', updateTileCalculator);

// ==================== LANDSCAPE CALCULATOR ====================
const landscapeCheckboxes = document.querySelectorAll('#panel-landscape input[type="checkbox"]');
const landscapeAreaSlider = document.getElementById('landscape-area-slider');
const landscapeAreaValue = document.getElementById('landscape-area-value');
const landscapeTotal = document.getElementById('landscape-total');
const landscapeDetails = document.querySelector('#panel-landscape .calculator__details');

function updateLandscapeCalculator() {
    const area = parseInt(landscapeAreaSlider.value);
    let total = 0;
    let detailsText = '';
    
    landscapeCheckboxes.forEach(cb => {
        if (cb.checked) {
            const price = parseInt(cb.getAttribute('data-price'));
            const cost = area * price;
            total += cost;
            detailsText += `${cb.parentElement.textContent.trim().split('(')[0].trim()}: ${cost.toLocaleString('ru-RU')} ₸ · `;
        }
    });
    
    landscapeAreaValue.textContent = `${area} м²`;
    
    if (total === 0) {
        landscapeTotal.textContent = '0 ₸';
        landscapeDetails.textContent = 'Выберите услуги для расчёта';
    } else {
        landscapeTotal.textContent = `${total.toLocaleString('ru-RU')} ₸`;
        landscapeDetails.textContent = detailsText.slice(0, -3);
    }
}

landscapeCheckboxes.forEach(cb => {
    cb.addEventListener('change', updateLandscapeCalculator);
});
landscapeAreaSlider.addEventListener('input', updateLandscapeCalculator);

// ==================== REVIEWS SLIDER ====================
const track = document.getElementById('reviews-track');
const prevBtn = document.getElementById('review-prev');
const nextBtn = document.getElementById('review-next');

let reviewIndex = 0;
const reviewCards = document.querySelectorAll('.review-card');
const cardWidth = reviewCards.length > 0 ? reviewCards[0].offsetWidth + 24 : 350;

function updateReviewSlider() {
    track.style.transform = `translateX(-${reviewIndex * cardWidth}px)`;
}

prevBtn.addEventListener('click', () => {
    if (reviewIndex > 0) {
        reviewIndex--;
        updateReviewSlider();
    }
});

nextBtn.addEventListener('click', () => {
    if (reviewIndex < reviewCards.length - 1) {
        reviewIndex++;
        updateReviewSlider();
    }
});

// ==================== FORM SUBMISSION ====================
const contactForm = document.querySelector('.contact__form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = contactForm.querySelector('input[type="text"]').value;
    const phone = contactForm.querySelector('input[type="tel"]').value;
    
    if (name && phone) {
        alert(`Спасибо, ${name}! Мы свяжемся с вами в течение 15 минут.`);
        contactForm.reset();
    } else {
        alert('Пожалуйста, заполните обязательные поля.');
    }
});

// ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== INIT ====================
updateRoadCalculator();
updateTileCalculator();
updateLandscapeCalculator();