import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headlineRow, pointerImageRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  // The block already has 'service-section' from AEM, do not add it again.
  // section.classList.add('service-section');
  section.id = 'services';
  moveInstrumentation(block, section); // Move block instrumentation to the main section element

  // Container for headline and pointer image
  const topContainer = document.createElement('div');
  topContainer.classList.add('container', 'position-relative');

  // Headline
  if (headlineRow) {
    const h2 = document.createElement('h2');
    moveInstrumentation(headlineRow, h2);
    h2.textContent = headlineRow.textContent.trim();
    topContainer.append(h2);
  }

  // Pointer Image
  if (pointerImageRow) {
    const pointerPicture = pointerImageRow.querySelector('picture');
    if (pointerPicture) {
      const pointerImg = pointerPicture.querySelector('img');
      if (pointerImg) {
        const optimizedPointerPic = createOptimizedPicture(
          pointerImg.src,
          pointerImg.alt,
          false,
          [{ width: '750' }],
        );
        optimizedPointerPic.querySelector('img').classList.add('pointer');
        // moveInstrumentation should be on the picture element, not the inner img
        moveInstrumentation(pointerImageRow, optimizedPointerPic);
        topContainer.append(optimizedPointerPic);
      }
    }
  }
  section.append(topContainer);

  // Container for service cards
  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('container');

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row', 'justify-content-around');

  cardRows.forEach((row) => {
    const [cardLinkCell, cardImageCell, cardTitleCell, cardDescriptionCell, buttonLabelCell] = [
      ...row.children,
    ];

    const cardLink = cardLinkCell.querySelector('a');
    const cardHref = cardLink ? cardLink.href : '#';

    const serviceCard = document.createElement('a');
    serviceCard.href = cardHref;
    serviceCard.classList.add('d-block', 'col-lg-4', 'col-md-6', 'col-12', 'service-card');
    moveInstrumentation(row, serviceCard);

    // Card Image
    const cardPicture = cardImageCell.querySelector('picture');
    if (cardPicture) {
      const cardImg = cardPicture.querySelector('img');
      if (cardImg) {
        const optimizedCardPic = createOptimizedPicture(
          cardImg.src,
          cardImg.alt,
          false,
          [{ width: '750' }],
        );
        optimizedCardPic.querySelector('img').classList.add('img-fluid', 'service-img');
        // moveInstrumentation should be on the picture element, not the inner img
        moveInstrumentation(cardImageCell, optimizedCardPic);
        serviceCard.append(optimizedCardPic);
      }
    }

    // Card Title
    if (cardTitleCell) {
      const h3 = document.createElement('h3');
      h3.textContent = cardTitleCell.textContent.trim();
      moveInstrumentation(cardTitleCell, h3);
      serviceCard.append(h3);
    }

    // Card Description
    if (cardDescriptionCell) {
      const p = document.createElement('p');
      p.innerHTML = cardDescriptionCell.innerHTML;
      moveInstrumentation(cardDescriptionCell, p);
      serviceCard.append(p);
    }

    // Button Label
    if (buttonLabelCell) {
      const button = document.createElement('button');
      button.textContent = buttonLabelCell.textContent.trim();
      moveInstrumentation(buttonLabelCell, button);
      serviceCard.append(button);
    }

    rowDiv.append(serviceCard);
  });

  cardsContainer.append(rowDiv);
  section.append(cardsContainer);

  block.replaceChildren(section);

  // The image optimization loop at the end is redundant because createOptimizedPicture
  // is already called for each image during the initial construction.
  // Removing this loop to prevent double processing and potential issues.
}
