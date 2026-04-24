import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...slideRows] = [...block.children];

  // Section wrapper
  const section = document.createElement('section');
  section.classList.add('section', 'work-with-us', 'pb-0');
  moveInstrumentation(block, section);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  moveInstrumentation(headingRow.firstElementChild, heading);
  // Use innerHTML for heading to preserve any potential rich text/HTML structure
  heading.innerHTML = headingRow.firstElementChild.innerHTML.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

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
    // Destructuring is appropriate here as per the EDS Block Structure,
    // all cells are fixed fields and not rich text or variable content.
    const [imageCell, imageAltCell, imageTitleCell, titleCell, descriptionCell, linkCell, linkLabelCell] = [...row.children];

    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    // Image
    const imagePicture = imageCell.querySelector('picture');
    if (imagePicture) {
      const imageWrapDiv = document.createElement('div');
      imageWrapDiv.classList.add('image-wrap');
      const img = imagePicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, imageAltCell.textContent.trim(), false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('img-fluid');
        optimizedPic.querySelector('img').setAttribute('title', imageTitleCell.textContent.trim());
        moveInstrumentation(imagePicture, optimizedPic);
        imageWrapDiv.append(optimizedPic);
      }
      wrapDiv.append(imageWrapDiv);
    }

    // Content
    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const slideTitle = document.createElement('h3');
    slideTitle.classList.add('heading', 'font-regular');
    moveInstrumentation(titleCell, slideTitle);
    slideTitle.textContent = titleCell.textContent.trim();
    contentSectionHeader.append(slideTitle);

    const description = document.createElement('p');
    description.classList.add('text-size-body');
    moveInstrumentation(descriptionCell, description);
    description.textContent = descriptionCell.textContent.trim();
    contentSectionHeader.append(description);

    const link = linkCell.querySelector('a');
    if (link) {
      const button = document.createElement('a');
      button.classList.add('btn', 'btn-primary', 'stretched-link');
      button.href = link.href;
      moveInstrumentation(linkLabelCell, button);
      // Use innerHTML for button label to preserve any potential rich text/HTML structure
      button.innerHTML = linkLabelCell.innerHTML.trim();
      contentSectionHeader.append(button);
    }

    contentWrapDiv.append(contentSectionHeader);
    wrapDiv.append(contentWrapDiv);
    slideDiv.append(wrapDiv);
    gridLayoutDiv.append(slideDiv);
  });

  containerDiv.append(gridLayoutDiv);
  positionRelativeDiv.append(containerDiv);
  section.append(positionRelativeDiv);

  block.replaceWith(section);
}
