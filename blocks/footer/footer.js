import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [logoRow, copyrightRow, ...linkRows] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('Container-module-scss-module__KjkAOW__container');

  // Logo
  const footerLogo = document.createElement('div');
  footerLogo.classList.add('Footer-module-scss-module__EzUeIG__footerLogo');
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '134' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      footerLogo.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('play');
    }
  }
  moveInstrumentation(logoRow, footerLogo);
  container.append(footerLogo);

  // Footer Links
  const footerLinksUl = document.createElement('ul');
  footerLinksUl.classList.add('Footer-module-scss-module__EzUeIG__footerLinks');

  linkRows.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const cells = [...row.children];
    const linkTextCell = cells[0]; // First cell contains text
    const linkUrlCell = cells[1]; // Second cell contains the link

    if (linkTextCell && linkUrlCell) {
      const link = linkUrlCell.querySelector('a') || document.createElement('a');
      link.textContent = linkTextCell.textContent;
      li.append(link);
    }
    footerLinksUl.append(li);
  });
  container.append(footerLinksUl);

  // Copyright
  const copyrightP = document.createElement('p');
  copyrightP.classList.add('Footer-module-scss-module__EzUeIG__copyright');
  moveInstrumentation(copyrightRow, copyrightP);
  while (copyrightRow.firstChild) {
    copyrightP.append(copyrightRow.firstChild);
  }
  container.append(copyrightP);

  block.textContent = '';
  block.classList.add('Footer-module-scss-module__EzUeIG__footer');
  block.append(container);

  // Interactivity: Cookie Preferences
  const cookiePreferencesLink = block.querySelector('#teconsent a');
  if (cookiePreferencesLink) {
    cookiePreferencesLink.addEventListener('click', (e) => {
      e.preventDefault();
      // Placeholder for actual cookie preferences modal/functionality
      // In a real scenario, this would trigger a Tealium or similar consent manager function
      console.log('Cookie Preferences link clicked!');
      // Example: window.OneTrust.ToggleInfoDisplay(); or similar
    });
  }
}
