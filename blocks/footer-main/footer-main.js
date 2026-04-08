import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const container = document.createElement('div');
  container.classList.add('container');

  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  // CRITICAL FIX: Replaced row.children[n] with content detection
  const logoRow = children.find(row => row.querySelector('picture') && !row.querySelector('a'));
  const logoLinkRow = children.find(row => !row.querySelector('picture') && row.querySelector('a') && row.textContent.includes('Logo Link'));
  const copyrightTextRow = children.find(row => row.textContent.includes('Copyright Text'));

  const logoPicture = logoRow?.querySelector('picture');
  const logoLink = logoLinkRow?.querySelector('a');

  if (logoLink) {
    const a = document.createElement('a');
    a.href = logoLink.href;
    moveInstrumentation(logoLink, a);
    if (logoPicture) {
      a.append(logoPicture);
    } else {
      while (logoLink.firstChild) a.append(logoLink.firstChild);
    }
    logoDiv.append(a);
  } else if (logoPicture) {
    logoDiv.append(logoPicture);
  }
  logoCol.append(logoDiv);
  footerHeader.append(logoCol);

  const socialLinksCol = document.createElement('div');
  socialLinksCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  const socialUl = document.createElement('ul');
  socialUl.classList.add('social-wrap');

  const socialLinks = children.filter(
    (row) => row.children.length === 2 && row.querySelector('picture') && row.querySelector('a'),
  );

  socialLinks.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const iconCell = row.querySelector('picture');
    const linkCell = row.querySelector('a');

    if (linkCell) {
      const a = document.createElement('a');
      a.href = linkCell.href;
      a.target = '_blank'; // Assuming all social links open in new tab
      if (iconCell) {
        a.append(iconCell);
      } else {
        while (linkCell.firstChild) a.append(linkCell.firstChild);
      }
      li.append(a);
    } else if (iconCell) {
      li.append(iconCell);
    }

    // Add specific classes based on content, if needed, e.g., for fb, tw, inst
    const img = li.querySelector('img');
    if (img) {
      const altText = img.alt.toLowerCase();
      if (altText.includes('facebook')) li.classList.add('fb');
      else if (altText.includes('twitter')) li.classList.add('tw');
      else if (altText.includes('instagram')) li.classList.add('inst');
      else if (altText.includes('youtube')) li.classList.add('yt');
      else if (altText.includes('linkedin')) li.classList.add('in');
    }

    socialUl.append(li);
  });
  socialLinksCol.append(socialUl);
  footerHeader.append(socialLinksCol);
  container.append(footerHeader);

  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');

  const footerLinkBlocks = children.filter(
    (row) => row.children.length === 3 && row.querySelector('div:first-child a') && row.querySelector('div:last-child').textContent.includes('Footer Links'),
  );

  footerLinkBlocks.forEach((row) => {
    const linkBlockDiv = document.createElement('div');
    linkBlockDiv.classList.add('link-blocks');
    moveInstrumentation(row, linkBlockDiv);

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');

    const span = document.createElement('span');
    // FIXED: Using content detection instead of index access
    const cells = [...row.children];
    const blockTitleLinkCell = cells.find(cell => cell.querySelector('a'));
    const blockTitleLinkHrefCell = cells.find(cell => cell.querySelector('a'));
    // FIXED: Using content detection instead of index access
    const cells = [...row.children];
    const blockTitleLinkHrefCell = cells.find(cell => cell.querySelector('a'));

    const blockTitleLink = blockTitleLinkCell?.querySelector('a');
    const blockTitleLinkHref = blockTitleLinkHrefCell?.querySelector('a');

    if (blockTitleLink) {
      const a = document.createElement('a');
      a.href = blockTitleLinkHref ? blockTitleLinkHref.href : blockTitleLink.href;
      moveInstrumentation(blockTitleLink, a);
      while (blockTitleLink.firstChild) a.append(blockTitleLink.firstChild);
      span.append(a);
    }

    const small = document.createElement('small');
    small.setAttribute('data-once', 'footerMobileInner');
    span.append(small);
    headDiv.append(span);

    const ul = document.createElement('ul');
    ul.classList.add('footer-inner-list');

    // Extract footer-link items which are nested within the 'Footer Links' cell
    // FIXED: Using content detection instead of index access
    const cells = [...row.children];
    const footerLinksCell = cells.find(cell => cell.querySelector('a'));
    if (footerLinksCell) {
      [...footerLinksCell.children].forEach((linkRow) => {
        const li = document.createElement('li');
        moveInstrumentation(linkRow, li);
        const textLink = linkRow.querySelector('a:first-child');
        const linkHref = linkRow.querySelector('a:last-child');

        if (textLink) {
          const a = document.createElement('a');
          a.href = linkHref ? linkHref.href : textLink.href;
          moveInstrumentation(textLink, a);
          while (textLink.firstChild) a.append(textLink.firstChild);
          li.append(a);
        }
        ul.append(li);
      });
    }

    headDiv.append(ul);
    linkBlockDiv.append(headDiv);
    footerMenu.append(linkBlockDiv);
  });

  footerMenuCol.append(footerMenu);
  footerMenuBox.append(footerMenuCol);
  container.append(footerMenuBox);

  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');

  const secondaryLinks = children.filter(
    (row) => row.children.length === 2 && !row.querySelector('picture') && row.querySelector('a'),
  );

  secondaryLinks.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    // FIXED: Using content detection instead of index access
    const cells = [...row.children];
    const textCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a')) || cells[0];
    const linkCell = cells.find(cell => cell.querySelector('a'));
    // FIXED: Using content detection instead of index access
    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a'));

    const textLink = textCell?.querySelector('a');
    const linkHref = linkCell?.querySelector('a');

    if (textLink) {
      const a = document.createElement('a');
      a.href = linkHref ? linkHref.href : textLink.href;
      moveInstrumentation(textLink, a);
      while (textLink.firstChild) a.append(textLink.firstChild);
      li.append(a);
    }
    secondaryNavUl.append(li);
  });
  secondaryNavCol.append(secondaryNavUl);
  copyrightWrap.append(secondaryNavCol);

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  if (copyrightTextRow) { // Ensure copyrightTextRow exists
    moveInstrumentation(copyrightTextRow, copyrightTextCol);
    while (copyrightTextRow.firstChild) copyrightTextCol.append(copyrightTextRow.firstChild);
  }
  copyrightWrap.append(copyrightTextCol);
  container.append(copyrightWrap);

  block.textContent = '';
  block.append(container);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Mobile accordion functionality for footer links
  const linkBlockHeads = block.querySelectorAll('.footer-menu .link-blocks .head');
  linkBlockHeads.forEach((head) => {
    const small = head.querySelector('small[data-once="footerMobileInner"]');
    if (small) {
      small.addEventListener('click', () => {
        head.classList.toggle('active');
        const ul = head.querySelector('.footer-inner-list');
        if (ul) {
          ul.classList.toggle('active');
        }
      });
    }
  });

  // Mobile accordion functionality for nested links (e.g., Industries, Careers)
  // Corrected selector to match the original HTML structure for the span with data-once="footerClickEvent"
  block.querySelectorAll('.footer-inner-list li > span[data-once="footerClickEvent"]').forEach((span) => {
    span.addEventListener('click', () => {
      const parentLi = span.closest('li');
      const subChild = parentLi.querySelector('.has-footer-sub-child');
      if (subChild) {
        subChild.classList.toggle('active');
        parentLi.classList.toggle('active'); // Toggle active on parent li as well
      }
    });
  });

  // Mobile accordion functionality for inner nested links
  // Corrected selector to match the original HTML structure for the span with data-once="footerClickEvent innerFooterClickEvent"
  block.querySelectorAll('.has-footer-sub-child li > span[data-once="footerClickEvent innerFooterClickEvent"]').forEach((span) => {
    span.addEventListener('click', () => {
      const parentLi = span.closest('li');
      const innerSubChild = parentLi.querySelector('.has-footer-inner-sub-child');
      if (innerSubChild) {
        innerSubChild.classList.toggle('active-inner-child');
        parentLi.classList.toggle('active-inner-child-parent'); // Toggle active on parent li
      }
    });
  });
}
