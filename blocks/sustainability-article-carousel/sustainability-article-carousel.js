import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, ...cardRows] = [...block.children];

  block.classList.add('grid-container', 'bg--paper-green', 'animate-enter', 'in-view');

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('max-width-container');

  const gridXTitle = document.createElement('div');
  gridXTitle.classList.add('grid-x');

  const cellTitle = document.createElement('div');
  cellTitle.classList.add('cell', 'small-12', 'large-10', 'large-offset-1', 'xlarge-8', 'xlarge-offset-2');

  const textSection = document.createElement('div');
  textSection.classList.add('sustainability-article-carousel__text-section');

  const titleElement = document.createElement('h2');
  titleElement.classList.add('sustainability-article-carousel__title', 'animate-enter-fade-up-short');
  moveInstrumentation(titleRow.firstElementChild, titleElement);
  titleElement.innerHTML = titleRow.firstElementChild.innerHTML;

  textSection.append(titleElement);
  cellTitle.append(textSection);
  gridXTitle.append(cellTitle);
  maxWidthContainer.append(gridXTitle);
  block.append(maxWidthContainer);

  const gridXWrapper = document.createElement('div');
  gridXWrapper.classList.add('grid-x');

  const cellWrapper = document.createElement('div');
  cellWrapper.classList.add('cell', 'small-12', 'large-offset-1', 'large-11', 'sustainability-article-carousel__wrapper');

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper', 'swipper--full-view-padding', 'sustainability-article-carousel__wrapper--inner', 'swiper-initialized', 'swiper-horizontal', 'swiper-backface-hidden');

  const createButtonControl = (direction) => {
    const btnControl = document.createElement('div');
    btnControl.classList.add('sustainability-article-carousel__btn-control', `sustainability-article-carousel--${direction}`, 'show-for-large');
    const button = document.createElement('button');
    button.classList.add('swiper-control', 'swiper-button', `swiper--${direction}`, 'elevation-1');
    button.setAttribute('aria-label', `${direction === 'prev' ? 'Previous' : 'Next'} slide`);
    const img = document.createElement('img');
    img.alt = 'svg file';
    // The original HTML uses hardcoded SVG paths, but these should be dynamic.
    // Since the model doesn't provide image for buttons, we'll use generic placeholders.
    // In a real scenario, these would come from a model field.
    img.src = direction === 'prev' ? '/icons/icon-arrow-left.svg' : '/icons/icon-arrow-right.svg';
    button.append(img);
    btnControl.append(button);
    return { btnControl, button };
  };

  const { btnControl: prevBtnControl, button: prevButton } = createButtonControl('prev');
  const { btnControl: nextBtnControl, button: nextButton } = createButtonControl('next');

  swiperContainer.append(prevBtnControl, nextBtnControl);

  const ul = document.createElement('ul');
  ul.classList.add('swiper-wrapper', 'sustainability-article-carousel__list');
  ul.setAttribute('aria-live', 'polite');

  cardRows.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add('swiper-slide', 'sustainability-article-carousel__list-item', 'animate-enter-fade-left-short', 'animate-delay-1');

    const linkEl = document.createElement('a');
    linkEl.classList.add('sustainability-card', 'elevation-2', 'has-hover');

    let linkHref = '';
    let imagePicture = null;
    let tagText = '';
    let cardTitleText = '';
    let descriptionHtml = '';
    let readingDuration = '';
    let readingDurationSuffix = '';

    const cells = [...row.children];
    // Based on BlockJson and EDS structure:
    // cell[0]: link (aem-content)
    // cell[1]: image (reference)
    // cell[2]: tag (text)
    // cell[3]: title (text)
    // cell[4]: description (richtext)
    // cell[5]: readingDuration (text)
    // cell[6]: readingDurationSuffix (text)

    const linkCell = cells.find((cell) => cell.querySelector('a'));
    if (linkCell) {
      linkHref = linkCell.querySelector('a').href;
      linkEl.setAttribute('aria-label', linkCell.querySelector('a').textContent.trim());
    }

    const imageCell = cells.find((cell) => cell.querySelector('picture'));
    if (imageCell) {
      imagePicture = imageCell.querySelector('picture');
    }

    // Find tag, title, description, readingDuration, readingDurationSuffix by content type and order
    // This assumes the order of text/richtext cells is consistent after link and image.
    const textCells = cells.filter((cell) => !cell.querySelector('a') && !cell.querySelector('picture'));
    if (textCells.length >= 5) { // Ensure there are enough text cells for tag, title, description, duration, suffix
      tagText = textCells[0].textContent.trim();
      cardTitleText = textCells[1].textContent.trim();
      descriptionHtml = textCells[2].innerHTML; // richtext
      readingDuration = textCells[3].textContent.trim();
      readingDurationSuffix = textCells[4].textContent.trim();
    }

    linkEl.href = linkHref;

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('sustainability-card__img-container', 'animate-enter-fade', 'animate-delay-5');

    const tagDiv = document.createElement('div');
    tagDiv.classList.add('sustainability-card__tag');
    const tagInner = document.createElement('div');
    tagInner.classList.add('tag', 'bg--brand-green');
    const tagLabel = document.createElement('span');
    tagLabel.classList.add('tag__label');
    tagLabel.textContent = tagText;
    tagInner.append(tagLabel);
    tagDiv.append(tagInner);
    imgContainer.append(tagDiv);

    if (imagePicture) {
      const img = imagePicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imgContainer.append(optimizedPic);
    }

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('sustainability-card__content');

    const contentInnerDiv = document.createElement('div');

    const cardTitleDiv = document.createElement('div');
    cardTitleDiv.classList.add('sustainability-card__title', 'animate-enter-fade-up-short', 'animate-delay-7');
    const cardTitleSpan = document.createElement('span');
    cardTitleSpan.classList.add('labelLargeBold');
    cardTitleSpan.textContent = cardTitleText;
    cardTitleDiv.append(cardTitleSpan);
    contentInnerDiv.append(cardTitleDiv);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('sustainability-card__description', 'animate-enter-fade-up-short', 'animate-delay-9');
    const bodyMediumRegular = document.createElement('div');
    bodyMediumRegular.classList.add('bodyMediumRegular');
    bodyMediumRegular.innerHTML = descriptionHtml;
    descriptionDiv.append(bodyMediumRegular);
    contentInnerDiv.append(descriptionDiv);

    contentDiv.append(contentInnerDiv);

    const signInTooltip = document.createElement('div');
    signInTooltip.classList.add('signIn-Info-Tooltip', 'animate-enter-fade-up-short', 'animate-delay-9');
    contentDiv.append(signInTooltip);

    const readingDurationDiv = document.createElement('div');
    readingDurationDiv.classList.add('sustainability-card__reading-duration');
    const durationSpan = document.createElement('span');
    durationSpan.classList.add('labelSmallBold', 'animate-enter-fade-up-short', 'animate-delay-11');
    durationSpan.textContent = readingDuration;
    const suffixSpan = document.createElement('span');
    suffixSpan.classList.add('utilityTagHighCaps', 'text-uppercase', 'sustainability-card__reading-duration-suffix', 'animate-enter-fade-up-short', 'animate-delay-13');
    suffixSpan.textContent = readingDurationSuffix;
    readingDurationDiv.append(durationSpan, suffixSpan);
    contentDiv.append(readingDurationDiv);

    linkEl.append(imgContainer, contentDiv);
    li.append(linkEl);
    ul.append(li);
  });

  swiperContainer.append(ul);

  const paginationDiv = document.createElement('div');
  paginationDiv.classList.add('sustainability-article-carousel__pagination', 'animate-enter-fade-left-short', 'animate-delay-3');
  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'swiper-pagination-clickable', 'swiper-pagination-bullets', 'swiper-pagination-horizontal', 'swiper-pagination-lock');
  paginationDiv.append(swiperPagination);
  swiperContainer.append(paginationDiv);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  swiperContainer.append(swiperNotification);

  cellWrapper.append(swiperContainer);
  gridXWrapper.append(cellWrapper);
  block.append(gridXWrapper);

  // Simple carousel logic (without actual swiper.js)
  let currentIndex = 0;
  const slides = [...ul.children];
  const totalSlides = slides.length;
  const updateCarousel = () => {
    slides.forEach((slide, i) => {
      slide.classList.remove('swiper-slide-active', 'swiper-slide-next');
      slide.style.display = 'none';
      if (i === currentIndex) {
        slide.classList.add('swiper-slide-active');
        slide.style.display = 'block';
      } else if (i === (currentIndex + 1) % totalSlides) {
        slide.classList.add('swiper-slide-next');
      }
    });

    // Update pagination bullets
    swiperPagination.innerHTML = '';
    for (let i = 0; i < totalSlides; i += 1) {
      const bullet = document.createElement('span');
      bullet.classList.add('swiper-pagination-bullet');
      bullet.setAttribute('tabindex', '0');
      bullet.setAttribute('role', 'button');
      bullet.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === currentIndex) {
        bullet.classList.add('swiper-pagination-bullet-active');
        bullet.setAttribute('aria-current', 'true');
      }
      bullet.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
      });
      swiperPagination.append(bullet);
    }

    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === totalSlides - 1;
    prevButton.classList.toggle('swiper-button-disabled', currentIndex === 0);
    nextButton.classList.toggle('swiper-button-disabled', currentIndex === totalSlides - 1);
  };

  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      updateCarousel();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentIndex < totalSlides - 1) {
      currentIndex += 1;
      updateCarousel();
    }
  });

  updateCarousel(); // Initialize carousel state
}
