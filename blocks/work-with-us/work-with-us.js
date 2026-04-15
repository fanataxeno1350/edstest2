import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...slideRows] = [...block.children];

  // Section header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // Add data-aos attributes from original HTML
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.textContent = headingRow.children[0].textContent.trim(); // Corrected to children[0] for consistency
  sectionHeader.appendChild(heading);

  block.innerHTML = ''; // Clear block content
  block.classList.add('pb-0'); // Add block-level class
  block.prepend(sectionHeader);

  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');
  // Add data-aos attributes from original HTML
  positionRelativeDiv.setAttribute('data-aos', 'fade-up');
  positionRelativeDiv.setAttribute('data-aos-offset', '100');
  positionRelativeDiv.setAttribute('data-aos-duration', '650');
  positionRelativeDiv.setAttribute('data-aos-easing', 'ease-in-out');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  positionRelativeDiv.appendChild(containerDiv);

  const gridLayoutDiv = document.createElement('div');
  gridLayoutDiv.classList.add('grid-layout');
  containerDiv.appendChild(gridLayoutDiv);

  slideRows.forEach((row) => {
    const [imageCell, titleCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');
    moveInstrumentation(row, slideDiv);

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');
    slideDiv.appendChild(wrapDiv);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const imageWrapDiv = document.createElement('div');
      imageWrapDiv.classList.add('image-wrap');
      imageWrapDiv.appendChild(picture);
      wrapDiv.appendChild(imageWrapDiv);

      // Optimize image
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        picture.replaceWith(optimizedPic);
        optimizedPic.querySelector('img').classList.add('img-fluid');
      }
    }

    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');
    wrapDiv.appendChild(contentWrapDiv);

    const slideSectionHeader = document.createElement('div');
    slideSectionHeader.classList.add('section-header');
    contentWrapDiv.appendChild(slideSectionHeader);

    const title = document.createElement('h3');
    title.classList.add('heading', 'font-regular');
    title.textContent = titleCell.textContent.trim();
    slideSectionHeader.appendChild(title);

    const description = document.createElement('p');
    description.classList.add('text-size-body');
    description.textContent = descriptionCell.textContent.trim();
    slideSectionHeader.appendChild(description);

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
    const foundLink = ctaLinkCell.querySelector('a');
    if (foundLink) {
      ctaLink.href = foundLink.href;
    }
    ctaLink.textContent = ctaLabelCell.textContent.trim();
    slideSectionHeader.appendChild(ctaLink);

    gridLayoutDiv.appendChild(slideDiv);
  });

  block.appendChild(positionRelativeDiv);
}
