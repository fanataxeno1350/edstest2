import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, level = 0) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Add classes from ORIGINAL HTML to <a>, <li>, <ul> elements
    if (anchor) {
      // Example: li.classList.add('nav-menu-item'); // Add specific classes if needed from original HTML
    }
    li.classList.add('list-item'); // Example class, adjust based on original HTML

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
        const svgSpan = document.createElement('span');
        svgSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
        trigger.append(svgSpan);

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

  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  // Find logo and logo-link cells using content detection
  const logoCell = children.find(row => row.querySelector('picture'))?.querySelector('div');
  const logoLinkCell = children.find(row => row.querySelector('a[href*="/content/site/logo-link"]'))?.querySelector('div');

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkCell?.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  if (logoLinkCell) {
    moveInstrumentation(logoLinkCell, logoLink);
  }

  if (logoCell) {
    const picture = logoCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        logoLink.append(optimizedPic);
      }
    }
    moveInstrumentation(logoCell, logoDiv);
  }
  logoDiv.append(logoLink);
  logoWrapper.append(logoDiv);
  footerHeader.append(logoWrapper);

  const socialLinksWrapper = document.createElement('div');
  socialLinksWrapper.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  const socialUl = document.createElement('ul');
  socialUl.classList.add('social-wrap');

  // Filter for social link rows (2 cells: link, hierarchy-tree)
  const socialLinkRows = children.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('a') && cells[1].querySelector('ul');
  });

  socialLinkRows.forEach((row) => {
    const [linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.target = '_blank'; // From original HTML
      // Add social icon classes based on href or content if needed
      if (foundLink.href.includes('facebook')) li.classList.add('fb');
      if (foundLink.href.includes('twitter')) li.classList.add('tw');
      if (foundLink.href.includes('instagram')) li.classList.add('inst');
      if (foundLink.href.includes('youtube')) li.classList.add('yt');
      if (foundLink.href.includes('linkedin')) li.classList.add('in');
    }
    moveInstrumentation(linkCell, anchor);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyCell.innerHTML; // Use innerHTML for richtext

    const hierarchyRoot = tempDiv.querySelector('ul');
    if (hierarchyRoot) {
      // Apply classes to nested elements from ORIGINAL HTML
      hierarchyRoot.querySelectorAll('a').forEach(a => {
        // Example: a.classList.add('social-link-item');
      });
      hierarchyRoot.querySelectorAll('li').forEach(l => {
        // Example: l.classList.add('social-list-item');
      });
      hierarchyRoot.querySelectorAll('ul').forEach(ul => {
        // Example: ul.classList.add('social-sub-list');
      });

      transformNestedLists(hierarchyRoot);
      // Move instrumentation for the entire hierarchy cell
      moveInstrumentation(hierarchyCell, tempDiv);
      while (tempDiv.firstChild) {
        anchor.append(tempDiv.firstChild);
      }
    }
    li.append(anchor);
    socialUl.append(li);
  });
  socialLinksWrapper.append(socialUl);
  footerHeader.append(socialLinksWrapper);

  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');

  // Filter for menu block rows (3 cells: heading, heading-link, items)
  const menuBlockRows = children.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].querySelector('div')?.textContent && cells[1].querySelector('a') && cells[2].querySelector('ul');
  });

  menuBlockRows.forEach((row) => {
    const [headingCell, headingLinkCell, itemsCell] = [...row.children];
    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    const headDiv = document.createElement('div');
    headDiv.classList.add('head');

    // Add specific classes based on content if needed, e.g., 'what-we-do-footer-links', 'careers-footer-links'
    const headingText = headingCell.textContent.trim().toLowerCase();
    if (headingText.includes('what we do')) {
      headDiv.classList.add('what-we-do-footer-links');
    } else if (headingText.includes('careers')) {
      headDiv.classList.add('careers-footer-links');
    }

    const span = document.createElement('span');
    const headingLink = document.createElement('a');
    const foundHeadingLink = headingLinkCell.querySelector('a');
    if (foundHeadingLink) {
      headingLink.href = foundHeadingLink.href;
    }
    headingLink.textContent = headingCell.textContent.trim();
    moveInstrumentation(headingLinkCell, headingLink);
    moveInstrumentation(headingCell, span);
    span.append(headingLink);

    const small = document.createElement('small');
    small.setAttribute('data-once', 'footerMobileInner');
    span.append(small);
    headDiv.append(span);

    const footerInnerList = document.createElement('ul');
    footerInnerList.classList.add('footer-inner-list');

    // Use innerHTML for the itemsCell to preserve nested structure
    const tempItemsDiv = document.createElement('div');
    tempItemsDiv.innerHTML = itemsCell.innerHTML;
    const menuItems = tempItemsDiv.querySelectorAll('li');

    menuItems.forEach((item) => {
      const li = document.createElement('li');
      const itemLink = item.querySelector('a');
      if (itemLink) {
        const newLink = document.createElement('a');
        newLink.href = itemLink.href;
        newLink.textContent = itemLink.textContent.trim();
        moveInstrumentation(itemLink, newLink);
        li.append(newLink);
      } else {
        const itemText = item.textContent.trim();
        if (itemText) {
          li.textContent = itemText;
        }
      }
      footerInnerList.append(li);
    });
    moveInstrumentation(itemsCell, tempItemsDiv); // Move instrumentation for the original cell

    headDiv.append(footerInnerList);
    linkBlocks.append(headDiv);
    footerMenu.append(linkBlocks);
  });

  footerMenuCol.append(footerMenu);
  footerMenuBox.append(footerMenuCol);

  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');

  // Filter for secondary nav items (2 cells: label, link)
  const secondaryNavItems = children.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('div')?.textContent && cells[1].querySelector('a');
  });

  secondaryNavItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(linkCell, anchor);
    moveInstrumentation(labelCell, anchor);
    li.append(anchor);
    secondaryNavUl.append(li);
  });
  secondaryNavCol.append(secondaryNavUl);
  copyrightWrap.append(secondaryNavCol);

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');

  // Find the copyright cell using content detection (it's a text field)
  const copyrightCell = children.find(row => row.children.length === 1 && !row.querySelector('a') && !row.querySelector('picture'))?.querySelector('div');

  if (copyrightCell) {
    copyrightTextCol.textContent = copyrightCell.textContent.trim();
    moveInstrumentation(copyrightCell, copyrightTextCol);
  }
  copyrightWrap.append(copyrightTextCol);

  const container = document.createElement('div');
  container.classList.add('container');
  container.append(footerHeader, footerMenuBox, copyrightWrap);

  block.textContent = '';
  block.append(container);
}
