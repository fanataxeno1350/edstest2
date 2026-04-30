import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    // Add classes from ORIGINAL HTML to li
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');

    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (anchor) {
      // Add classes from ORIGINAL HTML to anchor
      anchor.classList.add('cmp-navigation__item-link');
    } else {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        // Add classes from ORIGINAL HTML to span if it acts as a link
        span.classList.add('cmp-navigation__item-link');
        textNode.remove();
        li.prepend(span);
      }
    }

    if (nested) {
      // Add classes from ORIGINAL HTML to nested ul
      nested.classList.add('cmp-navigation__group');

      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('nav-dropdown'); // Class from ORIGINAL HTML
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
  const children = [...block.children];

  // CRITICAL: Use content detection instead of index access for root rows
  const logoRow = children.find(row => row.querySelector('picture') && row.nextElementSibling?.querySelector('a'));
  const logoLinkRow = children.find(row => row.querySelector('a') && row.previousElementSibling?.querySelector('picture'));
  const fssaiLogoRow = children.find(row => row.querySelector('picture') && !row.previousElementSibling?.querySelector('a'));

  // Filter out the identified root rows to get itemRows
  const itemRows = children.filter(row => row !== logoRow && row !== logoLinkRow && row !== fssaiLogoRow);

  const footer = document.createElement('div');
  footer.classList.add('cmp-footer');
  moveInstrumentation(block, footer);

  const footerTopContent = document.createElement('div');
  footerTopContent.classList.add('cmp-footer__top-content');

  const footerNavLogo = document.createElement('div');
  footerNavLogo.classList.add('cmp-footer__nav-logo');

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

  // Logo
  if (logoRow) { // Ensure logoRow exists
    const logoPicture = logoRow.querySelector('picture');
    if (logoPicture) {
      const logoLink = document.createElement('a');
      logoLink.classList.add('inlineBlockClass');
      if (logoLinkRow) { // Ensure logoLinkRow exists
        const foundLink = logoLinkRow.querySelector('a');
        if (foundLink) logoLink.href = foundLink.href;
      }

      const img = logoPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
      bnaturalFooterDesktopDiv.append(logoLink);
    }
  }


  // FSSAI Logo
  if (fssaiLogoRow) { // Ensure fssaiLogoRow exists
    const fssaiLogoPicture = fssaiLogoRow.querySelector('picture');
    if (fssaiLogoPicture) {
      const fssaiImg = fssaiLogoPicture.querySelector('img');
      const optimizedFssaiPic = createOptimizedPicture(fssaiImg.src, fssaiImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(fssaiImg, optimizedFssaiPic.querySelector('img'));
      optimizedFssaiPic.classList.add('inlineBlockClass');
      bnaturalFooterDesktopDiv.append(optimizedFssaiPic);
    }
  }

  bnaturalFooterDiv.append(bnaturalFooterDesktopDiv);
  // For mobile, assuming the same content structure as desktop for now
  const bnaturalFooterMobileDiv = document.createElement('div');
  bnaturalFooterMobileDiv.classList.add('bnatural-footer-mobile-div');
  bnaturalFooterMobileDiv.innerHTML = bnaturalFooterDesktopDiv.innerHTML; // Reusing desktop content for mobile
  bnaturalFooterDiv.append(bnaturalFooterMobileDiv);

  footerLogoDiv.append(bnaturalFooterDiv);
  cmpImage.append(footerLogoDiv);
  logoDiv.append(cmpImage);
  footerNavLogo.append(logoDiv);
  footerTopContent.append(footerNavLogo);

  const footerNav = document.createElement('div');
  footerNav.classList.add('cmp-footer__nav');

  const footerNavItemsOne = document.createElement('div');
  footerNavItemsOne.classList.add('cmp-footer_nav-items', 'cmp-navigation_group--right', 'unsetBorder');
  const navOne = document.createElement('div');
  navOne.classList.add('navigation');
  const linksOne = document.createElement('div');
  linksOne.classList.add('linksone', 'links');
  const navElementOne = document.createElement('nav');
  navElementOne.classList.add('cmp-navigation');
  const ulOne = document.createElement('ul');
  ulOne.classList.add('cmp-navigation__group');

  const footerNavItemsTwo = document.createElement('div');
  footerNavItemsTwo.classList.add('cmp-footer_nav-items', 'cmp-navigation_group--right', 'unsetBorder');
  const navTwo = document.createElement('div');
  navTwo.classList.add('navigation');
  const linksTwo = document.createElement('div');
  linksTwo.classList.add('linkstwo', 'links');
  const navElementTwo = document.createElement('nav');
  navElementTwo.classList.add('cmp-navigation');
  const ulTwo = document.createElement('ul');
  ulTwo.classList.add('cmp-navigation__group');

  const footerNavItemsThree = document.createElement('div');
  footerNavItemsThree.classList.add('cmp-footer_nav-items', 'cmp-navigation_group--right', 'unsetBorder');
  footerNavItemsThree.style.borderRight = 'unset'; // As per original HTML
  const navThree = document.createElement('div');
  navThree.classList.add('navigation');
  const linksThree = document.createElement('div');
  linksThree.classList.add('linksthree', 'links');
  const navElementThree = document.createElement('nav');
  navElementThree.classList.add('cmp-navigation');
  const ulThree = document.createElement('ul');
  ulThree.classList.add('cmp-navigation__group');

  const footerLinksContainer = document.createElement('div');
  footerLinksContainer.classList.add('cmp-footer__bottom-content');
  const footerLinksInnerContainer = document.createElement('div');
  footerLinksInnerContainer.classList.add('cmp-footer__container');
  const itcLinksContainer = document.createElement('div');
  itcLinksContainer.classList.add('cmp-footer__container-itclinks');

  const socialMediaContainer = document.createElement('div');
  socialMediaContainer.classList.add('cmp-footer__container__social-media');

  const navigationItems = itemRows.filter((row) => row.children.length === 3);
  const footerLinkItems = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture'));
  const socialIconItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('picture'));

  navigationItems.forEach((row, i) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');

    const foundLink = linkCell.querySelector('a');
    let rootEl;
    if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.classList.add('cmp-navigation__item-link');
      rootEl.href = foundLink.href;
    } else {
      rootEl = document.createElement('span'); // Fallback for label-only
      rootEl.classList.add('cmp-navigation__item-link');
    }
    rootEl.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, rootEl);
    li.appendChild(rootEl);

    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      // Use innerHTML to preserve nested structure
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv); // Instrument the original cell to the tempDiv

      const wrapper = document.createElement('div');
      wrapper.classList.add('nav-dropdown'); // Class from ORIGINAL HTML

      // Apply classes to all nested elements within the hierarchy-tree
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('cmp-navigation__group'));
      tempDiv.querySelectorAll('li').forEach(liEl => liEl.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0'));
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('cmp-navigation__item-link'));

      // Move children from tempDiv to wrapper
      while (tempDiv.firstChild) {
        wrapper.append(tempDiv.firstChild);
      }

      rootEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        wrapper.classList.toggle('active');
        li.classList.toggle('active');
      });
      li.appendChild(wrapper);
      // transformNestedLists expects a root ul, so pass the ul from the wrapper
      const ulInWrapper = wrapper.querySelector('ul');
      if (ulInWrapper) {
        transformNestedLists(ulInWrapper);
      }
    }

    if (i < 5) { // Assuming first 5 nav items go to ulOne
      ulOne.append(li);
    } else if (i < 9) { // Next 4 nav items go to ulTwo
      ulTwo.append(li);
    } else { // Remaining nav items go to ulThree
      ulThree.append(li);
    }
  });

  footerLinkItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const link = document.createElement('a');
    link.classList.add('footer-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) link.href = foundLink.href;
    link.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, link);
    itcLinksContainer.append(link);
  });

  socialIconItems.forEach((row, i) => {
    const [iconCell, linkCell] = [...row.children];
    const socialIconDiv = document.createElement('div');
    socialIconDiv.classList.add(`soc_icon_${i + 1}`, 'image');

    const cmpSocialImage = document.createElement('div');
    cmpSocialImage.classList.add('cmp-image');

    const socialLink = document.createElement('a');
    socialLink.classList.add('cmp-image__link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) socialLink.href = foundLink.href;

    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      socialLink.append(optimizedPic);
    }
    cmpSocialImage.append(socialLink);
    socialIconDiv.append(cmpSocialImage);
    moveInstrumentation(row, socialIconDiv);
    socialMediaContainer.append(socialIconDiv);
  });

  linksOne.append(navElementOne);
  navElementOne.append(ulOne);
  navOne.append(linksOne);
  footerNavItemsOne.append(navOne);
  footerNav.append(footerNavItemsOne);

  linksTwo.append(navElementTwo);
  navElementTwo.append(ulTwo);
  navTwo.append(linksTwo);
  footerNavItemsTwo.append(navTwo);
  footerNav.append(footerNavItemsTwo);

  linksThree.append(navElementThree);
  navElementThree.append(ulThree);
  navThree.append(linksThree);
  footerNavItemsThree.append(navThree);
  footerNav.append(footerNavItemsThree);

  // Append empty nav items as per original HTML structure
  ['linksfour', 'linksfive', 'linkssix'].forEach((className) => {
    const emptyNavItems = document.createElement('div');
    emptyNavItems.classList.add('cmp-footer_nav-items', 'cmp-navigation_group--right');
    emptyNavItems.style.display = 'none';
    const emptyNavDiv = document.createElement('div');
    emptyNavDiv.classList.add('navigation');
    const emptyLinksDiv = document.createElement('div');
    emptyLinksDiv.classList.add(className, 'links');
    const emptyNavElement = document.createElement('nav');
    emptyNavElement.classList.add('cmp-navigation');
    const emptyUl = document.createElement('ul');
    emptyUl.classList.add('cmp-navigation__group');
    emptyNavElement.append(emptyUl);
    emptyLinksDiv.append(emptyNavElement);
    emptyNavDiv.append(emptyLinksDiv);
    emptyNavItems.append(emptyNavDiv);
    footerNav.append(emptyNavItems);
  });

  footerTopContent.append(footerNav);
  footer.append(footerTopContent);

  footerLinksInnerContainer.append(itcLinksContainer);
  footerLinksInnerContainer.append(socialMediaContainer);
  footerLinksContainer.append(footerLinksInnerContainer);
  footer.append(footerLinksContainer);

  block.innerHTML = '';
  block.classList.add('footer-new');
  block.append(footer);
}
