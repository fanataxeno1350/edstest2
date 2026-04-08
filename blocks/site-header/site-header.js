import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  const header = document.createElement('header');
  header.classList.add('site-header');

  // Logo link
  const logoLink = document.createElement('a');
  logoLink.href = '/';
  logoLink.classList.add('logo');

  // Logo image and label
  const logoImageRow = rows.find(row => row.querySelector('picture') && row.nextElementSibling && !row.nextElementSibling.querySelector('picture'));
  const logoLabelRow = logoImageRow ? logoImageRow.nextElementSibling : null;

  if (logoImageRow) {
    const logoImageCell = logoImageRow.firstElementChild;
    const logoPicture = logoImageCell.querySelector('picture');
    if (logoPicture) {
      const img = logoPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }

  if (logoLabelRow) {
    const logoLabelCell = logoLabelRow.firstElementChild;
    const logoLabelSpan = document.createElement('span');
    logoLabelSpan.classList.add('label');
    moveInstrumentation(logoLabelCell, logoLabelSpan);
    while (logoLabelCell.firstChild) logoLabelSpan.append(logoLabelCell.firstChild);
    logoLink.append(logoLabelSpan);
  }

  header.append(logoLink);

  // Navigation
  const nav = document.createElement('nav');

  // Menu link
  const menuLink = document.createElement('a');
  menuLink.href = '#menu';

  // Menu icon and label
  const menuIconRow = rows.find(row => row.querySelector('picture') && row !== logoImageRow && row.nextElementSibling && !row.nextElementSibling.querySelector('picture'));
  const menuLabelRow = menuIconRow ? menuIconRow.nextElementSibling : null;

  if (menuIconRow) {
    const menuIconCell = menuIconRow.firstElementChild;
    const menuPicture = menuIconCell.querySelector('picture');
    if (menuPicture) {
      const img = menuPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      menuLink.append(optimizedPic);
    }
  }

  if (menuLabelRow) {
    const menuLabelCell = menuLabelRow.firstElementChild;
    const menuLabelSpan = document.createElement('span');
    menuLabelSpan.classList.add('label');
    moveInstrumentation(menuLabelCell, menuLabelSpan);
    while (menuLabelCell.firstChild) menuLabelSpan.append(menuLabelCell.firstChild);
    menuLink.append(menuLabelSpan);
  }

  nav.append(menuLink);
  header.append(nav);

  block.textContent = '';
  block.append(header);
}
