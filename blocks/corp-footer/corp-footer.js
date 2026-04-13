import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // Distinguish link-column rows from contact rows based on content
  // link-column rows have a text heading and then a list of links
  // contact rows have a title (which can be a button) and then icons
  const linkColumnRows = rows.filter((row) => {
    const cells = [...row.children];
    // A link column row has 2 cells. The first cell is a heading (text), the second is a container of links.
    // The heading cell typically won't contain a picture.
    return cells.length === 2 && !cells[0].querySelector('picture') && cells[1].querySelector('a');
  });

  const contactRows = rows.filter((row) => {
    const cells = [...row.children];
    // A contact row also has 2 cells. The first cell is a title (can be a link/button), the second is a container of icons (pictures).
    // The first cell might contain a link, but the second cell will contain images for icons.
    // This filter ensures we don't double-count rows already identified as linkColumnRows.
    return cells.length === 2 && !linkColumnRows.includes(row);
  });

  const footerWrapper = document.createElement('div');
  footerWrapper.classList.add('footer-wrapper', 'footer', 'g-container');

  const linkGridContainer = document.createElement('div');
  linkGridContainer.classList.add('row', 'footer__columns', 'footer__columns--collapsed', 'footer__link-grid-container');
  footerWrapper.append(linkGridContainer);

  linkColumnRows.forEach((row, index) => {
    const cells = [...row.children];
    const headingCell = cells[0]; // This is acceptable as it's the first cell of a known structure
    const linksCell = cells[1];   // This is acceptable as it's the second cell of a known structure

    const colLg = document.createElement('div');
    colLg.classList.add('col-lg-3', 'link-column-container', 'column', `column-${index}`);
    if (index === 1) {
      colLg.classList.remove('col-lg-3');
      colLg.classList.add('col-lg-6', 'col-items');
    }
    if (index > 1) {
      colLg.classList.remove('col-lg-3');
      colLg.classList.add('col-lg-4', 'collpsable');
    }

    const linkColumnWrapper = document.createElement('div');
    linkColumnWrapper.classList.add('link-column-wrapper');
    colLg.append(linkColumnWrapper);

    const linkColumnBlock = document.createElement('div');
    linkColumnBlock.classList.add('link-column', 'block');
    linkColumnWrapper.append(linkColumnBlock);

    const linkGridColumn = document.createElement('div');
    linkGridColumn.classList.add('link-grid-column');
    if (index === 0) {
      linkGridColumn.classList.add('link-column-horizontal');
    } else {
      linkGridColumn.classList.add('link-column-vertical');
    }
    linkColumnBlock.append(linkGridColumn);

    const heading = document.createElement('h3');
    heading.classList.add('accordian-item', 'link-column__heading');
    moveInstrumentation(headingCell, heading);
    heading.textContent = headingCell.textContent.trim();
    linkGridColumn.append(heading);

    const ul = document.createElement('ul');
    ul.classList.add('content', 'links-container', 'accordian-content', 'collpsable');
    moveInstrumentation(linksCell, ul);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = linksCell.innerHTML;
    [...tempDiv.querySelectorAll('a')].forEach((link) => {
      const li = document.createElement('li');
      li.append(link);
      ul.append(li);
    });
    linkGridColumn.append(ul);

    linkGridContainer.append(colLg);

    heading.addEventListener('click', () => {
      ul.classList.toggle('collpsable');
      heading.classList.toggle('accordian-item--active');
    });
  });

  const contactSection = document.createElement('div');
  contactSection.classList.add('section', 'arena', 'footer-center-section', 'contact-container', 'column', 'column-4', 'collpsable', 'hide__section', 'contact-section', 'col-lg-3');
  footerWrapper.append(contactSection);

  contactRows.forEach((row, index) => {
    const cells = [...row.children];
    const titleCell = cells[0]; // This is acceptable as it's the first cell of a known structure
    const iconsCell = cells[1]; // This is acceptable as it's the second cell of a known structure

    const contactWrapper = document.createElement('div');
    contactWrapper.classList.add('contact-wrapper');
    if (index === 2) { // Assuming the QR code is the third contact row
      contactWrapper.classList.add('qr-code');
    }
    contactSection.append(contactWrapper);

    const contactBlock = document.createElement('div');
    contactBlock.classList.add('contact', 'block');
    contactWrapper.append(contactBlock);

    const contactWrpArena = document.createElement('div');
    contactWrpArena.classList.add('contact_wrp_arena', 'user__contact');
    if (index === 0) { // Assuming the first contact row is the header
      contactWrpArena.classList.add('header');
    }
    contactBlock.append(contactWrpArena);

    if (titleCell.textContent.trim()) {
      const titleEl = document.createElement(index === 0 ? 'p' : 'h3');
      titleEl.classList.add(index === 0 ? 'button-container' : 'user__contact-title');
      moveInstrumentation(titleCell, titleEl);

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = titleCell.innerHTML;
      const link = tempDiv.querySelector('a');
      if (link) {
        link.classList.add('button');
        titleEl.append(link);
      } else {
        titleEl.textContent = titleCell.textContent.trim();
      }
      contactWrpArena.append(titleEl);
    }

    const userContactIcons = document.createElement('div');
    userContactIcons.classList.add('user__contact__icons');
    moveInstrumentation(iconsCell, userContactIcons);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = iconsCell.innerHTML;
    [...tempDiv.querySelectorAll('a')].forEach((link) => {
      const iconLink = document.createElement('a');
      iconLink.href = link.href;
      if (link.target) iconLink.target = link.target;
      if (link.rel) iconLink.rel = link.rel;
      iconLink.classList.add('user__contact--icon', 'out-default');
      if (link.title) iconLink.title = link.title;

      const srOnly = document.createElement('span');
      srOnly.classList.add('sr-only');
      srOnly.textContent = link.querySelector('img')?.alt || '';
      iconLink.append(srOnly);

      const img = link.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
        iconLink.append(optimizedPic);
      }
      userContactIcons.append(iconLink);
    });
    contactWrpArena.append(userContactIcons);
  });

  block.textContent = '';
  block.append(footerWrapper);

  footerWrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
