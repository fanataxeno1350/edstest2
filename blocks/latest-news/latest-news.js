import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');

  // Section Heading
  const [headingRow] = children; // Fixed: Use destructuring for headingRow
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.children[0]?.textContent.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');

  const sliderWrap = document.createElement('div');
  sliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  // Flickity is not Swiper, but the data-flickity attribute is present.
  // Assuming Flickity is the intended library, no Swiper init needed.
  // If Swiper was intended, this data-flickity attribute should be ignored or replaced.
  // For now, keeping Flickity attribute as is.
  sliderWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const embeds = [];
  const stories = [];

  // Separate embeds and stories based on cell count
  children.slice(1).forEach((row) => {
    if (row.children.length === 3) { // Elfsight Embed Item
      embeds.push(row);
    } else if (row.children.length === 8) { // News Story Item
      stories.push(row);
    }
  });

  // Process Elfsight Embeds
  for (const row of embeds) {
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];
    const kind = embedKindCell.textContent.trim();
    const embedUrl = embedUrlCell.textContent.trim();
    const embedConfig = embedConfigCell.textContent.trim();

    const slide = document.createElement('div');
    slide.classList.add('slides');
    moveInstrumentation(row, slide);

    const embedEl = document.createElement('div');
    embedEl.setAttribute('data-embed-kind', kind);
    embedEl.setAttribute('data-embed-url', embedUrl);
    embedEl.setAttribute('data-embed-config', embedConfig);

    switch (kind) {
      case 'elfsight-widget': {
        try {
          const config = JSON.parse(embedConfig);
          embedEl.classList.add(`elfsight-app-${config.app_id}`);
          embedEl.setAttribute('data-elfsight-app-lazy', '');
          await loadScript('https://static.elfsight.com/platform/platform.js');
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Failed to parse Elfsight config:', e);
        }
        break;
      }
      case 'walls-io': {
        const wallScript = document.createElement('script');
        wallScript.src = 'https://walls.io/js/wallsio-widget-1.2.js';
        wallScript.dataset.wallurl = embedUrl;
        wallScript.dataset.width = '100%';
        wallScript.dataset.autoheight = '1';
        wallScript.async = true;
        embedEl.append(wallScript);
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
        await loadScript(platforms[kind]);
        const link = document.createElement('a');
        link.href = embedUrl;
        link.textContent = `View post on ${kind.split('-')[0].charAt(0).toUpperCase()}${kind.split('-')[0].slice(1)}`;
        embedEl.append(link);
        break;
      }
      default:
        // Handle other embed kinds or provide a fallback
        embedEl.textContent = `[${kind} placeholder]`;
        break;
    }
    slide.append(embedEl);
    sliderWrap.append(slide);
  }

  // Process News Stories
  stories.forEach((row) => {
    const [
      imageCell,
      imageHorizontalCell,
      imageVerticalCell,
      categoryCell,
      headlineCell,
      storyLinkCell,
      storyLinkLabelCell,
      dateCell,
    ] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('slides');
    moveInstrumentation(row, slide); // Move instrumentation for the story row

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

      // Set data attributes for horizontal and vertical images
      const horizontalImg = imageHorizontalCell.querySelector('img');
      if (horizontalImg) {
        optimizedImg.setAttribute('data-img-horizontal', horizontalImg.src);
      }
      const verticalImg = imageVerticalCell.querySelector('img');
      if (verticalImg) {
        optimizedImg.setAttribute('data-img-vertical', verticalImg.src);
      }

      moveInstrumentation(img, optimizedImg); // Instrumentation for the image
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

    const storyLinkAnchor = storyLinkCell.querySelector('a'); // Fixed: Get the anchor element
    if (storyLinkAnchor) {
      const link = document.createElement('a');
      link.href = storyLinkAnchor.href; // Fixed: Read href from the anchor
      link.classList.add('btn', 'btn-link');
      link.textContent = storyLinkLabelCell.textContent.trim();
      contentWrap.append(link);
    }

    const date = document.createElement('div');
    date.classList.add('date');
    const time = document.createElement('time');
    time.setAttribute('datetime', dateCell.textContent.trim()); // Assuming date cell contains valid datetime string
    time.textContent = dateCell.textContent.trim(); // Display the date as is
    date.append(time);
    contentWrap.append(date);

    wrap.append(contentWrap);
    slide.append(wrap);
    sliderWrap.append(slide);
  });

  container.append(sliderWrap);
  section.append(container);

  block.replaceChildren(section);
}
