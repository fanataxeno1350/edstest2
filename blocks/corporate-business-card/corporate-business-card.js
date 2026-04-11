import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, ...itemRows] = [...block.children];

  const gContainer = document.createElement('div');
  gContainer.classList.add('g-container');

  if (titleRow) {
    const titleP = document.createElement('p');
    moveInstrumentation(titleRow.firstElementChild, titleP);
    titleP.classList.add('business-card-title');
    titleP.innerHTML = titleRow.firstElementChild.innerHTML;
    gContainer.append(titleP);

    const hr = document.createElement('hr');
    hr.classList.add('business-card-title-hr');
    gContainer.append(hr);
  }

  const businessCardContainer = document.createElement('div');
  businessCardContainer.classList.add('business-card-container');

  itemRows.forEach((row) => {
    const businessCardItem = document.createElement('div');
    moveInstrumentation(row, businessCardItem);
    businessCardItem.classList.add('business-card-item');

    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    businessCardItem.append(overlay);

    const businessCardItemAssets = document.createElement('div');
    businessCardItemAssets.classList.add('business-card-item-assets');

    const businessCardItemInfo = document.createElement('div');
    businessCardItemInfo.classList.add('business-card-item-info');

    let backgroundPicture;
    let logoPicture;
    let headingDiv;
    let subtitleP;
    let linkA;

    const cells = [...row.children];

    // Content detection for cells based on BlockJson and HTML structure
    const backgroundCell = cells[0]; // First cell is always background image
    const logoCell = cells[1];       // Second cell is always logo
    const headingCell = cells[2];    // Third cell is always heading
    const subtitleCell = cells[3];   // Fourth cell is always subtitle
    const linkCell = cells[4];       // Fifth cell is always link

    if (backgroundCell) {
      backgroundPicture = backgroundCell.querySelector('picture');
      if (backgroundPicture) {
        moveInstrumentation(backgroundCell, backgroundPicture);
        businessCardItemAssets.append(backgroundPicture);
      }
    }

    if (logoCell) {
      logoPicture = logoCell.querySelector('picture');
      if (logoPicture) {
        const logoDiv = document.createElement('div');
        logoDiv.classList.add('business-card-item-logo');
        moveInstrumentation(logoCell, logoDiv);
        logoDiv.append(logoPicture);
        businessCardItemInfo.append(logoDiv);
      }
    }

    if (headingCell) {
      headingDiv = document.createElement('div');
      headingDiv.classList.add('business-card-item-title');
      const h3 = document.createElement('h3');
      moveInstrumentation(headingCell, h3);
      h3.innerHTML = headingCell.innerHTML;
      headingDiv.append(h3);
    }

    if (subtitleCell) {
      subtitleP = document.createElement('p');
      subtitleP.classList.add('business-card-item-subtitle');
      moveInstrumentation(subtitleCell, subtitleP);
      subtitleP.innerHTML = subtitleCell.innerHTML;
    }

    if (linkCell) {
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        linkA = document.createElement('a');
        linkA.classList.add('button', 'button-primary-white');
        linkA.href = foundLink.href;
        linkA.textContent = foundLink.textContent;
        // Check for target and rel attributes from the original link
        if (foundLink.target) linkA.target = foundLink.target;
        if (foundLink.rel) linkA.rel = foundLink.rel;
        moveInstrumentation(linkCell, linkA);
      }
    }

    const businessCardItemDesc = document.createElement('div');
    businessCardItemDesc.classList.add('business-card-item-desc');
    if (headingDiv) businessCardItemDesc.append(headingDiv);
    if (subtitleP) businessCardItemDesc.append(subtitleP);
    if (linkA) businessCardItemDesc.append(linkA);

    businessCardItemInfo.append(businessCardItemDesc);

    businessCardItem.append(businessCardItemAssets);
    businessCardItem.append(businessCardItemInfo);
    businessCardContainer.append(businessCardItem);

    // Interactivity: Add event listener for the entire business card item
    // The original HTML shows video elements within business-card-item-assets.
    // While the JS doesn't directly create these, if they are present in the
    // source HTML, we should ensure any interaction (like play/pause) is handled.
    // For now, assuming the overlay might be interactive or the card itself.
    // If the card itself is clickable to navigate, we can add a listener here.
    // Based on the original HTML, the 'Explore' link is the primary interaction.
    // The video elements have their own controls, so no explicit listener needed on the card.
    // However, if the overlay is meant to trigger something, we'd add it here.
    // For now, no explicit interactivity beyond the link is detected from the provided HTML.
  });

  gContainer.append(businessCardContainer);
  block.textContent = '';
  block.append(gContainer);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
