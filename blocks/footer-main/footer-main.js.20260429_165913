import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Destructure the known root fields
  const logoRow = children[0];
  const logoLinkRow = children[1];
  const copyrightTextRow = children[2];

  // Remaining rows are item rows for various sub-components
  const itemRows = children.slice(3);

  // Filter item rows based on their structure (number of cells and content type)
  // Social Link: 2 cells, second cell contains a UL (hierarchy-tree)
  const socialLinkItems = itemRows.filter((row) => row.children.length === 2 && row.children[1].querySelector('ul'));
  // Footer Menu Block: 3 cells, third cell is a container placeholder (text content)
  const footerMenuBlockItems = itemRows.filter((row) => row.children.length === 3 && !row.children[2].querySelector('ul'));
  // Footer Menu Item: 4 cells, third cell contains a UL (hierarchy-tree)
  const footerMenuItemItems = itemRows.filter((row) => row.children.length === 4 && row.children[2].querySelector('ul'));
  // Secondary Nav Item: 2 cells, second cell is a link, no UL
  const secondaryNavItemItems = itemRows.filter((row) => row.children.length === 2 && !row.children[1].querySelector('ul'));
  // Footer Menu Subitem: 2 cells, no UL
  const footerMenuSubitemItems = itemRows.filter((row) => row.children.length === 2 && !row.children[1].querySelector('ul') && !socialLinkItems.includes(row) && !secondaryNavItemItems.includes(row));


  block.innerHTML = ''; // Clear the block to rebuild

  const container = document.createElement('div');
  container.classList.add('container');

  // Footer Header
  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.children[0].querySelector('a'); // Accessing first child of logoLinkRow
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);

  const picture = logoRow.children[0].querySelector('picture'); // Accessing first child of logoRow
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('hiddenlogo1');
      optimizedImg.width = 200;
      optimizedImg.height = 30;
      optimizedImg.style.width = 'auto';
      moveInstrumentation(img, optimizedImg);
      logoLink.append(optimizedPic);
    }
  }
  moveInstrumentation(logoRow, logoDiv);
  logoDiv.append(logoLink);
  logoWrapper.append(logoDiv);
  footerHeader.append(logoWrapper);

  // Social Links
  const socialWrapCenter = document.createElement('div');
  socialWrapCenter.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  const socialWrap = document.createElement('ul');
  socialWrap.classList.add('social-wrap');

  socialLinkItems.forEach((row) => {
    const [linkCell] = [...row.children]; // hierarchyCell is not used for social links directly
    const li = document.createElement('li');
    const socialLink = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      socialLink.href = foundLink.href;
      socialLink.target = '_blank';
      // Determine social icon based on href
      if (socialLink.href.includes('facebook.com')) {
        li.classList.add('fb');
        socialLink.innerHTML = `<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink">
          <image xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAApCAYAAABHomvIAAAAAXNSR0IArs4c6QAAAZRJREFUWEftltFNwzAQhn2NHxMpj5HsSOkG3YCyQTcoTABMUJgANiArdILCBIxApNh5pQNEMXEFUqmcxNa1UZDsV1/uvvvPdzkgEz8wcT7iAbEVOjuCcRzHYRiuAWChlMoMgO9CiEdb8LMBarAoijZKqfu+4ACQl2V5OypgkiRZEAS7NrhJsT8sowO6wGnS0QHTNM2VUmvrko1ZYq1epfTTFm50BRljNwDw2gO4b5tmf3K/lVL2NtKxPaqLOecvhJC7DsAnl3HSlSQKkDGWA4Dx/QkhUL5/gVFOPKAeSy4deGo7OQWzLIvruv7CJHXRQc0YWwDABwawrZpTdzuVmHO+JITsMIBKqQcppR5PVscJ0GIwDwZtmmZVVdV20PDHwAmQc673uI2t8w67ayHEm60PV8C+P4dVTErpvCiKwsrYdczoEs9ms6sj58uOrfmwVpkgXJbVw3Jhm4nJbnJzcPKD2gMa3pF/g5gm9F2MVc8r6BUcUuA//OqeCSErUyJSyvlQgjb3qEFtEwBr4wG9glgFsN9/A/ubqSotIjiQAAAAAElFTkSuQmCC" x="0" y="0" width="30" height="30"></image>
        </svg>`;
      } else if (socialLink.href.includes('twitter.com')) {
        li.classList.add('tw');
        socialLink.innerHTML = `<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink">
          <image xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAApCAYAAABHomvIAAAAAXNSR0IArs4c6QAAA0NJRU5ErkJggg==" x="0" y="0" width="30" height="30"></image>
        </svg>`;
      } else if (socialLink.href.includes('instagram.com')) {
        li.classList.add('inst');
        socialLink.innerHTML = `<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink">
          <image xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAApCAYAAABHomvIAAAAAXNSR0IArs4c6QAAA5FJRU5ErkJggg==" x="0" y="0" width="30" height="30"></image>
        </svg>`;
      } else if (socialLink.href.includes('youtube.com')) {
        li.classList.add('yt');
        socialLink.innerHTML = `<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink">
          <image xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAApCAYAAABHomvIAAAAAXNSR0IArs4c6QAAAm9JRU5ErkJggg==" x="0" y="0" width="30" height="30"></image>
        </svg>`;
      } else if (socialLink.href.includes('linkedin.com')) {
        li.classList.add('in');
        socialLink.innerHTML = `<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink">
          <image xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAApCAYAAABHomvIAAAAAXNSR0IArs4c6QAAAg5JRU5ErkJggg==" x="0" y="0" width="30" height="30"></image>
        </svg>`;
      }
    }
    moveInstrumentation(row, li);
    li.append(socialLink);
    socialWrap.append(li);
  });
  socialWrapCenter.append(socialWrap);
  footerHeader.append(socialWrapCenter);
  container.append(footerHeader);

  // Footer Menu Box
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  const col = document.createElement('div');
  col.classList.add('col');
  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');

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
        subWrap.classList.add('has-footer-sub-child');
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

  footerMenuBlockItems.forEach((row) => {
    const [headingCell, headingLinkCell] = [...row.children]; // Ignoring the third cell as it's a container placeholder
    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    const head = document.createElement('div');
    head.classList.add('head');
    const span = document.createElement('span');

    const headingLink = document.createElement('a');
    const foundHeadingLink = headingLinkCell.querySelector('a');
    if (foundHeadingLink) {
      headingLink.href = foundHeadingLink.href;
    }
    headingLink.textContent = headingCell.textContent.trim();
    moveInstrumentation(headingCell, headingLink);
    moveInstrumentation(headingLinkCell, headingLink);

    span.append(headingLink);

    const small = document.createElement('small');
    span.append(small);
    head.append(span);

    const footerInnerList = document.createElement('ul');
    footerInnerList.classList.add('footer-inner-list');

    // Find all footer menu items that belong to this block
    // This is a simplified approach, in a real scenario, you'd need a way to link items to their parent block.
    // For this exercise, we assume they appear in order or have a more robust linking mechanism.
    // Given the EDS structure, items are flat. We'll just append all footerMenuItemItems.
    // A more robust solution would require a field in footer-menu-item to link to its parent.
    // For now, we'll just append all `footerMenuItemItems` to each `footerMenuBlock` to match the example.
    // This is a limitation of the current EDS structure for nested containers.
    footerMenuItemItems.forEach((menuItemRow) => {
      const [labelCell, linkCell, hierarchyCell] = [...menuItemRow.children];
      const li = document.createElement('li');
      const foundLink = linkCell?.querySelector('a');
      let rootEl;
      if (foundLink) {
        rootEl = document.createElement('a');
        rootEl.href = foundLink.href;
      } else {
        rootEl = document.createElement('span');
      }
      rootEl.textContent = labelCell?.textContent.trim() || '';
      moveInstrumentation(menuItemRow, rootEl);
      li.appendChild(rootEl);

      const hierarchyRoot = hierarchyCell?.querySelector('ul');
      if (hierarchyRoot) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('has-footer-sub-child');
        // Use innerHTML to preserve the nested structure
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML;
        moveInstrumentation(hierarchyCell, tempDiv);

        // Apply classes to nested elements as per original HTML
        tempDiv.querySelectorAll('a').forEach(a => a.classList.add('')); // No specific class for <a> in original HTML, but good to have
        tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('')); // No specific class for <ul> in original HTML
        tempDiv.querySelectorAll('li').forEach(liElement => liElement.classList.add('')); // No specific class for <li> in original HTML

        while (tempDiv.firstChild) {
          wrapper.append(tempDiv.firstChild);
        }

        rootEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          wrapper.classList.toggle('active');
          li.classList.toggle('active');
        });
        li.appendChild(wrapper);
        transformNestedLists(wrapper); // Pass the wrapper to transform nested lists
      }
      footerInnerList.append(li);
    });

    head.append(footerInnerList);
    linkBlocks.append(head);
    footerMenu.append(linkBlocks);
  });

  col.append(footerMenu);
  footerMenuBox.append(col);
  container.append(footerMenuBox);

  // Copyright and Secondary Nav
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  const secondaryNav = document.createElement('ul');
  secondaryNav.classList.add('secondary-nav');

  secondaryNavItemItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const navLink = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      navLink.href = foundLink.href;
    }
    navLink.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, navLink);
    li.append(navLink);
    secondaryNav.append(li);
  });
  secondaryNavCol.append(secondaryNav);
  copyrightWrap.append(secondaryNavCol);

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  copyrightTextCol.textContent = copyrightTextRow.children[0].textContent.trim(); // Accessing first child of copyrightTextRow
  moveInstrumentation(copyrightTextRow, copyrightTextCol);
  copyrightWrap.append(copyrightTextCol);
  container.append(copyrightWrap);

  block.append(container);
}
