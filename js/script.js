// ==================== HEADER: SCROLL EFFECT ====================
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// ==================== BURGER MENU ====================
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('active');
});
document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        nav.classList.remove('active');
    });
});

// ==================== PARALLAX ====================
const parallaxBg = document.querySelector('.hero__bg-image');
if (parallaxBg) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const speed = window.innerWidth <= 768 ? 0.2 : 0.4;
        parallaxBg.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
    });
}

// ==================== SCROLL ANIMATION ====================
const animatedElements = document.querySelectorAll('[data-animate]');
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            scrollObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
animatedElements.forEach(el => scrollObserver.observe(el));

// ==================== CALCULATOR TABS ====================
const tabs = document.querySelectorAll('.calculator__tab');
const panels = document.querySelectorAll('.calculator__panel');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`panel-${tab.getAttribute('data-tab')}`).classList.add('active');
    });
});

// ==================== ROAD CALCULATOR ====================
const roadTypes = document.querySelectorAll('.road-calc__type');
const asphaltSlider = document.getElementById('asphalt-slider');
const pgsSlider = document.getElementById('pgs-slider');
const gravelSlider = document.getElementById('gravel-slider');
const soilSlider = document.getElementById('soil-slider');
const soilValue = document.getElementById('soil-value');
const asphaltValue = document.getElementById('asphalt-value');
const pgsValue = document.getElementById('pgs-value');
const gravelValue = document.getElementById('gravel-value');
const roadTotal = document.getElementById('road-total');
const roadDetails = document.getElementById('road-details');

const roadPresets = {
    econom: { asphalt: 5, pgs: 5, gravel: 10, soil: 10 },
    standard: { asphalt: 6, pgs: 7, gravel: 15, soil: 15 },
    premium: { asphalt: 8, pgs: 10, gravel: 20, soil: 20 }
};

roadTypes.forEach(btn => {
    btn.addEventListener('click', () => {
        roadTypes.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const type = btn.getAttribute('data-type');
        const preset = roadPresets[type];
        if (asphaltSlider) {
            asphaltSlider.value = preset.asphalt;
            pgsSlider.value = preset.pgs;
            gravelSlider.value = preset.gravel;
            if (soilSlider) soilSlider.value = preset.soil;
            updateRoadCalculator();
        }
    });
});

function updateRoadCalculator() {
    if (!asphaltSlider) return;
    const a = +asphaltSlider.value;
    const p = +pgsSlider.value;
    const g = +gravelSlider.value;
    const s = soilSlider ? +soilSlider.value : 10;

    const ac = a * 1000;
    const pc = p * 200;
    const gc = g * 150;
    const sc = s * 100;
    const total = ac + pc + gc + sc;

    if (asphaltValue) asphaltValue.textContent = `${a} см`;
    if (pgsValue) pgsValue.textContent = `${p} см`;
    if (gravelValue) gravelValue.textContent = `${g} см`;
    if (soilValue) soilValue.textContent = `${s} см`;
    if (roadTotal) roadTotal.textContent = `${total.toLocaleString('ru-RU')} ₸`;
    if (roadDetails) roadDetails.textContent = `Асфальт: ${ac.toLocaleString('ru-RU')} ₸ · ПГС: ${pc.toLocaleString('ru-RU')} ₸ · Щебень: ${gc.toLocaleString('ru-RU')} ₸ · Грунт: ${sc.toLocaleString('ru-RU')} ₸`;

    updateCalc3DLayers(a, p, g, s);

    const currentType = document.querySelector('.road-calc__type.active');
    if (currentType) {
        const type = currentType.getAttribute('data-type');
        const preset = roadPresets[type];
        if (a !== preset.asphalt || p !== preset.pgs || g !== preset.gravel || s !== preset.soil) {
            roadTypes.forEach(b => b.classList.remove('active'));
        }
    }
}

if (asphaltSlider) {
    asphaltSlider.addEventListener('input', updateRoadCalculator);
    pgsSlider.addEventListener('input', updateRoadCalculator);
    gravelSlider.addEventListener('input', updateRoadCalculator);
    if (soilSlider) soilSlider.addEventListener('input', updateRoadCalculator);
}

