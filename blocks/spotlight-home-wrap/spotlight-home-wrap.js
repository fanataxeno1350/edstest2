import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const allRows = [...block.children];

  const slideItems = allRows.filter((row) => row.children.length === 7);
  const quickLinkItems = allRows.filter((row) => row.children.length === 2);

  const section = document.createElement('section');
  section.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');
  moveInstrumentation(block, section);

  // --- Main Slider Section ---
  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi', 'swiper-initialized', 'swiper-horizontal', 'swiper-watch-progress', 'swiper-backface-hidden');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperWrapper.setAttribute('aria-live', 'off');

  slideItems.forEach((row, index) => {
    const cells = [...row.children];

    // Robust content detection for slide items
    const imageCell = cells.find((c) => c.querySelector('picture'));
    // Alt text is plain text, not a picture, link, or paragraph
    const altTextCell = cells.find((c) => !c.querySelector('picture') && !c.querySelector('a') && !c.querySelector('p') && c.textContent.trim() !== '');
    // Heading is richtext, typically contains a <p> or <h1>/<h2>
    const headingCell = cells.find((c) => c.querySelector('p') || c.querySelector('h1') || c.querySelector('h2'));
    // Subheading is richtext, typically contains a <p> or <small>
    const subheadingCell = cells.find((c) => c.querySelector('p') || c.querySelector('small'));
    // Description is richtext, typically contains a <p>
    const descriptionCell = cells.find((c) => c.querySelector('p'));
    // CTA Link contains an <a> tag
    const ctaLinkCell = cells.find((c) => c.querySelector('a'));
    // CTA Label is plain text, not a picture, link, or paragraph
    const ctaLabelCell = cells.find((c) => !c.querySelector('picture') && !c.querySelector('a') && !c.querySelector('p') && c.textContent.trim() !== '');


    const slide = document.createElement('div');
    slide.classList.add('swiper-slide', 'nogradient');
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-label', `${index + 1} / ${slideItems.length}`);
    slide.setAttribute('data-swiper-slide-index', index);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');
    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, altTextCell?.textContent.trim() || img.alt, index === 0, [{ width: '1920' }]);
          moveInstrumentation(imageCell, optimizedPic);
          slideBgImg.append(optimizedPic);
        }
      }
    }

    const mobContentHomeSpotlight = document.createElement('div');
    mobContentHomeSpotlight.classList.add('mob-content-home-spotlight');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'text-center', 'text-lg-start');

    if (subheadingCell && subheadingCell.textContent.trim()) {
      const small = document.createElement('small');
      small.style.fontWeight = 'bold';
      moveInstrumentation(subheadingCell, small);
      small.innerHTML = subheadingCell.innerHTML; // Use innerHTML for richtext
      contentDiv.append(small);
    }

    if (headingCell && headingCell.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.classList.add('heading', 'font-medium', 'font-size-tb');
      moveInstrumentation(headingCell, h2);
      h2.innerHTML = headingCell.innerHTML; // Use innerHTML for richtext
      contentDiv.append(h2);
    }

    if (descriptionCell && descriptionCell.textContent.trim()) {
      const p = document.createElement('p');
      moveInstrumentation(descriptionCell, p);
      p.innerHTML = descriptionCell.innerHTML; // Use innerHTML for richtext
      contentDiv.append(p);
    }

    if (ctaLinkCell && ctaLinkCell.querySelector('a')) {
      const ctaLink = document.createElement('a');
      ctaLink.classList.add('btn', 'btn-primary');
      ctaLink.href = ctaLinkCell.querySelector('a').href;
      ctaLink.textContent = ctaLabelCell?.textContent.trim() || ctaLinkCell.querySelector('a').textContent.trim();
      moveInstrumentation(ctaLinkCell, ctaLink);
      moveInstrumentation(ctaLabelCell, ctaLink);
      contentDiv.append(ctaLink);
    }

    mobContentHomeSpotlight.append(contentDiv);
    slide.append(slideBgImg, mobContentHomeSpotlight);
    swiperWrapper.append(slide);
    moveInstrumentation(row, slide);
  });

  const prevButton = document.createElement('div');
  prevButton.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  prevButton.setAttribute('tabindex', '0');
  prevButton.setAttribute('role', 'button');
  prevButton.setAttribute('aria-label', 'Previous slide');
  prevButton.innerHTML = '<img alt="svg file" src="/etc.clientlibs/mahindra/clientlibs/clientlib-site/resources/images/arrow-left.svg"/>';

  const nextButton = document.createElement('div');
  nextButton.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  nextButton.setAttribute('tabindex', '0');
  nextButton.setAttribute('role', 'button');
  nextButton.setAttribute('aria-label', 'Next slide');
  nextButton.innerHTML = '<img alt="svg file" src="/etc.clientlibs/mahindra/clientlibs/clientlib-site/resources/images/arrow-right.svg"/>';

  const pagination = document.createElement('div');
  pagination.classList.add('swiper-pagination', 'bullet-bottom');

  beamSlider.append(swiperWrapper, prevButton, nextButton, pagination);
  section.append(beamSlider);

  // --- Quick Links Section ---
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

  quickLinkItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find((c) => !c.querySelector('a'));
    const linkCell = cells.find((c) => c.querySelector('a'));

    if (linkCell && linkCell.querySelector('a')) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.classList.add('with-full-underline');
      a.href = linkCell.querySelector('a').href;
      a.textContent = labelCell?.textContent.trim() || linkCell.querySelector('a').textContent.trim();
      moveInstrumentation(row, li);
      li.append(a);
      quickLinksUl.append(li);
    }
  });

  containerDiv.append(quickLinksUl);
  quickLinksParentDiv.append(containerDiv);
  section.append(quickLinksParentDiv);

  block.textContent = '';
  block.append(section);

  // Swiper initialization (simplified, full Swiper library not included in EDS)
  let currentSlide = 0;
  const slides = swiperWrapper.querySelectorAll('.swiper-slide');
  const totalSlides = slides.length;

  const updateSlider = () => {
    slides.forEach((slide, idx) => {
      slide.style.transform = `translateX(-${currentSlide * 100}%)`;
      if (idx === currentSlide) {
        slide.classList.add('swiper-slide-active');
        slide.classList.add('swiper-slide-visible');
        slide.classList.add('swiper-slide-fully-visible');
        slide.setAttribute('aria-current', 'true');
      } else {
        slide.classList.remove('swiper-slide-active');
        slide.classList.remove('swiper-slide-visible');
        slide.classList.remove('swiper-slide-fully-visible');
        slide.removeAttribute('aria-current');
      }
      if (idx === (currentSlide - 1 + totalSlides) % totalSlides) {
        slide.classList.add('swiper-slide-prev');
      } else {
        slide.classList.remove('swiper-slide-prev');
      }
      if (idx === (currentSlide + 1) % totalSlides) {
        slide.classList.add('swiper-slide-next');
      } else {
        slide.classList.remove('swiper-slide-next');
      }
    });

    // Update pagination bullets
    pagination.innerHTML = '';
    for (let i = 0; i < totalSlides; i += 1) {
      const bullet = document.createElement('span');
      bullet.classList.add('swiper-pagination-bullet');
      if (i === currentSlide) {
        bullet.classList.add('swiper-pagination-bullet-active');
      }
      bullet.addEventListener('click', () => {
        currentSlide = i;
        updateSlider();
      });
      pagination.append(bullet);
    }
  };

  prevButton.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
  });

  nextButton.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
  });

  if (totalSlides > 0) {
    updateSlider(); // Initialize slider state
  }
}
