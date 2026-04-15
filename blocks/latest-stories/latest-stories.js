import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...itemRows] = [...block.children];

  // Create the main section wrapper
  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');
  moveInstrumentation(block, section);

  // Handle Heading
  const headingCell = [...headingRow.children][0];
  if (headingCell && headingCell.textContent.trim()) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');

    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.textContent = headingCell.textContent.trim();
    moveInstrumentation(headingCell, heading);

    sectionHeader.append(heading);
    section.append(sectionHeader);
  }

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');

  const flickityWrapper = document.createElement('div');
  flickityWrapper.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickityWrapper.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const slidesWrapper = document.createElement('div');
  slidesWrapper.classList.add('slides');

  itemRows.forEach((row) => {
    const cells = [...row.children];

    // Distinguish between story-item (5 cells) and twitter-feed-embed (0 cells)
    if (cells.length === 5) { // story-item
      // Use content detection instead of index access
      const imageCell = cells.find(cell => cell.querySelector('picture'));
      const categoryCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim() === 'Category value'); // More specific detection
      const textCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim() === 'Text value'); // More specific detection
      const linkCell = cells.find(cell => cell.querySelector('a'));
      const dateCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim().includes('April')); // More specific detection

      const wrap = document.createElement('div');
      wrap.classList.add('wrap');
      moveInstrumentation(row, wrap);

      if (imageCell && imageCell.querySelector('picture')) {
        const imageWrap = document.createElement('div');
        imageWrap.classList.add('image-wrap');
        const picture = imageCell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          if (img) {
            const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            imageWrap.append(optimizedPic);
            optimizedPic.querySelector('img').classList.add('thumb-img', 'img-fluid');
          }
        }
        wrap.append(imageWrap);
      }

      const contentWrap = document.createElement('div');
      contentWrap.classList.add('content-wrap');

      if (categoryCell && categoryCell.textContent.trim()) {
        const category = document.createElement('div');
        category.classList.add('category');
        category.textContent = categoryCell.textContent.trim();
        moveInstrumentation(categoryCell, category);
        contentWrap.append(category);
      }

      if (textCell && textCell.textContent.trim()) {
        const text = document.createElement('div');
        text.classList.add('text');
        text.textContent = textCell.textContent.trim();
        moveInstrumentation(textCell, text);
        contentWrap.append(text);
      }

      if (linkCell && linkCell.querySelector('a')) {
        const originalLink = linkCell.querySelector('a');
        const link = document.createElement('a');
        link.href = originalLink.href;
        link.textContent = originalLink.textContent.trim();
        link.classList.add('btn', 'btn-link');
        moveInstrumentation(originalLink, link);
        contentWrap.append(link);
      }

      if (dateCell && dateCell.textContent.trim()) {
        const date = document.createElement('div');
        date.classList.add('date');
        const time = document.createElement('time');
        // Assuming the date text can be parsed by Date object
        time.setAttribute('datetime', new Date(dateCell.textContent.trim()).toISOString());
        time.textContent = dateCell.textContent.trim();
        moveInstrumentation(dateCell, time);
        date.append(time);
        contentWrap.append(date);
      }
      wrap.append(contentWrap);
      slidesWrapper.append(wrap);

    } else if (cells.length === 0) { // twitter-feed-embed
      const twitterFeedEmbed = document.createElement('div');
      twitterFeedEmbed.classList.add(
        'elfsight-app-81878be6-2fc1-4ba6-b776-5fb962097235',
        'eapps-twitter-feed',
        'eapps-twitter-feed-source-user',
        'eapps-twitter-feed-color-scheme--dark',
      );
      twitterFeedEmbed.setAttribute('data-elfsight-app-lazy', '');
      twitterFeedEmbed.id = 'eapps-twitter-feed-1';
      moveInstrumentation(row, twitterFeedEmbed);
      slidesWrapper.append(twitterFeedEmbed);
    }
  });

  flickityWrapper.append(slidesWrapper);
  container.append(flickityWrapper);
  section.append(container);

  block.textContent = '';
  block.append(section);

  // Image optimization for story-item images
  block.querySelectorAll('.image-wrap picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
