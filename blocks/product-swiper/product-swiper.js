import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundImageCell,
    titleCell,
    subTitleCell,
    swipeIconCell,
    cookieImageCell,
    morningImageCell,
    section2TextCell,
  ] = [...block.children];

  const backgroundImage = backgroundImageCell?.querySelector('picture');
  const titleText = titleCell?.textContent.trim();
  const subTitleText = subTitleCell?.textContent.trim();
  const swipeIcon = swipeIconCell?.querySelector('picture');
  const cookieImage = cookieImageCell?.querySelector('picture');
  const morningImage = morningImageCell?.querySelector('picture');
  const section2Text = section2TextCell?.textContent.trim();

  block.innerHTML = ''; // Clear the block content

  const cmpProductSwiper = document.createElement('div');
  cmpProductSwiper.classList.add('cmp-product-swiper');
  moveInstrumentation(backgroundImageCell, cmpProductSwiper);

  if (backgroundImage) {
    const img = backgroundImage.querySelector('img');
    if (img) {
      cmpProductSwiper.style.backgroundImage = `url(${img.src})`;
    }
  }

  if (titleText) {
    const title = document.createElement('h2');
    title.classList.add('cmp-product-swiper__title');
    title.textContent = titleText;
    moveInstrumentation(titleCell, title);
    cmpProductSwiper.append(title);
  }

  const sectionContainer = document.createElement('div');
  sectionContainer.classList.add('cmp-product-swiper__section-container');
  cmpProductSwiper.append(sectionContainer);

  const section1 = document.createElement('div');
  section1.classList.add('cmp-product-swiper__section1');
  sectionContainer.append(section1);

  if (subTitleText) {
    const subTitle = document.createElement('h5');
    subTitle.classList.add('cmp-product-swiper__sub-title', 'body-1');
    subTitle.textContent = subTitleText;
    moveInstrumentation(subTitleCell, subTitle);
    section1.append(subTitle);
  }

  if (swipeIcon) {
    const lazyImageContainer = document.createElement('div');
    lazyImageContainer.classList.add('lazy-image-container');
    const img = swipeIcon.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('cmp-product-swiper__swipe-icon', 'lazy-image', 'loaded');
      moveInstrumentation(swipeIcon, optimizedImg);
      lazyImageContainer.append(optimizedPic);
    }
    section1.append(lazyImageContainer);
  }

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

  if (cookieImage) {
    const lazyImageContainer = document.createElement('div');
    lazyImageContainer.classList.add('lazy-image-container');
    const img = cookieImage.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('cmp-product-swiper__cookie-img', 'lazy-image', 'loaded');
      moveInstrumentation(cookieImage, optimizedImg);
      lazyImageContainer.append(optimizedPic);
    }
    section1.append(lazyImageContainer);
  }

  const section2 = document.createElement('div');
  section2.classList.add('cmp-product-swiper__section2');
  sectionContainer.append(section2);

  if (morningImage) {
    const lazyImageContainer = document.createElement('div');
    lazyImageContainer.classList.add('lazy-image-container');
    const img = morningImage.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('lazy-image', 'loaded');
      moveInstrumentation(morningImage, optimizedImg);
      lazyImageContainer.append(optimizedPic);
    }
    section2.append(lazyImageContainer);
  }

  if (section2Text) {
    const p = document.createElement('p');
    p.classList.add('body-3');
    p.textContent = section2Text;
    moveInstrumentation(section2TextCell, p);
    section2.append(p);
  }

  block.append(cmpProductSwiper);

  // CHECK 2 — INTERACTIVITY
  // The range slider is an interactive element. Add an event listener.
  rangeSlider.addEventListener('input', (event) => {
    // Implement slider behavior here.
    // For example, update a visual indicator or change content based on the slider value.
    // The original HTML doesn't show dynamic content changes, but a slider implies interaction.
    // This is a placeholder for actual logic.
    const sliderValue = event.target.value;
    console.log('Slider value changed to:', sliderValue);

    // Example: update the position of sliderIcon or other elements
    // This would typically involve CSS transformations based on sliderValue
    const max = parseInt(rangeSlider.max, 10);
    const min = parseInt(rangeSlider.min, 10);
    const percentage = ((sliderValue - min) / (max - min)) * 100;
    sliderIcon.style.left = `${percentage}%`; // Adjust based on actual layout needs
  });
}
