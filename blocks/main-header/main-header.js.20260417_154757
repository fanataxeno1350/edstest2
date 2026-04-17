import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [
    primaryLogoRow,
    primaryLogoLinkRow,
    anniversaryLogoRow,
    anniversaryLogoLinkRow,
    ...itemRows
  ] = children;

  block.innerHTML = '';
  block.classList.add('main-header', 'with-marquee', 'solid'); // 'nav-up' is a scroll-state class, do not add initially

  const container = document.createElement('div');
  container.classList.add('container');
  block.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Logo section
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  wrap.append(logoDiv);

  const primaryLogoLink = document.createElement('a');
  primaryLogoLink.href = primaryLogoLinkRow?.querySelector('a')?.href || '#';
  moveInstrumentation(primaryLogoLinkRow, primaryLogoLink);

  const primaryLogoPicture = primaryLogoRow?.querySelector('picture');
  if (primaryLogoPicture) {
    const img = primaryLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    primaryLogoLink.append(optimizedPic);
  }
  primaryLogoLink.classList.add('hiddenlogo1');
  logoDiv.append(primaryLogoLink);
  moveInstrumentation(primaryLogoRow, primaryLogoLink);

  // Hamburger menu
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  const ulHamburger = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    ulHamburger.append(document.createElement('li'));
  }
  hamburger.append(ulHamburger);
  wrap.append(hamburger);

  // Navigation menu
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  wrap.append(nav);

  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);

  const navigationItems = itemRows.filter((row) => row.children.length === 7);
  const iconLinkItems = itemRows.filter((row) => row.children.length === 3);
  const searchItems = itemRows.filter((row) => row.children.length === 5);
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4);

  function transformNestedLists(rootUl) {
    rootUl.querySelectorAll('li').forEach((li) => {
      const nested = li.querySelector(':scope > ul');
      const anchor = li.querySelector(':scope > a');

      // Apply classes from ORIGINAL HTML to <li> and <a> elements
      li.classList.add('top-level-li'); // Example class from ORIGINAL HTML
      if (anchor) {
        anchor.classList.add('first-level-li'); // Example class from ORIGINAL HTML
      }

      // Handle label-only nodes (no <a>)
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
        subWrap.classList.add('has-sub-child'); // Class from ORIGINAL HTML
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
        transformNestedLists(nested); // Recursively transform nested lists
      }
    });
  }

  navigationItems.forEach((row) => {
    const [labelCell, linkCell, iconCell, hierarchyCell, headingCell, descriptionCell, subDescriptionCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    } else {
      anchor.href = '#';
    }
    anchor.setAttribute('itemprop', 'url');
    anchor.textContent = labelCell?.textContent.trim() || '';
    li.append(anchor);

    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const span = document.createElement('span');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '20' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      span.append(optimizedPic);
      li.append(span);
    }

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    li.append(megaMenu);

    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    megaMenu.append(megaMenuWrap);

    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.append(centerDiv);

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    centerDiv.append(leftDiv);

    const heading = document.createElement('h4');
    heading.classList.add('left-div-heading');
    const headingAnchor = document.createElement('a');
    headingAnchor.textContent = headingCell?.textContent.trim() || '';
    leftDiv.append(headingAnchor);

    const description = document.createElement('p');
    description.classList.add('left-div-desc');
    description.textContent = descriptionCell?.textContent.trim() || '';
    leftDiv.append(description);

    const subDescription = document.createElement('p');
    subDescription.classList.add('left-div-subdesc');
    subDescription.textContent = subDescriptionCell?.textContent.trim() || '';
    leftDiv.append(subDescription);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap', 'about-us-sub-nav');
    centerDiv.append(subNavWrap);

    // Handle hierarchy-tree richtext field
    if (hierarchyCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML; // Use innerHTML to preserve structure
      moveInstrumentation(hierarchyCell, tempDiv);

      // Apply classes from ORIGINAL HTML to nested elements
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('sub-nav-wrap-one-link')); // Example class
      tempDiv.querySelectorAll('li').forEach(li => li.classList.add('top-level-li')); // Example class
      tempDiv.querySelectorAll('li > a').forEach(a => a.classList.add('first-level-li')); // Example class

      while (tempDiv.firstChild) {
        subNavWrap.append(tempDiv.firstChild);
      }
      // The transformNestedLists function is designed for a specific nested structure
      // and might need adjustments based on the actual hierarchy-tree content.
      // For now, applying it to the direct children of subNavWrap if they are ULs.
      subNavWrap.querySelectorAll('ul').forEach(ul => transformNestedLists(ul));
    }

    navUl.append(li);

    li.addEventListener('mouseenter', () => {
      li.classList.add('active');
    });

    li.addEventListener('mouseleave', () => {
      li.classList.remove('active');
    });
  });

  // Icon Navigation for Mobile
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconUl = document.createElement('ul');
  mobileIconNav.append(mobileIconUl);
  navUl.append(mobileIconNav);

  iconLinkItems.forEach((row) => {
    const [iconCell, linkCell, labelCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add(labelCell?.textContent.trim().toLowerCase() || ''); // e.g., 'mail' or 'search'
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    } else {
      anchor.href = '#';
    }
    anchor.textContent = labelCell?.textContent.trim() || '';
    li.append(anchor);

    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '20' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      anchor.prepend(optimizedPic);
    }
    mobileIconUl.append(li);
  });

  // Search item for mobile
  searchItems.forEach((row) => {
    const [searchActionUrlCell, placeholderTextCell, submitLabelCell, popularKeywordsCell, recommendedKeywordsCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('search');
    moveInstrumentation(row, li);

    const searchTrigger = document.createElement('a');
    searchTrigger.href = '#';
    li.append(searchTrigger);

    const searchIconPic = document.createElement('picture');
    searchIconPic.innerHTML = `<img alt="svg file" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktc2VhcmNoIiB2aWV3Qm94PSIwIDAgMTYgMTYiPgogIDxwYXRoIGQ9Ik0xMS43NDIgMTAuMzQ0Yy0uNzQtLjctMS43NC0xLjEyMi0yLjg0Mi0xLjEyMkExLjI1IDEuMjUgMCAwIDAgNi42MjUgMTBhMS4yNSAx.y5IDAgMCAwLTEuMjUgMS4yNWMwIDEuMTAyLjQyMiAyLjEwMiAxLjEyMiAyLjg0Mi43LjczOSAxLjcwMiAxLjEyMiAyLjg0MiAxLjEyMiAxLjE0IDAgMi4xNDItLjM4MyAyLjg0Mi0xLjEyMi43LS43LjEwMi0xLjcwMi4xMDItMi44NDIgMCAxLjE0LS40MjIgMi4xNDItMS4xMjIgMi44NDJaIi8+CiAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTQgNi41QzE0IDkuNTM4IDExLjUzOCAxMiA4IDEycy02LTIuNDYyLTYtNiAwLTYgNi02IDYgMi40NjIgNiA2LjVaTTEwLjU2MSA5LjQzOWExLjUgMS41IDAgMCAwLTEuMDYxLS40MTRjLS4zOTggMC0uNzg2LjE1OS0xLjA2MS40MTRhMS41IDEuNSAwIDAgMC0uNDEzIDEuMDYxYy4wMDEuMzk4LjE1OS43ODYuNDE0IDEuMDYxYTEuNSAxLjUgMCAwIDAgMS4wNjEuNDE0Yy4zOTggMCAuNzg2LS4xNTkgMS4wNjEtLjQxNGExLjUgMS41IDAgMCAwIC40MTMtMS4wNjFjLS4wMDEtLjM5OC0uMTU5LS43ODYtLjQxNC0xLjA2MVoiLz4KPC9zdmc+">`;
    searchTrigger.append(searchIconPic);
    const searchSpan = document.createElement('span');
    searchSpan.textContent = ' Search';
    searchTrigger.append(searchSpan);

    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    li.append(searchScreenWrap);

    const searchWrapInner = document.createElement('div');
    searchWrapInner.classList.add('wrap');
    searchScreenWrap.append(searchWrapInner);

    const searchForm = document.createElement('form');
    searchForm.action = searchActionUrlCell?.querySelector('a')?.href || '#';
    searchForm.method = 'get';
    searchForm.id = 'search-block-form';
    searchForm.setAttribute('accept-charset', 'UTF-8');
    searchWrapInner.append(searchForm);

    const searchInputWrap = document.createElement('div');
    searchInputWrap.classList.add('search-wrap');
    searchForm.append(searchInputWrap);

    const searchIconDiv = document.createElement('div');
    searchIconDiv.classList.add('search-icon');
    searchIconDiv.innerHTML = `<img alt="svg file" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktc2VhcmNoIiB2aWV3Qm94PSIwIDAgMTYgMTYiPgogIDxwYXRoIGQ9Ik0xMS43NDIgMTAuMzQ0Yy0uNzQtLjctMS43NC0xLjEyMi0yLjg0Mi0xLjEyMkExLjI1IDEuMjUgMCAwIDAgNi42MjUgMTBhMS4yNSAx.y5IDAgMCAwLTEuMjUgMS4yNWMwIDEuMTAyLjQyMiAyLjEwMiAxLjEyMiAyLjg0Mi43LjczOSAxLjcwMiAxLjEyMiAyLjg0MiAxLjEyMiAxLjE0IDAgMi4xNDItLjM4MyAyLjg0Mi0xLjEyMi43LS43LjEwMi0xLjcwMi4xMDItMi44NDIgMCAxLjE0LS40MjIgMi4xNDItMS4xMjIgMi44NDJaIi8+CiAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTQgNi41QzE0IDkuNTM4IDExLjUzOCAxMiA4IDEycy02LTIuNDYyLTYtNiAwLTYgNi02IDYgMi40NjIgNiA2LjVaTTEwLjU2MSA5LjQzOWExLjUgMS41IDAgMCAwLTEuMDYxLS40MTRjLS4zOTggMC0uNzg2LjE1OS0xLjA2MS40MTRhMS41IDEuNSAwIDAgMC0uNDEzIDEuMDYxYy4wMDEuMzk4LjE1OS43ODYuNDE0IDEuMDYxYTEuNSAxLjUgMCAwIDAgMS4wNjEuNDE0Yy4zOTggMCAuNzg2LS4xNTkgMS4wNjEtLjQxNGExLjUgMS41IDAgMCAwIC40MTMtMS4wNjFjLS4wMDEtLjM5OC0uMTU5LS43ODYtLjQxNC0xLjA2MVoiLz4KPC9zdmc+">`;
    searchInputWrap.append(searchIconDiv);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.classList.add('input-text', 'searchtext');
    searchInput.required = true;
    searchInput.name = 'key';
    searchInput.id = 'searchInput';
    searchInput.autocomplete = 'off';
    searchInput.placeholder = placeholderTextCell?.textContent.trim() || '';
    searchInputWrap.append(searchInput);

    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-button');
    const submitLabel = document.createElement('div');
    submitLabel.classList.add('label');
    submitLabel.textContent = submitLabelCell?.textContent.trim() || '';
    submitButton.append(submitLabel);
    submitButton.innerHTML += `<img alt="svg file" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktYXJyb3ctcmlnaHQtYy1maWxsIiB2aWV3Qm94PSIwIDAgMTYgMTYiPgogIDxwYXRoIGQ9Ik0xIDguNWEuNTA1LjUwNSAwIDAgMSAuNTA1LS41aDguNzUzTDUuNzkgMi44NWEuNTA1LjUwNSAwIDAgMSAuNzEzLS43MTNsNS41IDUuNWEuNTA1LjUwNSAwIDAgMSAwIC43MTNsLTUuNSA1LjVhLjUwNS41MDUgMCAwIDEtLjcxMy0uNzEzbDMuNDY4LTMuNTRIMi41MDVBJjUwNS41MDUgMCAwIDEgMS41IDguNVoiLz4KPC9zdmc+">`;
    searchInputWrap.append(submitButton);

    const searchResultBox = document.createElement('div');
    searchResultBox.classList.add('searchResultBox');
    searchResultBox.style.display = 'none'; // Initially hidden
    searchForm.append(searchResultBox);

    const popularKeywordsWrap = document.createElement('div');
    popularKeywordsWrap.classList.add('search-suggestions-wrap');
    const popularLabel = document.createElement('div');
    popularLabel.classList.add('label');
    popularLabel.textContent = 'Popular Keywords:';
    popularKeywordsWrap.append(popularLabel);
    const popularTokensWrap = document.createElement('div');
    popularTokensWrap.classList.add('tokens-wrap');
    popularTokensWrap.innerHTML = popularKeywordsCell?.innerHTML || ''; // Use innerHTML for richtext
    popularKeywordsWrap.append(popularTokensWrap);
    searchWrapInner.append(popularKeywordsWrap);

    const recommendedKeywordsWrap = document.createElement('div');
    recommendedKeywordsWrap.classList.add('search-suggestions-wrap');
    const recommendedLabel = document.createElement('div');
    recommendedLabel.classList.add('label');
    recommendedLabel.textContent = 'Recommended for you:';
    recommendedKeywordsWrap.append(recommendedLabel);
    const recommendedTokensWrap = document.createElement('div');
    recommendedTokensWrap.classList.add('tokens-wrap');
    recommendedTokensWrap.innerHTML = recommendedKeywordsCell?.innerHTML || ''; // Use innerHTML for richtext
    recommendedKeywordsWrap.append(recommendedTokensWrap);
    searchWrapInner.append(recommendedKeywordsWrap);

    searchTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      li.classList.toggle('active');
      searchScreenWrap.classList.toggle('active');
    });

    mobileIconUl.append(li);
  });

  // Icon Navigation for Desktop
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconUl = document.createElement('ul');
  desktopIconNav.append(desktopIconUl);
  nav.append(desktopIconNav);

  iconLinkItems.forEach((row) => {
    const [iconCell, linkCell, labelCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add(labelCell?.textContent.trim().toLowerCase() || '');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    } else {
      anchor.href = '#';
    }
    li.append(anchor);

    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '20' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      anchor.append(optimizedPic);
    }
    desktopIconUl.append(li);
  });

  // Search item for desktop
  searchItems.forEach((row) => {
    const [searchActionUrlCell, placeholderTextCell, submitLabelCell, popularKeywordsCell, recommendedKeywordsCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('search');
    moveInstrumentation(row, li);

    const searchTrigger = document.createElement('a');
    searchTrigger.href = '#';
    li.append(searchTrigger);

    const searchIconPic = document.createElement('picture');
    searchIconPic.innerHTML = `<img alt="svg file" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktc2VhcmNoIiB2aWV3Qm94PSIwIDAgMTYgMTYiPgogIDxwYXRoIGQ9Ik0xMS43NDIgMTAuMzQ0Yy0uNzQtLjctMS43NC0xLjEyMi0yLjg0Mi0xLjEyMkExLjI1IDEuMjUgMCAwIDAgNi42MjUgMTBhMS4yNSAx.y5IDAgMCAwLTEuMjUgMS4yNWMwIDEuMTAyLjQyMiAyLjEwMiAxLjEyMiAyLjg0Mi43LjczOSAxLjcwMiAxLjEyMiAyLjg0MiAxLjEyMiAxLjE0IDAgMi4xNDItLjM4MyAyLjg0Mi0xLjEyMi43LS43LjEwMi0xLjcwMi4xMDItMi44NDIgMCAxLjE0LS40MjIgMi4xNDItMS4xMjIgMi44NDJaIi8+CiAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTQgNi41QzE0IDkuNTM4IDExLjUzOCAxMiA4IDEycy02LTIuNDYyLTYtNiAwLTYgNi02IDYgMi40NjIgNiA2LjVaTTEwLjU2MSA5LjQzOWExLjUgMS41IDAgMCAwLTEuMDYxLS40MTRjLS4zOTggMC0uNzg2LjE1OS0xLjA2MS40MTRhMS41IDEuNSAwIDAgMC0uNDEzIDEuMDYxYy4wMDEuMzk4LjE1OS43ODYuNDE0IDEuMDYxYTEuNSAx.yAwIDAgMCAxLjA2MS40MTRjLjM5OCAwIC43ODYtLjE1OSAxLjA2MS0uNDE0YTEuNSAxLjUgMCAwIDAgLjQxMy0xLjA2MWMtLjAwMS0uMzk4LS4xNTktLjc4Ni0uNDE0LTEuMDYxWiIvPgo8L3N2Zz+">`;
    searchTrigger.append(searchIconPic);

    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    li.append(searchScreenWrap);

    const searchWrapInner = document.createElement('div');
    searchWrapInner.classList.add('wrap');
    searchScreenWrap.append(searchWrapInner);

    const searchForm = document.createElement('form');
    searchForm.action = searchActionUrlCell?.querySelector('a')?.href || '#';
    searchForm.method = 'get';
    searchForm.id = 'search-block-form';
    searchForm.setAttribute('accept-charset', 'UTF-8');
    searchWrapInner.append(searchForm);

    const searchInputWrap = document.createElement('div');
    searchInputWrap.classList.add('search-wrap');
    searchForm.append(searchInputWrap);

    const searchIconDiv = document.createElement('div');
    searchIconDiv.classList.add('search-icon');
    searchIconDiv.innerHTML = `<img alt="svg file" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktc2VhcmNoIiB2aWV3Qm94PSIwIDAgMTYgMTYiPgogIDxwYXRoIGQ9Ik0xMS43NDIgMTAuMzQ0Yy0uNzQtLjctMS43NC0xLjEyMi0yLjg0Mi0xLjEyMkExLjI1IDEuMjUgMCAwIDAgNi42MjUgMTBhMS4yNSAx.y5IDAgMCAwLTEuMjUgMS4yNWMwIDEuMTAyLjQyMiAyLjEwMiAxLjEyMiAyLjY0Mi43LjczOSAxLjcwMiAxLjEyMiAyLjg0MiAxLjEyMiAxLjE0IDAgMi4xNDItLjM4MyAyLjg0Mi0xLjIyMi43LS43LjEwMi0xLjcwMi4xMDItMi44NDIgMCAxLjE0LS40MjIgMi4xNDItMS4xMjIgMi44NDJaIi8+CiAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTQgNi41QzE0IDkuNTM4IDExLjUzOCAxMiA4IDEycy02LTIuNDYyLTYtNiAwLTYgNi02IDYgMi40NjIgNiA2LjVaTTEwLjU2MSA5LjQzOWExLjUgMS41IDAgMCAwLTEuMDYxLS40MTRjLS4zOTggMC0uNzg2LjE1OS0xLjA2MS40MTRhMS41IDEuNSAwIDAgMC0uNDEzIDEuMDYxYy4wMDEuMzk4LjE1OS43ODYuNDE0IDEuMDYxYTEuNSAx.yAwIDAgMCAxLjA2MS40MTRjLjM5OCAwIC43ODYtLjE1OSAxLjA2MS0uNDE0YTEuNSAxLjUgMCAwIDAgLjQxMy0xLjA2MWMtLjAwMS0uMzk4LS4xNTktLjc4Ni0uNDE0LTEuMDYxWiIvPgo8L3N2Zz+">`;
    searchInputWrap.append(searchIconDiv);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.classList.add('input-text', 'searchtext');
    searchInput.required = true;
    searchInput.name = 'key';
    searchInput.id = 'searchInput';
    searchInput.autocomplete = 'off';
    searchInput.placeholder = placeholderTextCell?.textContent.trim() || '';
    searchInputWrap.append(searchInput);

    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-button');
    const submitLabel = document.createElement('div');
    submitLabel.classList.add('label');
    submitLabel.textContent = submitLabelCell?.textContent.trim() || '';
    submitButton.append(submitLabel);
    submitButton.innerHTML += `<img alt="svg file" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktYXJyb3ctcmlnaHQtYy1maWxsIiB2aWV3Qm94PSIwIDAgMTYgMTYiPgogIDxwYXRoIGQ9Ik0xIDguNWEuNTA1LjUwNSAwIDAgMSAuNTA1LS41aDguNzUzTDUuNzkgMi44NWEuNTA1LjUwNSAwIDAgMSAuNzEzLS43MTNsNS41IDUuNWEuNTA1LjUwNSAwIDAgMSAwIC43MTNsLTUuNSA1LjVhLjUwNS41MDUgMCAwIDEtLjcxMy0uNzEzbDMuNDY4LTMuNTRIMi41MDVBJjUwNS41MDUgMCAwIDEgMS41IDguNVoiLz4KPC9zdmc+">`;
    searchInputWrap.append(submitButton);

    const searchResultBox = document.createElement('div');
    searchResultBox.classList.add('searchResultBox');
    searchResultBox.style.display = 'none'; // Initially hidden
    searchForm.append(searchResultBox);

    const popularKeywordsWrap = document.createElement('div');
    popularKeywordsWrap.classList.add('search-suggestions-wrap');
    const popularLabel = document.createElement('div');
    popularLabel.classList.add('label');
    popularLabel.textContent = 'Popular Keywords:';
    popularKeywordsWrap.append(popularLabel);
    const popularTokensWrap = document.createElement('div');
    popularTokensWrap.classList.add('tokens-wrap');
    popularTokensWrap.innerHTML = popularKeywordsCell?.innerHTML || ''; // Use innerHTML for richtext
    popularKeywordsWrap.append(popularTokensWrap);
    searchWrapInner.append(popularKeywordsWrap);

    const recommendedKeywordsWrap = document.createElement('div');
    recommendedKeywordsWrap.classList.add('search-suggestions-wrap');
    const recommendedLabel = document.createElement('div');
    recommendedLabel.classList.add('label');
    recommendedLabel.textContent = 'Recommended for you:';
    recommendedKeywordsWrap.append(recommendedLabel);
    const recommendedTokensWrap = document.createElement('div');
    recommendedTokensWrap.classList.add('tokens-wrap');
    recommendedTokensWrap.innerHTML = recommendedKeywordsCell?.innerHTML || ''; // Use innerHTML for richtext
    recommendedKeywordsWrap.append(recommendedTokensWrap);
    searchWrapInner.append(recommendedKeywordsWrap);

    searchTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      li.classList.toggle('active');
      searchScreenWrap.classList.toggle('active');
    });

    desktopIconUl.append(li);
  });

  // Anniversary Logo
  const anniversaryLogoDiv = document.createElement('div');
  anniversaryLogoDiv.classList.add('logo', 'year-80-logo');
  wrap.append(anniversaryLogoDiv);

  const anniversaryLogoLink = document.createElement('a');
  anniversaryLogoLink.href = anniversaryLogoLinkRow?.querySelector('a')?.href || '#';
  moveInstrumentation(anniversaryLogoLinkRow, anniversaryLogoLink);

  const anniversaryLogoPicture = anniversaryLogoRow?.querySelector('picture');
  if (anniversaryLogoPicture) {
    const img = anniversaryLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    anniversaryLogoLink.append(optimizedPic);
  }
  anniversaryLogoLink.classList.add('hiddenlogo1', 'years-80');
  anniversaryLogoDiv.append(anniversaryLogoLink);
  moveInstrumentation(anniversaryLogoRow, anniversaryLogoLink);

  // Press Releases (if any, for newsroom mega menu)
  if (pressReleaseItems.length > 0) {
    // Find the newsroom menu item by looking for a specific class in its left-div
    const newsroomMenuItem = navUl.querySelector('li.has-child:has(.newsroom-left-div)');
    if (newsroomMenuItem) {
      const newsroomLeftDiv = newsroomMenuItem.querySelector('.newsroom-left-div');
      const latestPressReleaseDiv = document.createElement('div');
      latestPressReleaseDiv.classList.add('latest-two-press-release');
      newsroomLeftDiv.append(latestPressReleaseDiv);

      pressReleaseItems.forEach((row) => {
        const [linkCell, titleCell, dateCell, categoryCell] = [...row.children];
        const slidesDiv = document.createElement('div');
        slidesDiv.classList.add('slides');
        moveInstrumentation(row, slidesDiv);

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
        const anchor = document.createElement('a');
        const foundLink = linkCell?.querySelector('a');
        if (foundLink) {
          anchor.href = foundLink.href;
        } else {
          anchor.href = '#';
        }
        anchor.textContent = titleCell?.textContent.trim() || '';
        p.append(anchor);
        descDiv.append(p);

        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date');
        const emDate = document.createElement('em');
        emDate.textContent = dateCell?.textContent.trim() || '';
        dateDiv.append(emDate);
        const emCategory = document.createElement('em');
        emCategory.textContent = categoryCell?.textContent.trim() || '';
        dateDiv.append(emCategory);
        descDiv.append(dateDiv);
        latestPressReleaseDiv.append(slidesDiv);
      });
    }
  }

  // Hamburger menu click listener
  hamburger.addEventListener('click', () => {
    block.classList.toggle('active');
    nav.classList.toggle('active');
  });
}
