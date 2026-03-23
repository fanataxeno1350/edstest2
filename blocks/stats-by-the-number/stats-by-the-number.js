import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('stats-cmp-stats-by-the-number__container');
  moveInstrumentation(block.querySelector(':scope > div'), container);

  // Title
  const titleWrapper = document.createElement('div');
  titleWrapper.classList.add('stats-cmp-stats-by-the-number__title');
  const title = block.querySelector('[data-aue-prop="title"]');
  if (title) {
    titleWrapper.append(title);
    moveInstrumentation(block.querySelector('[data-aue-prop="title"]'), titleWrapper);
  }
  container.append(titleWrapper);

  // Tabs and Main Content
  const tabsWrapper = document.createElement('div');
  tabsWrapper.classList.add('stats-cmp-stats-by-the-number__tabs');
  const mainContent = document.createElement('div');
  mainContent.classList.add('stats-cmp-stats-by-the-number__main-content');

  const imageSection = document.createElement('div');
  imageSection.classList.add('stats-cmp-stats-by-the-number__image-section');
  const contentSection = document.createElement('div');
  contentSection.classList.add('stats-cmp-stats-by-the-number__content-section');

  const tabs = block.querySelectorAll('[data-aue-model="tab"]');
  tabs.forEach((tabNode, index) => {
    const tabName = tabNode.querySelector('[data-aue-prop="tabName"]');
    if (tabName) {
      const button = document.createElement('button');
      button.classList.add('stats-cmp-stats-by-the-number__tab');
      if (index === 0) {
        button.classList.add('stats-cmp-stats-by-the-number__tab--active');
      }
      button.dataset.tab = tabName.textContent.trim();
      button.dataset.tabIndex = index;
      button.textContent = tabName.textContent.trim();
      tabsWrapper.append(button);
      moveInstrumentation(tabNode.querySelector('[data-aue-prop="tabName"]'), button);
    }

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('stats-cmp-stats-by-the-number__image-container');
    if (index === 0) {
      imageContainer.classList.add('stats-cmp-stats-by-the-number__image-container--active');
    }
    imageContainer.dataset.tabContent = index;

    const mainImage = tabNode.querySelector('[data-aue-prop="mainImage"]');
    if (mainImage) {
      const picture = createOptimizedPicture(mainImage.src, mainImage.alt);
      const img = picture.querySelector('img');
      img.classList.add('stats-cmp-stats-by-the-number__main-image');
      img.dataset.tabImage = index;
      imageContainer.append(picture);
      moveInstrumentation(mainImage, imageContainer);
    }
    imageSection.append(imageContainer);

    const tabContentDiv = document.createElement('div');
    tabContentDiv.classList.add('stats-cmp-stats-by-the-number__tab-content');
    if (index === 0) {
      tabContentDiv.classList.add('stats-cmp-stats-by-the-number__tab-content--active');
    }
    tabContentDiv.dataset.tabContent = index;

    const descriptionWrapper = document.createElement('div');
    descriptionWrapper.classList.add('stats-cmp-stats-by-the-number__description');
    const description = tabNode.querySelector('[data-aue-prop="description"]');
    if (description) {
      descriptionWrapper.append(description);
      moveInstrumentation(tabNode.querySelector('[data-aue-prop="description"]'), descriptionWrapper);
    }
    tabContentDiv.append(descriptionWrapper);

    const cardsWrapper = document.createElement('div');
    cardsWrapper.classList.add('stats-cmp-stats-by-the-number__cards');
    cardsWrapper.setAttribute('role', 'list');

    const statCards = tabNode.querySelectorAll('[data-aue-model="statCard"]');
    statCards.forEach((cardNode) => {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('stats-cmp-stats-by-the-number__card');
      cardDiv.setAttribute('role', 'img');
      cardDiv.setAttribute('tabindex', '0');

      const hoverImage = cardNode.querySelector('[data-aue-prop="hoverImage"]');
      if (hoverImage) {
        cardDiv.dataset.hoverImage = hoverImage.src;
        moveInstrumentation(hoverImage, cardDiv);
      }

      const hoverDetails = cardNode.querySelector('[data-aue-prop="hoverDetails"]');
      if (hoverDetails) {
        cardDiv.dataset.hoverDetails = hoverDetails.innerHTML;
        moveInstrumentation(hoverDetails, cardDiv);
      }

      const numberDiv = document.createElement('div');
      numberDiv.classList.add('stats-cmp-stats-by-the-number__card__number');
      const number = cardNode.querySelector('[data-aue-prop="number"]');
      if (number) {
        numberDiv.innerHTML = number.innerHTML;
        cardDiv.dataset.count = number.innerHTML;
        cardDiv.append(numberDiv);
        moveInstrumentation(number, numberDiv);
      }

      const cardDescriptionDiv = document.createElement('div');
      cardDescriptionDiv.classList.add('stats-cmp-stats-by-the-number__card__description');
      const cardDescription = cardNode.querySelector('[data-aue-prop="description"]');
      if (cardDescription) {
        cardDescriptionDiv.innerHTML = cardDescription.innerHTML;
        cardDiv.append(cardDescriptionDiv);
        moveInstrumentation(cardDescription, cardDescriptionDiv);
      }

      // Set aria-label for accessibility
      const ariaLabelText = `${number?.textContent.trim() || ''}: ${cardDescription?.textContent.trim() || ''}`;
      cardDiv.setAttribute('aria-label', ariaLabelText);

      cardsWrapper.append(cardDiv);
      moveInstrumentation(cardNode, cardDiv);
    });
    tabContentDiv.append(cardsWrapper);

    const ctaWrapper = document.createElement('div');
    ctaWrapper.classList.add('stats-cmp-stats-by-the-number__cta');
    const ctaLink = tabNode.querySelector('[data-aue-prop="ctaLink"]');
    const ctaLabel = tabNode.querySelector('[data-aue-prop="ctaLabel"]');

    if (ctaLink && ctaLabel) {
      const link = document.createElement('a');
      link.classList.add('stats-cta', 'stats-cta__primary');
      link.href = ctaLink.href;
      link.textContent = ctaLabel.textContent.trim();
      link.setAttribute('aria-label', ctaLabel.textContent.trim());

      // Check for target attribute from original link
      const originalLink = tabNode.querySelector('.button-container a');
      if (originalLink && originalLink.target) {
        link.target = originalLink.target;
      }

      const iconSpan = document.createElement('span');
      iconSpan.classList.add('stats-cta__icon', 'stats-qd-icon', 'stats-qd-icon--cheveron-right');
      iconSpan.setAttribute('aria-hidden', 'true');
      link.prepend(iconSpan);

      ctaWrapper.append(link);
      moveInstrumentation(ctaLink, link);
      moveInstrumentation(ctaLabel, link);
    }
    tabContentDiv.append(ctaWrapper);

    contentSection.append(tabContentDiv);
    moveInstrumentation(tabNode, tabContentDiv);
  });

  mainContent.append(imageSection);
  mainContent.append(contentSection);

  container.append(tabsWrapper);
  container.append(mainContent);

  block.textContent = '';
  block.append(container);
  block.className = 'stats-cmp-stats-by-the-number stats-animate-ready stats-animate-in block';
  block.setAttribute('role', 'region');
  block.setAttribute('aria-label', 'Statistics by the numbers');
  block.dataset.blockStatus = 'loaded';

  // Add event listeners for tab switching
  const tabButtons = block.querySelectorAll('.stats-cmp-stats-by-the-number__tab');
  const tabContents = block.querySelectorAll('.stats-cmp-stats-by-the-number__tab-content');
  const imageContainers = block.querySelectorAll('.stats-cmp-stats-by-the-number__image-container');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabIndex = button.dataset.tabIndex;

      tabButtons.forEach(btn => btn.classList.remove('stats-cmp-stats-by-the-number__tab--active'));
      button.classList.add('stats-cmp-stats-by-the-number__tab--active');

      tabContents.forEach(content => {
        if (content.dataset.tabContent === tabIndex) {
          content.classList.add('stats-cmp-stats-by-the-number__tab-content--active');
        } else {
          content.classList.remove('stats-cmp-stats-by-the-number__tab-content--active');
        }
      });

      imageContainers.forEach(imgContainer => {
        if (imgContainer.dataset.tabContent === tabIndex) {
          imgContainer.classList.add('stats-cmp-stats-by-the-number__image-container--active');
        } else {
          imgContainer.classList.remove('stats-cmp-stats-by-the-number__image-container--active');
        }
      });
    });
  });
}
