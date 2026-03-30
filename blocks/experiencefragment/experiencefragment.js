import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const header = block.querySelector('.experiencefragment-cmp-experiencefragment--header');
  const footer = block.querySelector('.experiencefragment-cmp-experiencefragment--footer');

  if (header) {
    const headerEl = document.createElement('header');
    headerEl.className = 'itc-header-section';

    const container = document.createElement('div');
    container.className = 'container';

    const nav = document.createElement('nav');
    nav.className = 'navbar navbar-expand-xl navbar-light bg-light px-xl-5 d-flex justify-content-between align-items-center';

    const togglerButton = document.createElement('button');
    togglerButton.className = 'navbar-toggler collapsed';
    togglerButton.type = 'button';
    togglerButton.setAttribute('data-toggle', 'collapse');
    togglerButton.setAttribute('data-target', '#navbarSupportedContent');
    togglerButton.setAttribute('aria-controls', 'navbarSupportedContent');
    togglerButton.setAttribute('aria-expanded', 'false');
    togglerButton.setAttribute('aria-label', 'Toggle navigation');
    const togglerSpan = document.createElement('span');
    togglerSpan.className = 'navbar-toggler-icon';
    togglerButton.append(togglerSpan);
    nav.append(togglerButton);

    const dXlNone = document.createElement('div');
    dXlNone.className = 'd-xl-none';
    dXlNone.innerHTML = '&nbsp;';
    nav.append(dXlNone);

    const logoDiv = document.createElement('div');
    logoDiv.className = 'logo image';
    const logoImage = header.querySelector('[data-aue-prop="logoImage"] img');
    if (logoImage) {
      const picture = createOptimizedPicture(logoImage.src, logoImage.alt);
      const logoLink = logoImage.closest('a');
      if (logoLink) {
        const newLogoLink = document.createElement('a');
        newLogoLink.href = logoLink.href;
        newLogoLink.target = logoLink.target;
        newLogoLink.append(picture);
        logoDiv.append(newLogoLink);
        moveInstrumentation(logoLink, newLogoLink);
      } else {
        logoDiv.append(picture);
      }
      moveInstrumentation(logoImage, picture);
    }
    nav.append(logoDiv);

    const collapseDiv = document.createElement('div');
    collapseDiv.className = 'collapse navbar-collapse justify-content-center';
    collapseDiv.id = 'navbarSupportedContent';

    const navItemDiv = document.createElement('div');
    navItemDiv.className = 'nav-item navigation';
    const navUl = document.createElement('ul');
    navUl.className = 'cmp-navigation__group';

    const navigationLinks = header.querySelectorAll('[data-aue-model="navigationLink"]');
    navigationLinks.forEach((linkNode) => {
      const li = document.createElement('li');
      li.className = 'cmp-navigation__item cmp-navigation__item--level-0';
      const link = linkNode.querySelector('a');
      if (link) {
        const newLink = document.createElement('a');
        newLink.className = 'cmp-navigation__item-link';
        newLink.href = link.href;
        newLink.textContent = link.textContent;
        li.append(newLink);
        moveInstrumentation(link, newLink);
      }
      navUl.append(li);
      moveInstrumentation(linkNode, li);
    });
    navItemDiv.append(navUl);
    collapseDiv.append(navItemDiv);

    const headerSectionDiv = document.createElement('div');
    headerSectionDiv.className = 'header-section d-flex align-items-center justify-content-end';

    const searchIconDiv = document.createElement('div');
    searchIconDiv.className = 'search-icon country-selector-trigger d-flex align-items-center';
    searchIconDiv.setAttribute('data-toggle', 'modal');
    searchIconDiv.setAttribute('data-target', '#countryModal');

    const countryCodeSpan = document.createElement('span');
    countryCodeSpan.className = 'country-code';
    countryCodeSpan.textContent = 'IN'; // Hardcoded as per sample
    searchIconDiv.append(countryCodeSpan);

    const countryFlag = header.querySelector('[data-aue-prop="countryFlagIndia"] img');
    if (countryFlag) {
      const newFlag = createOptimizedPicture(countryFlag.src, countryFlag.alt);
      newFlag.className = 'header-country-flag';
      searchIconDiv.append(newFlag);
      moveInstrumentation(countryFlag, newFlag);
    }

    const dropdownIcon = header.querySelector('[data-aue-prop="dropdownIconImage"] img');
    if (dropdownIcon) {
      const newDropdownIcon = createOptimizedPicture(dropdownIcon.src, dropdownIcon.alt);
      newDropdownIcon.className = 'dropdown-icon';
      searchIconDiv.append(newDropdownIcon);
      moveInstrumentation(dropdownIcon, newDropdownIcon);
    }
    headerSectionDiv.append(searchIconDiv);
    collapseDiv.append(headerSectionDiv);

    const itcHeaderIconList = document.createElement('div');
    itcHeaderIconList.className = 'itc-header-icon-list';

    const searchBlock = document.createElement('div');
    searchBlock.id = 'searchBlock';
    searchBlock.className = 'search-block hidden';
    searchBlock.innerHTML = `
      <div id="searchBox" class="search-box">    
          <div id="searchContainer" class="search-container hidden">
              <input type="text" id="searchInput" placeholder="Search">
              <button id="searchButton">
                  <img loading="lazy" src="/content/dam/aemigrate/uploaded-folder/image/search-icon.png" alt="Search icon">
              </button>
          </div>
          <img id="closeButton" loading="lazy" src="/content/dam/aemigrate/uploaded-folder/image/1774869339780.svg+xml" alt="Close icon">
      </div>
      <div id="searchResults" class="search-results hidden">
          <h4 class="resultList">Popular Suggestions</h4>
          <ul id="suggestionsList"></ul>
          <h4 class="resultList">Pages</h4>
          <ul id="productsList" class="products"></ul>
          <button id="viewAllButton">VIEW ALL ITEMS</button>
      </div>
    `;
    itcHeaderIconList.append(searchBlock);

    const searchLink = document.createElement('a');
    searchLink.className = 'nav-link';
    const searchIcon = header.querySelector('[data-aue-prop="searchIconImage"] img');
    if (searchIcon) {
      const newSearchIcon = createOptimizedPicture(searchIcon.src, searchIcon.alt);
      newSearchIcon.id = 'searchIcon';
      searchLink.append(newSearchIcon);
      moveInstrumentation(searchIcon, newSearchIcon);
    }
    const searchSpan = document.createElement('span');
    searchSpan.className = 'd-block';
    searchSpan.textContent = 'Search';
    searchLink.append(searchSpan);
    itcHeaderIconList.append(searchLink);

    const navItemLi = document.createElement('li');
    navItemLi.className = 'nav-item';
    const navItemLink = document.createElement('a');
    navItemLink.className = 'nav-link';
    navItemLi.append(navItemLink);
    itcHeaderIconList.append(navItemLi);

    collapseDiv.append(itcHeaderIconList);
    nav.append(collapseDiv);
    container.append(nav);
    headerEl.append(container);

    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal fade itc-country-selector show';
    modalDiv.id = 'countryModal';
    modalDiv.tabIndex = '-1';
    modalDiv.role = 'dialog';
    modalDiv.setAttribute('aria-labelledby', 'countryModalLabel');
    modalDiv.setAttribute('aria-modal', 'true');
    modalDiv.style.display = 'block';

    const modalDialog = document.createElement('div');
    modalDialog.className = 'modal-dialog modal-dialog-centered';
    modalDialog.role = 'document';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header border-0 text-center';
    const modalHeaderW100 = document.createElement('div');
    modalHeaderW100.className = 'w-100';

    const modalTitle = document.createElement('h2');
    modalTitle.className = 'modal-title';
    const authoredModalTitle = header.querySelector('[data-aue-prop="modalTitle"]');
    if (authoredModalTitle) {
      modalTitle.innerHTML = authoredModalTitle.innerHTML;
      moveInstrumentation(authoredModalTitle, modalTitle);
    }
    modalHeaderW100.append(modalTitle);

    const modalExperienceText = document.createElement('p');
    modalExperienceText.className = 'experience-text';
    const authoredModalExperienceText = header.querySelector('[data-aue-prop="modalExperienceText"]');
    if (authoredModalExperienceText) {
      modalExperienceText.textContent = authoredModalExperienceText.textContent;
      moveInstrumentation(authoredModalExperienceText, modalExperienceText);
    }
    modalHeaderW100.append(modalExperienceText);
    modalHeader.append(modalHeaderW100);
    modalContent.append(modalHeader);

    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    const countryOptions = document.createElement('div');
    countryOptions.className = 'country-options d-flex justify-content-center align-items-center';

    const indiaOption = document.createElement('div');
    indiaOption.className = 'country-option selected mx-3 d-flex flex-column align-items-center';
    indiaOption.setAttribute('data-country', 'india');
    indiaOption.setAttribute('data-url', '/india');
    const indiaFlag = header.querySelector('[data-aue-prop="countryFlagIndia"] img');
    if (indiaFlag) {
      const newIndiaFlag = createOptimizedPicture(indiaFlag.src, indiaFlag.alt);
      newIndiaFlag.className = 'country-flag india-flag';
      indiaOption.append(newIndiaFlag);
      moveInstrumentation(indiaFlag, newIndiaFlag);
    }
    const indiaName = document.createElement('p');
    indiaName.className = 'country-name';
    const authoredIndiaName = header.querySelector('[data-aue-prop="countryIndiaName"]');
    if (authoredIndiaName) {
      indiaName.textContent = authoredIndiaName.textContent;
      moveInstrumentation(authoredIndiaName, indiaName);
    }
    indiaOption.append(indiaName);
    countryOptions.append(indiaOption);

    const usaOption = document.createElement('div');
    usaOption.className = 'country-option mx-3 d-flex flex-column align-items-center';
    usaOption.setAttribute('data-country', 'usa');
    usaOption.setAttribute('data-url', '/usa');
    const usaFlag = header.querySelector('[data-aue-prop="countryFlagUsa"] img');
    if (usaFlag) {
      const newUsaFlag = createOptimizedPicture(usaFlag.src, usaFlag.alt);
      newUsaFlag.className = 'country-flag usa-flag';
      usaOption.append(newUsaFlag);
      moveInstrumentation(usaFlag, newUsaFlag);
    }
    const usaName = document.createElement('p');
    usaName.className = 'country-name';
    const authoredUsaName = header.querySelector('[data-aue-prop="countryUsaName"]');
    if (authoredUsaName) {
      usaName.textContent = authoredUsaName.textContent;
      moveInstrumentation(authoredUsaName, usaName);
    }
    usaOption.append(usaName);
    countryOptions.append(usaOption);

    modalBody.append(countryOptions);
    modalContent.append(modalBody);
    modalDialog.append(modalContent);
    modalDiv.append(modalDialog);

    headerEl.append(modalDiv);
    block.append(headerEl);
    moveInstrumentation(header, headerEl);
  }

  if (footer) {
    const footerEl = document.createElement('footer');
    footerEl.className = 'itc-footer-section';

    const container = document.createElement('div');
    container.className = 'container';

    const row = document.createElement('div');
    row.className = 'row';

    const colLg6 = document.createElement('div');
    colLg6.className = 'col-lg-6 col-sm-12 d-flex d-lg-block justify-content-center';

    const footerLogos = document.createElement('div');
    footerLogos.className = 'footer-logos';

    const footerItcLogo = document.createElement('div');
    footerItcLogo.className = 'footer-itc-logo';
    const itcLogoDiv = document.createElement('div');
    itcLogoDiv.className = 'logo image';
    const itcLogoImage = footer.querySelector('[data-aue-prop="secondaryLogoImage"] img');
    if (itcLogoImage) {
      const picture = createOptimizedPicture(itcLogoImage.src, itcLogoImage.alt);
      const logoLink = itcLogoImage.closest('a');
      if (logoLink) {
        const newLogoLink = document.createElement('a');
        newLogoLink.href = logoLink.href;
        newLogoLink.target = logoLink.target;
        newLogoLink.append(picture);
        itcLogoDiv.append(newLogoLink);
        moveInstrumentation(logoLink, newLogoLink);
      } else {
        itcLogoDiv.append(picture);
      }
      moveInstrumentation(itcLogoImage, picture);
    }
    footerItcLogo.append(itcLogoDiv);
    footerLogos.append(footerItcLogo);

    const footerFssaiLogo = document.createElement('div');
    footerFssaiLogo.className = 'footer-fssai-logo';
    const fssaiLogoDiv = document.createElement('div');
    fssaiLogoDiv.className = 'fssailogo logo image';
    const fssaiLogoImage = footer.querySelector('[data-aue-prop="fssaiLogoImage"] img');
    if (fssaiLogoImage) {
      const picture = createOptimizedPicture(fssaiLogoImage.src, fssaiLogoImage.alt);
      const logoLink = fssaiLogoImage.closest('a');
      if (logoLink) {
        const newLogoLink = document.createElement('a');
        newLogoLink.href = logoLink.href;
        newLogoLink.target = logoLink.target;
        newLogoLink.append(picture);
        fssaiLogoDiv.append(newLogoLink);
        moveInstrumentation(logoLink, newLogoLink);
      } else {
        fssaiLogoDiv.append(picture);
      }
      moveInstrumentation(fssaiLogoImage, picture);
    }
    footerFssaiLogo.append(fssaiLogoDiv);
    footerLogos.append(footerFssaiLogo);
    colLg6.append(footerLogos);
    row.append(colLg6);

    const colLg3 = document.createElement('div');
    colLg3.className = 'col-lg-3 col-sm-12 d-flex justify-content-xl-between footer-page-links-wrapper pt-md-0 pt-4 px-1';
    // No direct content for list-1 and list-2 in the provided HTML, so they are empty
    const list1 = document.createElement('div');
    list1.className = 'list-1 list';
    const list2 = document.createElement('div');
    list2.className = 'list-2 list';
    colLg3.append(list1, list2);
    row.append(colLg3);

    const colLg6Left = document.createElement('div');
    colLg6Left.className = 'col-lg-6 col-sm-12 itc-footer-link-left';

    const footerListsContainer = document.createElement('div');
    footerListsContainer.className = 'footer-lists-container d-flex';

    const list4 = document.createElement('div');
    list4.className = 'list-4 list';
    const ul4 = document.createElement('ul');
    const footerLinks = footer.querySelectorAll('[data-aue-model="footerLink"]');
    footerLinks.forEach((linkNode) => {
      const li = document.createElement('li');
      const link = linkNode.querySelector('a');
      if (link) {
        const newLink = document.createElement('a');
        newLink.href = link.href;
        newLink.target = link.target;
        newLink.textContent = link.textContent;
        const srOnly = document.createElement('span');
        srOnly.className = 'cmp-link__screen-reader-only';
        srOnly.textContent = 'opens in a new tab';
        newLink.append(srOnly);
        li.append(newLink);
        moveInstrumentation(link, newLink);
      }
      ul4.append(li);
      moveInstrumentation(linkNode, li);
    });
    list4.append(ul4);
    footerListsContainer.append(list4);

    const list3 = document.createElement('div');
    list3.className = 'list-3 list';
    const ul3 = document.createElement('ul');
    ul3.id = 'list-499c6a3139';
    ul3.className = 'cmp-list';
    // Re-using navigationLinks as per sample HTML structure for this list
    navigationLinks.forEach((linkNode) => {
      const li = document.createElement('li');
      li.className = 'cmp-list__item';
      const link = linkNode.querySelector('a');
      if (link) {
        const newLink = document.createElement('a');
        newLink.className = 'cmp-list__item-link';
        newLink.href = link.href;
        const span = document.createElement('span');
        span.className = 'cmp-list__item-title';
        span.textContent = link.textContent;
        newLink.append(span);
        li.append(newLink);
        moveInstrumentation(link, newLink);
      }
      ul3.append(li);
      // No moveInstrumentation for linkNode here as it's already moved for header nav
    });
    list3.append(ul3);
    footerListsContainer.append(list3);
    colLg6Left.append(footerListsContainer);

    const contactDetails = document.createElement('div');
    contactDetails.className = 'contact-details';

    const grievanceTitle = document.createElement('h5');
    grievanceTitle.className = 'contact-details__title mb-md-3 mb-0';
    const authoredGrievanceTitle = footer.querySelector('[data-aue-prop="grievanceOfficerTitle"]');
    if (authoredGrievanceTitle) {
      grievanceTitle.innerHTML = authoredGrievanceTitle.innerHTML;
      moveInstrumentation(authoredGrievanceTitle, grievanceTitle);
    }
    contactDetails.append(grievanceTitle);

    const grievanceName = document.createElement('p');
    grievanceName.className = 'contact-details__description mb-md-1 mb-0';
    const authoredGrievanceName = footer.querySelector('[data-aue-prop="grievanceOfficerName"]');
    if (authoredGrievanceName) {
      grievanceName.textContent = `Name: ${authoredGrievanceName.textContent}`;
      moveInstrumentation(authoredGrievanceName, grievanceName);
    }
    contactDetails.append(grievanceName);

    const grievanceContact = document.createElement('p');
    grievanceContact.className = 'contact-details__description mb-md-1 mb-0';
    const authoredGrievanceContact = footer.querySelector('[data-aue-prop="grievanceOfficerContact"]');
    if (authoredGrievanceContact) {
      grievanceContact.textContent = `Contact Info: ${authoredGrievanceContact.textContent}`;
      moveInstrumentation(authoredGrievanceContact, grievanceContact);
    }
    contactDetails.append(grievanceContact);

    const grievanceTimings = document.createElement('p');
    grievanceTimings.className = 'contact-details__description mb-0';
    const authoredGrievanceTimings = footer.querySelector('[data-aue-prop="grievanceOfficerTimings"]');
    if (authoredGrievanceTimings) {
      grievanceTimings.textContent = authoredGrievanceTimings.textContent;
      moveInstrumentation(authoredGrievanceTimings, grievanceTimings);
    }
    contactDetails.append(grievanceTimings);
    colLg6Left.append(contactDetails);
    row.append(colLg6Left);

    const colLg6Right = document.createElement('div');
    colLg6Right.className = 'col-lg-6 col-sm-12 align-items-md-end d-flex flex-column itc-footer-link-right';

    const socialDiv = document.createElement('div');
    const socialLinks = footer.querySelectorAll('[data-aue-model="socialLink"]');
    socialLinks.forEach((socialNode) => {
      const ul = document.createElement('ul');
      ul.className = 'list-unstyled';
      const li = document.createElement('li');
      const link = socialNode.querySelector('a');
      const icon = socialNode.querySelector('img');
      if (link && icon) {
        const newLink = document.createElement('a');
        newLink.id = 'socialIcons';
        newLink.href = link.href;
        newLink.target = link.target;
        const newIcon = createOptimizedPicture(icon.src, icon.alt);
        newLink.append(newIcon);
        const srOnly = document.createElement('span');
        srOnly.className = 'cmp-link__screen-reader-only';
        srOnly.textContent = 'opens in a new tab';
        newLink.append(srOnly);
        li.append(newLink);
        moveInstrumentation(link, newLink);
        moveInstrumentation(icon, newIcon);
      }
      ul.append(li);
      socialDiv.append(ul);
      moveInstrumentation(socialNode, li);
    });
    colLg6Right.append(socialDiv);

    const copyrightSpan = document.createElement('span');
    copyrightSpan.className = 'footer-link';
    const authoredCopyright = footer.querySelector('[data-aue-prop="footerCopyright"]');
    if (authoredCopyright) {
      copyrightSpan.innerHTML = authoredCopyright.innerHTML;
      moveInstrumentation(authoredCopyright, copyrightSpan);
    }
    colLg6Right.append(copyrightSpan);
    row.append(colLg6Right);

    container.append(row);
    footerEl.append(container);
    block.append(footerEl);
    moveInstrumentation(footer, footerEl);

    const secondaryFooter = document.createElement('footer');
    secondaryFooter.className = 'itc-footer-section itc-footer-secondary';
    const secondaryUl = document.createElement('ul');
    secondaryUl.className = 'itc-footer-secondary-container';
    // The sample HTML has empty secondary footer links, so we create empty ones
    for (let i = 0; i < 2; i += 1) {
      const li = document.createElement('li');
      li.className = 'itc-footer-secondary-lists';
      const link = document.createElement('a');
      link.className = 'footer-links';
      link.target = '_blank';
      const srOnly = document.createElement('span');
      srOnly.className = 'cmp-link__screen-reader-only';
      srOnly.textContent = 'opens in a new tab';
      link.append(srOnly);
      li.append(link);
      secondaryUl.append(li);
    }
    secondaryFooter.append(secondaryUl);
    block.append(secondaryFooter);
  }

  block.textContent = '';
  // Header and Footer are already appended to block
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
