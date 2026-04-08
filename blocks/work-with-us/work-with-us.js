import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...slideRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  while (headingRow.firstChild) heading.append(headingRow.firstChild);
  sectionHeader.append(heading);

  const positionRelative = document.createElement('div');
  positionRelative.classList.add('position-relative', 'aos-init', 'aos-animate');
  positionRelative.setAttribute('data-aos', 'fade-up');
  positionRelative.setAttribute('data-aos-offset', '100');
  positionRelative.setAttribute('data-aos-duration', '650');
  positionRelative.setAttribute('data-aos-easing', 'ease-in-out');

  const container = document.createElement('div');
  container.classList.add('container');
  positionRelative.append(container);

  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');
  container.append(gridLayout);

  slideRows.forEach((row) => {
    const slidesDiv = document.createElement('div');
    slidesDiv.classList.add('slides');
    moveInstrumentation(row, slidesDiv);

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');
    slidesDiv.append(wrapDiv);

    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');
    const slideSectionHeader = document.createElement('div');
    slideSectionHeader.classList.add('section-header');
    contentWrapDiv.append(slideSectionHeader);

    let imageDiv = null;

    const cells = [...row.children];

    // Find image cell
    const imageCell = cells.find((cell) => cell.querySelector('picture'));
    if (imageCell) {
      imageDiv = document.createElement('div');
      imageDiv.classList.add('image-wrap');
      moveInstrumentation(imageCell, imageDiv);
      while (imageCell.firstChild) imageDiv.append(imageCell.firstChild);
    }

    // Find heading cell (h3)
    const slideHeadingCell = cells.find((cell) => cell.querySelector('h3'));
    if (slideHeadingCell) {
      const slideHeading = document.createElement('h3');
      slideHeading.classList.add('heading', 'font-regular');
      moveInstrumentation(slideHeadingCell, slideHeading);
      while (slideHeadingCell.firstChild) slideHeading.append(slideHeadingCell.firstChild);
      slideSectionHeader.append(slideHeading);
    }

    // Find text cell (p)
    const slideTextCell = cells.find((cell) => cell.querySelector('p'));
    if (slideTextCell) {
      const slideText = document.createElement('p');
      slideText.classList.add('text-size-body');
      moveInstrumentation(slideTextCell, slideText);
      while (slideTextCell.firstChild) slideText.append(slideTextCell.firstChild);
      slideSectionHeader.append(slideText);
    }

    // Find link cell (a)
    const slideLinkCell = cells.find((cell) => cell.querySelector('a'));
    if (slideLinkCell) {
      const link = slideLinkCell.querySelector('a');
      const btnLink = document.createElement('a');
      btnLink.classList.add('btn', 'btn-primary', 'stretched-link');
      btnLink.href = link.href;
      moveInstrumentation(slideLinkCell, btnLink);
      while (slideLinkCell.firstChild) btnLink.append(slideLinkCell.firstChild);
      slideSectionHeader.append(btnLink);
    }

    if (imageDiv) {
      wrapDiv.append(imageDiv);
    }
    wrapDiv.append(contentWrapDiv);
    gridLayout.append(slidesDiv);
  });

  block.textContent = '';
  block.append(sectionHeader, positionRelative);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
