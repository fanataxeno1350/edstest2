import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...slideRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const headingCell = [...headingRow.children].find(c => c.textContent.trim());
  if (headingCell) {
    const h2 = document.createElement('h2');
    h2.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    h2.setAttribute('data-aos', 'fade-up');
    h2.setAttribute('data-aos-offset', '100');
    h2.setAttribute('data-aos-duration', '650');
    h2.setAttribute('data-aos-easing', 'ease-in-out');
    moveInstrumentation(headingCell, h2);
    h2.innerHTML = headingCell.innerHTML;
    sectionHeader.append(h2);
  }

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
    const cells = [...row.children];

    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');
    moveInstrumentation(row, slideDiv);

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    const imageCell = cells.find(c => c.querySelector('picture'));
    const titleCell = cells.find(c => !c.querySelector('picture') && !c.querySelector('a') && !c.querySelector('p'));
    const descriptionCell = cells.find(c => c.querySelector('p'));
    const linkCell = cells.find(c => c.querySelector('a'));

    if (imageCell) {
      const imageWrapDiv = document.createElement('div');
      imageWrapDiv.classList.add('image-wrap');
      moveInstrumentation(imageCell, imageWrapDiv);
      while (imageCell.firstChild) {
        imageWrapDiv.append(imageCell.firstChild);
      }
      wrapDiv.append(imageWrapDiv);
    }

    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');

    const innerSectionHeader = document.createElement('div');
    innerSectionHeader.classList.add('section-header');

    if (titleCell) {
      const h3 = document.createElement('h3');
      h3.classList.add('heading', 'font-regular');
      moveInstrumentation(titleCell, h3);
      h3.innerHTML = titleCell.innerHTML;
      innerSectionHeader.append(h3);
    }

    if (descriptionCell) {
      const p = document.createElement('p');
      p.classList.add('text-size-body');
      moveInstrumentation(descriptionCell, p);
      p.innerHTML = descriptionCell.innerHTML;
      innerSectionHeader.append(p);
    }

    if (linkCell) {
      const a = document.createElement('a');
      a.classList.add('btn', 'btn-primary', 'stretched-link');
      const originalLink = linkCell.querySelector('a');
      if (originalLink) {
        a.href = originalLink.href;
        a.textContent = originalLink.textContent;
      }
      moveInstrumentation(linkCell, a);
      innerSectionHeader.append(a);
    }

    contentWrapDiv.append(innerSectionHeader);
    wrapDiv.append(contentWrapDiv);
    slideDiv.append(wrapDiv);
    gridLayoutDiv.append(slideDiv);
  });

  containerDiv.append(gridLayoutDiv);
  positionRelativeDiv.append(containerDiv);

  block.textContent = '';
  block.append(sectionHeader, positionRelativeDiv);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
    optimizedPic.querySelector('img').classList.add('img-fluid');
  });
}
