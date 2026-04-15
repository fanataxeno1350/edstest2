import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // CRITICAL FIX: Replaced direct index access for root fields with content detection
  // Based on BlockJson: sliderPrevIcon and sliderNextIcon are root fields of type 'reference'
  // They are expected to be the first two rows with a single cell containing an image.
  const sliderPrevIconRow = rows.find(row => row.children.length === 1 && row.firstElementChild.querySelector('picture, img'));
  const sliderNextIconRow = rows.find(row => row !== sliderPrevIconRow && row.children.length === 1 && row.firstElementChild.querySelector('picture, img'));

  const sliderPrevIconCell = sliderPrevIconRow ? sliderPrevIconRow.firstElementChild : null;
  const sliderNextIconCell = sliderNextIconRow ? sliderNextIconRow.firstElementChild : null;

  // Filter out the icon rows from the main rows array to avoid processing them as slides or quick links
  const contentRows = rows.filter(row => row !== sliderPrevIconRow && row !== sliderNextIconRow);

  // Content detection for item sub-components
  // spotlight-slide has 9 cells
  const slideRows = contentRows.filter((row) => row.children.length === 9);
  // quick-link has 2 cells
  const quickLinkRows = contentRows.filter((row) => row.children.length === 2);

  const section = document.createElement('section');
  section.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');

  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi');
  // swiper-initialized, swiper-horizontal, swiper-watch-progress, swiper-backface-hidden are added by Swiper JS
  // swiper-slide-prev, swiper-slide-visible, swiper-slide-fully-visible, swiper-slide-active, swiper-slide-next are added by Swiper JS

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperWrapper.setAttribute('id', `swiper-wrapper-${Math.random().toString(36).substring(2, 15)}`); // Dynamic ID
  swiperWrapper.setAttribute('aria-live', 'off');

  slideRows.forEach((row, index) => {
    const [
      desktopImageCell,
      tabletImageCell,
      mobileImageCell,
      altTextCell,
      headlineCell,
      subheadlineCell,
      descriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'nogradient');
    swiperSlide.setAttribute('role', 'group');
    swiperSlide.setAttribute('aria-label', `${index + 1} / ${slideRows.length}`);
    swiperSlide.setAttribute('data-swiper-slide-index', index);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');

    const picture = document.createElement('picture');
    const desktopImg = desktopImageCell.querySelector('img');
    const tabletImg = tabletImageCell.querySelector('img');
    const mobileImg = mobileImageCell.querySelector('img');
    const altText = altTextCell.textContent.trim();

    if (mobileImg) {
      const sourceMobile = document.createElement('source');
      sourceMobile.setAttribute('media', '(max-width: 576px)');
      sourceMobile.setAttribute('srcset', createOptimizedPicture(mobileImg.src, altText, false, [{ width: '576' }]).querySelector('img').src);
      picture.append(sourceMobile);
    }
    if (tabletImg) {
      const sourceTablet = document.createElement('source');
      sourceTablet.setAttribute('media', '(max-width: 799px)');
      sourceTablet.setAttribute('srcset', createOptimizedPicture(tabletImg.src, altText, false, [{ width: '799' }]).querySelector('img').src);
      picture.append(sourceTablet);
    }
    if (desktopImg) {
      const img = createOptimizedPicture(desktopImg.src, altText, index === 0, [{ width: '1903' }]).querySelector('img');
      img.setAttribute('width', '1903');
      img.setAttribute('height', '841');
      if (index === 0) {
        img.setAttribute('fetchpriority', 'high');
      }
      picture.append(img);
    }
    slideBgImg.append(picture);

    const mobContent = document.createElement('div');
    mobContent.classList.add('mob-content-home-spotlight');

    const content = document.createElement('div');
    content.classList.add('content', 'text-center', 'text-lg-start');
    // Example of applying 'active' class based on original HTML.
    // The original HTML shows 'active' on the 5th slide (index 4).
    if (index === 4) {
      content.classList.add('active');
    }

    const subheadline = subheadlineCell.textContent.trim();
    if (subheadline) {
      const small = document.createElement('small');
      small.style.fontWeight = 'bold'; // This style is from original HTML, not a class
      small.textContent = subheadline;
      content.append(small);
    }

    const headline = headlineCell.textContent.trim();
    if (headline) {
      const h2 = document.createElement('h2');
      h2.classList.add('heading', 'font-medium', 'font-size-tb');
      // Example of applying 'banner-text-dark' class based on original HTML.
      // The original HTML shows 'banner-text-dark' on the 1st slide (index 0).
      if (index === 0) {
        h2.classList.add('banner-text-dark');
      }
      h2.innerHTML = headline.replace(/\n/g, '<br>');
      content.append(h2);
    }

    const description = descriptionCell.textContent.trim();
    if (description) {
      const p = document.createElement('p');
      p.innerHTML = `<strong>${description}</strong>`; // Original HTML uses <strong> inside <p>
      content.append(p);
    }

    const ctaLink = ctaLinkCell.querySelector('a');
    const ctaLabel = ctaLabelCell.textContent.trim();
    if (ctaLink && ctaLabel) {
      const anchor = document.createElement('a');
      anchor.href = ctaLink.href;
      anchor.textContent = ctaLabel;
      anchor.classList.add('btn', 'btn-primary');
      moveInstrumentation(ctaLinkCell, anchor);
      content.append(anchor);
    }

    mobContent.append(content);
    swiperSlide.append(slideBgImg, mobContent);
    swiperWrapper.append(swiperSlide);
    moveInstrumentation(row, swiperSlide);
  });

  beamSlider.append(swiperWrapper);

  const createSliderButton = (iconCell, className) => {
    const button = document.createElement('div');
    button.classList.add(className, 'slide-home-btn', 'swiper-button-white');
    button.setAttribute('tabindex', '0');
    button.setAttribute('role', 'button');
    button.setAttribute('aria-controls', swiperWrapper.id);

    const img = iconCell.querySelector('img');
    if (img) {
      const buttonImg = document.createElement('img');
      buttonImg.src = img.src;
      buttonImg.alt = img.alt || 'svg file';
      button.append(buttonImg);
    }
    // moveInstrumentation should be on the cell itself, not its closest('div') if the cell is the direct child of the row
    moveInstrumentation(iconCell, button);
    return button;
  };

  if (sliderPrevIconCell) {
    const prevButton = createSliderButton(sliderPrevIconCell, 'swiper-button-prev');
    prevButton.setAttribute('aria-label', 'Previous slide');
    beamSlider.append(prevButton);
  }

  if (sliderNextIconCell) {
    const nextButton = createSliderButton(sliderNextIconCell, 'swiper-button-next');
    nextButton.setAttribute('aria-label', 'Next slide');
    beamSlider.append(nextButton);
  }

  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'bullet-bottom');
  beamSlider.append(swiperPagination);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  beamSlider.append(swiperNotification);

  section.append(beamSlider);

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

  const quickLinksUl = document.createElement('ul');
  quickLinksUl.classList.add('quick-links-div');

  quickLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];

    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.classList.add('with-full-underline');

    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();

    moveInstrumentation(row, li);
    li.append(anchor);
    quickLinksUl.append(li);
  });

  container.append(quickLinksUl);
  quickLinksParentDiv.append(container);
  section.append(quickLinksParentDiv);

  block.innerHTML = '';
  block.append(section);

  // Swiper initialization (simplified, full Swiper logic might be more complex)
  // This part is typically handled by a global script or a specific Swiper library import
  // For EDS, we only render the HTML structure. If Swiper JS is loaded globally,
  // it will pick up this structure and initialize.
  // We add a placeholder for Swiper init to show where it would go.
  const initSwiper = () => {
    if (typeof window.Swiper === 'function') {
      // eslint-disable-next-line no-new
      new window.Swiper(beamSlider, {
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: swiperPagination,
          clickable: true,
        },
        navigation: {
          nextEl: nextButton,
          prevEl: prevButton,
        },
        // Add other Swiper options as needed
      });
    } else {
      // Swiper not loaded yet, retry or load dynamically
      setTimeout(initSwiper, 200);
    }
  };
  initSwiper();
}
