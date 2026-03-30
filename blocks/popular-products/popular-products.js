import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const popularProductsCmp = block.querySelector('.popularproducts-cmp-popular-products');
  if (!popularProductsCmp) {
    return;
  }

  const headerSection = popularProductsCmp.querySelector('.popularproducts-cmp-popular-products__header-section');
  const title = headerSection ? headerSection.querySelector('.popularproducts-cmp-popular-products__title') : null;
  const subtitle = headerSection ? headerSection.querySelector('.popularproducts-cmp-popular-products__subtitle') : null;

  const newBlock = document.createElement('div');
  newBlock.classList.add('popular-products');

  if (title || subtitle) {
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('popular-products-header');
    if (title) {
      const h2 = document.createElement('h2');
      h2.textContent = title.textContent;
      moveInstrumentation(title, h2);
      headerDiv.append(h2);
    }
    if (subtitle) {
      const p = document.createElement('p');
      p.textContent = subtitle.textContent;
      moveInstrumentation(subtitle, p);
      headerDiv.append(p);
    }
    newBlock.append(headerDiv);
  }

  const productItems = block.querySelectorAll('[data-aue-model="product"]');
  if (productItems.length > 0) {
    const productsWrapper = document.createElement('div');
    productsWrapper.classList.add('popular-products-products-wrapper');

    productItems.forEach((itemNode) => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('popular-products-product-item');

      const imageLink = itemNode.querySelector('[data-aue-prop="productLink"]');
      const imageElement = itemNode.querySelector('[data-aue-prop="image"]');
      const productName = itemNode.querySelector('[data-aue-prop="productName"]');
      const productDetails = itemNode.querySelector('[data-aue-prop="productDetails"]');
      const buttonContainer = itemNode.querySelector('.popularproducts-cmp-popular-products__action .popularproducts-cmp-button');

      if (imageElement) {
        const picture = createOptimizedPicture(imageElement.src, imageElement.alt);
        const pictureWrapper = document.createElement('div');
        pictureWrapper.classList.add('popular-products-product-image');
        if (imageLink) {
          const a = document.createElement('a');
          a.href = imageLink.href;
          a.append(picture);
          pictureWrapper.append(a);
          moveInstrumentation(imageLink, a);
        } else {
          pictureWrapper.append(picture);
        }
        moveInstrumentation(imageElement, pictureWrapper);
        productDiv.append(pictureWrapper);
      }

      const descriptionDiv = document.createElement('div');
      descriptionDiv.classList.add('popular-products-product-description');

      if (productName) {
        const h3 = document.createElement('h3');
        h3.textContent = productName.textContent;
        descriptionDiv.append(h3);
        moveInstrumentation(productName, h3);
      }

      if (productDetails) {
        const p = document.createElement('p');
        p.innerHTML = productDetails.innerHTML;
        descriptionDiv.append(p);
        moveInstrumentation(productDetails, p);
      }

      if (buttonContainer) {
        const buttonLink = buttonContainer.closest('a') || buttonContainer.closest('button');
        if (buttonLink) {
          const buttonWrapper = document.createElement('div');
          buttonWrapper.classList.add('popular-products-product-button');
          const a = document.createElement('a');
          a.href = buttonLink.href || '#'; // Fallback for button without href
          a.classList.add('button', 'secondary');
          a.textContent = buttonLink.textContent.trim();
          buttonWrapper.append(a);
          descriptionDiv.append(buttonWrapper);
          moveInstrumentation(buttonLink, a);
        }
      }

      productDiv.append(descriptionDiv);
      productsWrapper.append(productDiv);
      moveInstrumentation(itemNode, productDiv);
    });
    newBlock.append(productsWrapper);
  }

  block.textContent = '';
  block.append(newBlock);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
