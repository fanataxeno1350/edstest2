import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subtitleRow, ...cardRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const subtitle = document.createElement('p');
  moveInstrumentation(subtitleRow, subtitle);
  subtitle.textContent = subtitleRow.textContent.trim();
  sectionHeader.append(subtitle);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, descriptionCell, cardLinkCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = cardLinkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // From ORIGINAL HTML
    }
    moveInstrumentation(row, cardLink);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    const pictureMobile = imageMobileCell.querySelector('picture');

    if (pictureDesktop || pictureMobile) {
      const picture = document.createElement('picture');
      if (pictureMobile) {
        const imgMobile = pictureMobile.querySelector('img');
        if (imgMobile) {
          const optimizedPicMobile = createOptimizedPicture(imgMobile.src, imgMobile.alt, false, [{ width: '576' }]);
          const sourceMobile = optimizedPicMobile.querySelector('source');
          if (sourceMobile) {
            sourceMobile.media = '(max-width: 576px)';
            picture.append(sourceMobile);
          }
        }
      }
      if (pictureDesktop) {
        const imgDesktop = pictureDesktop.querySelector('img');
        if (imgDesktop) {
          const optimizedPicDesktop = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
          const imgElement = optimizedPicDesktop.querySelector('img');
          if (imgElement) {
            picture.append(imgElement);
          }
        }
      }
      cardImage.append(picture);
    }
    cardWrapper.append(cardImage);

    const cardBox = document.createElement('div');
    cardBox.classList.add('performace-driven-home-box-card');

    const description = document.createElement('p');
    description.classList.add('desc');
    description.innerHTML = descriptionCell.innerHTML;
    cardBox.append(description);

    cardWrapper.append(cardBox);
    cardLink.append(cardWrapper);
    cardsWrapper.append(cardLink);
  });

  container.append(cardsWrapper);
  performanceDriven.append(container);

  block.replaceChildren(sectionHeader, performanceDriven);
}
