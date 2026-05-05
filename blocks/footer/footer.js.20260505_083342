import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
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
      subWrap.classList.add('has-footer-sub-child'); // Use original HTML class
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

  // Destructure root rows based on BlockJson model
  const [logoRow, logoLinkRow, copyrightRow, ...itemRows] = children;

  const footerMain = document.createElement('footer');
  footerMain.classList.add('footer-main');

  const container = document.createElement('div');
  container.classList.add('container');

  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');

  // Logo
  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');

  // Read logoLink from logoLinkRow's first cell
  const logoLinkCell = logoLinkRow.children[0];
  const foundLogoLink = logoLinkCell?.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }

  // Read logo picture from logoRow's first cell
  const logoCell = logoRow.children[0];
  const picture = logoCell?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  moveInstrumentation(logoRow, logoLink);
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);
  logoCol.append(logoDiv);
  footerHeader.append(logoCol);

  // Social Links
  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  const socialUl = document.createElement('ul');
  socialUl.classList.add('social-wrap');

  // Filter for footer-social-item: 2 cells, second cell contains a UL (hierarchy-tree)
  const socialLinkRows = itemRows.filter((row) => row.children.length === 2 && row.children[1].querySelector('ul'));

  socialLinkRows.forEach((row) => {
    const [socialLinkCell, hierarchyTreeCell] = [...row.children]; // Destructure for fixed schema
    const li = document.createElement('li');
    const socialAnchor = document.createElement('a');
    const foundSocialLink = socialLinkCell.querySelector('a');
    if (foundSocialLink) {
      socialAnchor.href = foundSocialLink.href;
      socialAnchor.target = '_blank';
    }

    // Determine social icon based on href (can't use textContent as it's a URL)
    const href = socialAnchor.href.toLowerCase();
    // Using inline SVG data URIs as per Rule 25.4
    if (href.includes('facebook')) {
      li.classList.add('fb');
      socialAnchor.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.675 102.756V73.432H16.495V65.688C16.495 30.263 18.688 24.093 37.361 24.093H44.266V0H36.494C14.217 0 0 13.386 0 36.656V46.244C0 55.827 3.591 62.865 16.495 65.688V102.756H22.675Z" fill="#030000"/></svg>';
    } else if (href.includes('twitter')) {
      li.classList.add('tw');
      socialAnchor.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.675 102.756V73.432H16.495V65.688C16.495 30.263 18.688 24.093 37.361 24.093H44.266V0H36.494C14.217 0 0 13.386 0 36.656V46.244C0 55.827 3.591 62.865 16.495 65.688V102.756H22.675Z" fill="#030000"/></svg>';
    } else if (href.includes('instagram')) {
      li.classList.add('inst');
      socialAnchor.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.675 102.756V73.432H16.495V65.688C16.495 30.263 18.688 24.093 37.361 24.093H44.266V0H36.494C14.217 0 0 13.386 0 36.656V46.244C0 55.827 3.591 62.865 16.495 65.688V102.756H22.675Z" fill="#030000"/></svg>';
    } else if (href.includes('youtube')) {
      li.classList.add('yt');
      socialAnchor.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.675 102.756V73.432H16.495V65.688C16.495 30.263 18.688 24.093 37.361 24.093H44.266V0H36.494C14.217 0 0 13.386 0 36.656V46.244C0 55.827 3.591 62.865 16.495 65.688V102.756H22.675Z" fill="#030000"/></svg>';
    } else if (href.includes('linkedin')) {
      li.classList.add('in');
      socialAnchor.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.675 102.756V73.432H16.495V65.688C16.495 30.263 18.688 24.093 37.361 24.093H44.266V0H36.494C14.217 0 0 13.386 0 36.656V46.244C0 55.827 3.591 62.865 16.495 65.688V102.756H22.675Z" fill="#030000"/></svg>';
    }
    li.append(socialAnchor);
    moveInstrumentation(row, li);
    socialUl.append(li);
  });

  socialCol.append(socialUl);
  footerHeader.append(socialCol);
  container.append(footerHeader);

  // Footer Menu
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');

  // Filter for footer-section-item: 3 cells
  const navSectionRows = itemRows.filter((row) => row.children.length === 3);

  navSectionRows.forEach((row) => {
    const [titleCell, linkCell, sectionLinksCell] = [...row.children]; // Destructure for fixed schema
    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    const head = document.createElement('div');
    head.classList.add('head');
    const span = document.createElement('span');

    const titleLink = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      titleLink.href = foundLink.href;
    }
    titleLink.textContent = titleCell.textContent.trim();
    span.append(titleLink);

    const small = document.createElement('small');
    small.setAttribute('data-once', 'footerMobileInner');
    span.append(small);
    head.append(span);

    // Handle richtext sectionLinksCell
    const tempDiv = document.createElement('div');
    moveInstrumentation(sectionLinksCell, tempDiv);
    tempDiv.innerHTML = sectionLinksCell.innerHTML;

    const sectionLinksUl = tempDiv.querySelector('ul');
    if (sectionLinksUl) {
      sectionLinksUl.classList.add('footer-inner-list');
      transformNestedLists(sectionLinksUl);
      head.append(sectionLinksUl);
    } else {
      // If it's not a UL, it might be a P or other richtext
      // Ensure we append all children from the tempDiv
      while (tempDiv.firstChild) {
        head.append(tempDiv.firstChild);
      }
    }
    linkBlocks.append(head);
    moveInstrumentation(row, linkBlocks);
    footerMenu.append(linkBlocks);
  });

  footerMenuCol.append(footerMenu);
  footerMenuBox.append(footerMenuCol);
  container.append(footerMenuBox);

  // Copyright and Secondary Nav
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');

  // Filter for footer-link-item: 2 cells, second cell does NOT contain a UL
  const footerLinkRows = itemRows.filter((row) => row.children.length === 2 && !row.children[1].querySelector('ul'));

  footerLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructure for fixed schema
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);
    moveInstrumentation(row, li);
    secondaryNavUl.append(li);
  });

  secondaryNavCol.append(secondaryNavUl);
  copyrightWrap.append(secondaryNavCol);

  const copyrightCol = document.createElement('div');
  copyrightCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  // Read copyright text from copyrightRow's first cell
  const copyrightCell = copyrightRow.children[0];
  copyrightCol.textContent = copyrightCell?.textContent.trim();
  moveInstrumentation(copyrightRow, copyrightCol);
  copyrightWrap.append(copyrightCol);
  container.append(copyrightWrap);

  footerMain.append(container);

  block.replaceChildren(footerMain);
}
