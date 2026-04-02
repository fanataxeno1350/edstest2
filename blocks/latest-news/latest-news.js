import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [sectionTitleRow, moreNewsLinkRow, partnershipLinkRow, ...itemRows] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('container', 'advanced-widget-vertical-center');

  const rowPad = document.createElement('div');
  rowPad.classList.add('row', 'row-pad', 'align-items-center');
  rowPad.id = 'front-latest-news';
  rowPad.style.padding = '70px 0 80px 0';

  const colMd4 = document.createElement('div');
  colMd4.classList.add('col-md-4');

  const colMd8 = document.createElement('div');
  colMd8.classList.add('col-md-8');

  // Section Title
  if (sectionTitleRow) {
    const titleWrapper = document.createElement('div');
    titleWrapper.classList.add('field', 'field--name-field-column-1-widgets', 'field--type-entity-reference-revisions', 'field--label-hidden', 'field__item');
    const paragraphColumnContent = document.createElement('div');
    paragraphColumnContent.classList.add('paragraph', 'paragraph--type--column-content', 'paragraph--view-mode--default');
    const fieldColumnContent = document.createElement('div');
    fieldColumnContent.classList.add('field', 'field--name-field-column-content', 'field--type-entity-reference-revisions', 'field--label-hidden', 'field__items');
    const fieldItem = document.createElement('div');
    fieldItem.classList.add('field__item');
    const paragraphText = document.createElement('div');
    paragraphText.classList.add('paragraph', 'paragraph--type--text', 'paragraph--view-mode--default');
    const clearfix = document.createElement('div');
    clearfix.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');
    const h3 = document.createElement('h3');
    h3.classList.add('front-section-title');

    // CRITICAL FIX: Replaced direct children[0] access with content detection
    const sectionTitleContent = [...sectionTitleRow.children].find(cell => cell.querySelector('p'));
    if (sectionTitleContent) {
      moveInstrumentation(sectionTitleContent, h3);
      h3.append(...sectionTitleContent.children);
    }
    
    clearfix.append(h3);
    paragraphText.append(clearfix);
    fieldItem.append(paragraphText);
    fieldColumnContent.append(fieldItem);
    paragraphColumnContent.append(fieldColumnContent);
    titleWrapper.append(paragraphColumnContent);
    colMd4.append(titleWrapper);
  }

  // Sidebar News (news-item)
  const sidebarNewsItems = itemRows.filter((row) => row.children.length === 2);
  if (sidebarNewsItems.length > 0) {
    const sidebarWrapper = document.createElement('div');
    sidebarWrapper.classList.add('field__item');
    const paragraphContentList = document.createElement('div');
    paragraphContentList.classList.add('paragraph', 'paragraph--type--content-list', 'paragraph--view-mode--default');
    const fieldContentView = document.createElement('div');
    fieldContentView.classList.add('field', 'field--name-field-content-view', 'field--type-viewfield', 'field--label-visually_hidden');
    const fieldLabel = document.createElement('div');
    fieldLabel.classList.add('field__label', 'visually-hidden');
    fieldLabel.textContent = 'Content View';
    const fieldItemLabelHidden = document.createElement('div');
    fieldItemLabelHidden.classList.add('field__item', 'field__item-label-hidden');
    const viewsElementContainer = document.createElement('div');
    viewsElementContainer.classList.add('views-element-container');
    const viewContentArticleList = document.createElement('div');
    viewContentArticleList.classList.add('view', 'view-content-article-list', 'view-id-content_article_list', 'view-display-id-thumb_title_body');
    const viewContentRow = document.createElement('div');
    viewContentRow.classList.add('view-content', 'row');

    sidebarNewsItems.forEach((row) => {
      const newsItemCol = document.createElement('div');
      newsItemCol.classList.add('col-md-12', 'frontpage-sidebar-news', 'views-row');

      const titleCell = [...row.children].find((cell) => cell.querySelector('a'));
      const bodyCell = [...row.children].find((cell) => !cell.querySelector('a'));

      if (titleCell) {
        const viewsFieldTitle = document.createElement('div');
        viewsFieldTitle.classList.add('views-field', 'views-field-title');
        const h4 = document.createElement('h4');
        h4.classList.add('field-content');
        const link = document.createElement('a');
        const foundLink = titleCell.querySelector('a');
        if (foundLink) {
          link.href = foundLink.href;
          link.textContent = foundLink.textContent;
        }
        moveInstrumentation(titleCell, link);
        h4.append(link);
        viewsFieldTitle.append(h4);
        newsItemCol.append(viewsFieldTitle);
      }

      if (bodyCell) {
        const viewsFieldBody = document.createElement('div');
        viewsFieldBody.classList.add('views-field', 'views-field-body');
        const fieldContentBody = document.createElement('div');
        fieldContentBody.classList.add('field-content');
        moveInstrumentation(bodyCell, fieldContentBody);
        fieldContentBody.append(...bodyCell.children);
        viewsFieldBody.append(fieldContentBody);
        newsItemCol.append(viewsFieldBody);
      }

      const viewsFieldNothing = document.createElement('div');
      viewsFieldNothing.classList.add('views-field', 'views-field-nothing');
      const hr = document.createElement('hr');
      viewsFieldNothing.append(hr);
      newsItemCol.append(viewsFieldNothing);

      viewContentRow.append(newsItemCol);
    });

    viewContentArticleList.append(viewContentRow);
    viewsElementContainer.append(viewContentArticleList);
    fieldItemLabelHidden.append(viewsElementContainer);
    fieldContentView.append(fieldLabel, fieldItemLabelHidden);
    paragraphContentList.append(fieldContentView);
    sidebarWrapper.append(paragraphContentList);
    colMd4.querySelector('.field--name-field-column-content').append(sidebarWrapper);
  }

  // More News Link
  if (moreNewsLinkRow) {
    const moreNewsWrapper = document.createElement('div');
    moreNewsWrapper.classList.add('field__item');
    const paragraphText = document.createElement('div');
    paragraphText.classList.add('paragraph', 'paragraph--type--text', 'paragraph--view-mode--default');
    const clearfix = document.createElement('div');
    clearfix.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');
    const br = document.createElement('br');
    const moreNewsLink = document.createElement('a');
    moreNewsLink.classList.add('btn', 'btn-primary');
    const spanText = document.createElement('span');
    spanText.classList.add('text');
    const foundLink = moreNewsLinkRow.querySelector('a');
    if (foundLink) {
      moreNewsLink.href = foundLink.href;
      spanText.textContent = foundLink.textContent;
    }
    moveInstrumentation(moreNewsLinkRow, moreNewsLink);
    moreNewsLink.append(spanText);
    clearfix.append(br, moreNewsLink);
    paragraphText.append(clearfix);
    moreNewsWrapper.append(paragraphText);
    colMd4.querySelector('.field--name-field-column-content').append(moreNewsWrapper);
  }

  // Top News (top-news-item)
  const topNewsItems = itemRows.filter((row) => row.children.length === 3);
  if (topNewsItems.length > 0) {
    const topNewsWrapper = document.createElement('div');
    topNewsWrapper.classList.add('field', 'field--name-field-column-2-widgets', 'field--type-entity-reference-revisions', 'field--label-hidden', 'field__item');
    const paragraphColumnContent = document.createElement('div');
    paragraphColumnContent.classList.add('paragraph', 'paragraph--type--column-content', 'paragraph--view-mode--default');
    const fieldColumnContent = document.createElement('div');
    fieldColumnContent.classList.add('field', 'field--name-field-column-content', 'field--type-entity-reference-revisions', 'field--label-hidden', 'field__items');
    const fieldItem = document.createElement('div');
    fieldItem.classList.add('field__item');
    const paragraphContentList = document.createElement('div');
    paragraphContentList.classList.add('paragraph', 'paragraph--type--content-list', 'paragraph--view-mode--default');
    const fieldContentView = document.createElement('div');
    fieldContentView.classList.add('field', 'field--name-field-content-view', 'field--type-viewfield', 'field--label-visually_hidden');
    const fieldLabel = document.createElement('div');
    fieldLabel.classList.add('field__label', 'visually-hidden');
    fieldLabel.textContent = 'Content View';
    const fieldItemLabelHidden = document.createElement('div');
    fieldItemLabelHidden.classList.add('field__item', 'field__item-label-hidden');
    const viewsElementContainer = document.createElement('div');
    viewsElementContainer.classList.add('views-element-container');
    const viewContentArticleList = document.createElement('div');
    viewContentArticleList.classList.add('view', 'view-content-article-list', 'view-id-content_article_list', 'view-display-id-block_1');
    const viewContentRow = document.createElement('div');
    viewContentRow.classList.add('view-content', 'row');

    topNewsItems.forEach((row) => {
      const newsItemCol = document.createElement('div');
      newsItemCol.classList.add('col-md-12', 'frontpage-top-news', 'views-row');

      const titleCell = [...row.children].find((cell) => cell.querySelector('a'));
      const subHeadingCell = [...row.children].find((cell) => !cell.querySelector('a') && !cell.querySelector('picture'));
      const imageCell = [...row.children].find((cell) => cell.querySelector('picture'));

      if (titleCell) {
        const viewsFieldTitle = document.createElement('div');
        viewsFieldTitle.classList.add('views-field', 'views-field-title');
        const h4 = document.createElement('h4');
        h4.classList.add('field-content');
        const link = document.createElement('a');
        const foundLink = titleCell.querySelector('a');
        if (foundLink) {
          link.href = foundLink.href;
          link.textContent = foundLink.textContent;
        }
        moveInstrumentation(titleCell, link);
        h4.append(link);
        viewsFieldTitle.append(h4);
        newsItemCol.append(viewsFieldTitle);
      }

      if (subHeadingCell) {
        const viewsFieldSubHeading = document.createElement('div');
        viewsFieldSubHeading.classList.add('views-field', 'views-field-field-news-sub-heading');
        const h5 = document.createElement('h5');
        h5.classList.add('field-content');
        moveInstrumentation(subHeadingCell, h5);
        h5.append(...subHeadingCell.children);
        viewsFieldSubHeading.append(h5);
        newsItemCol.append(viewsFieldSubHeading);
      }

      if (imageCell) {
        const viewsFieldAddMedia = document.createElement('div');
        viewsFieldAddMedia.classList.add('views-field', 'views-field-field-add-media');
        const fieldContentImage = document.createElement('div');
        fieldContentImage.classList.add('field-content');
        const picture = imageCell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          if (img) {
            const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '640' }]);
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            fieldContentImage.append(optimizedPic);
          }
        }
        viewsFieldAddMedia.append(fieldContentImage);
        newsItemCol.append(viewsFieldAddMedia);
      }

      viewContentRow.append(newsItemCol);
    });

    viewContentArticleList.append(viewContentRow);
    viewsElementContainer.append(viewContentArticleList);
    fieldItemLabelHidden.append(viewsElementContainer);
    fieldContentView.append(fieldLabel, fieldItemLabelHidden);
    paragraphContentList.append(fieldContentView);
    fieldItem.append(paragraphContentList);
    fieldColumnContent.append(fieldItem);
    paragraphColumnContent.append(fieldColumnContent);
    topNewsWrapper.append(paragraphColumnContent);
    colMd8.append(topNewsWrapper);
  }

  // Regional Resilience Partnership Link
  if (partnershipLinkRow) {
    const partnershipWrapper = document.createElement('div');
    partnershipWrapper.classList.add('field__item');
    const paragraphText = document.createElement('div');
    paragraphText.classList.add('paragraph', 'paragraph--type--text', 'paragraph--view-mode--default');
    const clearfix = document.createElement('div');
    clearfix.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');
    const hr = document.createElement('hr');
    const partnershipLink = document.createElement('a');
    partnershipLink.classList.add('btn', 'btn-primary', 'btn-lg');
    const foundLink = partnershipLinkRow.querySelector('a');
    if (foundLink) {
      partnershipLink.href = foundLink.href;
      const spanText = document.createElement('span');
      spanText.classList.add('text');
      spanText.innerHTML = `&nbsp;&nbsp;${foundLink.textContent}&nbsp;&nbsp;`;
      partnershipLink.append(spanText);
    }
    moveInstrumentation(partnershipLinkRow, partnershipLink);
    clearfix.append(hr, partnershipLink);
    paragraphText.append(clearfix);
    partnershipWrapper.append(paragraphText);
    colMd8.querySelector('.field--name-field-column-content').append(partnershipWrapper);
  }

  rowPad.append(colMd4, colMd8);
  container.append(rowPad);

  block.textContent = '';
  block.append(container);
}
