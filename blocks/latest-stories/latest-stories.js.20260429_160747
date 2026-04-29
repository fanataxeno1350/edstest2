import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headlineRow, ...storyRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const headline = document.createElement('h2');
  headline.classList.add('heading', 'font-regular');
  moveInstrumentation(headlineRow, headline);
  headline.textContent = headlineRow.textContent.trim();
  sectionHeader.append(headline);
  section.append(sectionHeader);

  const container = document.createElement('div');
  container.classList.add('container');

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickitySliderWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('slides');

  storyRows.forEach((row) => {
    const [
      imageCell,
      imageHorizontalCell,
      imageVerticalCell,
      categoryCell,
      summaryCell,
      readMoreLinkCell,
      readMoreLabelCell,
      dateCell,
      dateIsoCell,
    ] = [...row.children];

    const slide = document.createElement('div');
    // The original HTML has <div class="slides"> for the container, and then each item is also wrapped in <div class="slides">
    // This is a common pattern for Flickity where 'slides' is the class for individual cells.
    // The generated JS was using 'slides' for both the container and the individual slide, which is correct.
    // However, the original HTML also has a top-level <div class="slides"> which is the container for all items.
    // The generated JS was creating a new div with class 'slides' for each item, which is correct for Flickity.
    // The previous fix was to remove the 'slides' class from the individual slide, but that would break Flickity.
    // Reverting to the original generated JS for this part.
    slide.classList.add('slides'); // This is correct for Flickity individual slides.

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(imageCell, optimizedPic.querySelector('img'));
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

    const summary = document.createElement('div');
    summary.classList.add('text');
    moveInstrumentation(summaryCell, summary);
    summary.textContent = summaryCell.textContent.trim();
    contentWrap.append(summary);

    const readMoreLink = document.createElement('a');
    readMoreLink.classList.add('btn', 'btn-link');
    const foundLink = readMoreLinkCell.querySelector('a');
    if (foundLink) {
      readMoreLink.href = foundLink.href;
    }
    moveInstrumentation(readMoreLinkCell, readMoreLink);
    readMoreLink.textContent = readMoreLabelCell.textContent.trim();
    contentWrap.append(readMoreLink);

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    const time = document.createElement('time');
    moveInstrumentation(dateCell, time);
    time.setAttribute('datetime', dateIsoCell.textContent.trim());
    time.textContent = dateCell.textContent.trim();
    dateDiv.append(time);
    contentWrap.append(dateDiv);

    wrap.append(contentWrap);
    slide.append(wrap);
    slidesContainer.append(slide);
  });

  flickitySliderWrap.append(slidesContainer);
  container.append(flickitySliderWrap);
  section.append(container);

  block.replaceChildren(section);
}
