import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure root rows based on BlockJson model
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  // The block's own class 'purpose-led-section' is already on the outer block div.
  // Do not add it again to an inner wrapper.
  section.classList.add('grey-bg', 'spirit-of-rise'); // Classes from ORIGINAL HTML

  const container = document.createElement('div');
  container.classList.add('container');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const subheading = document.createElement('p');
  moveInstrumentation(subheadingRow, subheading);
  subheading.textContent = subheadingRow.textContent.trim();
  sectionHeader.append(subheading);

  container.append(sectionHeader);

  const cardsGrid = document.createElement('div');
  cardsGrid.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');

  cardRows.forEach((row) => {
    // Destructure cells for 'purpose-led-card-item' based on BlockJson model
    const [imageDesktopCell, imageMobileCell, linkCell, descriptionCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-md-6');

    const cardLink = document.createElement('a');
    cardLink.classList.add('card-wrap');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // From original HTML
    }
    moveInstrumentation(row, cardLink); // Move instrumentation from the row to the main interactive element

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    moveInstrumentation(imageDesktopCell, cardImage); // Move instrumentation for the image cell

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    const pictureMobile = imageMobileCell.querySelector('picture');

    // Handle mobile image source
    if (pictureMobile) {
      const imgMobile = pictureMobile.querySelector('img');
      if (imgMobile) {
        const sourceMobile = document.createElement('source');
        sourceMobile.media = '(max-width: 576px)';
        // For mobile, we just need the srcset from the original img src
        sourceMobile.srcset = imgMobile.src;
        cardImage.append(sourceMobile);
      }
    }

    // Handle desktop image source
    if (pictureDesktop) {
      const imgDesktop = pictureDesktop.querySelector('img');
      if (imgDesktop) {
        // createOptimizedPicture handles creating the <picture> and <img> elements
        // We just need to append the optimized picture directly.
        const optimizedPic = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('img-fluid');
        cardImage.append(optimizedPic);
      }
    }

    cardLink.append(cardImage);

    const cardText = document.createElement('div');
    cardText.classList.add('card-text');
    moveInstrumentation(descriptionCell, cardText); // Move instrumentation for the description cell

    const description = document.createElement('p');
    description.classList.add('desc');
    // For richtext, use innerHTML to preserve any nested HTML (like <br/> or <a>)
    description.innerHTML = descriptionCell.innerHTML;
    cardText.append(description);

    cardLink.append(cardText);
    col.append(cardLink);
    cardsGrid.append(col);
  });

  container.append(cardsGrid);
  section.append(container);
  block.replaceChildren(section);
}
