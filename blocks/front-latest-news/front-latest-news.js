import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // Filter rows based on the number of children to distinguish item types
  const sidebarNewsItems = rows.filter((row) => [...row.children].length === 2);
  const topNewsItems = rows.filter((row) => [...row.children].length === 3);

  const mainRow = document.createElement('div');
  mainRow.classList.add('row', 'row-pad', 'align-items-center');
  mainRow.id = 'front-latest-news';
  mainRow.style.padding = '70px 0 80px 0';

  const col1 = document.createElement('div');
  col1.classList.add('col-md-4');

  const latestNewsTitleWrapper = document.createElement('div');
  latestNewsTitleWrapper.classList.add('paragraph', 'paragraph--type--text', 'paragraph--view-mode--default');
  const latestNewsTitleContent = document.createElement('div');
  latestNewsTitleContent.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');
  const latestNewsTitle = document.createElement('h3');
  latestNewsTitle.classList.add('front-section-title');
  latestNewsTitle.textContent = 'Latest News';
  latestNewsTitleContent.append(latestNewsTitle);
  latestNewsTitleWrapper.append(latestNewsTitleContent);
  col1.append(latestNewsTitleWrapper);

  const sidebarNewsListWrapper = document.createElement('div');
  sidebarNewsListWrapper.classList.add('paragraph', 'paragraph--type--content-list', 'paragraph--view-mode--default');
  const sidebarNewsListViewsContainer = document.createElement('div');
  sidebarNewsListViewsContainer.classList.add('field', 'field--name-field-content-view', 'field--type-viewfield', 'field--label-visually_hidden');
  const sidebarNewsListViewsItem = document.createElement('div');
  sidebarNewsListViewsItem.classList.add('field__item', 'field__item-label-hidden');
  const sidebarNewsViewsElementContainer = document.createElement('div');
  sidebarNewsViewsElementContainer.classList.add('views-element-container');
  const sidebarNewsViewContent = document.createElement('div');
  sidebarNewsViewContent.classList.add('view', 'view-content-article-list', 'view-id-content_article_list', 'view-display-id-thumb_title_body', 'js-view-dom-id-b9c851133ebf113e3fb8bad2e2674415ba50a11c0c24c8ce03a775a40a3aa489');
  const sidebarNewsRow = document.createElement('div');
  sidebarNewsRow.classList.add('view-content', 'row');

  sidebarNewsItems.forEach((row) => {
    const itemCol = document.createElement('div');
    itemCol.classList.add('col-md-12', 'frontpage-sidebar-news', 'views-row');
    moveInstrumentation(row, itemCol);

    // Use content detection instead of index access
    const cells = [...row.children];
    const titleCell = cells.find(cell => cell.querySelector('a') || cell.textContent.trim());
    const bodyCell = cells.find(cell => !cell.querySelector('a') && cell !== titleCell);

    if (titleCell) {
      const titleDiv = document.createElement('div');
      titleDiv.classList.add('views-field', 'views-field-title');
      const titleH4 = document.createElement('h4');
      titleH4.classList.add('field-content');
      const titleLink = titleCell.querySelector('a') || document.createElement('a');
      if (titleCell.querySelector('a')) {
        titleLink.href = titleCell.querySelector('a').href;
        titleLink.textContent = titleCell.querySelector('a').textContent;
      } else {
        titleLink.textContent = titleCell.textContent;
      }
      titleH4.append(titleLink);
      titleDiv.append(titleH4);
      itemCol.append(titleDiv);
    }

    if (bodyCell) {
      const bodyDiv = document.createElement('div');
      bodyDiv.classList.add('views-field', 'views-field-body');
      const bodyContent = document.createElement('div');
      bodyContent.classList.add('field-content');
      while (bodyCell.firstChild) bodyContent.append(bodyCell.firstChild);
      bodyDiv.append(bodyContent);
      itemCol.append(bodyDiv);
    }

    const hrDiv = document.createElement('div');
    hrDiv.classList.add('views-field', 'views-field-nothing');
    const hrSpan = document.createElement('span');
    hrSpan.classList.add('field-content');
    hrSpan.append(document.createElement('hr'));
    hrDiv.append(hrSpan);
    itemCol.append(hrDiv);

    sidebarNewsRow.append(itemCol);
  });

  sidebarNewsViewContent.append(sidebarNewsRow);
  sidebarNewsViewsElementContainer.append(sidebarNewsViewContent);
  sidebarNewsListViewsItem.append(sidebarNewsViewsElementContainer);
  sidebarNewsListViewsContainer.append(sidebarNewsListViewsItem);
  sidebarNewsListWrapper.append(sidebarNewsListViewsContainer);
  col1.append(sidebarNewsListWrapper);

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
  col1.append(moreNewsWrapper);

  mainRow.append(col1);

  const col2 = document.createElement('div');
  col2.classList.add('col-md-8');

  const topNewsListWrapper = document.createElement('div');
  topNewsListWrapper.classList.add('paragraph', 'paragraph--type--content-list', 'paragraph--view-mode--default');
  const topNewsListViewsContainer = document.createElement('div');
  // Corrected class name: 'field--type--viewfield' -> 'field--type-viewfield'
  topNewsListViewsContainer.classList.add('field', 'field--name-field-content-view', 'field--type-viewfield', 'field--label-visually_hidden');
  const topNewsListViewsItem = document.createElement('div');
  topNewsListViewsItem.classList.add('field__item', 'field__item-label-hidden');
  const topNewsViewsElementContainer = document.createElement('div');
  topNewsViewsElementContainer.classList.add('views-element-container');
  const topNewsViewContent = document.createElement('div');
  topNewsViewContent.classList.add('view', 'view-content-article-list', 'view-id-content_article_list', 'view-display-id-block_1', 'js-view-dom-id-b66ffe6e218631f9db47c46105d8c7ef248e64009311a579cc4cdd4e33565e16');
  const topNewsRow = document.createElement('div');
  topNewsRow.classList.add('view-content', 'row');

  topNewsItems.forEach((row) => {
    const itemCol = document.createElement('div');
    itemCol.classList.add('col-md-12', 'frontpage-top-news', 'views-row');
    moveInstrumentation(row, itemCol);

    // Use content detection instead of index access
    const cells = [...row.children];
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const titleCell = cells.find(cell => cell.querySelector('a') || (cell.textContent.trim() && cell !== imageCell));
    const subheadingCell = cells.find(cell => cell !== titleCell && cell !== imageCell);


    if (titleCell) {
      const titleDiv = document.createElement('div');
      titleDiv.classList.add('views-field', 'views-field-title');
      const titleH4 = document.createElement('h4');
      titleH4.classList.add('field-content');
      const titleLink = titleCell.querySelector('a') || document.createElement('a');
      if (titleCell.querySelector('a')) {
        titleLink.href = titleCell.querySelector('a').href;
        titleLink.textContent = titleCell.querySelector('a').textContent;
      } else {
        titleLink.textContent = titleCell.textContent;
      }
      titleH4.append(titleLink);
      titleDiv.append(titleH4);
      itemCol.append(titleDiv);
    }

    if (subheadingCell) {
      const subheadingDiv = document.createElement('div');
      subheadingDiv.classList.add('views-field', 'views-field-field-news-sub-heading');
      const subheadingH5 = document.createElement('h5');
      subheadingH5.classList.add('field-content');
      while (subheadingCell.firstChild) subheadingH5.append(subheadingCell.firstChild);
      subheadingDiv.append(subheadingH5);
      itemCol.append(subheadingDiv);
    }

    if (imageCell) {
      const imageDiv = document.createElement('div');
      imageDiv.classList.add('views-field', 'views-field-field-add-media');
      const imageContent = document.createElement('div');
      imageContent.classList.add('field-content');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '640' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          imageContent.append(optimizedPic);
        }
      }
      imageDiv.append(imageContent);
      itemCol.append(imageDiv);
    }

    topNewsRow.append(itemCol);
  });

  topNewsViewContent.append(topNewsRow);
  topNewsViewsElementContainer.append(topNewsViewContent);
  topNewsListViewsItem.append(topNewsViewsElementContainer);
  topNewsListViewsContainer.append(topNewsListViewsItem);
  topNewsListWrapper.append(topNewsListViewsContainer);
  col2.append(topNewsListWrapper);

  const resilienceLinkWrapper = document.createElement('div');
  resilienceLinkWrapper.classList.add('paragraph', 'paragraph--type--text', 'paragraph--view-mode--default');
  const resilienceLinkContent = document.createElement('div');
  resilienceLinkContent.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');
  const resilienceHr = document.createElement('hr');
  const resilienceP = document.createElement('p');
  const resilienceLink = document.createElement('a');
  resilienceLink.classList.add('btn', 'btn-primary', 'btn-lg');
  resilienceLink.href = '/regional-resilience-partnership';

  const svg1 = document.createElement('img');
  svg1.alt = 'svg file';
  svg1.src = '/content/dam/aemigrate/uploaded-folder/image/1775128048844.svg+xml';
  resilienceLink.append(svg1);

  const resilienceSpan = document.createElement('span');
  resilienceSpan.classList.add('text');
  resilienceSpan.textContent = '  Click to go to the Regional Resilience Partnership  ';
  resilienceLink.append(resilienceSpan);

  const svg2 = document.createElement('img');
  svg2.alt = 'svg file';
  svg2.src = '/content/dam/aemigrate/uploaded-folder/image/1775128048934.svg+xml';
  resilienceLink.append(svg2);

  resilienceP.append(resilienceLink);
  resilienceLinkContent.append(resilienceHr, resilienceP);
  resilienceLinkWrapper.append(resilienceLinkContent);
  col2.append(resilienceLinkWrapper);

  mainRow.append(col2);

  block.textContent = '';
  block.append(mainRow);
}
