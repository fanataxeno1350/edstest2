import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    // Handle label-only nodes
    const anchor = li.querySelector(':scope > a');
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
      subWrap.classList.add('cmp-header__product-items'); // This class is for the wrapper
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('cmp-navigation__item-link', 'cmp-navigation__item-arrow');
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('cmp-header__nav-products-click');
          // The subWrap itself should not toggle 'cmp-header__product-items'
          // as it's a static class for styling. The parent li toggles the state.
          // subWrap.classList.toggle('cmp-header__product-items'); // REMOVED
        });
      }
    }
    // Apply classes to nested elements from ORIGINAL HTML
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-1');
    if (!li.querySelector('ul')) {
      li.classList.add('cmp-header__no-item');
    }
    if (anchor) {
      anchor.classList.add('cmp-navigation__item-link');
    }
  });
  rootUl.classList.add('cmp-navigation__group'); // Ensure root UL also has this class
}

export default function decorate(block) {
  const [
    desktopBackgroundRow,
    mobileBackgroundRow,
    logoRow,
    logoLinkRow,
    ...navigationItemRows
  ] = [...block.children];

  // Background Images
  const desktopBgImg = desktopBackgroundRow?.querySelector('picture');
  const mobileBgImg = mobileBackgroundRow?.querySelector('picture');

  if (desktopBgImg) {
    block.style.backgroundImage = `url(${desktopBgImg.querySelector('img').src})`;
    block.style.backgroundSize = '100% 100%';
    block.style.backgroundPosition = 'center bottom';
    desktopBgImg.remove();
  }
  if (mobileBgImg) {
    const mobileImgSrc = mobileBgImg.querySelector('img').src;
    // Add a media query for mobile background or handle it with JS if needed
    // For now, setting it directly, assuming CSS will handle responsiveness
    // or a separate media query listener can be added.
    // block.style.setProperty('--mobile-background-image', `url(${mobileImgSrc})`);
    mobileBgImg.remove();
  }

  const cmpHeader = document.createElement('div');
  cmpHeader.classList.add('cmp-header');
  moveInstrumentation(block, cmpHeader);

  // Hamburger menu
  const hamburger = document.createElement('div');
  hamburger.classList.add('cmp-header__hamburger', 'menu-mobile');
  hamburger.setAttribute('type', 'button');
  cmpHeader.append(hamburger);

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('image', 'cmp-header__logo');

  const logoCmpImage = document.createElement('div');
  logoCmpImage.classList.add('cmp-image');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image');

  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link');
  logoLink.setAttribute('data-social', 'header');
  logoLink.href = logoLinkRow?.querySelector('a')?.href || '#';
  moveInstrumentation(logoLinkRow, logoLink);

  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '767' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }

  logoDiv.append(logoLink);
  logoCmpImage.append(logoDiv);
  logoWrapper.append(logoCmpImage);
  cmpHeader.append(logoWrapper);

  // Navigation Links
  const navLinksWrapper = document.createElement('div');
  navLinksWrapper.classList.add('cmp-header__nav-links');

  const navigation = document.createElement('div');
  navigation.classList.add('navigation');

  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation');

  const ul = document.createElement('ul');
  ul.classList.add('cmp-navigation__group', 'cmp-header__nav-group');

  navigationItemRows.forEach((row) => {
    const cells = [...row.children];
    // Use content detection for cells as per EDS guide
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('ul'));
    const linkCell = cells.find(cell => cell.querySelector('a') && !cell.querySelector('ul'));
    const hierarchyCell = cells.find(cell => cell.querySelector('ul'));

    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products');

    let rootEl;
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.href = foundLink.href;
      rootEl.classList.add('cmp-navigation__item-link');
    } else {
      rootEl = document.createElement('span');
      rootEl.classList.add('cmp-navigation__item-link');
    }
    rootEl.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, rootEl);
    li.appendChild(rootEl);

    if (hierarchyCell) {
      // Create a temporary div to parse the richtext HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell

      const hierarchyRoot = tempDiv.querySelector('ul'); // Get the actual UL from the parsed HTML

      if (hierarchyRoot) {
        li.classList.add('cmp-header__nav-products-click'); // Initial state for dropdown
        const wrapper = document.createElement('ul');
        wrapper.classList.add('cmp-navigation__group', 'cmp-header__product-items');
        const categoryMenu = document.createElement('div');
        categoryMenu.classList.add('cmp-header__category-menu');

        // Move all children from the temporary div (which contains the hierarchyRoot)
        while (hierarchyRoot.firstChild) {
          categoryMenu.append(hierarchyRoot.firstChild);
        }
        hierarchyRoot.remove(); // Remove the original hierarchyRoot as its children are moved

        wrapper.appendChild(categoryMenu);

        rootEl.classList.add('cmp-navigation__item-arrow');
        rootEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('cmp-header__nav-products-click');
          // The wrapper itself should not toggle 'cmp-header__product-items'
          // as it's a static class for styling. The parent li toggles the state.
          // wrapper.classList.toggle('cmp-header__product-items'); // REMOVED
        });
        li.appendChild(wrapper);
        // Apply classes to nested elements within the hierarchy
        transformNestedLists(categoryMenu); // Pass categoryMenu which now contains the list items
      }
    } else {
      li.classList.add('cmp-header__no-items');
    }
    ul.appendChild(li);
  });

  nav.append(ul);

  const mobileList = document.createElement('div');
  mobileList.classList.add('cmp-header__mobile-list');
  nav.append(mobileList);

  navigation.append(nav);
  navLinksWrapper.append(navigation);
  cmpHeader.append(navLinksWrapper);

  // Nav Icons (Search)
  const navIcons = document.createElement('div');
  navIcons.classList.add('cmp-header__nav-icons');

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('cmp-header__search');

  const searchLink = document.createElement('a');
  searchLink.href = '#';
  searchLink.classList.add('cmp-header__icon-img');

  const searchIcon = document.createElement('div');
  searchIcon.classList.add('icon-Search_icons');
  searchLink.append(searchIcon);
  searchDiv.append(searchLink);
  navIcons.append(searchDiv);
  cmpHeader.append(navIcons);

  // Search section (from original HTML, outside cmp-header)
  const searchSection = document.createElement('div');
  searchSection.classList.add('search');
  searchSection.innerHTML = `<section id="search-444ce93884" class="cmp-search" role="search" data-cmp-min-length="3" data-cmp-results-desktop-size="4" data-cmp-results-mobile-size="5" data-error-response="{&quot;noResultsTitle&quot;:&quot;No result found for&quot;,&quot;noResultsDescription&quot;:&quot;&quot;,&quot;categories&quot;:&quot;&quot;}" data-input-placeholder="Juice up your search">
  <div class="cmp_search__info" aria-live="polite" role="status"></div>
  <form class="cmp-search__form" data-cmp-hook-search="form" method="get" action="/content/itc-foods-brands/bnatural/us/en/our-story.customsearchresults.json/_jcr_content/root/header/search" autocomplete="off">
    <input type="hidden" id="searchroot" name="searchroot" value="/content/itc-foods-brands/bnatural/us/en">
    <div class="cmp-search__field">
      <i class="cmp-search__icon" data-cmp-hook-search="icon"></i>
      <span class="cmp-search__loading-indicator" data-cmp-hook-search="loadingIndicator"></span>
      <input class="cmp-search__input" data-cmp-hook-search="input" type="text" name="fulltext" placeholder="Search" role="combobox" aria-autocomplete="list" aria-haspopup="true" aria-invalid="false" aria-expanded="false" aria-owns="cmp-search-results-0">
      <button class="cmp-search__clear" data-cmp-hook-search="clear" aria-label="Clear">
        <i class="cmp-search__clear-icon"></i>
      </button>
    </div>
  </form>
  <div class="cmp-search__resultsBlock">
    <div class="cmp-search__results" aria-label="Search results" data-cmp-hook-search="results" role="listbox" aria-multiselectable="false" id="cmp-search-results-0"></div>
  </div>
  
<script data-cmp-hook-search="itemTemplate" type="x-template">
  <a class="cmp-search__item" data-cmp-hook-search="item" role="option" aria-selected="false">
      <span class="cmp-search__item-title" data-cmp-hook-search="itemTitle"></span>
  </a>
</script>

</section>`;

  block.innerHTML = ''; // Clear original block content
  block.append(cmpHeader, searchSection);

  // Mobile menu toggle
  hamburger.addEventListener('click', () => {
    cmpHeader.classList.toggle('menu-open');
    navLinksWrapper.classList.toggle('menu-open');
  });

  // Search toggle
  searchLink.addEventListener('click', (e) => {
    e.preventDefault();
    searchSection.classList.toggle('active');
  });
}
