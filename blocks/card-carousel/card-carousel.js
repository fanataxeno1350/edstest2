import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    // Handle label-only nodes
    const anchor = li.querySelector(':scope > a');
    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
      }
    }
    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      // Ensure this class is from the original HTML or a valid design system class
      subWrap.classList.add('has-sub-child'); 
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Fixed fields
  const [titleRow, subtitleRow, ctaLinkRow, ctaLabelRow, ...itemRows] = children;

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');

  const title = document.createElement('h2');
  title.classList.add('card-carousel__title', 'font-24', 'leading-28', 'font-sm-40', 'leading-sm-50', 'text-dark-gray-100', 'text-center', 'font-baskerville');
  title.textContent = titleRow?.firstElementChild?.textContent.trim() || '';
  moveInstrumentation(titleRow, title);
  container.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.classList.add('card-carousel__subtitle', 'font-default', 'leading-24', 'font-sm-18', 'leading-sm-32', 'text-dark-gray-100', 'text-center', 'mt-4', 'fw-medium');
  subtitle.textContent = subtitleRow?.firstElementChild?.textContent.trim() || '';
  moveInstrumentation(subtitleRow, subtitle);
  container.appendChild(subtitle);

  block.innerHTML = '';
  block.appendChild(container);

  const swiperSection = document.createElement('div');
  swiperSection.classList.add('card-carousel__swiper', 'swiper', 'container', 'gx-0');
  swiperSection.setAttribute('data-loop', 'true'); // From original HTML

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('card-carousel__swiper--container', 'mt-8', 'mt-sm-10');
  swiperSection.appendChild(swiperContainer);

  const popularRecipeSection = document.createElement('section');
  popularRecipeSection.classList.add('popular-recipe', 'slide-in-anim');
  swiperContainer.appendChild(popularRecipeSection);

  const popularRecipeData = document.createElement('div');
  popularRecipeData.classList.add('popular-recipe__data', 'd-none');
  popularRecipeData.setAttribute('data-search-in', '/content/svasti/in/en/our-recipe');
  popularRecipeData.setAttribute('data-article-from', 'recipePage');
  popularRecipeData.setAttribute('data-limit', '6');
  popularRecipeData.setAttribute('data-hours-text', 'hrs');
  popularRecipeData.setAttribute('data-hour-text', 'hr');
  popularRecipeData.setAttribute('data-minutes-text', 'mins');
  popularRecipeData.setAttribute('data-minute-text', 'min');
  popularRecipeSection.appendChild(popularRecipeData);

  const popularRecipeContainer = document.createElement('div');
  popularRecipeContainer.classList.add('popular-recipe__container', 'overflow-hidden');
  popularRecipeContainer.setAttribute('data-swiper-init-async', 'true');
  popularRecipeSection.appendChild(popularRecipeContainer);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper', 'popular-recipe__recipe-wrapper');
  popularRecipeContainer.appendChild(swiperWrapper);

  const socialShareModal = document.createElement('section');
  socialShareModal.classList.add('social-media-share', 'd-none', 'w-100', 'justify-content-center', 'align-items-center', 'position-fixed', 'top-0', 'start-0', 'end-0', 'bottom-0', 'z-2');
  popularRecipeSection.appendChild(socialShareModal);

  const socialShareWrapper = document.createElement('div');
  socialShareWrapper.classList.add('social-media-share__wrapper', 'bg-cream-100', 'py-8', 'px-3', 'px-md-8');
  socialShareModal.appendChild(socialShareWrapper);

  const socialShareTitleClose = document.createElement('div');
  socialShareTitleClose.classList.add('social-media-share__wrapper--title-close', 'pb-8', 'd-flex', 'mx-3', 'mx-md-0', 'border-bottom', 'border-dark-gray-100', 'align-items-center', 'justify-content-between');
  socialShareWrapper.appendChild(socialShareTitleClose);

  const socialShareCloseBtn = document.createElement('div');
  socialShareCloseBtn.classList.add('social-media-share__wrapper--close');
  socialShareCloseBtn.innerHTML = `
    <svg class="icon cross text-black h-100 w-100">
      <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#cross"></use>
    </svg>
  `;
  socialShareTitleClose.appendChild(socialShareCloseBtn);
  socialShareCloseBtn.addEventListener('click', () => socialShareModal.classList.add('d-none'));
  socialShareModal.addEventListener('click', (e) => {
    if (e.target === socialShareModal) {
      socialShareModal.classList.add('d-none');
    }
  });

  const socialIconsWrapper = document.createElement('div');
  socialIconsWrapper.classList.add('social-media-share__wrapper--social-icons', 'pt-8', 'd-flex', 'overflow-hidden');
  socialShareWrapper.appendChild(socialIconsWrapper);

  const socialIconsSwiperWrapper = document.createElement('div');
  socialIconsSwiperWrapper.classList.add('social-media-share__wrapper--social-icons-wrapper', 'swiper-wrapper', 'px-3', 'px-md-0');
  socialIconsSwiperWrapper.setAttribute('data-page-url', '#');
  socialIconsWrapper.appendChild(socialIconsSwiperWrapper);

  const socialShareInputButton = document.createElement('div');
  socialShareInputButton.classList.add('social-media-share__wrapper--input-button', 'd-flex', 'align-items-center', 'mt-8', 'justify-content-md-center', 'flex-column', 'flex-md-row');
  socialShareWrapper.appendChild(socialShareInputButton);

  const shareInput = document.createElement('input');
  shareInput.classList.add('social-media-share__wrapper--input', 'bg-white', 'font-16', 'leading-22', 'px-4', 'py-3', 'shadow-none');
  shareInput.type = 'text';
  socialShareInputButton.appendChild(shareInput);

  const copyButton = document.createElement('button');
  copyButton.classList.add('social-media-share__wrapper--button', 'font-18', 'leading-24', 'py-4', 'px-8', 'fw-bold', 'text-white');
  copyButton.textContent = 'Copy';
  socialShareInputButton.appendChild(copyButton);

  copyButton.addEventListener('click', () => {
    shareInput.select();
    navigator.clipboard.writeText(shareInput.value);
  });

  const recipeCards = [];
  const socialShareItems = [];

  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 9) { // Recipe Card
      recipeCards.push(row);
    } else if (cells.length === 4) { // Social Media Share Item
      socialShareItems.push(row);
    }
  });

  recipeCards.forEach((row) => {
    const [
      linkCell,
      imageCell,
      imageAltCell,
      tagCell,
      titleCell,
      descriptionCell,
      timeCell,
      servesCell,
      hierarchyCell,
    ] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');
    moveInstrumentation(row, swiperSlide);

    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card', 'bg-cream-100', 'h-100');
    swiperSlide.appendChild(recipeCard);

    const recipeLink = document.createElement('a');
    recipeLink.classList.add('recipe-card__link', 'd-block', 'position-relative');
    recipeLink.href = linkCell?.querySelector('a')?.href || '#';
    recipeCard.appendChild(recipeLink);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, imageAltCell?.textContent.trim() || img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      optimizedPic.classList.add('recipe-card__image', 'object-fit-cover', 'w-100');
      recipeLink.appendChild(optimizedPic);
    }

    const content = document.createElement('div');
    content.classList.add('recipe-card__content', 'py-6');
    recipeLink.appendChild(content);

    const info = document.createElement('div');
    info.classList.add('recipe-card__info', 'd-flex', 'align-items-center', 'justify-content-between');
    content.appendChild(info);

    const tag = document.createElement('span');
    tag.classList.add('recipe-card__tag', 'text-uppercase', 'text-red-100', 'font-14', 'font-xl-default', 'leading-24', 'fw-semibold');
    tag.textContent = tagCell?.textContent.trim() || '';
    info.appendChild(tag);

    const shareIcon = document.createElement('svg');
    shareIcon.classList.add('icon', 'share', 'text-dark-gray-100');
    shareIcon.innerHTML = '<use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#share"></use>';
    info.appendChild(shareIcon);
    shareIcon.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      socialShareModal.classList.remove('d-none');
      shareInput.value = recipeLink.href;
      socialIconsSwiperWrapper.setAttribute('data-page-url', recipeLink.href);
    });

    const text = document.createElement('div');
    text.classList.add('recipe-card__text');
    content.appendChild(text);

    const recipeTitle = document.createElement('h3');
    recipeTitle.classList.add('recipe-card__title', 'font-20', 'font-xl-24', 'leading-24', 'leading-xl-30', 'font-baskerville', 'fw-bold', 'text-dark-gray-100', 'mt-4');
    recipeTitle.textContent = titleCell?.textContent.trim() || '';
    text.appendChild(recipeTitle);

    const description = document.createElement('p');
    description.classList.add('recipe-card__desc', 'font-default', 'font-xl-18', 'leading-24', 'fw-medium', 'text-dark-gray-100', 'mt-4');
    description.textContent = descriptionCell?.textContent.trim() || '';
    text.appendChild(description);

    const wave = document.createElement('div');
    wave.classList.add('recipe-card__wave', 'mt-11', 'mt-xl-7', 'w-100');
    content.appendChild(wave);

    const properties = document.createElement('ul');
    properties.classList.add('recipe-card__properties', 'mt-4', 'd-flex', 'align-items-center', 'mt-4');
    content.appendChild(properties);

    const timeProperty = document.createElement('li');
    timeProperty.classList.add('recipe-card__property', 'recipe-card__property--left', 'd-flex', 'align-items-center');
    timeProperty.innerHTML = `
      <svg class="icon clock text-dark-gray-100">
        <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#clock"></use>
      </svg>
      <span class="recipe-card__time text-dark-gray-100 font-14 font-xl-default leading-20 fw-medium ms-2 d-inline-block text-nowrap">${timeCell?.textContent.trim() || ''}</span>
    `;
    properties.appendChild(timeProperty);

    const servesProperty = document.createElement('li');
    servesProperty.classList.add('recipe-card__property', 'recipe-card__property--right', 'flex-fill', 'd-flex', 'align-items-center', 'justify-content-end');
    servesProperty.innerHTML = `
      <svg class="icon people text-dark-gray-100">
        <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#people"></use>
      </svg>
      <span class="serve-content recipe-card__serves text-dark-gray-100 font-14 font-xl-default leading-20 fw-medium ms-2 d-inline-block">${servesCell?.textContent.trim() || ''}</span>
    `;
    properties.appendChild(servesProperty);

    // Hierarchy tree (richtext field)
    if (hierarchyCell) {
      const hierarchyWrapper = document.createElement('div');
      hierarchyWrapper.classList.add('recipe-card__hierarchy'); // Use a class from original HTML if available
      
      // Create a temporary div to parse the innerHTML and apply classes
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell to tempDiv

      // Apply classes to nested elements as per original HTML or design system
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('nav-menu', 'list-unstyled'));
      tempDiv.querySelectorAll('li').forEach(li => li.classList.add('nav-menu-item', 'list-item'));
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('nav-menu-link', 'text-decoration-none'));

      // Move all children from tempDiv to hierarchyWrapper
      while (tempDiv.firstChild) {
        hierarchyWrapper.appendChild(tempDiv.firstChild);
      }
      
      content.appendChild(hierarchyWrapper);
      // transformNestedLists(hierarchyWrapper.querySelector('ul')); // Apply interactivity if needed
    }

    swiperWrapper.appendChild(swiperSlide);
  });

  socialShareItems.forEach((row) => {
    const [shareLinkCell, iconCell, labelCell, platformCell] = [...row.children];

    const iconLabelWrapper = document.createElement('div');
    iconLabelWrapper.classList.add('social-media-share__wrapper--icon-label', 'swiper-slide', 'd-flex', 'align-items-center');
    moveInstrumentation(row, iconLabelWrapper);

    const socialLink = document.createElement('a');
    socialLink.classList.add('social-media-share__link', 'd-flex', 'align-items-center', 'text-decoration-none', 'gap-4', 'w-fit', 'flex-md-column', 'justify-content-center');
    socialLink.href = shareLinkCell?.querySelector('a')?.href || '#';
    socialLink.target = '_blank';
    iconLabelWrapper.appendChild(socialLink);

    const iconContainer = document.createElement('div');
    iconContainer.classList.add('social-media-share__wrapper--icons', 'rounded-circle', 'bg-white', 'd-flex', 'justify-content-center', 'align-items-center');
    socialLink.appendChild(iconContainer);

    const iconLink = document.createElement('div');
    iconLink.classList.add('social-media-share__wrapper--link', 'text-decoration-none');
    iconContainer.appendChild(iconLink);

    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      // Assuming the SVG sprite is used, we need to extract the ID from the img alt or src if it's a direct SVG.
      // For now, let's assume the platform name can be used to derive the icon class.
      const platformName = platformCell?.textContent.trim().toLowerCase();
      const svgIcon = document.createElement('svg');
      svgIcon.classList.add('icon', `text-black`, `${platformName}`, 'social-media-share__wrapper--images');
      svgIcon.innerHTML = `<use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#${platformName}"></use>`;
      iconLink.appendChild(svgIcon);
    }

    const socialLabel = document.createElement('div');
    socialLabel.classList.add('social-media-share__wrapper--label', 'text-center', 'font-16', 'leading-22', 'text-black');
    socialLabel.setAttribute('data-socialmedia-name', platformCell?.textContent.trim().toLowerCase() || '');
    socialLabel.textContent = labelCell?.textContent.trim() || '';
    socialLink.appendChild(socialLabel);

    const screenReaderOnly = document.createElement('span');
    screenReaderOnly.classList.add('cmp-link__screen-reader-only');
    screenReaderOnly.textContent = 'opens in a new tab';
    socialLink.appendChild(screenReaderOnly);

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.classList.add('social-media-share__wrapper--url');
    hiddenInput.value = platformCell?.textContent.trim().toLowerCase() || '';
    iconLabelWrapper.appendChild(hiddenInput);

    socialIconsSwiperWrapper.appendChild(iconLabelWrapper);
  });

  block.appendChild(swiperSection);

  // Add navigation buttons and pagination
  const prevButton = document.createElement('button');
  prevButton.classList.add('card-carousel__swiper--prev', 'card-carousel__navigation', 'cursor-pointer', 'rounded-circle', 'bg-transparent', 'text-red-100', 'text-maroon-600-hover', 'justify-content-center', 'align-items-center', 'position-absolute', 'd-none', 'd-sm-flex');
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
  pagination.style.width = '140px';
  swiperSection.appendChild(pagination);

  // CTA button
  const ctaWrapper = document.createElement('div');
  ctaWrapper.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'mt-8');
  block.appendChild(ctaWrapper);

  const ctaLink = document.createElement('a');
  ctaLink.classList.add('svasti-cta', 'cta-analytics', 'w-fit', 'text-decoration-none', 'd-flex', 'align-items-center', 'primary', 'px-8', 'pb-3', 'text-cream-100', 'border', 'border-2', 'border-red-100', 'border-maroon-100-hover', 'border-red-300-active', 'bg-red-100', 'bg-maroon-100-hover', 'bg-red-300-active');
  ctaLink.href = ctaLinkRow?.querySelector('a')?.href || '#';
  moveInstrumentation(ctaLinkRow, ctaLink);
  ctaWrapper.appendChild(ctaLink);

  const ctaLabel = document.createElement('span');
  ctaLabel.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
  ctaLabel.textContent = ctaLabelRow?.firstElementChild?.textContent.trim() || '';
  moveInstrumentation(ctaLabelRow, ctaLabel);
  ctaLink.appendChild(ctaLabel);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
