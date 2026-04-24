import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // First row is the section title
  const sectionTitleRow = children.shift();
  const sectionTitleText = sectionTitleRow.querySelector('div')?.textContent.trim();

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');
  moveInstrumentation(block, section);

  if (sectionTitleText) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.setAttribute('data-aos', 'fade-up');
    heading.setAttribute('data-aos-offset', '100');
    heading.setAttribute('data-aos-duration', '650');
    heading.setAttribute('data-aos-easing', 'ease-in-out');
    heading.textContent = sectionTitleText;
    sectionHeader.append(heading);
    section.append(sectionHeader);
  }

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');

  const sliderWrap = document.createElement('div');
  sliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  sliderWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('slides');

  children.forEach((row) => {
    const cells = [...row.children];
    // The BlockJson model defines 5 fields for a 'story-card' item.
    // We use array destructuring to safely access these cells.
    if (cells.length === 5) {
      const [imageCell, categoryCell, descriptionCell, linkCell, dateCell] = cells;

      const wrap = document.createElement('div');
      wrap.classList.add('wrap');
      moveInstrumentation(row, wrap);

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
      category.textContent = categoryCell.textContent.trim();
      contentWrap.append(category);

      const description = document.createElement('div');
      description.classList.add('text');
      description.textContent = descriptionCell.textContent.trim();
      contentWrap.append(description);

      const link = document.createElement('a');
      link.classList.add('btn', 'btn-link');
      // For type=aem-content, read the href from the <a> tag inside the cell.
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      }
      link.textContent = 'Read more'; // Hardcoded as per original HTML
      contentWrap.append(link);

      const date = document.createElement('div');
      date.classList.add('date');
      date.textContent = dateCell.textContent.trim();
      contentWrap.append(date);

      wrap.append(contentWrap);

      const slide = document.createElement('div');
      slide.classList.add('slides'); // This class name is used for both the slides container and individual slides in the original HTML
      slide.append(wrap);
      slidesContainer.append(slide);
    }
  });

  sliderWrap.append(slidesContainer);
  container.append(sliderWrap);
  section.append(container);
  block.replaceWith(section);
}
