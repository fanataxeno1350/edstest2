import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const [headingRow, ...newsItemRows] = children;

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // FIX: Access content from the cell div, not the row's direct child which is the cell itself.
  heading.textContent = headingRow.querySelector('div')?.textContent.trim() || '';
  sectionHeader.append(heading);
  section.append(sectionHeader);

  // Container for news items
  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickitySliderWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');

  newsItemRows.forEach((row) => {
    const [
      imageCell,
      imageHorizontalCell,
      imageVerticalCell,
      categoryCell,
      descriptionCell,
      ctaLinkCell,
      ctaLabelCell,
      dateCell,
    ] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('slides');
    moveInstrumentation(row, slide);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const defaultPicture = imageCell.querySelector('picture');
    const defaultImg = defaultPicture ? defaultPicture.querySelector('img') : null;

    if (defaultImg) {
      const optimizedPic = createOptimizedPicture(defaultImg.src, defaultImg.alt, false, [{ width: '750' }]);
      const img = optimizedPic.querySelector('img');
      img.classList.add('thumb-img', 'img-fluid');
      img.setAttribute('loading', 'lazy');

      const horizontalPicture = imageHorizontalCell.querySelector('picture');
      const horizontalImg = horizontalPicture ? horizontalPicture.querySelector('img') : null;
      if (horizontalImg) {
        img.setAttribute('data-img-horizontal', horizontalImg.src);
      }

      const verticalPicture = imageVerticalCell.querySelector('picture');
      const verticalImg = verticalPicture ? verticalPicture.querySelector('img') : null;
      if (verticalImg) {
        img.setAttribute('data-img-vertical', verticalImg.src);
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
    text.textContent = descriptionCell.textContent.trim();
    contentWrap.append(text);

    const ctaLink = ctaLinkCell.querySelector('a');
    if (ctaLink) {
      const link = document.createElement('a');
      link.classList.add('btn', 'btn-link');
      link.href = ctaLink.href;
      link.textContent = ctaLabelCell.textContent.trim();
      contentWrap.append(link);
    }

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    const time = document.createElement('time');
    time.setAttribute('datetime', dateCell.textContent.trim()); // Use actual date from cell for datetime
    time.textContent = dateCell.textContent.trim();
    dateDiv.append(time);
    contentWrap.append(dateDiv);

    wrap.append(contentWrap);
    slide.append(wrap);
    flickitySliderWrap.append(slide);
  });

  container.append(flickitySliderWrap);
  section.append(container);
  block.replaceChildren(section);
}
