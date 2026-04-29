import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure block children based on BlockJson model:
  // 1. section-description (richtext)
  // 2. cards (container for card-item rows)
  // 3. explore-all-link (aem-content)
  // The block.children array will contain:
  // [sectionDescriptionRow, exploreAllLinkRow, ...cardItemRows]
  // This is because the 'cards' container field in BlockJson means the item rows
  // for 'cards' are directly children of the block, after the root fields.
  const blockChildren = [...block.children];

  // Find the section description row (first row)
  const sectionDescriptionRow = blockChildren[0];
  // Find the explore all link row (second row)
  const exploreAllLinkRow = blockChildren[1];
  // Remaining rows are card items
  const cardItemRows = blockChildren.slice(2);

  // Section Description
  const sectionDescriptionDiv = document.createElement('div');
  sectionDescriptionDiv.classList.add('text', 'desc-1');
  const sectionDescriptionCmpText = document.createElement('div');
  sectionDescriptionCmpText.classList.add('cmp-text');

  // The section-description field is richtext, so we need to read its innerHTML
  // and move all its children.
  // The original HTML shows: <div><div><p>...</p></div></div>
  // So, sectionDescriptionRow.firstElementChild is the inner div containing the <p>.
  if (sectionDescriptionRow && sectionDescriptionRow.firstElementChild) {
    moveInstrumentation(sectionDescriptionRow.firstElementChild, sectionDescriptionCmpText);
    // Move all children (e.g., <p>, <h3>, <h2>) from the source cell to the new div
    while (sectionDescriptionRow.firstElementChild.firstChild) {
      sectionDescriptionCmpText.append(sectionDescriptionRow.firstElementChild.firstChild);
    }
  }
  sectionDescriptionDiv.append(sectionDescriptionCmpText);

  // Cards Container
  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('cards');

  const cmpCardBlogDetails = document.createElement('div');
  cmpCardBlogDetails.classList.add('cmp-card--blog-details', 'cmp-card--default');
  const cmpCardContainer = document.createElement('div');
  cmpCardContainer.classList.add('cmp-card__container');

  cardItemRows.forEach((row) => {
    // Each card item row has 6 cells as per BlockJson 'card-item' model
    const [
      cardLinkCell,
      cardImageCell,
      imageAltTextCell, // Not used in current rendering logic, but read for completeness
      imageTitleCell,   // Not used in current rendering logic, but read for completeness
      metaCell,
      cardTitleCell,
    ] = [...row.children];

    const cardLink = document.createElement('a');
    const foundLink = cardLinkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // Assuming target blank from original HTML
    }
    moveInstrumentation(cardLinkCell, cardLink);

    const cmpCardContent = document.createElement('div');
    cmpCardContent.classList.add('cmp-card__content');
    cmpCardContent.tabIndex = 0;

    const cmpCardMedia = document.createElement('div');
    cmpCardMedia.classList.add('cmp-card__media', 'youtube-url-wrapper');

    const picture = cardImageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
          { media: '(max-width:767px)', width: '360' },
          { width: '750' },
        ]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cmpCardMedia.append(optimizedPic);
      }
    }
    cmpCardContent.append(cmpCardMedia);

    const cmpCardInfo = document.createElement('div');
    cmpCardInfo.classList.add('cmp-card__info');

    const cmpCardTitle = document.createElement('div');
    cmpCardTitle.classList.add('cmp-card__title');
    const metaP = document.createElement('p');
    metaP.classList.add('body-2');
    metaP.textContent = metaCell.textContent.trim();
    cmpCardTitle.append(metaP);
    cmpCardInfo.append(cmpCardTitle);

    const cmpCardDescription = document.createElement('div');
    cmpCardDescription.classList.add('cmp-card__description');
    const titleH4 = document.createElement('h4');
    titleH4.textContent = cardTitleCell.textContent.trim();
    cmpCardDescription.append(titleH4);
    cmpCardInfo.append(cmpCardDescription);

    cmpCardContent.append(cmpCardInfo);
    cardLink.append(cmpCardContent);
    cmpCardContainer.append(cardLink);
  });

  cmpCardBlogDetails.append(cmpCardContainer);
  cardsContainer.append(cmpCardBlogDetails);

  // Explore All Link
  const exploreMoreDiv = document.createElement('div');
  exploreMoreDiv.classList.add('exploremore', 'button', 'cmp-button--secondary');
  const exploreAllAnchor = document.createElement('a');
  exploreAllAnchor.classList.add('cmp-button');

  // The explore-all-link field is aem-content, so we read the href from the <a> tag
  // and preserve its original text content.
  if (exploreAllLinkRow && exploreAllLinkRow.firstElementChild) {
    const foundExploreLink = exploreAllLinkRow.firstElementChild.querySelector('a');
    if (foundExploreLink) {
      exploreAllAnchor.href = foundExploreLink.href;
      // Move the original text content (e.g., "Explore All") from the link cell
      // to the new span, preserving instrumentation.
      const exploreAllSpan = document.createElement('span');
      exploreAllSpan.classList.add('cmp-button__text');
      moveInstrumentation(foundExploreLink, exploreAllSpan);
      exploreAllSpan.textContent = foundExploreLink.textContent.trim();
      exploreAllAnchor.append(exploreAllSpan);
    }
  }
  moveInstrumentation(exploreAllLinkRow, exploreAllAnchor); // Move instrumentation from the row itself
  exploreMoreDiv.append(exploreAllAnchor);
  cardsContainer.append(exploreMoreDiv);

  // Assemble the block
  block.innerHTML = ''; // Clear the original block content
  block.append(sectionDescriptionDiv, cardsContainer);
}
