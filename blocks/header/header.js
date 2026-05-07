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

const addChevronSVG = () => {
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
    </g>`;
  return svg;
};

export default async function decorate(block) {
  const allRows = [...block.children];

  // Root-level fields
  const [mainLogoRow, mainLogoLinkRow, anniversaryLogoRow, anniversaryLogoLinkRow, ...itemRows] = allRows;

  const mainLogoCell = mainLogoRow.children[0];
  const mainLogoLinkCell = mainLogoLinkRow.children[0];
  const anniversaryLogoCell = anniversaryLogoRow.children[0];
  const anniversaryLogoLinkCell = anniversaryLogoLinkRow.children[0];

  // Filter item rows based on structure and content for specific mega menu types
  const navigationRows = itemRows.filter((row) => row.children.length === 3); // label, link, hierarchy-tree
  const contactLinkRows = itemRows.filter((row) => row.children.length === 2); // label, link

  // Mega menu item types have 3 or 4 cells, and specific content in certain cells
  const megaMenuAboutRows = itemRows.filter((row) => row.children.length === 4 && row.children[1]?.innerHTML.includes('Left Description text content'));
  const megaMenuWhatWeDoRows = itemRows.filter((row) => row.children.length === 3 && row.children[1]?.innerHTML.includes('Key Facts List text content'));
  const megaMenuInvestorRelationsRows = itemRows.filter((row) => row.children.length === 4 && row.children[2]?.innerHTML.includes('IR Facts List text content'));
  const megaMenuNewsroomRows = itemRows.filter((row) => row.children.length === 2 && row.children[1]?.querySelector('ul')); // Heading, Hierarchy-tree (press releases are separate rows)
  const pressReleaseRows = itemRows.filter((row) => row.children.length === 4 && row.children[0]?.querySelector('a')); // link, title, date, category
  const megaMenuCareersRows = itemRows.filter((row) => row.children.length === 4 && row.children[1]?.textContent.trim() === 'example text value'); // Heading, Description, SubDescription, Hierarchy-tree

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid');
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

  const mainLogoAnchor = document.createElement('a');
  if (mainLogoLinkCell?.querySelector('a')) {
    mainLogoAnchor.href = mainLogoLinkCell.querySelector('a').href;
    moveInstrumentation(mainLogoLinkRow, mainLogoAnchor);
  } else {
    mainLogoAnchor.href = '#';
  }

  if (mainLogoCell) {
    const mainLogoPicture = mainLogoCell.querySelector('picture');
    if (mainLogoPicture) {
      const img = mainLogoPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      moveInstrumentation(mainLogoRow, optimizedPic.querySelector('img'));
      mainLogoAnchor.append(optimizedPic);
    }
  }
  mainLogoAnchor.classList.add('hiddenlogo1');
  logoDiv.append(mainLogoAnchor);

  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  wrap.append(hamburger);

  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  wrap.append(nav);

  const ul = document.createElement('ul');
  ul.setAttribute('itemscope', '');
  ul.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(ul);

  navigationRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children]; // Fixed schema for navigation-item

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    ul.append(li);

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    if (linkCell && linkCell.querySelector('a')) {
      anchor.href = linkCell.querySelector('a').href;
    } else {
      anchor.href = '#';
    }
    anchor.textContent = labelCell ? labelCell.textContent.trim() : '';
    moveInstrumentation(row, anchor);
    li.append(anchor);
    li.append(addChevronSVG());

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    li.append(megaMenu);

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

    const hierarchyUl = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyUl) {
      transformNestedLists(hierarchyUl);
      moveInstrumentation(hierarchyTreeCell, hierarchyUl); // Move instrumentation for the hierarchy tree
      subNavWrap.append(hierarchyUl);
    }

    // Handle specific mega menu types based on the original structure
    if (megaMenuAboutRows.includes(row)) {
      leftDiv.classList.add('about-us-sub-nav');
      const [headingCell, descriptionCell, subDescriptionCell] = [...megaMenuAboutRows[0].children];

      const heading = document.createElement('h4');
      heading.classList.add('left-div-heading');
      heading.innerHTML = `<a>${headingCell?.textContent.trim()}</a>`;
      leftDiv.append(heading);

      const description = document.createElement('p');
      description.classList.add('left-div-desc');
      description.innerHTML = descriptionCell?.innerHTML || '';
      leftDiv.append(description);

      const subDescription = document.createElement('p');
      subDescription.classList.add('left-div-subdesc');
      subDescription.textContent = subDescriptionCell?.textContent.trim() || '';
      leftDiv.append(subDescription);
    } else if (megaMenuWhatWeDoRows.includes(row)) {
      leftDiv.classList.add('what-we-do');
      const [headingCell, factsListCell] = [...megaMenuWhatWeDoRows[0].children];

      const heading = document.createElement('h4');
      heading.classList.add('left-div-heading');
      heading.innerHTML = `<a>${headingCell?.textContent.trim()}</a>`;
      leftDiv.append(heading);

      const factsList = document.createElement('ul');
      factsList.innerHTML = factsListCell?.innerHTML || '';
      factsList.querySelectorAll('li').forEach((liItem) => {
        liItem.classList.add('list-text-red');
      });
      leftDiv.append(factsList);
    } else if (megaMenuInvestorRelationsRows.includes(row)) {
      leftDiv.classList.add('ir-left-div');
      const [headingCell, descriptionCell, factsListCell] = [...megaMenuInvestorRelationsRows[0].children];

      const heading = document.createElement('h4');
      heading.classList.add('left-div-heading');
      heading.innerHTML = `<a>${headingCell?.textContent.trim()}</a>`;
      leftDiv.append(heading);

      const description = document.createElement('p');
      description.textContent = descriptionCell?.textContent.trim() || '';
      leftDiv.append(description);

      const factsList = document.createElement('ul');
      factsList.innerHTML = factsListCell?.innerHTML || '';
      factsList.querySelectorAll('li').forEach((liItem) => {
        liItem.classList.add('list-text-red');
      });
      leftDiv.append(factsList);
    } else if (megaMenuNewsroomRows.includes(row)) {
      leftDiv.classList.add('newsroom-left-div');
      const [headingCell] = [...megaMenuNewsroomRows[0].children]; // Newsroom has 2 cells, 2nd is hierarchy-tree

      const heading = document.createElement('h4');
      heading.classList.add('left-div-heading');
      heading.innerHTML = `<a>${headingCell?.textContent.trim()}</a>`;
      leftDiv.append(heading);

      const latestPressReleaseDiv = document.createElement('div');
      latestPressReleaseDiv.classList.add('latest-two-press-release');
      leftDiv.append(latestPressReleaseDiv);

      pressReleaseRows.forEach((prRow) => {
        const [prLinkCell, prTitleCell, prDateCell, prCategoryCell] = [...prRow.children]; // Fixed schema for press-release-item

        const prLink = prLinkCell?.querySelector('a');
        const prTitle = prTitleCell?.textContent.trim();
        const prDate = prDateCell?.textContent.trim();
        const prCategory = prCategoryCell?.textContent.trim();

        const slideWrap = document.createElement('div');
        slideWrap.classList.add('slides');
        latestPressReleaseDiv.append(slideWrap);

        const slideInnerWrap = document.createElement('div');
        slideInnerWrap.classList.add('wrap');
        slideWrap.append(slideInnerWrap);

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('content');
        slideInnerWrap.append(contentDiv);

        const descDiv = document.createElement('div');
        descDiv.classList.add('desc');
        contentDiv.append(descDiv);

        const p = document.createElement('p');
        const a = document.createElement('a');
        if (prLink) {
          a.href = prLink.href;
        } else {
          a.href = '#';
        }
        a.textContent = prTitle;
        p.append(a);
        descDiv.append(p);

        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date');
        dateDiv.innerHTML = `<em><time datetime="${prDate}">${prDate}</time></em><em>${prCategory}</em>`;
        descDiv.append(dateDiv);
        moveInstrumentation(prRow, slideWrap);
      });
    } else if (megaMenuCareersRows.includes(row)) {
      leftDiv.classList.add('career-left-div');
      const [headingCell, descriptionCell, subDescriptionCell] = [...megaMenuCareersRows[0].children];

      const heading = document.createElement('h4');
      heading.classList.add('left-div-heading');
      heading.innerHTML = `<a>${headingCell?.textContent.trim()}</a>`;
      leftDiv.append(heading);

      const description = document.createElement('p');
      description.classList.add('left-div-desc');
      description.textContent = descriptionCell?.textContent.trim() || '';
      leftDiv.append(description);

      const subDescription = document.createElement('p');
      subDescription.classList.add('left-div-subdesc');
      subDescription.textContent = subDescriptionCell?.textContent.trim() || '';
      leftDiv.append(subDescription);
    }
  });

  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  ul.append(mobileIconNav);

  const mobileIconUl = document.createElement('ul');
  mobileIconNav.append(mobileIconUl);

  contactLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Fixed schema for contact-link-item

    const li = document.createElement('li');
    li.classList.add('mail');
    mobileIconUl.append(li);

    const anchor = document.createElement('a');
    const link = linkCell?.querySelector('a');
    const label = labelCell?.textContent.trim();
    if (link) {
      anchor.href = link.href;
    } else {
      anchor.href = '#';
    }
    anchor.textContent = label;
    li.append(anchor);
    moveInstrumentation(row, li);
  });

  // Search icon for mobile
  const mobileSearchLi = document.createElement('li');
  mobileSearchLi.classList.add('search');
  mobileIconUl.append(mobileSearchLi);

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
  mobileSearchLi.append(mobileSearchAnchor);

  // Add search screen wrap and form for mobile
  const mobileSearchScreenWrap = document.createElement('div');
  mobileSearchScreenWrap.classList.add('search-screen-wrap');
  mobileSearchScreenWrap.style.display = 'none'; // Initially hidden
  mobileSearchLi.append(mobileSearchScreenWrap);

  const mobileSearchWrapInner = document.createElement('div');
  mobileSearchWrapInner.classList.add('wrap');
  mobileSearchScreenWrap.append(mobileSearchWrapInner);

  const mobileSearchForm = document.createElement('form');
  mobileSearchForm.setAttribute('action', 'https://www.mahindra.com/search');
  mobileSearchForm.setAttribute('method', 'get');
  mobileSearchForm.setAttribute('id', 'search-block-form-mobile');
  mobileSearchForm.setAttribute('accept-charset', 'UTF-8');
  mobileSearchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
  mobileSearchWrapInner.append(mobileSearchForm);

  const mobileSearchInputWrap = document.createElement('div');
  mobileSearchInputWrap.classList.add('search-wrap');
  mobileSearchForm.append(mobileSearchInputWrap);

  const mobileSearchIconDiv = document.createElement('div');
  mobileSearchIconDiv.classList.add('search-icon');
  mobileSearchIconDiv.innerHTML = `<svg viewBox="0 0 21 21" fill="none">
    <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
  </svg>`;
  mobileSearchInputWrap.append(mobileSearchIconDiv);

  const mobileSearchInput = document.createElement('input');
  mobileSearchInput.setAttribute('type', 'text');
  mobileSearchInput.classList.add('input-text', 'searchtext');
  mobileSearchInput.setAttribute('required', '');
  mobileSearchInput.setAttribute('name', 'key');
  mobileSearchInput.setAttribute('id', 'searchInputMobile');
  mobileSearchInput.setAttribute('autocomplete', 'off');
  mobileSearchInputWrap.append(mobileSearchInput);

  const mobileSubmitButton = document.createElement('button');
  mobileSubmitButton.classList.add('submit-button');
  mobileSubmitButton.innerHTML = `<div class="label"> Submit </div>
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
      <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path>
    </svg>`;
  mobileSearchInputWrap.append(mobileSubmitButton);

  // Add search result box and suggestions for mobile
  const mobileSearchResultBox = document.createElement('div');
  mobileSearchResultBox.classList.add('searchResultBox');
  mobileSearchResultBox.style.display = 'none';
  mobileSearchForm.append(mobileSearchResultBox);

  const mobileSwiper = document.createElement('div');
  mobileSwiper.classList.add('swiper', 'scrollSwiper');
  mobileSearchResultBox.append(mobileSwiper);

  const mobileSwiperWrapper = document.createElement('div');
  mobileSwiperWrapper.classList.add('swiper-wrapper');
  mobileSwiper.append(mobileSwiperWrapper);

  const mobileSwiperSlide = document.createElement('div');
  mobileSwiperSlide.classList.add('swiper-slide');
  mobileSwiperWrapper.append(mobileSwiperSlide);

  const mobileSwiperScrollbar = document.createElement('div');
  mobileSwiperScrollbar.classList.add('swiper-scrollbar');
  mobileSearchResultBox.append(mobileSwiperScrollbar);

  const mobilePopularKeywords = document.createElement('div');
  mobilePopularKeywords.classList.add('search-suggestions-wrap');
  mobilePopularKeywords.innerHTML = `<div class="label">Popular Keywords:</div>
    <div class="tokens-wrap">
      <ul>
        <li>Business</li>
        <li>FY 21</li>
        <li>Brands</li>
        <li>XUV700</li>
        <li>Global</li>
        <li>Nanhi Kali</li>
      </ul>
    </div>`;
  mobileSearchWrapInner.append(mobilePopularKeywords);

  const mobileRecommendedKeywords = document.createElement('div');
  mobileRecommendedKeywords.classList.add('search-suggestions-wrap');
  mobileRecommendedKeywords.innerHTML = `<div class="label">Recommended for you:</div>
    <div class="tokens-wrap">
      <ul>
        <li>Annual Report 2021 - 2022</li>
        <li>Leadership Announcement</li>
        <li>Latest Press Release</li>
        <li>Brand Guidelines</li>
      </ul>
    </div>`;
  mobileSearchWrapInner.append(mobileRecommendedKeywords);


  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  nav.append(desktopIconNav);

  const desktopIconUl = document.createElement('ul');
  desktopIconNav.append(desktopIconUl);

  contactLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Fixed schema for contact-link-item

    const li = document.createElement('li');
    li.classList.add('mail');
    desktopIconUl.append(li);

    const anchor = document.createElement('a');
    const link = linkCell?.querySelector('a');
    if (link) {
      anchor.href = link.href;
    } else {
      anchor.href = '#';
    }
    anchor.innerHTML = `
      <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink">
        <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                  C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                  L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
      </svg>
    `;
    li.append(anchor);
    moveInstrumentation(row, li);
  });

  // Search icon for desktop
  const desktopSearchLi = document.createElement('li');
  desktopSearchLi.classList.add('search');
  desktopIconUl.append(desktopSearchLi);

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
  desktopSearchLi.append(desktopSearchAnchor);

  // Add search screen wrap and form for desktop
  const desktopSearchScreenWrap = document.createElement('div');
  desktopSearchScreenWrap.classList.add('search-screen-wrap');
  desktopSearchScreenWrap.style.display = 'none'; // Initially hidden
  desktopSearchLi.append(desktopSearchScreenWrap);

  const desktopSearchWrapInner = document.createElement('div');
  desktopSearchWrapInner.classList.add('wrap');
  desktopSearchScreenWrap.append(desktopSearchWrapInner);

  const desktopSearchForm = document.createElement('form');
  desktopSearchForm.setAttribute('action', 'https://www.mahindra.com/search');
  desktopSearchForm.setAttribute('method', 'get');
  desktopSearchForm.setAttribute('id', 'search-block-form-desktop');
  desktopSearchForm.setAttribute('accept-charset', 'UTF-8');
  desktopSearchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
  desktopSearchWrapInner.append(desktopSearchForm);

  const desktopSearchInputWrap = document.createElement('div');
  desktopSearchInputWrap.classList.add('search-wrap');
  desktopSearchForm.append(desktopSearchInputWrap);

  const desktopSearchIconDiv = document.createElement('div');
  desktopSearchIconDiv.classList.add('search-icon');
  desktopSearchIconDiv.innerHTML = `<svg viewBox="0 0 21 21" fill="none">
    <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
  </svg>`;
  desktopSearchInputWrap.append(desktopSearchIconDiv);

  const desktopSearchInput = document.createElement('input');
  desktopSearchInput.setAttribute('type', 'text');
  desktopSearchInput.classList.add('input-text', 'searchtext');
  desktopSearchInput.setAttribute('required', '');
  desktopSearchInput.setAttribute('name', 'key');
  desktopSearchInput.setAttribute('id', 'searchInputDesktop');
  desktopSearchInput.setAttribute('autocomplete', 'off');
  desktopSearchInputWrap.append(desktopSearchInput);

  const desktopSubmitButton = document.createElement('button');
  desktopSubmitButton.classList.add('submit-button');
  desktopSubmitButton.innerHTML = `<div class="label"> Submit </div>
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
      <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path>
    </svg>`;
  desktopSearchInputWrap.append(desktopSubmitButton);

  // Add search result box and suggestions for desktop
  const desktopSearchResultBox = document.createElement('div');
  desktopSearchResultBox.classList.add('searchResultBox');
  desktopSearchResultBox.style.display = 'none';
  desktopSearchForm.append(desktopSearchResultBox);

  const desktopSwiper = document.createElement('div');
  desktopSwiper.classList.add('swiper', 'scrollSwiper');
  desktopSearchResultBox.append(desktopSwiper);

  const desktopSwiperWrapper = document.createElement('div');
  desktopSwiperWrapper.classList.add('swiper-wrapper');
  desktopSwiper.append(desktopSwiperWrapper);

  const desktopSwiperSlide = document.createElement('div');
  desktopSwiperSlide.classList.add('swiper-slide');
  desktopSwiperWrapper.append(desktopSwiperSlide);

  const desktopSwiperScrollbar = document.createElement('div');
  desktopSwiperScrollbar.classList.add('swiper-scrollbar');
  desktopSearchResultBox.append(desktopSwiperScrollbar);

  const desktopPopularKeywords = document.createElement('div');
  desktopPopularKeywords.classList.add('search-suggestions-wrap');
  desktopPopularKeywords.innerHTML = `<div class="label">Popular Keywords:</div>
    <div class="tokens-wrap">
      <ul>
        <li>Business</li>
        <li>FY 21</li>
        <li>Brands</li>
        <li>XUV700</li>
        <li>Global</li>
        <li>Nanhi Kali</li>
      </ul>
    </div>`;
  desktopSearchWrapInner.append(desktopPopularKeywords);

  const desktopRecommendedKeywords = document.createElement('div');
  desktopRecommendedKeywords.classList.add('search-suggestions-wrap');
  desktopRecommendedKeywords.innerHTML = `<div class="label">Recommended for you:</div>
    <div class="tokens-wrap">
      <ul>
        <li>Annual Report 2021 - 2022</li>
        <li>Leadership Announcement</li>
        <li>Latest Press Release</li>
        <li>Brand Guidelines</li>
      </ul>
    </div>`;
  desktopSearchWrapInner.append(desktopRecommendedKeywords);


  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  wrap.append(year80LogoDiv);

  const year80LogoAnchor = document.createElement('a');
  if (anniversaryLogoLinkCell?.querySelector('a')) {
    year80LogoAnchor.href = anniversaryLogoLinkCell.querySelector('a').href;
    moveInstrumentation(anniversaryLogoLinkRow, year80LogoAnchor);
  } else {
    year80LogoAnchor.href = '#';
  }

  if (anniversaryLogoCell) {
    const anniversaryLogoPicture = anniversaryLogoCell.querySelector('picture');
    if (anniversaryLogoPicture) {
      const img = anniversaryLogoPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
      moveInstrumentation(anniversaryLogoRow, optimizedPic.querySelector('img'));
      year80LogoAnchor.append(optimizedPic);
    }
  }
  year80LogoAnchor.classList.add('hiddenlogo1', 'years-80');
  year80LogoDiv.append(year80LogoAnchor);

  block.replaceChildren(header);

  // Add event listeners for hamburger menu toggle
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // Search functionality (simplified for EDS)
  const searchToggle = (searchLiElement, searchInputId) => {
    const searchScreenWrap = searchLiElement.querySelector('.search-screen-wrap');
    const lensIcon = searchLiElement.querySelector('.lens');
    const closeIcon = searchLiElement.querySelector('.close');
    const searchInput = searchLiElement.querySelector(`#${searchInputId}`);

    searchLiElement.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchScreenWrap.style.display = searchScreenWrap.style.display === 'block' ? 'none' : 'block';
      lensIcon.style.display = lensIcon.style.display === 'none' ? 'block' : 'none';
      closeIcon.style.display = closeIcon.style.display === 'block' ? 'none' : 'block';
      if (searchScreenWrap.style.display === 'block') {
        searchInput.focus();
      }
    });

    searchScreenWrap.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  };

  searchToggle(mobileSearchLi, 'searchInputMobile');
  searchToggle(desktopSearchLi, 'searchInputDesktop');
}
