import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const slideshowContainer = document.createElement('div');
  slideshowContainer.classList.add('slideshow-container');
  slideshowContainer.style.position = 'relative';
  slideshowContainer.id = 'carousel-main';

  const dotContainer = document.createElement('div');
  dotContainer.style.textAlign = 'center';

  let slideIndex = 0;

  [...block.children].forEach((row, index) => {
    const slideDiv = document.createElement('div');
    slideDiv.classList.add('mySlides');
    if (index === 0) {
      slideDiv.style.display = 'block';
    } else {
      slideDiv.style.display = 'none';
    }
    moveInstrumentation(row, slideDiv);

    const linkEl = document.createElement('a');
    const foundLink = row.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      if (foundLink.target) linkEl.target = foundLink.target;
      if (foundLink.getAttribute('aria-label')) linkEl.setAttribute('aria-label', foundLink.getAttribute('aria-label'));
    }

    let mobileImage = null;
    let desktopImage = null;

    // Content detection for images based on the BlockJson and EDS structure
    const cells = [...row.children];
    const mobileImageCell = cells.find(cell => cell.querySelector('picture') && !desktopImage); // First picture is mobile
    const desktopImageCell = cells.find(cell => cell.querySelector('picture') && cell !== mobileImageCell); // Second picture is desktop

    if (mobileImageCell) {
      mobileImage = mobileImageCell.querySelector('img');
    }
    if (desktopImageCell) {
      desktopImage = desktopImageCell.querySelector('img');
    }

    if (mobileImage) {
      const optimizedMobilePic = createOptimizedPicture(mobileImage.src, mobileImage.alt, false, [{ width: '750' }]);
      const mobileImgEl = optimizedMobilePic.querySelector('img');
      mobileImgEl.classList.add('generic-mobile');
      linkEl.append(optimizedMobilePic);
    }

    if (desktopImage) {
      const optimizedDesktopPic = createOptimizedPicture(desktopImage.src, desktopImage.alt, false, [{ width: '2000' }]);
      const desktopImgEl = optimizedDesktopPic.querySelector('img');
      desktopImgEl.classList.add('generic-desktop');
      linkEl.append(optimizedDesktopPic);
    }

    slideDiv.append(linkEl);
    slideshowContainer.append(slideDiv);

    const dotSpan = document.createElement('span');
    dotSpan.classList.add('dot');
    if (index === 0) {
      dotSpan.classList.add('active');
    }
    dotSpan.addEventListener('click', () => currentSlide(index + 1));
    dotContainer.append(dotSpan);
  });

  const prevBtn = document.createElement('a');
  prevBtn.classList.add('prev');
  prevBtn.addEventListener('click', () => plusSlides(-1));
  slideshowContainer.append(prevBtn);

  const nextBtn = document.createElement('a');
  nextBtn.classList.add('next');
  nextBtn.addEventListener('click', () => plusSlides(1));
  slideshowContainer.append(nextBtn);

  block.textContent = '';
  block.append(slideshowContainer, dotContainer);

  function showSlides(n) {
    const slides = block.querySelectorAll('.mySlides');
    const dots = block.querySelectorAll('.dot');
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }
    slides.forEach((slide) => {
      slide.style.display = 'none';
    });
    dots.forEach((dot) => {
      dot.classList.remove('active');
    });
    slides[slideIndex - 1].style.display = 'block';
    dots[slideIndex - 1].classList.add('active');
  }

  function plusSlides(n) {
    showSlides(slideIndex += n);
  }

  function currentSlide(n) {
    showSlides(slideIndex = n);
  }

  // Initialize first slide
  showSlides(1);
}
