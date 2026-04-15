import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  header.setAttribute('data-once', 'header-hover');

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  const [
    logoRow,
    logoLinkRow,
    anniversaryLogoRow,
    anniversaryLogoLinkRow,
    ...itemRows
  ] = [...block.children];

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  const logoHref = logoLinkRow.querySelector('a')?.href || '#';
  logoLink.href = logoHref;
  moveInstrumentation(logoLinkRow, logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
    optimizedPic.querySelector('img').classList.add('hiddenlogo1');
  }
  moveInstrumentation(logoRow, logoLink);
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

  // Main Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);
  wrap.append(nav);

  const navigationItems = itemRows.filter((row) => row.children.length === 7);
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4);
  const contactLinkItems = itemRows.filter((row) => row.children.length === 3);
  const searchItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('picture'));
  // const logoItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('picture')); // This filter is not used in the provided JS

  navigationItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find((c) => !c.querySelector('a') && !c.querySelector('picture') && !c.querySelector('ul'));
    const linkCell = cells.find((c) => c.querySelector('a') && !c.querySelector('ul'));
    const iconCell = cells.find((c) => c.querySelector('picture'));
    const hierarchyCell = cells.find((c) => c.querySelector('ul'));
    // Use content detection for heading, desc, subdesc cells
    const headingCell = cells.find((c) => c.textContent.trim() && !c.querySelector('a') && !c.querySelector('picture') && !c.querySelector('ul') && c !== labelCell);
    const descCell = cells.find((c) => c.textContent.trim() && !c.querySelector('a') && !c.querySelector('picture') && !c.querySelector('ul') && c !== labelCell && c !== headingCell);
    const subDescCell = cells.find((c) => c.textContent.trim() && !c.querySelector('a') && !c.querySelector('picture') && !c.querySelector('ul') && c !== labelCell && c !== headingCell && c !== descCell);

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.setAttribute('data-once', 'nav-close-search');
    moveInstrumentation(row, li);

    const a = document.createElement('a');
    a.setAttribute('itemprop', 'url');
    a.href = linkCell?.querySelector('a')?.href || '#';
    a.textContent = labelCell?.textContent || '';
    if (linkCell) moveInstrumentation(linkCell, a);
    if (labelCell) moveInstrumentation(labelCell, a);
    li.append(a);

    if (iconCell) {
      const iconSpan = document.createElement('span');
      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        iconSpan.append(optimizedPic);
      }
      moveInstrumentation(iconCell, iconSpan);
      li.append(iconSpan);
    }

    if (hierarchyCell) {
      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu');
      const megaMenuWrapContainer = document.createElement('div');
      megaMenuWrapContainer.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');
      const leftDiv = document.createElement('div');
      leftDiv.classList.add('left-div');

      if (headingCell?.textContent) {
        const heading = document.createElement('h4');
        heading.classList.add('left-div-heading');
        const headingLink = document.createElement('a');
        headingLink.textContent = headingCell.textContent;
        heading.append(headingLink);
        moveInstrumentation(headingCell, heading);
        leftDiv.append(heading);
      }
      if (descCell?.textContent) {
        const desc = document.createElement('p');
        desc.classList.add('left-div-desc');
        desc.textContent = descCell.textContent;
        moveInstrumentation(descCell, desc);
        leftDiv.append(desc);
      }
      if (subDescCell?.textContent) {
        const subDesc = document.createElement('p');
        subDesc.classList.add('left-div-subdesc');
        subDesc.textContent = subDescCell.textContent;
        moveInstrumentation(subDescCell, subDesc);
        leftDiv.append(subDesc);
      }

      centerDiv.append(leftDiv);

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');
      if (labelCell?.textContent.toLowerCase().includes('who we are')) {
        subNavWrap.classList.add('about-us-sub-nav');
      } else if (labelCell?.textContent.toLowerCase().includes('what we do')) {
        subNavWrap.classList.add('what-we-do');
      } else if (labelCell?.textContent.toLowerCase().includes('investor relations')) {
        leftDiv.classList.add('ir-left-div');
        subNavWrap.classList.add('element-block');
      } else if (labelCell?.textContent.toLowerCase().includes('newsroom')) {
        leftDiv.classList.add('newsroom-left-div');
        const latestPressReleaseDiv = document.createElement('div');
        latestPressReleaseDiv.classList.add('latest-two-press-release');
        pressReleaseItems.forEach((prRow) => {
          const prCells = [...prRow.children];
          const prLinkCell = prCells.find((c) => c.querySelector('a'));
          const prTitleCell = prCells.find((c) => prCells.indexOf(c) === 1); // Corrected index access
          const prDateCell = prCells.find((c) => prCells.indexOf(c) === 2); // Corrected index access
          const prCategoryCell = prCells.find((c) => prCells.indexOf(c) === 3); // Corrected index access

          const slideDiv = document.createElement('div');
          slideDiv.classList.add('slides');
          const slideWrap = document.createElement('div');
          slideWrap.classList.add('wrap');
          const contentDiv = document.createElement('div');
          contentDiv.classList.add('content');
          const descDiv = document.createElement('div');
          descDiv.classList.add('desc');

          if (prTitleCell?.textContent) {
            const p = document.createElement('p');
            const prLink = document.createElement('a');
            prLink.href = prLinkCell?.querySelector('a')?.href || '#';
            prLink.textContent = prTitleCell.textContent;
            prLink.setAttribute('hreflang', 'en');
            moveInstrumentation(prLinkCell, prLink);
            moveInstrumentation(prTitleCell, p);
            p.append(prLink);
            descDiv.append(p);
          }

          if (prDateCell?.textContent || prCategoryCell?.textContent) {
            const dateDiv = document.createElement('div');
            dateDiv.classList.add('date');
            const dateEm = document.createElement('em');
            dateEm.textContent = prDateCell?.textContent || '';
            moveInstrumentation(prDateCell, dateEm);
            dateDiv.append(dateEm);

            if (prCategoryCell?.textContent) {
              const categoryEm = document.createElement('em');
              categoryEm.textContent = prCategoryCell.textContent;
              moveInstrumentation(prCategoryCell, categoryEm);
              dateDiv.append(categoryEm);
            }
            descDiv.append(dateDiv);
          }

          contentDiv.append(descDiv);
          slideWrap.append(contentDiv);
          slideDiv.append(slideWrap);
          latestPressReleaseDiv.append(slideDiv);
        });
        leftDiv.append(latestPressReleaseDiv);
      } else if (labelCell?.textContent.toLowerCase().includes('careers')) {
        leftDiv.classList.add('career-left-div');
        subNavWrap.classList.add('careers-div');
      }

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv);

      tempDiv.querySelectorAll('a').forEach((link) => {
        // Original HTML uses no specific class for <a> directly within <ul><li>, but if it did, it would be added here.
        // For now, no specific class is added to 'a' based on the provided HTML.
        // If the original HTML had a class like 'nav-link' on these <a> elements, it would be added here.
        // Example: link.classList.add('nav-link');
      });
      tempDiv.querySelectorAll('li').forEach((liElement) => {
        // Original HTML uses 'top-level-li', 'first-level-li', etc.
        // The generated JS was adding 'nav-menu-item' which is not in the allowlist.
        // Based on the example, specific classes like 'top-level-li' or 'first-level-li' are context-dependent.
        // For generic list items in the hierarchy, no specific class is added unless explicitly defined in original HTML.
        // If the original HTML had a class like 'nav-menu-item' on these <li> elements, it would be added here.
        // Example: liElement.classList.add('nav-menu-item');
      });
      tempDiv.querySelectorAll('ul').forEach((ulElement) => {
        // Original HTML uses no specific class for <ul> directly within the hierarchy.
        // The generated JS was adding 'nav-submenu' which is not in the allowlist.
        // If the original HTML had a class like 'nav-submenu' on these <ul> elements, it would be added here.
        // Example: ulElement.classList.add('nav-submenu');
      });

      while (tempDiv.firstChild) {
        subNavWrap.append(tempDiv.firstChild);
      }
      centerDiv.append(subNavWrap);
      megaMenuWrapContainer.append(centerDiv);
      megaMenu.append(megaMenuWrapContainer);
      li.append(megaMenu);
    }
    navUl.append(li);
  });

  // Icon Nav (Mobile and Desktop)
  const createIconNav = (isMobile) => {
    const iconNavDiv = document.createElement('div');
    iconNavDiv.classList.add('icon-nav');
    if (isMobile) {
      iconNavDiv.classList.add('mobile-menus-icon');
    } else {
      iconNavDiv.classList.add('desktop-menus-icon');
    }
    const iconNavUl = document.createElement('ul');
    iconNavDiv.append(iconNavUl);

    // Contact Us Link
    contactLinkItems.forEach((row) => {
      const cells = [...row.children];
      const iconCell = cells.find((c) => c.querySelector('picture'));
      const linkCell = cells.find((c) => c.querySelector('a'));
      const labelCell = cells.find((c) => !c.querySelector('a') && !c.querySelector('picture'));

      const li = document.createElement('li');
      li.classList.add('mail');
      const link = document.createElement('a');
      link.href = linkCell?.querySelector('a')?.href || '#';
      if (iconCell) {
        const iconPicture = iconCell.querySelector('picture');
        if (iconPicture) {
          const img = iconPicture.querySelector('img');
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          link.append(optimizedPic);
        }
        moveInstrumentation(iconCell, link);
      }
      if (labelCell?.textContent) {
        link.append(document.createTextNode(labelCell.textContent));
      }
      moveInstrumentation(linkCell, link);
      moveInstrumentation(labelCell, link);
      li.append(link);
      iconNavUl.append(li);
    });

    // Search
    searchItems.forEach((row) => {
      const cells = [...row.children];
      const iconCell = cells.find((c) => c.querySelector('picture'));
      const labelCell = cells.find((c) => !c.querySelector('a') && !c.querySelector('picture'));

      const li = document.createElement('li');
      li.classList.add('search');
      li.setAttribute('data-once', 'search-toggle search-stop-propagation');
      const searchLink = document.createElement('a');
      searchLink.href = '#';
      searchLink.setAttribute('data-once', 'search-stop-propagation');

      if (iconCell) {
        const iconPicture = iconCell.querySelector('picture');
        if (iconPicture) {
          const img = iconPicture.querySelector('img');
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          searchLink.append(optimizedPic);
          // Add second search icon for original HTML structure
          const secondImg = img.cloneNode(true);
          const secondOptimizedPic = createOptimizedPicture(secondImg.src, secondImg.alt, false, [{ width: '24' }]);
          moveInstrumentation(secondImg, secondOptimizedPic.querySelector('img'));
          searchLink.append(secondOptimizedPic);
        }
        moveInstrumentation(iconCell, searchLink);
      }

      if (labelCell?.textContent) {
        const span = document.createElement('span');
        span.setAttribute('data-once', 'search-stop-propagation');
        span.textContent = ` ${labelCell.textContent}`;
        searchLink.append(span);
      }
      moveInstrumentation(labelCell, searchLink);
      li.append(searchLink);

      const searchScreenWrap = document.createElement('div');
      searchScreenWrap.classList.add('search-screen-wrap');
      searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
      const searchWrapInner = document.createElement('div');
      searchWrapInner.classList.add('wrap');
      searchWrapInner.setAttribute('data-once', 'search-stop-propagation');
      searchScreenWrap.append(searchWrapInner);

      const searchForm = document.createElement('form');
      searchForm.action = 'https://www.mahindra.com/search'; // Example action
      searchForm.method = 'get';
      searchForm.id = 'search-block-form';
      searchForm.setAttribute('accept-charset', 'UTF-8');
      searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
      searchForm.setAttribute('data-once', 'search-stop-propagation');
      searchWrapInner.append(searchForm);

      const searchInputWrap = document.createElement('div');
      searchInputWrap.classList.add('search-wrap');
      searchInputWrap.setAttribute('data-once', 'search-stop-propagation');
      searchForm.append(searchInputWrap);

      const searchIconDiv = document.createElement('div');
      searchIconDiv.classList.add('search-icon');
      searchIconDiv.setAttribute('data-once', 'search-stop-propagation');
      const searchIconImg = document.createElement('img');
      searchIconImg.alt = 'svg file';
      searchIconImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107769.svg+xml'; // Example path
      searchIconDiv.append(searchIconImg);
      searchInputWrap.append(searchIconDiv);

      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.classList.add('input-text', 'searchtext');
      searchInput.required = true;
      searchInput.name = 'key';
      searchInput.id = 'searchInput';
      searchInput.autocomplete = 'off';
      searchInput.setAttribute('data-once', 'search-stop-propagation');
      searchInputWrap.append(searchInput);

      const submitButton = document.createElement('button');
      submitButton.classList.add('submit-button');
      submitButton.setAttribute('data-once', 'search-stop-propagation');
      const submitLabel = document.createElement('div');
      submitLabel.classList.add('label');
      submitLabel.setAttribute('data-once', 'search-stop-propagation');
      submitLabel.textContent = ' Submit ';
      submitButton.append(submitLabel);
      const submitImg = document.createElement('img');
      submitImg.alt = 'svg file';
      submitImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107812.svg+xml'; // Example path
      submitButton.append(submitImg);
      searchInputWrap.append(submitButton);

      li.append(searchScreenWrap);
      iconNavUl.append(li);

      // Search toggle functionality
      searchLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent immediate closing
        searchScreenWrap.classList.toggle('show');
      });

      // Close search when clicking outside
      searchScreenWrap.addEventListener('click', (e) => {
        if (e.target === searchScreenWrap) {
          searchScreenWrap.classList.remove('show');
        }
      });
      searchWrapInner.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent clicks inside from closing
      });
    });

    return iconNavDiv;
  };

  navUl.append(createIconNav(true)); // Mobile icon nav

  // Anniversary Logo
  const anniversaryLogoDiv = document.createElement('div');
  anniversaryLogoDiv.classList.add('logo', 'year-80-logo');
  const anniversaryLogoLink = document.createElement('a');
  const anniversaryLogoHref = anniversaryLogoLinkRow.querySelector('a')?.href || '#';
  anniversaryLogoLink.href = anniversaryLogoHref;
  moveInstrumentation(anniversaryLogoLinkRow, anniversaryLogoLink);

  const anniversaryLogoPicture = anniversaryLogoRow.querySelector('picture');
  if (anniversaryLogoPicture) {
    const img = anniversaryLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    anniversaryLogoLink.append(optimizedPic);
    optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
  }
  moveInstrumentation(anniversaryLogoRow, anniversaryLogoLink);
  anniversaryLogoDiv.append(anniversaryLogoLink);
  wrap.append(anniversaryLogoDiv);

  // Desktop Icon Nav (after main nav, before anniversary logo for structure)
  wrap.append(createIconNav(false));

  block.textContent = '';
  block.append(header);

  // Image optimization for all pictures in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Hamburger menu toggle
  const hamburger = block.querySelector('.hamburger');
  const mainNav = block.querySelector('.main-nav');
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }

  // Mega menu hover functionality
  block.querySelectorAll('.main-nav > ul > li.has-child').forEach((li) => {
    li.addEventListener('mouseenter', () => {
      li.classList.add('active');
    });
    li.addEventListener('mouseleave', () => {
      li.classList.remove('active');
    });
  });
}
