import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, subtitleRow, ...cardRows] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');
  moveInstrumentation(block, container);

  const title = document.createElement('h2');
  title.classList.add('card-carousel__title', 'font-24', 'leading-28', 'font-sm-40', 'leading-sm-50', 'text-dark-gray-100', 'text-center', 'font-baskerville');
  title.textContent = titleRow.firstElementChild.textContent.trim();
  moveInstrumentation(titleRow, title);
  container.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.classList.add('card-carousel__subtitle', 'font-default', 'leading-24', 'font-sm-18', 'leading-sm-32', 'text-dark-gray-100', 'text-center', 'mt-4', 'fw-medium');
  subtitle.textContent = subtitleRow.firstElementChild.textContent.trim();
  moveInstrumentation(subtitleRow, subtitle);
  container.appendChild(subtitle);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('card-carousel__swiper', 'swiper', 'container', 'gx-0');

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('card-carousel__swiper--container', 'mt-8', 'mt-sm-10');
  swiperWrapper.appendChild(swiperContainer);

  const productCardsContainer = document.createElement('div');
  productCardsContainer.classList.add('product-cards__card-container', 'mx-4', 'mx-sm-0', 'overflow-hidden', 'add-margin', 'swiper-initialized', 'swiper-horizontal', 'swiper-backface-hidden');
  swiperContainer.appendChild(productCardsContainer);

  const swiperSlideWrapper = document.createElement('div');
  swiperSlideWrapper.classList.add('swiper-wrapper', 'slide-in-anim');
  productCardsContainer.appendChild(swiperSlideWrapper);

  cardRows.forEach((row) => {
    const [mainImageCell, cardTitleCell, productImageCell, productLinkCell, ctaLabelCell, ctaLinkCell] = [...row.children];

    const card = document.createElement('div');
    card.classList.add('product-cards__card', 'swiper-slide', 'd-flex', 'flex-column', 'cursor-pointer');
    moveInstrumentation(row, card);

    const media = document.createElement('div');
    media.classList.add('product-cards__card-media', 'position-relative');

    const ratioWrapper = document.createElement('div');
    ratioWrapper.classList.add('ratio', 'ratio-3x4', 'position-relative', 'product-cards__card-video-wrapper');

    const mainPicture = mainImageCell.querySelector('picture');
    if (mainPicture) {
      const mainImg = mainPicture.querySelector('img');
      const optimizedMainPic = createOptimizedPicture(mainImg.src, mainImg.alt, false, [{ width: '750' }]);
      const optimizedMainImg = optimizedMainPic.querySelector('img');
      optimizedMainImg.classList.add('product-cards__card-thumb', 'object-fit-cover');
      moveInstrumentation(mainImg, optimizedMainImg);
      ratioWrapper.appendChild(optimizedMainPic);
    }

    const gradient = document.createElement('div');
    gradient.classList.add('card-gradient', 'position-absolute', 'top-0', 'bottom-0', 'start-0', 'end-0');
    ratioWrapper.appendChild(gradient);
    media.appendChild(ratioWrapper);

    const cardTitle = document.createElement('div');
    cardTitle.classList.add('product-cards__card-title', 'position-absolute', 'top-0', 'text-white', 'px-5', 'pt-4', 'text-cream-100', 'leading-32');
    cardTitle.innerHTML = cardTitleCell.innerHTML;
    media.appendChild(cardTitle);

    const productImgWrapper = document.createElement('div');
    productImgWrapper.classList.add('product-cards__card-img', 'pt-lg-8', 'pt-sm-6', 'pt-8', 'pb-3', 'bg-cream-300', 'position-absolute', 'start-50', 'top-100', 'rounded-top-circle');

    const productRatio = document.createElement('div');
    productRatio.classList.add('ratio', 'ratio-1x1');

    const productLinkAnchor = document.createElement('a');
    productLinkAnchor.classList.add('cta-analytics');
    const foundProductLink = productLinkCell.querySelector('a');
    if (foundProductLink) {
      productLinkAnchor.href = foundProductLink.href;
    }

    const productPicture = productImageCell.querySelector('picture');
    if (productPicture) {
      const productImg = productPicture.querySelector('img');
      const optimizedProductPic = createOptimizedPicture(productImg.src, productImg.alt, false, [{ width: '750' }]);
      const optimizedProductImg = optimizedProductPic.querySelector('img');
      optimizedProductImg.classList.add('w-100', 'h-100', 'object-fit-contain');
      moveInstrumentation(productImg, optimizedProductImg);
      productLinkAnchor.appendChild(optimizedProductPic);
    }
    productRatio.appendChild(productLinkAnchor);
    productImgWrapper.appendChild(productRatio);
    media.appendChild(productImgWrapper);
    card.appendChild(media);

    const ctaWrapper = document.createElement('div');
    ctaWrapper.classList.add('mt-6', 'align-self-center');

    const ctaAnchor = document.createElement('a');
    ctaAnchor.classList.add('cta-analytics', 'svasti-cta', 'w-fit', 'text-decoration-none', 'd-flex', 'align-items-center', 'primary', 'px-8', 'pb-3', 'text-cream-100', 'border', 'border-2', 'border-red-100', 'border-maroon-100-hover', 'border-red-300-active', 'bg-red-100', 'bg-maroon-100-hover', 'bg-red-300-active');
    const foundCtaLink = ctaLinkCell.querySelector('a');
    if (foundCtaLink) {
      ctaAnchor.href = foundCtaLink.href;
    }
    ctaAnchor.textContent = ctaLabelCell.textContent.trim();
    moveInstrumentation(ctaLinkCell, ctaAnchor);
    ctaWrapper.appendChild(ctaAnchor);
    card.appendChild(ctaWrapper);

    swiperSlideWrapper.appendChild(card);
  });

  const prevButton = document.createElement('button');
  prevButton.classList.add('card-carousel__swiper--prev', 'card-carousel__navigation', 'cursor-pointer', 'rounded-circle', 'bg-transparent', 'text-red-100', 'text-maroon-600-hover', 'justify-content-center', 'align-items-center', 'position-absolute', 'd-none', 'd-sm-flex', 'opacity-30');
  prevButton.disabled = true;
  prevButton.innerHTML = `
    <svg class="icon w-100 h-100">
      <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right_carousel"></use>
    </svg>
  `;
  swiperContainer.appendChild(prevButton);

  const nextButton = document.createElement('button');
  nextButton.classList.add('card-carousel__swiper--next', 'card-carousel__navigation', 'cursor-pointer', 'rounded-circle', 'bg-transparent', 'text-red-100', 'text-maroon-600-hover', 'justify-content-center', 'align-items-center', 'position-absolute', 'end-0', 'd-none', 'd-sm-flex');
  nextButton.innerHTML = `
    <svg class="icon w-100 h-100">
      <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right_carousel"></use>
    </svg>
  `;
  swiperContainer.appendChild(nextButton);

  const pagination = document.createElement('div');
  pagination.classList.add('card-carousel__swiper--pagination', 'mt-10', 'cursor-pointer', 'position-relative', 'swiper-pagination-clickable', 'swiper-pagination-bullets', 'swiper-pagination-horizontal', 'mx-auto', 'w-fit');
  swiperWrapper.appendChild(pagination);

  block.innerHTML = '';
  block.appendChild(container);
  block.appendChild(swiperWrapper);

  // Swiper initialization logic
  let swiperInstance = null; // Declare swiperInstance outside to be accessible by event listeners

  const initializeSwiper = async () => {
    const { default: Swiper } = await import('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs');
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
        0: {
          spaceBetween: 16,
        },
        768: {
          spaceBetween: 32,
        },
      },
    });

    // Update button states
    const updateNavigationButtons = () => {
      if (swiperInstance) {
        prevButton.disabled = swiperInstance.isBeginning;
        prevButton.classList.toggle('opacity-30', swiperInstance.isBeginning);
        nextButton.disabled = swiperInstance.isEnd;
        nextButton.classList.toggle('opacity-30', swiperInstance.isEnd);
      }
    };

    if (swiperInstance) {
      swiperInstance.on('slideChange', updateNavigationButtons);
      swiperInstance.on('init', updateNavigationButtons);
      updateNavigationButtons();
    }
  };

  initializeSwiper();
}
