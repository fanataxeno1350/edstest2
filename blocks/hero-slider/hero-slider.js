import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const slides = [];
  const quickLinks = [];

  // Separate slide items from quick link items
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    // Hero Slide Item has 8 cells
    if (cells.length === 8 && cells[0].querySelector('picture')) {
      slides.push(row);
    }
    // Quick Link Item has 2 cells
    if (cells.length === 2 && cells[1].querySelector('a')) {
      quickLinks.push(row);
    }
  });

  const section = document.createElement('section');
  section.classList.add('spotlight-home-wrap', 'm-0', 'p-0'); // Removed 'section' as it's the element type

  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  slides.forEach((slideRow) => {
    const [
      desktopImageCell,
      tabletImageCell,
      mobileImageCell,
      slideSmallTextCell,
      slideHeadlineCell,
      slideDescriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...slideRow.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'nogradient');
    moveInstrumentation(slideRow, swiperSlide);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');

    const picture = document.createElement('picture');
    const desktopImg = desktopImageCell.querySelector('picture > img');
    const tabletImg = tabletImageCell.querySelector('picture > img');
    const mobileImg = mobileImageCell.querySelector('picture > img');

    if (mobileImg) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      sourceMobile.srcset = mobileImg.src;
      picture.append(sourceMobile);
    }
    if (tabletImg) {
      const sourceTablet = document.createElement('source');
      sourceTablet.media = '(max-width: 799px)';
      sourceTablet.srcset = tabletImg.src;
      picture.append(sourceTablet);
    }
    if (desktopImg) {
      const img = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '1903' }]);
      moveInstrumentation(desktopImg, img.querySelector('img'));
      picture.append(img.querySelector('img'));
    }
    slideBgImg.append(picture);

    const mobContent = document.createElement('div');
    mobContent.classList.add('mob-content-home-spotlight');

    const content = document.createElement('div');
    content.classList.add('content', 'text-center', 'text-lg-start');

    const smallText = slideSmallTextCell.textContent.trim();
    if (smallText) {
      const smallEl = document.createElement('small');
      smallEl.textContent = smallText;
      content.append(smallEl);
    }

    const headline = document.createElement('h1');
    headline.classList.add('heading', 'font-medium', 'font-size-tb');
    headline.innerHTML = slideHeadlineCell.innerHTML; // richtext field
    content.append(headline);

    const description = slideDescriptionCell.innerHTML.trim(); // richtext field
    if (description) {
      const p = document.createElement('p'); // Use div for richtext if it contains block elements, p if only inline
      p.innerHTML = description;
      content.append(p);
    }

    const ctaLink = ctaLinkCell.querySelector('a');
    const ctaLabel = ctaLabelCell.textContent.trim();
    if (ctaLink && ctaLabel) {
      const link = document.createElement('a');
      link.classList.add('btn', 'btn-primary');
      link.href = ctaLink.href;
      link.textContent = ctaLabel;
      content.append(link);
    }

    mobContent.append(content);
    swiperSlide.append(slideBgImg, mobContent);
    swiperWrapper.append(swiperSlide);
  });

  const prevBtn = document.createElement('div');
  prevBtn.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  prevBtn.innerHTML = '<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>';

  const nextBtn = document.createElement('div');
  nextBtn.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  nextBtn.innerHTML = '<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>';

  const pagination = document.createElement('div');
  pagination.classList.add('swiper-pagination', 'bullet-bottom');

  beamSlider.append(swiperWrapper, prevBtn, nextBtn, pagination);

  const quickLinksParentDiv = document.createElement('div');
  quickLinksParentDiv.classList.add(
    'mt-0',
    'pt-1',
    'pb-1',
    'm-none1',
    'bottom-0',
    'w-100',
    'quick-links-parents-div',
    'position-relative',
  );

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '-100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');

  const ul = document.createElement('ul');
  ul.classList.add('quick-links-div');

  quickLinks.forEach((linkRow) => {
    const [labelCell, linkCell] = [...linkRow.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.classList.add('with-full-underline');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(linkRow, anchor);
    li.append(anchor);
    ul.append(li);
  });

  container.append(ul);
  quickLinksParentDiv.append(container);

  section.append(beamSlider, quickLinksParentDiv);
  block.replaceChildren(section);

  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  // eslint-disable-next-line no-undef
  new Swiper(beamSlider, {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true, // Original HTML doesn't specify loop, assuming default true for carousel
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: pagination,
      clickable: true,
    },
  });
}
