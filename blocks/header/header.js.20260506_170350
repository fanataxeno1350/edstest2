import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
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
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-sub-child'); // use ORIGINAL HTML class
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

export default async function decorate(block) {
  const children = [...block.children];

  const [
    logoRow,
    logoLinkRow,
    anniversaryLogoRow,
    anniversaryLogoLinkRow,
    ...itemRows
  ] = children;

  // Navigation items have 10 cells (9 fields + 1 container field 'pressReleases' which is not a cell itself)
  const navigationItems = itemRows.filter((row) => row.children.length === 9); // Corrected to 9 cells as per model
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4);
  const iconNavItems = itemRows.filter((row) => row.children.length === 2);

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  header.setAttribute('data-once', 'header-hover');

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  logoLink.href = logoLinkRow.querySelector('a')?.href || '#';
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoLink);
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);
  wrap.append(logoDiv);

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  const ulHamburger = document.createElement('ul');
  [...Array(3)].forEach(() => ulHamburger.append(document.createElement('li')));
  hamburger.append(ulHamburger);
  wrap.append(hamburger);

  // Main Nav
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);
  wrap.append(nav);

  navigationItems.forEach((row) => {
    // Corrected destructuring to match 9 cells as per BlockJson model for navigation-item
    const [
      labelCell,
      linkCell,
      leftPanelHeadingCell,
      leftPanelDescriptionCell,
      leftPanelSubDescriptionCell,
      keyFactsCell,
      groupHighlightsCell,
      megaMenuLinksCell,
      hierarchyTreeCell, // This is the 9th cell, 'pressReleases' is a container field, not a cell
    ] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.setAttribute('data-once', 'nav-close-search');

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    anchor.href = linkCell.querySelector('a')?.href || '#';
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);

    const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgIcon.setAttribute('viewBox', '-23.5 -23.5 122.80 122.80');
    svgIcon.setAttribute('fill', '#000000');
    svgIcon.setAttribute('stroke', '#000000');
    svgIcon.setAttribute('stroke-width', '4.851456000000001');
    svgIcon.innerHTML = `
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g>
      <g id="SVGRepo_iconCarrier">
        <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)">
          <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path>
        </g>
      </g>
    `;
    li.append(document.createElement('span')).append(svgIcon);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    megaMenu.append(megaMenuWrap);
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.append(centerDiv);

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    centerDiv.append(leftDiv);

    // Use a temporary div to safely extract innerHTML from richtext cells
    const tempDiv = document.createElement('div');

    if (labelCell.textContent.trim().toLowerCase() === 'who we are') {
      leftDiv.classList.add('about-us-left-div');
      const heading = document.createElement('h4');
      heading.classList.add('left-div-heading');
      moveInstrumentation(leftPanelHeadingCell, heading);
      heading.innerHTML = leftPanelHeadingCell.innerHTML;
      leftDiv.append(heading);
      const desc = document.createElement('div'); // Use div for richtext to avoid <p> inside <p>
      desc.classList.add('left-div-desc');
      moveInstrumentation(leftPanelDescriptionCell, desc);
      desc.innerHTML = leftPanelDescriptionCell.innerHTML;
      leftDiv.append(desc);
      const subDesc = document.createElement('div'); // Use div for richtext
      subDesc.classList.add('left-div-subdesc');
      moveInstrumentation(leftPanelSubDescriptionCell, subDesc);
      subDesc.innerHTML = leftPanelSubDescriptionCell.innerHTML;
      leftDiv.append(subDesc);

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap', 'about-us-sub-nav');
      moveInstrumentation(megaMenuLinksCell, subNavWrap);
      subNavWrap.innerHTML = megaMenuLinksCell.innerHTML;
      centerDiv.append(subNavWrap);
    } else if (labelCell.textContent.trim().toLowerCase() === 'what we do') {
      leftDiv.classList.add('what-we-do-left-div');
      const heading = document.createElement('h4');
      heading.classList.add('left-div-heading');
      moveInstrumentation(keyFactsCell, heading);
      heading.innerHTML = keyFactsCell.innerHTML; // keyFacts is richtext
      leftDiv.append(heading);

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap', 'what-we-do');
      moveInstrumentation(hierarchyTreeCell, subNavWrap);
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      const ulElement = tempDiv.querySelector('ul');
      if (ulElement) {
        transformNestedLists(ulElement);
        subNavWrap.append(ulElement);
      }
      centerDiv.append(subNavWrap);
    } else if (labelCell.textContent.trim().toLowerCase() === 'investor relations') {
      leftDiv.classList.add('ir-left-div');
      const heading = document.createElement('h4');
      heading.classList.add('left-div-heading');
      moveInstrumentation(groupHighlightsCell, heading);
      heading.innerHTML = groupHighlightsCell.innerHTML; // groupHighlights is richtext
      leftDiv.append(heading);

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap', 'element-block');
      const subNavUl = document.createElement('ul');
      subNavUl.classList.add('sub-nav-wrap-one-link');
      const subNavInnerDiv = document.createElement('div');
      subNavInnerDiv.classList.add('inner-sub-nav-wrap-list');
      subNavWrap.append(subNavUl, subNavInnerDiv);

      moveInstrumentation(megaMenuLinksCell, subNavWrap);
      tempDiv.innerHTML = megaMenuLinksCell.innerHTML;
      const megaMenuLinksUl = tempDiv.querySelector('ul');
      if (megaMenuLinksUl) {
        // First link is a single item
        const firstLi = megaMenuLinksUl.querySelector('li:first-child');
        if (firstLi) {
          const firstLink = firstLi.querySelector('a');
          if (firstLink) {
            const liOne = document.createElement('li');
            const aOne = document.createElement('a');
            aOne.href = firstLink.href;
            aOne.textContent = firstLink.textContent.trim();
            if (firstLink.target) aOne.target = firstLink.target;
            liOne.append(aOne);
            subNavUl.append(liOne);
          }
        }

        // Remaining links are in two columns
        const remainingLIs = [...megaMenuLinksUl.querySelectorAll('li:not(:first-child)')];
        const half = Math.ceil(remainingLIs.length / 2);
        const ul1 = document.createElement('ul');
        const ul2 = document.createElement('ul');

        remainingLIs.forEach((item, index) => {
          const link = item.querySelector('a');
          if (link) {
            const liItem = document.createElement('li');
            const aItem = document.createElement('a');
            aItem.href = link.href;
            aItem.textContent = link.textContent.trim();
            if (link.target) aItem.target = link.target;
            liItem.append(aItem);
            if (index < half) {
              ul1.append(liItem);
            } else {
              ul2.append(liItem);
            }
          }
        });
        if (ul1.children.length > 0) subNavInnerDiv.append(ul1);
        if (ul2.children.length > 0) subNavInnerDiv.append(ul2);
      }
      centerDiv.append(subNavWrap);
    } else if (labelCell.textContent.trim().toLowerCase() === 'newsroom') {
      leftDiv.classList.add('newsroom-left-div');
      const heading = document.createElement('h4');
      heading.classList.add('left-div-heading');
      moveInstrumentation(leftPanelHeadingCell, heading);
      heading.innerHTML = leftPanelHeadingCell.innerHTML; // leftPanelHeading is richtext
      leftDiv.append(heading);

      const latestPressReleaseDiv = document.createElement('div');
      latestPressReleaseDiv.classList.add('latest-two-press-release');
      pressReleaseItems.forEach((prRow) => {
        const [prTitleCell, prLinkCell, prDateCell, prCategoryCell] = [...prRow.children];
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

        const prLink = document.createElement('a');
        prLink.href = prLinkCell.querySelector('a')?.href || '#';
        prLink.textContent = prTitleCell.textContent.trim();
        const p = document.createElement('p');
        p.append(prLink);
        descDiv.append(p);

        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date');
        const emDate = document.createElement('em');
        emDate.textContent = prDateCell.textContent.trim();
        const emCategory = document.createElement('em');
        emCategory.textContent = prCategoryCell.textContent.trim();
        dateDiv.append(emDate, emCategory);
        descDiv.append(dateDiv);
        latestPressReleaseDiv.append(slidesDiv);
        moveInstrumentation(prRow, slidesDiv); // Move instrumentation for each press release row
      });
      leftDiv.append(latestPressReleaseDiv);

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');
      moveInstrumentation(megaMenuLinksCell, subNavWrap);
      subNavWrap.innerHTML = megaMenuLinksCell.innerHTML; // megaMenuLinks is richtext
      centerDiv.append(subNavWrap);
    } else if (labelCell.textContent.trim().toLowerCase() === 'careers') {
      leftDiv.classList.add('career-left-div');
      const heading = document.createElement('h4');
      heading.classList.add('left-div-heading');
      moveInstrumentation(leftPanelHeadingCell, heading);
      heading.innerHTML = leftPanelHeadingCell.innerHTML; // leftPanelHeading is richtext
      leftDiv.append(heading);
      const desc = document.createElement('div'); // Use div for richtext
      desc.classList.add('left-div-desc');
      moveInstrumentation(leftPanelDescriptionCell, desc);
      desc.innerHTML = leftPanelDescriptionCell.innerHTML;
      leftDiv.append(desc);
      const subDesc = document.createElement('div'); // Use div for richtext
      subDesc.classList.add('left-div-subdesc');
      moveInstrumentation(leftPanelSubDescriptionCell, subDesc);
      subDesc.innerHTML = leftPanelSubDescriptionCell.innerHTML;
      leftDiv.append(subDesc);

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap', 'careers-div');
      moveInstrumentation(hierarchyTreeCell, subNavWrap);
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      const ulElement = tempDiv.querySelector('ul');
      if (ulElement) {
        transformNestedLists(ulElement);
        subNavWrap.append(ulElement);
      }
      centerDiv.append(subNavWrap);
    }

    li.append(megaMenu);
    navUl.append(li);
    moveInstrumentation(row, li);
  });

  // Mobile Icon Nav
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconNavUl = document.createElement('ul');
  mobileIconNav.append(mobileIconNavUl);
  navUl.append(mobileIconNav);

  // Contact Us (Mail)
  const contactLi = document.createElement('li');
  contactLi.classList.add('mail');
  const contactLink = document.createElement('a');
  contactLink.href = 'https://www.mahindra.com/contact-us';
  contactLink.textContent = 'Contact Us';
  contactLi.append(contactLink);
  mobileIconNavUl.append(contactLi);

  // Search (Mobile)
  const searchLiMobile = createSearchElement();
  mobileIconNavUl.append(searchLiMobile);

  // Desktop Icon Nav
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconNavUl = document.createElement('ul');
  desktopIconNav.append(desktopIconNavUl);
  nav.append(desktopIconNav);

  // Contact Us (Desktop)
  const contactLiDesktop = document.createElement('li');
  contactLiDesktop.classList.add('mail');
  const contactLinkDesktop = document.createElement('a');
  contactLinkDesktop.href = 'https://www.mahindra.com/contact-us';
  contactLinkDesktop.innerHTML = `
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21">
      <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z" />
    </svg>
  `;
  contactLiDesktop.append(contactLinkDesktop);
  desktopIconNavUl.append(contactLiDesktop);

  // Search (Desktop)
  const searchLiDesktop = createSearchElement();
  desktopIconNavUl.append(searchLiDesktop);

  iconNavItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = linkCell.querySelector('a')?.href || '#';
    a.textContent = labelCell.textContent.trim();
    li.append(a);
    mobileIconNavUl.append(li);
    desktopIconNavUl.append(li.cloneNode(true)); // Clone for desktop nav
    moveInstrumentation(row, li);
  });

  // Anniversary Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoLink = document.createElement('a');
  year80LogoLink.href = anniversaryLogoLinkRow.querySelector('a')?.href || '#';
  const anniversaryPicture = anniversaryLogoRow.querySelector('picture');
  if (anniversaryPicture) {
    const img = anniversaryPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    year80LogoLink.append(optimizedPic);
  }
  moveInstrumentation(anniversaryLogoRow, year80LogoLink);
  moveInstrumentation(anniversaryLogoLinkRow, year80LogoLink);
  year80LogoDiv.append(year80LogoLink);
  wrap.append(year80LogoDiv);

  block.replaceChildren(header);

  // Hamburger toggle functionality
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });

  // Search toggle functionality
  function createSearchElement() {
    const searchLi = document.createElement('li');
    searchLi.classList.add('search');
    searchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');

    const searchLink = document.createElement('a');
    searchLink.href = '#';
    searchLink.setAttribute('data-once', 'search-stop-propagation');

    const lensSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    lensSvg.setAttribute('viewBox', '0 0 21 21');
    lensSvg.setAttribute('fill', 'none');
    lensSvg.classList.add('lens');
    lensSvg.setAttribute('data-once', 'search-stop-propagation');
    lensSvg.innerHTML = `
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
    `;
    searchLink.append(lensSvg);

    const closeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    closeSvg.setAttribute('viewBox', '0 0 50 50');
    closeSvg.classList.add('close');
    closeSvg.setAttribute('data-once', 'search-stop-propagation');
    closeSvg.innerHTML = `
      <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
    `;
    searchLink.append(closeSvg);

    const searchSpan = document.createElement('span');
    searchSpan.setAttribute('data-once', 'search-stop-propagation');
    searchSpan.textContent = ' Search';
    searchLink.append(searchSpan);

    searchLi.append(searchLink);

    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
    const searchScreenWrapInner = document.createElement('div');
    searchScreenWrapInner.classList.add('wrap');
    searchScreenWrapInner.setAttribute('data-once', 'search-stop-propagation');
    searchScreenWrap.append(searchScreenWrapInner);

    const searchForm = document.createElement('form');
    searchForm.action = 'https://www.mahindra.com/search';
    searchForm.method = 'get';
    searchForm.id = 'search-block-form';
    searchForm.setAttribute('accept-charset', 'UTF-8');
    searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
    searchForm.setAttribute('data-once', 'search-stop-propagation');
    searchScreenWrapInner.append(searchForm);

    const searchWrap = document.createElement('div');
    searchWrap.classList.add('search-wrap');
    searchWrap.setAttribute('data-once', 'search-stop-propagation');
    searchForm.append(searchWrap);

    const searchIconDiv = document.createElement('div');
    searchIconDiv.classList.add('search-icon');
    searchIconDiv.setAttribute('data-once', 'search-stop-propagation');
    const searchIconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    searchIconSvg.setAttribute('viewBox', '0 0 21 21');
    searchIconSvg.setAttribute('fill', 'none');
    searchIconSvg.setAttribute('data-once', 'search-stop-propagation');
    searchIconSvg.innerHTML = `
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
    `;
    searchIconDiv.append(searchIconSvg);
    searchWrap.append(searchIconDiv);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.classList.add('input-text', 'searchtext');
    searchInput.required = true;
    searchInput.name = 'key';
    searchInput.id = 'searchInput';
    searchInput.autocomplete = 'off';
    searchInput.setAttribute('data-once', 'search-stop-propagation');
    searchWrap.append(searchInput);

    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-button');
    submitButton.setAttribute('data-once', 'search-stop-propagation');
    const labelDiv = document.createElement('div');
    labelDiv.classList.add('label');
    labelDiv.setAttribute('data-once', 'search-stop-propagation');
    labelDiv.textContent = ' Submit ';
    submitButton.append(labelDiv);
    const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrowSvg.setAttribute('width', '12');
    arrowSvg.setAttribute('height', '8');
    arrowSvg.setAttribute('viewBox', '0 0 12 8');
    arrowSvg.setAttribute('fill', 'none');
    arrowSvg.setAttribute('data-once', 'search-stop-propagation');
    arrowSvg.innerHTML = `
      <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path>
    `;
    submitButton.append(arrowSvg);
    searchWrap.append(submitButton);

    const searchResultBox = document.createElement('div');
    searchResultBox.classList.add('searchResultBox');
    searchResultBox.style.display = 'none';
    searchResultBox.setAttribute('data-once', 'search-stop-propagation');
    searchForm.append(searchResultBox);

    const searchSuggestionsWrap1 = document.createElement('div');
    searchSuggestionsWrap1.classList.add('search-suggestions-wrap');
    searchSuggestionsWrap1.setAttribute('data-once', 'search-stop-propagation');
    searchSuggestionsWrap1.innerHTML = `
      <div class="label" data-once="search-stop-propagation">Popular Keywords:</div>
      <div class="tokens-wrap" data-once="search-stop-propagation">
        <ul data-once="search-stop-propagation">
          <li data-once="search-stop-propagation">Business</li>
          <li data-once="search-stop-propagation">FY 21</li>
          <li data-once="search-stop-propagation">Brands</li>
          <li data-once="search-stop-propagation">XUV700</li>
          <li data-once="search-stop-propagation">Global</li>
          <li data-once="search-stop-propagation">Nanhi Kali</li>
        </ul>
      </div>
    `;
    searchScreenWrapInner.append(searchSuggestionsWrap1);

    const searchSuggestionsWrap2 = document.createElement('div');
    searchSuggestionsWrap2.classList.add('search-suggestions-wrap');
    searchSuggestionsWrap2.setAttribute('data-once', 'search-stop-propagation');
    searchSuggestionsWrap2.innerHTML = `
      <div class="label" data-once="search-stop-propagation">Recommended for you:</div>
      <div class="tokens-wrap" data-once="search-stop-propagation">
        <ul data-once="search-stop-propagation">
          <li data-once="search-stop-propagation">Annual Report 2021 - 2022</li>
          <li data-once="search-stop-propagation">Leadership Announcement</li>
          <li data-once="search-stop-propagation">Latest Press Release</li>
          <li data-once="search-stop-propagation">Brand Guidelines</li>
        </ul>
      </div>
    `;
    searchScreenWrapInner.append(searchSuggestionsWrap2);

    searchLink.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchLi.classList.toggle('active');
      searchScreenWrap.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    searchScreenWrap.addEventListener('click', (e) => {
      if (e.target === searchScreenWrap) {
        searchLi.classList.remove('active');
        searchScreenWrap.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });

    return searchLi;
  }
}
