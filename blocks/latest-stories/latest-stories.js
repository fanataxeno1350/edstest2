import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');
  moveInstrumentation(block, section);

  const [headingRow, ...itemRows] = [...block.children];

  // Heading
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // Use children[0] for consistency, though firstElementChild is not a violation here.
  moveInstrumentation(headingRow.children[0], heading);
  heading.textContent = headingRow.children[0].textContent;
  sectionHeader.append(heading);
  section.append(sectionHeader);

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');

  const flickityWrap = document.createElement('div');
  flickityWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickityWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const twitterSlides = document.createElement('div');
  twitterSlides.classList.add('slides');
  const storySlides = document.createElement('div');
  storySlides.classList.add('slides');

  itemRows.forEach((row) => {
    const cells = [...row.children];

    if (cells.length === 0) { // Twitter Embed Item
      const twitterEmbedDiv = document.createElement('div');
      twitterEmbedDiv.classList.add(
        'elfsight-app-81878be6-2fc1-4ba6-b776-5fb962097235',
        'eapps-twitter-feed',
        'eapps-twitter-feed-source-user',
        'eapps-twitter-feed-color-scheme--dark',
      );
      twitterEmbedDiv.setAttribute('data-elfsight-app-lazy', '');
      twitterEmbedDiv.id = 'eapps-twitter-feed-1';
      moveInstrumentation(row, twitterEmbedDiv);
      twitterSlides.append(twitterEmbedDiv);
    } else if (cells.length === 5) { // Story Item
      const wrap = document.createElement('div');
      wrap.classList.add('wrap');
      moveInstrumentation(row, wrap);

      const imageCell = cells.find((c) => c.querySelector('picture'));
      const categoryCell = cells.find((c) => !c.querySelector('picture') && !c.querySelector('a') && c.textContent.trim() !== '' && !c.textContent.match(/\d{1,2} (January|February|March|April|May|June|July|August|September|October|November|December) \d{4}/));
      const textCell = cells.find((c) => !c.querySelector('picture') && !c.querySelector('a') && c.textContent.trim() !== '' && c.textContent.length > 50); // Heuristic for text
      const linkCell = cells.find((c) => c.querySelector('a'));
      const dateCell = cells.find((c) => !c.querySelector('picture') && !c.querySelector('a') && c.textContent.match(/\d{1,2} (January|February|March|April|May|June|July|August|September|October|November|December) \d{4}/));

      if (imageCell) {
        const imageWrap = document.createElement('div');
        imageWrap.classList.add('image-wrap');
        const picture = imageCell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          imageWrap.append(optimizedPic);
        }
        wrap.append(imageWrap);
      }

      const contentWrap = document.createElement('div');
      contentWrap.classList.add('content-wrap');

      if (categoryCell) {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');
        moveInstrumentation(categoryCell, categoryDiv);
        categoryDiv.textContent = categoryCell.textContent;
        contentWrap.append(categoryDiv);
      }

      if (textCell) {
        const textDiv = document.createElement('div');
        textDiv.classList.add('text');
        moveInstrumentation(textCell, textDiv);
        textDiv.textContent = textCell.textContent;
        contentWrap.append(textDiv);
      }

      if (linkCell) {
        const link = document.createElement('a');
        link.classList.add('btn', 'btn-link');
        const originalLink = linkCell.querySelector('a');
        if (originalLink) {
          link.href = originalLink.href;
          link.textContent = originalLink.textContent;
        }
        moveInstrumentation(linkCell, link);
        contentWrap.append(link);
      }

      if (dateCell) {
        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date');
        const time = document.createElement('time');
        const dateText = dateCell.textContent.trim();
        time.textContent = dateText;
        try {
          const parsedDate = new Date(dateText);
          if (!isNaN(parsedDate)) {
            time.setAttribute('datetime', parsedDate.toISOString());
          }
        } catch (e) {
          // Fallback if date parsing fails
        }
        moveInstrumentation(dateCell, dateDiv);
        dateDiv.append(time);
        contentWrap.append(dateDiv);
      }
      wrap.append(contentWrap);
      storySlides.append(wrap);
    }
  });

  if (twitterSlides.children.length > 0) {
    flickityWrap.append(twitterSlides);
  }
  if (storySlides.children.length > 0) {
    flickityWrap.append(storySlides);
  }

  container.append(flickityWrap);
  section.append(container);

  block.textContent = '';
  block.append(section);
}
