import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const allRows = [...block.children];

  const slideItems = allRows.filter((row) => row.children.length === 8);
  const quickLinkItems = allRows.filter((row) => row.children.length === 2);

  const section = document.createElement('section');
  section.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');

  const beamSlider = document.createElement('div');
  // Removed swiper-initialized, swiper-horizontal, swiper-backface-hidden as Swiper adds them
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  slideItems.forEach((row) => {
    const [
      imageDesktopCell,
      imageTabletCell,
      imageMobileCell,
      smallHeadlineCell,
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

    const picture = document.createElement('picture');

    const mobilePicture = imageMobileCell.querySelector('picture');
    if (mobilePicture) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      sourceMobile.srcset = mobilePicture.querySelector('img')?.src || '';
      picture.append(sourceMobile);
    }

    const tabletPicture = imageTabletCell.querySelector('picture');
    if (tabletPicture) {
      const sourceTablet = document.createElement('source');
      sourceTablet.media = '(max-width: 799px)';
      sourceTablet.srcset = tabletPicture.querySelector('img')?.src || '';
      picture.append(sourceTablet);
    }

    const desktopPicture = imageDesktopCell.querySelector('picture');
    if (desktopPicture) {
      const img = desktopPicture.querySelector('img');
      if (img) {
        // createOptimizedPicture returns a <picture> element, we need to append its children or the whole element
        // The original code was appending only the <img> from the optimized picture, which is incorrect.
        // It should append the whole optimized picture or its sources and img.
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1903' }]);
        // Append all children of the optimized picture (sources and img)
        while (optimizedPic.firstChild) {
          picture.append(optimizedPic.firstChild);
        }
      }
    }
    slideBgImg.append(picture);

    const mobContentHomeSpotlight = document.createElement('div');
    mobContentHomeSpotlight.classList.add('mob-content-home-spotlight');

    const content = document.createElement('div');
    content.classList.add('content', 'text-center', 'text-lg-start');

    const smallHeadline = document.createElement('small');
    smallHeadline.style.fontWeight = 'bold';
    // Richtext content should be assigned to a div or extracted from <p> if target is <p>
    // Changed to div to safely contain rich text.
    const smallHeadlineDiv = document.createElement('div');
    smallHeadlineDiv.innerHTML = smallHeadlineCell?.innerHTML || '';
    smallHeadline.append(...smallHeadlineDiv.children); // Append children to small tag
    content.append(smallHeadline);

    const headline = document.createElement('h1');
    headline.classList.add('heading', 'font-medium', 'font-size-tb');
    // Richtext content should be assigned to a div or extracted from <p> if target is <p>
    const headlineDiv = document.createElement('div');
    headlineDiv.innerHTML = headlineCell?.innerHTML || '';
    headline.append(...headlineDiv.children); // Append children to h1 tag
    content.append(headline);

    const description = document.createElement('p');
    // Richtext content should be assigned to a div or extracted from <p> if target is <p>
    // Assigning innerHTML of a cell (which contains <p>content</p>) to a <p> creates <p><p>content</p></p>
    // which is invalid HTML. Changed to extract inner content or use a div.
    const descriptionDiv = document.createElement('div');
    descriptionDiv.innerHTML = descriptionCell?.innerHTML || '';
    description.append(...descriptionDiv.children); // Append children to p tag
    content.append(description);

    const ctaLink = ctaLinkCell.querySelector('a');
    if (ctaLink) {
      const ctaButton = document.createElement('a');
      ctaButton.classList.add('btn', 'btn-primary');
      ctaButton.href = ctaLink.href;
      ctaButton.textContent = ctaLabelCell.textContent.trim();
      content.append(ctaButton);
    }

    mobContentHomeSpotlight.append(content);
    swiperSlide.append(slideBgImg, mobContentHomeSpotlight);
    swiperWrapper.append(swiperSlide);
  });

  const swiperButtonPrev = document.createElement('div');
  swiperButtonPrev.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  swiperButtonPrev.innerHTML = `<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>`;

  const swiperButtonNext = document.createElement('div');
  swiperButtonNext.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  swiperButtonNext.innerHTML = `<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>`;

  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'bullet-bottom');

  beamSlider.append(swiperWrapper, swiperButtonPrev, swiperButtonNext, swiperPagination);

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

  const quickLinksDiv = document.createElement('ul');
  quickLinksDiv.classList.add('quick-links-div');

  quickLinkItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.classList.add('with-full-underline');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, anchor);
    li.append(anchor);
    quickLinksDiv.append(li);
  });

  container.append(quickLinksDiv);
  quickLinksParentDiv.append(container);

  section.append(beamSlider, quickLinksParentDiv);

  block.replaceChildren(section);

  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(beamSlider, {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    navigation: {
      prevEl: swiperButtonPrev,
      nextEl: swiperButtonNext,
    },
    pagination: {
      el: swiperPagination,
      clickable: true,
    },
  });
}
