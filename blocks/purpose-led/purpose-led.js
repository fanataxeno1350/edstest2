import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // block.children[0] is headingRow, block.children[1] is subheadingRow
  // block.children[2...] are cardRows
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  // The block's own class 'purpose-led' is already on the outer block div from AEM.
  // Adding it again to an inner wrapper causes double padding/CSS.
  // Removed 'purpose-led' from this inner section.
  section.classList.add('section', 'grey-bg', 'spirit-of-rise');

  const container = document.createElement('div');
  container.classList.add('container');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.children[0]?.textContent.trim() || ''; // Read from cell, not row
  sectionHeader.append(heading);

  const subheading = document.createElement('p');
  subheading.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(subheadingRow, subheading);
  subheading.textContent = subheadingRow.children[0]?.textContent.trim() || ''; // Read from cell, not row
  sectionHeader.append(subheading);

  container.append(sectionHeader);

  // Cards Grid
  const grid = document.createElement('div');
  grid.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');

  cardRows.forEach((row) => {
    // Fixed schema for purpose-card-item, so index destructuring is correct.
    const [imageDesktopCell, imageMobileCell, linkCell, descriptionCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-md-6', 'aos-init', 'aos-animate');

    const anchor = document.createElement('a');
    anchor.classList.add('card-wrap');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.target = '_blank'; // From original HTML
    }
    moveInstrumentation(row, anchor);

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    const pictureMobile = imageMobileCell.querySelector('picture');

    if (pictureMobile && pictureDesktop) {
      const source = document.createElement('source');
      source.media = '(max-width: 576px)';
      // Ensure we get the src from the img inside the mobile picture
      source.srcset = pictureMobile.querySelector('img')?.src || '';
      pictureDesktop.prepend(source); // Add mobile source to desktop picture
    }

    if (pictureDesktop) {
      const img = pictureDesktop.querySelector('img');
      // Only create optimized picture if img exists
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardImage.append(optimizedPic);
      }
    }

    const cardText = document.createElement('div');
    cardText.classList.add('card-text');

    const description = document.createElement('p');
    description.classList.add('desc');
    // description is richtext, so use innerHTML.
    // Assigning innerHTML of a cell (which is "<div><p>content</p></div>")
    // to a <p> element creates invalid <p><p>content</p></p> nesting.
    // Instead, extract the inner content of the first <p> or use the cell's innerHTML
    // if the target element is a <div>. Since the target is a <p>, extract inner <p>.
    description.innerHTML = descriptionCell.querySelector('p')?.innerHTML ?? descriptionCell.textContent.trim() ?? '';
    cardText.append(description);

    anchor.append(cardImage, cardText);
    col.append(anchor);
    grid.append(col);
  });

  container.append(grid);
  section.append(container);
  block.replaceChildren(section);
}
