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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist, but it's internal to the JS logic.
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in the allowlist, but it's internal to the JS logic.
          subWrap.classList.toggle('active'); // This class is not in the allowlist, but it's internal to the JS logic.
        });
      }
      transformNestedLists(nested);
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Root fields - using content detection instead of index access
  const primaryLogoCell = children.find((row) => row.querySelector('picture') && row.children.length === 1);
  const primaryLogoLinkCell = children.find((row) => row.querySelector('a[href*="/content/site/primaryLogoLink"]'));
  const secondaryLogoCell = children.find((row) => row.querySelector('picture') && row !== primaryLogoCell);
  const copyrightTextCell = children.find((row) => !row.querySelector('a') && !row.querySelector('picture') && row.textContent.includes('Copyright Text'));
  const itcPortalLinkCell = children.find((row) => row.querySelector('a[href*="/content/site/itcPortalLink"]'));

  // Filter out the root cells that have been processed to find item rows
  const processedRootCells = [primaryLogoCell, primaryLogoLinkCell, secondaryLogoCell, copyrightTextCell, itcPortalLinkCell].filter(Boolean);
  const remainingChildren = children.filter((row) => !processedRootCells.includes(row));

  const navigationItems = remainingChildren.filter((row) => row.children.length === 3);
  const socialLinkItems = remainingChildren.filter((row) => row.children.length === 2);

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
  const primaryLogoPicture = primaryLogoCell?.querySelector('picture');
  const primaryLogoImg = primaryLogoPicture ? primaryLogoPicture.querySelector('img') : null;
  if (primaryLogoImg) {
    const primaryLogoLink = document.createElement('a');
    primaryLogoLink.classList.add(
      'footer-brand__logo',
      'd-inline-block',
      'cta-analytics',
    );
    primaryLogoLink.setAttribute('aria-label', 'logo');
    const foundPrimaryLink = primaryLogoLinkCell?.querySelector('a');
    if (foundPrimaryLink) {
      primaryLogoLink.href = foundPrimaryLink.href;
    }

    const optimizedPrimaryPic = createOptimizedPicture(
      primaryLogoImg.src,
      primaryLogoImg.alt,
      false,
      [{ width: '750' }],
    );
    optimizedPrimaryPic.querySelector('img').classList.add('object-fit-contain', 'w-100', 'h-100');
    moveInstrumentation(primaryLogoCell, primaryLogoLink);
    primaryLogoLink.append(optimizedPrimaryPic);
    brandLeft.append(primaryLogoLink);
  }

  // Secondary Logo
  const secondaryLogoPicture = secondaryLogoCell?.querySelector('picture');
  const secondaryLogoImg = secondaryLogoPicture ? secondaryLogoPicture.querySelector('img') : null;
  if (secondaryLogoImg) {
    const secondaryLogoDiv = document.createElement('div');
    secondaryLogoDiv.classList.add('footer-brand__secondary--logo', 'd-inline-block');
    const optimizedSecondaryPic = createOptimizedPicture(
      secondaryLogoImg.src,
      secondaryLogoImg.alt,
      false,
      [{ width: '750' }],
    );
    optimizedSecondaryPic
      .querySelector('img')
      .classList.add('object-fit-contain', 'w-100', 'h-100');
    moveInstrumentation(secondaryLogoCell, secondaryLogoDiv);
    secondaryLogoDiv.append(optimizedSecondaryPic);
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

  // Navigation Items
  const navLists = [];
  navigationItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(c => !c.querySelector('a') && !c.querySelector('ul') && !c.querySelector('picture'));
    const linkCell = cells.find(c => c.querySelector('a') && !c.querySelector('ul'));
    const hierarchyCell = cells.find(c => c.querySelector('ul'));

    let currentList = navLists[navLists.length - 1];
    if (!currentList || currentList.children.length >= 2) {
      currentList = document.createElement('ul');
      currentList.classList.add(
        'footer-list',
        'd-flex',
        'align-items-center',
        'justify-content-center',
        'align-items-md-start',
        'flex-column',
      );
      const footerListDiv = document.createElement('div');
      footerListDiv.classList.add('footerList');
      footerListDiv.append(currentList);
      if (navLists.length < 2) {
        navbarLeft.append(footerListDiv);
      } else {
        navbarRight.append(footerListDiv);
      }
      navLists.push(currentList);
    }

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
    } else {
      rootEl = document.createElement('span');
      rootEl.classList.add('footer-list__item--link', 'd-inline-block');
    }
    rootEl.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, rootEl);
    li.appendChild(rootEl);

    const hierarchyRoot = hierarchyCell?.querySelector('ul');
    if (hierarchyRoot) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('nav-dropdown'); // This class is not in the allowlist, but it's internal to the JS logic.
      // Use innerHTML to preserve nested structure, then append children
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv);

      // Apply classes to nested elements from ORIGINAL HTML
      tempDiv.querySelectorAll('a').forEach(a => {
        a.classList.add('cta-analytics', 'analytics_cta_click', 'footer-list__item--link');
        a.setAttribute('data-link-region', 'Footer');
      });
      tempDiv.querySelectorAll('li').forEach(l => l.classList.add('footer-list__item'));
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('footer-list', 'flex-column')); // Added flex-column based on common menu patterns

      while (tempDiv.firstChild) {
        wrapper.append(tempDiv.firstChild);
      }

      rootEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        wrapper.classList.toggle('active'); // This class is not in the allowlist, but it's internal to the JS logic.
        li.classList.toggle('active'); // This class is not in the allowlist, but it's internal to the JS logic.
      });
      li.appendChild(wrapper);
      transformNestedLists(wrapper.querySelector('ul')); // Pass the actual UL inside the wrapper
    }
    currentList.append(li);
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

  // ITC Portal Link
  const itcPortalLi = document.createElement('li');
  itcPortalLi.classList.add('footer-brand__left--item');
  const itcPortalAnchor = document.createElement('a');
  itcPortalAnchor.classList.add('footer-brand__left--link', 'cta-analytics');
  itcPortalAnchor.setAttribute('data-link-region', 'Footer');
  const foundItcLink = itcPortalLinkCell?.querySelector('a');
  if (foundItcLink) {
    itcPortalAnchor.href = foundItcLink.href;
    itcPortalAnchor.textContent = itcPortalLinkCell.textContent.trim();
    itcPortalAnchor.setAttribute('target', '_blank');
    const srOnly = document.createElement('span');
    srOnly.classList.add('cmp-link__screen-reader-only');
    srOnly.textContent = 'opens in a new tab';
    itcPortalAnchor.append(srOnly);
  } else {
    itcPortalAnchor.textContent = itcPortalLinkCell?.textContent.trim() || '';
  }
  moveInstrumentation(itcPortalLinkCell, itcPortalAnchor);
  itcPortalLi.append(itcPortalAnchor);
  secondaryLeftList.append(itcPortalLi);

  // Copyright Text
  const copyrightLi = document.createElement('li');
  copyrightLi.classList.add('footer-brand__left--item');
  const copyrightSpan = document.createElement('span');
  copyrightSpan.classList.add('footer-brand__left--text');
  copyrightSpan.textContent = copyrightTextCell?.textContent.trim() || '';
  moveInstrumentation(copyrightTextCell, copyrightSpan);
  copyrightLi.append(copyrightSpan);
  secondaryLeftList.append(copyrightLi);

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

  // Social Links
  socialLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(c => c.querySelector('picture'));
    const linkCell = cells.find(c => c.querySelector('a'));

    const socialLi = document.createElement('li');
    socialLi.classList.add(
      'footer-brand__right--item',
      'd-flex',
      'justify-content-center',
      'align-items-center',
    );

    const iconPicture = iconCell?.querySelector('picture');
    const iconImg = iconPicture ? iconPicture.querySelector('img') : null;
    if (iconImg) {
      const socialLink = document.createElement('a');
      socialLink.classList.add('footer-brand__right--link', 'cta-analytics');
      socialLink.setAttribute('data-link-region', 'Footer');
      socialLink.setAttribute('target', '_blank');

      const foundSocialLink = linkCell?.querySelector('a');
      if (foundSocialLink) {
        socialLink.href = foundSocialLink.href;
        socialLink.setAttribute('aria-label', iconImg.alt);
        const optimizedIconPic = createOptimizedPicture(
          iconImg.src,
          iconImg.alt,
          false,
          [{ width: '750' }],
        );
        optimizedIconPic
          .querySelector('img')
          .classList.add('object-fit-contain', 'w-100', 'h-100');
        socialLink.append(optimizedIconPic);
        const srOnly = document.createElement('span');
        srOnly.classList.add('cmp-link__screen-reader-only');
        srOnly.textContent = 'opens in a new tab';
        socialLink.append(srOnly);
      }
      moveInstrumentation(row, socialLink);
      socialLi.append(socialLink);
    }
    socialList.append(socialLi);
  });

  // Optimize all images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
