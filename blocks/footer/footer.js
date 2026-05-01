import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.classList.add('d-flex', 'flex-column', 'useful-links-list'); // Add classes here
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');
    if (anchor) {
      anchor.classList.add('footer-link'); // Add class to anchor
    } else {
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
  const children = [...block.children];

  const footerEl = document.createElement('footer');
  const container = document.createElement('div');
  container.classList.add('container');
  footerEl.append(container);

  const row = document.createElement('div');
  row.classList.add('row', 'gy-5');
  container.append(row);

  // Fixed fields: logo, logoLink, logoLabel, newsletterHeading, newsletterDescription,
  // newsletterPlaceholder, newsletterFormAction, newsletterButtonLabel, footerLinkSections, copyright
  // Reordered to match BlockJson and EDS Block Structure
  const [
    logoRow,
    logoLinkRow,
    logoLabelRow,
    newsletterHeadingRow,
    newsletterDescriptionRow,
    newsletterPlaceholderRow,
    newsletterFormActionRow,
    newsletterButtonLabelRow,
    copyrightRowFromRoot, // This is the copyright row if it's a root field
    ...restRows // This will contain footerLinkSections and footerLinkItems
  ] = children;

  const footerLinkSections = [];
  const footerLinkItems = [];
  let copyrightRow = copyrightRowFromRoot; // Initialize with the root copyright row

  restRows.forEach((r) => {
    // Check for footer-link-section (2 cells: sectionTitle, hierarchy-tree)
    // The hierarchy-tree cell contains a <ul>
    if (r.children.length === 2 && r.children[1].querySelector('ul')) {
      footerLinkSections.push(r);
    } else if (r.children.length === 2 && r.children[1].querySelector('a')) {
      // Check for footer-link-item (2 cells: label, link)
      // The link cell contains an <a>
      footerLinkItems.push(r);
    } else if (r.children.length === 1 && r.textContent.includes('©') && !copyrightRow) {
      // Fallback for copyright if it's not a root field, and not already assigned
      copyrightRow = r;
    }
  });

  // Left column (logo and newsletter)
  const leftCol = document.createElement('div');
  leftCol.classList.add('col-lg-6', 'col-12');
  row.append(leftCol);

  const logoLink = document.createElement('a');
  logoLink.classList.add('footer-logo', 'd-flex', 'align-items-center');
  moveInstrumentation(logoLinkRow, logoLink);
  logoLink.href = logoLinkRow.querySelector('a')?.href || '#';

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
    optimizedPic.querySelector('img').classList.add('img-fluid');
    moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }

  const logoLabel = document.createElement('h2');
  moveInstrumentation(logoLabelRow, logoLabel);
  logoLabel.textContent = logoLabelRow.textContent.trim();
  logoLink.append(logoLabel);
  leftCol.append(logoLink);

  const newsletterHeading = document.createElement('h3');
  moveInstrumentation(newsletterHeadingRow, newsletterHeading);
  newsletterHeading.textContent = newsletterHeadingRow.textContent.trim();
  leftCol.append(newsletterHeading);

  const newsletterDescription = document.createElement('p');
  moveInstrumentation(newsletterDescriptionRow, newsletterDescription);
  newsletterDescription.textContent = newsletterDescriptionRow.textContent.trim();
  leftCol.append(newsletterDescription);

  const newsletterForm = document.createElement('form');
  newsletterForm.classList.add('d-flex', 'flex-wrap');
  moveInstrumentation(newsletterFormActionRow, newsletterForm);
  newsletterForm.action = newsletterFormActionRow.querySelector('a')?.href || '#'; // Read href from aem-content cell
  newsletterForm.method = 'post';

  // TODO: CSRF token is not authored. If it's required, it should be fetched dynamically
  // or provided via a block field. Hardcoding is an anti-pattern.
  // const csrfInput = document.createElement('input');
  // csrfInput.type = 'hidden';
  // csrfInput.name = 'csrfmiddlewaretoken';
  // csrfInput.value = 'Aly8ItpistxugOYajCCCMUZgZEJTuJfevRQgATeys6BOKU4f6gSUxnoosxx8cMvj';
  // newsletterForm.append(csrfInput);

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  moveInstrumentation(newsletterPlaceholderRow, emailInput);
  emailInput.placeholder = newsletterPlaceholderRow.textContent.trim();
  newsletterForm.append(emailInput);

  const subscribeButton = document.createElement('button');
  subscribeButton.classList.add('btn', 'btn-primary', 'subscribe-btn');
  moveInstrumentation(newsletterButtonLabelRow, subscribeButton);
  subscribeButton.textContent = newsletterButtonLabelRow.textContent.trim();
  newsletterForm.append(subscribeButton);
  leftCol.append(newsletterForm);

  // Right columns (link sections)
  footerLinkSections.forEach((sectionRow) => {
    const [sectionTitleCell, hierarchyTreeCell] = [...sectionRow.children];

    const rightCol = document.createElement('div');
    rightCol.classList.add('col-lg-3', 'col-6');
    moveInstrumentation(sectionRow, rightCol);
    row.append(rightCol);

    const sectionTitle = document.createElement('h5');
    sectionTitle.textContent = sectionTitleCell.textContent.trim();
    rightCol.append(sectionTitle);

    const tempDiv = document.createElement('div'); // Use a temp div to parse richtext
    tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
    moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from the cell to the tempDiv

    const ul = tempDiv.querySelector('ul');
    if (ul) {
      transformNestedLists(ul); // Classes added inside transformNestedLists
      rightCol.append(ul);
    }
  });

  // Copyright text
  if (copyrightRow) {
    const copyrightText = document.createElement('h5');
    copyrightText.classList.add('text-center', 'mt-6');
    moveInstrumentation(copyrightRow, copyrightText);
    copyrightText.textContent = copyrightRow.textContent.trim();
    footerEl.append(copyrightText);
  }

  block.replaceChildren(footerEl);
}
