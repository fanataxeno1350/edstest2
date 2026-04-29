import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [headingRow, ...storyRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');

  // Swiper container
  const swiperEl = document.createElement('div');
  swiperEl.classList.add('swiper', 'flickity-slider-mobile-wrap', 'grid-layout'); // Renamed from flickity-slider-wrap to swiper
  swiperEl.setAttribute(
    'data-swiper',
    '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }',
  ); // Changed data-flickity to data-swiper

  const slidesWrapper = document.createElement('div');
  slidesWrapper.classList.add('swiper-wrapper', 'slides'); // Added swiper-wrapper

  storyRows.forEach((row) => {
    const [
      imageDefaultCell,
      imageHorizontalCell,
      imageVerticalCell,
      categoryCell,
      textCell,
      linkCell,
      linkLabelCell,
      dateCell,
      dateTimeCell,
    ] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('swiper-slide'); // Changed class from 'slides' to 'swiper-slide'

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');
    const picture = imageDefaultCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      optimizedPic.querySelector('img').classList.add('thumb-img', 'img-fluid');
      if (imageHorizontalCell.querySelector('picture')) {
        optimizedPic
          .querySelector('img')
          .setAttribute('data-img-horizontal', imageHorizontalCell.querySelector('img').src);
      }
      if (imageVerticalCell.querySelector('picture')) {
        optimizedPic
          .querySelector('img')
          .setAttribute('data-img-vertical', imageVerticalCell.querySelector('img').src);
      }
      imageWrap.append(optimizedPic);
    }
    wrap.append(imageWrap);

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const category = document.createElement('div');
    category.classList.add('category');
    category.textContent = categoryCell.textContent.trim();
    contentWrap.append(category);

    const text = document.createElement('div');
    text.classList.add('text');
    text.textContent = textCell.textContent.trim();
    contentWrap.append(text);

    const link = document.createElement('a');
    link.classList.add('btn', 'btn-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }
    link.textContent = linkLabelCell.textContent.trim();
    contentWrap.append(link);

    const date = document.createElement('div');
    date.classList.add('date');
    const time = document.createElement('time');
    time.textContent = dateCell.textContent.trim();
    if (dateTimeCell.textContent.trim()) {
      time.setAttribute('datetime', dateTimeCell.textContent.trim());
    }
    date.append(time);
    contentWrap.append(date);

    wrap.append(contentWrap);
    moveInstrumentation(row, wrap);
    slide.append(wrap);
    slidesWrapper.append(slide);
  });

  swiperEl.append(slidesWrapper);
  container.append(swiperEl);
  section.append(container);

  block.replaceChildren(section);

  // Swiper initialization
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
    slidesPerView: 'auto',
    loop: false, // Based on original data-flickity which had "wrapAround": false
    navigation: {
      nextEl: '.swiper-button-next', // Assuming these will be added if needed
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination', // Assuming this will be added if needed
      clickable: true,
    },
  });
}
