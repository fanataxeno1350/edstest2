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
  beamSlider.setAttribute('data-aos', 'fade-up');
  beamSlider.setAttribute('data-aos-offset', '-100');
  beamSlider.setAttribute('data-aos-duration', '650');
  beamSlider.setAttribute('data-aos-easing', 'ease-in-out');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  slideRows.forEach((row) => {
    const [
      backgroundDesktopCell,
      backgroundTabletCell,
      backgroundMobileCell,
      eyebrowCell,
      headingCell,
      descriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('swiper-slide', 'nogradient');
    moveInstrumentation(row, slide);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');

    const picture = document.createElement('picture');

    const sourceMobile = document.createElement('source');
    sourceMobile.media = '(max-width: 576px)';
    const mobileImg = backgroundMobileCell.querySelector('img');
    if (mobileImg) {
      sourceMobile.srcset = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '576' }]).querySelector('img').src;
    }
    picture.appendChild(sourceMobile);

    const sourceTablet = document.createElement('source');
    sourceTablet.media = '(max-width: 799px)';
    const tabletImg = backgroundTabletCell.querySelector('img');
    if (tabletImg) {
      sourceTablet.srcset = createOptimizedPicture(tabletImg.src, tabletImg.alt, false, [{ width: '799' }]).querySelector('img').src;
    }
    picture.appendChild(sourceTablet);

    const img = backgroundDesktopCell.querySelector('img');
    if (img) {
      const optimizedImg = createOptimizedPicture(img.src, img.alt, false, [{ width: '1920' }]).querySelector('img');
      optimizedImg.loading = 'eager';
      optimizedImg.fetchPriority = 'high';
      picture.appendChild(optimizedImg);
    }
    slideBgImg.appendChild(picture);
    slide.appendChild(slideBgImg);

    const mobContentHomeSpotlight = document.createElement('div');
    mobContentHomeSpotlight.classList.add('mob-content-home-spotlight');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'text-center', 'text-lg-start');

    const eyebrowText = eyebrowCell.textContent.trim();
    if (eyebrowText) {
      const small = document.createElement('small');
      small.style.fontWeight = 'bold';
      small.textContent = eyebrowText;
      contentDiv.appendChild(small);
    }

    const heading = document.createElement('h1');
    heading.classList.add('heading', 'font-medium', 'font-size-tb');
    heading.innerHTML = headingCell.innerHTML;
    contentDiv.appendChild(heading);

    // Description cell is 'text' type, but original HTML shows it wrapped in <strong> inside a <p>
    const descriptionText = descriptionCell.textContent.trim();
    if (descriptionText) {
      const p = document.createElement('p');
      p.innerHTML = `<strong>${descriptionText}</strong>`; // Recreate the strong tag from original HTML
      contentDiv.appendChild(p);
    }

    const ctaLink = ctaLinkCell.querySelector('a');
    const ctaLabel = ctaLabelCell.textContent.trim();
    if (ctaLink && ctaLabel) {
      const anchor = document.createElement('a');
      anchor.href = ctaLink.href;
      anchor.textContent = ctaLabel;
      anchor.classList.add('btn', 'btn-primary');
      if (ctaLink.target) { // Preserve target attribute if present in original link
        anchor.target = ctaLink.target;
      }
      contentDiv.appendChild(anchor);
    }

    mobContentHomeSpotlight.appendChild(contentDiv);
    slide.appendChild(mobContentHomeSpotlight);
    swiperWrapper.appendChild(slide);
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

  const pagination = document.createElement('div');
  pagination.classList.add('swiper-pagination', 'bullet-bottom');
  beamSlider.appendChild(pagination);

  section.appendChild(beamSlider);

  const quickLinksParentDiv = document.createElement('div');
  quickLinksParentDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '-100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');

  const quickLinksDiv = document.createElement('ul');
  quickLinksDiv.classList.add('quick-links-div');

  quickLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      if (foundLink.target) {
        anchor.target = foundLink.target;
      }
    }
    anchor.classList.add('with-full-underline');
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, anchor);
    li.appendChild(anchor);
    quickLinksDiv.appendChild(li);
  });

  container.appendChild(quickLinksDiv);
  quickLinksParentDiv.appendChild(container);
  section.appendChild(quickLinksParentDiv);

  block.replaceChildren(section);

  // Initialize Swiper
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  // eslint-disable-next-line no-undef
  new Swiper(beamSlider, {
    slidesPerView: 1,
    spaceBetween: 0,
    // Original HTML does not explicitly set data-loop="true" or "false" on the beam-slider div.
    // However, the generated JS defaults to loop: true.
    // If the original Swiper configuration had loop: false, this should be changed.
    // Based on the presence of swiper-slide-prev and swiper-slide-next in the original HTML,
    // it implies looping behavior. Keeping loop: true as default.
    loop: true,
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
