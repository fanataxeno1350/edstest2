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
      subWrap.classList.add('has-sub-child'); // Use original HTML class
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
  block.classList.add('footer-new');

  const [
    logoRow,
    logoLinkRow,
    fssaiLogoRow,
    desktopBackgroundRow,
    mobileBackgroundRow,
    ...itemRows
  ] = [...block.children];

  const logoPicture = logoRow?.querySelector('picture');
  const logoLink = logoLinkRow?.querySelector('a');
  const fssaiLogoPicture = fssaiLogoRow?.querySelector('picture');
  const desktopBackgroundPicture = desktopBackgroundRow?.querySelector('picture');
  const mobileBackgroundPicture = mobileBackgroundRow?.querySelector('picture');

  // Create main footer structure
  const cmpFooter = document.createElement('div');
  cmpFooter.classList.add('cmp-footer');

  const cmpFooterTopContent = document.createElement('div');
  cmpFooterTopContent.classList.add('cmp-footer__top-content');

  const cmpFooterNavLogo = document.createElement('div');
  cmpFooterNavLogo.classList.add('cmp-footer__nav-logo');
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image');
  const cmpImage = document.createElement('div');
  cmpImage.classList.add('cmp-image');
  const footerLogoDiv = document.createElement('div');
  footerLogoDiv.classList.add('footerLogo');
  const bnaturalFooterDiv = document.createElement('div');
  bnaturalFooterDiv.classList.add('bnatural-footer-div');

  const bnaturalFooterDesktopDiv = document.createElement('div');
  bnaturalFooterDesktopDiv.classList.add('bnatural-footer-desktop-div');
  if (logoPicture) {
    const logoAnchor = document.createElement('a');
    logoAnchor.classList.add('inlineBlockClass');
    if (logoLink) logoAnchor.href = logoLink.href;
    const optimizedLogoPic = createOptimizedPicture(
      logoPicture.querySelector('img').src,
      logoPicture.querySelector('img').alt,
      false,
      [{ width: '750' }],
    );
    moveInstrumentation(logoPicture, optimizedLogoPic.querySelector('img'));
    logoAnchor.append(optimizedLogoPic);
    bnaturalFooterDesktopDiv.append(logoAnchor);
  }
  if (fssaiLogoPicture) {
    const optimizedFssaiPic = createOptimizedPicture(
      fssaiLogoPicture.querySelector('img').src,
      fssaiLogoPicture.querySelector('img').alt,
      false,
      [{ width: '750' }],
    );
    optimizedFssaiPic.querySelector('img').classList.add('inlineBlockClass');
    moveInstrumentation(fssaiLogoPicture, optimizedFssaiPic.querySelector('img'));
    bnaturalFooterDesktopDiv.append(optimizedFssaiPic);
  }
  bnaturalFooterDiv.append(bnaturalFooterDesktopDiv);

  const bnaturalFooterMobileDiv = document.createElement('div');
  bnaturalFooterMobileDiv.classList.add('bnatural-footer-mobile-div');
  if (logoPicture) {
    const logoAnchor = document.createElement('a');
    logoAnchor.classList.add('inlineBlockClass');
    if (logoLink) logoAnchor.href = logoLink.href;
    const optimizedLogoPic = createOptimizedPicture(
      logoPicture.querySelector('img').src,
      logoPicture.querySelector('img').alt,
      false,
      [{ width: '750' }],
    );
    moveInstrumentation(logoPicture, optimizedLogoPic.querySelector('img'));
    logoAnchor.append(optimizedLogoPic);
    bnaturalFooterMobileDiv.append(logoAnchor);
  }
  if (fssaiLogoPicture) {
    const optimizedFssaiPic = createOptimizedPicture(
      fssaiLogoPicture.querySelector('img').src,
      fssaiLogoPicture.querySelector('img').alt,
      false,
      [{ width: '750' }],
    );
    optimizedFssaiPic.querySelector('img').classList.add('inlineBlockClass');
    moveInstrumentation(fssaiLogoPicture, optimizedFssaiPic.querySelector('img'));
    bnaturalFooterMobileDiv.append(optimizedFssaiPic);
  }
  bnaturalFooterDiv.append(bnaturalFooterMobileDiv);

  footerLogoDiv.append(bnaturalFooterDiv);
  cmpImage.append(footerLogoDiv);
  logoDiv.append(cmpImage);
  cmpFooterNavLogo.append(logoDiv);
  cmpFooterTopContent.append(cmpFooterNavLogo);

  // Set background images
  if (desktopBackgroundPicture) {
    const desktopImg = desktopBackgroundPicture.querySelector('img');
    const desktopSrc = desktopImg ? desktopImg.src : '';
    block.style.setProperty('--footer-desktop-bg', `url(${desktopSrc})`);
  }
  if (mobileBackgroundPicture) {
    const mobileImg = mobileBackgroundPicture.querySelector('img');
    const mobileSrc = mobileImg ? mobileImg.src : '';
    block.style.setProperty('--footer-mobile-bg', `url(${mobileSrc})`);
  }

  const cmpFooterNav = document.createElement('div');
  cmpFooterNav.classList.add('cmp-footer__nav');

  const navigationItems = itemRows.filter((row) => row.children.length === 3);
  const itcLinkItems = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture'));
  const socialLinkItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('picture'));

  // Group navigation items into three columns
  const linksOne = navigationItems.slice(0, Math.ceil(navigationItems.length / 3));
  const linksTwo = navigationItems.slice(linksOne.length, linksOne.length + Math.ceil(navigationItems.length / 3));
  const linksThree = navigationItems.slice(linksOne.length + linksTwo.length);

  const createNavigationSection = (items, sectionClass, addBorder = true) => {
    if (items.length === 0) return null;

    const navItemsWrapper = document.createElement('div');
    navItemsWrapper.classList.add('cmp-footer_nav-items', 'cmp-navigation_group--right');
    if (!addBorder) {
      navItemsWrapper.classList.add('unsetBorder');
    }

    const navigationDiv = document.createElement('div');
    navigationDiv.classList.add('navigation');
    const linksDiv = document.createElement('div');
    linksDiv.classList.add(sectionClass, 'links');
    const nav = document.createElement('nav');
    nav.classList.add('cmp-navigation');
    const ul = document.createElement('ul');
    ul.classList.add('cmp-navigation__group');

    items.forEach((row) => {
      const [labelCell, linkCell, hierarchyCell] = [...row.children];
      const li = document.createElement('li');
      li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');

      const foundLink = linkCell?.querySelector('a');
      let rootEl;
      if (foundLink) {
        rootEl = document.createElement('a');
        rootEl.classList.add('cmp-navigation__item-link');
        rootEl.href = foundLink.href;
      } else {
        rootEl = document.createElement('span');
      }
      rootEl.textContent = labelCell?.textContent.trim() || '';
      moveInstrumentation(row, rootEl);
      li.appendChild(rootEl);

      const hierarchyRootContainer = hierarchyCell?.querySelector('ul');
      if (hierarchyRootContainer) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML; // Read innerHTML for richtext
        moveInstrumentation(hierarchyCell, tempDiv); // Instrument original cell to tempDiv

        // Apply classes to nested elements as per original HTML structure
        tempDiv.querySelectorAll('ul').forEach(nestedUl => {
          nestedUl.classList.add('cmp-navigation__group');
        });
        tempDiv.querySelectorAll('li').forEach(nestedLi => {
          nestedLi.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-1'); // Assuming level 1 for nested
        });
        tempDiv.querySelectorAll('a').forEach(nestedA => {
          nestedA.classList.add('cmp-navigation__item-link');
        });

        const wrapper = document.createElement('div');
        wrapper.classList.add('nav-dropdown');
        while (tempDiv.firstChild) {
          wrapper.append(tempDiv.firstChild); // Move all children from tempDiv to wrapper
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
      ul.appendChild(li);
    });

    nav.append(ul);
    linksDiv.append(nav);
    navigationDiv.append(linksDiv);
    navItemsWrapper.append(navigationDiv);
    return navItemsWrapper;
  };

  const navSectionOne = createNavigationSection(linksOne, 'linksone');
  if (navSectionOne) cmpFooterNav.append(navSectionOne);

  const navSectionTwo = createNavigationSection(linksTwo, 'linkstwo');
  if (navSectionTwo) cmpFooterNav.append(navSectionTwo);

  const navSectionThree = createNavigationSection(linksThree, 'linksthree', false); // No border for the last one
  if (navSectionThree) cmpFooterNav.append(navSectionThree);

  cmpFooterTopContent.append(cmpFooterNav);
  cmpFooter.append(cmpFooterTopContent);

  const cmpFooterBottomContent = document.createElement('div');
  cmpFooterBottomContent.classList.add('cmp-footer__bottom-content');

  const cmpFooterContainer = document.createElement('div');
  cmpFooterContainer.classList.add('cmp-footer__container');

  const cmpFooterContainerItcLinks = document.createElement('div');
  cmpFooterContainerItcLinks.classList.add('cmp-footer__container-itclinks');
  itcLinkItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const anchor = document.createElement('a');
    anchor.classList.add('footer-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, anchor);
    cmpFooterContainerItcLinks.append(anchor);
  });
  cmpFooterContainer.append(cmpFooterContainerItcLinks);

  const cmpFooterContainerSocialMedia = document.createElement('div');
  cmpFooterContainerSocialMedia.classList.add('cmp-footer__container__social-media');
  socialLinkItems.forEach((row, index) => {
    const [iconCell, linkCell] = [...row.children];
    const socialIconDiv = document.createElement('div');
    socialIconDiv.classList.add(`soc_icon_${index + 1}`, 'image');

    const cmpImageDiv = document.createElement('div');
    cmpImageDiv.classList.add('cmp-image');

    const socialLink = document.createElement('a');
    socialLink.classList.add('cmp-image__link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) socialLink.href = foundLink.href;

    const picture = iconCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      socialLink.append(optimizedPic);
    }
    cmpImageDiv.append(socialLink);
    socialIconDiv.append(cmpImageDiv);
    cmpFooterContainerSocialMedia.append(socialIconDiv);
  });
  cmpFooterContainer.append(cmpFooterContainerSocialMedia);

  cmpFooterBottomContent.append(cmpFooterContainer);
  cmpFooter.append(cmpFooterBottomContent);

  block.innerHTML = '';
  moveInstrumentation(block, cmpFooter);
  block.append(cmpFooter);
}
