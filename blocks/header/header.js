import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const appName = block.querySelector('[data-app-name]').textContent;
  block.textContent = '';

  const headerContainer = document.createElement('header');
  headerContainer.className = 'header-boing-container header-header header-d-flex header-justify-content-between header-align-items-center header-h-15 header-px-5 header-py-2 header-fixed-top header-w-100 header-bg-white';

  const leftDiv = document.createElement('div');
  leftDiv.className = 'header-d-flex header-w-25';
  headerContainer.append(leftDiv);

  const centerDiv = document.createElement('div');
  centerDiv.className = 'header-d-flex header-justify-content-center header-w-25';
  const logoLink = block.querySelector('[data-aue-prop="logoLink"]');
  if (logoLink) {
    const logoAnchor = document.createElement('a');
    logoAnchor.href = logoLink.href;
    logoAnchor.className = 'header-analytics_cta_click';
    logoAnchor.setAttribute('data-ct', '');
    logoAnchor.setAttribute('a-label', 'header-logo-boing');
    moveInstrumentation(logoLink, logoAnchor);

    const logoDiv = document.createElement('div');
    logoDiv.className = 'header-header__logo header-d-flex header-align-items-center';

    const logoImage = block.querySelector('[data-aue-prop="logoImage"]');
    if (logoImage) {
      const img = logoImage.querySelector('img');
      if (img) {
        const picture = createOptimizedPicture(img.src, img.alt);
        picture.querySelector('img').className = 'header-header__logo-img';
        logoDiv.append(picture);
        moveInstrumentation(logoImage, logoDiv);
      }
    }
    logoAnchor.append(logoDiv);
    centerDiv.append(logoAnchor);
  }
  headerContainer.append(centerDiv);

  const rightDiv = document.createElement('div');
  rightDiv.className = 'header-d-flex header-w-25 header-justify-content-end';
  const loginLink = block.querySelector('[data-aue-prop="loginLink"]');
  if (loginLink) {
    const loginAnchor = document.createElement('a');
    loginAnchor.href = loginLink.href;
    loginAnchor.className = 'header-header__login-btn-wrapper header-analytics_cta_click';
    loginAnchor.style.display = 'inline';
    moveInstrumentation(loginLink, loginAnchor);

    const loginButton = document.createElement('button');
    loginButton.className = 'header-header__login-btn header-btn header-text-boing-primary header-bg-transparent header-fw-semibold header-rounded-4 header-btn-sm header-py-3 header-px-4';
    loginButton.textContent = loginLink.textContent.trim();
    loginAnchor.append(loginButton);
    rightDiv.append(loginAnchor);
  }
  headerContainer.append(rightDiv);

  const submenuContainer = document.createElement('div');
  submenuContainer.className = 'header-submenu-container header-position-fixed header-top-0 header-start-0 header-end-0 header-m-auto header-overflow-hidden';

  const aside = document.createElement('aside');
  aside.className = 'header-sidebar header-start-0 header-bg-white header-position-absolute';

  const menuList = document.createElement('ul');
  menuList.className = 'header-sidebar__menu header-list-unstyled header-px-4';

  const menuItems = block.querySelectorAll('[data-aue-model="headerMenuItem"]');
  menuItems.forEach((itemNode) => {
    const listItem = document.createElement('li');
    listItem.className = 'header-sidebar__menu-item header-py-6 header-border-bottom header-border-boing-neutral-gray-200';

    const link = itemNode.querySelector('[data-aue-prop="link"]');
    const icon = itemNode.querySelector('[data-aue-prop="icon"]');
    const label = itemNode.querySelector('[data-aue-prop="label"]');

    if (link && label) {
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.className = 'header-sidebar__menu-link header-d-flex header-align-items-center header-text-decoration-none header-px-6 header-fw-medium header-analytics_cta_click';
      anchor.setAttribute('data-consent', 'false');
      anchor.setAttribute('data-link', link.href);
      moveInstrumentation(link, anchor);

      if (icon) {
        const img = icon.querySelector('img');
        if (img) {
          const picture = createOptimizedPicture(img.src, img.alt);
          picture.querySelector('img').className = 'header-sidebar__menu-icon header-me-4';
          anchor.append(picture);
          moveInstrumentation(icon, anchor);
        }
      }
      anchor.append(label.textContent.trim());
      moveInstrumentation(label, anchor);
      listItem.append(anchor);
    }
    moveInstrumentation(itemNode, listItem);
    menuList.append(listItem);
  });
  aside.append(menuList);

  const sidebarCurve = document.createElement('div');
  sidebarCurve.className = 'header-sidebar__curve';
  aside.append(sidebarCurve);

  const footerBrand = document.createElement('div');
  footerBrand.className = 'header-footer-brand header-w-100 header-bg-boing-neutral-gray-600';
  footerBrand.setAttribute('data-isdoodlevariation', 'false');

  const footerPrimary = document.createElement('section');
  footerPrimary.className = 'header-footer-brand__primary';
  footerPrimary.style.backgroundColor = '';

  const footerContainer = document.createElement('div');
  footerContainer.className = 'header-container';

  const footerPrimaryContent = document.createElement('div');
  footerPrimaryContent.className = 'header-footer-brand__primary--content header-d-flex header-flex-column header-flex-md-row header-justify-content-md-between header-align-items-center';

  const footerLeft = document.createElement('section');
  footerLeft.className = 'header-footer-brand__left header-d-flex header-gap-16 header-px-10 header-align-items-center header-justify-content-center';

  // ITC Logo (static content, not in JSON)
  const itcLink = document.createElement('a');
  itcLink.href = 'https://www.itcportal.com/';
  itcLink.target = '_blank';
  itcLink.className = 'header-footer-brand__logo header-d-inline-block header-analytics_cta_click';
  itcLink.setAttribute('data-cta-region', 'Footer');
  itcLink.setAttribute('aria-label', 'ITC Logo');
  const itcImg = document.createElement('img');
  itcImg.src = '/content/dam/aemigrate/uploaded-folder/image/itc-logo-2-fmt-webp-alpha.webp';
  itcImg.alt = 'ITC Logo';
  itcImg.className = 'header-object-fit-contain header-w-100 header-h-100 header-no-rendition';
  itcImg.loading = 'lazy';
  itcLink.append(itcImg);
  footerLeft.append(itcLink);

  // FSSI Logo (static content, not in JSON)
  const fssiDiv = document.createElement('div');
  fssiDiv.className = 'header-footer-brand__secondary--logo header-d-inline-block';
  const fssiImg = document.createElement('img');
  fssiImg.src = '/content/dam/aemigrate/uploaded-folder/image/fssi-logo-update-fmt-webp-alpha.webp';
  fssiImg.alt = 'FSSI Logo';
  fssiImg.className = 'header-object-fit-contain header-w-100 header-no-rendition';
  fssiImg.loading = 'lazy';
  fssiDiv.append(fssiImg);
  footerLeft.append(fssiDiv);

  footerPrimaryContent.append(footerLeft);

  const footerRight = document.createElement('section');
  footerRight.className = 'header-footer-brand__right';

  const footerNav = document.createElement('nav');
  footerNav.className = 'header-footer-brand__navbar header-d-grid header-d-md-flex';
  footerNav.setAttribute('aria-label', 'footer navbar');

  const footerNavLeft = document.createElement('div');
  footerNavLeft.className = 'header-footer-brand__navbar--left header-d-flex header-flex-column header-flex-md-row';

  const footerLinks = block.querySelectorAll('[data-aue-model="footerLink"]');
  const linkGroups = [[], [], [], []]; // Assuming 4 columns based on authored HTML

  footerLinks.forEach((itemNode, index) => {
    const link = itemNode.querySelector('[data-aue-prop="link"]');
    const label = itemNode.querySelector('[data-aue-prop="label"]');

    if (link && label) {
      const linkData = {
        link: link.href,
        label: label.textContent.trim(),
        node: itemNode,
      };
      linkGroups[index % 4].push(linkData);
    }
  });

  linkGroups.forEach((group, groupIndex) => {
    if (group.length > 0) {
      const footerListDiv = document.createElement('div');
      footerListDiv.className = 'header-footerList';
      const ul = document.createElement('ul');
      ul.className = 'header-footer-list header-d-flex header-align-items-center header-justify-content-center header-align-items-md-start header-flex-column';

      group.forEach((linkData) => {
        const li = document.createElement('li');
        li.className = 'header-footer-list__item';

        const anchor = document.createElement('a');
        anchor.href = linkData.link;
        anchor.className = 'header-cta-analytics header-analytics_cta_click header-footer-list__item--link header-d-inline-block';
        anchor.setAttribute('data-link-region', 'Footer List');
        anchor.textContent = linkData.label;
        moveInstrumentation(linkData.node, li);
        li.append(anchor);
        ul.append(li);
      });
      footerListDiv.append(ul);
      if (groupIndex < 2) {
        footerNavLeft.append(footerListDiv);
      } else {
        if (!footerNav.querySelector('.header-footer-brand__navbar--right')) {
          const footerNavRight = document.createElement('div');
          footerNavRight.className = 'header-footer-brand__navbar--right header-d-flex header-flex-column header-flex-md-row';
          footerNav.append(footerNavRight);
        }
        footerNav.querySelector('.header-footer-brand__navbar--right').append(footerListDiv);
      }
    }
  });

  footerNav.prepend(footerNavLeft);
  footerRight.append(footerNav);
  footerPrimaryContent.append(footerRight);
  footerContainer.append(footerPrimaryContent);
  footerPrimary.append(footerContainer);
  footerBrand.append(footerPrimary);

  const footerSecondary = document.createElement('section');
  footerSecondary.className = 'header-footer-brand__secondary';
  footerSecondary.style.backgroundColor = '';

  const footerSecondaryContainer = document.createElement('div');
  footerSecondaryContainer.className = 'header-container';

  const footerSecondaryContent = document.createElement('div');
  footerSecondaryContent.className = 'header-footer-brand__secondary--content header-d-flex header-flex-column header-justify-content-md-between header-align-items-center';

  const socialMediaRight = document.createElement('section');
  socialMediaRight.className = 'header-footer-brand__right header-d-flex header-flex-column header-pb-5';

  const socialTitle = document.createElement('h3');
  socialTitle.className = 'header-social_media--title';
  socialTitle.textContent = 'Follow Us On';
  socialMediaRight.append(socialTitle);

  const socialList = document.createElement('ul');
  socialList.className = 'header-footer-brand__right--list header-d-flex header-align-items-center header-justify-content-center header-px-10 header-flex-wrap';

  const socialLinks = block.querySelectorAll('[data-aue-model="socialLink"]');
  socialLinks.forEach((itemNode) => {
    const listItem = document.createElement('li');
    listItem.className = 'header-footer-brand__right--item header-d-flex header-justify-content-center header-align-items-center';

    const link = itemNode.querySelector('[data-aue-prop="link"]');
    const icon = itemNode.querySelector('[data-aue-prop="icon"]');

    if (link && icon) {
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.target = '_blank';
      anchor.className = 'header-footer-brand__right--link header-d-flex header-justify-content-center header-align-items-center header-analytics_cta_click';
      anchor.setAttribute('data-cta-region', 'Footer');
      anchor.setAttribute('data-cta-label', `footer-${icon.querySelector('img').alt.toLowerCase()}`);
      anchor.setAttribute('data-platform-name', icon.querySelector('img').alt.toLowerCase());
      anchor.setAttribute('data-social-linktype', 'follow');
      moveInstrumentation(link, anchor);

      const img = icon.querySelector('img');
      if (img) {
        const picture = createOptimizedPicture(img.src, img.alt);
        picture.querySelector('img').className = 'header-object-fit-contain header-w-100 header-h-100 header-no-rendition';
        anchor.append(picture);
        moveInstrumentation(icon, anchor);
      }
      listItem.append(anchor);
    }
    moveInstrumentation(itemNode, listItem);
    socialList.append(listItem);
  });
  socialMediaRight.append(socialList);
  footerSecondaryContent.append(socialMediaRight);

  const copyrightLeft = document.createElement('section');
  copyrightLeft.className = 'header-footer-brand__left header-py-5 header-d-flex header-flex-column header-gap-3';

  const copyrightList = document.createElement('ul');
  copyrightList.className = 'header-footer-brand__left--list header-d-flex header-align-items-center header-justify-content-center header-flex-wrap';

  // ITC portal link (static content)
  const itcPortalLi = document.createElement('li');
  itcPortalLi.className = 'header-footer-brand__left--item header-foot_link';
  const itcPortalLink = document.createElement('a');
  itcPortalLink.href = 'https://www.itcportal.com/';
  itcPortalLink.target = '_blank';
  itcPortalLink.className = 'header-footer-brand__left--link header-analytics_cta_click';
  itcPortalLink.setAttribute('data-cta-region', 'Footer');
  itcPortalLink.textContent = 'ITC portal';
  itcPortalLi.append(itcPortalLink);
  copyrightList.append(itcPortalLi);

  copyrightLeft.append(copyrightList);

  const copyrightDiv = document.createElement('div');
  copyrightDiv.className = 'header-footer-brand__left--copyright header-text-center';
  const copyrightSpan = document.createElement('span');
  copyrightSpan.className = 'header-footer-brand__left--text header-text-white';
  const copyrightText = block.querySelector('[data-aue-prop="copyrightText"]');
  if (copyrightText) {
    copyrightSpan.textContent = copyrightText.textContent.trim();
    moveInstrumentation(copyrightText, copyrightSpan);
  } else {
    copyrightSpan.textContent = `© 2026 ${appName}! All Rights Reserved.`;
  }
  copyrightDiv.append(copyrightSpan);
  copyrightLeft.append(copyrightDiv);

  footerSecondaryContent.append(copyrightLeft);
  footerSecondaryContainer.append(footerSecondaryContent);
  footerSecondary.append(footerSecondaryContainer);
  footerBrand.append(footerSecondary);

  aside.append(footerBrand);
  submenuContainer.append(aside);

  const overlay = document.createElement('div');
  overlay.className = 'header-overlay header-position-absolute header-top-0 header-start-0 header-w-100 header-h-100 header-bg-black header-opacity-25';
  submenuContainer.append(overlay);

  const rootElement = document.createElement('section');
  rootElement.className = 'header-position-relative header-mb-15';
  rootElement.append(headerContainer);
  rootElement.append(submenuContainer);

  block.textContent = '';
  block.append(rootElement);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
