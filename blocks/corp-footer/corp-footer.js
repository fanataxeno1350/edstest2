import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const linkColumnsContainer = document.createElement('div');
  linkColumnsContainer.classList.add('row', 'footer__columns', 'footer__columns--collapsed', 'footer__link-grid-container');
  moveInstrumentation(children[0], linkColumnsContainer); // Instrument the container field

  const contactsContainer = document.createElement('div');
  contactsContainer.classList.add('section', 'arena', 'footer-center-section', 'contact-container', 'column', 'column-4', 'hide__section', 'contact-section', 'col-lg-3');
  moveInstrumentation(children[1], contactsContainer); // Instrument the container field

  const columnsContainer = document.createElement('div');
  columnsContainer.classList.add('row', 'footer-bottom-section', 'col-sm-12');
  moveInstrumentation(children[2], columnsContainer); // Instrument the container field

  const linkColumnRows = [];
  const contactRows = [];
  const columnsRows = [];

  // Separate the item rows based on their structure
  children.forEach((row, index) => {
    // The first three rows are container fields, not item rows.
    // Their content is moved to the respective containers above.
    if (index < 3) return;

    // A link-column item has 2 cells: heading (text) and links (container)
    // Check for 2 cells and specific content in the cells (h3 or ul in the second cell)
    if (row.children.length === 2 && (row.children[0].querySelector('h3') || row.children[1].querySelector('ul'))) {
      linkColumnRows.push(row);
    }
    // A contact item has 2 cells: title (text) and icons (container)
    // Check for 2 cells and specific content in the cells (p in the first cell, or picture in the second)
    else if (row.children.length === 2 && (row.children[0].querySelector('p') || row.children[1].querySelector('picture'))) {
      contactRows.push(row);
    }
    // A columns item has 1 cell: content (richtext)
    else if (row.children.length === 1 && row.children[0].querySelector('p')) {
      columnsRows.push(row);
    }
  });

  linkColumnRows.forEach((row, index) => {
    const colDiv = document.createElement('div');
    colDiv.classList.add('col-lg-3', 'link-column-container', 'column', `column-${index}`);
    moveInstrumentation(row, colDiv);

    const linkColumnWrapper = document.createElement('div');
    linkColumnWrapper.classList.add('link-column-wrapper');
    colDiv.append(linkColumnWrapper);

    const linkColumnBlock = document.createElement('div');
    linkColumnBlock.classList.add('link-column', 'block');
    linkColumnWrapper.append(linkColumnBlock);

    const linkGridColumn = document.createElement('div');
    linkGridColumn.classList.add('link-grid-column', index === 0 ? 'link-column-horizontal' : 'link-column-vertical');
    linkColumnBlock.append(linkGridColumn);

    const headingCell = row.children[0];
    const linksCell = row.children[1];

    const heading = document.createElement('h3');
    heading.classList.add('accordian-item', 'link-column__heading');
    moveInstrumentation(headingCell, heading);
    while (headingCell.firstChild) heading.append(headingCell.firstChild);
    linkGridColumn.append(heading);

    const ul = document.createElement('ul');
    ul.classList.add('content', 'links-container', 'accordian-content', 'collpsable');
    moveInstrumentation(linksCell, ul);

    [...linksCell.children].forEach((linkWrapper) => {
      const li = document.createElement('li');
      moveInstrumentation(linkWrapper, li);
      const link = linkWrapper.querySelector('a');
      if (link) {
        const newLink = document.createElement('a');
        newLink.href = link.href;
        if (link.target) newLink.target = link.target;
        if (link.rel) newLink.rel = link.rel;
        moveInstrumentation(link, newLink);
        while (link.firstChild) newLink.append(link.firstChild);
        li.append(newLink);
      } else {
        while (linkWrapper.firstChild) li.append(linkWrapper.firstChild);
      }
      ul.append(li);
    });
    linkGridColumn.append(ul);

    heading.addEventListener('click', () => {
      ul.classList.toggle('collpsable');
      heading.classList.toggle('collapsed');
    });

    linkColumnsContainer.append(colDiv);
  });

  contactRows.forEach((row) => {
    const contactWrapper = document.createElement('div');
    contactWrapper.classList.add('contact-wrapper');
    moveInstrumentation(row, contactWrapper);

    const contactBlock = document.createElement('div');
    contactBlock.classList.add('contact', 'block');
    contactWrapper.append(contactBlock);

    const contactWrpArena = document.createElement('div');
    contactWrpArena.classList.add('contact_wrp_arena', 'user__contact');
    contactBlock.append(contactWrpArena);

    const titleCell = row.children[0];
    const iconsCell = row.children[1];

    if (titleCell.textContent.trim()) {
      const title = document.createElement('h3');
      title.classList.add('user__contact-title');
      moveInstrumentation(titleCell, title);
      while (titleCell.firstChild) title.append(titleCell.firstChild);
      contactWrpArena.append(title);
    }

    const iconsDiv = document.createElement('div');
    iconsDiv.classList.add('user__contact__icons');
    moveInstrumentation(iconsCell, iconsDiv);

    [...iconsCell.children].forEach((iconItem) => {
      const iconLink = iconItem.querySelector('a');
      const iconImage = iconItem.querySelector('picture');
      // The label is typically the text content of the iconItem itself, or from an inner element
      // For simplicity, let's assume it's the text content of the last child if it's not a link/picture
      const iconLabel = iconItem.textContent.trim(); // Get text content from the whole item for label

      if (iconLink && iconImage) {
        const a = document.createElement('a');
        a.href = iconLink.href;
        if (iconLink.target) a.target = iconLink.target;
        if (iconLink.rel) a.rel = iconLink.rel;
        a.classList.add('user__contact--icon', 'out-default');
        a.title = iconLabel; // Use the extracted label for title
        moveInstrumentation(iconLink, a);

        const span = document.createElement('span');
        span.classList.add('sr-only');
        span.textContent = iconLabel;
        a.append(span);

        const img = iconImage.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          a.append(optimizedPic);
        }
        iconsDiv.append(a);
      } else if (iconImage) { // Handle cases where there's an image but no explicit link wrapper
        const a = document.createElement('a'); // Create a dummy link if no explicit link provided
        a.href = '#'; // Or a default href
        a.classList.add('user__contact--icon', 'out-default');
        a.title = iconLabel;
        
        const span = document.createElement('span');
        span.classList.add('sr-only');
        span.textContent = iconLabel;
        a.append(span);

        const img = iconImage.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          a.append(optimizedPic);
        }
        iconsDiv.append(a);
      }
    });
    contactWrpArena.append(iconsDiv);
    contactsContainer.append(contactWrapper);
  });

  columnsRows.forEach((row) => {
    const columnsWrapper = document.createElement('div');
    columnsWrapper.classList.add('columns-wrapper');
    moveInstrumentation(row, columnsWrapper);

    const columnsBlock = document.createElement('div');
    columnsBlock.classList.add('columns', 'block', 'columns-1-cols');
    columnsWrapper.append(columnsBlock);

    const contentDiv = document.createElement('div');
    columnsBlock.append(contentDiv);

    const innerContentDiv = document.createElement('div');
    moveInstrumentation(row.children[0], innerContentDiv);
    while (row.children[0].firstChild) innerContentDiv.append(row.children[0].firstChild);
    contentDiv.append(innerContentDiv);

    columnsContainer.append(columnsWrapper);
  });

  block.textContent = '';
  block.classList.add('footer-wrapper', 'footer', 'g-container');
  block.append(linkColumnsContainer);
  block.append(contactsContainer);
  block.append(columnsContainer);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
