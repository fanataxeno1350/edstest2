import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Apply classes from original HTML to <li> and <a> elements
    li.classList.add('nav-menu-item', 'list-item'); // Assuming these are desired classes for list items
    if (anchor) {
      anchor.classList.add('nav-menu-link'); // Assuming this is a desired class for navigation links
    }

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
      // No specific class for sub-wrap in original HTML, so using a generic one or removing if not needed
      // subWrap.classList.add('has-sub-child'); // Removed - no direct equivalent in original HTML
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          // subWrap.classList.toggle('active'); // Removed - no direct equivalent in original HTML
        });
      }
      transformNestedLists(nested); // Recursively transform nested lists
    }
  });
}

export default function decorate(block) {
  const [titleRow, ...productRows] = [...block.children];

  const blockTitle = titleRow.querySelector('div').textContent.trim();
  moveInstrumentation(titleRow, blockTitle);

  const viewContent = document.createElement('div');
  viewContent.classList.add('view-content');

  const blueBox = document.createElement('div');
  blueBox.classList.add('blue-box');

  const productBox = document.createElement('div');
  productBox.classList.add('product-box');

  const h2 = document.createElement('h2');
  h2.classList.add('white');
  h2.textContent = blockTitle;
  productBox.append(h2);

  const bxWrapper = document.createElement('div');
  bxWrapper.classList.add('bx-wrapper');

  const bxViewport = document.createElement('div');
  bxViewport.classList.add('bx-viewport');

  const bxslider = document.createElement('ul');
  bxslider.classList.add('bxslider');

  productRows.forEach((row) => {
    const [imageCell, nameCell, descriptionCell, readMoreLinkCell, disclaimerCell, hierarchyCell] = [...row.children];

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

    const h1 = document.createElement('h1');
    h1.textContent = nameCell.textContent.trim();
    dtl.append(h1);

    const description = document.createElement('p');
    description.innerHTML = descriptionCell.innerHTML;
    dtl.append(description);

    const readMoreLink = readMoreLinkCell.querySelector('a');
    if (readMoreLink) {
      const a = document.createElement('a');
      a.classList.add('r-more');
      a.href = readMoreLink.href;
      a.textContent = 'read more';
      dtl.append(a);
      moveInstrumentation(readMoreLinkCell, a);
    }

    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      dtl.classList.add('bulletPoints');
      const hierarchyWrapper = document.createElement('div');
      // No specific class for hierarchy-wrapper in original HTML, so removing or using generic if needed
      // hierarchyWrapper.classList.add('hierarchy-wrapper'); // Removed - no direct equivalent in original HTML
      
      // Apply classes to the hierarchy elements as found in the original HTML
      hierarchyRoot.classList.add('nav-menu'); // Assuming 'nav-menu' or similar for root ul
      hierarchyRoot.querySelectorAll('li').forEach(item => item.classList.add('nav-menu-item', 'list-item'));
      hierarchyRoot.querySelectorAll('a').forEach(link => link.classList.add('nav-menu-link'));

      moveInstrumentation(hierarchyCell, hierarchyRoot); // Move instrumentation before appending
      hierarchyWrapper.append(hierarchyRoot);
      transformNestedLists(hierarchyRoot);
      dtl.append(hierarchyWrapper);
    }

    li.append(dtl);

    const dis = document.createElement('div');
    dis.classList.add('dis');
    const itemList = document.createElement('div');
    itemList.classList.add('item-list');
    const disclaimerUl = document.createElement('ul');
    const disclaimerLi = document.createElement('li');
    disclaimerLi.classList.add('first', 'last');
    disclaimerLi.innerHTML = disclaimerCell.innerHTML;
    disclaimerUl.append(disclaimerLi);
    itemList.append(disclaimerUl);
    dis.append(itemList);
    li.append(dis);

    moveInstrumentation(row, li);
    bxslider.append(li);
  });

  bxViewport.append(bxslider);
  bxWrapper.append(bxViewport);
  productBox.append(bxWrapper);
  blueBox.append(productBox);
  viewContent.append(blueBox);

  block.innerHTML = '';
  block.append(viewContent);

  // Add bx-controls for navigation, if needed, based on original HTML structure
  const bxControls = document.createElement('div');
  bxControls.classList.add('bx-controls', 'bx-has-pager', 'bx-has-controls-direction');

  const bxPager = document.createElement('div');
  bxPager.classList.add('bx-pager', 'bx-default-pager');
  productRows.forEach((_, index) => {
    const pagerItem = document.createElement('div');
    pagerItem.classList.add('bx-pager-item');
    const pagerLink = document.createElement('a');
    pagerLink.href = '';
    pagerLink.setAttribute('data-slide-index', index);
    pagerLink.classList.add('bx-pager-link');
    pagerLink.textContent = index + 1;
    if (index === 0) pagerLink.classList.add('active'); // Set first item as active
    pagerItem.append(pagerLink);
    bxPager.append(pagerItem);
  });
  bxControls.append(bxPager);

  const bxControlsDirection = document.createElement('div');
  bxControlsDirection.classList.add('bx-controls-direction');
  const prevBtn = document.createElement('a');
  prevBtn.classList.add('bx-prev');
  prevBtn.href = '';
  prevBtn.textContent = 'Prev';
  const nextBtn = document.createElement('a');
  nextBtn.classList.add('bx-next');
  nextBtn.href = '';
  nextBtn.textContent = 'Next';
  bxControlsDirection.append(prevBtn, nextBtn);
  bxControls.append(bxControlsDirection);
  bxWrapper.append(bxControls);

  // Simple slider logic for demonstration (EDS does not load bxslider JS)
  let currentIndex = 0;
  const slides = [...bxslider.children];

  const updateSlider = () => {
    slides.forEach((slide, i) => {
      slide.style.display = (i === currentIndex) ? 'block' : 'none';
    });
    bxPager.querySelectorAll('.bx-pager-link').forEach((link, i) => {
      link.classList.toggle('active', i === currentIndex);
    });
  };

  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
    updateSlider();
  });

  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
    updateSlider();
  });

  bxPager.querySelectorAll('.bx-pager-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      currentIndex = parseInt(e.target.getAttribute('data-slide-index'), 10);
      updateSlider();
    });
  });

  updateSlider(); // Initialize slider state
}
