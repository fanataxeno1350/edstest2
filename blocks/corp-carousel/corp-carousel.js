import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const slideshowContainer = document.createElement('div');
  slideshowContainer.classList.add('slideshow-container');
  slideshowContainer.style.position = 'relative';
  slideshowContainer.id = 'carousel-main';

  const dotsContainer = document.createElement('div');
  dotsContainer.style.textAlign = 'center';

  let slideIndex = 0;

  [...block.children].forEach((row, index) => {
    const mySlides = document.createElement('div');
    mySlides.classList.add('mySlides');
    mySlides.style.display = 'none';

    // Use content detection instead of row.children[n]
    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const mobileImageCell = cells.find(cell => cell.querySelector('picture') && !cell.querySelector('a')); // Assuming mobile image is the first picture without a link
    const desktopImageCell = cells.find(cell => cell.querySelector('picture') && cell !== mobileImageCell); // Assuming desktop image is the second picture

    const linkEl = document.createElement('a');
    if (linkCell) {
      const originalLink = linkCell.querySelector('a');
      if (originalLink) {
        linkEl.href = originalLink.href;
        linkEl.target = originalLink.target;
      }
      moveInstrumentation(linkCell, linkEl);
    }

    if (mobileImageCell) {
      const picture = mobileImageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const mobileImg = document.createElement('img');
        mobileImg.classList.add('generic-mobile'); // Class name from allowlist
        mobileImg.alt = img?.alt || '';
        mobileImg.src = img?.src || '';
        const optimizedMobilePic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '750' }]);
        moveInstrumentation(mobileImageCell, optimizedMobilePic.querySelector('img'));
        linkEl.append(optimizedMobilePic);
      }
    }

    if (desktopImageCell) {
      const picture = desktopImageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const desktopImg = document.createElement('img');
        desktopImg.classList.add('generic-desktop'); // Class name from allowlist
        desktopImg.alt = img?.alt || '';
        desktopImg.src = img?.src || '';
        const optimizedDesktopPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '2000' }]);
        moveInstrumentation(desktopImageCell, optimizedDesktopPic.querySelector('img'));
        linkEl.append(optimizedDesktopPic);
      }
    }

    mySlides.append(linkEl);
    slideshowContainer.append(mySlides);

    const dot = document.createElement('span');
    dot.classList.add('dot'); // Class name from allowlist
    dot.addEventListener('click', () => currentSlide(index + 1));
    dotsContainer.append(dot);

    moveInstrumentation(row, mySlides);
  });

  const prevButton = document.createElement('a');
  prevButton.classList.add('prev'); // Class name from allowlist
  prevButton.addEventListener('click', () => plusSlides(-1));
  slideshowContainer.append(prevButton);

  const nextButton = document.createElement('a');
  nextButton.classList.add('next'); // Class name from allowlist
  nextButton.addEventListener('click', () => plusSlides(1));
  slideshowContainer.append(nextButton);

  block.textContent = '';
  block.append(slideshowContainer, dotsContainer);

  const slides = slideshowContainer.querySelectorAll('.mySlides');
  const dots = dotsContainer.querySelectorAll('.dot');

  function showSlides(n) {
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }
    slides.forEach((slide) => (slide.style.display = 'none'));
    dots.forEach((dot) => dot.classList.remove('active')); // Class name from allowlist
    slides[slideIndex - 1].style.display = 'block';
    dots[slideIndex - 1].classList.add('active'); // Class name from allowlist
  }

  function plusSlides(n) {
    showSlides((slideIndex += n));
  }

  function currentSlide(n) {
    showSlides((slideIndex = n));
  }

  if (slides.length > 0) {
    showSlides(1);
  }
}
