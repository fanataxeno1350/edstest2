import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const footerWrapper = document.createElement('div');
  footerWrapper.classList.add('footer-wrapper', 'footer', 'g-container');

  const linkGridContainer = document.createElement('div');
  linkGridContainer.classList.add('row', 'footer__columns', 'footer__columns--collapsed', 'footer__link-grid-container');

  const contactSection = document.createElement('div');
  contactSection.classList.add('section', 'arena', 'footer-center-section', 'contact-container', 'column', 'column-4', 'collpsable', 'hide__section', 'contact-section');

  const popupSection = document.createElement('div');
  popupSection.classList.add('section', 'arena', 'footer-popup-section', 'column', 'column-5', 'collpsable', 'hide__section');

  const bottomSection = document.createElement('div');
  bottomSection.classList.add('row', 'footer-bottom-section', 'col-sm-12');

  const linkColumnItems = [];
  const contactItems = [];
  const columnsItems = [];

  [...block.children].forEach((row) => {
    // Check for link-column items: 2 cells, and the first cell (heading) does not contain an image
    if (row.children.length === 2 && !row.children[0].querySelector('img')) {
      linkColumnItems.push(row);
    }
    // Check for contact items: 2 cells, and the first cell (title) does not contain an image
    // The original logic `row.querySelector('img')` was too broad.
    else if (row.children.length === 2 && !row.children[0].querySelector('img')) {
      contactItems.push(row);
    }
    // Check for columns items: 1 cell, and the cell does not contain an image
    else if (row.children.length === 1 && !row.querySelector('img')) {
      columnsItems.push(row);
    }
  });

  linkColumnItems.forEach((row, index) => {
    const col = document.createElement('div');
    col.classList.add('col-lg-3', 'link-column-container', 'column', `column-${index}`);
    if (index > 0) {
      col.classList.remove('col-lg-3');
      col.classList.add('col-lg-4', 'col-items');
    }

    const linkColumnWrapper = document.createElement('div');
    linkColumnWrapper.classList.add('link-column-wrapper');
    moveInstrumentation(row, linkColumnWrapper);

    const linkColumnBlock = document.createElement('div');
    linkColumnBlock.classList.add('link-column', 'block');

    const linkGridColumn = document.createElement('div');
    linkGridColumn.classList.add('link-grid-column', index === 0 ? 'link-column-horizontal' : 'link-column-vertical');

    const headingCell = row.children[0];
    const heading = document.createElement('h3');
    heading.classList.add('accordian-item', 'link-column__heading');
    moveInstrumentation(headingCell, heading);
    heading.append(...headingCell.children);

    const linksCell = row.children[1];
    const ul = document.createElement('ul');
    ul.classList.add('content', 'links-container', 'accordian-content', 'collpsable'); // 'collpsable' is from original HTML
    moveInstrumentation(linksCell, ul);

    [...linksCell.children].forEach((linkWrapper) => {
      const li = document.createElement('li');
      const link = linkWrapper.querySelector('a');
      if (link) {
        const newLink = document.createElement('a');
        newLink.href = link.href;
        if (link.target) newLink.target = link.target;
        if (link.rel) newLink.rel = link.rel;
        moveInstrumentation(link, newLink);
        newLink.append(...link.childNodes);
        li.append(newLink);
      } else {
        li.append(...linkWrapper.children);
      }
      ul.append(li);
    });

    linkGridColumn.append(heading, ul);
    linkColumnBlock.append(linkGridColumn);
    linkColumnWrapper.append(linkColumnBlock);
    col.append(linkColumnWrapper);
    linkGridContainer.append(col);

    heading.addEventListener('click', () => {
      ul.classList.toggle('collpsable'); // 'collpsable' is from original HTML
      heading.classList.toggle('collapsed');
    });
  });

  const defaultContentWrapper = document.createElement('div');
  defaultContentWrapper.classList.add('default-content-wrapper');

  // Handle contact items
  contactItems.forEach((row) => {
    const contactWrapper = document.createElement('div');
    contactWrapper.classList.add('contact-wrapper');
    moveInstrumentation(row, contactWrapper);

    const contactBlock = document.createElement('div');
    contactBlock.classList.add('contact', 'block');

    const contactWrpArena = document.createElement('div');
    contactWrpArena.classList.add('contact_wrp_arena', 'user__contact');

    const titleCell = row.children[0];
    const title = document.createElement('h3');
    title.classList.add('user__contact-title');
    moveInstrumentation(titleCell, title);
    title.append(...titleCell.children);

    const iconsCell = row.children[1];
    const iconsDiv = document.createElement('div');
    iconsDiv.classList.add('user__contact__icons');
    moveInstrumentation(iconsCell, iconsDiv);

    [...iconsCell.children].forEach((iconWrapper) => {
      const link = iconWrapper.querySelector('a');
      const img = iconWrapper.querySelector('img');
      if (link && img) {
        const newLink = document.createElement('a');
        newLink.href = link.href;
        if (link.target) newLink.target = link.target;
        if (link.rel) newLink.rel = link.rel;
        newLink.classList.add('user__contact--icon', 'out-default');
        newLink.title = link.title || img.alt;

        const span = document.createElement('span');
        span.classList.add('sr-only');
        span.textContent = img.alt;
        newLink.append(span);

        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        newLink.append(optimizedPic);
        iconsDiv.append(newLink);
      } else if (img) {
        const newLink = document.createElement('a');
        newLink.classList.add('user__contact--icon', 'out-default');
        newLink.title = img.alt;

        const span = document.createElement('span');
        span.classList.add('sr-only');
        span.textContent = img.alt;
        newLink.append(span);

        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        newLink.append(optimizedPic);
        iconsDiv.append(newLink);
      } else if (link) {
        const newLink = document.createElement('a');
        newLink.href = link.href;
        if (link.target) newLink.target = link.target;
        if (link.rel) newLink.rel = link.rel;
        newLink.classList.add('button');
        moveInstrumentation(link, newLink);
        newLink.append(...link.childNodes);

        const p = document.createElement('p');
        p.classList.add('button-container');
        p.append(newLink);
        defaultContentWrapper.append(p);
      } else {
        defaultContentWrapper.append(...iconWrapper.children);
      }
    });

    if (title.textContent.trim()) {
      contactWrpArena.append(title);
    }
    if (iconsDiv.children.length > 0) {
      contactWrpArena.append(iconsDiv);
    }

    contactBlock.append(contactWrpArena);
    contactWrapper.append(contactBlock);
    contactSection.append(contactWrapper);
  });

  if (defaultContentWrapper.children.length > 0) {
    contactSection.prepend(defaultContentWrapper);
  }

  // Handle columns items for the bottom section
  const columnsWrapper = document.createElement('div');
  columnsWrapper.classList.add('columns-wrapper');

  columnsItems.forEach((row) => {
    const columnsBlock = document.createElement('div');
    columnsBlock.classList.add('columns', 'block', 'columns-1-cols');
    moveInstrumentation(row, columnsBlock);

    const div = document.createElement('div');
    const contentCell = row.children[0];
    moveInstrumentation(contentCell, div);
    div.append(...contentCell.children);
    columnsBlock.append(div);
    columnsWrapper.append(columnsBlock);
  });
  bottomSection.append(columnsWrapper);

  footerWrapper.append(linkGridContainer, contactSection, popupSection, bottomSection);

  block.textContent = '';
  block.append(footerWrapper);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Add event listener for "Disclaimer" to toggle popup section
  const disclaimerParagraph = contactSection.querySelector('p[style="cursor: pointer;"]');
  if (disclaimerParagraph) {
    disclaimerParagraph.addEventListener('click', () => {
      popupSection.classList.toggle('hide__section');
      popupSection.classList.toggle('collpsable'); // 'collpsable' is from original HTML
    });
  }
}
