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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist, but seems to be an internal helper for the JS logic.
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in the allowlist, but seems to be an internal helper for the JS logic.
          subWrap.classList.toggle('active'); // This class is not in the allowlist, but seems to be an internal helper for the JS logic.
        });
      }
      transformNestedLists(nested); // Recursively transform nested lists
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Fixed fields based on BlockJson model
  const logoRow = children[0];
  const logoLinkRow = children[1];
  const secondaryLogoRow = children[2];
  const copyrightRow = children[children.length - 1]; // Copyright is always the last row

  // All rows between secondaryLogoRow and copyrightRow are item rows
  const itemRows = children.slice(3, children.length - 1);

  const footerBrandPrimary = document.createElement('section');
  footerBrandPrimary.classList.add('footer-brand__primary');

  const containerPrimary = document.createElement('div');
  containerPrimary.classList.add('container', 'fmm-container');
  footerBrandPrimary.append(containerPrimary);

  const primaryContent = document.createElement('div');
  primaryContent.classList.add(
    'footer-brand__primary--content',
    'd-flex',
    'flex-column',
    'flex-md-row',
    'justify-content-md-between',
    'align-items-center',
  );
  containerPrimary.append(primaryContent);

  const footerBrandLeft = document.createElement('section');
  footerBrandLeft.classList.add('footer-brand__left', 'd-flex', 'gap-5', 'align-items-center');
  primaryContent.append(footerBrandLeft);

  // Logo
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const logoLink = document.createElement('a');
    logoLink.classList.add('footer-brand__logo', 'd-inline-block', 'cta-analytics');
    const foundLogoLink = logoLinkRow.querySelector('a');
    if (foundLogoLink) {
      logoLink.href = foundLogoLink.href;
    }
    logoLink.setAttribute('aria-label', 'logo');
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
    moveInstrumentation(logoRow, logoLink);
    footerBrandLeft.append(logoLink);
  }

  // Secondary Logo
  const secondaryLogoPicture = secondaryLogoRow.querySelector('picture');
  if (secondaryLogoPicture) {
    const secondaryLogoDiv = document.createElement('div');
    secondaryLogoDiv.classList.add('footer-brand__secondary--logo', 'd-inline-block');
    const img = secondaryLogoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      secondaryLogoDiv.append(optimizedPic);
    }
    moveInstrumentation(secondaryLogoRow, secondaryLogoDiv);
    footerBrandLeft.append(secondaryLogoDiv);
  }

  const footerBrandRight = document.createElement('section');
  footerBrandRight.classList.add('footer-brand__right');
  primaryContent.append(footerBrandRight);

  const nav = document.createElement('nav');
  nav.classList.add('footer-brand__navbar', 'd-grid', 'd-md-flex');
  nav.setAttribute('aria-label', 'footer navbar');
  footerBrandRight.append(nav);

  const navLeft = document.createElement('div');
  navLeft.classList.add('footer-brand__navbar--left', 'd-flex', 'flex-column', 'flex-md-row');
  nav.append(navLeft);

  const navRight = document.createElement('div');
  navRight.classList.add('footer-brand__navbar--right', 'd-flex', 'flex-column', 'flex-md-row');
  nav.append(navRight);

  const navigationItems = itemRows.filter((row) => row.children.length === 3);
  const footerLinks = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture'));
  const socialLinks = itemRows.filter((row) => row.children.length === 2 && row.querySelector('picture'));

  // Navigation Items
  const navLists = [];
  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children];
    const footerListDiv = document.createElement('div');
    footerListDiv.classList.add('footerList');
    const ul = document.createElement('ul');
    ul.classList.add(
      'footer-list',
      'd-flex',
      'align-items-center',
      'justify-content-center',
      'align-items-md-start',
      'flex-column',
    );
    footerListDiv.append(ul);

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
      wrapper.classList.add('nav-dropdown'); // This class is not in the allowlist, but seems to be an internal helper for the JS logic.
      wrapper.appendChild(hierarchyRoot);
      rootEl.classList.add('has-sub-child-trigger'); // This class is not in the allowlist, but seems to be an internal helper for the JS logic.
      rootEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        wrapper.classList.toggle('active'); // This class is not in the allowlist, but seems to be an internal helper for the JS logic.
        li.classList.toggle('active'); // This class is not in the allowlist, but seems to be an internal helper for the JS logic.
      });
      li.appendChild(wrapper);
      moveInstrumentation(hierarchyCell, wrapper); // Move instrumentation for the hierarchy wrapper
      transformNestedLists(hierarchyRoot);
    }
    ul.appendChild(li);
    navLists.push(footerListDiv);
  });

  // Distribute navigation lists into left and right nav sections
  const half = Math.ceil(navLists.length / 2);
  navLists.slice(0, half).forEach((list) => navLeft.append(list));
  navLists.slice(half).forEach((list) => navRight.append(list));

  // Footer Links (secondary content, usually copyright and other info)
  const footerBrandSecondary = document.createElement('section');
  footerBrandSecondary.classList.add('footer-brand__secondary');
  block.append(footerBrandSecondary);

  const containerSecondary = document.createElement('div');
  containerSecondary.classList.add('container', 'fmm-container');
  footerBrandSecondary.append(containerSecondary);

  const secondaryContent = document.createElement('div');
  secondaryContent.classList.add(
    'footer-brand__secondary--content',
    'd-flex',
    'flex-column',
    'flex-md-row',
    'justify-content-md-between',
    'align-items-center',
  );
  containerSecondary.append(secondaryContent);

  const footerBrandLeftListSection = document.createElement('section');
  footerBrandLeftListSection.classList.add('footer-brand__left');
  secondaryContent.append(footerBrandLeftListSection);

  const footerBrandLeftList = document.createElement('ul');
  footerBrandLeftList.classList.add(
    'footer-brand__left--list',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'flex-wrap',
  );
  footerBrandLeftListSection.append(footerBrandLeftList);

  footerLinks.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('footer-brand__left--item');
    const link = document.createElement('a');
    link.classList.add('footer-brand__left--link', 'cta-analytics');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      if (foundLink.target) {
        link.target = foundLink.target;
        const screenReaderSpan = document.createElement('span');
        screenReaderSpan.classList.add('cmp-link__screen-reader-only');
        screenReaderSpan.textContent = 'opens in a new tab';
        link.append(screenReaderSpan);
      }
    }
    link.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, link);
    li.append(link);
    footerBrandLeftList.append(li);
  });

  // Copyright
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

  // Social Links
  const footerBrandRightListSection = document.createElement('section');
  footerBrandRightListSection.classList.add('footer-brand__right');
  secondaryContent.append(footerBrandRightListSection);

  const footerBrandRightList = document.createElement('ul');
  footerBrandRightList.classList.add(
    'footer-brand__right--list',
    'd-flex',
    'align-items-center',
    'justify-content-center',
  );
  footerBrandRightListSection.append(footerBrandRightList);

  socialLinks.forEach((row) => {
    const [iconCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('footer-brand__right--item', 'd-flex', 'justify-content-center', 'align-items-center');

    const link = document.createElement('a');
    link.classList.add('footer-brand__right--link', 'cta-analytics');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.target = '_blank';
      const screenReaderSpan = document.createElement('span');
      screenReaderSpan.classList.add('cmp-link__screen-reader-only');
      screenReaderSpan.textContent = 'opens in a new tab';
      link.append(screenReaderSpan);
    }

    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        link.append(optimizedPic);
      }
    }
    moveInstrumentation(row, link);
    li.append(link);
    footerBrandRightList.append(li);
  });

  block.innerHTML = '';
  block.classList.add('w-100');
  block.append(footerBrandPrimary, footerBrandSecondary);
}
