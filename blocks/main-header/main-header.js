import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Add classes from ORIGINAL HTML
    li.classList.add('top-level-li'); // Assuming this is a common class for top-level LIs in the hierarchy

    if (anchor) {
      anchor.classList.add('nav-menu-item'); // Example class, adjust if more specific class is needed
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
      subWrap.classList.add('has-sub-child'); // Class from ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        const svg = createRightArrowSVG();
        trigger.append(svg); // Append SVG to trigger
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // Class from ORIGINAL HTML
          subWrap.classList.toggle('active'); // Class from ORIGINAL HTML
        });
      }
      transformNestedLists(nested); // Recursively transform nested lists
    }

    // Apply classes to nested ULs and LIs based on ORIGINAL HTML patterns
    li.querySelectorAll('ul').forEach(ul => {
      // No specific class for inner ULs in the provided HTML, but if there was, it would be added here.
    });
    li.querySelectorAll('li').forEach(innerLi => {
      // Add classes like 'first-level-li' or 'list-text-red' if applicable based on content or depth
      if (!innerLi.closest('.left-div') && !innerLi.querySelector('ul')) { // Heuristic for leaf nodes or simple list items
        // innerLi.classList.add('list-item'); // Example if a generic list item class existed
      }
      if (innerLi.querySelector(':scope > a')) {
        innerLi.querySelector(':scope > a').classList.add('nav-menu-item'); // Example class
      }
      if (innerLi.querySelector(':scope > ul')) {
        innerLi.classList.add('first-level-li'); // Class from ORIGINAL HTML
        const trigger = innerLi.querySelector(':scope > a, :scope > span');
        if (trigger && !trigger.querySelector('svg')) { // Add arrow if not already present
          trigger.append(createRightArrowSVG());
        }
        const innerSubWrap = innerLi.querySelector(':scope > div.has-sub-child');
        if (innerSubWrap) {
          innerSubWrap.classList.add('has-inner-sub-child'); // Class from ORIGINAL HTML
          // Add event listener for inner sub-child toggles
          if (trigger) {
            trigger.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              innerLi.classList.toggle('active');
              innerSubWrap.classList.toggle('active-child'); // Class from ORIGINAL HTML
            });
          }
        }
      }
    });
  });
}

function createRightArrowSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '-23.5 -23.5 122.80 122.80');
  svg.setAttribute('fill', '#000000');
  svg.setAttribute('stroke', '#000000');
  svg.setAttribute('stroke-width', '4.851456000000001');
  svg.innerHTML = `
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g>
    <g id="SVGRepo_iconCarrier">
      <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)">
        <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path>
      </g>
    </g>
  `;
  return svg;
}

