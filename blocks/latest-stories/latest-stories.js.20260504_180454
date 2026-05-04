import { createOptimizedPicture, loadScript } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...itemRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // Use children[0] for consistency with other cell access patterns, though firstElementChild works here.
  moveInstrumentation(headingRow.children[0], heading);
  heading.textContent = headingRow.children[0].textContent.trim();
  sectionHeader.append(heading);

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');

  const sliderWrap = document.createElement('div');
  sliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');

  itemRows.forEach((row) => {
    const cells = [...row.children];
    const slide = document.createElement('div');
    slide.classList.add('slides');

    // Detect if it's a news-story-item (5 cells) or an elfsight-widget (3 cells)
    if (cells.length === 5) {
      // news-story-item
      const [imageCell, categoryCell, textCell, linkCell, dateCell] = cells;

      const wrap = document.createElement('div');
      wrap.classList.add('wrap');

      const imageWrap = document.createElement('div');
      imageWrap.classList.add('image-wrap');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          imageWrap.append(optimizedPic);
        }
      }
      wrap.append(imageWrap);

      const contentWrap = document.createElement('div');
      contentWrap.classList.add('content-wrap');

      const category = document.createElement('div');
      category.classList.add('category');
      moveInstrumentation(categoryCell, category);
      category.textContent = categoryCell.textContent.trim();
      contentWrap.append(category);

      const text = document.createElement('div');
      text.classList.add('text');
      moveInstrumentation(textCell, text);
      text.textContent = textCell.textContent.trim();
      contentWrap.append(text);

      const readMoreLink = document.createElement('a');
      readMoreLink.classList.add('btn', 'btn-link');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        readMoreLink.href = foundLink.href;
      }
      readMoreLink.textContent = 'Read more'; // Hardcoded as per original HTML
      moveInstrumentation(linkCell, readMoreLink);
      contentWrap.append(readMoreLink);

      const date = document.createElement('div');
      date.classList.add('date');
      moveInstrumentation(dateCell, date);
      date.textContent = dateCell.textContent.trim();
      contentWrap.append(date);

      wrap.append(contentWrap);
      slide.append(wrap);
    } else if (cells.length === 3) {
      // elfsight-widget
      const [urlCell, kindCell, configCell] = cells;
      const el = document.createElement('div');
      moveInstrumentation(row, el);

      const config = JSON.parse(configCell.textContent.trim());
      el.classList.add(`elfsight-app-${config.app_id}`);
      el.dataset.embedKind = kindCell.textContent.trim();
      el.dataset.embedUrl = urlCell.textContent.trim(); // Add URL as data attribute for debugging/info
      el.textContent = ''; // Clear placeholder text

      // Load elfsight platform script
      loadScript('https://static.elfsight.com/platform/platform.js');
      slide.append(el);
    }
    sliderWrap.append(slide);
  });

  container.append(sliderWrap);
  block.innerHTML = '';
  block.classList.add('section', 'grey-bg', 'home-stories'); // Add section classes to block
  block.append(sectionHeader, container);

  // Initialize Flickity after elements are added to the DOM
  // The original HTML has data-flickity attributes, but we need to ensure the script loads and initializes
  // This is a common pattern for JS-driven components like sliders.
  loadScript('/scripts/flickity.pkgd.min.js').then(() => {
    // eslint-disable-next-line no-undef
    if (typeof Flickity !== 'undefined') {
      // Find the slider element and initialize Flickity
      const sliderElement = block.querySelector('.flickity-slider-mobile-wrap');
      if (sliderElement) {
        // The data-flickity attribute is already present in the original HTML,
        // so Flickity should pick it up automatically if loaded correctly.
        // If not, we would manually initialize it here:
        // eslint-disable-next-line no-new, no-undef
        new Flickity(sliderElement, {
          wrapAround: false,
          lazyLoad: true,
          pageDots: true,
          prevNextButtons: false,
          imagesLoaded: true,
          cellAlign: 'left',
          watchCSS: true,
          adaptiveHeight: true,
        });
      }
    }
  });
}
