import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    li.classList.add('cmp-new-footer__nav-item'); // Add class from ORIGINAL HTML
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Handle label-only nodes
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
      subWrap.classList.add('cmp-new-footer__nav-group'); // Use class from ORIGINAL HTML
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
    // Apply classes to nested <a> elements
    li.querySelectorAll(':scope > a').forEach((a) => {
      a.classList.add('cmp-new-footer__nav-link'); // Add class from ORIGINAL HTML
    });
    li.querySelectorAll('ul').forEach((ul) => {
      ul.classList.add('cmp-new-footer__nav-group'); // Add class from ORIGINAL HTML
    });
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Use content detection instead of fixed indices for root rows
  const itcLogoRow = children.find(row => row.querySelector('picture') && row.querySelector('picture').alt === 'ITC Logo');
  const itcLogoLinkRow = children.find(row => row.querySelector('a') && row.querySelector('a').href.includes('logo-itc-link'));
  const fssaiLogoRow = children.find(row => row.querySelector('picture') && row.querySelector('picture').alt === 'Fssai Logo');

  // Filter out the identified root rows to get itemRows
  const itemRows = children.filter(row =>
    row !== itcLogoRow && row !== itcLogoLinkRow && row !== fssaiLogoRow
  );

  block.innerHTML = '';
  block.classList.add('cmp-new-footer');

  const topContent = document.createElement('div');
  topContent.classList.add('cmp-new-footer__top-content');

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('cmp-image', 'cmp-new-footer__logo');

  // ITC Logo
  const itcLink = document.createElement('a');
  itcLink.classList.add('cmp-image__link');
  const itcLinkHref = itcLogoLinkRow?.querySelector('a')?.href;
  if (itcLinkHref) {
    itcLink.href = itcLinkHref;
  } else {
    itcLink.href = '#';
  }

  const itcPicture = itcLogoRow?.querySelector('picture');
  if (itcPicture) {
    const itcImg = itcPicture.querySelector('img');
    if (itcImg) {
      const optimizedItcPic = createOptimizedPicture(itcImg.src, itcImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(itcImg, optimizedItcPic.querySelector('img'));
      optimizedItcPic.querySelector('img').classList.add('cmp-image__image_df_itc');
      itcLink.append(optimizedItcPic);
    }
  }
  logoWrapper.append(itcLink);
  if (itcLogoRow) moveInstrumentation(itcLogoRow, itcLink);
  if (itcLogoLinkRow) moveInstrumentation(itcLogoLinkRow, itcLink);

  // Fssai Logo
  const fssaiPicture = fssaiLogoRow?.querySelector('picture');
  if (fssaiPicture) {
    const fssaiImg = fssaiPicture.querySelector('img');
    if (fssaiImg) {
      const optimizedFssaiPic = createOptimizedPicture(fssaiImg.src, fssaiImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(fssaiImg, optimizedFssaiPic.querySelector('img'));
      optimizedFssaiPic.querySelector('img').classList.add('cmp-image__image_df_fssai');
      logoWrapper.append(optimizedFssaiPic);
    }
  }
  if (fssaiLogoRow) moveInstrumentation(fssaiLogoRow, logoWrapper);

  topContent.append(logoWrapper);

  const navSection = document.createElement('div');
  navSection.classList.add('cmp-new-footer__nav');

  const navigationItems = itemRows.filter((row) => row.children.length === 3 && row.querySelector('ul'));
  const footerTitles = itemRows.filter((row) => row.children.length === 2);
  const socialLinks = itemRows.filter((row) => row.children.length === 3 && !row.querySelector('ul'));

  // Navigation
  if (navigationItems.length > 0) {
    const navGroup = document.createElement('ul');
    navGroup.classList.add('cmp-new-footer__nav-group');
    navigationItems.forEach((row) => {
      const cells = [...row.children];
      const labelCell = cells[0];
      const linkCell = cells[1];
      const hierarchyCell = cells[2];

      const li = document.createElement('li');
      li.classList.add('cmp-new-footer__nav-item');

      const foundLink = linkCell?.querySelector('a');
      let rootEl;
      if (foundLink) {
        rootEl = document.createElement('a');
        rootEl.href = foundLink.href;
        rootEl.classList.add('cmp-new-footer__nav-link');
      } else {
        rootEl = document.createElement('span');
      }
      rootEl.textContent = labelCell?.textContent.trim() || '';
      moveInstrumentation(row, rootEl);
      li.appendChild(rootEl);

      // Handle hierarchy-tree richtext field
      if (hierarchyCell) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML; // Use innerHTML to preserve structure
        moveInstrumentation(hierarchyCell, tempDiv);

        const hierarchyRoot = tempDiv.querySelector('ul');
        if (hierarchyRoot) {
          const wrapper = document.createElement('div');
          wrapper.classList.add('cmp-new-footer__nav-group'); // Use class from ORIGINAL HTML
          wrapper.appendChild(hierarchyRoot);

          // Apply classes to nested elements within the hierarchy-tree
          hierarchyRoot.querySelectorAll('a').forEach(a => a.classList.add('cmp-new-footer__nav-link'));
          hierarchyRoot.querySelectorAll('ul').forEach(ul => ul.classList.add('cmp-new-footer__nav-group'));
          hierarchyRoot.querySelectorAll('li').forEach(liItem => liItem.classList.add('cmp-new-footer__nav-item'));

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
      navGroup.appendChild(li);
    });
    navSection.append(navGroup);
  }
  topContent.append(navSection);
  block.append(topContent);

  const bottomContent = document.createElement('div');
  bottomContent.classList.add('cmp-new-footer__bottom-content');
  const bottomContainer = document.createElement('div');
  bottomContainer.classList.add('cmp-new-footer__container');

  // Footer Titles
  if (footerTitles.length > 0) {
    const itcTitles = document.createElement('div');
    itcTitles.classList.add('cmp-new-footer__ITC-Titles');
    footerTitles.forEach((row) => {
      const [titleCell, linkCell] = [...row.children];
      const link = document.createElement('a');
      link.classList.add('desc-1');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      } else {
        link.href = '#';
      }
      link.textContent = titleCell?.textContent.trim() || '';
      moveInstrumentation(row, link);
      itcTitles.append(link);
    });
    bottomContainer.append(itcTitles);
  }

  // Social Links
  if (socialLinks.length > 0) {
    const socialMedia = document.createElement('div');
    socialMedia.classList.add('cmp-new-footer__social-media');
    socialLinks.forEach((row) => {
      const [iconClassCell, linkCell, socialTypeCell] = [...row.children];
      const link = document.createElement('a');
      const iconClass = iconClassCell?.textContent.trim();
      if (iconClass) {
        link.classList.add(iconClass);
      }
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      } else {
        link.href = '#';
      }
      const socialType = socialTypeCell?.textContent.trim();
      if (socialType) {
        link.setAttribute('data-social', socialType);
      }
      moveInstrumentation(row, link);
      socialMedia.append(link);
    });
    bottomContainer.append(socialMedia);
  }

  bottomContent.append(bottomContainer);
  block.append(bottomContent);

  // Optimize all images within the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
