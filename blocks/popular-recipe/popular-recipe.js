import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const recipeCards = [];
  const socialMediaShareItems = [];

  [...block.children].forEach((row) => {
    // Determine row type based on number of cells
    // Recipe Card item has 9 cells
    // Social Media Share Item has 2 cells
    if (row.children.length === 9) {
      recipeCards.push(row);
    } else if (row.children.length === 2) {
      socialMediaShareItems.push(row);
    }
  });

  block.innerHTML = ''; // Clear the block content

  // Recipe Cards Section
  if (recipeCards.length > 0) {
    const recipeContainer = document.createElement('div');
    recipeContainer.classList.add('popular-recipe__container', 'overflow-hidden', 'swiper-initialized', 'swiper-horizontal', 'swiper-backface-hidden');
    recipeContainer.setAttribute('data-swiper-init-async', 'true');

    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper', 'popular-recipe__recipe-wrapper');

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
        hierarchyTreeCell,
      ] = [...row.children];

      const swiperSlide = document.createElement('div');
      swiperSlide.classList.add('swiper-slide');
      moveInstrumentation(row, swiperSlide);

      const recipeCard = document.createElement('div');
      recipeCard.classList.add('recipe-card', 'bg-cream-100', 'h-100');

      const recipeLink = document.createElement('a');
      recipeLink.classList.add('recipe-card__link', 'd-block', 'position-relative');
      recipeLink.href = linkCell.querySelector('a')?.href || '#';

      const picture = imageCell.querySelector('picture');
      const img = picture ? picture.querySelector('img') : null;
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, imageAltCell.textContent.trim(), false, [{ width: '750' }]);
        optimizedPic.classList.add('recipe-card__image', 'object-fit-cover', 'w-100');
        recipeLink.append(optimizedPic);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
      }

      const contentDiv = document.createElement('div');
      contentDiv.classList.add('recipe-card__content', 'py-6');

      const infoDiv = document.createElement('div');
      infoDiv.classList.add('recipe-card__info', 'd-flex', 'align-items-center', 'justify-content-between');

      const tagSpan = document.createElement('span');
      tagSpan.classList.add('recipe-card__tag', 'text-uppercase', 'text-red-100', 'font-14', 'font-xl-default', 'leading-24', 'fw-semibold');
      tagSpan.textContent = tagCell.textContent.trim();
      infoDiv.append(tagSpan);

      const shareSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      shareSvg.classList.add('icon', 'share', 'text-dark-gray-100');
      const shareUse = document.createElementNS('http://www.w3.org/1999/xlink', 'xlink:href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#share');
      shareSvg.append(shareUse);
      infoDiv.append(shareSvg);

      contentDiv.append(infoDiv);

      const textDiv = document.createElement('div');
      textDiv.classList.add('recipe-card__text');

      const titleH3 = document.createElement('h3');
      titleH3.classList.add('recipe-card__title', 'font-20', 'font-xl-24', 'leading-24', 'leading-xl-30', 'font-baskerville', 'fw-bold', 'text-dark-gray-100', 'mt-4');
      titleH3.textContent = titleCell.textContent.trim();
      textDiv.append(titleH3);

      const descP = document.createElement('p');
      descP.classList.add('recipe-card__desc', 'font-default', 'font-xl-18', 'leading-24', 'fw-medium', 'text-dark-gray-100', 'mt-4');
      descP.textContent = descriptionCell.textContent.trim();
      textDiv.append(descP);

      contentDiv.append(textDiv);

      const waveDiv = document.createElement('div');
      waveDiv.classList.add('recipe-card__wave', 'mt-11', 'mt-xl-7', 'w-100');
      contentDiv.append(waveDiv);

      const propertiesUl = document.createElement('ul');
      propertiesUl.classList.add('recipe-card__properties', 'mt-4', 'd-flex', 'align-items-center', 'mt-4');

      const timeLi = document.createElement('li');
      timeLi.classList.add('recipe-card__property', 'recipe-card__property--left', 'd-flex', 'align-items-center');
      const clockSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      clockSvg.classList.add('icon', 'clock', 'text-dark-gray-100');
      const clockUse = document.createElementNS('http://www.w3.org/1999/xlink', 'xlink:href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#clock');
      clockSvg.append(clockUse);
      timeLi.append(clockSvg);
      const timeSpan = document.createElement('span');
      timeSpan.classList.add('recipe-card__time', 'text-dark-gray-100', 'font-14', 'font-xl-default', 'leading-20', 'fw-medium', 'ms-2', 'd-inline-block', 'text-nowrap');
      timeSpan.textContent = timeCell.textContent.trim();
      timeLi.append(timeSpan);
      propertiesUl.append(timeLi);

      const servesLi = document.createElement('li');
      servesLi.classList.add('recipe-card__property', 'recipe-card__property--right', 'flex-fill', 'd-flex', 'align-items-center', 'justify-content-end');
      const peopleSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      peopleSvg.classList.add('icon', 'people', 'text-dark-gray-100');
      const peopleUse = document.createElementNS('http://www.w3.org/1999/xlink', 'xlink:href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#people');
      peopleSvg.append(peopleUse);
      servesLi.append(peopleSvg);
      const servesSpan = document.createElement('span');
      servesSpan.classList.add('serve-content', 'recipe-card__serves', 'text-dark-gray-100', 'font-14', 'font-xl-default', 'leading-20', 'fw-medium', 'ms-2', 'd-inline-block');
      servesSpan.textContent = servesCell.textContent.trim();
      servesLi.append(servesSpan);
      propertiesUl.append(servesLi);

      contentDiv.append(propertiesUl);
      recipeLink.append(contentDiv);
      recipeCard.append(recipeLink);
      swiperSlide.append(recipeCard);
      swiperWrapper.append(swiperSlide);

      // Handle 'hierarchy-tree' richtext field
      if (hierarchyTreeCell && hierarchyTreeCell.innerHTML.trim()) {
        const hierarchyTempDiv = document.createElement('div');
        hierarchyTempDiv.innerHTML = hierarchyTreeCell.innerHTML;
        moveInstrumentation(hierarchyTreeCell, hierarchyTempDiv);

        // Apply classes to nested elements as per ORIGINAL HTML or common patterns
        hierarchyTempDiv.querySelectorAll('ul').forEach((ul) => {
          ul.classList.add('nav-menu', 'list-unstyled'); // Example classes, adjust as needed
        });
        hierarchyTempDiv.querySelectorAll('li').forEach((li) => {
          li.classList.add('nav-menu-item', 'list-item'); // Example classes, adjust as needed
        });
        hierarchyTempDiv.querySelectorAll('a').forEach((a) => {
          a.classList.add('nav-menu-link', 'text-decoration-none'); // Example classes, adjust as needed
        });

        // Append the processed hierarchy to the recipeCard (or a specific location within it)
        // For this block, it's not clear where it should go, so appending to recipeCard for now.
        // Adjust this based on design requirements.
        recipeCard.append(hierarchyTempDiv);
      }
    });
    recipeContainer.append(swiperWrapper);
    block.append(recipeContainer);
  }

  // Social Media Share Section
  if (socialMediaShareItems.length > 0) {
    const shareSection = document.createElement('section');
    shareSection.classList.add('social-media-share', 'd-none', 'w-100', 'justify-content-center', 'align-items-center', 'position-fixed', 'top-0', 'start-0', 'end-0', 'bottom-0', 'z-2');

    const shareWrapper = document.createElement('div');
    shareWrapper.classList.add('social-media-share__wrapper', 'bg-cream-100', 'py-8', 'px-3', 'px-md-8');

    const titleCloseDiv = document.createElement('div');
    titleCloseDiv.classList.add('social-media-share__wrapper--title-close', 'pb-8', 'd-flex', 'mx-3', 'mx-md-0', 'border-bottom', 'border-dark-gray-100', 'align-items-center', 'justify-content-between');

    const closeDiv = document.createElement('div');
    closeDiv.classList.add('social-media-share__wrapper--close');
    const crossSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    crossSvg.classList.add('icon', 'cross', 'text-black', 'h-100', 'w-100');
    const crossUse = document.createElementNS('http://www.w3.org/1999/xlink', 'xlink:href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#cross');
    crossSvg.append(crossUse);
    closeDiv.append(crossSvg);
    titleCloseDiv.append(closeDiv);
    shareWrapper.append(titleCloseDiv);

    const socialIconsDiv = document.createElement('div');
    socialIconsDiv.classList.add('social-media-share__wrapper--social-icons', 'pt-8', 'd-flex', 'overflow-hidden', 'swiper-initialized', 'swiper-horizontal');

    const socialIconsWrapper = document.createElement('div');
    socialIconsWrapper.classList.add('social-media-share__wrapper--social-icons-wrapper', 'swiper-wrapper', 'px-3', 'px-md-0');
    socialIconsWrapper.setAttribute('data-page-url', '#');

    socialMediaShareItems.forEach((row) => {
      const [labelCell, linkCell] = [...row.children];

      const iconLabelDiv = document.createElement('div');
      iconLabelDiv.classList.add('social-media-share__wrapper--icon-label', 'swiper-slide', 'd-flex', 'align-items-center');
      moveInstrumentation(row, iconLabelDiv);

      const socialLink = document.createElement('a');
      socialLink.classList.add('social-media-share__link', 'd-flex', 'align-items-center', 'text-decoration-none', 'gap-4', 'w-fit', 'flex-md-column', 'justify-content-center');
      socialLink.target = '_blank';
      socialLink.href = linkCell.querySelector('a')?.href || '#';

      const iconsDiv = document.createElement('div');
      iconsDiv.classList.add('social-media-share__wrapper--icons', 'rounded-circle', 'bg-white', 'd-flex', 'justify-content-center', 'align-items-center');

      const innerLinkDiv = document.createElement('div');
      innerLinkDiv.classList.add('social-media-share__wrapper--link', 'text-decoration-none');
      // innerLinkDiv.target = '_blank'; // target attribute is not valid on a div

      const socialSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      socialSvg.classList.add('icon', 'text-black', 'social-media-share__wrapper--images');
      const socialUse = document.createElementNS('http://www.w3.org/1999/xlink', 'xlink:href', `/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#${labelCell.textContent.trim().toLowerCase().replace(/\s/g, '_')}`);
      socialSvg.append(socialUse);
      innerLinkDiv.append(socialSvg);
      iconsDiv.append(innerLinkDiv);
      socialLink.append(iconsDiv);

      const labelDiv = document.createElement('div');
      labelDiv.classList.add('social-media-share__wrapper--label', 'text-center', 'font-16', 'leading-22', 'text-black');
      labelDiv.setAttribute('data-socialmedia-name', labelCell.textContent.trim().toLowerCase().replace(/\s/g, '_'));
      labelDiv.textContent = labelCell.textContent.trim();
      socialLink.append(labelDiv);

      const screenReaderOnlySpan = document.createElement('span');
      screenReaderOnlySpan.classList.add('cmp-link__screen-reader-only');
      screenReaderOnlySpan.textContent = 'opens in a new tab';
      socialLink.append(screenReaderOnlySpan);

      iconLabelDiv.append(socialLink);

      const hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.classList.add('social-media-share__wrapper--url');
      hiddenInput.value = labelCell.textContent.trim().toLowerCase().replace(/\s/g, '_');
      iconLabelDiv.append(hiddenInput);

      socialIconsWrapper.append(iconLabelDiv);
    });

    socialIconsDiv.append(socialIconsWrapper);

    const prevButton = document.createElement('button');
    prevButton.classList.add('social-media-share__button', 'bg-transparent', 'border-0', 'social-media-share__prev', 'd-none', 'z-2', 'd-md-block', 'position-absolute', 'swiper-button-prev');
    const prevSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    prevSvg.classList.add('icon', 'carousel-right-arrow-v2', 'h-100', 'w-100', 'text-red-100');
    const prevUse = document.createElementNS('http://www.w3.org/1999/xlink', 'xlink:href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right_carousel_v2');
    prevSvg.append(prevUse);
    prevButton.append(prevSvg);
    socialIconsDiv.append(prevButton);

    const nextButton = document.createElement('button');
    nextButton.classList.add('social-media-share__button', 'bg-transparent', 'border-0', 'social-media-share__next', 'd-none', 'z-2', 'd-md-block', 'position-absolute', 'swiper-button-next');
    const nextSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    nextSvg.classList.add('icon', 'carousel-right-arrow-v2', 'h-100', 'w-100', 'text-red-100');
    const nextUse = document.createElementNS('http://www.w3.org/1999/xlink', 'xlink:href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right_carousel_v2');
    nextSvg.append(nextUse);
    nextButton.append(nextSvg);
    socialIconsDiv.append(nextButton);

    shareWrapper.append(socialIconsDiv);

    const inputButtonDiv = document.createElement('div');
    inputButtonDiv.classList.add('social-media-share__wrapper--input-button', 'd-flex', 'align-items-center', 'mt-8', 'justify-content-md-center', 'flex-column', 'flex-md-row');

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.classList.add('social-media-share__wrapper--input', 'bg-white', 'font-16', 'leading-22', 'px-4', 'py-3', 'shadow-none');
    inputButtonDiv.append(inputField);

    const copyButton = document.createElement('button');
    copyButton.classList.add('social-media-share__wrapper--button', 'font-18', 'leading-24', 'py-4', 'px-8', 'fw-bold', 'text-white');
    copyButton.textContent = 'Copy';
    inputButtonDiv.append(copyButton);

    shareWrapper.append(inputButtonDiv);
    shareSection.append(shareWrapper);
    block.append(shareSection);

    // Event listeners for social share modal
    const shareTriggers = block.querySelectorAll('.recipe-card__info .share');
    shareTriggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        shareSection.classList.remove('d-none');
      });
    });

    closeDiv.addEventListener('click', () => {
      shareSection.classList.add('d-none');
    });

    shareSection.addEventListener('click', (e) => {
      if (e.target === shareSection) {
        shareSection.classList.add('d-none');
      }
    });

    copyButton.addEventListener('click', () => {
      inputField.select();
      document.execCommand('copy');
    });
  }

  // Optimize images in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
