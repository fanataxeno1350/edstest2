import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    // Handle label-only nodes
    const anchor = li.querySelector(':scope > a');
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
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-footer-sub-child'); // use ORIGINAL HTML class
      subWrap.append(nested);
      li.append(subWrap);
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
}

export default function decorate(block) {
  const children = [...block.children];

  // Root fields and item rows are distinguished by cell count and content
  const logoRow = children.find((row) => row.children.length === 1 && row.querySelector('picture'));
  const logoLinkRow = children.find((row) => row.children.length === 1 && row.querySelector('a'));
  const copyrightRow = children.find((row) => row.children.length === 1 && !row.querySelector('picture') && !row.querySelector('a') && row.textContent.trim() !== '');

  // Item rows
  const socialLinkRows = children.filter((row) => row.children.length === 2 && row.querySelector('a') && row.querySelector('ul')); // footer-social-item
  const footerSectionRows = children.filter((row) => row.children.length === 3); // footer-section-item
  const legalLinkRows = children.filter((row) => row.children.length === 2 && row.querySelector('a') && !row.querySelector('ul')); // footer-link-item

  const footerMain = document.createElement('footer');
  footerMain.classList.add('footer-main');

  const container = document.createElement('div');
  container.classList.add('container');

  // Footer Header (Logo and Social Links)
  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoAnchor = document.createElement('a');
  if (logoLinkRow) {
    const foundLink = logoLinkRow.querySelector('a');
    if (foundLink) logoAnchor.href = foundLink.href;
    moveInstrumentation(logoLinkRow, logoAnchor); // Move instrumentation for logoLinkRow
  } else {
    logoAnchor.href = '#';
  }

  if (logoRow) {
    const picture = logoRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoAnchor.append(optimizedPic);
    }
    moveInstrumentation(logoRow, logoDiv); // Move instrumentation for logoRow
  }
  logoDiv.append(logoAnchor);
  logoCol.append(logoDiv);
  footerHeader.append(logoCol);

  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  const socialWrap = document.createElement('ul');
  socialWrap.classList.add('social-wrap');

  socialLinkRows.forEach((row) => {
    const [socialLinkCell, hierarchyTreeCell] = [...row.children]; // Fixed schema: footer-social-item
    const socialLink = socialLinkCell.querySelector('a');

    if (socialLink) {
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = socialLink.href;
      anchor.target = '_blank'; // Assuming social links open in new tab

      // TODO: Replace hardcoded SVG data with proper icon handling (e.g., CSS background-image or a dedicated icon component)
      if (socialLink.href.includes('facebook.com')) {
        li.classList.add('fb');
        anchor.innerHTML = '<span class="icon icon-facebook"></span>'; // Placeholder for icon
        anchor.setAttribute('aria-label', 'Facebook');
      } else if (socialLink.href.includes('twitter.com')) {
        li.classList.add('tw');
        anchor.innerHTML = '<span class="icon icon-twitter"></span>'; // Placeholder for icon
        anchor.setAttribute('aria-label', 'Twitter');
      } else if (socialLink.href.includes('instagram.com')) {
        li.classList.add('inst');
        anchor.innerHTML = '<span class="icon icon-instagram"></span>'; // Placeholder for icon
        anchor.setAttribute('aria-label', 'Instagram');
      } else if (socialLink.href.includes('youtube.com')) {
        li.classList.add('yt');
        anchor.innerHTML = '<span class="icon icon-youtube"></span>'; // Placeholder for icon
        anchor.setAttribute('aria-label', 'YouTube');
      } else if (socialLink.href.includes('linkedin.com')) {
        li.classList.add('in');
        anchor.innerHTML = '<span class="icon icon-linkedin"></span>'; // Placeholder for icon
        anchor.setAttribute('aria-label', 'LinkedIn');
      } else {
        anchor.textContent = socialLink.textContent.trim(); // Fallback to text if no icon
      }

      li.append(anchor);

      // Handle hierarchy-tree richtext for social links (if present, though unusual for social)
      const hierarchyRoot = hierarchyTreeCell.querySelector('ul');
      if (hierarchyRoot) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
        moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation for richtext cell

        // Apply classes and event listeners to nested elements
        tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('has-footer-inner-sub-child'));
        tempDiv.querySelectorAll('li').forEach(liItem => liItem.classList.add('list-item')); // Example class
        tempDiv.querySelectorAll('a').forEach(a => a.classList.add('link')); // Example class

        transformNestedLists(tempDiv); // Apply accordion logic to nested lists

        while (tempDiv.firstChild) {
          li.append(tempDiv.firstChild);
        }
      }

      socialWrap.append(li);
      moveInstrumentation(row, li);
    }
  });
  socialCol.append(socialWrap);
  footerHeader.append(socialCol);
  container.append(footerHeader);

  // Footer Menu Box (Sections and Links)
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');

  footerSectionRows.forEach((row) => {
    const [titleCell, linkCell, sectionLinksCell] = [...row.children]; // Fixed schema: footer-section-item

    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    const head = document.createElement('div');
    head.classList.add('head');
    const span = document.createElement('span');
    const titleLink = document.createElement('a');
    titleLink.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, titleLink); // Move instrumentation for titleCell

    const subListContent = sectionLinksCell?.innerHTML || '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = subListContent;
    const subList = tempDiv.querySelector('ul');

    if (subList) {
      titleLink.href = linkCell.querySelector('a')?.href || 'javascript:void(0)';
      moveInstrumentation(linkCell, titleLink); // Move instrumentation for linkCell

      const small = document.createElement('small');
      small.setAttribute('data-once', 'footerMobileInner');
      span.append(titleLink, small);

      const footerInnerList = document.createElement('ul');
      footerInnerList.classList.add('footer-inner-list');

      // Move instrumentation for the richtext cell and then process its children
      moveInstrumentation(sectionLinksCell, tempDiv);

      // Apply accordion logic to nested lists within sectionLinksCell
      transformNestedLists(subList);

      while (subList.firstChild) {
        footerInnerList.append(subList.firstChild);
      }

      head.append(span, footerInnerList);
    } else {
      titleLink.href = linkCell.querySelector('a')?.href || '#';
      moveInstrumentation(linkCell, titleLink); // Move instrumentation for linkCell
      span.append(titleLink);
      head.append(span);
    }

    linkBlocks.append(head);
    footerMenu.append(linkBlocks);
    moveInstrumentation(row, linkBlocks);
  });

  footerMenuCol.append(footerMenu);
  footerMenuBox.append(footerMenuCol);
  container.append(footerMenuBox);

  // Copyright and Legal Links
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');

  const legalNavCol = document.createElement('div');
  legalNavCol.classList.add('col-12', 'col-lg-6');
  const secondaryNav = document.createElement('ul');
  secondaryNav.classList.add('secondary-nav');

  legalLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Fixed schema: footer-link-item
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);
    secondaryNav.append(li);
    moveInstrumentation(row, li);
  });
  legalNavCol.append(secondaryNav);
  copyrightWrap.append(legalNavCol);

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  if (copyrightRow) {
    copyrightTextCol.textContent = copyrightRow.textContent.trim();
    moveInstrumentation(copyrightRow, copyrightTextCol);
  }
  copyrightWrap.append(copyrightTextCol);
  container.append(copyrightWrap);

  footerMain.append(container);
  block.replaceChildren(footerMain);

  // Image optimization
  footerMain.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
