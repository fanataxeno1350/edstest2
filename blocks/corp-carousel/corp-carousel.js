import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [slidesContainer] = [...block.children];
  const slideItems = [...slidesContainer.children].slice(1); // Skip the "Slides value" div

  const slideshowContainer = document.createElement('div');
  slideshowContainer.classList.add('slideshow-container');
  slideshowContainer.style.position = 'relative';
  slideshowContainer.id = 'carousel-main';

  const dotContainer = document.createElement('div');
  dotContainer.style.textAlign = 'center';

  slideItems.forEach((row, index) => {
    const mySlide = document.createElement('div');
    mySlide.classList.add('mySlides');
    if (index === 0) {
      mySlide.style.display = 'block';
    } else {
      mySlide.style.display = 'none';
    }
    moveInstrumentation(row, mySlide);

    const linkEl = document.createElement('a');
    const linkCell = row.children[0]; // Link is the first cell
    const originalLink = linkCell ? linkCell.querySelector('a') : null;
    if (originalLink) {
      linkEl.href = originalLink.href;
      linkEl.target = originalLink.target;
      // Move instrumentation from original link to new link element
      moveInstrumentation(originalLink, linkEl);
    }

    const mobileImageCell = row.children[1]; // Image Mobile is the second cell
    const desktopImageCell = row.children[2]; // Image Desktop is the third cell

    if (mobileImageCell) {
      const pictureMobile = mobileImageCell.querySelector('picture');
      if (pictureMobile) {
        const imgMobile = pictureMobile.querySelector('img');
        if (imgMobile) {
          const optimizedPicMobile = createOptimizedPicture(imgMobile.src, imgMobile.alt, false, [{ width: '750' }]);
          optimizedPicMobile.querySelector('img').classList.add('generic-mobile');
          moveInstrumentation(imgMobile, optimizedPicMobile.querySelector('img'));
          linkEl.append(optimizedPicMobile);
        }
      }
    }

    if (desktopImageCell) {
      const pictureDesktop = desktopImageCell.querySelector('picture');
      if (pictureDesktop) {
        const imgDesktop = pictureDesktop.querySelector('img');
        if (imgDesktop) {
          const optimizedPicDesktop = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '2000' }]);
          optimizedPicDesktop.querySelector('img').classList.add('generic-desktop');
          moveInstrumentation(imgDesktop, optimizedPicDesktop.querySelector('img'));
          linkEl.append(optimizedPicDesktop);
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
  block.classList.add('corp-carousel');
  block.append(slideshowContainer);
  block.append(dotContainer);

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
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i += 1) {
      slides[i].style.display = 'none';
    }
    for (i = 0; i < dots.length; i += 1) {
      dots[i].classList.remove('active');
    }
    if (slides[slideIndex - 1]) {
      slides[slideIndex - 1].style.display = 'block';
    }
    if (dots[slideIndex - 1]) {
      dots[slideIndex - 1].classList.add('active');
    }
  }
}
