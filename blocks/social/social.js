import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    titleRow,
    subtitleRow,
    buttonLinkRow,
    buttonLabelRow,
    ...cardRows
  ] = [...block.children];

  block.innerHTML = '';
  block.classList.add('cmp-social');

  // Title and Subtitle container
  const titleContainer = document.createElement('div');
  titleContainer.classList.add('cmp-social__title-container');
  block.append(titleContainer);

  // Title
  if (titleRow) {
    const titleWrapper = document.createElement('div');
    titleWrapper.classList.add('title', 'cmp-social__title');
    const cmpTitle = document.createElement('div');
    cmpTitle.classList.add('cmp-title');
    const h2 = document.createElement('h2');
    h2.classList.add('cmp-title__text');
    moveInstrumentation(titleRow.firstElementChild, h2);
    h2.textContent = titleRow.firstElementChild.textContent.trim();
    cmpTitle.append(h2);
    titleWrapper.append(cmpTitle);
    titleContainer.append(titleWrapper);
  }

  // Subtitle
  if (subtitleRow) {
    const subtitleWrapper = document.createElement('div');
    subtitleWrapper.classList.add('text', 'cmp-social__sub-title', 'body-3');
    const cmpText = document.createElement('div');
    cmpText.classList.add('cmp-text');
    moveInstrumentation(subtitleRow.firstElementChild, cmpText);
    cmpText.innerHTML = subtitleRow.firstElementChild.innerHTML;
    subtitleWrapper.append(cmpText);
    titleContainer.append(subtitleWrapper);
  }

  // Card container
  if (cardRows.length > 0) {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('cmp-social__card-container', 'cmp-social__card-container--anchor');
    block.append(cardContainer);

    // Group cards into columns (assuming 5 columns based on original HTML)
    const numColumns = 5;
    const columns = Array.from({ length: numColumns }, () => {
      const col = document.createElement('div');
      col.classList.add('cmp-social__card-column');
      return col;
    });

    cardRows.forEach((row, index) => {
      // VIOLATION FIXED: Replaced row.children[n] with content detection
      const cells = [...row.children];
      const imageCell = cells.find(cell => cell.querySelector('picture'));
      const linkCell = cells.find(cell => cell.querySelector('a'));

      const linkEl = document.createElement('a');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        linkEl.href = foundLink.href;
      }

      const picture = imageCell?.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        linkEl.append(optimizedPic);
      }
      moveInstrumentation(row, linkEl);
      columns[index % numColumns].append(linkEl);
    });

    columns.forEach((col) => cardContainer.append(col));
  }

  // Button
  if (buttonLinkRow && buttonLabelRow) {
    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('socialButton', 'button', 'cmp-button--primary-anchor');

    const buttonLink = document.createElement('a');
    buttonLink.classList.add('cmp-button');
    const foundButtonLink = buttonLinkRow.querySelector('a');
    if (foundButtonLink) {
      buttonLink.href = foundButtonLink.href;
      buttonLink.setAttribute('target', '_blank'); // Assuming target blank from original HTML
    }

    const buttonTextSpan = document.createElement('span');
    buttonTextSpan.classList.add('cmp-button__text');
    moveInstrumentation(buttonLabelRow.firstElementChild, buttonTextSpan);
    buttonTextSpan.textContent = buttonLabelRow.firstElementChild.textContent.trim();

    buttonLink.append(buttonTextSpan);
    moveInstrumentation(buttonLinkRow, buttonLink); // Move instrumentation from buttonLinkRow
    buttonWrapper.append(buttonLink);
    block.append(buttonWrapper);
  }

  // Gradient
  const gradientDiv = document.createElement('div');
  gradientDiv.classList.add('cmp-social__gradient');
  block.append(gradientDiv);
}
