import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Root fields: disclaimer, copyright
  const disclaimerRow = children.find((row) => row.textContent.includes('Disclaimer Section text content'));
  const copyrightRow = children.find((row) => row.textContent.includes('Copyright value'));

  const itemRows = children.filter((row) => row !== disclaimerRow && row !== copyrightRow);

  const linkColumnRows = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && !cells[0].querySelector('picture') && cells[0].textContent.trim() !== '' && cells[1].querySelector('a');
  });

  const contactGroupRows = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && !cells[0].querySelector('picture') && cells[0].textContent.trim() !== '' && cells[1].querySelectorAll('div').length > 0;
  });

  const contactIconRows = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].querySelector('picture') && cells[1].querySelector('a') && cells[2].textContent.trim() !== '';
  });

  // App icons and QR code icons also match the contact-icon structure (3 cells, picture, link, text).
  // We need to differentiate them based on the content of the 'alt' text or the link itself if possible,
  // or rely on the order if the model guarantees it.
  // For now, assuming they are all handled by the contactGroupRows logic which processes icon references.
  // If there's a need to render them differently, more specific content detection would be required.
  const appIconRows = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].querySelector('picture') && cells[1].querySelector('a') && cells[2].textContent.trim().toLowerCase().includes('app');
  });

  const qrCodeIconRows = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].querySelector('picture') && cells[1].querySelector('a') && cells[2].textContent.trim().toLowerCase().includes('qr code');
  });

  const footerLinkRows = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && !cells[0].querySelector('picture') && cells[0].textContent.trim() !== '' && cells[1].querySelector('a');
  });

  const footerWrapper = document.createElement('div');
  footerWrapper.classList.add('footer-wrapper', 'footer', 'g-container');
  moveInstrumentation(block, footerWrapper);

  const linkGridContainer = document.createElement('div');
  linkGridContainer.classList.add('row', 'footer__columns', 'footer__columns--collapsed', 'footer__link-grid-container');

  const colItems = document.createElement('div');
  colItems.classList.add('col-lg-6', 'col-items');

  linkColumnRows.forEach((row, index) => {
    const linkColumnContainer = document.createElement('div');
    linkColumnContainer.classList.add('col-lg-3', 'link-column-container', 'column', `column-${index}`);
    moveInstrumentation(row, linkColumnContainer);

    const linkColumnWrapper = document.createElement('div');
    linkColumnWrapper.classList.add('link-column-wrapper');

    const linkColumnBlock = document.createElement('div');
    linkColumnBlock.classList.add('link-column', 'block');

    const linkGridColumn = document.createElement('div');
    linkGridColumn.classList.add('link-grid-column', index === 0 ? 'link-column-horizontal' : 'link-column-vertical');

    const headingCell = [...row.children].find((cell) => !cell.querySelector('a') && !cell.querySelector('picture'));
    const heading = document.createElement('h3');
    heading.classList.add('accordian-item', 'link-column__heading');
    if (headingCell) {
      moveInstrumentation(headingCell, heading);
      heading.textContent = headingCell.textContent.trim();
    }

    const linksCell = [...row.children].find((cell) => cell.querySelector('a'));
    const ul = document.createElement('ul');
    ul.classList.add('content', 'links-container', 'accordian-content');
    if (linksCell) {
      moveInstrumentation(linksCell, ul);
      [...linksCell.querySelectorAll('a')].forEach((a) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = a.href;
        link.textContent = a.textContent.trim();
        if (a.target) link.target = a.target;
        if (a.rel) link.rel = a.rel;
        li.append(link);
        ul.append(li);
      });
    }

    heading.addEventListener('click', () => {
      ul.classList.toggle('collpsable');
      heading.classList.toggle('collapsed'); // Add/remove 'collapsed' class for styling
    });

    linkGridColumn.append(heading, ul);
    linkColumnBlock.append(linkGridColumn);
    linkColumnWrapper.append(linkColumnBlock);
    linkColumnContainer.append(linkColumnWrapper);

    if (index === 0) {
      linkGridContainer.prepend(linkColumnContainer);
    } else {
      colItems.append(linkColumnContainer);
    }
  });

  if (colItems.children.length > 0) {
    linkGridContainer.append(colItems);
  }

  const contactSection = document.createElement('div');
  contactSection.classList.add('section', 'arena', 'footer-center-section', 'contact-container', 'column', 'column-4', 'collpsable', 'hide__section', 'contact-section', 'col-lg-3');

  const defaultContentWrapper = document.createElement('div');
  defaultContentWrapper.classList.add('default-content-wrapper');

  if (disclaimerRow) {
    const disclaimerContent = document.createElement('div');
    moveInstrumentation(disclaimerRow, disclaimerContent);
    while (disclaimerRow.firstChild) disclaimerContent.append(disclaimerRow.firstChild);
    defaultContentWrapper.append(disclaimerContent);
  }

  contactGroupRows.forEach((row) => {
    const contactWrapper = document.createElement('div');
    contactWrapper.classList.add('contact-wrapper');
    moveInstrumentation(row, contactWrapper);

    const contactBlock = document.createElement('div');
    contactBlock.classList.add('contact', 'block');

    const contactWrpArena = document.createElement('div');
    contactWrpArena.classList.add('contact_wrp_arena', 'user__contact');

    const titleCell = [...row.children].find((cell) => !cell.querySelector('picture') && !cell.querySelector('a'));
    if (titleCell) {
      const title = document.createElement('h3');
      title.classList.add('user__contact-title');
      moveInstrumentation(titleCell, title);
      title.textContent = titleCell.textContent.trim();
      contactWrpArena.append(title);
    }

    const iconsCell = [...row.children].find((cell) => cell.querySelectorAll('div').length > 0);
    const userContactIcons = document.createElement('div');
    userContactIcons.classList.add('user__contact__icons');

    if (iconsCell) {
      const iconRefs = [...iconsCell.children];
      iconRefs.forEach((iconRef) => {
        // Find the corresponding contact-icon, app-icon, or qr-code-icon row
        const iconRow = itemRows.find((item) => {
          const cells = [...item.children];
          if (cells.length === 3 && cells[0].querySelector('picture') && cells[1].querySelector('a') && cells[2].textContent.trim() !== '') {
            // Check if the iconRef contains the picture from this item row
            return iconRef.contains(cells[0].querySelector('picture'));
          }
          return false;
        });

        if (iconRow) {
          const iconCell = [...iconRow.children].find((cell) => cell.querySelector('picture'));
          const linkCell = [...iconRow.children].find((cell) => cell.querySelector('a'));
          const altTextCell = [...iconRow.children].find((cell) => !cell.querySelector('picture') && !cell.querySelector('a'));

          if (iconCell && linkCell && altTextCell) {
            const iconLink = document.createElement('a');
            iconLink.classList.add('user__contact--icon', 'out-default');
            iconLink.href = linkCell.querySelector('a').href;
            if (linkCell.querySelector('a').target) iconLink.target = linkCell.querySelector('a').target;
            if (linkCell.querySelector('a').rel) iconLink.rel = linkCell.querySelector('a').rel;
            iconLink.title = altTextCell.textContent.trim();

            const srOnly = document.createElement('span');
            srOnly.classList.add('sr-only');
            srOnly.textContent = altTextCell.textContent.trim();
            iconLink.append(srOnly);

            const picture = iconCell.querySelector('picture');
            if (picture) {
              const img = picture.querySelector('img');
              const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
              moveInstrumentation(img, optimizedPic.querySelector('img'));
              iconLink.append(optimizedPic);
            }
            userContactIcons.append(iconLink);
          }
        }
      });
    }
    contactWrpArena.append(userContactIcons);
    contactBlock.append(contactWrpArena);
    contactWrapper.append(contactBlock);
    contactSection.append(contactWrapper);
  });

  linkGridContainer.append(contactSection);

  const footerBottomSection = document.createElement('div');
  footerBottomSection.classList.add('row', 'footer-bottom-section', 'col-sm-12');

  const disclaimerSection = document.createElement('div');
  disclaimerSection.classList.add('section', 'arena', 'footer-bottom-section', 'row', 'columns-container');

  const columnsWrapper = document.createElement('div');
  columnsWrapper.classList.add('columns-wrapper');

  const columnsBlock = document.createElement('div');
  columnsBlock.classList.add('columns', 'block', 'columns-1-cols');

  if (disclaimerRow) {
    const disclaimerDiv = document.createElement('div');
    const disclaimerContentDiv = document.createElement('div');
    moveInstrumentation(disclaimerRow, disclaimerContentDiv);
    while (disclaimerRow.firstChild) disclaimerContentDiv.append(disclaimerRow.firstChild);
    disclaimerDiv.append(disclaimerContentDiv);
    columnsBlock.append(disclaimerDiv);
  }
  columnsWrapper.append(columnsBlock);
  disclaimerSection.append(columnsWrapper);
  footerBottomSection.append(disclaimerSection);

  const copyrightSection = document.createElement('div');
  copyrightSection.classList.add('row', 'footer-bottom-section', 'col-sm-12');

  const copyrightContainer = document.createElement('div');
  copyrightContainer.classList.add('section', 'row', 'copy-right-container');

  const copyrightWrapper = document.createElement('div');
  copyrightWrapper.classList.add('copy-right-wrapper');

  const copyrightBlock = document.createElement('div');
  copyrightBlock.classList.add('copy-right', 'block');

  const copyrightContentWrapper = document.createElement('div');
  copyrightContentWrapper.classList.add('copy-right-wrapper');

  if (copyrightRow) {
    const copyrightText = document.createElement('div');
    copyrightText.classList.add('copy-right-text');
    moveInstrumentation(copyrightRow, copyrightText);
    copyrightText.textContent = copyrightRow.textContent.trim();
    copyrightContentWrapper.append(copyrightText);
  }

  const linkSection = document.createElement('div');
  linkSection.classList.add('link-section');

  footerLinkRows.forEach((row) => {
    const labelCell = [...row.children].find((cell) => !cell.querySelector('a') && !cell.querySelector('picture'));
    const hrefCell = [...row.children].find((cell) => cell.querySelector('a'));

    if (labelCell && hrefCell) {
      const link = document.createElement('a');
      link.href = hrefCell.querySelector('a').href;
      link.textContent = labelCell.textContent.trim();
      if (hrefCell.querySelector('a').target) link.target = hrefCell.querySelector('a').target;
      if (hrefCell.querySelector('a').rel) link.rel = hrefCell.querySelector('a').rel;
      moveInstrumentation(row, link);
      linkSection.append(link);
    }
  });

  copyrightContentWrapper.append(linkSection);
  copyrightBlock.append(copyrightContentWrapper);
  copyrightWrapper.append(copyrightBlock);
  copyrightContainer.append(copyrightWrapper);
  copyrightSection.append(copyrightContainer);

  footerWrapper.append(linkGridContainer, footerBottomSection, copyrightSection);

  block.textContent = '';
  block.append(footerWrapper);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
