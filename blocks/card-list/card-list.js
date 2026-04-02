import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // BlockJson has 3 root fields: heading, cta, cards (container).
  // The 'cards' container itself is block.children[2], and actual card items start from block.children[3].
  // So, we need to skip the cardsWrapperRow when destructuring for cardRows.
  const [headingRow, ctaRow, cardsWrapperRow, ...cardRows] = [...block.children];

  // Main container
  const cmpCardList = document.createElement('div');
  cmpCardList.classList.add('cmp-card-list', 'parallax-child');

  const cmpCardListContent = document.createElement('div');
  cmpCardListContent.classList.add('cmp-card-list__content');
  cmpCardList.append(cmpCardListContent);

  // Top section with heading and CTA
  const slideWrap = document.createElement('div');
  slideWrap.classList.add('slide-wrap');
  cmpCardListContent.append(slideWrap);

  const cmpCardListContentTop = document.createElement('div');
  cmpCardListContentTop.classList.add('cmp-card-list__content__top', 'slide-up');
  cmpCardListContentTop.setAttribute('data-slide-type', 'slide-up');
  slideWrap.append(cmpCardListContentTop);

  // Heading
  const cmpCardListContentHeading = document.createElement('div');
  cmpCardListContentHeading.classList.add('cmp-card-list__content__heading', 'is-visible');
  cmpCardListContentTop.append(cmpCardListContentHeading);

  const cmpCardListContentHeadingTitle = document.createElement('div');
  cmpCardListContentHeadingTitle.classList.add('cmp-card-list__content__heading__title');
  cmpCardListContentHeadingTitle.setAttribute('tabindex', '0');
  moveInstrumentation(headingRow.firstElementChild, cmpCardListContentHeadingTitle);
  while (headingRow.firstElementChild.firstChild) {
    cmpCardListContentHeadingTitle.append(headingRow.firstElementChild.firstChild);
  }
  cmpCardListContentHeading.append(cmpCardListContentHeadingTitle);

  // CTA
  const cmpCardListContentCtaWrapper = document.createElement('div');
  cmpCardListContentCtaWrapper.classList.add('cmp-card-list__content__cta-wrapper', 'is-visible');
  cmpCardListContentTop.append(cmpCardListContentCtaWrapper);

  const ctaLink = ctaRow.querySelector('a');
  if (ctaLink) {
    const cta = document.createElement('a');
    cta.classList.add('cta', 'cta__primary');
    cta.href = ctaLink.href;
    cta.target = ctaLink.target || '_self';
    cta.setAttribute('aria-label', ctaLink.textContent.trim());
    cta.setAttribute('data-palette', 'palette-1');

    const ctaIcon = document.createElement('span');
    ctaIcon.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
    ctaIcon.setAttribute('aria-hidden', 'true');
    cta.append(ctaIcon);

    const ctaLabel = document.createElement('span');
    ctaLabel.classList.add('cta__label');
    ctaLabel.textContent = ctaLink.textContent.trim();
    cta.append(ctaLabel);

    moveInstrumentation(ctaRow.firstElementChild, cta);
    cmpCardListContentCtaWrapper.append(cta);
  }

  // Cards section
  const cmpCardListContentItems = document.createElement('div');
  cmpCardListContentItems.classList.add('cmp-card-list__content__items');
  cmpCardListContent.append(cmpCardListContentItems);

  cardRows.forEach((row, index) => {
    // Each card item has 3 cells: image, title, description
    const [imageCell, titleCell, descriptionCell] = [...row.children];

    const cardItem = document.createElement('div');
    cardItem.classList.add('cmp-card-list__content__card-item', 'is-visible', 'slide-up');
    cardItem.setAttribute('data-animation', 'card');
    cardItem.setAttribute('data-slide-type', 'slide-up');
    cardItem.setAttribute('data-slide-no-wrap', '');
    cardItem.setAttribute('data-slide-delay', `${index * 100}`.padStart(3, '0'));
    cardItem.style.transitionDelay = `${index * 0.2}s`;
    moveInstrumentation(row, cardItem);

    // Image
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('cmp-card-list__content__card-item__image');
      optimizedImg.setAttribute('loading', 'lazy');
      moveInstrumentation(img, optimizedImg);
      cardItem.append(optimizedPic);
    }

    const cardItemContent = document.createElement('div');
    cardItemContent.classList.add('cmp-card-list__content__card-item-content');
    cardItem.append(cardItemContent);

    // Title
    const headingWrapper = document.createElement('div');
    headingWrapper.classList.add('cmp-card-list__content__card-item-content__heading-wrapper');
    headingWrapper.setAttribute('tabindex', '0');
    cardItemContent.append(headingWrapper);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('cmp-card-list__content__card-item-content__title');
    titleDiv.setAttribute('aria-hidden', 'false');
    moveInstrumentation(titleCell, titleDiv);
    while (titleCell.firstChild) {
      titleDiv.append(titleCell.firstChild);
    }
    headingWrapper.append(titleDiv);

    // Description
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('cmp-card-list__content__card-item-content__description');
    descriptionDiv.setAttribute('tabindex', '0');
    // The original HTML uses the full HTML content of the description cell for aria-label,
    // but the JS was using textContent.trim(). Let's align with the original HTML's aria-label content.
    descriptionDiv.setAttribute('aria-label', descriptionCell.innerHTML.trim());
    descriptionDiv.setAttribute('aria-hidden', 'false');
    moveInstrumentation(descriptionCell, descriptionDiv);
    while (descriptionCell.firstChild) {
      descriptionDiv.append(descriptionCell.firstChild);
    }
    cardItemContent.append(descriptionDiv);

    cmpCardListContentItems.append(cardItem);
  });

  block.textContent = '';
  block.append(cmpCardList);
}
