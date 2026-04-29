import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const headingRow = children.shift();
  if (headingRow) {
    const headingCell = headingRow.querySelector('div');
    if (headingCell) {
      const heading = document.createElement('h2');
      heading.classList.add('heading', 'font-regular');
      heading.textContent = headingCell.textContent.trim();
      moveInstrumentation(headingRow, heading);
      sectionHeader.appendChild(heading);
    }
  }

  const positionRelative = document.createElement('div');
  positionRelative.classList.add('position-relative');

  const container = document.createElement('div');
  container.classList.add('container');
  positionRelative.appendChild(container);

  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');
  container.appendChild(gridLayout);

  children.forEach((row) => {
    const slide = document.createElement('div');
    slide.classList.add('slides');

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');
    slide.appendChild(wrap);

    // Destructure cells for work-with-us-slide item rows
    const [imageCell, altTextCell, titleCell, descriptionCell, linkCell, linkLabelCell] = [...row.children];

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const imageWrap = document.createElement('div');
      imageWrap.classList.add('image-wrap');
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, altTextCell?.textContent.trim() || '', false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageWrap.appendChild(optimizedPic);
      }
      wrap.appendChild(imageWrap);
    }

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');
    wrap.appendChild(contentWrap);

    const slideHeader = document.createElement('div');
    slideHeader.classList.add('section-header');
    contentWrap.appendChild(slideHeader);

    const title = document.createElement('h3');
    title.classList.add('heading', 'font-regular');
    title.textContent = titleCell?.textContent.trim() || '';
    slideHeader.appendChild(title);

    const description = document.createElement('p');
    description.classList.add('text-size-body');
    description.textContent = descriptionCell?.textContent.trim() || '';
    slideHeader.appendChild(description);

    const link = linkCell?.querySelector('a');
    if (link) {
      const linkElement = document.createElement('a');
      linkElement.href = link.href; // Correctly read the href attribute
      linkElement.classList.add('btn', 'btn-primary', 'stretched-link');
      linkElement.textContent = linkLabelCell?.textContent.trim() || '';
      moveInstrumentation(link, linkElement);
      slideHeader.appendChild(linkElement);
    }

    moveInstrumentation(row, slide);
    gridLayout.appendChild(slide);
  });

  block.innerHTML = '';
  block.classList.add('section', 'pb-0');
  block.appendChild(sectionHeader);
  block.appendChild(positionRelative);
}
