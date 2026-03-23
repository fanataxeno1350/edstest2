import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rootDiv = document.createElement('div');
  rootDiv.className = 'feature-cards-container';

  // Extract heading
  const headingContent = block.querySelector('[data-aue-prop="heading"]');
  if (headingContent) {
    const headingWrapper = document.createElement('div');
    headingWrapper.className = 'feature-cards-heading';
    headingWrapper.append(headingContent);
    moveInstrumentation(headingContent, headingWrapper);
    rootDiv.append(headingWrapper);
  }

  // Extract cards
  const cardsWrapper = document.createElement('div');
  cardsWrapper.className = 'feature-cards-grid';

  const authoredCards = block.querySelectorAll('[data-aue-model="featureCard"]');
  authoredCards.forEach((cardNode) => {
    const cardLink = cardNode.querySelector('a');
    if (cardLink) {
      const newCardLink = document.createElement('a');
      newCardLink.href = cardLink.href;
      if (cardLink.target) {
        newCardLink.target = cardLink.target;
      }
      if (cardLink.title) {
        newCardLink.title = cardLink.title;
      }
      newCardLink.className = 'feature-card-item';

      const imageContainer = document.createElement('div');
      imageContainer.className = 'feature-card-image';
      const img = cardNode.querySelector('[data-aue-prop="image"]');
      if (img) {
        const picture = createOptimizedPicture(img.src, img.alt);
        imageContainer.append(picture);
        moveInstrumentation(img, picture);
      }
      newCardLink.append(imageContainer);

      const textContainer = document.createElement('div');
      textContainer.className = 'feature-card-content';

      const title = cardNode.querySelector('[data-aue-prop="title"]');
      if (title) {
        const newTitle = document.createElement('h2');
        newTitle.className = 'feature-card-title';
        newTitle.append(...title.childNodes);
        moveInstrumentation(title, newTitle);
        textContainer.append(newTitle);
      }

      const description = cardNode.querySelector('[data-aue-prop="description"]');
      if (description) {
        const newDescription = document.createElement('div');
        newDescription.className = 'feature-card-description';
        newDescription.append(...description.childNodes);
        moveInstrumentation(description, newDescription);
        textContainer.append(newDescription);
      }

      const ctaLabel = cardNode.querySelector('[data-aue-prop="ctaLabel"]');
      if (ctaLabel) {
        const ctaButton = document.createElement('div');
        ctaButton.className = 'feature-card-button';
        ctaButton.textContent = ctaLabel.textContent;
        moveInstrumentation(ctaLabel, ctaButton);
        textContainer.append(ctaButton);
      } else {
        // Fallback for button text if ctaLabel is not found
        const buttonContainer = cardNode.querySelector('.featurecards-redirected_btn button');
        if (buttonContainer) {
          const ctaButton = document.createElement('div');
          ctaButton.className = 'feature-card-button';
          ctaButton.textContent = cardLink.title || 'Explore'; // Use link title or default
          moveInstrumentation(buttonContainer, ctaButton);
          textContainer.append(ctaButton);
        }
      }

      newCardLink.append(textContainer);
      cardsWrapper.append(newCardLink);
      moveInstrumentation(cardNode, newCardLink);
    }
  });

  rootDiv.append(cardsWrapper);

  block.textContent = '';
  block.append(rootDiv);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
