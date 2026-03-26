import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The first child is the "Slides" container, which we don't need directly for rendering
  // as its children are the actual slides.
  const [slidesContainerRow] = [...block.children];
  slidesContainerRow.remove(); // Remove the "Slides" container row from the block

  const slideshowContainer = document.createElement('div');
  slideshowContainer.classList.add('slideshow-container');
  slideshowContainer.style.position = 'relative';
  slideshowContainer.id = 'carousel-main';

  const dotContainer = document.createElement('div');
  dotContainer.style.textAlign = 'center';

  let slideIndex = 0;

  // Iterate over the remaining children, which are the actual slide items
  [...block.children].forEach((row, index) => {
    const mySlide = document.createElement('div');
    mySlide.classList.add('mySlides');
    if (index === 0) {
      mySlide.style.display = 'block';
    } else {
      mySlide.style.display = 'none';
    }
    moveInstrumentation(row, mySlide);

    const linkEl = document.createElement('a');
    const dot = document.createElement('span');
    dot.classList.add('dot');

    // According to BlockJson, each slide row has 3 cells: link, image-mobile, image-desktop
    const [linkCell, imageMobileCell, imageDesktopCell] = [...row.children];

    // Process Link
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      if (foundLink.target) {
        linkEl.target = foundLink.target;
      }
    }

    // Process Image Mobile
    const pictureMobile = imageMobileCell.querySelector('picture');
    if (pictureMobile) {
      const imgMobile = pictureMobile.querySelector('img');
      if (imgMobile) {
        const optimizedPic = createOptimizedPicture(imgMobile.src, imgMobile.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        optimizedImg.classList.add('generic-mobile');
        moveInstrumentation(imgMobile, optimizedImg);
        linkEl.append(optimizedPic);
      }
    }

    // Process Image Desktop
    const pictureDesktop = imageDesktopCell.querySelector('picture');
    if (pictureDesktop) {
      const imgDesktop = pictureDesktop.querySelector('img');
      if (imgDesktop) {
        const optimizedPic = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '2000' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        optimizedImg.classList.add('generic-desktop');
        moveInstrumentation(imgDesktop, optimizedImg);
        linkEl.append(optimizedPic);
      }
    }

    mySlide.append(linkEl);
    slideshowContainer.append(mySlide);
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

  const slides = slideshowContainer.querySelectorAll('.mySlides');
  const dots = dotContainer.querySelectorAll('.dot');

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

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlides((slideIndex = index));
    });
  });

  showSlides(slideIndex);
}
