import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [logoRow, searchPlaceholderRow, ...itemRows] = [...block.children];

  // Create header container
  const header = document.createElement('header');
  header.classList.add('bg-surface-navbar', 'border-b', 'border-b-stroke-muted', 'z-desktop-nav', 'relative');
  header.setAttribute('data-nav-header', '');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'py-3');
  header.append(containerDiv);

  // Create main navigation
  const nav = document.createElement('nav');
  nav.classList.add('lg:grid-full', 'flex', 'justify-between', 'gap-2', 'lg:gap-grid-gutter');
  nav.setAttribute('data-desktop-menu-wrapper', '');
  nav.setAttribute('aria-label', 'Main menu');
  containerDiv.append(nav);

  // Logo section
  const logoSection = document.createElement('div');
  logoSection.classList.add('col-start-1', '[.nav-shrunk_&]:max-h-[30px]', 'max-h-[60px]', 'flex', 'items-center', 'justify-start');
  nav.append(logoSection);

  const logoLink = document.createElement('a');
  logoLink.classList.add('inline-flex', 'items-center', 'shrink-0', '[[data-mobile-menu]_&]:outline-none', 'not-[[data-mobile-menu]_&]:theme-focus-outline', 'dark-mode:bg-denali', 'dark-mode:py-0.5', 'dark-mode:px-0.5', 'forced-colors:px-0.5', 'forced-colors:py-0.5', 'forced-colors:bg-[CanvasText]!');
  logoLink.setAttribute('data-brand-logo-link', '');
  logoSection.append(logoLink);

  const srOnlySpan = document.createElement('span');
  srOnlySpan.classList.add('sr-only');
  srOnlySpan.textContent = 'World Wildlife Fund';
  logoLink.append(srOnlySpan);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  } else {
    // If no picture, just append the content of the cell (e.g., SVG directly)
    moveInstrumentation(logoRow.firstElementChild, logoLink);
    while (logoRow.firstElementChild.firstChild) {
      logoLink.append(logoRow.firstElementChild.firstChild);
    }
  }

  // Main content section (desktop menu, search, primary actions)
  const mainContentSection = document.createElement('div');
  mainContentSection.classList.add('lg:col-start-2', 'lg:col-span-14', 'flex', 'justify-start', 'items-center');
  nav.append(mainContentSection);

  const mainContentWrapper = document.createElement('div');
  mainContentWrapper.classList.add('flex', 'justify-between', 'items-center', 'gap-4', 'xl:gap-grid-gutter', 'w-full');
  mainContentSection.append(mainContentWrapper);

  // Desktop menu
  const desktopMenu = document.createElement('div');
  desktopMenu.classList.add('hidden', 'lg:flex', 'justify-center', 'items-center');
  desktopMenu.setAttribute('data-desktop-menu', '');
  mainContentWrapper.append(desktopMenu);

  const primaryNavUl = document.createElement('ul');
  primaryNavUl.classList.add('flex', 'flex-row', 'justify-center', 'items-center', 'lg:gap-6', 'xl:gap-8');
  primaryNavUl.setAttribute('data-primary-nav', '');
  desktopMenu.append(primaryNavUl);

  // Filter itemRows based on their content structure
  // Link Groups: 2 cells, first cell is text (label), second cell is a container of links
  // Primary Actions: 2 cells, first cell is a link (href), second cell is text (link text)
  const linkGroups = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && !cells[0].querySelector('a') && cells[1].querySelectorAll('a').length > 0;
  });
  const primaryActions = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('a') && !cells[1].querySelector('a');
  });

  linkGroups.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add('group', 'list-none', 'leading-[1.1]');
    li.setAttribute('data-has-subnav', '');
    primaryNavUl.append(li);

    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a'));
    const linksCell = cells.find(cell => cell.querySelectorAll('a').length > 0);

    const button = document.createElement('button');
    button.classList.add('lg:text-16', 'xl:text-18', 'link', 'group/nav-link', 'text-foreground', 'text-start', 'lg:text-15', 'xl:text-16', 'no-underline', 'font-semibold', 'inline-flex', 'flex-row', 'items-start', 'justify-start', 'gap-2', 'forced-colors:text-[ButtonText]', 'hocus:underline', 'hocus:text-brand-1', 'hocus:underline-offset-8', 'group-[.active]:underline', 'group-[.active]:text-brand-1', 'group-[.active]:decoration-[3px]', 'group-[.active]:underline-offset-8', 'motion-safe:not-focus-visible:transition-underline');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('data-open-subnav', '');
    button.textContent = labelCell ? labelCell.textContent : ''; // Use textContent for label
    li.append(button);

    const arrowDiv = document.createElement('div');
    arrowDiv.classList.add('group-[.active]:-rotate-180', 'motion-safe:transition-transform', 'will-change-transform', 'flex', 'h-[1lh]', 'items-center');
    button.append(arrowDiv);

    const arrowImg = document.createElement('img');
    arrowImg.alt = 'svg file';
    arrowImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775555061733.svg+xml'; // Placeholder, replace if dynamic
    arrowDiv.append(arrowImg);

    const subnavDiv = document.createElement('div');
    subnavDiv.classList.add('transition-display', 'max-lg:overflow-auto', 'max-lg:w-full', 'max-lg:h-[calc(100dvh-var(--navbar-height))]', 'duration-200', 'hidden', 'allow-discrete', 'opacity-0', 'starting:group-[.active]:opacity-0', 'group-[.active]:opacity-100', 'group-[.active]:block', 'absolute', 'bg-surface-navbar', 'inset-x-0', 'top-full', 'py-12', 'lg:py-2xl', 'shadow-md', 'border-t', 'border-t-stroke-muted');
    subnavDiv.setAttribute('data-subnav', '');
    li.append(subnavDiv);

    const subnavContainer = document.createElement('div');
    subnavContainer.classList.add('container', 'grid-full');
    subnavDiv.append(subnavContainer);

    const subnavGrid = document.createElement('div');
    subnavGrid.classList.add('grid-centered-12', 'w-full');
    subnavContainer.append(subnavGrid);

    const subnavContentGrid = document.createElement('div');
    subnavContentGrid.classList.add('grid', 'grid-cols-1', 'lg:grid-cols-12', 'gap-13', 'lg:gap-grid-gutter');
    subnavContentGrid.setAttribute('data-animated', '');
    subnavGrid.append(subnavContentGrid);

    const mobileTitleDiv = document.createElement('div');
    mobileTitleDiv.classList.add('w-full', 'text-h6', 'lg:hidden', 'animated-fade-in-up');
    mobileTitleDiv.textContent = labelCell ? labelCell.textContent : '';
    subnavContentGrid.append(mobileTitleDiv);

    // Parse links within the linksCell
    const subLinksUl = document.createElement('ul');
    subLinksUl.classList.add('flex', 'flex-col', 'gap-xs');

    if (linksCell) {
      [...linksCell.children].forEach((linkWrapper) => {
        const subLinkLi = document.createElement('li');
        const subLink = linkWrapper.querySelector('a');
        if (subLink) {
          const newSubLink = document.createElement('a');
          newSubLink.href = subLink.href;
          newSubLink.textContent = subLink.textContent;
          newSubLink.classList.add('link', 'text-foreground', 'text-p2', 'xl:text-p1', 'transition-display', 'hocus:underline', 'hocus:text-foreground', 'motion-safe:not-focus-visible:transition-underline');
          newSubLink.setAttribute('data-desktop-nav-link', '');
          moveInstrumentation(linkWrapper, newSubLink);
          subLinkLi.append(newSubLink);
        }
        subLinksUl.append(subLinkLi);
      });
    }

    const subnavColumn = document.createElement('div');
    subnavColumn.classList.add('animated-fade-in-up', 'lg:col-span-4');
    const subnavColumnWrapper = document.createElement('div');
    subnavColumnWrapper.classList.add('not-last:mb-md', 'md:mb-0', 'flex', 'flex-col');
    const subnavColumnTitle = document.createElement('p');
    subnavColumnTitle.classList.add('mb-xs', 'text-15', 'xl:text-p2', 'font-stretch-normal', 'font-bold', 'text-foreground-strong');
    subnavColumnTitle.textContent = 'What we care about'; // Placeholder, customize if needed
    subnavColumnWrapper.append(subnavColumnTitle, subLinksUl);
    subnavColumn.append(subnavColumnWrapper);
    subnavContentGrid.append(subnavColumn);

    // Add event listener for subnav toggle
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', !isExpanded);
      li.classList.toggle('active', !isExpanded);
      subnavDiv.classList.toggle('group-[.active]:block', !isExpanded);
      subnavDiv.classList.toggle('group-[.active]:opacity-100', !isExpanded);
      subnavDiv.classList.toggle('opacity-0', isExpanded);
    });
  });

  // Search section
  const searchWrapper = document.createElement('div');
  searchWrapper.classList.add('hidden', 'lg:flex', 'ml-4', 'lg:ml-0', 'justify-center', 'items-center');
  mainContentWrapper.append(searchWrapper);

  const searchButton = document.createElement('button');
  searchButton.classList.add('group', 'inline-flex', 'gap-2', 'p-3', 'xl:p-3.5', 'border-1', 'rounded-full', 'items-center', 'cursor-pointer', 'transition-colors', 'border-navbar-search-button-foreground', 'text-navbar-search-button-foreground', 'bg-navbar-search-button-surface', 'hocus:text-navbar-search-button-foreground-accent', 'hocus:bg-navbar-search-button-surface-accent', 'hocus:border-navbar-search-button-surface-accent', 'aria-expanded:bg-navbar-search-button-surface-active', 'aria-expanded:hocus:bg-navbar-search-button-surface-active', 'aria-expanded:hocus:text-navbar-search-button-foreground-active', 'aria-expanded:text-navbar-search-button-foreground-active', 'theme-focus-outline');
  searchButton.setAttribute('aria-label', 'Search');
  searchButton.setAttribute('data-toggle-search', '');
  searchWrapper.append(searchButton);

  const searchImg = document.createElement('img');
  searchImg.alt = 'svg file';
  searchImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775555061745.svg+xml'; // Placeholder, replace if dynamic
  searchButton.append(searchImg);

  // Primary actions (Gifts, Donate)
  const primaryActionsWrapper = document.createElement('div');
  primaryActionsWrapper.classList.add('lg:ml-2', 'xl:ml-5');
  primaryActionsWrapper.setAttribute('data-desktop-menu', '');
  primaryActionsWrapper.setAttribute('data-keep-open-mobile', '');
  mainContentWrapper.append(primaryActionsWrapper);

  const primaryActionsUl = document.createElement('ul');
  primaryActionsUl.classList.add('flex', 'flex-row', 'gap-1.5', 'xl:gap-4', 'items-center');
  primaryActionsUl.setAttribute('data-primary-nav', '');
  primaryActionsWrapper.append(primaryActionsUl);

  primaryActions.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add('group', 'list-none', 'leading-[1.1]');
    li.setAttribute('data-has-subnav', '');
    primaryActionsUl.append(li);

    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const textCell = cells.find(cell => !cell.querySelector('a'));
    const foundLink = linkCell ? linkCell.querySelector('a') : null;

    if (textCell && textCell.textContent.toLowerCase() === 'donate') {
      const donateDiv = document.createElement('div');
      donateDiv.classList.add('button--zion', 'button', 'split-dropdown', 'leading-none', 'flex', 'items-stretch', 'text-14', 'p-0');
      li.append(donateDiv);

      const donateLink = document.createElement('a');
      donateLink.classList.add('inline-flex', 'rounded-s-full', 'text-14', 'xl:text-18', 'p-[15px]', 'xl:ps-5', 'xl:py-4', 'pe-[13px]!', 'xl:pe-4!', 'border-r', 'border-denali', 'theme-focus-outline', 'forced-colors:border');
      donateLink.href = foundLink ? foundLink.href : '#';
      donateLink.textContent = textCell.textContent;
      donateDiv.append(donateLink);

      const donateButton = document.createElement('button');
      donateButton.classList.add('pl-[15px]', 'pe-5', 'xl:pl-5', 'xl:pe-6', 'max-[374px]:pe-2.5', 'max-[374px]:ps-2', 'rounded-e-full', 'cursor-pointer', 'theme-focus-outline', 'forced-colors:border');
      donateButton.setAttribute('data-open-subnav', '');
      donateButton.setAttribute('aria-expanded', 'false');
      donateButton.setAttribute('aria-label', 'Open dropdown for Donate link');
      donateDiv.append(donateButton);

      const donateImg = document.createElement('img');
      donateImg.alt = 'svg file';
      donateImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775555061755.svg+xml'; // Placeholder
      donateButton.append(donateImg);

      // Add subnav for donate (similar structure to link groups, but content is fixed in original HTML)
      const donateSubnavDiv = document.createElement('div');
      donateSubnavDiv.classList.add('transition-display', 'max-lg:overflow-auto', 'max-lg:w-full', 'max-lg:h-[calc(100dvh-var(--navbar-height))]', 'duration-200', 'hidden', 'allow-discrete', 'opacity-0', 'starting:group-[.active]:opacity-0', 'group-[.active]:opacity-100', 'group-[.active]:block', 'absolute', 'bg-surface-navbar', 'inset-x-0', 'top-full', 'py-12', 'lg:py-2xl', 'shadow-md', 'border-t', 'border-t-stroke-muted');
      donateSubnavDiv.setAttribute('data-subnav', '');
      li.append(donateSubnavDiv);

      // Add event listener for donate dropdown
      donateButton.addEventListener('click', () => {
        const isExpanded = donateButton.getAttribute('aria-expanded') === 'true';
        donateButton.setAttribute('aria-expanded', !isExpanded);
        li.classList.toggle('active', !isExpanded);
        donateSubnavDiv.classList.toggle('group-[.active]:block', !isExpanded);
        donateSubnavDiv.classList.toggle('group-[.active]:opacity-100', !isExpanded);
        donateSubnavDiv.classList.toggle('opacity-0', isExpanded);
      });

    } else if (textCell) {
      const actionLink = document.createElement('a');
      actionLink.classList.add('button', 'text-14', 'xl:text-18', 'p-[15px]', 'xl:px-8', 'xl:py-4', 'forced-colors:border', 'button--sedona');
      actionLink.href = foundLink ? foundLink.href : '#';
      actionLink.textContent = textCell.textContent;
      li.append(actionLink);
    }
  });

  // Mobile menu toggle
  const mobileMenuToggleButton = document.createElement('button');
  mobileMenuToggleButton.classList.add('lg:hidden', 'no-underline', 'flex', 'flex-row', 'items-center', 'gap-2', 'group/toggle', 'ml-4', 'max-[375px]:ml-2', 'lg:ml-5', 'h-3.5', 'theme-focus-outline');
  mobileMenuToggleButton.setAttribute('data-mobile-menu-toggle', '');
  mobileMenuToggleButton.setAttribute('data-mobile-menu-open-text', 'Open Navigation');
  mobileMenuToggleButton.setAttribute('data-mobile-menu-close-text', 'Close Navigation');
  mobileMenuToggleButton.setAttribute('aria-haspopup', 'true');
  mobileMenuToggleButton.setAttribute('aria-expanded', 'false');
  mobileMenuToggleButton.setAttribute('data-open-only', '');
  mainContentWrapper.append(mobileMenuToggleButton);

  const toggleSpan = document.createElement('span');
  toggleSpan.classList.add('relative', 'w-6', 'h-3.5', 'flex', 'flex-col', 'justify-between');
  mobileMenuToggleButton.append(toggleSpan);

  // Burger lines
  const lineClasses = ['top-0', 'top-1/2', 'top-1/2', 'top-full'];
  // The transformClasses array was not used in the original code,
  // and the logic for adding classes based on index is correct.
  // Keeping the original loop structure.

  for (let i = 0; i < 4; i++) {
    const lineSpan = document.createElement('span');
    lineSpan.classList.add('absolute', 'left-0', 'w-full', 'h-[2px]', 'rounded-lg', 'bg-foreground', 'transition-all', 'duration-300', 'ease-in-out', 'group-hover/toggle:bg-foreground-accent', lineClasses[i]);
    if (i === 0 || i === 3) { // First and last lines disappear
      lineSpan.classList.add('group-aria-expanded/toggle:top-1/2', 'group-aria-expanded/toggle:left-1/2', 'group-aria-expanded/toggle:w-0');
    } else if (i === 1) { // Middle lines rotate
      lineSpan.classList.add('group-aria-expanded/toggle:rotate-45');
    } else if (i === 2) {
      lineSpan.classList.add('group-aria-expanded/toggle:-rotate-45');
    }
    toggleSpan.append(lineSpan);
  }

  const srOnlyToggleText = document.createElement('span');
  srOnlyToggleText.classList.add('sr-only');
  srOnlyToggleText.setAttribute('data-mobile-menu-toggle-text', '');
  srOnlyToggleText.textContent = 'Open Navigation';
  mobileMenuToggleButton.append(srOnlyToggleText);

  // Search dropdown
  const searchDropdownDiv = document.createElement('div');
  searchDropdownDiv.classList.add('transition-display', 'hidden', 'allow-discrete', 'opacity-0', 'starting:[&.active]:opacity-0', '[&.active]:opacity-100', '[&.active]:block', 'absolute', 'bg-surface-navbar', 'inset-x-0', 'py-3xl', 'top-full', 'shadow-md');
  searchDropdownDiv.setAttribute('data-search-dropdown', '');
  containerDiv.append(searchDropdownDiv);

  const searchForm = document.createElement('form');
  searchForm.action = '/search/';
  searchForm.method = 'get';
  searchForm.role = 'search';
  searchForm.classList.add('container');
  searchDropdownDiv.append(searchForm);

  const searchGrid = document.createElement('div');
  searchGrid.classList.add('grid-full');
  searchForm.append(searchGrid);

  const searchInputWrapper = document.createElement('div');
  searchInputWrapper.classList.add('relative', 'grid-centered-12', 'w-full', 'flex', 'items-center', 'gap-4', 'border-b', 'border-stroke-default', 'text-h6');
  searchGrid.append(searchInputWrapper);

  const searchInput = document.createElement('input');
  searchInput.id = 'search-bar';
  searchInput.classList.add('peer', 'w-full', 'bg-transparent', 'pt-2', 'lg:pb-5', 'placeholder-transparent', 'focus:outline-none', 'transition-colors');
  searchInput.setAttribute('data-search-input', '');
  searchInput.name = 'query';
  searchInput.type = 'text';
  searchInput.placeholder = searchPlaceholderRow.textContent.trim();
  searchInputWrapper.append(searchInput);

  const searchLabel = document.createElement('label');
  searchLabel.htmlFor = 'search-bar';
  searchLabel.classList.add('absolute', 'left-0', 'top-2', 'origin-left', 'transform', 'transition-transform', 'duration-200', 'text-h6', 'text-input-label', 'pointer-events-none', 'peer-placeholder-shown:translate-y-0', 'peer-placeholder-shown:scale-100', 'peer-focus:-translate-y-full', 'peer-focus:scale-75', 'peer-focus:font-semibold', 'peer-not-placeholder-shown:-translate-y-full', 'peer-not-placeholder-shown:font-semibold', 'peer-not-placeholder-shown:scale-75');
  searchLabel.textContent = searchPlaceholderRow.textContent.trim();
  searchInputWrapper.append(searchLabel);

  const submitButton = document.createElement('button');
  submitButton.classList.add('button', 'bg-transparent', 'text-foreground', 'p-0', 'theme-focus-outline', 'motion-safe:hocus:translate-x-0.5', 'transition-transform');
  submitButton.type = 'submit';
  searchInputWrapper.append(submitButton);

  const submitImg = document.createElement('img');
  submitImg.alt = 'svg file';
  submitImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775555061786.svg+xml'; // Placeholder
  submitButton.append(submitImg);

  const submitSrOnlySpan = document.createElement('span');
  submitSrOnlySpan.classList.add('sr-only');
  submitSrOnlySpan.textContent = 'Search';
  submitButton.append(submitSrOnlySpan);

  // Event listeners for search toggle
  searchButton.addEventListener('click', () => {
    const isExpanded = searchButton.getAttribute('aria-expanded') === 'true';
    searchButton.setAttribute('aria-expanded', !isExpanded);
    searchDropdownDiv.classList.toggle('active', !isExpanded);
  });

  // Mobile Menu Dialog
  const mobileMenuDialog = document.createElement('dialog');
  mobileMenuDialog.classList.add('fixed', 'transform', 'overflow-y-auto', 'flex-col', 'w-full', 'h-full', 'inset-0', 'bg-surface-navbar', 'backdrop:bg-transparent', 'max-w-full', 'max-h-[100vh]', 'allow-discrete', 'opacity-0', 'starting:[&[open]]:opacity-0', '[&[open]]:opacity-100', 'transition-display', 'duration-200', 'z-(--z-index-mobile-nav-panel)');
  mobileMenuDialog.setAttribute('data-mobile-menu', '');
  header.append(mobileMenuDialog);

  const mobileDialogNavbar = document.createElement('div');
  mobileDialogNavbar.classList.add('mobile-dialog-navbar', 'container', 'relative', 'z-[99]', 'bg-surface-navbar', 'py-3', 'lg:py-4', 'border-b', 'border-b-stroke-muted');
  mobileMenuDialog.append(mobileDialogNavbar);

  const mobileDialogNavbarFlex = document.createElement('div');
  mobileDialogNavbarFlex.classList.add('flex', 'justify-between', 'items-center');
  mobileDialogNavbar.append(mobileDialogNavbarFlex);

  const mobileLogoLink = logoLink.cloneNode(true); // Clone existing logo link
  mobileDialogNavbarFlex.append(mobileLogoLink);

  const mobileCloseButton = mobileMenuToggleButton.cloneNode(true);
  mobileCloseButton.setAttribute('data-close-only', '');
  mobileCloseButton.removeAttribute('data-open-only');
  mobileDialogNavbarFlex.append(mobileCloseButton);

  const mobileMenuContent = document.createElement('div');
  mobileMenuContent.classList.add('w-full', 'bg-surface-navbar');
  mobileMenuDialog.append(mobileMenuContent);

  const mobileMenuParentLinksUl = document.createElement('ul');
  mobileMenuParentLinksUl.classList.add('container', 'w-full', 'mt-5');
  mobileMenuParentLinksUl.setAttribute('data-mobile-menu-parent-links', '');
  mobileMenuParentLinksUl.setAttribute('data-animated', '');
  mobileMenuContent.append(mobileMenuParentLinksUl);

  // Mobile link groups
  linkGroups.forEach((row) => {
    const li = document.createElement('li');
    li.classList.add('w-full', 'animated-fade-in-up');
    li.setAttribute('data-has-nav', '');
    mobileMenuParentLinksUl.append(li);

    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a'));
    const linksCell = cells.find(cell => cell.querySelectorAll('a').length > 0);

    const button = document.createElement('button');
    button.classList.add('text-h6', 'py-6', 'theme-focus-outline', 'font-normal', 'w-full', 'no-underline!', 'inline-flex', 'flex-row', 'justify-between', 'items-center', 'active:underline');
    button.setAttribute('data-open-subnav', '');
    button.setAttribute('aria-haspopup', 'true');
    button.setAttribute('aria-expanded', 'false');
    button.textContent = labelCell ? labelCell.textContent : '';
    li.append(button);

    const arrowImg = document.createElement('img');
    arrowImg.alt = 'svg file';
    arrowImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775555061809.svg+xml'; // Placeholder
    button.append(arrowImg);

    const mobileSubnavDiv = document.createElement('div');
    mobileSubnavDiv.classList.add('fixed', 'shadow-md', 'top-navbar-height', 'hidden', 'inset-0', 'overflow-y-auto', 'bg-surface-navbar', 'w-full', 'h-full', 'z-30', 'motion-safe:translate-x-full', 'motion-safe:starting:data-open:translate-x-full', 'data-open:translate-x-0', 'data-open:flex', 'allow-discrete', 'duration-300');
    mobileSubnavDiv.setAttribute('data-subnav', '');
    li.append(mobileSubnavDiv);

    const mobileSubnavContent = document.createElement('div');
    mobileSubnavContent.classList.add('flex', 'flex-col', 'h-full', 'w-full');
    mobileSubnavDiv.append(mobileSubnavContent);

    const mobileSubnavHeader = document.createElement('div');
    mobileSubnavHeader.classList.add('relative');
    mobileSubnavContent.append(mobileSubnavHeader);

    const mobileSubnavHeaderContainer = document.createElement('div');
    mobileSubnavHeaderContainer.classList.add('container', 'mb-20', 'pb-20');
    mobileSubnavHeader.append(mobileSubnavHeaderContainer);

    const mobileSubnavBackButtonWrapper = document.createElement('div');
    mobileSubnavBackButtonWrapper.classList.add('w-full');
    mobileSubnavHeaderContainer.append(mobileSubnavBackButtonWrapper);

    const mobileSubnavBackButton = document.createElement('button');
    mobileSubnavBackButton.classList.add('w-full', 'text-h6', 'py-6', 'mb-4', 'mt-5', 'link', 'no-underline', 'focus-visible:-outline-offset-[2px]', 'inline-flex', 'flex-row', 'justify-start', 'items-center', 'gap-2', 'active:underline');
    mobileSubnavBackButton.setAttribute('data-subnav-back', '');
    mobileSubnavBackButtonWrapper.append(mobileSubnavBackButton);

    const backArrowImg = document.createElement('img');
    backArrowImg.alt = 'svg file';
    backArrowImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775555061833.svg+xml'; // Placeholder
    mobileSubnavBackButton.append(backArrowImg);

    const backSrOnlySpan = document.createElement('span');
    backSrOnlySpan.classList.add('sr-only');
    backSrOnlySpan.textContent = 'Back to';
    mobileSubnavBackButton.append(backSrOnlySpan);
    mobileSubnavBackButton.append(labelCell ? labelCell.textContent : '');

    const mobileSubnavUl = document.createElement('ul');
    mobileSubnavUl.classList.add('w-full', 'flex', 'flex-col', 'justify-start');
    mobileSubnavUl.setAttribute('data-animated', '');
    mobileSubnavHeaderContainer.append(mobileSubnavUl);

    const mobileSubnavLi = document.createElement('li');
    mobileSubnavLi.classList.add('w-full', 'mb-10', 'last:mb-0', 'list-none', 'animated-fade-in-up');
    mobileSubnavUl.append(mobileSubnavLi);

    const mobileSubnavInnerUl = document.createElement('ul');
    mobileSubnavInnerUl.classList.add('w-full', 'h-full', 'flex', 'flex-col', 'justify-start');
    mobileSubnavLi.append(mobileSubnavInnerUl);

    const mobileSubnavH2 = document.createElement('h2');
    mobileSubnavH2.classList.add('w-full', 'font-bold', 'font-stretch-normal', 'text-p1', 'mb-3', 'text-foreground-strong', 'inline-flex');
    mobileSubnavH2.textContent = 'What we care about'; // Placeholder
    mobileSubnavInnerUl.append(mobileSubnavH2);

    if (linksCell) {
      [...linksCell.children].forEach((linkWrapper) => {
        const subLinkLi = document.createElement('li');
        subLinkLi.classList.add('w-full');
        const subLink = linkWrapper.querySelector('a');
        if (subLink) {
          const newSubLink = document.createElement('a');
          newSubLink.classList.add('w-full', 'flex-1', 'text-p1', 'py-3', 'link', 'focus-visible:-outline-offset-[2px]', 'inline-flex', 'active:underline');
          newSubLink.href = subLink.href;
          newSubLink.textContent = subLink.textContent;
          moveInstrumentation(linkWrapper, newSubLink);
          subLinkLi.append(newSubLink);
        }
        mobileSubnavInnerUl.append(subLinkLi);
      });
    }

    // Event listeners for mobile subnav
    button.addEventListener('click', () => {
      mobileSubnavDiv.setAttribute('data-open', 'true');
    });
    mobileSubnavBackButton.addEventListener('click', () => {
      mobileSubnavDiv.removeAttribute('data-open');
    });
  });

  // Mobile primary actions
  const mobilePrimaryActionsContainer = document.createElement('div');
  mobilePrimaryActionsContainer.classList.add('container', 'my-2');
  mobileMenuContent.append(mobilePrimaryActionsContainer);

  const mobilePrimaryActionsUl = document.createElement('ul');
  mobilePrimaryActionsUl.classList.add('gap-2.5', 'flex', 'justify-center', 'items-center');
  mobilePrimaryActionsUl.setAttribute('data-animated', '');
  mobilePrimaryActionsContainer.append(mobilePrimaryActionsUl);

  primaryActions.forEach((row) => {
    const li = document.createElement('li');
    li.classList.add('animated-fade-in-up', 'w-full');
    mobilePrimaryActionsUl.append(li);

    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const textCell = cells.find(cell => !cell.querySelector('a'));
    const foundLink = linkCell ? linkCell.querySelector('a') : null;

    const actionLink = document.createElement('a');
    actionLink.classList.add('mobile-primary-action', 'button', 'w-full', 'text-14', 'p-[15px]', 'xl:px-8', 'xl:py-4', 'forced-colors:border');
    actionLink.href = foundLink ? foundLink.href : '#';
    actionLink.textContent = textCell ? textCell.textContent : '';

    if (textCell && textCell.textContent.toLowerCase() === 'gifts') {
      actionLink.classList.add('button--sedona');
    } else if (textCell && textCell.textContent.toLowerCase() === 'donate') {
      actionLink.classList.add('button--zion');
    }
    li.append(actionLink);
  });

  // Mobile search form
  const mobileSearchForm = document.createElement('form');
  mobileSearchForm.action = '/search/';
  mobileSearchForm.method = 'get';
  mobileSearchForm.role = 'search';
  mobileSearchForm.classList.add('w-full', 'py-sm', 'container');
  mobileSearchForm.setAttribute('data-animated', '');
  mobileMenuContent.append(mobileSearchForm);

  const mobileSearchInputWrapper = document.createElement('div');
  mobileSearchInputWrapper.classList.add('flex', 'items-center', 'bg-surface-mobile-search-bar', 'rounded-full', 'relative', 'animated-fade-in-up');
  mobileSearchForm.append(mobileSearchInputWrapper);

  const mobileSearchInput = document.createElement('input');
  mobileSearchInput.id = 'mobile-search-bar';
  mobileSearchInput.name = 'query';
  mobileSearchInput.type = 'text';
  mobileSearchInput.placeholder = 'Search';
  mobileSearchInput.classList.add('w-full', 'bg-transparent', 'text-p1', 'p-4', 'py-3.5', 'pl-4.5', 'pr-14', 'leading-none', 'placeholder:text-foreground-strong', 'focus:outline-none');
  mobileSearchInputWrapper.append(mobileSearchInput);

  const mobileSearchButton = document.createElement('button');
  mobileSearchButton.classList.add('absolute', 'right-6', 'bg-transparent', 'text-foreground', 'p-0', 'rounded-sm');
  mobileSearchButton.type = 'submit';
  mobileSearchInputWrapper.append(mobileSearchButton);

  const mobileSearchImg = document.createElement('img');
  mobileSearchImg.alt = 'svg file';
  mobileSearchImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775555061870.svg+xml'; // Placeholder
  mobileSearchButton.append(mobileSearchImg);

  const mobileSearchSrOnlySpan = document.createElement('span');
  mobileSearchSrOnlySpan.classList.add('sr-only');
  mobileSearchSrOnlySpan.textContent = 'Search';
  mobileSearchButton.append(mobileSearchSrOnlySpan);

  // Event listeners for mobile menu toggle
  mobileMenuToggleButton.addEventListener('click', () => {
    const isOpen = mobileMenuDialog.hasAttribute('open');
    if (isOpen) {
      mobileMenuDialog.removeAttribute('open');
      mobileMenuToggleButton.setAttribute('aria-expanded', 'false');
      srOnlyToggleText.textContent = mobileMenuToggleButton.getAttribute('data-mobile-menu-open-text');
    } else {
      mobileMenuDialog.setAttribute('open', '');
      mobileMenuToggleButton.setAttribute('aria-expanded', 'true');
      srOnlyToggleText.textContent = mobileMenuToggleButton.getAttribute('data-mobile-menu-close-text');
    }
  });

  mobileCloseButton.addEventListener('click', () => {
    mobileMenuDialog.removeAttribute('open');
    mobileMenuToggleButton.setAttribute('aria-expanded', 'false');
    srOnlyToggleText.textContent = mobileMenuToggleButton.getAttribute('data-mobile-menu-open-text');
  });

  // Final cleanup and append
  block.textContent = '';
  block.append(header);
}
