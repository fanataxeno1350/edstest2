import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const cardRows = [...block.children];

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const performaceDrivenCards = document.createElement('div');
  performaceDrivenCards.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

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

    const picture = document.createElement('picture');

    const sourceMobile = document.createElement('source');
    sourceMobile.media = '(max-width: 576px)';
    const mobileImg = imageMobileCell.querySelector('img');
    if (mobileImg) {
      sourceMobile.srcset = mobileImg.src;
    }
    picture.append(sourceMobile);

    const desktopImg = imageDesktopCell.querySelector('img');
    if (desktopImg) {
      const img = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
      picture.append(img.querySelector('img'));
      moveInstrumentation(desktopImg, img.querySelector('img'));
    }

    cardImage.append(picture);

    const performaceDrivenHomeBoxCard = document.createElement('div');
    performaceDrivenHomeBoxCard.classList.add('performace-driven-home-box-card');

    const desc = document.createElement('p');
    desc.classList.add('desc');
    desc.innerHTML = descriptionCell.innerHTML; // richtext cell content

    performaceDrivenHomeBoxCard.append(desc);
    cardWrapper.append(cardImage, performaceDrivenHomeBoxCard);
    cardLink.append(cardWrapper);
    performaceDrivenCards.append(cardLink);
  });

  containerDiv.append(performaceDrivenCards);

  const root = document.createElement('div');
  root.classList.add('performance-driven', 'performace-driven-home'); // Do NOT add the block's own class 'performance-driven-cards'
  root.append(containerDiv);

  block.replaceChildren(root);
}
