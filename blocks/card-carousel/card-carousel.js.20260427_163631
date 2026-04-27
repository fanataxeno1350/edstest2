import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  const section = document.createElement('section');
  section.classList.add('card-carousel');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');

  // Check 0 & 1: Content detection for title and subtitle rows
  // Model: card-carousel has 'title' and 'subtitle' as root fields.
  // They are plain text, so we can detect them by checking if they are the first two rows
  // and contain only text (no images or links).
  const titleRow = rows.shift(); // First row is title
  const subtitleRow = rows.shift(); // Second row is subtitle
  const cardRows = rows; // Remaining rows are card items

  if (titleRow) {
    const titleCell = titleRow.firstElementChild;
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
    moveInstrumentation(titleCell, title);
    title.textContent = titleCell.textContent.trim();
    container.append(title);
  }

  if (subtitleRow) {
    const subtitleCell = subtitleRow.firstElementChild;
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
    moveInstrumentation(subtitleCell, subtitle);
    subtitle.textContent = subtitleCell.textContent.trim();
    container.append(subtitle);
  }

  section.append(container);

  const swiperSection = document.createElement('div');
  swiperSection.classList.add('card-carousel__swiper', 'swiper', 'container', 'gx-0');

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('card-carousel__swiper--container', 'mt-8', 'mt-sm-10');

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

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper', 'slide-in-anim');

  cardRows.forEach((row) => {
    // Check 0: Replaced row.children[n] with content detection for item cells
    // Model: product-card has 5 fields: mainImage (reference), cardTitle (richtext),
    // secondaryImage (reference), productLink (aem-content), ctaLink (aem-content).
    // We can use querySelector to reliably find these.
    const cells = [...row.children];
    const mainImageCell = cells.find(cell => cell.querySelector('picture'));
    const cardTitleCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.innerHTML.includes('<p>')); // Richtext often contains <p>
    const secondaryImageCell = cells.find(cell => cell !== mainImageCell && cell.querySelector('picture'));
    const productLinkCell = cells.find(cell => cell !== ctaLinkCell && cell.querySelector('a'));
    const ctaLinkCell = cells.find(cell => cell !== productLinkCell && cell.querySelector('a'));


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

    if (mainImageCell) {
      const mainPicture = mainImageCell.querySelector('picture');
      if (mainPicture) {
        const mainImg = mainPicture.querySelector('img');
        const optimizedMainPic = createOptimizedPicture(mainImg.src, mainImg.alt, false, [{ width: '750' }]);
        const optimizedMainImg = optimizedMainPic.querySelector('img');
        optimizedMainImg.classList.add('product-cards__card-thumb', 'object-fit-cover');
        moveInstrumentation(mainImg, optimizedMainImg);
        mainPicture.replaceWith(optimizedMainPic);
        ratioWrapper.append(optimizedMainPic);
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
    // Check 1.5: Richtext field 'cardTitle' uses innerHTML
    if (cardTitleCell) {
      cardTitle.innerHTML = cardTitleCell.innerHTML;
    }
    media.append(cardTitle);

    const cardImgWrapper = document.createElement('div');
    cardImgWrapper.classList.add(
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

    const productLink = document.createElement('a');
    productLink.classList.add('cta-analytics');
    if (productLinkCell) {
      const productLinkHref = productLinkCell.querySelector('a')?.href;
      if (productLinkHref) {
        productLink.href = productLinkHref;
      }
    }


    if (secondaryImageCell) {
      const secondaryPicture = secondaryImageCell.querySelector('picture');
      if (secondaryPicture) {
        const secondaryImg = secondaryPicture.querySelector('img');
        const optimizedSecondaryPic = createOptimizedPicture(secondaryImg.src, secondaryImg.alt, false, [{ width: '750' }]);
        const optimizedSecondaryImg = optimizedSecondaryPic.querySelector('img');
        optimizedSecondaryImg.classList.add('w-100', 'h-100', 'object-fit-contain');
        moveInstrumentation(secondaryImg, optimizedSecondaryImg);
        secondaryPicture.replaceWith(optimizedSecondaryPic);
        productLink.append(optimizedSecondaryPic);
      }
    }
    ratio1x1.append(productLink);
    cardImgWrapper.append(ratio1x1);
    media.append(cardImgWrapper);
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
    if (ctaLinkCell) {
      const ctaLinkHref = ctaLinkCell.querySelector('a')?.href;
      if (ctaLinkHref) {
        ctaLink.href = ctaLinkHref;
      }
      moveInstrumentation(ctaLinkCell, ctaLink);
    }
    ctaLink.textContent = 'Explore More'; // Text content is hardcoded, not from cell
    ctaWrapper.append(ctaLink);
    card.append(ctaWrapper);

    swiperWrapper.append(card);
  });

  productCardsContainer.append(swiperWrapper);
  swiperContainer.append(productCardsContainer);

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
  prevButton.disabled = true;
  prevButton.innerHTML = `
    <svg class="icon w-100 h-100">
      <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right_carousel"></use>
    </svg>
  `;
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
  nextButton.innerHTML = `
    <svg class="icon w-100 h-100">
      <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right_carousel"></use>
    </svg>
  `;
  swiperContainer.append(nextButton);

  swiperSection.append(swiperContainer);

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
  swiperSection.append(pagination);

  section.append(swiperSection);

  block.replaceWith(section);

  // Swiper initialization
  let swiper = null;
  const initSwiper = async () => {
    const { default: Swiper } = await import('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs');
    swiper = new Swiper(productCardsContainer, {
      slidesPerView: 'auto',
      spaceBetween: 32,
      loop: false,
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
      },
      pagination: {
        el: pagination,
        clickable: true,
        renderBullet: (index, className) => `<span class="${className}"></span>`, // Removed inline style, Swiper handles positioning
      },
      on: {
        init() {
          updateNavigationButtons();
        },
        slideChange() {
          updateNavigationButtons();
        },
      },
    });

    function updateNavigationButtons() {
      if (swiper) {
        if (swiper.isBeginning) {
          prevButton.disabled = true;
          prevButton.classList.add('opacity-30');
        } else {
          prevButton.disabled = false;
          prevButton.classList.remove('opacity-30');
        }

        if (swiper.isEnd) {
          nextButton.disabled = true;
          nextButton.classList.add('opacity-30');
        } else {
          nextButton.disabled = false;
          nextButton.classList.remove('opacity-30');
        }
      }
    }
  };

  initSwiper();
}
