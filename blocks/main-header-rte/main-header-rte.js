import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    yearLogoRow,
    yearLogoLinkRow,
    contactLinkRow,
    pressReleaseLinkRow,
    mediaResourcesLinkRow,
    inTheNewsLinkRow,
    textRow,
    ...itemRows
  ] = [...block.children];

  // Helper to parse the navigation tree from the richtext field
  function parseNavTree(ul) {
    return [...ul.querySelectorAll(':scope > li')].map((li) => {
      let label = '';
      for (const node of li.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          label += node.textContent.trim();
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'UL') {
          label += node.textContent.trim();
        }
      }
      label = label.trim();

      const childUl = li.querySelector(':scope > ul');
      return { label, children: childUl ? parseNavTree(childUl) : [] };
    });
  }

  // Helper to recursively render navigation items
  function renderNavItems(items, parentContainer) {
    items.forEach((item) => {
      const li = document.createElement('li');
      li.classList.add('has-child', 'hover-red'); // Classes from ORIGINAL HTML
      li.setAttribute('itemprop', 'name'); // From original HTML

      const anchor = document.createElement('a');
      anchor.textContent = item.label;
      anchor.setAttribute('itemprop', 'url');
      // In a real scenario, if the RTE had actual links, you'd extract href here.
      // For this example, assuming text-only leaves or links without explicit href in the RTE structure.
      // For parent items, the anchor might not have a direct href, or it might be a fallback.
      // For simplicity, we'll assign '#' if no specific link is found in the RTE.
      // If the original HTML has a specific link for the parent, it should be extracted from the RTE.
      // For now, we'll assume the label is the primary content.

      if (item.children.length > 0) {
        // Parent item with children: create label, toggle, and nested list
        const toggleSpan = document.createElement('span');
        const toggleImg = document.createElement('img');
        toggleImg.setAttribute('alt', 'svg file');
        toggleImg.setAttribute('src', '/content/dam/aemigrate/uploaded-folder/image/1776098182662.svg+xml');
        toggleSpan.append(toggleImg);

        // The original HTML shows a complex mega-menu structure.
        // We need to replicate this structure for parent items.
        const megaMenu = document.createElement('div');
        megaMenu.classList.add('mega-menu');
        const megaMenuWrap = document.createElement('div');
        megaMenuWrap.classList.add('wrap', 'container');
        const megaMenuCenterDiv = document.createElement('div');
        megaMenuCenterDiv.classList.add('center-div');
        const subNavWrap = document.createElement('div');
        subNavWrap.classList.add('sub-nav-wrap'); // This class is generic, specific ones like 'about-us-sub-nav' need to be added if detected from original HTML

        const ul = document.createElement('ul'); // This UL will contain the children
        renderNavItems(item.children, ul); // RECURSIVELY render children into this submenu

        subNavWrap.append(ul);
        megaMenuCenterDiv.append(subNavWrap);
        megaMenuWrap.append(megaMenuCenterDiv);
        megaMenu.append(megaMenuWrap);

        li.append(anchor, toggleSpan, megaMenu);

        // Add toggle behavior for the parent item
        li.addEventListener('click', (event) => {
          // Only toggle if the click is on the li or its direct children (excluding nested links within the mega-menu)
          if (event.target === li || event.target === anchor || event.target === toggleSpan || event.target === toggleImg) {
            li.classList.toggle('active'); // Add 'active' class to show/hide the mega-menu
            megaMenu.classList.toggle('show'); // Or whatever class controls visibility
          }
        });
      } else {
        // Leaf item: just the label or link
        li.append(anchor);
      }
      parentContainer.append(li);
    });
  }

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  logoLink.href = logoLinkRow?.querySelector('a')?.href || '#';
  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  logoDiv.append(logoLink);

  // Hamburger (mobile menu toggle)
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  const hamburgerUl = document.createElement('ul');
  [...Array(3)].forEach(() => hamburgerUl.append(document.createElement('li')));
  hamburgerDiv.append(hamburgerUl);

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

  const textCell = textRow?.querySelector('div');
  const temp = document.createElement('div');
  temp.innerHTML = textCell?.innerHTML ?? '';
  const rootUl = temp.querySelector('ul');
  const navItems = rootUl ? parseNavTree(rootUl) : [];

  renderNavItems(navItems, navUl); // Renders ALL nested levels recursively
  nav.append(navUl);

  // Icon Nav (mobile menus)
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconUl = document.createElement('ul');

  // Contact Link
  const contactLiMobile = document.createElement('li');
  contactLiMobile.classList.add('mail');
  const contactLinkMobile = document.createElement('a');
  contactLinkMobile.href = contactLinkRow?.querySelector('a')?.href || '#';
  contactLinkMobile.textContent = contactLinkRow?.querySelector('a')?.textContent || 'Contact Us';
  contactLiMobile.append(contactLinkMobile);
  mobileIconUl.append(contactLiMobile);

  // Search (mobile) - simplified for this example
  const searchLiMobile = document.createElement('li');
  searchLiMobile.classList.add('search');
  const searchLinkMobile = document.createElement('a');
  searchLinkMobile.href = '#';
  const searchImgMobile = document.createElement('img');
  searchImgMobile.setAttribute('alt', 'svg file');
  searchImgMobile.setAttribute('src', '/content/dam/aemigrate/uploaded-folder/image/1776098182755.svg+xml');
  const searchSpanMobile = document.createElement('span');
  searchSpanMobile.textContent = ' Search';
  searchLinkMobile.append(searchImgMobile, searchSpanMobile);
  searchLiMobile.append(searchLinkMobile);
  mobileIconUl.append(searchLiMobile);
  nav.append(mobileIconNav); // Appending to nav as per original HTML structure
  mobileIconNav.append(mobileIconUl);


  // Icon Nav (desktop menus)
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconUl = document.createElement('ul');

  // Contact Link
  const contactLiDesktop = document.createElement('li');
  contactLiDesktop.classList.add('mail');
  const contactLinkDesktop = document.createElement('a');
  contactLinkDesktop.href = contactLinkRow?.querySelector('a')?.href || '#';
  const contactImgDesktop = document.createElement('img');
  contactImgDesktop.setAttribute('alt', 'svg file');
  contactImgDesktop.setAttribute('src', '/content/dam/aemigrate/uploaded-folder/image/1776098183085.svg+xml');
  contactLinkDesktop.append(contactImgDesktop);
  contactLiDesktop.append(contactLinkDesktop);
  desktopIconUl.append(contactLiDesktop);

  // Search (desktop) - simplified for this example
  const searchLiDesktop = document.createElement('li');
  searchLiDesktop.classList.add('search');
  const searchLinkDesktop = document.createElement('a');
  searchLinkDesktop.href = '#';
  const searchImgDesktop1 = document.createElement('img');
  searchImgDesktop1.setAttribute('alt', 'svg file');
  searchImgDesktop1.setAttribute('src', '/content/dam/aemigrate/uploaded-folder/image/1776098182755.svg+xml');
  const searchImgDesktop2 = document.createElement('img');
  searchImgDesktop2.setAttribute('alt', 'svg file');
  searchImgDesktop2.setAttribute('src', '/content/dam/aemigrate/uploaded-folder/image/1776098182867.svg+xml');
  searchLinkDesktop.append(searchImgDesktop1, searchImgDesktop2);
  searchLiDesktop.append(searchLinkDesktop);
  desktopIconUl.append(searchLiDesktop);
  desktopIconNav.append(desktopIconUl);
  nav.append(desktopIconNav); // Appending to nav as per original HTML structure

  // Year Logo
  const yearLogoDiv = document.createElement('div');
  yearLogoDiv.classList.add('logo', 'year-80-logo');
  const yearLogoLink = document.createElement('a');
  yearLogoLink.href = yearLogoLinkRow?.querySelector('a')?.href || '#';
  const yearLogoPicture = yearLogoRow?.querySelector('picture');
  if (yearLogoPicture) {
    const img = yearLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    yearLogoLink.append(optimizedPic);
  }
  yearLogoDiv.append(yearLogoLink);

  wrapDiv.append(logoDiv, hamburgerDiv, nav, yearLogoDiv);
  containerDiv.append(wrapDiv);
  header.append(containerDiv);

  // Hamburger toggle functionality
  hamburgerDiv.addEventListener('click', () => {
    nav.classList.toggle('show'); // Assuming 'show' class controls visibility
    hamburgerDiv.classList.toggle('active'); // Add/remove active class for hamburger animation
  });

  // Search toggle functionality (simplified)
  [searchLiMobile, searchLiDesktop].forEach((searchLi) => {
    searchLi.addEventListener('click', (e) => {
      e.preventDefault();
      // The original HTML shows a search-screen-wrap that needs to be toggled
      const searchScreenWrap = searchLi.querySelector('.search-screen-wrap');
      if (searchScreenWrap) {
        searchScreenWrap.classList.toggle('show');
      }
      // Also toggle the 'active' class on the search li itself
      searchLi.classList.toggle('active');
    });
  });

  block.textContent = '';
  block.append(header);

  // Optimize all images in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
