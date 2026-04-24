import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    // Add classes to li elements from ORIGINAL HTML if applicable
    li.classList.add('nav-menu-item', 'list-item'); // Assuming these are desired classes for nested list items

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
      // Add classes to nested ul elements from ORIGINAL HTML if applicable
      nested.classList.add('nav-menu-list', 'list-group'); // Assuming these are desired classes for nested ul

      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-sub-child'); // Use class from ORIGINAL HTML
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
  const rows = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.classList.add('cmp-new-footer');
  moveInstrumentation(block, wrapper);

  // Fixed fields - using content detection for robustness
  const backgroundImageRow = rows.find(row => row.querySelector('picture') && !row.querySelector('a'));
  const logoItcRow = rows.find(row => row.querySelector('picture') && row.nextElementSibling?.querySelector('a'));
  const logoItcLinkRow = rows.find(row => row.querySelector('a') && row.previousElementSibling?.querySelector('picture'));
  const logoFssaiRow = rows.find(row => row.querySelector('picture') && !row.previousElementSibling?.querySelector('a') && !row.nextElementSibling?.querySelector('picture'));

  const itemRows = rows.filter(row =>
    row !== backgroundImageRow &&
    row !== logoItcRow &&
    row !== logoItcLinkRow &&
    row !== logoFssaiRow
  );

  const topContent = document.createElement('div');
  topContent.classList.add('cmp-new-footer__top-content');

  const backgroundImage = backgroundImageRow?.querySelector('picture');
  if (backgroundImage) {
    const img = backgroundImage.querySelector('img');
    if (img) {
      topContent.style.backgroundImage = `url(${img.src})`;
    }
  }

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('cmp-image', 'cmp-new-footer__logo');

  const itcLogoPicture = logoItcRow?.querySelector('picture');
  const fssaiLogoPicture = logoFssaiRow?.querySelector('picture');

  if (itcLogoPicture) {
    const itcLink = document.createElement('a');
    itcLink.classList.add('cmp-image__link');
    const itcAnchor = logoItcLinkRow?.querySelector('a');
    if (itcAnchor) {
      itcLink.href = itcAnchor.href;
    }
    itcLink.target = '_self';

    const itcImg = itcLogoPicture.querySelector('img');
    if (itcImg) {
      const optimizedItcPic = createOptimizedPicture(itcImg.src, itcImg.alt, false, [{ width: '750' }]);
      const optimizedItcImg = optimizedItcPic.querySelector('img');
      optimizedItcImg.classList.add('cmp-image__image_df_itc');
      moveInstrumentation(itcImg, optimizedItcImg);
      itcLink.append(optimizedItcPic);
    }
    logoDiv.append(itcLink);
  }

  if (fssaiLogoPicture) {
    const fssaiImg = fssaiLogoPicture.querySelector('img');
    if (fssaiImg) {
      const optimizedFssaiPic = createOptimizedPicture(fssaiImg.src, fssaiImg.alt, false, [{ width: '750' }]);
      const optimizedFssaiImg = optimizedFssaiPic.querySelector('img');
      optimizedFssaiImg.classList.add('cmp-image__image_df_fssai');
      moveInstrumentation(fssaiImg, optimizedFssaiImg);
      logoDiv.append(optimizedFssaiPic);
    }
  }

  topContent.append(logoDiv);

  const navContainer = document.createElement('div');
  navContainer.classList.add('cmp-new-footer__nav');

  const navigationItems = itemRows.filter((row) => row.children.length === 3);
  const footerLinks = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('a') && !row.querySelector('picture'));
  const socialLinks = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a'));

  if (navigationItems.length > 0) {
    const navGroup = document.createElement('ul');
    navGroup.classList.add('cmp-new-footer__nav-group');
    navigationItems.forEach((row) => {
      const cells = [...row.children];
      const labelCell = cells.find(c => !c.querySelector('a') && !c.querySelector('ul'));
      const linkCell = cells.find(c => c.querySelector('a') && !c.querySelector('ul'));
      const hierarchyCell = cells.find(c => c.querySelector('ul'));

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

      if (hierarchyCell) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML; // Use innerHTML for richtext
        moveInstrumentation(hierarchyCell, tempDiv);

        const hierarchyRoot = tempDiv.querySelector('ul');
        if (hierarchyRoot) {
          // Apply classes to the root ul from the richtext
          hierarchyRoot.classList.add('nav-menu-list', 'list-group'); // Assuming these are desired classes

          // Apply classes to nested elements within the richtext
          hierarchyRoot.querySelectorAll('li').forEach(item => {
            item.classList.add('nav-menu-item', 'list-item'); // Assuming these are desired classes
          });
          hierarchyRoot.querySelectorAll('a').forEach(link => {
            link.classList.add('nav-menu-link'); // Assuming this is a desired class
          });

          const wrapperDiv = document.createElement('div');
          wrapperDiv.classList.add('nav-dropdown'); // Use ORIGINAL HTML class
          wrapperDiv.appendChild(hierarchyRoot);

          rootEl.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            wrapperDiv.classList.toggle('active');
            li.classList.toggle('active');
          });
          li.appendChild(wrapperDiv);
          transformNestedLists(hierarchyRoot);
        }
      }
      navGroup.appendChild(li);
    });
    navContainer.append(navGroup);
  }

  topContent.append(navContainer);
  wrapper.append(topContent);

  const bottomContent = document.createElement('div');
  bottomContent.classList.add('cmp-new-footer__bottom-content');

  const bottomContainer = document.createElement('div');
  bottomContainer.classList.add('cmp-new-footer__container');

  const itcTitles = document.createElement('div');
  itcTitles.classList.add('cmp-new-footer__ITC-Titles');

  if (footerLinks.length > 0) {
    footerLinks.forEach((row) => {
      const [labelCell, linkCell] = [...row.children];
      const link = document.createElement('a');
      link.classList.add('desc-1');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      }
      link.textContent = labelCell.textContent.trim();
      link.target = '_blank';
      moveInstrumentation(row, link);
      itcTitles.append(link);
    });
  }
  bottomContainer.append(itcTitles);

  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('cmp-new-footer__social-media');

  if (socialLinks.length > 0) {
    socialLinks.forEach((row) => {
      const [socialTypeCell, linkCell] = [...row.children];
      const link = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      }
      link.target = 'New tab';
      const socialType = socialTypeCell.textContent.trim().toLowerCase();
      link.classList.add(`icon-${socialType}`);
      link.setAttribute('data-social', socialType);
      moveInstrumentation(row, link);
      socialMediaDiv.append(link);
    });
  }
  bottomContainer.append(socialMediaDiv);

  bottomContent.append(bottomContainer);
  wrapper.append(bottomContent);

  block.innerHTML = '';
  block.append(wrapper);

  wrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
