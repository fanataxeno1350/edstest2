import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Use content detection for root rows instead of index access
  const rootRows = [...block.children];

  const logoRow = rootRows.find(row => row.querySelector('picture') && !row.nextElementSibling?.querySelector('a'));
  const logoLinkRow = rootRows.find(row => row.querySelector('a') && row.previousElementSibling?.querySelector('picture') && !row.nextElementSibling?.querySelector('picture'));
  const year80LogoRow = rootRows.find(row => row.querySelector('picture') && row.nextElementSibling?.querySelector('a') && row.nextElementSibling?.nextElementSibling?.querySelector('div:first-child:not(:has(picture)):not(:has(a))'));
  const year80LogoLinkRow = rootRows.find(row => row.querySelector('a') && row.previousElementSibling?.querySelector('picture') && row.nextElementSibling?.querySelector('div:first-child:not(:has(picture)):not(:has(a))'));

  const itemRows = rootRows.filter(row =>
    ![logoRow, logoLinkRow, year80LogoRow, year80LogoLinkRow].includes(row)
  );

  block.textContent = ''; // Clear the block content

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
  const logoHref = logoLinkRow?.querySelector('a')?.href || '#';
  logoLink.href = logoHref;
  if (logoLinkRow) moveInstrumentation(logoLinkRow, logoLink);

  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    optimizedPic.querySelector('img').classList.add('hiddenlogo1');
    moveInstrumentation(logoPicture, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  if (logoRow) moveInstrumentation(logoRow, logoDiv);
  logoDiv.append(logoLink);
  wrap.append(logoDiv);

  // Hamburger
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  hamburgerDiv.setAttribute('data-once', 'hamburger-click nav-close-search');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }
  hamburgerDiv.append(hamburgerUl);
  wrap.append(hamburgerDiv);

  // Navigation Menu
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);

  const navigationItems = itemRows.filter(row => row.children.length === 3);
  const iconLinkItems = itemRows.filter(row => row.children.length === 2);

  navigationItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(c => !c.querySelector('a') && !c.querySelector('ul'));
    const linkCell = cells.find(c => c.querySelector('a') && !c.querySelector('ul'));
    const hierarchyCell = cells.find(c => c.querySelector('ul'));

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.setAttribute('data-once', 'nav-close-search');
    moveInstrumentation(row, li);

    const link = document.createElement('a');
    link.setAttribute('itemprop', 'url');
    link.href = linkCell?.querySelector('a')?.href || '#';
    link.textContent = labelCell?.textContent || '';
    if (linkCell) moveInstrumentation(linkCell, link);
    if (labelCell) moveInstrumentation(labelCell, link);
    li.append(link);

    // Placeholder for SVG icon, as in original HTML
    const span = document.createElement('span');
    const svgImg = document.createElement('img');
    svgImg.alt = 'svg file';
    svgImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107678.svg+xml';
    span.append(svgImg);
    li.append(span);

    if (hierarchyCell) {
      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu');
      const megaMenuWrap = document.createElement('div');
      megaMenuWrap.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');
      const subNavWrap = document.createElement('div');
      // Add specific class if needed, e.g., 'about-us-sub-nav' - this needs content detection
      // For now, add the base class.
      subNavWrap.classList.add('sub-nav-wrap');

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv);

      // Apply classes to nested elements based on ORIGINAL HTML patterns
      // This is a complex part and requires careful mapping from original HTML
      // For the given example, we see 'top-level-li', 'first-level-li', 'has-sub-child', 'active', 'has-inner-sub-child', 'active-child'
      // These classes are applied based on the structure and content, which is hard to replicate generically.
      // For now, we apply basic classes. If the original HTML has specific classes based on content,
      // more advanced logic would be needed.
      tempDiv.querySelectorAll('ul').forEach((ulEl) => {
        // No specific classes for inner ULs in the provided original HTML example
      });
      tempDiv.querySelectorAll('li').forEach((liEl) => {
        // Example: if a li contains another ul, it might be 'has-sub-child'
        if (liEl.querySelector('ul')) {
          liEl.classList.add('top-level-li'); // Example, adjust based on actual content
        }
      });
      tempDiv.querySelectorAll('a').forEach((aEl) => {
        // No specific classes for links inside hierarchy-tree in the provided original HTML example
      });

      // If the navigation item is "Who We Are", add 'about-us-sub-nav'
      if (link.textContent.toLowerCase() === 'who we are') {
        subNavWrap.classList.add('about-us-sub-nav');
        // Add left-div content for "Who We Are"
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        const h4 = document.createElement('h4');
        h4.classList.add('left-div-heading');
        const h4Link = document.createElement('a');
        h4Link.textContent = 'Our Purpose';
        h4.append(h4Link);
        const p1 = document.createElement('p');
        p1.classList.add('left-div-desc');
        p1.textContent = 'Drive positive change in the lives of our communities. Only when we enable others to rise will we rise.';
        const p2 = document.createElement('p');
        p2.classList.add('left-div-subdesc');
        p2.textContent = '#TogetherWeRise';
        leftDiv.append(h4, p1, p2);
        centerDiv.append(leftDiv);
      } else if (link.textContent.toLowerCase() === 'what we do') {
        subNavWrap.classList.add('what-we-do');
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        const h4 = document.createElement('h4');
        h4.classList.add('left-div-heading');
        const h4Link = document.createElement('a');
        h4Link.textContent = 'Key Facts';
        h4.append(h4Link);
        const ul = document.createElement('ul');
        ['20+ Industries', '100+ Countries', '324K+ Employees'].forEach(text => {
          const liText = document.createElement('li');
          liText.classList.add('list-text-red');
          const [value, label] = text.split(' ');
          liText.innerHTML = `${value} <span>${label}</span>`;
          ul.append(liText);
        });
        leftDiv.append(h4, ul);
        centerDiv.append(leftDiv);
      } else if (link.textContent.toLowerCase() === 'investor relations') {
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div', 'ir-left-div');
        const h4 = document.createElement('h4');
        h4.classList.add('left-div-heading');
        const h4Link = document.createElement('a');
        h4Link.textContent = 'Investor Relations';
        h4.append(h4Link);
        const p = document.createElement('p');
        p.textContent = 'Group Highlights - Q3 F26';
        const ul = document.createElement('ul');
        ['20.1% Consolidated ROE (Annualized)', 'Rs 52,100 cr Revenue', 'Rs 4,675 cr PAT'].forEach(text => {
          const liText = document.createElement('li');
          liText.classList.add('list-text-red');
          const parts = text.split(' ');
          const value = parts.shift();
          liText.innerHTML = `${value} <span>${parts.join(' ')}</span>`;
          ul.append(liText);
        });
        leftDiv.append(h4, p, ul);
        centerDiv.append(leftDiv);

        // Specific structure for investor relations
        const innerSubNavWrapList = document.createElement('div');
        innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');
        const ul1 = document.createElement('ul');
        const li1 = document.createElement('li');
        const a1 = document.createElement('a');
        a1.href = 'https://www.mahindra.com/investor-relations/reports';
        a1.textContent = 'Reports';
        li1.append(a1);
        const li2 = document.createElement('li');
        const a2 = document.createElement('a');
        a2.href = 'https://www.mahindra.com/investor-relations/policies-and-documents';
        a2.textContent = 'Policies';
        li2.append(a2);
        ul1.append(li1, li2);

        const ul2 = document.createElement('ul');
        const li3 = document.createElement('li');
        const a3 = document.createElement('a');
        a3.href = 'https://www.mahindra.com/investor-relations/regulatory-filings';
        a3.textContent = 'Regulatory Filings';
        li3.append(a3);
        const li4 = document.createElement('li');
        const a4 = document.createElement('a');
        a4.href = 'https://www.mahindra.com/investor-relations/sustainability';
        a4.textContent = 'Sustainability';
        li4.append(a4);
        ul2.append(li3, li4);

        const ulOneLink = document.createElement('ul');
        ulOneLink.classList.add('sub-nav-wrap-one-link');
        const liOneLink = document.createElement('li');
        const aOneLink = document.createElement('a');
        aOneLink.href = 'https://www.mahindra.com/sites/default/files/2025-04/Disclosures-under-Reg-46-62-MM-URLs_PDF.pdf';
        aOneLink.target = '_blank';
        aOneLink.textContent = 'Disclosures Under Regulation 46 And 62 Of SEBI (LODR)';
        liOneLink.append(aOneLink);
        ulOneLink.append(liOneLink);

        subNavWrap.classList.add('element-block');
        subNavWrap.append(ulOneLink, innerSubNavWrapList);
        innerSubNavWrapList.append(ul1, ul2);

      } else if (link.textContent.toLowerCase() === 'newsroom') {
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div', 'newsroom-left-div');
        const h4 = document.createElement('h4');
        h4.classList.add('left-div-heading');
        const h4Link = document.createElement('a');
        h4Link.textContent = 'Newsroom';
        h4.append(h4Link);
        const latestTwoPressRelease = document.createElement('div');
        latestTwoPressRelease.classList.add('latest-two-press-release');
        // This part is dynamic and would require more complex logic to extract from the original HTML
        // For now, we'll leave it as a placeholder or simplified structure.
        leftDiv.append(h4, latestTwoPressRelease);
        centerDiv.append(leftDiv);
      } else if (link.textContent.toLowerCase() === 'careers') {
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div', 'career-left-div');
        const h4 = document.createElement('h4');
        h4.classList.add('left-div-heading');
        const h4Link = document.createElement('a');
        h4Link.textContent = 'careers';
        h4.append(h4Link);
        const p1 = document.createElement('p');
        p1.classList.add('left-div-desc');
        p1.textContent = 'Committed to elevate the lives of communities, guided by our core behaviours and values.';
        const p2 = document.createElement('p');
        p2.classList.add('left-div-subdesc');
        p2.textContent = 'Bold. Agile. Collaborative.';
        leftDiv.append(h4, p1, p2);
        centerDiv.append(leftDiv);
        subNavWrap.classList.add('careers-div');
      }

      while (tempDiv.firstChild) {
        subNavWrap.append(tempDiv.firstChild);
      }
      centerDiv.append(subNavWrap);
      megaMenuWrap.append(centerDiv);
      megaMenu.append(megaMenuWrap);
      li.append(megaMenu);
    }
    navUl.append(li);
  });

  // Icon Links (mobile-menus-icon and desktop-menus-icon)
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconUl = document.createElement('ul');
  mobileIconNav.append(mobileIconUl);

  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconUl = document.createElement('ul');
  desktopIconNav.append(desktopIconUl);

  iconLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(c => c.querySelector('picture'));
    const linkCell = cells.find(c => c.querySelector('a'));

    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const link = document.createElement('a');
    link.href = linkCell?.querySelector('a')?.href || '#';
    if (linkCell) moveInstrumentation(linkCell, link);

    if (iconCell) {
      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '30' }]); // Adjust width as needed
        moveInstrumentation(iconPicture, optimizedPic.querySelector('img'));
        link.append(optimizedPic);
      }
    }
    // Add text content if available, e.g., for "Contact Us"
    if (linkCell && linkCell.textContent && !link.querySelector('img')) {
      link.textContent = linkCell.textContent;
    }

    li.append(link);

    // Determine specific classes based on content, e.g., 'mail', 'search'
    if (link.href.includes('contact-us')) {
      li.classList.add('mail');
      // For mobile, the original HTML has "Contact Us" text, not an icon.
      // For desktop, it has an icon.
      // This logic needs to be handled carefully.
      // If the link has an image, it's likely for desktop. If it has text content, it's for mobile.
      if (!link.querySelector('img')) {
        link.textContent = 'Contact Us'; // Ensure text for mobile if icon is missing
      }
    } else if (link.href === '#') { // Assuming search link is '#'
      li.classList.add('search');
      li.setAttribute('data-once', 'search-toggle search-stop-propagation');
      link.setAttribute('data-once', 'search-stop-propagation');
      // Add search icon and text span if they exist in original HTML
      const searchImg1 = document.createElement('img');
      searchImg1.alt = 'svg file';
      searchImg1.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107725.svg+xml';
      const searchImg2 = document.createElement('img');
      searchImg2.alt = 'svg file';
      searchImg2.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107749.svg+xml';
      const searchSpan = document.createElement('span');
      searchSpan.setAttribute('data-once', 'search-stop-propagation');
      searchSpan.textContent = ' Search';
      link.append(searchImg1, searchImg2, searchSpan);

      // Add search screen wrap for search functionality
      const searchScreenWrap = document.createElement('div');
      searchScreenWrap.classList.add('search-screen-wrap');
      searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
      // ... populate search screen wrap with form and suggestions as per original HTML
      const searchWrapInner = document.createElement('div');
      searchWrapInner.classList.add('wrap');
      searchWrapInner.setAttribute('data-once', 'search-stop-propagation');
      searchScreenWrap.append(searchWrapInner);
      li.append(searchScreenWrap);

      // Implement search toggle
      link.addEventListener('click', (e) => {
        e.preventDefault();
        searchScreenWrap.classList.toggle('show'); // Assuming 'show' class controls visibility
      });
      searchScreenWrap.addEventListener('click', (e) => {
        if (e.target === searchScreenWrap) {
          searchScreenWrap.classList.remove('show');
        }
      });
    }

    // Clone for mobile, but adjust content if needed (e.g., text vs icon for contact us)
    const mobileLi = li.cloneNode(true);
    if (mobileLi.classList.contains('mail') && mobileLi.querySelector('a img')) {
      // If it's a mail icon link for mobile, and it has an image, remove the image and add text
      mobileLi.querySelector('a img').remove();
      mobileLi.querySelector('a').textContent = 'Contact Us';
    }
    mobileIconUl.append(mobileLi);

    // For desktop, ensure the correct icon is present for mail if it was text for mobile
    if (li.classList.contains('mail') && !li.querySelector('a img')) {
      const desktopMailImg = document.createElement('img');
      desktopMailImg.alt = 'svg file';
      desktopMailImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107856.svg+xml';
      li.querySelector('a').textContent = ''; // Clear text content
      li.querySelector('a').append(desktopMailImg);
    }
    desktopIconUl.append(li); // Append original for desktop
  });

  navUl.append(mobileIconNav);
  nav.append(desktopIconNav);
  wrap.append(nav);

  // 80th Year Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoLink = document.createElement('a');
  const year80LogoHref = year80LogoLinkRow?.querySelector('a')?.href || '#';
  year80LogoLink.href = year80LogoHref;
  if (year80LogoLinkRow) moveInstrumentation(year80LogoLinkRow, year80LogoLink);

  const year80LogoPicture = year80LogoRow?.querySelector('picture');
  if (year80LogoPicture) {
    const img = year80LogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    moveInstrumentation(year80LogoPicture, optimizedPic.querySelector('img'));
    year80LogoLink.append(optimizedPic);
  }
  if (year80LogoRow) moveInstrumentation(year80LogoRow, year80LogoDiv);
  year80LogoDiv.append(year80LogoLink);
  wrap.append(year80LogoDiv);

  block.append(header);

  // Hamburger menu toggle
  hamburgerDiv.addEventListener('click', () => {
    nav.classList.toggle('active'); // Assuming 'active' class shows/hides the nav
    hamburgerDiv.classList.toggle('active'); // Toggle hamburger state
  });

  // Image optimization for all pictures in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    // Only optimize if not already handled by specific logic (e.g., logo)
    if (!img.closest('.logo') && !img.closest('.icon-nav')) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
    }
  });
}
