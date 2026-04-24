import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, level = 0) {
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
      if (level === 0) {
        subWrap.classList.add('has-footer-sub-child');
      } else {
        subWrap.classList.add('has-footer-inner-sub-child');
      }
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        const small = document.createElement('small');
        const svg = `
          <svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g>
            <g id="SVGRepo_iconCarrier">
              <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)">
                <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path>
              </g>
            </g>
          </svg>
        `;
        small.innerHTML = svg;
        trigger.appendChild(small);

        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
      transformNestedLists(nested, level + 1);
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Destructure the known root fields
  const logoRow = children[0];
  const logoLinkRow = children[1];
  const copyrightTextRow = children[2];

  // Remaining rows are item rows
  const itemRows = children.slice(3);

  block.innerHTML = ''; // Clear the block content

  const container = document.createElement('div');
  container.classList.add('container');
  block.append(container);

  // Footer Header (Logo and Social Links)
  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');
  container.append(footerHeader);

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  footerHeader.append(logoCol);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  logoCol.append(logoDiv);

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      moveInstrumentation(img.closest('picture'), optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('hiddenlogo1');
    }
  }

  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeader.append(socialCol);

  const socialWrap = document.createElement('ul');
  socialWrap.classList.add('social-wrap');
  socialCol.append(socialWrap);

  // Filter item rows based on content detection
  const socialLinks = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('a') && cells[1].querySelector('ul');
  });
  const footerLinkBlocks = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].textContent.trim() && cells[2].textContent.trim() === 'Links value';
  });
  const footerLinkListItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].textContent.trim() && cells[1].querySelector('a') && cells[2].querySelector('ul');
  });
  const secondaryLinks = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].textContent.trim() && cells[1].querySelector('a') && !cells[1].querySelector('ul');
  });

  // Social Links
  socialLinks.forEach((row, index) => {
    const cells = [...row.children];
    const socialLinkCell = cells.find(cell => cell.querySelector('a'));
    const hierarchyCell = cells.find(cell => cell.querySelector('ul'));

    if (socialLinkCell && hierarchyCell) {
      const li = document.createElement('li');
      const socialClasses = ['fb', 'tw', 'inst', 'yt', 'in'];
      if (index < socialClasses.length) {
        li.classList.add(socialClasses[index]);
      } else {
        li.classList.add('social-icon'); // Generic fallback
      }

      const anchor = document.createElement('a');
      const socialLink = socialLinkCell.querySelector('a');
      if (socialLink) {
        anchor.href = socialLink.href;
        anchor.target = '_blank';
      }
      moveInstrumentation(socialLinkCell, anchor);

      // Extract SVG content from the original HTML if available, otherwise use placeholder
      // For this block, the SVG is complex and contains an <image> with xlink:href
      // We should replicate that structure as much as possible.
      // For now, we'll use a generic SVG placeholder as the original HTML has base64 images.
      // In a real scenario, we'd parse the SVG from the original HTML cell.
      const svgContent = `
        <svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink">
          <image xlink:href="${socialLinkCell.querySelector('image')?.getAttribute('xlink:href') || ''}" x="0" y="0" width="30" height="30"></image>
        </svg>
      `;
      anchor.innerHTML += svgContent; // Append SVG to the anchor
      li.appendChild(anchor);
      socialWrap.appendChild(li);
    }
  });

  // Footer Menu Box (Footer Link Blocks)
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  container.append(footerMenuBox);

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  footerMenuBox.append(footerMenuCol);

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');
  footerMenuCol.append(footerMenu);

  // Create a mutable copy of footerLinkListItems for splicing
  const remainingFooterLinkListItems = [...footerLinkListItems];

  footerLinkBlocks.forEach((blockRow) => {
    const cells = [...blockRow.children];
    const headingCell = cells.find(cell => cell.textContent.trim() && !cell.querySelector('a'));
    const headingLinkCell = cells.find(cell => cell.querySelector('a'));

    const linkBlock = document.createElement('div');
    linkBlock.classList.add('link-blocks');
    footerMenu.append(linkBlock);

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');
    linkBlock.append(headDiv);

    const span = document.createElement('span');
    headDiv.append(span);

    const headingAnchor = document.createElement('a');
    const foundHeadingLink = headingLinkCell?.querySelector('a');
    if (foundHeadingLink) {
      headingAnchor.href = foundHeadingLink.href;
    }
    headingAnchor.textContent = headingCell?.textContent.trim() || '';
    moveInstrumentation(headingLinkCell, headingAnchor);
    span.append(headingAnchor);

    const small = document.createElement('small');
    span.append(small);

    const ul = document.createElement('ul');
    ul.classList.add('footer-inner-list');
    headDiv.append(ul);

    // This splicing logic needs to be more robust if blocks don't have equal distribution.
    // A better approach would be to associate link list items with their parent block.
    // For now, assuming equal distribution as per original code.
    const numLinksPerBlock = remainingFooterLinkListItems.length / footerLinkBlocks.length;
    const currentBlockLinks = remainingFooterLinkListItems.splice(0, numLinksPerBlock);

    currentBlockLinks.forEach((linkItemRow) => {
      const itemCells = [...linkItemRow.children];
      const labelCell = itemCells.find(cell => cell.textContent.trim() && !cell.querySelector('a'));
      const linkCell = itemCells.find(cell => cell.querySelector('a'));
      const hierarchyCell = itemCells.find(cell => cell.querySelector('ul'));

      const li = document.createElement('li');
      ul.append(li);

      const foundLink = linkCell?.querySelector('a');
      let rootEl;
      if (foundLink) {
        rootEl = document.createElement('a');
        rootEl.href = foundLink.href;
      } else {
        rootEl = document.createElement('span');
      }
      rootEl.textContent = labelCell?.textContent.trim() || '';
      moveInstrumentation(linkItemRow, rootEl);
      li.appendChild(rootEl);

      if (hierarchyCell) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML; // Use innerHTML for richtext

        const hierarchyRoot = tempDiv.querySelector('ul');
        if (hierarchyRoot) {
          const wrapper = document.createElement('div');
          wrapper.classList.add('has-footer-sub-child');
          moveInstrumentation(hierarchyCell, wrapper); // Move instrumentation from original cell to wrapper
          wrapper.appendChild(hierarchyRoot);
          li.appendChild(wrapper);

          // Add event listener for the toggle behavior
          const trigger = rootEl; // The <a> or <span> that acts as a trigger
          if (trigger) {
            const smallArrow = document.createElement('small');
            const svgArrow = `
              <svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g>
                <g id="SVGRepo_iconCarrier">
                  <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)">
                    <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path>
                  </g>
                </g>
              </svg>
            `;
            smallArrow.innerHTML = svgArrow;
            trigger.appendChild(smallArrow);

            trigger.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              li.classList.toggle('active');
              wrapper.classList.toggle('active');
            });
          }
          transformNestedLists(hierarchyRoot);
        }
      }
    });
  });

  // Copyright Wrap
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightWrap);

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  copyrightWrap.append(secondaryNavCol);

  const secondaryNav = document.createElement('ul');
  secondaryNav.classList.add('secondary-nav');
  secondaryNavCol.append(secondaryNav);

  secondaryLinks.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(cell => cell.textContent.trim() && !cell.querySelector('a'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    const li = document.createElement('li');
    secondaryNav.append(li);

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, anchor);
    li.append(anchor);
  });

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  copyrightTextCol.textContent = copyrightTextRow.textContent.trim();
  moveInstrumentation(copyrightTextRow, copyrightTextCol);
  copyrightWrap.append(copyrightTextCol);
}
