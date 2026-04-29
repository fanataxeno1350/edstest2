import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const rows = [...block.children];

  const spotlightSlides = rows.filter((row) => row.children.length === 8);
  const quickLinkItems = rows.filter((row) => row.children.length === 2);

  const section = document.createElement('section');
  section.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');

  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi');
  beamSlider.setAttribute('data-aos', 'fade-up');
  beamSlider.setAttribute('data-aos-offset', '-100');
  beamSlider.setAttribute('data-aos-duration', '650');
  beamSlider.setAttribute('data-aos-easing', 'ease-in-out');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperWrapper.id = `swiper-wrapper-${Math.random().toString(36).substring(2, 15)}`; // Generate unique ID

  spotlightSlides.forEach((row) => {
    const [
      backgroundImageDesktopCell,
      backgroundImageTabletCell,
      backgroundImageMobileCell,
      headlineCell,
      subheadlineCell,
      descriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'nogradient');
    // Check if the slide should have 'dark-content' class based on original HTML
    // This is a heuristic, as there's no explicit model field for it.
    // Assuming if subheadline or description is present, it might imply dark content.
    // A more robust solution would be to add a model field for 'dark-content'.
    const hasDarkContent = subheadlineCell.textContent.trim() || descriptionCell.textContent.trim();
    if (hasDarkContent) {
      // This is a heuristic. If the original HTML has a specific pattern to determine 'dark-content',
      // it should be implemented here. For now, we'll add it if there's content.
      // A better approach would be to add a specific model field for this.
      // For now, we'll check if the original row had the class.
      if (row.classList.contains('dark-content')) {
        swiperSlide.classList.add('dark-content');
      }
    }
    moveInstrumentation(row, swiperSlide);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');

    const picture = document.createElement('picture');

    const mobileImg = backgroundImageMobileCell.querySelector('img');
    if (mobileImg) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      sourceMobile.srcset = mobileImg.src;
      picture.appendChild(sourceMobile);
    }

    const tabletImg = backgroundImageTabletCell.querySelector('img');
    if (tabletImg) {
      const sourceTablet = document.createElement('source');
      sourceTablet.media = '(max-width: 799px)';
      sourceTablet.srcset = tabletImg.src;
      picture.appendChild(sourceTablet);
    }

    const desktopImg = backgroundImageDesktopCell.querySelector('img');
    if (desktopImg) {
      const img = createOptimizedPicture(desktopImg.src, desktopImg.alt, true, [{ width: '1903' }]);
      moveInstrumentation(desktopImg, img.querySelector('img'));
      picture.appendChild(img.querySelector('img'));
    }

    slideBgImg.appendChild(picture);
    swiperSlide.appendChild(slideBgImg);

    const mobContentHomeSpotlight = document.createElement('div');
    mobContentHomeSpotlight.classList.add('mob-content-home-spotlight');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'text-center', 'text-lg-start');

    const subheadlineText = subheadlineCell.textContent.trim();
    if (subheadlineText) {
      const small = document.createElement('small');
      small.style.fontWeight = 'bold';
      small.textContent = subheadlineText;
      contentDiv.appendChild(small);
    }

    const headlineContent = headlineCell.innerHTML.trim();
    if (headlineContent) {
      const h1 = document.createElement('h1');
      h1.classList.add('heading', 'font-medium', 'font-size-tb');
      // Add banner-text-dark class if present in original HTML for the first slide
      // This is a heuristic, ideally this would be a model field.
      if (row.classList.contains('banner-text-dark')) { // Check if the original row had this class
        h1.classList.add('banner-text-dark');
      }
      // Check for heading-small class from original HTML
      if (headlineCell.querySelector('h2.heading-small')) {
        h1.classList.add('heading-small');
      }
      h1.innerHTML = headlineContent;
      contentDiv.appendChild(h1);
    }

    const descriptionContent = descriptionCell.innerHTML.trim();
    if (descriptionContent) {
      const p = document.createElement('p');
      p.innerHTML = descriptionContent;
      contentDiv.appendChild(p);
    }

    const ctaLink = ctaLinkCell.querySelector('a');
    const ctaLabel = ctaLabelCell.textContent.trim();
    if (ctaLink && ctaLabel) {
      const a = document.createElement('a');
      a.href = ctaLink.href;
      // Copy target attribute if present, assuming it's from the original link
      if (ctaLink.hasAttribute('target')) {
        a.setAttribute('target', ctaLink.getAttribute('target'));
      }
      a.textContent = ctaLabel;
      // Check for specific button classes from original HTML
      if (ctaLink.classList.contains('btn')) {
        a.classList.add('btn');
      }
      if (ctaLink.classList.contains('btn-primary')) {
        a.classList.add('btn-primary');
      }
      // Copy inline styles if present for button
      if (ctaLink.hasAttribute('style')) {
        a.setAttribute('style', ctaLink.getAttribute('style'));
      }
      contentDiv.appendChild(a);
    }

    mobContentHomeSpotlight.appendChild(contentDiv);
    swiperSlide.appendChild(mobContentHomeSpotlight);
    swiperWrapper.appendChild(swiperSlide);
  });

  beamSlider.appendChild(swiperWrapper);

  const prevBtn = document.createElement('div');
  prevBtn.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  prevBtn.innerHTML = '<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>';
  beamSlider.appendChild(prevBtn);

  const nextBtn = document.createElement('div');
  nextBtn.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  nextBtn.innerHTML = '<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>';
  beamSlider.appendChild(nextBtn);

  const paginationEl = document.createElement('div');
  paginationEl.classList.add('swiper-pagination', 'bullet-bottom');
  beamSlider.appendChild(paginationEl);

  section.appendChild(beamSlider);

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
    const [linkCell, labelCell] = [...row.children];

    const li = document.createElement('li');
    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      // Copy target attribute if present, assuming it's from the original link
      if (foundLink.hasAttribute('target')) {
        link.setAttribute('target', foundLink.getAttribute('target'));
      }
    }
    link.textContent = labelCell.textContent.trim();
    link.classList.add('with-full-underline');
    moveInstrumentation(row, li);
    li.appendChild(link);
    quickLinksUl.appendChild(li);
  });

  containerDiv.appendChild(quickLinksUl);
  quickLinksParentDiv.appendChild(containerDiv);
  section.appendChild(quickLinksParentDiv);

  block.replaceChildren(section);

  // Initialize Swiper
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  // eslint-disable-next-line no-undef
  new Swiper(beamSlider, {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true, // Assuming loop from original HTML behavior
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: paginationEl,
      clickable: true,
    },
    breakpoints: {
      // Add breakpoints if needed based on original HTML/CSS responsive behavior
      // Example:
      // 576: { slidesPerView: 1 },
      // 768: { slidesPerView: 1 },
      // 992: { slidesPerView: 1 },
    },
  });
}
