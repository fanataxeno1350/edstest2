import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const footerMain = document.createElement('div');
  footerMain.classList.add('container');

  // Footer Header (Logo and Social Links)
  const footerHeaderRow = document.createElement('div');
  footerHeaderRow.classList.add('row', 'footer-header');

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  // CRITICAL FIX: Use content detection for root fields instead of children[n]
  const logoCell = children.find(row => row.querySelector('.logo picture'))?.firstElementChild;
  const logoLinkCell = children.find(row => row.querySelector('.logo a'))?.firstElementChild;
  const copyrightTextCell = children.find(row => row.textContent.includes('Copyright©'))?.firstElementChild;

  if (logoCell && logoLinkCell) {
    const logoLink = document.createElement('a');
    moveInstrumentation(logoLinkCell, logoLink);
    logoLink.href = logoLinkCell.querySelector('a')?.href || '#';

    const picture = logoCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
        optimizedPic.querySelector('img').classList.add('hiddenlogo1');
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        logoLink.append(optimizedPic);
      }
    } else {
      // If no picture, just append the content of the logo cell
      moveInstrumentation(logoCell, logoLink);
      while (logoCell.firstChild) logoLink.append(logoCell.firstChild);
    }
    logoDiv.append(logoLink);
  }
  logoWrapper.append(logoDiv);
  footerHeaderRow.append(logoWrapper);

  const socialLinksWrapper = document.createElement('div');
  socialLinksWrapper.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  const socialUl = document.createElement('ul');
  socialUl.classList.add('social-wrap');
  socialLinksWrapper.append(socialUl);
  footerHeaderRow.append(socialLinksWrapper); // Append social links wrapper to header row

  // Footer Navigation
  const footerMenuBoxRow = document.createElement('div');
  footerMenuBoxRow.classList.add('row', 'footer-menu-box');
  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');
  footerMenuCol.append(footerMenu);
  footerMenuBoxRow.append(footerMenuCol);

  // Copyright and Secondary Nav
  const copyrightWrapRow = document.createElement('div');
  copyrightWrapRow.classList.add('row', 'align-items-lg-end', 'copyright-wrap');

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');
  secondaryNavCol.append(secondaryNavUl);
  copyrightWrapRow.append(secondaryNavCol);

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  if (copyrightTextCell) {
    moveInstrumentation(copyrightTextCell, copyrightTextCol);
    while (copyrightTextCell.firstChild) copyrightTextCol.append(copyrightTextCell.firstChild);
  }
  copyrightWrapRow.append(copyrightTextCol);

  // Filter out the root fields already processed to get item rows
  const processedRootRows = [
    children.find(row => row.querySelector('.logo picture')),
    children.find(row => row.querySelector('.logo a')),
    children.find(row => row.textContent.includes('Copyright©')),
  ].filter(Boolean); // Filter out any undefined/null entries

  const itemRows = children.filter(row => !processedRootRows.includes(row));

  itemRows.forEach((row) => {
    const cells = [...row.children];

    // Social Link Item (2 cells: icon, link)
    if (cells.length === 2 && cells[0].querySelector('picture') && cells[1].querySelector('a')) {
      const socialLi = document.createElement('li');
      moveInstrumentation(row, socialLi);

      const iconCell = cells[0];
      const linkCell = cells[1];

      const socialLink = document.createElement('a');
      socialLink.href = linkCell.querySelector('a')?.href || '#';
      socialLink.target = '_blank'; // Assuming social links open in new tab

      const picture = iconCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]); // Adjust width as needed
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          socialLink.append(optimizedPic);
        }
      } else {
        // If no picture, just append the content of the icon cell
        moveInstrumentation(iconCell, socialLink);
        while (iconCell.firstChild) socialLink.append(iconCell.firstChild);
      }

      socialLi.append(socialLink);
      socialUl.append(socialLi);

      // Add specific classes based on content, if needed (e.g., fb, tw)
      const linkHref = socialLink.href.toLowerCase();
      if (linkHref.includes('facebook')) socialLi.classList.add('fb');
      else if (linkHref.includes('twitter')) socialLi.classList.add('tw');
      else if (linkHref.includes('instagram')) socialLi.classList.add('inst');
      else if (linkHref.includes('youtube')) socialLi.classList.add('yt');
      else if (linkHref.includes('linkedin')) socialLi.classList.add('in');
    }
    // Footer Navigation Item or Secondary Nav Item (3 cells: label, link, hierarchy-tree)
    else if (cells.length === 3 && cells[2].querySelector('ul')) { // Check for hierarchy-tree richtext
      const labelCell = cells[0];
      const linkCell = cells[1];
      const hierarchyCell = cells[2];

      const linkBlocksDiv = document.createElement('div');
      linkBlocksDiv.classList.add('link-blocks');

      const headDiv = document.createElement('div');
      headDiv.classList.add('head');

      const span = document.createElement('span');
      const mainLink = document.createElement('a');
      mainLink.href = linkCell.querySelector('a')?.href || '#';
      mainLink.textContent = labelCell.textContent;
      moveInstrumentation(labelCell, mainLink);
      moveInstrumentation(linkCell, mainLink);
      span.append(mainLink);

      const small = document.createElement('small');
      small.setAttribute('data-once', 'footerMobileInner');
      span.append(small);
      headDiv.append(span);

      if (hierarchyCell) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML; // Use innerHTML for richtext
        moveInstrumentation(hierarchyCell, tempDiv);

        const ul = document.createElement('ul');
        ul.classList.add('footer-inner-list');

        // Move children from tempDiv to new ul, applying classes
        while (tempDiv.firstChild) {
          const child = tempDiv.firstChild;
          if (child.nodeType === Node.ELEMENT_NODE) {
            // Apply classes to all nested elements based on ORIGINAL HTML
            child.querySelectorAll('a').forEach((link) => {
              // No specific class for <a> in ORIGINAL HTML for these nested links,
              // but if there were, they would be added here.
            });
            child.querySelectorAll('li').forEach((li) => {
              // No specific class for <li> in ORIGINAL HTML for these nested list items,
              // but if there were, they would be added here.
            });
            child.querySelectorAll('ul').forEach((subUl) => {
              subUl.classList.add('footer-inner-list'); // Apply class from ORIGINAL HTML
            });
            ul.append(child);
          } else {
            tempDiv.removeChild(child); // Remove non-element nodes like text
          }
        }
        headDiv.append(ul);
      }
      linkBlocksDiv.append(headDiv);

      // Determine if it's a footer navigation or secondary navigation
      // Secondary nav items typically have a flat structure, while footer nav has hierarchy.
      // The BlockJson defines secondary-nav-item with a hierarchy-tree, so we need a better heuristic.
      // A common pattern is that secondary nav items are just a label and a link,
      // and their 'hierarchy-tree' cell might be empty or contain a flat list.
      // Let's assume if the hierarchyCell contains only a single <ul> with direct <li><a> children,
      // it's a secondary nav item, otherwise it's a main footer nav item.
      const isSecondaryNavItem = hierarchyCell.querySelector('ul > li > a') && !hierarchyCell.querySelector('ul > li > ul');

      if (isSecondaryNavItem) {
        // If it's a secondary nav item, flatten it into the secondaryNavUl
        const tempUl = document.createElement('ul');
        tempUl.innerHTML = hierarchyCell.innerHTML;
        tempUl.querySelectorAll('li').forEach((li) => {
          const link = li.querySelector('a');
          if (link) {
            const newLi = document.createElement('li');
            const newLink = document.createElement('a');
            newLink.href = link.href;
            newLink.textContent = link.textContent;
            moveInstrumentation(link, newLink);
            newLi.append(newLink);
            secondaryNavUl.append(newLi);
          }
        });
      } else {
        footerMenu.append(linkBlocksDiv);
      }
    }
  });

  footerMain.append(footerHeaderRow, footerMenuBoxRow, copyrightWrapRow);

  block.textContent = '';
  block.append(footerMain);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Event listeners for mobile navigation (assuming small tag is a toggle)
  block.querySelectorAll('.link-blocks .head span').forEach((span) => {
    const smallTag = span.querySelector('small[data-once="footerMobileInner"]');
    if (smallTag) {
      const ul = span.nextElementSibling; // The ul.footer-inner-list
      if (ul) {
        span.addEventListener('click', () => {
          ul.classList.toggle('active'); // Use 'active' class for showing/hiding
          span.closest('.link-blocks').classList.toggle('active'); // Toggle parent for styling
        });
      }
    }
  });

  // Handle nested dropdowns within footer-inner-list
  block.querySelectorAll('.footer-inner-list li > span[data-once="footerClickEvent"]').forEach((span) => {
    const nextSibling = span.nextElementSibling;
    if (nextSibling && (nextSibling.classList.contains('has-footer-sub-child') || nextSibling.classList.contains('has-footer-inner-sub-child'))) {
      span.addEventListener('click', () => {
        nextSibling.classList.toggle('active');
        // Check if it's an inner child toggle
        if (span.classList.contains('innerFooterClickEvent')) {
          nextSibling.classList.toggle('active-inner-child');
        }
      });
    }
  });
}
