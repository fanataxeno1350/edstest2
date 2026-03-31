import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    itcLogoRow,
    fssaiLogoRow,
    footerLinksContainerRow, // This row is a placeholder for the container, its children are the actual items
    socialLinksContainerRow, // This row is a placeholder for the container, its children are the actual items
    secondaryFooterLinksContainerRow, // This row is a placeholder for the container, its children are the actual items
    grievanceOfficerTitleRow,
    grievanceOfficerNameRow,
    grievanceOfficerContactRow,
    grievanceOfficerHoursRow,
    copyrightRow,
  ] = [...block.children];

  // Main container setup
  const container = document.createElement('div');
  container.classList.add('container');
  const row = document.createElement('div');
  row.classList.add('row');

  // Left column for logos
  const logoCol = document.createElement('div');
  logoCol.classList.add('col-lg-6', 'col-sm-12', 'd-flex', 'd-lg-block', 'justify-content-center');

  const footerLogos = document.createElement('div');
  footerLogos.classList.add('footer-logos');

  // ITC Logo
  const footerItcLogo = document.createElement('div');
  footerItcLogo.classList.add('footer-itc-logo');
  const itcLogoDiv = document.createElement('div');
  itcLogoDiv.classList.add('logo', 'image');
  const itcLink = document.createElement('a');
  itcLink.classList.add('cmp-image__link');
  const itcPicture = itcLogoRow.querySelector('picture');
  if (itcPicture) {
    const itcImg = itcPicture.querySelector('img');
    if (itcImg) {
      itcLink.href = itcImg.closest('a')?.href || '#'; // Assuming link might be present in original HTML
      itcLink.append(itcPicture);
    }
  }
  itcLogoDiv.append(itcLink);
  footerItcLogo.append(itcLogoDiv);
  footerLogos.append(footerItcLogo);
  moveInstrumentation(itcLogoRow, footerItcLogo);

  // FSSAI Logo
  const footerFssaiLogo = document.createElement('div');
  footerFssaiLogo.classList.add('footer-fssai-logo');
  const fssaiLogoDiv = document.createElement('div');
  fssaiLogoDiv.classList.add('fssailogo', 'logo', 'image');
  const fssaiPicture = fssaiLogoRow.querySelector('picture');
  if (fssaiPicture) {
    // FSSAI logo in original HTML doesn't have an explicit <a> tag around the img, so no link needed.
    fssaiLogoDiv.append(fssaiPicture);
  }
  footerFssaiLogo.append(fssaiLogoDiv);
  footerLogos.append(footerFssaiLogo);
  moveInstrumentation(fssaiLogoRow, footerFssaiLogo);

  logoCol.append(footerLogos);
  row.append(logoCol);

  // Footer links section
  const footerLinksCol = document.createElement('div');
  footerLinksCol.classList.add('col-lg-6', 'col-sm-12', 'itc-footer-link-left');

  const footerListsContainer = document.createElement('div');
  footerListsContainer.classList.add('footer-lists-container', 'd-flex');

  const footerLinksList = document.createElement('div');
  footerLinksList.classList.add('list-4', 'list');
  const footerLinksUl = document.createElement('ul');

  const socialLinksListContainer = document.createElement('div');
  socialLinksListContainer.classList.add('col-lg-6', 'col-sm-12', 'align-items-md-end', 'd-flex', 'flex-column', 'itc-footer-link-right');
  const socialLinksWrapper = document.createElement('div'); // This div will contain the ul for social links

  const secondaryFooterLinksListContainer = document.createElement('footer');
  secondaryFooterLinksListContainer.classList.add('itc-footer-section', 'itc-footer-secondary');
  const secondaryFooterLinksUl = document.createElement('ul');
  secondaryFooterLinksUl.classList.add('itc-footer-secondary-container');

  // Process item rows from the respective container rows
  // Footer Links
  [...footerLinksContainerRow.children].forEach((rowEl) => {
    const cells = [...rowEl.children];
    if (cells.length === 2) { // Footer Link
      const linkCell = cells[0];
      const textCell = cells[1];

      const li = document.createElement('li');
      const link = document.createElement('a');
      moveInstrumentation(linkCell, link);
      link.target = '_blank';
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.textContent = foundLink.textContent; // Use the text from the <a> tag
      } else {
        link.textContent = textCell.textContent;
      }
      const screenReaderSpan = document.createElement('span');
      screenReaderSpan.classList.add('cmp-link__screen-reader-only');
      screenReaderSpan.textContent = 'opens in a new tab';
      link.append(screenReaderSpan);
      li.append(link);
      footerLinksUl.append(li);
      moveInstrumentation(rowEl, li);
    }
  });

  // Social Links
  [...socialLinksContainerRow.children].forEach((rowEl) => {
    const cells = [...rowEl.children];
    if (cells.length === 2) { // Social Link
      const linkCell = cells[0];
      const iconCell = cells[1]; // Icon is in the second cell for social links

      const li = document.createElement('li');
      li.classList.add('list-unstyled'); // From original HTML
      const link = document.createElement('a');
      moveInstrumentation(linkCell, link);
      link.id = 'socialIcons'; // From original HTML
      link.target = '_blank';
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      }
      const picture = iconCell.querySelector('picture'); // Get picture from iconCell
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          link.append(optimizedPic);
        }
      }
      const screenReaderSpan = document.createElement('span');
      screenReaderSpan.classList.add('cmp-link__screen-reader-only');
      screenReaderSpan.textContent = 'opens in a new tab';
      link.append(screenReaderSpan);
      li.append(link);
      socialLinksWrapper.append(li); // Append to the wrapper
      moveInstrumentation(rowEl, li);
    }
  });

  // Secondary Footer Links
  [...secondaryFooterLinksContainerRow.children].forEach((rowEl) => {
    const cells = [...rowEl.children];
    if (cells.length === 1) { // Secondary Footer Link
      const li = document.createElement('li');
      li.classList.add('itc-footer-secondary-lists');
      const link = document.createElement('a');
      link.classList.add('footer-links');
      moveInstrumentation(cells[0], link);
      link.target = '_blank';
      const foundLink = cells[0].querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.textContent = foundLink.textContent; // Use the text from the <a> tag
      }
      const screenReaderSpan = document.createElement('span');
      screenReaderSpan.classList.add('cmp-link__screen-reader-only');
      screenReaderSpan.textContent = 'opens in a new tab';
      link.append(screenReaderSpan);
      li.append(link);
      secondaryFooterLinksUl.append(li);
      moveInstrumentation(rowEl, li);
    }
  });

  footerLinksList.append(footerLinksUl);
  footerListsContainer.append(footerLinksList);

  // Grievance Officer Details
  const contactDetails = document.createElement('div');
  contactDetails.classList.add('contact-details');

  const grievanceTitle = document.createElement('h5');
  grievanceTitle.classList.add('contact-details__title', 'mb-md-3', 'mb-0');
  moveInstrumentation(grievanceOfficerTitleRow, grievanceTitle);
  grievanceTitle.textContent = grievanceOfficerTitleRow.textContent.trim();
  contactDetails.append(grievanceTitle);

  const grievanceName = document.createElement('p');
  grievanceName.classList.add('contact-details__description', 'mb-md-1', 'mb-0');
  moveInstrumentation(grievanceOfficerNameRow, grievanceName);
  grievanceName.textContent = grievanceOfficerNameRow.textContent.trim();
  contactDetails.append(grievanceName);

  const grievanceContact = document.createElement('p');
  grievanceContact.classList.add('contact-details__description', 'mb-md-1', 'mb-0');
  moveInstrumentation(grievanceOfficerContactRow, grievanceContact);
  grievanceContact.textContent = grievanceOfficerContactRow.textContent.trim();
  contactDetails.append(grievanceContact);

  const grievanceHours = document.createElement('p');
  grievanceHours.classList.add('contact-details__description', 'mb-0');
  moveInstrumentation(grievanceOfficerHoursRow, grievanceHours);
  grievanceHours.textContent = grievanceOfficerHoursRow.textContent.trim();
  contactDetails.append(grievanceHours);

  footerLinksCol.append(footerListsContainer, contactDetails);
  row.append(footerLinksCol);

  // Social links and copyright
  socialLinksListContainer.append(socialLinksWrapper);

  const copyrightSpan = document.createElement('span');
  copyrightSpan.classList.add('footer-link');
  moveInstrumentation(copyrightRow, copyrightSpan);
  copyrightSpan.textContent = copyrightRow.textContent.trim();
  socialLinksListContainer.append(copyrightSpan);
  row.append(socialLinksListContainer);

  container.append(row);
  block.textContent = '';
  block.append(container);

  // Secondary footer section
  secondaryFooterLinksListContainer.append(secondaryFooterLinksUl);
  block.parentNode.append(secondaryFooterLinksListContainer); // Append to parent of block, as it's a separate footer

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
