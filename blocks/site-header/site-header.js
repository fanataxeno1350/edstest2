import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    logoImageRow,
    logoLinkRow,
    ...itemRows
  ] = [...block.children];

  // Create header container
  const siteHeaderContainer = document.createElement('div');
  siteHeaderContainer.classList.add('site-header-container');
  siteHeaderContainer.setAttribute('data-nav-header', '');

  // Logo
  const logoP = document.createElement('p');
  logoP.classList.add('site-header-logo');
  const logoLink = document.createElement('a');
  moveInstrumentation(logoLinkRow.firstElementChild, logoLink);
  logoLink.href = logoLinkRow.querySelector('a').href;
  logoLink.title = 'Home';
  logoLink.rel = 'home';
  logoLink.id = 'logo';

  const picture = logoImageRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '100%' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  logoP.append(logoLink);
  siteHeaderContainer.append(logoP);

  // Mobile nav toggle button
  const mobileNavToggle = document.createElement('button');
  mobileNavToggle.classList.add('site-nav-toggle-mobile');
  mobileNavToggle.setAttribute('aria-controls', 'site-navigation');
  mobileNavToggle.setAttribute('data-module', 'nav-toggle');
  mobileNavToggle.setAttribute('data-features', 'setToWindowHeight');
  mobileNavToggle.setAttribute('aria-expanded', 'false'); // Initial state
  mobileNavToggle.innerHTML = `
    <span class="site-nav-toggle-mobile-icon"></span>
    <span class="a11y-sr-only">Main </span>Menu
  `;

  // Mobile search form and button
  const mobileSearchForm = document.createElement('form');
  mobileSearchForm.action = 'https://my.rotary.org/en/site-search';
  mobileSearchForm.method = 'get';
  const mobileSearchButton = document.createElement('button');
  mobileSearchButton.type = 'submit';
  mobileSearchButton.classList.add('site-nav-toggle-search');
  mobileSearchButton.innerHTML = `
    <span class="site-nav-toggle-search-icon"></span>
    Search
  `;
  mobileSearchForm.append(mobileSearchButton);

  siteHeaderContainer.append(mobileNavToggle, mobileSearchForm);

  // Site navigation container
  const siteNavContainer = document.createElement('div');
  siteNavContainer.classList.add('site-nav-container');
  siteNavContainer.id = 'site-navigation';

  const siteNavUtility = document.createElement('div');
  siteNavUtility.classList.add('site-nav-utility');
  const siteNavUtilityContainer = document.createElement('div');
  siteNavUtilityContainer.classList.add('site-nav-utility-container');

  // Utility Links (Large)
  const utilityLinksLarge = document.createElement('ul');
  utilityLinksLarge.classList.add('site-nav-utility-links', '-large');

  // Filter item rows based on structure and content
  const utilityLinks = itemRows.filter((row) => row.children.length === 1 && row.querySelector('a') && !row.querySelector('a').classList.contains('u-button'));
  const utilityCtas = itemRows.filter((row) => row.children.length === 1 && row.querySelector('a') && row.querySelector('a').classList.contains('u-button'));
  const navItems = itemRows.filter((row) => row.children.length === 2);
  const subItems = itemRows.filter((row) => row.children.length === 1 && row.querySelector('a') && !utilityLinks.includes(row) && !utilityCtas.includes(row)); // Subitems are also 1 cell with a link, but not utility links/ctas

  utilityLinks.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    const link = row.querySelector('a');
    const newLink = document.createElement('a');
    newLink.href = link.href;
    newLink.textContent = link.textContent;
    li.append(newLink);
    utilityLinksLarge.append(li);
  });

  // Desktop Search Button (part of large utility links)
  const searchLi = document.createElement('li');
  const desktopSearchForm = document.createElement('form');
  desktopSearchForm.action = 'https://my.rotary.org/en/site-search';
  desktopSearchForm.method = 'get';
  const desktopSearchButton = document.createElement('button');
  desktopSearchButton.type = 'submit';
  desktopSearchButton.classList.add('site-nav-toggle-search-desktop');
  desktopSearchButton.innerHTML = `
    <span class="site-nav-toggle-search-icon"></span>
    Search
  `;
  desktopSearchForm.append(desktopSearchButton);
  searchLi.append(desktopSearchForm);
  utilityLinksLarge.append(searchLi);

  siteNavUtilityContainer.append(utilityLinksLarge);

  // Utility CTAs
  const utilityCtasUl = document.createElement('ul');
  utilityCtasUl.classList.add('site-nav-utility-ctas');
  utilityCtas.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    const link = row.querySelector('a');
    const newLink = document.createElement('a');
    newLink.href = link.href;
    newLink.textContent = link.textContent;
    newLink.classList.add(...link.classList); // Copy all classes from original link
    li.append(newLink);
    utilityCtasUl.append(li);
  });
  siteNavUtilityContainer.append(utilityCtasUl);
  siteNavUtility.append(siteNavUtilityContainer);
  siteNavContainer.append(siteNavUtility);

  // Main Navigation
  const siteNav = document.createElement('nav');
  siteNav.classList.add('site-nav');
  siteNav.setAttribute('data-nav', '');
  siteNav.setAttribute('aria-label', 'main navigation');

  const siteNavList = document.createElement('ul');
  siteNavList.classList.add('site-nav-list');

  navItems.forEach((row) => {
    const cells = [...row.children]; // Use content detection
    const headingCell = cells.find(cell => cell.querySelector('a'));
    const subitemsContainerCell = cells.find(cell => !cell.querySelector('a')); // The cell containing the subitems placeholder

    const siteNavItem = document.createElement('li');
    moveInstrumentation(row, siteNavItem);
    siteNavItem.classList.add('site-nav-item');
    siteNavItem.setAttribute('data-module', 'nav-group');

    const headingP = document.createElement('p');
    headingP.classList.add('site-nav-item-heading');
    const headingLink = headingCell.querySelector('a');
    const newHeadingLink = document.createElement('a');
    newHeadingLink.href = headingLink.href;
    newHeadingLink.setAttribute('data-nav-headinglink', '');
    newHeadingLink.setAttribute('aria-expanded', 'false');
    newHeadingLink.innerHTML = `${headingLink.textContent}<span class="site-nav-a11y-helper">(down arrow opens sub-menu)&gt;</span>`;
    headingP.append(newHeadingLink);
    siteNavItem.append(headingP);

    const subitemsList = document.createElement('ul');
    subitemsList.classList.add('site-nav-sublist');
    subitemsList.setAttribute('data-nav-sublist', '');
    subitemsList.setAttribute('data-is', 'close');
    // Determine number of columns based on content, or hardcode if always 10
    subitemsList.setAttribute('data-columns', '10'); // Example, adjust as needed

    // Filter subitems that belong to this nav item
    // Assuming subitems are listed sequentially after their parent nav item in the original block structure
    // This logic needs to be robust. A common pattern is that the subitems are the *next* 1-cell rows
    // until another 2-cell nav item or a 1-cell utility link/cta is encountered.
    // For now, we'll assume the subitems are the ones that were filtered into the `subItems` array
    // and we need to associate them based on their position relative to the nav item.
    // This is a simplification and might need refinement based on exact content structure.
    // A more robust solution would involve a unique identifier or explicit grouping in the model.
    // Given the current flat structure, we'll assume subitems are associated by the text content
    // of the subitemsContainerCell, which is a weak but sometimes necessary heuristic.

    // A better approach for flat subitems: if the model implies a hierarchy by order,
    // we need to process `itemRows` sequentially and build the hierarchy.
    // For this review, let's assume `subitemsContainerCell.textContent` contains
    // a comma-separated list of subitem titles or similar for association.
    // If not, the current `subItems` array is global and needs a more specific filter.

    // Let's refine the subitem association. The `subitemsContainerCell` contains "Subitems value".
    // This means we cannot directly link subitems based on its content.
    // The `subItems` array contains all global subitems.
    // We need to find a way to group them.
    // A common pattern is that subitems for a nav item appear *immediately after* that nav item
    // in the `itemRows` array, until the next `navItem` or `utilityLink/cta` appears.
    // This requires a different iteration strategy than `forEach(navItems)`.

    // Re-evaluate itemRows processing to build hierarchy
    let currentSubitems = [];
    let processingSubitems = false;
    let currentNavItemIndex = itemRows.indexOf(row);

    // Find all subitems that appear directly after this nav item until the next nav item or utility item
    for (let i = currentNavItemIndex + 1; i < itemRows.length; i += 1) {
      const potentialSubitemRow = itemRows[i];
      if (navItems.includes(potentialSubitemRow) || utilityLinks.includes(potentialSubitemRow) || utilityCtas.includes(potentialSubitemRow)) {
        // Found the next main item, stop collecting subitems for current nav item
        break;
      }
      if (subItems.includes(potentialSubitemRow)) {
        currentSubitems.push(potentialSubitemRow);
      }
    }

    currentSubitems.forEach((subitemRow) => {
      const siteNavSubitem = document.createElement('li');
      moveInstrumentation(subitemRow, siteNavSubitem);
      siteNavSubitem.classList.add('site-nav-subitem');
      const subitemLink = subitemRow.querySelector('a');
      const newSubitemLink = document.createElement('a');
      newSubitemLink.href = subitemLink.href;
      newSubitemLink.title = ''; // Original HTML has empty title for subitems
      newSubitemLink.setAttribute('data-nav-headinglink', '');
      newSubitemLink.setAttribute('tabindex', '-1');
      newSubitemLink.textContent = subitemLink.textContent;
      siteNavSubitem.append(newSubitemLink);
      subitemsList.append(siteNavSubitem);
    });
    siteNavItem.append(subitemsList);
    siteNavList.append(siteNavItem);
  });

  siteNav.append(siteNavList);
  siteNavContainer.append(siteNav);

  // Utility Links (Small)
  const utilityLinksSmall = document.createElement('ul');
  utilityLinksSmall.classList.add('site-nav-utility-links', '-small');
  utilityLinks.forEach((row) => { // Reusing the same items for small
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    const link = row.querySelector('a');
    const newLink = document.createElement('a');
    newLink.href = link.href;
    newLink.textContent = link.textContent;
    li.append(newLink);
    utilityLinksSmall.append(li);
  });
  siteNavContainer.append(utilityLinksSmall);

  block.textContent = '';
  block.append(siteHeaderContainer, siteNavContainer);

  // Add event listener for mobile nav toggle
  mobileNavToggle.addEventListener('click', () => {
    const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
    mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
    siteNavContainer.classList.toggle('show'); // Assuming 'show' class controls visibility
    // Additional logic for setting window height if data-features="setToWindowHeight" is needed
  });

  // Add event listeners for main navigation items (dropdowns)
  siteNavList.querySelectorAll('.site-nav-item-heading > a').forEach((headingLink) => {
    headingLink.addEventListener('click', (e) => {
      e.preventDefault();
      const parentLi = headingLink.closest('.site-nav-item');
      const sublist = parentLi.querySelector('.site-nav-sublist');
      const isExpanded = headingLink.getAttribute('aria-expanded') === 'true';

      // Close other open sublists
      siteNavList.querySelectorAll('.site-nav-item').forEach((item) => {
        if (item !== parentLi) {
          item.querySelector('.site-nav-item-heading > a').setAttribute('aria-expanded', 'false');
          item.querySelector('.site-nav-sublist').setAttribute('data-is', 'close');
        }
      });

      headingLink.setAttribute('aria-expanded', !isExpanded);
      if (isExpanded) {
        sublist.setAttribute('data-is', 'close');
      } else {
        sublist.setAttribute('data-is', 'open');
      }
    });
  });
}