// Кнопка Сброс
const resetRoadBtn = document.getElementById('reset-road');
if (resetRoadBtn) {
    resetRoadBtn.addEventListener('click', () => {
        if (asphaltSlider) asphaltSlider.value = 5;
        if (pgsSlider) pgsSlider.value = 5;
        if (gravelSlider) gravelSlider.value = 10;
        if (soilSlider) soilSlider.value = 10;
        updateRoadCalculator();
        roadTypes.forEach(b => b.classList.remove('active'));
        const economBtn = document.querySelector('.road-calc__type[data-type="econom"]');
        if (economBtn) economBtn.classList.add('active');
    });
}

// ==================== 3D СЛОИ КАЛЬКУЛЯТОРА ====================
function updateCalc3DLayers(a, p, g, s) {
    const containerHeight = 200; // фиксированная высота в px
    const totalCm = a + p + g + s;
    const scale = containerHeight / totalCm;

    const aLayer = document.getElementById('calc-layer-asphalt');
    const pLayer = document.getElementById('calc-layer-pgs');
    const gLayer = document.getElementById('calc-layer-gravel');
    const sLayer = document.getElementById('calc-layer-soil');
    const aLabel = document.getElementById('calc-asphalt-label');
    const pLabel = document.getElementById('calc-pgs-label');
    const gLabel = document.getElementById('calc-gravel-label');
    const sLabel = document.getElementById('calc-soil-label');
    const totalD = document.getElementById('calc-total-depth');

    if (!aLayer) return;

    const aH = a * scale;
    const pH = p * scale;
    const gH = g * scale;
    const sH = s * scale;

    const pTop = aH;
    const gTop = aH + pH;
    const sTop = aH + pH + gH;

    aLayer.style.height = aH + 'px';
    aLayer.style.top = '0';

    pLayer.style.height = pH + 'px';
    pLayer.style.top = pTop + 'px';

    gLayer.style.height = gH + 'px';
    gLayer.style.top = gTop + 'px';

    sLayer.style.height = sH + 'px';
    sLayer.style.top = sTop + 'px';

    if (aLabel) aLabel.textContent = a + ' см';
    if (pLabel) pLabel.textContent = p + ' см';
    if (gLabel) gLabel.textContent = g + ' см';
    if (sLabel) sLabel.textContent = s + ' см';
    if (totalD) totalD.textContent = totalCm + ' см';
}

// ==================== TILE CALCULATOR ====================
let selectedTilePrice = 6000;
const tileOptions = document.querySelectorAll('.calculator__option');
const tileAreaSlider = document.getElementById('tile-area-slider');
const tileAreaValue = document.getElementById('tile-area-value');
const tileTotal = document.getElementById('tile-total');
const tileDetails = document.getElementById('tile-details');

function updateTileCalculator() {
    if (!tileAreaSlider) return;
    const area = +tileAreaSlider.value;
    const mat = area * selectedTilePrice;
    const wMin = area * 3000, wMax = area * 8000;
    if (tileAreaValue) tileAreaValue.textContent = `${area} м²`;
    if (tileTotal) tileTotal.textContent = `${(mat + wMin).toLocaleString('ru-RU')} - ${(mat + wMax).toLocaleString('ru-RU')} ₸`;
    if (tileDetails) tileDetails.textContent = `Материал: ${mat.toLocaleString('ru-RU')} ₸ · Работа: ${wMin.toLocaleString('ru-RU')} - ${wMax.toLocaleString('ru-RU')} ₸`;
}
if (tileAreaSlider) {
    tileOptions.forEach(opt => opt.addEventListener('click', () => {
        tileOptions.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        selectedTilePrice = +opt.getAttribute('data-price');
        updateTileCalculator();
    }));
    tileAreaSlider.addEventListener('input', updateTileCalculator);
}

