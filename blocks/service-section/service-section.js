import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0.5: Remove block's own class from inner wrapper.
  // The outer block div already has 'service-section' from AEM.
  const section = document.createElement('section');
  section.id = 'services'; // Keep other classes/attributes from ORIGINAL HTML

  const [headlineRow, pointerImageRow, ...serviceCardRows] = [...block.children];

  // Section Headline
  const headlineContainer = document.createElement('div');
  headlineContainer.classList.add('container', 'position-relative');
  const headline = document.createElement('h2');
  moveInstrumentation(headlineRow, headline);
  headline.textContent = headlineRow.textContent.trim();
  headlineContainer.append(headline);

  // Pointer Image
  const pointerPicture = pointerImageRow.querySelector('picture');
  if (pointerPicture) {
    const pointerImg = pointerPicture.querySelector('img');
    const optimizedPointerPic = createOptimizedPicture(
      pointerImg.src,
      pointerImg.alt,
      false,
      [{ width: '750' }],
    );
    optimizedPointerPic.querySelector('img').classList.add('pointer');
    moveInstrumentation(pointerImageRow, optimizedPointerPic.querySelector('img'));
    headlineContainer.append(optimizedPointerPic);
  }
  section.append(headlineContainer);

  // Service Cards
  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('container');
  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row', 'justify-content-around');

  serviceCardRows.forEach((row) => {
    // CHECK 0: Replaced querySelector('div:nth-child(n)') with array destructuring for fixed-schema item rows.
    const [cardLinkCell, cardImageCell, cardTitleCell, cardDescriptionCell, buttonLabelCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('d-block', 'col-lg-4', 'col-md-6', 'col-12', 'service-card');
    const foundLink = cardLinkCell?.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
    }

    if (cardImageCell) {
      const picture = cardImageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('img-fluid', 'service-img');
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardLink.append(optimizedPic);
      }
    }

    if (cardTitleCell) {
      const cardTitle = document.createElement('h3');
      cardTitle.textContent = cardTitleCell.textContent.trim();
      cardLink.append(cardTitle);
    }

    if (cardDescriptionCell) {
      // CHECK 0.7 B: Changed <p> to <div> for richtext content to avoid <p> inside <p>
      const cardDescription = document.createElement('div');
      cardDescription.innerHTML = cardDescriptionCell.innerHTML;
      cardLink.append(cardDescription);
    }

    if (buttonLabelCell) {
      const button = document.createElement('button');
      button.textContent = buttonLabelCell.textContent.trim();
      cardLink.append(button);
    }
    moveInstrumentation(row, cardLink);
    rowDiv.append(cardLink);
  });

  cardsContainer.append(rowDiv);
  section.append(cardsContainer);

  block.replaceChildren(section);
}
