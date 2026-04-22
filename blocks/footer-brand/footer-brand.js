import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    li.classList.add('nav-menu-item', 'list-item'); // Add classes from ORIGINAL HTML
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (anchor) {
      anchor.classList.add('footer-list__item--link', 'nav-dropdown-item'); // Add classes from ORIGINAL HTML
    } else {
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
      subWrap.classList.add('has-sub-child'); // This class is not in ORIGINAL HTML, but seems to be an internal helper. If it should be from original HTML, it needs to be provided.
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

  // Use content detection instead of index access for root fields
  const logoRow = children.find((row) => row.querySelector('picture') && row.children.length === 1);
  const logoLinkRow = children.find((row) => row.querySelector('a') && row.children.length === 1 && children.indexOf(row) > children.indexOf(logoRow));
  const secondaryLogoRow = children.find((row) => row.querySelector('picture') && row.children.length === 1 && children.indexOf(row) > children.indexOf(logoLinkRow));
  const copyrightRow = children.find((row) => !row.querySelector('picture') && !row.querySelector('a') && row.children.length === 1 && children.indexOf(row) > children.indexOf(secondaryLogoRow));

  const itemRows = children.filter((row) =>
    row !== logoRow &&
    row !== logoLinkRow &&
    row !== secondaryLogoRow &&
    row !== copyrightRow
  );

  block.innerHTML = '';
  block.classList.add('w-100');

  const primarySection = document.createElement('section');
  primarySection.classList.add('footer-brand__primary');
  block.append(primarySection);

  const primaryContainer = document.createElement('div');
  primaryContainer.classList.add('container', 'fmm-container');
  primarySection.append(primaryContainer);

  const primaryContent = document.createElement('div');
  primaryContent.classList.add(
    'footer-brand__primary--content',
    'd-flex',
    'flex-column',
    'flex-md-row',
    'justify-content-md-between',
    'align-items-center',
  );
  primaryContainer.append(primaryContent);

  const brandLeft = document.createElement('section');
  brandLeft.classList.add('footer-brand__left', 'd-flex', 'gap-5', 'align-items-center');
  primaryContent.append(brandLeft);

  // Logo
  const logoPicture = logoRow?.querySelector('picture');
  const logoLink = logoLinkRow?.querySelector('a');
  if (logoPicture && logoLink) {
    const logoAnchor = document.createElement('a');
    logoAnchor.href = logoLink.href;
    logoAnchor.classList.add('footer-brand__logo', 'd-inline-block', 'cta-analytics');
    logoAnchor.setAttribute('aria-label', 'logo');
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(logoPicture, optimizedPic);
    logoAnchor.append(optimizedPic);
    brandLeft.append(logoAnchor);
  }

  // Secondary Logo
  const secondaryLogoPicture = secondaryLogoRow?.querySelector('picture');
  if (secondaryLogoPicture) {
    const secondaryLogoDiv = document.createElement('div');
    secondaryLogoDiv.classList.add('footer-brand__secondary--logo', 'd-inline-block');
    const img = secondaryLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(secondaryLogoPicture, optimizedPic);
    secondaryLogoDiv.append(optimizedPic);
    brandLeft.append(secondaryLogoDiv);
  }

  const brandRight = document.createElement('section');
  brandRight.classList.add('footer-brand__right');
  primaryContent.append(brandRight);

  const nav = document.createElement('nav');
  nav.classList.add('footer-brand__navbar', 'd-grid', 'd-md-flex');
  nav.setAttribute('aria-label', 'footer navbar');
  brandRight.append(nav);

  const navLeft = document.createElement('div');
  navLeft.classList.add('footer-brand__navbar--left', 'd-flex', 'flex-column', 'flex-md-row');
  nav.append(navLeft);

  const navRight = document.createElement('div');
  navRight.classList.add('footer-brand__navbar--right', 'd-flex', 'flex-column', 'flex-md-row');
  nav.append(navRight);

  const navigationItems = itemRows.filter((row) => [...row.children].length === 3);
  const secondaryLinks = itemRows.filter((row) => [...row.children].length === 2 && !row.querySelector('picture'));
  const socialLinks = itemRows.filter((row) => [...row.children].length === 2 && row.querySelector('picture'));

  const navListLeft = document.createElement('ul');
  navListLeft.classList.add(
    'footer-list',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'align-items-md-start',
    'flex-column',
  );
  const footerListDivLeft = document.createElement('div');
  footerListDivLeft.classList.add('footerList');
  footerListDivLeft.append(navListLeft);
  navLeft.append(footerListDivLeft);

  const navListRight = document.createElement('ul');
  navListRight.classList.add(
    'footer-list',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'align-items-md-start',
    'flex-column',
  );
  const footerListDivRight = document.createElement('div');
  footerListDivRight.classList.add('footerList');
  footerListDivRight.append(navListRight);
  navRight.append(footerListDivRight);

  navigationItems.forEach((row, i) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const linkCell = cells[1];
    const hierarchyCell = cells[2];

    const li = document.createElement('li');
    li.classList.add('footer-list__item');

    const foundLink = linkCell?.querySelector('a');
    let rootEl;
    if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.href = foundLink.href;
      rootEl.classList.add('cta-analytics', 'analytics_cta_click', 'footer-list__item--link', 'd-inline-block');
    } else {
      rootEl = document.createElement('span');
    }
    rootEl.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, rootEl);
    li.appendChild(rootEl);

    const hierarchyRoot = hierarchyCell?.querySelector('ul');
    if (hierarchyRoot) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('nav-dropdown'); // This class is not in ORIGINAL HTML, but seems to be an internal helper. If it should be from original HTML, it needs to be provided.

      // Create a temporary div to parse the innerHTML and apply classes
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell to tempDiv

      // Apply classes to nested elements from ORIGINAL HTML
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('footer-list', 'nav-dropdown-menu')); // Add classes from ORIGINAL HTML
      tempDiv.querySelectorAll('li').forEach(liItem => liItem.classList.add('nav-menu-item', 'list-item')); // Add classes from ORIGINAL HTML
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('footer-list__item--link', 'nav-dropdown-item')); // Add classes from ORIGINAL HTML

      // Move children from tempDiv to wrapper
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
      transformNestedLists(wrapper.querySelector('ul')); // Pass the actual root UL for recursive transformation
    }

    if (i % 2 === 0) {
      navListLeft.append(li);
    } else {
      navListRight.append(li);
    }
  });

  const secondarySection = document.createElement('section');
  secondarySection.classList.add('footer-brand__secondary');
  block.append(secondarySection);

  const secondaryContainer = document.createElement('div');
  secondaryContainer.classList.add('container', 'fmm-container');
  secondarySection.append(secondaryContainer);

  const secondaryContent = document.createElement('div');
  secondaryContent.classList.add(
    'footer-brand__secondary--content',
    'd-flex',
    'flex-column',
    'flex-md-row',
    'justify-content-md-between',
    'align-items-center',
  );
  secondaryContainer.append(secondaryContent);

  const secondaryLeft = document.createElement('section');
  secondaryLeft.classList.add('footer-brand__left');
  secondaryContent.append(secondaryLeft);

  const secondaryLeftList = document.createElement('ul');
  secondaryLeftList.classList.add(
    'footer-brand__left--list',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'flex-wrap',
  );
  secondaryLeft.append(secondaryLeftList);

  secondaryLinks.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('footer-brand__left--item');

    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      const anchor = document.createElement('a');
      anchor.href = foundLink.href;
      anchor.textContent = labelCell?.textContent.trim() || '';
      anchor.classList.add('footer-brand__left--link', 'cta-analytics');
      moveInstrumentation(row, anchor);
      li.append(anchor);
    } else {
      const span = document.createElement('span');
      span.textContent = labelCell?.textContent.trim() || '';
      li.append(span);
    }
    secondaryLeftList.append(li);
  });

  // Copyright Text
  if (copyrightRow) {
    const li = document.createElement('li');
    li.classList.add('footer-brand__left--item');
    const span = document.createElement('span');
    span.classList.add('footer-brand__left--text');
    span.textContent = copyrightRow.textContent.trim();
    moveInstrumentation(copyrightRow, span);
    li.append(span);
    secondaryLeftList.append(li);
  }

  const secondaryRight = document.createElement('section');
  secondaryRight.classList.add('footer-brand__right');
  secondaryContent.append(secondaryRight);

  const socialList = document.createElement('ul');
  socialList.classList.add(
    'footer-brand__right--list',
    'd-flex',
    'align-items-center',
    'justify-content-center',
  );
  secondaryRight.append(socialList);

  socialLinks.forEach((row) => {
    const [iconCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('footer-brand__right--item', 'd-flex', 'justify-content-center', 'align-items-center');

    const iconPicture = iconCell?.querySelector('picture');
    const foundLink = linkCell?.querySelector('a');

    if (iconPicture && foundLink) {
      const anchor = document.createElement('a');
      anchor.href = foundLink.href;
      anchor.classList.add('footer-brand__right--link', 'cta-analytics');
      anchor.setAttribute('target', '_blank'); // Assuming social links open in new tab
      anchor.setAttribute('aria-label', iconPicture.querySelector('img')?.alt || 'Social Link');

      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(iconPicture, optimizedPic);
      anchor.append(optimizedPic);

      const screenReaderOnly = document.createElement('span');
      screenReaderOnly.classList.add('cmp-link__screen-reader-only');
      screenReaderOnly.textContent = 'opens in a new tab';
      anchor.append(screenReaderOnly);

      moveInstrumentation(row, anchor);
      li.append(anchor);
    }
    socialList.append(li);
  });
}
