import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const navLinks = [];
  const langLinks = [];

  // Separate nav-link and lang-link items using content detection
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 2) {
      const linkCell = cells[0];
      const textCell = cells[1];
      if (linkCell.querySelector('a') && textCell.textContent.trim() !== '') {
        // Distinguish based on the 'Language value' text from the EDS structure for lang-link
        if (textCell.textContent.includes('Language value')) {
          langLinks.push(row);
        } else {
          navLinks.push(row);
        }
      }
    }
  });

  block.textContent = '';

  const section = document.createElement('section');
  section.classList.add('component-global-navigation', 'notranslate', 'scrolled');
  section.setAttribute('data-once', 'global-navigation');

  // Search Module
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

  const searchCol = document.createElement('div');
  searchCol.classList.add('col-10', 'offset-1', 'search-col');
  const searchBoxContainer = document.createElement('div');
  searchBoxContainer.classList.add('search-box-container');
  const searchForm = document.createElement('form');
  searchForm.classList.add('views-exposed-form', 'bef-exposed-form');
  searchForm.setAttribute('action', '/en/search-results');
  searchForm.setAttribute('method', 'get');
  searchForm.setAttribute('accept-charset', 'UTF-8');

  const searchInputContainer = document.createElement('div');
  searchInputContainer.classList.add('search-box-container');
  const searchItem = document.createElement('div');
  searchItem.classList.add('js-form-item', 'form-item', 'form-type-search-api-autocomplete', 'js-form-type-search-api-autocomplete', 'form-item-keys', 'js-form-item-keys', 'form-no-label');
  const searchInput = document.createElement('input');
  searchInput.classList.add('form-autocomplete', 'top-search-text-box', 'form-text', 'ui-autocomplete-input');
  searchInput.setAttribute('placeholder', 'Type to Search...');
  searchInput.setAttribute('type', 'text');
  searchInput.setAttribute('id', 'edit-keys');
  searchInput.setAttribute('name', 'keys');
  searchInput.setAttribute('value', '');
  searchInput.setAttribute('size', '30');
  searchInput.setAttribute('maxlength', '128');
  searchInput.setAttribute('autocomplete', 'off');
  searchInput.setAttribute('aria-label', 'Type to Search...');

  const searchSubmit = document.createElement('input');
  searchSubmit.classList.add('top-search', 'button', 'js-form-submit', 'form-submit', 'disabled');
  searchSubmit.setAttribute('type', 'submit');
  searchSubmit.setAttribute('id', 'edit-submit-lions-solr-search');
  searchSubmit.setAttribute('value', 'Search');
  searchSubmit.setAttribute('disabled', '');
  searchSubmit.setAttribute('aria-label', 'Submit button');

  searchItem.append(searchInput);
  searchInputContainer.append(searchItem, searchSubmit);
  searchForm.append(searchInputContainer);
  searchBoxContainer.append(searchForm);
  searchCol.append(searchBoxContainer);
  searchRow.append(navTrigger, searchCol);
  searchContainer.append(searchRow);
  searchModule.append(searchContainer);
  section.append(searchModule);

  // Desktop Navigation
  const desktopDiv = document.createElement('div');
  desktopDiv.classList.add('desktop');
  const relativeWrapper = document.createElement('div');
  relativeWrapper.classList.add('relative-wrapper');
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container');

  const rowUtility = document.createElement('div');
  rowUtility.classList.add('row', 'row-utility');
  const utilityBar = document.createElement('div');
  utilityBar.classList.add('utility-bar');

  // Utility links (hardcoded from original HTML as they are not part of the model)
  const utilityLinksData = [
    { href: '/en/node/18551', text: 'LION AI', classes: ['chatbase-btn'] },
    { href: '/en/node/18531', text: 'LCIF' },
    { href: 'https://lionportal.org', text: 'LION PORTAL', target: '_blank', ariaLabel: 'LION PORTAL - open in a new tab' },
    { href: 'https://www2.lionsclubs.org', text: 'SHOP', target: '_blank', ariaLabel: 'SHOP - open in a new tab' },
    { href: 'https://lionscon.lionsclubs.org', text: 'CONVENTION', target: '_blank', ariaLabel: 'CONVENTION - open in a new tab' },
    { href: '/en/start-our-approach/club-locator', text: 'FIND A CLUB' },
  ];

  utilityLinksData.forEach((linkData) => {
    const a = document.createElement('a');
    a.href = linkData.href;
    a.textContent = linkData.text;
    if (linkData.classes) a.classList.add(...linkData.classes);
    if (linkData.target) a.target = linkData.target;
    if (linkData.ariaLabel) a.setAttribute('aria-label', linkData.ariaLabel);
    utilityBar.append(a);
  });

  // Language Dropdown
  const dropdownLang = document.createElement('div');
  dropdownLang.classList.add('dropdown-lang');
  const langButton = document.createElement('button');
  langButton.setAttribute('type', 'button');
  langButton.textContent = 'EN';
  const langMenu = document.createElement('ul');
  langMenu.classList.add('dropdown-lang-menu');

  langLinks.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    const linkEl = row.querySelector('a');
    const cells = [...row.children]; // Use content detection
    const languageText = cells[1].textContent.trim();

    const a = document.createElement('a');
    if (linkEl) a.href = linkEl.href;
    a.textContent = languageText;
    li.append(a);
    langMenu.append(li);
  });

  langButton.addEventListener('click', () => {
    langMenu.classList.toggle('show');
  });
  dropdownLang.append(langButton, langMenu);
  utilityBar.append(dropdownLang);
  rowUtility.append(utilityBar);
  desktopContainer.append(rowUtility);

  const rowTop = document.createElement('div');
  rowTop.classList.add('row', 'row-top');
  const col = document.createElement('div');
  col.classList.add('col');
  const innerRow = document.createElement('div');
  innerRow.classList.add('row');
  const logoTagCol = document.createElement('div');
  logoTagCol.classList.add('col', 'logo-tag-col');

  const logoLink = document.createElement('a');
  logoLink.href = '/en';
  logoLink.classList.add('logo', 'logo-full');
  logoLink.setAttribute('aria-label', 'Open this option');
  logoTagCol.append(logoLink);

  const visibleMobile = document.createElement('div');
  visibleMobile.classList.add('visible-mobile');
  const btnsScrolled = document.createElement('div');
  btnsScrolled.classList.add('btns-scrolled');

  const joinBtnMobile = document.createElement('a');
  joinBtnMobile.href = '/en/node/16841';
  joinBtnMobile.setAttribute('tabindex', '-1');
  joinBtnMobile.textContent = 'Join';
  const donateBtnMobile = document.createElement('a');
  donateBtnMobile.href = '/en/node/13261';
  donateBtnMobile.setAttribute('tabindex', '-1');
  donateBtnMobile.textContent = 'Donate';
  btnsScrolled.append(joinBtnMobile, donateBtnMobile);

  const searchMobile = document.createElement('a');
  searchMobile.href = '#';
  searchMobile.classList.add('search', 'search-mobile', 'visible-mobile');
  searchMobile.setAttribute('aria-label', 'Search');
  searchMobile.setAttribute('tabindex', '-1');
  searchMobile.addEventListener('click', (e) => {
    e.preventDefault();
    searchModule.classList.toggle('active'); // Assuming 'active' class controls visibility
  });

  const mobileNavTrigger = document.createElement('a');
  mobileNavTrigger.href = '#';
  mobileNavTrigger.classList.add('mobile-nav-trigger', 'visible-mobile');
  mobileNavTrigger.setAttribute('aria-label', 'Mobile menu');
  mobileNavTrigger.setAttribute('tabindex', '-1');
  for (let i = 0; i < 4; i += 1) {
    mobileNavTrigger.append(document.createElement('span'));
  }

  visibleMobile.append(btnsScrolled, searchMobile, mobileNavTrigger);
  logoTagCol.append(visibleMobile);
  innerRow.append(logoTagCol);
  col.append(innerRow);
  rowTop.append(col);

  const utilityCol = document.createElement('div');
  utilityCol.classList.add('col', 'utility-col', 'visible-desktop');
  const menuParent = document.createElement('div');
  menuParent.classList.add('menu-parent');
  const ctaCol = document.createElement('div');
  ctaCol.classList.add('cta-col');

  const joinBtnDesktop = document.createElement('a');
  joinBtnDesktop.href = '/en/node/16841';
  joinBtnDesktop.classList.add('joinBtn', 'btn', 'bg-primary-e2-blue');
  joinBtnDesktop.textContent = 'Join';
  const donateBtnDesktop = document.createElement('a');
  donateBtnDesktop.href = '/en/node/13261';
  donateBtnDesktop.classList.add('donateBtn', 'btn');
  donateBtnDesktop.textContent = 'Donate';
  const searchDesktop = document.createElement('a');
  searchDesktop.href = '#';
  searchDesktop.classList.add('search');
  searchDesktop.setAttribute('aria-label', 'Search');
  searchDesktop.addEventListener('click', (e) => {
    e.preventDefault();
    searchModule.classList.toggle('active'); // Assuming 'active' class controls visibility
  });

  ctaCol.append(joinBtnDesktop, donateBtnDesktop, searchDesktop);
  menuParent.append(ctaCol);
  utilityCol.append(menuParent);
  rowTop.append(utilityCol);
  desktopContainer.append(rowTop);

  const rowBottom = document.createElement('div');
  rowBottom.classList.add('row', 'row-bottom');

  const mobileButtonCol = document.createElement('div');
  mobileButtonCol.classList.add('col-12', 'visible-mobile');
  const mobileButtonsInner = document.createElement('div');
  mobileButtonsInner.classList.add('mobile-button-col');
  const joinBtnMobileBottom = document.createElement('a');
  joinBtnMobileBottom.href = '/en/node/16841';
  joinBtnMobileBottom.classList.add('joinBtn', 'btn', 'bg-primary-e2-blue');
  joinBtnMobileBottom.textContent = 'Join';
  const donateBtnMobileBottom = document.createElement('a');
  donateBtnMobileBottom.href = '/en/node/13261';
  donateBtnMobileBottom.classList.add('donateBtn', 'btn');
  donateBtnMobileBottom.textContent = 'Donate';
  mobileButtonsInner.append(joinBtnMobileBottom, donateBtnMobileBottom);
  mobileButtonCol.append(mobileButtonsInner);
  rowBottom.append(mobileButtonCol);

  const menuCol = document.createElement('div');
  menuCol.classList.add('col-12', 'menu-col');
  const menuColInner = document.createElement('div');
  menuColInner.classList.add('menu-col-inner');

  const tbm = document.createElement('div');
  tbm.classList.add('tbm', 'tbm-tb-mega-main', 'tbm-no-arrows', 'tb-megamenu', 'tb-megamenu-tb-mega-main');
  tbm.setAttribute('data-breakpoint', '1200');
  tbm.setAttribute('aria-label', 'tb-mega-main navigation');
  tbm.setAttribute('data-initialized', 'true');

  const btnNavbar = document.createElement('button');
  btnNavbar.classList.add('btn', 'btn-navbar', 'tb-megamenu-button');
  btnNavbar.setAttribute('type', 'button');
  btnNavbar.setAttribute('aria-label', 'reorder');
  const btnNavbarIcon = document.createElement('i');
  btnNavbarIcon.classList.add('fa', 'fa-reorder');
  btnNavbar.append(btnNavbarIcon);

  const navCollapse = document.createElement('div');
  navCollapse.classList.add('nav-collapse');
  const tbmNav = document.createElement('ul');
  tbmNav.classList.add('tbm-nav', 'level-0', 'items-4', 'tb-megamenu-nav', 'nav');

  // Populate tbmNav with navLinks (simplified structure as original HTML is complex)
  navLinks.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add('tbm-item', 'level-1', 'tb-megamenu-item', 'mega');
    const linkEl = row.querySelector('a');
    const cells = [...row.children]; // Use content detection
    const textEl = cells[1];

    const a = document.createElement('a');
    a.classList.add('tbm-link', 'level-1');
    if (linkEl) a.href = linkEl.href;
    a.textContent = textEl.textContent.trim();
    li.append(a);
    tbmNav.append(li);
  });

  navCollapse.append(tbmNav);
  tbm.append(btnNavbar, navCollapse);
  menuColInner.append(tbm);

  // Mobile utility bar (duplicate of desktop one, but for mobile)
  const mobileUtilityBarDiv = document.createElement('div');
  mobileUtilityBarDiv.classList.add('visible-mobile');
  const mobileUtilityBar = document.createElement('div');
  mobileUtilityBar.classList.add('utility-bar');

  utilityLinksData.forEach((linkData) => {
    const a = document.createElement('a');
    a.href = linkData.href;
    a.textContent = linkData.text;
    if (linkData.classes) a.classList.add(...linkData.classes);
    if (linkData.target) a.target = linkData.target;
    if (linkData.ariaLabel) a.setAttribute('aria-label', linkData.ariaLabel);
    mobileUtilityBar.append(a);
  });

  const mobileDropdownLang = document.createElement('div');
  mobileDropdownLang.classList.add('dropdown-lang');
  const mobileLangButton = document.createElement('button');
  mobileLangButton.setAttribute('type', 'button');
  mobileLangButton.textContent = 'EN';
  const mobileLangMenu = document.createElement('ul');
  mobileLangMenu.classList.add('dropdown-lang-menu');

  langLinks.forEach((row) => {
    const li = document.createElement('li');
    const linkEl = row.querySelector('a');
    const cells = [...row.children]; // Use content detection
    const languageText = cells[1].textContent.trim();

    const a = document.createElement('a');
    if (linkEl) a.href = linkEl.href;
    a.textContent = languageText;
    li.append(a);
    mobileLangMenu.append(li);
  });

  mobileLangButton.addEventListener('click', () => {
    mobileLangMenu.classList.toggle('show');
  });
  mobileDropdownLang.append(mobileLangButton, mobileLangMenu);
  mobileUtilityBar.append(mobileDropdownLang);
  mobileUtilityBarDiv.append(mobileUtilityBar);
  menuColInner.append(mobileUtilityBarDiv);

  menuCol.append(menuColInner);
  rowBottom.append(menuCol);
  desktopContainer.append(rowBottom);
  relativeWrapper.append(desktopContainer);
  desktopDiv.append(relativeWrapper);
  section.append(desktopDiv);

  block.append(section);

  // Add event listener for mobile nav trigger
  mobileNavTrigger.addEventListener('click', () => {
    navCollapse.classList.toggle('show');
    mobileNavTrigger.classList.toggle('collapsed');
  });

  // Add event listener for the main navigation toggle button (desktop/tablet)
  btnNavbar.addEventListener('click', () => {
    navCollapse.classList.toggle('show');
    btnNavbar.classList.toggle('collapsed');
  });
}
