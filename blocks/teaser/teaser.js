import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    imageRow,
    imageTitleRow,
    imageLinkRow,
    titleRow,
    descriptionRow,
    ...actionRows
  ] = [...block.children];

  block.innerHTML = '';
  block.classList.add('teaser--right-text', 'teaser--text-align-right', 'aem-GridColumn', 'aem-GridColumn--default--12');

  const cmpTeaser = document.createElement('div');
  cmpTeaser.classList.add('cmp-teaser', 'article-content');
  moveInstrumentation(block, cmpTeaser);

  // Image section
  const cmpTeaserImage = document.createElement('div');
  cmpTeaserImage.classList.add('cmp-teaser__image');

  const cmpImage = document.createElement('div');
  cmpImage.classList.add('cmp-image');
  moveInstrumentation(imageRow, cmpImage);

  // Access the anchor element within the imageLinkRow's div
  const imageLink = imageLinkRow.querySelector('div').querySelector('a');
  const imageAnchor = document.createElement('a');
  imageAnchor.classList.add('cmp-image__link', 'external-link-icon');
  if (imageLink) {
    imageAnchor.href = imageLink.href;
    // Access the text content of the imageTitleRow's div
    imageAnchor.title = imageTitleRow.querySelector('div').textContent.trim();
    imageAnchor.ariaLabel = imageTitleRow.querySelector('div').textContent.trim();
  }

  const picture = imageRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageAnchor.append(optimizedPic);
    }
  }

  const meta = document.createElement('meta');
  meta.setAttribute('itemprop', 'caption');
  meta.setAttribute('content', imageTitleRow.querySelector('div').textContent.trim());

  cmpImage.append(imageAnchor, meta);
  cmpTeaserImage.append(cmpImage);
  cmpTeaser.append(cmpTeaserImage);

  // Content section
  const cmpTeaserContent = document.createElement('div');
  cmpTeaserContent.classList.add('cmp-teaser__content');

  cmpTeaserContent.append(cmpTeaserTitle, cmpTeaserDescription);

  const cmpTeaserTitle = document.createElement('h2');
  cmpTeaserTitle.classList.add('cmp-teaser__title');
  cmpTeaserTitle.textContent = titleRow.querySelector('div').textContent.trim();
  moveInstrumentation(titleRow, cmpTeaserTitle);

  const cmpTeaserDescription = document.createElement('div');
  cmpTeaserDescription.classList.add('cmp-teaser__description');
  cmpTeaserDescription.innerHTML = descriptionRow.querySelector('div').innerHTML;
  moveInstrumentation(descriptionRow, cmpTeaserDescription);

  cmpTeaserContent.append(cmpTeaserTitle, cmpTeaserDescription);

  // Actions section
  if (actionRows.length > 0) {
    const cmpTeaserActionContainer = document.createElement('div');
    cmpTeaserActionContainer.classList.add('cmp-teaser__action-container');

    actionRows.forEach((row) => {
      const [labelCell, linkCell] = [...row.children];

      const actionLink = document.createElement('a');
      actionLink.classList.add('cmp-teaser__action-link');
      moveInstrumentation(row, actionLink);

      const foundLink = linkCell.querySelector('div').querySelector('a');
      if (foundLink) {
        actionLink.href = foundLink.href;
        actionLink.ariaLabel = labelCell.querySelector('div').textContent.trim();
      }
      actionLink.textContent = labelCell.querySelector('div').textContent.trim();

      const srOnlySpan = document.createElement('span');
      srOnlySpan.classList.add('sr-only');
      srOnlySpan.textContent = titleRow.querySelector('div').textContent.trim();
      actionLink.append(' ', srOnlySpan);

      cmpTeaserActionContainer.append(actionLink);
    });
    cmpTeaserContent.append(cmpTeaserActionContainer);
  }

  cmpTeaser.append(cmpTeaserContent);
  block.append(cmpTeaser);
}
