import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const headerEl = document.createElement('header');
  headerEl.id = 'header';
  headerEl.classList.add('header');
  headerEl.setAttribute('role', 'banner');
  headerEl.setAttribute('aria-label', 'Site header');

  const navbarTop = document.createElement('nav');
  navbarTop.classList.add('navbar');
  navbarTop.id = 'navbar-top';

  const regionSecondaryMenu = document.createElement('section');
  regionSecondaryMenu.classList.add('row', 'region', 'region-secondary-menu');

  const blockAccountMenu = document.createElement('nav');
  blockAccountMenu.classList.add('block', 'block-menu', 'navigation', 'menu--account');
  blockAccountMenu.setAttribute('role', 'navigation');
  blockAccountMenu.setAttribute('aria-labelledby', 'block-cbcog-account-menu-menu');
  blockAccountMenu.id = 'block-cbcog-account-menu';

  const h2AccountMenu = document.createElement('h2');
  h2AccountMenu.classList.add('visually-hidden');
  h2AccountMenu.id = 'block-cbcog-account-menu-menu';
  h2AccountMenu.textContent = 'User account menu';
  blockAccountMenu.append(h2AccountMenu);

  const ulAccountMenu = document.createElement('ul');
  ulAccountMenu.classList.add('clearfix', 'nav', 'flex-row');

  const liLogin = document.createElement('li');
  liLogin.classList.add('nav-item');
  const aLogin = document.createElement('a');
  aLogin.href = '/user/login';
  aLogin.classList.add('nav-link', 'nav-link--user-login');
  aLogin.textContent = 'Log in';
  liLogin.append(aLogin);
  ulAccountMenu.append(liLogin);
  blockAccountMenu.append(ulAccountMenu);
  regionSecondaryMenu.append(blockAccountMenu);
  navbarTop.append(regionSecondaryMenu);
  headerEl.append(navbarTop);

  const navbarMain = document.createElement('nav');
  navbarMain.classList.add('navbar', 'navbar-expand-lg');
  navbarMain.id = 'navbar-main';

  const brandLink = document.createElement('a');
  brandLink.href = '/';
  brandLink.title = 'Home';
  brandLink.rel = 'home';
  brandLink.classList.add('navbar-brand');

  const siteLogoDiv = document.createElement('div');
  siteLogoDiv.id = 'site-logo';
  const logoImg = document.createElement('img');
  logoImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775128050573.svg+xml';
  logoImg.alt = 'Home';
  logoImg.classList.add('img-fluid', 'd-inline-block', 'align-top');
  siteLogoDiv.append(logoImg);
  brandLink.append(siteLogoDiv);

  const siteNameDiv = document.createElement('div');
  siteNameDiv.id = 'site-name';
  const siteNameLink = document.createElement('a');
  siteNameLink.href = '/';
  siteNameLink.title = 'Home';
  siteNameLink.rel = 'home';
  siteNameLink.classList.add('navbar-brand');
  const coastalBendDiv = document.createElement('div');
  coastalBendDiv.id = 'coastal-bend';
  coastalBendDiv.textContent = 'Coastal Bend';
  const councilOfGovDiv = document.createElement('div');
  councilOfGovDiv.id = 'council-of-gov';
  councilOfGovDiv.textContent = 'Council of Governments';
  siteNameLink.append(coastalBendDiv, councilOfGovDiv);
  siteNameDiv.append(siteNameLink);

  navbarMain.append(brandLink);
  navbarMain.append(siteNameDiv);

  const toggler = document.createElement('button');
  toggler.classList.add('navbar-toggler', 'navbar-toggler-right');
  toggler.type = 'button';
  toggler.setAttribute('aria-controls', 'CollapsingNavbar');
  toggler.setAttribute('aria-expanded', 'false');
  toggler.setAttribute('aria-label', 'Toggle navigation');
  const togglerIcon = document.createElement('span');
  togglerIcon.classList.add('navbar-toggler-icon');
  toggler.append(togglerIcon);
  navbarMain.append(toggler);

  const collapsingNavbar = document.createElement('div');
  collapsingNavbar.classList.add('collapse', 'navbar-collapse', 'justify-content-end');
  collapsingNavbar.id = 'CollapsingNavbar';

  const blockMainMenu = document.createElement('nav');
  blockMainMenu.classList.add('block', 'block-menu', 'navigation', 'menu--main');
  blockMainMenu.setAttribute('role', 'navigation');
  blockMainMenu.setAttribute('aria-labelledby', 'block-cbcog-main-menu-menu');
  blockMainMenu.id = 'block-cbcog-main-menu';

  const h2MainMenu = document.createElement('h2');
  h2MainMenu.classList.add('visually-hidden');
  h2MainMenu.id = 'block-cbcog-main-menu-menu';
  h2MainMenu.textContent = 'Main navigation';
  blockMainMenu.append(h2MainMenu);

  const ulMainMenu = document.createElement('ul');
  ulMainMenu.id = 'block-cbcog-main-menu';
  ulMainMenu.classList.add('clearfix', 'nav', 'navbar-nav');

  const createNavLink = (text, href, classes = []) => {
    const li = document.createElement('li');
    li.classList.add('nav-item');
    const a = document.createElement('a');
    a.href = href;
    a.classList.add('nav-link', ...classes);
    a.textContent = text;
    li.append(a);
    return li;
  };

  const createDropdown = (labelText, items) => {
    const li = document.createElement('li');
    li.classList.add('nav-item', 'menu-item--expanded', 'dropdown');

    const span = document.createElement('span');
    span.classList.add('nav-link', 'dropdown-toggle', 'nav-link-');
    span.setAttribute('aria-expanded', 'false');
    span.setAttribute('aria-haspopup', 'true');
    span.textContent = labelText;

    const dropdownMenu = document.createElement('ul');
    dropdownMenu.classList.add('dropdown-menu');

    items.forEach((item) => {
      const dropdownItemLi = document.createElement('li');
      dropdownItemLi.classList.add('dropdown-item');
      if (item.collapsed) {
        dropdownItemLi.classList.add('menu-item--collapsed');
      }
      const a = document.createElement('a');
      a.href = item.href;
      a.classList.add(item.class);
      a.textContent = item.text;
      dropdownItemLi.append(a);
      dropdownMenu.append(dropdownItemLi);
    });

    li.append(span, dropdownMenu);

    span.addEventListener('click', () => {
      dropdownMenu.classList.toggle('show');
      span.setAttribute('aria-expanded', dropdownMenu.classList.contains('show'));
    });

    return li;
  };

  ulMainMenu.append(createNavLink('Home', '/', ['nav-link--', 'is-active']));
  ulMainMenu.append(
    createDropdown('Departments', [
      { href: '/departments/admin-fin', text: 'Administration & Finance', class: 'nav-link--departments-admin-fin', collapsed: true },
      { href: '/aaa', text: 'Area Agency on Aging', class: 'nav-link--aaa' },
      { href: '/adrc', text: 'Aging & Disability Resource Center', class: 'nav-link--adrc' },
      { href: '/departments/911-network', text: '9-1-1 Network', class: 'nav-link--departments-911-network' },
      { href: '/departments/economic-development', text: 'Economic Development', class: 'nav-link--departments-economic-development' },
      { href: '/departments/criminal-justice', text: 'Criminal Justice', class: 'nav-link--departments-criminal-justice' },
      { href: '/departments/homeland-security', text: 'Homeland Security', class: 'nav-link--departments-homeland-security' },
      { href: '/departments/environmental-planning', text: 'Environmental Planning', class: 'nav-link--departments-environmental-planning' },
    ]),
  );
  ulMainMenu.append(
    createDropdown('Calendars', [
      { href: '/main-calendar/month', text: 'Meeting Calendar', class: 'nav-link--main-calendar-month' },
      { href: '/regional-training-calendar', text: 'Regional Training Calendar', class: 'nav-link--regional-training-calendar' },
    ]),
  );
  ulMainMenu.append(createNavLink('News', '/news-articles', ['nav-link--news-articles']));
  ulMainMenu.append(createNavLink('About', '/about', ['nav-link--about']));
  ulMainMenu.append(createNavLink('Contact', '/contact', ['nav-link--contact']));
  ulMainMenu.append(createNavLink('Employment', '/employment', ['nav-link--employment']));

  blockMainMenu.append(ulMainMenu);
  collapsingNavbar.append(blockMainMenu);
  navbarMain.append(collapsingNavbar);
  headerEl.append(navbarMain);

  // Handle mobile toggler
  toggler.addEventListener('click', () => {
    collapsingNavbar.classList.toggle('show');
    toggler.setAttribute('aria-expanded', collapsingNavbar.classList.contains('show'));
  });

  // Process nav items from block children
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(cell => cell.textContent.trim() !== '' && !cell.querySelector('a')); // Assuming label cell has text content and no link
    const navItemsCell = cells.find(cell => cell.children.length > 0 && cell.querySelector('a')); // Assuming nav items cell contains links

    if (labelCell && navItemsCell) {
      const label = labelCell.textContent.trim();
      const navItems = [...navItemsCell.children];

      const li = document.createElement('li');
      li.classList.add('nav-item', 'menu-item--expanded', 'dropdown');

      const span = document.createElement('span');
      span.classList.add('nav-link', 'dropdown-toggle', 'nav-link-');
      span.setAttribute('aria-expanded', 'false');
      span.setAttribute('aria-haspopup', 'true');
      span.textContent = label;

      const dropdownMenu = document.createElement('ul');
      dropdownMenu.classList.add('dropdown-menu');

      navItems.forEach((navItemRow) => {
        const itemCells = [...navItemRow.children];
        const itemLabelCell = itemCells.find(cell => cell.textContent.trim() !== '' && !cell.querySelector('a'));
        const itemLinkCell = itemCells.find(cell => cell.querySelector('a'));

        if (itemLabelCell && itemLinkCell) {
          const itemLabel = itemLabelCell.textContent.trim();
          const itemLinkEl = itemLinkCell.querySelector('a');

          const dropdownItemLi = document.createElement('li');
          dropdownItemLi.classList.add('dropdown-item');
          const a = document.createElement('a');
          if (itemLinkEl) {
            a.href = itemLinkEl.href;
          }
          a.textContent = itemLabel;
          dropdownItemLi.append(a);
          dropdownMenu.append(dropdownItemLi);
        }
      });

      li.append(span, dropdownMenu);
      ulMainMenu.append(li);

      span.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
        span.setAttribute('aria-expanded', dropdownMenu.classList.contains('show'));
      });
    }
    moveInstrumentation(row, document.createElement('div')); // Move instrumentation from original row
  });

  headerEl.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(headerEl);
}
