import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  const sectionHeadingRow = rows.shift(); // First row is the section heading

  block.classList.add('section', 'work-with-us', 'pb-0');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(sectionHeadingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = sectionHeadingRow.firstElementChild?.textContent.trim() || '';
  sectionHeader.append(heading);
  block.prepend(sectionHeader);

  // Slides Container
  const positionRelative = document.createElement('div');
  positionRelative.classList.add('position-relative', 'aos-init', 'aos-animate');

  const container = document.createElement('div');
  container.classList.add('container');
  positionRelative.append(container);

  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');
  container.append(gridLayout);

  rows.forEach((row) => {
    const cells = [...row.children];

    // Content detection for cells based on BlockJson and EDS structure
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const otherCells = cells.filter(cell => cell !== imageCell && cell !== linkCell);

    // Assuming order for otherCells: title, description, linkLabel
    const titleCell = otherCells[0];
    const descriptionCell = otherCells[1];
    const linkLabelCell = otherCells[2];

    const slide = document.createElement('div');
    slide.classList.add('slides');
    moveInstrumentation(row, slide);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');
    slide.append(wrap);

    // Image
    if (imageCell) {
      const imageWrap = document.createElement('div');
      imageWrap.classList.add('image-wrap');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          picture.replaceWith(optimizedPic);
          optimizedPic.querySelector('img').classList.add('img-fluid');
        }
        imageWrap.append(picture);
      }
      wrap.append(imageWrap);
    }

    // Content
    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');
    wrap.append(contentWrap);

    const contentHeader = document.createElement('div');
    contentHeader.classList.add('section-header');
    contentWrap.append(contentHeader);

    if (titleCell) {
      const title = document.createElement('h3');
      title.classList.add('heading', 'font-regular');
      title.textContent = titleCell.textContent.trim();
      contentHeader.append(title);
    }

    if (descriptionCell) {
      const description = document.createElement('p');
      description.classList.add('text-size-body');
      description.textContent = descriptionCell.textContent.trim();
      contentHeader.append(description);
    }

    if (linkCell) {
      const linkElement = linkCell.querySelector('a');
      if (linkElement) {
        const button = document.createElement('a');
        button.classList.add('btn', 'btn-primary', 'stretched-link');
        button.href = linkElement.href; // Read href from the <a> tag
        button.textContent = linkLabelCell?.textContent.trim() || ''; // Use linkLabelCell for button text
        contentHeader.append(button);
      }
    }

    gridLayout.append(slide);
  });

  block.append(positionRelative);
}
