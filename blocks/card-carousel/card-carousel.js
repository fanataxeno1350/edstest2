import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, subtitleRow, ...cardRows] = [...block.children];

  // Section container
  const section = document.createElement('section');
  section.classList.add('card-carousel');
  moveInstrumentation(block, section);

  // Main container
  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');
  section.appendChild(container);

  // Title
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
    title.textContent = titleRow.firstElementChild?.textContent.trim() || '';
    container.appendChild(title);
  }

  // Subtitle
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
    subtitle.textContent = subtitleRow.firstElementChild?.textContent.trim() || '';
    container.appendChild(subtitle);
  }

  // Swiper container
  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('card-carousel__swiper', 'swiper', 'container', 'gx-0');
  swiperContainer.setAttribute('data-loop', 'false');
  section.appendChild(swiperContainer);

  const swiperWrapperContainer = document.createElement('div');
  swiperWrapperContainer.classList.add('card-carousel__swiper--container', 'mt-8', 'mt-sm-10');
  swiperContainer.appendChild(swiperWrapperContainer);

  const productCardsGrid = document.createElement('div');
  productCardsGrid.classList.add(
    'aem-Grid',
    'aem-Grid--12',
    'aem-Grid--default--12',
  );
  swiperWrapperContainer.appendChild(productCardsGrid);

  const productCardsColumn = document.createElement('div');
  productCardsColumn.classList.add(
    'productCards',
    'aem-GridColumn',
    'aem-GridColumn--default--12',
  );
  productCardsGrid.appendChild(productCardsColumn);

  const cardContainer = document.createElement('div');
  cardContainer.classList.add(
    'product-cards__card-container',
    'mx-4',
    'mx-sm-0',
    'overflow-hidden',
    'add-margin',
    'swiper-initialized',
    'swiper-horizontal',
    'swiper-backface-hidden',
  );
  productCardsColumn.appendChild(cardContainer);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper', 'slide-in-anim');
  cardContainer.appendChild(swiperWrapper);

  cardRows.forEach((row, index) => {
    const [mainImageCell, cardTitleCell, productImageCell, productLinkCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const card = document.createElement('div');
    card.classList.add(
      'product-cards__card',
      'swiper-slide',
      'd-flex',
      'flex-column',
      'cursor-pointer',
    );
    if (index === 0) {
      card.classList.add('swiper-slide-active');
    } else if (index === 1) {
      card.classList.add('swiper-slide-next');
    }
    moveInstrumentation(row, card);

    const cardMedia = document.createElement('div');
    cardMedia.classList.add('product-cards__card-media', 'position-relative');
    card.appendChild(cardMedia);

    const ratioWrapper = document.createElement('div');
    ratioWrapper.classList.add('ratio', 'ratio-3x4', 'position-relative', 'product-cards__card-video-wrapper');
    cardMedia.appendChild(ratioWrapper);

    // Main Image
    const mainImagePicture = mainImageCell?.querySelector('picture');
    if (mainImagePicture) {
      const img = mainImagePicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      optimizedPic.querySelector('img').classList.add('product-cards__card-thumb', 'object-fit-cover');
      moveInstrumentation(mainImagePicture, optimizedPic);
      ratioWrapper.appendChild(optimizedPic);
    }

    const cardGradient = document.createElement('div');
    cardGradient.classList.add('card-gradient', 'position-absolute', 'top-0', 'bottom-0', 'start-0', 'end-0');
    ratioWrapper.appendChild(cardGradient);

    // Card Title/Description
    if (cardTitleCell) {
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
      cardTitle.innerHTML = cardTitleCell.innerHTML;
      cardMedia.appendChild(cardTitle);
    }

    // Product Image and Link
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
    cardMedia.appendChild(productImageWrapper);

    const productImageRatio = document.createElement('div');
    productImageRatio.classList.add('ratio', 'ratio-1x1');
    productImageWrapper.appendChild(productImageRatio);

    const productLinkAnchor = document.createElement('a');
    productLinkAnchor.classList.add('cta-analytics');
    const foundProductLink = productLinkCell?.querySelector('a');
    if (foundProductLink) {
      productLinkAnchor.href = foundProductLink.href;
    }

    const productImagePicture = productImageCell?.querySelector('picture');
    if (productImagePicture) {
      const img = productImagePicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      optimizedPic.querySelector('img').classList.add('w-100', 'h-100', 'object-fit-contain');
      moveInstrumentation(productImagePicture, optimizedPic);
      productLinkAnchor.appendChild(optimizedPic);
    }
    productImageRatio.appendChild(productLinkAnchor);

    // CTA Link and Label
    const ctaWrapper = document.createElement('div');
    ctaWrapper.classList.add('mt-6', 'align-self-center');
    card.appendChild(ctaWrapper);

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
    const foundCtaLink = ctaLinkCell?.querySelector('a');
    if (foundCtaLink) {
      ctaAnchor.href = foundCtaLink.href;
    }
    ctaAnchor.textContent = ctaLabelCell?.textContent.trim() || '';
    moveInstrumentation(ctaLinkCell, ctaAnchor);
    ctaWrapper.appendChild(ctaAnchor);

    swiperWrapper.appendChild(card);
  });

  // Swiper navigation buttons (prev/next)
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
  prevButton.setAttribute('disabled', '');
  const prevImg = document.createElement('img');
  prevImg.setAttribute('alt', 'svg file');
  prevImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776310800302.svg+xml';
  prevButton.appendChild(prevImg);
  swiperWrapperContainer.appendChild(prevButton);

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
  const nextImg = document.createElement('img');
  nextImg.setAttribute('alt', 'svg file');
  nextImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776310800302.svg+xml';
  nextButton.appendChild(nextImg);
  swiperWrapperContainer.appendChild(nextButton);

  // Swiper pagination
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
  pagination.style.width = '140px';
  swiperContainer.appendChild(pagination);

  // Replace the original block with the new section
  block.replaceWith(section);

  // Initialize Swiper (assuming Swiper JS is loaded globally or imported)
  // This part would typically be handled by a separate script that runs after decorate.
  // For EDS, we only provide the DOM structure.
  // Example (not part of decorate function, just for context):
  // const swiper = new Swiper('.card-carousel__swiper', {
  //   slidesPerView: 'auto',
  //   spaceBetween: 32,
  //   loop: false,
  //   navigation: {
  //     nextEl: '.card-carousel__swiper--next',
  //     prevEl: '.card-carousel__swiper--prev',
  //   },
  //   pagination: {
  //     el: '.card-carousel__swiper--pagination',
  //     clickable: true,
  //   },
  // });

  // Add event listeners for navigation buttons (if Swiper is not globally initialized)
  // These would typically trigger Swiper's .slideNext() and .slidePrev() methods.
  // Since Swiper initialization is commented out, these listeners are placeholders.
  prevButton.addEventListener('click', () => {
    // Logic to navigate to previous slide
    // For example: if (swiper) swiper.slidePrev();
    console.log('Previous button clicked');
  });

  nextButton.addEventListener('click', () => {
    // Logic to navigate to next slide
    // For example: if (swiper) swiper.slideNext();
    console.log('Next button clicked');
  });
}
