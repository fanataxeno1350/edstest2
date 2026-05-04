import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...slideRows] = [...block.children];

  // Section header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular');
  moveInstrumentation(headingRow.firstElementChild, heading);
  heading.textContent = headingRow.firstElementChild.textContent.trim();
  sectionHeader.append(heading);

  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative');

  const container = document.createElement('div');
  container.classList.add('container');

  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');

  slideRows.forEach((row) => {
    // Destructure cells based on the EDS Block Structure for 'work-with-us-slide'
    const [imageCell, altTextCell, titleCell, descriptionCell, linkCell] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('slides');

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    // Image
    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, altTextCell.textContent.trim(), false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        picture.replaceWith(optimizedPic);
        optimizedPic.querySelector('img').classList.add('img-fluid');
      }
      moveInstrumentation(imageCell, imageWrap);
      imageWrap.append(picture);
    }

    // Content
    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const title = document.createElement('h3');
    title.classList.add('heading', 'font-regular');
    moveInstrumentation(titleCell, title);
    title.textContent = titleCell.textContent.trim();

    const description = document.createElement('p');
    description.classList.add('text-size-body');
    moveInstrumentation(descriptionCell, description);
    description.textContent = descriptionCell.textContent.trim();

    const link = document.createElement('a');
    link.classList.add('btn', 'btn-primary', 'stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      // The original HTML shows "Learn More" or "Learn more" as the link text,
      // not the href path.
      link.textContent = foundLink.textContent.trim() === '/content/site/link' ? 'Learn More' : foundLink.textContent.trim();
    } else {
      // Fallback if no link found, though per model it should always exist
      link.textContent = 'Learn More';
    }
    moveInstrumentation(linkCell, link);


    contentSectionHeader.append(title, description, link);
    contentWrap.append(contentSectionHeader);

    if (imageWrap.hasChildNodes()) {
      wrap.append(imageWrap);
    }
    wrap.append(contentWrap);
    moveInstrumentation(row, slide);
    slide.append(wrap);
    gridLayout.append(slide);
  });

  container.append(gridLayout);
  positionRelativeDiv.append(container);

  block.innerHTML = '';
  block.classList.add('section', 'work-with-us', 'pb-0');
  block.append(sectionHeader, positionRelativeDiv);
}
