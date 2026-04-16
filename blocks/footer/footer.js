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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist, but seems to be a functional class for the dropdown behavior. Assuming it's intended.
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

  // Use content detection for the first few rows based on the BlockJson model
  const primaryLogoRow = children.find(row => row.querySelector('picture') && row.children.length === 1);
  const primaryLogoLinkRow = children.find(row => row.querySelector('a') && row.querySelector('a').href.includes('/content/') && row.children.length === 1);
  const secondaryLogoRow = children.find(row => row !== primaryLogoRow && row.querySelector('picture') && row.children.length === 1);
  const copyrightRow = children.find(row => !row.querySelector('picture') && !row.querySelector('a') && row.textContent.includes('Copyright') && row.children.length === 1);

  // Filter out the identified rows from the children array to get itemRows
  const itemRows = children.filter(row =>
    row !== primaryLogoRow &&
    row !== primaryLogoLinkRow &&
    row !== secondaryLogoRow &&
    row !== copyrightRow
  );

  block.innerHTML = ''; // Clear the block content

  const footerSection = document.createElement('section');
  footerSection.classList.add('container-hd', 'fmm-container', 'p-0');

  const footerBrand = document.createElement('div');
  footerBrand.classList.add('footer-brand', 'w-100');

  // Primary section
  const footerBrandPrimary = document.createElement('section');
  footerBrandPrimary.classList.add('footer-brand__primary');
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
  if (primaryLogoRow && primaryLogoLinkRow) {
    const primaryLogoPicture = primaryLogoRow.querySelector('picture');
    const primaryLogoLink = primaryLogoLinkRow.querySelector('a');
    if (primaryLogoPicture && primaryLogoLink) {
      const logoAnchor = document.createElement('a');
      logoAnchor.href = primaryLogoLink.href;
      logoAnchor.classList.add('footer-brand__logo', 'd-inline-block', 'cta-analytics');
      logoAnchor.setAttribute('aria-label', 'logo');

      const img = primaryLogoPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoAnchor.append(optimizedPic);
      footerBrandLeft.append(logoAnchor);
    }
  }

  // Secondary Logo
  if (secondaryLogoRow) {
    const secondaryLogoPicture = secondaryLogoRow.querySelector('picture');
    if (secondaryLogoPicture) {
      const secondaryLogoDiv = document.createElement('div');
      secondaryLogoDiv.classList.add('footer-brand__secondary--logo', 'd-inline-block');
      const img = secondaryLogoPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      secondaryLogoDiv.append(optimizedPic);
      footerBrandLeft.append(secondaryLogoDiv);
    }
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

  const navigationItems = itemRows.filter((row) => row.children.length === 3);
  const socialLinks = itemRows.filter((row) => row.children.length === 2);

  // Group navigation items into two lists for left and right nav
  // Original HTML shows 4 lists, 2 in navLeft, 2 in navRight.
  // The JS currently tries to put all navigation items into navLeft and navRight based on a split.
  // Let's create 4 distinct lists as per the original HTML structure.
  const numNavItems = navigationItems.length;
  const itemsPerList = Math.ceil(numNavItems / 4); // Distribute across 4 lists

  const footerListLeft1 = document.createElement('div');
  footerListLeft1.classList.add('footerList');
  const ulLeft1 = document.createElement('ul');
  ulLeft1.classList.add(
    'footer-list',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'align-items-md-start',
    'flex-column',
  );
  footerListLeft1.append(ulLeft1);

  const footerListLeft2 = document.createElement('div');
  footerListLeft2.classList.add('footerList');
  const ulLeft2 = document.createElement('ul');
  ulLeft2.classList.add(
    'footer-list',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'align-items-md-start',
    'flex-column',
  );
  footerListLeft2.append(ulLeft2);

  const footerListRight1 = document.createElement('div');
  footerListRight1.classList.add('footerList');
  const ulRight1 = document.createElement('ul');
  ulRight1.classList.add(
    'footer-list',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'align-items-md-start',
    'flex-column',
  );
  footerListRight1.append(ulRight1);

  const footerListRight2 = document.createElement('div'); // Added for the fourth list
  footerListRight2.classList.add('footerList');
  const ulRight2 = document.createElement('ul');
  ulRight2.classList.add(
    'footer-list',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'align-items-md-start',
    'flex-column',
  );
  footerListRight2.append(ulRight2);


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
      rootEl.classList.add(
        'cta-analytics',
        'analytics_cta_click',
        'footer-list__item--link',
        'd-inline-block',
      );
      rootEl.setAttribute('data-link-region', 'Footer');
      rootEl.textContent = labelCell?.textContent.trim() || ''; // Use labelCell for text content
    } else {
      rootEl = document.createElement('span');
      rootEl.classList.add('footer-list__item--text'); // Custom class for non-link labels
      rootEl.textContent = labelCell?.textContent.trim() || '';
    }
    moveInstrumentation(row, rootEl);
    li.appendChild(rootEl);

    const hierarchyRoot = hierarchyCell?.querySelector('ul');
    if (hierarchyRoot) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('nav-dropdown'); // Use class from original HTML if available
      
      // Apply classes to nested elements from the original HTML if they exist
      hierarchyRoot.querySelectorAll('a').forEach(a => a.classList.add('footer-list__item--link'));
      hierarchyRoot.querySelectorAll('li').forEach(l => l.classList.add('footer-list__item'));
      hierarchyRoot.classList.add('footer-list'); // Add to the root ul

      // Move instrumentation for the hierarchy cell
      moveInstrumentation(hierarchyCell, wrapper);

      // Append children from the hierarchyRoot to the wrapper
      while (hierarchyRoot.firstChild) {
        wrapper.append(hierarchyRoot.firstChild);
      }
      
      rootEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        wrapper.classList.toggle('active');
        li.classList.toggle('active');
      });
      li.appendChild(wrapper);
      transformNestedLists(wrapper.querySelector('ul')); // Pass the actual UL inside the wrapper
    }

    // Distribute items across the four lists
    if (i < itemsPerList) {
      ulLeft1.append(li);
    } else if (i < itemsPerList * 2) {
      ulLeft2.append(li);
    } else if (i < itemsPerList * 3) {
      ulRight1.append(li);
    } else {
      ulRight2.append(li);
    }
  });

  if (ulLeft1.children.length > 0) navLeft.append(footerListLeft1);
  if (ulLeft2.children.length > 0) navLeft.append(footerListLeft2);
  if (ulRight1.children.length > 0) navRight.append(footerListRight1);
  if (ulRight2.children.length > 0) navRight.append(footerListRight2); // Append the fourth list

  nav.append(navLeft, navRight);
  footerBrandRight.append(nav);
  primaryContent.append(footerBrandRight);
  primaryContainer.append(primaryContent);
  footerBrandPrimary.append(primaryContainer);
  footerBrand.append(footerBrandPrimary);

  // Secondary section (copyright and social links)
  const footerBrandSecondary = document.createElement('section');
  footerBrandSecondary.classList.add('footer-brand__secondary');
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

  const footerBrandLeftSecondary = document.createElement('section');
  footerBrandLeftSecondary.classList.add('footer-brand__left');
  const copyrightList = document.createElement('ul');
  copyrightList.classList.add(
    'footer-brand__left--list',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'flex-wrap',
  );

  // Copyright text
  if (copyrightRow) {
    const copyrightLi = document.createElement('li');
    copyrightLi.classList.add('footer-brand__left--item');
    const copyrightTextSpan = document.createElement('span');
    copyrightTextSpan.classList.add('footer-brand__left--text');
    copyrightTextSpan.textContent = copyrightRow.textContent.trim();
    moveInstrumentation(copyrightRow, copyrightTextSpan);
    copyrightLi.append(copyrightTextSpan);
    copyrightList.append(copyrightLi);
  }
  footerBrandLeftSecondary.append(copyrightList);
  secondaryContent.append(footerBrandLeftSecondary);

  const footerBrandRightSecondary = document.createElement('section');
  footerBrandRightSecondary.classList.add('footer-brand__right');
  const socialList = document.createElement('ul');
  socialList.classList.add(
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

    const iconPicture = iconCell.querySelector('picture');
    const socialLink = linkCell.querySelector('a');

    if (iconPicture && socialLink) {
      const socialAnchor = document.createElement('a');
      socialAnchor.href = socialLink.href;
      socialAnchor.classList.add('footer-brand__right--link', 'cta-analytics');
      socialAnchor.setAttribute('data-link-region', 'Footer');
      socialAnchor.setAttribute('target', '_blank');

      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      socialAnchor.append(optimizedPic);

      const screenReaderOnlySpan = document.createElement('span');
      screenReaderOnlySpan.classList.add('cmp-link__screen-reader-only');
      screenReaderOnlySpan.textContent = 'opens in a new tab';
      socialAnchor.append(screenReaderOnlySpan);

      li.append(socialAnchor);
      socialList.append(li);
    }
  });

  footerBrandRightSecondary.append(socialList);
  secondaryContent.append(footerBrandRightSecondary);
  secondaryContainer.append(secondaryContent);
  footerBrandSecondary.append(secondaryContainer);
  footerBrand.append(footerBrandSecondary);

  footerSection.append(footerBrand);
  block.append(footerSection);
}
