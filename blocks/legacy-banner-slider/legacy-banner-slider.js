import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  [...block.children].forEach((row) => {
    const swiperSlide = document.createElement('div');
    moveInstrumentation(row, swiperSlide);
    swiperSlide.classList.add('swiper-slide');

    const figure = document.createElement('figure');
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    const legacyDet = document.createElement('div');
    legacyDet.classList.add('legacy-det');

    const cells = [...row.children];

    // Use content detection instead of index access
    const imageCell = cells.find((cell) => cell.querySelector('picture'));
    const altTextCell = cells.find((cell) => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim().length > 0 && cell.textContent.trim() !== 'Sub Title value' && cell.textContent.trim() !== 'Heading text content' && cell.textContent.trim() !== 'Name value' && cell.textContent.trim() !== 'Designation text content'); // Heuristic for alt text
    const subTitleCell = cells.find((cell) => cell.textContent.trim() === 'Sub Title value' || (cell.textContent.trim().length > 0 && !cell.querySelector('picture') && !cell.querySelector('a') && !cell.querySelector('h2') && !cell.querySelector('p') && !cell.querySelector('div.name') && !cell.textContent.trim().includes('Alt Text value'))); // Heuristic for sub-title
    const headingCell = cells.find((cell) => cell.querySelector('h2') || (cell.textContent.trim().length > 0 && !cell.querySelector('picture') && !cell.querySelector('a') && !cell.querySelector('div.name') && !cell.textContent.trim().includes('Alt Text value') && !cell.textContent.trim().includes('Sub Title value'))); // Heuristic for heading
    const nameCell = cells.find((cell) => cell.textContent.trim() === 'Name value' || (cell.textContent.trim().length > 0 && !cell.querySelector('picture') && !cell.querySelector('a') && !cell.querySelector('h2') && !cell.querySelector('p') && !cell.textContent.trim().includes('Alt Text value') && !cell.textContent.trim().includes('Sub Title value'))); // Heuristic for name
    const designationCell = cells.find((cell) => cell.querySelector('p') && !cell.querySelector('a') && !cell.querySelector('h2') || (cell.textContent.trim().length > 0 && !cell.querySelector('picture') && !cell.querySelector('a') && !cell.querySelector('h2') && !cell.querySelector('div.name') && !cell.textContent.trim().includes('Alt Text value') && !cell.textContent.trim().includes('Sub Title value'))); // Heuristic for designation
    const ctaCell = cells.find((cell) => cell.querySelector('a'));

    // Image
    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          // Apply bg-cover class from original HTML
          img.classList.add('bg-cover');
          const optimizedPic = createOptimizedPicture(img.src, altTextCell ? altTextCell.textContent.trim() : '', false, [{ width: '1169' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          figure.append(optimizedPic);
        }
      }
    }
    swiperSlide.append(figure);
    swiperSlide.append(overlay);

    // Sub-title
    if (subTitleCell && subTitleCell.textContent.trim()) {
      const subTtle = document.createElement('div');
      subTtle.classList.add('sub-ttle');
      moveInstrumentation(subTitleCell, subTtle);
      subTtle.textContent = subTitleCell.textContent.trim();
      legacyDet.append(subTtle);
    }

    // Heading
    if (headingCell && headingCell.textContent.trim()) {
      const commonTtle = document.createElement('h2');
      commonTtle.classList.add('common-ttle');
      moveInstrumentation(headingCell, commonTtle);
      while (headingCell.firstChild) commonTtle.append(headingCell.firstChild);
      legacyDet.append(commonTtle);
    }

    // Name and Designation
    if ((nameCell && nameCell.textContent.trim()) || (designationCell && designationCell.textContent.trim())) {
      const desgCon = document.createElement('div');
      desgCon.classList.add('desg-con');

      if (nameCell && nameCell.textContent.trim()) {
        const name = document.createElement('div');
        name.classList.add('name');
        moveInstrumentation(nameCell, name);
        name.textContent = nameCell.textContent.trim();
        desgCon.append(name);
      }

      if (designationCell && designationCell.textContent.trim()) {
        moveInstrumentation(designationCell, desgCon);
        while (designationCell.firstChild) desgCon.append(designationCell.firstChild);
      }
      legacyDet.append(desgCon);
    }

    // CTA Link
    if (ctaCell) {
      const ctaLink = ctaCell.querySelector('a');
      if (ctaLink) {
        const btnBox = document.createElement('a');
        btnBox.classList.add('btn-box');
        btnBox.href = ctaLink.href;
        moveInstrumentation(ctaCell, btnBox);
        while (ctaCell.firstChild) btnBox.append(ctaCell.firstChild);
        legacyDet.append(btnBox);
      }
    }

    swiperSlide.append(legacyDet);
    swiperWrapper.append(swiperSlide);
  });

  block.textContent = '';
  block.classList.add('swiper', 'swiper-fade', 'swiper-initialized', 'swiper-horizontal', 'swiper-pointer-events', 'swiper-watch-progress', 'swiper-backface-hidden');
  block.append(swiperWrapper);

  const swiperButtonNext = document.createElement('div');
  swiperButtonNext.classList.add('swiper-button-next', 'swiper-button-disabled', 'swiper-button-lock');
  swiperButtonNext.setAttribute('tabindex', '-1');
  swiperButtonNext.setAttribute('role', 'button');
  swiperButtonNext.setAttribute('aria-label', 'Next slide');
  swiperButtonNext.setAttribute('aria-disabled', 'true');
  block.append(swiperButtonNext);

  const swiperButtonPrev = document.createElement('div');
  swiperButtonPrev.classList.add('swiper-button-prev', 'swiper-button-disabled', 'swiper-button-lock');
  swiperButtonPrev.setAttribute('tabindex', '-1');
  swiperButtonPrev.setAttribute('role', 'button');
  swiperButtonPrev.setAttribute('aria-label', 'Previous slide');
  swiperButtonPrev.setAttribute('aria-disabled', 'true');
  block.append(swiperButtonPrev);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  block.append(swiperNotification);

  // Add event listeners for swiper navigation buttons
  // Note: Actual Swiper.js initialization would handle these,
  // but for a pure JS block, we'd need to simulate or integrate.
  // Assuming Swiper.js is loaded externally and will attach to these elements.
  // For now, just ensuring the elements exist and have correct classes.
  // If Swiper.js is NOT loaded externally, these buttons would need custom click handlers.
  swiperButtonNext.addEventListener('click', () => {
    // Placeholder for Swiper next slide logic
    console.log('Swiper next button clicked');
    // In a real scenario, you'd interact with a Swiper instance here:
    // mySwiper.slideNext();
  });

  swiperButtonPrev.addEventListener('click', () => {
    // Placeholder for Swiper previous slide logic
    console.log('Swiper previous button clicked');
    // In a real scenario, you'd interact with a Swiper instance here:
    // mySwiper.slidePrev();
  });
}
