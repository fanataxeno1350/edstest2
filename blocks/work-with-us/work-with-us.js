import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...slideRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const headingCell = [...headingRow.children].find((c) => c.textContent.trim());
  if (headingCell) {
    const h2 = document.createElement('h2');
    h2.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    moveInstrumentation(headingCell, h2);
    h2.innerHTML = headingCell.innerHTML;
    sectionHeader.append(h2);
  }

  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const gridLayoutDiv = document.createElement('div');
  gridLayoutDiv.classList.add('grid-layout');

  slideRows.forEach((row) => {
    const cells = [...row.children];

    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    const imageCell = cells.find((c) => c.querySelector('picture'));
    // Find imageAltCell and imageTitleCell by their position relative to imageCell
    // Assuming the order is image, imageAlt, imageTitle, title, description, link, linkLabel
    const imageAltCell = cells[cells.indexOf(imageCell) + 1];
    const imageTitleCell = cells[cells.indexOf(imageCell) + 2];
    const titleCell = cells[cells.indexOf(imageCell) + 3];
    const descriptionCell = cells.find((c) => c.querySelector('p'));
    const linkCell = cells.find((c) => c.querySelector('a'));
    const linkLabelCell = cells[cells.indexOf(linkCell) + 1]; // Assuming linkLabel is right after link

    if (imageCell) {
      const imageWrapDiv = document.createElement('div');
      imageWrapDiv.classList.add('image-wrap');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const altText = imageAltCell?.textContent.trim() || img.alt;
          const titleText = imageTitleCell?.textContent.trim() || img.title;
          const optimizedPic = createOptimizedPicture(img.src, altText, false, [{ width: '750' }]);
          optimizedPic.querySelector('img').classList.add('img-fluid');
          optimizedPic.querySelector('img').alt = altText;
          optimizedPic.querySelector('img').title = titleText;
          moveInstrumentation(imageCell, optimizedPic);
          imageWrapDiv.append(optimizedPic);
        }
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

    if (linkCell && linkLabelCell) {
      const a = document.createElement('a');
      a.classList.add('btn', 'btn-primary', 'stretched-link');
      const originalLink = linkCell.querySelector('a');
      if (originalLink) {
        a.href = originalLink.href;
      }
      moveInstrumentation(linkCell, a);
      a.textContent = linkLabelCell.textContent.trim();
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
  block.classList.add('section', 'pb-0'); // Add section and pb-0 classes to the block itself
  block.append(sectionHeader, positionRelativeDiv);
}
