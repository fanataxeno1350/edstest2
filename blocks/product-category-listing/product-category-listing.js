import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const productCategoryListingDiv = document.createElement('div');
  productCategoryListingDiv.classList.add('productcategory-cmp-product-category-listing');

  const headerDiv = document.createElement('div');
  headerDiv.classList.add('productcategory-cmp-product-category-listing__header');

  const headingElement = document.createElement('h1');
  headingElement.classList.add('productcategory-cmp-product-category-listing__title');
  const authoredHeading = block.querySelector('[data-aue-prop="heading"]');
  if (authoredHeading) {
    headingElement.textContent = authoredHeading.textContent;
    moveInstrumentation(authoredHeading, headingElement);
  } else {
    // Fallback if data-aue-prop is not present
    const h1 = block.querySelector('h1');
    if (h1) {
      headingElement.textContent = h1.textContent;
      moveInstrumentation(h1, headingElement);
    }
  }

  const subTitleElement = document.createElement('div');
  subTitleElement.classList.add('productcategory-cmp-product-category-listing__subTitle', 'productcategory-desc-2');
  const authoredSubTitle = block.querySelector('[data-aue-prop="subTitle"]');
  if (authoredSubTitle) {
    subTitleElement.textContent = authoredSubTitle.textContent;
    moveInstrumentation(authoredSubTitle, subTitleElement);
  } else {
    // Fallback if data-aue-prop is not present
    const p = block.querySelector('p');
    if (p) {
      subTitleElement.textContent = p.textContent;
      moveInstrumentation(p, subTitleElement);
    }
  }

  headerDiv.append(headingElement, subTitleElement);
  productCategoryListingDiv.append(headerDiv);

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('productcategory-cmp-product-category-listing__content');

  const productCategories = block.querySelectorAll('[data-aue-model="productCategory"]');

  productCategories.forEach((productCategoryNode) => {
    const categoryListDiv = document.createElement('div');
    categoryListDiv.classList.add('productcategory-cmp-categorylist', 'productcategory-cmp-categorylist--anchor');

    const linkElement = document.createElement('a');
    linkElement.classList.add('productcategory-cmp-categorylist__item');

    const authoredLink = productCategoryNode.querySelector('[data-aue-prop="link"]');
    if (authoredLink && authoredLink.href) {
      linkElement.href = authoredLink.href;
      linkElement.title = authoredLink.textContent;
      moveInstrumentation(authoredLink, linkElement);
    } else {
      const existingLink = productCategoryNode.querySelector('.button-container a');
      if (existingLink) {
        linkElement.href = existingLink.href;
        linkElement.title = existingLink.textContent;
        moveInstrumentation(existingLink, linkElement);
      }
    }

    const imageWrapperSpan = document.createElement('span');
    imageWrapperSpan.classList.add('productcategory-cmp-categorylist__imagewrapper');

    const lazyImageContainerDiv = document.createElement('div');
    lazyImageContainerDiv.classList.add('productcategory-lazy-image-container');

    const authoredImage = productCategoryNode.querySelector('[data-aue-prop="image"]');
    if (authoredImage && authoredImage.src) {
      const picture = createOptimizedPicture(authoredImage.src, authoredImage.alt || '');
      picture.querySelector('img').classList.add('productcategory-cmp-categorylist__image', 'productcategory-lazy-image', 'productcategory-loaded');
      lazyImageContainerDiv.append(picture);
      moveInstrumentation(authoredImage, lazyImageContainerDiv);
    } else {
      const existingImg = productCategoryNode.querySelector('img');
      if (existingImg && existingImg.src) {
        const picture = createOptimizedPicture(existingImg.src, existingImg.alt || '');
        picture.querySelector('img').classList.add('productcategory-cmp-categorylist__image', 'productcategory-lazy-image', 'productcategory-loaded');
        lazyImageContainerDiv.append(picture);
        moveInstrumentation(existingImg, lazyImageContainerDiv);
      }
    }

    imageWrapperSpan.append(lazyImageContainerDiv);

    const nameSpan = document.createElement('span');
    nameSpan.classList.add('productcategory-cmp-categorylist__name');
    const authoredTitle = productCategoryNode.querySelector('[data-aue-prop="title"]');
    if (authoredTitle) {
      nameSpan.textContent = authoredTitle.textContent;
      nameSpan.dataset.title = authoredTitle.textContent;
      moveInstrumentation(authoredTitle, nameSpan);
    } else {
      const existingTitle = productCategoryNode.querySelector('p:last-of-type'); // Assuming title is the last p tag if not aue-prop
      if (existingTitle) {
        nameSpan.textContent = existingTitle.textContent;
        nameSpan.dataset.title = existingTitle.textContent;
        moveInstrumentation(existingTitle, nameSpan);
      }
    }

    linkElement.append(imageWrapperSpan, nameSpan);
    categoryListDiv.append(linkElement);
    contentDiv.append(categoryListDiv);
    moveInstrumentation(productCategoryNode, categoryListDiv);
  });

  productCategoryListingDiv.append(contentDiv);

  block.textContent = '';
  block.append(productCategoryListingDiv);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
