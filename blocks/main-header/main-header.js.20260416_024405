import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [logoRow, logoLinkRow, yearLogoRow, yearLogoLinkRow, ...itemRows] = [...block.children];

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid'); // Do NOT add 'nav-up' here

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  const logoAnchor = logoLinkRow.querySelector('a');
  if (logoAnchor) {
    logoLink.href = logoAnchor.href;
  }
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(logoPicture, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoLink);
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);
  wrap.append(logoDiv);

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  const ulHamburger = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    ulHamburger.append(document.createElement('li'));
  }
  hamburger.append(ulHamburger);
  wrap.append(hamburger);

  // Navigation Menu
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);
  wrap.append(nav);

  // Filter item rows based on content
  const navigationItems = itemRows.filter((row) => {
    const cells = [...row.children];
    // navigation-item: label (text), link (aem-content), icon (reference), hierarchy-tree (richtext)
    // cell[0] is text, cell[1] is aem-content, cell[2] is reference, cell[3] is richtext
    return cells.length === 4
      && !cells[0].querySelector('picture') // Not an icon-nav-item (which has icon in cell 0)
      && cells[1].querySelector('a') // Has a link
      && cells[2].querySelector('picture') // Has an icon
      && cells[3].querySelector('ul'); // Has a hierarchy tree
  });

  const iconNavItems = itemRows.filter((row) => {
    const cells = [...row.children];
    // icon-nav-item: icon (reference), link (aem-content), label (text), hierarchy-tree (richtext)
    // cell[0] is reference, cell[1] is aem-content, cell[2] is text, cell[3] is richtext
    return cells.length === 4
      && cells[0].querySelector('picture') // Has an icon in cell 0
      && cells[1].querySelector('a') // Has a link
      && !cells[2].querySelector('picture') // Not a reference in cell 2
      && cells[3].querySelector('ul'); // Has a hierarchy tree
  });

  const pressReleaseItems = itemRows.filter((row) => {
    const cells = [...row.children];
    // press-release-item: title (text), link (aem-content), date (text), category (text)
    // No pictures, no hierarchy tree
    return cells.length === 4
      && !cells[0].querySelector('picture')
      && cells[1].querySelector('a')
      && !cells[2].querySelector('picture')
      && !cells[3].querySelector('ul');
  });

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
        subWrap.classList.add('has-sub-child');
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
        transformNestedLists(nested); // Recursive call for deeper nesting
      }
    });
  }

  navigationItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const linkCell = cells[1];
    const iconCell = cells[2];
    const hierarchyCell = cells[3];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(labelCell, anchor);
    moveInstrumentation(linkCell, anchor);
    li.append(anchor);

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const span = document.createElement('span');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]);
      moveInstrumentation(iconPicture, optimizedPic.querySelector('img'));
      span.append(optimizedPic);
      li.append(span);
    }
    moveInstrumentation(iconCell, li);

    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu');
      const megaMenuWrap = document.createElement('div');
      megaMenuWrap.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');
      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap', 'about-us-sub-nav');

      // Preserve original HTML structure and classes for nested lists
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      const ulContent = tempDiv.querySelector('ul');
      if (ulContent) {
        ulContent.querySelectorAll('li').forEach(item => item.classList.add('top-level-li'));
        ulContent.querySelectorAll('li > a').forEach(item => {
          if (item.nextElementSibling && item.nextElementSibling.tagName === 'UL') {
            const span = document.createElement('span');
            const img = document.createElement('img');
            img.alt = 'svg file';
            img.src = '/content/dam/aemigrate/uploaded-folder/image/1776285861168.svg+xml'; // Example SVG from original HTML
            span.append(img);
            item.after(span);
          }
        });
        moveInstrumentation(hierarchyCell, ulContent);
        subNavWrap.append(ulContent);
        transformNestedLists(ulContent);
      }

      centerDiv.append(subNavWrap);
      megaMenuWrap.append(centerDiv);
      megaMenu.append(megaMenuWrap);
      li.append(megaMenu);
    }
    moveInstrumentation(hierarchyCell, li);
    navUl.append(li);
  });

  // Icon Nav Items
  const iconNavDiv = document.createElement('div');
  iconNavDiv.classList.add('icon-nav', 'mobile-menus-icon');
  const iconNavUl = document.createElement('ul');
  iconNavDiv.append(iconNavUl);

  iconNavItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells[0];
    const linkCell = cells[1];
    const labelCell = cells[2];
    const hierarchyCell = cells[3];

    const li = document.createElement('li');

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(labelCell, anchor);
    moveInstrumentation(linkCell, anchor);

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]);
      moveInstrumentation(iconPicture, optimizedPic.querySelector('img'));
      anchor.prepend(optimizedPic);
    }
    moveInstrumentation(iconCell, anchor);
    li.append(anchor);

    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('nav-dropdown');
      
      // Preserve original HTML structure and classes for nested lists
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      const ulContent = tempDiv.querySelector('ul');
      if (ulContent) {
        ulContent.querySelectorAll('li').forEach(item => item.classList.add('top-level-li'));
        ulContent.querySelectorAll('li > a').forEach(item => {
          if (item.nextElementSibling && item.nextElementSibling.tagName === 'UL') {
            const span = document.createElement('span');
            const img = document.createElement('img');
            img.alt = 'svg file';
            img.src = '/content/dam/aemigrate/uploaded-folder/image/1776285861168.svg+xml'; // Example SVG from original HTML
            span.append(img);
            item.after(span);
          }
        });
        moveInstrumentation(hierarchyCell, ulContent);
        wrapper.appendChild(ulContent);
        transformNestedLists(ulContent);
      }

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        wrapper.classList.toggle('active');
        li.classList.toggle('active');
      });
      li.appendChild(wrapper);
    }
    moveInstrumentation(hierarchyCell, li);
    iconNavUl.append(li);
  });

  nav.append(iconNavDiv);

  // Year Logo
  const yearLogoDiv = document.createElement('div');
  yearLogoDiv.classList.add('logo', 'year-80-logo');
  const yearLogoLink = document.createElement('a');
  const yearLogoAnchor = yearLogoLinkRow.querySelector('a');
  if (yearLogoAnchor) {
    yearLogoLink.href = yearLogoAnchor.href;
  }
  const yearLogoPicture = yearLogoRow.querySelector('picture');
  if (yearLogoPicture) {
    const img = yearLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(yearLogoPicture, optimizedPic.querySelector('img'));
    yearLogoLink.append(optimizedPic);
  }
  moveInstrumentation(yearLogoRow, yearLogoLink);
  moveInstrumentation(yearLogoLinkRow, yearLogoLink);
  yearLogoDiv.append(yearLogoLink);
  wrap.append(yearLogoDiv);

  block.replaceWith(header);

  // Image optimization
  header.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Hamburger menu toggle
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });
}
