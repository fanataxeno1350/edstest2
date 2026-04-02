import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('node__content', 'clearfix');

  [...block.children].forEach((row) => {
    // Each row in the block.children corresponds to a 'landing-page-row' item,
    // which has a single 'content' field (richtext).
    // So, we expect each 'row' to contain a single cell with the content.
    const cells = [...row.children];
    const contentCell = cells[0]; // Accessing the first (and only) cell for 'content' field.

    const fieldItem = document.createElement('div');
    moveInstrumentation(row, fieldItem);
    fieldItem.classList.add('field__item');

    const contentWrapper = document.createElement('div');
    // The original HTML shows multiple patterns for this wrapper,
    // e.g., 'slide-lightgray container-fluid advanced-widget-row-no-pad'
    // or 'container-fluid advanced-widget-row-no-pad advanced-widget-vertical-center'
    // or 'container advanced-widget-vertical-center'.
    // We need to determine which pattern applies based on the content.
    // For simplicity, let's assume the first pattern for now, and adjust if needed
    // based on specific content within the contentCell.
    // The current JS structure seems to align with the first example in the HTML.
    contentWrapper.classList.add('slide-lightgray', 'container-fluid', 'advanced-widget-row-no-pad');

    // Check if the contentCell contains a video, which indicates the 'front-web-banner-wrapper' structure
    const videoInContent = contentCell.querySelector('video');
    if (videoInContent) {
      contentWrapper.id = 'front-web-banner-wrapper';
      contentWrapper.style.cssText = ''; // No inline style needed here, it's on the row-pad below
    } else if (contentCell.querySelector('h3 a img')) { // Check for the call-to-action pattern
      contentWrapper.classList.remove('slide-lightgray');
      contentWrapper.classList.add('advanced-widget-vertical-center');
      contentWrapper.id = 'call-to-act-front';
      contentWrapper.style.cssText = '';
    } else if (contentCell.querySelector('.front-section-title')) { // Check for latest news pattern
      contentWrapper.classList.remove('slide-lightgray', 'container-fluid', 'advanced-widget-row-no-pad');
      contentWrapper.classList.add('container', 'advanced-widget-vertical-center');
      contentWrapper.style.cssText = '';
    }


    const contentLayoutField = document.createElement('div');
    contentLayoutField.classList.add('field', 'field--name-field-content-layout', 'field--type-entity-reference-revisions', 'field--label-hidden', 'field__item');

    const rowPad = document.createElement('div');
    rowPad.classList.add('row', 'row-pad', 'container-fluid');
    rowPad.style.cssText = 'padding: 0px 0 0px 0;'; // Default, will be overridden if specific patterns are detected

    if (videoInContent) {
      rowPad.id = 'content-front-web-banner';
    } else if (contentCell.querySelector('h3 a img')) { // Call to action
      rowPad.classList.remove('container-fluid');
      rowPad.id = 'call-to-action';
    } else if (contentCell.querySelector('.front-section-title')) { // Latest News
      rowPad.classList.remove('container-fluid');
      rowPad.classList.add('align-items-center');
      rowPad.id = 'front-latest-news';
      rowPad.style.cssText = 'padding: 70px 0 80px 0;';
    }


    const col = document.createElement('div');
    col.classList.add('col-md-12'); // Default, will be overridden for multi-column layouts

    const columnWidgetsField = document.createElement('div');
    columnWidgetsField.classList.add('field', 'field--name-field-column-1-widgets', 'field--type-entity-reference-revisions', 'field--label-hidden', 'field__item');

    const paragraphColumnContent = document.createElement('div');
    paragraphColumnContent.classList.add('paragraph', 'paragraph--type--column-content', 'paragraph--view-mode--default');

    const columnContentField = document.createElement('div');
    columnContentField.classList.add('field', 'field--name-field-column-content', 'field--type-entity-reference-revisions', 'field--label-hidden', 'field__items');

    const paragraphText = document.createElement('div');
    paragraphText.classList.add('field__item');

    const paragraphTextContent = document.createElement('div');
    paragraphTextContent.classList.add('paragraph', 'paragraph--type--text', 'paragraph--view-mode--default');

    const formattedText = document.createElement('div');
    formattedText.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');

    // Move content from the original contentCell to the new structure
    while (contentCell.firstChild) {
      formattedText.append(contentCell.firstChild);
    }

    // Check for video and wrap if present (this logic is specific to the first row/banner)
    const video = formattedText.querySelector('video');
    if (video) {
      const videoWrapper = document.createElement('div');
      videoWrapper.id = 'front-web-banner';
      const videoContentWrapper = document.createElement('div');
      videoContentWrapper.classList.add('text-align-center');
      videoContentWrapper.id = 'front-web-banner-content-wrapper';
      const videoContentCaption = document.createElement('div');
      videoContentCaption.id = 'front-web-banner-content-caption';
      const h2 = formattedText.querySelector('h2');
      if (h2) {
        videoContentCaption.append(h2);
      }
      videoContentWrapper.append(videoContentCaption);
      videoWrapper.append(videoContentWrapper);
      videoWrapper.append(video);
      formattedText.append(videoWrapper);
    }

    // Handle multi-column layouts based on content
    const callToActionLinks = formattedText.querySelectorAll('h3 a img');
    if (callToActionLinks.length === 3) {
      col.classList.remove('col-md-12');
      const col1 = col.cloneNode(true);
      col1.classList.add('col-md-4');
      const col2 = col.cloneNode(true);
      col2.classList.add('col-md-4');
      const col3 = col.cloneNode(true);
      col3.classList.add('col-md-4');

      const items = formattedText.querySelectorAll('h3');
      if (items[0]) {
        const content1 = document.createElement('div');
        content1.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');
        content1.append(items[0].closest('div')); // Assuming h3 is wrapped in a div with p tags
        const pText1 = paragraphText.cloneNode(true);
        const pTextContent1 = paragraphTextContent.cloneNode(true);
        pTextContent1.append(content1);
        pText1.append(pTextContent1);
        const colContentField1 = columnContentField.cloneNode(true);
        colContentField1.append(pText1);
        const pColContent1 = paragraphColumnContent.cloneNode(true);
        pColContent1.append(colContentField1);
        const colWidgetsField1 = columnWidgetsField.cloneNode(true);
        colWidgetsField1.classList.add('field--name-field-column-1-widgets');
        colWidgetsField1.append(pColContent1);
        col1.append(colWidgetsField1);
      }
      if (items[1]) {
        const content2 = document.createElement('div');
        content2.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');
        content2.append(items[1].closest('div'));
        const pText2 = paragraphText.cloneNode(true);
        const pTextContent2 = paragraphTextContent.cloneNode(true);
        pTextContent2.append(content2);
        pText2.append(pTextContent2);
        const colContentField2 = columnContentField.cloneNode(true);
        colContentField2.append(pText2);
        const pColContent2 = paragraphColumnContent.cloneNode(true);
        pColContent2.append(colContentField2);
        const colWidgetsField2 = columnWidgetsField.cloneNode(true);
        colWidgetsField2.classList.add('field--name-field-column-2-widgets');
        colWidgetsField2.append(pColContent2);
        col2.append(colWidgetsField2);
      }
      if (items[2]) {
        const content3 = document.createElement('div');
        content3.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');
        content3.append(items[2].closest('div'));
        const pText3 = paragraphText.cloneNode(true);
        const pTextContent3 = paragraphTextContent.cloneNode(true);
        pTextContent3.append(content3);
        pText3.append(pTextContent3);
        const colContentField3 = columnContentField.cloneNode(true);
        colContentField3.append(pText3);
        const pColContent3 = paragraphColumnContent.cloneNode(true);
        pColContent3.append(colContentField3);
        const colWidgetsField3 = columnWidgetsField.cloneNode(true);
        colWidgetsField3.classList.add('field--name-field-column-3-widgets');
        colWidgetsField3.append(pColContent3);
        col3.append(colWidgetsField3);
      }
      rowPad.append(col1, col2, col3);
    } else if (formattedText.querySelector('.front-section-title')) { // Latest News section
      col.classList.remove('col-md-12');
      const colLeft = col.cloneNode(true);
      colLeft.classList.add('col-md-4');
      const colRight = col.cloneNode(true);
      colRight.classList.add('col-md-8');

      // Left column content (Latest News title and list)
      const leftContent = document.createElement('div');
      leftContent.classList.add('field__item');
      const titleParagraph = paragraphTextContent.cloneNode(true);
      const titleFormattedText = formattedText.cloneNode(true);
      titleFormattedText.innerHTML = `<h3 class="front-section-title">${formattedText.querySelector('.front-section-title').textContent}</h3>`;
      titleParagraph.append(titleFormattedText);
      leftContent.append(titleParagraph);

      const newsListDiv = document.createElement('div');
      newsListDiv.classList.add('field__item');
      const newsListParagraph = document.createElement('div');
      newsListParagraph.classList.add('paragraph', 'paragraph--type--content-list', 'paragraph--view-mode--default');
      const newsListViewField = document.createElement('div');
      newsListViewField.classList.add('field', 'field--name-field-content-view', 'field--type-viewfield', 'field--label-visually_hidden');
      const newsListViewItem = document.createElement('div');
      newsListViewItem.classList.add('field__item', 'field__item-label-hidden');
      const viewsElementContainer = document.createElement('div');
      viewsElementContainer.classList.add('views-element-container');
      const viewContentArticleList = document.createElement('div');
      viewContentArticleList.classList.add('view', 'view-content-article-list', 'view-id-content_article_list', 'view-display-id-thumb_title_body', 'js-view-dom-id-b9c851133ebf113e3fb8bad2e2674415ba50a11c0c24c8ce03a775a40a3aa489');
      const viewContentRow = document.createElement('div');
      viewContentRow.classList.add('view-content', 'row');

      // Extract news items from the formattedText
      const newsItems = formattedText.querySelectorAll('.views-row');
      newsItems.forEach((item) => {
        const clonedItem = item.cloneNode(true);
        clonedItem.classList.add('col-md-12', 'frontpage-sidebar-news'); // Ensure these classes are present
        viewContentRow.append(clonedItem);
      });

      viewContentArticleList.append(viewContentRow);
      viewsElementContainer.append(viewContentArticleList);
      newsListViewItem.append(viewsElementContainer);
      newsListViewField.append(newsListViewItem);
      newsListParagraph.append(newsListViewField);
      leftContent.append(newsListDiv);
      leftContent.append(newsListParagraph);

      const moreNewsLink = formattedText.querySelector('a.btn.btn-primary');
      if (moreNewsLink) {
        const moreNewsParagraphItem = document.createElement('div');
        moreNewsParagraphItem.classList.add('field__item');
        const moreNewsParagraph = document.createElement('div');
        moreNewsParagraph.classList.add('paragraph', 'paragraph--type--text', 'paragraph--view-mode--default');
        const moreNewsFormattedText = document.createElement('div');
        moreNewsFormattedText.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');
        moreNewsFormattedText.append(moreNewsLink.closest('p'));
        moreNewsParagraph.append(moreNewsFormattedText);
        moreNewsParagraphItem.append(moreNewsParagraph);
        leftContent.append(moreNewsParagraphItem);
      }

      const colLeftWidgetsField = columnWidgetsField.cloneNode(true);
      colLeftWidgetsField.classList.add('field--name-field-column-1-widgets');
      const colLeftParagraphColumnContent = paragraphColumnContent.cloneNode(true);
      const colLeftColumnContentField = columnContentField.cloneNode(true);
      colLeftColumnContentField.append(leftContent);
      colLeftParagraphColumnContent.append(colLeftColumnContentField);
      colLeftWidgetsField.append(colLeftParagraphColumnContent);
      colLeft.append(colLeftWidgetsField);

      // Right column content (Board Meeting and Regional Resilience Partnership)
      const rightContent = document.createElement('div');
      rightContent.classList.add('field__item');
      const boardMeetingParagraph = document.createElement('div');
      boardMeetingParagraph.classList.add('paragraph', 'paragraph--type--content-list', 'paragraph--view-mode--default');
      const boardMeetingViewField = document.createElement('div');
      boardMeetingViewField.classList.add('field', 'field--name-field-content-view', 'field--type-viewfield', 'field--label-visually_hidden');
      const boardMeetingViewItem = document.createElement('div');
      boardMeetingViewItem.classList.add('field__item', 'field__item-label-hidden');
      const boardMeetingViewsElementContainer = document.createElement('div');
      boardMeetingViewsElementContainer.classList.add('views-element-container');
      const boardMeetingView = document.createElement('div');
      boardMeetingView.classList.add('view', 'view-content-article-list', 'view-id-content_article_list', 'view-display-id-block_1', 'js-view-dom-id-b66ffe6e218631f9db47c46105d8c7ef248e64009311a579cc4cdd4e33565e16');
      const boardMeetingViewContentRow = document.createElement('div');
      boardMeetingViewContentRow.classList.add('view-content', 'row');

      const boardMeetingItem = formattedText.querySelector('.frontpage-top-news');
      if (boardMeetingItem) {
        const clonedBoardMeetingItem = boardMeetingItem.cloneNode(true);
        clonedBoardMeetingItem.classList.add('col-md-12'); // Ensure this class is present
        boardMeetingViewContentRow.append(clonedBoardMeetingItem);
      }

      boardMeetingView.append(boardMeetingViewContentRow);
      boardMeetingViewsElementContainer.append(boardMeetingView);
      boardMeetingViewItem.append(boardMeetingViewsElementContainer);
      boardMeetingViewField.append(boardMeetingViewItem);
      boardMeetingParagraph.append(boardMeetingViewField);
      rightContent.append(boardMeetingParagraph);

      const resilienceLink = formattedText.querySelector('a.btn.btn-primary.btn-lg');
      if (resilienceLink) {
        const resilienceParagraphItem = document.createElement('div');
        resilienceParagraphItem.classList.add('field__item');
        const resilienceParagraph = document.createElement('div');
        resilienceParagraph.classList.add('paragraph', 'paragraph--type--text', 'paragraph--view-mode--default');
        const resilienceFormattedText = document.createElement('div');
        resilienceFormattedText.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');
        resilienceFormattedText.append(resilienceLink.closest('p'));
        resilienceParagraph.append(resilienceFormattedText);
        resilienceParagraphItem.append(resilienceParagraph);
        rightContent.append(resilienceParagraphItem);
      }

      const colRightWidgetsField = columnWidgetsField.cloneNode(true);
      colRightWidgetsField.classList.add('field--name-field-column-2-widgets');
      const colRightParagraphColumnContent = paragraphColumnContent.cloneNode(true);
      const colRightColumnContentField = columnContentField.cloneNode(true);
      colRightColumnContentField.append(rightContent);
      colRightParagraphColumnContent.append(colRightColumnContentField);
      colRightWidgetsField.append(colRightParagraphColumnContent);
      colRight.append(colRightWidgetsField);

      rowPad.append(colLeft, colRight);

    } else {
      // Default single column layout
      paragraphTextContent.append(formattedText);
      paragraphText.append(paragraphTextContent);
      columnContentField.append(paragraphText);
      paragraphColumnContent.append(columnContentField);
      columnWidgetsField.append(paragraphColumnContent);
      col.append(columnWidgetsField);
      rowPad.append(col);
    }

    contentLayoutField.append(rowPad);
    contentWrapper.append(contentLayoutField);
    fieldItem.append(contentWrapper);
    wrapper.append(fieldItem);
  });

  wrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(wrapper);
}
