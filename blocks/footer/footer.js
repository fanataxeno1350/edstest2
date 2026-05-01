import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [
    logoRow,
    logoLinkRow,
    logoTitleRow,
    newsletterTitleRow,
    newsletterDescriptionRow,
    newsletterFormActionRow,
    newsletterEmailPlaceholderRow,
    newsletterButtonLabelRow,
    ...restRows
  ] = children;

  const copyrightRow = restRows.pop(); // Copyright is the last fixed field

  const itemRows = restRows;

  // No need to separate footerLinkItems and footerSectionItems here
  // The loop below will handle both based on row.children.length
  // footerLinkItems would have 2 children, footerSectionItems would have 3.

  const footer = document.createElement('footer');
  const container = document.createElement('div');
  container.classList.add('container');
  footer.append(container);

  const row = document.createElement('div');
  row.classList.add('row', 'gy-5');
  container.append(row);

  // Logo and Newsletter Section
  const logoNewsletterCol = document.createElement('div');
  logoNewsletterCol.classList.add('col-lg-6', 'col-12');
  row.append(logoNewsletterCol);

  const logoLink = document.createElement('a');
  logoLink.classList.add('footer-logo', 'd-flex', 'align-items-center');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);

  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      // Original HTML has width="40", so use that. createOptimizedPicture handles responsive.
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
      // moveInstrumentation should be on the original element, not the new one's child
      moveInstrumentation(logoRow, optimizedPic); // Instrument the picture itself
      logoLink.append(optimizedPic);
    }
  } else {
    // If no picture, ensure instrumentation for logoRow is still moved
    moveInstrumentation(logoRow, logoLink);
  }

  const h2 = document.createElement('h2');
  h2.textContent = logoTitleRow.textContent.trim();
  moveInstrumentation(logoTitleRow, h2);
  logoLink.append(h2);
  logoNewsletterCol.append(logoLink);

  const newsletterTitle = document.createElement('h3');
  newsletterTitle.textContent = newsletterTitleRow.textContent.trim();
  moveInstrumentation(newsletterTitleRow, newsletterTitle);
  logoNewsletterCol.append(newsletterTitle);

  const newsletterDescription = document.createElement('p');
  newsletterDescription.textContent = newsletterDescriptionRow.textContent.trim();
  moveInstrumentation(newsletterDescriptionRow, newsletterDescription);
  logoNewsletterCol.append(newsletterDescription);

  const form = document.createElement('form');
  form.classList.add('d-flex', 'flex-wrap');
  const foundFormAction = newsletterFormActionRow.querySelector('a');
  if (foundFormAction) {
    form.action = foundFormAction.href;
  }
  form.method = 'post';
  moveInstrumentation(newsletterFormActionRow, form);

  // Hidden input for CSRF is hardcoded in original HTML, but its value is dynamic.
  // Since EDS doesn't provide dynamic values for hidden inputs, we omit it unless
  // a specific value is provided in the block content.
  // If a hidden input is needed, it should be a separate field in the model.

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = newsletterEmailPlaceholderRow.textContent.trim();
  moveInstrumentation(newsletterEmailPlaceholderRow, emailInput);
  form.append(emailInput);

  const subscribeButton = document.createElement('button');
  subscribeButton.classList.add('btn', 'btn-primary', 'subscribe-btn');
  subscribeButton.textContent = newsletterButtonLabelRow.textContent.trim();
  moveInstrumentation(newsletterButtonLabelRow, subscribeButton);
  form.append(subscribeButton);

  logoNewsletterCol.append(form);

  // Footer Sections and Footer Links
  itemRows.forEach((itemRow) => {
    if (itemRow.children.length === 2) { // footer-link-item
      const [labelCell, linkCell] = [...itemRow.children];

      const sectionCol = document.createElement('div');
      sectionCol.classList.add('col-lg-3', 'col-6'); // Assuming these links also go into a column
      row.append(sectionCol);
      moveInstrumentation(itemRow, sectionCol);

      const ul = document.createElement('ul');
      ul.classList.add('d-flex', 'flex-column', 'useful-links-list');
      sectionCol.append(ul);

      const newLi = document.createElement('li');
      const link = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.textContent = labelCell.textContent.trim(); // Use labelCell for text
      } else {
        link.href = '#'; // Fallback
        link.textContent = labelCell.textContent.trim();
      }
      moveInstrumentation(labelCell, newLi); // Instrument the label cell to the li
      moveInstrumentation(linkCell, link); // Instrument the link cell to the a
      newLi.append(link);
      ul.append(newLi);
    } else if (itemRow.children.length === 3) { // footer-section-item
      const [titleCell, sectionLinksCell, hierarchyTreeCell] = [...itemRow.children];

      const sectionCol = document.createElement('div');
      sectionCol.classList.add('col-lg-3', 'col-6');
      row.append(sectionCol);
      moveInstrumentation(itemRow, sectionCol);

      const sectionTitle = document.createElement('h5');
      sectionTitle.textContent = titleCell.textContent.trim();
      moveInstrumentation(titleCell, sectionTitle);
      sectionCol.append(sectionTitle);

      const ul = document.createElement('ul');
      ul.classList.add('d-flex', 'flex-column', 'useful-links-list');
      sectionCol.append(ul);

      const tempDiv = document.createElement('div');
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Instrument the hierarchyTreeCell to tempDiv
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;

      const hierarchyRoot = tempDiv.querySelector('ul');
      if (hierarchyRoot) {
        // Move instrumentation for the hierarchy-tree content
        moveInstrumentation(hierarchyTreeCell, hierarchyRoot);

        [...hierarchyRoot.children].forEach((li) => {
          const anchor = li.querySelector(':scope > a');
          const newLi = document.createElement('li');
          const link = document.createElement('a');

          if (anchor) {
            link.href = anchor.href;
            link.textContent = anchor.textContent.trim();
            moveInstrumentation(anchor, link); // Instrument the original anchor to the new link
          } else {
            link.href = '#';
            link.textContent = li.textContent.trim();
          }
          moveInstrumentation(li, newLi); // Instrument the original li to the new li
          newLi.append(link);

          // Handle nested ul if present
          const nestedUl = li.querySelector(':scope > ul');
          if (nestedUl) {
            moveInstrumentation(nestedUl, nestedUl); // Instrument the nested ul itself
            newLi.append(nestedUl); // Append the original nested ul directly
          }
          ul.append(newLi);
        });
      } else {
        // Fallback to sectionLinks if hierarchy-tree is empty or malformed
        const sectionLinksTempDiv = document.createElement('div');
        moveInstrumentation(sectionLinksCell, sectionLinksTempDiv); // Instrument sectionLinksCell
        sectionLinksTempDiv.innerHTML = sectionLinksCell.innerHTML;

        const sectionLinksUl = sectionLinksTempDiv.querySelector('ul');
        if (sectionLinksUl) {
          moveInstrumentation(sectionLinksCell, sectionLinksUl); // Instrument the ul if found
          [...sectionLinksUl.children].forEach((li) => {
            const anchor = li.querySelector('a');
            if (anchor) {
              const newLi = document.createElement('li');
              const link = document.createElement('a');
              link.href = anchor.href;
              link.textContent = anchor.textContent.trim();
              moveInstrumentation(li, newLi); // Instrument original li
              moveInstrumentation(anchor, link); // Instrument original anchor
              newLi.append(link);
              ul.append(newLi);
            }
          });
        } else {
          // If sectionLinks is just text or <p> tags, try to extract links
          [...sectionLinksTempDiv.querySelectorAll('a')].forEach((anchor) => {
            const newLi = document.createElement('li');
            const link = document.createElement('a');
            link.href = anchor.href;
            link.textContent = anchor.textContent.trim();
            moveInstrumentation(anchor, link); // Instrument original anchor
            newLi.append(link);
            ul.append(newLi);
          });
        }
      }
    }
  });

  // Copyright
  const copyright = document.createElement('h5');
  copyright.classList.add('text-center', 'mt-6');
  copyright.textContent = copyrightRow.textContent.trim();
  moveInstrumentation(copyrightRow, copyright);
  footer.append(copyright);

  block.replaceChildren(footer);
}
