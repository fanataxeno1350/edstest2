import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Parse Navigation Hierarchy from richtext field
  function parseNavTree(ul) {
    return [...ul.querySelectorAll(':scope > li')].map((li) => {
      let label = '';
      const childNodes = [...li.childNodes];
      // Extract text content from direct child text nodes and non-UL elements
      for (const node of childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          label += node.textContent.trim();
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'UL') {
          // Handle cases where label might be wrapped in an <a> tag or similar
          label += node.textContent.trim();
        }
      }
      label = label.trim();

      const childUl = li.querySelector(':scope > ul');
      return { label, children: childUl ? parseNavTree(childUl) : [] };
    });
  }

  // Recursive rendering for navigation items
  function renderNavItems(items, parentContainer) {
    items.forEach((item) => {
      const li = document.createElement('li');

      const labelElement = document.createElement('a');
      labelElement.textContent = item.label;
      labelElement.href = '#'; // Placeholder, actual link not in RTE, so make it a toggle if parent

      if (item.children.length > 0) {
        // Parent item with children
        const spanWrapper = document.createElement('span'); // Wrapper for label and toggle
        const smallToggle = document.createElement('small'); // Toggle for mobile, from ORIGINAL HTML
        smallToggle.setAttribute('data-once', 'footerMobileInner');

        const ul = document.createElement('ul');
        ul.classList.add('footer-inner-list'); // From ORIGINAL HTML

        // RECURSIVELY render children
        renderNavItems(item.children, ul);

        // Add toggle behavior for the small element
        smallToggle.addEventListener('click', () => {
          ul.classList.toggle('show'); // Assuming 'show' class controls visibility
        });

        spanWrapper.append(labelElement, smallToggle);
        li.append(spanWrapper, ul);
      } else {
        // Leaf item: just a link
        li.append(labelElement);
      }
      parentContainer.append(li);
    });
  }

  // Destructure block children based on EDS Block Structure
  const [logoRow, logoLinkRow, textRow, copyrightTextRow, ...socialLinkItemRows] = children;

  const footerMain = document.createElement('footer');
  footerMain.classList.add('footer-main');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  // --- Footer Header Section ---
  const footerHeaderRow = document.createElement('div');
  footerHeaderRow.classList.add('row', 'footer-header');

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  const logoLink = document.createElement('a');
  const originalLogoLink = logoLinkRow.querySelector('a');
  if (originalLogoLink) {
    logoLink.href = originalLogoLink.href;
  }

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  logoDiv.append(logoLink);
  logoCol.append(logoDiv);
  footerHeaderRow.append(logoCol);

  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');

  const socialUl = document.createElement('ul');
  socialUl.classList.add('social-wrap');

  socialLinkItemRows.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li); // Move instrumentation from the original row to the new li

    const link = document.createElement('a');
    let iconPicture;
    let iconLink;

    // Use content detection to find picture and link cells
    const cells = [...row.children];
    iconPicture = cells.find(cell => cell.querySelector('picture'))?.querySelector('picture');
    iconLink = cells.find(cell => cell.querySelector('a'))?.querySelector('a');

    if (iconLink) {
      link.href = iconLink.href;
      link.target = '_blank'; // Assuming social links open in new tab
    }
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]); // Adjust width as needed
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      link.append(optimizedPic);
    }
    li.append(link);
    socialUl.append(li);
  });
  socialCol.append(socialUl);
  footerHeaderRow.append(socialCol);
  containerDiv.append(footerHeaderRow);

  // --- Footer Navigation Menu Section ---
  const footerMenuRow = document.createElement('div');
  footerMenuRow.classList.add('row', 'footer-menu-box');

  const menuCol = document.createElement('div');
  menuCol.classList.add('col');

  const footerMenuDiv = document.createElement('div');
  footerMenuDiv.classList.add('footer-menu');

  const textCell = textRow?.querySelector('div');
  const temp = document.createElement('div');
  temp.innerHTML = textCell?.innerHTML ?? '';
  const rootUl = temp.querySelector('ul');
  const navItems = rootUl ? parseNavTree(rootUl) : [];

  navItems.forEach((item) => {
    const linkBlockDiv = document.createElement('div');
    linkBlockDiv.classList.add('link-blocks'); // Each top-level item corresponds to a 'link-blocks' div

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');

    const span = document.createElement('span');
    const labelLink = document.createElement('a');
    labelLink.textContent = item.label;
    labelLink.href = '#'; // Placeholder, actual link not in RTE

    const smallToggle = document.createElement('small');
    smallToggle.setAttribute('data-once', 'footerMobileInner');

    const ul = document.createElement('ul');
    ul.classList.add('footer-inner-list');

    renderNavItems(item.children, ul);

    smallToggle.addEventListener('click', () => {
      ul.classList.toggle('show');
    });

    span.append(labelLink, smallToggle);
    headDiv.append(span);
    linkBlockDiv.append(headDiv, ul);
    footerMenuDiv.append(linkBlockDiv);
  });

  menuCol.append(footerMenuDiv);
  footerMenuRow.append(menuCol);
  containerDiv.append(footerMenuRow);

  // --- Copyright Section ---
  const copyrightWrapRow = document.createElement('div');
  copyrightWrapRow.classList.add('row', 'align-items-lg-end', 'copyright-wrap');

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');

  // The original HTML shows a secondary-nav ul with hardcoded links.
  // Since EDS block does not provide these links, we'll create an empty ul for now.
  // If these were dynamic, they would be separate item rows.
  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');
  secondaryNavCol.append(secondaryNavUl);
  copyrightWrapRow.append(secondaryNavCol);

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  moveInstrumentation(copyrightTextRow, copyrightTextCol);
  while (copyrightTextRow.firstChild) copyrightTextCol.append(copyrightTextRow.firstChild);
  copyrightWrapRow.append(copyrightTextCol);
  containerDiv.append(copyrightWrapRow);

  footerMain.append(containerDiv);

  // Optimize all images in the footer
  footerMain.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(footerMain);
}

