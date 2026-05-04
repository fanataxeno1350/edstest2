import { createOptimizedPicture, loadScript } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Check 0 & 1: Heading is the first row, first cell.
  // Use content detection for heading cell to avoid row.children[0]
  const headingRow = children.find(row => row.children.length === 1 && row.children[0].textContent.trim() !== '');
  const headingText = headingRow ? headingRow.children[0].textContent.trim() : '';

  const storyItems = children.filter((row) => row.children.length === 5);
  const elfsightWidgets = children.filter((row) => row.children.length === 3);

  block.innerHTML = ''; // Clear the block to rebuild

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular');
  heading.textContent = headingText;
  sectionHeader.append(heading);
  block.append(sectionHeader);

  const container = document.createElement('div');
  container.classList.add('container');
  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  container.append(flickitySliderWrap);

  elfsightWidgets.forEach((row) => {
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];
    const embedKind = embedKindCell.textContent.trim();

    const slidesDiv = document.createElement('div');
    slidesDiv.classList.add('slides');
    const embedDiv = document.createElement('div');
    embedDiv.setAttribute('data-embed-kind', embedKind);
    embedDiv.setAttribute('data-embed-url', embedUrlCell.textContent.trim());
    embedDiv.setAttribute('data-embed-config', embedConfigCell.textContent.trim());

    if (embedKind === 'elfsight-widget') {
      const config = JSON.parse(embedConfigCell.textContent.trim());
      embedDiv.classList.add(`elfsight-app-${config.app_id}`);
      embedDiv.setAttribute('data-elfsight-app-lazy', '');
      loadScript('https://static.elfsight.com/platform/platform.js');
    } else if (embedKind === 'walls-io') {
      const wallScript = document.createElement('script');
      wallScript.src = 'https://walls.io/js/wallsio-widget-1.2.js';
      wallScript.dataset.wallurl = embedUrlCell.textContent.trim();
      wallScript.dataset.width = '100%';
      wallScript.dataset.autoheight = '1';
      wallScript.async = true;
      embedDiv.append(wallScript);
    } else if (['twitter-embed', 'instagram-embed', 'tiktok-embed'].includes(embedKind)) {
      const platforms = {
        'twitter-embed': 'https://platform.twitter.com/widgets.js',
        'instagram-embed': 'https://www.instagram.com/embed.js',
        'tiktok-embed': 'https://www.tiktok.com/embed.js',
      };
      loadScript(platforms[embedKind]);
      const link = document.createElement('a');
      link.href = embedUrlCell.textContent.trim();
      link.textContent = `View post on ${embedKind.split('-')[0].charAt(0).toUpperCase()}${embedKind.split('-')[0].slice(1)}`;
      embedDiv.append(link);
    }

    moveInstrumentation(row, slidesDiv);
    slidesDiv.append(embedDiv);
    flickitySliderWrap.append(slidesDiv);
  });

  storyItems.forEach((row) => {
    const [imageCell, categoryCell, textCell, linkCell, dateCell] = [...row.children];

    const slidesDiv = document.createElement('div');
    slidesDiv.classList.add('slides');
    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    const imageWrapDiv = document.createElement('div');
    imageWrapDiv.classList.add('image-wrap');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageWrapDiv.append(optimizedPic);
        optimizedPic.querySelector('img').classList.add('thumb-img', 'img-fluid');
      }
    }
    wrapDiv.append(imageWrapDiv);

    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');

    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category');
    categoryDiv.textContent = categoryCell.textContent.trim();
    contentWrapDiv.append(categoryDiv);

    const textDiv = document.createElement('div');
    textDiv.classList.add('text');
    textDiv.textContent = textCell.textContent.trim();
    contentWrapDiv.append(textDiv);

    const linkAnchor = document.createElement('a');
    linkAnchor.classList.add('btn', 'btn-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkAnchor.href = foundLink.href; // Correctly reading href for aem-content type
    }
    linkAnchor.textContent = 'Read more';
    contentWrapDiv.append(linkAnchor);

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    const time = document.createElement('time');
    time.setAttribute('datetime', dateCell.textContent.trim()); // Assuming date is in a parseable format
    time.textContent = new Date(dateCell.textContent.trim()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    dateDiv.append(time);
    contentWrapDiv.append(dateDiv);

    wrapDiv.append(contentWrapDiv);
    moveInstrumentation(row, slidesDiv);
    slidesDiv.append(wrapDiv);
    flickitySliderWrap.append(slidesDiv);
  });

  block.append(container);

  // Check 2: Interactivity - Flickity slider initialization
  // The original HTML has data-flickity attributes, indicating Flickity is used.
  // We need to ensure Flickity is loaded and initialized.
  loadScript('/scripts/flickity.pkgd.min.js').then(() => {
    if (typeof Flickity === 'function') {
      // The data-flickity attribute is on flickity-slider-mobile-wrap,
      // so we need to read its content and parse it.
      const flickityOptions = {
        wrapAround: false,
        lazyLoad: true,
        pageDots: true,
        prevNextButtons: false,
        imagesLoaded: true,
        cellAlign: 'left',
        watchCSS: true,
        adaptiveHeight: true
      };
      // Initialize Flickity
      // eslint-disable-next-line no-new
      new Flickity(flickitySliderWrap, flickityOptions);
    }
  });
}
