import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure root rows based on BlockJson: logo, logo-link, language, links (container), then link items
  const [logoRow, logoLinkRow, languageRow, linksContainerRow, ...linkItemRows] = [...block.children];

  block.textContent = '';
  block.classList.add('navbar', 'navbar-arena', 'g-container');

  // Hamburger button
  const navHamburger = document.createElement('div');
  navHamburger.classList.add('nav-hamburger');
  const hamburgerButton = document.createElement('button');
  hamburgerButton.setAttribute('type', 'button');
  hamburgerButton.setAttribute('aria-controls', 'nav');
  hamburgerButton.setAttribute('aria-label', 'Open navigation');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.classList.add('nav-hamburger-icon');
  hamburgerButton.append(hamburgerIcon);
  navHamburger.append(hamburgerButton);
  block.append(navHamburger);

  // Add event listener for hamburger button
  hamburgerButton.addEventListener('click', () => {
    const expanded = hamburgerButton.getAttribute('aria-expanded') === 'true';
    hamburgerButton.setAttribute('aria-expanded', !expanded);
    // Assuming there's a main navigation menu element to toggle, e.g., an element with id 'menu'
    const menu = document.getElementById('menu');
    if (menu) {
      menu.classList.toggle('hidden', expanded);
      document.body.classList.toggle('menu-open', !expanded); // Add a class to body for overlay/scroll lock
    }
  });

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo-wrapper');
  const logoBlock = document.createElement('div');
  logoBlock.classList.add('logo', 'block');
  moveInstrumentation(logoRow, logoBlock);

  const logoSpan = document.createElement('span');
  logoSpan.classList.add('arena');

  const logoLink = document.createElement('a');
  logoLink.classList.add('logo__picture');
  // The logoLinkRow contains the actual link for the logo
  const logoLinkHref = logoLinkRow.querySelector('a')?.href || '/';
  logoLink.href = logoLinkHref;
  logoLink.setAttribute('data-logo-name', 'Arena');

  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  logoSpan.append(logoLink);
  logoBlock.append(logoSpan);
  logoWrapper.append(logoBlock);
  block.append(logoWrapper);

  // Links section
  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links');

  // The linksContainerRow itself is just a placeholder for the container, not an item.
  // We iterate over linkItemRows for the actual link items.
  linkItemRows.forEach((row) => {
    // Each link item row has two cells: label and url
    if (row.children.length >= 2) {
      const linkTitleDiv = document.createElement('div');
      linkTitleDiv.classList.add('link-title');
      moveInstrumentation(row, linkTitleDiv);

      const labelCell = row.children[0];
      const urlCell = row.children[1];

      const linkEl = document.createElement('a');
      const foundLink = urlCell.querySelector('a');
      if (foundLink) {
        linkEl.href = foundLink.href;
      }
      linkEl.title = labelCell.textContent.trim();
      linkEl.classList.add('button'); // Class from original HTML
      linkEl.textContent = labelCell.textContent.trim();
      linkTitleDiv.append(linkEl);
      linksDiv.append(linkTitleDiv);
    }
  });
  block.append(linksDiv);

  // Right section (language, contact, sign-in)
  const rightDiv = document.createElement('div');
  rightDiv.classList.add('right');
  rightDiv.id = 'nav-right';

  // Language
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  moveInstrumentation(languageRow, languageDiv);
  languageDiv.textContent = languageRow.textContent.trim();
  rightDiv.append(languageDiv);

  // Add event listener for language selector (assuming it's a toggle/dropdown)
  languageDiv.addEventListener('click', () => {
    // Example: Toggle a class to show/hide language options
    languageDiv.classList.toggle('active');
    // You might need to query for a specific dropdown element within languageDiv
    // For instance: languageDiv.querySelector('.language-dropdown').classList.toggle('hidden');
  });

  block.append(rightDiv);
}
