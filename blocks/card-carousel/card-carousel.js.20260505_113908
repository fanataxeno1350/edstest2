import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [titleRow, subtitleRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('card-carousel');

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');
  moveInstrumentation(titleRow, container);

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
  // FIX: Read textContent directly from the cell, not querySelector('div')
  title.textContent = titleRow.children[0]?.textContent?.trim() || '';
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
  // FIX: Read textContent directly from the cell, not querySelector('div')
  subtitle.textContent = subtitleRow.children[0]?.textContent?.trim() || '';
  container.append(subtitle);

  section.append(container);

  const swiperContainer = document.createElement('div');
  // FIX: Removed swiper-initialized, swiper-horizontal, swiper-backface-hidden - Swiper adds these
  swiperContainer.classList.add('card-carousel__swiper', 'swiper', 'container', 'gx-0');
  swiperContainer.dataset.loop = 'false';

  const swiperInnerContainer = document.createElement('div');
  swiperInnerContainer.classList.add('card-carousel__swiper--container', 'mt-8', 'mt-sm-10');

  const productCardsContainer = document.createElement('div');
  productCardsContainer.classList.add(
    'product-cards__card-container',
    'mx-4',
    'mx-sm-0',
    'overflow-hidden',
    'add-margin',
  );

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper', 'slide-in-anim');

  cardRows.forEach((row) => {
    const [thumbImageCell, cardTitleCell, mainImageCell, mainImageLinkCell, ctaLinkCell, ctaLabelCell] = [
      ...row.children,
    ];

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
    ratioWrapper.classList.add(
      'ratio',
      'ratio-3x4',
      'position-relative',
      'product-cards__card-video-wrapper',
    );

    const thumbImagePicture = thumbImageCell.querySelector('picture');
    if (thumbImagePicture) {
      const thumbImage = thumbImagePicture.querySelector('img');
      if (thumbImage) {
        thumbImage.classList.add('product-cards__card-thumb', 'object-fit-cover');
        const optimizedThumbPic = createOptimizedPicture(
          thumbImage.src,
          thumbImage.alt,
          false,
          [{ width: '750' }],
        );
        moveInstrumentation(thumbImage, optimizedThumbPic.querySelector('img'));
        thumbImagePicture.replaceWith(optimizedThumbPic);
        ratioWrapper.append(optimizedThumbPic);
      }
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
    ratioWrapper.append(cardGradient);
    media.append(ratioWrapper);

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
    // FIX: Read innerHTML directly from the richtext cell
    cardTitle.innerHTML = cardTitleCell?.innerHTML || '';
    media.append(cardTitle);

    const cardImg = document.createElement('div');
    cardImg.classList.add(
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

    const ratio1x1 = document.createElement('div');
    ratio1x1.classList.add('ratio', 'ratio-1x1');

    const mainImageLink = document.createElement('a');
    mainImageLink.classList.add('cta-analytics');
    const foundMainImageLink = mainImageLinkCell.querySelector('a');
    if (foundMainImageLink) {
      mainImageLink.href = foundMainImageLink.href;
    }

    const mainImagePicture = mainImageCell.querySelector('picture');
    if (mainImagePicture) {
      const mainImage = mainImagePicture.querySelector('img');
      if (mainImage) {
        mainImage.classList.add('w-100', 'h-100', 'object-fit-contain');
        const optimizedMainPic = createOptimizedPicture(
          mainImage.src,
          mainImage.alt,
          false,
          [{ width: '750' }],
        );
        moveInstrumentation(mainImage, optimizedMainPic.querySelector('img'));
        mainImagePicture.replaceWith(optimizedMainPic);
        mainImageLink.append(optimizedMainPic);
      }
    }
    ratio1x1.append(mainImageLink);
    cardImg.append(ratio1x1);
    media.append(cardImg);
    card.append(media);

    const ctaWrapper = document.createElement('div');
    ctaWrapper.classList.add('mt-6', 'align-self-center');

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
    const foundCtaLink = ctaLinkCell.querySelector('a');
    if (foundCtaLink) {
      ctaAnchor.href = foundCtaLink.href;
    }
    ctaAnchor.textContent = ctaLabelCell?.textContent?.trim() || '';
    ctaWrapper.append(ctaAnchor);
    card.append(ctaWrapper);
    swiperWrapper.append(card);
  });

  productCardsContainer.append(swiperWrapper);
  swiperInnerContainer.append(productCardsContainer);

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
  // FIX: Replaced hardcoded SVG path with inline SVG
  prevButton.innerHTML = `
    <svg class="icon w-100 h-100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.5 19L8.5 12L15.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  swiperInnerContainer.append(prevButton);

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
  // FIX: Replaced hardcoded SVG path with inline SVG
  nextButton.innerHTML = `
    <svg class="icon w-100 h-100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.5 5L15.5 12L8.5 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  swiperInnerContainer.append(nextButton);

  const pagination = document.createElement('div');
  pagination.classList.add(
    'card-carousel__swiper--pagination',
    'mt-10',
    'cursor-pointer',
    'position-relative',
    'mx-auto',
    'w-fit',
  );
  swiperInnerContainer.append(pagination);

  swiperContainer.append(swiperInnerContainer);
  section.append(swiperContainer);

  block.replaceChildren(section);

  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(swiperContainer, {
    slidesPerView: 'auto',
    spaceBetween: 32,
    loop: swiperContainer.dataset.loop === 'true',
    navigation: {
      prevEl: prevButton,
      nextEl: nextButton,
    },
    pagination: {
      el: pagination,
      clickable: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1.1,
        spaceBetween: 16,
      },
      576: {
        slidesPerView: 2.1,
        spaceBetween: 24,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
    },
  });
}
