import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...slideRows] = [...block.children];

  block.innerHTML = ''; // Clear the block content

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  // Use headingRow.children[0] for consistency with other cell access patterns
  moveInstrumentation(headingRow.children[0], heading);
  heading.textContent = headingRow.children[0].textContent.trim();
  sectionHeader.appendChild(heading);
  block.appendChild(sectionHeader);

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
    // Correctly destructuring all cells based on BlockJson model
    const [imageCell, altCell, titleCell, descriptionCell, linkCell, linkLabelCell] = [
      ...row.children,
    ];

    const slidesDiv = document.createElement('div');
    slidesDiv.classList.add('slides');

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const imageWrapDiv = document.createElement('div');
      imageWrapDiv.classList.add('image-wrap');
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(
          img.src,
          altCell.textContent.trim(),
          false,
          [{ width: '750' }],
        );
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageWrapDiv.appendChild(optimizedPic);
        optimizedPic.querySelector('img').classList.add('img-fluid');
      }
      wrapDiv.appendChild(imageWrapDiv);
    }

    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const slideTitle = document.createElement('h3');
    slideTitle.classList.add('heading', 'font-regular');
    moveInstrumentation(titleCell, slideTitle);
    slideTitle.textContent = titleCell.textContent.trim();
    contentSectionHeader.appendChild(slideTitle);

    const description = document.createElement('p');
    description.classList.add('text-size-body');
    moveInstrumentation(descriptionCell, description);
    // Description is richtext, so innerHTML is correct
    description.innerHTML = descriptionCell.innerHTML;
    contentSectionHeader.appendChild(description);

    const buttonLink = document.createElement('a');
    buttonLink.classList.add('btn', 'btn-primary', 'stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      buttonLink.href = foundLink.href;
    }
    moveInstrumentation(linkLabelCell, buttonLink);
    buttonLink.textContent = linkLabelCell.textContent.trim();
    contentSectionHeader.appendChild(buttonLink);

    contentWrapDiv.appendChild(contentSectionHeader);
    wrapDiv.appendChild(contentWrapDiv);
    slidesDiv.appendChild(wrapDiv);
    gridLayoutDiv.appendChild(slidesDiv);
  });

  containerDiv.appendChild(gridLayoutDiv);
  positionRelativeDiv.appendChild(containerDiv);
  block.appendChild(positionRelativeDiv);
}
