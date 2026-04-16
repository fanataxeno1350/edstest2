import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, subtitleRow, ...cardRows] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');
  moveInstrumentation(block, container);

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
  if (titleRow) {
    moveInstrumentation(titleRow, title);
    title.textContent = titleRow.firstElementChild?.textContent.trim() || '';
  }
  container.append(title);

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
  if (subtitleRow) {
    moveInstrumentation(subtitleRow, subtitle);
    subtitle.textContent = subtitleRow.firstElementChild?.textContent.trim() || '';
  }
  container.append(subtitle);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('card-carousel__swiper', 'swiper', 'container', 'gx-0');

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('card-carousel__swiper--container', 'mt-8', 'mt-sm-10');
  swiperWrapper.append(swiperContainer);

  const productCardsContainer = document.createElement('div');
  productCardsContainer.classList.add(
    'product-cards__card-container',
    'mx-4',
    'mx-sm-0',
    'overflow-hidden',
    'add-margin',
    'swiper-initialized',
    'swiper-horizontal',
    'swiper-backface-hidden',
  );
  swiperContainer.append(productCardsContainer);

  const swiperCardsWrapper = document.createElement('div');
  swiperCardsWrapper.classList.add('swiper-wrapper', 'slide-in-anim');
  productCardsContainer.append(swiperCardsWrapper);

  cardRows.forEach((row) => {
    // CRITICAL FIX: Use destructuring for fixed-field item models as per EDS guide.
    // The previous code already used destructuring, which is correct here.
    const [mainImageCell, cardTitleCell, productImageCell, productLinkCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const card = document.createElement('div');
    card.classList.add(
      'product-cards__card',
      'swiper-slide',
      'd-flex',
      'flex-column',
      'cursor-pointer',
    );
    moveInstrumentation(row, card);

    const media = document.createElement('div');
    media.classList.add('product-cards__card-media', 'position-relative');

    const ratioWrapper = document.createElement('div');
    ratioWrapper.classList.add('ratio', 'ratio-3x4', 'position-relative', 'product-cards__card-video-wrapper');

    const mainImage = mainImageCell?.querySelector('picture');
    if (mainImage) {
      const img = mainImage.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      optimizedPic.classList.add('product-cards__card-thumb', 'object-fit-cover');
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      ratioWrapper.append(optimizedPic);
    }

    const gradient = document.createElement('div');
    gradient.classList.add('card-gradient', 'position-absolute', 'top-0', 'bottom-0', 'start-0', 'end-0');
    ratioWrapper.append(gradient);
    media.append(ratioWrapper);

    const cardTitle = document.createElement('div');
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
    // CHECK 1.5: cardTitle is richtext, so innerHTML is correct.
    cardTitle.innerHTML = cardTitleCell?.innerHTML || '';
    media.append(cardTitle);

    const productImageWrapper = document.createElement('div');
    productImageWrapper.classList.add(
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

    const productRatio = document.createElement('div');
    productRatio.classList.add('ratio', 'ratio-1x1');

    const productLink = document.createElement('a');
    productLink.classList.add('cta-analytics');
    // CHECK 1.5: productLink is aem-content, so read .href from the anchor.
    const productLinkHref = productLinkCell?.querySelector('a')?.href;
    if (productLinkHref) {
      productLink.href = productLinkHref;
    }

    const productImage = productImageCell?.querySelector('picture');
    if (productImage) {
      const img = productImage.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      optimizedPic.querySelector('img').classList.add('w-100', 'h-100', 'object-fit-contain');
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      productLink.append(optimizedPic);
    }
    productRatio.append(productLink);
    productImageWrapper.append(productRatio);
    media.append(productImageWrapper);
    card.append(media);

    const ctaWrapper = document.createElement('div');
    ctaWrapper.classList.add('mt-6', 'align-self-center');

    const ctaLink = document.createElement('a');
    ctaLink.classList.add(
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
    // CHECK 1.5: ctaLink is aem-content, so read .href from the anchor.
    const ctaLinkHref = ctaLinkCell?.querySelector('a')?.href;
    if (ctaLinkHref) {
      ctaLink.href = ctaLinkHref;
    }
    // ctaLabel is type=text, so .textContent.trim() is correct.
    ctaLink.textContent = ctaLabelCell?.textContent.trim() || '';
    ctaWrapper.append(ctaLink);
    card.append(ctaWrapper);

    swiperCardsWrapper.append(card);
  });

  const prevButton = document.createElement('button');
  prevButton.classList.add(
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
  const prevIcon = document.createElement('img');
  // FIX: Use the actual SVG path from the ORIGINAL HTML.
  prevIcon.src = '/content/dam/aemigrate/uploaded-folder/image/1776313318627.svg+xml';
  prevIcon.alt = 'svg file'; // Alt text from original HTML
  prevButton.append(prevIcon);
  swiperContainer.append(prevButton);

  const nextButton = document.createElement('button');
  nextButton.classList.add(
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
  const nextIcon = document.createElement('img');
  // FIX: Use the actual SVG path from the ORIGINAL HTML.
  nextIcon.src = '/content/dam/aemigrate/uploaded-folder/image/1776313318627.svg+xml';
  nextIcon.alt = 'svg file'; // Alt text from original HTML
  nextButton.append(nextIcon);
  swiperContainer.append(nextButton);

  const pagination = document.createElement('div');
  pagination.classList.add(
    'card-carousel__swiper--pagination',
    'mt-10',
    'cursor-pointer',
    'position-relative',
    'swiper-pagination-clickable',
    'swiper-pagination-bullets',
    'swiper-pagination-horizontal',
    'mx-auto',
    'w-fit',
  );
  swiperWrapper.append(pagination);

  block.innerHTML = '';
  block.classList.add('card-carousel'); // Ensure the root block has its class
  block.append(container, swiperWrapper);

  // Swiper initialization (simplified, full Swiper logic might be more complex)
  let swiperInstance;
  function initSwiper() {
    // eslint-disable-next-line no-undef
    swiperInstance = new Swiper(productCardsContainer, {
      loop: false,
      slidesPerView: 'auto',
      spaceBetween: 32,
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
      },
      pagination: {
        el: pagination,
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 3,
          spaceBetween: 32,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 32,
        },
      },
    });
  }

  // Load Swiper library and initialize
  const swiperScript = document.createElement('script');
  swiperScript.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
  swiperScript.onload = initSwiper;
  document.head.append(swiperScript);

  const swiperCss = document.createElement('link');
  swiperCss.rel = 'stylesheet';
  swiperCss.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
  document.head.append(swiperCss);

  // CHECK 2: Interactivity - The Swiper navigation buttons (prevButton, nextButton)
  // are handled by the Swiper library itself, which attaches event listeners.
  // No explicit addEventListener is needed here for these elements.
  // The product cards themselves are clickable via their internal links.
}
