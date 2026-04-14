import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [logoRow, logoLinkRow, textRow, ...socialLinkRows] = [...block.children];

  // Create the main footer structure
  const footerMain = document.createElement('footer');
  footerMain.classList.add('footer-main');

  const container = document.createElement('div');
  container.classList.add('container');
  footerMain.append(container);

  // --- Footer Header (Logo and Social Links) ---
  const footerHeaderRow = document.createElement('div');
  footerHeaderRow.classList.add('row', 'footer-header');
  container.append(footerHeaderRow);

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  footerHeaderRow.append(logoCol);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  logoCol.append(logoDiv);

  const logoLink = document.createElement('a');
  const authoredLogoLink = logoLinkRow.querySelector('a');
  if (authoredLogoLink) {
    logoLink.href = authoredLogoLink.href;
    moveInstrumentation(logoLinkRow, logoLink);
  }

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  logoDiv.append(logoLink);

  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeaderRow.append(socialCol);

  const socialUl = document.createElement('ul');
  socialUl.classList.add('social-wrap');
  socialCol.append(socialUl);

  socialLinkRows.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const cells = [...row.children];
    const iconCell = cells.find((cell) => cell.querySelector('picture'));
    const linkCell = cells.find((cell) => cell.querySelector('a'));

    if (iconCell && linkCell) {
      const link = document.createElement('a');
      const authoredLink = linkCell.querySelector('a');
      if (authoredLink) {
        link.href = authoredLink.href;
        link.target = '_blank'; // Assuming social links open in new tab
      }

      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '30' }]); // Adjust width as needed
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        link.append(optimizedPic);
      }
      li.append(link);

      // Add specific classes based on content if needed, e.g., 'fb', 'tw'
      // This would require more sophisticated content detection or specific model fields
      // For now, just add a generic class if no specific one can be inferred.
      if (link.href.includes('facebook')) li.classList.add('fb');
      if (link.href.includes('twitter')) li.classList.add('tw');
      if (link.href.includes('instagram')) li.classList.add('inst');
      if (link.href.includes('youtube')) li.classList.add('yt');
      if (link.href.includes('linkedin')) li.classList.add('in');
    }
    socialUl.append(li);
  });

  // --- Footer Menu (Navigation Hierarchy) ---
  const footerMenuRow = document.createElement('div');
  footerMenuRow.classList.add('row', 'footer-menu-box');
  container.append(footerMenuRow);

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  footerMenuRow.append(footerMenuCol);

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');
  footerMenuCol.append(footerMenu);

  function parseNavTree(ul) {
    return [...ul.querySelectorAll(':scope > li')].map((li) => {
      let labelHtml = '';
      for (const node of li.childNodes) {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'UL') {
          // Skip nested ULs when extracting label
          continue;
        }
        labelHtml += node.outerHTML || node.textContent;
      }
      labelHtml = labelHtml.trim();

      const childUl = li.querySelector(':scope > ul');
      return { label: labelHtml, children: childUl ? parseNavTree(childUl) : [] };
    });
  }

  function renderNavItems(items, parentContainer, depth = 0) {
    items.forEach((item) => {
      const linkBlocks = document.createElement('div');
      linkBlocks.classList.add('link-blocks');

      const head = document.createElement('div');
      head.classList.add('head');
      linkBlocks.append(head);

      const span = document.createElement('span');
      head.append(span);

      // Use a temp div to parse the label HTML, which might contain an <a> tag
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = item.label;
      const linkInLabel = tempDiv.querySelector('a');

      if (linkInLabel) {
        const a = document.createElement('a');
        a.href = linkInLabel.href;
        a.textContent = linkInLabel.textContent;
        if (linkInLabel.target) a.target = linkInLabel.target;
        span.append(a);
      } else {
        span.textContent = item.label;
      }

      if (item.children.length > 0) {
        const smallToggle = document.createElement('small');
        smallToggle.setAttribute('data-once', 'footerMobileInner'); // From original HTML
        span.append(smallToggle);

        const ul = document.createElement('ul');
        ul.classList.add('footer-inner-list'); // From original HTML

        // RECURSIVE rendering for children
        renderNavItems(item.children, ul, depth + 1);
        head.append(ul);

        // Add toggle behavior for the head span
        smallToggle.addEventListener('click', () => {
          ul.classList.toggle('show'); // Or a class that shows/hides the submenu
          smallToggle.classList.toggle('active'); // Example: add an active class to the toggle
        });
      }
      parentContainer.append(linkBlocks);
    });
  }

  const textCell = textRow?.querySelector('div');
  const temp = document.createElement('div');
  temp.innerHTML = textCell?.innerHTML ?? '';
  const rootUl = temp.querySelector('ul');
  const navItems = rootUl ? parseNavTree(rootUl) : [];

  renderNavItems(navItems, footerMenu);


  // --- Copyright Section ---
  const copyrightRow = document.createElement('div');
  copyrightRow.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightRow);

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  copyrightRow.append(secondaryNavCol);

  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');
  secondaryNavCol.append(secondaryNavUl);

  // Extract secondary nav links from the original HTML structure if available
  // Assuming the secondary nav links are part of the original HTML and not dynamic from EDS
  const originalSecondaryNav = document.querySelector('.secondary-nav');
  if (originalSecondaryNav) {
    [...originalSecondaryNav.children].forEach((originalLi) => {
      const li = document.createElement('li');
      const a = originalLi.querySelector('a');
      if (a) {
        const newA = document.createElement('a');
        newA.href = a.href;
        newA.textContent = a.textContent;
        if (a.target) newA.target = a.target;
        li.append(newA);
      } else {
        li.textContent = originalLi.textContent;
      }
      secondaryNavUl.append(li);
    });
  } else {
    // Fallback to hardcoded if not found in original HTML (though it should be)
    const secondaryLinks = [
      { label: 'Terms of use', href: 'https://www.mahindra.com/terms-of-use' },
      { label: 'Disclaimer', href: 'https://www.mahindra.com/disclaimer' },
      { label: 'Privacy Policy', href: 'https://www.mahindra.com/privacy-policy' },
      { label: 'Sitemap', href: 'https://www.mahindra.com/sitemap' },
      { label: 'Contact Us', href: 'https://www.mahindra.com/contact-us' },
    ];

    secondaryLinks.forEach((item) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      li.append(a);
      secondaryNavUl.append(li);
    });
  }


  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  // Extract copyright text from original HTML if available, otherwise use hardcoded
  const originalCopyrightText = document.querySelector('.copyright-text');
  if (originalCopyrightText) {
    copyrightTextCol.innerHTML = originalCopyrightText.innerHTML;
  } else {
    copyrightTextCol.textContent = 'Copyright© 2026 Mahindra&Mahindra Ltd. All Rights Reserved.'; // Hardcoded from original HTML
  }
  copyrightRow.append(copyrightTextCol);


  // Optimize images
  footerMain.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(footerMain);
}
