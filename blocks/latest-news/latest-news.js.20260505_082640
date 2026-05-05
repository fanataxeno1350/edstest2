import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];
  const [headingRow, ...itemRows] = children;

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');
  moveInstrumentation(block, section);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

  // Container for embeds and news items
  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  section.append(container);

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickitySliderWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');
  container.append(flickitySliderWrap);

  itemRows.forEach((row) => {
    const cells = [...row.children];
    const slidesDiv = document.createElement('div');
    slidesDiv.classList.add('slides');
    moveInstrumentation(row, slidesDiv);

    if (cells.length === 3) {
      // Elfsight embed item
      const [embedUrlCell, embedKindCell, embedConfigCell] = cells;
      const embedKind = embedKindCell.textContent.trim();
      const embedUrl = embedUrlCell.textContent.trim();

      const embedEl = document.createElement('div');
      embedEl.setAttribute('data-embed-kind', embedKind);
      embedEl.setAttribute('data-embed-url', embedUrl);

      if (embedKind === 'elfsight-widget') {
        const config = JSON.parse(embedConfigCell.textContent.trim());
        embedEl.classList.add(`elfsight-app-${config.app_id}`);
        embedEl.setAttribute('data-elfsight-app-lazy', '');
        loadScript('https://static.elfsight.com/platform/platform.js');
      } else if (embedKind === 'walls-io') {
        const wallScript = document.createElement('script');
        wallScript.src = 'https://walls.io/js/wallsio-widget-1.2.js';
        wallScript.dataset.wallurl = embedUrl;
        wallScript.dataset.width = '100%';
        wallScript.dataset.autoheight = '1';
        wallScript.async = true;
        embedEl.append(wallScript);
      } else if (['twitter-embed', 'instagram-embed', 'tiktok-embed'].includes(embedKind)) {
        const platforms = {
          'twitter-embed': 'https://platform.twitter.com/widgets.js',
          'instagram-embed': 'https://www.instagram.com/embed.js',
          'tiktok-embed': 'https://www.tiktok.com/embed.js',
        };
        loadScript(platforms[embedKind]);
        const link = document.createElement('a');
        link.href = embedUrl;
        link.textContent = `View post on ${embedKind.split('-')[0].charAt(0).toUpperCase()}${embedKind.split('-')[0].slice(1)}`;
        embedEl.append(link);
      }

      slidesDiv.append(embedEl);
    } else if (cells.length === 8) {
      // News item
      const [imageCell, imageHorizontalCell, imageVerticalCell, categoryCell, headlineCell, linkCell, ctaLabelCell, dateCell] = cells;

      const wrapDiv = document.createElement('div');
      wrapDiv.classList.add('wrap');

      const imageWrap = document.createElement('div');
      imageWrap.classList.add('image-wrap');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          const optimizedImg = optimizedPic.querySelector('img');
          moveInstrumentation(img, optimizedImg);
          optimizedImg.classList.add('thumb-img', 'img-fluid');
          optimizedImg.setAttribute('data-img-horizontal', imageHorizontalCell.querySelector('img')?.src || '');
          optimizedImg.setAttribute('data-img-vertical', imageVerticalCell.querySelector('img')?.src || '');
          imageWrap.append(optimizedPic);
        }
      }
      wrapDiv.append(imageWrap);

      const contentWrap = document.createElement('div');
      contentWrap.classList.add('content-wrap');

      const categoryDiv = document.createElement('div');
      categoryDiv.classList.add('category');
      categoryDiv.textContent = categoryCell.textContent.trim();
      contentWrap.append(categoryDiv);

      const textDiv = document.createElement('div');
      textDiv.classList.add('text');
      textDiv.textContent = headlineCell.textContent.trim();
      contentWrap.append(textDiv);

      const newsLink = document.createElement('a');
      newsLink.classList.add('btn', 'btn-link');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        newsLink.href = foundLink.href;
      }
      newsLink.textContent = ctaLabelCell.textContent.trim();
      contentWrap.append(newsLink);

      const dateDiv = document.createElement('div');
      dateDiv.classList.add('date');
      const timeEl = document.createElement('time');
      timeEl.setAttribute('datetime', new Date(dateCell.textContent.trim()).toISOString());
      timeEl.textContent = dateCell.textContent.trim();
      dateDiv.append(timeEl);
      contentWrap.append(dateDiv);

      wrapDiv.append(contentWrap);
      slidesDiv.append(wrapDiv);
    }
    flickitySliderWrap.append(slidesDiv);
  });

  block.replaceChildren(section);

  // Load Flickity CSS and JS
  await loadCSS('/libs/flickity/flickity.min.css'); // Assuming Flickity CSS is in /libs/flickity
  await loadScript('/libs/flickity/flickity.pkgd.min.js'); // Assuming Flickity JS is in /libs/flickity

  // Initialize Flickity
  // eslint-disable-next-line no-undef
  if (typeof Flickity === 'function') {
    // eslint-disable-next-line no-new, no-undef
    new Flickity(flickitySliderWrap, JSON.parse(flickitySliderWrap.dataset.flickity));
  }
}
