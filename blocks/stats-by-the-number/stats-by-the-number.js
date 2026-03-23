import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('stats-cmp-stats-by-the-number__container');

  // Title Section
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('stats-cmp-stats-by-the-number__title');
  const title = block.querySelector('[data-aue-prop="title"]');
  if (title) {
    titleDiv.append(title);
    moveInstrumentation(title, titleDiv);
  }
  container.append(titleDiv);

  // Tabs Section
  const tabsDiv = document.createElement('div');
  tabsDiv.classList.add('stats-cmp-stats-by-the-number__tabs');
  container.append(tabsDiv);

  // Main Content Layout
  const mainContentDiv = document.createElement('div');
  mainContentDiv.classList.add('stats-cmp-stats-by-the-number__main-content');
  container.append(mainContentDiv);

  // Left Side - Dynamic Image
  const imageSectionDiv = document.createElement('div');
  imageSectionDiv.classList.add('stats-cmp-stats-by-the-number__image-section');
  mainContentDiv.append(imageSectionDiv);

  // Right Side - Content and Stats
  const contentSectionDiv = document.createElement('div');
  contentSectionDiv.classList.add('stats-cmp-stats-by-the-number__content-section');
  mainContentDiv.append(contentSectionDiv);

  const tabItems = block.querySelectorAll('[data-aue-model="statsTab"]');
  tabItems.forEach((tabItem, index) => {
    // Tab Button
    const tabLabel = tabItem.querySelector('[data-aue-prop="tabLabel"]');
    if (tabLabel) {
      const button = document.createElement('button');
      button.classList.add('stats-cmp-stats-by-the-number__tab');
      if (index === 0) {
        button.classList.add('stats-cmp-stats-by-the-number__tab--active');
      }
      button.dataset.tab = tabLabel.textContent.trim();
      button.dataset.tabIndex = index;
      button.textContent = tabLabel.textContent.trim();
      tabsDiv.append(button);
      moveInstrumentation(tabLabel, button);
    }

    // Image Container
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('stats-cmp-stats-by-the-number__image-container');
    if (index === 0) {
      imageContainer.classList.add('stats-cmp-stats-by-the-number__image-container--active');
    }
    imageContainer.dataset.tabContent = index;

    const mainImage = tabItem.querySelector('[data-aue-prop="mainImage"]');
    if (mainImage) {
      const picture = createOptimizedPicture(mainImage.src, mainImage.alt);
      const img = picture.querySelector('img');
      img.classList.add('stats-cmp-stats-by-the-number__main-image');
      img.dataset.tabImage = index;
      if (index === 0) {
        img.style.opacity = '1';
      }
      imageContainer.append(picture);
      moveInstrumentation(mainImage, picture);
    }
    imageSectionDiv.append(imageContainer);

    // Tab Content Container
    const tabContentDiv = document.createElement('div');
    tabContentDiv.classList.add('stats-cmp-stats-by-the-number__tab-content');
    if (index === 0) {
      tabContentDiv.classList.add('stats-cmp-stats-by-the-number__tab-content--active');
    }
    tabContentDiv.dataset.tabContent = index;

    // Description
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('stats-cmp-stats-by-the-number__description');
    const description = tabItem.querySelector('[data-aue-prop="description"]');
    if (description) {
      descriptionDiv.append(description);
      moveInstrumentation(description, descriptionDiv);
    }
    tabContentDiv.append(descriptionDiv);

    // Stats Cards Grid
    const cardsDiv = document.createElement('div');
    cardsDiv.classList.add('stats-cmp-stats-by-the-number__cards');
    cardsDiv.setAttribute('role', 'list');

    const cardItems = tabItem.querySelectorAll('[data-aue-model="statsCard"]');
    cardItems.forEach((cardItem) => {
      const card = document.createElement('div');
      card.classList.add('stats-cmp-stats-by-the-number__card');
      card.setAttribute('role', 'img');
      card.setAttribute('tabindex', '0');

      const hoverImage = cardItem.querySelector('[data-aue-prop="hoverImage"]');
      if (hoverImage) {
        card.dataset.hoverImage = hoverImage.src;
        moveInstrumentation(hoverImage, card);
      }

      const numberDiv = document.createElement('div');
      numberDiv.classList.add('stats-cmp-stats-by-the-number__card__number');
      const number = cardItem.querySelector('[data-aue-prop="number"]');
      if (number) {
        numberDiv.innerHTML = number.innerHTML;
        card.dataset.count = number.innerHTML;
        card.setAttribute('aria-label', `${number.textContent.trim()}: ${cardItem.querySelector('[data-aue-prop="description"]').textContent.trim()}`);
        card.append(numberDiv);
        moveInstrumentation(number, numberDiv);
      }

      const cardDescriptionDiv = document.createElement('div');
      cardDescriptionDiv.classList.add('stats-cmp-stats-by-the-number__card__description');
      const cardDescription = cardItem.querySelector('[data-aue-prop="description"]');
      if (cardDescription) {
        cardDescriptionDiv.append(cardDescription);
        moveInstrumentation(cardDescription, cardDescriptionDiv);
      }
      card.append(cardDescriptionDiv);
      cardsDiv.append(card);
      moveInstrumentation(cardItem, card);
    });
    tabContentDiv.append(cardsDiv);

    // CTA Button
    const ctaDiv = document.createElement('div');
    ctaDiv.classList.add('stats-cmp-stats-by-the-number__cta');
    const ctaLink = tabItem.querySelector('[data-aue-prop="ctaLink"]');
    const ctaLabel = tabItem.querySelector('[data-aue-prop="ctaLabel"]');

    if (ctaLink && ctaLabel) {
      const anchor = document.createElement('a');
      anchor.href = ctaLink.href;
      anchor.classList.add('stats-cta', 'stats-cta__primary');
      if (ctaLink.target) {
        anchor.target = ctaLink.target;
      }
      anchor.setAttribute('aria-label', ctaLabel.textContent.trim());
      anchor.dataset.palette = 'palette-1';

      const iconSpan = document.createElement('span');
      iconSpan.classList.add('stats-cta__icon', 'stats-qd-icon', 'stats-qd-icon--cheveron-right');
      iconSpan.setAttribute('aria-hidden', 'true');
      anchor.append(iconSpan);

      const labelSpan = document.createElement('span');
      labelSpan.classList.add('stats-cta__label');
      labelSpan.textContent = ctaLabel.textContent.trim();
      anchor.append(labelSpan);

      ctaDiv.append(anchor);
      moveInstrumentation(ctaLink, anchor);
      moveInstrumentation(ctaLabel, anchor);
    }
    tabContentDiv.append(ctaDiv);

    contentSectionDiv.append(tabContentDiv);
    moveInstrumentation(tabItem, tabContentDiv);
  });

  block.textContent = '';
  block.append(container);
  block.className = 'stats-cmp-stats-by-the-number stats-animate-ready stats-animate-in block';
  block.setAttribute('role', 'region');
  block.setAttribute('aria-label', 'Statistics by the numbers');
  block.dataset.blockStatus = 'loaded';
}
