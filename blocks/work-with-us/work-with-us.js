import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [sectionHeadingRow, ...itemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'work-with-us', 'pb-0');
  moveInstrumentation(block, section);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular');
  moveInstrumentation(sectionHeadingRow, heading);
  heading.textContent = sectionHeadingRow.textContent.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

  // Main content wrapper
  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const gridLayoutDiv = document.createElement('div');
  gridLayoutDiv.classList.add('grid-layout');

  const slidesDiv = document.createElement('div');
  slidesDiv.classList.add('slides');

  itemRows.forEach((row) => {
    const [
      imageMobile576Cell,
      imageMobile799Cell,
      imageDesktopCell,
      slideHeadingCell,
      slideDescriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');
    moveInstrumentation(row, wrapDiv);

    // Image Wrap
    const imageWrapDiv = document.createElement('div');
    imageWrapDiv.classList.add('image-wrap');

    // Create a temporary picture element to hold all sources and img
    const tempPicture = document.createElement('picture');

    const source576 = document.createElement('source');
    source576.media = '(max-width: 576px)';
    source576.srcset = imageMobile576Cell.querySelector('img')?.src || '';
    tempPicture.append(source576);

    const source799 = document.createElement('source');
    source799.media = '(max-width: 799px)';
    source799.srcset = imageMobile799Cell.querySelector('img')?.src || '';
    tempPicture.append(source799);

    const img = document.createElement('img');
    img.classList.add('img-fluid');
    img.src = imageDesktopCell.querySelector('img')?.src || '';
    img.alt = imageDesktopCell.querySelector('img')?.alt || '';
    img.title = imageDesktopCell.querySelector('img')?.title || '';
    img.loading = 'lazy';
    tempPicture.append(img);

    // Use createOptimizedPicture with the full picture element
    const optimizedPicture = createOptimizedPicture(
      tempPicture.querySelector('img').src, // main image src
      tempPicture.querySelector('img').alt, // main image alt
      false, // eager loading
      [
        { media: '(max-width: 576px)', width: '576', srcset: source576.srcset },
        { media: '(max-width: 799px)', width: '799', srcset: source799.srcset },
        { width: '750' }, // default desktop size
      ],
      tempPicture, // Pass the original picture element to preserve sources
    );

    imageWrapDiv.append(optimizedPicture);
    wrapDiv.append(imageWrapDiv);

    // Content Wrap
    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const slideHeading = document.createElement('h3');
    slideHeading.classList.add('heading', 'font-regular');
    slideHeading.textContent = slideHeadingCell.textContent.trim();
    contentSectionHeader.append(slideHeading);

    const slideDescription = document.createElement('p');
    slideDescription.classList.add('text-size-body');
    slideDescription.innerHTML = slideDescriptionCell.innerHTML;
    contentSectionHeader.append(slideDescription);

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
    const foundLink = ctaLinkCell.querySelector('a');
    if (foundLink) {
      ctaLink.href = foundLink.href;
    }
    ctaLink.textContent = ctaLabelCell.textContent.trim();
    contentSectionHeader.append(ctaLink);

    contentWrapDiv.append(contentSectionHeader);
    wrapDiv.append(contentWrapDiv);

    slidesDiv.append(wrapDiv);
  });

  gridLayoutDiv.append(slidesDiv);
  containerDiv.append(gridLayoutDiv);
  positionRelativeDiv.append(containerDiv);
  section.append(positionRelativeDiv);

  block.replaceChildren(section);

  // The createOptimizedPicture call within the loop already handles optimization.
  // This block.querySelectorAll('picture > img').forEach is no longer needed.
}
