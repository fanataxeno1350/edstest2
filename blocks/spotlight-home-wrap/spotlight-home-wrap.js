import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const allRows = [...block.children];

  // Filter rows based on the number of children to distinguish between slides and quick links
  // Slides have 6 cells, Quick Links have 2 cells
  const slides = allRows.filter((row) => [...row.children].length === 6);
  const quickLinks = allRows.filter((row) => [...row.children].length === 2);

  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi', 'swiper-initialized', 'swiper-horizontal', 'swiper-watch-progress', 'swiper-backface-hidden');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperWrapper.setAttribute('id', 'swiper-wrapper-1aeb1d42fe6bbb42');
  swiperWrapper.setAttribute('aria-live', 'off');

  slides.forEach((row, index) => {
    const swiperSlide = document.createElement('div');
    moveInstrumentation(row, swiperSlide);
    swiperSlide.classList.add('swiper-slide', 'nogradient');
    swiperSlide.setAttribute('role', 'group');
    swiperSlide.setAttribute('aria-label', `${index + 1} / ${slides.length}`);
    swiperSlide.setAttribute('data-swiper-slide-index', index);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');

    const mobContentHomeSpotlight = document.createElement('div');
    mobContentHomeSpotlight.classList.add('mob-content-home-spotlight');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'text-center', 'text-lg-start');

    const cells = [...row.children];
    // Based on BlockJson structure:
    // cell[0]: image
    // cell[1]: alt
    // cell[2]: heading
    // cell[3]: subheading
    // cell[4]: text
    // cell[5]: link

    const imageCell = cells[0];
    const altTextCell = cells[1];
    const headingCell = cells[2];
    const subheadingCell = cells[3];
    const textCell = cells[4];
    const linkCell = cells[5];

    let imageEl = null;
    let altText = '';
    let headingEl = null;
    let subheadingEl = null;
    let textEl = null;
    let linkEl = null;

    if (imageCell) {
      imageEl = imageCell.querySelector('picture');
    }
    if (altTextCell) {
      altText = altTextCell.textContent.trim();
    }
    if (headingCell) {
      headingEl = headingCell.querySelector('h1, h2, h3, h4, h5, h6, p'); // Allow p for heading if no h tag
    }
    if (subheadingCell) {
      subheadingEl = subheadingCell.querySelector('p');
    }
    if (textCell) {
      textEl = textCell.querySelector('p');
    }
    if (linkCell) {
      linkEl = linkCell.querySelector('a');
    }

    if (imageEl) {
      const img = imageEl.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt || altText, false, [{ width: '1903' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageEl.replaceWith(optimizedPic);
      slideBgImg.append(optimizedPic);
    }

    if (subheadingEl) {
      const small = document.createElement('small');
      small.style.fontWeight = 'bold'; // This style is from original HTML
      moveInstrumentation(subheadingEl, small);
      while (subheadingEl.firstChild) small.append(subheadingEl.firstChild);
      contentDiv.append(small);
    }

    if (headingEl) {
      const hTag = document.createElement(headingEl.tagName);
      hTag.classList.add('heading', 'font-medium', 'font-size-tb');
      // Check if the original HTML had 'banner-text-dark' for the heading
      if (headingEl.classList.contains('banner-text-dark')) {
        hTag.classList.add('banner-text-dark');
      }
      moveInstrumentation(headingEl, hTag);
      while (headingEl.firstChild) hTag.append(headingEl.firstChild);
      contentDiv.append(hTag);
    }

    if (textEl) {
      const p = document.createElement('p');
      moveInstrumentation(textEl, p);
      while (textEl.firstChild) p.append(textEl.firstChild);
      contentDiv.append(p);
    }

    if (linkEl) {
      const a = document.createElement('a');
      a.classList.add('btn', 'btn-primary');
      a.href = linkEl.href;
      a.textContent = linkEl.textContent;
      moveInstrumentation(linkEl, a);
      contentDiv.append(a);
    }

    mobContentHomeSpotlight.append(contentDiv);
    swiperSlide.append(slideBgImg, mobContentHomeSpotlight);
    swiperWrapper.append(swiperSlide);
  });

  beamSlider.append(swiperWrapper);

  const prevButton = document.createElement('div');
  prevButton.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  prevButton.setAttribute('tabindex', '0');
  prevButton.setAttribute('role', 'button');
  prevButton.setAttribute('aria-label', 'Previous slide');
  prevButton.setAttribute('aria-controls', 'swiper-wrapper-1aeb1d42fe6bbb42');
  const prevImg = document.createElement('img');
  prevImg.setAttribute('alt', 'svg file');
  prevImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775643016628.svg+xml';
  prevButton.append(prevImg);
  beamSlider.append(prevButton);

  const nextButton = document.createElement('div');
  nextButton.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  nextButton.setAttribute('tabindex', '0');
  nextButton.setAttribute('role', 'button');
  nextButton.setAttribute('aria-label', 'Next slide');
  nextButton.setAttribute('aria-controls', 'swiper-wrapper-1aeb1d42fe6bbb42');
  const nextImg = document.createElement('img');
  nextImg.setAttribute('alt', 'svg file');
  nextImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775643016628.svg+xml';
  nextButton.append(nextImg);
  beamSlider.append(nextButton);

  const pagination = document.createElement('div');
  pagination.classList.add('swiper-pagination', 'bullet-bottom');
  beamSlider.append(pagination);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  beamSlider.append(swiperNotification);

  const quickLinksParentDiv = document.createElement('div');
  quickLinksParentDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'aos-init', 'aos-animate');
  containerDiv.setAttribute('data-aos', 'fade-up');
  containerDiv.setAttribute('data-aos-offset', '-100');
  containerDiv.setAttribute('data-aos-duration', '650');
  containerDiv.setAttribute('data-aos-easing', 'ease-in-out');

  const ul = document.createElement('ul');
  ul.classList.add('quick-links-div');

  quickLinks.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    // Based on BlockJson structure:
    // cell[0]: link
    // cell[1]: text
    const linkCell = [...row.children][0];
    const textCell = [...row.children][1];

    if (linkCell && linkCell.querySelector('a')) {
      const originalLink = linkCell.querySelector('a');
      const a = document.createElement('a');
      a.href = originalLink.href;
      a.classList.add('with-full-underline');
      a.textContent = originalLink.textContent;
      moveInstrumentation(originalLink, a);
      li.append(a);
    } else if (textCell && textCell.textContent.trim() !== '') {
      // Fallback if link cell is empty but text cell has content
      const a = document.createElement('a');
      a.classList.add('with-full-underline');
      a.textContent = textCell.textContent.trim();
      moveInstrumentation(textCell, a);
      li.append(a);
    }
    ul.append(li);
  });

  containerDiv.append(ul);
  quickLinksParentDiv.append(containerDiv);

  block.textContent = '';
  block.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');
  block.append(beamSlider, quickLinksParentDiv);

  // Swiper initialization (simplified, full Swiper logic would be more complex)
  let currentIndex = 0;
  const slidesCount = swiperWrapper.children.length;

  const updateSlidePosition = () => {
    swiperWrapper.style.transform = `translate3d(-${currentIndex * 100}%, 0px, 0px)`;
    [...swiperWrapper.children].forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add('swiper-slide-active', 'swiper-slide-visible', 'swiper-slide-fully-visible');
        slide.querySelector('.content').classList.add('active');
      } else {
        slide.classList.remove('swiper-slide-active', 'swiper-slide-visible', 'swiper-slide-fully-visible');
        slide.querySelector('.content').classList.remove('active');
      }
      if (i === currentIndex - 1) {
        slide.classList.add('swiper-slide-prev');
      } else {
        slide.classList.remove('swiper-slide-prev');
      }
      if (i === currentIndex + 1) {
        slide.classList.add('swiper-slide-next');
      } else {
        slide.classList.remove('swiper-slide-next');
      }
    });

    // Update pagination
    pagination.innerHTML = '';
    for (let i = 0; i < slidesCount; i += 1) {
      const bullet = document.createElement('span');
      bullet.classList.add('swiper-pagination-bullet');
      if (i === currentIndex) {
        bullet.classList.add('swiper-pagination-bullet-active');
      }
      bullet.addEventListener('click', () => {
        currentIndex = i;
        updateSlidePosition();
      });
      pagination.append(bullet);
    }
  };

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slidesCount) % slidesCount;
    updateSlidePosition();
  });

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slidesCount;
    updateSlidePosition();
  });

  updateSlidePosition(); // Initial render
}
