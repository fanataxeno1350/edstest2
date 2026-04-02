import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const nav = document.createElement('nav');
  const container = document.createElement('div');
  container.classList.add('container', 'd-flex', 'align-items-center', 'justify-content-between');

  // Logo section
  const logoWrapper = document.createElement('div');
  const logoLink = document.createElement('a');
  logoLink.href = '/';
  logoLink.classList.add('logo', 'd-flex', 'align-items-center', 'gap-2');

  const logoImageRow = children.find(row => row.querySelector('picture') && row.nextElementSibling?.querySelector('div')?.textContent.trim() !== '');
  if (logoImageRow) {
    moveInstrumentation(logoImageRow, logoLink);
    const logoPicture = logoImageRow.querySelector('picture');
    if (logoPicture) {
      const img = logoPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }

  const logoTextRow = children.find(row => !row.querySelector('picture') && !row.querySelector('a') && row.textContent.trim() !== '');
  if (logoTextRow) {
    const logoText = document.createElement('h4');
    moveInstrumentation(logoTextRow, logoText);
    while (logoTextRow.firstChild) logoText.append(logoTextRow.firstChild);
    logoLink.append(logoText);
  }
  logoWrapper.append(logoLink);
  container.append(logoWrapper);

  // Nav links section
  const navList = document.createElement('div');
  navList.classList.add('nav-list');
  const navLinkRows = children.filter(row => row.querySelector('a') && !row.querySelector('picture'));

  navLinkRows.forEach((row) => {
    const cell = row.firstElementChild;
    if (cell) {
      const originalLink = cell.querySelector('a');
      if (originalLink) {
        const navItem = document.createElement('a');
        navItem.href = originalLink.href;
        navItem.classList.add('navitems');
        moveInstrumentation(originalLink, navItem);
        while (originalLink.firstChild) navItem.append(originalLink.firstChild);
        navList.append(navItem);
      }
    }
  });
  container.append(navList);

  // Toggler button
  const toggler = document.createElement('button');
  toggler.classList.add('navbar-toggler');
  toggler.type = 'button';

  const togglerIconRow = children.find(row => row.querySelector('picture') && row.previousElementSibling?.querySelector('a'));
  if (togglerIconRow) {
    moveInstrumentation(togglerIconRow, toggler);
    const togglerPicture = togglerIconRow.querySelector('picture');
    if (togglerPicture) {
      const img = togglerPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      toggler.append(optimizedPic);
    }
  }
  container.append(toggler);

  // Add event listener for toggler button
  toggler.addEventListener('click', () => {
    navList.classList.toggle('active'); // Assuming 'active' class controls visibility
  });

  nav.append(container);
  block.textContent = '';
  block.append(nav);
}
