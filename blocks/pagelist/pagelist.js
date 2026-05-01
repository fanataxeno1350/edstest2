import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const pagelistWrapper = document.createElement('div');
  pagelistWrapper.classList.add('pagelist-wrapper');
  moveInstrumentation(block, pagelistWrapper);

  const [headingRow, ...itemRows] = [...block.children];

  // Heading
  if (headingRow) {
    const pagelistHeader = document.createElement('div');
    pagelistHeader.classList.add('pagelist-header');

    const pagelistHeading = document.createElement('div');
    pagelistHeading.classList.add('pagelist-heading');

    const cPageListingV2Heading = document.createElement('div');
    cPageListingV2Heading.classList.add('c-page-listing-v2-heading');

    const h2 = document.createElement('h2');
    h2.classList.add('c-page-listing-v2-heading__heading-container');
    h2.textContent = headingRow.querySelector('div')?.textContent.trim() || '';
    moveInstrumentation(headingRow, h2);

    cPageListingV2Heading.append(h2);
    pagelistHeading.append(cPageListingV2Heading);
    pagelistHeader.append(pagelistHeading);
    pagelistWrapper.append(pagelistHeader);
  }

  // Items
  if (itemRows.length > 0) {
    const tnsOuter = document.createElement('div');
    tnsOuter.classList.add('tns-outer');

    const tnsMw = document.createElement('div');
    tnsMw.classList.add('tns-ovh');

    const tnsInner = document.createElement('div');
    tnsInner.classList.add('tns-inner');

    const ul = document.createElement('ul');
    ul.classList.add('cmp-list', 'pageList', 'tns-slider', 'tns-carousel', 'tns-subpixel', 'tns-calc', 'tns-horizontal');

    itemRows.forEach((row) => {
      const li = document.createElement('li');
      li.classList.add('cmp-list__item', 'tns-item');

      const teaser = document.createElement('div');
      teaser.classList.add('cmp-teaser', 'article-content');

      // Use array destructuring for fixed-field item model
      const [imageCell, imageAltCell, linkCell, linkLabelCell] = [...row.children];

      // Image
      if (imageCell) {
        const teaserImage = document.createElement('div');
        teaserImage.classList.add('cmp-teaser__image');

        const cmpImage = document.createElement('div');
        cmpImage.classList.add('cmp-image');

        const picture = imageCell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          if (img) {
            // imageAltCell is type=text, read its textContent
            const optimizedPic = createOptimizedPicture(img.src, imageAltCell?.textContent.trim() || img.alt, false, [{ width: '750' }]);
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            cmpImage.append(optimizedPic);
          }
        }
        moveInstrumentation(imageCell, cmpImage);
        teaserImage.append(cmpImage);
        teaser.append(teaserImage);
      }

      // Link
      if (linkCell) {
        const teaserContent = document.createElement('div');
        teaserContent.classList.add('cmp-teaser__content');

        const actionContainer = document.createElement('div');
        actionContainer.classList.add('cmp-teaser__action-container');

        const anchor = document.createElement('a');
        anchor.classList.add('cmp-teaser__action-link', 'focusable-anchor', 'external-link-icon');
        const foundLink = linkCell.querySelector('a');
        if (foundLink) {
          anchor.href = foundLink.href;
          // linkLabelCell is type=text, read its textContent
          anchor.textContent = linkLabelCell?.textContent.trim() || '';
          anchor.target = '_blank'; // Assuming external links open in new tab
          anchor.rel = 'noopener noreferrer';
        }
        moveInstrumentation(linkCell, anchor);
        actionContainer.append(anchor);
        teaserContent.append(actionContainer);
        teaser.append(teaserContent);
      }

      moveInstrumentation(row, li);
      li.append(teaser);
      ul.append(li);
    });

    tnsInner.append(ul);
    tnsMw.append(tnsInner);
    tnsOuter.append(tnsMw);
    pagelistWrapper.append(tnsOuter);

    // Add event listeners for carousel navigation if present in original HTML
    const prevButton = tnsOuter.querySelector('[data-controls="prev"]');
    const nextButton = tnsOuter.querySelector('[data-controls="next"]');
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        // Implement carousel previous slide logic here
        console.log('Previous slide clicked');
      });
    }
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        // Implement carousel next slide logic here
        console.log('Next slide clicked');
      });
    }
  }

  // Preloader and Pagination (as per original HTML, these are empty divs)
  const preloader = document.createElement('div');
  preloader.classList.add('preloader');
  pagelistWrapper.append(preloader);

  const pagination = document.createElement('div');
  pagination.classList.add('c-page-listing-v2-pagination');
  const cPagination = document.createElement('div');
  cPagination.classList.add('c-pagination');
  const cPaginationList = document.createElement('div');
  cPaginationList.classList.add('c-pagination-list');
  cPagination.append(cPaginationList);
  pagination.append(cPagination);
  pagelistWrapper.append(pagination);

  // Add event listeners for pagination items
  const paginationItems = pagelistWrapper.querySelectorAll('.c-pagination-item');
  paginationItems.forEach(item => {
    if (item.classList.contains('js-pagination-numbers') || item.classList.contains('c-pagination-item--prev') || item.classList.contains('c-pagination-item--next')) {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const pageParam = item.dataset.pageParam;
        console.log(`Pagination item clicked: ${item.title || pageParam}`);
        // Implement pagination logic here (e.g., load new page content)
      });
    }
  });

  block.textContent = '';
  block.append(pagelistWrapper);

  // Optimize images
  pagelistWrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
