import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, parentRow) {
  rootUl.querySelectorAll('li').forEach((li) => {
    moveInstrumentation(parentRow, li); // Instrument each LI as part of the parent row
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Apply classes from original HTML to nested elements
    li.classList.add('list-item'); // Assuming a generic list item class if not specified
    if (anchor) {
      anchor.classList.add('nav-link'); // Assuming nav-link for nested anchors
    }

    if (!anchor) {
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
      nested.remove(); // Remove the original nested UL to re-wrap it
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-sub-child'); // Class from original HTML if available, or generic
      subWrap.append(nested);
      li.append(subWrap);

      // Recursively transform nested lists
      transformNestedLists(nested, parentRow); // Pass parentRow for instrumentation

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
  rootUl.classList.add('nav-menu'); // Assuming a class for the overall nested menu
}

export default function decorate(block) {
  const children = [...block.children];

  const [
    logoRow,
    logoLinkRow,
    brandNameRow,
    newsletterTitleRow,
    newsletterDescriptionRow,
    newsletterFormActionRow,
    newsletterPlaceholderRow,
    newsletterButtonLabelRow,
    usefulLinksTitleRow,
    servicesLinksTitleRow,
    copyrightRow,
    ...itemRows
  ] = children;

  const root = document.createElement('footer');
  const container = document.createElement('div');
  container.classList.add('container');
  root.append(container);

  const row = document.createElement('div');
  row.classList.add('row', 'gy-5');
  container.append(row);

  // Column 1: Logo, Brand Name, Newsletter
  const col1 = document.createElement('div');
  col1.classList.add('col-lg-6', 'col-12');
  row.append(col1);

  const footerLogoLink = document.createElement('a');
  footerLogoLink.classList.add('footer-logo', 'd-flex', 'align-items-center');
  moveInstrumentation(logoLinkRow, footerLogoLink);
  footerLogoLink.href = logoLinkRow.querySelector('a')?.href || '#';

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
    moveInstrumentation(logoRow, optimizedPic.querySelector('img')); // Instrument the picture row to the img
    footerLogoLink.append(optimizedPic);
  }

  const brandName = document.createElement('h2');
  moveInstrumentation(brandNameRow, brandName);
  brandName.textContent = brandNameRow.textContent.trim();
  footerLogoLink.append(brandName);
  col1.append(footerLogoLink);

  const newsletterTitle = document.createElement('h3');
  moveInstrumentation(newsletterTitleRow, newsletterTitle);
  newsletterTitle.textContent = newsletterTitleRow.textContent.trim();
  col1.append(newsletterTitle);

  const newsletterDescription = document.createElement('p');
  moveInstrumentation(newsletterDescriptionRow, newsletterDescription);
  newsletterDescription.textContent = newsletterDescriptionRow.textContent.trim();
  col1.append(newsletterDescription);

  const newsletterForm = document.createElement('form');
  newsletterForm.classList.add('d-flex', 'flex-wrap');
  moveInstrumentation(newsletterFormActionRow, newsletterForm);
  newsletterForm.action = newsletterFormActionRow.querySelector('a')?.href || '#';
  newsletterForm.method = 'post'; // Assuming method is post from original HTML

  // CSRF token should ideally be dynamic or authored, not hardcoded.
  // For now, removing the hardcoded value. If needed, it should come from a block field.
  // const csrfInput = document.createElement('input');
  // csrfInput.type = 'hidden';
  // csrfInput.name = 'csrfmiddlewaretoken';
  // csrfInput.value = 'JrOIrSqJbHUJs8V71N195BEnl35I0hmL883k9wJS5qjGbOxM9XIaGgnxwUuJ3BSw';
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
  col1.append(newsletterForm);

  // Separate item rows into useful links and service links based on their position in the block model
  const usefulLinksItems = [];
  const serviceLinksItems = [];

  // Assuming footer-link-item (3 cells) comes before footer-service-item (2 cells)
  itemRows.forEach((itemRow) => {
    if (itemRow.children.length === 3) {
      usefulLinksItems.push(itemRow);
    } else if (itemRow.children.length === 2) {
      serviceLinksItems.push(itemRow);
    }
  });

  // Column 2: Useful Links
  const col2 = document.createElement('div');
  col2.classList.add('col-lg-3', 'col-6');
  row.append(col2);

  const usefulLinksTitle = document.createElement('h5');
  moveInstrumentation(usefulLinksTitleRow, usefulLinksTitle);
  usefulLinksTitle.textContent = usefulLinksTitleRow.textContent.trim();
  col2.append(usefulLinksTitle);

  const usefulLinksList = document.createElement('ul');
  usefulLinksList.classList.add('d-flex', 'flex-column', 'useful-links-list');
  col2.append(usefulLinksList);

  usefulLinksItems.forEach((itemRow) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...itemRow.children];
    const li = document.createElement('li');
    moveInstrumentation(itemRow, li); // Instrument the itemRow to the li

    const subListContent = hierarchyTreeCell?.innerHTML || '';
    if (subListContent.includes('<ul')) {
      // This item has a nested hierarchy
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = subListContent;
      const subList = tempDiv.querySelector('ul');

      if (subList) {
        const triggerLink = document.createElement('a');
        triggerLink.href = linkCell?.querySelector('a')?.href || '#';
        triggerLink.textContent = labelCell.textContent.trim();
        li.append(triggerLink);

        const subLinksWrapper = document.createElement('div');
        subLinksWrapper.classList.add('has-sub-child'); // Using a generic class for nested content
        transformNestedLists(subList, itemRow); // Transform nested lists within this subList, passing itemRow for instrumentation
        subLinksWrapper.append(subList);
        li.append(subLinksWrapper);

        triggerLink.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subLinksWrapper.classList.toggle('active');
        });
      }
    } else {
      // Simple link
      const link = document.createElement('a');
      link.href = linkCell?.querySelector('a')?.href || '#';
      link.textContent = labelCell.textContent.trim();
      li.append(link);
    }
    usefulLinksList.append(li);
  });

  // Column 3: Our Services
  const col3 = document.createElement('div');
  col3.classList.add('col-lg-3', 'col-6');
  row.append(col3);

  const servicesLinksTitle = document.createElement('h5');
  moveInstrumentation(servicesLinksTitleRow, servicesLinksTitle);
  servicesLinksTitle.textContent = servicesLinksTitleRow.textContent.trim();
  col3.append(servicesLinksTitle);

  const servicesLinksList = document.createElement('ul');
  servicesLinksList.classList.add('d-flex', 'flex-column', 'useful-links-list'); // Reusing class from original HTML
  col3.append(servicesLinksList);

  serviceLinksItems.forEach((itemRow) => {
    const [labelCell, linkCell] = [...itemRow.children];
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = linkCell?.querySelector('a')?.href || '#';
    link.textContent = labelCell.textContent.trim();
    li.append(link);
    moveInstrumentation(itemRow, li);
    servicesLinksList.append(li);
  });

  // Copyright
  const copyright = document.createElement('h5');
  copyright.classList.add('text-center', 'mt-6');
  moveInstrumentation(copyrightRow, copyright);
  copyright.textContent = copyrightRow.textContent.trim();
  root.append(copyright);

  block.replaceChildren(root);
}
