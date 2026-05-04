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
      subWrap.classList.add('has-footer-sub-child'); // Use original HTML class
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
  const children = [...block.children];

  const [logoRow, logoLinkRow, copyrightTextRow, ...itemRows] = children;

  block.innerHTML = '';
  const container = document.createElement('div');
  container.classList.add('container');
  block.append(container);

  // Footer Header Section (Logo and Social Links)
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
  const logoA = logoLinkRow.querySelector('a');
  if (logoA) {
    logoLink.href = logoA.href;
  }

  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('hiddenlogo1');
      optimizedImg.width = '200';
      optimizedImg.height = '30';
      optimizedImg.style.width = 'auto';
      moveInstrumentation(img, optimizedImg);
      logoLink.append(optimizedPic);
    }
  }
  logoDiv.append(logoLink);
  moveInstrumentation(logoRow, logoDiv);
  moveInstrumentation(logoLinkRow, logoLink);

  const socialLinksCol = document.createElement('div');
  socialLinksCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeader.append(socialLinksCol);

  const socialWrap = document.createElement('ul');
  socialWrap.classList.add('social-wrap');
  socialLinksCol.append(socialWrap);

  // Filter item rows based on their structure and content
  const socialLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].querySelector('picture') && cells[1].querySelector('a');
  });
  const footerLinkGroups = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && !cells[0].querySelector('picture') && cells[1].querySelector('a');
  });
  const secondaryLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[1].querySelector('a');
  });

  socialLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(c => c.querySelector('picture'));
    const linkCell = cells.find(c => c.querySelector('a'));
    // The hierarchyCell is present in the model but not used in the current rendering for social links.
    // const hierarchyCell = cells.find(c => c.querySelector('ul'));

    const li = document.createElement('li');

    const socialAnchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      socialAnchor.href = foundLink.href;
      socialAnchor.target = '_blank';
    }

    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '30' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        optimizedImg.width = '30';
        optimizedImg.height = '30';
        moveInstrumentation(img, optimizedImg);
        socialAnchor.append(optimizedPic);
      }
    }
    li.append(socialAnchor);
    socialWrap.append(li);
    moveInstrumentation(row, li);
  });

  // Footer Menu Box
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  container.append(footerMenuBox);

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  footerMenuBox.append(footerMenuCol);

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');
  footerMenuCol.append(footerMenu);

  footerLinkGroups.forEach((row) => {
    const cells = [...row.children];
    const groupTitleCell = cells.find(c => !c.querySelector('a') && !c.querySelector('picture') && !c.querySelector('ul'));
    const groupLinkCell = cells.find(c => c.querySelector('a'));
    // The footerLinksContainerCell is a container field, its items are separate block.children rows.
    // const footerLinksContainerCell = cells.find(c => !c.querySelector('a') && !c.querySelector('picture') && !c.querySelector('ul') && c !== groupTitleCell);

    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    footerMenu.append(linkBlocks);

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');
    linkBlocks.append(headDiv);

    const span = document.createElement('span');
    headDiv.append(span);

    const groupAnchor = document.createElement('a');
    const foundGroupLink = groupLinkCell?.querySelector('a');
    if (foundGroupLink) {
      groupAnchor.href = foundGroupLink.href;
    }
    groupAnchor.textContent = groupTitleCell?.textContent.trim() || '';
    span.append(groupAnchor);

    const small = document.createElement('small');
    span.append(small);

    const footerInnerList = document.createElement('ul');
    footerInnerList.classList.add('footer-inner-list');
    headDiv.append(footerInnerList);

    // Filter for footer-link-item sub-components
    const footerLinkItems = itemRows.filter((itemRow) => {
      const itemCells = [...itemRow.children];
      return itemCells.length === 3 && !itemCells[0].querySelector('picture') && itemCells[1].querySelector('a') && itemCells[2].querySelector('ul');
    });

    footerLinkItems.forEach((itemRow) => {
      const itemCells = [...itemRow.children];
      const labelCell = itemCells.find(c => !c.querySelector('a') && !c.querySelector('picture') && !c.querySelector('ul'));
      const linkCell = itemCells.find(c => c.querySelector('a'));
      const hierarchyCell = itemCells.find(c => c.querySelector('ul'));

      const li = document.createElement('li');

      const hierarchyRoot = hierarchyCell?.querySelector('ul');
      let rootEl;

      if (hierarchyRoot) {
        rootEl = document.createElement('a');
        const foundLink = linkCell?.querySelector('a');
        if (foundLink) {
          rootEl.href = foundLink.href;
        } else {
          rootEl.href = '#'; // Fallback for labels without explicit links
        }
        rootEl.textContent = labelCell?.textContent.trim() || '';

        const spanArrow = document.createElement('span');
        spanArrow.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
        rootEl.append(spanArrow);

        li.appendChild(rootEl);

        const wrapper = document.createElement('div');
        wrapper.classList.add('has-footer-sub-child');
        // Move instrumentation for the hierarchy content
        moveInstrumentation(hierarchyCell, hierarchyRoot);
        wrapper.appendChild(hierarchyRoot);
        li.appendChild(wrapper);

        rootEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          wrapper.classList.toggle('active');
          li.classList.toggle('active');
        });

        transformNestedLists(hierarchyRoot);
      } else {
        rootEl = document.createElement('a');
        const foundLink = linkCell?.querySelector('a');
        if (foundLink) {
          rootEl.href = foundLink.href;
        }
        rootEl.textContent = labelCell?.textContent.trim() || '';
        li.appendChild(rootEl);
      }
      footerInnerList.append(li);
      moveInstrumentation(itemRow, li);
    });
    moveInstrumentation(row, linkBlocks);
  });

  // Copyright and Secondary Nav
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightWrap);

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  copyrightWrap.append(secondaryNavCol);

  const secondaryNav = document.createElement('ul');
  secondaryNav.classList.add('secondary-nav');
  secondaryNavCol.append(secondaryNav);

  secondaryLinkItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(c => !c.querySelector('a'));
    const linkCell = cells.find(c => c.querySelector('a'));

    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell?.textContent.trim() || '';
    li.append(anchor);
    secondaryNav.append(li);
    moveInstrumentation(row, li);
  });

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  copyrightTextCol.textContent = copyrightTextRow.textContent.trim();
  copyrightWrap.append(copyrightTextCol);
  moveInstrumentation(copyrightTextRow, copyrightTextCol);
}
