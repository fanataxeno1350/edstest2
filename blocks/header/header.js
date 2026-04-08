import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    ctaLinkRow,
    ctaTextRow,
    backgroundImageRow,
    ...itemRows
  ] = [...block.children];

  const header = document.createElement('header');
  header.classList.add('Header-module-scss-module__klcqGG__topHeaderContainer', 'en');

  const menuDiv = document.createElement('div');
  menuDiv.classList.add('Header-module-scss-module__klcqGG__menu');
  header.append(menuDiv);

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('Container-module-scss-module__KjkAOW__container');
  menuDiv.append(containerDiv);

  const navDiv = document.createElement('div');
  containerDiv.append(navDiv);

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'main navigation');
  navDiv.append(nav);

  // Logo
  const logoLink = document.createElement('a');
  logoLink.classList.add('Header-module-scss-module__klcqGG__logo', 'Header-module-scss-module__klcqGG__fadeInFromTop');
  const logoHref = logoLinkRow.querySelector('a')?.href || '/';
  logoLink.href = logoHref;

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    moveInstrumentation(logoRow.firstElementChild, logoLink);
    logoLink.append(logoPicture);
  }
  nav.append(logoLink);

  // Persistent Menu (CTA Link)
  const persistentMenu = document.createElement('div');
  persistentMenu.classList.add('Header-module-scss-module__klcqGG__persistentMenu');
  nav.append(persistentMenu);

  const ctaLink = document.createElement('a');
  ctaLink.classList.add('Button-module-scss-module__VLzsWq__button', 'Button-module-scss-module__VLzsWq__blurred', 'Header-module-scss-module__klcqGG__fadeInFromTop');
  ctaLink.style.setProperty('pointer-events', 'auto');
  ctaLink.style.setProperty('position', 'relative');
  ctaLink.style.setProperty('z-index', '1003');
  ctaLink.style.setProperty('animation-delay', '0.1s');
  ctaLink.style.setProperty('backdrop-filter', 'blur(10px)');

  const ctaHref = ctaLinkRow.querySelector('a')?.href;
  if (ctaHref) {
    ctaLink.href = ctaHref;
  }
  const ctaText = ctaTextRow.textContent.trim();
  if (ctaText) {
    ctaLink.textContent = ctaText;
  }
  moveInstrumentation(ctaLinkRow, ctaLink);
  persistentMenu.append(ctaLink);

  // Hamburger Button
  const hamburgerButton = document.createElement('button');
  hamburgerButton.classList.add('Header-module-scss-module__klcqGG__hamburger', 'Header-module-scss-module__klcqGG__fadeInFromTop');
  hamburgerButton.style.setProperty('animation-delay', '0.2s');
  hamburgerButton.setAttribute('aria-label', 'Open menu');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  for (let i = 0; i < 3; i += 1) {
    hamburgerButton.append(document.createElement('span'));
  }
  nav.append(hamburgerButton);

  // Menu Options (collapsed content)
  const menuOptions = document.createElement('div');
  menuOptions.classList.add('Header-module-scss-module__klcqGG__menuOptions');
  menuOptions.setAttribute('inert', ''); // Initially inert
  nav.append(menuOptions);

  // Background Image
  const bgImgPicture = backgroundImageRow.querySelector('picture');
  if (bgImgPicture) {
    const bgImg = bgImgPicture.querySelector('img');
    if (bgImg) {
      const newBgImg = document.createElement('img');
      newBgImg.alt = bgImg.alt;
      newBgImg.loading = 'lazy';
      newBgImg.width = '1800';
      newBgImg.height = '1800';
      newBgImg.decoding = 'async';
      newBgImg.setAttribute('data-nimg', '1');
      newBgImg.style.color = 'transparent';
      newBgImg.src = bgImg.src;
      newBgImg.classList.add('Header-module-scss-module__klcqGG__raysBackground');
      moveInstrumentation(backgroundImageRow.firstElementChild, newBgImg);
      menuOptions.append(newBgImg);
    }
  }

  const menuContainer = document.createElement('div');
  menuContainer.classList.add('Header-module-scss-module__klcqGG__menuContainer');
  menuOptions.append(menuContainer);

  const searchContainer = document.createElement('div');
  searchContainer.classList.add('Header-module-scss-module__klcqGG__searchContainer');
  menuContainer.append(searchContainer);

  const searchIconButton = document.createElement('button');
  searchIconButton.classList.add('Header-module-scss-module__klcqGG__searchIconButton');
  searchIconButton.setAttribute('aria-label', 'Open search');
  const searchIconImg = document.createElement('img');
  searchIconImg.alt = 'svg file';
  searchIconImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775569357544.svg+xml'; // This is a hardcoded asset from the original HTML, not from the block.
  searchIconButton.append(searchIconImg);
  searchContainer.append(searchIconButton);

  // Menu Links
  const menuLinksUl = document.createElement('ul');
  menuContainer.append(menuLinksUl);

  const menuLinkRows = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a') && !row.querySelector('picture'));
  menuLinkRows.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const textCell = cells.find(cell => !cell.querySelector('a'));

    const link = document.createElement('a');
    // Corrected class name from 'undefined' to 'to-open-submenu' based on original HTML
    link.classList.add('to-open-submenu');
    link.setAttribute('aria-label', `${textCell.textContent.trim()} link`);
    link.href = linkCell.querySelector('a')?.href || '#';
    link.setAttribute('data-hover', textCell.textContent.trim());

    const spanText = document.createElement('span');
    spanText.classList.add('Header-module-scss-module__klcqGG__menuLinkText');
    spanText.textContent = textCell.textContent.trim();
    link.append(spanText);

    li.append(link);
    menuLinksUl.append(li);
  });

  // Menu Auxiliar (Social Icons)
  const menuAuxiliar = document.createElement('div');
  menuAuxiliar.classList.add('Header-module-scss-module__klcqGG__menuAuxiliar');
  menuContainer.append(menuAuxiliar);

  const socialIconsDiv = document.createElement('div');
  socialIconsDiv.classList.add('SocialIcons-module-scss-module__b5X5Xa__socialIcons', 'SocialIcons-module-scss-module__b5X5Xa__header');
  menuAuxiliar.append(socialIconsDiv);

  const socialIconRows = itemRows.filter((row) => row.children.length === 2 && row.querySelector('picture') && row.querySelector('a'));
  socialIconRows.forEach((row) => {
    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const iconCell = cells.find(cell => cell.querySelector('picture'));

    const socialLink = document.createElement('a');
    socialLink.classList.add('SocialIcons-module-scss-module__b5X5Xa__socialIcon');
    socialLink.setAttribute('rel', 'nofollow noopener noreferrer');
    socialLink.setAttribute('target', '_blank');

    const href = linkCell.querySelector('a')?.href;
    if (href) {
      socialLink.href = href;
    }

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      if (iconImg) {
        const newIconImg = document.createElement('img');
        newIconImg.alt = iconImg.alt;
        newIconImg.src = iconImg.src;
        moveInstrumentation(iconCell, newIconImg);
        socialLink.append(newIconImg);
      }
    }
    socialIconsDiv.append(socialLink);
  });

  // Toggle functionality for hamburger button
  hamburgerButton.addEventListener('click', () => {
    const isExpanded = hamburgerButton.getAttribute('aria-expanded') === 'true';
    hamburgerButton.setAttribute('aria-expanded', !isExpanded);
    menuOptions.classList.toggle('Header-module-scss-module__klcqGG__menuOptions--open');
    if (isExpanded) {
      menuOptions.setAttribute('inert', '');
    } else {
      menuOptions.removeAttribute('inert');
    }
  });

  // Toggle functionality for search icon button (assuming it opens a search modal/input)
  searchIconButton.addEventListener('click', () => {
    // Implement search functionality here, e.g., toggle a search input visibility
    // For now, let's just log a message or add a placeholder class
    console.log('Search button clicked!');
    // Example: searchContainer.classList.toggle('Header-module-scss-module__klcqGG__searchContainer--open');
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
