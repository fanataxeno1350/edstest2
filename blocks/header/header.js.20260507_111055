import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Select all top-level rows of the block
  const children = [...block.children];

  const headerEl = document.createElement('header');
  const nav = document.createElement('nav');
  const container = document.createElement('div');
  container.classList.add('container', 'd-flex', 'align-items-center', 'justify-content-between');

  // Destructure the rows based on your EDS content model
  // Row 0: Logo | Row 1: Logo Link | Row 2: Site Title | Row 3+: Nav Items
  const [logoRow, logoLinkRow, siteTitleRow, ...navItemRows] = children;

  // 1. Logo and Site Title Wrapper
  const logoLinkEl = document.createElement('a');
  logoLinkEl.classList.add('logo', 'd-flex', 'align-items-center', 'gap-2');

  // Handle Logo Image
  if (logoRow) {
    const img = logoRow.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt || 'logo', false, [{ width: '750' }]);
      moveInstrumentation(logoRow, optimizedPic);
      logoLinkEl.append(optimizedPic);
    }
  }

  // Handle Logo Link Href
  if (logoLinkRow) {
    const anchor = logoLinkRow.querySelector('a');
    logoLinkEl.href = anchor ? anchor.getAttribute('href') : '/';
    moveInstrumentation(logoLinkRow, logoLinkEl);
  } else {
    logoLinkEl.href = '/';
  }

  // Handle Site Title (TechAtom)
  if (siteTitleRow) {
    const siteTitle = document.createElement('h4');
    siteTitle.textContent = siteTitleRow.textContent.trim();
    moveInstrumentation(siteTitleRow, siteTitle);
    logoLinkEl.append(siteTitle);
  }

  const logoWrapper = document.createElement('div');
  logoWrapper.append(logoLinkEl);
  container.append(logoWrapper);

  // 2. Navigation Menu
  const navList = document.createElement('div');
  navList.classList.add('nav-list');

  navItemRows.forEach((row) => {
    // EDS rows usually have two columns: [Label, Link]
    const cells = [...row.children];
    if (cells.length >= 2) {
      const navItemLink = document.createElement('a');
      navItemLink.classList.add('navitems');

      // Get text from the first cell (Label)
      navItemLink.textContent = cells[0].textContent.trim();

      // Get href from the second cell (Link)
      const link = cells[1].querySelector('a');
      navItemLink.href = link ? link.getAttribute('href') : '#';

      moveInstrumentation(row, navItemLink);
      navList.append(navItemLink);
    }
  });

  container.append(navList);

  // 3. Navbar Toggler (Mobile)
  const toggler = document.createElement('button');
  toggler.classList.add('navbar-toggler');
  toggler.type = 'button';
  toggler.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"></path>
    </svg>
  `;

  toggler.addEventListener('click', () => {
    navList.classList.toggle('show');
  });

  container.append(toggler);

  nav.append(container);
  headerEl.append(nav);

  // CRITICAL: Replace the messy raw block content with our clean structure
  block.replaceChildren(headerEl);
}