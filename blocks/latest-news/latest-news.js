import { createOptimizedPicture, loadScript } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const headingRow = children.shift(); // First row is always the heading
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

  // Main container for content
  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');

  const flickityWrap = document.createElement('div');
  flickityWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickityWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('slides');

  children.forEach((row) => {
    const slide = document.createElement('div');
    slide.classList.add('slides');
    moveInstrumentation(row, slide);

    const cells = [...row.children];

    // Elfsight Widget Embed (3 cells)
    if (cells.length === 3) {
      const [embedUrlCell, embedKindCell, embedConfigCell] = cells;
      const kind = embedKindCell.textContent.trim();
      const embedUrl = embedUrlCell.textContent.trim();
      const config = embedConfigCell.textContent.trim();

      const el = document.createElement('div');
      el.setAttribute('data-embed-kind', kind);
      el.setAttribute('data-embed-url', embedUrl);
      el.setAttribute('data-embed-config', config);

      switch (kind) {
        case 'elfsight-widget': {
          const parsedConfig = JSON.parse(config);
          el.classList.add(`elfsight-app-${parsedConfig.app_id}`);
          el.setAttribute('data-elfsight-app-lazy', '');
          loadScript('https://static.elfsight.com/platform/platform.js');
          break;
        }
        case 'walls-io': {
          const wallScript = document.createElement('script');
          wallScript.src = 'https://walls.io/js/wallsio-widget-1.2.js';
          wallScript.dataset.wallurl = embedUrl;
          wallScript.dataset.width = '100%';
          wallScript.dataset.autoheight = '1';
          wallScript.async = true;
          el.append(wallScript);
          break;
        }
        case 'twitter-embed':
        case 'instagram-embed':
        case 'tiktok-embed': {
          const platforms = {
            'twitter-embed': 'https://platform.twitter.com/widgets.js',
            'instagram-embed': 'https://www.instagram.com/embed.js',
            'tiktok-embed': 'https://www.tiktok.com/embed.js',
          };
          loadScript(platforms[kind]);
          const link = document.createElement('a');
          link.href = embedUrl;
          link.textContent = `View post on ${kind.split('-')[0].charAt(0).toUpperCase()}${kind.split('-')[0].slice(1)}`;
          el.append(link);
          break;
        }
        default:
          // Handle other embed kinds or render a placeholder
          el.textContent = `[${kind} placeholder]`;
          break;
      }
      slide.append(el);
    }
    // News Item (7 cells)
    else if (cells.length === 7) {
      const [
        imageSquareCell,
        imageHorizontalCell,
        imageVerticalCell,
        categoryCell,
        headlineCell,
        linkCell,
        dateCell,
      ] = cells;

      const wrap = document.createElement('div');
      wrap.classList.add('wrap');

      const imageWrap = document.createElement('div');
      imageWrap.classList.add('image-wrap');

      const picture = imageSquareCell.querySelector('picture');
      const img = picture ? picture.querySelector('img') : null;

      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        moveInstrumentation(img, optimizedImg);
        optimizedImg.classList.add('thumb-img', 'img-fluid');

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

      const dateDiv = document.createElement('div');
      dateDiv.classList.add('date');
      const time = document.createElement('time');
      time.setAttribute('datetime', dateCell.textContent.trim()); // Assuming date is in ISO format or similar
      time.textContent = dateCell.textContent.trim(); // Display original date text
      dateDiv.append(time);
      contentWrap.append(dateDiv);

      wrap.append(contentWrap);
      slide.append(wrap);
    }
    slidesContainer.append(slide);
  });

  flickityWrap.append(slidesContainer);
  container.append(flickityWrap);
  section.append(container);

  block.replaceChildren(section);
}
