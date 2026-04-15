import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const slides = [];
  const quickLinks = [];

  children.forEach((row) => {
    // Use content detection for robustness, though length check is fine for fixed models
    // Spotlight-Slide has 7 cells: image, altText, heading, eyebrow, description, ctaLink, ctaLabel
    // Quick-Link-Item has 2 cells: link, label
    if (row.children.length === 7) {
      slides.push(row);
    } else if (row.children.length === 2) {
      quickLinks.push(row);
    }
  });

  const section = document.createElement('section');
  section.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');
  moveInstrumentation(block, section);

  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi');
  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  slides.forEach((slideRow) => {
    // CRITICAL FIX: Destructure children for fixed-field models
    const [imageCell, altTextCell, headingCell, eyebrowCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...slideRow.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'nogradient');
    // Check for 'dark-content' class based on original HTML example
    if (slideRow.classList.contains('dark-content')) {
      swiperSlide.classList.add('dark-content');
    }

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, altTextCell.textContent.trim(), false, [{ width: '1920' }]);
        moveInstrumentation(picture, optimizedPic.querySelector('img'));
        slideBgImg.append(optimizedPic);
      }
    }

    const mobContent = document.createElement('div');
    mobContent.classList.add('mob-content-home-spotlight');

    const content = document.createElement('div');
    content.classList.add('content', 'text-center', 'text-lg-start');

    if (eyebrowCell.textContent.trim()) {
      const small = document.createElement('small');
      small.style.fontWeight = 'bold'; // This style is from original HTML
      small.textContent = eyebrowCell.textContent.trim();
      content.append(small);
    }

    if (headingCell.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.classList.add('heading', 'font-medium', 'font-size-tb');
      // Check for banner-text-dark class from original HTML
      if (slideRow.classList.contains('banner-text-dark')) {
        h2.classList.add('banner-text-dark');
      }
      h2.innerHTML = headingCell.textContent.trim(); // Use innerHTML if content might have <br>
      content.append(h2);
    }

    if (descriptionCell.textContent.trim()) {
      const p = document.createElement('p');
      p.innerHTML = descriptionCell.textContent.trim(); // Use innerHTML if content might have <strong>
      content.append(p);
    }

    const ctaLinkAnchor = ctaLinkCell.querySelector('a'); // Get the actual anchor for href
    if (ctaLinkAnchor && ctaLabelCell.textContent.trim()) {
      const anchor = document.createElement('a');
      anchor.classList.add('btn', 'btn-primary');
      anchor.href = ctaLinkAnchor.href; // Read href from the anchor
      anchor.textContent = ctaLabelCell.textContent.trim();
      content.append(anchor);
    }

    mobContent.append(content);
    swiperSlide.append(slideBgImg, mobContent);
    moveInstrumentation(slideRow, swiperSlide);
    swiperWrapper.append(swiperSlide);
  });

  beamSlider.append(swiperWrapper);

  const prevButton = document.createElement('div');
  prevButton.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  const prevImg = document.createElement('img');
  prevImg.alt = 'svg file';
  // CRITICAL FIX: Use the exact image source from original HTML
  prevImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776285861860.svg+xml';
  prevButton.append(prevImg);
  beamSlider.append(prevButton);

  const nextButton = document.createElement('div');
  nextButton.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  const nextImg = document.createElement('img');
  nextImg.alt = 'svg file';
  // CRITICAL FIX: Use the exact image source from original HTML
  nextImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776285861860.svg+xml';
  nextButton.append(nextImg);
  beamSlider.append(nextButton);

  const pagination = document.createElement('div');
  pagination.classList.add('swiper-pagination', 'bullet-bottom');
  beamSlider.append(pagination);

  section.append(beamSlider);

  const quickLinksParentDiv = document.createElement('div');
  quickLinksParentDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate'); // Add aos classes from original HTML

  const ul = document.createElement('ul');
  ul.classList.add('quick-links-div');

  quickLinks.forEach((quickLinkRow) => {
    // CRITICAL FIX: Destructure children for fixed-field models
    const [linkCell, labelCell] = [...quickLinkRow.children];

    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.classList.add('with-full-underline');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href; // Read href from the anchor
    }
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);
    moveInstrumentation(quickLinkRow, li);
    ul.append(li);
  });

  container.append(ul);
  quickLinksParentDiv.append(container);
  section.append(quickLinksParentDiv);

  block.replaceWith(section);

  // Swiper initialization (simplified for EDS)
  let currentSlide = 0;
  const slidesCount = swiperWrapper.children.length;

  const updateSlide = () => {
    swiperWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
    [...swiperWrapper.children].forEach((slide, i) => {
      if (i === currentSlide) {
        slide.classList.add('swiper-slide-active', 'swiper-slide-visible', 'swiper-slide-fully-visible');
        slide.setAttribute('aria-label', `${i + 1} / ${slidesCount}`);
      } else {
        slide.classList.remove('swiper-slide-active', 'swiper-slide-visible', 'swiper-slide-fully-visible');
      }
    });

    // Update pagination bullets
    pagination.innerHTML = '';
    for (let i = 0; i < slidesCount; i += 1) {
      const bullet = document.createElement('span');
      bullet.classList.add('swiper-pagination-bullet');
      if (i === currentSlide) {
        bullet.classList.add('swiper-pagination-bullet-active');
      }
      bullet.addEventListener('click', () => {
        currentSlide = i;
        updateSlide();
      });
      pagination.append(bullet);
    }
  };

  prevButton.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slidesCount) % slidesCount;
    updateSlide();
  });

  nextButton.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slidesCount;
    updateSlide();
  });

  updateSlide(); // Initial slide setup
}
