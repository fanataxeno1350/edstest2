import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [logoRow, logoLinkRow, logoTextRow, ...navItemRows] = [...block.children];

  const header = document.createElement('header');
  const nav = document.createElement('nav');
  const container = document.createElement('div');
  container.classList.add('container', 'd-flex', 'align-items-center', 'justify-content-between');

  // Logo section
  const logoWrapper = document.createElement('div');
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo', 'd-flex', 'align-items-center', 'gap-2');

  const logoHref = logoLinkRow?.querySelector('a')?.href || '/';
  logoLink.href = logoHref;
  moveInstrumentation(logoLinkRow, logoLink);

  const picture = logoRow?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      // moveInstrumentation should be called on the original img element, not the new optimized one
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  moveInstrumentation(logoRow, logoLink);

  const logoText = document.createElement('h4');
  logoText.textContent = logoTextRow?.textContent.trim() || '';
  moveInstrumentation(logoTextRow, logoText);
  logoLink.append(logoText);
  logoWrapper.append(logoLink);
  container.append(logoWrapper);

  // Navigation List
  const navList = document.createElement('div');
  navList.classList.add('nav-list');

  navItemRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const navItemLink = document.createElement('a');
    navItemLink.classList.add('navitems');

    const linkHref = linkCell?.querySelector('a')?.href || '#';
    navItemLink.href = linkHref;
    navItemLink.textContent = labelCell?.textContent.trim() || '';

    moveInstrumentation(row, navItemLink);
    navList.append(navItemLink);
  });
  container.append(navList);

  // Navbar Toggler Button
  const toggler = document.createElement('button');
  toggler.classList.add('navbar-toggler');
  toggler.type = 'button';
  toggler.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"></path>
    </svg>
  `;

  toggler.addEventListener('click', () => {
    navList.classList.toggle('show'); // Assuming 'show' class controls visibility for mobile nav
  });
  container.append(toggler);

  nav.append(container);
  header.append(nav);

  block.replaceChildren(header);
}
