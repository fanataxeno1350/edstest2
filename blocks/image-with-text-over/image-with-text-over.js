import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The block structure is fixed and known from BlockJson, so direct destructuring is safe here.
  // Each child of the block corresponds to a specific field in the model.
  const [headingRow, subheadingRow, linkRow, iconRow, imageRow] = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.classList.add('w-100-thar', 'position-relative-thar');

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add(
    'position-absolute-thar',
    'w-100-thar',
    'd-flex-thar',
    'justify-content-center-thar',
    'bt-lg-60',
    'b-md-30',
    'b-sm-30',
    'px-20-textov',
  );

  const textContainer = document.createElement('div');
  textContainer.classList.add(
    'd-flex-thar',
    'flex-column-thar',
    'w-50-textov-md',
    'w-100-textov-sm',
    'tc-textov-md',
    'tl-textov-sm',
  );

  // Heading
  if (headingRow) {
    const headingDiv = document.createElement('div');
    moveInstrumentation(headingRow, headingDiv);
    headingDiv.classList.add('mb-10-textov');
    const p = document.createElement('p');
    p.classList.add('textov-sec1', 'my-auto-thar');
    // Ensure we only take the content of the first cell, as per the block structure
    const headingCell = headingRow.querySelector('div');
    if (headingCell) {
      while (headingCell.firstChild) p.append(headingCell.firstChild);
    }
    headingDiv.append(p);
    textContainer.append(headingDiv);
  }

  // Subheading
  if (subheadingRow) {
    const subheadingDiv = document.createElement('div');
    moveInstrumentation(subheadingRow, subheadingDiv);
    subheadingDiv.classList.add('mb-10-textov');
    const p = document.createElement('p');
    p.classList.add('textov-sec2-md', 'textov-sec2-sm');
    // Ensure we only take the content of the first cell, as per the block structure
    const subheadingCell = subheadingRow.querySelector('div');
    if (subheadingCell) {
      while (subheadingCell.firstChild) p.append(subheadingCell.firstChild);
    }
    subheadingDiv.append(p);
    textContainer.append(subheadingDiv);
  }

  // Link and Icon
  if (linkRow || iconRow) {
    const linkDiv = document.createElement('div');
    const anchor = document.createElement('a');
    anchor.classList.add('textov-sec3', 'my-auto-thar');

    if (linkRow) {
      // The linkRow contains a div, which contains the anchor.
      const linkCell = linkRow.querySelector('div');
      const foundLink = linkCell ? linkCell.querySelector('a') : null;
      if (foundLink) {
        anchor.href = foundLink.href;
        moveInstrumentation(linkRow, anchor);
        // Move the text content of the link from the original cell
        while (foundLink.firstChild) anchor.append(foundLink.firstChild);
      }
    }

    if (iconRow) {
      // The iconRow contains a div, which contains the picture.
      const iconCell = iconRow.querySelector('div');
      const picture = iconCell ? iconCell.querySelector('picture') : null;
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          anchor.append(optimizedPic);
        }
      }
    }
    linkDiv.append(anchor);
    textContainer.append(linkDiv);
  }

  contentWrapper.append(textContainer);

  // Image
  const imageDiv = document.createElement('div');
  imageDiv.classList.add('textov-img-wr', 'w-10i-textov-md', 'w-100-textov-sm');
  if (imageRow) {
    // The imageRow contains a div, which contains the picture.
    const imageCell = imageRow.querySelector('div');
    const picture = imageCell ? imageCell.querySelector('picture') : null;
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
        optimizedPic.querySelector('img').classList.add('imagewithtextover-large');
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageDiv.append(optimizedPic);
      }
    }
  }

  wrapper.append(contentWrapper);
  wrapper.append(imageDiv);

  block.textContent = '';
  block.append(wrapper);
}
