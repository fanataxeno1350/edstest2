import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    titleRow,
    subtitleRow,
    buttonLabelRow,
    buttonLinkRow,
    ...itemRows
  ] = [...block.children];

  const socialComponent = document.createElement('div');
  socialComponent.classList.add('cmp-social');
  moveInstrumentation(block, socialComponent);

  // Title and Subtitle
  const titleContainer = document.createElement('div');
  titleContainer.classList.add('cmp-social__title-container');

  const titleDiv = document.createElement('div');
  titleDiv.classList.add('title', 'cmp-social__title');
  const cmpTitle = document.createElement('div');
  cmpTitle.classList.add('cmp-title');
  const h2 = document.createElement('h2');
  h2.classList.add('cmp-title__text');
  h2.textContent = titleRow?.firstElementChild?.textContent.trim() || '';
  moveInstrumentation(titleRow, h2);
  cmpTitle.appendChild(h2);
  titleDiv.appendChild(cmpTitle);
  titleContainer.appendChild(titleDiv);

  const subtitleDiv = document.createElement('div');
  subtitleDiv.classList.add('text', 'cmp-social__sub-title', 'body-3');
  const cmpText = document.createElement('div');
  cmpText.classList.add('cmp-text');
  cmpText.innerHTML = subtitleRow?.firstElementChild?.innerHTML || '';
  moveInstrumentation(subtitleRow, cmpText);
  subtitleDiv.appendChild(cmpText);
  titleContainer.appendChild(subtitleDiv);

  socialComponent.appendChild(titleContainer);

  // Card Container
  const cardContainer = document.createElement('div');
  cardContainer.classList.add('cmp-social__card-container', 'cmp-social__card-container--anchor');

  // Create columns and distribute cards
  const columns = Array.from({ length: 5 }, () => {
    const column = document.createElement('div');
    column.classList.add('cmp-social__card-column');
    return column;
  });

  itemRows.forEach((row, index) => {
    const cells = [...row.children];
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '100%' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        anchor.appendChild(optimizedPic);
      }
    }
    moveInstrumentation(row, anchor);
    columns[index % columns.length].appendChild(anchor);
  });

  columns.forEach((column) => cardContainer.appendChild(column));
  socialComponent.appendChild(cardContainer);

  // Button
  const socialButtonDiv = document.createElement('div');
  socialButtonDiv.classList.add('socialButton', 'button', 'cmp-button--primary-anchor');

  const buttonAnchor = document.createElement('a');
  buttonAnchor.classList.add('cmp-button');
  buttonAnchor.setAttribute('data-request', 'true');
  buttonAnchor.setAttribute('target', '_blank');

  const foundButtonLink = buttonLinkRow?.querySelector('a');
  if (foundButtonLink) {
    buttonAnchor.href = foundButtonLink.href;
  }

  const buttonSpan = document.createElement('span');
  buttonSpan.classList.add('cmp-button__text');
  buttonSpan.textContent = buttonLabelRow?.firstElementChild?.textContent.trim() || '';
  moveInstrumentation(buttonLabelRow, buttonSpan);
  buttonAnchor.appendChild(buttonSpan);
  moveInstrumentation(buttonLinkRow, buttonAnchor);
  socialButtonDiv.appendChild(buttonAnchor);
  socialComponent.appendChild(socialButtonDiv);

  // Gradient
  const gradientDiv = document.createElement('div');
  gradientDiv.classList.add('cmp-social__gradient');
  socialComponent.appendChild(gradientDiv);

  block.textContent = '';
  block.appendChild(socialComponent);
}
