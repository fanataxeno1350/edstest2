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
      subWrap.classList.add('has-sub-child'); // Use class from original HTML if available, or a generic one
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
  const [
    titleRow,
    subtitleRow,
    ctaLinkRow,
    ctaLabelRow,
    ...itemRows
  ] = [...block.children];

  // Create main container
  const section = document.createElement('section');
  section.classList.add('card-carousel');
  // Background style from original HTML, if any, can be added here
  // section.style.background = '#F4DBC3'; // Example: if background is dynamic

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');
  section.append(container);

  // Carousel Title
  const title = document.createElement('h2');
  title.classList.add(
    'card-carousel__title',
    'font-24',
    'leading-28',
    'font-sm-40',
    'leading-sm-50',
    'text-dark-gray-100',
    'text-center',
    'font-baskerville'
  );
  const titleCell = [...titleRow.children].find((cell) => cell.textContent.trim());
  if (titleCell) {
    moveInstrumentation(titleCell, title);
    title.textContent = titleCell.textContent.trim();
  }
  container.append(title);

  // Carousel Subtitle
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
    'fw-medium'
  );
  const subtitleCell = [...subtitleRow.children].find((cell) => cell.textContent.trim());
  if (subtitleCell) {
    moveInstrumentation(subtitleCell, subtitle);
    subtitle.textContent = subtitleCell.textContent.trim();
  }
  container.append(subtitle);

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('card-carousel__swiper', 'swiper', 'container', 'gx-0');
  section.append(swiperContainer);

  const swiperWrapperOuter = document.createElement('div');
  swiperWrapperOuter.classList.add('card-carousel__swiper--container', 'mt-8', 'mt-sm-10');
  swiperContainer.append(swiperWrapperOuter);

  const popularRecipeSection = document.createElement('section');
  popularRecipeSection.classList.add('popular-recipe', 'slide-in-anim');
  swiperWrapperOuter.append(popularRecipeSection);

  const popularRecipeData = document.createElement('div');
  popularRecipeData.classList.add('popular-recipe__data', 'd-none');
  // Add data attributes from original HTML if needed, e.g., data-search-in, data-article-from, data-limit, etc.
  popularRecipeSection.append(popularRecipeData);

  const popularRecipeContainer = document.createElement('div');
  popularRecipeContainer.classList.add(
    'popular-recipe__container',
    'overflow-hidden',
    'swiper-initialized',
    'swiper-horizontal',
    'swiper-backface-hidden'
  );
  popularRecipeSection.append(popularRecipeContainer);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper', 'popular-recipe__recipe-wrapper');
  popularRecipeContainer.append(swiperWrapper);

  const recipeCards = itemRows.filter((row) => row.children.length === 9);
  const socialShareItems = itemRows.filter((row) => row.children.length === 3);

  recipeCards.forEach((row) => {
    const [
      linkCell,
      imageCell,
      imageAltCell,
      tagCell,
      recipeTitleCell,
      descriptionCell,
      timeCell,
      servesCell,
      hierarchyCell,
    ] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');
    swiperWrapper.append(swiperSlide);

    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card', 'bg-cream-100', 'h-100');
    swiperSlide.append(recipeCard);

    const recipeLink = document.createElement('a');
    recipeLink.classList.add('recipe-card__link', 'd-block', 'position-relative');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) recipeLink.href = foundLink.href;
    moveInstrumentation(linkCell, recipeLink);
    recipeCard.append(recipeLink);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      const recipeImage = optimizedPic.querySelector('img');
      recipeImage.classList.add('recipe-card__image', 'object-fit-cover', 'w-100');
      recipeLink.append(optimizedPic);
    }

    const content = document.createElement('div');
    content.classList.add('recipe-card__content', 'py-6');
    recipeLink.append(content);

    const info = document.createElement('div');
    info.classList.add('recipe-card__info', 'd-flex', 'align-items-center', 'justify-content-between');
    content.append(info);

    const tagSpan = document.createElement('span');
    tagSpan.classList.add(
      'recipe-card__tag',
      'text-uppercase',
      'text-red-100',
      'font-14',
      'font-xl-default',
      'leading-24',
      'fw-semibold'
    );
    moveInstrumentation(tagCell, tagSpan);
    tagSpan.textContent = tagCell.textContent.trim();
    info.append(tagSpan);

    const shareSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    shareSvg.classList.add('icon', 'share', 'text-dark-gray-100');
    const useShare = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    useShare.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#share');
    shareSvg.append(useShare);
    info.append(shareSvg);

    // Event listener for share icon to open social media share modal
    shareSvg.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const socialMediaShareModal = section.querySelector('.social-media-share');
      if (socialMediaShareModal) {
        socialMediaShareModal.classList.remove('d-none');
      }
    });

    const textDiv = document.createElement('div');
    textDiv.classList.add('recipe-card__text');
    content.append(textDiv);

    const recipeTitle = document.createElement('h3');
    recipeTitle.classList.add(
      'recipe-card__title',
      'font-20',
      'font-xl-24',
      'leading-24',
      'leading-xl-30',
      'font-baskerville',
      'fw-bold',
      'text-dark-gray-100',
      'mt-4'
    );
    moveInstrumentation(recipeTitleCell, recipeTitle);
    recipeTitle.textContent = recipeTitleCell.textContent.trim();
    textDiv.append(recipeTitle);

    const description = document.createElement('p');
    description.classList.add(
      'recipe-card__desc',
      'font-default',
      'font-xl-18',
      'leading-24',
      'fw-medium',
      'text-dark-gray-100',
      'mt-4'
    );
    moveInstrumentation(descriptionCell, description);
    description.textContent = descriptionCell.textContent.trim();
    textDiv.append(description);

    const wave = document.createElement('div');
    wave.classList.add('recipe-card__wave', 'mt-11', 'mt-xl-7', 'w-100');
    content.append(wave);

    const properties = document.createElement('ul');
    properties.classList.add('recipe-card__properties', 'mt-4', 'd-flex', 'align-items-center');
    content.append(properties);

    const timeProperty = document.createElement('li');
    timeProperty.classList.add('recipe-card__property', 'recipe-card__property--left', 'd-flex', 'align-items-center');
    properties.append(timeProperty);

    const clockSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    clockSvg.classList.add('icon', 'clock', 'text-dark-gray-100');
    const useClock = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    useClock.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#clock');
    clockSvg.append(useClock);
    timeProperty.append(clockSvg);

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
      'text-nowrap'
    );
    moveInstrumentation(timeCell, timeSpan);
    timeSpan.textContent = timeCell.textContent.trim();
    timeProperty.append(timeSpan);

    const servesProperty = document.createElement('li');
    servesProperty.classList.add(
      'recipe-card__property',
      'recipe-card__property--right',
      'flex-fill',
      'd-flex',
      'align-items-center',
      'justify-content-end'
    );
    properties.append(servesProperty);

    const peopleSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    peopleSvg.classList.add('icon', 'people', 'text-dark-gray-100');
    const usePeople = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    usePeople.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#people');
    peopleSvg.append(usePeople);
    servesProperty.append(peopleSvg);

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
      'd-inline-block'
    );
    moveInstrumentation(servesCell, servesSpan);
    servesSpan.textContent = servesCell.textContent.trim();
    servesProperty.append(servesSpan);

    // Navigation Hierarchy (richtext)
    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      const hierarchyWrapper = document.createElement('div');
      hierarchyWrapper.classList.add('hidden-hierarchy'); // Custom class for now, adjust based on original HTML if available

      // Use innerHTML to preserve nested structure
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv);

      // Apply classes from ORIGINAL HTML to nested elements
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('nav-menu', 'list-unstyled'));
      tempDiv.querySelectorAll('li').forEach(li => li.classList.add('nav-menu-item', 'list-item'));
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('nav-menu-link', 'text-decoration-none', 'text-dark-gray-100', 'font-default', 'leading-24', 'fw-medium'));

      while (tempDiv.firstChild) {
        hierarchyWrapper.append(tempDiv.firstChild);
      }

      recipeCard.append(hierarchyWrapper);
      transformNestedLists(hierarchyWrapper.querySelector('ul')); // Apply transformations to the moved list
    }
  });

  // Social Media Share Section
  const popularRecipeShare = document.createElement('div');
  popularRecipeShare.classList.add('popular-recipe__share');
  popularRecipeSection.append(popularRecipeShare);

  const socialMediaShare = document.createElement('section');
  socialMediaShare.classList.add(
    'social-media-share',
    'd-none', // Hidden by default
    'w-100',
    'justify-content-center',
    'align-items-center',
    'position-fixed',
    'top-0',
    'start-0',
    'end-0',
    'bottom-0',
    'z-2'
  );
  popularRecipeShare.append(socialMediaShare);

  const shareWrapper = document.createElement('div');
  shareWrapper.classList.add('social-media-share__wrapper', 'bg-cream-100', 'py-8', 'px-3', 'px-md-8');
  socialMediaShare.append(shareWrapper);

  const titleCloseWrapper = document.createElement('div');
  titleCloseWrapper.classList.add(
    'social-media-share__wrapper--title-close',
    'pb-8',
    'd-flex',
    'mx-3',
    'mx-md-0',
    'border-bottom',
    'border-dark-gray-100',
    'align-items-center',
    'justify-content-between'
  );
  shareWrapper.append(titleCloseWrapper);

  const closeDiv = document.createElement('div');
  closeDiv.classList.add('social-media-share__wrapper--close');
  titleCloseWrapper.append(closeDiv);

  const crossSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  crossSvg.classList.add('icon', 'cross', 'text-black', 'h-100', 'w-100');
  const useCross = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useCross.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#cross');
  crossSvg.append(useCross);
  closeDiv.append(crossSvg);

  // Close button event listener
  closeDiv.addEventListener('click', () => {
    socialMediaShare.classList.add('d-none');
  });
  socialMediaShare.addEventListener('click', (e) => {
    if (e.target === socialMediaShare) {
      socialMediaShare.classList.add('d-none');
    }
  });

  const socialIconsWrapper = document.createElement('div');
  socialIconsWrapper.classList.add(
    'social-media-share__wrapper--social-icons',
    'pt-8',
    'd-flex',
    'overflow-hidden',
    'swiper-initialized',
    'swiper-horizontal'
  );
  shareWrapper.append(socialIconsWrapper);

  const socialSwiperWrapper = document.createElement('div');
  socialSwiperWrapper.classList.add('social-media-share__wrapper--social-icons-wrapper', 'swiper-wrapper', 'px-3', 'px-md-0');
  socialIconsWrapper.append(socialSwiperWrapper);

  socialShareItems.forEach((row) => {
    const [shareLinkCell, platformCell, labelCell] = [...row.children];

    const iconLabelDiv = document.createElement('div');
    iconLabelDiv.classList.add('social-media-share__wrapper--icon-label', 'swiper-slide', 'd-flex', 'align-items-center');
    socialSwiperWrapper.append(iconLabelDiv);

    const shareLink = document.createElement('a');
    shareLink.classList.add(
      'social-media-share__link',
      'd-flex',
      'align-items-center',
      'text-decoration-none',
      'gap-4',
      'w-fit',
      'flex-md-column',
      'justify-content-center'
    );
    const foundShareLink = shareLinkCell.querySelector('a');
    if (foundShareLink) shareLink.href = foundShareLink.href;
    shareLink.target = '_blank';
    moveInstrumentation(shareLinkCell, shareLink);
    iconLabelDiv.append(shareLink);

    const iconsDiv = document.createElement('div');
    iconsDiv.classList.add(
      'social-media-share__wrapper--icons',
      'rounded-circle',
      'bg-white',
      'd-flex',
      'justify-content-center',
      'align-items-center'
    );
    shareLink.append(iconsDiv);

    const iconLink = document.createElement('div'); // This div contains the SVG
    iconLink.classList.add('social-media-share__wrapper--link', 'text-decoration-none');
    iconsDiv.append(iconLink);

    const platformName = platformCell.textContent.trim().toLowerCase();
    const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSvg.classList.add('icon', 'text-black', platformName, 'social-media-share__wrapper--images');
    const useIcon = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    useIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#${platformName}`);
    iconSvg.append(useIcon);
    iconLink.append(iconSvg);

    const labelDiv = document.createElement('div');
    labelDiv.classList.add(
      'social-media-share__wrapper--label',
      'text-center',
      'font-16',
      'leading-22',
      'text-black'
    );
    labelDiv.setAttribute('data-socialmedia-name', platformName);
    moveInstrumentation(labelCell, labelDiv);
    labelDiv.textContent = labelCell.textContent.trim();
    shareLink.append(labelDiv);

    const screenReaderOnly = document.createElement('span');
    screenReaderOnly.classList.add('cmp-link__screen-reader-only');
    screenReaderOnly.textContent = 'opens in a new tab';
    shareLink.append(screenReaderOnly);

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.classList.add('social-media-share__wrapper--url');
    hiddenInput.value = platformName;
    iconLabelDiv.append(hiddenInput);
  });

  // Share buttons (prev/next) for social media carousel
  const prevButton = document.createElement('button');
  prevButton.classList.add(
    'social-media-share__button',
    'bg-transparent',
    'border-0',
    'social-media-share__prev',
    'd-none',
    'z-2',
    'd-md-block',
    'position-absolute',
    'swiper-button-prev'
  );
  const prevSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  prevSvg.classList.add('icon', 'carousel-right-arrow-v2', 'h-100', 'w-100', 'text-red-100');
  const usePrev = document.createElementNS('http://www.w3.org/1999/xlink', 'xlink:href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right_carousel_v2');
  prevSvg.append(usePrev);
  prevButton.append(prevSvg);
  socialIconsWrapper.append(prevButton);

  const nextButton = document.createElement('button');
  nextButton.classList.add(
    'social-media-share__button',
    'bg-transparent',
    'border-0',
    'social-media-share__next',
    'd-none',
    'z-2',
    'd-md-block',
    'position-absolute',
    'swiper-button-next'
  );
  const nextSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  nextSvg.classList.add('icon', 'carousel-right-arrow-v2', 'h-100', 'w-100', 'text-red-100');
  const useNext = document.createElementNS('http://www.w3.org/1999/xlink', 'xlink:href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right_carousel_v2');
  nextSvg.append(useNext);
  nextButton.append(nextSvg);
  socialIconsWrapper.append(nextButton);

  const inputButtonWrapper = document.createElement('div');
  inputButtonWrapper.classList.add(
    'social-media-share__wrapper--input-button',
    'd-flex',
    'align-items-center',
    'mt-8',
    'justify-content-md-center',
    'flex-column',
    'flex-md-row'
  );
  shareWrapper.append(inputButtonWrapper);

  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.classList.add(
    'social-media-share__wrapper--input',
    'bg-white',
    'font-16',
    'leading-22',
    'px-4',
    'py-3',
    'shadow-none'
  );
  inputButtonWrapper.append(inputField);

  const copyButton = document.createElement('button');
  copyButton.classList.add(
    'social-media-share__wrapper--button',
    'font-18',
    'leading-24',
    'py-4',
    'px-8',
    'fw-bold',
    'text-white'
  );
  copyButton.textContent = 'Copy';
  inputButtonWrapper.append(copyButton);

  // Event listener for copy button
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(inputField.value);
      // Optionally provide user feedback, e.g., change button text to "Copied!"
      const originalText = copyButton.textContent;
      copyButton.textContent = 'Copied!';
      setTimeout(() => {
        copyButton.textContent = originalText;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  });

  // Carousel navigation buttons
  const carouselPrevButton = document.createElement('button');
  carouselPrevButton.classList.add(
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
    'd-sm-flex'
  );
  const carouselPrevSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  carouselPrevSvg.classList.add('icon', 'w-100', 'h-100');
  const useCarouselPrev = document.createElementNS('http://www.w3.org/1999/xlink', 'xlink:href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right_carousel');
  carouselPrevSvg.append(useCarouselPrev);
  carouselPrevButton.append(carouselPrevSvg);
  swiperWrapperOuter.append(carouselPrevButton);

  const carouselNextButton = document.createElement('button');
  carouselNextButton.classList.add(
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
    'd-sm-flex'
  );
  const carouselNextSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  carouselNextSvg.classList.add('icon', 'w-100', 'h-100');
  const useCarouselNext = document.createElementNS('http://www.w3.org/1999/xlink', 'xlink:href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right_carousel');
  carouselNextSvg.append(useCarouselNext);
  carouselNextButton.append(carouselNextSvg);
  swiperWrapperOuter.append(carouselNextButton);

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
    'w-fit'
  );
  swiperContainer.append(pagination);

  // CTA button at the bottom
  const ctaWrapper = document.createElement('div');
  ctaWrapper.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'mt-8');
  section.append(ctaWrapper);

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
    'bg-red-300-active'
  );
  const foundCtaLink = ctaLinkRow.querySelector('a');
  if (foundCtaLink) ctaLink.href = foundCtaLink.href;
  moveInstrumentation(ctaLinkRow, ctaLink);

  const ctaLabel = document.createElement('span');
  ctaLabel.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
  const ctaLabelContent = [...ctaLabelRow.children].find((cell) => cell.textContent.trim());
  if (ctaLabelContent) {
    moveInstrumentation(ctaLabelContent, ctaLabel);
    ctaLabel.textContent = ctaLabelContent.textContent.trim();
  }
  ctaLink.append(ctaLabel);
  ctaWrapper.append(ctaLink);

  block.replaceChildren(section);
}
