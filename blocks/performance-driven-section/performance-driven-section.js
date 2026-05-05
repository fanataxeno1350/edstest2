import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'spirit-of-rise');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  // Destructure the first two rows for heading and description
  const [headingRow, descriptionRow, ...cardRows] = children;

  moveInstrumentation(headingRow, sectionHeader);
  moveInstrumentation(descriptionRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.textContent.trim(); // Read text content directly from the row
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.textContent = descriptionRow.textContent.trim(); // Read text content directly from the row
  sectionHeader.append(description);

  section.append(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  // cardRows already contains the remaining rows
  cardRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, cardDescriptionCell, cardLinkCell] = [...row.children];

    const link = document.createElement('a');
    link.classList.add('performace-driven-cards-link');
    const cardLink = cardLinkCell.querySelector('a');
    if (cardLink) {
      link.href = cardLink.href;
      // Move data-aue-resource from the original <a> to the new <a>
      if (cardLink.dataset.aueResource) {
        link.dataset.aueResource = cardLink.dataset.aueResource;
      }
    }
    moveInstrumentation(row, link);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

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
        combinedPicture.append(img);
      }
      cardImage.append(combinedPicture);
    } else if (pictureDesktop) {
      cardImage.append(pictureDesktop);
    } else if (pictureMobile) {
      cardImage.append(pictureMobile);
    }

    cardWrapper.append(cardImage);

    const cardBox = document.createElement('div');
    cardBox.classList.add('performace-driven-home-box-card');

    // Card Description is type=text, but ORIGINAL HTML shows <br/> so it's treated as richtext.
    // Use a div for richtext to avoid <p> inside <p> issues.
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('desc');
    descriptionDiv.innerHTML = cardDescriptionCell.innerHTML;
    cardBox.append(descriptionDiv);

    cardWrapper.append(cardBox);
    link.append(cardWrapper);
    cardsWrapper.append(link);
  });

  container.append(cardsWrapper);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
