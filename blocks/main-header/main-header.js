import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    year80LogoRow,
    year80LogoLinkRow,
    ...itemRows
  ] = [...block.children];

  block.textContent = '';

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
  const logoLinkEl = logoLinkRow.querySelector('a');
  if (logoLinkEl) {
    logoLink.href = logoLinkEl.href;
  }
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoDiv);
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);
  wrap.append(logoDiv);

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }
  hamburger.append(hamburgerUl);
  wrap.append(hamburger);

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);
  wrap.append(nav);

  const navigationItems = itemRows.filter((row) => row.children.length === 16);
  const iconNavItems = itemRows.filter((row) => row.children.length === 4);

  navigationItems.forEach((row) => {
    const cells = [...row.children];
    // Use content detection for all cells instead of index access
    const labelCell = cells.find((c) => !c.querySelector('a') && !c.querySelector('picture') && !c.querySelector('ul') && !c.textContent.includes('Left Div Heading') && !c.textContent.includes('Investor Relations Heading') && !c.textContent.includes('Newsroom Heading') && !c.textContent.includes('Career Heading'));
    const linkCell = cells.find((c) => c.querySelector('a') && !c.querySelector('ul'));
    const iconCell = cells.find((c) => c.querySelector('picture'));
    const hierarchyTreeCell = cells.find((c) => c.querySelector('ul'));

    // Find other cells based on their content or position relative to known elements
    const leftDivHeadingCell = cells.find((c) => c.textContent.trim().toLowerCase().includes('left div heading'));
    const leftDivDescCell = cells.find((c) => c.textContent.trim().toLowerCase().includes('left div description'));
    const leftDivSubdescCell = cells.find((c) => c.textContent.trim().toLowerCase().includes('left div subdescription'));
    const leftDivListCell = cells.find((c) => c.textContent.trim().toLowerCase().includes('left div list'));

    const irLeftHeadingCell = cells.find((c) => c.textContent.trim().toLowerCase().includes('investor relations heading'));
    const irLeftDescCell = cells.find((c) => c.textContent.trim().toLowerCase().includes('investor relations description'));
    const irLeftListCell = cells.find((c) => c.textContent.trim().toLowerCase().includes('investor relations list'));

    const newsroomHeadingCell = cells.find((c) => c.textContent.trim().toLowerCase().includes('newsroom heading'));
    const latestPressReleasesCell = cells.find((c) => c.textContent.trim().toLowerCase().includes('latest press releases'));

    const careerHeadingCell = cells.find((c) => c.textContent.trim().toLowerCase().includes('career heading'));
    const careerDescCell = cells.find((c) => c.textContent.trim().toLowerCase().includes('career description'));
    const careerSubdescCell = cells.find((c) => c.textContent.trim().toLowerCase().includes('career subdescription'));

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.setAttribute('data-once', 'nav-close-search');

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    if (linkCell && linkCell.querySelector('a')) {
      anchor.href = linkCell.querySelector('a').href;
    }
    if (labelCell) {
      anchor.textContent = labelCell.textContent;
    }
    li.append(anchor);

    if (iconCell && iconCell.querySelector('picture')) {
      const img = iconCell.querySelector('img');
      const span = document.createElement('span');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      span.append(optimizedPic);
      li.append(span);
    }

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    megaMenu.append(megaMenuWrap);
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.append(centerDiv);

    // Left Div content
    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');

    if (leftDivHeadingCell && leftDivHeadingCell.textContent.trim()) {
      const h4 = document.createElement('h4');
      h4.classList.add('left-div-heading');
      const h4Link = document.createElement('a');
      h4Link.textContent = leftDivHeadingCell.textContent.replace('Left Div Heading', '').trim(); // Remove field name
      h4.append(h4Link);
      leftDiv.append(h4);
    }

    if (leftDivDescCell && leftDivDescCell.textContent.trim()) {
      const p = document.createElement('p');
      p.classList.add('left-div-desc');
      p.textContent = leftDivDescCell.textContent.replace('Left Div Description', '').trim(); // Remove field name
      leftDiv.append(p);
    }

    if (leftDivSubdescCell && leftDivSubdescCell.textContent.trim()) {
      const p = document.createElement('p');
      p.classList.add('left-div-subdesc');
      p.textContent = leftDivSubdescCell.textContent.replace('Left Div Subdescription', '').trim(); // Remove field name
      leftDiv.append(p);
    }

    if (leftDivListCell && leftDivListCell.innerHTML.trim()) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = leftDivListCell.innerHTML;
      tempDiv.querySelectorAll('li').forEach((item) => item.classList.add('list-text-red'));
      moveInstrumentation(leftDivListCell, tempDiv);
      while (tempDiv.firstChild) {
        leftDiv.append(tempDiv.firstChild);
      }
    }

    if (irLeftHeadingCell && irLeftHeadingCell.textContent.trim()) {
      leftDiv.classList.add('ir-left-div');
      const h4 = document.createElement('h4');
      h4.classList.add('left-div-heading');
      const h4Link = document.createElement('a');
      h4Link.textContent = irLeftHeadingCell.textContent.replace('Investor Relations Heading', '').trim(); // Remove field name
      h4.append(h4Link);
      leftDiv.append(h4);
    }

    if (irLeftDescCell && irLeftDescCell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = irLeftDescCell.textContent.replace('Investor Relations Description', '').trim(); // Remove field name
      leftDiv.append(p);
    }

    if (irLeftListCell && irLeftListCell.innerHTML.trim()) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = irLeftListCell.innerHTML;
      tempDiv.querySelectorAll('li').forEach((item) => item.classList.add('list-text-red'));
      moveInstrumentation(irLeftListCell, tempDiv);
      while (tempDiv.firstChild) {
        leftDiv.append(tempDiv.firstChild);
      }
    }

    if (newsroomHeadingCell && newsroomHeadingCell.textContent.trim()) {
      leftDiv.classList.add('newsroom-left-div');
      const h4 = document.createElement('h4');
      h4.classList.add('left-div-heading');
      const h4Link = document.createElement('a');
      h4Link.textContent = newsroomHeadingCell.textContent.replace('Newsroom Heading', '').trim(); // Remove field name
      h4.append(h4Link);
      leftDiv.append(h4);
    }

    if (latestPressReleasesCell && latestPressReleasesCell.innerHTML.trim()) {
      const latestPressDiv = document.createElement('div');
      latestPressDiv.classList.add('latest-two-press-release');
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = latestPressReleasesCell.innerHTML;
      moveInstrumentation(latestPressReleasesCell, tempDiv);
      while (tempDiv.firstChild) {
        latestPressDiv.append(tempDiv.firstChild);
      }
      leftDiv.append(latestPressDiv);
    }

    if (careerHeadingCell && careerHeadingCell.textContent.trim()) {
      leftDiv.classList.add('career-left-div');
      const h4 = document.createElement('h4');
      h4.classList.add('left-div-heading');
      const h4Link = document.createElement('a');
      h4Link.textContent = careerHeadingCell.textContent.replace('Career Heading', '').trim(); // Remove field name
      h4.append(h4Link);
      leftDiv.append(h4);
    }

    if (careerDescCell && careerDescCell.textContent.trim()) {
      const p = document.createElement('p');
      p.classList.add('left-div-desc');
      p.textContent = careerDescCell.textContent.replace('Career Description', '').trim(); // Remove field name
      leftDiv.append(p);
    }

    if (careerSubdescCell && careerSubdescCell.textContent.trim()) {
      const p = document.createElement('p');
      p.classList.add('left-div-subdesc');
      p.textContent = careerSubdescCell.textContent.replace('Career Subdescription', '').trim(); // Remove field name
      leftDiv.append(p);
    }

    centerDiv.append(leftDiv);

    // Sub-navigation wrap
    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');

    if (hierarchyTreeCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;

      tempDiv.querySelectorAll('a').forEach((link) => {
        if (!link.closest('ul ul')) { // Top-level links
          link.closest('li').classList.add('top-level-li');
          const span = document.createElement('span');
          const img = document.createElement('img');
          img.alt = 'svg file';
          img.src = '/icons/chev-down.svg'; // Placeholder, replace if icon is from model
          span.append(img);
          link.after(span);
        } else if (link.closest('ul ul') && !link.closest('ul ul ul')) { // First-level sub-links
          link.closest('li').classList.add('first-level-li');
          const span = document.createElement('span');
          const img = document.createElement('img');
          img.alt = 'svg file';
          img.src = '/icons/chev-down.svg'; // Placeholder, replace if icon is from model
          span.append(img);
          link.after(span);
        }
      });

      tempDiv.querySelectorAll('li').forEach((item) => {
        if (item.querySelector('ul')) {
          item.classList.add('has-sub-child');
          const subUl = item.querySelector('ul');
          const subDiv = document.createElement('div');
          subDiv.classList.add('has-inner-sub-child');
          moveInstrumentation(subUl, subDiv);
          while (subUl.firstChild) {
            subDiv.append(subUl.firstChild);
          }
          subUl.replaceWith(subDiv);
        }
      });

      if (labelCell && labelCell.textContent.includes('Who We Are')) {
        subNavWrap.classList.add('about-us-sub-nav');
      } else if (labelCell && labelCell.textContent.includes('What we do')) {
        subNavWrap.classList.add('what-we-do');
      } else if (labelCell && labelCell.textContent.includes('Investor Relations')) {
        subNavWrap.classList.add('element-block');
        const ulOneLink = document.createElement('ul');
        ulOneLink.classList.add('sub-nav-wrap-one-link');
        const liOneLink = document.createElement('li');
        const aOneLink = document.createElement('a');
        aOneLink.href = 'https://www.mahindra.com/sites/default/files/2025-04/Disclosures-under-Reg-46-62-MM-URLs_PDF.pdf';
        aOneLink.target = '_blank';
        aOneLink.textContent = 'Disclosures Under Regulation 46 And 62 Of SEBI (LODR)';
        liOneLink.append(aOneLink);
        ulOneLink.append(liOneLink);
        subNavWrap.append(ulOneLink);

        const innerSubNavWrapList = document.createElement('div');
        innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');
        const ul1 = document.createElement('ul');
        const ul2 = document.createElement('ul');

        const allLis = [...tempDiv.querySelectorAll('li')];
        allLis.slice(0, Math.ceil(allLis.length / 2)).forEach((item) => ul1.append(item));
        allLis.slice(Math.ceil(allLis.length / 2)).forEach((item) => ul2.append(item));

        innerSubNavWrapList.append(ul1, ul2);
        subNavWrap.append(innerSubNavWrapList);
      } else if (labelCell && labelCell.textContent.includes('careers')) {
        subNavWrap.classList.add('careers-div');
        moveInstrumentation(hierarchyTreeCell, tempDiv);
        while (tempDiv.firstChild) {
          subNavWrap.append(tempDiv.firstChild);
        }
      } else {
        moveInstrumentation(hierarchyTreeCell, tempDiv);
        while (tempDiv.firstChild) {
          subNavWrap.append(tempDiv.firstChild);
        }
      }
    }
    centerDiv.append(subNavWrap);
    li.append(megaMenu);
    navUl.append(li);
    moveInstrumentation(row, li);
  });

  // Icon Navigation (Mobile)
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconNavUl = document.createElement('ul');
  mobileIconNav.append(mobileIconNavUl);
  navUl.append(mobileIconNav);

  iconNavItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find((c) => c.querySelector('picture'));
    const linkCell = cells.find((c) => c.querySelector('a'));
    const labelCell = cells.find((c) => !c.querySelector('picture') && !c.querySelector('a') && !c.querySelector('ul'));
    const hierarchyTreeCell = cells.find((c) => c.querySelector('ul'));

    const li = document.createElement('li');
    const anchor = document.createElement('a');
    if (linkCell && linkCell.querySelector('a')) {
      anchor.href = linkCell.querySelector('a').href;
    }

    if (iconCell && iconCell.querySelector('picture')) {
      const img = iconCell.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      anchor.append(optimizedPic);
    }
    if (labelCell) {
      anchor.append(document.createTextNode(` ${labelCell.textContent}`));
    }
    li.append(anchor);

    if (hierarchyTreeCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      tempDiv.querySelectorAll('a').forEach((link) => {
        // No specific class for nav-menu-link in ORIGINAL HTML for icon-nav-item
        // link.classList.add('nav-menu-link');
      });
      tempDiv.querySelectorAll('li').forEach((item) => {
        // No specific class for nav-menu-item in ORIGINAL HTML for icon-nav-item
        // item.classList.add('nav-menu-item');
      });
      tempDiv.querySelectorAll('ul').forEach((ul) => {
        // No specific class for nav-submenu in ORIGINAL HTML for icon-nav-item
        // ul.classList.add('nav-submenu');
      });
      moveInstrumentation(hierarchyTreeCell, tempDiv);
      while (tempDiv.firstChild) {
        li.append(tempDiv.firstChild);
      }
    }

    mobileIconNavUl.append(li);
    moveInstrumentation(row, li);
  });

  // Icon Navigation (Desktop)
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconNavUl = document.createElement('ul');
  desktopIconNav.append(desktopIconNavUl);
  nav.append(desktopIconNav);

  iconNavItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find((c) => c.querySelector('picture'));
    const linkCell = cells.find((c) => c.querySelector('a'));
    const labelCell = cells.find((c) => !c.querySelector('picture') && !c.querySelector('a') && !c.querySelector('ul'));
    const hierarchyTreeCell = cells.find((c) => c.querySelector('ul'));

    const li = document.createElement('li');
    const anchor = document.createElement('a');
    if (linkCell && linkCell.querySelector('a')) {
      anchor.href = linkCell.querySelector('a').href;
    }

    if (iconCell && iconCell.querySelector('picture')) {
      const img = iconCell.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      anchor.append(optimizedPic);
    }
    if (labelCell) {
      anchor.append(document.createTextNode(` ${labelCell.textContent}`));
    }
    li.append(anchor);

    if (hierarchyTreeCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      tempDiv.querySelectorAll('a').forEach((link) => {
        // No specific class for nav-menu-link in ORIGINAL HTML for icon-nav-item
        // link.classList.add('nav-menu-link');
      });
      tempDiv.querySelectorAll('li').forEach((item) => {
        // No specific class for nav-menu-item in ORIGINAL HTML for icon-nav-item
        // item.classList.add('nav-menu-item');
      });
      tempDiv.querySelectorAll('ul').forEach((ul) => {
        // No specific class for nav-submenu in ORIGINAL HTML for icon-nav-item
        // ul.classList.add('nav-submenu');
      });
      moveInstrumentation(hierarchyTreeCell, tempDiv);
      while (tempDiv.firstChild) {
        li.append(tempDiv.firstChild);
      }
    }

    desktopIconNavUl.append(li);
    moveInstrumentation(row, li);
  });

  // 80 Year Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoLink = document.createElement('a');
  const year80LogoLinkEl = year80LogoLinkRow.querySelector('a');
  if (year80LogoLinkEl) {
    year80LogoLink.href = year80LogoLinkEl.href;
  }
  const year80LogoPicture = year80LogoRow.querySelector('picture');
  if (year80LogoPicture) {
    const img = year80LogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    year80LogoLink.append(optimizedPic);
  }
  moveInstrumentation(year80LogoRow, year80LogoDiv);
  moveInstrumentation(year80LogoLinkRow, year80LogoLink);
  year80LogoDiv.append(year80LogoLink);
  wrap.append(year80LogoDiv);

  block.append(header);

  // Add event listener for hamburger menu
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('close');
  });

  // Add event listeners for mega menu toggling on desktop
  navUl.querySelectorAll('.has-child').forEach((menuItem) => {
    menuItem.addEventListener('mouseenter', () => {
      menuItem.classList.add('active');
    });
    menuItem.addEventListener('mouseleave', () => {
      menuItem.classList.remove('active');
    });
  });

  // Add event listeners for sub-menu toggling on mobile
  navUl.querySelectorAll('.has-sub-child > span').forEach((span) => {
    span.addEventListener('click', () => {
      span.closest('.has-sub-child').classList.toggle('active');
    });
  });

  // Add event listeners for search toggle
  const searchToggleElements = document.querySelectorAll('[data-once*="search-toggle"]');
  searchToggleElements.forEach((searchToggle) => {
    searchToggle.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation(); // Stop propagation to prevent immediate closing
      const searchScreenWrap = searchToggle.closest('li').querySelector('.search-screen-wrap');
      if (searchScreenWrap) {
        searchScreenWrap.classList.toggle('active');
        searchToggle.closest('li').classList.toggle('active'); // Toggle active class on parent li
      }
    });
  });

  // Close search when clicking outside
  document.addEventListener('click', (event) => {
    const searchScreenWrap = document.querySelector('.search-screen-wrap');
    const searchToggle = document.querySelector('[data-once*="search-toggle"]');
    if (searchScreenWrap && searchToggle && !searchScreenWrap.contains(event.target) && !searchToggle.contains(event.target)) {
      searchScreenWrap.classList.remove('active');
      searchToggle.closest('li').classList.remove('active');
    }
  });

  // Add event listeners for sub-child toggling (for desktop mega menu hierarchy)
  navUl.querySelectorAll('.top-level-li > span, .first-level-li > span').forEach((span) => {
    span.addEventListener('click', () => {
      span.closest('li').classList.toggle('active');
    });
  });
}
