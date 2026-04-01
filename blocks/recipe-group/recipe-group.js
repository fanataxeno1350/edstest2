import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    titleRow,
    subtitleRow,
    tabsRow,
    cardsRow, // This row is not used directly for content but marks the start of item rows
    viewAllLabelRow,
    ...itemRows
  ] = [...block.children];

  block.innerHTML = '';
  block.classList.add('cmp-recipe-group');

  // Header Section
  const headerSection = document.createElement('div');
  headerSection.classList.add('cmp-recipe-group__header-section');
  block.append(headerSection);

  const title = document.createElement('h2');
  moveInstrumentation(titleRow.firstElementChild, title);
  title.classList.add('cmp-recipe-group__title');
  title.textContent = titleRow.firstElementChild.textContent;
  headerSection.append(title);

  const subtitle = document.createElement('div');
  moveInstrumentation(subtitleRow.firstElementChild, subtitle);
  subtitle.classList.add('cmp-recipe-group__subtitle');
  subtitle.textContent = subtitleRow.firstElementChild.textContent;
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

  // Correctly read tab labels from the tabsRow children
  const tabLabels = [...tabsRow.firstElementChild.children].map((cell) => cell.textContent.trim());

  tabLabels.forEach((label, index) => {
    const tabItem = document.createElement('div');
    tabItem.classList.add('cmp-tab-group__tab-item');

    const tabDiv = document.createElement('div');
    tabDiv.classList.add('tab', 'cmp-tab--primary');

    const tabButton = document.createElement('button');
    tabButton.type = 'button';
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
      // TODO: Implement actual tab content switching logic here
    });
  });

  // Content Section (Carousel for Recipe Cards)
  const contentSection = document.createElement('div');
  contentSection.classList.add('cmp-recipe-group__content');
  block.append(contentSection);

  const recipeCarousel = document.createElement('div');
  recipeCarousel.classList.add('slickcarousel', 'carousel', 'panelcontainer'); // Removed 'cmp-recipe-group__carousel', 'undefined' as they are not in original HTML
  contentSection.append(recipeCarousel);

  const carouselCmp = document.createElement('div');
  carouselCmp.classList.add('cmp-carousel');
  carouselCmp.setAttribute('data-component', 'carousel');
  carouselCmp.setAttribute('data-show-infinite-scroll', 'false');
  carouselCmp.setAttribute('data-show-arrows', 'true');
  carouselCmp.setAttribute('data-show-dots', 'false');
  carouselCmp.setAttribute('data-item-count-per-slide', '3');
  carouselCmp.setAttribute('data-auto-play-is-enabled', 'false');
  carouselCmp.setAttribute('data-auto-play-speed-in-ms', '500');
  carouselCmp.setAttribute('data-reveal-next-item-partially', 'false');
  carouselCmp.setAttribute('data-show-center-zoom', 'false');
  carouselCmp.setAttribute('data-slides-to-scroll', '3');
  carouselCmp.setAttribute('data-initialized', 'true');
  recipeCarousel.append(carouselCmp);

  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container', 'slick-initialized', 'slick-slider');
  carouselCmp.append(carouselContainer);

  const prevButton = document.createElement('button');
  prevButton.classList.add('slick-prev', 'slick-arrow', 'slick-disabled');
  prevButton.type = 'button';
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.setAttribute('aria-disabled', 'true');
  prevButton.textContent = 'Previous';
  carouselContainer.append(prevButton);

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');
  carouselContainer.append(slickList);

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');
  slickList.append(slickTrack);

  itemRows.forEach((row, index) => {
    // Each row is a div, its children are the cells
    const linkCell = row.children[0];
    const imageCell = row.children[1];
    const tagCell = row.children[2];
    const recipeTitleCell = row.children[3];
    const timeCell = row.children[4];
    const difficultyCell = row.children[5];

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('cmp-recipe-group__carousel-item', 'cmp-carousel__item', 'slick-slide');
    carouselItem.setAttribute('data-slick-index', index);
    carouselItem.setAttribute('aria-hidden', index !== 0);
    carouselItem.setAttribute('tabindex', index === 0 ? '0' : '-1');
    slickTrack.append(carouselItem);

    const recipeLink = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      recipeLink.href = foundLink.href;
      moveInstrumentation(linkCell, recipeLink);
    }
    recipeLink.classList.add('card', 'cmp-card--recipe', 'cmp-card--aashirvaad-recipe', 'color-background-background-2');
    carouselItem.append(recipeLink);

    const card = document.createElement('div');
    card.classList.add('cmp-card');
    recipeLink.append(card);

    const cardContent = document.createElement('div');
    cardContent.classList.add('cmp-card__content');
    card.append(cardContent);

    const cardMedia = document.createElement('div');
    cardMedia.classList.add('cmp-card__media');
    cardContent.append(cardMedia);

    const cardOptions = document.createElement('div');
    cardOptions.classList.add('cmp-card__options');
    cardMedia.append(cardOptions);

    const threeDots = document.createElement('div');
    threeDots.classList.add('cmp-card__three-dots', 'icon-open-card-popup');
    cardOptions.append(threeDots);

    // Add event listener for the three-dots icon
    threeDots.addEventListener('click', () => {
      // TODO: Implement popup logic here
      console.log('Three dots clicked for recipe:', recipeTitleCell.textContent.trim());
    });

    const cardImage = document.createElement('div');
    cardImage.classList.add('cmp-card__image');
    cardMedia.append(cardImage);

    const lazyImageContainer = document.createElement('div');
    lazyImageContainer.classList.add('lazy-image-container');
    cardImage.append(lazyImageContainer);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      lazyImageContainer.append(optimizedPic);
    }

    const cardInfo = document.createElement('div');
    cardInfo.classList.add('cmp-card__info');
    cardContent.append(cardInfo);

    const cardTag = document.createElement('div');
    cardTag.classList.add('cmp-card__tag', 'cmp-card__tag--with-heart');
    cardInfo.append(cardTag);

    const tagWrapper = document.createElement('div');
    tagWrapper.classList.add('cmp-card__tag-wrapper');
    const tagP = document.createElement('p');
    moveInstrumentation(tagCell.firstElementChild, tagP);
    tagP.textContent = tagCell.textContent.trim();
    tagWrapper.append(tagP);
    cardTag.append(tagWrapper);

    const heartsWrapper = document.createElement('div');
    heartsWrapper.classList.add('cmp-card__hearts-wrapper', 'hidden');
    const heartIcon = document.createElement('div');
    heartIcon.classList.add('cmp-card__icon', 'icon-favorite_FILL1_wght400_GRAD0_opsz20');
    heartsWrapper.append(heartIcon);
    heartsWrapper.append(document.createElement('p'));
    cardTag.append(heartsWrapper);

    const cardTitle = document.createElement('div');
    cardTitle.classList.add('cmp-card__title');
    const titleH4 = document.createElement('h4');
    moveInstrumentation(recipeTitleCell.firstElementChild, titleH4);
    titleH4.textContent = recipeTitleCell.textContent.trim();
    cardTitle.append(titleH4);
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
    timeP.textContent = timeCell.textContent.trim();
    timeInMinutes.append(timeP);
    recipeFooter.append(timeInMinutes);

    const difficultyLevel = document.createElement('div');
    difficultyLevel.classList.add('cmp-card__difficulty-level', 'icon-chef-cap');
    const difficultyIcon = document.createElement('div');
    difficultyIcon.classList.add('cmp-card__icon', 'path1');
    difficultyLevel.append(difficultyIcon);
    const difficultyP = document.createElement('p');
    moveInstrumentation(difficultyCell.firstElementChild, difficultyP);
    difficultyP.textContent = difficultyCell.textContent.trim();
    difficultyLevel.append(difficultyP);
    recipeFooter.append(difficultyLevel);
  });

  const nextButton = document.createElement('button');
  nextButton.classList.add('slick-next', 'slick-arrow');
  nextButton.type = 'button';
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.setAttribute('aria-disabled', 'false');
  nextButton.textContent = 'Next';
  carouselContainer.append(nextButton);

  // Simple carousel logic (for demonstration, a full slick carousel implementation is complex)
  let currentIndex = 0;
  const slides = [...slickTrack.children];
  const slideWidth = 316; // This should ideally be calculated dynamically

  const updateCarousel = () => {
    slickTrack.style.transform = `translate3d(-${currentIndex * slideWidth}px, 0px, 0px)`;

    slides.forEach((slide, i) => {
      if (i >= currentIndex && i < currentIndex + 3) {
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

    if (currentIndex >= slides.length - 3) {
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
    if (currentIndex < slides.length - 3) {
      currentIndex += 1;
      updateCarousel();
    }
  });

  updateCarousel(); // Initialize carousel state

  // Action Section (View All Button)
  const actionSection = document.createElement('div');
  actionSection.classList.add('cmp-recipe-group__action');
  block.append(actionSection);

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'cmp-button--primary', 'cmp-button--primary-light');
  actionSection.append(buttonDiv);

  const viewAllButton = document.createElement('button');
  viewAllButton.type = 'button';
  viewAllButton.classList.add('cmp-button');
  moveInstrumentation(viewAllLabelRow.firstElementChild, viewAllButton);

  const viewAllText = document.createElement('span');
  viewAllText.classList.add('cmp-button__text');
  viewAllText.textContent = viewAllLabelRow.firstElementChild.textContent.trim();
  viewAllButton.append(viewAllText);
  buttonDiv.append(viewAllButton);

  // Share Section
  const shareDiv = document.createElement('div');
  shareDiv.classList.add('share');
  block.append(shareDiv);
}
