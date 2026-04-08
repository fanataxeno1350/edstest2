import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add('grid-container', 'overflow-x-hidden', 'recipe-home--has-icon', 'bg--paper-white', 'animate-enter', 'in-view');

  const [iconRow, titleRow, descriptionRow, ctaLinkRow, ...recipeCardRows] = [...block.children];

  // Header Section
  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('grid-x');

  const imageTextWrapper = document.createElement('div');
  imageTextWrapper.classList.add('grid-x', 'recipe-home--image-text');
  headerWrapper.append(imageTextWrapper);

  const headerContentCell = document.createElement('div');
  headerContentCell.classList.add('cell', 'small-12', 'large-10', 'large-offset-1');
  imageTextWrapper.append(headerContentCell);

  // Icon Section
  const iconSection = document.createElement('div');
  iconSection.classList.add('recipe-home--icon-section', 'animate-enter-fade-left-long', 'animate-delay-3', 'text-center');
  const iconPicture = iconRow.querySelector('picture');
  if (iconPicture) {
    const iconImg = iconPicture.querySelector('img');
    const optimizedIconPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(iconImg, optimizedIconPic.querySelector('img'));
    optimizedIconPic.querySelector('img').classList.add('recipe-home--icon-section-img');
    iconSection.append(optimizedIconPic);
  }
  headerContentCell.append(iconSection);
  moveInstrumentation(iconRow, iconSection);

  // Text Section (Title & Description)
  const textSection = document.createElement('div');
  textSection.classList.add('recipe-home--text-section', 'animate-enter-fade-up-short', 'animate-delay-3');

  const titleEl = document.createElement('h2');
  titleEl.classList.add('recipe-home--title');
  moveInstrumentation(titleRow, titleEl);
  while (titleRow.firstChild) titleEl.append(titleRow.firstChild);
  textSection.append(titleEl);

  const descriptionEl = document.createElement('div');
  descriptionEl.classList.add('recipe-home--desc', 'bodyMediumRegular');
  moveInstrumentation(descriptionRow, descriptionEl);
  while (descriptionRow.firstChild) descriptionEl.append(descriptionRow.firstChild);
  textSection.append(descriptionEl);

  headerContentCell.append(textSection);

  // Recipe Cards Wrapper (Swiper structure)
  const recipeWrapper = document.createElement('div');
  recipeWrapper.classList.add('cell', 'small-12', 'recipe-home--wrapper');

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper', 'swipper--full-view-padding', 'recipe-home--wrapper--in', 'swiper-initialized', 'swiper-horizontal', 'swiper-backface-hidden');

  // Swiper controls (prev/next buttons)
  const prevButtonDiv = document.createElement('div');
  prevButtonDiv.classList.add('recipe-home--btn-control', 'recipe-home--prev', 'show-for-large');
  const prevButton = document.createElement('button');
  prevButton.classList.add('swiper-control', 'swiper--prev', 'elevation-1', 'animate-enter-fade-right-short', 'animate-delay-9', 'swiper-button-disabled');
  prevButton.setAttribute('disabled', '');
  prevButton.setAttribute('tabindex', '-1');
  prevButton.setAttribute('aria-label', 'Previous slide');
  prevButton.setAttribute('aria-disabled', 'true');
  const prevButtonImg = document.createElement('img');
  prevButtonImg.setAttribute('alt', 'svg file');
  prevButtonImg.setAttribute('src', '/content/dam/aemigrate/uploaded-folder/image/1775635711748.svg+xml');
  prevButton.append(prevButtonImg);
  prevButtonDiv.append(prevButton);
  swiperContainer.append(prevButtonDiv);

  const nextButtonDiv = document.createElement('div');
  nextButtonDiv.classList.add('recipe-home--btn-control', 'recipe-home--next', 'show-for-large');
  const nextButton = document.createElement('button');
  nextButton.classList.add('swiper-control', 'swiper--next', 'elevation-1', 'animate-enter-fade-left-short', 'animate-delay-9');
  nextButton.setAttribute('tabindex', '0');
  nextButton.setAttribute('aria-label', 'Next slide');
  nextButton.setAttribute('aria-disabled', 'false');
  const nextButtonImg = document.createElement('img');
  nextButtonImg.setAttribute('alt', 'svg file');
  nextButtonImg.setAttribute('src', '/content/dam/aemigrate/uploaded-folder/image/1775635712244.svg+xml');
  nextButton.append(nextButtonImg);
  nextButtonDiv.append(nextButton);
  swiperContainer.append(nextButtonDiv);

  // Swiper List
  const ul = document.createElement('ul');
  ul.classList.add('swiper-wrapper', 'recipe-home--list');
  ul.setAttribute('aria-live', 'polite');

  recipeCardRows.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add('swiper-slide', 'recipe-home--list-item');

    const linkEl = row.querySelector('a');
    const recipeCardLink = document.createElement('a');
    recipeCardLink.classList.add('recipe-card-grid-view--link');
    if (linkEl) {
      recipeCardLink.href = linkEl.href;
      recipeCardLink.title = linkEl.textContent;
      recipeCardLink.setAttribute('aria-label', linkEl.textContent);
    }

    const recipeCardGrid = document.createElement('div');
    recipeCardGrid.classList.add('grid-x', 'recipe-card', 'recipe-card--grid-view-card', 'elevation-2', 'has-hover', 'recipe-card-grid-view');

    const cells = [...row.children];
    let recipeLinkCell, recipeImageCell, recipeTagCell, recipeNameCell, recipeDescriptionCell, recipeStepsCountCell, recipeIngredientsCountCell;

    // Content detection for cells based on BlockJson and typical content patterns
    recipeLinkCell = cells.find(cell => cell.querySelector('a'));
    recipeImageCell = cells.find(cell => cell.querySelector('picture'));
    // Find Tag: text content that is not a link, picture, or number
    recipeTagCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture') && !/\d+/.test(cell.textContent.trim()) && cell.textContent.trim().length > 0);
    // Find Name: often the first non-tag text after image/link
    recipeNameCell = cells.find(cell => cell !== recipeLinkCell && cell !== recipeImageCell && cell !== recipeTagCell && !/\d+/.test(cell.textContent.trim()) && cell.textContent.trim().length > 0);
    // Find Description: often the second non-tag text
    recipeDescriptionCell = cells.find(cell => cell !== recipeLinkCell && cell !== recipeImageCell && cell !== recipeTagCell && cell !== recipeNameCell && !/\d+/.test(cell.textContent.trim()) && cell.textContent.trim().length > 0);
    // Find Steps Count: first number
    recipeStepsCountCell = cells.find(cell => cell !== recipeLinkCell && cell !== recipeImageCell && cell !== recipeTagCell && cell !== recipeNameCell && cell !== recipeDescriptionCell && /^\d+$/.test(cell.textContent.trim()));
    // Find Ingredients Count: second number
    recipeIngredientsCountCell = cells.find(cell => cell !== recipeLinkCell && cell !== recipeImageCell && cell !== recipeTagCell && cell !== recipeNameCell && cell !== recipeDescriptionCell && cell !== recipeStepsCountCell && /^\d+$/.test(cell.textContent.trim()));


    // Image Container
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('cell', 'small-12', 'medium-12', 'large-6', 'recipe-img-container', 'animate-enter-fade', 'animate-delay-5');

    // Mobile Tag
    if (recipeTagCell) {
      const recipeTagMobile = document.createElement('div');
      recipeTagMobile.classList.add('recipe-tag-mobile', 'animate-enter-fade-up-short', 'animate-delay-9');
      const tagDiv = document.createElement('div');
      tagDiv.classList.add('tag', 'bg--brand-green');
      const tagLabel = document.createElement('span');
      tagLabel.classList.add('tag__label');
      moveInstrumentation(recipeTagCell, tagLabel);
      while (recipeTagCell.firstChild) tagLabel.append(recipeTagCell.firstChild);
      tagDiv.append(tagLabel);
      recipeTagMobile.append(tagDiv);
      imgContainer.append(recipeTagMobile);
    }

    if (recipeImageCell) {
      const img = recipeImageCell.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 768px)', width: '1066' }, { width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imgContainer.append(optimizedPic);
    }
    recipeCardGrid.append(imgContainer);

    // Recipe Details
    const recipeDetails = document.createElement('div');
    recipeDetails.classList.add('cell', 'small-12', 'medium-12', 'large-6', 'recipe-details');

    const recipeInfo = document.createElement('div');
    recipeInfo.classList.add('recipe-info');

    // Recipe Name
    if (recipeNameCell) {
      const nameDiv = document.createElement('div');
      nameDiv.classList.add('recipe-name', 'labelLargeBold', 'animate-enter-fade-up-short', 'animate-delay-9');
      moveInstrumentation(recipeNameCell, nameDiv);
      while (recipeNameCell.firstChild) nameDiv.append(recipeNameCell.firstChild);
      recipeInfo.append(nameDiv);
    }

    // Recipe Description
    if (recipeDescriptionCell) {
      const descGrid = document.createElement('div');
      descGrid.classList.add('grid-x');
      const descCell = document.createElement('div');
      descCell.classList.add('cell', 'recipe-description', 'bodySmallRegular', 'animate-enter-fade-up-short', 'animate-delay-11');
      moveInstrumentation(recipeDescriptionCell, descCell);
      while (recipeDescriptionCell.firstChild) descCell.append(recipeDescriptionCell.firstChild);
      descGrid.append(descCell);
      recipeInfo.append(descGrid);
    }

    // Steps and Ingredients
    if (recipeStepsCountCell || recipeIngredientsCountCell) {
      const stepsIngredientsGrid = document.createElement('div');
      stepsIngredientsGrid.classList.add('grid-x');
      const stepsIngredientsCell = document.createElement('div');
      stepsIngredientsCell.classList.add('cell', 'recipe-steps-and-ingredients', 'animate-enter-fade-up-short', 'animate-delay-11');

      if (recipeStepsCountCell) {
        const stepsContainer = document.createElement('div');
        stepsContainer.classList.add('recipe-steps-container');
        const stepsCountSpan = document.createElement('span');
        stepsCountSpan.classList.add('recipe-steps-count', 'labelSmallBold');
        moveInstrumentation(recipeStepsCountCell, stepsCountSpan);
        while (recipeStepsCountCell.firstChild) stepsCountSpan.append(recipeStepsCountCell.firstChild);
        const stepsLabelSpan = document.createElement('span');
        stepsLabelSpan.classList.add('recipe-steps-label', 'utilityTagHighCaps');
        stepsLabelSpan.textContent = 'Steps';
        stepsContainer.append(stepsCountSpan, stepsLabelSpan);
        stepsIngredientsCell.append(stepsContainer);
      }

      if (recipeStepsCountCell && recipeIngredientsCountCell) {
        const separator = document.createElement('div');
        separator.classList.add('recipe-steps-separator');
        stepsIngredientsCell.append(separator);
      }

      if (recipeIngredientsCountCell) {
        const ingredientsContainer = document.createElement('div');
        ingredientsContainer.classList.add('recipe-ingredients-container');
        const ingredientsCountSpan = document.createElement('span');
        ingredientsCountSpan.classList.add('recipe-ingredients-count', 'labelSmallBold');
        moveInstrumentation(recipeIngredientsCountCell, ingredientsCountSpan);
        while (recipeIngredientsCountCell.firstChild) ingredientsCountSpan.append(ingredientsCountSpan.firstChild);
        const ingredientsLabelSpan = document.createElement('span');
        ingredientsLabelSpan.classList.add('recipe-ingredients-label', 'utilityTagHighCaps');
        ingredientsLabelSpan.textContent = 'Ingredients';
        ingredientsContainer.append(ingredientsCountSpan, ingredientsLabelSpan);
        stepsIngredientsCell.append(ingredientsContainer);
      }
      stepsIngredientsGrid.append(stepsIngredientsCell);
      recipeInfo.append(stepsIngredientsGrid);
    }

    // Desktop Tag
    if (recipeTagCell) {
      const recipeTagDesktop = document.createElement('div');
      recipeTagDesktop.classList.add('recipe-tag-desktop', 'animate-enter-fade-up-short', 'animate-delay-9');
      const tagDiv = document.createElement('div');
      tagDiv.classList.add('tag', 'bg--brand-green');
      const tagLabel = document.createElement('span');
      tagLabel.classList.add('tag__label');
      // Re-add tag content if it was moved to mobile tag, otherwise move it here
      if (!recipeTagCell.firstChild) {
        tagLabel.textContent = recipeTagCell.textContent;
      } else {
        moveInstrumentation(recipeTagCell, tagLabel);
        while (recipeTagCell.firstChild) tagLabel.append(recipeTagCell.firstChild);
      }
      tagDiv.append(tagLabel);
      recipeTagDesktop.append(tagDiv);
      recipeInfo.append(recipeTagDesktop);
    }

    recipeDetails.append(recipeInfo);
    recipeCardGrid.append(recipeDetails);
    recipeCardLink.append(recipeCardGrid);
    li.append(recipeCardLink);
    ul.append(li);
  });

  swiperContainer.append(ul);

  // Swiper Pagination
  const paginationDiv = document.createElement('div');
  paginationDiv.classList.add('recipe-home--pagination', 'animate-enter-fade-left-long', 'animate-delay-8');
  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'swiper-pagination-clickable', 'swiper-pagination-bullets', 'swiper-pagination-horizontal');
  paginationDiv.append(swiperPagination);
  swiperContainer.append(paginationDiv);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  swiperContainer.append(swiperNotification);

  recipeWrapper.append(swiperContainer);

  // CTA Link
  const ctaContainer = document.createElement('div');
  ctaContainer.classList.add('grid-x', 'recipe-home--cta-container', 'text-center', 'animate-enter-fade-up-short', 'animate-delay-10');
  const ctaCell = document.createElement('div');
  ctaCell.classList.add('cell', 'large-10', 'large-offset-1', 'see-all-recipies-cta');

  const ctaLink = ctaLinkRow.querySelector('a');
  if (ctaLink) {
    const ctaButton = document.createElement('a');
    ctaButton.classList.add('button', 'transparent-auto');
    ctaButton.href = ctaLink.href;
    ctaButton.title = ctaLink.textContent;
    ctaButton.setAttribute('aria-label', '');
    ctaButton.setAttribute('rel', 'follow');
    const ctaButtonText = document.createElement('span');
    ctaButtonText.classList.add('button-text');
    moveInstrumentation(ctaLink, ctaButtonText);
    while (ctaLink.firstChild) ctaButtonText.append(ctaLink.firstChild);
    ctaButton.append(ctaButtonText);
    ctaCell.append(ctaButton);
  }
  ctaContainer.append(ctaCell);
  moveInstrumentation(ctaLinkRow, ctaContainer);

  block.textContent = '';
  block.append(headerWrapper, recipeWrapper, ctaContainer);

  // Swiper functionality (basic implementation for demonstration)
  let currentSlide = 0;
  const slides = ul.children;
  const totalSlides = slides.length;

  const updateSwiper = () => {
    [...slides].forEach((slide, index) => {
      slide.style.transform = `translateX(-${currentSlide * (slide.offsetWidth + 32)}px)`; // 32px is margin-right
      slide.classList.remove('swiper-slide-active', 'swiper-slide-next');
      if (index === currentSlide) {
        slide.classList.add('swiper-slide-active');
      } else if (index === currentSlide + 1) {
        slide.classList.add('swiper-slide-next');
      }
    });

    if (currentSlide === 0) {
      prevButton.setAttribute('disabled', '');
      prevButton.classList.add('swiper-button-disabled');
      prevButton.setAttribute('aria-disabled', 'true');
    } else {
      prevButton.removeAttribute('disabled');
      prevButton.classList.remove('swiper-button-disabled');
      prevButton.setAttribute('aria-disabled', 'false');
    }

    if (currentSlide >= totalSlides - 1) { // Assuming 1 visible slide for simplicity, adjust for multiple
      nextButton.setAttribute('disabled', '');
      nextButton.classList.add('swiper-button-disabled');
      nextButton.setAttribute('aria-disabled', 'true');
    } else {
      nextButton.removeAttribute('disabled');
      nextButton.classList.remove('swiper-button-disabled');
      nextButton.setAttribute('aria-disabled', 'false');
    }

    // Update pagination bullets
    swiperPagination.innerHTML = '';
    for (let i = 0; i < totalSlides; i += 1) { // Assuming 1 bullet per item
      const bullet = document.createElement('span');
      bullet.classList.add('swiper-pagination-bullet');
      bullet.setAttribute('tabindex', '0');
      bullet.setAttribute('role', 'button');
      bullet.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === currentSlide) {
        bullet.classList.add('swiper-pagination-bullet-active');
        bullet.setAttribute('aria-current', 'true');
      }
      bullet.addEventListener('click', () => {
        currentSlide = i;
        updateSwiper();
      });
      swiperPagination.append(bullet);
    }
  };

  prevButton.addEventListener('click', () => {
    if (currentSlide > 0) {
      currentSlide -= 1;
      updateSwiper();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentSlide < totalSlides - 1) { // Assuming 1 visible slide for simplicity
      currentSlide += 1;
      updateSwiper();
    }
  });

  // Initial update and add resize listener for responsive swiper behavior
  updateSwiper();
  window.addEventListener('resize', updateSwiper);
}
