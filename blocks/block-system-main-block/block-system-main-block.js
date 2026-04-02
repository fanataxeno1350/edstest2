import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const latestNewsSection = document.createElement('div');
  latestNewsSection.classList.add('col-md-4');

  const topNewsSection = document.createElement('div');
  topNewsSection.classList.add('col-md-8');

  const latestNewsTitleWrapper = document.createElement('div');
  latestNewsTitleWrapper.classList.add('paragraph', 'paragraph--type--text', 'paragraph--view-mode--default');
  const latestNewsTitleContent = document.createElement('div');
  latestNewsTitleContent.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');
  const latestNewsTitle = document.createElement('h3');
  latestNewsTitle.classList.add('front-section-title');
  latestNewsTitle.textContent = 'Latest News';
  latestNewsTitleContent.append(latestNewsTitle);
  latestNewsTitleWrapper.append(latestNewsTitleContent);
  latestNewsSection.append(latestNewsTitleWrapper);

  const latestNewsListWrapper = document.createElement('div');
  latestNewsListWrapper.classList.add('paragraph', 'paragraph--type--content-list', 'paragraph--view-mode--default');
  const latestNewsListContainer = document.createElement('div');
  latestNewsListContainer.classList.add('field', 'field--name-field-content-view', 'field--type-viewfield', 'field--label-visually_hidden');
  const latestNewsListLabel = document.createElement('div');
  latestNewsListLabel.classList.add('field__label', 'visually-hidden');
  latestNewsListLabel.textContent = 'Content View';
  const latestNewsListItemContainer = document.createElement('div');
  latestNewsListItemContainer.classList.add('field__item', 'field__item-label-hidden');
  const latestNewsViewsElementContainer = document.createElement('div');
  latestNewsViewsElementContainer.classList.add('views-element-container');
  const latestNewsView = document.createElement('div');
  latestNewsView.classList.add('view', 'view-content-article-list', 'view-id-content_article_list', 'view-display-id-thumb_title_body', 'js-view-dom-id-b9c851133ebf113e3fb8bad2e2674415ba50a11c0c24c8ce03a775a40a3aa489');
  const latestNewsViewContent = document.createElement('div');
  latestNewsViewContent.classList.add('view-content', 'row');

  const topNewsListWrapper = document.createElement('div');
  topNewsListWrapper.classList.add('paragraph', 'paragraph--type--content-list', 'paragraph--view-mode--default');
  const topNewsListContainer = document.createElement('div');
  topNewsListContainer.classList.add('field', 'field--name-field-content-view', 'field--type-viewfield', 'field--label-visually_hidden');
  const topNewsListLabel = document.createElement('div');
  topNewsListLabel.classList.add('field__label', 'visually-hidden');
  topNewsListLabel.textContent = 'Content View';
  const topNewsListItemContainer = document.createElement('div');
  topNewsListItemContainer.classList.add('field__item', 'field__item-label-hidden');
  const topNewsViewsElementContainer = document.createElement('div');
  topNewsViewsElementContainer.classList.add('views-element-container');
  const topNewsView = document.createElement('div');
  topNewsView.classList.add('view', 'view-content-article-list', 'view-id-content_article_list', 'view-display-id-block_1', 'js-view-dom-id-b66ffe6e218631f9db47c46105d8c7ef248e64009311a579cc4cdd4e33565e16');
  const topNewsViewContent = document.createElement('div');
  topNewsViewContent.classList.add('view-content', 'row');

  [...block.children].forEach((row) => {
    const cells = [...row.children];

    if (cells.length === 2) { // News-Item
      const newsItemCol = document.createElement('div');
      newsItemCol.classList.add('col-md-12', 'frontpage-sidebar-news', 'views-row');
      moveInstrumentation(row, newsItemCol);

      const titleCell = cells.find(cell => cell.querySelector('a'));
      const bodyCell = cells.find(cell => cell.querySelector('p'));

      if (titleCell) {
        const titleDiv = document.createElement('div');
        titleDiv.classList.add('views-field', 'views-field-title');
        const h4 = document.createElement('h4');
        h4.classList.add('field-content');
        const link = titleCell.querySelector('a');
        if (link) {
          const newLink = document.createElement('a');
          newLink.href = link.href;
          newLink.textContent = link.textContent;
          h4.append(newLink);
        } else {
          h4.textContent = titleCell.textContent;
        }
        titleDiv.append(h4);
        newsItemCol.append(titleDiv);
      }

      if (bodyCell) {
        const bodyDiv = document.createElement('div');
        bodyDiv.classList.add('views-field', 'views-field-body');
        const fieldContent = document.createElement('div');
        fieldContent.classList.add('field-content');
        while (bodyCell.firstChild) fieldContent.append(bodyCell.firstChild);
        bodyDiv.append(fieldContent);
        newsItemCol.append(bodyDiv);
      }

      const hrDiv = document.createElement('div');
      hrDiv.classList.add('views-field', 'views-field-nothing');
      const hrSpan = document.createElement('span');
      hrSpan.classList.add('field-content');
      hrSpan.append(document.createElement('hr'));
      newsItemCol.append(hrDiv);
    } else if (cells.length === 3) { // Top-News-Item
      const topNewsItemCol = document.createElement('div');
      topNewsItemCol.classList.add('col-md-12', 'frontpage-top-news', 'views-row');
      moveInstrumentation(row, topNewsItemCol);

      const titleCell = cells.find(cell => cell.querySelector('a'));
      const subheadingCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture'));
      const imageCell = cells.find(cell => cell.querySelector('picture'));

      if (titleCell) {
        const titleDiv = document.createElement('div');
        titleDiv.classList.add('views-field', 'views-field-title');
        const h4 = document.createElement('h4');
        h4.classList.add('field-content');
        const link = titleCell.querySelector('a');
        if (link) {
          const newLink = document.createElement('a');
          newLink.href = link.href;
          newLink.textContent = link.textContent;
          h4.append(newLink);
        } else {
          h4.textContent = titleCell.textContent;
        }
        titleDiv.append(h4);
        topNewsItemCol.append(titleDiv);
      }

      if (subheadingCell) {
        const subheadingDiv = document.createElement('div');
        subheadingDiv.classList.add('views-field', 'views-field-field-news-sub-heading');
        const h5 = document.createElement('h5');
        h5.classList.add('field-content');
        h5.textContent = subheadingCell.textContent;
        subheadingDiv.append(h5);
        topNewsItemCol.append(subheadingDiv);
      }

      if (imageCell) {
        const imageDiv = document.createElement('div');
        imageDiv.classList.add('views-field', 'views-field-field-add-media');
        const fieldContent = document.createElement('div');
        fieldContent.classList.add('field-content');
        const picture = imageCell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          if (img) {
            const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '640' }]);
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            fieldContent.append(optimizedPic);
          }
        }
        imageDiv.append(fieldContent);
        topNewsItemCol.append(imageDiv);
      }
      topNewsViewContent.append(topNewsItemCol);
    }
  });

  latestNewsView.append(latestNewsViewContent);
  latestNewsViewsElementContainer.append(latestNewsView);
  latestNewsListItemContainer.append(latestNewsViewsElementContainer);
  latestNewsListContainer.append(latestNewsListLabel, latestNewsListItemContainer);
  latestNewsListWrapper.append(latestNewsListContainer);
  latestNewsSection.append(latestNewsListWrapper);

  const moreNewsWrapper = document.createElement('div');
  moreNewsWrapper.classList.add('paragraph', 'paragraph--type--text', 'paragraph--view-mode--default');
  const moreNewsContent = document.createElement('div');
  moreNewsContent.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');
  const moreNewsP = document.createElement('p');
  moreNewsP.append(document.createElement('br'));
  const moreNewsLink = document.createElement('a');
  moreNewsLink.classList.add('btn', 'btn-primary');
  moreNewsLink.href = '/news-articles';
  const moreNewsSpan = document.createElement('span');
  moreNewsSpan.classList.add('text');
  moreNewsSpan.textContent = 'More news';
  moreNewsLink.append(moreNewsSpan);
  moreNewsP.append(moreNewsLink);
  moreNewsContent.append(moreNewsP);
  moreNewsWrapper.append(moreNewsContent);
  latestNewsSection.append(moreNewsWrapper);

  topNewsView.append(topNewsViewContent);
  topNewsViewsElementContainer.append(topNewsView);
  topNewsListItemContainer.append(topNewsViewsElementContainer);
  topNewsListContainer.append(topNewsListLabel, topNewsListItemContainer);
  topNewsListWrapper.append(topNewsListContainer);
  topNewsSection.append(topNewsListWrapper);

  const hrParagraph = document.createElement('div');
  hrParagraph.classList.add('paragraph', 'paragraph--type--text', 'paragraph--view-mode--default');
  const hrContent = document.createElement('div');
  hrContent.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');
  const hrElement = document.createElement('hr');
  hrContent.append(hrElement);
  hrParagraph.append(hrContent);
  topNewsSection.append(hrParagraph);

  const resilienceLinkParagraph = document.createElement('div');
  resilienceLinkParagraph.classList.add('paragraph', 'paragraph--type--text', 'paragraph--view-mode--default');
  const resilienceLinkContent = document.createElement('div');
  resilienceLinkContent.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');
  const resilienceLinkP = document.createElement('p');
  const resilienceLink = document.createElement('a');
  resilienceLink.classList.add('btn', 'btn-primary', 'btn-lg');
  resilienceLink.href = '/regional-resilience-partnership';

  // Extract SVG images and text from the original HTML for the resilience link
  const originalResilienceLink = block.querySelector('.field__item > .paragraph--type--text > .field__item > p > a.btn-primary.btn-lg');
  if (originalResilienceLink) {
    const originalImgs = originalResilienceLink.querySelectorAll('img');
    const originalSpan = originalResilienceLink.querySelector('span.text');

    if (originalImgs[0]) {
      const resilienceImg1 = document.createElement('img');
      resilienceImg1.alt = originalImgs[0].alt;
      resilienceImg1.src = originalImgs[0].src;
      resilienceLink.append(resilienceImg1);
    }
    if (originalSpan) {
      const resilienceSpan = document.createElement('span');
      resilienceSpan.classList.add('text');
      resilienceSpan.innerHTML = originalSpan.innerHTML;
      resilienceLink.append(resilienceSpan);
    }
    if (originalImgs[1]) {
      const resilienceImg2 = document.createElement('img');
      resilienceImg2.alt = originalImgs[1].alt;
      resilienceImg2.src = originalImgs[1].src;
      resilienceLink.append(resilienceImg2);
    }
  }

  resilienceLinkP.append(resilienceLink);
  resilienceLinkContent.append(resilienceLinkP);
  resilienceLinkParagraph.append(resilienceLinkContent);
  topNewsSection.append(resilienceLinkParagraph);

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row', 'row-pad', 'align-items-center');
  rowDiv.id = 'front-latest-news';
  rowDiv.style.padding = '70px 0 80px 0';
  rowDiv.append(latestNewsSection, topNewsSection);

  block.textContent = '';
  block.append(rowDiv);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
