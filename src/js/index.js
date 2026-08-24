import '../scss/style.scss';
import Swiper from 'swiper/bundle';

let swiperInstances = {};

const swiperConfigs = [
    {
        selector: '.brand-swiper',
        query: window.matchMedia('(max-width: 767px)'),
        pagination: true,
    },
    {
        selector: '.repair-slider',
        query: window.matchMedia('(max-width: 1439px)'),
        pagination: true,
        breakpoints: {
            0: { slidesPerView: 1.25, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 24 },
        },
    },
    {
        selector: '.price-slider__list',
        query: window.matchMedia('(max-width: 767px)'),
        pagination: true,
    },
];

function initSwiper(config) {
    const container = document.querySelector(config.selector);
    if (!container || swiperInstances[config.selector]) return;

    requestAnimationFrame(() => {
       
        if (!config.query.matches || swiperInstances[config.selector]) return;

        const options = {
            slidesPerView: 'auto',
            spaceBetween: 16,
            grabCursor: true,
            loop: true,
        };

        if (config.breakpoints) {
            options.breakpoints = config.breakpoints;
        }

        if (config.pagination) {
            options.pagination = {
                el: `${config.selector} .swiper-pagination`,
                clickable: true,
            };
        }

        const instance = new Swiper(config.selector, options);
        swiperInstances[config.selector] = instance;

        setTimeout(() => instance.update(), 50);
    });
}

function destroySwiper(config) {
    const instance = swiperInstances[config.selector];
    if (instance) {
        instance.destroy(true, true);
        swiperInstances[config.selector] = null;
    }
}

function syncSwiper(config) {
    if (config.query.matches) {
        initSwiper(config);
    } else {
        destroySwiper(config);
    }
}

function handleAllSwipers() {
    swiperConfigs.forEach(syncSwiper);
}

handleAllSwipers();
swiperConfigs.forEach((config) => {
    config.query.addEventListener('change', () => syncSwiper(config));
});

document.addEventListener('click', function(e) {
    const btn = e.target.closest('.brands-slider__btn, .repair-slider__btn');
    if (!btn) return;
    
    const swiperEl = btn.closest('.swiper');
    if (swiperEl && swiperEl.swiper) {
        swiperEl.swiper.slideNext();
    }
});

const toggleButton = document.getElementById('toggleBrands');
const buttonText = toggleButton ? toggleButton.querySelector('.btn-text') : null;
const brandSwiperContainer = document.querySelector('.brand-swiper');
const brandsWrapper = brandSwiperContainer ? brandSwiperContainer.querySelector('.swiper-wrapper') : null;

const brandsGridQuery = window.matchMedia('(min-width: 768px)');
const BRANDS_VISIBLE_ROWS = 2;

function getBrandsCollapsedHeight() {
    if (!brandsWrapper || !brandsWrapper.children.length) return 0;

    const cardHeight = brandsWrapper.children[0].getBoundingClientRect().height;
    const rowGap = parseFloat(getComputedStyle(brandsWrapper).rowGap) || 0;

    return cardHeight * BRANDS_VISIBLE_ROWS + rowGap * (BRANDS_VISIBLE_ROWS - 1);
}

function syncBrandsHeight() {
    if (!brandsWrapper) return;

    if (!brandsGridQuery.matches) {
        brandsWrapper.style.maxHeight = '';
        return;
    }

    if (brandSwiperContainer.classList.contains('is-opened')) {
        brandsWrapper.style.maxHeight = `${brandsWrapper.scrollHeight}px`;
    } else {
        brandsWrapper.style.maxHeight = `${getBrandsCollapsedHeight()}px`;
    }
}

if (toggleButton && brandSwiperContainer && brandsWrapper && buttonText) {
    toggleButton.addEventListener('click', function() {
        brandSwiperContainer.classList.toggle('is-opened');
        toggleButton.classList.toggle('show-more-btn--active');

        if (brandSwiperContainer.classList.contains('is-opened')) {
            buttonText.textContent = 'Скрыть';
        } else {
            buttonText.textContent = 'Показать все';
        }

        syncBrandsHeight();
    });

    syncBrandsHeight();

    brandsGridQuery.addEventListener('change', syncBrandsHeight);

    let brandsResizeRaf = null;
    window.addEventListener('resize', () => {
        if (brandsResizeRaf) return;
        brandsResizeRaf = requestAnimationFrame(() => {
            syncBrandsHeight();
            brandsResizeRaf = null;
        });
    });
}

const toggleRepairButton = document.getElementById('toggleRepair');
const repairButtonText = toggleRepairButton ? toggleRepairButton.querySelector('.btn-text') : null;
const repairSlider = document.querySelector('.repair-slider');

if (toggleRepairButton && repairSlider && repairButtonText) {
    toggleRepairButton.addEventListener('click', function() {
        repairSlider.classList.toggle('is-opened');
        toggleRepairButton.classList.toggle('show-more-btn--active');

        repairButtonText.textContent = repairSlider.classList.contains('is-opened')
            ? 'Скрыть'
            : 'Показать все';
    });
}

const sideMenu = document.querySelector('.side-menu');
const sideMenuOverlay = document.querySelector('.side-menu-overlay');
const burgerBtn = document.querySelector('.header__burger');
const closeBtn = document.querySelector('.side-menu__close');

const desktopMenuQuery = window.matchMedia('(min-width: 1440px)');

function openMenu() {
    if (!sideMenu || desktopMenuQuery.matches) return;
    sideMenu.classList.add('side-menu--open');
    sideMenuOverlay?.classList.add('side-menu-overlay--visible');
    document.body.classList.add('no-scroll');
}

function closeMenu() {
    if (!sideMenu) return;
    sideMenu.classList.remove('side-menu--open');
    sideMenuOverlay?.classList.remove('side-menu-overlay--visible');
    document.body.classList.remove('no-scroll');
}

if (burgerBtn) {
    burgerBtn.addEventListener('click', openMenu);
}

if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
}

if (sideMenuOverlay) {
    sideMenuOverlay.addEventListener('click', closeMenu);
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeMenu();
});

function handleDesktopMenuChange(e) {
    if (e.matches) {
        closeMenu();
    }
}

desktopMenuQuery.addEventListener('change', handleDesktopMenuChange);

const scrollTabs = document.querySelectorAll('.scroll-container__tab');

scrollTabs.forEach(tab => {
    tab.addEventListener('touchstart', function() {
        tab.classList.add('is-active');
    }, { passive: true });

    tab.addEventListener('touchend', function() {
        tab.classList.remove('is-active');
    }, { passive: true });
});

document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.side-menu__item'); 

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const activeClass = menuItems[0].classList[0] + '--active';
            menuItems.forEach(el => el.classList.remove(activeClass));
            item.classList.add(activeClass);
        });
    });
})