export default function decorate(block) {
  const children = [...block.children];

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid'); // Do NOT add 'nav-up' here, it's for JS behavior
  moveInstrumentation(block, header);

  const container = document.createElement('div');
  container.classList.add('container');
  header.appendChild(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.appendChild(wrap);

  // Logo section
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  wrap.appendChild(logoDiv);

  // Use content detection for root fields
  const primaryLogoRow = children.find(row => row.children.length === 1 && row.querySelector('picture'));
  const primaryLogoLinkRow = children.find(row => row.children.length === 1 && row.querySelector('a') && row.querySelector('a').href.includes('primary-logo-link'));
  const anniversaryLogoRow = children.find(row => row.children.length === 1 && row.querySelector('picture') && !row.querySelector('img').classList.contains('hiddenlogo1')); // Heuristic to distinguish from primary
  const anniversaryLogoLinkRow = children.find(row => row.children.length === 1 && row.querySelector('a') && row.querySelector('a').href.includes('anniversary-logo-link'));

  const primaryLogoPicture = primaryLogoRow?.querySelector('picture');
  const primaryLogoLink = primaryLogoLinkRow?.querySelector('a');

  if (primaryLogoPicture && primaryLogoLink) {
    const logoAnchor = document.createElement('a');
    logoAnchor.href = primaryLogoLink.href;
    const img = primaryLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    optimizedPic.querySelector('img').classList.add('hiddenlogo1');
    moveInstrumentation(primaryLogoRow, optimizedPic.querySelector('img'));
    logoAnchor.appendChild(optimizedPic);
    logoDiv.appendChild(logoAnchor);
  }

  // Hamburger menu
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  hamburgerDiv.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  wrap.appendChild(hamburgerDiv);

  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  mainNav.setAttribute('itemscope', '');
  mainNav.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  wrap.appendChild(mainNav);

  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  mainNav.appendChild(navUl);

  const navigationItems = children.filter((row) => row.children.length === 6);
  const iconNavItems = children.filter((row) => row.children.length === 2);
  const pressReleaseItems = children.filter((row) => row.children.length === 4); // Not used in current rendering, but good to filter

  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell, headingCell, descCell, subdescCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    navUl.appendChild(li);

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell?.textContent.trim() || '';
    anchor.setAttribute('itemprop', 'url');
    moveInstrumentation(labelCell, anchor);
    li.appendChild(anchor);

    li.appendChild(createRightArrowSVG());

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    li.appendChild(megaMenu);

    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    megaMenu.appendChild(megaMenuWrap);

    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.appendChild(centerDiv);

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    centerDiv.appendChild(leftDiv);

    const heading = document.createElement('h4');
    heading.classList.add('left-div-heading');
    const headingAnchor = document.createElement('a'); // Original HTML has <a> inside <h4>
    headingAnchor.textContent = headingCell?.textContent.trim() || '';
    heading.appendChild(headingAnchor);
    leftDiv.appendChild(heading);

    const desc = document.createElement('p');
    desc.classList.add('left-div-desc');
    desc.textContent = descCell?.textContent.trim() || '';
    leftDiv.appendChild(desc);

    const subdesc = document.createElement('p');
    subdesc.classList.add('left-div-subdesc');
    subdesc.textContent = subdescCell?.textContent.trim() || '';
    leftDiv.appendChild(subdesc);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap', 'about-us-sub-nav'); // Example class, adjust based on actual content
    centerDiv.appendChild(subNavWrap);

    const hierarchyContent = hierarchyCell?.innerHTML;
    if (hierarchyContent) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyContent;
      const hierarchyRoot = tempDiv.querySelector('ul');
      if (hierarchyRoot) {
        moveInstrumentation(hierarchyCell, hierarchyRoot);
        subNavWrap.appendChild(hierarchyRoot);
        transformNestedLists(hierarchyRoot);
      }
    }
  });

  // Icon Navigation for Mobile
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconNavUl = document.createElement('ul');
  mobileIconNav.appendChild(mobileIconNavUl);
  mainNav.appendChild(mobileIconNav);

  iconNavItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    // Determine class based on label or link content if needed, e.g., 'mail' or 'search'
    if (labelCell?.textContent.trim().toLowerCase().includes('contact') || linkCell?.querySelector('a')?.href.includes('contact-us')) {
      li.classList.add('mail');
    } else if (labelCell?.textContent.trim().toLowerCase().includes('search')) {
      li.classList.add('search');
    }
    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, anchor);
    li.appendChild(anchor);
    mobileIconNavUl.appendChild(li);
  });

  // Search icon for mobile
  const mobileSearchLi = document.createElement('li');
  mobileSearchLi.classList.add('search');
  const mobileSearchAnchor = document.createElement('a');
  mobileSearchAnchor.href = '#';
  mobileSearchAnchor.innerHTML = `
    <svg viewBox="0 0 21 21" fill="none" class="lens">
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
    </svg>
    <svg viewBox="0 0 50 50" class="close">
      <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
    </svg>
    <span> Search</span>
  `;
  mobileIconNavUl.appendChild(mobileSearchLi);

  // Search screen wrap (mobile)
  const mobileSearchScreenWrap = document.createElement('div');
  mobileSearchScreenWrap.classList.add('search-screen-wrap');
  mobileSearchScreenWrap.style.display = 'none'; // Initially hidden
  mobileSearchLi.appendChild(mobileSearchScreenWrap);

  const mobileSearchWrapInner = document.createElement('div');
  mobileSearchWrapInner.classList.add('wrap');
  mobileSearchScreenWrap.appendChild(mobileSearchWrapInner);

  const mobileSearchForm = document.createElement('form');
  mobileSearchForm.setAttribute('action', 'https://www.mahindra.com/search');
  mobileSearchForm.setAttribute('method', 'get');
  mobileSearchForm.setAttribute('id', 'search-block-form');
  mobileSearchForm.setAttribute('accept-charset', 'UTF-8');
  mobileSearchWrapInner.appendChild(mobileSearchForm);

  const mobileSearchFormWrap = document.createElement('div');
  mobileSearchFormWrap.classList.add('search-wrap');
  mobileSearchForm.appendChild(mobileSearchFormWrap);

  const mobileSearchIcon = document.createElement('div');
  mobileSearchIcon.classList.add('search-icon');
  mobileSearchIcon.innerHTML = `
    <svg viewBox="0 0 21 21" fill="none">
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
    </svg>
  `;
  mobileSearchFormWrap.appendChild(mobileSearchIcon);

  const mobileSearchInput = document.createElement('input');
  mobileSearchInput.setAttribute('type', 'text');
  mobileSearchInput.classList.add('input-text', 'searchtext');
  mobileSearchInput.setAttribute('required', '');
  mobileSearchInput.setAttribute('name', 'key');
  mobileSearchInput.setAttribute('id', 'searchInput');
  mobileSearchInput.setAttribute('autocomplete', 'off');
  mobileSearchFormWrap.appendChild(mobileSearchInput);

  const mobileSubmitButton = document.createElement('button');
  mobileSubmitButton.classList.add('submit-button');
  mobileSubmitButton.innerHTML = `
    <div class="label"> Submit </div>
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
      <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path>
    </svg>
  `;
  mobileSearchFormWrap.appendChild(mobileSubmitButton);

  const mobileSearchResultBox = document.createElement('div');
  mobileSearchResultBox.classList.add('searchResultBox');
  mobileSearchResultBox.style.display = 'none';
  mobileSearchForm.appendChild(mobileSearchResultBox);

  // Search suggestions (mobile)
  const mobileSearchSuggestionsWrap = document.createElement('div');
  mobileSearchSuggestionsWrap.classList.add('search-suggestions-wrap');
  mobileSearchWrapInner.appendChild(mobileSearchSuggestionsWrap);

  const mobileSearchSuggestionsLabel = document.createElement('div');
  mobileSearchSuggestionsLabel.classList.add('label');
  mobileSearchSuggestionsLabel.textContent = 'Popular Keywords:';
  mobileSearchSuggestionsWrap.appendChild(mobileSearchSuggestionsLabel);

  const mobileSearchTokensWrap = document.createElement('div');
  mobileSearchTokensWrap.classList.add('tokens-wrap');
  mobileSearchSuggestionsWrap.appendChild(mobileSearchTokensWrap);

  const mobileSearchKeywordsUl = document.createElement('ul');
  ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali'].forEach((keyword) => {
    const li = document.createElement('li');
    li.textContent = keyword;
    mobileSearchKeywordsUl.appendChild(li);
  });
  mobileSearchTokensWrap.appendChild(mobileSearchKeywordsUl);

  const mobileRecommendedSuggestionsWrap = document.createElement('div');
  mobileRecommendedSuggestionsWrap.classList.add('search-suggestions-wrap');
  mobileSearchWrapInner.appendChild(mobileRecommendedSuggestionsWrap);

  const mobileRecommendedLabel = document.createElement('div');
  mobileRecommendedLabel.classList.add('label');
  mobileRecommendedLabel.textContent = 'Recommended for you:';
  mobileRecommendedSuggestionsWrap.appendChild(mobileRecommendedLabel);

  const mobileRecommendedTokensWrap = document.createElement('div');
  mobileRecommendedTokensWrap.classList.add('tokens-wrap');
  mobileRecommendedSuggestionsWrap.appendChild(mobileRecommendedTokensWrap);

  const mobileRecommendedUl = document.createElement('ul');
  ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines'].forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    mobileRecommendedUl.appendChild(li);
  });
  mobileRecommendedTokensWrap.appendChild(mobileRecommendedUl);

  // Event listeners for mobile search toggle
  mobileSearchAnchor.addEventListener('click', (e) => {
    e.preventDefault();
    mobileSearchScreenWrap.style.display = mobileSearchScreenWrap.style.display === 'none' ? 'block' : 'none';
    mobileSearchLi.classList.toggle('active');
  });

  // Desktop Icon Navigation
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconNavUl = document.createElement('ul');
  desktopIconNavUl.setAttribute('itemscope', '');
  desktopIconNavUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  desktopIconNav.appendChild(desktopIconNavUl);
  mainNav.appendChild(desktopIconNav);

  // Mail icon for desktop
  const desktopMailLi = document.createElement('li');
  desktopMailLi.classList.add('mail');
  const desktopMailAnchor = document.createElement('a');
  desktopMailAnchor.href = 'https://www.mahindra.com/contact-us';
  desktopMailAnchor.innerHTML = `
    <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
    </svg>
  `;
  desktopMailLi.appendChild(desktopMailAnchor);
  desktopIconNavUl.appendChild(desktopMailLi);

  // Search icon for desktop
  const desktopSearchLi = document.createElement('li');
  desktopSearchLi.classList.add('search');
  const desktopSearchAnchor = document.createElement('a');
  desktopSearchAnchor.href = '#';
  desktopSearchAnchor.innerHTML = `
    <svg viewBox="0 0 21 21" fill="none" class="lens">
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
    </svg>
    <svg viewBox="0 0 50 50" class="close">
      <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
    </svg>
  `;
  desktopSearchLi.appendChild(desktopSearchAnchor);
  desktopIconNavUl.appendChild(desktopSearchLi);

  // Search screen wrap (desktop) - similar structure to mobile search
  const desktopSearchScreenWrap = document.createElement('div');
  desktopSearchScreenWrap.classList.add('search-screen-wrap');
  desktopSearchScreenWrap.style.display = 'none'; // Initially hidden
  desktopSearchLi.appendChild(desktopSearchScreenWrap);

  const desktopSearchWrapInner = document.createElement('div');
  desktopSearchWrapInner.classList.add('wrap');
  desktopSearchScreenWrap.appendChild(desktopSearchWrapInner);

  const desktopSearchForm = document.createElement('form');
  desktopSearchForm.setAttribute('action', 'https://www.mahindra.com/search');
  desktopSearchForm.setAttribute('method', 'get');
  desktopSearchForm.setAttribute('id', 'search-block-form');
  desktopSearchForm.setAttribute('accept-charset', 'UTF-8');
  desktopSearchWrapInner.appendChild(desktopSearchForm);

  const desktopSearchFormWrap = document.createElement('div');
  desktopSearchFormWrap.classList.add('search-wrap');
  desktopSearchForm.appendChild(desktopSearchFormWrap);

  const desktopSearchIcon = document.createElement('div');
  desktopSearchIcon.classList.add('search-icon');
  desktopSearchIcon.innerHTML = `
    <svg viewBox="0 0 21 21" fill="none">
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
    </svg>
  `;
  desktopSearchFormWrap.appendChild(desktopSearchIcon);

  const desktopSearchInput = document.createElement('input');
  desktopSearchInput.setAttribute('type', 'text');
  desktopSearchInput.classList.add('input-text', 'searchtext');
  desktopSearchInput.setAttribute('required', '');
  desktopSearchInput.setAttribute('name', 'key');
  desktopSearchInput.setAttribute('id', 'searchInput');
  desktopSearchInput.setAttribute('autocomplete', 'off');
  desktopSearchFormWrap.appendChild(desktopSearchInput);

  const desktopSubmitButton = document.createElement('button');
  desktopSubmitButton.classList.add('submit-button');
  desktopSubmitButton.innerHTML = `
    <div class="label"> Submit </div>
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
      <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path>
    </svg>
  `;
  desktopSearchFormWrap.appendChild(desktopSubmitButton);

  const desktopSearchResultBox = document.createElement('div');
  desktopSearchResultBox.classList.add('searchResultBox');
  desktopSearchResultBox.style.display = 'none';
  desktopSearchForm.appendChild(desktopSearchResultBox);

  // Search suggestions (desktop)
  const desktopSearchSuggestionsWrap = document.createElement('div');
  desktopSearchSuggestionsWrap.classList.add('search-suggestions-wrap');
  desktopSearchWrapInner.appendChild(desktopSearchSuggestionsWrap);

  const desktopSearchSuggestionsLabel = document.createElement('div');
  desktopSearchSuggestionsLabel.classList.add('label');
  desktopSearchSuggestionsLabel.textContent = 'Popular Keywords:';
  desktopSearchSuggestionsWrap.appendChild(desktopSearchSuggestionsLabel);

  const desktopSearchTokensWrap = document.createElement('div');
  desktopSearchTokensWrap.classList.add('tokens-wrap');
  desktopSearchSuggestionsWrap.appendChild(desktopSearchTokensWrap);

  const desktopSearchKeywordsUl = document.createElement('ul');
  ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali'].forEach((keyword) => {
    const li = document.createElement('li');
    li.textContent = keyword;
    desktopSearchKeywordsUl.appendChild(li);
  });
  desktopSearchTokensWrap.appendChild(desktopSearchKeywordsUl);

  const desktopRecommendedSuggestionsWrap = document.createElement('div');
  desktopRecommendedSuggestionsWrap.classList.add('search-suggestions-wrap');
  desktopSearchWrapInner.appendChild(desktopRecommendedSuggestionsWrap);

  const desktopRecommendedLabel = document.createElement('div');
  desktopRecommendedLabel.classList.add('label');
  desktopRecommendedLabel.textContent = 'Recommended for you:';
  desktopRecommendedSuggestionsWrap.appendChild(desktopRecommendedLabel);

  const desktopRecommendedTokensWrap = document.createElement('div');
  desktopRecommendedTokensWrap.classList.add('tokens-wrap');
  desktopRecommendedSuggestionsWrap.appendChild(desktopRecommendedTokensWrap);

  const desktopRecommendedUl = document.createElement('ul');
  ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines'].forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    desktopRecommendedUl.appendChild(li);
  });
  desktopRecommendedTokensWrap.appendChild(desktopRecommendedUl);

  // Event listeners for desktop search toggle
  desktopSearchAnchor.addEventListener('click', (e) => {
    e.preventDefault();
    desktopSearchScreenWrap.style.display = desktopSearchScreenWrap.style.display === 'none' ? 'block' : 'none';
    desktopSearchLi.classList.toggle('active');
  });

  // Anniversary Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  wrap.appendChild(year80LogoDiv);

  const anniversaryLogoPicture = anniversaryLogoRow?.querySelector('picture');
  const anniversaryLogoLink = anniversaryLogoLinkRow?.querySelector('a');

  if (anniversaryLogoPicture && anniversaryLogoLink) {
    const anniversaryAnchor = document.createElement('a');
    anniversaryAnchor.href = anniversaryLogoLink.href;
    const img = anniversaryLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    moveInstrumentation(anniversaryLogoRow, optimizedPic.querySelector('img'));
    anniversaryAnchor.appendChild(optimizedPic);
    year80LogoDiv.appendChild(anniversaryAnchor);
  }

  // Replace the original block with the constructed header
  block.replaceWith(header);

  // Hamburger menu toggle logic
  hamburgerDiv.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    hamburgerDiv.classList.toggle('active');
    document.body.classList.toggle('nav-open');
  });
}
