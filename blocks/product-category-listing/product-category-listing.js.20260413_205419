import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Corrected destructuring: titleRow, subTitleRow, categoriesContainerRow, then all subsequent rows are categoryRows
  const [titleRow, subTitleRow, categoriesContainerRow, ...categoryRows] = [...block.children];

  block.innerHTML = '';
  block.classList.add('cmp-product-category-listing');

  const headerDiv = document.createElement('div');
  headerDiv.classList.add('cmp-product-category-listing__header');
  block.append(headerDiv);

  if (titleRow && titleRow.firstElementChild) {
    const titleEl = document.createElement('h1');
    moveInstrumentation(titleRow.firstElementChild, titleEl);
    titleEl.classList.add('cmp-product-category-listing__title');
    titleEl.append(...titleRow.firstElementChild.childNodes);
    headerDiv.append(titleEl);
  }

  if (subTitleRow && subTitleRow.firstElementChild) {
    const subTitleEl = document.createElement('div');
    moveInstrumentation(subTitleRow.firstElementChild, subTitleEl);
    subTitleEl.classList.add('cmp-product-category-listing__subTitle', 'desc-2');
    subTitleEl.append(...subTitleRow.firstElementChild.childNodes);
    headerDiv.append(subTitleEl);
  }

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('cmp-product-category-listing__content');
  block.append(contentDiv);

  categoryRows.forEach((row) => {
    // Each category item row has 3 cells: link, image, name
    const [linkCell, imageCell, nameCell] = [...row.children];

    const categoryListDiv = document.createElement('div');
    categoryListDiv.classList.add('cmp-categorylist', 'cmp-categorylist--anchor');
    moveInstrumentation(row, categoryListDiv);

    const anchorEl = document.createElement('a');
    anchorEl.classList.add('cmp-categorylist__item');
    if (linkCell) {
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        anchorEl.href = foundLink.href;
        anchorEl.title = foundLink.textContent.trim();
        moveInstrumentation(linkCell, anchorEl);
      }
    }
    categoryListDiv.append(anchorEl);

    if (imageCell) {
      const imageWrapper = document.createElement('span');
      imageWrapper.classList.add('cmp-categorylist__imagewrapper');
      const lazyImageContainer = document.createElement('div');
      lazyImageContainer.classList.add('lazy-image-container');
      imageWrapper.append(lazyImageContainer);

      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          const optimizedImg = optimizedPic.querySelector('img');
          optimizedImg.classList.add('cmp-categorylist__image', 'lazy-image', 'loaded');
          moveInstrumentation(img, optimizedImg);
          lazyImageContainer.append(optimizedPic);
        }
      }
      anchorEl.append(imageWrapper);
    }

    if (nameCell) {
      const nameSpan = document.createElement('span');
      nameSpan.classList.add('cmp-categorylist__name');
      nameSpan.setAttribute('data-title', nameCell.textContent.trim());
      moveInstrumentation(nameCell, nameSpan);
      nameSpan.append(...nameCell.childNodes);
      anchorEl.append(nameSpan);
    }

    contentDiv.append(categoryListDiv);
  });
}
