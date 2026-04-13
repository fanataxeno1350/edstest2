import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, subTitleRow, ...categoryRows] = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.classList.add('cmp-product-category-listing');

  const header = document.createElement('div');
  header.classList.add('cmp-product-category-listing__header');

  if (titleRow) {
    const title = document.createElement('h1');
    title.classList.add('cmp-product-category-listing__title');
    moveInstrumentation(titleRow.firstElementChild, title);
    title.textContent = titleRow.firstElementChild?.textContent || '';
    header.append(title);
  }

  if (subTitleRow) {
    const subTitle = document.createElement('div');
    subTitle.classList.add('cmp-product-category-listing__subTitle', 'desc-2');
    moveInstrumentation(subTitleRow.firstElementChild, subTitle);
    subTitle.textContent = subTitleRow.firstElementChild?.textContent || '';
    header.append(subTitle);
  }

  wrapper.append(header);

  const content = document.createElement('div');
  content.classList.add('cmp-product-category-listing__content');

  categoryRows.forEach((row) => {
    const categoryItemWrapper = document.createElement('div');
    categoryItemWrapper.classList.add('cmp-categorylist', 'cmp-categorylist--anchor');
    moveInstrumentation(row, categoryItemWrapper);

    const link = document.createElement('a');
    link.classList.add('cmp-categorylist__item');
    
    let imageEl = null;
    let nameText = '';
    let linkHref = '';
    let linkTitle = '';

    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture')) {
        imageEl = cell.querySelector('img');
      } else if (cell.querySelector('a')) {
        const a = cell.querySelector('a');
        linkHref = a.href;
        linkTitle = a.textContent.trim();
      } else {
        nameText = cell.textContent.trim();
      }
    });

    if (linkHref) {
      link.href = linkHref;
    }
    if (linkTitle) {
      link.title = linkTitle;
    } else if (nameText) {
      link.title = nameText;
    }

    if (imageEl) {
      const imageWrapper = document.createElement('span');
      imageWrapper.classList.add('cmp-categorylist__imagewrapper');
      const lazyImageContainer = document.createElement('div');
      lazyImageContainer.classList.add('lazy-image-container');

      const optimizedPic = createOptimizedPicture(imageEl.src, imageEl.alt, false, [{ width: '750' }]);
      const newImg = optimizedPic.querySelector('img');
      newImg.classList.add('cmp-categorylist__image', 'lazy-image', 'loaded');
      moveInstrumentation(imageEl, newImg);
      lazyImageContainer.append(optimizedPic);
      imageWrapper.append(lazyImageContainer);
      link.append(imageWrapper);
    }

    if (nameText) {
      const nameSpan = document.createElement('span');
      nameSpan.classList.add('cmp-categorylist__name');
      nameSpan.setAttribute('data-title', nameText);
      nameSpan.textContent = nameText;
      link.append(nameSpan);
    }
    
    categoryItemWrapper.append(link);
    content.append(categoryItemWrapper);
  });

  wrapper.append(content);

  block.textContent = '';
  block.append(wrapper);
}
