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
  heading.textContent = headingRow.firstElementChild.textContent.trim();
  moveInstrumentation(headingRow.firstElementChild, heading);
  sectionHeader.append(heading);
  section.append(sectionHeader);
  headingRow.remove(); // Remove the original heading row

  // Slides Container
  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');

  const container = document.createElement('div');
  container.classList.add('container');

  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');

  slideRows.forEach((row) => {
    const [imageCell, titleCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    // Image
    if (imageCell && imageCell.querySelector('picture')) {
      const imageWrapDiv = document.createElement('div');
      imageWrapDiv.classList.add('image-wrap');
      const picture = imageCell.querySelector('picture');
      const img = picture ? picture.querySelector('img') : null;
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        picture.replaceWith(optimizedPic);
        optimizedPic.querySelector('img').classList.add('img-fluid');
      }
      moveInstrumentation(imageCell, imageWrapDiv);
      imageWrapDiv.append(imageCell.firstElementChild);
      wrapDiv.append(imageWrapDiv);
    }

    // Content
    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const title = document.createElement('h3');
    title.classList.add('heading', 'font-regular');
    title.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, title);
    contentSectionHeader.append(title);

    const description = document.createElement('p');
    description.classList.add('text-size-body');
    description.textContent = descriptionCell.textContent.trim();
    moveInstrumentation(descriptionCell, description);
    contentSectionHeader.append(description);

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
    const foundLink = ctaLinkCell.querySelector('a');
    if (foundLink) {
      ctaLink.href = foundLink.href; // Corrected: use href directly from the found <a> tag
    }
    ctaLink.textContent = ctaLabelCell.textContent.trim();
    moveInstrumentation(ctaLinkCell, ctaLink);
    moveInstrumentation(ctaLabelCell, ctaLink);
    contentSectionHeader.append(ctaLink);

    contentWrapDiv.append(contentSectionHeader);
    wrapDiv.append(contentWrapDiv);
    slideDiv.append(wrapDiv);
    gridLayout.append(slideDiv);
    row.remove(); // Remove the original slide row
  });

  container.append(gridLayout);
  positionRelativeDiv.append(container);
  section.append(positionRelativeDiv);

  block.replaceWith(section);
}
