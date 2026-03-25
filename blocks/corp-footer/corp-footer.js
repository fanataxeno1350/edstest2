import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const footerWrapper = document.createElement('div');
  footerWrapper.classList.add('footer-wrapper', 'footer', 'g-container');

  const linkGridContainer = document.createElement('div');
  linkGridContainer.classList.add('row', 'footer__columns', 'footer__columns--collapsed', 'footer__link-grid-container');
  footerWrapper.append(linkGridContainer);
  moveInstrumentation(block.querySelector('.row.footer__columns'), linkGridContainer);

  const footerLinkColumns = block.querySelectorAll('[data-aue-model="footerLinkColumn"]');
  if (footerLinkColumns.length > 0) {
    const colLg3 = document.createElement('div');
    colLg3.classList.add('col-lg-3', 'link-column-container', 'column', 'column-0');

    const colLg6 = document.createElement('div');
    colLg6.classList.add('col-lg-6', 'col-items');

    footerLinkColumns.forEach((columnNode, index) => {
      const linkColumnWrapper = document.createElement('div');
      linkColumnWrapper.classList.add('link-column-wrapper');

      const linkGridColumn = document.createElement('div');
      linkGridColumn.classList.add('link-grid-column');

      const heading = columnNode.querySelector('[data-aue-prop="heading"]');
      if (heading) {
        heading.classList.add('accordian-item', 'link-column__heading');
        linkGridColumn.append(heading);
        moveInstrumentation(heading, linkGridColumn);
      }

      const linksContainer = document.createElement('ul');
      linksContainer.classList.add('content', 'links-container', 'accordian-content', 'collpsable');

      const links = columnNode.querySelectorAll('[data-aue-model="footerLink"]');
      links.forEach((linkNode) => {
        const li = document.createElement('li');
        const link = linkNode.querySelector('[data-aue-prop="link"]');
        if (link) {
          li.append(link);
          moveInstrumentation(link, li);
        }
        linksContainer.append(li);
        moveInstrumentation(linkNode, li);
      });
      linkGridColumn.append(linksContainer);
      moveInstrumentation(columnNode.querySelector('ul'), linksContainer);

      if (index === 0) {
        linkGridColumn.classList.add('link-column-horizontal');
        linkColumnWrapper.append(linkGridColumn);
        colLg3.append(linkColumnWrapper);
        linkGridContainer.append(colLg3);
        moveInstrumentation(columnNode, colLg3);
      } else {
        linkGridColumn.classList.add('link-column-vertical');
        linkColumnWrapper.append(linkGridColumn);
        const colDiv = document.createElement('div');
        colDiv.classList.add('col-lg-4', 'link-column-container', 'column', `column-${index}`);
        colDiv.append(linkColumnWrapper);
        colLg6.append(colDiv);
        moveInstrumentation(columnNode, colDiv);
      }
    });
    linkGridContainer.append(colLg6);
  }

  const contactSection = document.createElement('div');
  contactSection.classList.add('section', 'arena', 'footer-center-section', 'contact-container', 'column', 'column-4', 'collpsable', 'hide__section', 'contact-section', 'col-lg-3');

  const contactLinks = block.querySelectorAll('.default-content-wrapper p.button-container');
  contactLinks.forEach((p) => {
    contactSection.append(p);
    moveInstrumentation(p, contactSection);
  });
  const disclaimerText = block.querySelector('.default-content-wrapper p:last-child');
  if (disclaimerText) {
    contactSection.append(disclaimerText);
    moveInstrumentation(disclaimerText, contactSection);
  }

  const footerContacts = block.querySelectorAll('[data-aue-model="footerContact"]');
  footerContacts.forEach((contactNode, index) => {
    const contactWrapper = document.createElement('div');
    contactWrapper.classList.add('contact-wrapper');
    if (index === 2) {
      contactWrapper.classList.add('qr-code');
    }

    const contactBlock = document.createElement('div');
    contactBlock.classList.add('contact', 'block');

    const contactWrpArena = document.createElement('div');
    contactWrpArena.classList.add('contact_wrp_arena', 'user__contact');
    if (index === 0) {
      contactWrpArena.classList.add('header');
    }

    const title = contactNode.querySelector('[data-aue-prop="title"]');
    if (title) {
      title.classList.add('user__contact-title');
      contactWrpArena.append(title);
      moveInstrumentation(title, contactWrpArena);
    }

    const userContactIcons = document.createElement('div');
    userContactIcons.classList.add('user__contact__icons');

    const icons = contactNode.querySelectorAll('[data-aue-model="footerContactIcon"]');
    icons.forEach((iconNode) => {
      const link = iconNode.querySelector('[data-aue-prop="url"]');
      const iconImg = iconNode.querySelector('[data-aue-prop="icon"]');
      const altText = iconNode.querySelector('[data-aue-prop="alt"]');

      if (link && iconImg) {
        const a = document.createElement('a');
        a.href = link.href;
        a.target = link.target;
        if (link.rel) a.rel = link.rel;
        a.classList.add('user__contact--icon', 'out-default');
        a.title = link.title || altText?.textContent || '';

        const srOnlySpan = document.createElement('span');
        srOnlySpan.classList.add('sr-only');
        srOnlySpan.textContent = altText?.textContent || '';
        a.append(srOnlySpan);

        const picture = createOptimizedPicture(iconImg.src, iconImg.alt);
        a.append(picture);
        moveInstrumentation(iconImg, picture);
        moveInstrumentation(link, a);

        userContactIcons.append(a);
        moveInstrumentation(iconNode, a);
      }
    });
    contactWrpArena.append(userContactIcons);
    contactBlock.append(contactWrpArena);
    contactWrapper.append(contactBlock);
    contactSection.append(contactWrapper);
    moveInstrumentation(contactNode, contactWrapper);
  });
  footerWrapper.append(contactSection);
  moveInstrumentation(block.querySelector('.section.arena.footer-center-section'), contactSection);

  const footerDisclaimerSection = document.createElement('div');
  footerDisclaimerSection.classList.add('section', 'arena', 'footer-popup-section', 'column', 'column-5', 'collpsable', 'hide__section');

  const disclaimers = block.querySelectorAll('[data-aue-model="footerDisclaimer"]');
  disclaimers.forEach((disclaimerNode) => {
    const disclaimerContent = disclaimerNode.querySelector('[data-aue-prop="disclaimer"]');
    if (disclaimerContent) {
      footerDisclaimerSection.append(disclaimerContent);
      moveInstrumentation(disclaimerContent, footerDisclaimerSection);
    }
    moveInstrumentation(disclaimerNode, footerDisclaimerSection);
  });
  footerWrapper.append(footerDisclaimerSection);
  moveInstrumentation(block.querySelector('.section.arena.footer-popup-section'), footerDisclaimerSection);

  const footerBottomSection = document.createElement('div');
  footerBottomSection.classList.add('row', 'footer-bottom-section', 'col-sm-12');

  const columnsWrapper = document.createElement('div');
  columnsWrapper.classList.add('columns-wrapper');

  const columnsBlock = document.createElement('div');
  columnsBlock.classList.add('columns', 'block', 'columns-1-cols');

  const div1 = document.createElement('div');
  const div2 = document.createElement('div');

  const notes = block.querySelectorAll('[data-aue-model="footerNote"]');
  notes.forEach((noteNode) => {
    const noteContent = noteNode.querySelector('[data-aue-prop="note"]');
    if (noteContent) {
      div2.append(noteContent);
      moveInstrumentation(noteContent, div2);
    }
    moveInstrumentation(noteNode, div2);
  });

  div1.append(div2);
  columnsBlock.append(div1);
  columnsWrapper.append(columnsBlock);
  footerBottomSection.append(columnsWrapper);
  footerWrapper.append(footerBottomSection);
  moveInstrumentation(block.querySelector('.row.footer-bottom-section'), footerBottomSection);

  block.textContent = '';
  block.append(footerWrapper);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
