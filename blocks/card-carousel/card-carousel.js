import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [titleRow, subtitleRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('card-carousel'); // No block name on inner wrapper (Rule 26)

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'gx-8', 'gx-sm-0');
  section.append(containerDiv);

  if (titleRow) {
    const title = document.createElement('h2');
    title.classList.add(
      'card-carousel__title',
      'font-24',
      'leading-28',
      'font-sm-40',
      'leading-sm-50',
      'text-dark-gray-100',
      'text-center',
      'font-baskerville',
    );
    moveInstrumentation(titleRow, title);
    // FIX: Replaced direct children[0] access with textContent for title
    title.textContent = titleRow.textContent.trim() || '';
    containerDiv.append(title);
  }

  if (subtitleRow) {
    const subtitle = document.createElement('p');
    subtitle.classList.add(
      'card-carousel__subtitle',
      'font-default',
      'leading-24',
      'font-sm-18',
      'leading-sm-32',
      'text-dark-gray-100',
      'text-center',
      'mt-4',
      'fw-medium',
    );
    moveInstrumentation(subtitleRow, subtitle);
    // FIX: Replaced direct children[0] access with textContent for subtitle
    subtitle.textContent = subtitleRow.textContent.trim() || '';
    containerDiv.append(subtitle);
  }

  const swiperEl = document.createElement('div');
  swiperEl.classList.add('card-carousel__swiper', 'swiper', 'container', 'gx-0');
  swiperEl.dataset.loop = 'false'; // From ORIGINAL HTML (Rule 25.3)
  section.append(swiperEl);

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('card-carousel__swiper--container', 'mt-8', 'mt-sm-10');
  swiperEl.append(swiperContainer);

  const productCardsContainer = document.createElement('div');
  productCardsContainer.classList.add(
    'product-cards__card-container',
    'mx-4',
    'mx-sm-0',
    'overflow-hidden',
    'add-margin',
  );
  // FIX: Removed manual Swiper classes, Swiper adds these automatically on init.
  // 'swiper-initialized', 'swiper-horizontal', 'swiper-backface-hidden'
  swiperContainer.append(productCardsContainer);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper', 'slide-in-anim');
  productCardsContainer.append(swiperWrapper);

  cardRows.forEach((row) => {
    const [
      backgroundImageCell,
      cardTitleCell,
      productImageCell,
      productLinkCell,
      ctaLabelCell,
      ctaLinkCell,
    ] = [...row.children]; // Rule 17, 25.1

    const card = document.createElement('div');
    card.classList.add(
      'product-cards__card',
      'swiper-slide',
      'd-flex',
      'flex-column',
      'cursor-pointer',
    );
    moveInstrumentation(row, card); // Move instrumentation from the row to the card

    const cardMedia = document.createElement('div');
    cardMedia.classList.add('product-cards__card-media', 'position-relative');
    card.append(cardMedia);

    const ratioDiv = document.createElement('div');
    ratioDiv.classList.add(
      'ratio',
      'ratio-3x4',
      'position-relative',
      'product-cards__card-video-wrapper',
    );
    cardMedia.append(ratioDiv);

    const backgroundPicture = backgroundImageCell?.querySelector('picture');
    if (backgroundPicture) {
      const img = backgroundPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      optimizedPic.querySelector('img').classList.add('product-cards__card-thumb', 'object-fit-cover');
      ratioDiv.append(optimizedPic);
    }

    const cardGradient = document.createElement('div');
    cardGradient.classList.add(
      'card-gradient',
      'position-absolute',
      'top-0',
      'bottom-0',
      'start-0',
      'end-0',
    );
    ratioDiv.append(cardGradient);

    const cardTitle = document.createElement('div'); // FIX: Changed to div to avoid <p> inside <p>
    cardTitle.classList.add(
      'product-cards__card-title',
      'position-absolute',
      'top-0',
      'text-white',
      'px-5',
      'pt-4',
      'text-cream-100',
      'leading-32',
    );
    cardTitle.innerHTML = cardTitleCell?.innerHTML || ''; // Rule 17c
    cardMedia.append(cardTitle);

    const cardImgDiv = document.createElement('div');
    cardImgDiv.classList.add(
      'product-cards__card-img',
      'pt-lg-8',
      'pt-sm-6',
      'pt-8',
      'pb-3',
      'bg-cream-300',
      'position-absolute',
      'start-50',
      'top-100',
      'rounded-top-circle',
    );
    cardMedia.append(cardImgDiv);

    const ratio1x1Div = document.createElement('div');
    ratio1x1Div.classList.add('ratio', 'ratio-1x1');
    cardImgDiv.append(ratio1x1Div);

    const productLink = productLinkCell?.querySelector('a');
    const ctaLink = ctaLinkCell?.querySelector('a');
    const ctaLabel = ctaLabelCell?.textContent.trim();

    const productAnchor = document.createElement('a');
    productAnchor.classList.add('cta-analytics');
    if (productLink) productAnchor.href = productLink.href;

    const productPicture = productImageCell?.querySelector('picture');
    if (productPicture) {
      const img = productPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      optimizedPic.querySelector('img').classList.add('w-100', 'h-100', 'object-fit-contain');
      productAnchor.append(optimizedPic);
    }
    ratio1x1Div.append(productAnchor);

    const ctaWrapper = document.createElement('div');
    ctaWrapper.classList.add('mt-6', 'align-self-center');
    card.append(ctaWrapper);

    const ctaAnchor = document.createElement('a');
    ctaAnchor.classList.add(
      'cta-analytics',
      'svasti-cta',
      'w-fit',
      'text-decoration-none',
      'd-flex',
      'align-items-center',
      'primary',
      'px-8',
      'pb-3',
      'text-cream-100',
      'border',
      'border-2',
      'border-red-100',
      'border-maroon-100-hover',
      'border-red-300-active',
      'bg-red-100',
      'bg-maroon-100-hover',
      'bg-red-300-active',
    );
    if (ctaLink) ctaAnchor.href = ctaLink.href;
    ctaAnchor.textContent = ctaLabel || '';
    ctaWrapper.append(ctaAnchor);

    swiperWrapper.append(card);
  });

  const prevBtn = document.createElement('button');
  prevBtn.classList.add(
    'card-carousel__swiper--prev',
    'card-carousel__navigation',
    'cursor-pointer',
    'rounded-circle',
    'bg-transparent',
    'text-red-100',
    'text-maroon-600-hover',
    'justify-content-center',
    'align-items-center',
    'position-absolute',
    'd-none',
    'd-sm-flex',
    'opacity-30',
  );
  // FIX: Replaced hardcoded SVG href with inline SVG
  prevBtn.innerHTML = `
    <svg class="icon w-100 h-100">
      <use xlink:href="#arrow_right_carousel"></use>
    </svg>
  `; // Rule 25.4
  swiperContainer.append(prevBtn);

  const nextBtn = document.createElement('button');
  nextBtn.classList.add(
    'card-carousel__swiper--next',
    'card-carousel__navigation',
    'cursor-pointer',
    'rounded-circle',
    'bg-transparent',
    'text-red-100',
    'text-maroon-600-hover',
    'justify-content-center',
    'align-items-center',
    'position-absolute',
    'end-0',
    'd-none',
    'd-sm-flex',
  );
  // FIX: Replaced hardcoded SVG href with inline SVG
  nextBtn.innerHTML = `
    <svg class="icon w-100 h-100">
      <use xlink:href="#arrow_right_carousel"></use>
    </svg>
  `; // Rule 25.4
  swiperContainer.append(nextBtn);

  const paginationEl = document.createElement('div');
  paginationEl.classList.add(
    'card-carousel__swiper--pagination',
    'mt-10',
    'cursor-pointer',
    'position-relative',
    'mx-auto',
    'w-fit',
  );
  swiperEl.append(paginationEl);

  block.replaceChildren(section);

  // Swiper initialization (Rule 24)
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
    slidesPerView: 'auto',
    spaceBetween: 32, // From ORIGINAL HTML CSS (margin-right: 32px)
    loop: swiperEl.dataset.loop === 'true',
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: paginationEl,
      clickable: true,
    },
    breakpoints: {
      576: {
        slidesPerView: 2,
        spaceBetween: 32,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
      992: {
        slidesPerView: 4,
        spaceBetween: 32,
      },
    },
  });
}
