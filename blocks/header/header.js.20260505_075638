import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function createSvgIcon(pathD) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '-23.5 -23.5 122.80 122.80');
  svg.setAttribute('fill', '#000000');
  svg.setAttribute('stroke', '#000000');
  svg.setAttribute('stroke-width', '4.851456000000001');

  const gBgCarrier = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gBgCarrier.setAttribute('id', 'SVGRepo_bgCarrier');
  gBgCarrier.setAttribute('stroke-width', '0');
  svg.appendChild(gBgCarrier);

  const gTracerCarrier = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gTracerCarrier.setAttribute('id', 'SVGRepo_tracerCarrier');
  gTracerCarrier.setAttribute('stroke-linecap', 'round');
  gTracerCarrier.setAttribute('stroke-linejoin', 'round');
  gTracerCarrier.setAttribute('stroke', '#CCCCCC');
  gTracerCarrier.setAttribute('stroke-width', '0.30321600000000004');
  svg.appendChild(gTracerCarrier);

  const gIconCarrier = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gIconCarrier.setAttribute('id', 'SVGRepo_iconCarrier');
  gIconCarrier.setAttribute('transform', 'translate(-831.568 -384.448)');
  svg.appendChild(gIconCarrier);

  const gGroup65 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gGroup65.setAttribute('id', 'Group_65');
  gGroup65.setAttribute('data-name', 'Group 65');
  gGroup65.setAttribute('transform', 'translate(-831.568 -384.448)');
  gIconCarrier.appendChild(gGroup65);

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('id', 'Path_57');
  path.setAttribute('data-name', 'Path 57');
  path.setAttribute('d', pathD);
  path.setAttribute('fill', '#030408');
  gGroup65.appendChild(path);

  return svg;
}

const ARROW_SVG_PATH = 'M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z';

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
      subWrap.classList.add('has-sub-child');
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        const spanArrow = document.createElement('span');
        spanArrow.appendChild(createSvgIcon(ARROW_SVG_PATH));
        trigger.append(spanArrow);

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

function transformInnerNestedLists(rootUl) {
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
      subWrap.classList.add('has-inner-sub-child');
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        const spanArrow = document.createElement('span');
        spanArrow.appendChild(createSvgIcon(ARROW_SVG_PATH));
        trigger.append(spanArrow);

        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active-child');
          subWrap.classList.toggle('active-child');
        });
      }
    }
  });
}

