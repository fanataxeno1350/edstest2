import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure root rows based on BlockJson model
  const [sectionTitleRow, pointerImageRow, ...serviceCardRows] = [...block.children];

  const section = document.createElement('section');
  // section.classList.add('service-section'); // Removed: block already has this class from AEM
  section.id = 'services'; // ID is allowed as it's not a class

  const container1 = document.createElement('div');
  container1.classList.add('container', 'position-relative');

  const title = document.createElement('h2');
  moveInstrumentation(sectionTitleRow, title);
  title.textContent = sectionTitleRow.textContent.trim();
  container1.append(title);

  const pointerPicture = pointerImageRow.querySelector('picture');
  if (pointerPicture) {
    const pointerImg = pointerPicture.querySelector('img');
    const optimizedPointerPic = createOptimizedPicture(pointerImg.src, pointerImg.alt, false, [{ width: '750' }]);
    const newPointerImg = optimizedPointerPic.querySelector('img');
    newPointerImg.classList.add('pointer');
    moveInstrumentation(pointerImageRow, newPointerImg);
    container1.append(optimizedPointerPic);
  }

  section.append(container1);

  const container2 = document.createElement('div');
  container2.classList.add('container');

  const row = document.createElement('div');
  row.classList.add('row', 'justify-content-around');

  serviceCardRows.forEach((cardRow) => {
    // Destructure cells for service-card-item based on BlockJson model
    const [cardLinkCell, cardImageCell, cardTitleCell, cardDescriptionCell, ctaLabelCell] = [...cardRow.children];

    const cardLink = cardLinkCell.querySelector('a');
    const cardHref = cardLink ? cardLink.href : '#';

    const serviceCard = document.createElement('a');
    serviceCard.classList.add('d-block', 'col-lg-4', 'col-md-6', 'col-12', 'service-card');
    serviceCard.href = cardHref;
    moveInstrumentation(cardRow, serviceCard);

    const cardPicture = cardImageCell.querySelector('picture');
    if (cardPicture) {
      const cardImg = cardPicture.querySelector('img');
      const optimizedCardPic = createOptimizedPicture(cardImg.src, cardImg.alt, false, [{ width: '750' }]);
      const newCardImg = optimizedCardPic.querySelector('img');
      newCardImg.classList.add('img-fluid', 'service-img');
      serviceCard.append(optimizedCardPic);
    }

    const cardTitle = document.createElement('h3');
    cardTitle.textContent = cardTitleCell.textContent.trim();
    serviceCard.append(cardTitle);

    const cardDescription = document.createElement('p');
    // cardDescription is a richtext field, so innerHTML is correct.
    // The original HTML shows <p> inside the cell, so assigning to <p> will create <p><p>...</p></p>.
    // It's better to use a <div> for richtext content to avoid invalid nesting.
    const cardDescriptionDiv = document.createElement('div'); // Changed to div
    cardDescriptionDiv.innerHTML = cardDescriptionCell.innerHTML;
    serviceCard.append(cardDescriptionDiv); // Appending the div

    const ctaButton = document.createElement('button');
    ctaButton.textContent = ctaLabelCell.textContent.trim();
    serviceCard.append(ctaButton);

    row.append(serviceCard);
  });

  container2.append(row);
  section.append(container2);

  block.replaceChildren(section);
}
