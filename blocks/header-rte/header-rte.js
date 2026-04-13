import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [logoRow, logoLinkRow, textRow, ...socialLinkRows] = [...block.children];

  const header = document.createElement('div');
  header.classList.add('cmp-header');

  const hamburger = document.createElement('input');
  hamburger.classList.add('cmp-header__hamburger');
  hamburger.type = 'checkbox';
  hamburger.id = 'hamburger-toggle'; // Add an ID for the label to target
  header.append(hamburger);

  const hamburgerLabel = document.createElement('label');
  hamburgerLabel.htmlFor = 'hamburger-toggle';
  hamburgerLabel.classList.add('cmp-header__hamburger-label'); // Assuming a label class for styling
  header.prepend(hamburgerLabel); // Prepend so it's visually before the hamburger input

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image', 'cmp-header__logo');
  moveInstrumentation(logoRow, logoDiv);

  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link');
  const logoLinkEl = logoLinkRow.querySelector('a');
  if (logoLinkEl) {
    logoLink.href = logoLinkEl.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);

  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  logoDiv.append(logoLink);
  header.append(logoDiv);

  // Navigation
  const navLinksDiv = document.createElement('div');
  navLinksDiv.classList.add('cmp-header__nav-links');
  const navigationDiv = document.createElement('div');
  navigationDiv.classList.add('navigation');
  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation');
  nav.setAttribute('role', 'navigation');

  function parseNavTree(ul) {
    return [...ul.querySelectorAll(':scope > li')].map((li) => {
      let label = '';
      let linkHref = '';
      // Iterate childNodes to get text and potential <a> tag, skipping nested <ul>
      for (const node of li.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          label += node.textContent.trim();
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'A') {
            label += node.textContent.trim();
            linkHref = node.href;
          } else if (node.tagName !== 'UL') {
            // Include text from other non-UL elements if present
            label += node.textContent.trim();
          }
        }
      }
      label = label.trim();

      const childUl = li.querySelector(':scope > ul');
      return { label, href: linkHref, children: childUl ? parseNavTree(childUl) : [] };
    });
  }

  function renderNavItems(items, parentContainer, depth = 0) {
    items.forEach((item) => {
      const li = document.createElement('li');
      li.classList.add('cmp-navigation__item', `cmp-navigation__item--level-${depth}`);

      const itemLink = document.createElement('a');
      itemLink.classList.add('cmp-navigation__item-link');
      itemLink.textContent = item.label;
      if (item.href) {
        itemLink.href = item.href;
      }
      li.append(itemLink);

      if (item.children.length > 0) {
        li.classList.add('cmp-header__nav-products', 'cmp-header__nav-products-click'); // Add classes for parent items

        const submenu = document.createElement('ul');
        // Use cmp-header__product-items for depth 0, cmp-header__submenu for deeper levels
        submenu.classList.add('cmp-navigation__group', depth === 0 ? 'cmp-header__product-items' : 'cmp-header__submenu');

        // Create a wrapper div for category menu ONLY if depth > 0, as seen in original HTML for submenus
        // For depth 0, the product-items ul is directly appended to li.
        // For deeper levels, the submenu ul is wrapped in cmp-header__category-menu
        let targetContainerForChildren = submenu;
        if (depth > 0) {
          const categoryMenuDiv = document.createElement('div');
          categoryMenuDiv.classList.add('cmp-header__category-menu');
          submenu.append(categoryMenuDiv);
          targetContainerForChildren = categoryMenuDiv;
        }

        // RECURSIVE: render children into the correct target container
        renderNavItems(item.children, targetContainerForChildren, depth + 1);

        // Add toggle behavior to the link itself, as per original HTML
        itemLink.addEventListener('click', (e) => {
          e.preventDefault(); // Prevent navigation
          submenu.classList.toggle('show'); // Use a class to show/hide
          li.classList.toggle('cmp-navigation__item--open'); // Example class for open state
        });

        li.append(submenu);
      } else {
        li.classList.add('cmp-header__no-item'); // Add no-item class for leaf items
      }

      parentContainer.append(li);
    });
  }

  const textCell = textRow?.querySelector('div');
  const temp = document.createElement('div');
  temp.innerHTML = textCell?.innerHTML ?? '';
  const rootUl = temp.querySelector('ul');
  const navItems = rootUl ? parseNavTree(rootUl) : [];

  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-navigation__group', 'cmp-header__nav-group');
  renderNavItems(navItems, navGroup);
  nav.append(navGroup);

  // Mobile list and social media
  const mobileListDiv = document.createElement('div');
  mobileListDiv.classList.add('cmp-header__mobile-list');

  const policyUl = document.createElement('ul');
  policyUl.classList.add('cmp-header__policy');
  // Example policy links (these would typically come from model, but for this example, hardcoding based on original HTML)
  const policyLinks = [
    { label: 'Contact us', href: '/more/contact-us.html' },
    { label: 'Terms of use', href: '/conditions-policy/terms-of-use.html' },
    { label: 'Privacy Policy', href: '/conditions-policy/privacy-policy.html' },
  ];
  policyLinks.forEach(p => {
    const li = document.createElement('li');
    li.classList.add('cmp-header__policy-list');
    const a = document.createElement('a');
    a.href = p.href;
    a.textContent = p.label;
    a.target = '_blank';
    li.append(a);
    policyUl.append(li);
  });
  mobileListDiv.append(policyUl);

  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('cmp-header__social-media');
  socialLinkRows.forEach((row) => {
    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const iconClassCell = cells.find(cell => !cell.querySelector('a'));

    if (linkCell && iconClassCell) {
      const linkEl = linkCell.querySelector('a');
      const socialLink = document.createElement('a');
      socialLink.href = linkEl.href;
      socialLink.target = '_blank';
      socialLink.classList.add(iconClassCell.textContent.trim()); // Apply icon class directly
      socialLink.setAttribute('data-social', iconClassCell.textContent.trim().replace('icon-', '')); // Extract social name
      moveInstrumentation(row, socialLink);
      socialMediaDiv.append(socialLink);
    }
  });
  mobileListDiv.append(socialMediaDiv);
  nav.append(mobileListDiv);

  navigationDiv.append(nav);
  navLinksDiv.append(navigationDiv);
  header.append(navLinksDiv);

  // Nav icons (search, accessibility, login)
  const navIconsDiv = document.createElement('div');
  navIconsDiv.classList.add('cmp-header__nav-icons');

  const accessibilityDiv = document.createElement('div');
  accessibilityDiv.classList.add('cmp-header__accessbility', 'cmp-header__hide-icon');
  const accessibilityLink = document.createElement('a');
  accessibilityLink.href = '#';
  accessibilityLink.classList.add('cmp-header__icon-img');
  const accessibilityIcon = document.createElement('div');
  accessibilityIcon.classList.add('icon-accessibility');
  accessibilityLink.append(accessibilityIcon);
  accessibilityDiv.append(accessibilityLink);
  navIconsDiv.append(accessibilityDiv);

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('cmp-header__search');
  const searchLink = document.createElement('a');
  searchLink.href = '#';
  searchLink.classList.add('cmp-header__icon-img');
  const searchIcon = document.createElement('div');
  searchIcon.classList.add('icon-search');
  const searchText = document.createElement('div');
  searchText.classList.add('cmp-header__icon-text');
  searchText.textContent = 'Search';
  searchLink.append(searchIcon, searchText);
  searchDiv.append(searchLink);
  navIconsDiv.append(searchDiv);

  const loginDiv = document.createElement('div');
  loginDiv.classList.add('cmp-header__login', 'cmp-header__hide-icon');
  const loginLink = document.createElement('a');
  loginLink.href = '#';
  loginLink.classList.add('cmp-header__icon-img');
  const loginIcon = document.createElement('div');
  loginIcon.classList.add('icon-profile');
  loginLink.append(loginIcon);
  loginDiv.append(loginLink);
  navIconsDiv.append(loginDiv);

  header.append(navIconsDiv);

  block.textContent = '';
  block.append(header);

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Add event listener for hamburger menu to toggle navLinksDiv visibility
  hamburger.addEventListener('change', () => {
    navLinksDiv.classList.toggle('show', hamburger.checked);
  });
}
