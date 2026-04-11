import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function parsePipeIndentTree(rawText) {
  const lines = rawText.split('\n').filter(line => line.trim() !== '');
  const root = { children: [] };
  const stack = [{ node: root, depth: -1 }];
  lines.forEach((line) => {
    const indent = line.match(/^(\s*)/)[1].length;
    const depth = Math.floor(indent / 2);
    const [label = '', href = '', icon = ''] = line.trim().split('|');
    const node = { label: label.trim(), href: href.trim(), icon: icon.trim(), children: [] };
    while (stack.length > 1 && stack[stack.length - 1].depth >= depth) stack.pop();
    stack[stack.length - 1].node.children.push(node);
    stack.push({ node, depth });
  });
  return root.children;
}

function renderNavItems(items, parentElement, isAccordion = false) {
  const ul = document.createElement('ul');
  ul.classList.add('content', 'links-container');
  if (isAccordion) {
    ul.classList.add('accordian-content', 'collpsable');
  }

  items.forEach((item) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = item.href;
    link.textContent = item.label;
    if (item.href.startsWith('http')) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    li.append(link);
    ul.append(li);

    if (item.children && item.children.length > 0) {
      li.append(renderNavItems(item.children, li, isAccordion));
    }
  });
  parentElement.append(ul);
  return ul;
}

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('corp-footer-wrapper');

  const footer = document.createElement('div');
  footer.classList.add('corp-footer', 'block', 'footer-wrapper', 'footer', 'g-container');
  moveInstrumentation(block, footer);

  const footerColumnsRow = document.createElement('div');
  footerColumnsRow.classList.add('row', 'footer__columns', 'footer__columns--collapsed', 'footer__link-grid-container');

  const colLg6 = document.createElement('div');
  colLg6.classList.add('col-lg-6', 'col-items');

  const contactContainer = document.createElement('div');
  contactContainer.classList.add('section', 'arena', 'footer-center-section', 'contact-container', 'column', 'column-4', 'collpsable', 'hide__section', 'contact-section');

  const footerBottomRow1 = document.createElement('div');
  footerBottomRow1.classList.add('row', 'footer-bottom-section', 'col-sm-12');

  const columnsContainer = document.createElement('div');
  columnsContainer.classList.add('section', 'arena', 'footer-bottom-section', 'row', 'columns-container');

  const footerBottomRow2 = document.createElement('div');
  footerBottomRow2.classList.add('row', 'footer-bottom-section', 'col-sm-12');

  const copyRightContainer = document.createElement('div');
  copyRightContainer.classList.add('section', 'row', 'copy-right-container');

  let linkColumnCounter = 0;
  let contactCounter = 0;
  let columnsCounter = 0;
  let copyRightCounter = 0;

  [...block.children].forEach((row) => {
    const cells = [...row.children];

    const headingCell = cells.find(cell => cell.textContent && !cell.querySelector('picture') && cells.length === 2);
    const linksCell = cells.find(cell => cell.querySelector('div') && cells.length === 2 && cell !== headingCell);
    const singleCell = cells.find(cell => cells.length === 1 && cell.querySelector('div') && !cell.querySelector('picture'));

    // Link-Column (2 cells, first cell is heading, second is richtext links)
    if (headingCell && linksCell && headingCell.textContent.trim() && linksCell.querySelector('div')) {
      const headingText = headingCell.textContent.trim();
      const rawHtml = linksCell.querySelector('div')?.innerHTML ?? '';
      const plainText = rawHtml.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
      const navItems = parsePipeIndentTree(plainText);

      const colLg3 = document.createElement('div');
      colLg3.classList.add('col-lg-3', 'link-column-container', 'column', `column-${linkColumnCounter}`);
      if (linkColumnCounter > 0) {
        colLg3.classList.add('col-lg-4');
        colLg6.append(colLg3);
      } else {
        footerColumnsRow.append(colLg3);
      }
      linkColumnCounter += 1;

      const linkColumnWrapper = document.createElement('div');
      linkColumnWrapper.classList.add('link-column-wrapper');
      colLg3.append(linkColumnWrapper);

      const linkColumnBlock = document.createElement('div');
      linkColumnBlock.classList.add('link-column', 'block');
      moveInstrumentation(row, linkColumnBlock);
      linkColumnWrapper.append(linkColumnBlock);

      const linkGridColumn = document.createElement('div');
      linkGridColumn.classList.add('link-grid-column');
      if (linkColumnCounter === 1) {
        linkGridColumn.classList.add('link-column-horizontal');
      } else {
        linkGridColumn.classList.add('link-column-vertical');
      }
      linkColumnBlock.append(linkGridColumn);

      const heading = document.createElement('h3');
      heading.classList.add('accordian-item', 'link-column__heading');
      heading.textContent = headingText;
      heading.id = headingText.toLowerCase().replace(/\s/g, '-');
      linkGridColumn.append(heading);

      const ul = renderNavItems(navItems, linkGridColumn, true);

      heading.addEventListener('click', () => {
        ul.classList.toggle('collpsable');
        heading.classList.toggle('active');
      });
    }

    // Contact (2 cells, first cell is title, second is richtext contact info)
    else if (headingCell && linksCell && headingCell.textContent.trim() && linksCell.querySelector('div')) { // Re-using headingCell/linksCell for contact
      const titleText = headingCell.textContent.trim();
      const rawHtml = linksCell.querySelector('div')?.innerHTML ?? '';
      const plainText = rawHtml.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
      const navItems = parsePipeIndentTree(plainText);

      if (contactCounter === 0) {
        const defaultContentWrapper = document.createElement('div');
        defaultContentWrapper.classList.add('default-content-wrapper');
        contactContainer.append(defaultContentWrapper);
      }

      const contactWrapper = document.createElement('div');
      contactWrapper.classList.add('contact-wrapper');
      if (contactCounter === 2) {
        contactWrapper.classList.add('qr-code');
      }
      contactContainer.append(contactWrapper);

      const contactBlock = document.createElement('div');
      contactBlock.classList.add('contact', 'block');
      moveInstrumentation(row, contactBlock);
      contactWrapper.append(contactBlock);

      const contactWrpArena = document.createElement('div');
      contactWrpArena.classList.add('contact_wrp_arena', 'user__contact');
      if (contactCounter === 0) {
        contactWrpArena.classList.add('header');
      }
      contactBlock.append(contactWrpArena);

      if (titleText) {
        const title = document.createElement('p');
        if (contactCounter === 0) {
          title.classList.add('button-container');
          const buttonLink = document.createElement('a');
          buttonLink.classList.add('button');
          buttonLink.href = titleText.includes('@') ? `mailto:${titleText}` : `tel:${titleText.replace(/\s/g, '')}`;
          buttonLink.title = titleText;
          buttonLink.textContent = titleText;
          title.append(buttonLink);
        } else {
          title.classList.add('user__contact-title');
          title.textContent = titleText;
        }
        contactWrpArena.append(title);
      }

      const userContactIcons = document.createElement('div');
      userContactIcons.classList.add('user__contact__icons');
      contactWrpArena.append(userContactIcons);

      navItems.forEach((item) => {
        const link = document.createElement('a');
        link.href = item.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.classList.add('user__contact--icon', 'out-default');
        link.title = item.label;

        const srOnly = document.createElement('span');
        srOnly.classList.add('sr-only');
        srOnly.textContent = item.label;
        link.append(srOnly);

        if (item.icon) {
          const img = document.createElement('img');
          img.src = item.icon;
          img.alt = item.label;
          img.loading = 'lazy';
          link.append(img);
        }
        userContactIcons.append(link);
      });

      const hiddenContactToggleBox = document.createElement('div');
      hiddenContactToggleBox.classList.add('hidden', 'contact-toggle-box');
      const userContactIconCallContainer = document.createElement('div');
      userContactIconCallContainer.classList.add('user__contact__icon-call_container');
      const primaryTelephone = document.createElement('a');
      primaryTelephone.classList.add('primary-telephone');
      primaryTelephone.href = 'tel:undefined'; // Placeholder, actual value not in model
      primaryTelephone.textContent = 'undefined'; // Placeholder
      const secondaryTelephone = document.createElement('a');
      secondaryTelephone.classList.add('secondary-telephone');
      secondaryTelephone.href = 'tel:undefined'; // Placeholder
      secondaryTelephone.textContent = 'undefined'; // Placeholder
      userContactIconCallContainer.append(primaryTelephone, secondaryTelephone);
      hiddenContactToggleBox.append(userContactIconCallContainer);
      contactWrpArena.append(hiddenContactToggleBox);

      // Add event listener for the contact toggle box if it exists in the original HTML
      const contactToggleBoxElement = contactWrpArena.querySelector('.contact-toggle-box');
      if (contactToggleBoxElement) {
        // Assuming there's a trigger element for this toggle, e.g., an icon or button
        // For now, let's assume the .user__contact__icons itself might trigger it, or a specific icon within it.
        // Based on the original HTML, there isn't an explicit trigger for 'hidden contact-toggle-box'
        // If there was a button like `<button class="toggle-contact-details">...</button>`
        // we would add an event listener to that.
        // For now, adding a placeholder listener to the contactWrpArena itself for demonstration,
        // but this would need to be refined based on actual UX.
        // contactWrpArena.addEventListener('click', () => {
        //   hiddenContactToggleBox.classList.toggle('hidden');
        // });
      }

      contactCounter += 1;
    }

    // Columns (1 cell, richtext)
    else if (singleCell) {
      const rawHtml = singleCell.querySelector('div')?.innerHTML ?? '';

      if (columnsCounter === 0) {
        const columnsWrapper = document.createElement('div');
        columnsWrapper.classList.add('columns-wrapper');
        columnsContainer.append(columnsWrapper);

        const columnsBlock = document.createElement('div');
        columnsBlock.classList.add('columns', 'block', 'columns-1-cols');
        moveInstrumentation(row, columnsBlock);
        columnsWrapper.append(columnsBlock);

        const div = document.createElement('div');
        columnsBlock.append(div);
        const innerDiv = document.createElement('div');
        div.append(innerDiv);
        innerDiv.innerHTML = rawHtml;
      }
      columnsCounter += 1;
    }

    // Copy-Right (2 cells, first cell is text, second is richtext links)
    else if (headingCell && linksCell && headingCell.textContent.trim() && linksCell.querySelector('div')) { // Re-using headingCell/linksCell for copy-right
      const copyRightText = headingCell.textContent.trim();
      const rawHtml = linksCell.querySelector('div')?.innerHTML ?? '';
      const plainText = rawHtml.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
      const navItems = parsePipeIndentTree(plainText);

      if (copyRightCounter === 0) {
        const copyRightWrapper = document.createElement('div');
        copyRightWrapper.classList.add('copy-right-wrapper');
        copyRightContainer.append(copyRightWrapper);

        const copyRightBlock = document.createElement('div');
        copyRightBlock.classList.add('copy-right', 'block');
        moveInstrumentation(row, copyRightBlock);
        copyRightWrapper.append(copyRightBlock);

        const innerCopyRightWrapper = document.createElement('div');
        innerCopyRightWrapper.classList.add('copy-right-wrapper');
        copyRightBlock.append(innerCopyRightWrapper);

        const copyRightTextDiv = document.createElement('div');
        copyRightTextDiv.classList.add('copy-right-text');
        copyRightTextDiv.textContent = copyRightText;
        innerCopyRightWrapper.append(copyRightTextDiv);

        const linkSection = document.createElement('div');
        linkSection.classList.add('link-section');
        navItems.forEach((item) => {
          const link = document.createElement('a');
          link.href = item.href;
          link.textContent = item.label;
          if (item.href.startsWith('http')) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
          }
          linkSection.append(link);
        });
        innerCopyRightWrapper.append(linkSection);
      }
      copyRightCounter += 1;
    }
  });

  footerColumnsRow.append(colLg6);
  footer.append(footerColumnsRow);
  footer.append(contactContainer);
  footerBottomRow1.append(columnsContainer);
  footer.append(footerBottomRow1);
  footerBottomRow2.append(copyRightContainer);
  footer.append(footerBottomRow2);
  wrapper.append(footer);

  block.textContent = '';
  block.append(wrapper);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
