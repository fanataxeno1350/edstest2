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
        small.setAttribute('data-once', 'footerMobileInner');
        trigger.after(small);

        const imgSpan = document.createElement('span');
        imgSpan.setAttribute('data-once', 'footerClickEvent');
        if (level > 0) {
          imgSpan.classList.add('innerFooterClickEvent');
        }
        const img = document.createElement('img');
        img.alt = 'svg file';
        // The original HTML has a hardcoded SVG path, but we must not hardcode paths.
        // Since the model doesn't provide an icon for the toggle, we'll leave src empty.
        // If an icon field were present, we'd use that.
        img.src = ''; // Placeholder, as no icon field is in the model
        imgSpan.append(img);
        trigger.after(imgSpan);

        // Add event listener for the toggle behavior
        const toggleElements = [trigger, imgSpan]; // Both trigger and the image span should toggle
        toggleElements.forEach(el => {
          el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            li.classList.toggle('active');
            subWrap.classList.toggle('active');
          });
        });
      }
      transformNestedLists(nested, level + 1);
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // The first three rows are fixed fields: logo, logoLink, copyrightText
  // The remaining rows are item rows for socialLinks, footerMenu, secondaryNav
  const [logoRow, logoLinkRow, copyrightTextRow, ...itemRows] = children;

  const container = document.createElement('div');
  container.classList.add('container');

  // Footer Header Section
  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow?.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
    moveInstrumentation(logoLinkRow, logoLink);
  }

  const picture = logoRow?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('hiddenlogo1');
      optimizedImg.width = 200;
      optimizedImg.height = 30;
      optimizedImg.style.width = 'auto'; // This is from original HTML, not a hardcoded dimension by EDS
      moveInstrumentation(img, optimizedImg);
      logoLink.append(optimizedPic);
    }
  }
  logoDiv.append(logoLink);
  logoWrapper.append(logoDiv);
  footerHeader.append(logoWrapper);

  // Social Links
  const socialLinksWrapper = document.createElement('div');
  socialLinksWrapper.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');

  const socialUl = document.createElement('ul');
  socialUl.classList.add('social-wrap');

  // Filter for social items: 2 cells, first cell contains a picture
  const socialItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('picture');
  });

  socialItems.forEach((row) => {
    const [iconCell, linkCell] = [...row.children];
    const li = document.createElement('li');

    const socialLink = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      socialLink.href = foundLink.href;
      socialLink.target = '_blank'; // From original HTML
      moveInstrumentation(linkCell, socialLink);
    }

    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      if (iconImg) {
        const optimizedIconPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '30' }]);
        const optimizedIconImg = optimizedIconPic.querySelector('img');
        optimizedIconImg.alt = 'svg file'; // From original HTML
        moveInstrumentation(iconImg, optimizedIconImg);
        socialLink.append(optimizedIconPic);
      }
    }
    li.append(socialLink);
    socialUl.append(li);
    moveInstrumentation(row, li);
  });

  socialLinksWrapper.append(socialUl);
  footerHeader.append(socialLinksWrapper);
  container.append(footerHeader);

  // Footer Menu Section
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');

  // Filter for menu items: 3 cells, second cell contains an anchor, third cell contains a UL (hierarchy-tree)
  const menuItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[1].querySelector('a') && cells[2].querySelector('ul');
  });

  menuItems.forEach((row) => {
    const [sectionLabelCell, sectionLinkCell, hierarchyCell] = [...row.children];
    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');

    const head = document.createElement('div');
    head.classList.add('head');

    const span = document.createElement('span');
    const sectionLink = document.createElement('a');
    const foundSectionLink = sectionLinkCell?.querySelector('a');
    if (foundSectionLink) {
      sectionLink.href = foundSectionLink.href;
      moveInstrumentation(sectionLinkCell, sectionLink);
    }
    sectionLink.textContent = sectionLabelCell?.textContent.trim() || '';
    span.append(sectionLink);

    // Handle hierarchy-tree richtext field
    const hierarchyTempDiv = document.createElement('div');
    if (hierarchyCell) {
      moveInstrumentation(hierarchyCell, hierarchyTempDiv);
      hierarchyTempDiv.innerHTML = hierarchyCell.innerHTML; // Preserve full HTML structure
    }

    const hierarchyRoot = hierarchyTempDiv.querySelector('ul');
    if (hierarchyRoot) {
      // Apply classes from original HTML to nested elements if needed
      hierarchyRoot.querySelectorAll('a').forEach(a => {
        // Add any specific classes from original HTML if applicable, e.g., a.classList.add('nav-link');
      });
      hierarchyRoot.querySelectorAll('li').forEach(li => {
        // Add any specific classes from original HTML if applicable, e.g., li.classList.add('nav-item');
      });

      const small = document.createElement('small');
      small.setAttribute('data-once', 'footerMobileInner');
      span.append(small);

      const footerInnerList = document.createElement('ul');
      footerInnerList.classList.add('footer-inner-list');

      // Move children from hierarchyRoot to footerInnerList
      while (hierarchyRoot.firstChild) {
        footerInnerList.append(hierarchyRoot.firstChild);
      }

      transformNestedLists(footerInnerList);
      head.append(span, footerInnerList);
    } else {
      head.append(span);
    }

    linkBlocks.append(head);
    footerMenu.append(linkBlocks);
    moveInstrumentation(row, linkBlocks);
  });

  footerMenuCol.append(footerMenu);
  footerMenuBox.append(footerMenuCol);
  container.append(footerMenuBox);

  // Copyright and Secondary Nav
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');

  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');

  // Filter for secondary nav items: 3 cells, no picture, no second cell with an anchor (distinguishes from menu items)
  // The third cell is 'hierarchy-tree' but for secondary nav, it's often flat or not used for display.
  // The model shows it as 'hierarchy-tree', but the original HTML shows a flat list for secondary-nav.
  // We'll prioritize the original HTML's flat structure for secondary-nav if the hierarchy-tree is empty or not a UL.
  const secondaryNavItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && !cells[0].querySelector('picture') && !cells[1].querySelector('a');
  });

  secondaryNavItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children]; // hierarchyCell is present but might be empty or flat
    const li = document.createElement('li');
    const secondaryLink = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      secondaryLink.href = foundLink.href;
      moveInstrumentation(linkCell, secondaryLink);
    }
    secondaryLink.textContent = labelCell?.textContent.trim() || '';
    li.append(secondaryLink);

    // If hierarchyCell for secondary nav contains a UL, handle it, otherwise, it's a simple link
    const hierarchyTempDiv = document.createElement('div');
    if (hierarchyCell) {
      moveInstrumentation(hierarchyCell, hierarchyTempDiv);
      hierarchyTempDiv.innerHTML = hierarchyCell.innerHTML;
    }
    const hierarchyRoot = hierarchyTempDiv.querySelector('ul');
    if (hierarchyRoot) {
      // For secondary nav, the original HTML shows a flat list, so we'll append the items directly
      // or apply transformNestedLists if the structure is truly nested and needs toggles.
      // Based on the original HTML, secondary-nav is flat.
      while (hierarchyRoot.firstChild) {
        li.append(hierarchyRoot.firstChild); // Append nested items directly to the li if present
      }
    }

    secondaryNavUl.append(li);
    moveInstrumentation(row, li);
  });

  secondaryNavCol.append(secondaryNavUl);
  copyrightWrap.append(secondaryNavCol);

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  if (copyrightTextRow) {
    moveInstrumentation(copyrightTextRow, copyrightTextCol);
    // Use innerHTML for richtext field
    copyrightTextCol.innerHTML = copyrightTextRow.innerHTML;
  }
  copyrightWrap.append(copyrightTextCol);
  container.append(copyrightWrap);

  block.innerHTML = '';
  block.append(container);
}
