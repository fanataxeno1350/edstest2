import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [logoRow, logoLinkRow, logoLabelRow, ...navItemRows] = [...block.children];

  const headerEl = document.createElement('header');
  const navEl = document.createElement('nav');
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'd-flex', 'align-items-center', 'justify-content-between');

  // Logo Section
  const logoDiv = document.createElement('div');
  const logoLinkEl = document.createElement('a');
  logoLinkEl.classList.add('logo', 'd-flex', 'align-items-center', 'gap-2');
  moveInstrumentation(logoLinkRow, logoLinkEl);
  logoLinkEl.href = logoLinkRow.querySelector('a')?.href || '/';

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation(img, optimizedPic.querySelector('img')); // createOptimizedPicture handles instrumentation
    logoLinkEl.append(optimizedPic);
  }

  const logoLabelEl = document.createElement('h4');
  moveInstrumentation(logoLabelRow, logoLabelEl);
  logoLabelEl.textContent = logoLabelRow.textContent.trim();
  logoLinkEl.append(logoLabelEl);
  logoDiv.append(logoLinkEl);
  containerDiv.append(logoDiv);

  // Navigation List
  const navListDiv = document.createElement('div');
  navListDiv.classList.add('nav-list');

  navItemRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const navItemLink = document.createElement('a');
    navItemLink.classList.add('navitems');
    moveInstrumentation(row, navItemLink); // Move instrumentation from the item row to the new link
    navItemLink.href = linkCell.querySelector('a')?.href || '#';
    navItemLink.textContent = labelCell.textContent.trim();
    navListDiv.append(navItemLink);
  });
  containerDiv.append(navListDiv);

  // Navbar Toggler
  const togglerButton = document.createElement('button');
  togglerButton.classList.add('navbar-toggler');
  togglerButton.type = 'button';
  togglerButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"></path>
    </svg>
  `;
  containerDiv.append(togglerButton);

  navEl.append(containerDiv);
  headerEl.append(navEl);

  // Toggle functionality for mobile navigation
  togglerButton.addEventListener('click', () => {
    navListDiv.classList.toggle('show'); // Use 'show' class to control visibility
  });

  block.replaceChildren(headerEl);
}
