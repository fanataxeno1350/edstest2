import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...slideRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'work-with-us', 'pb-0');
  moveInstrumentation(block, section);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // CRITICAL FIX: Replaced row.children[0] with content detection
  const headingCell = [...headingRow.children].find(cell => cell.textContent.trim());
  if (headingCell) {
    heading.textContent = headingCell.textContent.trim();
    moveInstrumentation(headingCell, heading);
  }
  sectionHeader.appendChild(heading);
  section.appendChild(sectionHeader);

  // Slides Container
  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const gridLayoutDiv = document.createElement('div');
  gridLayoutDiv.classList.add('grid-layout');

  slideRows.forEach((row) => {
    // CRITICAL FIX: Destructuring is correct here as per EDS Block Structure for fixed-field item models.
    const [imageCell, imageAltCell, imageTitleCell, titleCell, descriptionCell, linkCell, linkLabelCell] = [...row.children];

    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    // Image Wrap
    const imageWrapDiv = document.createElement('div');
    imageWrapDiv.classList.add('image-wrap');
    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, imageAltCell?.textContent.trim() || img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.querySelector('img').classList.add('img-fluid');
        optimizedPic.querySelector('img').title = imageTitleCell?.textContent.trim() || '';
        imageWrapDiv.appendChild(optimizedPic);
      }
    }
    moveInstrumentation(imageCell, imageWrapDiv);
    if (imageWrapDiv.children.length > 0) { // Only append if there's an image
      wrapDiv.appendChild(imageWrapDiv);
    }


    // Content Wrap
    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const title = document.createElement('h3');
    title.classList.add('heading', 'font-regular');
    if (titleCell) {
      title.textContent = titleCell.textContent.trim();
      moveInstrumentation(titleCell, title);
    }
    contentSectionHeader.appendChild(title);

    const description = document.createElement('p');
    description.classList.add('text-size-body');
    if (descriptionCell) {
      description.textContent = descriptionCell.textContent.trim();
      moveInstrumentation(descriptionCell, description);
    }
    contentSectionHeader.appendChild(description);

    const link = document.createElement('a');
    link.classList.add('btn', 'btn-primary', 'stretched-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      // CRITICAL FIX: Use getAttribute('href') for aem-content type to ensure it's a string
      link.href = foundLink.getAttribute('href') || '';
    }
    if (linkLabelCell) {
      link.textContent = linkLabelCell.textContent.trim();
      moveInstrumentation(linkLabelCell, link);
    }
    moveInstrumentation(linkCell, link); // Instrumentation for the link cell itself
    contentSectionHeader.appendChild(link);

    contentWrapDiv.appendChild(contentSectionHeader);
    wrapDiv.appendChild(contentWrapDiv);
    slideDiv.appendChild(wrapDiv);
    gridLayoutDiv.appendChild(slideDiv);
    moveInstrumentation(row, slideDiv);
  });

  containerDiv.appendChild(gridLayoutDiv);
  positionRelativeDiv.appendChild(containerDiv);
  section.appendChild(positionRelativeDiv);

  block.replaceWith(section);
}
