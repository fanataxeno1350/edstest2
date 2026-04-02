import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Identify the legal text row first, as it's a single field, not an item list.
  // It's the only row that contains just text content and no links or pictures,
  // and is typically the first or second row in the block.
  const legalTextRow = children.find((row) => row.children.length === 1 && !row.querySelector('a') && !row.querySelector('picture'));

  // Filter items based on structure and content
  const footerNavItems = children.filter((row) => row.children.length === 1 && row.querySelector('a') && row !== legalTextRow);
  const languageItems = children.filter((row) => row.children.length === 1 && row.querySelector('a') && row !== legalTextRow && !footerNavItems.includes(row));
  const socialItems = children.filter((row) => row.children.length === 3 && row.querySelector('picture') && row.querySelector('a'));
  const legalLinks = children.filter((row) => row.children.length === 1 && row.querySelector('a') && row !== legalTextRow && !footerNavItems.includes(row) && !languageItems.includes(row));
  const endPolioItems = children.filter((row) => row.children.length === 2 && row.querySelector('picture') && row.querySelector('a'));

  block.textContent = '';
  block.classList.add('site-footer');
  block.setAttribute('aria-label', 'site footer');

  const container = document.createElement('div');
  container.classList.add('layout-container', '-padding-reduced', 'u-text-centered', 'u-container');
  block.append(container);

  // Footer Navigation
  if (footerNavItems.length > 0) {
    const footerNavUl = document.createElement('ul');
    footerNavUl.classList.add('site-footer-nav');
    footerNavItems.forEach((row) => {
      const li = document.createElement('li');
      moveInstrumentation(row, li);
      li.classList.add('site-footer-nav-item');
      const link = row.querySelector('a');
      if (link) {
        const newLink = document.createElement('a');
        newLink.href = link.href;
        newLink.textContent = link.textContent;
        li.append(newLink);
      }
      footerNavUl.append(li);
    });
    container.append(footerNavUl);
  }

  // Language Navigation
  if (languageItems.length > 0) {
    const languageNavUl = document.createElement('ul');
    languageNavUl.classList.add('site-footer-nav', '-language-switcher');

    // Contact Us link (first language item)
    const contactUsRow = languageItems[0];
    if (contactUsRow) {
      const li = document.createElement('li');
      moveInstrumentation(contactUsRow, li);
      li.classList.add('site-footer-nav-item');
      const link = contactUsRow.querySelector('a');
      if (link) {
        const strong = document.createElement('strong');
        strong.textContent = link.textContent;
        const newLink = document.createElement('a');
        newLink.href = link.href;
        newLink.append(strong);
        li.append(newLink);
      }
      languageNavUl.append(li);
    }

    // Language switcher dropdown
    if (languageItems.length > 1) {
      const dropdownLi = document.createElement('li');
      dropdownLi.classList.add('site-footer-nav-item', '-margin-reduced');
      const linkDropdown = document.createElement('div');
      linkDropdown.classList.add('link-dropdown');
      linkDropdown.setAttribute('data-module', 'link-dropdown');
      linkDropdown.setAttribute('data-features', 'position-up');
      linkDropdown.setAttribute('data-language', '{"label":"Change Language"}');
      linkDropdown.setAttribute('data-is', 'closed');

      const toggleButton = document.createElement('button');
      toggleButton.classList.add('link-dropdown-toggle');
      toggleButton.setAttribute('aria-expanded', 'false');
      toggleButton.setAttribute('aria-controls', 'change-language-dropdown');
      toggleButton.textContent = 'Change Language';

      const dropdownList = document.createElement('ul');
      dropdownList.classList.add('link-dropdown-list');
      dropdownList.setAttribute('data-dropdown-list', '');
      dropdownList.id = 'change-language-dropdown';

      languageItems.slice(1).forEach((row) => { // Skip the first item (Contact Us)
        const li = document.createElement('li');
        moveInstrumentation(row, li);
        li.classList.add('link-dropdown-item');
        const link = row.querySelector('a');
        if (link) {
          const newLink = document.createElement('a');
          newLink.href = link.href;
          newLink.textContent = link.textContent;
          newLink.setAttribute('tabindex', '-1');
          li.append(newLink);
        }
        dropdownList.append(li);
      });

      toggleButton.addEventListener('click', () => {
        const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
        toggleButton.setAttribute('aria-expanded', !isExpanded);
        linkDropdown.setAttribute('data-is', isExpanded ? 'closed' : 'open');
        dropdownList.classList.toggle('show'); // Original HTML doesn't show 'show' class, but this is common for dropdowns
      });

      linkDropdown.append(toggleButton, dropdownList);
      dropdownLi.append(linkDropdown);
      languageNavUl.append(dropdownLi);
    }
    container.append(languageNavUl);
  }

  // Social Navigation
  if (socialItems.length > 0) {
    const socialUl = document.createElement('ul');
    socialUl.classList.add('site-footer-social');
    socialItems.forEach((row) => {
      const li = document.createElement('li');
      moveInstrumentation(row, li);
      const linkEl = document.createElement('a');

      const cells = [...row.children];
      const linkCell = cells.find(cell => cell.querySelector('a'));
      const iconCell = cells.find(cell => cell.querySelector('picture'));
      const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture'));

      if (linkCell) {
        const foundLink = linkCell.querySelector('a');
        if (foundLink) {
          linkEl.href = foundLink.href;
        }
      }

      if (iconCell) {
        const picture = iconCell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          if (img) {
            const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '80' }]);
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            linkEl.append(optimizedPic);
          }
        }
      }

      if (labelCell) {
        const labelSpan = document.createElement('span');
        labelSpan.classList.add('a11y-sr-only');
        labelSpan.textContent = labelCell.textContent.trim();
        linkEl.append(labelSpan);
      }
      li.append(linkEl);
      socialUl.append(li);
    });
    container.append(socialUl);
  }

  // Legal Text
  if (legalTextRow) {
    const legalP = document.createElement('p');
    moveInstrumentation(legalTextRow, legalP);
    legalP.classList.add('site-footer-legal');
    // Append all child nodes from the original legalTextRow to legalP
    while (legalTextRow.firstChild) {
      legalP.append(legalTextRow.firstChild);
    }
    container.append(legalP);

    // Legal Links
    legalLinks.forEach((row) => {
      const link = row.querySelector('a');
      if (link) {
        const newLink = document.createElement('a');
        newLink.href = link.href;
        newLink.textContent = link.textContent;
        legalP.append(newLink);
      }
      moveInstrumentation(row, legalP);
    });
  }

  // End Polio
  if (endPolioItems.length > 0) {
    endPolioItems.forEach((row) => {
      const p = document.createElement('p');
      moveInstrumentation(row, p);

      const cells = [...row.children];
      const linkCell = cells.find(cell => cell.querySelector('a'));
      const imageCell = cells.find(cell => cell.querySelector('picture'));

      if (linkCell && imageCell) {
        const link = linkCell.querySelector('a');
        const picture = imageCell.querySelector('picture');

        const linkEl = document.createElement('a');
        linkEl.href = link.href;

        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '80' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          linkEl.append(optimizedPic);
        }
        p.append(linkEl);
      }
      container.append(p);
    });
  }
}
