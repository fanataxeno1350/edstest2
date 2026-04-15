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
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.textContent = headingRow.firstElementChild.textContent.trim();
  sectionHeader.append(heading);

  // Slides container
  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');
  positionRelativeDiv.setAttribute('data-aos', 'fade-up');
  positionRelativeDiv.setAttribute('data-aos-offset', '100');
  positionRelativeDiv.setAttribute('data-aos-duration', '650');
  positionRelativeDiv.setAttribute('data-aos-easing', 'ease-in-out');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const gridLayoutDiv = document.createElement('div');
  gridLayoutDiv.classList.add('grid-layout');

  slideRows.forEach((row) => {
    // No row.children[n] violations here, destructuring is safe for fixed-field models.
    const [imageCell, imageAltCell, imageTitleCell, titleCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

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
        img.classList.add('img-fluid');
        img.alt = imageAltCell.textContent.trim();
        img.title = imageTitleCell.textContent.trim();
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        picture.replaceWith(optimizedPic);
      }
      imageWrap.append(picture);
      wrapDiv.append(imageWrap);
    }

    // Content
    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const h3 = document.createElement('h3');
    h3.classList.add('heading', 'font-regular');
    h3.textContent = titleCell.textContent.trim();
    contentSectionHeader.append(h3);

    const description = document.createElement('p');
    description.classList.add('text-size-body');
    description.innerHTML = descriptionCell.innerHTML; // Correctly uses innerHTML for richtext
    contentSectionHeader.append(description);

    // CTA Link (type=aem-content)
    const ctaLinkAnchor = ctaLinkCell.querySelector('a');
    if (ctaLinkAnchor) {
      const ctaAnchor = document.createElement('a');
      ctaAnchor.href = ctaLinkAnchor.href; // Correctly reads href from the anchor
      ctaAnchor.classList.add('btn', 'btn-primary', 'stretched-link');
      ctaAnchor.textContent = ctaLabelCell.textContent.trim();
      moveInstrumentation(ctaLinkCell, ctaAnchor);
      contentSectionHeader.append(ctaAnchor);
    }

    contentWrap.append(contentSectionHeader);
    wrapDiv.append(contentWrap);
    slideDiv.append(wrapDiv);
    gridLayoutDiv.append(slideDiv);
  });

  containerDiv.append(gridLayoutDiv);
  positionRelativeDiv.append(containerDiv);

  block.textContent = '';
  block.append(sectionHeader, positionRelativeDiv);
  // Add section classes to the block itself, as per ORIGINAL HTML
  block.classList.add('section', 'work-with-us', 'pb-0');
}
