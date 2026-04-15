import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [logoRow, logoLinkRow, ...itemRows] = [...block.children];

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  header.setAttribute('data-once', 'header-hover');

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  wrap.append(logoDiv);

  const logoLink = document.createElement('a');
  const logoLinkA = logoLinkRow.querySelector('a');
  if (logoLinkA) {
    logoLink.href = logoLinkA.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    const optimizedImg = optimizedPic.querySelector('img');
    optimizedImg.classList.add('hiddenlogo1');
    optimizedImg.width = '200';
    optimizedImg.height = '30';
    optimizedImg.style.width = 'auto';
    optimizedImg.loading = 'lazy';
    optimizedImg.alt = img.alt || 'Mahindra Brand Logo White'; // Add default alt if missing
    optimizedImg.title = img.title || 'Mahindra Brand Logo White Image'; // Add default title if missing
    moveInstrumentation(img, optimizedImg);
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoDiv);

  // Hamburger menu
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  hamburgerDiv.setAttribute('data-once', 'hamburger-click nav-close-search');
  wrap.append(hamburgerDiv);

  const hamburgerUl = document.createElement('ul');
  hamburgerDiv.append(hamburgerUl);
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  wrap.append(nav);

  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);

  // Filter item rows based on content structure
  const navigationItems = itemRows.filter((row) => row.children.length === 3 && row.querySelector('ul'));
  // const contactLinkItems = itemRows.filter((row) => row.children.length === 1 && row.querySelector('a')); // Not used directly in current structure
  // const searchLinkItems = itemRows.filter((row) => row.children.length === 3 && row.querySelector('picture')); // Not used directly in current structure
  const additionalLogoItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('picture'));

  navigationItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find((c) => !c.querySelector('a') && !c.querySelector('ul'));
    const linkCell = cells.find((c) => c.querySelector('a') && !c.querySelector('ul'));
    const hierarchyCell = cells.find((c) => c.querySelector('ul'));

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.setAttribute('data-once', 'nav-close-search');
    moveInstrumentation(row, li);

    const link = document.createElement('a');
    link.setAttribute('itemprop', 'url');
    if (linkCell && linkCell.querySelector('a')) {
      link.href = linkCell.querySelector('a').href;
      link.textContent = labelCell?.textContent || linkCell.querySelector('a').textContent;
    } else if (labelCell) {
      link.textContent = labelCell.textContent;
    }
    li.append(link);

    // Add SVG span (placeholder as original has SVG)
    const svgSpan = document.createElement('span');
    const svgImg = document.createElement('img');
    svgImg.alt = 'svg file';
    svgImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107678.svg+xml'; // Placeholder
    svgSpan.append(svgImg);
    li.append(svgSpan);

    if (hierarchyCell) {
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

      const leftDivHeading = document.createElement('h4');
      leftDivHeading.classList.add('left-div-heading');
      const headingLink = document.createElement('a');
      headingLink.textContent = link.textContent; // Use the main menu label as heading
      leftDivHeading.append(headingLink);
      leftDiv.append(leftDivHeading);

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');

      // Conditional content for left-div based on menu label
      if (link.textContent.toLowerCase().includes('who we are')) {
        leftDiv.classList.add('left-div'); // Already added, but keeping for clarity if logic changes
        const desc = document.createElement('p');
        desc.classList.add('left-div-desc');
        desc.textContent = 'Drive positive change in the lives of our communities. Only when we enable others to rise will we rise.';
        leftDiv.append(desc);
        const subDesc = document.createElement('p');
        subDesc.classList.add('left-div-subdesc');
        subDesc.textContent = '#TogetherWeRise';
        leftDiv.append(subDesc);
        subNavWrap.classList.add('about-us-sub-nav');
      } else if (link.textContent.toLowerCase().includes('what we do')) {
        leftDiv.classList.add('left-div'); // Already added
        const heading = document.createElement('h4');
        heading.classList.add('left-div-heading');
        const headingA = document.createElement('a');
        headingA.textContent = 'Key Facts';
        heading.append(headingA);
        leftDiv.append(heading);

        const ulFacts = document.createElement('ul');
        leftDiv.append(ulFacts);
        const facts = [
          '20+ Industries',
          '100+ Countries',
          '324K+ Employees',
        ];
        facts.forEach((fact) => {
          const liFact = document.createElement('li');
          liFact.classList.add('list-text-red');
          const [num, ...textParts] = fact.split(' ');
          const spanNum = document.createElement('span');
          spanNum.textContent = num;
          liFact.append(spanNum, ` ${textParts.join(' ')}`);
          ulFacts.append(liFact);
        });
        subNavWrap.classList.add('what-we-do');
      } else if (link.textContent.toLowerCase().includes('investor relations')) {
        leftDiv.classList.add('ir-left-div');
        const heading = document.createElement('h4');
        heading.classList.add('left-div-heading');
        const headingA = document.createElement('a');
        headingA.textContent = 'Investor Relations';
        heading.append(headingA);
        leftDiv.append(heading);

        const p = document.createElement('p');
        p.textContent = 'Group Highlights - Q3 F26';
        leftDiv.append(p);

        const ulHighlights = document.createElement('ul');
        leftDiv.append(ulHighlights);
        const highlights = [
          '20.1% Consolidated ROE (Annualized)',
          'Rs 52,100 cr Revenue',
          'Rs 4,675 cr PAT',
        ];
        highlights.forEach((highlight) => {
          const liHighlight = document.createElement('li');
          liHighlight.classList.add('list-text-red');
          const [num, ...textParts] = highlight.split(' ');
          const spanNum = document.createElement('span');
          spanNum.textContent = num;
          liHighlight.append(spanNum, ` ${textParts.join(' ')}`);
          ulHighlights.append(liHighlight);
        });
        subNavWrap.classList.add('element-block');
      } else if (link.textContent.toLowerCase().includes('newsroom')) {
        leftDiv.classList.add('newsroom-left-div');
        const heading = document.createElement('h4');
        heading.classList.add('left-div-heading');
        const headingA = document.createElement('a');
        headingA.textContent = 'Newsroom';
        heading.append(headingA);
        leftDiv.append(heading);
        // Placeholder for latest-two-press-release
        const pressReleaseDiv = document.createElement('div');
        pressReleaseDiv.classList.add('latest-two-press-release');
        leftDiv.append(pressReleaseDiv);
      } else if (link.textContent.toLowerCase().includes('careers')) {
        leftDiv.classList.add('career-left-div');
        const heading = document.createElement('h4');
        heading.classList.add('left-div-heading');
        const headingA = document.createElement('a');
        headingA.textContent = 'careers';
        heading.append(headingA);
        leftDiv.append(heading);
        const desc = document.createElement('p');
        desc.classList.add('left-div-desc');
        desc.textContent = 'Committed to elevate the lives of communities, guided by our core behaviours and values.';
        leftDiv.append(desc);
        const subDesc = document.createElement('p');
        subDesc.classList.add('left-div-subdesc');
        subDesc.textContent = 'Bold. Agile. Collaborative.';
        leftDiv.append(subDesc);
        subNavWrap.classList.add('careers-div');
      }

      centerDiv.append(subNavWrap);

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv); // Instrumentation before moving children

      // Apply classes to the nested elements based on original HTML structure
      tempDiv.querySelectorAll('ul').forEach((ulItem) => {
        // Check if it's a top-level UL within the hierarchy cell
        if (ulItem.parentElement === tempDiv) {
          ulItem.querySelectorAll(':scope > li').forEach((liItem) => {
            liItem.classList.add('top-level-li');
            if (liItem.querySelector('ul')) {
              const span = document.createElement('span');
              const img = document.createElement('img');
              img.alt = 'svg file';
              img.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107678.svg+xml';
              span.append(img);
              liItem.append(span);
              liItem.classList.add('has-sub-child'); // Add class for sub-child toggle
            }
            liItem.querySelectorAll(':scope > ul > li').forEach((innerLi) => {
              innerLi.classList.add('first-level-li');
              if (innerLi.querySelector('ul')) {
                const span = document.createElement('span');
                const img = document.createElement('img');
                img.alt = 'svg file';
                img.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107678.svg+xml';
                span.append(img);
                innerLi.append(span);
                innerLi.classList.add('has-inner-sub-child'); // Add class for inner sub-child toggle
              }
            });
          });
        }
      });

      // Special handling for investor relations sub-nav
      if (link.textContent.toLowerCase().includes('investor relations')) {
        const subNavWrapOneLink = document.createElement('ul');
        subNavWrapOneLink.classList.add('sub-nav-wrap-one-link');
        const firstLi = tempDiv.querySelector('ul > li');
        if (firstLi) {
          subNavWrapOneLink.append(firstLi);
        }
        subNavWrap.append(subNavWrapOneLink);

        const innerSubNavWrapList = document.createElement('div');
        innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');
        while (tempDiv.firstChild) {
          innerSubNavWrapList.append(tempDiv.firstChild);
        }
        subNavWrap.append(innerSubNavWrapList);
      } else {
        while (tempDiv.firstChild) {
          subNavWrap.append(tempDiv.firstChild);
        }
      }
    }
    navUl.append(li);
  });

  // Icon Navigation (mobile and desktop)
  const createIconNav = (isMobile) => {
    const iconNavDiv = document.createElement('div');
    iconNavDiv.classList.add('icon-nav');
    if (isMobile) {
      iconNavDiv.classList.add('mobile-menus-icon');
    } else {
      iconNavDiv.classList.add('desktop-menus-icon');
    }
    const iconUl = document.createElement('ul');
    iconNavDiv.append(iconUl);

    // Contact Us link
    const mailLi = document.createElement('li');
    mailLi.classList.add('mail');
    const mailLink = document.createElement('a');
    mailLink.href = 'https://www.mahindra.com/contact-us';
    if (isMobile) {
      mailLink.textContent = 'Contact Us';
    } else {
      const mailImg = document.createElement('img');
      mailImg.alt = 'svg file';
      mailImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107856.svg+xml';
      mailLink.append(mailImg);
    }
    mailLi.append(mailLink);
    iconUl.append(mailLi);

    // Search link
    const searchLi = document.createElement('li');
    searchLi.classList.add('search');
    searchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
    const searchLink = document.createElement('a');
    searchLink.href = '#';
    searchLink.setAttribute('data-once', 'search-stop-propagation');
    const searchImg1 = document.createElement('img');
    searchImg1.alt = 'svg file';
    searchImg1.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107725.svg+xml';
    const searchImg2 = document.createElement('img');
    searchImg2.alt = 'svg file';
    searchImg2.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107749.svg+xml';
    searchLink.append(searchImg1, searchImg2);
    if (isMobile) {
      const searchSpan = document.createElement('span');
      searchSpan.setAttribute('data-once', 'search-stop-propagation');
      searchSpan.textContent = ' Search';
      searchLink.append(searchSpan);
    }
    searchLi.append(searchLink);

    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
    searchLi.append(searchScreenWrap);

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

    const searchIconDiv = document.createElement('div');
    searchIconDiv.classList.add('search-icon');
    searchIconDiv.setAttribute('data-once', 'search-stop-propagation');
    const searchIconImg = document.createElement('img');
    searchIconImg.alt = 'svg file';
    searchIconImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107769.svg+xml';
    searchIconDiv.append(searchIconImg);
    searchInputWrap.append(searchIconDiv);

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
    const submitLabel = document.createElement('div');
    submitLabel.classList.add('label');
    submitLabel.setAttribute('data-once', 'search-stop-propagation');
    submitLabel.textContent = ' Submit ';
    const submitImg = document.createElement('img');
    submitImg.alt = 'svg file';
    submitImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107812.svg+xml';
    submitButton.append(submitLabel, submitImg);
    searchInputWrap.append(submitButton);

    const searchResultBox = document.createElement('div');
    searchResultBox.classList.add('searchResultBox');
    searchResultBox.style.display = 'none';
    searchResultBox.setAttribute('data-once', 'search-stop-propagation');
    searchForm.append(searchResultBox);

    const swiperDiv = document.createElement('div');
    swiperDiv.classList.add('swiper', 'scrollSwiper');
    swiperDiv.setAttribute('data-once', 'search-stop-propagation');
    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper');
    swiperWrapper.setAttribute('data-once', 'search-stop-propagation');
    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');
    swiperSlide.setAttribute('data-once', 'search-stop-propagation');
    swiperWrapper.append(swiperSlide);
    swiperDiv.append(swiperWrapper);
    searchResultBox.append(swiperDiv);

    const swiperScrollbar = document.createElement('div');
    swiperScrollbar.classList.add('swiper-scrollbar');
    swiperScrollbar.setAttribute('data-once', 'search-stop-propagation');
    searchResultBox.append(swiperScrollbar);

    const createSuggestions = (label, keywords) => {
      const suggestionsWrap = document.createElement('div');
      suggestionsWrap.classList.add('search-suggestions-wrap');
      suggestionsWrap.setAttribute('data-once', 'search-stop-propagation');
      const labelDiv = document.createElement('div');
      labelDiv.classList.add('label');
      labelDiv.setAttribute('data-once', 'search-stop-propagation');
      labelDiv.textContent = label;
      suggestionsWrap.append(labelDiv);
      const tokensWrap = document.createElement('div');
      tokensWrap.classList.add('tokens-wrap');
      tokensWrap.setAttribute('data-once', 'search-stop-propagation');
      const ul = document.createElement('ul');
      ul.setAttribute('data-once', 'search-stop-propagation');
      keywords.forEach((keyword) => {
        const li = document.createElement('li');
        li.setAttribute('data-once', 'search-stop-propagation');
        li.textContent = keyword;
        ul.append(li);
      });
      tokensWrap.append(ul);
      suggestionsWrap.append(tokensWrap);
      return suggestionsWrap;
    };

    searchWrapInner.append(
      createSuggestions('Popular Keywords:', ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali']),
      createSuggestions('Recommended for you:', ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines']),
    );

    iconUl.append(searchLi);

    // Event listener for search toggle
    searchLink.addEventListener('click', (e) => {
      e.preventDefault();
      searchScreenWrap.classList.toggle('show');
    });
    searchScreenWrap.addEventListener('click', (e) => {
      if (e.target === searchScreenWrap) {
        searchScreenWrap.classList.remove('show');
      }
    });

    return iconNavDiv;
  };

  navUl.append(createIconNav(true)); // Mobile icons
  nav.append(createIconNav(false)); // Desktop icons

  // Additional Logos
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  wrap.append(year80LogoDiv);

  additionalLogoItems.forEach((row) => {
    const cells = [...row.children];
    const logoCell = cells.find((c) => c.querySelector('picture'));
    const logoLinkCell = cells.find((c) => c.querySelector('a'));

    if (logoCell && logoLinkCell) {
      const link = document.createElement('a');
      link.href = logoLinkCell.querySelector('a').href;
      moveInstrumentation(logoLinkCell, link);

      const picture = logoCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        optimizedImg.classList.add('hiddenlogo1', 'years-80');
        optimizedImg.width = '74';
        optimizedImg.height = '60';
        optimizedImg.loading = 'lazy';
        optimizedImg.alt = img.alt || '80th Year Logo Gold'; // Add default alt if missing
        optimizedImg.title = img.title || '80thYearLogo_Gold'; // Add default title if missing
        moveInstrumentation(img, optimizedImg);
        link.append(optimizedPic);
      }
      moveInstrumentation(logoCell, link);
      year80LogoDiv.append(link);
    }
  });

  // Handle hamburger click for mobile menu toggle
  hamburgerDiv.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburgerDiv.classList.toggle('active');
  });

  // Handle sub-child toggle for navigation items (top-level)
  nav.querySelectorAll('.has-child > span').forEach((span) => {
    span.addEventListener('click', (e) => {
      e.preventDefault();
      const parentLi = span.closest('li.has-child');
      if (parentLi) {
        parentLi.classList.toggle('active');
        parentLi.querySelector('.mega-menu')?.classList.toggle('active');
      }
    });
  });

  // Handle sub-child toggle for nested navigation items (first-level)
  nav.querySelectorAll('.top-level-li > span').forEach((span) => {
    span.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent parent li click from firing
      const parentLi = span.closest('.top-level-li');
      if (parentLi) {
        parentLi.classList.toggle('active');
        parentLi.querySelector('.has-sub-child')?.classList.toggle('active');
      }
    });
  });

  // Handle sub-child toggle for inner nested navigation items (inner-level)
  nav.querySelectorAll('.first-level-li > span').forEach((span) => {
    span.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent parent li click from firing
      const parentLi = span.closest('.first-level-li');
      if (parentLi) {
        parentLi.classList.toggle('active-child');
        parentLi.querySelector('.has-inner-sub-child')?.classList.toggle('active-child');
      }
    });
  });

  block.textContent = '';
  block.append(header);

  // Optimize all images within the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
