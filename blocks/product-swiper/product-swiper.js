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
    morningLabelCell,
  ] = [...block.children];

  // Main container
  const cmpProductSwiper = document.createElement('div');
  cmpProductSwiper.classList.add('cmp-product-swiper');
  moveInstrumentation(block, cmpProductSwiper);

  // Background Image
  const backgroundImage = backgroundImageCell.querySelector('picture');
  if (backgroundImage) {
    const img = backgroundImage.querySelector('img');
    if (img) {
      cmpProductSwiper.style.backgroundImage = `url(${img.src})`;
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      // The background image is set via style, so we don't append the picture element directly
      // but we still optimize it for potential future use or if CSS fails.
    }
  }

  // Title
  const title = document.createElement('h2');
  title.classList.add('cmp-product-swiper__title');
  title.textContent = titleCell?.textContent.trim() || '';
  moveInstrumentation(titleCell, title);
  cmpProductSwiper.append(title);

  // Section Container
  const sectionContainer = document.createElement('div');
  sectionContainer.classList.add('cmp-product-swiper__section-container');
  cmpProductSwiper.append(sectionContainer);

  // Section 1
  const section1 = document.createElement('div');
  section1.classList.add('cmp-product-swiper__section1');
  sectionContainer.append(section1);

  // Sub Title
  const subTitle = document.createElement('h5');
  subTitle.classList.add('cmp-product-swiper__sub-title', 'body-1');
  subTitle.textContent = subTitleCell?.textContent.trim() || '';
  moveInstrumentation(subTitleCell, subTitle);
  section1.append(subTitle);

  // Swipe Icon
  const swipeIconContainer = document.createElement('div');
  swipeIconContainer.classList.add('lazy-image-container');
  const swipeIconPicture = swipeIconCell.querySelector('picture');
  if (swipeIconPicture) {
    const swipeIconImg = swipeIconPicture.querySelector('img');
    if (swipeIconImg) {
      const optimizedSwipeIcon = createOptimizedPicture(swipeIconImg.src, swipeIconImg.alt, false, [{ width: '66' }]);
      const newSwipeIconImg = optimizedSwipeIcon.querySelector('img');
      newSwipeIconImg.classList.add('cmp-product-swiper__swipe-icon', 'lazy-image', 'loaded');
      moveInstrumentation(swipeIconImg, newSwipeIconImg);
      swipeIconContainer.append(optimizedSwipeIcon);
    }
  }
  moveInstrumentation(swipeIconCell, swipeIconContainer);
  section1.append(swipeIconContainer);

  // Swiper Container
  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('cmp-product-swiper__swiper-container');
  section1.append(swiperContainer);

  // Sun Icon
  const sunIcon = document.createElement('span');
  sunIcon.classList.add('cmp-product-swiper__sun-icon');
  swiperContainer.append(sunIcon);

  // Slider
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

  // Selected Morning
  const selectedMorning = document.createElement('span');
  selectedMorning.classList.add('cmp-product-swiper__selected-morning');
  swiperContainer.append(selectedMorning);

  // Moon Icon
  const moonIcon = document.createElement('span');
  moonIcon.classList.add('cmp-product-swiper__moon-icon');
  swiperContainer.append(moonIcon);

  // Cookie Image
  const cookieImageContainer = document.createElement('div');
  cookieImageContainer.classList.add('lazy-image-container');
  const cookieImagePicture = cookieImageCell.querySelector('picture');
  if (cookieImagePicture) {
    const cookieImageImg = cookieImagePicture.querySelector('img');
    if (cookieImageImg) {
      const optimizedCookieImage = createOptimizedPicture(cookieImageImg.src, cookieImageImg.alt, false, [{ width: '750' }]);
      const newCookieImageImg = optimizedCookieImage.querySelector('img');
      newCookieImageImg.classList.add('cmp-product-swiper__cookie-img', 'lazy-image', 'loaded');
      moveInstrumentation(cookieImageImg, newCookieImageImg);
      cookieImageContainer.append(optimizedCookieImage);
    }
  }
  moveInstrumentation(cookieImageCell, cookieImageContainer);
  section1.append(cookieImageContainer);

  // Section 2
  const section2 = document.createElement('div');
  section2.classList.add('cmp-product-swiper__section2');
  sectionContainer.append(section2);

  // Morning Image
  const morningImageContainer = document.createElement('div');
  morningImageContainer.classList.add('lazy-image-container');
  const morningImagePicture = morningImageCell.querySelector('picture');
  if (morningImagePicture) {
    const morningImageImg = morningImagePicture.querySelector('img');
    if (morningImageImg) {
      const optimizedMorningImage = createOptimizedPicture(morningImageImg.src, morningImageImg.alt, false, [{ width: '750' }]);
      const newMorningImageImg = optimizedMorningImage.querySelector('img');
      newMorningImageImg.classList.add('lazy-image', 'loaded'); // No specific class for this img in original HTML
      moveInstrumentation(morningImageImg, newMorningImageImg);
      morningImageContainer.append(optimizedMorningImage);
    }
  }
  moveInstrumentation(morningImageCell, morningImageContainer);
  section2.append(morningImageContainer);

  // Morning Label
  const morningLabel = document.createElement('p');
  morningLabel.classList.add('body-3');
  morningLabel.textContent = morningLabelCell?.textContent.trim() || '';
  moveInstrumentation(morningLabelCell, morningLabel);
  section2.append(morningLabel);

  // Interactivity: Range Slider
  rangeSlider.addEventListener('input', () => {
    const value = parseInt(rangeSlider.value, 10);
    // Logic to update content based on slider value (0, 1, or 2)
    // This example assumes there are different states for the content
    // and updates the 'selectedMorning' text and potentially image visibility
    if (value === 0) {
      selectedMorning.textContent = 'Morning';
      // Potentially show/hide images or change their source
      section1.style.display = 'flex';
      section2.style.display = 'none';
    } else if (value === 1) {
      selectedMorning.textContent = 'Afternoon';
      section1.style.display = 'none';
      section2.style.display = 'flex';
    } else if (value === 2) {
      selectedMorning.textContent = 'Night';
      section1.style.display = 'none';
      section2.style.display = 'flex';
    }
  });

  // Initialize the slider state
  rangeSlider.dispatchEvent(new Event('input'));

  // Replace the original block content with the new structure
  block.innerHTML = '';
  block.append(cmpProductSwiper);
}
