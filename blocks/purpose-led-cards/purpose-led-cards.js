import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);
  container.append(sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  const [headingCell] = [...headingRow.children]; // Destructuring for fixed schema
  heading.textContent = headingCell?.textContent.trim() || '';
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  const [descriptionCell] = [...descriptionRow.children]; // Destructuring for fixed schema
  description.textContent = descriptionCell?.textContent.trim() || '';
  sectionHeader.append(description);

  // Cards Grid
  const grid = document.createElement('div');
  grid.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');
  container.append(grid);

  cardRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, imageAltCell, cardDescriptionCell, cardLinkCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-md-6', 'aos-init', 'aos-animate');
    moveInstrumentation(row, col);
    grid.append(col);

    const cardLink = document.createElement('a');
    cardLink.classList.add('card-wrap');
    const foundLink = cardLinkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // Assuming target blank from original HTML
    }
    col.append(cardLink);

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image');
    cardLink.append(cardImageDiv);

    const picture = document.createElement('picture');
    const desktopImg = imageDesktopCell.querySelector('img');
    const mobileImg = imageMobileCell.querySelector('img');
    const altText = imageAltCell.textContent.trim();

    if (mobileImg) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      sourceMobile.srcset = mobileImg.src;
      picture.append(sourceMobile);
    }

    if (desktopImg) {
      const img = createOptimizedPicture(desktopImg.src, altText, false, [{ width: '750' }]).querySelector('img');
      img.classList.add('img-fluid');
      picture.append(img);
    }
    cardImageDiv.append(picture);

    const cardTextDiv = document.createElement('div');
    cardTextDiv.classList.add('card-text');
    cardLink.append(cardTextDiv);

    const cardDescription = document.createElement('p');
    cardDescription.classList.add('desc');
    cardDescription.innerHTML = cardDescriptionCell?.innerHTML || '';
    cardTextDiv.append(cardDescription);
  });

  block.replaceChildren(section);

  // The original block.querySelectorAll('picture > img').forEach... loop is redundant
  // because createOptimizedPicture is already used when creating the images.
  // It would re-optimize images that are already optimized and potentially
  // interfere with instrumentation. Removed.
}
