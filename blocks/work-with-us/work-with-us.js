import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const sectionHeaderDiv = document.createElement('div');
  sectionHeaderDiv.classList.add('section-header', 'text-center');

  const headingRow = children.shift();
  if (headingRow) {
    const headingCell = headingRow.querySelector('div');
    if (headingCell) {
      const heading = document.createElement('h2');
      heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
      heading.textContent = headingCell.textContent.trim();
      moveInstrumentation(headingRow, heading);
      sectionHeaderDiv.appendChild(heading);
    }
  }

  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const gridLayoutDiv = document.createElement('div');
  gridLayoutDiv.classList.add('grid-layout');

  children.forEach((row) => {
    const [imageCell, altTextCell, titleCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const slidesDiv = document.createElement('div');
    slidesDiv.classList.add('slides');

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    const imageWrapDiv = document.createElement('div');
    imageWrapDiv.classList.add('image-wrap');

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, altTextCell?.textContent.trim() || img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageWrapDiv.appendChild(optimizedPic);
        optimizedPic.querySelector('img').classList.add('img-fluid');
      }
    }
    wrapDiv.appendChild(imageWrapDiv);

    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');

    const cardSectionHeaderDiv = document.createElement('div');
    cardSectionHeaderDiv.classList.add('section-header');

    const cardTitle = document.createElement('h3');
    cardTitle.classList.add('heading', 'font-regular');
    cardTitle.textContent = titleCell?.textContent.trim() || '';
    cardSectionHeaderDiv.appendChild(cardTitle);

    const description = document.createElement('p');
    description.classList.add('text-size-body');
    description.textContent = descriptionCell?.textContent.trim() || '';
    cardSectionHeaderDiv.appendChild(description);

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
    const foundLink = ctaLinkCell?.querySelector('a');
    if (foundLink) {
      ctaLink.href = foundLink.href;
    }
    ctaLink.textContent = ctaLabelCell?.textContent.trim() || '';
    cardSectionHeaderDiv.appendChild(ctaLink);

    contentWrapDiv.appendChild(cardSectionHeaderDiv);
    wrapDiv.appendChild(contentWrapDiv);
    slidesDiv.appendChild(wrapDiv);
    gridLayoutDiv.appendChild(slidesDiv);
    moveInstrumentation(row, slidesDiv);
  });

  containerDiv.appendChild(gridLayoutDiv);
  positionRelativeDiv.appendChild(containerDiv);

  block.innerHTML = '';
  block.classList.add('section', 'work-with-us', 'pb-0');
  block.appendChild(sectionHeaderDiv);
  block.appendChild(positionRelativeDiv);
}
