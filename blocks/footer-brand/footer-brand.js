import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const primarySection = document.createElement('section');
  primarySection.classList.add('footer-brand-footer-brand__primary');
  moveInstrumentation(block.querySelector('.footer-brand-footer-brand__primary'), primarySection);

  const containerPrimary = document.createElement('div');
  containerPrimary.classList.add('footer-brand-container');
  moveInstrumentation(block.querySelector('.footer-brand-container'), containerPrimary);

  const primaryContent = document.createElement('div');
  primaryContent.classList.add('footer-brand-footer-brand__primary--content', 'footer-brand-d-flex', 'footer-brand-flex-column', 'footer-brand-flex-md-row', 'footer-brand-justify-content-md-between', 'footer-brand-align-items-center');
  moveInstrumentation(block.querySelector('.footer-brand-footer-brand__primary--content'), primaryContent);

  const leftSectionPrimary = document.createElement('section');
  leftSectionPrimary.classList.add('footer-brand-footer-brand__left', 'footer-brand-d-flex', 'footer-brand-gap-16', 'footer-brand-px-10', 'footer-brand-align-items-center', 'footer-brand-justify-content-center');
  moveInstrumentation(block.querySelector('.footer-brand-footer-brand__left'), leftSectionPrimary);

  const logo1Wrapper = document.createElement('a');
  logo1Wrapper.classList.add('footer-brand-footer-brand__logo', 'footer-brand-d-inline-block', 'footer-brand-analytics_cta_click');
  const logo1 = block.querySelector('[data-aue-prop="logo1"] img');
  if (logo1) {
    logo1Wrapper.href = logo1.parentElement.href;
    logo1Wrapper.target = logo1.parentElement.target;
    logo1Wrapper.setAttribute('aria-label', logo1.alt);
    const picture = createOptimizedPicture(logo1.src, logo1.alt);
    picture.querySelector('img').classList.add('footer-brand-object-fit-contain', 'footer-brand-w-100', 'footer-brand-h-100', 'footer-brand-no-rendition');
    logo1Wrapper.append(picture);
    moveInstrumentation(logo1.parentElement, logo1Wrapper);
  }
  leftSectionPrimary.append(logo1Wrapper);

  const logo2Wrapper = document.createElement('div');
  logo2Wrapper.classList.add('footer-brand-footer-brand__secondary--logo', 'footer-brand-d-inline-block');
  const logo2 = block.querySelector('[data-aue-prop="logo2"] img');
  if (logo2) {
    const picture = createOptimizedPicture(logo2.src, logo2.alt);
    picture.querySelector('img').classList.add('footer-brand-object-fit-contain', 'footer-brand-w-100', 'footer-brand-no-rendition');
    logo2Wrapper.append(picture);
    moveInstrumentation(logo2.parentElement, logo2Wrapper);
  }
  leftSectionPrimary.append(logo2Wrapper);

  const rightSectionPrimary = document.createElement('section');
  rightSectionPrimary.classList.add('footer-brand-footer-brand__right');
  moveInstrumentation(block.querySelector('section.footer-brand-footer-brand__right'), rightSectionPrimary);

  const nav = document.createElement('nav');
  nav.classList.add('footer-brand-footer-brand__navbar', 'footer-brand-d-grid', 'footer-brand-d-md-flex');
  nav.setAttribute('aria-label', 'footer navbar');
  moveInstrumentation(block.querySelector('nav'), nav);

  const navbarLeft = document.createElement('div');
  navbarLeft.classList.add('footer-brand-footer-brand__navbar--left', 'footer-brand-d-flex', 'footer-brand-flex-column', 'footer-brand-flex-md-row');
  moveInstrumentation(block.querySelector('.footer-brand-footer-brand__navbar--left'), navbarLeft);

  const linkGroups = block.querySelectorAll('[data-aue-model="footerLinkGroup"]');
  linkGroups.forEach((groupNode) => {
    const footerListDiv = document.createElement('div');
    footerListDiv.classList.add('footer-brand-footerList');
    moveInstrumentation(groupNode, footerListDiv);

    const ul = document.createElement('ul');
    ul.classList.add('footer-brand-footer-list', 'footer-brand-d-flex', 'footer-brand-align-items-center', 'footer-brand-justify-content-center', 'footer-brand-align-items-md-start', 'footer-brand-flex-column');

    const links = groupNode.querySelectorAll('[data-aue-model="footerLink"]');
    links.forEach((linkNode) => {
      const li = document.createElement('li');
      li.classList.add('footer-brand-footer-list__item');

      const a = document.createElement('a');
      a.classList.add('footer-brand-cta-analytics', 'footer-brand-analytics_cta_click', 'footer-brand-footer-list__item--link', 'footer-brand-d-inline-block');
      a.setAttribute('data-link-region', 'Footer List');

      const linkUrl = linkNode.querySelector('[data-aue-prop="link"]');
      if (linkUrl) {
        a.href = linkUrl.href;
        if (linkUrl.target) {
          a.target = linkUrl.target;
        }
      }
      const linkLabel = linkNode.querySelector('[data-aue-prop="label"]');
      if (linkLabel) {
        a.textContent = linkLabel.textContent;
      }
      li.append(a);
      moveInstrumentation(linkNode, li);
      ul.append(li);
    });
    footerListDiv.append(ul);
    if (navbarLeft.children.length < 2) {
      navbarLeft.append(footerListDiv);
    } else {
      // This assumes the first two link groups go into navbarLeft, and the next two into navbarRight
      // This is a heuristic based on the sample HTML structure.
      // A more robust solution might require explicit authoring of left/right groups.
      const navbarRight = primaryContent.querySelector('.footer-brand-footer-brand__navbar--right');
      if (!navbarRight) {
        const newNavbarRight = document.createElement('div');
        newNavbarRight.classList.add('footer-brand-footer-brand__navbar--right', 'footer-brand-d-flex', 'footer-brand-flex-column', 'footer-brand-flex-md-row');
        nav.append(newNavbarRight);
        newNavbarRight.append(footerListDiv);
      } else {
        navbarRight.append(footerListDiv);
      }
    }
  });

  const navbarRight = document.createElement('div');
  navbarRight.classList.add('footer-brand-footer-brand__navbar--right', 'footer-brand-d-flex', 'footer-brand-flex-column', 'footer-brand-flex-md-row');
  moveInstrumentation(block.querySelector('.footer-brand-footer-brand__navbar--right'), navbarRight);

  // Re-append link groups to their correct sections based on the original HTML structure
  const authoredLinkGroups = block.querySelectorAll('.footer-brand-footerList');
  if (authoredLinkGroups.length > 0) {
    navbarLeft.append(authoredLinkGroups[0]);
    if (authoredLinkGroups[1]) {
      navbarLeft.append(authoredLinkGroups[1]);
    }
    if (authoredLinkGroups[2]) {
      navbarRight.append(authoredLinkGroups[2]);
    }
    if (authoredLinkGroups[3]) {
      navbarRight.append(authoredLinkGroups[3]);
    }
  }

  nav.append(navbarLeft, navbarRight);
  rightSectionPrimary.append(nav);
  primaryContent.append(leftSectionPrimary, rightSectionPrimary);
  containerPrimary.append(primaryContent);
  primarySection.append(containerPrimary);

  const secondarySection = document.createElement('section');
  secondarySection.classList.add('footer-brand-footer-brand__secondary');
  moveInstrumentation(block.querySelector('.footer-brand-footer-brand__secondary'), secondarySection);

  const containerSecondary = document.createElement('div');
  containerSecondary.classList.add('footer-brand-container');
  moveInstrumentation(block.querySelector('.footer-brand-footer-brand__secondary .footer-brand-container'), containerSecondary);

  const secondaryContent = document.createElement('div');
  secondaryContent.classList.add('footer-brand-footer-brand__secondary--content', 'footer-brand-d-flex', 'footer-brand-flex-column', 'footer-brand-justify-content-md-between', 'footer-brand-align-items-center');
  moveInstrumentation(block.querySelector('.footer-brand-footer-brand__secondary--content'), secondaryContent);

  const rightSectionSecondary = document.createElement('section');
  rightSectionSecondary.classList.add('footer-brand-footer-brand__right', 'footer-brand-d-flex', 'footer-brand-flex-column', 'footer-brand-pb-5');
  moveInstrumentation(block.querySelector('.footer-brand-footer-brand__secondary .footer-brand-footer-brand__right'), rightSectionSecondary);

  const socialTitle = document.createElement('h3');
  socialTitle.classList.add('footer-brand-social_media--title');
  socialTitle.textContent = 'Follow Us On';
  moveInstrumentation(block.querySelector('.footer-brand-social_media--title'), socialTitle);
  rightSectionSecondary.append(socialTitle);

  const socialList = document.createElement('ul');
  socialList.classList.add('footer-brand-footer-brand__right--list', 'footer-brand-d-flex', 'footer-brand-align-items-center', 'footer-brand-justify-content-center', 'footer-brand-px-10', 'footer-brand-flex-wrap');

  const socialLinks = block.querySelectorAll('[data-aue-model="footerSocial"]');
  socialLinks.forEach((socialNode) => {
    const li = document.createElement('li');
    li.classList.add('footer-brand-footer-brand__right--item', 'footer-brand-d-flex', 'footer-brand-justify-content-center', 'footer-brand-align-items-center');

    const a = document.createElement('a');
    a.classList.add('footer-brand-footer-brand__right--link', 'footer-brand-d-flex', 'footer-brand-justify-content-center', 'footer-brand-align-items-center', 'footer-brand-analytics_cta_click');
    a.setAttribute('data-cta-region', 'Footer');
    a.setAttribute('data-social-linktype', 'follow');

    const socialLink = socialNode.querySelector('[data-aue-prop="socialLink"]');
    if (socialLink) {
      a.href = socialLink.href;
      a.target = socialLink.target;
      a.setAttribute('data-platform-name', socialLink.dataset.platformName);
      a.setAttribute('data-cta-label', socialLink.dataset.ctaLabel);
    }

    const icon = socialNode.querySelector('[data-aue-prop="icon"] img');
    if (icon) {
      const picture = createOptimizedPicture(icon.src, icon.alt);
      picture.querySelector('img').classList.add('footer-brand-object-fit-contain', 'footer-brand-w-100', 'footer-brand-h-100', 'footer-brand-no-rendition');
      picture.querySelector('img').setAttribute('aria-label', icon.getAttribute('aria-label'));
      a.append(picture);
      moveInstrumentation(icon.parentElement, a);
    }

    li.append(a);
    moveInstrumentation(socialNode, li);
    socialList.append(li);
  });
  rightSectionSecondary.append(socialList);
  secondaryContent.append(rightSectionSecondary);

  const leftSectionSecondary = document.createElement('section');
  leftSectionSecondary.classList.add('footer-brand-footer-brand__left', 'footer-brand-py-5', 'footer-brand-d-flex', 'footer-brand-flex-column', 'footer-brand-gap-3');
  moveInstrumentation(block.querySelector('.footer-brand-footer-brand__secondary .footer-brand-footer-brand__left'), leftSectionSecondary);

  const leftList = document.createElement('ul');
  leftList.classList.add('footer-brand-footer-brand__left--list', 'footer-brand-d-flex', 'footer-brand-align-items-center', 'footer-brand-justify-content-center', 'footer-brand-flex-wrap');

  const itcPortalLinkNode = block.querySelector('[data-aue-prop="itcPortalLink"]');
  if (itcPortalLinkNode) {
    const li = document.createElement('li');
    li.classList.add('footer-brand-footer-brand__left--item', 'footer-brand-foot_link');

    const a = document.createElement('a');
    a.classList.add('footer-brand-footer-brand__left--link', 'footer-brand-analytics_cta_click');
    a.setAttribute('data-cta-region', 'Footer');
    a.href = itcPortalLinkNode.href;
    a.target = itcPortalLinkNode.target;
    a.textContent = itcPortalLinkNode.textContent.trim();

    li.append(a);
    moveInstrumentation(itcPortalLinkNode, li);
    leftList.append(li);
  }
  leftSectionSecondary.append(leftList);

  const copyrightDiv = document.createElement('div');
  copyrightDiv.classList.add('footer-brand-footer-brand__left--copyright', 'footer-brand-text-center');

  const copyrightTextSpan = document.createElement('span');
  copyrightTextSpan.classList.add('footer-brand-footer-brand__left--text', 'footer-brand-text-white');
  const copyrightText = block.querySelector('[data-aue-prop="copyrightText"]');
  if (copyrightText) {
    copyrightTextSpan.textContent = copyrightText.textContent.trim();
    moveInstrumentation(copyrightText, copyrightTextSpan);
  }
  copyrightDiv.append(copyrightTextSpan);
  moveInstrumentation(block.querySelector('.footer-brand-footer-brand__left--copyright'), copyrightDiv);
  leftSectionSecondary.append(copyrightDiv);

  secondaryContent.append(leftSectionSecondary);
  containerSecondary.append(secondaryContent);
  secondarySection.append(containerSecondary);

  block.textContent = '';
  block.append(primarySection, secondarySection);
  block.className = 'footer-brand block';
  block.dataset.blockStatus = 'loaded';
}
