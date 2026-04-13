import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    titleRow,
    subtitleRow,
    tabsRow,
    // recipeCardsRow is not a distinct root row, it's a container for itemRows.
    // The BlockJson defines 5 root fields, and itemRows are the remaining children.
    buttonLabelRow,
    ...itemRows
  ] = [...block.children];

  block.innerHTML = '';
  block.classList.add('cmp-recipe-group');

  // Header Section
  const headerSection = document.createElement('div');
  headerSection.classList.add('cmp-recipe-group__header-section');
  block.append(headerSection);

  const title = document.createElement('h2');
  title.classList.add('cmp-recipe-group__title');
  moveInstrumentation(titleRow.firstElementChild, title);
  title.append(titleRow.firstElementChild.textContent);
  headerSection.append(title);

  const subtitle = document.createElement('div');
  subtitle.classList.add('cmp-recipe-group__subtitle');
  moveInstrumentation(subtitleRow.firstElementChild, subtitle);
  subtitle.append(subtitleRow.firstElementChild.textContent);
  headerSection.append(subtitle);

  // Tabs Section
  const tabsSection = document.createElement('div');
  tabsSection.classList.add('cmp-recipe-group__tabs');
  block.append(tabsSection);

  const tabGroup = document.createElement('div');
  tabGroup.classList.add('tab-group', 'cmp-tab-group');
  tabsSection.append(tabGroup);

  const tabCarouselItem = document.createElement('div');
  tabCarouselItem.classList.add(
    'cmp-tab-group__carousel-item',
    'cmp-carousel__item',
    'scrollbar-style-h',
    'scrollbar-style-w',
  );
  tabGroup.append(tabCarouselItem);

  // The tabsRow contains a single div with comma-separated tab labels.
  // The BlockJson for 'tab' item has a single 'label' field.
  const tabLabels = tabsRow.firstElementChild.textContent
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  tabLabels.forEach((label, index) => {
    const tabItem = document.createElement('div');
    tabItem.classList.add('cmp-tab-group__tab-item');
    const tabDiv = document.createElement('div');
    tabDiv.classList.add('tab', 'cmp-tab--primary');
    const tabButton = document.createElement('button');
    tabButton.setAttribute('type', 'button');
    tabButton.classList.add('cmp-tab');
    if (index === 0) {
      tabButton.classList.add('selected');
    }
    const tabText = document.createElement('span');
    tabText.classList.add('cmp-tab__text');
    tabText.textContent = label;

    tabButton.append(tabText);
    tabDiv.append(tabButton);
    tabItem.append(tabDiv);
    tabCarouselItem.append(tabItem);

    tabButton.addEventListener('click', () => {
      tabCarouselItem
        .querySelectorAll('.cmp-tab')
        .forEach((btn) => btn.classList.remove('selected'));
      tabButton.classList.add('selected');
      // TODO: Implement actual filtering logic for recipe cards based on tab selection
    });
  });

  // Content Section (Recipe Cards)
  const contentSection = document.createElement('div');
  contentSection.classList.add('cmp-recipe-group__content');
  block.append(contentSection);

  const recipeCarousel = document.createElement('div');
  recipeCarousel.classList.add(
    'cmp-recipe-group__carousel',
    'slickcarousel',
    'carousel',
    'panelcontainer',
    'cmp-carousel', // Corrected from 'undefined' in original HTML
  );
  contentSection.append(recipeCarousel);

  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container', 'slick-initialized', 'slick-slider');
  recipeCarousel.append(carouselContainer);

  const prevButton = document.createElement('button');
  prevButton.classList.add('slick-prev', 'slick-arrow', 'slick-disabled');
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('aria-disabled', 'true');
  prevButton.textContent = 'Previous';
  carouselContainer.append(prevButton);

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');
  carouselContainer.append(slickList);

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');
  slickTrack.style.opacity = '1';
  slickList.append(slickTrack);

  itemRows.forEach((row, index) => {
    // BlockJson for 'recipe-card' defines 6 fields: link, image, tag, title, time, difficulty
    const [linkCell, imageCell, tagCell, cardTitleCell, timeCell, difficultyCell] = [
      ...row.children,
    ];

    const carouselItem = document.createElement('div');
    carouselItem.classList.add(
      'cmp-recipe-group__carousel-item',
      'cmp-carousel__item',
      'slick-slide',
    );
    if (index < 3) {
      carouselItem.classList.add('slick-current', 'slick-active');
    }
    carouselItem.setAttribute('data-slick-index', index);
    carouselItem.setAttribute('aria-hidden', index >= 3);
    carouselItem.style.width = '316px'; // Hardcoded from original HTML

    const cardLink = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      moveInstrumentation(linkCell, cardLink);
    }
    cardLink.classList.add(
      'card',
      'cmp-card--recipe',
      'cmp-card--aashirvaad-recipe',
      'color-background-background-2',
    );
    cardLink.setAttribute('tabindex', index < 3 ? '0' : '-1');
    carouselItem.append(cardLink);

    const card = document.createElement('div');
    card.classList.add('cmp-card');
    cardLink.append(card);

    const cardContent = document.createElement('div');
    cardContent.classList.add('cmp-card__content');
    card.append(cardContent);

    const cardMedia = document.createElement('div');
    cardMedia.classList.add('cmp-card__media');
    cardContent.append(cardMedia);

    const cardOptions = document.createElement('div');
    cardOptions.classList.add('cmp-card__options');
    const threeDots = document.createElement('div');
    threeDots.classList.add('cmp-card__three-dots', 'icon-open-card-popup');
    cardOptions.append(threeDots);
    cardMedia.append(cardOptions);

    const cardImage = document.createElement('div');
    cardImage.classList.add('cmp-card__image');
    const lazyImageContainer = document.createElement('div');
    lazyImageContainer.classList.add('lazy-image-container');
    cardImage.append(lazyImageContainer);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        lazyImageContainer.append(optimizedPic);
        optimizedPic.querySelector('img').classList.add('lazy-image', 'loaded');
        optimizedPic.querySelector('img').style.opacity = '1';
        optimizedPic.querySelector('img').style.transition = 'opacity 0.3s ease-in-out';
      }
    }
    cardMedia.append(cardImage);

    const cardInfo = document.createElement('div');
    cardInfo.classList.add('cmp-card__info');
    cardContent.append(cardInfo);

    const cardTag = document.createElement('div');
    cardTag.classList.add('cmp-card__tag', 'cmp-card__tag--with-heart');
    const tagWrapper = document.createElement('div');
    tagWrapper.classList.add('cmp-card__tag-wrapper');
    const tagP = document.createElement('p');
    moveInstrumentation(tagCell.firstElementChild, tagP);
    tagP.textContent = tagCell.firstElementChild.textContent;
    tagWrapper.append(tagP);
    cardTag.append(tagWrapper);
    const heartsWrapper = document.createElement('div');
    heartsWrapper.classList.add('cmp-card__hearts-wrapper', 'hidden');
    const heartIcon = document.createElement('div');
    heartIcon.classList.add('cmp-card__icon', 'icon-favorite_FILL1_wght400_GRAD0_opsz20');
    heartsWrapper.append(heartIcon);
    heartsWrapper.append(document.createElement('p')); // Empty p tag from original HTML
    cardTag.append(heartsWrapper);
    cardInfo.append(cardTag);

    const cardTitle = document.createElement('div');
    cardTitle.classList.add('cmp-card__title');
    const cardTitleH4 = document.createElement('h4');
    moveInstrumentation(cardTitleCell.firstElementChild, cardTitleH4);
    cardTitleH4.textContent = cardTitleCell.firstElementChild.textContent;
    cardTitle.append(cardTitleH4);
    cardInfo.append(cardTitle);

    const recipeFooter = document.createElement('div');
    recipeFooter.classList.add('cmp-card__recipe_footer');
    cardInfo.append(recipeFooter);

    const timeInMinutes = document.createElement('div');
    timeInMinutes.classList.add('cmp-card__time-in-minutes');
    const timeIcon = document.createElement('div');
    timeIcon.classList.add('cmp-card__icon', 'icon-Group-21690');
    timeInMinutes.append(timeIcon);
    const timeP = document.createElement('p');
    moveInstrumentation(timeCell.firstElementChild, timeP);
    timeP.textContent = timeCell.firstElementChild.textContent;
    timeInMinutes.append(timeP);
    recipeFooter.append(timeInMinutes);

    const difficultyLevel = document.createElement('div');
    difficultyLevel.classList.add('cmp-card__difficulty-level', 'icon-chef-cap');
    const difficultyIcon = document.createElement('div');
    difficultyIcon.classList.add('cmp-card__icon', 'path1');
    difficultyLevel.append(difficultyIcon);
    const difficultyP = document.createElement('p');
    moveInstrumentation(difficultyCell.firstElementChild, difficultyP);
    difficultyP.textContent = difficultyCell.firstElementChild.textContent;
    difficultyLevel.append(difficultyP);
    recipeFooter.append(difficultyLevel);

    slickTrack.append(carouselItem);
  });

  const nextButton = document.createElement('button');
  nextButton.classList.add('slick-next', 'slick-arrow');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('aria-disabled', 'false');
  nextButton.textContent = 'Next';
  carouselContainer.append(nextButton);

  // Action Button
  const actionSection = document.createElement('div');
  actionSection.classList.add('cmp-recipe-group__action');
  block.append(actionSection);

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'cmp-button--primary', 'cmp-button--primary-light');
  actionSection.append(buttonDiv);

  const actionButton = document.createElement('button');
  actionButton.setAttribute('type', 'button');
  actionButton.classList.add('cmp-button');
  const buttonText = document.createElement('span');
  buttonText.classList.add('cmp-button__text');
  moveInstrumentation(buttonLabelRow.firstElementChild, buttonText);
  buttonText.textContent = buttonLabelRow.firstElementChild.textContent;
  actionButton.append(buttonText);
  buttonDiv.append(actionButton);

  // Share Div (empty from original HTML)
  const shareDiv = document.createElement('div');
  shareDiv.classList.add('share');
  block.append(shareDiv);

  // Add basic carousel functionality (simplified)
  let currentIndex = 0;
  const itemsPerSlide = 3;
  const totalItems = itemRows.length;

  const updateCarousel = () => {
    slickTrack.style.transform = `translate3d(-${
      currentIndex * (316 * itemsPerSlide)
    }px, 0px, 0px)`; // Assuming 316px width per item
    slickTrack.querySelectorAll('.slick-slide').forEach((slide, i) => {
      if (i >= currentIndex && i < currentIndex + itemsPerSlide) {
        slide.classList.add('slick-current', 'slick-active');
        slide.setAttribute('aria-hidden', 'false');
        slide.setAttribute('tabindex', '0');
      } else {
        slide.classList.remove('slick-current', 'slick-active');
        slide.setAttribute('aria-hidden', 'true');
        slide.setAttribute('tabindex', '-1');
      }
    });

    if (currentIndex === 0) {
      prevButton.classList.add('slick-disabled');
      prevButton.setAttribute('aria-disabled', 'true');
    } else {
      prevButton.classList.remove('slick-disabled');
      prevButton.setAttribute('aria-disabled', 'false');
    }

    if (currentIndex >= totalItems - itemsPerSlide) {
      nextButton.classList.add('slick-disabled');
      nextButton.setAttribute('aria-disabled', 'true');
    } else {
      nextButton.classList.remove('slick-disabled');
      nextButton.setAttribute('aria-disabled', 'false');
    }
  };

  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      updateCarousel();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentIndex < totalItems - itemsPerSlide) {
      currentIndex += 1;
      updateCarousel();
    }
  });

  updateCarousel(); // Initial state
}
