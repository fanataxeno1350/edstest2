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
        li.prepend(span);
        textNode.remove();
      }
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      // Use class from original HTML if available, otherwise a generic one.
      // The original HTML shows 'nav-dropdown' for nested lists.
      subWrap.classList.add('nav-dropdown');
      subWrap.append(nested);
      li.append(subWrap);

      // Add classes to nested elements from ORIGINAL HTML
      nested.querySelectorAll('ul').forEach(ul => ul.classList.add('footer-list'));
      nested.querySelectorAll('li').forEach(liItem => liItem.classList.add('footer-list__item'));
      nested.querySelectorAll('a').forEach(a => a.classList.add('cta-analytics', 'analytics_cta_click', 'footer-list__item--link', 'd-inline-block'));

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Use content detection for root fields as per BlockJson and EDS guidelines
  const primaryLogoRow = children.find(row => row.querySelector('picture'));
  const primaryLogoLinkRow = children.find(row => row.children[0]?.querySelector('a') && row.children[0].textContent.includes('/content/site/primaryLogoLink'));
  const secondaryLogoRow = children.find(row => row.children[0]?.querySelector('picture') && row !== primaryLogoRow);
  const copyrightTextRow = children.find(row => row.children[0]?.textContent.includes('Copyright Text label text'));

  // Filter out the identified root rows to get itemRows
  const itemRows = children.filter(row =>
    row !== primaryLogoRow &&
    row !== primaryLogoLinkRow &&
    row !== secondaryLogoRow &&
    row !== copyrightTextRow
  );

  block.innerHTML = '';
  block.classList.add('w-100');

  const primarySection = document.createElement('section');
  primarySection.classList.add('footer-brand__primary');
  const primaryContainer = document.createElement('div');
  primaryContainer.classList.add('container', 'fmm-container');
  const primaryContent = document.createElement('div');
  primaryContent.classList.add(
    'footer-brand__primary--content',
    'd-flex',
    'flex-column',
    'flex-md-row',
    'justify-content-md-between',
    'align-items-center',
  );

  const footerBrandLeft = document.createElement('section');
  footerBrandLeft.classList.add('footer-brand__left', 'd-flex', 'gap-5', 'align-items-center');

  // Primary Logo
  const primaryLogoPicture = primaryLogoRow?.querySelector('picture');
  const primaryLogoLink = primaryLogoLinkRow?.querySelector('a'); // Read a.href
  if (primaryLogoPicture && primaryLogoLink) {
    const logoAnchor = document.createElement('a');
    logoAnchor.href = primaryLogoLink.href; // Correctly read href
    logoAnchor.classList.add('footer-brand__logo', 'd-inline-block', 'cta-analytics');
    logoAnchor.setAttribute('aria-label', 'logo');

    const img = primaryLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    optimizedPic.querySelector('img').classList.add('object-fit-contain', 'w-100', 'h-100');
    moveInstrumentation(primaryLogoPicture, optimizedPic);
    logoAnchor.append(optimizedPic);
    footerBrandLeft.append(logoAnchor);
  }

  // Secondary Logo
  const secondaryLogoPicture = secondaryLogoRow?.querySelector('picture');
  if (secondaryLogoPicture) {
    const secondaryLogoDiv = document.createElement('div');
    secondaryLogoDiv.classList.add('footer-brand__secondary--logo', 'd-inline-block');
    const img = secondaryLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    optimizedPic.querySelector('img').classList.add('object-fit-contain', 'w-100', 'h-100');
    moveInstrumentation(secondaryLogoPicture, optimizedPic);
    secondaryLogoDiv.append(optimizedPic);
    footerBrandLeft.append(secondaryLogoDiv);
  }

  primaryContent.append(footerBrandLeft);

  const footerBrandRight = document.createElement('section');
  footerBrandRight.classList.add('footer-brand__right');

  const nav = document.createElement('nav');
  nav.classList.add('footer-brand__navbar', 'd-grid', 'd-md-flex');
  nav.setAttribute('aria-label', 'footer navbar');

  const navLeft = document.createElement('div');
  navLeft.classList.add('footer-brand__navbar--left', 'd-flex', 'flex-column', 'flex-md-row');

  const navRight = document.createElement('div');
  navRight.classList.add('footer-brand__navbar--right', 'd-flex', 'flex-column', 'flex-md-row');

  // Item row filtering based on BlockJson structure
  const navigationLinks = itemRows.filter((row) => row.children.length === 3); // label, link, hierarchy-tree
  const secondaryLinks = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture')); // label, link
  const socialLinks = itemRows.filter((row) => row.children.length === 2 && row.querySelector('picture')); // icon, link

  // Navigation Links
  const navListWrappers = [];
  navigationLinks.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const linkCell = cells[1];
    const hierarchyCell = cells[2];

    let navListWrapper = navListWrappers[navListWrappers.length - 1];
    if (!navListWrapper || navListWrapper.children.length >= 2) {
      navListWrapper = document.createElement('div');
      navListWrapper.classList.add('footerList');
      navListWrappers.push(navListWrapper);
    }

    const ul = navListWrapper.querySelector('ul') || document.createElement('ul');
    ul.classList.add(
      'footer-list',
      'd-flex',
      'align-items-center',
      'justify-content-center',
      'align-items-md-start',
      'flex-column',
    );
    if (!ul.parentElement) navListWrapper.append(ul);

    const li = document.createElement('li');
    li.classList.add('footer-list__item');

    const foundLink = linkCell?.querySelector('a');
    const hierarchyRootContent = hierarchyCell?.innerHTML; // Read innerHTML for richtext
    let rootEl;

    if (hierarchyRootContent && hierarchyCell.querySelector('ul')) { // Check if it actually contains a UL
      rootEl = document.createElement('span'); // Use span for parent with dropdown
      rootEl.classList.add('cta-analytics', 'analytics_cta_click', 'footer-list__item--link', 'd-inline-block');
      rootEl.textContent = labelCell?.textContent.trim() || '';

      const wrapper = document.createElement('div');
      wrapper.classList.add('nav-dropdown'); // Class from original HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyRootContent;
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell to tempDiv

      // Apply classes to nested elements from ORIGINAL HTML
      tempDiv.querySelectorAll('ul').forEach(ulItem => ulItem.classList.add('footer-list'));
      tempDiv.querySelectorAll('li').forEach(liItem => liItem.classList.add('footer-list__item'));
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('cta-analytics', 'analytics_cta_click', 'footer-list__item--link', 'd-inline-block'));

      while (tempDiv.firstChild) {
        wrapper.append(tempDiv.firstChild);
      }

      rootEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        wrapper.classList.toggle('active');
        li.classList.toggle('active');
      });
      li.appendChild(rootEl);
      li.appendChild(wrapper);
      transformNestedLists(wrapper); // Pass the wrapper containing the hierarchyRoot
    } else if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.href = foundLink.href; // Correctly read href
      rootEl.textContent = labelCell?.textContent.trim() || '';
      rootEl.classList.add('cta-analytics', 'analytics_cta_click', 'footer-list__item--link', 'd-inline-block');
      li.appendChild(rootEl);
    } else {
      rootEl = document.createElement('span');
      rootEl.textContent = labelCell?.textContent.trim() || '';
      rootEl.classList.add('footer-list__item--link', 'd-inline-block');
      li.appendChild(rootEl);
    }
    moveInstrumentation(row, li);
    ul.appendChild(li);
  });

  navListWrappers.forEach((wrapper, index) => {
    if (index < 2) {
      navLeft.append(wrapper);
    } else {
      navRight.append(wrapper);
    }
  });

  nav.append(navLeft, navRight);
  footerBrandRight.append(nav);
  primaryContent.append(footerBrandRight);
  primaryContainer.append(primaryContent);
  primarySection.append(primaryContainer);
  block.append(primarySection);

  // Secondary Section
  const secondarySection = document.createElement('section');
  secondarySection.classList.add('footer-brand__secondary');
  const secondaryContainer = document.createElement('div');
  secondaryContainer.classList.add('container', 'fmm-container');
  const secondaryContent = document.createElement('div');
  secondaryContent.classList.add(
    'footer-brand__secondary--content',
    'd-flex',
    'flex-column',
    'flex-md-row',
    'justify-content-md-between',
    'align-items-center',
  );

  const secondaryLeft = document.createElement('section');
  secondaryLeft.classList.add('footer-brand__left');
  const secondaryLeftList = document.createElement('ul');
  secondaryLeftList.classList.add(
    'footer-brand__left--list',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'flex-wrap',
  );

  // Secondary Links
  secondaryLinks.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const linkCell = cells[1];
    const li = document.createElement('li');
    li.classList.add('footer-brand__left--item');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href; // Correctly read href
      anchor.textContent = labelCell.textContent.trim();
      anchor.classList.add('footer-brand__left--link', 'cta-analytics');
      moveInstrumentation(row, anchor);
      li.append(anchor);
      secondaryLeftList.append(li);
    }
  });

  // Copyright Text
  if (copyrightTextRow) {
    const li = document.createElement('li');
    li.classList.add('footer-brand__left--item');
    const span = document.createElement('span');
    span.classList.add('footer-brand__left--text');
    span.textContent = copyrightTextRow.children[0].textContent.trim(); // Access the cell content
    moveInstrumentation(copyrightTextRow, li);
    li.append(span);
    secondaryLeftList.append(li);
  }

  secondaryLeft.append(secondaryLeftList);
  secondaryContent.append(secondaryLeft);

  const secondaryRight = document.createElement('section');
  secondaryRight.classList.add('footer-brand__right');
  const secondaryRightList = document.createElement('ul');
  secondaryRightList.classList.add(
    'footer-brand__right--list',
    'd-flex',
    'align-items-center',
    'justify-content-center',
  );

  // Social Links
  socialLinks.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells[0];
    const linkCell = cells[1];
    const li = document.createElement('li');
    li.classList.add('footer-brand__right--item', 'd-flex', 'justify-content-center', 'align-items-center');

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    const picture = iconCell.querySelector('picture');

    if (foundLink && picture) {
      anchor.href = foundLink.href; // Correctly read href
      anchor.classList.add('footer-brand__right--link', 'cta-analytics');
      anchor.setAttribute('target', '_blank'); // Assuming social links open in new tab

      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]); // Adjust width as needed
      optimizedPic.querySelector('img').classList.add('object-fit-contain', 'w-100', 'h-100');
      optimizedPic.querySelector('img').setAttribute('aria-label', img.alt);
      moveInstrumentation(picture, optimizedPic);
      anchor.append(optimizedPic);

      const screenReaderOnly = document.createElement('span');
      screenReaderOnly.classList.add('cmp-link__screen-reader-only');
      screenReaderOnly.textContent = 'opens in a new tab';
      anchor.append(screenReaderOnly);

      moveInstrumentation(row, li);
      li.append(anchor);
      secondaryRightList.append(li);
    }
  });

  secondaryRight.append(secondaryRightList);
  secondaryContent.append(secondaryRight);
  secondaryContainer.append(secondaryContent);
  secondarySection.append(secondaryContainer);
  block.append(secondarySection);
}
