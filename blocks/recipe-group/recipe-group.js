import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  const headerSection = document.createElement('div');
  headerSection.classList.add('cmp-recipe-group__header-section');

  const titleRow = rows[0];
  const title = titleRow.querySelector('div');
  if (title) {
    const h2 = document.createElement('h2');
    moveInstrumentation(title, h2);
    h2.classList.add('cmp-recipe-group__title');
    h2.append(...title.childNodes);
    headerSection.append(h2);
  }

  const subtitleRow = rows[1];
  const subtitle = subtitleRow.querySelector('div');
  if (subtitle) {
    const divSubtitle = document.createElement('div');
    moveInstrumentation(subtitle, divSubtitle);
    divSubtitle.classList.add('cmp-recipe-group__subtitle');
    divSubtitle.append(...subtitle.childNodes);
    headerSection.append(divSubtitle);
  }
  // block.append(headerSection); // Appended at the end

  const tabsContainer = document.createElement('div');
  tabsContainer.classList.add('cmp-recipe-group__tabs');

  const tabGroup = document.createElement('div');
  tabGroup.classList.add('tab-group', 'cmp-tab-group');

  const carouselItem = document.createElement('div');
  carouselItem.classList.add('cmp-tab-group__carousel-item', 'cmp-carousel__item', 'scrollbar-style-h', 'scrollbar-style-w');

  const recipeCards = [];
  const recipeTabs = [];

  // Separate item rows into cards and tabs based on cell count
  // The first 3 rows are title, subtitle, and CTA. The remaining rows are item rows.
  // The CTA is the last field in the model, but it's row[2] in the block structure.
  // So, item rows start from index 3.
  rows.slice(3).forEach((row) => {
    if (row.children.length === 6) { // Recipe Card has 6 cells
      recipeCards.push(row);
    } else if (row.children.length === 1) { // Recipe Category Tab has 1 cell
      recipeTabs.push(row);
    }
  });

  const tabButtons = []; // Store tab buttons for event listeners

  recipeTabs.forEach((tabRow, index) => {
    const tabItem = document.createElement('div');
    tabItem.classList.add('cmp-tab-group__tab-item');

    const tabDiv = document.createElement('div');
    tabDiv.classList.add('tab', 'cmp-tab--primary');

    const button = document.createElement('button');
    button.classList.add('cmp-tab');
    button.setAttribute('type', 'button');
    if (index === 0) {
      button.classList.add('selected');
    }
    button.dataset.tabIndex = index; // Add data attribute to identify tab

    const span = document.createElement('span');
    span.classList.add('cmp-tab__text');
    const tabTitleCell = tabRow.querySelector('div');
    if (tabTitleCell) {
      moveInstrumentation(tabTitleCell, span);
      span.append(...tabTitleCell.childNodes);
    }

    button.append(span);
    tabDiv.append(button);
    tabItem.append(tabDiv);
    carouselItem.append(tabItem);
    tabButtons.push(button);
  });

  tabGroup.append(carouselItem);
  tabsContainer.append(tabGroup);
  // block.append(tabsContainer); // Appended at the end

  const contentSection = document.createElement('div');
  contentSection.classList.add('cmp-recipe-group__content');

  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('cmp-recipe-group__carousel', 'slickcarousel', 'carousel', 'panelcontainer');

  const carousel = document.createElement('div');
  carousel.classList.add('cmp-carousel', 'cmp-carousel__container', 'slick-initialized', 'slick-slider');
  carousel.setAttribute('data-component', 'carousel');
  carousel.setAttribute('data-show-infinite-scroll', 'false');
  carousel.setAttribute('data-show-arrows', 'true');
  carousel.setAttribute('data-show-dots', 'false');
  carousel.setAttribute('data-item-count-per-slide', '3');
  carousel.setAttribute('data-auto-play-is-enabled', 'false');
  carousel.setAttribute('data-auto-play-speed-in-ms', '500');
  carousel.setAttribute('data-reveal-next-item-partially', 'false');
  carousel.setAttribute('data-show-center-zoom', 'false');
  carousel.setAttribute('data-slides-to-scroll', '3');
  carousel.setAttribute('data-initialized', 'true');

  const prevButton = document.createElement('button');
  prevButton.classList.add('slick-prev', 'slick-arrow', 'slick-disabled');
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('aria-disabled', 'true');
  prevButton.textContent = 'Previous';

  const nextButton = document.createElement('button');
  nextButton.classList.add('slick-next', 'slick-arrow');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('aria-disabled', 'false');
  nextButton.textContent = 'Next';

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');

  recipeCards.forEach((cardRow, index) => {
    const cells = [...cardRow.children];
    const cardLinkCell = cells.find(cell => cell.querySelector('a'));
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const tagCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture') && cell.textContent.trim() !== '' && !cells[3].isSameNode(cell)); // Find tag cell, ensuring it's not the link, image, or title
    const titleCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture') && cell.textContent.trim() !== '' && cells.indexOf(cell) === 3); // Assuming title is the 4th cell (index 3)
    const timeCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture') && cell.textContent.trim() !== '' && cells.indexOf(cell) === 4); // Assuming time is the 5th cell (index 4)
    const difficultyCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture') && cell.textContent.trim() !== '' && cells.indexOf(cell) === 5); // Assuming difficulty is the 6th cell (index 5)

    const cardLink = cardLinkCell?.querySelector('a');

    const cardCarouselItem = document.createElement('div');
    cardCarouselItem.classList.add('cmp-recipe-group__carousel-item', 'cmp-carousel__item', 'slick-slide');
    cardCarouselItem.setAttribute('data-slick-index', index);
    cardCarouselItem.setAttribute('aria-hidden', index !== 0);
    if (index === 0) {
      cardCarouselItem.classList.add('slick-current', 'slick-active');
    }

    const cardAnchor = document.createElement('a');
    if (cardLink) {
      cardAnchor.href = cardLink.href;
      moveInstrumentation(cardLink, cardAnchor);
    }
    cardAnchor.classList.add('card', 'cmp-card--recipe', 'cmp-card--aashirvaad-recipe', 'color-background-background-2');
    cardAnchor.setAttribute('tabindex', index === 0 ? '0' : '-1');

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('cmp-card');

    const cardContent = document.createElement('div');
    cardContent.classList.add('cmp-card__content');

    const cardMedia = document.createElement('div');
    cardMedia.classList.add('cmp-card__media');

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
    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        lazyImageContainer.append(optimizedPic);
      }
    }
    cardImage.append(lazyImageContainer);
    cardMedia.append(cardImage);
    cardContent.append(cardMedia);

    const cardInfo = document.createElement('div');
    cardInfo.classList.add('cmp-card__info');

    const cardTag = document.createElement('div');
    cardTag.classList.add('cmp-card__tag', 'cmp-card__tag--with-heart');
    const tagWrapper = document.createElement('div');
    tagWrapper.classList.add('cmp-card__tag-wrapper');
    const tagP = document.createElement('p');
    if (tagCell) {
      moveInstrumentation(tagCell, tagP);
      tagP.append(...tagCell.childNodes);
    }
    tagWrapper.append(tagP);
    cardTag.append(tagWrapper);

    const heartsWrapper = document.createElement('div');
    heartsWrapper.classList.add('cmp-card__hearts-wrapper', 'hidden');
    const heartIcon = document.createElement('div');
    heartIcon.classList.add('cmp-card__icon', 'icon-favorite_FILL1_wght400_GRAD0_opsz20');
    heartsWrapper.append(heartIcon, document.createElement('p'));
    cardTag.append(heartsWrapper);
    cardInfo.append(cardTag);

    const cardTitle = document.createElement('div');
    cardTitle.classList.add('cmp-card__title');
    const h4 = document.createElement('h4');
    if (titleCell) {
      moveInstrumentation(titleCell, h4);
      h4.append(...titleCell.childNodes);
    }
    cardTitle.append(h4);
    cardInfo.append(cardTitle);

    const recipeFooter = document.createElement('div');
    recipeFooter.classList.add('cmp-card__recipe_footer');

    const timeInMinutes = document.createElement('div');
    timeInMinutes.classList.add('cmp-card__time-in-minutes');
    const timeIcon = document.createElement('div');
    timeIcon.classList.add('cmp-card__icon', 'icon-Group-21690');
    const timeP = document.createElement('p');
    if (timeCell) {
      moveInstrumentation(timeCell, timeP);
      timeP.append(...timeCell.childNodes);
    }
    timeInMinutes.append(timeIcon, timeP);
    recipeFooter.append(timeInMinutes);

    const difficultyLevel = document.createElement('div');
    difficultyLevel.classList.add('cmp-card__difficulty-level', 'icon-chef-cap');
    const difficultyIcon = document.createElement('div');
    difficultyIcon.classList.add('cmp-card__icon', 'path1');
    const difficultyP = document.createElement('p');
    if (difficultyCell) {
      moveInstrumentation(difficultyCell, difficultyP);
      difficultyP.append(...difficultyCell.childNodes);
    }
    difficultyLevel.append(difficultyIcon, difficultyP);
    recipeFooter.append(difficultyLevel);
    cardInfo.append(recipeFooter);

    cardContent.append(cardInfo);
    cardDiv.append(cardContent);
    cardAnchor.append(cardDiv);
    cardCarouselItem.append(cardAnchor);
    slickTrack.append(cardCarouselItem);
  });

  slickList.append(slickTrack);
  carousel.append(prevButton, slickList, nextButton);
  carouselWrapper.append(carousel);
  contentSection.append(carouselWrapper);
  // block.append(contentSection); // Appended at the end

  const actionSection = document.createElement('div');
  actionSection.classList.add('cmp-recipe-group__action');

  const ctaRow = rows[2]; // CTA is row 2 based on the block structure
  const ctaTextCell = ctaRow.querySelector('div');
  if (ctaTextCell) {
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button', 'cmp-button--primary', 'cmp-button--primary-light');
    const ctaButton = document.createElement('button');
    ctaButton.classList.add('cmp-button');
    ctaButton.setAttribute('type', 'button');
    const ctaSpan = document.createElement('span');
    ctaSpan.classList.add('cmp-button__text');
    moveInstrumentation(ctaTextCell, ctaSpan);
    ctaSpan.append(...ctaTextCell.childNodes);
    ctaButton.append(ctaSpan);
    buttonDiv.append(ctaButton);
    actionSection.append(buttonDiv);
  }
  // block.append(actionSection); // Appended at the end

  const shareDiv = document.createElement('div');
  shareDiv.classList.add('share');
  // block.append(shareDiv); // Appended at the end

  // Clear original block content
  block.textContent = '';

  // Append all constructed elements
  block.append(headerSection, tabsContainer, contentSection, actionSection, shareDiv);

  // --- Interactivity ---

  // Tab selection
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Remove 'selected' from all tabs
      tabButtons.forEach((btn) => btn.classList.remove('selected'));
      // Add 'selected' to the clicked tab
      button.classList.add('selected');

      // TODO: Implement actual filtering/carousel update based on selected tab
      // For now, this just handles the visual selection.
      // The original HTML doesn't show dynamic content loading,
      // so this would require a more complex implementation
      // if tabs are meant to filter the carousel items.
      // If the carousel is managed by a separate library (like Slick Carousel),
      // its API would need to be called here to change slides or filter items.
    });
  });

  // Carousel navigation (simplified example, actual Slick Carousel integration would be more complex)
  let currentSlide = 0;
  const totalSlides = recipeCards.length;
  const itemsPerSlide = parseInt(carousel.dataset.itemCountPerSlide, 10) || 3;

  function updateCarouselButtons() {
    prevButton.classList.toggle('slick-disabled', currentSlide === 0);
    prevButton.setAttribute('aria-disabled', currentSlide === 0);

    nextButton.classList.toggle('slick-disabled', currentSlide >= totalSlides - itemsPerSlide);
    nextButton.setAttribute('aria-disabled', currentSlide >= totalSlides - itemsPerSlide);
  }

  function navigateCarousel(direction) {
    const newSlide = currentSlide + direction * itemsPerSlide;
    if (newSlide >= 0 && newSlide <= totalSlides - itemsPerSlide) {
      currentSlide = newSlide;
      // In a real Slick Carousel, you'd call a method like $(carousel).slick('slickGoTo', currentSlide);
      // For this example, we'll just simulate the transform.
      slickTrack.style.transform = `translate3d(-${currentSlide * (316 + 20)}px, 0px, 0px)`; // Assuming 316px width + margin
      // Update active/hidden states for accessibility
      [...slickTrack.children].forEach((slide, index) => {
        const isVisible = index >= currentSlide && index < currentSlide + itemsPerSlide;
        slide.setAttribute('aria-hidden', !isVisible);
        slide.setAttribute('tabindex', isVisible ? '0' : '-1');
        slide.classList.toggle('slick-current', index === currentSlide);
        slide.classList.toggle('slick-active', isVisible);
      });
      updateCarouselButtons();
    }
  }

  prevButton.addEventListener('click', () => navigateCarousel(-1));
  nextButton.addEventListener('click', () => navigateCarousel(1));

  // Initial button state
  updateCarouselButtons();
}
