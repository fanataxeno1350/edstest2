import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const sidebarMenuItems = block.querySelectorAll('[data-aue-model="sidebarMenuItem"]');
  const footerPrimaryLogos = block.querySelectorAll('[data-aue-model="footerPrimaryLogo"]');
  const footerSecondaryLogos = block.querySelectorAll('[data-aue-model="footerSecondaryLogo"]');
  const footerNavItems = block.querySelectorAll('[data-aue-model="footerNavItem"]');
  const footerSocialItems = block.querySelectorAll('[data-aue-model="footerSocialItem"]');
  const footerLeftLinkItems = block.querySelectorAll('[data-aue-model="footerLeftLinkItem"]');
  const copyrightText = block.querySelector('[data-aue-prop="copyrightText"]');

  const aside = document.createElement('aside');
  aside.className = 'sidebar-sidebar sidebar-start-0 sidebar-bg-white sidebar-position-absolute';

  const menuList = document.createElement('ul');
  menuList.className = 'sidebar-sidebar__menu sidebar-list-unstyled sidebar-px-4';

  sidebarMenuItems.forEach((itemNode) => {
    const listItem = document.createElement('li');
    listItem.className = 'sidebar-sidebar__menu-item sidebar-py-6 sidebar-border-bottom sidebar-border-boing-neutral-gray-200';

    const link = itemNode.querySelector('[data-aue-prop="link"]');
    const icon = itemNode.querySelector('[data-aue-prop="icon"]');
    const label = itemNode.querySelector('[data-aue-prop="label"]');

    const anchor = document.createElement('a');
    anchor.className = 'sidebar-sidebar__menu-link sidebar-d-flex sidebar-align-items-center sidebar-text-decoration-none sidebar-px-6 sidebar-fw-medium sidebar-analytics_cta_click';
    if (link) {
      anchor.href = link.href || '';
      if (link.dataset.consent) anchor.dataset.consent = link.dataset.consent;
      if (link.dataset.link) anchor.dataset.link = link.dataset.link;
      moveInstrumentation(link, anchor);
    }

    if (icon) {
      const picture = createOptimizedPicture(icon.src, icon.alt, false, [{ width: '20' }]);
      picture.querySelector('img').className = 'sidebar-sidebar__menu-icon sidebar-me-4';
      anchor.append(picture);
      moveInstrumentation(icon, picture);
    }

    if (label) {
      anchor.append(label.textContent.trim());
      moveInstrumentation(label, anchor);
    }

    listItem.append(anchor);
    moveInstrumentation(itemNode, listItem);
    menuList.append(listItem);
  });

  aside.append(menuList);

  const curveDiv = document.createElement('div');
  curveDiv.className = 'sidebar-sidebar__curve';
  aside.append(curveDiv);

  const footerBrandDiv = document.createElement('div');
  footerBrandDiv.className = 'sidebar-footer-brand sidebar-w-100 sidebar-bg-boing-neutral-gray-600';
  footerBrandDiv.dataset.isdoodlevariation = 'false';

  const primarySection = document.createElement('section');
  primarySection.className = 'sidebar-footer-brand__primary';

  const containerDiv = document.createElement('div');
  containerDiv.className = 'sidebar-container';

  const primaryContentDiv = document.createElement('div');
  primaryContentDiv.className = 'sidebar-footer-brand__primary--content sidebar-d-flex sidebar-flex-column sidebar-flex-md-row sidebar-justify-content-md-between sidebar-align-items-center';

  const leftSection = document.createElement('section');
  leftSection.className = 'sidebar-footer-brand__left sidebar-d-flex sidebar-gap-16 sidebar-px-10 sidebar-align-items-center sidebar-justify-content-center';

  footerPrimaryLogos.forEach((itemNode) => {
    const link = itemNode.querySelector('[data-aue-prop="link"]');
    const image = itemNode.querySelector('[data-aue-prop="image"]');

    const anchor = document.createElement('a');
    anchor.className = 'sidebar-footer-brand__logo sidebar-d-inline-block sidebar-analytics_cta_click';
    anchor.ariaLabel = 'ITC Logo';
    if (link) {
      anchor.href = link.href || '';
      if (link.target) anchor.target = link.target;
      if (link.dataset.ctaRegion) anchor.dataset.ctaRegion = link.dataset.ctaRegion;
      moveInstrumentation(link, anchor);
    }

    if (image) {
      const picture = createOptimizedPicture(image.src, image.alt);
      picture.querySelector('img').className = 'sidebar-object-fit-contain sidebar-w-100 sidebar-h-100 sidebar-no-rendition';
      anchor.append(picture);
      moveInstrumentation(image, picture);
    }
    leftSection.append(anchor);
    moveInstrumentation(itemNode, anchor);
  });

  footerSecondaryLogos.forEach((itemNode) => {
    const image = itemNode.querySelector('[data-aue-prop="image"]');
    const secondaryLogoDiv = document.createElement('div');
    secondaryLogoDiv.className = 'sidebar-footer-brand__secondary--logo sidebar-d-inline-block';
    if (image) {
      const picture = createOptimizedPicture(image.src, image.alt);
      picture.querySelector('img').className = 'sidebar-object-fit-contain sidebar-w-100 sidebar-no-rendition';
      secondaryLogoDiv.append(picture);
      moveInstrumentation(image, picture);
    }
    leftSection.append(secondaryLogoDiv);
    moveInstrumentation(itemNode, secondaryLogoDiv);
  });

  primaryContentDiv.append(leftSection);

  const rightSection = document.createElement('section');
  rightSection.className = 'sidebar-footer-brand__right';

  const nav = document.createElement('nav');
  nav.className = 'sidebar-footer-brand__navbar sidebar-d-grid sidebar-d-md-flex';
  nav.ariaLabel = 'footer navbar';

  const navLeftDiv = document.createElement('div');
  navLeftDiv.className = 'sidebar-footer-brand__navbar--left sidebar-d-flex sidebar-flex-column sidebar-flex-md-row';

  const navRightDiv = document.createElement('div');
  navRightDiv.className = 'sidebar-footer-brand__navbar--right sidebar-d-flex sidebar-flex-column sidebar-flex-md-row';

  const navItemChunks = [];
  for (let i = 0; i < footerNavItems.length; i += 3) {
    navItemChunks.push(Array.from(footerNavItems).slice(i, i + 3));
  }

  navItemChunks.forEach((chunk, chunkIndex) => {
    const footerListDiv = document.createElement('div');
    footerListDiv.className = 'sidebar-footerList';
    const ul = document.createElement('ul');
    ul.className = 'sidebar-footer-list sidebar-d-flex sidebar-align-items-center sidebar-justify-content-center sidebar-align-items-md-start sidebar-flex-column';

    chunk.forEach((itemNode) => {
      const link = itemNode.querySelector('[data-aue-prop="link"]');
      const label = itemNode.querySelector('[data-aue-prop="label"]');

      const li = document.createElement('li');
      li.className = 'sidebar-footer-list__item';

      const anchor = document.createElement('a');
      anchor.className = 'sidebar-cta-analytics sidebar-analytics_cta_click sidebar-footer-list__item--link sidebar-d-inline-block';
      if (link) {
        anchor.href = link.href || '';
        if (link.dataset.linkRegion) anchor.dataset.linkRegion = link.dataset.linkRegion;
        if (link.target) anchor.target = link.target;
        moveInstrumentation(link, anchor);
      }
      if (label) {
        anchor.textContent = label.textContent.trim();
        moveInstrumentation(label, anchor);
      }
      li.append(anchor);
      moveInstrumentation(itemNode, li);
      ul.append(li);
    });
    footerListDiv.append(ul);
    if (chunkIndex < 2) {
      navLeftDiv.append(footerListDiv);
    } else {
      navRightDiv.append(footerListDiv);
    }
  });

  nav.append(navLeftDiv, navRightDiv);
  rightSection.append(nav);
  primaryContentDiv.append(rightSection);
  containerDiv.append(primaryContentDiv);
  primarySection.append(containerDiv);
  footerBrandDiv.append(primarySection);

  const secondarySection = document.createElement('section');
  secondarySection.className = 'sidebar-footer-brand__secondary';

  const secondaryContainerDiv = document.createElement('div');
  secondaryContainerDiv.className = 'sidebar-container';

  const secondaryContentDiv = document.createElement('div');
  secondaryContentDiv.className = 'sidebar-footer-brand__secondary--content sidebar-d-flex sidebar-flex-column sidebar-justify-content-md-between sidebar-align-items-center';

  const socialRightSection = document.createElement('section');
  socialRightSection.className = 'sidebar-footer-brand__right sidebar-d-flex sidebar-flex-column sidebar-pb-5';

  const socialTitle = document.createElement('h3');
  socialTitle.className = 'sidebar-social_media--title';
  socialTitle.textContent = 'Follow Us On';
  socialRightSection.append(socialTitle);

  const socialList = document.createElement('ul');
  socialList.className = 'sidebar-footer-brand__right--list sidebar-d-flex sidebar-align-items-center sidebar-justify-content-center sidebar-px-10 sidebar-flex-wrap';

  footerSocialItems.forEach((itemNode) => {
    const link = itemNode.querySelector('[data-aue-prop="link"]');
    const icon = itemNode.querySelector('[data-aue-prop="icon"]');

    const li = document.createElement('li');
    li.className = 'sidebar-footer-brand__right--item sidebar-d-flex sidebar-justify-content-center sidebar-align-items-center';

    const anchor = document.createElement('a');
    anchor.className = 'sidebar-footer-brand__right--link sidebar-d-flex sidebar-justify-content-center sidebar-align-items-center sidebar-analytics_cta_click';
    if (link) {
      anchor.href = link.href || '';
      if (link.target) anchor.target = link.target;
      if (link.dataset.ctaRegion) anchor.dataset.ctaRegion = link.dataset.ctaRegion;
      if (link.dataset.ctaLabel) anchor.dataset.ctaLabel = link.dataset.ctaLabel;
      if (link.dataset.platformName) anchor.dataset.platformName = link.dataset.platformName;
      if (link.dataset.socialLinktype) anchor.dataset.socialLinktype = link.dataset.socialLinktype;
      moveInstrumentation(link, anchor);
    }

    if (icon) {
      const picture = createOptimizedPicture(icon.src, icon.alt);
      picture.querySelector('img').className = 'sidebar-object-fit-contain sidebar-w-100 sidebar-h-100 sidebar-no-rendition';
      picture.querySelector('img').ariaLabel = icon.alt;
      anchor.append(picture);
      moveInstrumentation(icon, picture);
    }
    li.append(anchor);
    moveInstrumentation(itemNode, li);
    socialList.append(li);
  });
  socialRightSection.append(socialList);
  secondaryContentDiv.append(socialRightSection);

  const copyrightLeftSection = document.createElement('section');
  copyrightLeftSection.className = 'sidebar-footer-brand__left sidebar-py-5 sidebar-d-flex sidebar-flex-column sidebar-gap-3';

  const copyrightList = document.createElement('ul');
  copyrightList.className = 'sidebar-footer-brand__left--list sidebar-d-flex sidebar-align-items-center sidebar-justify-content-center sidebar-flex-wrap';

  footerLeftLinkItems.forEach((itemNode) => {
    const link = itemNode.querySelector('[data-aue-prop="link"]');
    const label = itemNode.querySelector('[data-aue-prop="label"]');

    const li = document.createElement('li');
    li.className = 'sidebar-footer-brand__left--item sidebar-foot_link';

    const anchor = document.createElement('a');
    anchor.className = 'sidebar-footer-brand__left--link sidebar-analytics_cta_click';
    if (link) {
      anchor.href = link.href || '';
      if (link.target) anchor.target = link.target;
      if (link.dataset.ctaRegion) anchor.dataset.ctaRegion = link.dataset.ctaRegion;
      moveInstrumentation(link, anchor);
    }
    if (label) {
      anchor.textContent = label.textContent.trim();
      moveInstrumentation(label, anchor);
    }
    li.append(anchor);
    moveInstrumentation(itemNode, li);
    copyrightList.append(li);
  });
  copyrightLeftSection.append(copyrightList);

  const copyrightDiv = document.createElement('div');
  copyrightDiv.className = 'sidebar-footer-brand__left--copyright sidebar-text-center';

  const copyrightSpan = document.createElement('span');
  copyrightSpan.className = 'sidebar-footer-brand__left--text sidebar-text-white';
  if (copyrightText) {
    copyrightSpan.textContent = copyrightText.textContent.trim();
    moveInstrumentation(copyrightText, copyrightSpan);
  }
  copyrightDiv.append(copyrightSpan);
  copyrightLeftSection.append(copyrightDiv);

  secondaryContentDiv.append(copyrightLeftSection);
  secondaryContainerDiv.append(secondaryContentDiv);
  secondarySection.append(secondaryContainerDiv);
  footerBrandDiv.append(secondarySection);

  aside.append(footerBrandDiv);

  block.textContent = '';
  block.append(aside);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
