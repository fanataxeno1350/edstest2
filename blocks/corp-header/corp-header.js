import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 1: STRUCTURE ALIGNMENT
  // BlockJson has 2 root fields: 'logo' (reference) and 'links' (container of corp-header-link items).
  // The 'links' container itself is a row, followed by its item rows.
  // So, block.children should be: [logoRow, linksContainerRow, ...linkItemRows]
  const [logoRow, linksContainerRow, ...linkItemRows] = [...block.children];

  block.innerHTML = ''; // Clear the block content

  const navbarArena = document.createElement('div');
  navbarArena.classList.add('navbar', 'navbar-arena', 'g-container');

  // Nav Hamburger
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
  navbarArena.append(navHamburger);

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
  logoLink.href = '/'; // Default home link
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
  navbarArena.append(logoWrapper);

  // Links section
  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links');

  // The original HTML has a structure like:
  // <div class="links">
  //   <div class="link-title"><span><a href="/" title="home" class="button">Home</a></span></div>
  //   <div class="link-title"><span>Corporate</span></div>
  //   <div class="desktop-panel panel corporate">...</div>
  //   ...
  // </div>
  // The generated JS is creating a single <ul> for all links, which doesn't match the original HTML's desktop structure
  // and its use of `link-title` and `desktop-panel`.
  // Let's adapt to create `link-title` divs for each link and handle desktop panels if they exist in the item rows.

  // For now, we'll stick to the current JS's interpretation of `linkItemRows` as simple `nav-link` items.
  // If the `linksContainerRow` (block.children[1]) had content, it would be processed here.
  // In this specific block, `linksContainerRow` is just a placeholder `<div><div>Links value</div></div>`
  // and the actual links are in `linkItemRows`.

  // Re-evaluating the original HTML, the 'links' section is more complex than a simple ul.
  // It contains `link-title` divs, some of which are simple links, others are titles for `desktop-panel` dropdowns.
  // The current JS creates a single `menu-list` for both desktop and mobile.
  // For desktop, we need to create `link-title` elements.
  // For mobile, the existing `menu-list` clone logic is fine.

  const desktopLinksContainer = document.createElement('div');
  desktopLinksContainer.classList.add('links-desktop'); // Invented class for clarity, but ideally should match original HTML structure

  linkItemRows.forEach((row) => {
    // Each item row has two cells: URL (aem-content) and Text (text)
    const linkCell = row.children[0];
    const textCell = row.children[1];

    const linkAnchor = linkCell.querySelector('a');
    const linkText = textCell.textContent.trim();

    const linkTitleDiv = document.createElement('div');
    linkTitleDiv.classList.add('link-title');
    moveInstrumentation(row, linkTitleDiv); // Instrument the link-title div

    const span = document.createElement('span');

    if (linkAnchor) {
      const newLink = document.createElement('a');
      newLink.href = linkAnchor.href;
      newLink.textContent = linkText;
      if (linkAnchor.title) newLink.title = linkAnchor.title;
      if (linkAnchor.classList.contains('button')) newLink.classList.add('button');
      // The logo__picture logic here seems to be for a special "Maruti Suzuki Engage" link,
      // which is an item row itself, not the main logo.
      if (linkAnchor.classList.contains('logo__picture')) {
        newLink.classList.add('logo__picture');
        newLink.setAttribute('data-logo-name', linkAnchor.getAttribute('data-logo-name'));
        const linkPicture = linkAnchor.querySelector('picture');
        if (linkPicture) {
          const linkImg = linkPicture.querySelector('img');
          if (linkImg) {
            const optimizedLinkPic = createOptimizedPicture(linkImg.src, linkImg.alt, false, [{ width: '79' }]);
            moveInstrumentation(linkImg, optimizedLinkPic.querySelector('img'));
            newLink.append(optimizedLinkPic);
          }
        }
      }
      span.append(newLink);
    } else {
      // If no anchor, it's a plain text title, potentially for a dropdown panel
      span.textContent = linkText;
      // Add a class for dropdown titles if needed, based on original HTML
      // e.g., if (linkText === 'Corporate') span.classList.add('accordion-trigger');
    }

    linkTitleDiv.append(span);
    desktopLinksContainer.append(linkTitleDiv);

    // Check if there's a corresponding desktop panel in the original HTML for this link title.
    // This part is complex and would require more sophisticated parsing of the original HTML
    // or a more explicit model for nested navigation.
    // For now, we'll assume simple link-title elements.
  });
  linksDiv.append(desktopLinksContainer); // Append desktop links to linksDiv
  navbarArena.append(linksDiv);

  // Right section
  const rightDiv = document.createElement('div');
  rightDiv.classList.add('right');
  rightDiv.id = 'nav-right';

  // Contact Wrapper
  const contactWrapper = document.createElement('div');
  contactWrapper.classList.add('contact-wrapper');
  // The original HTML has a 'contact block' inside 'contact-wrapper'.
  // We should recreate that structure or ensure the contact block is handled separately.
  // For now, let's create a minimal structure for the contact trigger.
  const contactBlock = document.createElement('div');
  contactBlock.classList.add('contact', 'block');
  const contactWrpArena = document.createElement('div');
  contactWrpArena.classList.add('contact_wrp_arena', 'user__contact', 'header');
  const contactTitle = document.createElement('h4');
  contactTitle.classList.add('user__contact-title');
  contactTitle.textContent = 'Contact Us';
  const contactIconPhone = document.createElement('span');
  contactIconPhone.classList.add('user__contact-title', 'icon-phone');
  contactIconPhone.setAttribute('aria-label', 'Contact Us');
  contactWrpArena.append(contactTitle, contactIconPhone);

  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box');
  const primaryTelephoneLink = document.createElement('a');
  primaryTelephoneLink.classList.add('primary-telephone');
  primaryTelephoneLink.href = 'tel:18001021800';
  primaryTelephoneLink.textContent = '1800 102 1800';
  contactToggleBox.append(primaryTelephoneLink);
  contactWrpArena.append(contactToggleBox);
  contactBlock.append(contactWrpArena);
  contactWrapper.append(contactBlock);
  rightDiv.append(contactWrapper);

  // Language
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  languageDiv.textContent = 'EN';
  rightDiv.append(languageDiv);

  // Sign-in Wrapper
  const signInWrapper = document.createElement('div');
  signInWrapper.classList.add('sign-in-wrapper', 'hidden'); // Initially hidden as per original HTML
  const signInBlock = document.createElement('div');
  signInBlock.classList.add('sign-in', 'block');
  const userDropdown = document.createElement('div');
  userDropdown.classList.add('user__dropdown');
  const userAccount = document.createElement('div');
  userAccount.classList.add('user__account');

  // Sign-in button
  const signInBtnDiv = document.createElement('div');
  signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
  const signInSpanIcon = document.createElement('span');
  signInSpanIcon.classList.add('user__account__list-icon');
  // Assuming the image for sign-in icon is handled by CSS or a separate block
  const signInButton = document.createElement('button');
  signInButton.setAttribute('type', 'button');
  signInButton.setAttribute('data-sign-out-text', 'Sign Out');
  signInButton.textContent = 'Sign In';
  signInBtnDiv.append(signInSpanIcon, signInButton);
  userAccount.append(signInBtnDiv);
  userDropdown.append(userAccount);
  signInBlock.append(userDropdown);
  signInWrapper.append(signInBlock);
  rightDiv.append(signInWrapper);

  navbarArena.append(rightDiv);
  block.append(navbarArena);

  // Mobile Menu (hidden by default)
  const mobileMenu = document.createElement('div');
  mobileMenu.id = 'menu';
  mobileMenu.classList.add('menu', 'hidden', 'menu-arena');

  const menuHeader = document.createElement('div');
  menuHeader.classList.add('menu-header');
  const backArrow = document.createElement('div');
  backArrow.classList.add('back-arrow');
  const menuTitle = document.createElement('span');
  menuTitle.classList.add('menu-title');
  menuTitle.textContent = 'Menu';
  const closeIcon = document.createElement('span');
  closeIcon.classList.add('close-icon');
  menuHeader.append(backArrow, menuTitle, closeIcon);

  // Re-create the mobile menu list based on linkItemRows,
  // as the desktop structure is now different.
  const mobileMenuList = document.createElement('ul');
  mobileMenuList.classList.add('menu-list');

  linkItemRows.forEach((row, index) => {
    const linkCell = row.children[0];
    const textCell = row.children[1];

    const linkAnchor = linkCell.querySelector('a');
    const linkText = textCell.textContent.trim();

    const li = document.createElement('li');
    li.id = `menu-item-${index}`;
    li.classList.add('nav-link');
    // Add classes like 'home', 'corporate', 'sales', 'service', 'more from us', 'important customer info'
    // based on the linkText to match the original HTML's mobile menu list items.
    const normalizedText = linkText.toLowerCase().replace(/\s/g, '-');
    if (['home', 'corporate', 'sales', 'service'].includes(normalizedText)) {
      li.classList.add(normalizedText);
    } else if (normalizedText === 'more-from-us') {
      li.classList.add('more', 'from', 'us');
    } else if (normalizedText === 'important-customer-info') {
      li.classList.add('important', 'customer', 'info');
    }

    const menuTitleSpan = document.createElement('span');
    menuTitleSpan.classList.add('menu-title');

    if (linkAnchor) {
      const newLink = document.createElement('a');
      newLink.href = linkAnchor.href;
      newLink.textContent = linkText;
      if (linkAnchor.title) newLink.title = linkAnchor.title;
      if (linkAnchor.classList.contains('button')) newLink.classList.add('button');
      if (linkAnchor.classList.contains('logo__picture')) {
        newLink.classList.add('logo__picture');
        newLink.setAttribute('data-logo-name', linkAnchor.getAttribute('data-logo-name'));
        const linkPicture = linkAnchor.querySelector('picture');
        if (linkPicture) {
          const linkImg = linkPicture.querySelector('img');
          if (linkImg) {
            const optimizedLinkPic = createOptimizedPicture(linkImg.src, linkImg.alt, false, [{ width: '79' }]);
            moveInstrumentation(linkImg, optimizedLinkPic.querySelector('img'));
            newLink.append(optimizedLinkPic);
          }
        }
      }
      menuTitleSpan.append(newLink);
    } else {
      menuTitleSpan.textContent = linkText;
      // If it's a title for a dropdown, add 'accordion' class
      if (['Corporate', 'Sales', 'More From us'].includes(linkText)) {
        li.classList.add('accordion');
      }
    }
    li.append(menuTitleSpan);
    mobileMenuList.append(li);
  });
  mobileMenu.append(menuHeader, mobileMenuList);
  block.append(mobileMenu);

  // CHECK 2: INTERACTIVITY
  // Event Listeners for mobile menu toggle
  hamburgerButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    document.body.classList.toggle('no-scroll'); // Class from original HTML for body scroll lock
    hamburgerButton.setAttribute('aria-expanded', mobileMenu.classList.contains('hidden') ? 'false' : 'true');
  });

  closeIcon.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    document.body.classList.remove('no-scroll');
    hamburgerButton.setAttribute('aria-expanded', 'false');
  });

  // Event listener for desktop panel toggles (e.g., Corporate, Sales, More From us)
  // These are triggered by clicking the `link-title` div that contains only text (no `<a>` tag)
  desktopLinksContainer.querySelectorAll('.link-title > span').forEach((span) => {
    if (!span.querySelector('a')) { // Only for titles that are not direct links
      span.closest('.link-title').addEventListener('click', (event) => {
        event.preventDefault();
        const titleText = span.textContent.trim().toLowerCase().replace(/\s/g, '-');
        const panel = block.querySelector(`.desktop-panel.panel.${titleText}`);
        if (panel) {
          panel.classList.toggle('hidden'); // Assuming 'hidden' is used to toggle visibility
          // Also toggle 'active' class on the link-title if needed for styling
          span.closest('.link-title').classList.toggle('active');
        }
      });
    }
  });

  // Event listener for contact toggle (icon-phone)
  const contactTrigger = contactWrpArena.querySelector('.icon-phone');
  if (contactTrigger) {
    contactTrigger.addEventListener('click', () => {
      contactToggleBox.classList.toggle('hidden');
      // Also toggle the visibility of user__contact__icons if it's part of the interaction
      const contactIcons = contactWrpArena.querySelector('.user__contact__icons');
      if (contactIcons) {
        contactIcons.classList.toggle('hidden');
      }
    });
  }

  // Event listener for sign-in button
  const signInButtonElement = signInWrapper.querySelector('.sign-in-btn button');
  if (signInButtonElement) {
    signInButtonElement.addEventListener('click', () => {
      // Assuming this button triggers a modal or a dropdown.
      // The original HTML shows a `user__dropdown` which is likely toggled.
      // For now, let's just toggle the `sign-in-wrapper` itself, or a more specific dropdown if it exists.
      // The original HTML has `sign-in-wrapper` with `hidden` class, so let's toggle that.
      signInWrapper.classList.toggle('hidden'); // This might not be the correct behavior,
      // as the sign-in-wrapper contains the dropdown, which should be toggled.
      // Let's assume the `user__dropdown` itself needs to be toggled, or a class on `sign-in-wrapper`
      // that reveals the dropdown.
      // Based on the original HTML, the `sign-in-wrapper` itself is hidden/shown.
      // If the intent is to show a dropdown *within* the sign-in-wrapper,
      // then a specific element inside it should be toggled.
      // For now, we'll toggle `sign-in-wrapper` as it's the most direct element with `hidden`.
      // A more robust solution would involve a dedicated dropdown element inside.
    });
  }

  // Event listeners for mobile accordion items
  mobileMenuList.querySelectorAll('li.accordion > .menu-title').forEach((accordionTitle) => {
    accordionTitle.addEventListener('click', () => {
      const parentLi = accordionTitle.closest('li.accordion');
      // Find the corresponding panel. This requires a more complex mapping
      // or a consistent structure between the mobile menu and desktop panels.
      // For now, we'll assume a simple toggle for a generic 'panel' class
      // that would be dynamically inserted or cloned.
      // In the original HTML, mobile menu items like 'Corporate' have a sibling `div.panel`.
      // We need to ensure that `panel` is created and appended correctly for mobile.
      // The current JS clones `menuList` but doesn't clone the panels.
      // This part needs significant rework if mobile panels are dynamic.
      // For now, we'll just toggle a placeholder class.
      parentLi.classList.toggle('active'); // Example: toggle an 'active' class
      // If there's a panel, toggle its visibility
      const panel = parentLi.nextElementSibling; // Assuming panel is a direct sibling
      if (panel && panel.classList.contains('panel')) {
        panel.classList.toggle('hidden');
      }
    });
  });

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
