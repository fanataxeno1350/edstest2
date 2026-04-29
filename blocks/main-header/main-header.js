import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Add classes from ORIGINAL HTML to li, a, ul
    li.classList.add('nav-menu-item', 'list-item');
    if (anchor) {
      anchor.classList.add('nav-menu-link');
    }
    if (nested) {
      nested.classList.add('sub-nav-list');
    }

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
      }
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-sub-child'); // From ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
      transformNestedLists(nested); // Recursively transform nested lists
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const [
    logoRow,
    logoLinkRow,
    anniversaryLogoRow,
    anniversaryLogoLinkRow,
    ...itemRows
  ] = children;

  const navigationItems = itemRows.filter((row) => row.children.length === 3);
  // const pressReleaseItems = itemRows.filter((row) => row.children.length === 4); // Not used in current JS
  const contactLinkItems = itemRows.filter((row) => row.children.length === 2);

  const header = document.createElement('header');
  header.classList.add('main-header'); // From ORIGINAL HTML

  // Container wrap
  const container = document.createElement('div');
  container.classList.add('container'); // From ORIGINAL HTML
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap'); // From ORIGINAL HTML
  container.append(wrap);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo'); // From ORIGINAL HTML
  wrap.append(logoDiv);

  const mainLogoLink = document.createElement('a');
  const foundMainLogoLink = logoLinkRow.querySelector('a');
  if (foundMainLogoLink) {
    mainLogoLink.href = foundMainLogoLink.href;
  }
  moveInstrumentation(logoLinkRow, mainLogoLink);

  const mainLogoPicture = logoRow.querySelector('picture');
  if (mainLogoPicture) {
    const img = mainLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
    mainLogoLink.append(optimizedPic);
  }
  logoDiv.append(mainLogoLink);

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger'); // From ORIGINAL HTML
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search'); // From ORIGINAL HTML
  const ulHamburger = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    ulHamburger.append(document.createElement('li'));
  }
  hamburger.append(ulHamburger);
  wrap.append(hamburger);

  // Main Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav'); // From ORIGINAL HTML
  nav.setAttribute('data-once', 'initSubChildToggle'); // From ORIGINAL HTML
  wrap.append(nav);

  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', ''); // From ORIGINAL HTML
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement'); // From ORIGINAL HTML
  nav.append(navUl);

  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red'); // From ORIGINAL HTML
    li.setAttribute('itemprop', 'name'); // From ORIGINAL HTML
    li.setAttribute('data-once', 'nav-close-search'); // From ORIGINAL HTML

    const foundLink = linkCell?.querySelector('a');
    let rootEl;
    if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.href = foundLink.href;
      rootEl.setAttribute('itemprop', 'url'); // From ORIGINAL HTML
    } else {
      rootEl = document.createElement('span');
    }
    rootEl.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, rootEl);
    li.appendChild(rootEl);

    // Add SVG icon
    const svgSpan = document.createElement('span');
    svgSpan.innerHTML = `
      <svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g>
        <g id="SVGRepo_iconCarrier">
          <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)">
            <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path>
          </g>
        </g>
      </svg>
    `;
    li.appendChild(svgSpan);

    const hierarchyRootContainer = document.createElement('div');
    hierarchyRootContainer.innerHTML = hierarchyCell?.innerHTML || ''; // Read richtext with innerHTML
    moveInstrumentation(hierarchyCell, hierarchyRootContainer); // Move instrumentation for richtext cell

    const hierarchyRoot = hierarchyRootContainer.querySelector('ul');
    if (hierarchyRoot) {
      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu'); // From ORIGINAL HTML
      li.appendChild(megaMenu);

      const megaMenuWrap = document.createElement('div');
      megaMenuWrap.classList.add('wrap', 'container'); // From ORIGINAL HTML
      megaMenu.appendChild(megaMenuWrap);

      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div'); // From ORIGINAL HTML
      megaMenuWrap.appendChild(centerDiv);

      // Add left-div content from ORIGINAL HTML (hardcoded as it's not in block.children)
      const leftDiv = document.createElement('div');
      leftDiv.classList.add('left-div');
      // Example for "Who We Are" menu
      if (rootEl.textContent.trim() === 'Who We Are') { // Check for specific menu item
        leftDiv.innerHTML = `
          <h4 class="left-div-heading"><a>Our Purpose</a></h4>
          <p class="left-div-desc">Drive positive change in the lives of our communities. Only when we enable others to rise will we rise.</p>
          <p class="left-div-subdesc">#TogetherWeRise</p>
        `;
      } else if (rootEl.textContent.trim() === 'What we do') {
        leftDiv.innerHTML = `
          <h4 class="left-div-heading"><a>Key Facts</a></h4>
          <ul>
            <li class="list-text-red">20+ <span>Industries</span></li>
            <li class="list-text-red">100+ <span>Countries</span></li>
            <li class="list-text-red">324K+ <span>Employees</span></li>
          </ul>
        `;
      } else if (rootEl.textContent.trim() === 'Investor Relations') {
        leftDiv.classList.add('ir-left-div');
        leftDiv.innerHTML = `
          <h4 class="left-div-heading"><a>Investor Relations</a></h4>
          <p>Group Highlights - Q3 F26</p>
          <ul>
            <li class="list-text-red">20.1% <span>Consolidated ROE (Annualized)</span></li>
            <li class="list-text-red">Rs 52,100 cr <span>Revenue</span></li>
            <li class="list-text-red">Rs 4,675 cr <span>PAT</span></li>
          </ul>
        `;
      } else if (rootEl.textContent.trim() === 'newsroom') {
        leftDiv.classList.add('newsroom-left-div');
        leftDiv.innerHTML = `
          <h4 class="left-div-heading"><a>Newsroom</a></h4>
          <div class="latest-two-press-release">
            <!-- TODO: This content should come from a separate block or model field, not hardcoded -->
            <div class="slides"><div class="wrap">
              <div class="content">
                <div class="desc">
                  <p><a href="/news-room/press-release/en/financial-results-quarter-4-and-full-year-fy26-standalone-and-consolidated-results" hreflang="en">Financial Results – Quarter 4 and Full year FY26, Standalone &amp; Consolidated Results</a></p>
                  <div class="date">
                    <em><time datetime="2026-04-27T12:00:00Z">27 April 2026</time></em><em>Finance</em>
                  </div>
                </div>
              </div>
            </div></div>
            <div class="slides"><div class="wrap">
              <div class="content">
                <div class="desc">
                  <p><a href="/news-room/press-release/en/the-originals-return-yezdi-and-bsa-launch-two-stunning-new-scrambler-motorcycles" hreflang="en">The originals return: Yezdi and BSA launch two stunning new scrambler motorcycles</a></p>
                  <div class="date">
                    <em><time datetime="2026-04-25T12:00:00Z">25 April 2026</time></em><em>Auto</em>
                  </div>
                </div>
              </div>
            </div></div>
          </div>
        `;
      } else if (rootEl.textContent.trim() === 'careers') {
        leftDiv.classList.add('career-left-div');
        leftDiv.innerHTML = `
          <h4 class="left-div-heading"><a>careers</a></h4>
          <p class="left-div-desc">Committed to elevate the lives of communities, guided by our core behaviours and values.</p>
          <p class="left-div-subdesc">Bold. Agile. Collaborative.</p>
        `;
      }
      centerDiv.appendChild(leftDiv);

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap'); // From ORIGINAL HTML
      // Add specific classes based on menu item from ORIGINAL HTML
      if (rootEl.textContent.trim() === 'Who We Are') {
        subNavWrap.classList.add('about-us-sub-nav');
      } else if (rootEl.textContent.trim() === 'What we do') {
        subNavWrap.classList.add('what-we-do');
      } else if (rootEl.textContent.trim() === 'Investor Relations') {
        subNavWrap.classList.add('element-block');
        // Add additional wrappers for Investor Relations
        const ulOneLink = document.createElement('ul');
        ulOneLink.classList.add('sub-nav-wrap-one-link');
        const liOneLink = document.createElement('li');
        liOneLink.innerHTML = '<li><a href="https://www.mahindra.com/sites/default/files/2025-04/Disclosures-under-Reg-46-62-MM-URLs_PDF.pdf" target="_blank">Disclosures Under Regulation 46 And 62 Of SEBI (LODR)</a></li>';
        ulOneLink.append(liOneLink);
        subNavWrap.append(ulOneLink);

        const innerSubNavWrapList = document.createElement('div');
        innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');
        innerSubNavWrapList.append(hierarchyRoot); // Append the hierarchyRoot here
        subNavWrap.append(innerSubNavWrapList);
      } else if (rootEl.textContent.trim() === 'careers') {
        subNavWrap.classList.add('careers-div');
      }

      if (rootEl.textContent.trim() !== 'Investor Relations') { // For IR, hierarchyRoot is appended inside inner-sub-nav-wrap-list
        subNavWrap.appendChild(hierarchyRoot);
      }
      centerDiv.appendChild(subNavWrap);

      transformNestedLists(hierarchyRoot);

      rootEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        megaMenu.classList.toggle('active');
      });
    }

    navUl.appendChild(li);
  });

  // Mobile and Desktop Icon Navigation
  const createIconNav = (isMobile) => {
    const iconNav = document.createElement('div');
    iconNav.classList.add('icon-nav'); // From ORIGINAL HTML
    if (isMobile) {
      iconNav.classList.add('mobile-menus-icon'); // From ORIGINAL HTML
    } else {
      iconNav.classList.add('desktop-menus-icon'); // From ORIGINAL HTML
    }
    const iconNavUl = document.createElement('ul');
    iconNav.append(iconNavUl);

    // Contact Us link
    const mailLi = document.createElement('li');
    mailLi.classList.add('mail'); // From ORIGINAL HTML
    const mailLink = document.createElement('a');
    // Use destructuring for contactLinkItems as it's a fixed schema
    if (contactLinkItems.length > 0) {
      const [contactLinkCell, contactLabelCell] = [...contactLinkItems[0].children];
      mailLink.href = contactLinkCell?.querySelector('a')?.href || '#';
      mailLink.textContent = isMobile ? contactLabelCell?.textContent.trim() || 'Contact Us' : '';
      moveInstrumentation(contactLinkItems[0], mailLink);
    } else {
      mailLink.href = '#';
      mailLink.textContent = isMobile ? 'Contact Us' : '';
    }

    if (!isMobile) {
      mailLink.innerHTML += `
        <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink">
          <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                    C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                    L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
        </svg>
      `;
    }
    mailLi.append(mailLink);
    iconNavUl.append(mailLi);

    // Search link
    const searchLi = document.createElement('li');
    searchLi.classList.add('search'); // From ORIGINAL HTML
    searchLi.setAttribute('data-once', 'search-toggle search-stop-propagation'); // From ORIGINAL HTML
    const searchLink = document.createElement('a');
    searchLink.href = '#';
    searchLink.setAttribute('data-once', 'search-stop-propagation'); // From ORIGINAL HTML
    searchLink.innerHTML = `
      <svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation">
        <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
      </svg>
      <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation">
        <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path>
      </svg>
      ${isMobile ? '<span data-once="search-stop-propagation"> Search</span>' : ''}
    `;
    searchLi.append(searchLink);

    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap'); // From ORIGINAL HTML
    searchScreenWrap.setAttribute('data-once', 'search-stop-propagation'); // From ORIGINAL HTML
    searchLi.append(searchScreenWrap);

    const searchWrapInner = document.createElement('div');
    searchWrapInner.classList.add('wrap'); // From ORIGINAL HTML
    searchWrapInner.setAttribute('data-once', 'search-stop-propagation'); // From ORIGINAL HTML
    searchScreenWrap.append(searchWrapInner);

    const searchForm = document.createElement('form');
    searchForm.action = 'https://www.mahindra.com/search'; // From ORIGINAL HTML
    searchForm.method = 'get'; // From ORIGINAL HTML
    searchForm.id = 'search-block-form'; // From ORIGINAL HTML
    searchForm.setAttribute('accept-charset', 'UTF-8'); // From ORIGINAL HTML
    searchForm.setAttribute('data-drupal-form-fields', 'edit-keys'); // From ORIGINAL HTML
    searchForm.setAttribute('data-once', 'search-stop-propagation'); // From ORIGINAL HTML
    searchWrapInner.append(searchForm);

    const searchInputWrap = document.createElement('div');
    searchInputWrap.classList.add('search-wrap'); // From ORIGINAL HTML
    searchInputWrap.setAttribute('data-once', 'search-stop-propagation'); // From ORIGINAL HTML
    searchForm.append(searchInputWrap);

    const searchIcon = document.createElement('div');
    searchIcon.classList.add('search-icon'); // From ORIGINAL HTML
    searchIcon.setAttribute('data-once', 'search-stop-propagation'); // From ORIGINAL HTML
    searchIcon.innerHTML = `
      <svg viewBox="0 0 21 21" fill="none" data-once="search-stop-propagation">
        <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
      </svg>
    `;
    searchInputWrap.append(searchIcon);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.classList.add('input-text', 'searchtext'); // From ORIGINAL HTML
    searchInput.required = true; // From ORIGINAL HTML
    searchInput.name = 'key'; // From ORIGINAL HTML
    searchInput.id = 'searchInput'; // From ORIGINAL HTML
    searchInput.autocomplete = 'off'; // From ORIGINAL HTML
    searchInput.setAttribute('data-once', 'search-stop-propagation'); // From ORIGINAL HTML
    searchInputWrap.append(searchInput);

    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-button'); // From ORIGINAL HTML
    submitButton.setAttribute('data-once', 'search-stop-propagation'); // From ORIGINAL HTML
    submitButton.innerHTML = `
      <div class="label" data-once="search-stop-propagation"> Submit </div>
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" data-once="search-stop-propagation">
        <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black" data-once="search-stop-propagation"></path>
      </svg>
    `;
    searchInputWrap.append(submitButton);

    searchLink.addEventListener('click', (e) => {
      e.preventDefault();
      searchLi.classList.toggle('active');
    });

    iconNavUl.append(searchLi);
    return iconNav;
  };

  navUl.append(createIconNav(true)); // Mobile
  nav.append(createIconNav(false)); // Desktop

  // Anniversary Logo
  const anniversaryLogoDiv = document.createElement('div');
  anniversaryLogoDiv.classList.add('logo', 'year-80-logo'); // From ORIGINAL HTML
  wrap.append(anniversaryLogoDiv);

  const anniversaryLogoLink = document.createElement('a');
  const foundAnniversaryLogoLink = anniversaryLogoLinkRow.querySelector('a');
  if (foundAnniversaryLogoLink) {
    anniversaryLogoLink.href = foundAnniversaryLogoLink.href;
  }
  moveInstrumentation(anniversaryLogoLinkRow, anniversaryLogoLink);

  const anniversaryLogoPicture = anniversaryLogoRow.querySelector('picture');
  if (anniversaryLogoPicture) {
    const img = anniversaryLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(anniversaryLogoRow, optimizedPic.querySelector('img'));
    anniversaryLogoLink.append(optimizedPic);
  }
  anniversaryLogoDiv.append(anniversaryLogoLink);

  // Hamburger click listener
  hamburger.addEventListener('click', () => {
    header.classList.toggle('active');
    nav.classList.toggle('active');
  });

  block.replaceChildren(header);
}
