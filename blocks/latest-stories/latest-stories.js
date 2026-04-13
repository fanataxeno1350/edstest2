import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...storyRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow.firstElementChild, heading);
  heading.innerHTML = headingRow.firstElementChild.innerHTML;
  sectionHeader.append(heading);

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');

  const flickityWrap = document.createElement('div');
  flickityWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickityWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('slides'); // This should be 'slides' as per original HTML, not 'slides-container'

  storyRows.forEach((row) => {
    const slide = document.createElement('div');
    slide.classList.add('slides'); // This should be 'slides' as per original HTML
    moveInstrumentation(row, slide);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const cells = [...row.children];

    // Based on BlockJson and EDS Block Structure:
    // cell[0]: image
    // cell[1]: category
    // cell[2]: text
    // cell[3]: link
    // cell[4]: date

    const imageCell = cells[0];
    const categoryCell = cells[1];
    const textCell = cells[2];
    const linkCell = cells[3];
    const dateCell = cells[4];

    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      const img = picture ? picture.querySelector('img') : null;
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageWrap.append(optimizedPic);
        optimizedPic.querySelector('img').classList.add('thumb-img', 'img-fluid');
      }
    }

    if (categoryCell) {
      const category = document.createElement('div');
      category.classList.add('category');
      moveInstrumentation(categoryCell, category);
      category.textContent = categoryCell.textContent;
      contentWrap.append(category);
    }

    if (textCell) {
      const text = document.createElement('div');
      text.classList.add('text');
      moveInstrumentation(textCell, text);
      text.textContent = textCell.textContent;
      contentWrap.append(text);
    }

    if (linkCell && linkCell.querySelector('a')) {
      const link = document.createElement('a');
      link.classList.add('btn', 'btn-link');
      moveInstrumentation(linkCell, link);
      link.href = linkCell.querySelector('a').href;
      link.textContent = linkCell.querySelector('a').textContent;
      contentWrap.append(link);
    }

    if (dateCell) {
      const date = document.createElement('div');
      date.classList.add('date');
      moveInstrumentation(dateCell, date);
      date.innerHTML = dateCell.innerHTML; // Use innerHTML to preserve <time> tag if present
      contentWrap.append(date);
    }

    wrap.append(imageWrap, contentWrap);
    slide.append(wrap);
    slidesContainer.append(slide);
  });

  flickityWrap.append(slidesContainer);
  container.append(flickityWrap);

  block.textContent = '';
  block.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');
  block.append(sectionHeader, container);
}
