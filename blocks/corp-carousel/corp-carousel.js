import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [slidesContainerRow, ...slideRows] = [...block.children];
  moveInstrumentation(slidesContainerRow, block);
  slidesContainerRow.remove();

  const slideshowContainer = document.createElement('div');
  slideshowContainer.classList.add('slideshow-container');
  slideshowContainer.style.position = 'relative';
  slideshowContainer.id = 'carousel-main';

  const dotContainer = document.createElement('div');
  dotContainer.style.textAlign = 'center';

  slideRows.forEach((row, index) => {
    const mySlide = document.createElement('div');
    mySlide.classList.add('mySlides');
    mySlide.style.display = index === 0 ? 'block' : 'none';
    moveInstrumentation(row, mySlide);

    // BlockJson defines 3 cells per carousel-slide item: link, image-mobile, image-desktop
    const [linkCell, mobileImageCell, desktopImageCell] = row.children;

    const linkEl = document.createElement('a');
    if (linkCell && linkCell.querySelector('a')) {
      const originalLink = linkCell.querySelector('a');
      linkEl.href = originalLink.href;
      linkEl.target = originalLink.target || '_self'; // Default target if not specified
    }

    if (mobileImageCell) {
      const picture = mobileImageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          // Optimize mobile image and append to link
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          optimizedPic.querySelector('img').classList.add('generic-mobile'); // Add class after optimization
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          linkEl.append(optimizedPic);
        }
      }
    }

    if (desktopImageCell) {
      const picture = desktopImageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          // Optimize desktop image and append to link
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
          optimizedPic.querySelector('img').classList.add('generic-desktop'); // Add class after optimization
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          linkEl.append(optimizedPic);
        }
      }
    }

    mySlide.append(linkEl);
    slideshowContainer.append(mySlide);

    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (index === 0) {
      dot.classList.add('active');
    }
    dot.addEventListener('click', () => currentSlide(index + 1));
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

  let slideIndex = 1;
  showSlides(slideIndex);

  function plusSlides(n) {
    showSlides(slideIndex += n);
  }

  function currentSlide(n) {
    showSlides(slideIndex = n);
  }

  function showSlides(n) {
    let i;
    const slides = block.querySelectorAll('.mySlides');
    const dots = block.querySelectorAll('.dot');
    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].classList.remove('active');
    }
    if (slides.length > 0) {
      slides[slideIndex - 1].style.display = 'block';
      dots[slideIndex - 1].classList.add('active');
    }
  }
}
