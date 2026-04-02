import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [logoRow, logoLinkRow, siteNameRow, ...itemRows] = [...block.children];

  const nav = document.createElement('nav');
  nav.classList.add('navbar', 'navbar-expand-lg');
  nav.id = 'navbar-main';

  const navbarBrand = document.createElement('a');
  navbarBrand.classList.add('navbar-brand');
  const logoLink = logoLinkRow.querySelector('a');
  if (logoLink) {
    navbarBrand.href = logoLink.href;
    navbarBrand.title = 'Home';
    navbarBrand.rel = 'home';
  }
  moveInstrumentation(logoLinkRow, navbarBrand);

  const siteLogoDiv = document.createElement('div');
  siteLogoDiv.id = 'site-logo';
  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      siteLogoDiv.append(optimizedPic);
    }
  }
  moveInstrumentation(logoRow, siteLogoDiv);
  navbarBrand.append(siteLogoDiv);

  const siteNameDiv = document.createElement('div');
  siteNameDiv.id = 'site-name';
  const siteNameLink = document.createElement('a');
  siteNameLink.classList.add('navbar-brand');
  if (logoLink) {
    siteNameLink.href = logoLink.href;
    siteNameLink.title = 'Home';
    siteNameLink.rel = 'home';
  }
  moveInstrumentation(siteNameRow, siteNameLink);

  const siteNameText = siteNameRow.querySelector('div');
  const coastalBendDiv = document.createElement('div');
  coastalBendDiv.id = 'coastal-bend';
  if (siteNameText) {
    coastalBendDiv.textContent = siteNameText.textContent;
  }
  siteNameLink.append(coastalBendDiv);

  const councilOfGovDiv = document.createElement('div');
  councilOfGovDiv.id = 'council-of-gov';
  // As per the original HTML, it seems to be a fixed string.
  councilOfGovDiv.textContent = 'Council of Governments';
  siteNameLink.append(councilOfGovDiv);
  siteNameDiv.append(siteNameLink);
  navbarBrand.append(siteNameDiv);

  nav.append(navbarBrand);

  const toggler = document.createElement('button');
  toggler.classList.add('navbar-toggler', 'navbar-toggler-right');
  toggler.type = 'button';
  toggler.setAttribute('data-toggle', 'collapse'); // Added from original HTML
  toggler.setAttribute('data-target', '#CollapsingNavbar'); // Added from original HTML
  toggler.setAttribute('aria-controls', 'CollapsingNavbar');
  toggler.setAttribute('aria-expanded', 'false');
  toggler.setAttribute('aria-label', 'Toggle navigation');

  const togglerSpan = document.createElement('span');
  togglerSpan.classList.add('navbar-toggler-icon');
  toggler.append(togglerSpan);
  nav.append(toggler);

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('collapse', 'navbar-collapse', 'justify-content-end');
  navbarCollapse.id = 'CollapsingNavbar';

  toggler.addEventListener('click', () => {
    navbarCollapse.classList.toggle('show');
    // The original HTML does not toggle 'collapsed' class on the toggler itself.
    // It only toggles 'show' on the target element.
    const expanded = toggler.getAttribute('aria-expanded') === 'true';
    toggler.setAttribute('aria-expanded', !expanded);
  });

  const navRole = document.createElement('nav');
  navRole.classList.add('block', 'block-menu', 'navigation', 'menu--main');
  navRole.setAttribute('role', 'navigation');
  navRole.setAttribute('aria-labelledby', 'block-cbcog-main-menu-menu');
  navRole.id = 'block-cbcog-main-menu';

  const h2 = document.createElement('h2');
  h2.classList.add('visually-hidden');
  h2.id = 'block-cbcog-main-menu-menu';
  h2.textContent = 'Main navigation';
  navRole.append(h2);

  const ul = document.createElement('ul');
  ul.classList.add('clearfix', 'nav', 'navbar-nav');
  // The original HTML has id="block-cbcog-main-menu" on both the nav and the ul.
  // This is a duplicate ID, which is invalid. We will keep it on the nav and remove from ul.
  // ul.id = 'block-cbcog-main-menu';

  itemRows.forEach((row) => {
    const cells = [...row.children];
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const firstCellContent = cells[0];
    const secondCellContent = cells[1];

    // Distinguish between nav-item and dropdown based on content
    // nav-item has a link in the first cell and text in the second.
    // dropdown has text in the first cell and a container of links in the second.
    if (firstCellContent.querySelector('a') && secondCellContent && !secondCellContent.querySelector('a')) { // nav-item
      li.classList.add('nav-item');
      const link = firstCellContent.querySelector('a');
      const navLink = document.createElement('a');
      navLink.classList.add('nav-link', 'nav-link--'); // 'nav-link--' is from original HTML
      if (link) {
        navLink.href = link.href;
        navLink.textContent = secondCellContent.textContent;
      }
      moveInstrumentation(firstCellContent, navLink);
      moveInstrumentation(secondCellContent, navLink);
      li.append(navLink);
    } else if (firstCellContent && secondCellContent && secondCellContent.querySelector('a')) { // dropdown
      li.classList.add('nav-item', 'menu-item--expanded', 'dropdown');

      const span = document.createElement('span');
      span.classList.add('nav-link', 'dropdown-toggle', 'nav-link-'); // 'nav-link-' is from original HTML
      span.textContent = firstCellContent.textContent;
      span.setAttribute('data-toggle', 'dropdown'); // Added from original HTML
      span.setAttribute('aria-expanded', 'false');
      span.setAttribute('aria-haspopup', 'true');
      moveInstrumentation(firstCellContent, span);
      li.append(span);

      const dropdownUl = document.createElement('ul');
      dropdownUl.classList.add('dropdown-menu');
      moveInstrumentation(secondCellContent, dropdownUl);

      // Dropdown items are individual links within the second cell's content
      // The original HTML shows each dropdown item as a separate <li><a>...</li>
      // The EDS structure shows "dropdown-items" as a container.
      // We need to parse the second cell's content for individual links.
      const dropdownLinks = secondCellContent.querySelectorAll('a');

      dropdownLinks.forEach((link) => {
        const dropdownLi = document.createElement('li');
        dropdownLi.classList.add('dropdown-item');
        // The original HTML sometimes has 'menu-item--collapsed' on dropdown items,
        // but the EDS structure doesn't provide a field for this.
        // We'll omit it unless there's a specific field for it.
        const dropdownLink = document.createElement('a');
        dropdownLink.href = link.href;
        // The original HTML sometimes has specific classes like 'nav-link--departments-admin-fin'
        // These are not in the EDS structure, so we'll omit them.
        dropdownLink.textContent = link.textContent;
        dropdownLi.append(dropdownLink);
        dropdownUl.append(dropdownLi);
      });

      li.append(dropdownUl);

      span.addEventListener('click', () => {
        const isExpanded = span.getAttribute('aria-expanded') === 'true';
        span.setAttribute('aria-expanded', !isExpanded);
        dropdownUl.classList.toggle('show');
      });
    }
    ul.append(li);
  });

  navRole.append(ul);
  navbarCollapse.append(navRole);
  nav.append(navbarCollapse);

  block.textContent = '';
  block.append(nav);

  // Image optimization for the logo
  // This part is already handled when creating siteLogoDiv,
  // but if there are other images in the block, this would optimize them.
  // Given the structure, the logo is the only image.
  // The initial optimization for the logo is correct.
  // This block.querySelectorAll('picture > img') might re-process the same image
  // or apply to other images if they exist. For now, we'll keep it as a general
  // optimization pass, but it's redundant for the logo if it's already optimized.
  block.querySelectorAll('picture > img').forEach((img) => {
    // Ensure we don't re-optimize already optimized pictures or pictures that are part of instrumentation
    if (!img.closest('.block') || img.closest('.block').contains(img)) { // Check if it's within the current block
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      // moveInstrumentation should be from the original img to the new img within the optimized picture
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
    }
  });
}
