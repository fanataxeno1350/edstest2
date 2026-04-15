import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, ...itemRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(titleRow, sectionHeader);

  const titleHeading = document.createElement('h2');
  titleHeading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  titleHeading.textContent = titleRow.querySelector('div')?.textContent.trim() || '';
  sectionHeader.append(titleHeading);

  const positionRelative = document.createElement('div');
  positionRelative.classList.add('position-relative', 'aos-init', 'aos-animate');

  const container = document.createElement('div');
  container.classList.add('container');

  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');

  itemRows.forEach((row) => {
    const cells = [...row.children];
    // Use content detection for robust cell parsing, especially for image and CTA link
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const imageAltCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim().toLowerCase().includes('alt text'));
    const imageTitleCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim().toLowerCase().includes('title text'));
    const headingCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim().toLowerCase().includes('heading'));
    const descriptionCell = cells.find(cell => cell.innerHTML.includes('<p>') || cell.innerHTML.includes('<ul>')); // Detect richtext
    const ctaLinkCell = cells.find(cell => cell.querySelector('a') && cell.querySelector('a').href.includes('/content/site/')); // Detect aem-content link
    const ctaLabelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim().toLowerCase().includes('label'));

    const slides = document.createElement('div');
    slides.classList.add('slides');

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, imageAltCell?.textContent.trim() || '', false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          imageWrap.append(optimizedPic);
          optimizedPic.querySelector('img').classList.add('img-fluid');
          optimizedPic.querySelector('img').alt = imageAltCell?.textContent.trim() || '';
          optimizedPic.querySelector('img').title = imageTitleCell?.textContent.trim() || '';
        }
      }
    }

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const itemSectionHeader = document.createElement('div');
    itemSectionHeader.classList.add('section-header');

    const itemHeading = document.createElement('h3');
    itemHeading.classList.add('heading', 'font-regular');
    itemHeading.textContent = headingCell?.textContent.trim() || '';

    const itemDescription = document.createElement('p');
    itemDescription.classList.add('text-size-body');
    itemDescription.innerHTML = descriptionCell?.innerHTML || '';

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
    const foundCtaLink = ctaLinkCell?.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href; // Correctly read href from aem-content
    }
    ctaLink.textContent = ctaLabelCell?.textContent.trim() || '';

    itemSectionHeader.append(itemHeading, itemDescription, ctaLink);
    contentWrap.append(itemSectionHeader);

    moveInstrumentation(row, wrap);
    if (imageCell) { // Only append imageWrap if an image was found
      wrap.append(imageWrap);
    }
    wrap.append(contentWrap);
    slides.append(wrap);
    gridLayout.append(slides);
  });

  container.append(gridLayout);
  positionRelative.append(container);

  block.innerHTML = '';
  block.classList.add('section', 'pb-0');
  block.append(sectionHeader, positionRelative);
}
