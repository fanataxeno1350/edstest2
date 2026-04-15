import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [logoRow, logoLinkRow, navHierarchyRow, copyrightRow, ...socialLinkRows] = children;

  const container = document.createElement('div');
  container.classList.add('container');

  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  const logoLink = document.createElement('a');
  const originalLogoLink = logoLinkRow.querySelector('a');
  if (originalLogoLink) {
    logoLink.href = originalLogoLink.href;
    moveInstrumentation(originalLogoLink, logoLink);
  }

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      optimizedPic.querySelector('img').classList.add('hiddenlogo1');
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  logoDiv.append(logoLink);
  logoCol.append(logoDiv);
  footerHeader.append(logoCol);

  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');

  const socialUl = document.createElement('ul');
  socialUl.classList.add('social-wrap');

  socialLinkRows.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const iconCell = row.querySelector('picture');
    const linkCell = row.querySelector('a');

    if (iconCell && linkCell) {
      const link = document.createElement('a');
      link.href = linkCell.href;
      link.target = '_blank'; // Assuming social links open in new tab

      const img = iconCell.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]); // Adjust width as needed
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        link.append(optimizedPic);
      }
      li.append(link);

      // Add specific classes for social icons if detectable (e.g., from alt text or href)
      const iconName = img?.alt?.toLowerCase();
      if (iconName?.includes('facebook')) li.classList.add('fb');
      else if (iconName?.includes('twitter')) li.classList.add('tw');
      else if (iconName?.includes('instagram')) li.classList.add('inst');
      else if (iconName?.includes('youtube')) li.classList.add('yt');
      else if (iconName?.includes('linkedin')) li.classList.add('in');
    }
    socialUl.append(li);
  });
  socialCol.append(socialUl);
  footerHeader.append(socialCol);
  container.append(footerHeader);

  // Navigation Hierarchy
  function parseNavTree(ul) {
    return [...ul.querySelectorAll(':scope > li')].map((li) => {
      let labelElement = null;
      let linkHref = null;
      const children = [];

      for (const node of li.childNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'A') {
            labelElement = node.cloneNode(true); // Keep the link structure
            linkHref = node.href;
          } else if (node.tagName === 'UL') {
            children.push(...parseNavTree(node));
          } else if (node.tagName !== 'UL') { // Handle other elements like <span> or <p> if they exist
            if (!labelElement) { // If no link, just get text content
              labelElement = document.createElement('span');
              labelElement.innerHTML = node.outerHTML;
            }
          }
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
          if (!labelElement) { // If no link or other element, just get text content
            labelElement = document.createElement('span');
            labelElement.textContent = node.textContent.trim();
          }
        }
      }

      // If no explicit label element was found, but there's text content in the li, create a span
      if (!labelElement && li.textContent.trim() !== '') {
        labelElement = document.createElement('span');
        labelElement.textContent = li.textContent.trim().split('\n')[0]; // Take first line as label
      }

      return { labelElement, linkHref, children };
    });
  }

  function renderNavItems(items, parentContainer, isRoot = false) {
    items.forEach((item) => {
      const li = document.createElement('li');
      const labelContent = item.labelElement || document.createElement('span'); // Fallback if labelElement is null

      if (item.children.length > 0) {
        // Parent item with children
        const headDiv = document.createElement('div');
        headDiv.classList.add('head');

        const spanWrapper = document.createElement('span');
        if (item.linkHref) {
          const link = document.createElement('a');
          link.href = item.linkHref;
          link.innerHTML = labelContent.innerHTML; // Use innerHTML to preserve any nested structure like <img>
          spanWrapper.append(link);
        } else {
          spanWrapper.append(labelContent);
        }

        const toggle = document.createElement('small');
        toggle.setAttribute('data-once', 'footerMobileInner');
        toggle.setAttribute('aria-expanded', 'false');

        const submenu = document.createElement('ul');
        submenu.classList.add('footer-inner-list');

        renderNavItems(item.children, submenu); // RECURSIVE call

        toggle.addEventListener('click', () => {
          const isOpen = toggle.getAttribute('aria-expanded') === 'true';
          toggle.setAttribute('aria-expanded', !isOpen);
          submenu.classList.toggle('show');
        });

        spanWrapper.append(toggle);
        headDiv.append(spanWrapper); // Append spanWrapper to headDiv
        li.append(headDiv, submenu); // Append headDiv and submenu to li
        li.classList.add('link-blocks'); // Apply link-blocks to the parent li
      } else {
        // Leaf item
        if (item.linkHref) {
          const link = document.createElement('a');
          link.href = item.linkHref;
          link.innerHTML = labelContent.innerHTML;
          li.append(link);
        } else {
          li.append(labelContent);
        }
      }
      parentContainer.append(li);
    });
  }

  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');

  const textCell = navHierarchyRow?.querySelector('div');
  const temp = document.createElement('div');
  temp.innerHTML = textCell?.innerHTML ?? '';
  const rootUl = temp.querySelector('ul');
  const navItems = rootUl ? parseNavTree(rootUl) : [];

  const navContainer = document.createElement('div'); // This will hold the top-level link-blocks
  navItems.forEach(item => {
    const linkBlock = document.createElement('div');
    linkBlock.classList.add('link-blocks');

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');

    const spanWrapper = document.createElement('span');
    if (item.linkHref) {
      const labelLink = document.createElement('a');
      labelLink.href = item.linkHref;
      labelLink.innerHTML = item.labelElement.innerHTML;
      spanWrapper.append(labelLink);
    } else {
      spanWrapper.append(item.labelElement);
    }

    if (item.children.length > 0) {
      const toggle = document.createElement('small');
      toggle.setAttribute('data-once', 'footerMobileInner');
      toggle.setAttribute('aria-expanded', 'false');

      const submenu = document.createElement('ul');
      submenu.classList.add('footer-inner-list');
      renderNavItems(item.children, submenu);

      toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isOpen);
        submenu.classList.toggle('show');
      });
      spanWrapper.append(toggle);
      headDiv.append(spanWrapper, submenu); // Append submenu directly to headDiv
    } else {
      headDiv.append(spanWrapper);
    }
    linkBlock.append(headDiv);
    footerMenu.append(linkBlock);
  });

  footerMenuCol.append(footerMenu);
  footerMenuBox.append(footerMenuCol);
  container.append(footerMenuBox);

  // Copyright section
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  // The EDS block structure doesn't provide explicit fields for secondary nav links,
  // so we'll omit them for now as per the prompt's focus on provided fields.
  // If they were in the richtext, we'd parse them.
  // Based on ORIGINAL HTML, secondary nav is a separate <ul> within this col.
  const originalSecondaryNavUl = copyrightRow.querySelector('ul.secondary-nav');
  if (originalSecondaryNavUl) {
    const secondaryNavUl = originalSecondaryNavUl.cloneNode(true);
    secondaryNavCol.append(secondaryNavUl);
  }


  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  const copyrightDiv = copyrightRow.querySelector('div');
  if (copyrightDiv) {
    moveInstrumentation(copyrightDiv, copyrightTextCol);
    // Ensure only the text content is taken, not the secondary nav if it was accidentally parsed here
    const pTag = copyrightDiv.querySelector('p');
    if (pTag) {
      copyrightTextCol.innerHTML = pTag.innerHTML;
    } else {
      copyrightTextCol.innerHTML = copyrightDiv.innerHTML;
    }
  }
  copyrightWrap.append(secondaryNavCol, copyrightTextCol);
  container.append(copyrightWrap);

  block.textContent = '';
  block.classList.add('footer-main'); // Add the main footer class to the block itself
  block.append(container);
}
