import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
      }
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-sub-child'); // Use original HTML class
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
    }
  });
}

export default function decorate(block) {
  const [headingRow, ...itemRows] = [...block.children];

  const heading = headingRow.querySelector('div').textContent.trim();
  const h2 = document.createElement('h2');
  h2.textContent = heading;
  moveInstrumentation(headingRow, h2);

  const tabItems = itemRows.filter((row) => row.children.length === 2);
  const productCardItems = itemRows.filter((row) => row.children.length === 5);

  const tabScrollWrap = document.createElement('div');
  tabScrollWrap.classList.add('gsc_ta_scroll', 'gsc_ta_scroll_move');

  const tabList = document.createElement('ul');
  tabList.classList.add('gsc-ta-clickWrap');
  tabList.setAttribute('data-track-section', 'tab');

  const contentHold = document.createElement('div');
  contentHold.classList.add('contentHold', 'gsc_row');

  // Map to store product lists for each tab
  const productListsByTab = new Map();

  tabItems.forEach((row, index) => {
    const [tabLabelCell, hierarchyTreeCell] = [...row.children];
    const tabLabel = tabLabelCell.textContent.trim();
    const tabSectionId = tabLabel.toLowerCase().replace(/\s/g, '-');

    const li = document.createElement('li');
    li.title = tabLabel;
    li.textContent = tabLabel;
    moveInstrumentation(row, li);

    const tabContent = document.createElement('div');
    tabContent.classList.add('gsc-ta-content');
    tabContent.setAttribute('data-track-section', tabLabel);

    if (index === 0) {
      li.classList.add('gsc-ta-active');
      tabContent.classList.add('gsc-ta-active');
    }

    // Process hierarchy-tree richtext
    const hierarchyDiv = document.createElement('div');
    hierarchyDiv.innerHTML = hierarchyTreeCell.innerHTML;
    moveInstrumentation(hierarchyTreeCell, hierarchyDiv);

    const rootUl = hierarchyDiv.querySelector('ul');
    if (rootUl) {
      // Apply classes from original HTML to nested elements
      rootUl.querySelectorAll('a').forEach(a => a.classList.add('nav-menu-item-link')); // Example class, adjust if needed
      rootUl.querySelectorAll('li').forEach(liElem => liElem.classList.add('nav-menu-item', 'list-item')); // Example classes
      rootUl.querySelectorAll('ul').forEach(ulElem => ulElem.classList.add('nav-menu-sub-menu')); // Example class

      transformNestedLists(rootUl);
      tabContent.appendChild(hierarchyDiv); // Append the processed hierarchy
    }


    const carouselWrapper = document.createElement('div');
    carouselWrapper.classList.add('actionBtn', 'mobileCarousel', 'iPadCarousel', 'posR');

    const productList = document.createElement('ul');
    productList.id = `trendingProducts-${tabSectionId}`; // Unique ID for each tab's product list
    productList.classList.add('scrollSmooth', 'clearfix', 'gsc_main', 'overXhidden');
    productList.setAttribute('data-section', tabSectionId);
    productList.setAttribute('data-carousel', tabSectionId);
    carouselWrapper.appendChild(productList);

    productListsByTab.set(tabSectionId, productList); // Store product list for later use

    tabContent.appendChild(carouselWrapper);
    contentHold.appendChild(tabContent);
    tabList.appendChild(li);
  });

  productCardItems.forEach((row) => {
    const [imageCell, titleCell, linkCell, priceCell, ctaLabelCell] = [...row.children];

    const productCard = document.createElement('div');
    productCard.classList.add('productCard');

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageDiv.appendChild(optimizedPic);
      }
    }
    productCard.appendChild(imageDiv);

    const holderDiv = document.createElement('div');
    holderDiv.classList.add('holder');

    const productLink = document.createElement('a');
    productLink.classList.add('title');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      productLink.href = foundLink.href;
    }
    productLink.title = titleCell.textContent.trim();
    productLink.textContent = titleCell.textContent.trim();
    holderDiv.appendChild(productLink);

    const variantNameSpan = document.createElement('span');
    variantNameSpan.classList.add('variantName');
    holderDiv.appendChild(variantNameSpan);

    const priceDiv = document.createElement('div');
    priceDiv.classList.add('price');
    priceDiv.textContent = priceCell.textContent.trim();
    const expricetextSpan = document.createElement('span');
    expricetextSpan.classList.add('expricetext');
    priceDiv.appendChild(expricetextSpan);
    holderDiv.appendChild(priceDiv);

    const ctaButton = document.createElement('button');
    ctaButton.classList.add('bottomlink', 'button');
    ctaButton.title = ctaLabelCell.textContent.trim();
    ctaButton.textContent = ctaLabelCell.textContent.trim();
    holderDiv.appendChild(ctaButton);

    productCard.appendChild(holderDiv);

    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.appendChild(productCard);

    // Determine which tab this product card belongs to.
    // This assumes product cards are listed after their respective tab definition in the block.
    // For simplicity, we'll append to the last created productList.
    // A more robust solution would involve a data attribute on the product card row
    // linking it to a specific tab.
    let targetProductList = null;
    if (tabItems.length > 0) {
      const lastTabLabel = tabItems[tabItems.length - 1].children[0].textContent.trim();
      const lastTabSectionId = lastTabLabel.toLowerCase().replace(/\s/g, '-');
      targetProductList = productListsByTab.get(lastTabSectionId);
    }

    if (targetProductList) {
      targetProductList.appendChild(li);
    } else {
      // Fallback: if no tabs or no specific target, append to the first tab's product list
      const firstProductList = contentHold.querySelector('.gsc-ta-content.gsc-ta-active .gsc_main');
      if (firstProductList) {
        firstProductList.appendChild(li);
      }
    }
  });

  tabScrollWrap.appendChild(tabList);
  block.innerHTML = '';
  block.classList.add('trendingProducts'); // Add the block's main class
  block.appendChild(h2);
  block.appendChild(tabScrollWrap);
  block.appendChild(contentHold);

  // Add event listeners for tab switching
  const tabButtons = tabList.querySelectorAll('li');
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      tabList.querySelectorAll('li').forEach((btn) => btn.classList.remove('gsc-ta-active'));
      contentHold.querySelectorAll('.gsc-ta-content').forEach((content) => content.classList.remove('gsc-ta-active'));

      button.classList.add('gsc-ta-active');
      const targetSection = button.title;
      const targetContent = contentHold.querySelector(`[data-track-section="${targetSection}"]`);
      if (targetContent) {
        targetContent.classList.add('gsc-ta-active');
      }
    });
  });

  // Add carousel navigation buttons
  contentHold.querySelectorAll('.actionBtn').forEach((carouselContainer) => {
    const nextButton = document.createElement('span');
    nextButton.classList.add('ScBtn', 'next');
    nextButton.textContent = 'Next ';
    const nextImg = document.createElement('img');
    nextImg.alt = 'svg file';
    nextImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776316531486.svg+xml'; // Example SVG, replace if needed
    nextButton.appendChild(nextImg);
    carouselContainer.appendChild(nextButton);

    const productList = carouselContainer.querySelector('ul.gsc_main');
    let scrollPosition = 0;
    const scrollAmount = 300; // Adjust as needed

    nextButton.addEventListener('click', () => {
      scrollPosition += scrollAmount;
      if (scrollPosition > productList.scrollWidth - productList.clientWidth) {
        scrollPosition = 0; // Loop back to start
      }
      productList.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    });
  });
}
