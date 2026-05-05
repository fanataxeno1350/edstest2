import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise'); // Removed 'performance-driven-section-2' as it's the block name

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const subheading = document.createElement('p');
  subheading.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(subheadingRow, subheading);
  subheading.textContent = subheadingRow.textContent.trim();
  sectionHeader.append(subheading);

  section.append(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, linkCell, descriptionCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // Assuming target blank from original HTML
    }
    moveInstrumentation(row, cardLink);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    const pictureMobile = imageMobileCell.querySelector('picture');

    if (pictureDesktop && pictureMobile) {
      const imgDesktop = pictureDesktop.querySelector('img');
      const imgMobile = pictureMobile.querySelector('img');

      // Create a new picture element to hold the optimized sources
      const optimizedPicture = document.createElement('picture');

      // Mobile source
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      sourceMobile.srcset = imgMobile.src;
      optimizedPicture.append(sourceMobile);

      // Desktop img
      const img = document.createElement('img');
      img.src = imgDesktop.src;
      img.alt = imgDesktop.alt;
      img.loading = 'lazy'; // Assuming lazy loading from original HTML
      optimizedPicture.append(img);

      cardImage.append(optimizedPicture);
      moveInstrumentation(imageDesktopCell, optimizedPicture); // Move instrumentation from original cell to new picture
    } else if (pictureDesktop) {
      // If only desktop image is present, use createOptimizedPicture
      const img = pictureDesktop.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(imageDesktopCell, optimizedPic); // Move instrumentation from original cell to new picture
      cardImage.append(optimizedPic);
    }
    // No else if (pictureMobile) because desktop is primary. If only mobile, it would be handled by desktop cell.

    cardWrapper.append(cardImage);

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const description = document.createElement('p');
    description.classList.add('desc');
    description.innerHTML = descriptionCell.innerHTML; // Use innerHTML for potential <br/>
    homeBoxCard.append(description);

    cardWrapper.append(homeBoxCard);
    cardLink.append(cardWrapper);
    cardsContainer.append(cardLink);
  });

  container.append(cardsContainer);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);

  // The original block.querySelectorAll('picture > img') loop for optimization is redundant
  // because createOptimizedPicture is already used for single images, and for dual images,
  // the picture element is constructed manually with the correct sources.
  // This loop would re-optimize images that are already handled or incorrectly modify the dual-source pictures.
}
