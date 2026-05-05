import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
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
      subWrap.classList.add('has-sub-child');
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
    }
  });
}

export default async function decorate(block) {
  const children = [...block.children];

  const [
    logoRow,
    logoLinkRow,
    anniversaryLogoRow,
    anniversaryLogoLinkRow,
    ...itemRows
  ] = children;

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid');

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  logoLink.href = logoLinkRow?.querySelector('a')?.href || '#';
  moveInstrumentation(logoLinkRow, logoLink);
  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    optimizedPic.querySelector('img').classList.add('hiddenlogo1'); // Add class from original HTML
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoDiv);
  logoDiv.append(logoLink);
  wrap.append(logoDiv);

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  const hamburgerUl = document.createElement('ul');
  [...Array(3)].forEach(() => hamburgerUl.append(document.createElement('li')));
  hamburger.append(hamburgerUl);
  wrap.append(hamburger);

  // Main Nav
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  mainNav.append(navUl);
  wrap.append(mainNav);

  const navigationItems = itemRows.filter((row) => row.children.length === 8);
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4);
  const iconLinkItems = itemRows.filter((row) => row.children.length === 2);

  navigationItems.forEach((row) => {
    const [
      labelCell,
      linkCell,
      hierarchyTreeCell,
      leftHeadingCell,
      leftDescriptionCell,
      leftSubdescCell,
      leftListCell,
      submenuLinksCell,
    ] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    anchor.href = linkCell?.querySelector('a')?.href || '#';
    anchor.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(linkCell, anchor);
    moveInstrumentation(labelCell, anchor);
    li.append(anchor);

    // Arrow SVG
    const svgSpan = document.createElement('span');
    svgSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
    li.append(svgSpan);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    megaMenu.append(megaMenuWrap);
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.append(centerDiv);

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    centerDiv.append(leftDiv);

    const leftHeading = document.createElement('h4');
    leftHeading.classList.add('left-div-heading');
    const leftHeadingAnchor = document.createElement('a');
    leftHeadingAnchor.textContent = leftHeadingCell?.textContent.trim() || '';
    moveInstrumentation(leftHeadingCell, leftHeadingAnchor);
    leftHeading.append(leftHeadingAnchor);
    leftDiv.append(leftHeading);

    const leftDescription = document.createElement('p');
    leftDescription.classList.add('left-div-desc');
    leftDescription.innerHTML = leftDescriptionCell?.innerHTML || '';
    moveInstrumentation(leftDescriptionCell, leftDescription);
    leftDiv.append(leftDescription);

    const leftSubdesc = document.createElement('p');
    leftSubdesc.classList.add('left-div-subdesc');
    leftSubdesc.textContent = leftSubdescCell?.textContent.trim() || '';
    moveInstrumentation(leftSubdescCell, leftSubdesc);
    leftDiv.append(leftSubdesc);

    const leftList = document.createElement('div');
    leftList.innerHTML = leftListCell?.innerHTML || '';
    moveInstrumentation(leftListCell, leftList);
    leftDiv.append(leftList);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    centerDiv.append(subNavWrap);

    const hierarchyRoot = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyRoot) {
      // Create a temporary div to hold the hierarchy content for instrumentation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv);

      // Apply classes from original HTML to nested elements
      tempDiv.querySelectorAll('li').forEach(liItem => liItem.classList.add('top-level-li')); // Example class from original HTML
      tempDiv.querySelectorAll('li > a').forEach(aItem => {
        const span = document.createElement('span');
        span.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
        aItem.after(span);
      });

      while (tempDiv.firstChild) {
        subNavWrap.append(tempDiv.firstChild);
      }
      transformNestedLists(subNavWrap.querySelector('ul')); // Apply transformations to the moved list
    }

    const subMenuLinks = document.createElement('div');
    subMenuLinks.innerHTML = submenuLinksCell?.innerHTML || '';
    moveInstrumentation(submenuLinksCell, subMenuLinks);
    subNavWrap.append(subMenuLinks);

    li.append(megaMenu);
    navUl.append(li);
    moveInstrumentation(row, li);
  });

  // Press Releases
  const newsroomLi = navUl.querySelector('li.has-child:nth-last-child(2)'); // Assuming newsroom is the second to last
  if (newsroomLi) {
    const latestPressReleaseDiv = document.createElement('div');
    latestPressReleaseDiv.classList.add('latest-two-press-release');
    // Find the correct insertion point for latestPressReleaseDiv within newsroomLi's mega-menu
    const newsroomLeftDiv = newsroomLi.querySelector('.mega-menu .left-div.newsroom-left-div');
    if (newsroomLeftDiv) {
      newsroomLeftDiv.append(latestPressReleaseDiv);
    }

    pressReleaseItems.forEach((row) => {
      const [pressLinkCell, pressTitleCell, pressDateCell, pressTagCell] = [...row.children];

      const slideDiv = document.createElement('div');
      slideDiv.classList.add('slides');
      const slideWrap = document.createElement('div');
      slideWrap.classList.add('wrap');
      slideDiv.append(slideWrap);
      const contentDiv = document.createElement('div');
      contentDiv.classList.add('content');
      slideWrap.append(contentDiv);
      const descDiv = document.createElement('div');
      descDiv.classList.add('desc');
      contentDiv.append(descDiv);

      const p = document.createElement('p');
      const pressAnchor = document.createElement('a');
      pressAnchor.href = pressLinkCell?.querySelector('a')?.href || '#';
      pressAnchor.textContent = pressTitleCell?.textContent.trim() || '';
      moveInstrumentation(pressLinkCell, pressAnchor);
      moveInstrumentation(pressTitleCell, pressAnchor);
      p.append(pressAnchor);
      descDiv.append(p);

      const dateDiv = document.createElement('div');
      dateDiv.classList.add('date');
      const dateEm = document.createElement('em');
      dateEm.textContent = pressDateCell?.textContent.trim() || '';
      moveInstrumentation(pressDateCell, dateEm);
      dateDiv.append(dateEm);
      const tagEm = document.createElement('em');
      tagEm.textContent = pressTagCell?.textContent.trim() || '';
      moveInstrumentation(pressTagCell, tagEm);
      dateDiv.append(tagEm);
      descDiv.append(dateDiv);

      latestPressReleaseDiv.append(slideDiv);
      moveInstrumentation(row, slideDiv);
    });
  }

  // Icon Nav
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconUl = document.createElement('ul');
  mobileIconNav.append(mobileIconUl);

  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconUl = document.createElement('ul');
  desktopIconNav.append(desktopIconUl);

  iconLinkItems.forEach((row) => {
    const [iconLinkCell, iconLabelCell] = [...row.children];
    const linkHref = iconLinkCell?.querySelector('a')?.href || '#';
    const linkLabel = iconLabelCell?.textContent.trim() || '';

    const createIconLi = (isMobile) => {
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = linkHref;
      moveInstrumentation(iconLinkCell, anchor);
      moveInstrumentation(iconLabelCell, anchor);

      if (linkLabel.toLowerCase().includes('contact us')) {
        li.classList.add('mail');
        anchor.innerHTML = `
          <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21">
            <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                      C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                      L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z" />
          </svg>
          ${isMobile ? linkLabel : ''}
        `;
      } else if (linkLabel.toLowerCase().includes('search')) {
        li.classList.add('search');
        anchor.innerHTML = `
          <svg viewBox="0 0 21 21" fill="none" class="lens">
            <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
          </svg>
          <svg viewBox="0 0 50 50" class="close">
            <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
          </svg>
          ${isMobile ? `<span>${linkLabel}</span>` : ''}
        `;
        const searchScreenWrap = document.createElement('div');
        searchScreenWrap.classList.add('search-screen-wrap');
        const searchWrapInner = document.createElement('div');
        searchWrapInner.classList.add('wrap');
        searchScreenWrap.append(searchWrapInner);

        const searchForm = document.createElement('form');
        searchForm.action = 'https://www.mahindra.com/search';
        searchForm.method = 'get';
        searchForm.id = 'search-block-form';
        searchForm.setAttribute('accept-charset', 'UTF-8');
        searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');

        const searchInputWrap = document.createElement('div');
        searchInputWrap.classList.add('search-wrap');
        searchForm.append(searchInputWrap);

        const searchIcon = document.createElement('div');
        searchIcon.classList.add('search-icon');
        searchIcon.innerHTML = `
          <svg viewBox="0 0 21 21" fill="none">
            <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
          </svg>
        `;
        searchInputWrap.append(searchIcon);

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.classList.add('input-text', 'searchtext');
        searchInput.required = true;
        searchInput.name = 'key';
        searchInput.id = 'searchInput';
        searchInput.autocomplete = 'off';
        searchInputWrap.append(searchInput);

        const submitButton = document.createElement('button');
        submitButton.classList.add('submit-button');
        submitButton.innerHTML = `
          <div class="label"> Submit </div>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path>
          </svg>
        `;
        searchInputWrap.append(submitButton);

        const searchResultBox = document.createElement('div');
        searchResultBox.classList.add('searchResultBox');
        searchResultBox.style.display = 'none';
        searchResultBox.innerHTML = `
          <div class="swiper scrollSwiper">
            <div class="swiper-wrapper">
              <div class="swiper-slide"></div>
            </div>
          </div>
          <div class="swiper-scrollbar"></div>
        `;
        searchForm.append(searchResultBox);
        searchWrapInner.append(searchForm);

        const addSuggestions = (label, keywords) => {
          const suggestionsWrap = document.createElement('div');
          suggestionsWrap.classList.add('search-suggestions-wrap');
          const labelDiv = document.createElement('div');
          labelDiv.classList.add('label');
          labelDiv.textContent = label;
          suggestionsWrap.append(labelDiv);
          const tokensWrap = document.createElement('div');
          tokensWrap.classList.add('tokens-wrap');
          const ul = document.createElement('ul');
          keywords.forEach((keyword) => {
            const liKeyword = document.createElement('li');
            liKeyword.textContent = keyword;
            ul.append(liKeyword);
          });
          tokensWrap.append(ul);
          suggestionsWrap.append(tokensWrap);
          searchWrapInner.append(suggestionsWrap);
        };

        addSuggestions('Popular Keywords:', ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali']);
        addSuggestions('Recommended for you:', ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines']);

        li.append(searchScreenWrap);

        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          document.body.classList.toggle('search-open');
        });
      }
      li.append(anchor);
      return li;
    };

    mobileIconUl.append(createIconLi(true));
    const desktopLi = createIconLi(false);
    desktopIconUl.append(desktopLi);
    moveInstrumentation(row, desktopLi); // Move instrumentation for desktop icon
  });

  navUl.append(mobileIconNav);
  wrap.append(desktopIconNav);

  // Anniversary Logo
  const anniversaryLogoDiv = document.createElement('div');
  anniversaryLogoDiv.classList.add('logo', 'year-80-logo');
  const anniversaryLogoAnchor = document.createElement('a');
  anniversaryLogoAnchor.href = anniversaryLogoLinkRow?.querySelector('a')?.href || '#';
  moveInstrumentation(anniversaryLogoLinkRow, anniversaryLogoAnchor);
  const anniversaryPicture = anniversaryLogoRow?.querySelector('picture');
  if (anniversaryPicture) {
    const img = anniversaryPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    anniversaryLogoAnchor.append(optimizedPic);
  }
  moveInstrumentation(anniversaryLogoRow, anniversaryLogoDiv);
  anniversaryLogoDiv.append(anniversaryLogoAnchor);
  wrap.append(anniversaryLogoDiv);

  block.replaceChildren(header);

  // Hamburger menu toggle
  hamburger.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    hamburger.classList.toggle('close');
    document.body.classList.toggle('overflow-hidden');
  });

  // Mega menu hover/click behavior
  navUl.querySelectorAll('.has-child').forEach((li) => {
    const megaMenu = li.querySelector('.mega-menu');
    const trigger = li.querySelector(':scope > a');

    if (megaMenu && trigger) {
      trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 1200) { // Only for mobile/tablet
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          megaMenu.classList.toggle('active');
        }
      });

      li.addEventListener('mouseenter', () => {
        if (window.innerWidth > 1200) {
          li.classList.add('active');
          megaMenu.classList.add('active');
        }
      });

      li.addEventListener('mouseleave', () => {
        if (window.innerWidth > 1200) {
          li.classList.remove('active');
          megaMenu.classList.remove('active');
        }
      });
    }
  });

  // Nested dropdowns in mega menu
  navUl.querySelectorAll('.has-sub-child, .has-inner-sub-child').forEach((wrapper) => {
    const trigger = wrapper.previousElementSibling; // The <a> or <span> before the wrapper
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        wrapper.classList.toggle('active');
        trigger.parentElement.classList.toggle('active');
      });
    }
  });

  // Swiper initialization for search results
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  const searchSwiperEl = document.querySelector('.search-screen-wrap .scrollSwiper');
  if (searchSwiperEl) {
    // eslint-disable-next-line no-undef
    new Swiper(searchSwiperEl, {
      slidesPerView: 'auto',
      loop: false, // Assuming loop is false based on typical search behavior
      // Add other Swiper config as needed from original site if any
      scrollbar: {
        el: '.swiper-scrollbar',
        hide: false,
      },
    });
  }
}
