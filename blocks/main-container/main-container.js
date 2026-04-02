import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    bannerHeadingRow,
    bannerVideoPosterRow,
    bannerVideoSrcRow,
    ...itemRows
  ] = [...block.children];

  // Banner Section
  const frontWebBanner = document.createElement('div');
  frontWebBanner.classList.add('slide-lightgray', 'container-fluid', 'advanced-widget-row-no-pad');
  frontWebBanner.id = 'front-web-banner-wrapper';

  const frontWebBannerContentLayout = document.createElement('div');
  frontWebBannerContentLayout.classList.add('field', 'field--name-field-content-layout', 'field--type-entity-reference-revisions', 'field--label-hidden', 'field__item');
  frontWebBanner.append(frontWebBannerContentLayout);

  const contentFrontWebBanner = document.createElement('div');
  contentFrontWebBanner.classList.add('row', 'row-pad', 'container-fluid');
  contentFrontWebBanner.id = 'content-front-web-banner';
  contentFrontWebBanner.style.padding = '0px 0 0px 0'; // Inline style from original HTML
  frontWebBannerContentLayout.append(contentFrontWebBanner);

  const colMd12 = document.createElement('div');
  colMd12.classList.add('col-md-12');
  contentFrontWebBanner.append(colMd12);

  const column1Widgets = document.createElement('div');
  column1Widgets.classList.add('field', 'field--name-field-column-1-widgets', 'field--type-entity-reference-revisions', 'field--label-hidden', 'field__item');
  colMd12.append(column1Widgets);

  const columnContentParagraph = document.createElement('div');
  columnContentParagraph.classList.add('paragraph', 'paragraph--type--column-content', 'paragraph--view-mode--default');
  column1Widgets.append(columnContentParagraph);

  const columnContentField = document.createElement('div');
  columnContentField.classList.add('field', 'field--name-field-column-content', 'field--type-entity-reference-revisions', 'field--label-hidden', 'field__items');
  columnContentParagraph.append(columnContentField);

  const columnContentItem = document.createElement('div');
  columnContentItem.classList.add('field__item');
  columnContentField.append(columnContentItem);

  const textParagraph = document.createElement('div');
  textParagraph.classList.add('paragraph', 'paragraph--type--text', 'paragraph--view-mode--default');
  columnContentItem.append(textParagraph);

  const longtextField = document.createElement('div');
  longtextField.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');
  textParagraph.append(longtextField);

  const frontWebBannerDiv = document.createElement('div');
  frontWebBannerDiv.id = 'front-web-banner';
  longtextField.append(frontWebBannerDiv);

  const frontWebBannerContentWrapper = document.createElement('div');
  frontWebBannerContentWrapper.classList.add('text-align-center');
  frontWebBannerContentWrapper.id = 'front-web-banner-content-wrapper';
  frontWebBannerDiv.append(frontWebBannerContentWrapper);

  const frontWebBannerContentCaption = document.createElement('div');
  frontWebBannerContentCaption.id = 'front-web-banner-content-caption';
  frontWebBannerContentWrapper.append(frontWebBannerContentCaption);

  const h2 = document.createElement('h2');
  h2.id = 'front-web-banner-content';
  moveInstrumentation(bannerHeadingRow, h2);
  // Use content detection instead of children[n]
  const bannerHeadingContent = bannerHeadingRow.querySelector('div');
  if (bannerHeadingContent) {
    h2.append(...bannerHeadingContent.children);
  }
  frontWebBannerContentCaption.append(h2);

  const video = document.createElement('video');
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.preload = 'metadata';

  const posterPicture = bannerVideoPosterRow.querySelector('picture');
  if (posterPicture) {
    const posterImg = posterPicture.querySelector('img');
    if (posterImg) {
      video.poster = posterImg.src;
    }
  }

  const source = document.createElement('source');
  const srcPicture = bannerVideoSrcRow.querySelector('picture');
  if (srcPicture) {
    const srcImg = srcPicture.querySelector('img');
    if (srcImg) {
      source.src = srcImg.src;
      source.type = 'video/mp4'; // Assuming mp4 from original HTML
    }
  }
  video.append(source);
  frontWebBannerDiv.append(video);
  moveInstrumentation(bannerVideoPosterRow, video);
  moveInstrumentation(bannerVideoSrcRow, video);


  // Latest News Section
  const container = document.createElement('div');
  container.classList.add('container', 'advanced-widget-vertical-center'); // Changed from container-fluid to container based on original HTML

  const contentLayout = document.createElement('div');
  contentLayout.classList.add('field', 'field--name-field-content-layout', 'field--type-entity-reference-revisions', 'field--label-hidden', 'field__item');
  container.append(contentLayout);

  const rowPad = document.createElement('div');
  rowPad.classList.add('row', 'row-pad', 'align-items-center');
  rowPad.id = 'front-latest-news';
  rowPad.style.padding = '70px 0 80px 0'; // Inline style from original HTML
  contentLayout.append(rowPad);

  const colMd4 = document.createElement('div');
  colMd4.classList.add('col-md-4');
  rowPad.append(colMd4);

  const column1WidgetsNews = document.createElement('div');
  column1WidgetsNews.classList.add('field', 'field--name-field-column-1-widgets', 'field--type-entity-reference-revisions', 'field--label-hidden', 'field__item');
  colMd4.append(column1WidgetsNews);

  const columnContentParagraphNews = document.createElement('div');
  columnContentParagraphNews.classList.add('paragraph', 'paragraph--type--column-content', 'paragraph--view-mode--default');
  column1WidgetsNews.append(columnContentParagraphNews);

  const columnContentFieldNews = document.createElement('div');
  columnContentFieldNews.classList.add('field', 'field--name-field-column-content', 'field--type-entity-reference-revisions', 'field--label-hidden', 'field__items');
  columnContentParagraphNews.append(columnContentFieldNews);

  const h3Item = document.createElement('div');
  h3Item.classList.add('field__item');
  columnContentFieldNews.append(h3Item);

  const h3Paragraph = document.createElement('div');
  h3Paragraph.classList.add('paragraph', 'paragraph--type--text', 'paragraph--view-mode--default');
  h3Item.append(h3Paragraph);

  const h3Longtext = document.createElement('div');
  h3Longtext.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');
  h3Longtext.innerHTML = '<h3 class="front-section-title">Latest News</h3>';
  h3Paragraph.append(h3Longtext);

  const sidebarNewsItemsContainer = document.createElement('div');
  sidebarNewsItemsContainer.classList.add('field__item');
  columnContentFieldNews.append(sidebarNewsItemsContainer);

  const contentListParagraph = document.createElement('div');
  contentListParagraph.classList.add('paragraph', 'paragraph--type--content-list', 'paragraph--view-mode--default');
  sidebarNewsItemsContainer.append(contentListParagraph);

  const contentViewField = document.createElement('div');
  contentViewField.classList.add('field', 'field--name-field-content-view', 'field--type--viewfield', 'field--label-visually_hidden');
  contentListParagraph.append(contentViewField);

  const fieldLabel = document.createElement('div');
  fieldLabel.classList.add('field__label', 'visually-hidden');
  fieldLabel.textContent = 'Content View';
  contentViewField.append(fieldLabel);

  const fieldItemLabelHidden = document.createElement('div');
  fieldItemLabelHidden.classList.add('field__item', 'field__item-label-hidden');
  contentViewField.append(fieldItemLabelHidden);

  const viewsElementContainer = document.createElement('div');
  viewsElementContainer.classList.add('views-element-container');
  fieldItemLabelHidden.append(viewsElementContainer);

  const viewContentArticleList = document.createElement('div');
  viewContentArticleList.classList.add('view', 'view-content-article-list', 'view-id-content_article_list', 'view-display-id-thumb_title_body', 'js-view-dom-id-b9c851133ebf113e3fb8bad2e2674415ba50a11c0c24c8ce03a775a40a3aa489');
  viewsElementContainer.append(viewContentArticleList);

  const viewContentRow = document.createElement('div');
  viewContentRow.classList.add('view-content', 'row');
  viewContentArticleList.append(viewContentRow);

  const sidebarNewsItems = itemRows.filter(row => row.children.length === 2);
  const topNewsItems = itemRows.filter(row => row.children.length === 3);

  sidebarNewsItems.forEach((row) => {
    const colMd12News = document.createElement('div');
    colMd12News.classList.add('col-md-12', 'frontpage-sidebar-news', 'views-row');
    moveInstrumentation(row, colMd12News);

    const cells = [...row.children];
    const titleLinkCell = cells.find(cell => cell.querySelector('a'));
    const bodyCell = cells.find(cell => !cell.querySelector('a')); // Assuming body cell doesn't contain a link

    if (titleLinkCell) {
      const viewsFieldTitle = document.createElement('div');
      viewsFieldTitle.classList.add('views-field', 'views-field-title');
      const h4 = document.createElement('h4');
      h4.classList.add('field-content');
      const link = titleLinkCell.querySelector('a');
      if (link) {
        const newLink = document.createElement('a');
        newLink.href = link.href;
        newLink.textContent = link.textContent;
        h4.append(newLink);
      } else {
        h4.append(...titleLinkCell.children);
      }
      viewsFieldTitle.append(h4);
      colMd12News.append(viewsFieldTitle);
    }

    if (bodyCell) {
      const viewsFieldBody = document.createElement('div');
      viewsFieldBody.classList.add('views-field', 'views-field-body');
      const fieldContentBody = document.createElement('div');
      fieldContentBody.classList.add('field-content');
      fieldContentBody.append(...bodyCell.children);
      viewsFieldBody.append(fieldContentBody);
      colMd12News.append(viewsFieldBody);
    }

    const viewsFieldNothing = document.createElement('div');
    viewsFieldNothing.classList.add('views-field', 'views-field-nothing');
    viewsFieldNothing.innerHTML = '<span class="field-content"><hr></span>';
    colMd12News.append(viewsFieldNothing);

    viewContentRow.append(colMd12News);
  });

  const moreNewsItem = document.createElement('div');
  moreNewsItem.classList.add('field__item');
  columnContentFieldNews.append(moreNewsItem);

  const moreNewsParagraph = document.createElement('div');
  moreNewsParagraph.classList.add('paragraph', 'paragraph--type--text', 'paragraph--view-mode--default');
  moreNewsItem.append(moreNewsParagraph);

  const moreNewsLongtext = document.createElement('div');
  moreNewsLongtext.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');
  moreNewsLongtext.innerHTML = '<p><br><a class="btn btn-primary" href="/news-articles"><span class="text">More news</span></a></p>';
  moreNewsParagraph.append(moreNewsLongtext);

  // Add event listener for "More news" button
  const moreNewsButton = moreNewsLongtext.querySelector('a.btn-primary');
  if (moreNewsButton) {
    moreNewsButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = moreNewsButton.href;
    });
  }

  const colMd8 = document.createElement('div');
  colMd8.classList.add('col-md-8');
  rowPad.append(colMd8);

  const column2Widgets = document.createElement('div');
  column2Widgets.classList.add('field', 'field--name-field-column-2-widgets', 'field--type-entity-reference-revisions', 'field--label-hidden', 'field__item');
  colMd8.append(column2Widgets);

  const columnContentParagraph2 = document.createElement('div');
  columnContentParagraph2.classList.add('paragraph', 'paragraph--type--column-content', 'paragraph--view-mode--default');
  column2Widgets.append(columnContentParagraph2);

  const columnContentField2 = document.createElement('div');
  columnContentField2.classList.add('field', 'field--name-field-column-content', 'field--type-entity-reference-revisions', 'field--label-hidden', 'field__items');
  columnContentParagraph2.append(columnContentField2);

  const topNewsItemContainer = document.createElement('div');
  topNewsItemContainer.classList.add('field__item');
  columnContentField2.append(topNewsItemContainer);

  const contentListParagraph2 = document.createElement('div');
  contentListParagraph2.classList.add('paragraph', 'paragraph--type--content-list', 'paragraph--view-mode--default');
  topNewsItemContainer.append(contentListParagraph2);

  const contentViewField2 = document.createElement('div');
  contentViewField2.classList.add('field', 'field--name-field-content-view', 'field--type--viewfield', 'field--label-visually_hidden');
  contentListParagraph2.append(contentViewField2);

  const fieldLabel2 = document.createElement('div');
  fieldLabel2.classList.add('field__label', 'visually-hidden');
  fieldLabel2.textContent = 'Content View';
  contentViewField2.append(fieldLabel2);

  const fieldItemLabelHidden2 = document.createElement('div');
  fieldItemLabelHidden2.classList.add('field__item', 'field__item-label-hidden');
  contentViewField2.append(fieldItemLabelHidden2);

  const viewsElementContainer2 = document.createElement('div');
  viewsElementContainer2.classList.add('views-element-container');
  fieldItemLabelHidden2.append(viewsElementContainer2);

  const viewContentArticleList2 = document.createElement('div');
  viewContentArticleList2.classList.add('view', 'view-content-article-list', 'view-id-content_article_list', 'view-display-id-block_1', 'js-view-dom-id-b66ffe6e218631f9db47c46105d8c7ef248e64009311a579cc4cdd4e33565e16');
  viewsElementContainer2.append(viewContentArticleList2);

  const viewContentRow2 = document.createElement('div');
  viewContentRow2.classList.add('view-content', 'row');
  viewContentArticleList2.append(viewContentRow2);

  topNewsItems.forEach((row) => {
    const colMd12TopNews = document.createElement('div');
    colMd12TopNews.classList.add('col-md-12', 'frontpage-top-news', 'views-row');
    moveInstrumentation(row, colMd12TopNews);

    const cells = [...row.children];
    const titleLinkCell = cells.find(cell => cell.querySelector('a'));
    const subHeadingCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture'));
    const mediaImageCell = cells.find(cell => cell.querySelector('picture'));

    if (titleLinkCell) {
      const viewsFieldTitle = document.createElement('div');
      viewsFieldTitle.classList.add('views-field', 'views-field-title');
      const h4 = document.createElement('h4');
      h4.classList.add('field-content');
      const link = titleLinkCell.querySelector('a');
      if (link) {
        const newLink = document.createElement('a');
        newLink.href = link.href;
        newLink.textContent = link.textContent;
        h4.append(newLink);
      } else {
        h4.append(...titleLinkCell.children);
      }
      viewsFieldTitle.append(h4);
      colMd12TopNews.append(viewsFieldTitle);
    }

    if (subHeadingCell) {
      const viewsFieldSubHeading = document.createElement('div');
      viewsFieldSubHeading.classList.add('views-field', 'views-field-field-news-sub-heading');
      const h5 = document.createElement('h5');
      h5.classList.add('field-content');
      h5.append(...subHeadingCell.children);
      viewsFieldSubHeading.append(h5);
      colMd12TopNews.append(viewsFieldSubHeading);
    }

    if (mediaImageCell) {
      const viewsFieldMedia = document.createElement('div');
      viewsFieldMedia.classList.add('views-field', 'views-field-field-add-media');
      const fieldContentMedia = document.createElement('div');
      fieldContentMedia.classList.add('field-content');
      const picture = mediaImageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '640' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          fieldContentMedia.append(optimizedPic);
        }
      }
      viewsFieldMedia.append(fieldContentMedia);
      colMd12TopNews.append(viewsFieldMedia);
    }
    viewContentRow2.append(colMd12TopNews);
  });

  const btnItem = document.createElement('div');
  btnItem.classList.add('field__item');
  columnContentField2.append(btnItem);

  const btnParagraph = document.createElement('div');
  btnParagraph.classList.add('paragraph', 'paragraph--type--text', 'paragraph--view-mode--default');
  btnItem.append(btnParagraph);

  const btnLongtext = document.createElement('div');
  btnLongtext.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');
  btnLongtext.innerHTML = '<hr><p><a class="btn btn-primary btn-lg" href="/regional-resilience-partnership"><img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1775128048844.svg+xml"><!-- <span class="fa-hand-point-right fas">&nbsp;</span> --><span class="text">&nbsp;&nbsp;Click to go to the Regional Resilience Partnership&nbsp;&nbsp;</span><img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1775128048934.svg+xml"><!-- <span class="fa-hand-point-left fas">&nbsp;</span> --></a></p>';
  btnParagraph.append(btnLongtext);

  // Add event listener for the "Regional Resilience Partnership" button
  const regionalResilienceButton = btnLongtext.querySelector('a.btn-primary');
  if (regionalResilienceButton) {
    regionalResilienceButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = regionalResilienceButton.href;
    });
  }

  block.textContent = '';
  block.append(frontWebBanner, container);
}
