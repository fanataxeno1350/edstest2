import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];
  const sectionTitleRow = children[0];
  const itemRows = children.slice(1); // All subsequent rows are either embeds or stories

  const embedRows = itemRows.filter((row) => row.children.length === 3);
  const storyRows = itemRows.filter((row) => row.children.length === 8);

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(sectionTitleRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = sectionTitleRow.textContent.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');

  const flickityWrap = document.createElement('div');
  flickityWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickityWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('slides'); // This is the container for all slides

  // Process embed items
  embedRows.forEach((row) => {
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];
    const embedKind = embedKindCell.textContent.trim();
    const el = document.createElement('div');
    moveInstrumentation(row, el);
    el.classList.add('slide'); // Each embed is a slide

    switch (embedKind) {
      case 'elfsight-widget': {
        const config = JSON.parse(embedConfigCell.textContent.trim());
        el.classList.add(`elfsight-app-${config.app_id}`);
        el.setAttribute('data-embed-kind', embedKind);
        el.setAttribute('data-embed-url', embedUrlCell.textContent.trim());
        el.setAttribute('data-embed-config', embedConfigCell.textContent.trim());
        loadScript('https://static.elfsight.com/platform/platform.js');
        break;
      }
      case 'walls-io': {
        const wallScript = document.createElement('script');
        wallScript.src = 'https://walls.io/js/wallsio-widget-1.2.js';
        wallScript.dataset.wallurl = embedUrlCell.textContent.trim();
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
        loadScript(platforms[embedKind]);
        const link = document.createElement('a');
        link.href = embedUrlCell.textContent.trim();
        link.textContent = `View post on ${embedKind.split('-')[0].charAt(0).toUpperCase()}${embedKind.split('-')[0].slice(1)}`;
        el.append(link);
        break;
      }
      default:
        // Handle other embed kinds or provide a fallback
        el.textContent = `[${embedKind} embed placeholder]`;
        break;
    }
    slidesContainer.append(el);
  });

  // Process news story items
  storyRows.forEach((row) => {
    const [
      imageCell,
      imageHorizontalCell,
      imageVerticalCell,
      categoryCell,
      headlineCell,
      storyLinkCell,
      ctaLabelCell,
      dateCell,
    ] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('slides'); // Each story is a slide
    moveInstrumentation(row, slide);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // The original HTML has 'thumb-img img-fluid' on the <img> tag directly.
        // createOptimizedPicture returns a <picture> element, so we need to target its <img> child.
        const optimizedImg = optimizedPic.querySelector('img');
        if (optimizedImg) {
          optimizedImg.classList.add('thumb-img', 'img-fluid');
          optimizedImg.setAttribute('data-img-horizontal', imageHorizontalCell.querySelector('img')?.src || '');
          optimizedImg.setAttribute('data-img-vertical', imageVerticalCell.querySelector('img')?.src || '');
        }
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

    const text = document.createElement('div');
    text.classList.add('text');
    text.textContent = headlineCell.textContent.trim();
    contentWrap.append(text);

    const storyLink = storyLinkCell.querySelector('a');
    if (storyLink) {
      const link = document.createElement('a');
      link.href = storyLink.href;
      link.classList.add('btn', 'btn-link');
      link.textContent = ctaLabelCell.textContent.trim();
      contentWrap.append(link);
    }

    const date = document.createElement('div');
    date.classList.add('date');
    date.innerHTML = `<time datetime="${dateCell.textContent.trim()}">${dateCell.textContent.trim()}</time>`;
    contentWrap.append(date);

    wrap.append(contentWrap);
    slide.append(wrap);
    slidesContainer.append(slide);
  });

  flickityWrap.append(slidesContainer);
  container.append(flickityWrap);
  section.append(container);

  block.replaceChildren(section);
}
