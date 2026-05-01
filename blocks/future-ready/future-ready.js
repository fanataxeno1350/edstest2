import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

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

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

    const linkEl = document.createElement('a');
    linkEl.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      if (foundLink.target) linkEl.target = foundLink.target; // Preserve target if present
    }
    moveInstrumentation(row, linkEl);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureMobile = imageMobileCell.querySelector('picture');
    const pictureDesktop = imageDesktopCell.querySelector('picture');

    if (pictureMobile && pictureDesktop) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      sourceMobile.srcset = pictureMobile.querySelector('img').src;

      const imgDesktop = pictureDesktop.querySelector('img');
      const optimizedPic = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
      // moveInstrumentation should be from the original imgDesktop to the new img in optimizedPic
      moveInstrumentation(imgDesktop, optimizedPic.querySelector('img'));

      optimizedPic.prepend(sourceMobile);
      cardImage.append(optimizedPic);
    } else if (pictureDesktop) {
      const imgDesktop = pictureDesktop.querySelector('img');
      const optimizedPic = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
      // moveInstrumentation should be from the original imgDesktop to the new img in optimizedPic
      moveInstrumentation(imgDesktop, optimizedPic.querySelector('img'));
      cardImage.append(optimizedPic);
    }

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const description = document.createElement('p');
    description.classList.add('desc');
    // descriptionCell is a richtext cell, its innerHTML is "<p>content</p>".
    // Assigning it to a <p> creates <p><p>content</p></p>.
    // Extract the innerHTML of the <p> inside the cell, or use a <div>.
    // Given the ORIGINAL HTML uses <p> for the description, we extract the inner content.
    description.innerHTML = descriptionCell.querySelector('p')?.innerHTML || descriptionCell.textContent.trim();
    homeBoxCard.append(description);

    cardWrapper.append(cardImage, homeBoxCard);
    linkEl.append(cardWrapper);
    cardsContainer.append(linkEl);
  });

  container.append(cardsContainer);
  performanceDriven.append(container);

  const root = document.createElement('section');
  // The block name 'future-ready' should not be added to the root element,
  // as the outer block div already carries it from AEM.
  // The original HTML shows 'section grey-bg spirit-of-rise'.
  root.classList.add('section', 'grey-bg', 'spirit-of-rise');
  root.append(sectionHeader, performanceDriven);

  block.replaceChildren(root);
}
