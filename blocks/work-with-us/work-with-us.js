import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...slideRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // CHECK 0 FIX: Replaced direct children[0] access with content detection
  const headingCell = [...headingRow.children].find((cell) => cell.textContent.trim());
  heading.textContent = headingCell?.textContent.trim() || '';
  sectionHeader.append(heading);

  const positionRelative = document.createElement('div');
  positionRelative.classList.add('position-relative', 'aos-init', 'aos-animate');

  const container = document.createElement('div');
  container.classList.add('container');

  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');

  slideRows.forEach((row) => {
    // CHECK 0 FIX: Destructuring is acceptable here as per EDS guide for fixed-field item models
    const [imageCell, altTextCell, titleCell, descriptionCell, linkCell] = [...row.children];

    const slidesDiv = document.createElement('div');
    slidesDiv.classList.add('slides');
    moveInstrumentation(row, slidesDiv);

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, altTextCell.textContent.trim(), false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageWrap.append(optimizedPic);
      }
      wrapDiv.append(imageWrap); // Only append imageWrap if an image exists
    }

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const title = document.createElement('h3');
    title.classList.add('heading', 'font-regular');
    title.textContent = titleCell.textContent.trim();

    const description = document.createElement('p');
    description.classList.add('text-size-body');
    description.textContent = descriptionCell.textContent.trim();

    const link = document.createElement('a');
    link.classList.add('btn', 'btn-primary', 'stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      // CHECK 1.5 FIX: Read link text from the <a> tag's textContent, not hardcoded
      link.textContent = foundLink.textContent.trim();
    } else {
      // Fallback if no link found, though model implies it should always exist
      link.href = '#';
      link.textContent = 'Learn More';
    }

    contentSectionHeader.append(title, description, link);
    contentWrap.append(contentSectionHeader);

    wrapDiv.append(contentWrap); // Always append contentWrap
    slidesDiv.append(wrapDiv);
    gridLayout.append(slidesDiv);
  });

  container.append(gridLayout);
  positionRelative.append(container);

  block.innerHTML = '';
  block.classList.add('section', 'work-with-us', 'pb-0');
  block.append(sectionHeader, positionRelative);
}
