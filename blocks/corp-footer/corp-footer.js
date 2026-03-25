import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const footerWrapper = document.createElement('div');
  footerWrapper.classList.add('footer-wrapper');

  const footer = document.createElement('div');
  footer.classList.add('footer', 'g-container');

  const columnsRow = document.createElement('div');
  columnsRow.classList.add('row', 'corp-footer__columns', 'corp-footer__columns--collapsed', 'corp-footer__link-grid-container');

  const linkColumnContainers = block.querySelectorAll('[data-aue-model="footer-link-column"]');
  linkColumnContainers.forEach((linkColumnNode) => {
    const colLgDiv = document.createElement('div');
    colLgDiv.classList.add('col-lg-3', 'link-column-container', 'column');

    const linkColumnWrapper = document.createElement('div');
    linkColumnWrapper.classList.add('link-column-wrapper');

    const linkColumnBlock = document.createElement('div');
    linkColumnBlock.classList.add('link-column', 'block');
    linkColumnBlock.dataset.blockName = 'link-column';

    const linkGridColumn = document.createElement('div');
    linkGridColumn.classList.add('link-grid-column');

    const title = linkColumnNode.querySelector('[data-aue-prop="title"]');
    if (title) {
      const h3 = document.createElement('h3');
      h3.classList.add('accordian-item', 'link-column__heading');
      h3.id = title.id || title.textContent.toLowerCase().replace(/\s/g, '-');
      h3.textContent = title.textContent;
      moveInstrumentation(title, h3);
      linkGridColumn.append(h3);
    }

    const linksContainer = document.createElement('ul');
    linksContainer.classList.add('content', 'links-container', 'accordian-content');

    const links = linkColumnNode.querySelectorAll('[data-aue-model="footer-link"]');
    links.forEach((linkNode) => {
      const li = document.createElement('li');
      const a = linkNode.querySelector('[data-aue-prop="link"]');
      if (a) {
        const newA = document.createElement('a');
        newA.href = a.href;
        newA.textContent = a.textContent;
        if (a.target) newA.target = a.target;
        if (a.rel) newA.rel = a.rel;
        moveInstrumentation(a, newA);
        li.append(newA);
      }
      moveInstrumentation(linkNode, li);
      linksContainer.append(li);
    });

    linkGridColumn.append(linksContainer);
    linkColumnBlock.append(linkGridColumn);
    linkColumnWrapper.append(linkColumnBlock);
    colLgDiv.append(linkColumnWrapper);
    moveInstrumentation(linkColumnNode, colLgDiv);
    columnsRow.append(colLgDiv);
  });

  footer.append(columnsRow);

  const contactSection = document.createElement('div');
  contactSection.classList.add('section', 'arena', 'footer-center-section', 'contact-container', 'column', 'col-lg-3', 'contact-section');

  const defaultContentWrapper = document.createElement('div');
  defaultContentWrapper.classList.add('default-content-wrapper');
  const disclaimerP = block.querySelector('p[style="cursor: pointer;"]');
  if (disclaimerP) {
    defaultContentWrapper.append(disclaimerP);
    moveInstrumentation(disclaimerP, defaultContentWrapper);
  }
  contactSection.append(defaultContentWrapper);

  const contactWrappers = block.querySelectorAll('div.contact-wrapper');
  contactWrappers.forEach((contactWrapperNode) => {
    const newContactWrapper = document.createElement('div');
    newContactWrapper.classList.add('contact-wrapper');
    if (contactWrapperNode.classList.contains('qr-code')) {
      newContactWrapper.classList.add('qr-code');
    }

    const contactBlock = document.createElement('div');
    contactBlock.classList.add('contact', 'block');
    contactBlock.dataset.blockName = 'contact';

    const contactWrpArena = document.createElement('div');
    contactWrpArena.classList.add('contact_wrp_arena', 'user__contact');
    if (contactWrapperNode.querySelector('.header')) {
      contactWrpArena.classList.add('header');
    }

    const contactTitle = contactWrapperNode.querySelector('.user__contact-title');
    if (contactTitle) {
      if (contactTitle.tagName === 'H3') {
        const h3 = document.createElement('h3');
        h3.classList.add('user__contact-title');
        h3.textContent = contactTitle.textContent;
        moveInstrumentation(contactTitle, h3);
        contactWrpArena.append(h3);
      } else if (contactTitle.tagName === 'P') {
        const p = document.createElement('p');
        p.classList.add('user__contact-title');
        p.textContent = contactTitle.textContent;
        moveInstrumentation(contactTitle, p);
        contactWrpArena.append(p);
      }
    }

    const iconsDiv = document.createElement('div');
    iconsDiv.classList.add('user__contact__icons');

    const contactIcons = contactWrapperNode.querySelectorAll('[data-aue-model^="footer-"][data-aue-model$="-icon"]');
    contactIcons.forEach((iconNode) => {
      const a = iconNode.querySelector('a');
      const img = iconNode.querySelector('img');

      if (a && img) {
        const newA = document.createElement('a');
        newA.href = a.href;
        newA.target = a.target;
        if (a.rel) newA.rel = a.rel;
        newA.classList.add('user__contact--icon', 'out-default');
        newA.title = a.title;

        const span = document.createElement('span');
        span.classList.add('sr-only');
        span.textContent = img.alt;
        newA.append(span);

        const picture = createOptimizedPicture(img.src, img.alt);
        newA.append(picture);
        moveInstrumentation(a, newA);
        moveInstrumentation(img, picture.querySelector('img'));
        iconsDiv.append(newA);
      }
      moveInstrumentation(iconNode, iconsDiv);
    });

    contactWrpArena.append(iconsDiv);
    contactBlock.append(contactWrpArena);
    newContactWrapper.append(contactBlock);
    moveInstrumentation(contactWrapperNode, newContactWrapper);
    contactSection.append(newContactWrapper);
  });

  footer.append(contactSection);

  const popupSection = document.createElement('div');
  popupSection.classList.add('section', 'arena', 'footer-popup-section', 'column', 'col-lg-3');

  const popupContentWrapper = document.createElement('div');
  popupContentWrapper.classList.add('default-content-wrapper');
  const popupContent = block.querySelector('.corp-footer-footer-popup-section .corp-footer-default-content-wrapper');
  if (popupContent) {
    Array.from(popupContent.children).forEach((child) => {
      popupContentWrapper.append(child);
      moveInstrumentation(child, popupContentWrapper);
    });
  }
  popupSection.append(popupContentWrapper);
  footer.append(popupSection);

  const bottomSection = document.createElement('div');
  bottomSection.classList.add('row', 'footer-bottom-section', 'col-sm-12');

  const columnsWrapper = document.createElement('div');
  columnsWrapper.classList.add('columns-wrapper');

  const bottomColumnsBlock = document.createElement('div');
  bottomColumnsBlock.classList.add('columns', 'block', 'columns-1-cols');
  bottomColumnsBlock.dataset.blockName = 'columns';

  const bottomColumnItems = block.querySelectorAll('[data-aue-model="footer-bottom-column"]');
  bottomColumnItems.forEach((itemNode) => {
    const div = document.createElement('div');
    const content = itemNode.querySelector('[data-aue-prop="content"]');
    if (content) {
      div.append(...Array.from(content.children));
      moveInstrumentation(content, div);
    }
    moveInstrumentation(itemNode, div);
    bottomColumnsBlock.append(div);
  });

  columnsWrapper.append(bottomColumnsBlock);
  bottomSection.append(columnsWrapper);
  footer.append(bottomSection);

  footerWrapper.append(footer);

  block.textContent = '';
  block.append(footerWrapper);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
