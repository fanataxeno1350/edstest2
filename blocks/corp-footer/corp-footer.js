import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure the first three children as containers, the rest are item rows
  const [linkColumnsContainer, contactsContainer, footerColumnsContainer, ...itemRows] = [...block.children];

  // Content detection for item sub-components
  // link-column: 2 cells, no picture or anchor in the second cell (links are in divs within the second cell)
  const linkColumnItems = itemRows.filter(row => row.children.length === 2 && !row.children[1].querySelector('picture') && !row.children[1].querySelector('a'));
  // contact: 2 cells, and the second cell contains a picture or an anchor (social/app icons)
  const contactItems = itemRows.filter(row => row.children.length === 2 && (row.children[1].querySelector('picture') || row.children[1].querySelector('a')));
  // columns: 1 cell
  const columnsItems = itemRows.filter(row => row.children.length === 1);

  const footerWrapper = document.createElement('div');
  footerWrapper.classList.add('row', 'footer__columns', 'footer__columns--collapsed', 'footer__link-grid-container');

  // Link Columns
  const linkGridContainer = document.createElement('div');
  linkGridContainer.classList.add('col-lg-6', 'col-items');

  linkColumnItems.forEach((row, index) => {
    const col = document.createElement('div');
    // The original HTML shows col-lg-3 for the first column, and col-lg-4 for others.
    // The generated JS was using col-lg-4 for all. Adjusting based on original HTML.
    col.classList.add(index === 0 ? 'col-lg-3' : 'col-lg-4', 'link-column-container', 'column', `column-${index}`);
    moveInstrumentation(row, col);

    const linkColumnWrapper = document.createElement('div');
    linkColumnWrapper.classList.add('link-column-wrapper');

    const linkColumnBlock = document.createElement('div');
    linkColumnBlock.classList.add('link-column', 'block');

    const linkGridColumn = document.createElement('div');
    linkGridColumn.classList.add('link-grid-column', index === 0 ? 'link-column-horizontal' : 'link-column-vertical');

    const headingCell = row.children[0];
    const heading = document.createElement('h3');
    heading.classList.add('accordian-item', 'link-column__heading');
    moveInstrumentation(headingCell, heading);
    while (headingCell.firstChild) heading.append(headingCell.firstChild);

    const linksCell = row.children[1];
    const ul = document.createElement('ul');
    ul.classList.add('content', 'links-container', 'accordian-content', 'collpsable');
    moveInstrumentation(linksCell, ul);
    // The original HTML has `div` elements directly inside `linksCell`
    // which contain `a` tags. The JS should iterate through these `div`s.
    [...linksCell.children].forEach(linkDiv => {
      if (linkDiv.nodeType === Node.ELEMENT_NODE && linkDiv.tagName === 'DIV') {
        [...linkDiv.children].forEach(link => {
          if (link.tagName === 'A') {
            const li = document.createElement('li');
            li.append(link);
            ul.append(li);
          }
        });
      }
    });

    linkGridColumn.append(heading, ul);
    linkColumnBlock.append(linkGridColumn);
    linkColumnWrapper.append(linkColumnBlock);
    col.append(linkColumnWrapper);
    linkGridContainer.append(col);

    heading.addEventListener('click', () => {
      ul.classList.toggle('collpsable');
      heading.classList.toggle('collapsed');
    });
  });

  footerWrapper.append(linkGridContainer);

  // Contacts
  const contactSection = document.createElement('div');
  // The original HTML has 'column-4' and 'col-lg-3' on the contact section itself.
  // The generated JS was adding 'collpsable', 'hide__section' to the section,
  // but these are not present in the original HTML for the section, only for the accordian content.
  // Also, the original HTML has the default-content-wrapper (with buttons and disclaimer)
  // directly inside the contact section, before the contact-wrapper items.
  contactSection.classList.add('section', 'arena', 'footer-center-section', 'contact-container', 'column', 'column-4', 'contact-section', 'col-lg-3');
  moveInstrumentation(contactsContainer, contactSection);
  while (contactsContainer.firstChild) contactSection.append(contactsContainer.firstChild);

  contactItems.forEach((row, index) => {
    const contactWrapper = document.createElement('div');
    contactWrapper.classList.add('contact-wrapper');
    if (index === 2) contactWrapper.classList.add('qr-code'); // This is based on the original HTML structure
    moveInstrumentation(row, contactWrapper);

    const contactBlock = document.createElement('div');
    contactBlock.classList.add('contact', 'block');

    const contactWrpArena = document.createElement('div');
    contactWrpArena.classList.add('contact_wrp_arena', 'user__contact');
    if (index === 0) contactWrpArena.classList.add('header'); // This is based on the original HTML structure

    const titleCell = row.children[0];
    // The original HTML has a <p> tag for "Scan to chat with us" in the QR code section,
    // but an <h3> for "Download App". The JS was always creating an <h3>.
    // Adjusting to create a <p> if the content is not an <h3>.
    const titleElement = titleCell.querySelector('h3') || titleCell.querySelector('p') || document.createElement('h3');
    if (titleCell.textContent.trim()) {
      titleElement.classList.add('user__contact-title');
      moveInstrumentation(titleCell, titleElement);
      while (titleCell.firstChild) titleElement.append(titleCell.firstChild);
      contactWrpArena.append(titleElement);
    }

    const contactItemsCell = row.children[1];
    const userContactIcons = document.createElement('div');
    userContactIcons.classList.add('user__contact__icons');
    moveInstrumentation(contactItemsCell, userContactIcons);

    // The contact items cell contains divs, each with an anchor tag and an image.
    [...contactItemsCell.children].forEach(div => {
      if (div.tagName === 'DIV') {
        [...div.children].forEach(link => {
          if (link.tagName === 'A') {
            const iconLink = document.createElement('a');
            iconLink.classList.add('user__contact--icon', 'out-default');
            iconLink.href = link.href;
            if (link.target) iconLink.target = link.target;
            if (link.rel) iconLink.rel = link.rel;
            if (link.title) iconLink.title = link.title; // Add title from original HTML

            const img = link.querySelector('img');
            if (img) {
              const span = document.createElement('span');
              span.classList.add('sr-only');
              span.textContent = img.alt;
              iconLink.append(span);

              const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
              moveInstrumentation(img, optimizedPic.querySelector('img'));
              iconLink.append(optimizedPic);
            }
            userContactIcons.append(iconLink);
          }
        });
      }
    });

    contactWrpArena.append(userContactIcons);

    // Add the hidden contact-toggle-box if it exists in the original HTML for this item
    const hiddenContactToggleBox = row.querySelector('.hidden.contact-toggle-box');
    if (hiddenContactToggleBox) {
      contactWrpArena.append(hiddenContactToggleBox.cloneNode(true));
    }

    contactBlock.append(contactWrpArena);
    contactWrapper.append(contactBlock);
    contactSection.append(contactWrapper);
  });

  footerWrapper.append(contactSection);

  // Footer Columns
  const footerBottomSection = document.createElement('div');
  footerBottomSection.classList.add('row', 'footer-bottom-section', 'col-sm-12');
  moveInstrumentation(footerColumnsContainer, footerBottomSection);
  while (footerColumnsContainer.firstChild) footerBottomSection.append(footerColumnsContainer.firstChild);

  const columnsWrapper = document.createElement('div');
  columnsWrapper.classList.add('columns-wrapper');

  const columnsBlock = document.createElement('div');
  columnsBlock.classList.add('columns', 'block', 'columns-1-cols');

  const div = document.createElement('div');
  const innerDiv = document.createElement('div');

  columnsItems.forEach((row) => {
    const textCell = row.children[0];
    moveInstrumentation(textCell, innerDiv);
    while (textCell.firstChild) innerDiv.append(textCell.firstChild);
  });

  div.append(innerDiv);
  columnsBlock.append(div);
  columnsWrapper.append(columnsBlock);
  footerBottomSection.append(columnsWrapper);

  block.textContent = '';
  block.classList.add('block', 'footer-wrapper', 'footer', 'g-container');
  block.append(footerWrapper, footerBottomSection);

  // Add event listener for the "Disclaimer" text to toggle the footer-popup-section
  const disclaimerText = block.querySelector('.default-content-wrapper p[style="cursor: pointer;"]');
  const footerPopupSection = block.querySelector('.footer-popup-section');
  if (disclaimerText && footerPopupSection) {
    disclaimerText.addEventListener('click', () => {
      footerPopupSection.classList.toggle('collpsable');
      footerPopupSection.classList.toggle('hide__section');
    });
  }

  // Optimize pictures that might be directly in the block's content (e.g., in the disclaimer section)
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
