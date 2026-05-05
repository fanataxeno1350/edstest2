import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  // The outer block div already has 'performance-driven-section' class from AEM.
  // Do not add it again to an inner wrapper.
  const section = document.createElement('section');
  section.classList.add('section', 'spirit-of-rise'); // Classes from ORIGINAL HTML

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // Add data-aos attributes from ORIGINAL HTML
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-delay', '200');
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  // Add data-aos attributes from ORIGINAL HTML
  description.setAttribute('data-aos', 'fade-up');
  description.setAttribute('data-aos-offset', '100');
  description.setAttribute('data-aos-duration', '650');
  description.setAttribute('data-aos-easing', 'ease-in-out');
  description.textContent = descriptionRow.textContent.trim();
  sectionHeader.append(description);

  section.append(sectionHeader);

  // Performance Driven Cards
  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    // Fixed schema for card rows, use destructuring
    const [imageDesktopCell, imageMobileCell, labelCell, linkCell] = [...row.children];

    const linkEl = document.createElement('a');
    linkEl.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.target = foundLink.target || '_blank'; // Use target from original link if present, else default
    }
    moveInstrumentation(row, linkEl);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    const pictureMobile = imageMobileCell.querySelector('picture');

    if (pictureDesktop && pictureMobile) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      sourceMobile.srcset = pictureMobile.querySelector('img')?.src || ''; // Use optional chaining
      sourceMobile.setAttribute('type', 'image/webp'); // Assuming webp from original HTML

      const img = document.createElement('img');
      img.src = pictureDesktop.querySelector('img')?.src || ''; // Use optional chaining
      img.alt = pictureDesktop.querySelector('img')?.alt || ''; // Use optional chaining

      const newPicture = document.createElement('picture');
      newPicture.append(sourceMobile, img);
      cardImage.append(newPicture);
    } else if (pictureDesktop) {
      cardImage.append(pictureDesktop);
    } else if (pictureMobile) {
      cardImage.append(pictureMobile);
    }

    const cardBox = document.createElement('div');
    cardBox.classList.add('performace-driven-home-box-card');

    // labelP is a <p> element, and labelCell.textContent.trim() is plain text.
    // Assigning textContent to innerHTML is fine here as it's not rich text.
    // If labelCell contained <p> tags, we would need to use a <div> or extract innerHTML.
    const labelP = document.createElement('p');
    labelP.classList.add('desc');
    labelP.innerHTML = labelCell.textContent.trim().replace(/\n/g, '<br/>'); // Preserve line breaks

    cardBox.append(labelP);
    cardWrapper.append(cardImage, cardBox);
    linkEl.append(cardWrapper);
    cardsContainer.append(linkEl);
  });

  container.append(cardsContainer);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);

  block.querySelectorAll('picture > img').forEach((img) => {
    // The createOptimizedPicture function is designed to replace an existing picture element.
    // It's better to replace the entire picture element rather than just the img.
    // The original code already creates a new picture element if both desktop and mobile images exist.
    // This part should only optimize pictures that were directly appended from the AEM content.
    const parentPicture = img.closest('picture');
    if (parentPicture) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      // moveInstrumentation should be called on the original picture element, not the img inside it.
      // Then replace the original picture with the optimized one.
      moveInstrumentation(parentPicture, optimizedPic);
      parentPicture.replaceWith(optimizedPic);
    }
  });
}
