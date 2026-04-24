import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    // Handle label-only nodes
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
      subWrap.classList.add('nav-dropdown'); // use ORIGINAL HTML class for nested dropdowns
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
    }
  });
}

export default function decorate(block) {
  const [
    primaryLogoRow,
    primaryLogoLinkRow,
    secondaryLogoRow,
    copyrightRow,
    ...itemRows
  ] = [...block.children];

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

  // Primary Logo
  const primaryLogoPicture = primaryLogoRow?.querySelector('picture');
  const primaryLogoLink = primaryLogoLinkRow?.querySelector('a');
  if (primaryLogoPicture && primaryLogoLink) {
    const primaryLogoAnchor = document.createElement('a');
    primaryLogoAnchor.href = primaryLogoLink.href;
    primaryLogoAnchor.classList.add(
      'footer-brand__logo',
      'd-inline-block',
      'cta-analytics',
    );
    primaryLogoAnchor.setAttribute('aria-label', 'logo');
    moveInstrumentation(primaryLogoRow, primaryLogoAnchor);
    const img = primaryLogoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      primaryLogoAnchor.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('object-fit-contain', 'w-100', 'h-100');
    }
    brandLeft.append(primaryLogoAnchor);
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
    brandLeft.append(secondaryLogoDiv);
  }

  const brandRight = document.createElement('section');
  brandRight.classList.add('footer-brand__right');
  primaryContent.append(brandRight);

  const nav = document.createElement('nav');
  nav.classList.add('footer-brand__navbar', 'd-grid', 'd-md-flex');
  nav.setAttribute('aria-label', 'footer navbar');
  brandRight.append(nav);

  const navbarLeft = document.createElement('div');
  navbarLeft.classList.add('footer-brand__navbar--left', 'd-flex', 'flex-column', 'flex-md-row');
  nav.append(navbarLeft);

  const navbarRight = document.createElement('div');
  navbarRight.classList.add('footer-brand__navbar--right', 'd-flex', 'flex-column', 'flex-md-row');
  nav.append(navbarRight);

  const footerNavigationItems = itemRows.filter((row) => row.children.length === 3);
  const footerSocialLinks = itemRows.filter((row) => row.children.length === 2);

  const footerLists = [];
  footerNavigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children]; // Correct destructuring
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
      rootEl.classList.add('footer-list__item--text');
    }
    rootEl.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, rootEl);
    li.appendChild(rootEl);

    const hierarchyRoot = hierarchyCell?.querySelector('ul');
    if (hierarchyRoot) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('nav-dropdown'); // use ORIGINAL HTML class
      wrapper.appendChild(hierarchyRoot);
      rootEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        wrapper.classList.toggle('active');
        li.classList.toggle('active');
      });
      li.appendChild(wrapper);
      transformNestedLists(hierarchyRoot);
    }

    // Grouping into footerList divs, max 2 items per list
    let currentFooterList = footerLists[footerLists.length - 1];
    if (!currentFooterList || currentFooterList.children.length >= 2) {
      currentFooterList = document.createElement('div');
      currentFooterList.classList.add('footerList');
      const ul = document.createElement('ul');
      ul.classList.add('footer-list', 'd-flex', 'align-items-center', 'justify-content-center', 'align-items-md-start', 'flex-column');
      currentFooterList.append(ul);
      footerLists.push(currentFooterList);
    }
    currentFooterList.querySelector('ul').append(li);
  });

  footerLists.forEach((list, index) => {
    if (index < 2) {
      navbarLeft.append(list);
    } else {
      navbarRight.append(list);
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

  const secondaryBrandLeft = document.createElement('section');
  secondaryBrandLeft.classList.add('footer-brand__left');
  secondaryContent.append(secondaryBrandLeft);

  const secondaryBrandLeftList = document.createElement('ul');
  secondaryBrandLeftList.classList.add(
    'footer-brand__left--list',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'flex-wrap',
  );
  secondaryBrandLeft.append(secondaryBrandLeftList);

  // Copyright
  if (copyrightRow) {
    const copyrightLi = document.createElement('li');
    copyrightLi.classList.add('footer-brand__left--item');
    const copyrightSpan = document.createElement('span');
    copyrightSpan.classList.add('footer-brand__left--text');
    copyrightSpan.textContent = copyrightRow.textContent.trim();
    moveInstrumentation(copyrightRow, copyrightSpan);
    copyrightLi.append(copyrightSpan);
    secondaryBrandLeftList.append(copyrightLi);
  }

  const secondaryBrandRight = document.createElement('section');
  secondaryBrandRight.classList.add('footer-brand__right');
  secondaryContent.append(secondaryBrandRight);

  const socialList = document.createElement('ul');
  socialList.classList.add(
    'footer-brand__right--list',
    'd-flex',
    'align-items-center',
    'justify-content-center',
  );
  secondaryBrandRight.append(socialList);

  footerSocialLinks.forEach((row) => {
    const [iconCell, linkCell] = [...row.children]; // Correct destructuring
    const li = document.createElement('li');
    li.classList.add(
      'footer-brand__right--item',
      'd-flex',
      'justify-content-center',
      'align-items-center',
    );

    const link = linkCell?.querySelector('a');
    const iconPicture = iconCell?.querySelector('picture');

    if (link && iconPicture) {
      const socialLink = document.createElement('a');
      socialLink.href = link.href;
      socialLink.classList.add('footer-brand__right--link', 'cta-analytics');
      socialLink.target = '_blank';
      moveInstrumentation(row, socialLink);

      const img = iconPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        socialLink.append(optimizedPic);
        optimizedPic.querySelector('img').classList.add('object-fit-contain', 'w-100', 'h-100');
        socialLink.setAttribute('aria-label', img.alt);
      }
      const srOnlySpan = document.createElement('span');
      srOnlySpan.classList.add('cmp-link__screen-reader-only');
      srOnlySpan.textContent = 'opens in a new tab';
      socialLink.append(srOnlySpan);
      li.append(socialLink);
    }
    socialList.append(li);
  });
}
