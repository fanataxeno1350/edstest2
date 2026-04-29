import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...storyRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');
  moveInstrumentation(block, section);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular');
  moveInstrumentation(headingRow.firstElementChild, heading);
  heading.textContent = headingRow.firstElementChild.textContent.trim();
  sectionHeader.appendChild(heading);
  section.appendChild(sectionHeader);

  // Container for stories
  const container = document.createElement('div');
  container.classList.add('container');

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  container.appendChild(flickitySliderWrap);

  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('slides'); // This is where 'slides' class should be
  flickitySliderWrap.appendChild(slidesContainer);

  storyRows.forEach((row) => {
    const [imageCell, categoryCell, textCell, linkCell, dateCell] = [...row.children];

    const slide = document.createElement('div');
    // The individual story items do NOT have the 'slides' class,
    // they are direct children of the 'slidesContainer' which has it.
    // The original HTML shows: <div class="slides"><div class="wrap">...</div></div>
    // So the 'slide' element here should be the one with the 'slides' class.
    // However, the original HTML also shows the 'slides' class on the container,
    // and then again on each item. This suggests a potential misinterpretation
    // of the original HTML or a specific Flickity requirement.
    // Given the EDS block structure, each row is a 'story-item'.
    // The original HTML shows:
    // <div class="flickity-slider-mobile-wrap grid-layout">
    //   <div class="slides"> <-- This is the slidesContainer
    //     <div class="slides"> <-- This is the individual slide
    //       <div class="wrap">...</div>
    //     </div>
    //     <div class="slides"> <-- Another individual slide
    //       <div class="wrap">...</div>
    //     </div>
    //   </div>
    // </div>
    // So, the `slide` element *should* have the `slides` class.
    slide.classList.add('slides'); // Corrected based on original HTML's nested 'slides' structure

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    // Image
    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageWrap.appendChild(optimizedPic);
      }
    }
    wrap.appendChild(imageWrap);

    // Content
    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const category = document.createElement('div');
    category.classList.add('category');
    moveInstrumentation(categoryCell, category);
    category.textContent = categoryCell.textContent.trim();
    contentWrap.appendChild(category);

    const text = document.createElement('div');
    text.classList.add('text');
    moveInstrumentation(textCell, text);
    text.textContent = textCell.textContent.trim();
    contentWrap.appendChild(text);

    const readMoreLink = document.createElement('a');
    readMoreLink.classList.add('btn', 'btn-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      readMoreLink.href = foundLink.href;
      readMoreLink.textContent = 'Read more'; // Hardcoded as per original HTML
    }
    moveInstrumentation(linkCell, readMoreLink);
    contentWrap.appendChild(readMoreLink);

    const date = document.createElement('div');
    date.classList.add('date');
    const time = document.createElement('time');
    time.setAttribute('datetime', dateCell.textContent.trim()); // Assuming date-time field provides ISO format
    time.textContent = dateCell.textContent.trim();
    date.appendChild(time);
    moveInstrumentation(dateCell, date);
    contentWrap.appendChild(date);

    wrap.appendChild(contentWrap);
    slide.appendChild(wrap);
    slidesContainer.appendChild(slide);
    moveInstrumentation(row, slide);
  });

  section.appendChild(container);
  block.replaceWith(section);
}
