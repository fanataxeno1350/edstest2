import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...slideRows] = [...block.children];

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.firstElementChild?.textContent.trim() || '';
  sectionHeader.appendChild(heading);

  block.innerHTML = ''; // Clear block content
  block.classList.add('pb-0'); // Add section class from original HTML

  const sectionWrapper = document.createElement('div');
  sectionWrapper.classList.add('position-relative', 'aos-init', 'aos-animate');

  const container = document.createElement('div');
  container.classList.add('container');

  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');

  slideRows.forEach((row) => {
    // All cells are present and in a fixed order, so destructuring is appropriate.
    const [
      imageCell,
      imageAltCell,
      imageTitleCell, // Not used in current rendering logic, but read for completeness
      slideHeadingCell,
      descriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');
    moveInstrumentation(row, slideDiv);

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    // Image
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const imageWrap = document.createElement('div');
      imageWrap.classList.add('image-wrap');

      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(
          img.src,
          imageAltCell?.textContent.trim() || img.alt,
          false,
          [{ width: '750' }],
        );
        // The original img element might have instrumentation, move it to the new img
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageWrap.appendChild(optimizedPic);
        wrapDiv.appendChild(imageWrap);
      }
    }

    // Content
    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const slideHeading = document.createElement('h3');
    slideHeading.classList.add('heading', 'font-regular');
    slideHeading.textContent = slideHeadingCell?.textContent.trim() || '';
    contentSectionHeader.appendChild(slideHeading);

    const description = document.createElement('p');
    description.classList.add('text-size-body');
    description.textContent = descriptionCell?.textContent.trim() || '';
    contentSectionHeader.appendChild(description);

    // CTA Link - Correctly read href from the <a> tag within the aem-content cell
    const ctaLinkElement = ctaLinkCell.querySelector('a');
    if (ctaLinkElement) {
      const ctaAnchor = document.createElement('a');
      ctaAnchor.classList.add('btn', 'btn-primary', 'stretched-link');
      ctaAnchor.href = ctaLinkElement.href; // Read href, not textContent
      ctaAnchor.textContent = ctaLabelCell?.textContent.trim() || '';
      contentSectionHeader.appendChild(ctaAnchor);
    }

    contentWrap.appendChild(contentSectionHeader);
    wrapDiv.appendChild(contentWrap);
    slideDiv.appendChild(wrapDiv);
    gridLayout.appendChild(slideDiv);
  });

  container.appendChild(gridLayout);
  sectionWrapper.appendChild(container);

  block.appendChild(sectionHeader);
  block.appendChild(sectionWrapper);
}
