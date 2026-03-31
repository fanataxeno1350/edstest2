import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure the block children based on the BlockJson model
  // The first three children are containers, the rest are item rows.
  const [linkColumnsContainer, contactsContainer, columnsContainer, ...itemRows] = [...block.children];

  // Main footer wrapper
  const footerWrapper = document.createElement('div');
  footerWrapper.classList.add('corp-footer', 'block', 'footer-wrapper', 'footer', 'g-container');
  moveInstrumentation(block, footerWrapper);

  // Link Columns Section
  const linkGridContainer = document.createElement('div');
  linkGridContainer.classList.add('row', 'footer__columns', 'footer__columns--collapsed', 'footer__link-grid-container');
  moveInstrumentation(linkColumnsContainer, linkGridContainer);

  // Filter for 'link-column' items: 2 cells, no picture (distinguishes from contact icons)
  const linkColumnItems = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture'));
  linkColumnItems.forEach((row, index) => {
    const colLg = document.createElement('div');
    colLg.classList.add('col-lg-3', 'link-column-container', 'column', `column-${index}`);
    if (index > 0) colLg.classList.add('col-lg-4');
    if (index > 1) colLg.classList.add('collpsable');

    const linkColumnWrapper = document.createElement('div');
    linkColumnWrapper.classList.add('link-column-wrapper');

    const linkColumnBlock = document.createElement('div');
    linkColumnBlock.classList.add('link-column', 'block');

    const linkGridColumn = document.createElement('div');
    linkGridColumn.classList.add('link-grid-column', index === 0 ? 'link-column-horizontal' : 'link-column-vertical');

    const headingCell = row.children[0]; // First cell is heading
    if (headingCell) {
      const heading = document.createElement('h3');
      heading.classList.add('accordian-item', 'link-column__heading');
      moveInstrumentation(headingCell, heading);
      while (headingCell.firstChild) heading.append(headingCell.firstChild);
      linkGridColumn.append(heading);

      const linksCell = row.children[1]; // Second cell is links container
      if (linksCell) {
        const ul = document.createElement('ul');
        ul.classList.add('content', 'links-container', 'accordian-content', 'collpsable');
        moveInstrumentation(linksCell, ul);

        [...linksCell.children].forEach((linkRow) => {
          const li = document.createElement('li');
          moveInstrumentation(linkRow, li);
          while (linkRow.firstChild) li.append(linkRow.firstChild);
          ul.append(li);
        });
        linkGridColumn.append(ul);

        heading.addEventListener('click', () => {
          ul.classList.toggle('collpsable');
          heading.classList.toggle('active');
        });
      }
    }

    linkColumnBlock.append(linkGridColumn);
    linkColumnWrapper.append(linkColumnBlock);
    colLg.append(linkColumnWrapper);
    linkGridContainer.append(colLg);
  });

  footerWrapper.append(linkGridContainer);

  // Contacts Section
  const contactSection = document.createElement('div');
  contactSection.classList.add('section', 'arena', 'footer-center-section', 'contact-container', 'column', 'column-4', 'collpsable', 'hide__section', 'contact-section');
  moveInstrumentation(contactsContainer, contactSection);

  // Filter for 'contact' items: 2 cells, and the second cell contains a picture (for icons)
  const contactItems = itemRows.filter((row) => row.children.length === 2 && row.children[1].querySelector('picture'));

  contactItems.forEach((row) => {
    const contactWrapper = document.createElement('div');
    contactWrapper.classList.add('contact-wrapper');

    const contactBlock = document.createElement('div');
    contactBlock.classList.add('contact', 'block');

    const contactWrpArena = document.createElement('div');
    contactWrpArena.classList.add('contact_wrp_arena', 'user__contact');

    const titleCell = row.children[0]; // First cell is title
    if (titleCell) {
      // Check if the title cell contains a paragraph with "Disclaimer" text
      const disclaimerP = titleCell.querySelector('p');
      if (disclaimerP && disclaimerP.textContent.trim() === 'Disclaimer') {
        disclaimerP.classList.add('accordian-item'); // Add accordian-item class to the paragraph
        disclaimerP.addEventListener('click', () => {
          contactSection.classList.toggle('collpsable');
          contactSection.classList.toggle('hide__section');
          disclaimerP.classList.toggle('active');
        });
        contactWrpArena.append(disclaimerP); // Append the paragraph directly
      } else {
        const title = document.createElement('h3');
        title.classList.add('user__contact-title');
        moveInstrumentation(titleCell, title);
        while (titleCell.firstChild) title.append(titleCell.firstChild);
        contactWrpArena.append(title);
      }
    }

    const iconsCell = row.children[1]; // Second cell is icons container
    if (iconsCell) {
      const iconsDiv = document.createElement('div');
      iconsDiv.classList.add('user__contact__icons');
      moveInstrumentation(iconsCell, iconsDiv);

      [...iconsCell.children].forEach((iconRow) => {
        const link = iconRow.querySelector('a');
        const img = iconRow.querySelector('img');
        if (link && img) {
          const iconLink = document.createElement('a');
          iconLink.href = link.href;
          if (link.target) iconLink.target = link.target;
          if (link.rel) iconLink.rel = link.rel;
          iconLink.classList.add('user__contact--icon', 'out-default');
          if (link.title) iconLink.title = link.title;

          const span = document.createElement('span');
          span.classList.add('sr-only');
          span.textContent = img.alt;
          iconLink.append(span);

          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          iconLink.append(optimizedPic);
          iconsDiv.append(iconLink);
        }
      });
      contactWrpArena.append(iconsDiv);
    }

    contactBlock.append(contactWrpArena);
    contactWrapper.append(contactBlock);
    contactSection.append(contactWrapper);
  });

  footerWrapper.append(contactSection);

  // Columns Section (Disclaimer)
  const footerBottomSection = document.createElement('div');
  footerBottomSection.classList.add('row', 'footer-bottom-section', 'col-sm-12');
  moveInstrumentation(columnsContainer, footerBottomSection);

  const columnsWrapper = document.createElement('div');
  columnsWrapper.classList.add('columns-wrapper');

  const columnsBlock = document.createElement('div');
  columnsBlock.classList.add('columns', 'block', 'columns-1-cols');

  const columnsDiv = document.createElement('div');
  const innerDiv = document.createElement('div');

  // Filter for 'columns' items: 1 cell, containing a paragraph (richtext)
  const columnItems = itemRows.filter((row) => row.children.length === 1 && row.children[0].querySelector('p'));
  columnItems.forEach((row) => {
    const textCell = row.children[0]; // Only one cell for richtext
    if (textCell) {
      moveInstrumentation(textCell, innerDiv);
      while (textCell.firstChild) innerDiv.append(textCell.firstChild);
    }
  });

  columnsDiv.append(innerDiv);
  columnsBlock.append(columnsDiv);
  columnsWrapper.append(columnsBlock);
  footerBottomSection.append(columnsWrapper);

  footerWrapper.append(footerBottomSection);

  block.textContent = '';
  block.append(footerWrapper);

  footerWrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