// ==================== LANDSCAPE CALCULATOR ====================
const landscapeCheckboxes = document.querySelectorAll('#panel-landscape input[type="checkbox"]');
const landscapeAreaSlider = document.getElementById('landscape-area-slider');
const landscapeAreaValue = document.getElementById('landscape-area-value');
const landscapeTotal = document.getElementById('landscape-total');
const landscapeDetails = document.querySelector('#panel-landscape .calculator__details');

function updateLandscapeCalculator() {
    if (!landscapeAreaSlider) return;
    const area = +landscapeAreaSlider.value;
    let total = 0, txt = '';
    landscapeCheckboxes.forEach(cb => {
        if (cb.checked) {
            const cost = area * (+cb.getAttribute('data-price'));
            total += cost;
            txt += `${cb.parentElement.textContent.trim().split('(')[0].trim()}: ${cost.toLocaleString('ru-RU')} ₸ · `;
        }
    });
    if (landscapeAreaValue) landscapeAreaValue.textContent = `${area} м²`;
    if (landscapeTotal) landscapeTotal.textContent = total ? `${total.toLocaleString('ru-RU')} ₸` : '0 ₸';
    if (landscapeDetails) landscapeDetails.textContent = total ? txt.slice(0, -3) : 'Выберите услуги для расчёта';
}
if (landscapeAreaSlider) {
    landscapeCheckboxes.forEach(cb => cb.addEventListener('change', updateLandscapeCalculator));
    landscapeAreaSlider.addEventListener('input', updateLandscapeCalculator);
}

// ==================== REVIEWS SLIDER ====================
const track = document.getElementById('reviews-track');
const reviewPrevBtn = document.getElementById('review-prev');
const reviewNextBtn = document.getElementById('review-next');
let reviewIndex = 0;
const reviewCards = document.querySelectorAll('.review-card');
const cardWidth = reviewCards.length ? reviewCards[0].offsetWidth + 24 : 350;

function updateReviewSlider() {
    if (track) track.style.transform = `translateX(-${reviewIndex * cardWidth}px)`;
}
if (reviewPrevBtn && reviewNextBtn) {
    reviewPrevBtn.addEventListener('click', () => { if (reviewIndex > 0) { reviewIndex--; updateReviewSlider(); } });
    reviewNextBtn.addEventListener('click', () => { if (reviewIndex < reviewCards.length - 1) { reviewIndex++; updateReviewSlider(); } });
}

// ==================== FORM ====================
const contactForm = document.querySelector('.contact__form');
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = contactForm.querySelector('input[type="text"]').value;
        const phone = contactForm.querySelector('input[type="tel"]').value;
        alert(name && phone ? `Спасибо, ${name}! Мы свяжемся в течение 15 минут.` : 'Заполните обязательные поля.');
        if (name && phone) contactForm.reset();
    });
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        e.preventDefault();
        const t = document.querySelector(this.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ==================== PROCESS: ПРОГРЕСС-БАР ====================
const processSection = document.getElementById('process');
const processDots = document.querySelectorAll('.process__dot');
const processZigzag = document.querySelector('.process__zigzag');

if (processSection && processZigzag) {
    const progressStyle = document.createElement('style');
    progressStyle.textContent = `.process__zigzag::after { height: var(--progress-height, 0%) !important; }`;
    document.head.appendChild(progressStyle);

    const updateProgress = () => {
        const rect = processSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const startPoint = windowHeight * 0.6;
        const endPoint = -rect.height + windowHeight * 0.4;
        let progress = (startPoint - rect.top) / (startPoint - endPoint);
        progress = Math.max(0, Math.min(1, progress));
        const progressPercent = progress * 100;
        processZigzag.style.setProperty('--progress-height', `${progressPercent}%`);
        const activeIndex = Math.floor(progress * 5);
        processDots.forEach((dot, i) => {
            dot.classList.toggle('active', i < activeIndex || (i === activeIndex && progress > 0));
        });
    };
    window.addEventListener('scroll', updateProgress);
    updateProgress();
}

// ==================== ДО/ПОСЛЕ СЛАЙДЕР ====================
const baCompare = document.getElementById('ba-compare');
const baDivider = document.getElementById('ba-divider');
const baTopImage = document.getElementById('ba-after-side');
const baTabs = document.querySelectorAll('.ba__tab');

const projectsData = {
    1: {
        before: './imgs/ba/6.png',
        after: './imgs/ba/7.png',
        area: '450 м²', days: '5 дней', year: '2026'
    },
    2: {
        before: './imgs/ba/4.png',
        after: './imgs/ba/3.png',
        area: '320 м²', days: '7 дней', year: '2026'
    },
    3: {
        before: './imgs/ba/5.png',
        after: './imgs/ba/3.png',
        area: '800 м²', days: '14 дней', year: '2026'
    },
    4: {
        before: './imgs/ba/6.png',
        after: './imgs/ba/7.png',
        area: '200 м²', days: '3 дня', year: '2026'
    },
    5: {
        before: './imgs/ba/8.png',
        after: './imgs/ba/9.png',
        area: '1200 м²', days: '21 день', year: '2025'
    }
};

// Переключение проектов
baTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        baTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const id = tab.getAttribute('data-project');
        const data = projectsData[id];
        document.getElementById('ba-before-img').src = data.before;
        document.getElementById('ba-after-img').src = data.after;
        document.getElementById('ba-area').textContent = data.area;
        document.getElementById('ba-days').textContent = data.days;
        document.getElementById('ba-year').textContent = data.year;
        setDivider(50);
    });
});

