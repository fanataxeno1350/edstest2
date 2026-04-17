import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, ...slideRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'work-with-us', 'pb-0');
  moveInstrumentation(block, section);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = titleRow.firstElementChild.textContent.trim();
  moveInstrumentation(titleRow, heading);
  sectionHeader.append(heading);
  section.append(sectionHeader);

  // Slides Container
  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');
  const container = document.createElement('div');
  container.classList.add('container');
  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');

  slideRows.forEach((row) => {
    const cells = [...row.children];

    // Use content detection instead of fixed indices for robustness
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    // Assuming imageAlt and imageTitle are always present if imageCell is, and follow it
    const imageAltCell = cells[1];
    const imageTitleCell = cells[2];
    const headingCell = cells[3];
    const descriptionCell = cells.find(cell => cell.innerHTML.includes('<p>') || cell.innerHTML.includes('<ul>')); // Richtext detection
    const buttonLinkCell = cells.find(cell => cell.querySelector('a') && cell.querySelector('a').href.startsWith('/content/')); // aem-content detection
    const buttonLabelCell = cells.find(cell => cell.textContent.trim() && !cell.querySelector('a') && cell !== headingCell && cell !== imageAltCell && cell !== imageTitleCell && cell !== descriptionCell); // Text detection for button label

    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');
    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    // Image Wrap
    if (imageCell) {
      const imageWrap = document.createElement('div');
      imageWrap.classList.add('image-wrap');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, imageAltCell?.textContent.trim() || '', false, [{ width: '750' }]);
          optimizedPic.querySelector('img').classList.add('img-fluid');
          optimizedPic.querySelector('img').alt = imageAltCell?.textContent.trim() || '';
          optimizedPic.querySelector('img').title = imageTitleCell?.textContent.trim() || '';
          moveInstrumentation(picture, optimizedPic.querySelector('img'));
          imageWrap.append(optimizedPic);
        }
      }
      wrapDiv.append(imageWrap);
    }

    // Content Wrap
    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');
    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    if (headingCell) {
      const slideHeading = document.createElement('h3');
      slideHeading.classList.add('heading', 'font-regular');
      slideHeading.textContent = headingCell.textContent.trim();
      contentSectionHeader.append(slideHeading);
    }

    if (descriptionCell) {
      const description = document.createElement('p');
      description.classList.add('text-size-body');
      description.innerHTML = descriptionCell.innerHTML; // Use innerHTML for richtext
      contentSectionHeader.append(description);
    }

    if (buttonLinkCell) { // Check if buttonLinkCell exists before querying
      const buttonLink = buttonLinkCell.querySelector('a');
      if (buttonLink) {
        const btn = document.createElement('a');
        btn.classList.add('btn', 'btn-primary', 'stretched-link');
        btn.href = buttonLink.href;
        btn.textContent = buttonLabelCell?.textContent.trim() || '';
        moveInstrumentation(buttonLinkCell, btn);
        contentSectionHeader.append(btn);
      }
    }
    contentWrap.append(contentSectionHeader);
    wrapDiv.append(contentWrap);
    slideDiv.append(wrapDiv);
    gridLayout.append(slideDiv);
    moveInstrumentation(row, slideDiv);
  });

  container.append(gridLayout);
  positionRelativeDiv.append(container);
  section.append(positionRelativeDiv);

  block.replaceWith(section);
}
