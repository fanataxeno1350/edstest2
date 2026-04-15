import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [sectionTitleRow, ...slideRows] = [...block.children];

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const titleHeading = document.createElement('h2');
  titleHeading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  titleHeading.setAttribute('data-aos', 'fade-up');
  titleHeading.setAttribute('data-aos-offset', '100');
  titleHeading.setAttribute('data-aos-duration', '650');
  titleHeading.setAttribute('data-aos-easing', 'ease-in-out');
  moveInstrumentation(sectionTitleRow, titleHeading);
  titleHeading.textContent = sectionTitleRow.firstElementChild?.textContent.trim() || '';
  sectionHeader.appendChild(titleHeading);

  // Slides container
  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');
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
    const [
      imageCell,
      imageAltCell,
      imageTitleCell,
      headingCell,
      descriptionCell,
      linkCell,
      linkLabelCell,
    ] = [...row.children];

    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');
    slideDiv.appendChild(wrapDiv);

    // Image
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const imageWrapDiv = document.createElement('div');
      imageWrapDiv.classList.add('image-wrap');
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, imageAltCell.textContent.trim(), false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('img-fluid');
        moveInstrumentation(imageCell, optimizedPic.querySelector('img'));
        imageWrapDiv.appendChild(optimizedPic);
      }
      wrapDiv.appendChild(imageWrapDiv);
    }

    // Content
    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');
    wrapDiv.appendChild(contentWrapDiv);

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');
    contentWrapDiv.appendChild(contentSectionHeader);

    const heading = document.createElement('h3');
    heading.classList.add('heading', 'font-regular');
    moveInstrumentation(headingCell, heading);
    heading.textContent = headingCell.textContent.trim();
    contentSectionHeader.appendChild(heading);

    const description = document.createElement('p');
    description.classList.add('text-size-body');
    moveInstrumentation(descriptionCell, description);
    description.textContent = descriptionCell.textContent.trim();
    contentSectionHeader.appendChild(description);

    const link = document.createElement('a');
    link.classList.add('btn', 'btn-primary', 'stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href; // Correctly extract href from the 'aem-content' link cell
    }
    moveInstrumentation(linkCell, link);
    link.textContent = linkLabelCell.textContent.trim(); // Use linkLabelCell for the link text
    contentSectionHeader.appendChild(link);

    gridLayoutDiv.appendChild(slideDiv);
  });

  block.innerHTML = '';
  block.classList.add('section', 'pb-0');
  block.appendChild(sectionHeader);
  block.appendChild(positionRelativeDiv);
}
