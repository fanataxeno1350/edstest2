import { createOptimizedPicture, loadScript } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  const sectionHeadingRow = rows.shift(); // First row is always the section heading

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');
  moveInstrumentation(block, section);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  // FIX: Use content detection for the heading cell
  const headingCell = [...sectionHeadingRow.children].find(c => c.textContent.trim());
  if (headingCell) {
    heading.textContent = headingCell.textContent.trim();
  }
  sectionHeader.append(heading);
  section.append(sectionHeader);

  // Container for stories and embeds
  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickitySliderWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('slides'); // This is the container for all individual slides

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 5) { // Story Item
      const [imageCell, categoryCell, textCell, linkCell, dateCell] = cells;

      const slide = document.createElement('div');
      slide.classList.add('slides'); // Each individual slide also has the 'slides' class
      moveInstrumentation(row, slide);

      const wrap = document.createElement('div');
      wrap.classList.add('wrap');

      const imageWrap = document.createElement('div');
      imageWrap.classList.add('image-wrap');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
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
        link.href = foundLink.href; // FIX: Ensure href is read from the found <a> tag
      }
      link.textContent = 'Read more'; // Hardcoded as per original HTML
      contentWrap.append(link);

      const date = document.createElement('div');
      date.classList.add('date');
      date.textContent = dateCell.textContent.trim();
      contentWrap.append(date);

      wrap.append(contentWrap);
      slide.append(wrap);
      slidesContainer.append(slide);
    } else if (cells.length === 3) { // Elfsight Widget
      const [urlCell, kindCell, configCell] = cells;
      const el = document.createElement('div');
      moveInstrumentation(row, el);
      const config = JSON.parse(configCell.textContent.trim());
      el.classList.add(`elfsight-app-${config.app_id}`);
      el.dataset.embedKind = kindCell.textContent.trim();
      el.dataset.embedUrl = urlCell.textContent.trim();
      el.dataset.embedConfig = configCell.textContent.trim();

      // Load elfsight platform
      loadScript('https://static.elfsight.com/platform/platform.js');
      slidesContainer.append(el);
    }
  });

  flickitySliderWrap.append(slidesContainer);
  container.append(flickitySliderWrap);
  section.append(container);
  block.replaceWith(section);
}
