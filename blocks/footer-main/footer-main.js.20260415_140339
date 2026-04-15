import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  // Footer Header Section
  const footerHeaderRow = document.createElement('div');
  footerHeaderRow.classList.add('row', 'footer-header');

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  // CRITICAL FIX: Replaced direct index access with content detection
  const logoCell = children.find((row) => row.querySelector('picture') && !row.querySelector('a'));
  const logoLinkCell = children.find((row) => row.querySelector('a') && !row.querySelector('picture'));

  if (logoLinkCell) {
    const logoLink = document.createElement('a');
    logoLink.href = logoLinkCell.querySelector('a').href;
    moveInstrumentation(logoLinkCell, logoLink);

    if (logoCell) {
      const picture = logoCell.querySelector('picture');
      const img = picture ? picture.querySelector('img') : null;
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
        optimizedPic.querySelector('img').classList.add('hiddenlogo1');
        optimizedPic.querySelector('img').style.width = 'auto';
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        logoLink.append(optimizedPic);
      }
    }
    logoDiv.append(logoLink);
  } else if (logoCell) {
    const picture = logoCell.querySelector('picture');
    const img = picture ? picture.querySelector('img') : null;
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      optimizedPic.querySelector('img').classList.add('hiddenlogo1');
      optimizedPic.querySelector('img').style.width = 'auto';
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoDiv.append(optimizedPic);
    }
  }
  logoCol.append(logoDiv);
  footerHeaderRow.append(logoCol);

  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  const socialUl = document.createElement('ul');
  socialUl.classList.add('social-wrap');

  const copyrightTextCell = children.find((row) => !row.querySelector('picture') && !row.querySelector('a') && !row.querySelector('ul') && row.textContent.includes('Copyright'));

  // Determine the start index for item rows dynamically
  let firstItemRowIndex = 0;
  if (logoCell) firstItemRowIndex++;
  if (logoLinkCell) firstItemRowIndex++;
  if (copyrightTextCell) firstItemRowIndex++;

  const itemRows = children.slice(firstItemRowIndex);

  const socialLinkItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('picture'));
  const menuBlockItems = itemRows.filter((row) => row.children.length === 4 && row.querySelector('ul'));
  const secondaryNavItemItems = itemRows.filter((row) => row.children.length === 3 && row.querySelector('ul'));

  socialLinkItems.forEach((row) => {
    const socialLi = document.createElement('li');
    // Add specific classes from original HTML if available, e.g., 'fb', 'tw', etc.
    // This would require more sophisticated content detection or a mapping.
    // For now, assuming these are added via CSS or not strictly required from JS.
    moveInstrumentation(row, socialLi);

    const iconCell = [...row.children].find((cell) => cell.querySelector('picture'));
    const linkCell = [...row.children].find((cell) => cell.querySelector('a'));

    if (linkCell) {
      const link = document.createElement('a');
      link.href = linkCell.querySelector('a').href;
      link.target = '_blank';
      moveInstrumentation(linkCell, link);

      if (iconCell) {
        const picture = iconCell.querySelector('picture');
        const img = picture ? picture.querySelector('img') : null;
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '30' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          link.append(optimizedPic);
        }
      }
      socialLi.append(link);
    }
    socialUl.append(socialLi);
  });

  socialCol.append(socialUl);
  footerHeaderRow.append(socialCol);
  containerDiv.append(footerHeaderRow);

  // Footer Menu Box Section
  const footerMenuBoxRow = document.createElement('div');
  footerMenuBoxRow.classList.add('row', 'footer-menu-box');
  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  const footerMenuDiv = document.createElement('div');
  footerMenuDiv.classList.add('footer-menu');

  menuBlockItems.forEach((row) => {
    const linkBlocksDiv = document.createElement('div');
    linkBlocksDiv.classList.add('link-blocks');
    moveInstrumentation(row, linkBlocksDiv);

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');

    const titleCell = [...row.children].find((cell) => !cell.querySelector('a') && !cell.querySelector('ul') && cell.textContent.trim() !== '');
    const titleLinkCell = [...row.children].find((cell) => cell.querySelector('a') && !cell.querySelector('ul'));
    const hierarchyCell = [...row.children].find((cell) => cell.querySelector('ul'));

    if (titleLinkCell) {
      const span = document.createElement('span');
      const titleLink = document.createElement('a');
      titleLink.href = titleLinkCell.querySelector('a').href;
      titleLink.textContent = titleLinkCell.querySelector('a').textContent;
      moveInstrumentation(titleLinkCell, titleLink);
      span.append(titleLink);
      const small = document.createElement('small');
      small.setAttribute('data-once', 'footerMobileInner');
      span.append(small);
      headDiv.append(span);
    } else if (titleCell) {
      const span = document.createElement('span');
      span.textContent = titleCell.textContent;
      const small = document.createElement('small');
      small.setAttribute('data-once', 'footerMobileInner');
      span.append(small);
      headDiv.append(span);
    }

    if (hierarchyCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;

      tempDiv.querySelectorAll('ul').forEach((ul) => {
        ul.classList.add('footer-inner-list');
      });
      tempDiv.querySelectorAll('li').forEach((li) => {
        // Add classes for nested interactive elements if they exist in the original HTML
        // e.g., li.classList.add('some-class');
        // The original HTML shows <li> containing <span> with data-once attributes
        // We need to ensure these are preserved or recreated.
        const originalLi = hierarchyCell.querySelector(`li:has(a[href="${li.querySelector('a')?.href}"])`);
        if (originalLi) {
          [...originalLi.classList].forEach(cls => li.classList.add(cls));
          // Re-add data-once spans if they were part of the original li structure
          originalLi.querySelectorAll('span[data-once]').forEach(span => {
            const newSpan = document.createElement('span');
            [...span.attributes].forEach(attr => newSpan.setAttribute(attr.name, attr.value));
            if (span.querySelector('img')) {
              const img = span.querySelector('img').cloneNode(true);
              newSpan.append(img);
            }
            li.append(newSpan);
          });
          if (originalLi.querySelector('.has-footer-sub-child')) {
            const subChildDiv = document.createElement('div');
            subChildDiv.classList.add('has-footer-sub-child');
            subChildDiv.setAttribute('data-once', 'hideFooterSubChild');
            // Move content from original sub-child
            const originalSubChild = originalLi.querySelector('.has-footer-sub-child');
            if (originalSubChild) {
              while (originalSubChild.firstChild) {
                subChildDiv.append(originalSubChild.firstChild);
              }
            }
            li.append(subChildDiv);
          }
        }
      });
      tempDiv.querySelectorAll('a').forEach((link) => {
        // No specific classes for a in original HTML for this context
      });

      moveInstrumentation(hierarchyCell, tempDiv);
      while (tempDiv.firstChild) {
        headDiv.append(tempDiv.firstChild);
      }
    }
    linkBlocksDiv.append(headDiv);
    footerMenuDiv.append(linkBlocksDiv);
  });

  footerMenuCol.append(footerMenuDiv);
  footerMenuBoxRow.append(footerMenuCol);
  containerDiv.append(footerMenuBoxRow);

  // Copyright and Secondary Nav Section
  const copyrightWrapRow = document.createElement('div');
  copyrightWrapRow.classList.add('row', 'align-items-lg-end', 'copyright-wrap');

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');

  secondaryNavItemItems.forEach((row) => {
    const secondaryNavLi = document.createElement('li');
    moveInstrumentation(row, secondaryNavLi);

    const labelCell = [...row.children].find((cell) => !cell.querySelector('a') && !cell.querySelector('ul') && cell.textContent.trim() !== '');
    const linkCell = [...row.children].find((cell) => cell.querySelector('a') && !cell.querySelector('ul'));
    // The third cell is 'hierarchy-tree' but it's not used in the secondary nav rendering in the original HTML
    // const hierarchyCell = [...row.children].find((cell) => cell.querySelector('ul'));

    if (linkCell) {
      const link = document.createElement('a');
      link.href = linkCell.querySelector('a').href;
      link.textContent = linkCell.querySelector('a').textContent;
      moveInstrumentation(linkCell, link);
      secondaryNavLi.append(link);
    } else if (labelCell) {
      secondaryNavLi.textContent = labelCell.textContent;
    }
    secondaryNavUl.append(secondaryNavLi);
  });

  secondaryNavCol.append(secondaryNavUl);
  copyrightWrapRow.append(secondaryNavCol);

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  if (copyrightTextCell) {
    moveInstrumentation(copyrightTextCell, copyrightTextCol);
    copyrightTextCol.innerHTML = copyrightTextCell.innerHTML;
  }
  copyrightWrapRow.append(copyrightTextCol);
  containerDiv.append(copyrightWrapRow);

  block.textContent = '';
  block.append(containerDiv);

  // Image optimization for all pictures within the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Event listeners for mobile menu interaction as seen in original HTML
  block.querySelectorAll('.link-blocks .head span small[data-once="footerMobileInner"]').forEach((small) => {
    const head = small.closest('.head');
    if (head) {
      head.addEventListener('click', () => {
        head.classList.toggle('active');
        const ul = head.querySelector('.footer-inner-list');
        if (ul) {
          ul.classList.toggle('active');
        }
      });
    }
  });

  // Event listener for data-once="footerClickEvent"
  block.querySelectorAll('[data-once="footerClickEvent"]').forEach((span) => {
    const parentLi = span.closest('li');
    if (parentLi) {
      parentLi.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent parent li click from propagating
        const subChild = parentLi.querySelector('.has-footer-sub-child');
        if (subChild) {
          subChild.classList.toggle('active');
          parentLi.classList.toggle('active'); // Add active to parent li for styling
        }
      });
    }
  });

  // Event listener for data-once="innerFooterClickEvent"
  block.querySelectorAll('[data-once="innerFooterClickEvent"]').forEach((span) => {
    const parentLi = span.closest('li');
    if (parentLi) {
      parentLi.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent parent li click from propagating
        const innerSubChild = parentLi.querySelector('.has-footer-inner-sub-child');
        if (innerSubChild) {
          innerSubChild.classList.toggle('active-inner-child');
          parentLi.classList.toggle('active-inner-child'); // Add active to parent li for styling
        }
      });
    }
  });
}
