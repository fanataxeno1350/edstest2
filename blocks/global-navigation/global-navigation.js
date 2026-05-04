import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

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
      subWrap.classList.add('tbm-group-container', 'tbm-item-child');
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('tbm-toggle');
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
          trigger.setAttribute('aria-expanded', li.classList.contains('active'));
        });
      }
      transformNestedLists(nested); // Recursively transform nested lists
    }
  });
}

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    searchPlaceholderRow,
    searchActionRow,
    ...itemRows
  ] = [...block.children];

  block.innerHTML = '';
  block.classList.add('component-global-navigation', 'notranslate');

  const searchModule = document.createElement('div');
  searchModule.classList.add('search-module');
  const searchContainer = document.createElement('div');
  searchContainer.classList.add('container');
  const searchRow = document.createElement('div');
  searchRow.classList.add('row');

  const navTrigger = document.createElement('div');
  navTrigger.classList.add('nav-trigger', 'active');
  for (let i = 0; i < 3; i += 1) {
    navTrigger.append(document.createElement('i'));
  }
  searchRow.append(navTrigger);

  const searchCol = document.createElement('div');
  searchCol.classList.add('col-10', 'offset-1', 'search-col');
  const searchBoxContainer = document.createElement('div');
  searchBoxContainer.classList.add('search-box-container');
  const searchForm = document.createElement('form');
  searchForm.classList.add(
    'views-exposed-form',
    'bef-exposed-form',
  );
  searchForm.action = searchActionRow.querySelector('a')?.href || '#';
  searchForm.method = 'get';

  const searchInputContainer = document.createElement('div');
  searchInputContainer.classList.add('search-box-container');
  const searchItem = document.createElement('div');
  searchItem.classList.add(
    'js-form-item',
    'form-item',
    'form-type-search-api-autocomplete',
    'js-form-type-search-api-autocomplete',
    'form-item-keys',
    'js-form-item-keys',
    'form-no-label',
  );
  const searchInput = document.createElement('input');
  searchInput.classList.add(
    'form-autocomplete',
    'top-search-text-box',
    'form-text',
    'ui-autocomplete-input',
  );
  searchInput.placeholder = searchPlaceholderRow.textContent.trim();
  searchInput.type = 'text';
  searchInput.id = 'edit-keys';
  searchInput.name = 'keys';
  searchInput.setAttribute('aria-label', searchPlaceholderRow.textContent.trim());
  searchItem.append(searchInput);

  const searchSubmit = document.createElement('input');
  searchSubmit.classList.add(
    'top-search',
    'button',
    'js-form-submit',
    'form-submit',
    'disabled',
  );
  searchSubmit.type = 'submit';
  searchSubmit.id = 'edit-submit-lions-solr-search';
  searchSubmit.value = 'Search';
  searchSubmit.setAttribute('aria-label', 'Submit button');

  searchInputContainer.append(searchItem, searchSubmit);
  searchForm.append(searchInputContainer);
  searchBoxContainer.append(searchForm);
  searchCol.append(searchBoxContainer);
  searchRow.append(searchCol);
  searchContainer.append(searchRow);
  searchModule.append(searchContainer);
  block.append(searchModule);

  const desktopDiv = document.createElement('div');
  desktopDiv.classList.add('desktop');
  const relativeWrapper = document.createElement('div');
  relativeWrapper.classList.add('relative-wrapper');
  const mainContainer = document.createElement('div');
  mainContainer.classList.add('container');
  relativeWrapper.append(mainContainer);
  desktopDiv.append(relativeWrapper);
  block.append(desktopDiv);

  const utilityRow = document.createElement('div');
  utilityRow.classList.add('row', 'row-utility');
  const utilityBar = document.createElement('div');
  utilityBar.classList.add('utility-bar');
  utilityRow.append(utilityBar);
  mainContainer.append(utilityRow);

  // Filter item rows based on their structure (number of cells)
  const utilityLinks = itemRows.filter((row) => row.children.length === 3 && !row.children[2].querySelector('ul')); // Utility links have 3 cells, but no nested UL in the 3rd cell
  const languageItems = itemRows.filter((row) => row.children.length === 2);
  const navigationItems = itemRows.filter((row) => row.children.length === 3 && row.children[2].querySelector('ul')); // Navigation items have 3 cells, with a nested UL in the 3rd cell

  utilityLinks.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Only take the first two cells for utility links
    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      if (foundLink.target) link.target = foundLink.target;
      if (foundLink.getAttribute('aria-label')) link.setAttribute('aria-label', foundLink.getAttribute('aria-label'));
    }
    link.textContent = labelCell.textContent.trim();
    // The first utility link in the ORIGINAL HTML has 'chatbase-btn', others do not.
    // To replicate this, we would need to check if it's the first one, or add a field to the model.
    // For now, assuming it's not always present unless specified in model.
    // If a specific utility link needs 'chatbase-btn', it should be part of its model.
    // For now, removing the assumption.
    // link.classList.add('chatbase-btn');
    moveInstrumentation(row, link);
    utilityBar.append(link);
  });

  const langDropdown = document.createElement('div');
  langDropdown.classList.add('dropdown-lang');
  const langButton = document.createElement('button');
  langButton.type = 'button';
  langButton.textContent = 'EN'; // Default language from ORIGINAL HTML
  langDropdown.append(langButton);

  const langMenu = document.createElement('ul');
  langMenu.classList.add('dropdown-lang-menu');
  languageItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      if (foundLink.target) link.target = foundLink.target;
      if (foundLink.getAttribute('aria-label')) link.setAttribute('aria-label', foundLink.getAttribute('aria-label'));
    }
    link.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, link);
    li.append(link);
    langMenu.append(li);
  });
  langDropdown.append(langMenu);
  utilityBar.append(langDropdown);

  langButton.addEventListener('click', () => {
    langMenu.classList.toggle('active');
  });

  const topRow = document.createElement('div');
  topRow.classList.add('row', 'row-top');
  const col = document.createElement('div');
  col.classList.add('col');
  const innerRow = document.createElement('div');
  innerRow.classList.add('row');
  const logoCol = document.createElement('div');
  logoCol.classList.add('col', 'logo-tag-col');
  innerRow.append(logoCol);
  col.append(innerRow);
  topRow.append(col);
  mainContainer.append(topRow);

  const logoLink = document.createElement('a');
  logoLink.classList.add('logo', 'logo-full');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
    if (foundLogoLink.getAttribute('aria-label')) logoLink.setAttribute('aria-label', foundLogoLink.getAttribute('aria-label'));
  }
  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoLink);
  logoCol.append(logoLink);

  const mobileNavTrigger = document.createElement('a');
  mobileNavTrigger.classList.add('mobile-nav-trigger', 'visible-mobile');
  mobileNavTrigger.href = '#';
  mobileNavTrigger.setAttribute('aria-label', 'Mobile menu');
  for (let i = 0; i < 4; i += 1) {
    mobileNavTrigger.append(document.createElement('span'));
  }
  logoCol.append(mobileNavTrigger);

  const bottomRow = document.createElement('div');
  bottomRow.classList.add('row', 'row-bottom');
  const menuCol = document.createElement('div');
  menuCol.classList.add('col-12', 'menu-col');
  const menuColInner = document.createElement('div');
  menuColInner.classList.add('menu-col-inner');
  menuCol.append(menuColInner);
  bottomRow.append(menuCol);
  mainContainer.append(bottomRow);

  const tbm = document.createElement('div');
  tbm.classList.add('tbm', 'tbm-tb-mega-main', 'tbm-no-arrows', 'tb-megamenu', 'tb-megamenu-tb-mega-main');
  tbm.id = 'e0c7f3df-3796-4d2e-96b4-1787e5381a95';
  tbm.setAttribute('data-breakpoint', '1200');
  tbm.setAttribute('aria-label', 'tb-mega-main navigation');
  tbm.setAttribute('data-initialized', 'true');

  const navCollapse = document.createElement('div');
  navCollapse.classList.add('nav-collapse');
  const navList = document.createElement('ul');
  navList.classList.add('tbm-nav', 'level-0', 'items-4', 'tb-megamenu-nav', 'nav');
  navCollapse.append(navList);
  tbm.append(navCollapse);
  menuColInner.append(tbm);

  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('tbm-item', 'level-1', 'tb-megamenu-item', 'mega');

    const hierarchyRoot = hierarchyCell?.querySelector('ul');
    if (hierarchyRoot) {
      li.classList.add('tbm-item--has-dropdown');
      const span = document.createElement('span');
      span.classList.add('tbm-link', 'level-1', 'no-link', 'tbm-toggle', 'tb-megamenu-no-link');
      span.textContent = labelCell.textContent.trim();
      span.setAttribute('tabindex', '0');
      span.setAttribute('aria-expanded', 'false');
      li.append(span);

      const submenu = document.createElement('div');
      submenu.classList.add('tbm-submenu', 'tbm-item-child', 'tbm-has-width');
      submenu.style.width = '800px';
      const submenuRow = document.createElement('div');
      submenuRow.classList.add('tbm-row');
      const submenuCol = document.createElement('div');
      submenuCol.classList.add('tbm-column', 'span3'); // Adjust span based on content
      const submenuColInner = document.createElement('div');
      submenuColInner.classList.add('tbm-column-inner');
      const subnav = document.createElement('ul');
      subnav.classList.add('tbm-subnav', 'level-1', 'items-1');

      // Create a temporary div to parse the hierarchy HTML and apply instrumentation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell to tempDiv

      // Apply classes from ORIGINAL HTML to nested elements within the hierarchy
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('tbm-subnav', 'level-1', 'items-1')); // Example, adjust based on actual nested ULs
      tempDiv.querySelectorAll('li').forEach(liItem => liItem.classList.add('tbm-item', 'level-2', 'tbm-group', 'tb-megamenu-item', 'mega')); // Example, adjust
      tempDiv.querySelectorAll('li > a').forEach(a => a.classList.add('tbm-link', 'level-2')); // Example, adjust
      tempDiv.querySelectorAll('li > span').forEach(spanItem => spanItem.classList.add('tbm-link', 'level-2', 'no-link', 'tbm-group-title', 'tb-megamenu-no-link')); // Example, adjust

      // Recursively transform nested lists within the tempDiv
      transformNestedLists(tempDiv.querySelector('ul'));

      // Append children from the transformed tempDiv to subnav
      while (tempDiv.firstChild) {
        subnav.append(tempDiv.firstChild);
      }

      submenuColInner.append(subnav);
      submenuCol.append(submenuColInner);
      submenuRow.append(submenuCol);
      submenu.append(submenuRow);
      li.append(submenu);

      span.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        submenu.classList.toggle('active');
        span.setAttribute('aria-expanded', li.classList.contains('active'));
      });
    } else {
      const link = document.createElement('a');
      link.classList.add('tbm-link', 'level-1');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        if (foundLink.target) link.target = foundLink.target;
        if (foundLink.getAttribute('aria-label')) link.setAttribute('aria-label', foundLink.getAttribute('aria-label'));
      }
      link.textContent = labelCell.textContent.trim();
      li.append(link);
    }
    moveInstrumentation(row, li);
    navList.append(li);
  });

  mobileNavTrigger.addEventListener('click', () => {
    navCollapse.classList.toggle('show');
    mobileNavTrigger.classList.toggle('collapsed');
  });

  navTrigger.addEventListener('click', () => {
    searchModule.classList.toggle('active');
    navTrigger.classList.toggle('active');
  });
}
