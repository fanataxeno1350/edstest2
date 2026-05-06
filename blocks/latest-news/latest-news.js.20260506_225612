import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];
  const headingRow = children[0];
  const itemRows = children.slice(1);

  const embeds = [];
  const newsItems = [];

  itemRows.forEach((row) => {
    if (row.children.length === 3) { // elfsight-widget-embed has 3 cells
      embeds.push(row);
    } else if (row.children.length === 7) { // news-item has 7 cells
      newsItems.push(row);
    }
  });

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.children[0].textContent.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickitySliderWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  embeds.forEach((row) => {
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];
    const kind = embedKindCell.textContent.trim();

    const slide = document.createElement('div');
    slide.classList.add('slides');
    moveInstrumentation(row, slide);

    const embedDiv = document.createElement('div');
    embedDiv.setAttribute('data-embed-kind', kind);
    embedDiv.setAttribute('data-embed-url', embedUrlCell.textContent.trim());

    if (kind === 'elfsight-widget') {
      const config = JSON.parse(embedConfigCell.textContent.trim());
      embedDiv.classList.add(`elfsight-app-${config.app_id}`);
      embedDiv.setAttribute('data-elfsight-app-lazy', '');
      loadScript('https://static.elfsight.com/platform/platform.js');
    }
    // Add other embed kinds if needed, following Rule 29

    slide.append(embedDiv);
    flickitySliderWrap.append(slide);
  });

  newsItems.forEach((row) => {
    const [imageCell, imageHorizontalCell, imageVerticalCell, categoryCell, headlineCell, linkCell, dateCell] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('slides');
    moveInstrumentation(row, slide);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const mainPicture = imageCell.querySelector('picture');
    if (mainPicture) {
      const img = mainPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('thumb-img', 'img-fluid');
      optimizedImg.setAttribute('loading', 'lazy');

      const horizontalImg = imageHorizontalCell.querySelector('img');
      if (horizontalImg) {
        optimizedImg.setAttribute('data-img-horizontal', horizontalImg.src);
      }
      const verticalImg = imageVerticalCell.querySelector('img');
      if (verticalImg) {
        optimizedImg.setAttribute('data-img-vertical', verticalImg.src);
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
    text.textContent = headlineCell.textContent.trim();
    contentWrap.append(text);

    const readMoreLink = document.createElement('a');
    readMoreLink.classList.add('btn', 'btn-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      readMoreLink.href = foundLink.href;
    }
    readMoreLink.textContent = 'Read more';
    contentWrap.append(readMoreLink);

    const date = document.createElement('div');
    date.classList.add('date');
    const time = document.createElement('time');
    time.setAttribute('datetime', new Date(dateCell.textContent.trim()).toISOString());
    time.textContent = dateCell.textContent.trim();
    date.append(time);
    contentWrap.append(date);

    wrap.append(contentWrap);
    slide.append(wrap);
    flickitySliderWrap.append(slide);
  });

  container.append(flickitySliderWrap);
  section.append(container);

  block.replaceChildren(section);

  // Load Flickity CSS and JS
  await loadCSS('https://unpkg.com/flickity@2/dist/flickity.min.css');
  await loadScript('https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js');

  // Initialize Flickity
  // eslint-disable-next-line no-undef
  if (typeof Flickity !== 'undefined') {
    // Flickity is initialized on the .flickity-slider-mobile-wrap element
    // The data-flickity attribute handles the configuration
    // No explicit new Flickity() call is needed here if it auto-initializes based on data-flickity
    // If it doesn't auto-initialize, you would do:
    // new Flickity(flickitySliderWrap, {
    //   wrapAround: false,
    //   lazyLoad: true,
    //   pageDots: true,
    //   prevNextButtons: false,
    //   imagesLoaded: true,
    //   cellAlign: 'left',
    //   watchCSS: true,
    //   adaptiveHeight: true
    // });
  }
}
