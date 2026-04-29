import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  const sectionHeadingRow = rows.shift(); // First row is the section heading

  const section = document.createElement('section');
  section.classList.add('section', 'work-with-us', 'pb-0');
  moveInstrumentation(block, section);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = sectionHeadingRow.firstElementChild.textContent.trim();
  moveInstrumentation(sectionHeadingRow.firstElementChild, heading);
  sectionHeader.append(heading);
  section.append(sectionHeader);

  // Slides Container
  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');

  const container = document.createElement('div');
  container.classList.add('container');

  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');

  rows.forEach((row) => {
    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    const cells = [...row.children];

    // Use content detection instead of index access
    const imageCell = cells.find((cell) => cell.querySelector('picture'));
    const linkCell = cells.find((cell) => cell.querySelector('a'));
    const titleCell = cells.find((cell) => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim().length > 0);
    const descriptionCell = cells.find((cell) => cell !== imageCell && cell !== linkCell && cell !== titleCell && cell.textContent.trim().length > 0);
    const altTextCell = cells.find((cell) => cell !== imageCell && cell !== linkCell && cell !== titleCell && cell !== descriptionCell && cell.textContent.trim().length > 0);


    // Image Wrap
    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const imageWrap = document.createElement('div');
        imageWrap.classList.add('image-wrap');
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, altTextCell ? altTextCell.textContent.trim() : '', false, [{ width: '750' }]);
          optimizedPic.querySelector('img').classList.add('img-fluid');
          moveInstrumentation(picture, optimizedPic.querySelector('img'));
          imageWrap.append(optimizedPic);
        }
        wrapDiv.append(imageWrap);
      }
    }

    // Content Wrap
    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    if (titleCell) {
      const slideTitle = document.createElement('h3');
      slideTitle.classList.add('heading', 'font-regular');
      slideTitle.textContent = titleCell.textContent.trim();
      moveInstrumentation(titleCell, slideTitle);
      contentSectionHeader.append(slideTitle);
    }

    if (descriptionCell) {
      const slideDescription = document.createElement('p');
      slideDescription.classList.add('text-size-body');
      slideDescription.textContent = descriptionCell.textContent.trim();
      moveInstrumentation(descriptionCell, slideDescription);
      contentSectionHeader.append(slideDescription);
    }

    if (linkCell) {
      const link = linkCell.querySelector('a');
      if (link && link.href) { // Ensure link and href exist
        const slideLink = document.createElement('a');
        slideLink.classList.add('btn', 'btn-primary', 'stretched-link');
        slideLink.href = link.href; // Read href directly from the <a> tag
        slideLink.textContent = 'Learn More'; // Default text, adjust if label field exists
        moveInstrumentation(linkCell, slideLink);
        contentSectionHeader.append(slideLink);
      }
    }

    contentWrap.append(contentSectionHeader);
    wrapDiv.append(contentWrap);
    slideDiv.append(wrapDiv);
    gridLayout.append(slideDiv);
  });

  container.append(gridLayout);
  positionRelativeDiv.append(container);
  section.append(positionRelativeDiv);

  block.replaceWith(section);
}
