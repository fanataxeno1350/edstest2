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
  const [mainLogoRow, mainLogoLinkRow, year80LogoRow, year80LogoLinkRow, ...itemRows] = [...block.children];

  // Item type detection based on cell count and content (querySelector)
  const navigationItems = itemRows.filter((row) => row.children.length === 4 && row.querySelector('div:nth-child(3) select')); // Navigation Label, Link, Has Mega Menu (select), Hierarchy Tree
  const iconLinkItems = itemRows.filter((row) => row.children.length === 3 && row.querySelector('picture')); // Icon, Link, Label
  const megaMenuAboutUsItems = itemRows.filter((row) => row.children.length === 4 && row.querySelector('div:nth-child(2) p') && !row.querySelector('div:nth-child(4) ul')); // Heading, Description (p), Sub Description, Section Links (no ul)
  const megaMenuWhatWeDoItems = itemRows.filter((row) => row.children.length === 4 && row.querySelector('div:nth-child(2) ul') && row.querySelector('div:nth-child(3) ul')); // Heading, Key Facts (ul), Industries Hierarchy (ul), Section Links
  const megaMenuInvestorRelationsItems = itemRows.filter((row) => row.children.length === 4 && row.querySelector('div:nth-child(2) p') && row.querySelector('div:nth-child(3) ul')); // Heading, Description (p), Key Facts (ul), Section Links
  const megaMenuNewsroomItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('div:nth-child(2) ul')); // Heading, Section Links (ul) - Press Slides are separate rows
  const megaMenuCareersItems = itemRows.filter((row) => row.children.length === 5); // Heading, Desc, SubDesc, Careers Hierarchy, Section Links
  const pressReleaseSlideItems = itemRows.filter((row) => row.children.length === 4 && row.querySelector('a') && !row.querySelector('picture')); // Press Link, Title, Date, Category (no picture)

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid'); // nav-up is a scroll state class, do not add initially
  moveInstrumentation(block, header);

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  wrap.append(logoDiv);

  const mainLogoLink = document.createElement('a');
  const foundMainLogoLink = mainLogoLinkRow.querySelector('a');
  if (foundMainLogoLink) {
    mainLogoLink.href = foundMainLogoLink.href;
  }
  moveInstrumentation(mainLogoLinkRow, mainLogoLink);

  const mainLogoPicture = mainLogoRow.querySelector('picture');
  if (mainLogoPicture) {
    const img = mainLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(mainLogoRow, optimizedPic.querySelector('img'));
    mainLogoLink.append(optimizedPic);
  }
  logoDiv.append(mainLogoLink);

  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  const ulHamburger = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    ulHamburger.append(document.createElement('li'));
  }
  hamburger.append(ulHamburger);
  wrap.append(hamburger);

  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  wrap.append(nav);

  const ulNav = document.createElement('ul');
  ulNav.setAttribute('itemscope', '');
  ulNav.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(ulNav);

  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hasMegaMenuCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.setAttribute('data-once', 'nav-close-search');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);

    const svgSpan = document.createElement('span');
    svgSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
    li.append(svgSpan);

    const megaMenuType = hasMegaMenuCell.textContent.trim();
    if (megaMenuType) {
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

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');
      centerDiv.append(subNavWrap);

      if (megaMenuType === 'about-us') {
        const aboutUsItem = megaMenuAboutUsItems.shift();
        if (aboutUsItem) {
          const [headingCell, descriptionCell, subDescriptionCell, sectionLinksCell] = [...aboutUsItem.children];
          leftDiv.classList.add('about-us-left-div');
          const heading = document.createElement('h4');
          heading.classList.add('left-div-heading');
          const headingAnchor = document.createElement('a');
          headingAnchor.textContent = headingCell.textContent.trim();
          heading.append(headingAnchor);
          leftDiv.append(heading);

          const description = document.createElement('p');
          description.classList.add('left-div-desc');
          description.innerHTML = descriptionCell.innerHTML; // richtext
          leftDiv.append(description);

          const subDescription = document.createElement('p');
          subDescription.classList.add('left-div-subdesc');
          subDescription.textContent = subDescriptionCell.textContent.trim();
          leftDiv.append(subDescription);

          subNavWrap.classList.add('about-us-sub-nav');
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = sectionLinksCell.innerHTML; // richtext
          const sectionLinksUl = tempDiv.querySelector('ul');
          if (sectionLinksUl) {
            subNavWrap.append(sectionLinksUl);
            transformNestedLists(sectionLinksUl);
          } else {
            // If it's just <p> content, append it directly
            while (tempDiv.firstChild) subNavWrap.append(tempDiv.firstChild);
          }
          moveInstrumentation(aboutUsItem, megaMenu);
        }
      } else if (megaMenuType === 'what-we-do') {
        const whatWeDoItem = megaMenuWhatWeDoItems.shift();
        if (whatWeDoItem) {
          const [headingCell, factsListCell, industriesHierarchyCell, sectionLinksCell] = [...whatWeDoItem.children];
          const heading = document.createElement('h4');
          heading.classList.add('left-div-heading');
          const headingAnchor = document.createElement('a');
          headingAnchor.textContent = headingCell.textContent.trim();
          heading.append(headingAnchor);
          leftDiv.append(heading);

          const tempFactsDiv = document.createElement('div');
          tempFactsDiv.innerHTML = factsListCell.innerHTML; // richtext
          const factsListUl = tempFactsDiv.querySelector('ul');
          if (factsListUl) {
            factsListUl.querySelectorAll('li').forEach((liFact) => {
              liFact.classList.add('list-text-red');
            });
            leftDiv.append(factsListUl);
          } else {
            while (tempFactsDiv.firstChild) leftDiv.append(tempFactsDiv.firstChild);
          }

          subNavWrap.classList.add('what-we-do');
          const tempIndustriesDiv = document.createElement('div');
          tempIndustriesDiv.innerHTML = industriesHierarchyCell.innerHTML; // richtext
          const industriesUl = tempIndustriesDiv.querySelector('ul');
          if (industriesUl) {
            subNavWrap.append(industriesUl);
            transformNestedLists(industriesUl);
          } else {
            while (tempIndustriesDiv.firstChild) subNavWrap.append(tempIndustriesDiv.firstChild);
          }

          const tempSectionLinksDiv = document.createElement('div');
          tempSectionLinksDiv.innerHTML = sectionLinksCell.innerHTML; // richtext
          const sectionLinksUl = tempSectionLinksDiv.querySelector('ul');
          if (sectionLinksUl) {
            subNavWrap.append(sectionLinksUl);
            transformNestedLists(sectionLinksUl);
          } else {
            while (tempSectionLinksDiv.firstChild) subNavWrap.append(tempSectionLinksDiv.firstChild);
          }
          moveInstrumentation(whatWeDoItem, megaMenu);
        }
      } else if (megaMenuType === 'investor-relations') {
        const investorRelationsItem = megaMenuInvestorRelationsItems.shift();
        if (investorRelationsItem) {
          const [headingCell, descCell, factsListCell, sectionLinksCell] = [...investorRelationsItem.children];
          leftDiv.classList.add('ir-left-div');
          const heading = document.createElement('h4');
          heading.classList.add('left-div-heading');
          const headingAnchor = document.createElement('a');
          headingAnchor.textContent = headingCell.textContent.trim();
          heading.append(headingAnchor);
          leftDiv.append(heading);

          const desc = document.createElement('p');
          desc.textContent = descCell.textContent.trim();
          leftDiv.append(desc);

          const tempFactsDiv = document.createElement('div');
          tempFactsDiv.innerHTML = factsListCell.innerHTML; // richtext
          const factsListUl = tempFactsDiv.querySelector('ul');
          if (factsListUl) {
            factsListUl.querySelectorAll('li').forEach((liFact) => {
              liFact.classList.add('list-text-red');
            });
            leftDiv.append(factsListUl);
          } else {
            while (tempFactsDiv.firstChild) leftDiv.append(tempFactsDiv.firstChild);
          }

          subNavWrap.classList.add('element-block');
          const innerSubNavWrapList = document.createElement('div');
          innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');

          const tempSectionLinksDiv = document.createElement('div');
          tempSectionLinksDiv.innerHTML = sectionLinksCell.innerHTML; // richtext
          const sectionLinksUl = tempSectionLinksDiv.querySelector('ul');
          if (sectionLinksUl) {
            const ul1 = document.createElement('ul');
            const ul2 = document.createElement('ul');
            [...sectionLinksUl.children].forEach((child, index) => {
              if (index < Math.ceil(sectionLinksUl.children.length / 2)) {
                ul1.append(child);
              } else {
                ul2.append(child);
              }
            });
            subNavWrap.append(ul1);
            innerSubNavWrapList.append(ul2);
          } else {
            // If it's just <p> content, append it directly
            while (tempSectionLinksDiv.firstChild) subNavWrap.append(tempSectionLinksDiv.firstChild);
          }
          subNavWrap.append(innerSubNavWrapList);
          moveInstrumentation(investorRelationsItem, megaMenu);
        }
      } else if (megaMenuType === 'newsroom') {
        const newsroomItem = megaMenuNewsroomItems.shift();
        if (newsroomItem) {
          const [headingCell, sectionLinksCell] = [...newsroomItem.children];
          leftDiv.classList.add('newsroom-left-div');
          const heading = document.createElement('h4');
          heading.classList.add('left-div-heading');
          const headingAnchor = document.createElement('a');
          headingAnchor.textContent = headingCell.textContent.trim();
          heading.append(headingAnchor);
          leftDiv.append(heading);

          const latestPressRelease = document.createElement('div');
          latestPressRelease.classList.add('latest-two-press-release');
          leftDiv.append(latestPressRelease);

          pressReleaseSlideItems.forEach((pressRow) => {
            const [pressLinkCell, pressTitleCell, pressDateCell, pressCategoryCell] = [...pressRow.children];
            const slides = document.createElement('div');
            slides.classList.add('slides');
            const pressWrap = document.createElement('div');
            pressWrap.classList.add('wrap');
            slides.append(pressWrap);
            const content = document.createElement('div');
            content.classList.add('content');
            pressWrap.append(content);
            const desc = document.createElement('div');
            desc.classList.add('desc');
            content.append(desc);
            const p = document.createElement('p');
            const pressLink = document.createElement('a');
            const foundPressLink = pressLinkCell.querySelector('a');
            if (foundPressLink) {
              pressLink.href = foundPressLink.href;
            }
            pressLink.textContent = pressTitleCell.textContent.trim();
            p.append(pressLink);
            desc.append(p);

            const dateDiv = document.createElement('div');
            dateDiv.classList.add('date');
            const emDate = document.createElement('em');
            emDate.textContent = pressDateCell.textContent.trim();
            dateDiv.append(emDate);
            const emCategory = document.createElement('em');
            emCategory.textContent = pressCategoryCell.textContent.trim();
            dateDiv.append(emCategory);
            desc.append(dateDiv);
            latestPressRelease.append(slides);
            moveInstrumentation(pressRow, slides);
          });

          const tempSectionLinksDiv = document.createElement('div');
          tempSectionLinksDiv.innerHTML = sectionLinksCell.innerHTML; // richtext
          const sectionLinksUl = tempSectionLinksDiv.querySelector('ul');
          if (sectionLinksUl) {
            subNavWrap.append(sectionLinksUl);
            transformNestedLists(sectionLinksUl);
          } else {
            while (tempSectionLinksDiv.firstChild) subNavWrap.append(tempSectionLinksDiv.firstChild);
          }
          moveInstrumentation(newsroomItem, megaMenu);
        }
      } else if (megaMenuType === 'careers') {
        const careersItem = megaMenuCareersItems.shift();
        if (careersItem) {
          const [headingCell, descCell, subDescCell, careersHierarchyCell, sectionLinksCell] = [...careersItem.children];
          leftDiv.classList.add('career-left-div');
          const heading = document.createElement('h4');
          heading.classList.add('left-div-heading');
          const headingAnchor = document.createElement('a');
          headingAnchor.textContent = headingCell.textContent.trim();
          heading.append(headingAnchor);
          leftDiv.append(heading);

          const desc = document.createElement('p');
          desc.classList.add('left-div-desc');
          desc.textContent = descCell.textContent.trim();
          leftDiv.append(desc);

          const subDesc = document.createElement('p');
          subDesc.classList.add('left-div-subdesc');
          subDesc.textContent = subDescCell.textContent.trim();
          leftDiv.append(subDesc);

          subNavWrap.classList.add('careers-div');
          const tempCareersDiv = document.createElement('div');
          tempCareersDiv.innerHTML = careersHierarchyCell.innerHTML; // richtext
          const careersUl = tempCareersDiv.querySelector('ul');
          if (careersUl) {
            subNavWrap.append(careersUl);
            transformNestedLists(careersUl);
          } else {
            while (tempCareersDiv.firstChild) subNavWrap.append(tempCareersDiv.firstChild);
          }

          const tempSectionLinksDiv = document.createElement('div');
          tempSectionLinksDiv.innerHTML = sectionLinksCell.innerHTML; // richtext
          const sectionLinksUl = tempSectionLinksDiv.querySelector('ul');
          if (sectionLinksUl) {
            subNavWrap.append(sectionLinksUl);
            transformNestedLists(sectionLinksUl);
          } else {
            while (tempSectionLinksDiv.firstChild) subNavWrap.append(tempSectionLinksDiv.firstChild);
          }
          moveInstrumentation(careersItem, megaMenu);
        }
      }
      li.append(megaMenu);
    }
    ulNav.append(li);
  });

  const iconNavMobile = document.createElement('div');
  iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
  const ulMobile = document.createElement('ul');
  iconNavMobile.append(ulMobile);

  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
  const ulDesktop = document.createElement('ul');
  iconNavDesktop.append(ulDesktop);

  iconLinkItems.forEach((row) => {
    const [iconCell, linkCell, labelCell] = [...row.children];
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '21' }]);
      moveInstrumentation(iconCell, optimizedPic.querySelector('img'));
      anchor.prepend(optimizedPic);
    }

    li.append(anchor);
    ulMobile.append(li.cloneNode(true)); // Clone for mobile
    ulDesktop.append(li); // Original for desktop
  });

  // Add the mail icon for desktop
  const mailLiDesktop = document.createElement('li');
  mailLiDesktop.classList.add('mail');
  const mailAnchorDesktop = document.createElement('a');
  mailAnchorDesktop.href = 'https://www.mahindra.com/contact-us';
  mailAnchorDesktop.innerHTML = `<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                              C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                              L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
                  </svg>`;
  mailLiDesktop.append(mailAnchorDesktop);
  ulDesktop.prepend(mailLiDesktop); // Prepend to keep order as per original HTML

  // Add the mail icon for mobile
  const mailLiMobile = document.createElement('li');
  mailLiMobile.classList.add('mail');
  const mailAnchorMobile = document.createElement('a');
  mailAnchorMobile.href = 'https://www.mahindra.com/contact-us';
  mailAnchorMobile.textContent = 'Contact Us'; // Text content for mobile
  mailLiMobile.append(mailAnchorMobile);
  ulMobile.prepend(mailLiMobile); // Prepend to keep order as per original HTML


  ulNav.append(iconNavMobile);
  nav.append(iconNavDesktop);

  // Search functionality (simplified, no actual search logic)
  const searchLiMobile = document.createElement('li');
  searchLiMobile.classList.add('search');
  searchLiMobile.setAttribute('data-once', 'search-toggle search-stop-propagation');
  const searchAnchorMobile = document.createElement('a');
  searchAnchorMobile.href = '#';
  searchAnchorMobile.setAttribute('data-once', 'search-stop-propagation');
  searchAnchorMobile.innerHTML = `<svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation">
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
    </svg>
    <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation">
      <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path>
    </svg>
    <span data-once="search-stop-propagation"> Search</span>`;
  searchLiMobile.append(searchAnchorMobile);
  ulMobile.append(searchLiMobile);

  const searchLiDesktop = searchLiMobile.cloneNode(true);
  searchLiDesktop.querySelector('span').remove(); // Remove 'Search' text for desktop
  ulDesktop.append(searchLiDesktop);

  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
  const searchWrapInner = document.createElement('div');
  searchWrapInner.classList.add('wrap');
  searchWrapInner.setAttribute('data-once', 'search-stop-propagation');
  searchScreenWrap.append(searchWrapInner);

  const searchForm = document.createElement('form');
  searchForm.action = 'https://www.mahindra.com/search';
  searchForm.method = 'get';
  searchForm.id = 'search-block-form';
  searchForm.setAttribute('accept-charset', 'UTF-8');
  searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
  searchForm.setAttribute('data-once', 'search-stop-propagation');
  searchWrapInner.append(searchForm);

  const searchInputWrap = document.createElement('div');
  searchInputWrap.classList.add('search-wrap');
  searchInputWrap.setAttribute('data-once', 'search-stop-propagation');
  searchForm.append(searchInputWrap);

  const searchIcon = document.createElement('div');
  searchIcon.classList.add('search-icon');
  searchIcon.setAttribute('data-once', 'search-stop-propagation');
  searchIcon.innerHTML = `<svg viewBox="0 0 21 21" fill="none" data-once="search-stop-propagation">
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
    </svg>`;
  searchInputWrap.append(searchIcon);

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.classList.add('input-text', 'searchtext');
  searchInput.required = true;
  searchInput.name = 'key';
  searchInput.id = 'searchInput';
  searchInput.autocomplete = 'off';
  searchInput.setAttribute('data-once', 'search-stop-propagation');
  searchInputWrap.append(searchInput);

  const submitButton = document.createElement('button');
  submitButton.classList.add('submit-button');
  submitButton.setAttribute('data-once', 'search-stop-propagation');
  submitButton.innerHTML = `<div class="label" data-once="search-stop-propagation"> Submit </div>
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" data-once="search-stop-propagation">
      <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black" data-once="search-stop-propagation"></path>
    </svg>`;
  searchInputWrap.append(submitButton);

  const searchResultBox = document.createElement('div');
  searchResultBox.classList.add('searchResultBox');
  searchResultBox.style.display = 'none';
  searchResultBox.setAttribute('data-once', 'search-stop-propagation');
  searchForm.append(searchResultBox);

  const searchSuggestionsWrap = document.createElement('div');
  searchSuggestionsWrap.classList.add('search-suggestions-wrap');
  searchSuggestionsWrap.setAttribute('data-once', 'search-stop-propagation');
  searchSuggestionsWrap.innerHTML = `<div class="label" data-once="search-stop-propagation">Popular Keywords:</div>
    <div class="tokens-wrap" data-once="search-stop-propagation">
      <ul data-once="search-stop-propagation">
        <li data-once="search-stop-propagation">Business</li>
        <li data-once="search-stop-propagation">FY 21</li>
        <li data-once="search-stop-propagation">Brands</li>
        <li data-once="search-stop-propagation">XUV700</li>
        <li data-once="search-stop-propagation">Global</li>
        <li data-once="search-stop-propagation">Nanhi Kali</li>
      </ul>
    </div>`;
  searchWrapInner.append(searchSuggestionsWrap);

  const searchSuggestionsWrap2 = document.createElement('div'); // Create a new element instead of cloning and modifying
  searchSuggestionsWrap2.classList.add('search-suggestions-wrap');
  searchSuggestionsWrap2.setAttribute('data-once', 'search-stop-propagation');
  searchSuggestionsWrap2.innerHTML = `<div class="label" data-once="search-stop-propagation">Recommended for you:</div>
    <div class="tokens-wrap" data-once="search-stop-propagation">
      <ul data-once="search-stop-propagation">
        <li data-once="search-stop-propagation">Annual Report 2021 - 2022</li>
        <li data-once="search-stop-propagation">Leadership Announcement</li>
        <li data-once="search-stop-propagation">Latest Press Release</li>
        <li data-once="search-stop-propagation">Brand Guidelines</li>
      </ul>
    </div>`;
  searchWrapInner.append(searchSuggestionsWrap2);

  // Toggle search screen
  const toggleSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    searchScreenWrap.classList.toggle('active');
    document.body.classList.toggle('search-active');
  };

  searchAnchorMobile.addEventListener('click', toggleSearch);
  searchLiDesktop.querySelector('a').addEventListener('click', toggleSearch);
  searchScreenWrap.addEventListener('click', (e) => {
    if (e.target === searchScreenWrap) {
      toggleSearch(e);
    }
  });

  nav.append(searchScreenWrap);

  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  wrap.append(year80LogoDiv);

  const year80LogoLink = document.createElement('a');
  const foundYear80LogoLink = year80LogoLinkRow.querySelector('a');
  if (foundYear80LogoLink) {
    year80LogoLink.href = foundYear80LogoLink.href;
  }
  moveInstrumentation(year80LogoLinkRow, year80LogoLink);

  const year80LogoPicture = year80LogoRow.querySelector('picture');
  if (year80LogoPicture) {
    const img = year80LogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(year80LogoRow, optimizedPic.querySelector('img'));
    year80LogoLink.append(optimizedPic);
  }
  year80LogoDiv.append(year80LogoLink);

  block.replaceChildren(header);
}
