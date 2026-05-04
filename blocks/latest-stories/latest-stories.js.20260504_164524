import { createOptimizedPicture, loadScript } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const headingRow = children.shift(); // First row is always the heading
  const [headingCell] = [...headingRow.children]; // CRITICAL FIX: Use destructuring for fixed-field rows
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingCell.textContent.trim();
  moveInstrumentation(headingRow, heading);
  sectionHeader.append(heading);

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'aos-init', 'aos-animate');

  const sliderWrap = document.createElement('div');
  sliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  sliderWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('slides');

  children.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 3) { // Embed-Widget item
      const [embedUrlCell, embedKindCell, embedConfigCell] = cells;
      const kind = embedKindCell.textContent.trim();

      const embedDiv = document.createElement('div');
      moveInstrumentation(row, embedDiv);

      if (kind === 'elfsight-widget') {
        try {
          const config = JSON.parse(embedConfigCell.textContent.trim());
          if (config.app_id) {
            embedDiv.classList.add(`elfsight-app-${config.app_id}`);
            // Dynamically load the elfsight platform script
            loadScript('https://static.elfsight.com/platform/platform.js');
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Failed to parse Elfsight config', e);
          embedDiv.textContent = '[elfsight-widget error]';
        }
      } else {
        // Fallback for other embed types
        embedDiv.setAttribute('data-embed-kind', kind);
        embedDiv.setAttribute('data-embed-url', embedUrlCell.textContent.trim());
        embedDiv.textContent = `[${kind} placeholder]`;
      }

      slidesContainer.append(embedDiv);
    } else if (cells.length === 5) { // Story-Item
      const [imageCell, categoryCell, descriptionCell, linkCell, dateCell] = cells;

      const slideDiv = document.createElement('div');
      slideDiv.classList.add('slides'); // This class is for the outer slide container, not individual slide item

      const wrapDiv = document.createElement('div');
      wrapDiv.classList.add('wrap');

      const imageWrap = document.createElement('div');
      imageWrap.classList.add('image-wrap');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          optimizedPic.querySelector('img').classList.add('thumb-img', 'img-fluid');
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          imageWrap.append(optimizedPic);
        }
      }

      const contentWrap = document.createElement('div');
      contentWrap.classList.add('content-wrap');

      const categoryDiv = document.createElement('div');
      categoryDiv.classList.add('category');
      categoryDiv.textContent = categoryCell.textContent.trim();

      const textDiv = document.createElement('div');
      textDiv.classList.add('text');
      textDiv.textContent = descriptionCell.textContent.trim();

      const readMoreLink = document.createElement('a');
      readMoreLink.classList.add('btn', 'btn-link');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        readMoreLink.href = foundLink.href; // CRITICAL FIX: Read href from the <a> tag for aem-content type
      }
      readMoreLink.textContent = 'Read more';

      const dateDiv = document.createElement('div');
      dateDiv.classList.add('date');
      const timeElement = document.createElement('time');
      timeElement.setAttribute('datetime', dateCell.textContent.trim()); // Assuming date-time field provides ISO format
      timeElement.textContent = new Date(dateCell.textContent.trim()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      dateDiv.append(timeElement);

      contentWrap.append(categoryDiv, textDiv, readMoreLink, dateDiv);
      wrapDiv.append(imageWrap, contentWrap);
      slideDiv.append(wrapDiv);
      moveInstrumentation(row, slideDiv);
      slidesContainer.append(slideDiv);
    }
  });

  sliderWrap.append(slidesContainer);
  containerDiv.append(sliderWrap);

  block.innerHTML = ''; // Clear original block content
  block.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories'); // Add section classes to the block itself
  block.append(sectionHeader, containerDiv);
}
