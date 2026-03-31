import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const logoImageRow = children[0];
  const fssaiLogoImageRow = children[1];
  // block.children[2] and block.children[3] are containers for item types, not direct content rows
  // The actual item rows start from children[9] based on the EDS structure and BlockJson.
  const grievanceOfficerTitleRow = children[4];
  const grievanceOfficerNameRow = children[5];
  const grievanceOfficerContactRow = children[6];
  const grievanceOfficerHoursRow = children[7];
  const copyrightRow = children[8];

  const itemRows = children.slice(9); // Item rows start from index 9

  // Content detection to distinguish footer-link and footer-social items
  // footer-link: has an <a> in the first cell and text in the second
  // footer-social: has an <a> in the first cell and a <picture> in the second
  const footerLinks = itemRows.filter((row) => row.children[0]?.querySelector('a') && !row.children[1]?.querySelector('picture'));
  const footerSocials = itemRows.filter((row) => row.children[0]?.querySelector('a') && row.children[1]?.querySelector('picture'));

  const container = document.createElement('div');
  container.classList.add('container');

  const row = document.createElement('div');
  row.classList.add('row');

  // Left column for logos and grievance officer
  const leftCol = document.createElement('div');
  leftCol.classList.add('col-lg-6', 'col-sm-12', 'd-flex', 'd-lg-block', 'justify-content-center');

  const footerLogos = document.createElement('div');
  footerLogos.classList.add('footer-logos');

  const footerItcLogo = document.createElement('div');
  footerItcLogo.classList.add('footer-itc-logo');
  const itcLogoDiv = document.createElement('div');
  itcLogoDiv.classList.add('logo', 'image');
  moveInstrumentation(logoImageRow.firstElementChild, itcLogoDiv);
  while (logoImageRow.firstElementChild.firstChild) {
    itcLogoDiv.append(logoImageRow.firstElementChild.firstChild);
  }
  footerItcLogo.append(itcLogoDiv);
  footerLogos.append(footerItcLogo);

  const footerFssaiLogo = document.createElement('div');
  footerFssaiLogo.classList.add('footer-fssai-logo');
  const fssaiLogoDiv = document.createElement('div');
  fssaiLogoDiv.classList.add('fssailogo', 'logo', 'image');
  moveInstrumentation(fssaiLogoImageRow.firstElementChild, fssaiLogoDiv);
  while (fssaiLogoImageRow.firstElementChild.firstChild) {
    fssaiLogoDiv.append(fssaiLogoImageRow.firstElementChild.firstChild);
  }
  footerFssaiLogo.append(fssaiLogoDiv);
  footerLogos.append(footerFssaiLogo);

  leftCol.append(footerLogos);

  const contactDetails = document.createElement('div');
  contactDetails.classList.add('contact-details');

  const grievanceTitle = document.createElement('h5');
  grievanceTitle.classList.add('contact-details__title', 'mb-md-3', 'mb-0');
  moveInstrumentation(grievanceOfficerTitleRow.firstElementChild, grievanceTitle);
  while (grievanceOfficerTitleRow.firstElementChild.firstChild) {
    grievanceTitle.append(grievanceOfficerTitleRow.firstElementChild.firstChild);
  }
  contactDetails.append(grievanceTitle);

  const grievanceName = document.createElement('p');
  grievanceName.classList.add('contact-details__description', 'mb-md-1', 'mb-0');
  moveInstrumentation(grievanceOfficerNameRow.firstElementChild, grievanceName);
  while (grievanceOfficerNameRow.firstElementChild.firstChild) {
    grievanceName.append(grievanceOfficerNameRow.firstElementChild.firstChild);
  }
  contactDetails.append(grievanceName);

  const grievanceContact = document.createElement('p');
  grievanceContact.classList.add('contact-details__description', 'mb-md-1', 'mb-0');
  moveInstrumentation(grievanceOfficerContactRow.firstElementChild, grievanceContact);
  while (grievanceOfficerContactRow.firstElementChild.firstChild) {
    grievanceContact.append(grievanceOfficerContactRow.firstElementChild.firstChild);
  }
  contactDetails.append(grievanceContact);

  const grievanceHours = document.createElement('p');
  grievanceHours.classList.add('contact-details__description', 'mb-0');
  moveInstrumentation(grievanceOfficerHoursRow.firstElementChild, grievanceHours);
  while (grievanceOfficerHoursRow.firstElementChild.firstChild) {
    grievanceHours.append(grievanceOfficerHoursRow.firstElementChild.firstChild);
  }
  contactDetails.append(grievanceHours);

  leftCol.append(contactDetails);
  row.append(leftCol);

  // Right column for footer links and social icons
  const rightCol = document.createElement('div');
  rightCol.classList.add('col-lg-6', 'col-sm-12', 'align-items-md-end', 'd-flex', 'flex-column', 'itc-footer-link-right');

  const footerListsContainer = document.createElement('div');
  footerListsContainer.classList.add('footer-lists-container', 'd-flex');

  const list4 = document.createElement('div');
  list4.classList.add('list-4', 'list');
  const ulLinks = document.createElement('ul');

  footerLinks.forEach((linkRow, index) => {
    const li = document.createElement('li');
    moveInstrumentation(linkRow, li);
    li.id = `footerLinks-${index + 1}`;
    const linkCell = linkRow.children[0]; // Link is in the first cell
    const textCell = linkRow.children[1]; // Text is in the second cell

    if (linkCell && textCell) {
      const foundLink = linkCell.querySelector('a');
      const a = document.createElement('a');
      if (foundLink) {
        a.href = foundLink.href;
        if (foundLink.target) a.target = foundLink.target;
      }
      a.setAttribute('data-cmp-clickable', '');
      moveInstrumentation(textCell, a); // Instrument the link text
      while (textCell.firstChild) {
        a.append(textCell.firstChild);
      }
      const span = document.createElement('span');
      span.classList.add('cmp-link__screen-reader-only');
      span.textContent = 'opens in a new tab';
      a.append(span);
      li.append(a);
    }
    ulLinks.append(li);
  });
  list4.append(ulLinks);
  footerListsContainer.append(list4);
  rightCol.append(footerListsContainer);

  const socialIconsContainer = document.createElement('div'); // Renamed from socialIconsWrapper to match original HTML structure
  footerSocials.forEach((socialRow) => {
    const ulSocial = document.createElement('ul');
    ulSocial.classList.add('list-unstyled');
    const li = document.createElement('li');
    moveInstrumentation(socialRow, li);
    const linkCell = socialRow.children[0]; // Link is in the first cell
    const iconCell = socialRow.children[1]; // Icon is in the second cell

    if (linkCell && iconCell) {
      const foundLink = linkCell.querySelector('a');
      const a = document.createElement('a');
      if (foundLink) {
        a.href = foundLink.href;
        if (foundLink.target) a.target = foundLink.target;
      }
      a.id = 'socialIcons';
      a.setAttribute('data-cmp-clickable', '');
      moveInstrumentation(iconCell, a); // Instrument the icon
      while (iconCell.firstChild) {
        a.append(iconCell.firstChild);
      }
      const span = document.createElement('span');
      span.classList.add('cmp-link__screen-reader-only');
      span.textContent = 'opens in a new tab';
      a.append(span);
      li.append(a);
    }
    ulSocial.append(li);
    socialIconsContainer.append(ulSocial);
  });
  rightCol.append(socialIconsContainer);

  const copyrightSpan = document.createElement('span');
  copyrightSpan.classList.add('footer-link');
  moveInstrumentation(copyrightRow.firstElementChild, copyrightSpan);
  while (copyrightRow.firstElementChild.firstChild) {
    copyrightSpan.append(copyrightRow.firstElementChild.firstChild);
  }
  rightCol.append(copyrightSpan);

  row.append(rightCol);
  container.append(row);

  block.textContent = '';
  block.append(container);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
