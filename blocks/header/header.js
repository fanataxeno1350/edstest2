import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const allRows = [...block.children];

  // Identify logo and logo link rows based on content
  const logoRow = allRows.find(row => row.querySelector('picture'));
  const logoLinkRow = allRows.find(row => row.querySelector('a') && !row.querySelector('picture'));

  // Filter out the identified logo rows to get item rows
  const itemRows = allRows.filter(row => row !== logoRow && row !== logoLinkRow);

  // Create header container
  const header = document.createElement('header');
  header.classList.add('header', 'overlay_hero');
  header.id = 'site_header';
  header.setAttribute('role', 'banner');

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row');

  const column1 = document.createElement('div');
  column1.classList.add('column');

  // Logo
  const logoLink = document.createElement('a');
  logoLink.classList.add('site_logo');
  if (logoLinkRow) {
    moveInstrumentation(logoLinkRow, logoLink);
    const logoA = logoLinkRow.querySelector('a');
    if (logoA) {
      logoLink.href = logoA.href;
      logoLink.title = 'Go to frontpage'; // Hardcoded from original HTML
    }
  }

  if (logoRow) {
    const logoPicture = logoRow.querySelector('picture');
    if (logoPicture) {
      moveInstrumentation(logoRow.firstElementChild, logoLink);
      logoLink.append(logoPicture);
    }
  }
  column1.append(logoLink);

  // Hamburger menu
  const hamburger = document.createElement('div');
  hamburger.id = 'toggle_mobile_menu';
  hamburger.classList.add('hamburger', 'hamburger--collapse');
  hamburger.setAttribute('aria-label', 'Toggle menu visibility');
  const hamburgerBox = document.createElement('div');
  hamburgerBox.classList.add('hamburger-box');
  const hamburgerInner = document.createElement('div');
  hamburgerInner.classList.add('hamburger-inner');
  hamburgerBox.append(hamburgerInner);
  hamburger.append(hamburgerBox);
  column1.append(hamburger);

  rowDiv.append(column1);

  const column2 = document.createElement('div');
  column2.classList.add('column', 'menu_column');

  // Main navigation
  const nav = document.createElement('nav');
  nav.id = 'main_nav';
  const menuUl = document.createElement('ul');
  menuUl.classList.add('menu', 'right-aligned');

  // Distinguish menu items (2 cells) from language switches (3 cells)
  const menuItems = itemRows.filter((row) => [...row.children].length === 2);
  menuItems.forEach((row, index) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add('menu-item', 'menu-item-type-post_type', 'menu-item-object-page', `menu-item-${1629 + index}`); // Using example IDs from original HTML
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    const a = document.createElement('a');
    if (linkCell && linkCell.querySelector('a')) {
      a.href = linkCell.querySelector('a').href;
    }
    if (labelCell) {
      a.textContent = labelCell.textContent;
    }
    li.append(a);
    menuUl.append(li);
  });

  // Language switcher
  const languageSwitcherContainer = document.createElement('div');
  languageSwitcherContainer.classList.add('top_menu_langunage_switcher');

  const desktopLangSwitcherToggle = document.createElement('a');
  desktopLangSwitcherToggle.href = 'javascript:void(0);';
  desktopLangSwitcherToggle.id = 'desktop_lang_switcher_toggle';
  desktopLangSwitcherToggle.title = 'Select language';
  const globalIcon = document.createElement('i');
  globalIcon.classList.add('icon-global');
  desktopLangSwitcherToggle.append(globalIcon);
  languageSwitcherContainer.append(desktopLangSwitcherToggle);

  const switcherContainer = document.createElement('div');
  switcherContainer.id = 'switcher_container';

  const wpmlLsDiv = document.createElement('div');
  wpmlLsDiv.setAttribute('role', 'navigation');
  wpmlLsDiv.setAttribute('aria-label', 'Language Switcher');
  wpmlLsDiv.classList.add('wpml-ls-statics-shortcode_actions', 'wpml-ls', 'wpml-ls-legacy-list-vertical');

  const langUl = document.createElement('ul');

  const languageSwitches = itemRows.filter((row) => [...row.children].length === 3);
  languageSwitches.forEach((row, index) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add(
      'wpml-ls-slot-shortcode_actions',
      'wpml-ls-item',
      `wpml-ls-item-${index === 0 ? 'no' : index === 1 ? 'en' : 'sv'}`, // Using example IDs
      index === 0 ? 'wpml-ls-first-item' : '',
      index === languageSwitches.length - 1 ? 'wpml-ls-last-item' : '',
      'wpml-ls-item-legacy-list-vertical',
    );
    if (index === 1) { // Assuming English is current language from example
      li.classList.add('wpml-ls-current-language');
    }

    const a = document.createElement('a');
    a.classList.add('wpml-ls-link');

    const cells = [...row.children];
    const flagCell = cells.find(cell => cell.querySelector('picture'));
    const languageCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    if (linkCell && linkCell.querySelector('a')) {
      a.href = linkCell.querySelector('a').href;
      // Ensure languageCell exists before accessing textContent
      if (languageCell) {
        a.setAttribute('hreflang', languageCell.textContent.toLowerCase().substring(0, 2)); // Example: "Norsk" -> "no"
        a.setAttribute('lang', languageCell.textContent.toLowerCase().substring(0, 2));
        a.setAttribute('aria-label', `Switch to ${languageCell.textContent}`);
        a.title = `Switch to ${languageCell.textContent}`;
      }
      if (index === 1) a.setAttribute('aria-current', 'page');
    }

    if (flagCell && flagCell.querySelector('picture')) {
      const picture = flagCell.querySelector('picture');
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '18' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      a.append(optimizedPic);
    }

    const span = document.createElement('span');
    span.classList.add('wpml-ls-native');
    if (languageCell) {
      span.textContent = languageCell.textContent;
      span.setAttribute('lang', languageCell.textContent.toLowerCase().substring(0, 2));
    }
    a.append(span);
    li.append(a);
    langUl.append(li);
  });

  wpmlLsDiv.append(langUl);
  switcherContainer.append(wpmlLsDiv);
  languageSwitcherContainer.append(switcherContainer);

  column2.append(nav);
  nav.append(menuUl);
  column2.append(languageSwitcherContainer);
  rowDiv.append(column2);
  header.append(rowDiv);

  // Toggle mobile menu functionality
  hamburger.addEventListener('click', () => {
    // Toggle classes for hamburger animation
    hamburger.classList.toggle('is-active');
    // Toggle visibility of the menu
    nav.classList.toggle('active');
    languageSwitcherContainer.classList.toggle('active');
  });

  // Toggle desktop language switcher
  desktopLangSwitcherToggle.addEventListener('click', (e) => {
    e.preventDefault();
    switcherContainer.classList.toggle('active');
  });

  // Optimize images
  header.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(header);
}
