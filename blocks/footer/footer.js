import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Destructure rows based on the BlockJson model order
  const [
    logoRow,
    brandRow,
    newsletterTitleRow,
    newsletterDescriptionRow,
    newsletterFormActionRow,
    newsletterEmailPlaceholderRow,
    newsletterButtonLabelRow,
    copyrightRow, // Copyright is now before item rows in the model
    ...itemRows // Remaining rows are footer-link items
  ] = children;

  // Filter itemRows into useful and service links based on the original HTML structure
  // The BlockJson defines 'useful-links' and 'service-links' as containers of 'footer-link' items.
  // We need to infer which group they belong to from the original HTML or a convention.
  // Assuming the first 4 item rows are 'useful-links' and the rest are 'service-links' as per original HTML.
  const usefulLinks = itemRows.slice(0, 4);
  const serviceLinks = itemRows.slice(4);

  const footerContainer = document.createElement('div');
  footerContainer.classList.add('container');

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row', 'gy-5');

  // Column 1: Logo, Brand, Newsletter
  const col1 = document.createElement('div');
  col1.classList.add('col-lg-6', 'col-12');

  const logoLink = document.createElement('a');
  logoLink.classList.add('footer-logo', 'd-flex', 'align-items-center');
  logoLink.href = '/';

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }

  const brandH2 = document.createElement('h2');
  moveInstrumentation(brandRow.firstElementChild, brandH2);
  while (brandRow.firstElementChild.firstChild) {
    brandH2.append(brandRow.firstElementChild.firstChild);
  }
  logoLink.append(brandH2);
  col1.append(logoLink);

  const newsletterTitleH3 = document.createElement('h3');
  moveInstrumentation(newsletterTitleRow.firstElementChild, newsletterTitleH3);
  while (newsletterTitleRow.firstElementChild.firstChild) {
    newsletterTitleH3.append(newsletterTitleRow.firstElementChild.firstChild);
  }
  col1.append(newsletterTitleH3);

  const newsletterDescriptionP = document.createElement('p');
  moveInstrumentation(newsletterDescriptionRow.firstElementChild, newsletterDescriptionP);
  while (newsletterDescriptionRow.firstElementChild.firstChild) {
    newsletterDescriptionP.append(newsletterDescriptionRow.firstElementChild.firstChild);
  }
  col1.append(newsletterDescriptionP);

  const newsletterForm = document.createElement('form');
  newsletterForm.classList.add('d-flex', 'flex-wrap');
  newsletterForm.action = newsletterFormActionRow.firstElementChild.textContent.trim();
  newsletterForm.method = 'post';

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = newsletterEmailPlaceholderRow.firstElementChild.textContent.trim();
  newsletterForm.append(emailInput);

  const subscribeButton = document.createElement('button');
  subscribeButton.classList.add('btn', 'btn-primary', 'subscribe-btn');
  moveInstrumentation(newsletterButtonLabelRow.firstElementChild, subscribeButton);
  while (newsletterButtonLabelRow.firstElementChild.firstChild) {
    subscribeButton.append(newsletterButtonLabelRow.firstElementChild.firstChild);
  }
  newsletterForm.append(subscribeButton);
  col1.append(newsletterForm);
  rowDiv.append(col1);

  // Column 2: Useful Links
  const col2 = document.createElement('div');
  col2.classList.add('col-lg-3', 'col-6');

  const usefulLinksH5 = document.createElement('h5');
  usefulLinksH5.textContent = 'Useful Links';
  col2.append(usefulLinksH5);

  const usefulLinksUl = document.createElement('ul');
  usefulLinksUl.classList.add('d-flex', 'flex-column', 'useful-links-list');

  usefulLinks.forEach((linkRow) => {
    const li = document.createElement('li');
    moveInstrumentation(linkRow, li); // Move instrumentation from the row to the new li

    const linkCell = [...linkRow.children].find((cell) => cell.querySelector('a'));
    const labelCell = [...linkRow.children].find((cell) => !cell.querySelector('a'));

    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.textContent = labelCell.textContent.trim();
    }
    li.append(link);
    usefulLinksUl.append(li);
  });
  col2.append(usefulLinksUl);
  rowDiv.append(col2);

  // Column 3: Our Services
  const col3 = document.createElement('div');
  col3.classList.add('col-lg-3', 'col-6');

  const serviceLinksH5 = document.createElement('h5');
  serviceLinksH5.textContent = 'Our Services';
  col3.append(serviceLinksH5);

  const serviceLinksUl = document.createElement('ul');
  serviceLinksUl.classList.add('d-flex', 'flex-column', 'useful-links-list');

  serviceLinks.forEach((linkRow) => {
    const li = document.createElement('li');
    moveInstrumentation(linkRow, li); // Move instrumentation from the row to the new li

    const linkCell = [...linkRow.children].find((cell) => cell.querySelector('a'));
    const labelCell = [...linkRow.children].find((cell) => !cell.querySelector('a'));

    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.textContent = labelCell.textContent.trim();
    }
    li.append(link);
    serviceLinksUl.append(li);
  });
  col3.append(serviceLinksUl);
  rowDiv.append(col3);

  footerContainer.append(rowDiv);

  // Copyright
  const copyrightH5 = document.createElement('h5');
  copyrightH5.classList.add('text-center', 'mt-6');
  moveInstrumentation(copyrightRow.firstElementChild, copyrightH5);
  while (copyrightRow.firstElementChild.firstChild) {
    copyrightH5.append(copyrightRow.firstElementChild.firstChild);
  }
  footerContainer.append(copyrightH5);

  block.textContent = '';
  block.append(footerContainer);
}
