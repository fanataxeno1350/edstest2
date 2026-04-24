import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    titleRow,
    subtitleRow,
    ctaLinkRow,
    ctaLabelRow,
    ...itemRows
  ] = [...block.children];

  // Section container
  const section = document.createElement('section');
  section.classList.add('card-carousel');
  moveInstrumentation(block, section);

  // Main container for title, subtitle
  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');
  section.appendChild(container);

  // Title
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
  title.textContent = titleRow?.textContent.trim() || '';
  moveInstrumentation(titleRow, title);
  container.appendChild(title);

  // Subtitle
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
  subtitle.textContent = subtitleRow?.textContent.trim() || '';
  moveInstrumentation(subtitleRow, subtitle);
  container.appendChild(subtitle);

  // Swiper container
  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('card-carousel__swiper', 'swiper', 'container', 'gx-0');
  swiperContainer.setAttribute('data-loop', 'true');
  section.appendChild(swiperContainer);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('card-carousel__swiper--container', 'mt-8', 'mt-sm-10');
  swiperContainer.appendChild(swiperWrapper);

  const popularRecipeContainer = document.createElement('div');
  popularRecipeContainer.classList.add(
    'popular-recipe__container',
    'overflow-hidden',
    'swiper-initialized',
    'swiper-horizontal',
    'swiper-backface-hidden',
  );
  popularRecipeContainer.setAttribute('data-swiper-init-async', 'true');
  swiperWrapper.appendChild(popularRecipeContainer);

  const swiperInnerWrapper = document.createElement('div');
  swiperInnerWrapper.classList.add('swiper-wrapper', 'popular-recipe__recipe-wrapper');
  popularRecipeContainer.appendChild(swiperInnerWrapper);

  const recipeCards = itemRows.filter((row) => row.children.length === 9);
  const socialShareItems = itemRows.filter((row) => row.children.length === 2);

  recipeCards.forEach((row, index) => {
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

    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    if (index === 0) {
      slide.classList.add('swiper-slide-active');
    } else if (index === 1) {
      slide.classList.add('swiper-slide-next');
    }
    swiperInnerWrapper.appendChild(slide);

    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card', 'bg-cream-100', 'h-100');
    slide.appendChild(recipeCard);

    const recipeLink = document.createElement('a');
    recipeLink.classList.add('recipe-card__link', 'd-block', 'position-relative');
    recipeLink.href = linkCell?.querySelector('a')?.href || '#';
    moveInstrumentation(linkCell, recipeLink);
    recipeCard.appendChild(recipeLink);

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(
          img.src,
          imageAltCell?.textContent.trim() || img.alt,
          false,
          [{ width: '750' }],
        );
        optimizedPic.querySelector('img').classList.add('recipe-card__image', 'object-fit-cover', 'w-100');
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        recipeLink.appendChild(optimizedPic);
      }
    }

    const content = document.createElement('div');
    content.classList.add('recipe-card__content', 'py-6');
    recipeLink.appendChild(content);

    const info = document.createElement('div');
    info.classList.add('recipe-card__info', 'd-flex', 'align-items-center', 'justify-content-between');
    content.appendChild(info);

    const tag = document.createElement('span');
    tag.classList.add(
      'recipe-card__tag',
      'text-uppercase',
      'text-red-100',
      'font-14',
      'font-xl-default',
      'leading-24',
      'fw-semibold',
    );
    tag.textContent = tagCell?.textContent.trim() || '';
    moveInstrumentation(tagCell, tag);
    info.appendChild(tag);

    const shareSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    shareSvg.classList.add('icon', 'share', 'text-dark-gray-100');
    const shareUse = document.createElementNS('http://www.w3.org/1999/xlink', 'href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#share');
    shareSvg.appendChild(shareUse);
    info.appendChild(shareSvg);

    const textDiv = document.createElement('div');
    textDiv.classList.add('recipe-card__text');
    content.appendChild(textDiv);

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
      'mt-4',
    );
    recipeTitle.textContent = recipeTitleCell?.textContent.trim() || '';
    moveInstrumentation(recipeTitleCell, recipeTitle);
    textDiv.appendChild(recipeTitle);

    const description = document.createElement('p');
    description.classList.add(
      'recipe-card__desc',
      'font-default',
      'font-xl-18',
      'leading-24',
      'fw-medium',
      'text-dark-gray-100',
      'mt-4',
    );
    description.textContent = descriptionCell?.textContent.trim() || '';
    moveInstrumentation(descriptionCell, description);
    textDiv.appendChild(description);

    const wave = document.createElement('div');
    wave.classList.add('recipe-card__wave', 'mt-11', 'mt-xl-7', 'w-100');
    content.appendChild(wave);

    const properties = document.createElement('ul');
    properties.classList.add('recipe-card__properties', 'mt-4', 'd-flex', 'align-items-center');
    content.appendChild(properties);

    const timeProperty = document.createElement('li');
    timeProperty.classList.add(
      'recipe-card__property',
      'recipe-card__property--left',
      'd-flex',
      'align-items-center',
    );
    properties.appendChild(timeProperty);

    const clockSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    clockSvg.classList.add('icon', 'clock', 'text-dark-gray-100');
    const clockUse = document.createElementNS('http://www.w3.org/1999/xlink', 'href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#clock');
    clockSvg.appendChild(clockUse);
    timeProperty.appendChild(clockSvg);

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
    moveInstrumentation(timeCell, timeSpan);
    timeProperty.appendChild(timeSpan);

    const servesProperty = document.createElement('li');
    servesProperty.classList.add(
      'recipe-card__property',
      'recipe-card__property--right',
      'flex-fill',
      'd-flex',
      'align-items-center',
      'justify-content-end',
    );
    properties.appendChild(servesProperty);

    const peopleSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    peopleSvg.classList.add('icon', 'people', 'text-dark-gray-100');
    const peopleUse = document.createElementNS('http://www.w3.org/1999/xlink', 'href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#people');
    peopleSvg.appendChild(peopleUse);
    servesProperty.appendChild(peopleSvg);

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
    moveInstrumentation(servesCell, servesSpan);
    servesProperty.appendChild(servesSpan);

    // Handle hierarchy-tree richtext
    if (hierarchyCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv);

      tempDiv.querySelectorAll('ul').forEach((ul) => {
        ul.classList.add('recipe-card__hierarchy-list'); // Example class, adjust as needed
      });
      tempDiv.querySelectorAll('li').forEach((li) => {
        li.classList.add('recipe-card__hierarchy-item'); // Example class, adjust as needed
      });
      tempDiv.querySelectorAll('a').forEach((a) => {
        a.classList.add('recipe-card__hierarchy-link'); // Example class, adjust as needed
      });

      // Append the processed hierarchy content to the recipeCard or another appropriate element
      // For this block, it's not explicitly rendered in the original HTML, so we'll append it
      // to the content div for now, but in a real scenario, its placement would be defined.
      // If it's not meant to be rendered, this block could be removed.
      // For demonstration, let's append it to the content div.
      const hierarchyWrapper = document.createElement('div');
      hierarchyWrapper.classList.add('recipe-card__hierarchy-wrapper', 'mt-4');
      while (tempDiv.firstChild) {
        hierarchyWrapper.appendChild(tempDiv.firstChild);
      }
      content.appendChild(hierarchyWrapper);
    }
  });

  const popularRecipeShare = document.createElement('div');
  popularRecipeShare.classList.add('popular-recipe__share');
  swiperWrapper.appendChild(popularRecipeShare);

  const socialMediaShare = document.createElement('section');
  socialMediaShare.classList.add(
    'social-media-share',
    'd-none',
    'w-100',
    'justify-content-center',
    'align-items-center',
    'position-fixed',
    'top-0',
    'start-0',
    'end-0',
    'bottom-0',
    'z-2',
  );
  popularRecipeShare.appendChild(socialMediaShare);

  const shareWrapper = document.createElement('div');
  shareWrapper.classList.add(
    'social-media-share__wrapper',
    'bg-cream-100',
    'py-8',
    'px-3',
    'px-md-8',
  );
  socialMediaShare.appendChild(shareWrapper);

  const titleClose = document.createElement('div');
  titleClose.classList.add(
    'social-media-share__wrapper--title-close',
    'pb-8',
    'd-flex',
    'mx-3',
    'mx-md-0',
    'border-bottom',
    'border-dark-gray-100',
    'align-items-center',
    'justify-content-between',
  );
  shareWrapper.appendChild(titleClose);

  const closeButton = document.createElement('div');
  closeButton.classList.add('social-media-share__wrapper--close');
  const crossSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  crossSvg.classList.add('icon', 'cross', 'text-black', 'h-100', 'w-100');
  const crossUse = document.createElementNS('http://www.w3.org/1999/xlink', 'href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#cross');
  crossSvg.appendChild(crossUse);
  closeButton.appendChild(crossSvg);
  titleClose.appendChild(closeButton);

  closeButton.addEventListener('click', () => {
    socialMediaShare.classList.add('d-none');
  });

  const socialIconsWrapper = document.createElement('div');
  socialIconsWrapper.classList.add(
    'social-media-share__wrapper--social-icons',
    'pt-8',
    'd-flex',
    'overflow-hidden',
    'swiper-initialized',
    'swiper-horizontal',
  );
  shareWrapper.appendChild(socialIconsWrapper);

  const socialIconsInner = document.createElement('div');
  socialIconsInner.classList.add('social-media-share__wrapper--social-icons-wrapper', 'swiper-wrapper', 'px-3', 'px-md-0');
  socialIconsInner.setAttribute('data-page-url', '#');
  socialIconsWrapper.appendChild(socialIconsInner);

  socialShareItems.forEach((row) => {
    const [linkCell, labelCell] = [...row.children];

    const iconLabel = document.createElement('div');
    iconLabel.classList.add('social-media-share__wrapper--icon-label', 'swiper-slide', 'd-flex', 'align-items-center');
    socialIconsInner.appendChild(iconLabel);

    const socialLink = document.createElement('a');
    socialLink.classList.add(
      'social-media-share__link',
      'd-flex',
      'align-items-center',
      'text-decoration-none',
      'gap-4',
      'w-fit',
      'flex-md-column',
      'justify-content-center',
    );
    socialLink.href = linkCell?.querySelector('a')?.href || '#';
    socialLink.target = '_blank';
    moveInstrumentation(linkCell, socialLink);
    iconLabel.appendChild(socialLink);

    const iconsDiv = document.createElement('div');
    iconsDiv.classList.add(
      'social-media-share__wrapper--icons',
      'rounded-circle',
      'bg-white',
      'd-flex',
      'justify-content-center',
      'align-items-center',
    );
    socialLink.appendChild(iconsDiv);

    const linkDiv = document.createElement('div');
    linkDiv.classList.add('social-media-share__wrapper--link', 'text-decoration-none');
    iconsDiv.appendChild(linkDiv);

    const labelText = labelCell?.textContent.trim().toLowerCase() || '';
    const socialSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    socialSvg.classList.add('icon', 'text-black', 'social-media-share__wrapper--images');
    let iconName = '';
    if (labelText.includes('facebook')) {
      iconName = 'facebook';
    } else if (labelText.includes('whatsapp')) {
      iconName = 'whatsapp_icon';
    } else if (labelText.includes('x')) {
      iconName = 'twitterX';
    }
    socialSvg.classList.add(iconName);
    const socialUse = document.createElementNS('http://www.w3.org/1999/xlink', 'href', `/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#${iconName}`);
    socialSvg.appendChild(socialUse);
    linkDiv.appendChild(socialSvg);

    const labelDiv = document.createElement('div');
    labelDiv.classList.add(
      'social-media-share__wrapper--label',
      'text-center',
      'font-16',
      'leading-22',
      'text-black',
    );
    labelDiv.setAttribute('data-socialmedia-name', iconName);
    labelDiv.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(labelCell, labelDiv);
    socialLink.appendChild(labelDiv);

    const srOnlySpan = document.createElement('span');
    srOnlySpan.classList.add('cmp-link__screen-reader-only');
    srOnlySpan.textContent = 'opens in a new tab';
    socialLink.appendChild(srOnlySpan);

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.classList.add('social-media-share__wrapper--url');
    hiddenInput.value = iconName;
    iconLabel.appendChild(hiddenInput);
  });

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
    'swiper-button-prev',
  );
  const prevSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  prevSvg.classList.add('icon', 'carousel-right-arrow-v2', 'h-100', 'w-100', 'text-red-100');
  const prevUse = document.createElementNS('http://www.w3.org/1999/xlink', 'href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right_carousel_v2');
  prevSvg.appendChild(prevUse);
  prevButton.appendChild(prevSvg);
  socialIconsWrapper.appendChild(prevButton);

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
    'swiper-button-next',
  );
  const nextSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  nextSvg.classList.add('icon', 'carousel-right-arrow-v2', 'h-100', 'w-100', 'text-red-100');
  const nextUse = document.createElementNS('http://www.w3.org/1999/xlink', 'href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right_carousel_v2');
  nextSvg.appendChild(nextUse);
  nextButton.appendChild(nextSvg);
  socialIconsWrapper.appendChild(nextButton);

  const inputButtonWrapper = document.createElement('div');
  inputButtonWrapper.classList.add(
    'social-media-share__wrapper--input-button',
    'd-flex',
    'align-items-center',
    'mt-8',
    'justify-content-md-center',
    'flex-column',
    'flex-md-row',
  );
  shareWrapper.appendChild(inputButtonWrapper);

  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.classList.add(
    'social-media-share__wrapper--input',
    'bg-white',
    'font-16',
    'leading-22',
    'px-4',
    'py-3',
    'shadow-none',
  );
  inputButtonWrapper.appendChild(inputField);

  const copyButton = document.createElement('button');
  copyButton.classList.add(
    'social-media-share__wrapper--button',
    'font-18',
    'leading-24',
    'py-4',
    'px-8',
    'fw-bold',
    'text-white',
  );
  copyButton.textContent = 'Copy';
  inputButtonWrapper.appendChild(copyButton);

  // Event listener for copy button
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(inputField.value);
      // Optionally, provide user feedback
      console.log('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  });

  const swiperNavPrev = document.createElement('button');
  swiperNavPrev.classList.add(
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
  const swiperNavPrevSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  swiperNavPrevSvg.classList.add('icon', 'w-100', 'h-100');
  const swiperNavPrevUse = document.createElementNS('http://www.w3.org/1999/xlink', 'href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right_carousel');
  swiperNavPrevSvg.appendChild(swiperNavPrevUse);
  swiperNavPrev.appendChild(swiperNavPrevSvg);
  swiperWrapper.appendChild(swiperNavPrev);

  const swiperNavNext = document.createElement('button');
  swiperNavNext.classList.add(
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
  const swiperNavNextSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  swiperNavNextSvg.classList.add('icon', 'w-100', 'h-100');
  const swiperNavNextUse = document.createElementNS('http://www.w3.org/1999/xlink', 'href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right_carousel');
  swiperNavNextSvg.appendChild(swiperNavNextUse);
  swiperNavNext.appendChild(swiperNavNextSvg);
  swiperWrapper.appendChild(swiperNavNext);

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
  swiperContainer.appendChild(pagination);

  const ctaButtonWrapper = document.createElement('div');
  ctaButtonWrapper.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'mt-8');
  section.appendChild(ctaButtonWrapper);

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
  ctaLink.href = ctaLinkRow?.querySelector('a')?.href || '#';
  moveInstrumentation(ctaLinkRow, ctaLink);
  ctaButtonWrapper.appendChild(ctaLink);

  const ctaLabel = document.createElement('span');
  ctaLabel.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
  ctaLabel.textContent = ctaLabelRow?.textContent.trim() || '';
  moveInstrumentation(ctaLabelRow, ctaLabel);
  ctaLink.appendChild(ctaLabel);

  block.replaceWith(section);
}
