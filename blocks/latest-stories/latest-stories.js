import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  // Find the heading cell using content detection instead of direct index access
  const headingRow = children.find(row => row.children.length === 1 && !row.querySelector('picture') && !row.querySelector('a'));
  if (headingRow) {
    const headingCell = headingRow.children[0];
    moveInstrumentation(headingRow, sectionHeader);

    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.setAttribute('data-aos', 'fade-up');
    heading.setAttribute('data-aos-offset', '100');
    heading.setAttribute('data-aos-duration', '650');
    heading.setAttribute('data-aos-easing', 'ease-in-out');
    heading.textContent = headingCell.textContent.trim();
    sectionHeader.append(heading);
  }


  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickitySliderWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const twitterFeedSlides = document.createElement('div');
  twitterFeedSlides.classList.add('slides');

  const newsSlides = document.createElement('div');
  newsSlides.classList.add('slides');

  // Separate twitter feed items from news slide items
  // Filter out the heading row first, then proceed with item filtering
  const itemRows = children.filter(row => row !== headingRow);
  const twitterFeedItems = itemRows.filter((row) => row.children.length === 1);
  const newsSlideItems = itemRows.filter((row) => row.children.length === 5);

  twitterFeedItems.forEach((row) => {
    const [widgetIdCell] = [...row.children];

    const elfsightApp = document.createElement('div');
    elfsightApp.classList.add('elfsight-app-81878be6-2fc1-4ba6-b776-5fb962097235', 'eapps-twitter-feed', 'eapps-twitter-feed-source-user', 'eapps-twitter-feed-color-scheme--dark');
    elfsightApp.setAttribute('data-elfsight-app-lazy', '');
    // The widgetId is an image reference in EDS, but it represents an ID for the Elfsight app.
    // We extract the alt text from the image as the ID.
    const widgetIdImg = widgetIdCell.querySelector('img');
    if (widgetIdImg && widgetIdImg.alt) {
      elfsightApp.id = `eapps-twitter-feed-${widgetIdImg.alt.replace(/\s/g, '-')}`;
    } else {
      elfsightApp.id = 'eapps-twitter-feed-default';
    }

    // Move instrumentation from the original row to the new element
    moveInstrumentation(row, elfsightApp);
    twitterFeedSlides.append(elfsightApp);
  });

  newsSlideItems.forEach((row) => {
    const [imageCell, categoryCell, textCell, ctaLinkCell, dateCell] = [...row.children];

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');
    moveInstrumentation(row, wrap);

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
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
    text.textContent = textCell.textContent.trim();
    contentWrap.append(text);

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('btn', 'btn-link');
    const foundLink = ctaLinkCell.querySelector('a');
    if (foundLink) {
      ctaLink.href = foundLink.href;
      ctaLink.textContent = 'Read more'; // Hardcoded label from original HTML
    }
    contentWrap.append(ctaLink);

    const date = document.createElement('div');
    date.classList.add('date');
    const time = document.createElement('time');
    time.setAttribute('datetime', dateCell.textContent.trim()); // Assuming date cell contains a valid datetime string
    time.textContent = dateCell.textContent.trim();
    date.append(time);
    contentWrap.append(date);

    wrap.append(contentWrap);
    newsSlides.append(wrap);
  });

  flickitySliderWrap.append(twitterFeedSlides);
  flickitySliderWrap.append(newsSlides);
  container.append(flickitySliderWrap);

  block.innerHTML = '';
  block.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');
  block.append(sectionHeader);
  block.append(container);
}
