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
    const mySlides = document.createElement('div');
    mySlides.classList.add('mySlides');
    if (index === 0) {
      mySlides.style.display = 'block';
    } else {
      mySlides.style.display = 'none';
    }
    moveInstrumentation(row, mySlides);

    // Use content detection instead of row.children[n]
    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const mobileImageCell = cells.find(cell => cell.querySelector('picture img[alt="Mobile Image"]'));
    const desktopImageCell = cells.find(cell => cell.querySelector('picture img[alt="Desktop Image"]'));

    const anchor = document.createElement('a');
    if (linkCell) {
      const originalLink = linkCell.querySelector('a');
      if (originalLink) {
        anchor.href = originalLink.href;
        anchor.target = originalLink.target;
      }
    }

    if (mobileImageCell) {
      const mobilePicture = mobileImageCell.querySelector('picture');
      const mobileImg = mobilePicture ? mobilePicture.querySelector('img') : null;
      if (mobileImg) {
        const optimizedMobilePic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '750' }]);
        optimizedMobilePic.querySelector('img').classList.add('generic-mobile');
        anchor.append(optimizedMobilePic);
      }
    }

    if (desktopImageCell) {
      const desktopPicture = desktopImageCell.querySelector('picture');
      const desktopImg = desktopPicture ? desktopPicture.querySelector('img') : null;
      if (desktopImg) {
        const optimizedDesktopPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '2000' }]);
        optimizedDesktopPic.querySelector('img').classList.add('generic-desktop');
        anchor.append(optimizedDesktopPic);
      }
    }

    mySlides.append(anchor);
    slideshowContainer.append(mySlides);

    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (index === 0) {
      dot.classList.add('active');
    }
    dot.addEventListener('click', () => currentSlide(index));
    dotContainer.append(dot);
  });

  const prevButton = document.createElement('a');
  prevButton.classList.add('prev');
  prevButton.addEventListener('click', () => plusSlides(-1));
  slideshowContainer.append(prevButton);

  const nextButton = document.createElement('a');
  nextButton.classList.add('next');
  nextButton.addEventListener('click', () => plusSlides(1));
  slideshowContainer.append(nextButton);

  block.textContent = '';
  block.append(slideshowContainer, dotContainer);

  const slides = block.querySelectorAll('.mySlides');
  const dots = block.querySelectorAll('.dot');

  function showSlides(n) {
    if (n > slides.length - 1) {
      slideIndex = 0;
    }
    if (n < 0) {
      slideIndex = slides.length - 1;
    }
    slides.forEach((slide) => (slide.style.display = 'none'));
    dots.forEach((dot) => dot.classList.remove('active'));
    slides[slideIndex].style.display = 'block';
    dots[slideIndex].classList.add('active');
  }

  function plusSlides(n) {
    showSlides((slideIndex += n));
  }

  function currentSlide(n) {
    showSlides((slideIndex = n));
  }

  showSlides(slideIndex);
}
