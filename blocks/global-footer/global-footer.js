import { createOptimizedPicture } from '../../scripts/aem.js';
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
      subWrap.classList.add('has-sub-child'); // use ORIGINAL HTML class
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

  const section = document.createElement('section');
  section.classList.add('component-global-footer', 'notranslate');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const mainRow = document.createElement('div');
  mainRow.classList.add('row');
  container.append(mainRow);

  // Fixed fields - 9 fixed fields
  const [
    footerLogoRow,
    footerAddressLinkRow,
    footerPhoneRow,
    footerLegalRow,
    welcomeTitleRow,
    welcomeLinkRow,
    welcomeDescriptionRow,
    cookieMessageRow,
    acceptCookieLabelRow,
    ...itemRows
  ] = children;

  // Item row content detection
  const socialLinkRows = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3
      && cells[0].textContent.trim() !== ''
      && cells[1].querySelector('a')
      && cells[2].querySelector('ul'); // hierarchy-tree is a richtext with ul
  });

  const navigationSectionRows = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2
      && cells[0].textContent.trim() !== ''
      && cells[1].textContent.trim() === 'Links value'; // As per BlockJson and EDS structure
  });

  const navigationLinkRows = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2
      && cells[0].textContent.trim() !== ''
      && cells[1].querySelector('a')
      && !navigationSectionRows.includes(row); // Exclude rows already identified as navigation sections
  });

  const beRelatedLinkRows = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2
      && cells[0].textContent.trim() !== ''
      && cells[1].querySelector('a')
      && !navigationLinkRows.includes(row)
      && !navigationSectionRows.includes(row)
      && !socialLinkRows.includes(row); // Exclude rows already identified
  });

  // --- Mobile Social Links ---
  const mobileSocialCol = document.createElement('div');
  mobileSocialCol.classList.add('col-12');
  mainRow.append(mobileSocialCol);

  const mobileSocialDiv = document.createElement('div');
  mobileSocialDiv.classList.add('footer-social', 'mobile');
  mobileSocialCol.append(mobileSocialDiv);

  socialLinkRows.forEach((row) => {
    const cells = [...row.children];
    const platformCell = cells.find(c => c.textContent.trim() !== '' && !c.querySelector('a') && !c.querySelector('ul'));
    const linkCell = cells.find(c => c.querySelector('a'));
    const hierarchyTreeCell = cells.find(c => c.querySelector('ul'));

    const platform = platformCell?.textContent.trim().toLowerCase();
    const foundLink = linkCell?.querySelector('a');

    if (foundLink && platform) {
      const socialLink = document.createElement('a');
      socialLink.href = foundLink.href;
      socialLink.classList.add(platform);
      socialLink.target = '_blank';
      socialLink.setAttribute('aria-label', `${platform} - open in a new tab`);
      const icon = document.createElement('i');
      icon.classList.add('fa', `fa-${platform}`);
      icon.setAttribute('aria-hidden', 'true');
      socialLink.append(icon);
      moveInstrumentation(row, socialLink);
      mobileSocialDiv.append(socialLink);
    }

    // Handle hierarchy-tree for mobile social links if needed, though typically not displayed here
    if (hierarchyTreeCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      const rootUl = tempDiv.querySelector('ul');
      if (rootUl) {
        rootUl.classList.add('nav-menu', 'list-unstyled'); // Example classes from original HTML
        rootUl.querySelectorAll('li').forEach(li => li.classList.add('nav-menu-item', 'list-item'));
        rootUl.querySelectorAll('a').forEach(a => a.classList.add('nav-link'));
        transformNestedLists(rootUl);
        // If this hierarchy needs to be rendered, append it to a suitable container
        // For now, assuming it's not rendered in the mobile social section
        // mobileSocialDiv.append(tempDiv);
        moveInstrumentation(hierarchyTreeCell, tempDiv);
      }
    }
  });

  // --- Navigation Sections ---
  navigationSectionRows.forEach((row, index) => {
    const cells = [...row.children];
    const sectionTitleCell = cells.find(c => c.textContent.trim() !== '' && !c.querySelector('a'));

    const col = document.createElement('div');
    col.classList.add('col-lg-2');
    if (index === 0) {
      col.classList.add('offset-lg-1');
    }
    mainRow.append(col);

    const headSpan = document.createElement('span');
    headSpan.classList.add('head');
    headSpan.textContent = sectionTitleCell?.textContent.trim() || '';
    const openIcon = document.createElement('div');
    openIcon.classList.add('open-icon');
    headSpan.append(openIcon);
    col.append(headSpan);

    const navList = document.createElement('ul');
    col.append(navList);

    // Find links associated with this section
    const startIndex = children.indexOf(row) + 1;
    let endIndex = startIndex;
    while (endIndex < children.length) {
      const currentRow = children[endIndex];
      const currentCells = [...currentRow.children];
      // Check if it's a navigation link row and not another section or social link
      if (currentCells.length === 2 && currentCells[0].textContent.trim() !== '' && currentCells[1].querySelector('a') && !navigationSectionRows.includes(currentRow) && !socialLinkRows.includes(currentRow) && !beRelatedLinkRows.includes(currentRow)) {
        endIndex++;
      } else {
        break;
      }
    }
    const currentSectionLinks = children.slice(startIndex, endIndex).filter(r => navigationLinkRows.includes(r));

    currentSectionLinks.forEach((linkRow) => {
      const cells = [...linkRow.children];
      const labelCell = cells.find(c => c.textContent.trim() !== '' && !c.querySelector('a'));
      const linkCell = cells.find(c => c.querySelector('a'));

      const li = document.createElement('li');
      li.classList.add('footer-menu-track');
      const anchor = document.createElement('a');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) anchor.href = foundLink.href;
      anchor.textContent = labelCell?.textContent.trim() || '';
      moveInstrumentation(linkRow, anchor);
      li.append(anchor);
      navList.append(li);
    });

    headSpan.addEventListener('click', () => {
      headSpan.classList.toggle('active');
      navList.classList.toggle('active');
    });
  });

  // --- Desktop Social Links and Footer Info ---
  const desktopInfoCol = document.createElement('div');
  desktopInfoCol.classList.add('col-lg-3', 'offset-lg-1');
  mainRow.append(desktopInfoCol);

  const desktopSocialDiv = document.createElement('div');
  desktopSocialDiv.classList.add('footer-social', 'desktop');
  desktopInfoCol.append(desktopSocialDiv);

  socialLinkRows.forEach((row) => {
    const cells = [...row.children];
    const platformCell = cells.find(c => c.textContent.trim() !== '' && !c.querySelector('a') && !c.querySelector('ul'));
    const linkCell = cells.find(c => c.querySelector('a'));
    const hierarchyTreeCell = cells.find(c => c.querySelector('ul'));

    const platform = platformCell?.textContent.trim().toLowerCase();
    const foundLink = linkCell?.querySelector('a');

    if (foundLink && platform) {
      const socialLink = document.createElement('a');
      socialLink.href = foundLink.href;
      socialLink.classList.add(platform);
      socialLink.target = '_blank';
      socialLink.setAttribute('aria-label', `${platform} - open in a new tab`);
      const icon = document.createElement('i');
      icon.classList.add('fa', `fa-${platform}`);
      icon.setAttribute('aria-hidden', 'true');
      socialLink.append(icon);
      moveInstrumentation(row, socialLink);
      desktopSocialDiv.append(socialLink);
    }

    // Handle hierarchy-tree for desktop social links if needed, though typically not displayed here
    if (hierarchyTreeCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      const rootUl = tempDiv.querySelector('ul');
      if (rootUl) {
        rootUl.classList.add('nav-menu', 'list-unstyled'); // Example classes from original HTML
        rootUl.querySelectorAll('li').forEach(li => li.classList.add('nav-menu-item', 'list-item'));
        rootUl.querySelectorAll('a').forEach(a => a.classList.add('nav-link'));
        transformNestedLists(rootUl);
        // If this hierarchy needs to be rendered, append it to a suitable container
        // For now, assuming it's not rendered in the desktop social section
        // desktopSocialDiv.append(tempDiv);
        moveInstrumentation(hierarchyTreeCell, tempDiv);
      }
    }
  });

  const footerInfoDiv = document.createElement('div');
  footerInfoDiv.classList.add('footer-info');
  desktopInfoCol.append(footerInfoDiv);

  const headlineDiv = document.createElement('div');
  headlineDiv.classList.add('headline');
  const footerLogoPicture = footerLogoRow.querySelector('picture');
  if (footerLogoPicture) {
    const img = footerLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    headlineDiv.append(optimizedPic);
    moveInstrumentation(footerLogoRow, headlineDiv);
  }
  footerInfoDiv.append(headlineDiv);

  const addressDiv = document.createElement('div');
  addressDiv.classList.add('address');
  footerInfoDiv.append(addressDiv);

  const addressLink = document.createElement('a');
  const foundAddressLink = footerAddressLinkRow.querySelector('a');
  if (foundAddressLink) {
    addressLink.href = foundAddressLink.href;
    addressLink.target = '_blank';
    addressLink.setAttribute('aria-label', 'Address - open in a new tab');
    // The original HTML has hardcoded address text, but the model provides a link.
    // We should ideally get the address text from a separate field if available,
    // or infer it from the link's text if it's not just a path.
    // For now, using the original HTML's structure as a guide.
    addressLink.innerHTML = footerAddressLinkRow.innerHTML; // Use innerHTML to preserve any <p> tags
    moveInstrumentation(footerAddressLinkRow, addressLink);
  }
  addressDiv.append(addressLink);

  const phoneLink = document.createElement('a');
  const phoneText = footerPhoneRow.textContent.trim();
  if (phoneText) {
    phoneLink.href = `tel:${phoneText.replace(/\s/g, '')}`;
    phoneLink.innerHTML = `<p>${phoneText}</p>`;
    moveInstrumentation(footerPhoneRow, phoneLink);
  }
  addressDiv.append(phoneLink);

  // --- Also of Interest Links ---
  const beIxLinkBlock = document.createElement('div');
  beIxLinkBlock.classList.add('be-ix-link-block');
  container.append(beIxLinkBlock);

  const beRelatedLinkContainer = document.createElement('div');
  beRelatedLinkContainer.classList.add('be-related-link-container');
  beIxLinkBlock.append(beRelatedLinkContainer);

  const beLabel = document.createElement('div');
  beLabel.classList.add('be-label');
  beLabel.textContent = 'Also of Interest';
  beRelatedLinkContainer.append(beLabel);

  const beList = document.createElement('ul');
  beList.classList.add('be-list');
  beRelatedLinkContainer.append(beList);

  beRelatedLinkRows.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(c => c.textContent.trim() !== '' && !c.querySelector('a'));
    const linkCell = cells.find(c => c.querySelector('a'));

    const li = document.createElement('li');
    li.classList.add('be-list-item');
    const anchor = document.createElement('a');
    anchor.classList.add('be-related-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, anchor);
    li.append(anchor);
    beList.append(li);
  });

  // --- Footer Legal Section ---
  const footerLegalSectionRow = document.createElement('div');
  footerLegalSectionRow.classList.add('row', 'footer-legal-section');
  container.append(footerLegalSectionRow);

  const footerLegalCol = document.createElement('div');
  footerLegalCol.classList.add('col-xs-11', 'offset-lg-1');
  footerLegalSectionRow.append(footerLegalCol);

  const legalP = document.createElement('p');
  legalP.classList.add('legal');
  legalP.innerHTML = footerLegalRow.innerHTML;
  moveInstrumentation(footerLegalRow, legalP);
  footerLegalCol.append(legalP);

  // --- First Time Banner (Welcome and Cookie Message) ---
  const firstTimeBanner = document.createElement('div');
  firstTimeBanner.classList.add('first-time-banner');
  firstTimeBanner.style.display = 'block'; // Initial state based on original HTML
  section.append(firstTimeBanner);

  const bannerContainer = document.createElement('div');
  bannerContainer.classList.add('container');
  firstTimeBanner.append(bannerContainer);

  const welcomeDiv = document.createElement('div');
  welcomeDiv.classList.add('welcome');
  bannerContainer.append(welcomeDiv);

  const welcomeTitle = document.createElement('h4');
  welcomeTitle.textContent = welcomeTitleRow.textContent.trim();
  moveInstrumentation(welcomeTitleRow, welcomeTitle);
  welcomeDiv.append(welcomeTitle);

  const promoBody = document.createElement('div');
  promoBody.classList.add('promo-body');
  const welcomeLink = document.createElement('a');
  const foundWelcomeLink = welcomeLinkRow.querySelector('a');
  if (foundWelcomeLink) {
    welcomeLink.href = foundWelcomeLink.href;
    // The original HTML has hardcoded "Learn more", but the model has a description field.
    // Using the original HTML's label for consistency with the example.
    welcomeLink.textContent = 'Learn more';
    welcomeLink.setAttribute('aria-label', welcomeDescriptionRow.textContent.trim());
    moveInstrumentation(welcomeLinkRow, welcomeLink);
  }
  promoBody.append(welcomeLink);
  const welcomeDescriptionText = welcomeDescriptionRow.innerHTML; // Use innerHTML for richtext
  promoBody.append(document.createTextNode(' ')); // Add space between link and text
  // Append the content of welcomeDescriptionText as HTML, not plain text
  const tempDescDiv = document.createElement('div');
  tempDescDiv.innerHTML = welcomeDescriptionText;
  while (tempDescDiv.firstChild) {
    promoBody.append(tempDescDiv.firstChild);
  }
  moveInstrumentation(welcomeDescriptionRow, promoBody);
  welcomeDiv.append(promoBody);

  const gdprMessage = document.createElement('div');
  gdprMessage.classList.add('gdpr-message');
  bannerContainer.append(gdprMessage);

  const gdprRow = document.createElement('div');
  gdprRow.classList.add('row');
  gdprMessage.append(gdprRow);

  const cookieBodyCol = document.createElement('div');
  cookieBodyCol.classList.add('col-md-6');
  gdprRow.append(cookieBodyCol);

  const cookieBodyDiv = document.createElement('div');
  cookieBodyDiv.classList.add('cookie-body');
  cookieBodyDiv.innerHTML = cookieMessageRow.innerHTML;
  moveInstrumentation(cookieMessageRow, cookieBodyDiv);
  cookieBodyCol.append(cookieBodyDiv);

  const ctaCol = document.createElement('div');
  ctaCol.classList.add('col-md-6');
  gdprRow.append(ctaCol);

  const ctaDiv = document.createElement('div');
  ctaDiv.classList.add('cta');
  ctaCol.append(ctaDiv);

  const acceptCookieBtn = document.createElement('a');
  acceptCookieBtn.classList.add('btn', 'bg-white', 'accept-cookie');
  acceptCookieBtn.setAttribute('tabindex', '0');
  acceptCookieBtn.textContent = acceptCookieLabelRow.textContent.trim();
  moveInstrumentation(acceptCookieLabelRow, acceptCookieBtn);
  ctaDiv.append(acceptCookieBtn);

  acceptCookieBtn.addEventListener('click', () => {
    firstTimeBanner.style.display = 'none';
  });

  block.replaceWith(section);
}
