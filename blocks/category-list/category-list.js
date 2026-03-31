import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // BlockJson indicates 2 root fields: "heading" (text) and "categories" (container of "category" items).
  // The EDS block structure shows:
  // block.children[0] -> Heading value
  // block.children[1] -> Categories value (this is an empty div in the structure, representing the container itself)
  // block.children[2...] -> Category item rows
  const [headingRow, categoriesContainerPlaceholder, ...categoryRows] = [...block.children];

  const mainContainer = document.createElement('div');
  mainContainer.classList.add('elementor-element', 'elementor-element-f89cd68', 'e-flex', 'e-con-boxed', 'e-con', 'e-child');
  moveInstrumentation(block, mainContainer);

  const innerContainer = document.createElement('div');
  innerContainer.classList.add('e-con-inner');

  // Heading Section
  const headingSection = document.createElement('div');
  headingSection.classList.add('elementor-element', 'elementor-element-4e0651c', 'e-con-full', 'e-flex', 'e-con', 'e-child');

  const headingWrapper = document.createElement('div');
  headingWrapper.classList.add('elementor-element', 'elementor-element-a8d9143', 'elementor-widget-mobile__width-inherit', 'elementor-widget', 'elementor-widget-heading');

  const headingWidgetContainer = document.createElement('div');
  headingWidgetContainer.classList.add('elementor-widget-container');

  const headingElement = document.createElement('h2');
  headingElement.classList.add('elementor-heading-title', 'elementor-size-default');
  moveInstrumentation(headingRow.firstElementChild, headingElement);
  // Append all child nodes from the original heading cell to the new heading element
  while (headingRow.firstElementChild.firstChild) {
    headingElement.append(headingRow.firstElementChild.firstChild);
  }

  headingWidgetContainer.append(headingElement);
  headingWrapper.append(headingWidgetContainer);
  headingSection.append(headingWrapper);
  innerContainer.append(headingSection);

  // Categories Grid
  const categoriesGrid = document.createElement('div');
  categoriesGrid.classList.add('elementor-element', 'elementor-element-956ee7c', 'e-grid', 'e-con-boxed', 'e-con', 'e-child');

  const categoriesGridInner = document.createElement('div');
  categoriesGridInner.classList.add('e-con-inner');

  categoryRows.forEach((row) => {
    const categoryItem = document.createElement('div');
    // The original HTML uses dynamic IDs like elementor-element-9325a9b for each category item.
    // We should not invent these IDs. The existing classes are sufficient.
    categoryItem.classList.add('e-con-full', 'e-flex', 'e-con', 'e-child');
    moveInstrumentation(row, categoryItem);

    // BlockJson for 'category' item has 2 fields: 'title' (text) and 'link' (aem-content with <a>)
    // The EDS block structure confirms this: cell[0] is title, cell[1] is link.
    // So we can directly destructure row.children.
    const [titleCell, linkCell] = row.children;

    if (titleCell) {
      const titleWrapper = document.createElement('div');
      // Original HTML has specific IDs like elementor-element-51a7c6a, but we omit dynamic IDs.
      titleWrapper.classList.add('elementor-element', 'elementor-widget', 'elementor-widget-heading');
      const titleWidgetContainer = document.createElement('div');
      titleWidgetContainer.classList.add('elementor-widget-container');
      const titleElement = document.createElement('h2');
      titleElement.classList.add('elementor-heading-title', 'elementor-size-default');
      moveInstrumentation(titleCell, titleElement);
      while (titleCell.firstChild) titleElement.append(titleCell.firstChild);
      titleWidgetContainer.append(titleElement);
      titleWrapper.append(titleWidgetContainer);
      categoryItem.append(titleWrapper);
    }

    if (linkCell) {
      const flipBoxWrapper = document.createElement('div');
      // Original HTML has specific IDs like elementor-element-efd4785, but we omit dynamic IDs.
      flipBoxWrapper.classList.add('elementor-element', 'elementor-flip-box--effect-fade', 'elementor-widget', 'elementor-widget-flip-box');

      const flipBoxWidgetContainer = document.createElement('div');
      flipBoxWidgetContainer.classList.add('elementor-widget-container');

      const flipBox = document.createElement('div');
      flipBox.classList.add('elementor-flip-box');
      flipBox.setAttribute('tabindex', '0'); // Important for accessibility and interactivity

      const frontLayer = document.createElement('div');
      frontLayer.classList.add('elementor-flip-box__layer', 'elementor-flip-box__front');
      const frontOverlay = document.createElement('div');
      frontOverlay.classList.add('elementor-flip-box__layer__overlay');
      const frontInner = document.createElement('div');
      frontInner.classList.add('elementor-flip-box__layer__inner');
      frontOverlay.append(frontInner);
      frontLayer.append(frontOverlay);

      const backLayer = document.createElement('div');
      backLayer.classList.add('elementor-flip-box__layer', 'elementor-flip-box__back');
      const backOverlay = document.createElement('div');
      backOverlay.classList.add('elementor-flip-box__layer__overlay');
      const backInner = document.createElement('div');
      backInner.classList.add('elementor-flip-box__layer__inner');

      const originalLink = linkCell.querySelector('a');
      if (originalLink) {
        const linkButton = document.createElement('a');
        linkButton.classList.add('elementor-flip-box__button', 'elementor-button', 'elementor-size-sm');
        linkButton.href = originalLink.href;
        moveInstrumentation(originalLink, linkButton);
        linkButton.textContent = originalLink.textContent.trim() || 'Explore';
        backInner.append(linkButton);
      }

      backOverlay.append(backInner);
      backLayer.append(backOverlay);

      flipBox.append(frontLayer, backLayer);
      flipBoxWidgetContainer.append(flipBox);
      flipBoxWrapper.append(flipBoxWidgetContainer);
      categoryItem.append(flipBoxWrapper);

      // Add interactivity for the flip-box
      // The original HTML uses tabindex="0" on .elementor-flip-box, suggesting keyboard interaction.
      // We need to add event listeners for hover (mouse) and focus (keyboard) to toggle the 'elementor-flip-box--hover' class.
      flipBox.addEventListener('mouseenter', () => {
        flipBox.classList.add('elementor-flip-box--hover');
      });
      flipBox.addEventListener('mouseleave', () => {
        flipBox.classList.remove('elementor-flip-box--hover');
      });
      flipBox.addEventListener('focusin', () => {
        flipBox.classList.add('elementor-flip-box--hover');
      });
      flipBox.addEventListener('focusout', () => {
        flipBox.classList.remove('elementor-flip-box--hover');
      });
    }

    categoriesGridInner.append(categoryItem);
  });

  categoriesGrid.append(categoriesGridInner);
  innerContainer.append(categoriesGrid);
  mainContainer.append(innerContainer);

  block.textContent = '';
  block.append(mainContainer);
}
