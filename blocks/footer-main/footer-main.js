import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, level = 0) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');
    let triggerEl = anchor;

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
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add(level === 0 ? 'has-footer-sub-child' : 'has-footer-inner-sub-child');
      li.append(subWrap);
      // Move children of nested UL to subWrap
      while (nested.firstChild) {
        subWrap.append(nested.firstChild);
      }

      if (triggerEl) {
        // Add SVG icon for expand/collapse
        const svgSpan = document.createElement('span');
        svgSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
        triggerEl.after(svgSpan);

        const toggleAccordion = (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        };
        triggerEl.addEventListener('click', toggleAccordion);
        svgSpan.addEventListener('click', toggleAccordion);
      }
      transformNestedLists(subWrap, level + 1); // Pass the wrapper to continue recursion
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Destructure the known root fields
  const logoRow = children[0];
  const logoLinkRow = children[1];
  const copyrightRow = children[2];
  const itemRows = children.slice(3); // All remaining rows are item rows

  block.innerHTML = '';

  const container = document.createElement('div');
  container.classList.add('container');
  block.append(container);

  // Footer Header (Logo and Social Links)
  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');
  container.append(footerHeader);

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  footerHeader.append(logoWrapper);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  logoWrapper.append(logoDiv);

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);

  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    const optimizedImg = optimizedPic.querySelector('img');
    optimizedImg.classList.add('hiddenlogo1');
    optimizedImg.width = 200;
    optimizedImg.height = 30;
    optimizedImg.style.width = 'auto';
    moveInstrumentation(img, optimizedImg);
    logoLink.append(optimizedPic);
  }

  const socialLinksWrapper = document.createElement('div');
  socialLinksWrapper.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeader.append(socialLinksWrapper);

  const socialLinksUl = document.createElement('ul');
  socialLinksUl.classList.add('social-wrap');
  socialLinksWrapper.append(socialLinksUl);

  // Filter for social-link-item: 2 cells, first cell has an 'a' tag (aem-content)
  const socialLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('a');
  });

  socialLinkItems.forEach((row) => {
    const [linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.target = '_blank'; // Assuming social links open in new tab
    }
    moveInstrumentation(linkCell, anchor);

    // Determine social icon class based on link text (as per original HTML)
    const linkText = foundLink?.href.toLowerCase() || '';
    if (linkText.includes('facebook')) li.classList.add('fb');
    else if (linkText.includes('twitter')) li.classList.add('tw');
    else if (linkText.includes('instagram')) li.classList.add('inst');
    else if (linkText.includes('youtube')) li.classList.add('yt');
    else if (linkText.includes('linkedin')) li.classList.add('in');

    // Create SVG element and append to anchor
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '30');
    svg.setAttribute('height', '30');
    svg.setAttribute('viewBox', '0 0 40 41');
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    // In a real scenario, the xlink:href would be dynamically set based on the social link type
    // For now, using a placeholder or a default icon
    image.setAttribute('xlink:href', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAApCAYAAABHomvIAAAAAXNSR0IArs4c6QAAAZRJREFUWEftltFNwzAQhn2NHxMpj5HsSOkG3YCyQTcoTABMUJgANiArdILCBIxApNh5pQNEMXEFUqmcxNa1UZDsV1/uvvvPdzkgEz8wcT7iAbEVOjuCcRzHYRiuAWChlMoMgO9CiEdb8LMBarAoijZKqfu+4ACQl2V5OypgkiRZEAS7NrhJsT8sowO6wGnS0QHTNM2VUmvrko1ZYq0epfTTFm50BRljNwDw2gO4b5tmf3K/lVL2NtKxPaqLOecvhJC7DsAnl3HSlSQKkDGWA4Dx/QkhUL5/gVFOPKAeSy4deGo7OQWzLIvruv7CJHXRQc0YWwDABwawrZpTdzuVmHO+JITsMIBKqQcppR5PVscJ0GIwDwZtmmZVVdV20PDHwAmQc673uI2t8w67ayHEm60PV8C+P4dVTErpvCiKwsrYdczoEs9ms6sj58uOrfmwVpkgXJbVw3Jhm4nJbnJzcPKD2gMa3pF/g5gm9F2MVc8r6BUcUuA//OqeCSErUyJSyvlQgjb3qEFtEwBr4wG9glgFsN9/A/ubqSotIjiQAAAAAElFTkSuQmCC'); // generic placeholder
    image.setAttribute('x', '0');
    image.setAttribute('y', '0');
    image.setAttribute('width', '30');
    image.setAttribute('height', '30');
    svg.append(image);
    anchor.append(svg);

    li.append(anchor);
    socialLinksUl.append(li);
  });

  // Footer Menu Box
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  container.append(footerMenuBox);

  const col = document.createElement('div');
  col.classList.add('col');
  footerMenuBox.append(col);

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');
  col.append(footerMenu);

  // Filter for footer-link-block: 3 cells, first is text, second has 'a' tag, third is container
  const footerLinkBlocks = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].textContent.trim() && cells[1].querySelector('a');
  });

  footerLinkBlocks.forEach((row) => {
    const [blockLabelCell, blockLinkCell, linksContainerCell] = [...row.children];
    const linkBlocksDiv = document.createElement('div');
    linkBlocksDiv.classList.add('link-blocks');
    footerMenu.append(linkBlocksDiv);

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');
    linkBlocksDiv.append(headDiv);

    const span = document.createElement('span');
    headDiv.append(span);

    const blockLink = document.createElement('a');
    const foundBlockLink = blockLinkCell.querySelector('a');
    if (foundBlockLink) {
      blockLink.href = foundBlockLink.href;
    }
    blockLink.textContent = blockLabelCell.textContent.trim();
    moveInstrumentation(blockLinkCell, blockLink);
    span.append(blockLink);

    const small = document.createElement('small');
    small.setAttribute('data-once', 'footerMobileInner');
    span.append(small);

    const footerInnerList = document.createElement('ul');
    footerInnerList.classList.add('footer-inner-list');
    headDiv.append(footerInnerList);

    // The 'linksContainerCell' contains the actual HTML for sub-links.
    // We need to parse its innerHTML to get the individual sub-link items.
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = linksContainerCell.innerHTML;

    // Filter for footer-sub-link-item: 3 cells (label, link, hierarchy-tree)
    // These are not direct children of block, but nested within the 'links' container field.
    // The original HTML shows these as <li> elements directly under <ul>.
    // We need to extract these from tempDiv.
    const subLinkItems = [...tempDiv.children]; // Assuming direct <li> children from original HTML

    subLinkItems.forEach((subRow) => {
      // Each subRow here corresponds to an <li> element from the original HTML
      // which represents a footer-sub-link-item.
      // We need to reconstruct the cells from its content.
      const labelEl = subRow.querySelector(':scope > a') || subRow.querySelector(':scope > span');
      const linkEl = subRow.querySelector(':scope > a');
      const hierarchyRoot = subRow.querySelector(':scope > div.has-footer-sub-child > ul'); // Correctly target nested UL

      const li = document.createElement('li');
      footerInnerList.append(li);

      let rootEl;
      if (linkEl) {
        rootEl = document.createElement('a');
        rootEl.href = linkEl.href;
      } else {
        rootEl = document.createElement('span');
      }
      rootEl.textContent = labelEl?.textContent.trim() || '';
      moveInstrumentation(subRow, rootEl); // Instrument the original <li>
      li.appendChild(rootEl);

      if (hierarchyRoot) {
        // The hierarchyRoot is already a UL, but it's wrapped in a div in original HTML
        // We need to replicate that structure and then transform it.
        const wrapper = document.createElement('div');
        wrapper.classList.add('has-footer-sub-child');
        // Move children of hierarchyRoot (the UL) into the new wrapper
        while (hierarchyRoot.firstChild) {
          wrapper.append(hierarchyRoot.firstChild);
        }
        li.appendChild(wrapper);

        const svgSpan = document.createElement('span');
        svgSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
        rootEl.after(svgSpan);

        const toggleAccordion = (e) => {
          e.preventDefault();
          e.stopPropagation();
          wrapper.classList.toggle('active');
          li.classList.toggle('active');
        };
        rootEl.addEventListener('click', toggleAccordion);
        svgSpan.addEventListener('click', toggleAccordion);

        // Call transformNestedLists on the content inside the wrapper
        transformNestedLists(wrapper, 0); // Start recursion from level 0 for the nested UL
      }
    });

    headDiv.addEventListener('click', () => {
      linkBlocksDiv.classList.toggle('active');
      footerInnerList.classList.toggle('active');
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

  // Filter for footer-secondary-link: 2 cells, first is text, second has 'a' tag
  const secondaryLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].textContent.trim() && cells[1].querySelector('a');
  });

  secondaryLinkItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
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
  copyrightWrap.append(copyrightTextCol);
  copyrightTextCol.textContent = copyrightRow.textContent.trim();
  moveInstrumentation(copyrightRow, copyrightTextCol);
}
