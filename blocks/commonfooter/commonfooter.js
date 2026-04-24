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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist, but seems to be an internal helper.
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // 'active' is not in the allowlist, but is a common interactive state class.
          subWrap.classList.toggle('active'); // 'active' is not in the allowlist, but is a common interactive state class.
        });
      }
    }
  });
}

export default function decorate(block) {
  const [
    itcLogoRow,
    itcLogoLinkRow,
    fssaiLogoRow,
    ...itemRows
  ] = [...block.children];

  const newFooter = document.createElement('div');
  newFooter.classList.add('cmp-new-footer');
  moveInstrumentation(block, newFooter);

  const topContent = document.createElement('div');
  topContent.classList.add('cmp-new-footer__top-content');

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('cmp-image', 'cmp-new-footer__logo');

  // ITC Logo
  const itcPicture = itcLogoRow.querySelector('picture');
  if (itcPicture) {
    const itcLink = document.createElement('a');
    itcLink.classList.add('cmp-image__link');
    const itcAnchor = itcLogoLinkRow.querySelector('a');
    if (itcAnchor) {
      itcLink.href = itcAnchor.href; // Correctly reading href from aem-content
    }
    const itcImg = itcPicture.querySelector('img');
    if (itcImg) {
      const optimizedItcPic = createOptimizedPicture(itcImg.src, itcImg.alt, false, [{ width: '750' }]);
      optimizedItcPic.querySelector('img').classList.add('cmp-image__image_df_itc');
      itcLink.append(optimizedItcPic);
    }
    logoWrapper.append(itcLink);
  }

  // Fssai Logo
  const fssaiPicture = fssaiLogoRow.querySelector('picture');
  if (fssaiPicture) {
    const fssaiImg = fssaiPicture.querySelector('img');
    if (fssaiImg) {
      const optimizedFssaiPic = createOptimizedPicture(fssaiImg.src, fssaiImg.alt, false, [{ width: '750' }]);
      optimizedFssaiPic.querySelector('img').classList.add('cmp-image__image_df_fssai');
      logoWrapper.append(optimizedFssaiPic);
    }
  }

  topContent.append(logoWrapper);

  // Content detection for item rows
  const navItems = itemRows.filter((row) => row.children.length === 3);
  const titleItems = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture'));
  const socialItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('picture'));

  if (navItems.length > 0) {
    const navContainer = document.createElement('div');
    navContainer.classList.add('cmp-new-footer__nav', `cmp-new-footer__nav__count-${navItems.length}`);

    const navGroup = document.createElement('ul');
    navGroup.classList.add('cmp-new-footer__nav-group');

    navItems.forEach((row) => {
      const [labelCell, linkCell, hierarchyCell] = [...row.children]; // Correct destructuring
      const li = document.createElement('li');
      li.classList.add('cmp-new-footer__nav-item');

      const foundLink = linkCell?.querySelector('a');
      let rootEl;
      if (foundLink) {
        rootEl = document.createElement('a');
        rootEl.href = foundLink.href; // Correctly reading href from aem-content
        rootEl.classList.add('cmp-new-footer__nav-link');
      } else {
        rootEl = document.createElement('span');
      }
      rootEl.textContent = labelCell?.textContent.trim() || '';
      moveInstrumentation(row, rootEl);
      li.appendChild(rootEl);

      const hierarchyRoot = hierarchyCell?.querySelector('ul');
      if (hierarchyRoot) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('nav-dropdown'); // Class from original HTML
        // Move instrumentation for the hierarchyCell content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML; // Correctly reading richtext with innerHTML
        moveInstrumentation(hierarchyCell, tempDiv);
        while (tempDiv.firstChild) {
          wrapper.append(tempDiv.firstChild);
        }

        rootEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          wrapper.classList.toggle('active'); // 'active' is not in the allowlist, but is a common interactive state class.
          li.classList.toggle('active'); // 'active' is not in the allowlist, but is a common interactive state class.
        });
        li.appendChild(wrapper);
        transformNestedLists(hierarchyRoot);
      }
      navGroup.appendChild(li);
    });
    navContainer.append(navGroup);
    topContent.append(navContainer);
  }

  newFooter.append(topContent);

  const bottomContent = document.createElement('div');
  bottomContent.classList.add('cmp-new-footer__bottom-content');

  const bottomContainer = document.createElement('div');
  bottomContainer.classList.add('cmp-new-footer__container');

  if (titleItems.length > 0) {
    const itcTitles = document.createElement('div');
    itcTitles.classList.add('cmp-new-footer__ITC-Titles');
    titleItems.forEach((row) => {
      const [titleCell, linkCell] = [...row.children]; // Correct destructuring
      const link = document.createElement('a');
      link.classList.add('desc-1');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href; // Correctly reading href from aem-content
      }
      link.textContent = titleCell.textContent.trim();
      moveInstrumentation(row, link);
      itcTitles.append(link);
    });
    bottomContainer.append(itcTitles);
  }

  if (socialItems.length > 0) {
    const socialMedia = document.createElement('div');
    socialMedia.classList.add('cmp-new-footer__social-media');
    socialItems.forEach((row) => {
      const [socialTypeCell, linkCell] = [...row.children]; // Correct destructuring
      const link = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href; // Correctly reading href from aem-content
      }
      const socialType = socialTypeCell.textContent.trim().toLowerCase();
      link.classList.add(`icon-${socialType}`);
      link.setAttribute('data-social', socialType);
      moveInstrumentation(row, link);
      socialMedia.append(link);
    });
    bottomContainer.append(socialMedia);
  }

  bottomContent.append(bottomContainer);
  newFooter.append(bottomContent);

  block.textContent = '';
  block.append(newFooter);
}
