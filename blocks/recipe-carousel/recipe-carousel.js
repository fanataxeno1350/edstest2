import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const recipeGroup = block.querySelector('[data-component="recipe-group"]');
  if (!recipeGroup) {
    return;
  }

  const rootDiv = document.createElement('div');
  rootDiv.classList.add('recipe-carousel-container');

  // Header Section
  const headerSection = document.createElement('div');
  headerSection.classList.add('recipe-carousel-header');

  const titleElement = recipeGroup.querySelector('.dynamiccardsvertwo-dynamicCardsVertwo-cmp-recipe-group__title');
  if (titleElement) {
    const h2 = document.createElement('h2');
    h2.textContent = titleElement.textContent;
    headerSection.append(h2);
    moveInstrumentation(titleElement, h2);
  }

  const subtitleElement = recipeGroup.querySelector('.dynamiccardsvertwo-dynamicCardsVertwo-cmp-recipe-group__subtitle');
  if (subtitleElement) {
    const p = document.createElement('p');
    p.textContent = subtitleElement.textContent;
    headerSection.append(p);
    moveInstrumentation(subtitleElement, p);
  }
  rootDiv.append(headerSection);

  // Tabs Section (simplified for decoration, actual functionality would require more JS)
  const tabsSection = document.createElement('div');
  tabsSection.classList.add('recipe-carousel-tabs');
  const tabItems = recipeGroup.querySelectorAll('.dynamiccardsvertwo-dynamicCardsVertwo-cmp-tab-group__tab-item');
  tabItems.forEach((tabItem) => {
    const tabButton = tabItem.querySelector('button');
    if (tabButton) {
      const buttonWrapper = document.createElement('div');
      buttonWrapper.classList.add('recipe-carousel-tab-button');
      if (tabButton.classList.contains('dynamiccardsvertwo-selected')) {
        buttonWrapper.classList.add('selected');
      }
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = tabButton.textContent.trim();
      buttonWrapper.append(button);
      tabsSection.append(buttonWrapper);
      moveInstrumentation(tabItem, buttonWrapper);
    }
  });
  rootDiv.append(tabsSection);

  // Carousel Section
  const carouselSection = document.createElement('div');
  carouselSection.classList.add('recipe-carousel-cards');

  const recipeCards = block.querySelectorAll('[data-aue-model="recipe"]');

  recipeCards.forEach((cardNode) => {
    const cardWrapper = document.createElement('a');
    cardWrapper.classList.add('recipe-card');

    const linkElement = cardNode.querySelector('[data-aue-prop="link"]');
    if (linkElement && linkElement.href) {
      cardWrapper.href = linkElement.href;
      moveInstrumentation(linkElement, cardWrapper);
    } else {
      // Fallback: search for the first <a> within the card if data-aue-prop is missing on the card itself
      const fallbackLink = cardNode.querySelector('a');
      if (fallbackLink && fallbackLink.href) {
        cardWrapper.href = fallbackLink.href;
        moveInstrumentation(fallbackLink, cardWrapper);
      }
    }

    const imageElement = cardNode.querySelector('[data-aue-prop="image"]');
    if (imageElement) {
      const picture = createOptimizedPicture(imageElement.src, imageElement.alt);
      cardWrapper.append(picture);
      moveInstrumentation(imageElement, picture);
    }

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('recipe-card-info');

    const tagElement = cardNode.querySelector('[data-aue-prop="tag"]');
    if (tagElement) {
      const tagP = document.createElement('p');
      tagP.classList.add('recipe-card-tag');
      tagP.textContent = tagElement.textContent;
      infoDiv.append(tagP);
      moveInstrumentation(tagElement, tagP);
    }

    const titleElement = cardNode.querySelector('[data-aue-prop="title"]');
    if (titleElement) {
      const h4 = document.createElement('h4');
      h4.classList.add('recipe-card-title');
      h4.textContent = titleElement.textContent;
      infoDiv.append(h4);
      moveInstrumentation(titleElement, h4);
    }

    const footerDiv = document.createElement('div');
    footerDiv.classList.add('recipe-card-footer');

    const timeElement = cardNode.querySelector('[data-aue-prop="time"]');
    if (timeElement) {
      const timeP = document.createElement('p');
      timeP.classList.add('recipe-card-time');
      timeP.textContent = timeElement.textContent;
      footerDiv.append(timeP);
      moveInstrumentation(timeElement, timeP);
    }

    const difficultyElement = cardNode.querySelector('[data-aue-prop="difficulty"]');
    if (difficultyElement) {
      const difficultyP = document.createElement('p');
      difficultyP.classList.add('recipe-card-difficulty');
      difficultyP.textContent = difficultyElement.textContent;
      footerDiv.append(difficultyP);
      moveInstrumentation(difficultyElement, difficultyP);
    }

    infoDiv.append(footerDiv);
    cardWrapper.append(infoDiv);
    carouselSection.append(cardWrapper);
    moveInstrumentation(cardNode, cardWrapper);
  });

  rootDiv.append(carouselSection);

  // Action Button
  const actionSection = document.createElement('div');
  actionSection.classList.add('recipe-carousel-action');
  const viewAllButton = recipeGroup.querySelector('.dynamiccardsvertwo-dynamicCardsVertwo-cmp-recipe-group__action .dynamiccardsvertwo-cmp-button');
  if (viewAllButton) {
    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('button-container');
    const button = document.createElement('a');
    button.classList.add('button', 'primary');
    button.textContent = viewAllButton.textContent.trim();
    // Assuming the link for 'View All' is not directly available in the authored HTML for this specific button
    // If it were, we'd extract it similarly to the recipe card links.
    button.href = '#'; // Placeholder, replace with actual link if available
    buttonWrapper.append(button);
    actionSection.append(buttonWrapper);
    moveInstrumentation(viewAllButton.closest('.dynamiccardsvertwo-button'), buttonWrapper);
  }
  rootDiv.append(actionSection);

  block.textContent = '';
  block.append(rootDiv);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}