function setDivider(percent) {
    // Верхнее фото открывается СЛЕВА (показывает ПОСЛЕ)
    // Когда percent = 0 — видно только ДО (нижнее)
    // Когда percent = 100 — видно только ПОСЛЕ (верхнее полностью)
    baTopImage.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    baDivider.style.left = percent + '%';
}

// Drag
if (baCompare && baDivider && baTopImage) {
    let dragging = false;

    const move = (clientX) => {
        const rect = baCompare.getBoundingClientRect();
        let x = clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        setDivider((x / rect.width) * 100);
    };

    baCompare.addEventListener('mousedown', (e) => { dragging = true; move(e.clientX); });
    window.addEventListener('mousemove', (e) => { if (dragging) move(e.clientX); });
    window.addEventListener('mouseup', () => { dragging = false; });

    baCompare.addEventListener('touchstart', (e) => { dragging = true; move(e.touches[0].clientX); }, { passive: true });
    baCompare.addEventListener('touchmove', (e) => { if (dragging) move(e.touches[0].clientX); }, { passive: true });
    baCompare.addEventListener('touchend', () => { dragging = false; });

    setDivider(50);
}


// ==================== ФИЛЬТР ПРОЕКТОВ ====================
const myProjectFilters = document.querySelectorAll('.myprojects__filter');
const myProjectCards = document.querySelectorAll('.myprojects__grid .project-card');

if (myProjectFilters.length && myProjectCards.length) {
    myProjectFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            myProjectFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');

            const category = filter.getAttribute('data-filter');

            myProjectCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.classList.remove('hidden');
                    card.style.position = '';
                    card.style.visibility = '';
                } else {
                    card.classList.add('hidden');
                    setTimeout(() => {
                        if (card.classList.contains('hidden')) {
                            card.style.position = 'absolute';
                            card.style.visibility = 'hidden';
                        }
                    }, 400);
                }
            });
        });
    });
}


// ==================== FAQ АККОРДЕОН ====================
const faqQuestions = document.querySelectorAll('.faq__question');
const faqSearch = document.getElementById('faq-search');
const faqItems = document.querySelectorAll('.faq__item');

