import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('latestblogs-latestBlogs-article_listing', 'latestblogs-position-relative');

  const firstSection = document.createElement('div');
  firstSection.classList.add('latestblogs-latestBlogs-article_listing_section--first', 'latestblogs-text-white', 'latestblogs-text-center');

  const heading = block.querySelector('[data-aue-prop="heading"]') || block.querySelector('h2');
  if (heading) {
    heading.classList.add('latestblogs-latestBlogs-article_listing--title', 'latestblogs-boing--text__heading-1', 'latestblogs-text-white', 'latestblogs-pb-3');
    firstSection.append(heading);
    moveInstrumentation(heading, firstSection);
  }

  const description = block.querySelector('[data-aue-prop="description"]') || block.querySelector('p');
  if (description) {
    description.classList.add('latestblogs-latestBlogs-article_listing--desc', 'latestblogs-boing--text__body-2', 'latestblogs-pb-4');
    firstSection.append(description);
    moveInstrumentation(description, firstSection);
  }

  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('latestblogs-latestBlogs-article_listing--btnWrapper');
  const viewAllLink = block.querySelector('[data-aue-prop="viewAllLink"]') || block.querySelector('.button-container a');
  if (viewAllLink) {
    viewAllLink.classList.add('latestblogs-boing--text__title-3', 'latestblogs-latestBlogs-article_listing--btn', 'latestblogs-analytics_cta_click');
    buttonWrapper.append(viewAllLink);
    moveInstrumentation(viewAllLink, buttonWrapper);
  }
  if (buttonWrapper.children.length > 0) {
    firstSection.append(buttonWrapper);
    moveInstrumentation(buttonWrapper, firstSection);
  }

  wrapperDiv.append(firstSection);
  moveInstrumentation(firstSection, wrapperDiv);

  const secondSection = document.createElement('div');
  secondSection.classList.add('latestblogs-latestBlogs-article_listing_section--second', 'latestblogs-d-flex');

  const articles = block.querySelectorAll('[data-aue-model="article"]');
  articles.forEach((articleNode) => {
    const cardLink = document.createElement('a');
    cardLink.classList.add('latestblogs-latestBlogs-article_listing--cardWrapper', 'latestblogs-analytics_cta_click');
    cardLink.href = articleNode.querySelector('a')?.href || '#';
    cardLink.setAttribute('data-cta-label', articleNode.querySelector('a')?.getAttribute('data-cta-label') || '');

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('latestblogs-latestBlogs-article_listing--cards');

    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('latestblogs-latestBlogs-article_listing--cardImageWrapper');

    const image = articleNode.querySelector('[data-aue-prop="image"] img');
    if (image) {
      const picture = createOptimizedPicture(image.src, image.alt);
      picture.querySelector('img').classList.add('latestblogs-latestBlogs-article_listing--cardImage', 'latestblogs-w-100', 'latestblogs-h-100');
      imageWrapper.append(picture);
      moveInstrumentation(image, imageWrapper);
    }
    cardDiv.append(imageWrapper);
    moveInstrumentation(imageWrapper, cardDiv);

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('latestblogs-latestBlogs-cards_content--wrapper');

    const date = articleNode.querySelector('[data-aue-prop="date"]') || articleNode.querySelector('.latestblogs-published_date');
    if (date) {
      date.classList.add('latestblogs-boing--text__body-5', 'latestblogs-p-0', 'latestblogs-m-0', 'latestblogs-mb-3', 'latestblogs-published_date');
      contentWrapper.append(date);
      moveInstrumentation(date, contentWrapper);
    }

    const title = articleNode.querySelector('[data-aue-prop="title"]') || articleNode.querySelector('.latestblogs-boing--text__body');
    if (title) {
      title.classList.add('latestblogs-boing--text__body-2', 'latestblogs-boing--text__body');
      contentWrapper.append(title);
      moveInstrumentation(title, contentWrapper);
    }

    cardDiv.append(contentWrapper);
    moveInstrumentation(contentWrapper, cardDiv);

    cardLink.append(cardDiv);
    moveInstrumentation(cardDiv, cardLink);
    secondSection.append(cardLink);
    moveInstrumentation(articleNode, cardLink);
  });

  wrapperDiv.append(secondSection);
  moveInstrumentation(secondSection, wrapperDiv);

  block.textContent = '';
  block.append(wrapperDiv);
  block.className = 'latestblogs-latestBlogs-article_listing--wrapper block';
  block.dataset.blockStatus = 'loaded';
}