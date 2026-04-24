import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundImageCell,
    titleCell,
    subtitleCell,
    swipeIconCell,
    cookieImageCell,
    morningImageCell,
    morningTextCell,
  ] = [...block.children];

  const cmpProductSwiper = document.createElement('div');
  cmpProductSwiper.classList.add('cmp-product-swiper');
  moveInstrumentation(block, cmpProductSwiper);

  // Background Image
  const backgroundImagePicture = backgroundImageCell.querySelector('picture');
  if (backgroundImagePicture) {
    const img = backgroundImagePicture.querySelector('img');
    if (img) {
      cmpProductSwiper.style.backgroundImage = `url("${img.src}")`;
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      // The background image is set via CSS, so we don't append the picture element directly.
      // We just ensure it's optimized if it were to be used elsewhere.
    }
  }

  // Title
  const title = document.createElement('h2');
  title.classList.add('cmp-product-swiper__title');
  title.textContent = titleCell.textContent.trim();
  moveInstrumentation(titleCell, title);
  cmpProductSwiper.append(title);

  const sectionContainer = document.createElement('div');
  sectionContainer.classList.add('cmp-product-swiper__section-container');
  cmpProductSwiper.append(sectionContainer);

  const section1 = document.createElement('div');
  section1.classList.add('cmp-product-swiper__section1');
  sectionContainer.append(section1);

  // Subtitle
  const subtitle = document.createElement('h5');
  subtitle.classList.add('cmp-product-swiper__sub-title', 'body-1');
  subtitle.textContent = subtitleCell.textContent.trim();
  moveInstrumentation(subtitleCell, subtitle);
  section1.append(subtitle);

  // Swipe Icon
  const swipeIconContainer = document.createElement('div');
  swipeIconContainer.classList.add('lazy-image-container');
  const swipeIconPicture = swipeIconCell.querySelector('picture');
  if (swipeIconPicture) {
    const img = swipeIconPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('cmp-product-swiper__swipe-icon', 'lazy-image', 'loaded');
      moveInstrumentation(img, optimizedImg);
      swipeIconContainer.append(optimizedPic);
    }
  }
  moveInstrumentation(swipeIconCell, swipeIconContainer);
  section1.append(swipeIconContainer);

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('cmp-product-swiper__swiper-container');
  section1.append(swiperContainer);

  const sunIcon = document.createElement('span');
  sunIcon.classList.add('cmp-product-swiper__sun-icon');
  swiperContainer.append(sunIcon);

  const slider = document.createElement('div');
  slider.classList.add('cmp-product-swiper__slider');
  swiperContainer.append(slider);

  const rangeSlider = document.createElement('input');
  rangeSlider.classList.add('cmp-product-swiper__range-slider', 'morning');
  rangeSlider.setAttribute('min', '0');
  rangeSlider.setAttribute('max', '2');
  rangeSlider.setAttribute('type', 'range');
  rangeSlider.setAttribute('value', '0');
  slider.append(rangeSlider);

  const sliderIcon = document.createElement('div');
  sliderIcon.classList.add('cmp-product-swiper__slider-icon');
  slider.append(sliderIcon);

  const selectedMorning = document.createElement('span');
  selectedMorning.classList.add('cmp-product-swiper__selected-morning');
  swiperContainer.append(selectedMorning);

  const moonIcon = document.createElement('span');
  moonIcon.classList.add('cmp-product-swiper__moon-icon');
  swiperContainer.append(moonIcon);

  // Cookie Image
  const cookieImageContainer = document.createElement('div');
  cookieImageContainer.classList.add('lazy-image-container');
  const cookieImagePicture = cookieImageCell.querySelector('picture');
  if (cookieImagePicture) {
    const img = cookieImagePicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('cmp-product-swiper__cookie-img', 'lazy-image', 'loaded');
      moveInstrumentation(img, optimizedImg);
      cookieImageContainer.append(optimizedPic);
    }
  }
  moveInstrumentation(cookieImageCell, cookieImageContainer);
  section1.append(cookieImageContainer);

  const section2 = document.createElement('div');
  section2.classList.add('cmp-product-swiper__section2');
  sectionContainer.append(section2);

  // Morning Image
  const morningImageContainer = document.createElement('div');
  morningImageContainer.classList.add('lazy-image-container');
  const morningImagePicture = morningImageCell.querySelector('picture');
  if (morningImagePicture) {
    const img = morningImagePicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('lazy-image', 'loaded'); // No specific class for this img in original HTML
      moveInstrumentation(img, optimizedImg);
      morningImageContainer.append(optimizedPic);
    }
  }
  moveInstrumentation(morningImageCell, morningImageContainer);
  section2.append(morningImageContainer);

  // Morning Text
  const morningText = document.createElement('p');
  morningText.classList.add('body-3');
  morningText.textContent = morningTextCell.textContent.trim();
  moveInstrumentation(morningTextCell, morningText);
  section2.append(morningText);

  block.innerHTML = '';
  block.append(cmpProductSwiper);
}
