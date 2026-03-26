import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The first child of the block is the "Slides" container, which holds the actual slide items.
  // We need to extract the children (slide items) from this container.
  const slidesContainerRow = block.children[0];
  const slideItems = [...slidesContainerRow.children]; // These are the actual slide item rows

  // Remove the original block content as we will rebuild it
  block.innerHTML = '';

  const slideshowContainer = document.createElement('div');
  slideshowContainer.classList.add('slideshow-container');
  slideshowContainer.style.position = 'relative';
  slideshowContainer.id = 'carousel-main';

  const dotContainer = document.createElement('div');
  dotContainer.style.textAlign = 'center';

  let slideIndex = 0;

  slideItems.forEach((row, index) => {
    const slide = document.createElement('div');
    moveInstrumentation(row, slide);
    slide.classList.add('mySlides');
    if (index === 0) {
      slide.style.display = 'block';
    } else {
      slide.style.display = 'none';
    }

    const linkEl = document.createElement('a');
    // The link is in the first cell of the item row
    const linkCell = row.children[0];
    const foundLink = linkCell ? linkCell.querySelector('a') : null;

    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.target = foundLink.target;
      moveInstrumentation(foundLink, linkEl);
    }

    // Mobile image is in the second cell, Desktop image in the third cell
    const mobileImageCell = row.children[1];
    const desktopImageCell = row.children[2];

    if (mobileImageCell) {
      const mobilePicture = mobileImageCell.querySelector('picture');
      if (mobilePicture) {
        const mobileImg = mobilePicture.querySelector('img');
        if (mobileImg) {
          const optimizedMobilePic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '750' }]);
          optimizedMobilePic.querySelector('img').classList.add('generic-mobile');
          moveInstrumentation(mobileImg, optimizedMobilePic.querySelector('img'));
          linkEl.append(optimizedMobilePic);
        }
      }
    }

    if (desktopImageCell) {
      const desktopPicture = desktopImageCell.querySelector('picture');
      if (desktopPicture) {
        const desktopImg = desktopPicture.querySelector('img');
        if (desktopImg) {
          const optimizedDesktopPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '2000' }]);
          optimizedDesktopPic.querySelector('img').classList.add('generic-desktop');
          moveInstrumentation(desktopImg, optimizedDesktopPic.querySelector('img'));
          linkEl.append(optimizedDesktopPic);
        }
      }
    }

    slide.append(linkEl);
    slideshowContainer.append(slide);

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

  block.append(slideshowContainer, dotContainer);

  function showSlides(n) {
    let i;
    const slides = slideshowContainer.querySelectorAll('.mySlides');
    const dots = dotContainer.querySelectorAll('.dot');
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].classList.remove('active');
    }
    if (slides.length > 0) { // Ensure there are slides to display
      slides[slideIndex - 1].style.display = 'block';
      dots[slideIndex - 1].classList.add('active');
    }
  }

  function plusSlides(n) {
    showSlides(slideIndex += n);
  }

  function currentSlide(n) {
    showSlides(slideIndex = n);
  }

  // Initialize carousel
  if (slideshowContainer.querySelectorAll('.mySlides').length > 0) {
    showSlides(1);
  }
}
