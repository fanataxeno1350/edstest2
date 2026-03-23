import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const headerContainer = document.createElement('div');
  headerContainer.className = 'header-container header-container';
  moveInstrumentation(block.querySelector(':scope > div'), headerContainer);

  const nav = document.createElement('nav');
  nav.className = 'header-navbar header-navbar header-navbar-expand-xl header-navbar-light header-bg-light header-px-xl-5 header-d-flex header-justify-content-between header-align-items-center';

  const togglerButton = document.createElement('button');
  togglerButton.className = 'header-navbar-toggler header-collapsed';
  togglerButton.type = 'button';
  togglerButton.setAttribute('data-toggle', 'collapse');
  togglerButton.setAttribute('data-target', '#navbarSupportedContent');
  togglerButton.setAttribute('aria-controls', 'navbarSupportedContent');
  togglerButton.setAttribute('aria-expanded', 'false');
  togglerButton.setAttribute('aria-label', 'Toggle navigation');
  const togglerSpan = document.createElement('span');
  togglerSpan.className = 'header-navbar-toggler-icon';
  togglerButton.append(togglerSpan);
  nav.append(togglerButton);

  const dXlNoneDiv = document.createElement('div');
  dXlNoneDiv.className = 'header-d-xl-none';
  nav.append(dXlNoneDiv);

  const logoDiv = document.createElement('div');
  logoDiv.className = 'header-logo header-image';
  const primaryLogoLink = block.querySelector('[data-aue-prop="primaryLogoLink"]');
  const secondaryLogoLink = block.querySelector('[data-aue-prop="secondaryLogoLink"]');

  if (primaryLogoLink) {
    const primaryLogoImg = primaryLogoLink.querySelector('img');
    if (primaryLogoImg) {
      const primaryLogoAnchor = document.createElement('a');
      primaryLogoAnchor.href = primaryLogoLink.href;
      primaryLogoAnchor.target = '_blank';
      primaryLogoAnchor.append(createOptimizedPicture(primaryLogoImg.src, primaryLogoImg.alt));
      logoDiv.append(primaryLogoAnchor);
      moveInstrumentation(primaryLogoLink, primaryLogoAnchor);
    }
  }

  if (secondaryLogoLink) {
    const secondaryLogoImg = secondaryLogoLink.querySelector('img');
    if (secondaryLogoImg) {
      const secondaryLogoAnchor = document.createElement('a');
      secondaryLogoAnchor.href = secondaryLogoLink.href;
      secondaryLogoAnchor.target = '_blank';
      secondaryLogoAnchor.append(createOptimizedPicture(secondaryLogoImg.src, secondaryLogoImg.alt));
      logoDiv.append(secondaryLogoAnchor);
      moveInstrumentation(secondaryLogoLink, secondaryLogoAnchor);
    }
  }
  nav.append(logoDiv);

  const collapseDiv = document.createElement('div');
  collapseDiv.className = 'header-collapse header-navbar-collapse header-justify-content-center';
  collapseDiv.id = 'navbarSupportedContent';

  const navItemDiv = document.createElement('div');
  navItemDiv.className = 'header-nav-item header-navigation';
  const navCmp = document.createElement('nav');
  navCmp.className = 'header-cmp-navigation';
  navCmp.setAttribute('itemscope', '');
  navCmp.setAttribute('itemtype', 'http://schema.org/SiteNavigationElement');
  navCmp.setAttribute('role', 'navigation');
  const navGroup = document.createElement('ul');
  navGroup.className = 'header-cmp-navigation__group';

  const navigationLinks = block.querySelectorAll('[data-aue-model="navigationLink"]');
  navigationLinks.forEach((linkNode) => {
    const linkItem = document.createElement('li');
    linkItem.className = 'header-cmp-navigation__item header-cmp-navigation__item--level-0';
    const linkAnchor = document.createElement('a');
    linkAnchor.className = 'header-cmp-navigation__item-link';
    const link = linkNode.querySelector('[data-aue-prop="link"]');
    const label = linkNode.querySelector('[data-aue-prop="label"]');

    if (link) {
      linkAnchor.href = link.href;
      linkAnchor.textContent = label ? label.textContent : link.textContent;
      moveInstrumentation(link, linkAnchor);
    } else if (label) {
      linkAnchor.textContent = label.textContent;
    }
    linkItem.append(linkAnchor);
    navGroup.append(linkItem);
    moveInstrumentation(linkNode, linkItem);
  });
  navCmp.append(navGroup);
  navItemDiv.append(navCmp);
  collapseDiv.append(navItemDiv);

  const sectionDiv = document.createElement('div');
  sectionDiv.className = 'header-section header-d-flex header-align-items-center header-justify-content-end';

  const searchIconDiv = document.createElement('div');
  searchIconDiv.className = 'header-search-icon header-country-selector-trigger header-d-flex header-align-items-center';
  searchIconDiv.setAttribute('data-toggle', 'modal');
  searchIconDiv.setAttribute('data-target', '#countryModal');

  const countryCodeSpan = document.createElement('span');
  countryCodeSpan.className = 'header-country-code header-country-code';
  const countryCode = block.querySelector('[data-aue-prop="countryCode"]');
  if (countryCode) {
    countryCodeSpan.textContent = countryCode.textContent;
    moveInstrumentation(countryCode, countryCodeSpan);
  }
  searchIconDiv.append(countryCodeSpan);

  const countryFlagImg = block.querySelector('[data-aue-prop="countryFlag"]');
  if (countryFlagImg) {
    searchIconDiv.append(createOptimizedPicture(countryFlagImg.src, countryFlagImg.alt, false, [{ width: '40' }]));
    moveInstrumentation(countryFlagImg, searchIconDiv.querySelector('picture:last-child'));
  }

  const dropdownIconImg = block.querySelector('[data-aue-prop="dropdownIcon"]');
  if (dropdownIconImg) {
    const dropdownIconElement = createOptimizedPicture(dropdownIconImg.src, dropdownIconImg.alt, false, [{ width: '20' }]);
    dropdownIconElement.querySelector('img').className = 'header-dropdown-icon header-dropdown-icon';
    searchIconDiv.append(dropdownIconElement);
    moveInstrumentation(dropdownIconImg, dropdownIconElement);
  }
  sectionDiv.append(searchIconDiv);
  collapseDiv.append(sectionDiv);
  nav.append(collapseDiv);

  const itcHeaderIconList = document.createElement('div');
  itcHeaderIconList.className = 'header-itc-header-icon-list';

  const searchBlock = document.createElement('div');
  searchBlock.id = 'searchBlock';
  searchBlock.className = 'header-search-block header-search-block header-hidden';

  const searchBox = document.createElement('div');
  searchBox.id = 'searchBox';
  searchBox.className = 'header-search-box header-search-box';

  const searchContainer = document.createElement('div');
  searchContainer.id = 'searchContainer';
  searchContainer.className = 'header-search-container header-search-container header-hidden';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'searchInput';
  searchInput.placeholder = 'Search';
  searchContainer.append(searchInput);

  const searchButton = document.createElement('button');
  searchButton.id = 'searchButton';
  const searchIcon = block.querySelector('[data-aue-prop="searchIcon"]');
  if (searchIcon) {
    searchButton.append(createOptimizedPicture(searchIcon.src, searchIcon.alt));
    moveInstrumentation(searchIcon, searchButton.querySelector('picture'));
  }
  searchContainer.append(searchButton);
  searchBox.append(searchContainer);

  const closeButton = document.createElement('img');
  closeButton.id = 'closeButton';
  const closeIcon = block.querySelector('[data-aue-prop="closeIcon"]');
  if (closeIcon) {
    closeButton.src = closeIcon.src;
    closeButton.alt = closeIcon.alt;
    closeButton.loading = 'lazy';
    moveInstrumentation(closeIcon, closeButton);
  }
  searchBox.append(closeButton);
  searchBlock.append(searchBox);

  const searchResults = document.createElement('div');
  searchResults.id = 'searchResults';
  searchResults.className = 'header-search-results header-search-results header-hidden';

  const popularSuggestions = document.createElement('h4');
  popularSuggestions.className = 'header-resultList header-resultList';
  popularSuggestions.textContent = 'Popular Suggestions';
  searchResults.append(popularSuggestions);

  const suggestionsList = document.createElement('ul');
  suggestionsList.id = 'suggestionsList';
  searchResults.append(suggestionsList);

  const pages = document.createElement('h4');
  pages.className = 'header-resultList header-resultList';
  pages.textContent = 'Pages';
  searchResults.append(pages);

  const productsList = document.createElement('ul');
  productsList.id = 'productsList';
  productsList.className = 'header-products header-products';
  searchResults.append(productsList);

  const viewAllButton = document.createElement('button');
  viewAllButton.id = 'viewAllButton';
  viewAllButton.textContent = 'VIEW ALL ITEMS';
  searchResults.append(viewAllButton);
  searchBlock.append(searchResults);
  itcHeaderIconList.append(searchBlock);

  const searchNavLink = document.createElement('a');
  searchNavLink.className = 'header-nav-link';
  const searchIconCopy = block.querySelector('[data-aue-prop="searchIcon"]');
  if (searchIconCopy) {
    searchNavLink.append(createOptimizedPicture(searchIconCopy.src, searchIconCopy.alt));
  }
  const searchSpan = document.createElement('span');
  searchSpan.className = 'header-d-block';
  searchSpan.textContent = 'Search';
  searchNavLink.append(searchSpan);
  itcHeaderIconList.append(searchNavLink);

  const navItemLi = document.createElement('li');
  navItemLi.className = 'header-nav-item';
  const navLinkA = document.createElement('a');
  navLinkA.className = 'header-nav-link';
  navItemLi.append(navLinkA);
  itcHeaderIconList.append(navItemLi);

  nav.append(itcHeaderIconList);
  headerContainer.append(nav);

  const modalDiv = document.createElement('div');
  modalDiv.className = 'header-modal header-modal header-fade header-itc-country-selector header-show';
  modalDiv.id = 'countryModal';
  modalDiv.tabIndex = -1;
  modalDiv.setAttribute('role', 'dialog');
  modalDiv.setAttribute('aria-labelledby', 'countryModalLabel');
  modalDiv.setAttribute('aria-modal', 'true');
  modalDiv.style.display = 'block';

  const modalDialog = document.createElement('div');
  modalDialog.className = 'header-modal-dialog header-modal-dialog header-modal-dialog-centered';
  modalDialog.setAttribute('role', 'document');

  const modalContent = document.createElement('div');
  modalContent.className = 'header-modal-content header-modal-content';

  const modalHeader = document.createElement('div');
  modalHeader.className = 'header-modal-header header-modal-header header-border-0 header-text-center';

  const w100Div = document.createElement('div');
  w100Div.className = 'header-w-100 header-w-100';

  const modalTitle = document.createElement('h2');
  modalTitle.className = 'header-modal-title header-modal-title';
  modalTitle.innerHTML = 'SELECT YOUR <br>KITCHENS OF INDIA';
  w100Div.append(modalTitle);

  const experienceText = document.createElement('p');
  experienceText.className = 'header-experience-text header-experience-text';
  experienceText.textContent = 'Experience';
  w100Div.append(experienceText);
  modalHeader.append(w100Div);
  modalContent.append(modalHeader);

  const modalBody = document.createElement('div');
  modalBody.className = 'header-modal-body header-modal-body';

  const countryOptionsDiv = document.createElement('div');
  countryOptionsDiv.className = 'header-country-options header-country-options header-d-flex header-justify-content-center header-align-items-center';

  const countryOptions = block.querySelectorAll('[data-aue-model="countryOption"]');
  countryOptions.forEach((optionNode) => {
    const countryOptionDiv = document.createElement('div');
    countryOptionDiv.className = 'header-country-option header-country-option header-mx-3 header-d-flex header-flex-column header-align-items-center';

    const flagImg = optionNode.querySelector('[data-aue-prop="flag"]');
    if (flagImg) {
      countryOptionDiv.append(createOptimizedPicture(flagImg.src, flagImg.alt));
      countryOptionDiv.querySelector('img').className = 'header-country-flag header-country-flag';
      moveInstrumentation(flagImg, countryOptionDiv.querySelector('picture'));
    }

    const countryNameP = document.createElement('p');
    countryNameP.className = 'header-country-name header-country-name';
    const countryName = optionNode.querySelector('[data-aue-prop="countryName"]');
    if (countryName) {
      countryNameP.textContent = countryName.textContent;
      moveInstrumentation(countryName, countryNameP);
    }
    countryOptionDiv.append(countryNameP);
    countryOptionsDiv.append(countryOptionDiv);
    moveInstrumentation(optionNode, countryOptionDiv);
  });

  modalBody.append(countryOptionsDiv);
  modalContent.append(modalBody);
  modalDialog.append(modalContent);
  modalDiv.append(modalDialog);

  block.textContent = '';
  block.append(headerContainer);
  block.append(modalDiv);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
