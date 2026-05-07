import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure root-level rows based on the BlockJson model
  // The model has 10 root fields, with 'footerSections' being a container field
  // which means its items appear as subsequent rows.
  // We need to carefully map the first 9 rows to the fixed fields,
  // and then filter the remaining rows for the 'footerSections' and 'footerLinkItem' types.
  const allRows = [...block.children];

  // Fixed root fields (first 9 rows)
  const [
    logoRow, // block.children[0]: field="logo" type=reference
    logoLinkRow, // block.children[1]: field="logoLink" type=aem-content
    logoLabelRow, // block.children[2]: field="logoLabel" type=text
    newsletterHeadlineRow, // block.children[3]: field="newsletterHeadline" type=text
    newsletterDescriptionRow, // block.children[4]: field="newsletterDescription" type=richtext
    newsletterFormActionRow, // block.children[5]: field="newsletterFormAction" type=aem-content
    newsletterEmailPlaceholderRow, // block.children[6]: field="newsletterEmailPlaceholder" type=text
    newsletterButtonLabelRow, // block.children[7]: field="newsletterButtonLabel" type=text
    copyrightRow, // block.children[8]: field="copyright" type=text
    ...remainingRows // All subsequent rows are item rows for footerSections or footerLinkItem
  ] = allRows;

  // Filter remainingRows for footer-links-section (2 cells, second cell has <ul>)
  const footerSections = remainingRows.filter((row) => row.children.length === 2 && row.children[1]?.querySelector('ul'));
  // Filter remainingRows for footer-link-item (2 cells, second cell has <a>, but no <ul> in second cell)
  // This filter needs to exclude rows already identified as footerSections.
  const footerLinks = remainingRows.filter((row) =>
    row.children.length === 2
    && row.children[1]?.querySelector('a')
    && !footerSections.includes(row));

  const container = document.createElement('div');
  container.classList.add('container');

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row', 'gy-5');

  const colLg6 = document.createElement('div');
  colLg6.classList.add('col-lg-6', 'col-12');

  const footerLogo = document.createElement('a');
  footerLogo.classList.add('footer-logo', 'd-flex', 'align-items-center');
  const logoLink = logoLinkRow?.querySelector('a');
  if (logoLink) {
    footerLogo.href = logoLink.href;
    moveInstrumentation(logoLinkRow, footerLogo);
  } else {
    footerLogo.href = '#'; // Default href if no link is provided
  }

  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
    const optimizedImg = optimizedPic.querySelector('img');
    optimizedImg.classList.add('img-fluid');
    moveInstrumentation(logoRow, optimizedPic); // Move instrumentation from logoRow to optimizedPic
    footerLogo.append(optimizedPic);
  }

  const logoHeading = document.createElement('h2');
  logoHeading.textContent = logoLabelRow?.textContent.trim() || '';
  moveInstrumentation(logoLabelRow, logoHeading);
  footerLogo.append(logoHeading);
  colLg6.append(footerLogo);

  const newsletterHeadline = document.createElement('h3');
  newsletterHeadline.textContent = newsletterHeadlineRow?.textContent.trim() || '';
  moveInstrumentation(newsletterHeadlineRow, newsletterHeadline);
  colLg6.append(newsletterHeadline);

  const newsletterDescription = document.createElement('p');
  newsletterDescription.innerHTML = newsletterDescriptionRow?.innerHTML || '';
  moveInstrumentation(newsletterDescriptionRow, newsletterDescription);
  colLg6.append(newsletterDescription);

  const form = document.createElement('form');
  form.classList.add('d-flex', 'flex-wrap');
  const formActionLink = newsletterFormActionRow?.querySelector('a');
  form.action = formActionLink?.href || '#';
  form.method = 'post';
  moveInstrumentation(newsletterFormActionRow, form);

  const csrfToken = document.createElement('input');
  csrfToken.type = 'hidden';
  csrfToken.name = 'csrfmiddlewaretoken';
  // This is hardcoded in original HTML. If this value should be dynamic, it needs a model field.
  csrfToken.value = 'd7iCIx3gILj5ftZwMlCQivcccEHBJwzxC2ramBnMqjcNoxO7U7dBe6fL42wrlFNR';
  form.append(csrfToken);

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = newsletterEmailPlaceholderRow?.textContent.trim() || 'Enter Your Email';
  moveInstrumentation(newsletterEmailPlaceholderRow, emailInput);
  form.append(emailInput);

  const subscribeButton = document.createElement('button');
  subscribeButton.classList.add('btn', 'btn-primary', 'subscribe-btn');
  subscribeButton.textContent = newsletterButtonLabelRow?.textContent.trim() || 'Subscribe';
  moveInstrumentation(newsletterButtonLabelRow, subscribeButton);
  form.append(subscribeButton);
  colLg6.append(form);
  rowDiv.append(colLg6);

  footerSections.forEach((sectionRow) => {
    // For 'footer-links-section' item rows, destructure cells by index
    const [sectionTitleCell, hierarchyTreeCell] = [...sectionRow.children];

    const colLg3 = document.createElement('div');
    colLg3.classList.add('col-lg-3', 'col-6');
    moveInstrumentation(sectionRow, colLg3);

    const sectionTitle = document.createElement('h5');
    sectionTitle.textContent = sectionTitleCell?.textContent.trim() || '';
    moveInstrumentation(sectionTitleCell, sectionTitle); // Move instrumentation for sectionTitleCell
    colLg3.append(sectionTitle);

    // Handle hierarchy-tree richtext field
    if (hierarchyTreeCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from hierarchyTreeCell

      const ul = tempDiv.querySelector('ul');
      if (ul) {
        ul.classList.add('d-flex', 'flex-column', 'useful-links-list');
        // Apply classes to nested elements as per ORIGINAL HTML
        ul.querySelectorAll('a').forEach((a) => {
          // No specific classes for <a> in ORIGINAL HTML, but good practice to check if needed
        });
        ul.querySelectorAll('li').forEach((li) => {
          // No specific classes for <li> in ORIGINAL HTML, but good practice to check if needed
        });
        colLg3.append(ul);
      }
    }
    rowDiv.append(colLg3);
  });

  footerLinks.forEach((linkRow) => {
    // For 'footer-link-item' item rows, destructure cells by index
    const [labelCell, linkCell] = [...linkRow.children];
    const colLg3 = document.createElement('div');
    colLg3.classList.add('col-lg-3', 'col-6');
    moveInstrumentation(linkRow, colLg3);

    const h5 = document.createElement('h5');
    h5.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(labelCell, h5); // Move instrumentation for labelCell
    colLg3.append(h5);

    const ul = document.createElement('ul');
    ul.classList.add('d-flex', 'flex-column', 'useful-links-list');
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = linkCell?.querySelector('a')?.href || '#';
    a.textContent = labelCell?.textContent.trim() || ''; // Link text from labelCell
    moveInstrumentation(linkCell, a); // Move instrumentation for linkCell
    li.append(a);
    ul.append(li);
    colLg3.append(ul);
    rowDiv.append(colLg3);
  });

  container.append(rowDiv);
  block.replaceChildren(container);

  const copyright = document.createElement('h5');
  copyright.classList.add('text-center', 'mt-6');
  copyright.textContent = copyrightRow?.textContent.trim() || '';
  moveInstrumentation(copyrightRow, copyright);
  block.append(copyright);
}
