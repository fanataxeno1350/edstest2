import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, isInner = false) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');
    let triggerEl;

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
        triggerEl = span;
      }
    } else {
      triggerEl = anchor;
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add(isInner ? 'has-footer-inner-sub-child' : 'has-footer-sub-child');
      subWrap.append(nested);
      li.append(subWrap);

      const arrowSvg = `
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
      const span = document.createElement('span');
      span.innerHTML = arrowSvg;
      if (triggerEl) {
        triggerEl.after(span);
        triggerEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
        span.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }

      transformNestedLists(nested, true);
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Root fields: logo, logoLink, copyrightText.
  // Item rows for socialLinks, footerMenuBlocks, secondaryNav follow after these.
  const logoRow = children[0];
  const logoLinkRow = children[1];
  const copyrightTextRow = children[2];
  const itemRows = children.slice(3);

  block.innerHTML = '';
  const container = document.createElement('div');
  container.classList.add('container');
  block.append(container);

  // Footer Header
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
  logoDiv.append(logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
    optimizedPic.querySelector('img').classList.add('hiddenlogo1');
    optimizedPic.querySelector('img').width = 200;
    optimizedPic.querySelector('img').height = 30;
    optimizedPic.querySelector('img').style.width = 'auto';
  }

  // Social Links
  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeader.append(socialCol);

  const socialWrap = document.createElement('ul');
  socialWrap.classList.add('social-wrap');
  socialCol.append(socialWrap);

  // Filter for social-link-item: 2 cells, second cell contains a UL (hierarchy-tree)
  const socialLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[1].querySelector('ul');
  });

  socialLinkItems.forEach((row) => {
    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a')); // aem-content: link
    const hierarchyCell = cells.find(cell => cell.querySelector('ul')); // richtext: hierarchy-tree

    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.target = '_blank'; // Assuming social links open in new tab
    }
    moveInstrumentation(linkCell, anchor);

    if (hierarchyCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML; // Use innerHTML for richtext
      const firstLi = tempDiv.querySelector('li');
      if (firstLi) {
        const iconContent = firstLi.innerHTML;
        const svgMatch = iconContent.match(/<svg.*?<\/svg>/s);
        const imgMatch = iconContent.match(/<img.*?src="(.*?)"[^>]*>/);

        if (svgMatch) {
          anchor.innerHTML = svgMatch[0];
          // Add classes based on content, assuming specific strings indicate social media type
          if (iconContent.includes('fb')) li.classList.add('fb');
          else if (iconContent.includes('tw')) li.classList.add('tw');
          else if (iconContent.includes('inst')) li.classList.add('inst');
          else if (iconContent.includes('yt')) li.classList.add('yt');
          else if (iconContent.includes('in')) li.classList.add('in');
        } else if (imgMatch) {
          const img = document.createElement('img');
          img.src = imgMatch[1];
          anchor.append(img);
        }
      }
    }
    li.append(anchor);
    socialWrap.append(li);
  });

  // Footer Menu Blocks
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  container.append(footerMenuBox);

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  footerMenuBox.append(footerMenuCol);

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');
  footerMenuCol.append(footerMenu);

  // Filter for footer-menu-block: 3 cells, third cell contains text 'Menu Items value'
  const footerMenuBlockItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[2].textContent.trim() === 'Menu Items value';
  });

  footerMenuBlockItems.forEach((row) => {
    const cells = [...row.children];
    const blockTitleCell = cells.find(cell => !cell.querySelector('a') && cell.textContent.trim() !== 'Menu Items value'); // text: blockTitle
    const blockTitleLinkCell = cells.find(cell => cell.querySelector('a')); // aem-content: blockTitleLink

    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    footerMenu.append(linkBlocks);

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');
    linkBlocks.append(headDiv);

    const span = document.createElement('span');
    headDiv.append(span);

    const blockTitleLink = document.createElement('a');
    const foundBlockTitleLink = blockTitleLinkCell.querySelector('a');
    if (foundBlockTitleLink) {
      blockTitleLink.href = foundBlockTitleLink.href;
    }
    blockTitleLink.textContent = blockTitleCell.textContent.trim();
    moveInstrumentation(blockTitleLinkCell, blockTitleLink);
    span.append(blockTitleLink);

    const small = document.createElement('small');
    span.append(small);

    const ul = document.createElement('ul');
    ul.classList.add('footer-inner-list');
    headDiv.append(ul);

    // Filter for footer-menu-item rows that belong to this block
    // footer-menu-item: 3 cells, third cell contains a UL (hierarchy-tree)
    const menuItems = itemRows.filter((itemRow) => {
      const cells = [...itemRow.children];
      return cells.length === 3 && cells[2].querySelector('ul');
    });

    menuItems.forEach((menuItemRow) => {
      const cells = [...menuItemRow.children];
      const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('ul')); // text: label
      const linkCell = cells.find(cell => cell.querySelector('a')); // aem-content: link
      const hierarchyCell = cells.find(cell => cell.querySelector('ul')); // richtext: hierarchy-tree

      const li = document.createElement('li');
      ul.append(li);

      const foundLink = linkCell.querySelector('a');
      let rootEl;
      if (foundLink) {
        rootEl = document.createElement('a');
        rootEl.href = foundLink.href;
      } else {
        rootEl = document.createElement('span');
      }
      rootEl.textContent = labelCell.textContent.trim();
      moveInstrumentation(linkCell, rootEl);
      li.appendChild(rootEl);

      if (hierarchyCell) {
        const hierarchyRoot = hierarchyCell.querySelector('ul');
        if (hierarchyRoot) {
          const wrapper = document.createElement('div');
          wrapper.classList.add('has-footer-sub-child');
          // Move the actual UL content, not just innerHTML
          moveInstrumentation(hierarchyCell, hierarchyRoot);
          wrapper.appendChild(hierarchyRoot);

          rootEl.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            li.classList.toggle('active');
            wrapper.classList.toggle('active');
          });
          const arrowSvg = `
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
          const arrowSpan = document.createElement('span');
          arrowSpan.innerHTML = arrowSvg;
          rootEl.after(arrowSpan);
          arrowSpan.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            li.classList.toggle('active');
            wrapper.classList.toggle('active');
          });
          li.appendChild(wrapper);
          transformNestedLists(hierarchyRoot);
        }
      }
    });
  });

  // Copyright and Secondary Nav
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightWrap);

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  copyrightWrap.append(secondaryNavCol);

  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');
  secondaryNavCol.append(secondaryNavUl);

  // Filter for footer-secondary-nav-item: 2 cells, second cell does NOT contain a UL
  const secondaryNavItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && !cells[1].querySelector('ul');
  });

  secondaryNavItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a')); // text: label
    const linkCell = cells.find(cell => cell.querySelector('a')); // aem-content: link

    const li = document.createElement('li');
    secondaryNavUl.append(li);

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(linkCell, anchor);
    li.append(anchor);
  });

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  copyrightTextCol.textContent = copyrightTextRow.textContent.trim();
  moveInstrumentation(copyrightTextRow, copyrightTextCol);
  copyrightWrap.append(copyrightTextCol);
}
