import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    // Ensure 'nav-menu-item' and 'list-item' classes are applied to li elements
    li.classList.add('nav-menu-item', 'list-item');

    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (anchor) {
      // Ensure 'nav-menu-link' class is applied to anchor elements
      anchor.classList.add('nav-menu-link');
    } else {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        // Add a class to the span if it acts as a trigger
        span.classList.add('nav-menu-link');
        textNode.remove();
        li.prepend(span);
      }
    }

    if (nested) {
      nested.remove();
      // Ensure 'nav-menu-sub' class is applied to nested ul elements
      nested.classList.add('nav-menu-sub');
      const subWrap = document.createElement('div');
      // Use 'sub-menu-wrapper' if it exists in original HTML, otherwise 'has-sub-child'
      subWrap.classList.add('sub-menu-wrapper'); // Using a class from original HTML if available or a generic one
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
      transformNestedLists(nested); // Recursively transform nested lists
    }
  });
}

export default function decorate(block) {
  const [titleRow, ...productRows] = [...block.children];

  const blueBox = document.createElement('div');
  blueBox.classList.add('blue-box');

  const productBox = document.createElement('div');
  productBox.classList.add('product-box');

  const titleElement = document.createElement('h2');
  titleElement.classList.add('white');
  moveInstrumentation(titleRow.firstElementChild, titleElement);
  titleElement.textContent = titleRow.firstElementChild.textContent.trim();
  productBox.append(titleElement);

  const bxWrapper = document.createElement('div');
  bxWrapper.classList.add('bx-wrapper');
  const bxViewport = document.createElement('div');
  bxViewport.classList.add('bx-viewport');
  const bxSlider = document.createElement('ul');
  bxSlider.classList.add('bxslider');

  productRows.forEach((row) => {
    const cells = [...row.children];
    // Use content detection for cells, especially for richtext and aem-content
    const imageCell = cells[0];
    const titleCell = cells[1];
    const descriptionCell = cells[2];
    const readMoreLinkCell = cells[3];
    const disclaimerCell = cells[4];
    const hierarchyCell = cells[5]; // This is the hierarchy-tree richtext field

    const li = document.createElement('li');

    const figure = document.createElement('figure');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      figure.append(optimizedPic);
    }
    li.append(figure);

    const dtl = document.createElement('div');
    dtl.classList.add('dtl');

    const productTitle = document.createElement('h1');
    productTitle.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, productTitle);
    dtl.append(productTitle);

    const description = document.createElement('p');
    description.innerHTML = descriptionCell.innerHTML; // Use innerHTML for richtext
    moveInstrumentation(descriptionCell, description);
    dtl.append(description);

    const readMoreLink = document.createElement('a');
    readMoreLink.classList.add('r-more');
    const readMoreAnchor = readMoreLinkCell.querySelector('a');
    if (readMoreAnchor) {
      readMoreLink.href = readMoreAnchor.href;
      // The text content for 'read more' is fixed, not from the cell's textContent
      readMoreLink.textContent = 'read more';
    }
    moveInstrumentation(readMoreLinkCell, readMoreLink);
    dtl.append(readMoreLink);

    // Handle hierarchy-tree richtext field
    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      const bulletPoints = document.createElement('ul');
      bulletPoints.classList.add('bulletPoints'); // From ORIGINAL HTML
      // Use a temporary div to parse and apply classes before appending
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv);

      // Apply classes to nested elements within the hierarchy
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('nav-menu-sub'));
      tempDiv.querySelectorAll('li').forEach(liItem => liItem.classList.add('nav-menu-item', 'list-item'));
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('nav-menu-link'));

      // Move children from tempDiv to bulletPoints
      while (tempDiv.firstChild) {
        bulletPoints.append(tempDiv.firstChild);
      }

      transformNestedLists(bulletPoints); // Transform the hierarchy
      dtl.append(bulletPoints);
    }

    li.append(dtl);

    const dis = document.createElement('div');
    dis.classList.add('dis');
    const itemList = document.createElement('div');
    itemList.classList.add('item-list');
    const disclaimerList = document.createElement('ul');
    const disclaimerLi = document.createElement('li');
    disclaimerLi.classList.add('first', 'last');
    disclaimerLi.innerHTML = disclaimerCell.innerHTML; // Use innerHTML for richtext
    moveInstrumentation(disclaimerCell, disclaimerLi);
    disclaimerList.append(disclaimerLi);
    itemList.append(disclaimerList);
    dis.append(itemList);
    li.append(dis);

    moveInstrumentation(row, li);
    bxSlider.append(li);
  });

  bxViewport.append(bxSlider);
  bxWrapper.append(bxViewport);
  productBox.append(bxWrapper);
  blueBox.append(productBox);

  // Add navigation controls for the slider
  const bxControls = document.createElement('div');
  bxControls.classList.add('bx-controls', 'bx-has-pager', 'bx-has-controls-direction');

  const bxPager = document.createElement('div');
  bxPager.classList.add('bx-pager', 'bx-default-pager');
  // Assuming a simple pager for now, actual implementation would involve a slider library
  productRows.forEach((_, index) => {
    const pagerItem = document.createElement('div');
    pagerItem.classList.add('bx-pager-item');
    const pagerLink = document.createElement('a');
    pagerLink.href = ''; // Placeholder
    pagerLink.dataset.slideIndex = index;
    pagerLink.classList.add('bx-pager-link');
    pagerLink.textContent = index + 1;
    if (index === 0) pagerLink.classList.add('active'); // First item active by default
    pagerItem.append(pagerLink);
    bxPager.append(pagerItem);
  });
  bxControls.append(bxPager);

  const bxControlsDirection = document.createElement('div');
  bxControlsDirection.classList.add('bx-controls-direction');
  const prevButton = document.createElement('a');
  prevButton.classList.add('bx-prev');
  prevButton.href = ''; // Placeholder
  prevButton.textContent = 'Prev';
  const nextButton = document.createElement('a');
  nextButton.classList.add('bx-next');
  nextButton.href = ''; // Placeholder
  nextButton.textContent = 'Next';

  // Add event listeners for navigation (dummy for now, actual slider would handle this)
  prevButton.addEventListener('click', (e) => {
    e.preventDefault();
    // Implement slider previous logic here
    console.log('Previous slide clicked');
  });
  nextButton.addEventListener('click', (e) => {
    e.preventDefault();
    // Implement slider next logic here
    console.log('Next slide clicked');
  });

  bxControlsDirection.append(prevButton, nextButton);
  bxControls.append(bxControlsDirection);
  productBox.append(bxControls); // Append controls to productBox

  block.textContent = ''; // Clear the original block content
  block.append(blueBox);
}
