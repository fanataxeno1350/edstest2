import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [
    titleRow,
    subtitleRow,
    ctaLinkRow,
    ctaLabelRow,
    ...recipeCardRows
  ] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('card-carousel'); // No block name class here, only from original HTML

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');
  section.append(container);

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
  title.textContent = titleRow.children[0]?.textContent.trim() || '';
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
  moveInstrumentation(subtitleRow, subtitle);
  subtitle.textContent = subtitleRow.children[0]?.textContent.trim() || '';
  container.append(subtitle);

  const swiperEl = document.createElement('div');
  swiperEl.classList.add('card-carousel__swiper', 'swiper', 'container', 'gx-0');
  swiperEl.dataset.loop = 'true'; // From original HTML

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('card-carousel__swiper--container', 'mt-8', 'mt-sm-10');
  swiperEl.append(swiperContainer);

  const popularRecipeContainer = document.createElement('div');
  popularRecipeContainer.classList.add('popular-recipe__container', 'overflow-hidden');
  swiperContainer.append(popularRecipeContainer);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper', 'popular-recipe__recipe-wrapper');
  popularRecipeContainer.append(swiperWrapper);

  recipeCardRows.forEach((row) => {
    const [
      linkCell,
      imageCell,
      tagCell,
      recipeTitleCell,
      descriptionCell,
      timeCell,
      servesCell,
      // hierarchyTreeCell, // Not used in this block's rendering
    ] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');
    moveInstrumentation(row, swiperSlide);

    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card', 'bg-cream-100', 'h-100');
    swiperSlide.append(recipeCard);

    const recipeLink = document.createElement('a');
    recipeLink.classList.add('recipe-card__link', 'd-block', 'position-relative');
    recipeLink.href = linkCell.querySelector('a')?.href || '#';
    recipeCard.append(recipeLink);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      recipeLink.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('recipe-card__image', 'object-fit-cover', 'w-100');
    }

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('recipe-card__content', 'py-6');
    recipeLink.append(contentDiv);

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('recipe-card__info', 'd-flex', 'align-items-center', 'justify-content-between');
    contentDiv.append(infoDiv);

    const tagSpan = document.createElement('span');
    tagSpan.classList.add(
      'recipe-card__tag',
      'text-uppercase',
      'text-red-100',
      'font-14',
      'font-xl-default',
      'leading-24',
      'fw-semibold',
    );
    tagSpan.textContent = tagCell?.textContent.trim() || '';
    infoDiv.append(tagSpan);

    const shareSvg = `
      <svg class="icon share text-dark-gray-100">
        <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#share"></use>
      </svg>
    `;
    infoDiv.insertAdjacentHTML('beforeend', shareSvg);

    const textDiv = document.createElement('div');
    textDiv.classList.add('recipe-card__text');
    contentDiv.append(textDiv);

    const titleH3 = document.createElement('h3');
    titleH3.classList.add(
      'recipe-card__title',
      'font-20',
      'font-xl-24',
      'leading-24',
      'leading-xl-30',
      'font-baskerville',
      'fw-bold',
      'text-dark-gray-100',
      'mt-4',
    );
    titleH3.textContent = recipeTitleCell?.textContent.trim() || '';
    textDiv.append(titleH3);

    const descP = document.createElement('p');
    descP.classList.add(
      'recipe-card__desc',
      'font-default',
      'font-xl-18',
      'leading-24',
      'fw-medium',
      'text-dark-gray-100',
      'mt-4',
    );
    descP.textContent = descriptionCell?.textContent.trim() || '';
    textDiv.append(descP);

    const waveDiv = document.createElement('div');
    waveDiv.classList.add('recipe-card__wave', 'mt-11', 'mt-xl-7', 'w-100');
    contentDiv.append(waveDiv);

    const propertiesUl = document.createElement('ul');
    propertiesUl.classList.add('recipe-card__properties', 'mt-4', 'd-flex', 'align-items-center');
    contentDiv.append(propertiesUl);

    const timeLi = document.createElement('li');
    timeLi.classList.add('recipe-card__property', 'recipe-card__property--left', 'd-flex', 'align-items-center');
    timeLi.insertAdjacentHTML(
      'beforeend',
      `<svg class="icon clock text-dark-gray-100 "><use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#clock"></use></svg>`,
    );
    const timeSpan = document.createElement('span');
    timeSpan.classList.add(
      'recipe-card__time',
      'text-dark-gray-100',
      'font-14',
      'font-xl-default',
      'leading-20',
      'fw-medium',
      'ms-2',
      'd-inline-block',
      'text-nowrap',
    );
    timeSpan.textContent = timeCell?.textContent.trim() || '';
    timeLi.append(timeSpan);
    propertiesUl.append(timeLi);

    const servesLi = document.createElement('li');
    servesLi.classList.add(
      'recipe-card__property',
      'recipe-card__property--right',
      'flex-fill',
      'd-flex',
      'align-items-center',
      'justify-content-end',
    );
    servesLi.insertAdjacentHTML(
      'beforeend',
      `<svg class="icon people text-dark-gray-100 "><use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#people"></use></svg>`,
    );
    const servesSpan = document.createElement('span');
    servesSpan.classList.add(
      'serve-content',
      'recipe-card__serves',
      'text-dark-gray-100',
      'font-14',
      'font-xl-default',
      'leading-20',
      'fw-medium',
      'ms-2',
      'd-inline-block',
    );
    servesSpan.textContent = servesCell?.textContent.trim() || '';
    servesLi.append(servesSpan);
    propertiesUl.append(servesLi);

    swiperWrapper.append(swiperSlide);
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
  );
  prevBtn.innerHTML = `<svg class="icon w-100 h-100"><use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right_carousel"></use></svg>`;
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
  nextBtn.innerHTML = `<svg class="icon w-100 h-100"><use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right_carousel"></use></svg>`;
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

  section.append(swiperEl);

  const ctaDiv = document.createElement('div');
  ctaDiv.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'mt-8');
  section.append(ctaDiv);

  const ctaLink = document.createElement('a');
  ctaLink.classList.add(
    'svasti-cta',
    'cta-analytics',
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
  ctaLink.href = ctaLinkRow.querySelector('a')?.href || '#';
  moveInstrumentation(ctaLinkRow, ctaLink);

  const ctaLabelSpan = document.createElement('span');
  ctaLabelSpan.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
  ctaLabelSpan.textContent = ctaLabelRow.children[0]?.textContent.trim() || '';
  moveInstrumentation(ctaLabelRow, ctaLabelSpan);
  ctaLink.append(ctaLabelSpan);
  ctaDiv.append(ctaLink);

  block.replaceChildren(section);

  // Swiper initialization
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
    slidesPerView: 'auto',
    spaceBetween: 34, // Based on original HTML margin-right
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
      576: { slidesPerView: 2, spaceBetween: 34 },
      768: { slidesPerView: 3, spaceBetween: 34 },
      992: { slidesPerView: 4, spaceBetween: 34 },
    },
  });
}
