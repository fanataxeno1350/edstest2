import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const linkElement = block.querySelector('a');
  const linkHref = linkElement ? linkElement.href : '#';

  const cardLink = document.createElement('a');
  cardLink.href = linkHref;
  cardLink.className = 'card-card card-cmp-card--recipe card-cmp-card--aashirvaad-recipe card-color-background-background-2';
  cardLink.tabIndex = 0;

  const cardCmpCard = document.createElement('div');
  cardCmpCard.className = 'card-cmp-card';

  const cardCmpCardContent = document.createElement('div');
  cardCmpCardContent.className = 'card-cmp-card__content';

  const cardCmpCardMedia = document.createElement('div');
  cardCmpCardMedia.className = 'card-cmp-card__media';

  const cardCmpCardOptions = document.createElement('div');
  cardCmpCardOptions.className = 'card-cmp-card__options';

  const cardCmpCardThreeDots = document.createElement('div');
  cardCmpCardThreeDots.className = 'card-cmp-card__three-dots card-icon-open-card-popup';
  cardCmpCardOptions.append(cardCmpCardThreeDots);

  const cardCmpCardImage = document.createElement('div');
  cardCmpCardImage.className = 'card-cmp-card__image';

  const cardLazyImageContainer = document.createElement('div');
  cardLazyImageContainer.className = 'card-lazy-image-container';

  const imageElement = block.querySelector('[data-aue-prop="image"]');
  if (imageElement) {
    const picture = createOptimizedPicture(imageElement.src, imageElement.alt);
    cardLazyImageContainer.append(picture);
    moveInstrumentation(imageElement, picture);
  }

  cardCmpCardImage.append(cardLazyImageContainer);

  cardCmpCardMedia.append(cardCmpCardOptions, cardCmpCardImage);

  const cardCmpCardInfo = document.createElement('div');
  cardCmpCardInfo.className = 'card-cmp-card__info';

  const cardCmpCardTag = document.createElement('div');
  cardCmpCardTag.className = 'card-cmp-card__tag card-cmp-card__tag--with-heart';

  const cardCmpCardTagWrapper = document.createElement('div');
  cardCmpCardTagWrapper.className = 'card-cmp-card__tag-wrapper';
  const tagP = document.createElement('p');
  const tagContent = block.querySelector('[data-aue-prop="tag"]');
  if (tagContent) {
    tagP.append(...tagContent.childNodes);
    moveInstrumentation(tagContent, tagP);
  } else {
    const firstP = block.querySelector('p');
    if (firstP) {
      tagP.append(...firstP.childNodes);
      moveInstrumentation(firstP, tagP);
    }
  }
  cardCmpCardTagWrapper.append(tagP);

  const cardCmpCardHeartsWrapper = document.createElement('div');
  cardCmpCardHeartsWrapper.className = 'card-cmp-card__hearts-wrapper card-hidden';
  const heartIcon = document.createElement('div');
  heartIcon.className = 'card-cmp-card__icon card-icon-favorite_FILL1_wght400_GRAD0_opsz20';
  const heartP = document.createElement('p');
  cardCmpCardHeartsWrapper.append(heartIcon, heartP);

  cardCmpCardTag.append(cardCmpCardTagWrapper, cardCmpCardHeartsWrapper);

  const cardCmpCardTitle = document.createElement('div');
  cardCmpCardTitle.className = 'card-cmp-card__title';
  const titleH4 = document.createElement('h4');
  const titleContent = block.querySelector('[data-aue-prop="title"]');
  if (titleContent) {
    titleH4.append(...titleContent.childNodes);
    moveInstrumentation(titleContent, titleH4);
  }
  cardCmpCardTitle.append(titleH4);

  const cardCmpCardRecipeFooter = document.createElement('div');
  cardCmpCardRecipeFooter.className = 'card-cmp-card__recipe_footer';

  const cardCmpCardTimeInMinutes = document.createElement('div');
  cardCmpCardTimeInMinutes.className = 'card-cmp-card__time-in-minutes';
  const timeIcon = document.createElement('div');
  timeIcon.className = 'card-cmp-card__icon card-icon-Group-21690';
  const timeP = document.createElement('p');
  const timeContent = block.querySelector('[data-aue-prop="time"]');
  if (timeContent) {
    timeP.append(...timeContent.childNodes);
    moveInstrumentation(timeContent, timeP);
  }
  cardCmpCardTimeInMinutes.append(timeIcon, timeP);

  const cardCmpCardDifficultyLevel = document.createElement('div');
  cardCmpCardDifficultyLevel.className = 'card-cmp-card__difficulty-level card-icon-chef-cap';
  const difficultyIcon = document.createElement('div');
  difficultyIcon.className = 'card-cmp-card__icon card-path1';
  const difficultyP = document.createElement('p');
  const difficultyContent = block.querySelector('[data-aue-prop="difficulty"]');
  if (difficultyContent) {
    difficultyP.append(...difficultyContent.childNodes);
    moveInstrumentation(difficultyContent, difficultyP);
  }
  cardCmpCardDifficultyLevel.append(difficultyIcon, difficultyP);

  cardCmpCardRecipeFooter.append(cardCmpCardTimeInMinutes, cardCmpCardDifficultyLevel);

  cardCmpCardInfo.append(cardCmpCardTag, cardCmpCardTitle, cardCmpCardRecipeFooter);

  cardCmpCardContent.append(cardCmpCardMedia, cardCmpCardInfo);
  cardCmpCard.append(cardCmpCardContent);
  cardLink.append(cardCmpCard);

  block.textContent = '';
  block.append(cardLink);
  block.className = `card block`;
  block.dataset.blockStatus = 'loaded';

  if (linkElement) {
    moveInstrumentation(linkElement, cardLink);
  }
}
