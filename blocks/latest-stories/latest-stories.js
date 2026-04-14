import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...storyRows] = [...block.children];

  // Create the main section container
  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');

  // Process heading
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow.firstElementChild, heading);
  heading.textContent = headingRow.firstElementChild.textContent;
  sectionHeader.append(heading);
  section.append(sectionHeader);

  // Create container for stories
  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickitySliderWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('slides');

  storyRows.forEach((row) => {
    const storyWrap = document.createElement('div');
    storyWrap.classList.add('wrap');
    moveInstrumentation(row, storyWrap);

    // Use content detection to identify cells based on BlockJson model
    const cells = [...row.children];
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const categoryCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim().length < 50); // Heuristic for category
    const textCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim().length >= 50); // Heuristic for main text
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const dateCell = cells.find(cell => cell.textContent.trim().match(/\d{1,2}\s\w+\s\d{4}/)); // Simple regex to detect date format

    if (imageCell) {
      const imageWrap = document.createElement('div');
      imageWrap.classList.add('image-wrap');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageWrap.append(optimizedPic);
      }
      storyWrap.append(imageWrap);
    }

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

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

    if (linkCell) {
      const link = linkCell.querySelector('a');
      if (link) {
        const btnLink = document.createElement('a');
        btnLink.classList.add('btn', 'btn-link');
        btnLink.href = link.href;
        btnLink.textContent = link.textContent;
        moveInstrumentation(link, btnLink);
        contentWrap.append(btnLink);
      }
    }

    if (dateCell) {
      const dateDiv = document.createElement('div');
      dateDiv.classList.add('date');
      const time = document.createElement('time');
      time.setAttribute('datetime', dateCell.textContent.trim()); // Assuming dateCell.textContent is a valid datetime string
      time.textContent = dateCell.textContent;
      moveInstrumentation(dateCell, time);
      dateDiv.append(time);
      contentWrap.append(dateDiv);
    }

    storyWrap.append(contentWrap);
    slidesContainer.append(storyWrap);
  });

  flickitySliderWrap.append(slidesContainer);
  container.append(flickitySliderWrap);
  section.append(container);

  block.textContent = '';
  block.append(section);
}
