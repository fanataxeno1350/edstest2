import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('stats-cmp-stats-by-the-number__container');

  // Title Section
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('stats-cmp-stats-by-the-number__title');
  const titleContent = block.querySelector('[data-aue-prop="title"]');
  if (titleContent) {
    titleDiv.append(titleContent);
    moveInstrumentation(titleContent, titleDiv);
  } else {
    const defaultTitle = block.querySelector('h2');
    if (defaultTitle) {
      titleDiv.append(defaultTitle);
    }
  }
  container.append(titleDiv);

  // Tabs Section and Main Content
  const tabsDiv = document.createElement('div');
  tabsDiv.classList.add('stats-cmp-stats-by-the-number__tabs');

  const mainContentDiv = document.createElement('div');
  mainContentDiv.classList.add('stats-cmp-stats-by-the-number__main-content');

  const imageSection = document.createElement('div');
  imageSection.classList.add('stats-cmp-stats-by-the-number__image-section');

  const contentSection = document.createElement('div');
  contentSection.classList.add('stats-cmp-stats-by-the-number__content-section');

  const tabs = block.querySelectorAll('[data-aue-model="statsTab"]');
  tabs.forEach((tabNode, index) => {
    // Tab Button
    const tabLabel = tabNode.querySelector('[data-aue-prop="tabLabel"]')?.textContent || `Tab ${index + 1}`;
    const tabButton = document.createElement('button');
    tabButton.classList.add('stats-cmp-stats-by-the-number__tab');
    tabButton.setAttribute('data-tab', tabLabel);
    tabButton.setAttribute('data-tab-index', index);
    tabButton.textContent = tabLabel;
    tabsDiv.append(tabButton);
    moveInstrumentation(tabNode, tabButton);

    // Image Container
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('stats-cmp-stats-by-the-number__image-container');
    imageContainer.setAttribute('data-tab-content', index);

    const mainImage = tabNode.querySelector('[data-aue-prop="mainImage"]');
    if (mainImage) {
      const img = mainImage.querySelector('img');
      if (img) {
        const picture = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '750' }]);
        picture.classList.add('stats-cmp-stats-by-the-number__main-image');
        picture.setAttribute('data-tab-image', index);
        imageContainer.append(picture);
        moveInstrumentation(mainImage, imageContainer);
      }
    }
    imageSection.append(imageContainer);

    // Tab Content Container
    const tabContentDiv = document.createElement('div');
    tabContentDiv.classList.add('stats-cmp-stats-by-the-number__tab-content');
    tabContentDiv.setAttribute('data-tab-content', index);

    // Description
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('stats-cmp-stats-by-the-number__description');
    const descriptionContent = tabNode.querySelector('[data-aue-prop="description"]');
    if (descriptionContent) {
      descriptionDiv.append(descriptionContent);
      moveInstrumentation(descriptionContent, descriptionDiv);
    } else {
      const defaultDescription = tabNode.querySelector('p');
      if (defaultDescription) {
        descriptionDiv.append(defaultDescription);
      }
    }
    tabContentDiv.append(descriptionDiv);

    // Stats Cards Grid
    const cardsGrid = document.createElement('div');
    cardsGrid.classList.add('stats-cmp-stats-by-the-number__cards');
    cardsGrid.setAttribute('role', 'list');

    const cards = tabNode.querySelectorAll('[data-aue-model="statsCard"]');
    cards.forEach((cardNode) => {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('stats-cmp-stats-by-the-number__card');
      cardDiv.setAttribute('role', 'img');
      cardDiv.setAttribute('tabindex', '0');

      const hoverImage = cardNode.querySelector('[data-aue-prop="hoverImage"]');
      if (hoverImage) {
        const img = hoverImage.querySelector('img');
        if (img) {
          cardDiv.setAttribute('data-hover-image', img.src);
        }
      }

      const hoverDetails = cardNode.querySelector('[data-aue-prop="hoverDetails"]');
      if (hoverDetails) {
        cardDiv.setAttribute('data-hover-details', hoverDetails.innerHTML);
      }

      const numberDiv = document.createElement('div');
      numberDiv.classList.add('stats-cmp-stats-by-the-number__card__number');
      const numberContent = cardNode.querySelector('[data-aue-prop="number"]');
      if (numberContent) {
        numberDiv.innerHTML = numberContent.innerHTML;
        numberDiv.setAttribute('data-count', numberContent.innerHTML);
        moveInstrumentation(numberContent, numberDiv);
      } else {
        const defaultNumber = cardNode.querySelector('.stats-readOnlyAuthor');
        if (defaultNumber) {
          numberDiv.innerHTML = defaultNumber.innerHTML;
          numberDiv.setAttribute('data-count', defaultNumber.innerHTML);
        }
      }
      cardDiv.append(numberDiv);

      const cardDescriptionDiv = document.createElement('div');
      cardDescriptionDiv.classList.add('stats-cmp-stats-by-the-number__card__description');
      const cardDescriptionContent = cardNode.querySelector('[data-aue-prop="cardDescription"]');
      if (cardDescriptionContent) {
        cardDescriptionDiv.append(cardDescriptionContent);
        moveInstrumentation(cardDescriptionContent, cardDescriptionDiv);
      } else {
        const defaultCardDescription = cardNode.querySelector('.stats-cmp-stats-by-the-number__card__description p');
        if (defaultCardDescription) {
          cardDescriptionDiv.append(defaultCardDescription);
        }
      }
      cardDiv.append(cardDescriptionDiv);

      cardsGrid.append(cardDiv);
      moveInstrumentation(cardNode, cardDiv);
    });
    tabContentDiv.append(cardsGrid);

    // CTA Button
    const ctaDiv = document.createElement('div');
    ctaDiv.classList.add('stats-cmp-stats-by-the-number__cta');
    const ctaLink = tabNode.querySelector('[data-aue-prop="ctaLink"]');
    if (ctaLink) {
      const link = ctaLink.querySelector('a');
      if (link) {
        const newLink = document.createElement('a');
        newLink.href = link.href;
        newLink.className = 'stats-cta stats-cta__primary';
        if (link.target) newLink.target = link.target;
        if (link.getAttribute('aria-label')) newLink.setAttribute('aria-label', link.getAttribute('aria-label'));
        if (link.dataset.palette) newLink.dataset.palette = link.dataset.palette;

        const iconSpan = document.createElement('span');
        iconSpan.classList.add('stats-cta__icon', 'stats-qd-icon', 'stats-qd-icon--cheveron-right');
        iconSpan.setAttribute('aria-hidden', 'true');
        newLink.append(iconSpan);

        const labelSpan = document.createElement('span');
        labelSpan.classList.add('stats-cta__label');
        labelSpan.textContent = tabNode.querySelector('[data-aue-prop="ctaLabel"]')?.textContent || link.textContent;
        newLink.append(labelSpan);

        ctaDiv.append(newLink);
        moveInstrumentation(ctaLink, ctaDiv);
      }
    }
    tabContentDiv.append(ctaDiv);

    contentSection.append(tabContentDiv);

    // Set initial active states
    if (index === 0) {
      tabButton.classList.add('stats-cmp-stats-by-the-number__tab--active');
      imageContainer.classList.add('stats-cmp-stats-by-the-number__image-container--active');
      tabContentDiv.classList.add('stats-cmp-stats-by-the-number__tab-content--active');
    }
  });

  mainContentDiv.append(imageSection, contentSection);
  container.append(tabsDiv, mainContentDiv);

  // Add event listeners for tab switching
  tabsDiv.querySelectorAll('.stats-cmp-stats-by-the-number__tab').forEach((tabButton) => {
    tabButton.addEventListener('click', () => {
      const tabIndex = tabButton.dataset.tabIndex;

      // Deactivate all tabs, images, and content
      tabsDiv.querySelectorAll('.stats-cmp-stats-by-the-number__tab').forEach((btn) => {
        btn.classList.remove('stats-cmp-stats-by-the-number__tab--active');
      });
      imageSection.querySelectorAll('.stats-cmp-stats-by-the-number__image-container').forEach((imgCont) => {
        imgCont.classList.remove('stats-cmp-stats-by-the-number__image-container--active');
      });
      contentSection.querySelectorAll('.stats-cmp-stats-by-the-number__tab-content').forEach((contentCont) => {
        contentCont.classList.remove('stats-cmp-stats-by-the-number__tab-content--active');
      });

      // Activate selected tab, image, and content
      tabButton.classList.add('stats-cmp-stats-by-the-number__tab--active');
      imageSection.querySelector(`[data-tab-content="${tabIndex}"]`).classList.add('stats-cmp-stats-by-the-number__image-container--active');
      contentSection.querySelector(`[data-tab-content="${tabIndex}"]`).classList.add('stats-cmp-stats-by-the-number__tab-content--active');
    });
  });

  block.textContent = '';
  block.append(container);
  block.classList.add('stats-cmp-stats-by-the-number', 'stats-animate-ready', 'stats-animate-in');
  block.setAttribute('role', 'region');
  block.setAttribute('aria-label', 'Statistics by the numbers');
  block.dataset.blockStatus = 'loaded';
}
