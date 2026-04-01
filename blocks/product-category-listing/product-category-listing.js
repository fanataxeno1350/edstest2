import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // BlockJson: title, subtitle, categories (container of category items)
  // EDS Block Structure: titleRow, subtitleRow, categoriesRow, ...itemRows
  const [titleRow, subtitleRow, categoriesRow, ...itemRows] = [...block.children];

  block.textContent = '';
  block.classList.add('cmp-product-category-listing');

  const headerDiv = document.createElement('div');
  headerDiv.classList.add('cmp-product-category-listing__header');
  block.append(headerDiv);

  if (titleRow && titleRow.firstElementChild) {
    const titleEl = document.createElement('h1');
    titleEl.classList.add('cmp-product-category-listing__title');
    moveInstrumentation(titleRow.firstElementChild, titleEl);
    titleEl.append(...titleRow.firstElementChild.childNodes);
    headerDiv.append(titleEl);
  }

  if (subtitleRow && subtitleRow.firstElementChild) {
    const subtitleEl = document.createElement('div');
    subtitleEl.classList.add('cmp-product-category-listing__subTitle', 'desc-2');
    moveInstrumentation(subtitleRow.firstElementChild, subtitleEl);
    subtitleEl.append(...subtitleRow.firstElementChild.childNodes);
    headerDiv.append(subtitleEl);
  }

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('cmp-product-category-listing__content');
  block.append(contentDiv);

  itemRows.forEach((row) => {
    // Each row corresponds to a 'category' item as per BlockJson
    // Fields: link (cell 0), image (cell 1), name (cell 2)
    const cells = [...row.children];
    if (cells.length < 3) {
      // Skip malformed rows
      return;
    }

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('cmp-categorylist', 'cmp-categorylist--anchor');
    moveInstrumentation(row, itemDiv);

    const linkEl = document.createElement('a');
    linkEl.classList.add('cmp-categorylist__item');

    // Cell 0: Link
    const linkCell = cells[0];
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.title = foundLink.textContent.trim(); // Use link text as title
      moveInstrumentation(foundLink, linkEl);
    }

    // Cell 1: Image
    const imageCell = cells[1];
    const pictureEl = imageCell.querySelector('picture');

    const imageWrapper = document.createElement('span');
    imageWrapper.classList.add('cmp-categorylist__imagewrapper');
    linkEl.append(imageWrapper);

    const lazyImageContainer = document.createElement('div');
    lazyImageContainer.classList.add('lazy-image-container');
    imageWrapper.append(lazyImageContainer);

    if (pictureEl) {
      const img = pictureEl.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // The original HTML uses 'cmp-categorylist__image' on the img tag inside the picture.
        // We need to ensure this class is applied to the new optimized img.
        const optimizedImg = optimizedPic.querySelector('img');
        if (optimizedImg) {
          optimizedImg.classList.add('cmp-categorylist__image');
          moveInstrumentation(img, optimizedImg);
        }
        lazyImageContainer.append(optimizedPic);
      }
    }

    // Cell 2: Name
    const nameCell = cells[2];
    const nameText = nameCell.textContent.trim();
    const nameSpan = document.createElement('span');
    nameSpan.classList.add('cmp-categorylist__name');
    nameSpan.setAttribute('data-title', nameText);
    nameSpan.textContent = nameText;
    linkEl.append(nameSpan);

    itemDiv.append(linkEl);
    contentDiv.append(itemDiv);
  });

  // The final block.querySelectorAll('picture > img') optimization is redundant
  // as pictures are handled within the itemRows loop.
  // If there were other pictures outside of itemRows, this would be needed.
  // Given the current structure, it's not.
}
