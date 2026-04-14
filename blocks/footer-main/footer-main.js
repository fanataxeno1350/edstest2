import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const footerHeaderRow = document.createElement('div');
  footerHeaderRow.classList.add('row', 'footer-header');
  containerDiv.append(footerHeaderRow);

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  footerHeaderRow.append(logoCol);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  logoCol.append(logoDiv);

  // CRITICAL FIX: Use content detection for root fields
  const logoCell = children.find(row => row.querySelector('picture') && !row.querySelector('a') && !row.querySelector('p'));
  const logoLinkCell = children.find(row => row.querySelector('a') && !row.querySelector('picture') && !row.querySelector('p'));
  const copyrightTextCell = children.find(row => row.querySelector('p') && !row.querySelector('picture') && !row.querySelector('a'));

  if (logoLinkCell) {
    const logoLink = document.createElement('a');
    logoLink.href = logoLinkCell.querySelector('a')?.href || '#';
    moveInstrumentation(logoLinkCell, logoLink);
    if (logoCell) {
      const picture = logoCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
        optimizedPic.querySelector('img').classList.add('hiddenlogo1');
        optimizedPic.querySelector('img').setAttribute('width', '200');
        optimizedPic.querySelector('img').setAttribute('height', '30');
        optimizedPic.querySelector('img').style.width = 'auto';
        optimizedPic.querySelector('img').setAttribute('loading', 'lazy');
        moveInstrumentation(logoCell, optimizedPic.querySelector('img'));
        logoLink.append(optimizedPic);
      }
    }
    logoDiv.append(logoLink);
  } else if (logoCell) {
    const picture = logoCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      optimizedPic.querySelector('img').classList.add('hiddenlogo1');
      optimizedPic.querySelector('img').setAttribute('width', '200');
      optimizedPic.querySelector('img').setAttribute('height', '30');
      optimizedPic.querySelector('img').style.width = 'auto';
      optimizedPic.querySelector('img').setAttribute('loading', 'lazy');
      moveInstrumentation(logoCell, optimizedPic.querySelector('img'));
      logoDiv.append(optimizedPic);
    }
  }

  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeaderRow.append(socialCol);

  const socialUl = document.createElement('ul');
  socialUl.classList.add('social-wrap');
  socialCol.append(socialUl);

  const footerMenuBoxRow = document.createElement('div');
  footerMenuBoxRow.classList.add('row', 'footer-menu-box');
  containerDiv.append(footerMenuBoxRow);

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  footerMenuBoxRow.append(footerMenuCol);

  const footerMenuDiv = document.createElement('div');
  footerMenuDiv.classList.add('footer-menu');
  footerMenuCol.append(footerMenuDiv);

  const copyrightWrapRow = document.createElement('div');
  copyrightWrapRow.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  containerDiv.append(copyrightWrapRow);

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  copyrightWrapRow.append(secondaryNavCol);

  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');
  secondaryNavCol.append(secondaryNavUl);

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  if (copyrightTextCell) {
    moveInstrumentation(copyrightTextCell, copyrightTextCol);
    while (copyrightTextCell.firstChild) {
      copyrightTextCol.append(copyrightTextCell.firstChild);
    }
  }
  copyrightWrapRow.append(copyrightTextCol);

  // Filter out the already processed root fields to get item rows
  const processedRootCells = [logoCell, logoLinkCell, copyrightTextCell].filter(Boolean);
  const itemRows = children.filter(row => !processedRootCells.includes(row));

  itemRows.forEach((row) => {
    const cells = [...row.children];

    // Detect footer-social-link (2 cells: icon, link)
    const socialIconCell = cells.find(c => c.querySelector('picture'));
    const socialLinkCell = cells.find(c => c.querySelector('a') && !c.querySelector('picture'));
    if (socialIconCell && socialLinkCell && cells.length === 2) {
      const li = document.createElement('li');
      // Dynamically determine social class from link href or alt text if possible,
      // otherwise default to 'fb' as in original HTML example.
      // For now, using a generic approach.
      const linkHref = socialLinkCell.querySelector('a')?.href || '';
      if (linkHref.includes('facebook')) li.classList.add('fb');
      else if (linkHref.includes('twitter')) li.classList.add('tw');
      else if (linkHref.includes('instagram')) li.classList.add('inst');
      else if (linkHref.includes('youtube')) li.classList.add('yt');
      else if (linkHref.includes('linkedin')) li.classList.add('in');
      else li.classList.add('fb'); // Default

      const link = document.createElement('a');
      link.href = socialLinkCell.querySelector('a')?.href || '#';
      link.target = '_blank';
      moveInstrumentation(socialLinkCell, link);

      const picture = socialIconCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]);
        moveInstrumentation(socialIconCell, optimizedPic.querySelector('img'));
        link.append(optimizedPic);
      }
      li.append(link);
      socialUl.append(li);
      return;
    }

    // Detect footer-link-block (3 cells: blockTitle, blockTitleLink, links container)
    // The 'links' cell contains just "Links value" text, not the actual nested links.
    // The nested links are separate item rows (footer-link-item).
    const blockTitleCell = cells.find(c => !c.querySelector('a') && !c.querySelector('ul') && !c.querySelector('picture') && c.textContent.trim() !== 'Links value');
    const blockTitleLinkCell = cells.find(c => c.querySelector('a') && !c.querySelector('ul'));
    const linksContainerPlaceholderCell = cells.find(c => c.textContent.trim() === 'Links value'); // This cell is just a placeholder

    if (blockTitleCell && blockTitleLinkCell && linksContainerPlaceholderCell && cells.length === 3) {
      const linkBlocksDiv = document.createElement('div');
      linkBlocksDiv.classList.add('link-blocks');
      // Check for specific classes from original HTML for link blocks
      if (blockTitleCell.textContent.trim().toLowerCase() === 'what we do') {
        linkBlocksDiv.classList.add('what-we-do-footer-links');
      } else if (blockTitleCell.textContent.trim().toLowerCase() === 'careers') {
        linkBlocksDiv.classList.add('careers-footer-links');
      }
      footerMenuDiv.append(linkBlocksDiv);

      const headDiv = document.createElement('div');
      headDiv.classList.add('head');
      linkBlocksDiv.append(headDiv);

      const span = document.createElement('span');
      const blockLink = document.createElement('a');
      blockLink.href = blockTitleLinkCell.querySelector('a')?.href || '#';
      blockLink.textContent = blockTitleCell.textContent.trim();
      moveInstrumentation(blockTitleCell, blockLink);
      moveInstrumentation(blockTitleLinkCell, blockLink);
      span.append(blockLink);

      const small = document.createElement('small');
      small.setAttribute('data-once', 'footerMobileInner');
      span.append(small);
      headDiv.append(span);

      const ul = document.createElement('ul');
      ul.classList.add('footer-inner-list');
      headDiv.append(ul);

      // Add event listener for mobile accordion behavior
      span.addEventListener('click', () => {
        linkBlocksDiv.classList.toggle('active');
      });

      return;
    }

    // Detect footer-link-item or footer-secondary-nav-item (2 or 3 cells)
    // - 2 cells: label, link (for secondary nav items without hierarchy)
    // - 3 cells: label, link, hierarchy-tree (for footer link items or secondary nav items with hierarchy)
    const itemLabelCell = cells.find(c => !c.querySelector('a') && !c.querySelector('ul') && !c.querySelector('picture'));
    const itemLinkCell = cells.find(c => c.querySelector('a') && !c.querySelector('ul'));
    const hierarchyTreeCell = cells.find(c => c.querySelector('ul')); // This is the richtext field

    if (itemLabelCell && itemLinkCell) {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = itemLinkCell.querySelector('a')?.href || '#';
      link.textContent = itemLabelCell.textContent.trim();
      moveInstrumentation(itemLabelCell, link);
      moveInstrumentation(itemLinkCell, link);
      li.append(link);

      if (hierarchyTreeCell) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyTreeCell.innerHTML; // CRITICAL: Use innerHTML for richtext
        moveInstrumentation(hierarchyTreeCell, tempDiv);

        // Apply classes from ORIGINAL HTML to nested elements
        tempDiv.querySelectorAll('a').forEach((a) => {
          // No specific classes for nested <a> in original HTML, but keep this for future
        });
        tempDiv.querySelectorAll('ul').forEach((ulEl) => {
          ulEl.classList.add('has-footer-sub-child');
          ulEl.setAttribute('data-once', 'hideFooterSubChild');
        });
        tempDiv.querySelectorAll('li').forEach((liEl) => {
          // No specific classes for nested <li> in original HTML, but keep this for future
        });

        // Add small element and image for expand/collapse if present in original HTML
        const expandIcon = document.createElement('span');
        expandIcon.setAttribute('data-once', 'footerClickEvent');
        const img = document.createElement('img');
        img.alt = 'svg file';
        img.src = '/content/dam/aemigrate/uploaded-folder/image/1776185160717.svg+xml'; // Example SVG from original HTML
        expandIcon.append(img);
        li.append(expandIcon); // Place after the main link

        // Add event listener for nested accordion behavior
        expandIcon.addEventListener('click', () => {
          li.classList.toggle('active'); // Toggle active class on li
          tempDiv.classList.toggle('active'); // Toggle active class on the sub-menu container
        });

        while (tempDiv.firstChild) {
          li.append(tempDiv.firstChild);
        }
      }

      // Determine if this item belongs to a link-block or secondary-nav
      const lastLinkBlock = footerMenuDiv.lastElementChild;
      if (lastLinkBlock && lastLinkBlock.classList.contains('link-blocks')) {
        const innerList = lastLinkBlock.querySelector('.footer-inner-list');
        if (innerList) {
          innerList.append(li);
        } else {
          // Fallback if innerList not found, append to secondaryNavUl
          secondaryNavUl.append(li);
        }
      } else {
        // If it's not part of a link-block, assume it's a secondary nav item
        secondaryNavUl.append(li);
      }
    }
  });

  block.textContent = '';
  block.append(containerDiv);

  // Image optimization (moved to end to ensure all images are present)
  block.querySelectorAll('picture > img').forEach((img) => {
    // Only optimize images that haven't been optimized already (e.g., logo)
    if (!img.closest('.logo')) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
    }
  });
}
