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
      subWrap.classList.add('navigation-v2-sub-list__body'); // use ORIGINAL HTML class
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

export default function decorate(block) {
  const [
    skipToContentLinkRow,
    logoRow,
    logoLinkRow,
    searchbarHeadlineRow,
    ...navigationTabItemRows
  ] = [...block.children];

  block.innerHTML = ''; // Clear the block to rebuild

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('container', 'responsivegrid', 'header--wrapper');

  const headerMain = document.createElement('div');
  headerMain.classList.add('container', 'responsivegrid', 'header-main');

  // Skip to Content Link
  const skipToContentLinkCell = skipToContentLinkRow.querySelector('div');
  const skipToContentLink = document.createElement('a');
  skipToContentLink.classList.add('cmp-button', 'component-skip-to-main');
  const skipToContentAnchor = skipToContentLinkCell.querySelector('a');
  if (skipToContentAnchor) {
    skipToContentLink.href = skipToContentAnchor.href;
    const span = document.createElement('span');
    span.classList.add('cmp-button__text');
    span.textContent = 'Skip to content';
    skipToContentLink.append(span);
  }
  moveInstrumentation(skipToContentLinkCell, skipToContentLink);
  headerMain.append(skipToContentLink);

  // Logo and Logo Link
  const logoCell = logoRow.querySelector('div');
  const logoLinkCell = logoLinkRow.querySelector('div');

  const logoContainer = document.createElement('div');
  logoContainer.classList.add('tabimage', 'image', 'brand-logo');

  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link');
  const logoLinkAnchor = logoLinkCell.querySelector('a');
  if (logoLinkAnchor) {
    logoLink.href = logoLinkAnchor.href;
    logoLink.title = 'Lifebuoy Logo'; // Assuming a default title
    logoLink.ariaLabel = 'Lifebuoy Logo';
  }

  const picture = logoCell.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '102' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoCell, logoLink);
  logoContainer.append(logoLink);
  headerMain.append(logoContainer);

  // Global Navigation
  const globalNavigation = document.createElement('div');
  globalNavigation.classList.add(
    'globalnavigation',
    'tabs',
    'globalnavigation--megamenu',
    'cmp-tabs',
    'cmp-globalnavigation',
    'globalnavigation--v2',
  );
  globalNavigation.setAttribute('data-highlighting', 'true');
  globalNavigation.setAttribute('data-menu-type', 'globalnavigation--megamenu');

  const navButtonWrapper = document.createElement('div');
  navButtonWrapper.classList.add('navigation-button__wrapper');

  const closeButtonDiv = document.createElement('div');
  closeButtonDiv.classList.add('button', 'button-global-nav-close');
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.classList.add('cmp-button');
  closeButton.ariaLabel = 'close menu';
  closeButton.title = 'Close';
  closeButton.innerHTML = '<span class="cmp-button__icon cmp-button__icon--close" aria-hidden="true"></span><span class="cmp-button__text">Close</span>';
  closeButtonDiv.append(closeButton);
  navButtonWrapper.append(closeButtonDiv);
  globalNavigation.append(navButtonWrapper);

  const nav = document.createElement('nav');
  const ul = document.createElement('ul');
  ul.classList.add('cmp-tabs__tablist', 'cmp-globalnavigation__group');
  ul.style.justifyContent = 'flex-start';

  navigationTabItemRows.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('ul'));
    const linkCell = cells.find(cell => cell.querySelector('a') && !cell.querySelector('ul'));
    const hierarchyCell = cells.find(cell => cell.querySelector('ul'));

    const li = document.createElement('li');
    li.classList.add(
      'cmp-tabs__tab',
      'cmp-globalnavigation__item',
      'cmp-globalnavigation__item--has-children',
    );

    const button = document.createElement('button');
    button.classList.add('mainLink');
    button.ariaExpanded = 'false';
    button.ariaHaspopup = 'true';
    button.textContent = labelCell?.textContent.trim() || '';

    const tabpanel = document.createElement('div');
    tabpanel.classList.add('cmp-tabs__tabpanel');
    tabpanel.role = 'tabpanel';

    const containerResponsivegrid = document.createElement('div');
    containerResponsivegrid.classList.add('container', 'responsivegrid');

    const innerContainer = document.createElement('div');
    innerContainer.classList.add('cmp-container');

    const aemGrid = document.createElement('div');
    aemGrid.classList.add('aem-Grid', 'aem-Grid--12', 'aem-Grid--default--12');

    const backButtonDiv = document.createElement('div');
    backButtonDiv.classList.add('button', 'button-back-nav', 'aem-GridColumn', 'aem-GridColumn--default--12');
    const backButton = document.createElement('button');
    backButton.type = 'button';
    backButton.classList.add('cmp-button');
    backButton.ariaLabel = 'Back';
    backButton.title = 'Back';
    backButton.innerHTML = '<span class="cmp-button__text">Back</span>';
    backButtonDiv.append(backButton);
    aemGrid.append(backButtonDiv);

    const navigationLinksDiv = document.createElement('div');
    navigationLinksDiv.classList.add('navigationlinks', 'aem-GridColumn', 'aem-GridColumn--default--12');

    const navV2 = document.createElement('div');
    navV2.classList.add('cmp--navigation-v2', 'ma-page_list');

    const navV2Wrapper = document.createElement('div');
    navV2Wrapper.classList.add('navigation-v2__wrapper');

    const navV2Item = document.createElement('div');
    navV2Item.classList.add('navigation-v2-item');

    const navV2ItemBody = document.createElement('div');
    navV2ItemBody.classList.add('navigation-v2-item__body');

    if (hierarchyCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      const hierarchyRoot = tempDiv.querySelector('ul');

      if (hierarchyRoot) {
        const hierarchyListGroup = document.createElement('ul');
        hierarchyListGroup.classList.add('navigation-v2-item-list__group');

        const mainLinkWrapper = document.createElement('div');
        mainLinkWrapper.classList.add('navigation-v2-main-wrapper');
        const mainLinkSpan = document.createElement('span');
        mainLinkSpan.classList.add('navigation-v2-main-link-link__text');
        mainLinkWrapper.append(mainLinkSpan);

        // Move instrumentation from the original row to the new list item
        moveInstrumentation(row, li);

        // Apply classes to nested elements as per ORIGINAL HTML
        hierarchyRoot.querySelectorAll('ul').forEach(ulEl => ulEl.classList.add('navigation-v2-sub-list__group', 'navigation-v2-item-list'));
        hierarchyRoot.querySelectorAll('li').forEach(liEl => liEl.classList.add('navigation-v2-item-list-item', 'navigation-v2-item-list-item--level-'));
        hierarchyRoot.querySelectorAll('a').forEach(aEl => aEl.classList.add('navigation-v2-item-list-item-link'));
        hierarchyRoot.querySelectorAll('a').forEach(aEl => {
          const span = document.createElement('span');
          span.classList.add('navigation-v2-item-list-item-link__text');
          span.textContent = aEl.textContent;
          aEl.textContent = '';
          aEl.append(span);
        });

        // Transform the nested list structure
        transformNestedLists(hierarchyRoot);

        // Append the transformed hierarchy to the new structure
        hierarchyListGroup.append(hierarchyRoot);
        navV2ItemBody.append(hierarchyListGroup, mainLinkWrapper);
      }
    } else {
      // If no hierarchy, create a simple link
      const navV2ItemListGroup = document.createElement('ul');
      navV2ItemListGroup.classList.add('navigation-v2-item-list__group');

      const navV2ItemListItem = document.createElement('li');
      navV2ItemListItem.classList.add('navigation-v2-item-list-item');

      const link = document.createElement('a');
      link.classList.add('navigation-v2-item-list-item-link');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      }
      const linkTextSpan = document.createElement('span');
      linkTextSpan.classList.add('navigation-v2-item-list-item-link__text');
      linkTextSpan.textContent = labelCell?.textContent.trim() || '';
      link.append(linkTextSpan);
      moveInstrumentation(linkCell, link); // Move instrumentation from link cell to new link
      navV2ItemListItem.append(link);
      navV2ItemListGroup.append(navV2ItemListItem);
      navV2ItemBody.append(navV2ItemListGroup);
    }

    navV2Item.append(navV2ItemBody);
    navV2Wrapper.append(navV2Item);
    navV2.append(navV2Wrapper);
    navigationLinksDiv.append(navV2);
    aemGrid.append(navigationLinksDiv);
    innerContainer.append(aemGrid);
    containerResponsivegrid.append(innerContainer);
    tabpanel.append(containerResponsivegrid);

    li.append(button, tabpanel);
    ul.append(li);

    button.addEventListener('click', () => {
      const isActive = li.classList.toggle('cmp-tabs__tab--active');
      button.ariaExpanded = isActive;
      tabpanel.classList.toggle('cmp-tabs__tabpanel--active');

      // Close other open tabs
      ul.querySelectorAll('.cmp-tabs__tab').forEach((otherLi) => {
        if (otherLi !== li) {
          otherLi.classList.remove('cmp-tabs__tab--active');
          otherLi.querySelector('.mainLink').ariaExpanded = 'false';
          otherLi.querySelector('.cmp-tabs__tabpanel').classList.remove('cmp-tabs__tabpanel--active');
        }
      });
    });

    backButton.addEventListener('click', () => {
      li.classList.remove('cmp-tabs__tab--active');
      button.ariaExpanded = 'false';
      tabpanel.classList.remove('cmp-tabs__tabpanel--active');
    });
  });

  nav.append(ul);
  globalNavigation.append(nav);
  headerMain.append(globalNavigation);

  // Searchbar
  const searchbarHeadlineCell = searchbarHeadlineRow.querySelector('div');
  const searchInputDiv = document.createElement('div');
  searchInputDiv.classList.add('searchinput', 'searchbar');

  const searchbarButtonDiv = document.createElement('div');
  searchbarButtonDiv.classList.add('searchbar-button');
  const searchToggleBtn = document.createElement('button');
  searchToggleBtn.classList.add('search-toggle');
  searchToggleBtn.ariaLabel = 'Search';
  searchToggleBtn.ariaHaspopup = 'dialog';
  searchToggleBtn.ariaControls = 'search-modal';
  searchToggleBtn.ariaDescribedby = 'searchToggleDesc';
  searchToggleBtn.innerHTML = '<span class="search-toggle-icon"></span><span class="search-toggle-text">Search</span><span class="sr-only" id="searchToggleDesc">Search</span>';
  searchbarButtonDiv.append(searchToggleBtn);
  searchInputDiv.append(searchbarButtonDiv);

  const modalSearch = document.createElement('div');
  modalSearch.classList.add('modal-search');
  modalSearch.id = 'search-modal'; // Add ID for aria-controls

  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modal-header');
  const closeSearchBtn = document.createElement('button');
  closeSearchBtn.type = 'button';
  closeSearchBtn.classList.add('modal-overlay-close');
  closeSearchBtn.ariaLabel = 'close search';
  closeSearchBtn.innerHTML = '<span class="search-close-icon"></span><span class="search-close-text">close search</span>';
  modalHeader.append(closeSearchBtn);
  modalSearch.append(modalHeader);

  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body');
  const searchResultInputDiv = document.createElement('div');
  searchResultInputDiv.classList.add('searchbar', 'search-result-input');

  const searchbarContainer = document.createElement('div');
  searchbarContainer.classList.add('searchbar-container');
  searchbarContainer.setAttribute('data-auto-suggest', 'true');
  searchbarContainer.setAttribute('data-pre-search-tagline', 'Quick suggestions');
  searchbarContainer.setAttribute('data-post-search-tagline', 'Search recommendations');
  searchbarContainer.setAttribute('data-minimum-input-char', '3');
  searchbarContainer.setAttribute('data-suggest-endpoint', '/api/v1/web/UnileverCIFIO-0.0.1/dispatcher-suggest');
  searchbarContainer.setAttribute('data-header-store', 'lifebuoy_in_en_BH0300_8901030000003');
  searchbarContainer.setAttribute('data-header-assortmentcode', 'BH0300');
  searchbarContainer.setAttribute('data-header-ipglncode', '8901030000003');
  searchbarContainer.setAttribute('data-auto-suggest-config', '{ "article": { "autoSuggestTypeCount": "3", "defaultQueryByType": "{{Query}} in Articles", "enableAutoSuggestionType": "article" }, "product": { "autoSuggestTypeCount": "3", "defaultQueryByType": "{{Query}} in Products", "enableAutoSuggestionType": "product" }, "orderBy": [ "article", "product" ], "defaultQueryByTypeFlag": true }');
  searchbarContainer.setAttribute('data-search-url', '/search.html');
  searchbarContainer.setAttribute('data-search-product-url', '/search/search-product.html');
  searchbarContainer.setAttribute('data-search-article-url', '/search/search-article.html');
  searchbarContainer.setAttribute('data-header-env', 'prod');

  const searchBar = document.createElement('div');
  searchBar.classList.add('search-bar');
  const searchForm = document.createElement('form');
  searchForm.action = '/search.html';
  const searchHeadline = document.createElement('label');
  searchHeadline.htmlFor = 'input-label-search'; // Unique ID
  searchHeadline.classList.add('search-headline');
  searchHeadline.textContent = searchbarHeadlineCell?.textContent.trim() || 'Hello, what are you looking for?';
  const searchInput = document.createElement('input');
  searchInput.id = 'input-label-search'; // Unique ID
  searchInput.classList.add('search-bar-input');
  searchInput.type = 'text';
  searchInput.placeholder = 'What are you looking for?';
  searchInput.autocomplete = 'off';
  searchInput.dir = 'auto';
  searchInput.name = 'query';
  const clearButton = document.createElement('button');
  clearButton.classList.add('search-bar-btn-clear');
  clearButton.type = 'button';
  clearButton.ariaLabel = 'Clear Input';
  clearButton.textContent = 'Clear Input';
  const handlerButton = document.createElement('button');
  handlerButton.classList.add('search-bar-btn-handler');
  handlerButton.type = 'submit';
  handlerButton.ariaLabel = 'Search';
  handlerButton.textContent = 'Search';
  const searchbarLoader = document.createElement('div');
  searchbarLoader.classList.add('searchbar-loader');

  searchForm.append(searchHeadline, searchInput, clearButton, handlerButton, searchbarLoader);
  searchBar.append(searchForm);
  searchbarContainer.append(searchBar);

  const searchbarResultContainerWrapper = document.createElement('div');
  searchbarResultContainerWrapper.classList.add('searchbar-result-container-wrapper');
  searchbarResultContainerWrapper.innerHTML = `
    <div class="searchbar-result-container"></div>
    <div class="reader-search-parent" aria-live="polite">
      <div class="reader-search"></div>
    </div>
    <div class="search-result-tagline"></div>
    <div class="searchbar-result"></div>
    <div class="searchbar-result-predefined"></div>
    <div class="searchbar-itemTemplate">
      <div class="searchbar-items" data-cmp-hook-searchbar="item">
        <div class="searchbar-itemTitle" data-cmp-hook-searchbar="itemTitle"></div>
      </div>
    </div>
    <div class="searchbar-clear"></div>
  `;
  searchbarContainer.append(searchbarResultContainerWrapper);

  searchResultInputDiv.append(searchbarContainer);
  modalBody.append(searchResultInputDiv);
  modalSearch.append(modalBody);
  searchInputDiv.append(modalSearch);
  headerMain.append(searchInputDiv);

  // Event listeners for search modal
  searchToggleBtn.addEventListener('click', () => {
    modalSearch.classList.add('show');
    document.body.classList.add('modal-open');
  });

  closeSearchBtn.addEventListener('click', () => {
    modalSearch.classList.remove('show');
    document.body.classList.remove('modal-open');
  });

  modalSearch.addEventListener('click', (e) => {
    if (e.target === modalSearch) {
      modalSearch.classList.remove('show');
      document.body.classList.remove('modal-open');
    }
  });

  // Header Nav Button (Hamburger menu)
  const headerNavButtonDiv = document.createElement('div');
  headerNavButtonDiv.classList.add('button', 'button-header-nav');
  const headerNavButton = document.createElement('button');
  headerNavButton.type = 'button';
  headerNavButton.classList.add('cmp-button');
  headerNavButton.ariaLabel = 'Menu';
  headerNavButton.ariaExpanded = 'false';
  headerNavButton.ariaHaspopup = 'true';
  headerNavButton.title = 'Menu';
  headerNavButton.innerHTML = '<span class="cmp-button__text">Menu</span>';
  headerNavButtonDiv.append(headerNavButton);
  headerMain.append(headerNavButtonDiv);

  // Event listener for hamburger menu button
  headerNavButton.addEventListener('click', () => {
    // Toggle classes to show/hide the global navigation menu
    globalNavigation.classList.toggle('active');
    document.body.classList.toggle('global-nav-open'); // Assuming a class to control body scroll/overlay
    headerNavButton.ariaExpanded = globalNavigation.classList.contains('active');
  });

  closeButton.addEventListener('click', () => {
    globalNavigation.classList.remove('active');
    document.body.classList.remove('global-nav-open');
    headerNavButton.ariaExpanded = 'false';
  });


  // Sign Up Button
  const signUpButtonDiv = document.createElement('div');
  signUpButtonDiv.classList.add('button', 'button--signup', 'is-userSignedUp');
  const signUpLink = document.createElement('a');
  signUpLink.classList.add('cmp-button');
  signUpLink.ariaLabel = 'Daftar';
  signUpLink.href = '/signup.html'; // Hardcoded as per original HTML example
  signUpLink.innerHTML = '<span class="cmp-button__text">Sign Up</span>';
  signUpButtonDiv.append(signUpLink);
  headerMain.append(signUpButtonDiv);

  headerWrapper.append(headerMain);
  block.append(headerWrapper);

  // Optimize all images in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
