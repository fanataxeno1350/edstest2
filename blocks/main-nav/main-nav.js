import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const nav = document.createElement('nav');
  nav.id = 'main-nav';
  nav.classList.add('blue_nav', 'hc-nav', 'hc-nav-1');

  const ul = document.createElement('ul');
  ul.classList.add('second-nav');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    // Use content detection instead of index access
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const iconCell = cells.find(cell => cell.querySelector('picture'));

    const link = linkCell?.querySelector('a');
    const icon = iconCell?.querySelector('picture');

    let anchorOrSpan;
    if (link) {
      anchorOrSpan = document.createElement('a');
      anchorOrSpan.href = link.href;
      anchorOrSpan.textContent = labelCell?.textContent.trim() || '';
      anchorOrSpan.setAttribute('tabindex', '0');
      li.append(anchorOrSpan);
    } else {
      anchorOrSpan = document.createElement('span');
      anchorOrSpan.textContent = labelCell?.textContent.trim() || '';
      li.append(anchorOrSpan);
    }

    if (icon) {
      const img = icon.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        li.append(optimizedPic);
      }
    }

    // Add specific classes based on content, mimicking original HTML structure.
    const labelText = labelCell?.textContent.trim();
    if (labelText === 'Who We Are') {
      li.classList.add('whoweare', 'active');
    } else if (labelText === 'Our Impact') {
      li.classList.add('ourimpacts', 'active');
    } else if (labelText === 'Our Brands' || labelText === 'Our Stories') {
      li.classList.add('no-arw');
    } else if (labelText === 'Resources') {
      li.classList.add('devices');
      // Add span for nav-down if it's a resources item
      const navDownSpan = document.createElement('span');
      navDownSpan.classList.add('nav-down');
      anchorOrSpan.append(navDownSpan);
    }

    // The original HTML has nested div.ul_outer for sub-menus.
    // This block structure does not provide sub-menu content directly.
    // If sub-menus were needed, the EDS model would need to define them.
    // For now, we only create the top-level list items.
    // We need to add the interactive elements for sub-menus if they exist in the original HTML.
    // The original HTML shows `ul_outer` for 'Who We Are', 'Our Impact', 'Resources'.
    // Since the block structure doesn't provide this, we'll simulate the interactive part.
    if (li.classList.contains('whoweare') || li.classList.contains('ourimpacts') || li.classList.contains('devices')) {
      const ulOuter = document.createElement('div');
      ulOuter.classList.add('ul_outer');
      if (li.classList.contains('devices')) {
        ulOuter.classList.add('resourcesClass');
      }

      // Add the close button structure
      const headerClassClose = document.createElement('div');
      headerClassClose.classList.add('Headerclassclose');
      const secondNavClose = document.createElement('div');
      secondNavClose.classList.add('SecondnavClose');
      const closeSpan = document.createElement('span');
      const closeImg = document.createElement('img');
      closeImg.alt = 'svg file';
      closeImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775626483884.svg+xml'; // Example close icon
      closeSpan.append(closeImg);
      secondNavClose.append(closeSpan);
      headerClassClose.append(secondNavClose);
      ulOuter.append(headerClassClose);

      li.append(ulOuter);

      // Add event listener for toggling sub-menu
      anchorOrSpan.addEventListener('click', (e) => {
        e.preventDefault();
        li.classList.toggle('active'); // Toggle active class on li
        ulOuter.classList.toggle('active'); // Toggle active class on ul_outer for visibility
      });

      // Add event listener for closing sub-menu
      secondNavClose.addEventListener('click', () => {
        li.classList.remove('active');
        ulOuter.classList.remove('active');
      });
    }

    ul.append(li);
  });

  nav.append(ul);

  // Append the mobile specific ul if needed, based on original HTML, but without content from block.
  // This section is hardcoded as there's no model for 'display_mobi' items.
  const displayMobiUl = document.createElement('ul');
  displayMobiUl.classList.add('display_mobi');

  const globalSitesLi = document.createElement('li');
  const globalSitesImg1 = document.createElement('img');
  globalSitesImg1.alt = 'svg file';
  globalSitesImg1.src = '/content/dam/aemigrate/uploaded-folder/image/1775626484235.svg+xml';
  globalSitesLi.append(globalSitesImg1);

  const globalSitesLink = document.createElement('a');
  globalSitesLink.href = '/global-sites';
  globalSitesLink.setAttribute('tabindex', '0');
  globalSitesLink.setAttribute('aria-label', 'PepsiCo Country');
  const globalSitesImg2 = document.createElement('img');
  globalSitesImg2.alt = 'svg file';
  globalSitesImg2.src = '/content/dam/aemigrate/uploaded-folder/image/1775626484295.svg+xml';
  globalSitesLink.append(globalSitesImg2);
  globalSitesLink.append(' India');
  globalSitesLi.append(globalSitesLink);
  displayMobiUl.append(globalSitesLi);

  const contactLi = document.createElement('li');
  const contactLink = document.createElement('a');
  contactLink.href = '/contact';
  contactLink.setAttribute('tabindex', '0');
  contactLink.setAttribute('aria-label', 'PepsiCo Contact');
  contactLink.textContent = 'Contact';
  contactLi.append(contactLink);
  displayMobiUl.append(contactLi);

  const mobileDropdownLi = document.createElement('li');
  mobileDropdownLi.classList.add('mobile-dropdown');
  displayMobiUl.append(mobileDropdownLi);

  nav.append(displayMobiUl);

  block.textContent = '';
  block.append(nav);
}
