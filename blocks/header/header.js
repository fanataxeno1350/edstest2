import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const headerEl = document.createElement('header');
  const nav = document.createElement('nav');
  const container = document.createElement('div');
  container.classList.add('container', 'd-flex', 'align-items-center', 'justify-content-between');

  // Logo and Site Title
  const logoWrapper = document.createElement('div');
  const logoLinkEl = document.createElement('a');
  logoLinkEl.classList.add('logo', 'd-flex', 'align-items-center', 'gap-2');

  const [logoRow, logoLinkRow, siteTitleRow, ...navItemRows] = children;

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLinkEl.append(optimizedPic);
  }

  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLinkEl.href = foundLogoLink.href;
  } else {
    logoLinkEl.href = '/'; // Default to home if no link is provided
  }

  const siteTitle = document.createElement('h4');
  siteTitle.textContent = siteTitleRow.textContent.trim();
  logoLinkEl.append(siteTitle);

  moveInstrumentation(logoRow, logoLinkEl);
  moveInstrumentation(logoLinkRow, logoLinkEl);
  moveInstrumentation(siteTitleRow, siteTitle);

  logoWrapper.append(logoLinkEl);
  container.append(logoWrapper);

  // Navigation Menu
  const navList = document.createElement('div');
  navList.classList.add('nav-list');

  navItemRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const navItem = document.createElement('a');
    navItem.classList.add('navitems');
    navItem.textContent = labelCell.textContent.trim();

    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      navItem.href = foundLink.href;
    } else {
      navItem.href = '#';
    }
    moveInstrumentation(row, navItem);
    navList.append(navItem);
  });

  container.append(navList);

  // Navbar Toggler
  const navbarToggler = document.createElement('button');
  navbarToggler.classList.add('navbar-toggler');
  navbarToggler.type = 'button';
  navbarToggler.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"></path>
    </svg>
  `;

  navbarToggler.addEventListener('click', () => {
    navList.classList.toggle('show'); // Assuming 'show' class will handle visibility
  });

  container.append(navbarToggler);
  nav.append(container);
  headerEl.append(nav);

  block.replaceChildren(headerEl);
}
