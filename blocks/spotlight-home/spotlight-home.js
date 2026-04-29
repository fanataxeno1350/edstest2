import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const allRows = [...block.children];

  const slideRows = allRows.filter((row) => row.children.length === 9);
  const quickLinkRows = allRows.filter((row) => row.children.length === 2);

  const section = document.createElement('section');
  section.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');

  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi');
  section.append(beamSlider);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  beamSlider.append(swiperWrapper);

  slideRows.forEach((row) => {
    const [
      imageDesktopCell,
      imageTabletCell,
      imageMobileCell,
      altTextCell,
      smallTextCell,
      headlineCell,
      descriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'nogradient');
    moveInstrumentation(row, swiperSlide);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');
    swiperSlide.append(slideBgImg);

    const picture = document.createElement('picture');
    const desktopImg = imageDesktopCell.querySelector('img');
    const tabletImg = imageTabletCell.querySelector('img');
    const mobileImg = imageMobileCell.querySelector('img');
    const altText = altTextCell.textContent.trim();

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
      const img = createOptimizedPicture(desktopImg.src, altText, false, [{ width: '1903' }]);
      picture.append(img.querySelector('img'));
    }
    slideBgImg.append(picture);

    const mobContentHomeSpotlight = document.createElement('div');
    mobContentHomeSpotlight.classList.add('mob-content-home-spotlight');
    swiperSlide.append(mobContentHomeSpotlight);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'text-center', 'text-lg-start');
    mobContentHomeSpotlight.append(contentDiv);

    const smallText = smallTextCell.textContent.trim();
    if (smallText) {
      const smallEl = document.createElement('small');
      smallEl.style.fontWeight = 'bold';
      smallEl.textContent = smallText;
      contentDiv.append(smallEl);
    }

    const headline = headlineCell.innerHTML;
    if (headline) {
      const h2 = document.createElement('h2');
      h2.classList.add('heading', 'font-medium', 'font-size-tb');
      h2.innerHTML = headline;
      contentDiv.append(h2);
    }

    const description = descriptionCell.innerHTML;
    if (description) {
      const p = document.createElement('p');
      p.innerHTML = description;
      contentDiv.append(p);
    }

    const ctaLink = ctaLinkCell.querySelector('a');
    const ctaLabel = ctaLabelCell.textContent.trim();
    if (ctaLink && ctaLabel) {
      const anchor = document.createElement('a');
      anchor.href = ctaLink.href;
      anchor.textContent = ctaLabel;
      anchor.classList.add('btn', 'btn-primary');
      contentDiv.append(anchor);
    }

    swiperWrapper.append(swiperSlide);
  });

  const prevBtn = document.createElement('div');
  prevBtn.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  prevBtn.innerHTML = '<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>';
  beamSlider.append(prevBtn);

  const nextBtn = document.createElement('div');
  nextBtn.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  nextBtn.innerHTML = '<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>';
  beamSlider.append(nextBtn);

  const pagination = document.createElement('div');
  pagination.classList.add('swiper-pagination', 'bullet-bottom');
  beamSlider.append(pagination);

  const quickLinksParentDiv = document.createElement('div');
  quickLinksParentDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');
  section.append(quickLinksParentDiv);

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'aos-init', 'aos-animate');
  containerDiv.setAttribute('data-aos', 'fade-up');
  containerDiv.setAttribute('data-aos-offset', '-100');
  containerDiv.setAttribute('data-aos-duration', '650');
  containerDiv.setAttribute('data-aos-easing', 'ease-in-out');
  quickLinksParentDiv.append(containerDiv);

  const quickLinksUl = document.createElement('ul');
  quickLinksUl.classList.add('quick-links-div');
  containerDiv.append(quickLinksUl);

  quickLinkRows.forEach((row) => {
    const [linkCell, labelCell] = [...row.children];

    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const link = linkCell.querySelector('a');
    const label = labelCell.textContent.trim();

    if (link && label) {
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.textContent = label;
      anchor.classList.add('with-full-underline');
      li.append(anchor);
    }
    quickLinksUl.append(li);
  });

  block.replaceChildren(section);

  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  // eslint-disable-next-line no-undef
  new Swiper(beamSlider, {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true, // Swiper adds swiper-initialized, swiper-horizontal, swiper-backface-hidden automatically
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
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