// Аккордеон
faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isActive = item.classList.contains('active');

        // Закрыть все
        faqItems.forEach(fi => fi.classList.remove('active'));

        // Открыть текущий (если был не активен)
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Поиск
if (faqSearch) {
    faqSearch.addEventListener('input', () => {
        const query = faqSearch.value.toLowerCase().trim();

        faqItems.forEach(item => {
            const keywords = item.getAttribute('data-faq') || '';
            const questionText = item.querySelector('.faq__text').textContent.toLowerCase();

            if (!query || keywords.includes(query) || questionText.includes(query)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    });
}

// ==================== ANATOMY 3D ====================
const anatomy3dLayers = document.querySelectorAll('.anatomy__3d-layer');
const anatomyDots = document.querySelectorAll('.anatomy__dot');
const anatomyPrevBtn = document.getElementById('anatomy-prev');
const anatomyNextBtn = document.getElementById('anatomy-next');
const anatomyStep = document.getElementById('anatomy-step');
const anatomyTitle = document.getElementById('anatomy-title');
const anatomyDesc = document.getElementById('anatomy-desc');
const anatomyThickness = document.getElementById('anatomy-thickness');
const anatomyRoad = document.getElementById('anatomy-3d-road');

const layersData = [
    { id: 4, name: 'Асфальтовое покрытие', desc: 'Гладкий, прочный финиш — с гарантией до 5 лет.', thickness: '5 см', step: '04 / 04', rotateX: 25, rotateY: -6 },
    { id: 3, name: 'Щебёночное основание', desc: 'Несущий слой для тяжёлых нагрузок — от пешеходов до грузовиков.', thickness: '25 см', step: '03 / 04', rotateX: 32, rotateY: -10 },
    { id: 2, name: 'Песчаная подушка', desc: 'Дренаж и амортизация — защита от воды и морозного пучения.', thickness: '30 см', step: '02 / 04', rotateX: 38, rotateY: -14 },
    { id: 1, name: 'Подготовка грунта', desc: 'Геодезия и уплотнение — чтобы покрытие не просело через год.', thickness: 'основа', step: '01 / 04', rotateX: 45, rotateY: -18 }
];

let currentLayer = -1;
let isBuilding = false;
let autoPlayStarted = false;

function resetAllLayers() {
    anatomy3dLayers.forEach(layer => {
        layer.classList.remove('active', 'built');
        layer.style.opacity = '0';
        layer.style.transform = 'translateY(80px) scale(0.9)';
        layer.style.filter = '';
        layer.style.zIndex = '';
        layer.style.pointerEvents = 'none';
        layer.style.transition = 'none';
    });
    currentLayer = -1;
    updateAnatomyButtons();
    updateAnatomyDots(-1);
}

function showLayer(i, active) {
    const layer = anatomy3dLayers[i];
    layer.classList.add('built');
    layer.style.pointerEvents = 'auto';
    layer.style.transition = 'all 0.3s ease';
    if (active) {
        layer.classList.add('active');
        layer.style.opacity = '1';
        layer.style.transform = 'translateY(0) scale(1.05)';
        layer.style.filter = 'brightness(1.35) saturate(1.25)';
        layer.style.zIndex = '20';
    } else {
        layer.classList.remove('active');
        layer.style.opacity = '0.75';
        layer.style.transform = 'translateY(0) scale(1)';
        layer.style.filter = 'brightness(0.85)';
        layer.style.zIndex = String(10 - i);
    }
}

function animateLayerIn(i) {
    return new Promise(resolve => {
        const layer = anatomy3dLayers[i];
        layer.classList.add('built', 'active');
        layer.style.pointerEvents = 'auto';
        layer.style.zIndex = '20';
        layer.style.transition = 'none';
        layer.style.opacity = '0';
        layer.style.transform = 'translateY(-60px) scale(0.85)';
        const prev = i < 3 ? anatomy3dLayers[i + 1] : null;
        if (prev && prev.classList.contains('built')) {
            prev.classList.remove('active');
            prev.style.transition = 'all 0.3s ease';
            prev.style.opacity = '0.75';
            prev.style.transform = 'translateY(0) scale(1)';
            prev.style.filter = 'brightness(0.85)';
            prev.style.zIndex = String(10 - (i + 1));
        }
        requestAnimationFrame(() => {
            layer.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            layer.style.opacity = '1';
            layer.style.transform = 'translateY(0) scale(1.05)';
            layer.style.filter = 'brightness(1.35) saturate(1.25)';
        });
        currentLayer = i;
        updateAnatomyUI(i);
        setTimeout(resolve, 650);
    });
}

async function buildTo(target) {
    if (isBuilding || target < 0 || target > 3) return;
    isBuilding = true;
    if (currentLayer === -1) {
        for (let i = 3; i >= target; i--) await animateLayerIn(i);
    } else if (target < currentLayer) {
        for (let i = currentLayer - 1; i >= target; i--) await animateLayerIn(i);
    }
    isBuilding = false;
}

function switchToLayer(i) {
    if (i < 0 || i > 3) return;
    const minBuilt = Math.min(i, currentLayer === -1 ? 3 : currentLayer);
    const maxBuilt = Math.max(i, currentLayer === -1 ? 3 : currentLayer);
    for (let j = minBuilt; j <= maxBuilt; j++) {
        if (!anatomy3dLayers[j].classList.contains('built')) {
            anatomy3dLayers[j].classList.add('built');
            anatomy3dLayers[j].style.pointerEvents = 'auto';
        }
        showLayer(j, j === i);
    }
    currentLayer = i;
    updateAnatomyUI(i);
}

function updateAnatomyUI(i) {
    const d = layersData[i];
    updateAnatomyDots(i);
    updateAnatomyButtons();
    if (anatomyRoad) anatomyRoad.style.transform = `rotateX(${d.rotateX}deg) rotateY(${d.rotateY}deg)`;
    [anatomyStep, anatomyTitle, anatomyDesc, anatomyThickness].forEach(el => { if (el) el.style.opacity = '0'; });
    setTimeout(() => {
        if (anatomyStep) anatomyStep.textContent = d.step;
        if (anatomyTitle) anatomyTitle.textContent = d.name;
        if (anatomyDesc) anatomyDesc.textContent = d.desc;
        if (anatomyThickness) anatomyThickness.textContent = d.thickness;
        [anatomyStep, anatomyTitle, anatomyDesc, anatomyThickness].forEach(el => { if (el) el.style.opacity = '1'; });
    }, 150);
}

function updateAnatomyDots(i) {
    anatomyDots.forEach((d, idx) => d.classList.toggle('active', idx === 3 - i));
}

function updateAnatomyButtons() {
    if (anatomyPrevBtn) anatomyPrevBtn.disabled = currentLayer >= 3;
    if (anatomyNextBtn) anatomyNextBtn.disabled = currentLayer <= 0;
}

function startAutoBuild() {
    if (autoPlayStarted) return;
    autoPlayStarted = true;
    resetAllLayers();
    setTimeout(() => buildTo(0), 500);
}

if (anatomyDots.length) {
    anatomyDots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            if (isBuilding) return;
            const target = 3 - i;
            if (target < currentLayer || currentLayer === -1) buildTo(target);
            else switchToLayer(target);
        });
    });
}
if (anatomy3dLayers.length) {
    anatomy3dLayers.forEach((layer, i) => {
        layer.addEventListener('click', () => {
            if (isBuilding) return;
            if (layer.classList.contains('built')) switchToLayer(i);
        });
    });
}
if (anatomyNextBtn) {
    anatomyNextBtn.addEventListener('click', () => {
        if (isBuilding) return;
        if (currentLayer > 0) switchToLayer(currentLayer - 1);
    });
}
if (anatomyPrevBtn) {
    anatomyPrevBtn.addEventListener('click', () => {
        if (isBuilding) return;
        if (currentLayer < 3) switchToLayer(currentLayer + 1);
    });
}

const fortressSection = document.getElementById('fortress');
if (fortressSection) {
    const fortressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !autoPlayStarted) startAutoBuild();
            else if (!entry.isIntersecting && autoPlayStarted) {
                resetAllLayers();
                autoPlayStarted = false;
            }
        });
    }, { threshold: 0.3 });
    fortressObserver.observe(fortressSection);
}
resetAllLayers();

// ==================== INIT ====================
updateRoadCalculator();
updateTileCalculator();
updateLandscapeCalculator();
if (asphaltSlider) {
    updateCalc3DLayers(+asphaltSlider.value, +pgsSlider.value, +gravelSlider.value, soilSlider ? +soilSlider.value : 10);
}