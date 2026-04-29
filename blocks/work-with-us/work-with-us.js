import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...slideRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular');
  heading.textContent = headingRow.firstElementChild.textContent.trim();
  sectionHeader.append(heading);

  const positionRelative = document.createElement('div');
  positionRelative.classList.add('position-relative');

  const container = document.createElement('div');
  container.classList.add('container');

  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');

  slideRows.forEach((row) => {
    const [imageCell, titleCell, descriptionCell, linkCell] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('slides');
    moveInstrumentation(row, slide);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    // Image
    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        picture.replaceWith(optimizedPic);
      }
      imageWrap.append(picture);
    }
    wrap.append(imageWrap);

    // Content
    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const title = document.createElement('h3');
    title.classList.add('heading', 'font-regular');
    title.textContent = titleCell.textContent.trim();
    contentSectionHeader.append(title);

    const description = document.createElement('p');
    description.classList.add('text-size-body');
    description.textContent = descriptionCell.textContent.trim();
    contentSectionHeader.append(description);

    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.textContent = foundLink.textContent.trim(); // Use the actual link text from the cell
      moveInstrumentation(foundLink, link); // Move instrumentation from the original link
    } else {
      // Fallback if no link found, though model expects one
      link.textContent = 'Learn More';
    }
    link.classList.add('btn', 'btn-primary', 'stretched-link');
    contentSectionHeader.append(link);

    contentWrap.append(contentSectionHeader);
    wrap.append(contentWrap);
    slide.append(wrap);
    gridLayout.append(slide);
  });

  container.append(gridLayout);
  positionRelative.append(container);

  block.innerHTML = '';
  block.classList.add('section', 'pb-0'); // Add section and pb-0 classes to the block itself
  block.append(sectionHeader, positionRelative);
}