export default async function decorate(block) {
  const children = [...block.children];

  const [
    logoRow,
    logoLinkRow,
    year80LogoRow,
    year80LogoLinkRow,
    ...itemRows
  ] = children;

  const navigationItems = itemRows.filter((row) => row.children.length === 8);
  const contactLinkItems = itemRows.filter((row) => row.children.length === 2);
  const searchItems = itemRows.filter((row) => row.children.length === 5);
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4);

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid');

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const mainLogoLink = document.createElement('a');
  mainLogoLink.href = logoLinkRow.querySelector('a')?.href || '#';
  const mainLogoPicture = logoRow.querySelector('picture');
  if (mainLogoPicture) {
    const img = mainLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    mainLogoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, mainLogoLink);
  moveInstrumentation(logoLinkRow, mainLogoLink);
  logoDiv.append(mainLogoLink);
  wrap.append(logoDiv);

  // Hamburger
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }
  hamburgerDiv.append(hamburgerUl);
  wrap.append(hamburgerDiv);

  // Main Nav
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  const mainNavUl = document.createElement('ul');
  mainNavUl.setAttribute('itemscope', '');
  mainNavUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  mainNav.append(mainNavUl);
  wrap.append(mainNav);

  navigationItems.forEach((row) => {
    const [
      labelCell,
      linkCell,
      hierarchyTreeCell,
      megaMenuHeadingCell,
      megaMenuDescriptionCell,
      megaMenuSubDescriptionCell,
      megaMenuFactsCell,
      investorRelationsHighlightsCell,
    ] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');

    const linkEl = document.createElement('a');
    linkEl.setAttribute('itemprop', 'url');
    linkEl.href = linkCell?.querySelector('a')?.href || '#';
    linkEl.textContent = labelCell?.textContent.trim() || '';

    const spanArrow = document.createElement('span');
    spanArrow.appendChild(createSvgIcon(ARROW_SVG_PATH));
    linkEl.append(spanArrow);

    li.append(linkEl);
    moveInstrumentation(row, li);

    const megaMenuDiv = document.createElement('div');
    megaMenuDiv.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    megaMenuDiv.append(megaMenuWrap);
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.append(centerDiv);

    const hierarchyRoot = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyRoot) {
      const leftDiv = document.createElement('div');
      leftDiv.classList.add('left-div');
      centerDiv.append(leftDiv);

      const megaMenuHeading = document.createElement('h4');
      megaMenuHeading.classList.add('left-div-heading');
      const headingLink = document.createElement('a');
      headingLink.textContent = megaMenuHeadingCell?.textContent.trim() || '';
      megaMenuHeading.append(headingLink);
      leftDiv.append(megaMenuHeading);

      const megaMenuDescription = document.createElement('p');
      megaMenuDescription.classList.add('left-div-desc');
      megaMenuDescription.innerHTML = megaMenuDescriptionCell?.innerHTML || '';
      leftDiv.append(megaMenuDescription);

      const megaMenuSubDescription = document.createElement('p');
      megaMenuSubDescription.classList.add('left-div-subdesc');
      megaMenuSubDescription.innerHTML = megaMenuSubDescriptionCell?.innerHTML || '';
      leftDiv.append(megaMenuSubDescription);

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap', 'about-us-sub-nav');
      centerDiv.append(subNavWrap);

      const clonedHierarchy = hierarchyRoot.cloneNode(true);
      transformNestedLists(clonedHierarchy);
      transformInnerNestedLists(clonedHierarchy);
      subNavWrap.append(clonedHierarchy);
    } else if (megaMenuFactsCell?.textContent.trim()) {
      const leftDiv = document.createElement('div');
      leftDiv.classList.add('left-div');
      centerDiv.append(leftDiv);

      const megaMenuHeading = document.createElement('h4');
      megaMenuHeading.classList.add('left-div-heading');
      const headingLink = document.createElement('a');
      headingLink.textContent = megaMenuHeadingCell?.textContent.trim() || '';
      megaMenuHeading.append(headingLink);
      leftDiv.append(megaMenuHeading);

      const megaMenuFacts = document.createElement('ul');
      megaMenuFacts.innerHTML = megaMenuFactsCell?.innerHTML || '';
      [...megaMenuFacts.children].forEach((factLi) => {
        factLi.classList.add('list-text-red');
      });
      leftDiv.append(megaMenuFacts);

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap', 'what-we-do');
      centerDiv.append(subNavWrap);

      const clonedHierarchy = hierarchyTreeCell?.querySelector('ul')?.cloneNode(true) || document.createElement('ul');
      transformNestedLists(clonedHierarchy);
      transformInnerNestedLists(clonedHierarchy);
      subNavWrap.append(clonedHierarchy);
    } else if (investorRelationsHighlightsCell?.textContent.trim()) {
      const leftDiv = document.createElement('div');
      leftDiv.classList.add('left-div', 'ir-left-div');
      centerDiv.append(leftDiv);

      const megaMenuHeading = document.createElement('h4');
      megaMenuHeading.classList.add('left-div-heading');
      const headingLink = document.createElement('a');
      headingLink.textContent = megaMenuHeadingCell?.textContent.trim() || '';
      megaMenuHeading.append(headingLink);
      leftDiv.append(megaMenuHeading);

      const description = document.createElement('p');
      description.textContent = megaMenuDescriptionCell?.textContent.trim() || '';
      leftDiv.append(description);

      const highlights = document.createElement('ul');
      highlights.innerHTML = investorRelationsHighlightsCell?.innerHTML || '';
      [...highlights.children].forEach((highlightLi) => {
        highlightLi.classList.add('list-text-red');
      });
      leftDiv.append(highlights);

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap', 'element-block');
      centerDiv.append(subNavWrap);

      const oneLinkUl = document.createElement('ul');
      oneLinkUl.classList.add('sub-nav-wrap-one-link');
      const oneLinkLi = document.createElement('li');
      const oneLinkAnchor = document.createElement('a');
      oneLinkAnchor.href = linkCell?.querySelector('a')?.href || '#';
      oneLinkAnchor.textContent = megaMenuDescriptionCell?.textContent.trim() || '';
      oneLinkLi.append(oneLinkAnchor);
      oneLinkUl.append(oneLinkLi);
      subNavWrap.append(oneLinkUl);

      const innerSubNavWrapList = document.createElement('div');
      innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');
      const clonedHierarchy = hierarchyTreeCell?.querySelector('ul')?.cloneNode(true) || document.createElement('ul');
      transformNestedLists(clonedHierarchy);
      transformInnerNestedLists(clonedHierarchy);
      innerSubNavWrapList.append(clonedHierarchy);
      subNavWrap.append(innerSubNavWrapList);
    } else if (pressReleaseItems.length > 0 && labelCell?.textContent.trim().toLowerCase() === 'newsroom') {
      const leftDiv = document.createElement('div');
      leftDiv.classList.add('left-div', 'newsroom-left-div');
      centerDiv.append(leftDiv);

      const megaMenuHeading = document.createElement('h4');
      megaMenuHeading.classList.add('left-div-heading');
      const headingLink = document.createElement('a');
      headingLink.textContent = megaMenuHeadingCell?.textContent.trim() || '';
      megaMenuHeading.append(headingLink);
      leftDiv.append(megaMenuHeading);

      const latestTwoPressRelease = document.createElement('div');
      latestTwoPressRelease.classList.add('latest-two-press-release');
      leftDiv.append(latestTwoPressRelease);

      pressReleaseItems.slice(0, 2).forEach((prRow) => {
        const [prLinkCell, prTitleCell, prDateCell, prCategoryCell] = [...prRow.children];
        const slidesDiv = document.createElement('div');
        slidesDiv.classList.add('slides');
        const slideWrap = document.createElement('div');
        slideWrap.classList.add('wrap');
        slidesDiv.append(slideWrap);
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('content');
        slideWrap.append(contentDiv);
        const descDiv = document.createElement('div');
        descDiv.classList.add('desc');
        contentDiv.append(descDiv);
        const p = document.createElement('p');
        const prAnchor = document.createElement('a');
        prAnchor.href = prLinkCell?.querySelector('a')?.href || '#';
        prAnchor.textContent = prTitleCell?.textContent.trim() || '';
        p.append(prAnchor);
        descDiv.append(p);
        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date');
        const dateEm = document.createElement('em');
        dateEm.textContent = prDateCell?.textContent.trim() || '';
        const categoryEm = document.createElement('em');
        categoryEm.textContent = prCategoryCell?.textContent.trim() || '';
        dateDiv.append(dateEm, categoryEm);
        descDiv.append(dateDiv);
        latestTwoPressRelease.append(slidesDiv);
        moveInstrumentation(prRow, slidesDiv);
      });

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');
      centerDiv.append(subNavWrap);

      const clonedHierarchy = hierarchyTreeCell?.querySelector('ul')?.cloneNode(true) || document.createElement('ul');
      transformNestedLists(clonedHierarchy);
      transformInnerNestedLists(clonedHierarchy);
      subNavWrap.append(clonedHierarchy);
    } else if (labelCell?.textContent.trim().toLowerCase() === 'careers') {
      const leftDiv = document.createElement('div');
      leftDiv.classList.add('left-div', 'career-left-div');
      centerDiv.append(leftDiv);

      const megaMenuHeading = document.createElement('h4');
      megaMenuHeading.classList.add('left-div-heading');
      const headingLink = document.createElement('a');
      headingLink.textContent = megaMenuHeadingCell?.textContent.trim() || '';
      megaMenuHeading.append(headingLink);
      leftDiv.append(megaMenuHeading);

      const description = document.createElement('p');
      description.classList.add('left-div-desc');
      description.innerHTML = megaMenuDescriptionCell?.innerHTML || '';
      leftDiv.append(description);

      const subDescription = document.createElement('p');
      subDescription.classList.add('left-div-subdesc');
      subDescription.innerHTML = megaMenuSubDescriptionCell?.innerHTML || '';
      leftDiv.append(subDescription);

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap', 'careers-div');
      centerDiv.append(subNavWrap);

      const clonedHierarchy = hierarchyTreeCell?.querySelector('ul')?.cloneNode(true) || document.createElement('ul');
      transformNestedLists(clonedHierarchy);
      transformInnerNestedLists(clonedHierarchy);
      subNavWrap.append(clonedHierarchy);
    }

    li.append(megaMenuDiv);
    mainNavUl.append(li);
  });

  // Icon Nav (Mobile)
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconNavUl = document.createElement('ul');
  mobileIconNav.append(mobileIconNavUl);
  mainNavUl.append(mobileIconNav);

  contactLinkItems.forEach((row) => {
    const [contactLinkCell, contactLabelCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('mail');
    const anchor = document.createElement('a');
    anchor.href = contactLinkCell?.querySelector('a')?.href || '#';
    anchor.textContent = contactLabelCell?.textContent.trim() || '';
    li.append(anchor);
    mobileIconNavUl.append(li);
    moveInstrumentation(row, li);
  });

  // Search items (Mobile and Desktop share the same structure, so process once)
  searchItems.forEach((row) => {
    const [searchActionCell, searchLabelCell, searchSubmitLabelCell, popularKeywordsCell, recommendedKeywordsCell] = [...row.children];

    // Mobile Search Item
    const mobileLi = document.createElement('li');
    mobileLi.classList.add('search');

    const mobileSearchAnchor = document.createElement('a');
    mobileSearchAnchor.href = '#';

    const mobileLensSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    mobileLensSvg.setAttribute('viewBox', '0 0 21 21');
    mobileLensSvg.setAttribute('fill', 'none');
    mobileLensSvg.classList.add('lens');
    const mobileLensPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mobileLensPath.setAttribute('d', 'M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z');
    mobileLensPath.setAttribute('stroke-width', '0.25');
    mobileLensSvg.append(mobileLensPath);
    mobileSearchAnchor.append(mobileLensSvg);

    const mobileCloseSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    mobileCloseSvg.setAttribute('viewBox', '0 0 50 50');
    mobileCloseSvg.classList.add('close');
    const mobileClosePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mobileClosePath.setAttribute('d', 'M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z');
    mobileCloseSvg.append(mobileClosePath);
    mobileSearchAnchor.append(mobileCloseSvg);

    const mobileSearchSpan = document.createElement('span');
    mobileSearchSpan.textContent = searchLabelCell?.textContent.trim() || 'Search';
    mobileSearchAnchor.append(mobileSearchSpan);
    mobileLi.append(mobileSearchAnchor);

    const mobileSearchScreenWrap = document.createElement('div');
    mobileSearchScreenWrap.classList.add('search-screen-wrap');
    const mobileSearchScreenWrapInner = document.createElement('div');
    mobileSearchScreenWrapInner.classList.add('wrap');
    mobileSearchScreenWrap.append(mobileSearchScreenWrapInner);

    const mobileSearchForm = document.createElement('form');
    mobileSearchForm.action = searchActionCell?.querySelector('a')?.href || '#';
    mobileSearchForm.method = 'get';
    mobileSearchForm.id = 'search-block-form-mobile'; // Unique ID for mobile form
    mobileSearchForm.setAttribute('accept-charset', 'UTF-8');
    mobileSearchScreenWrapInner.append(mobileSearchForm);

    const mobileSearchWrap = document.createElement('div');
    mobileSearchWrap.classList.add('search-wrap');
    mobileSearchForm.append(mobileSearchWrap);

    const mobileSearchIconDiv = document.createElement('div');
    mobileSearchIconDiv.classList.add('search-icon');
    const mobileSearchIconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    mobileSearchIconSvg.setAttribute('viewBox', '0 0 21 21');
    mobileSearchIconSvg.setAttribute('fill', 'none');
    const mobileSearchIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mobileSearchIconPath.setAttribute('d', 'M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z');
    mobileSearchIconPath.setAttribute('stroke-width', '0.25');
    mobileSearchIconSvg.append(mobileSearchIconPath);
    mobileSearchIconDiv.append(mobileSearchIconSvg);
    mobileSearchWrap.append(mobileSearchIconDiv);

    const mobileSearchInput = document.createElement('input');
    mobileSearchInput.type = 'text';
    mobileSearchInput.classList.add('input-text', 'searchtext');
    mobileSearchInput.required = true;
    mobileSearchInput.name = 'key';
    mobileSearchInput.id = 'searchInputMobile'; // Unique ID for mobile input
    mobileSearchInput.autocomplete = 'off';
    mobileSearchWrap.append(mobileSearchInput);

    const mobileSubmitButton = document.createElement('button');
    mobileSubmitButton.classList.add('submit-button');
    const mobileSubmitLabel = document.createElement('div');
    mobileSubmitLabel.classList.add('label');
    mobileSubmitLabel.textContent = searchSubmitLabelCell?.textContent.trim() || 'Submit';
    mobileSubmitButton.append(mobileSubmitLabel);
    const mobileSubmitSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    mobileSubmitSvg.setAttribute('width', '12');
    mobileSubmitSvg.setAttribute('height', '8');
    mobileSubmitSvg.setAttribute('viewBox', '0 0 12 8');
    mobileSubmitSvg.setAttribute('fill', 'none');
    const mobileSubmitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mobileSubmitPath.setAttribute('d', 'M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z');
    mobileSubmitPath.setAttribute('fill', 'black');
    mobileSubmitSvg.append(mobileSubmitPath);
    mobileSubmitButton.append(mobileSubmitSvg);
    mobileSearchWrap.append(mobileSubmitButton);

    const mobileSearchResultBox = document.createElement('div');
    mobileSearchResultBox.classList.add('searchResultBox');
    mobileSearchResultBox.style.display = 'none';
    const mobileSwiperDiv = document.createElement('div');
    mobileSwiperDiv.classList.add('swiper', 'scrollSwiper');
    const mobileSwiperWrapper = document.createElement('div');
    mobileSwiperWrapper.classList.add('swiper-wrapper');
    const mobileSwiperSlide = document.createElement('div');
    mobileSwiperSlide.classList.add('swiper-slide');
    mobileSwiperWrapper.append(mobileSwiperSlide);
    mobileSwiperDiv.append(mobileSwiperWrapper);
    mobileSearchResultBox.append(mobileSwiperDiv);
    const mobileSwiperScrollbar = document.createElement('div');
    mobileSwiperScrollbar.classList.add('swiper-scrollbar');
    mobileSearchResultBox.append(mobileSwiperScrollbar);
    mobileSearchForm.append(mobileSearchResultBox);

    const mobilePopularKeywordsWrap = document.createElement('div');
    mobilePopularKeywordsWrap.classList.add('search-suggestions-wrap');
    const mobilePopularLabel = document.createElement('div');
    mobilePopularLabel.classList.add('label');
    mobilePopularLabel.textContent = 'Popular Keywords:';
    mobilePopularKeywordsWrap.append(mobilePopularLabel);
    const mobilePopularTokensWrap = document.createElement('div');
    mobilePopularTokensWrap.classList.add('tokens-wrap');
    mobilePopularTokensWrap.innerHTML = popularKeywordsCell?.innerHTML || '';
    mobilePopularKeywordsWrap.append(mobilePopularTokensWrap);
    mobileSearchScreenWrapInner.append(mobilePopularKeywordsWrap);

    const mobileRecommendedKeywordsWrap = document.createElement('div');
    mobileRecommendedKeywordsWrap.classList.add('search-suggestions-wrap');
    const mobileRecommendedLabel = document.createElement('div');
    mobileRecommendedLabel.classList.add('label');
    mobileRecommendedLabel.textContent = 'Recommended for you:';
    mobileRecommendedKeywordsWrap.append(mobileRecommendedLabel);
    const mobileRecommendedTokensWrap = document.createElement('div');
    mobileRecommendedTokensWrap.classList.add('tokens-wrap');
    mobileRecommendedTokensWrap.innerHTML = recommendedKeywordsCell?.innerHTML || '';
    mobileRecommendedKeywordsWrap.append(mobileRecommendedTokensWrap);
    mobileSearchScreenWrapInner.append(mobileRecommendedKeywordsWrap);

    mobileLi.append(mobileSearchScreenWrap);
    mobileIconNavUl.append(mobileLi);
    moveInstrumentation(row, mobileLi);

    mobileSearchAnchor.addEventListener('click', (e) => {
      e.preventDefault();
      mobileSearchAnchor.classList.toggle('active');
      mobileSearchScreenWrap.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    // Desktop Search Item (similar structure, but without the "Search" text span)
    const desktopLi = document.createElement('li');
    desktopLi.classList.add('search');

    const desktopSearchAnchor = document.createElement('a');
    desktopSearchAnchor.href = '#';

    const desktopLensSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    desktopLensSvg.setAttribute('viewBox', '0 0 21 21');
    desktopLensSvg.setAttribute('fill', 'none');
    desktopLensSvg.classList.add('lens');
    const desktopLensPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    desktopLensPath.setAttribute('d', 'M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z');
    desktopLensPath.setAttribute('stroke-width', '0.25');
    desktopLensSvg.append(desktopLensPath);
    desktopSearchAnchor.append(desktopLensSvg);

    const desktopCloseSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    desktopCloseSvg.setAttribute('viewBox', '0 0 50 50');
    desktopCloseSvg.classList.add('close');
    const desktopClosePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    desktopClosePath.setAttribute('d', 'M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z');
    desktopCloseSvg.append(desktopClosePath);
    desktopSearchAnchor.append(desktopCloseSvg);

    desktopLi.append(desktopSearchAnchor);

    const desktopSearchScreenWrap = document.createElement('div');
    desktopSearchScreenWrap.classList.add('search-screen-wrap');
    const desktopSearchScreenWrapInner = document.createElement('div');
    desktopSearchScreenWrapInner.classList.add('wrap');
    desktopSearchScreenWrap.append(desktopSearchScreenWrapInner);

    const desktopSearchForm = document.createElement('form');
    desktopSearchForm.action = searchActionCell?.querySelector('a')?.href || '#';
    desktopSearchForm.method = 'get';
    desktopSearchForm.id = 'search-block-form-desktop'; // Unique ID for desktop form
    desktopSearchForm.setAttribute('accept-charset', 'UTF-8');
    desktopSearchScreenWrapInner.append(desktopSearchForm);

    const desktopSearchWrap = document.createElement('div');
    desktopSearchWrap.classList.add('search-wrap');
    desktopSearchForm.append(desktopSearchWrap);

    const desktopSearchIconDiv = document.createElement('div');
    desktopSearchIconDiv.classList.add('search-icon');
    const desktopSearchIconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    desktopSearchIconSvg.setAttribute('viewBox', '0 0 21 21');
    desktopSearchIconSvg.setAttribute('fill', 'none');
    const desktopSearchIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    desktopSearchIconPath.setAttribute('d', 'M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z');
    desktopSearchIconPath.setAttribute('stroke-width', '0.25');
    desktopSearchIconSvg.append(desktopSearchIconPath);
    desktopSearchIconDiv.append(desktopSearchIconSvg);
    desktopSearchWrap.append(desktopSearchIconDiv);

    const desktopSearchInput = document.createElement('input');
    desktopSearchInput.type = 'text';
    desktopSearchInput.classList.add('input-text', 'searchtext');
    desktopSearchInput.required = true;
    desktopSearchInput.name = 'key';
    desktopSearchInput.id = 'searchInputDesktop'; // Unique ID for desktop input
    desktopSearchInput.autocomplete = 'off';
    desktopSearchWrap.append(desktopSearchInput);

    const desktopSubmitButton = document.createElement('button');
    desktopSubmitButton.classList.add('submit-button');
    const desktopSubmitLabel = document.createElement('div');
    desktopSubmitLabel.classList.add('label');
    desktopSubmitLabel.textContent = searchSubmitLabelCell?.textContent.trim() || 'Submit';
    desktopSubmitButton.append(desktopSubmitLabel);
    const desktopSubmitSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    desktopSubmitSvg.setAttribute('width', '12');
    desktopSubmitSvg.setAttribute('height', '8');
    desktopSubmitSvg.setAttribute('viewBox', '0 0 12 8');
    desktopSubmitSvg.setAttribute('fill', 'none');
    const desktopSubmitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    desktopSubmitPath.setAttribute('d', 'M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z');
    desktopSubmitPath.setAttribute('fill', 'black');
    desktopSubmitSvg.append(desktopSubmitPath);
    desktopSubmitButton.append(desktopSubmitSvg);
    desktopSearchWrap.append(desktopSubmitButton);

    const desktopSearchResultBox = document.createElement('div');
    desktopSearchResultBox.classList.add('searchResultBox');
    desktopSearchResultBox.style.display = 'none';
    const desktopSwiperDiv = document.createElement('div');
    desktopSwiperDiv.classList.add('swiper', 'scrollSwiper');
    const desktopSwiperWrapper = document.createElement('div');
    desktopSwiperWrapper.classList.add('swiper-wrapper');
    const desktopSwiperSlide = document.createElement('div');
    desktopSwiperSlide.classList.add('swiper-slide');
    desktopSwiperWrapper.append(desktopSwiperSlide);
    desktopSwiperDiv.append(desktopSwiperWrapper);
    desktopSearchResultBox.append(desktopSwiperDiv);
    const desktopSwiperScrollbar = document.createElement('div');
    desktopSwiperScrollbar.classList.add('swiper-scrollbar');
    desktopSearchResultBox.append(desktopSwiperScrollbar);
    desktopSearchForm.append(desktopSearchResultBox);

    const desktopPopularKeywordsWrap = document.createElement('div');
    desktopPopularKeywordsWrap.classList.add('search-suggestions-wrap');
    const desktopPopularLabel = document.createElement('div');
    desktopPopularLabel.classList.add('label');
    desktopPopularLabel.textContent = 'Popular Keywords:';
    desktopPopularKeywordsWrap.append(desktopPopularLabel);
    const desktopPopularTokensWrap = document.createElement('div');
    desktopPopularTokensWrap.classList.add('tokens-wrap');
    desktopPopularTokensWrap.innerHTML = popularKeywordsCell?.innerHTML || '';
    desktopPopularKeywordsWrap.append(desktopPopularTokensWrap);
    desktopSearchScreenWrapInner.append(desktopPopularKeywordsWrap);

    const desktopRecommendedKeywordsWrap = document.createElement('div');
    desktopRecommendedKeywordsWrap.classList.add('search-suggestions-wrap');
    const desktopRecommendedLabel = document.createElement('div');
    desktopRecommendedLabel.classList.add('label');
    desktopRecommendedLabel.textContent = 'Recommended for you:';
    desktopRecommendedKeywordsWrap.append(desktopRecommendedLabel);
    const desktopRecommendedTokensWrap = document.createElement('div');
    desktopRecommendedTokensWrap.classList.add('tokens-wrap');
    desktopRecommendedTokensWrap.innerHTML = recommendedKeywordsCell?.innerHTML || '';
    desktopRecommendedKeywordsWrap.append(desktopRecommendedTokensWrap);
    desktopSearchScreenWrapInner.append(desktopRecommendedKeywordsWrap);

    desktopLi.append(desktopSearchScreenWrap);
    // Append desktop search item to desktop icon nav later
    moveInstrumentation(row, desktopLi);

    desktopSearchAnchor.addEventListener('click', (e) => {
      e.preventDefault();
      desktopSearchAnchor.classList.toggle('active');
      desktopSearchScreenWrap.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });
  });

  // Icon Nav (Desktop)
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconNavUl = document.createElement('ul');
  desktopIconNav.append(desktopIconNavUl);
  mainNav.append(desktopIconNav);

  contactLinkItems.forEach((row) => {
    const [contactLinkCell, contactLabelCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('mail');
    const anchor = document.createElement('a');
    anchor.href = contactLinkCell?.querySelector('a')?.href || '#';
    const svgMail = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgMail.setAttribute('version', '1.1');
    svgMail.setAttribute('id', 'Layer_1');
    svgMail.setAttribute('x', '0px');
    svgMail.setAttribute('y', '0px');
    svgMail.setAttribute('viewBox', '0 0 48 38.4');
    svgMail.setAttribute('style', 'enable-background:new 0 0 48 38.4;');
    svgMail.setAttribute('xml:space', 'preserve');
    svgMail.setAttribute('width', '21');
    svgMail.setAttribute('height', '21');
    const pathMail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathMail.setAttribute('d', 'M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z');
    svgMail.append(pathMail);
    anchor.append(svgMail);
    li.append(anchor);
    desktopIconNavUl.append(li);
    moveInstrumentation(row, li);
  });

  // Append desktop search items to desktopIconNavUl
  searchItems.forEach((row) => {
    const desktopLi = document.createElement('li');
    desktopLi.classList.add('search');

    const desktopSearchAnchor = document.createElement('a');
    desktopSearchAnchor.href = '#';

    const desktopLensSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    desktopLensSvg.setAttribute('viewBox', '0 0 21 21');
    desktopLensSvg.setAttribute('fill', 'none');
    desktopLensSvg.classList.add('lens');
    const desktopLensPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    desktopLensPath.setAttribute('d', 'M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z');
    desktopLensPath.setAttribute('stroke-width', '0.25');
    desktopLensSvg.append(desktopLensPath);
    desktopSearchAnchor.append(desktopLensSvg);

    const desktopCloseSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    desktopCloseSvg.setAttribute('viewBox', '0 0 50 50');
    desktopCloseSvg.classList.add('close');
    const desktopClosePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    desktopClosePath.setAttribute('d', 'M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z');
    desktopCloseSvg.append(desktopClosePath);
    desktopSearchAnchor.append(desktopCloseSvg);

    desktopLi.append(desktopSearchAnchor);

    const desktopSearchScreenWrap = document.createElement('div');
    desktopSearchScreenWrap.classList.add('search-screen-wrap');
    const desktopSearchScreenWrapInner = document.createElement('div');
    desktopSearchScreenWrapInner.classList.add('wrap');
    desktopSearchScreenWrap.append(desktopSearchScreenWrapInner);

    const desktopSearchForm = document.createElement('form');
    desktopSearchForm.action = row.children[0]?.querySelector('a')?.href || '#';
    desktopSearchForm.method = 'get';
    desktopSearchForm.id = 'search-block-form-desktop';
    desktopSearchForm.setAttribute('accept-charset', 'UTF-8');
    desktopSearchScreenWrapInner.append(desktopSearchForm);

    const desktopSearchWrap = document.createElement('div');
    desktopSearchWrap.classList.add('search-wrap');
    desktopSearchForm.append(desktopSearchWrap);

    const desktopSearchIconDiv = document.createElement('div');
    desktopSearchIconDiv.classList.add('search-icon');
    const desktopSearchIconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    desktopSearchIconSvg.setAttribute('viewBox', '0 0 21 21');
    desktopSearchIconSvg.setAttribute('fill', 'none');
    const desktopSearchIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    desktopSearchIconPath.setAttribute('d', 'M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z');
    desktopSearchIconPath.setAttribute('stroke-width', '0.25');
    desktopSearchIconSvg.append(desktopSearchIconPath);
    desktopSearchIconDiv.append(desktopSearchIconSvg);
    desktopSearchWrap.append(desktopSearchIconDiv);

    const desktopSearchInput = document.createElement('input');
    desktopSearchInput.type = 'text';
    desktopSearchInput.classList.add('input-text', 'searchtext');
    desktopSearchInput.required = true;
    desktopSearchInput.name = 'key';
    desktopSearchInput.id = 'searchInputDesktop';
    desktopSearchInput.autocomplete = 'off';
    desktopSearchWrap.append(desktopSearchInput);

    const desktopSubmitButton = document.createElement('button');
    desktopSubmitButton.classList.add('submit-button');
    const desktopSubmitLabel = document.createElement('div');
    desktopSubmitLabel.classList.add('label');
    desktopSubmitLabel.textContent = row.children[2]?.textContent.trim() || 'Submit';
    desktopSubmitButton.append(desktopSubmitLabel);
    const desktopSubmitSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    desktopSubmitSvg.setAttribute('width', '12');
    desktopSubmitSvg.setAttribute('height', '8');
    desktopSubmitSvg.setAttribute('viewBox', '0 0 12 8');
    desktopSubmitSvg.setAttribute('fill', 'none');
    const desktopSubmitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    desktopSubmitPath.setAttribute('d', 'M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z');
    desktopSubmitPath.setAttribute('fill', 'black');
    desktopSubmitSvg.append(desktopSubmitPath);
    desktopSubmitButton.append(desktopSubmitSvg);
    desktopSearchWrap.append(desktopSubmitButton);

    const desktopSearchResultBox = document.createElement('div');
    desktopSearchResultBox.classList.add('searchResultBox');
    desktopSearchResultBox.style.display = 'none';
    const desktopSwiperDiv = document.createElement('div');
    desktopSwiperDiv.classList.add('swiper', 'scrollSwiper');
    const desktopSwiperWrapper = document.createElement('div');
    desktopSwiperWrapper.classList.add('swiper-wrapper');
    const desktopSwiperSlide = document.createElement('div');
    desktopSwiperSlide.classList.add('swiper-slide');
    desktopSwiperWrapper.append(desktopSwiperSlide);
    desktopSwiperDiv.append(desktopSwiperWrapper);
    desktopSearchResultBox.append(desktopSwiperDiv);
    const desktopSwiperScrollbar = document.createElement('div');
    desktopSwiperScrollbar.classList.add('swiper-scrollbar');
    desktopSearchResultBox.append(desktopSwiperScrollbar);
    desktopSearchForm.append(desktopSearchResultBox);

    const desktopPopularKeywordsWrap = document.createElement('div');
    desktopPopularKeywordsWrap.classList.add('search-suggestions-wrap');
    const desktopPopularLabel = document.createElement('div');
    desktopPopularLabel.classList.add('label');
    desktopPopularLabel.textContent = 'Popular Keywords:';
    desktopPopularKeywordsWrap.append(desktopPopularLabel);
    const desktopPopularTokensWrap = document.createElement('div');
    desktopPopularTokensWrap.classList.add('tokens-wrap');
    desktopPopularTokensWrap.innerHTML = row.children[3]?.innerHTML || '';
    desktopPopularKeywordsWrap.append(desktopPopularTokensWrap);
    desktopSearchScreenWrapInner.append(desktopPopularKeywordsWrap);

    const desktopRecommendedKeywordsWrap = document.createElement('div');
    desktopRecommendedKeywordsWrap.classList.add('search-suggestions-wrap');
    const desktopRecommendedLabel = document.createElement('div');
    desktopRecommendedLabel.classList.add('label');
    desktopRecommendedLabel.textContent = 'Recommended for you:';
    desktopRecommendedKeywordsWrap.append(desktopRecommendedLabel);
    const desktopRecommendedTokensWrap = document.createElement('div');
    desktopRecommendedTokensWrap.classList.add('tokens-wrap');
    desktopRecommendedTokensWrap.innerHTML = row.children[4]?.innerHTML || '';
    desktopRecommendedKeywordsWrap.append(desktopRecommendedTokensWrap);
    desktopSearchScreenWrapInner.append(desktopRecommendedKeywordsWrap);

    desktopLi.append(desktopSearchScreenWrap);
    desktopIconNavUl.append(desktopLi);
    moveInstrumentation(row, desktopLi);

    desktopSearchAnchor.addEventListener('click', (e) => {
      e.preventDefault();
      desktopSearchAnchor.classList.toggle('active');
      desktopSearchScreenWrap.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });
  });

  // 80th Year Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoLink = document.createElement('a');
  year80LogoLink.href = year80LogoLinkRow.querySelector('a')?.href || '#';
  const year80LogoPicture = year80LogoRow.querySelector('picture');
  if (year80LogoPicture) {
    const img = year80LogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    year80LogoLink.append(optimizedPic);
  }
  moveInstrumentation(year80LogoRow, year80LogoLink);
  moveInstrumentation(year80LogoLinkRow, year80LogoLink);
  year80LogoDiv.append(year80LogoLink);
  wrap.append(year80LogoDiv);

  block.replaceChildren(header);

  hamburgerDiv.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    hamburgerDiv.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });

  // Handle mega menu hover for desktop
  if (window.matchMedia('(min-width: 992px)').matches) {
    mainNavUl.querySelectorAll('.has-child').forEach((menuItem) => {
      const megaMenu = menuItem.querySelector('.mega-menu');
      if (megaMenu) {
        menuItem.addEventListener('mouseenter', () => {
          megaMenu.classList.add('active');
        });
        menuItem.addEventListener('mouseleave', () => {
          megaMenu.classList.remove('active');
        });
      }
    });
  }
}
