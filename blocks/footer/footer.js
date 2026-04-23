import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Normalize label-only nodes
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
      subWrap.classList.add('has-sub-child'); // Class from ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);

      // Apply classes to nested UL, LI, A elements
      nested.classList.add('footer-list'); // Example class, adjust as needed from ORIGINAL HTML
      nested.querySelectorAll('li').forEach(nestedLi => {
        nestedLi.classList.add('footer-list__item'); // Example class
      });
      nested.querySelectorAll('a').forEach(nestedA => {
        nestedA.classList.add('footer-list__item--link', 'cta-analytics'); // Example classes
      });

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

  const [
    logoRow,
    logoLinkRow,
    secondaryLogoRow,
    copyrightRow,
    ...itemRows
  ] = children;

  block.innerHTML = '';
  block.classList.add('container-hd', 'fmm-container', 'p-0');

  const footerBrand = document.createElement('div');
  footerBrand.classList.add('footer-brand', 'w-100');
  block.append(footerBrand);

  // Primary Footer Brand Section
  const footerBrandPrimary = document.createElement('section');
  footerBrandPrimary.classList.add('footer-brand__primary');
  footerBrand.append(footerBrandPrimary);

  const primaryContainer = document.createElement('div');
  primaryContainer.classList.add('container', 'fmm-container');
  footerBrandPrimary.append(primaryContainer);

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

  const footerBrandLeft = document.createElement('section');
  footerBrandLeft.classList.add('footer-brand__left', 'd-flex', 'gap-5', 'align-items-center');
  primaryContent.append(footerBrandLeft);

  // Primary Logo
  const logoPicture = logoRow?.querySelector('picture');
  const logoLinkFound = logoLinkRow?.querySelector('a');
  if (logoPicture && logoLinkFound) {
    const logoAnchor = document.createElement('a');
    logoAnchor.href = logoLinkFound.href;
    logoAnchor.classList.add('footer-brand__logo', 'd-inline-block', 'cta-analytics');
    logoAnchor.setAttribute('aria-label', 'logo');
    moveInstrumentation(logoLinkRow, logoAnchor);
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoAnchor.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('object-fit-contain', 'w-100', 'h-100');
    }
    footerBrandLeft.append(logoAnchor);
  }

  // Secondary Logo
  const secondaryLogoPicture = secondaryLogoRow?.querySelector('picture');
  if (secondaryLogoPicture) {
    const secondaryLogoDiv = document.createElement('div');
    secondaryLogoDiv.classList.add('footer-brand__secondary--logo', 'd-inline-block');
    moveInstrumentation(secondaryLogoRow, secondaryLogoDiv);
    const img = secondaryLogoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      secondaryLogoDiv.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('object-fit-contain', 'w-100', 'h-100');
    }
    footerBrandLeft.append(secondaryLogoDiv);
  }

  const footerBrandRight = document.createElement('section');
  footerBrandRight.classList.add('footer-brand__right');
  primaryContent.append(footerBrandRight);

  const footerBrandNavbar = document.createElement('nav');
  footerBrandNavbar.classList.add('footer-brand__navbar', 'd-grid', 'd-md-flex');
  footerBrandNavbar.setAttribute('aria-label', 'footer navbar');
  footerBrandRight.append(footerBrandNavbar);

  const footerBrandNavbarLeft = document.createElement('div');
  footerBrandNavbarLeft.classList.add('footer-brand__navbar--left', 'd-flex', 'flex-column', 'flex-md-row');
  footerBrandNavbar.append(footerBrandNavbarLeft);

  const footerBrandNavbarRight = document.createElement('div');
  footerBrandNavbarRight.classList.add('footer-brand__navbar--right', 'd-flex', 'flex-column', 'flex-md-row');
  footerBrandNavbar.append(footerBrandNavbarRight);

  // Navigation Menus (footer-navigation-item)
  const navigationMenus = itemRows.filter((row) => row.children.length === 3);
  const menuGroups = {}; // Group menus into two columns for left and right navbars

  navigationMenus.forEach((row, i) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children];
    const menuLabel = labelCell.textContent.trim();
    const menuLink = linkCell.querySelector('a')?.href;
    
    const li = document.createElement('li');
    li.classList.add('footer-list__item');

    let rootEl;
    if (menuLink) {
      rootEl = document.createElement('a');
      rootEl.href = menuLink;
      rootEl.classList.add('cta-analytics', 'analytics_cta_click', 'footer-list__item--link', 'd-inline-block');
      rootEl.setAttribute('data-link-region', 'Footer');
    } else {
      rootEl = document.createElement('span');
    }
    rootEl.textContent = menuLabel;
    moveInstrumentation(row, rootEl);
    li.appendChild(rootEl);

    if (hierarchyCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML; // Use innerHTML for richtext
      const hierarchyRoot = tempDiv.querySelector('ul');

      if (hierarchyRoot) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('nav-dropdown'); // Class from ORIGINAL HTML
        
        // Apply classes to the root UL and its children
        hierarchyRoot.classList.add('footer-list'); // Example class, adjust as needed from ORIGINAL HTML
        hierarchyRoot.querySelectorAll('li').forEach(nestedLi => {
          nestedLi.classList.add('footer-list__item'); // Example class
        });
        hierarchyRoot.querySelectorAll('a').forEach(nestedA => {
          nestedA.classList.add('footer-list__item--link', 'cta-analytics'); // Example classes
        });

        wrapper.appendChild(hierarchyRoot);
        moveInstrumentation(hierarchyCell, wrapper); // Move instrumentation for the richtext cell
        rootEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          wrapper.classList.toggle('active');
          li.classList.toggle('active');
        });
        li.appendChild(wrapper);
        transformNestedLists(hierarchyRoot);
      }
    }

    const groupIndex = Math.floor(i / 2); // Group into two lists for each navbar section
    if (!menuGroups[groupIndex]) {
      menuGroups[groupIndex] = document.createElement('ul');
      menuGroups[groupIndex].classList.add(
        'footer-list',
        'd-flex',
        'align-items-center',
        'justify-content-center',
        'align-items-md-start',
        'flex-column',
      );
    }
    menuGroups[groupIndex].append(li);
  });

  Object.values(menuGroups).forEach((ul, index) => {
    const footerListDiv = document.createElement('div');
    footerListDiv.classList.add('footerList');
    footerListDiv.append(ul);
    if (index < 2) { // First two groups go to left navbar
      footerBrandNavbarLeft.append(footerListDiv);
    } else { // Remaining groups go to right navbar
      footerBrandNavbarRight.append(footerListDiv);
    }
  });

  // Secondary Footer Brand Section
  const footerBrandSecondary = document.createElement('section');
  footerBrandSecondary.classList.add('footer-brand__secondary');
  footerBrand.append(footerBrandSecondary);

  const secondaryContainer = document.createElement('div');
  secondaryContainer.classList.add('container', 'fmm-container');
  footerBrandSecondary.append(secondaryContainer);

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

  const footerBrandLeftSecondary = document.createElement('section');
  footerBrandLeftSecondary.classList.add('footer-brand__left');
  secondaryContent.append(footerBrandLeftSecondary);

  const footerBrandLeftList = document.createElement('ul');
  footerBrandLeftList.classList.add(
    'footer-brand__left--list',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'flex-wrap',
  );
  footerBrandLeftSecondary.append(footerBrandLeftList);

  // Secondary Links (footer-link-item)
  const secondaryLinks = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture'));
  secondaryLinks.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const linkLabel = labelCell.textContent.trim();
    const linkUrl = linkCell.querySelector('a')?.href;

    if (linkLabel && linkUrl) {
      const li = document.createElement('li');
      li.classList.add('footer-brand__left--item');
      const anchor = document.createElement('a');
      anchor.href = linkUrl;
      anchor.textContent = linkLabel;
      anchor.classList.add('footer-brand__left--link', 'cta-analytics');
      anchor.setAttribute('data-link-region', 'Footer');
      moveInstrumentation(row, anchor);
      li.append(anchor);
      footerBrandLeftList.append(li);
    }
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
    footerBrandLeftList.append(li);
  }

  const footerBrandRightSecondary = document.createElement('section');
  footerBrandRightSecondary.classList.add('footer-brand__right');
  secondaryContent.append(footerBrandRightSecondary);

  const footerBrandRightList = document.createElement('ul');
  footerBrandRightList.classList.add(
    'footer-brand__right--list',
    'd-flex',
    'align-items-center',
    'justify-content-center',
  );
  footerBrandRightSecondary.append(footerBrandRightList);

  // Social Links (footer-social-link-item)
  const socialLinks = itemRows.filter((row) => row.children.length === 2 && row.querySelector('picture'));
  socialLinks.forEach((row) => {
    const [iconCell, linkCell] = [...row.children];
    const iconPicture = iconCell.querySelector('picture');
    const socialLink = linkCell.querySelector('a')?.href;

    if (iconPicture && socialLink) {
      const li = document.createElement('li');
      li.classList.add('footer-brand__right--item', 'd-flex', 'justify-content-center', 'align-items-center');
      const anchor = document.createElement('a');
      anchor.href = socialLink;
      anchor.classList.add('footer-brand__right--link', 'cta-analytics');
      anchor.setAttribute('data-link-region', 'Footer');
      anchor.setAttribute('target', '_blank'); // Assuming social links open in new tab
      moveInstrumentation(row, anchor);

      const img = iconPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '48' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        anchor.append(optimizedPic);
        optimizedPic.querySelector('img').classList.add('object-fit-contain', 'w-100', 'h-100');
        optimizedPic.querySelector('img').setAttribute('aria-label', img.alt);
      }
      const screenReaderOnly = document.createElement('span');
      screenReaderOnly.classList.add('cmp-link__screen-reader-only');
      screenReaderOnly.textContent = 'opens in a new tab';
      anchor.append(screenReaderOnly);

      li.append(anchor);
      footerBrandRightList.append(li);
    }
  });
}
