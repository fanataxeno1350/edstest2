import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const allRows = [...block.children];

  // Filter rows based on the number of children to distinguish slide items from quick link items
  const slideRows = allRows.filter((row) => row.children.length === 7);
  const quickLinkRows = allRows.filter((row) => row.children.length === 2);

  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi', 'swiper-initialized', 'swiper-horizontal', 'swiper-watch-progress', 'swiper-backface-hidden');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperWrapper.setAttribute('aria-live', 'off');

  slideRows.forEach((row, index) => {
    const cells = [...row.children];

    // Use content detection for cells where possible, or fall back to index if structure is strict
    const mainImageCell = cells.find((c) => c.querySelector('picture'));
    const altTextCell = cells.find((c) => !c.querySelector('picture') && !c.querySelector('a') && c.textContent.trim().length > 0 && c.textContent.trim() === row.children[1].textContent.trim()); // Assuming altText is the second cell and plain text
    const headingCell = cells.find((c) => !c.querySelector('picture') && !c.querySelector('a') && c.textContent.trim().length > 0 && c.textContent.trim() === row.children[2].textContent.trim()); // Assuming heading is the third cell and plain text
    const subheadingCell = cells.find((c) => !c.querySelector('picture') && !c.querySelector('a') && c.textContent.trim().length > 0 && c.textContent.trim() === row.children[3].textContent.trim()); // Assuming subheading is the fourth cell and plain text
    const descriptionCell = cells.find((c) => c.querySelector('p') && c.textContent.trim() === row.children[4].textContent.trim()); // Description is richtext with <p>
    const ctaLinkCell = cells.find((c) => c.querySelector('a') && c.textContent.trim() === row.children[5].textContent.trim()); // CTA Link has an <a>
    const ctaLabelCell = cells.find((c) => !c.querySelector('picture') && !c.querySelector('a') && c.textContent.trim().length > 0 && c.textContent.trim() === row.children[6].textContent.trim()); // CTA Label is plain text

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'nogradient');
    swiperSlide.setAttribute('role', 'group');
    swiperSlide.setAttribute('aria-label', `${index + 1} / ${slideRows.length}`);
    swiperSlide.setAttribute('data-swiper-slide-index', index);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');
    if (mainImageCell) {
      const picture = mainImageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, altTextCell?.textContent || img.alt, false, [{ width: '1903' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          slideBgImg.append(optimizedPic);
        }
      }
    }

    const mobContentHomeSpotlight = document.createElement('div');
    mobContentHomeSpotlight.classList.add('mob-content-home-spotlight');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'text-center', 'text-lg-start');

    if (subheadingCell?.textContent.trim()) {
      const small = document.createElement('small');
      small.style.fontWeight = 'bold';
      small.textContent = subheadingCell.textContent.trim();
      moveInstrumentation(subheadingCell, small);
      contentDiv.append(small);
    }

    if (headingCell?.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.classList.add('heading', 'font-medium', 'font-size-tb');
      h2.innerHTML = headingCell.innerHTML; // Use innerHTML for richtext
      moveInstrumentation(headingCell, h2);
      contentDiv.append(h2);
    }

    if (descriptionCell?.textContent.trim()) {
      const p = document.createElement('p');
      p.innerHTML = descriptionCell.innerHTML; // Use innerHTML for richtext
      moveInstrumentation(descriptionCell, p);
      contentDiv.append(p);
    }

    const ctaLink = ctaLinkCell?.querySelector('a');
    if (ctaLink && ctaLabelCell?.textContent.trim()) {
      const a = document.createElement('a');
      a.href = ctaLink.href;
      a.classList.add('btn', 'btn-primary');
      a.textContent = ctaLabelCell.textContent.trim();
      moveInstrumentation(ctaLinkCell, a);
      moveInstrumentation(ctaLabelCell, a);
      contentDiv.append(a);
    }

    mobContentHomeSpotlight.append(contentDiv);
    swiperSlide.append(slideBgImg, mobContentHomeSpotlight);
    moveInstrumentation(row, swiperSlide);
    swiperWrapper.append(swiperSlide);
  });

  beamSlider.append(swiperWrapper);

  // Swiper navigation buttons
  const prevButton = document.createElement('div');
  prevButton.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  prevButton.setAttribute('tabindex', '0');
  prevButton.setAttribute('role', 'button');
  prevButton.setAttribute('aria-label', 'Previous slide');
  // Corrected image path to match ORIGINAL HTML
  prevButton.innerHTML = '<img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1776185160953.svg+xml"/>';
  beamSlider.append(prevButton);

  const nextButton = document.createElement('div');
  nextButton.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  nextButton.setAttribute('tabindex', '0');
  nextButton.setAttribute('role', 'button');
  nextButton.setAttribute('aria-label', 'Next slide');
  // Corrected image path to match ORIGINAL HTML
  nextButton.innerHTML = '<img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1776185160953.svg+xml"/>';
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

  const quickLinksUl = document.createElement('ul');
  quickLinksUl.classList.add('quick-links-div');

  quickLinkRows.forEach((row) => {
    const cells = [...row.children];
    // Use content detection for quick link cells
    const linkCell = cells.find((c) => c.querySelector('a'));
    const labelCell = cells.find((c) => !c.querySelector('a') && c.textContent.trim().length > 0);

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.classList.add('with-full-underline');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      a.href = foundLink.href;
    }
    a.textContent = labelCell?.textContent || '';
    moveInstrumentation(linkCell, a);
    moveInstrumentation(labelCell, a);
    li.append(a);
    moveInstrumentation(row, li);
    quickLinksUl.append(li);
  });

  containerDiv.append(quickLinksUl);
  quickLinksParentDiv.append(containerDiv);

  block.textContent = '';
  block.append(beamSlider, quickLinksParentDiv);

  // Initialize Swiper (minimal implementation for functionality)
  let currentIndex = 0;
  const slides = swiperWrapper.querySelectorAll('.swiper-slide');
  const totalSlides = slides.length;

  const updateSlider = () => {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(-${currentIndex * 100}%)`;
      slide.classList.remove('swiper-slide-active', 'swiper-slide-prev', 'swiper-slide-next', 'swiper-slide-visible', 'swiper-slide-fully-visible');
      if (i === currentIndex) {
        slide.classList.add('swiper-slide-active', 'swiper-slide-visible', 'swiper-slide-fully-visible');
      } else if (i === (currentIndex - 1 + totalSlides) % totalSlides) {
        slide.classList.add('swiper-slide-prev');
      } else if (i === (currentIndex + 1) % totalSlides) {
        slide.classList.add('swiper-slide-next');
      }
    });

    // Update pagination
    pagination.innerHTML = '';
    for (let i = 0; i < totalSlides; i += 1) {
      const bullet = document.createElement('span');
      bullet.classList.add('swiper-pagination-bullet');
      if (i === currentIndex) {
        bullet.classList.add('swiper-pagination-bullet-active');
      }
      bullet.addEventListener('click', () => {
        currentIndex = i;
        updateSlider();
      });
      pagination.append(bullet);
    }
  };

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
  });

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
  });

  updateSlider(); // Initial display
}
