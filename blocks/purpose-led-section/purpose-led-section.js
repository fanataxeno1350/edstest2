import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  // The outer block div already has the block name class 'purpose-led-section'.
  // The 'section' class is from the ORIGINAL HTML and should be added here.
  // 'grey-bg' and 'spirit-of-rise' are also from ORIGINAL HTML.
  section.classList.add('grey-bg', 'spirit-of-rise'); // Removed 'section' as it's a generic tag name, not a block-specific class here.

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  container.append(sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const subheading = document.createElement('p');
  subheading.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(subheadingRow, subheading);
  subheading.textContent = subheadingRow.textContent.trim();
  sectionHeader.append(subheading);

  // Purpose Led Grid
  const purposeLedGrid = document.createElement('div');
  purposeLedGrid.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');
  container.append(purposeLedGrid);

  cardRows.forEach((row) => {
    const [imageMobileCell, imageDesktopCell, linkCell, descriptionCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-md-6', 'aos-init', 'aos-animate');
    moveInstrumentation(row, col);

    const cardLink = document.createElement('a');
    cardLink.classList.add('card-wrap');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      // Check ORIGINAL HTML for target attribute. It has target="_blank".
      cardLink.target = '_blank';
    }
    col.append(cardLink);

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    cardLink.append(cardImage);

    const picture = document.createElement('picture');
    const mobileImg = imageMobileCell.querySelector('img');
    const desktopImg = imageDesktopCell.querySelector('img');

    if (mobileImg) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      sourceMobile.srcset = mobileImg.src;
      picture.append(sourceMobile);
    }

    if (desktopImg) {
      // createOptimizedPicture returns a <picture> element.
      // We need to append the <img> element from within it.
      // Also, add 'img-fluid' class from ORIGINAL HTML.
      const optimizedPicture = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
      const imgElement = optimizedPicture.querySelector('img');
      if (imgElement) {
        imgElement.classList.add('img-fluid'); // Add img-fluid class from ORIGINAL HTML
        moveInstrumentation(desktopImg, imgElement);
        picture.append(imgElement);
      }
    }
    cardImage.append(picture);

    const cardText = document.createElement('div');
    cardText.classList.add('card-text');
    cardLink.append(cardText);

    const description = document.createElement('p');
    description.classList.add('desc');
    // descriptionCell is a richtext field, so innerHTML is correct.
    description.innerHTML = descriptionCell.innerHTML;
    cardText.append(description);

    purposeLedGrid.append(col);
  });

  block.replaceChildren(section);
}
