import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const allRows = [...block.children];
  const slideRows = allRows.filter((row) => row.children.length === 8);
  const quickLinkRows = allRows.filter((row) => row.children.length === 2);

  const section = document.createElement('section');
  section.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');

  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi');
  beamSlider.setAttribute('data-loop', 'false'); // Assuming default loop false, adjust if needed from HTML

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  slideRows.forEach((row) => {
    const [desktopImageCell, mobileImage576Cell, mobileImage799Cell,
      smallTextCell, headlineCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'nogradient'); // Add dark-content if needed based on content

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');

    // Create picture element with multiple sources
    const picture = document.createElement('picture');

    const mobile576Source = document.createElement('source');
    mobile576Source.media = '(max-width: 576px)';
    mobile576Source.srcset = mobileImage576Cell.querySelector('img')?.src || '';
    picture.append(mobile576Source);

    const mobile799Source = document.createElement('source');
    mobile799Source.media = '(max-width: 799px)';
    mobile799Source.srcset = mobileImage799Cell.querySelector('img')?.src || '';
    picture.append(mobile799Source);

    const desktopImg = desktopImageCell.querySelector('img');
    if (desktopImg) {
      const optimizedPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '1903' }]);
      moveInstrumentation(desktopImg, optimizedPic.querySelector('img'));
      picture.append(optimizedPic.querySelector('img'));
    }

    slideBgImg.append(picture);
    swiperSlide.append(slideBgImg);

    const mobContentHomeSpotlight = document.createElement('div');
    mobContentHomeSpotlight.classList.add('mob-content-home-spotlight');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'text-center', 'text-lg-start');

    const smallText = smallTextCell.textContent.trim();
    if (smallText) {
      const smallEl = document.createElement('small');
      smallEl.textContent = smallText;
      smallEl.style.fontWeight = 'bold'; // From original HTML
      contentDiv.append(smallEl);
    }

    const headline = document.createElement('h1');
    headline.classList.add('heading', 'font-medium', 'font-size-tb');
    headline.innerHTML = headlineCell.innerHTML;
    contentDiv.append(headline);

    const description = document.createElement('p');
    description.innerHTML = descriptionCell.innerHTML;
    contentDiv.append(description);

    const ctaLink = ctaLinkCell.querySelector('a');
    const ctaLabel = ctaLabelCell.textContent.trim();
    if (ctaLink && ctaLabel) {
      const anchor = document.createElement('a');
      anchor.href = ctaLink.href;
      anchor.textContent = ctaLabel;
      anchor.classList.add('btn', 'btn-primary');
      moveInstrumentation(ctaLinkCell, anchor);
      contentDiv.append(anchor);
    }

    mobContentHomeSpotlight.append(contentDiv);
    swiperSlide.append(mobContentHomeSpotlight);
    moveInstrumentation(row, swiperSlide);
    swiperWrapper.append(swiperSlide);
  });

  beamSlider.append(swiperWrapper);

  // Swiper navigation buttons
  const prevBtn = document.createElement('div');
  prevBtn.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  prevBtn.innerHTML = '<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>';
  beamSlider.append(prevBtn);

  const nextBtn = document.createElement('div');
  nextBtn.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  nextBtn.innerHTML = '<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>';
  beamSlider.append(nextBtn);

  const paginationEl = document.createElement('div');
  paginationEl.classList.add('swiper-pagination', 'bullet-bottom');
  beamSlider.append(paginationEl);

  section.append(beamSlider);

  // Quick Links section
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
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.classList.add('with-full-underline');
    anchor.textContent = labelCell.textContent.trim();
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      if (foundLink.target) anchor.target = foundLink.target; // Copy target if present
    }
    moveInstrumentation(row, anchor);
    li.append(anchor);
    quickLinksUl.append(li);
  });

  containerDiv.append(quickLinksUl);
  quickLinksParentDiv.append(containerDiv);
  section.append(quickLinksParentDiv);

  block.replaceChildren(section);

  // Initialize Swiper
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(beamSlider, {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: beamSlider.dataset.loop === 'true',
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: paginationEl,
      clickable: true,
    },
    breakpoints: { // Example breakpoints, adjust based on actual design
      576: { slidesPerView: 1 },
      768: { slidesPerView: 1 },
      992: { slidesPerView: 1 },
    },
  });
}
