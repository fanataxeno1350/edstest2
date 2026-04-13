import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...itemRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  while (headingRow.firstElementChild) heading.append(headingRow.firstElementChild);
  sectionHeader.append(heading);

  const positionRelative = document.createElement('div');
  positionRelative.classList.add('position-relative', 'aos-init', 'aos-animate');

  const container = document.createElement('div');
  container.classList.add('container');

  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');

  itemRows.forEach((row) => {
    const slides = document.createElement('div');
    slides.classList.add('slides');
    moveInstrumentation(row, slides);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    let imageCell;
    let titleCell;
    let descriptionCell;
    let ctaLinkCell;

    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture')) {
        imageCell = cell;
      } else if (cell.querySelector('a')) {
        ctaLinkCell = cell;
      } else if (cell.textContent.trim() !== '' && !titleCell) { // First non-empty text cell is title
        titleCell = cell;
      } else if (cell.textContent.trim() !== '') { // Second non-empty text cell is description
        descriptionCell = cell;
      }
    });

    if (imageCell) {
      const imageWrap = document.createElement('div');
      imageWrap.classList.add('image-wrap');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          picture.replaceWith(optimizedPic);
          optimizedPic.querySelector('img').classList.add('img-fluid');
          imageWrap.append(optimizedPic);
        }
      }
      wrap.append(imageWrap);
    }

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const innerSectionHeader = document.createElement('div');
    innerSectionHeader.classList.add('section-header');

    if (titleCell) {
      const title = document.createElement('h3');
      title.classList.add('heading', 'font-regular');
      moveInstrumentation(titleCell, title);
      while (titleCell.firstChild) title.append(titleCell.firstChild);
      innerSectionHeader.append(title);
    }

    if (descriptionCell) {
      const description = document.createElement('p');
      description.classList.add('text-size-body');
      moveInstrumentation(descriptionCell, description);
      while (descriptionCell.firstChild) description.append(descriptionCell.firstChild);
      innerSectionHeader.append(description);
    }

    if (ctaLinkCell) {
      const ctaLink = document.createElement('a');
      ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
      const originalLink = ctaLinkCell.querySelector('a');
      if (originalLink) {
        ctaLink.href = originalLink.href;
        ctaLink.textContent = originalLink.textContent;
      }
      moveInstrumentation(ctaLinkCell, ctaLink);
      innerSectionHeader.append(ctaLink);
    }

    contentWrap.append(innerSectionHeader);
    wrap.append(contentWrap);
    slides.append(wrap);
    gridLayout.append(slides);
  });

  container.append(gridLayout);
  positionRelative.append(container);

  block.textContent = '';
  block.classList.add('pb-0'); // Add section classes to block itself as it's the root element
  block.append(sectionHeader, positionRelative);
}
