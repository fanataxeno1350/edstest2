import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Section Header
  const [headerRow, descriptionRow, ...cardRows] = children; // Destructuring for fixed-schema root rows

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headerRow, heading);
  heading.textContent = headerRow.textContent.trim();
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow, description);
  description.textContent = descriptionRow.textContent.trim();
  sectionHeader.append(description);

  container.append(sectionHeader);

  // Cards Grid
  const grid = document.createElement('div');
  grid.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');

  cardRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, cardLinkCell, cardTextCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-md-6', 'aos-init', 'aos-animate');

    const cardLink = document.createElement('a');
    cardLink.classList.add('card-wrap');
    const foundLink = cardLinkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // As per original HTML
    }

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    const pictureMobile = imageMobileCell.querySelector('picture');

    if (pictureDesktop && pictureMobile) {
      // Create a new picture element to combine sources
      const combinedPicture = document.createElement('picture');

      // Add mobile source
      const mobileImg = pictureMobile.querySelector('img');
      if (mobileImg) {
        const sourceMobile = document.createElement('source');
        sourceMobile.media = '(max-width: 576px)';
        sourceMobile.srcset = mobileImg.src;
        combinedPicture.append(sourceMobile);
      }

      // Add desktop image as default
      const desktopImg = pictureDesktop.querySelector('img');
      if (desktopImg) {
        const img = document.createElement('img');
        img.src = desktopImg.src;
        img.alt = desktopImg.alt;
        img.classList.add('img-fluid');
        combinedPicture.append(img);
        moveInstrumentation(imageDesktopCell.querySelector('img'), img); // Move instrumentation from desktop img
      }
      cardImage.append(combinedPicture);
      moveInstrumentation(pictureDesktop, combinedPicture); // Move instrumentation from the original picture element
    } else if (pictureDesktop) {
      const img = pictureDesktop.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardImage.append(optimizedPic);
      }
    } else if (pictureMobile) {
      const img = pictureMobile.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardImage.append(optimizedPic);
      }
    }

    cardLink.append(cardImage);

    const cardText = document.createElement('div');
    cardText.classList.add('card-text');
    // cardTextCell is richtext, its innerHTML is "<p>...</p>".
    // Assigning to a <p> creates <p><p>...</p></p>, which is invalid.
    // Use a div as the container for richtext.
    const textContentDiv = document.createElement('div'); // Changed from p to div
    textContentDiv.classList.add('desc'); // Keep the class
    textContentDiv.innerHTML = cardTextCell.innerHTML;
    cardText.append(textContentDiv);

    cardLink.append(cardText);
    moveInstrumentation(row, col); // Move instrumentation from the authored row to the new column element
    col.append(cardLink);
    grid.append(col);
  });

  container.append(grid);
  block.replaceChildren(section);
}
