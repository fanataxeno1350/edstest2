import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // CHECK 0.5: Removed 'purpose-led' class from the inner section wrapper.
  // The outer block div already carries this class from AEM.
  const section = document.createElement('section');
  section.classList.add('grey-bg', 'spirit-of-rise'); // Removed 'section' as it's the element type

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  container.append(sectionHeader);

  const headingRow = children.shift();
  // CHECK 0.7 A: headingCell is a div, but its content is directly text, not wrapped in another div.
  // querySelector('div') would return null. Read from the row directly.
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-delay', '200');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow?.textContent.trim() || ''; // Read textContent for plain text
  sectionHeader.append(heading);

  const descriptionRow = children.shift();
  // CHECK 0.7 A: descriptionCell is a div, but its content is directly text, not wrapped in another div.
  // querySelector('div') would return null. Read from the row directly.
  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.setAttribute('data-aos', 'fade-up');
  description.setAttribute('data-aos-offset', '100');
  description.setAttribute('data-aos-duration', '650');
  description.setAttribute('data-aos-easing', 'ease-in-out');
  moveInstrumentation(descriptionRow, description);
  description.textContent = descriptionRow?.textContent.trim() || ''; // Read textContent for plain text
  sectionHeader.append(description);

  // Cards Grid
  const cardsGrid = document.createElement('div');
  cardsGrid.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');
  container.append(cardsGrid);

  children.forEach((row) => {
    // CHECK 0: Array destructuring is correct for fixed schema rows.
    const [imageDesktopCell, imageMobileCell, altTextCell, cardTextCell, cardLinkCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-md-6', 'aos-init', 'aos-animate');
    col.setAttribute('data-aos-easing', 'ease-in-out');
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', '700');

    const cardLink = document.createElement('a');
    cardLink.classList.add('card-wrap');
    cardLink.href = cardLinkCell.querySelector('a')?.href || '#';
    cardLink.setAttribute('target', '_blank');
    moveInstrumentation(row, cardLink);

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    const pictureMobile = imageMobileCell.querySelector('picture');

    if (pictureDesktop && pictureMobile) {
      // Create a new picture element to combine sources and img
      const newPicture = document.createElement('picture');

      // Add desktop source first for wider screens
      const sourceDesktop = document.createElement('source');
      sourceDesktop.setAttribute('media', '(min-width: 577px)');
      sourceDesktop.srcset = pictureDesktop.querySelector('img')?.src || '';
      newPicture.append(sourceDesktop);

      // Add mobile source
      const sourceMobile = document.createElement('source');
      sourceMobile.setAttribute('media', '(max-width: 576px)');
      sourceMobile.srcset = pictureMobile.querySelector('img')?.src || '';
      newPicture.append(sourceMobile);

      // Add the img tag, using desktop image as default
      const img = document.createElement('img');
      img.classList.add('img-fluid');
      img.src = pictureDesktop.querySelector('img')?.src || ''; // Default to desktop image
      img.alt = altTextCell.textContent.trim();
      newPicture.append(img);

      cardImage.append(newPicture);
    } else if (pictureDesktop) {
      const img = pictureDesktop.querySelector('img');
      // moveInstrumentation should be on the original img element, not the optimized one
      const optimizedPic = createOptimizedPicture(img.src, altTextCell.textContent.trim(), false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img')); // Corrected instrumentation target
      cardImage.append(optimizedPic);
    } else if (pictureMobile) {
      const img = pictureMobile.querySelector('img');
      // moveInstrumentation should be on the original img element, not the optimized one
      const optimizedPic = createOptimizedPicture(img.src, altTextCell.textContent.trim(), false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img')); // Corrected instrumentation target
      cardImage.append(optimizedPic);
    }

    const cardText = document.createElement('div'); // CHECK 0.7 B: Changed to div to avoid <p> inside <p>
    cardText.classList.add('card-text');
    cardText.innerHTML = cardTextCell.innerHTML; // CHECK 1.5: Correctly uses innerHTML for richtext

    cardLink.append(cardImage, cardText);
    col.append(cardLink);
    cardsGrid.append(col);
  });

  block.replaceChildren(section);
}
