import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add('performace-driven-cards');

  [...block.children].forEach((row) => {
    // Each row is a 'performace-driven-card-item'
    // BlockJson model for 'performace-driven-card-item' has 3 fields: link (aem-content), image (reference), description (text)
    const [linkCell, imageCell, descriptionCell] = [...row.children];

    const linkEl = document.createElement('a');
    linkEl.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.target = '_blank'; // Original HTML has target="_blank"
    }

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        picture.replaceWith(optimizedPic);
      }
      cardImageDiv.append(picture);
    }
    cardWrapper.append(cardImageDiv);

    const homeBoxCardDiv = document.createElement('div');
    homeBoxCardDiv.classList.add('performace-driven-home-box-card');

    const descP = document.createElement('p');
    descP.classList.add('desc');
    // The description field is type=text, but the ORIGINAL HTML shows it can contain <br> tags.
    // Using innerHTML ensures any such formatting is preserved.
    descP.innerHTML = descriptionCell.innerHTML.trim(); 

    homeBoxCardDiv.append(descP);
    cardWrapper.append(homeBoxCardDiv);

    moveInstrumentation(row, linkEl);
    linkEl.append(cardWrapper);
    row.replaceWith(linkEl);
  });
}
