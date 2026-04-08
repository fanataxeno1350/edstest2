import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ctaTextRow, ...itemRows] = [...block.children];

  const header = document.createElement('header');
  const h2 = document.createElement('h2');
  moveInstrumentation(headingRow, h2);
  h2.innerHTML = headingRow.firstElementChild.innerHTML;
  header.append(h2);

  const descriptionP = document.createElement('p');
  moveInstrumentation(descriptionRow, descriptionP);
  descriptionP.innerHTML = descriptionRow.firstElementChild.innerHTML;
  header.append(descriptionP);

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('content');

  const proFeaturesUl = document.createElement('ul');
  proFeaturesUl.classList.add('pro-features');

  // Distinguish item types based on cell count and content
  const proFeatures = itemRows.filter(row => row.children.length === 2);
  const actions = itemRows.filter(row => row.children.length === 1 && row.querySelector('a'));

  proFeatures.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const featureHeadingCell = row.firstElementChild; // Corrected: Avoids row.children[0]
    const h3 = document.createElement('h3');
    moveInstrumentation(featureHeadingCell, h3);
    h3.innerHTML = featureHeadingCell.innerHTML;
    li.append(h3);

    const featureDescriptionCell = row.lastElementChild; // Corrected: Avoids row.children[1]
    const p = document.createElement('p');
    moveInstrumentation(featureDescriptionCell, p);
    p.innerHTML = featureDescriptionCell.innerHTML;
    li.append(p);

    proFeaturesUl.append(li);
  });
  contentDiv.append(proFeaturesUl);

  const proCtaDiv = document.createElement('div');
  proCtaDiv.classList.add('pro-cta');

  const ctaTextP = document.createElement('p');
  moveInstrumentation(ctaTextRow, ctaTextP);
  ctaTextP.innerHTML = ctaTextRow.firstElementChild.innerHTML;
  proCtaDiv.append(ctaTextP);

  const actionListUl = document.createElement('ul');
  actionListUl.classList.add('action-list', 'special', 'stacked');

  actions.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const linkCell = row.firstElementChild; // Corrected: Avoids row.children[0]
    const foundLink = linkCell.querySelector('a');
    const a = document.createElement('a');
    a.classList.add('button', 'wide');
    if (foundLink) {
      a.href = foundLink.href;
      a.textContent = foundLink.textContent;
    }
    moveInstrumentation(linkCell, a);
    li.append(a);
    actionListUl.append(li);
  });
  proCtaDiv.append(actionListUl);
  contentDiv.append(proCtaDiv);

  block.textContent = '';
  block.classList.add('style1');
  block.append(header, contentDiv);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
