import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const headingRow = children.shift(); // First row is the heading
  if (headingRow) {
    const headingCell = headingRow.querySelector('div');
    if (headingCell) {
      const heading = document.createElement('h2');
      heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
      heading.textContent = headingCell.textContent.trim();
      sectionHeader.append(heading);
      moveInstrumentation(headingRow, heading);
    }
  }
  block.prepend(sectionHeader);

  const positionRelative = document.createElement('div');
  positionRelative.classList.add('position-relative', 'aos-init', 'aos-animate');

  const container = document.createElement('div');
  container.classList.add('container');
  positionRelative.append(container);

  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');
  container.append(gridLayout);

  children.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 6) { // This is a work-with-us-slide item row
      const [imageCell, imageAltCell, titleCell, descriptionCell, linkCell, linkLabelCell] = cells;

      const slide = document.createElement('div');
      slide.classList.add('slides');

      const wrap = document.createElement('div');
      wrap.classList.add('wrap');
      slide.append(wrap);

      const picture = imageCell.querySelector('picture');
      if (picture) {
        const imageWrap = document.createElement('div');
        imageWrap.classList.add('image-wrap');
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, imageAltCell.textContent.trim(), false, [{ width: '750' }]);
          moveInstrumentation(picture, optimizedPic.querySelector('img'));
          imageWrap.append(optimizedPic);
        }
        wrap.append(imageWrap);
      }

      const contentWrap = document.createElement('div');
      contentWrap.classList.add('content-wrap');
      wrap.append(contentWrap);

      const slideSectionHeader = document.createElement('div');
      slideSectionHeader.classList.add('section-header');
      contentWrap.append(slideSectionHeader);

      const title = document.createElement('h3');
      title.classList.add('heading', 'font-regular');
      title.textContent = titleCell.textContent.trim();
      slideSectionHeader.append(title);

      const description = document.createElement('p');
      description.classList.add('text-size-body');
      description.textContent = descriptionCell.textContent.trim();
      slideSectionHeader.append(description);

      const link = linkCell.querySelector('a');
      if (link) {
        const button = document.createElement('a');
        button.classList.add('btn', 'btn-primary', 'stretched-link');
        button.href = link.href; // Corrected: read href from the anchor tag
        button.textContent = linkLabelCell.textContent.trim();
        slideSectionHeader.append(button);
      }
      moveInstrumentation(row, slide);
      gridLayout.append(slide);
    }
  });

  block.append(positionRelative);
}
