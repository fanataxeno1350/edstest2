import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('cmp-carousel__container', 'slick-initialized', 'slick-slider', 'slick-dotted');
  container.setAttribute('data-slick', '3');
  container.setAttribute('aria-atomic', 'false');

  const prevButton = document.createElement('button');
  prevButton.classList.add('slick-prev', 'slick-arrow', 'slick-disabled');
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('aria-disabled', 'true');
  prevButton.textContent = 'Previous';

  const nextButton = document.createElement('button');
  nextButton.classList.add('slick-next', 'slick-arrow');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('aria-disabled', 'false');
  nextButton.textContent = 'Next';

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');
  slickTrack.style.opacity = '1';

  const slickDots = document.createElement('ul');
  slickDots.classList.add('slick-dots');
  slickDots.setAttribute('role', 'tablist');

  const items = [...block.children];
  items.forEach((row, index) => {
    const itemDiv = document.createElement('div');
    moveInstrumentation(row, itemDiv);
    itemDiv.classList.add('cmp-carousel__item', 'slick-slide');
    itemDiv.setAttribute('id', `slick-slide1${index}`);
    itemDiv.setAttribute('role', 'tabpanel');
    itemDiv.setAttribute('aria-roledescription', 'slide');
    itemDiv.setAttribute('aria-label', `Slide ${index + 1} of ${items.length}`);
    itemDiv.setAttribute('data-cmp-hook-carousel', 'item');
    itemDiv.setAttribute('data-slick-index', index);
    itemDiv.setAttribute('aria-hidden', index !== 0);
    itemDiv.setAttribute('tabindex', index === 0 ? '0' : '-1');
    itemDiv.setAttribute('aria-describedby', `slick-slide-control1${index}`);

    if (index === 0) {
      itemDiv.classList.add('cmp-carousel__item--active', 'slick-current', 'slick-active');
    }

    const teaserDiv = document.createElement('div');
    teaserDiv.classList.add('teaser', 'cmp-teaser--carousel-teaser');

    const cmpTeaserDiv = document.createElement('div');
    cmpTeaserDiv.classList.add('cmp-teaser');
    cmpTeaserDiv.setAttribute('data-component', 'teaser');
    cmpTeaserDiv.setAttribute('data-show-media-url', 'false');
    cmpTeaserDiv.setAttribute('data-initialized', 'true');

    const [desktopImgCell, mobileImgCell, titleCell, descriptionCell, ctaLinkCell, ctaTextCell] = row.children;

    const desktopPic = desktopImgCell.querySelector('picture');
    const desktopImg = desktopPic ? desktopPic.querySelector('img') : null;
    if (desktopImg) {
      cmpTeaserDiv.setAttribute('data-background-image-desktop', desktopImg.src);
      cmpTeaserDiv.style.backgroundImage = `url("${desktopImg.src}")`;
    }

    const mobilePic = mobileImgCell.querySelector('picture');
    const mobileImg = mobilePic ? mobilePic.querySelector('img') : null;
    if (mobileImg) {
      cmpTeaserDiv.setAttribute('data-background-image-mobile', mobileImg.src);
    }

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('cmp-teaser__content');

    const title = document.createElement('h2');
    title.classList.add('cmp-teaser__title');
    moveInstrumentation(titleCell, title);
    title.innerHTML = titleCell.innerHTML;

    const description = document.createElement('div');
    description.classList.add('cmp-teaser__description');
    moveInstrumentation(descriptionCell, description);
    description.innerHTML = descriptionCell.innerHTML;

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('cmp-teaser__action-container');

    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('button', 'cmp-button--primary-anchor');

    const ctaLink = ctaLinkCell.querySelector('a');
    const ctaAnchor = document.createElement('a');
    ctaAnchor.classList.add('cmp-button');
    ctaAnchor.setAttribute('data-request', 'true');
    if (ctaLink) {
      ctaAnchor.href = ctaLink.href;
      if (ctaLink.target) ctaAnchor.target = ctaLink.target;
    }
    ctaAnchor.setAttribute('tabindex', index === 0 ? '0' : '-1');

    const ctaSpan = document.createElement('span');
    ctaSpan.classList.add('cmp-button__text');
    moveInstrumentation(ctaTextCell, ctaSpan);
    ctaSpan.innerHTML = ctaTextCell.innerHTML;

    ctaAnchor.append(ctaSpan);
    buttonWrapper.append(ctaAnchor);
    actionContainer.append(buttonWrapper);

    contentDiv.append(title, description, actionContainer);
    cmpTeaserDiv.append(contentDiv);
    teaserDiv.append(cmpTeaserDiv);
    itemDiv.append(teaserDiv);
    slickTrack.append(itemDiv);

    const dotLi = document.createElement('li');
    dotLi.setAttribute('role', 'presentation');
    if (index === 0) dotLi.classList.add('slick-active');

    const dotButton = document.createElement('button');
    dotButton.setAttribute('type', 'button');
    dotButton.setAttribute('role', 'tab');
    dotButton.setAttribute('id', `slick-slide-control1${index}`);
    dotButton.setAttribute('aria-controls', `slick-slide1${index}`);
    dotButton.setAttribute('aria-label', `${index + 1} of ${items.length}`);
    dotButton.setAttribute('tabindex', index === 0 ? '0' : '-1');
    dotButton.setAttribute('aria-selected', index === 0);
    dotButton.textContent = index + 1;

    dotLi.append(dotButton);
    slickDots.append(dotLi);
  });

  slickList.append(slickTrack);
  container.append(prevButton, slickList, nextButton, slickDots);

  block.textContent = '';
  block.append(container);

  // Implement carousel functionality
  let currentIndex = 0;

  function updateCarousel() {
    slickTrack.style.transform = `translate3d(-${currentIndex * 100}%, 0px, 0px)`;

    [...slickTrack.children].forEach((item, i) => {
      if (i === currentIndex) {
        item.classList.add('cmp-carousel__item--active', 'slick-current', 'slick-active');
        item.setAttribute('aria-hidden', 'false');
        item.setAttribute('tabindex', '0');
        item.querySelector('.cmp-button').setAttribute('tabindex', '0');
      } else {
        item.classList.remove('cmp-carousel__item--active', 'slick-current', 'slick-active');
        item.setAttribute('aria-hidden', 'true');
        item.setAttribute('tabindex', '-1');
        item.querySelector('.cmp-button').setAttribute('tabindex', '-1');
      }
    });

    [...slickDots.children].forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add('slick-active');
        dot.querySelector('button').setAttribute('tabindex', '0');
        dot.querySelector('button').setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('slick-active');
        dot.querySelector('button').setAttribute('tabindex', '-1');
        dot.querySelector('button').setAttribute('aria-selected', 'false');
      }
    });

    if (currentIndex === 0) {
      prevButton.classList.add('slick-disabled');
      prevButton.setAttribute('aria-disabled', 'true');
    } else {
      prevButton.classList.remove('slick-disabled');
      prevButton.setAttribute('aria-disabled', 'false');
    }

    if (currentIndex === items.length - 1) {
      nextButton.classList.add('slick-disabled');
      nextButton.setAttribute('aria-disabled', 'true');
    } else {
      nextButton.classList.remove('slick-disabled');
      nextButton.setAttribute('aria-disabled', 'false');
    }
  }

  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentIndex < items.length - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  slickDots.querySelectorAll('button').forEach((dotButton, index) => {
    dotButton.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
  });

  // Initial update
  updateCarousel();

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
