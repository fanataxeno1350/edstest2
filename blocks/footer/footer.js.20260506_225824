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

export default async function decorate(block) {
  const children = [...block.children];

  const logoRow = children[0];
  const logoLinkRow = children[1];
  const copyrightRow = children[2];

  const itemRows = children.slice(3);

  const socialLinkRows = [];
  const footerSectionRows = [];
  const legalLinkRows = [];

  itemRows.forEach((row) => {
    const cells = [...row.children];
    // footer-social-item: 2 cells, first has <a>, second has <ul>
    if (cells.length === 2 && cells[0].querySelector('a') && cells[1].querySelector('ul')) {
      socialLinkRows.push(row);
    }
    // footer-section-item: 3 cells
    else if (cells.length === 3) {
      footerSectionRows.push(row);
    }
    // footer-link-item: 2 cells, first does not have <a>
    else if (cells.length === 2 && !cells[0].querySelector('a')) {
      legalLinkRows.push(row);
    }
  });

  const footerMain = document.createElement('footer');
  footerMain.classList.add('footer-main'); // Block's own class is correct here

  const container = document.createElement('div');
  container.classList.add('container');

  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);

  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  moveInstrumentation(logoRow, logoLink);
  logoDiv.append(logoLink);
  logoCol.append(logoDiv);
  footerHeader.append(logoCol);

  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');

  const socialWrap = document.createElement('ul');
  socialWrap.classList.add('social-wrap');

  socialLinkRows.forEach((row) => {
    // footer-social-item: socialLink (aem-content), hierarchy-tree (richtext)
    const [socialLinkCell, hierarchyTreeCell] = [...row.children];
    const socialAnchor = socialLinkCell.querySelector('a');
    if (socialAnchor) {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = socialAnchor.href;
      link.target = '_blank';
      link.innerHTML = socialAnchor.innerHTML; // Copy SVG or text content
      moveInstrumentation(socialLinkCell, link);
      li.append(link);

      const hierarchyRoot = hierarchyTreeCell.querySelector('ul');
      if (hierarchyRoot) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('has-footer-sub-child');
        // Move instrumentation for the hierarchy tree content
        moveInstrumentation(hierarchyTreeCell, wrapper);
        wrapper.appendChild(hierarchyRoot);
        link.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          wrapper.classList.toggle('active');
          li.classList.toggle('active');
        });
        li.appendChild(wrapper);
        transformNestedLists(hierarchyRoot);
      }
      moveInstrumentation(row, li);
      socialWrap.append(li);
    }
  });

  socialCol.append(socialWrap);
  footerHeader.append(socialCol);
  container.append(footerHeader);

  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');

  footerSectionRows.forEach((row) => {
    // footer-section-item: title (text), link (aem-content), sectionLinks (richtext)
    const [titleCell, linkCell, sectionLinksCell] = [...row.children];
    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');

    const head = document.createElement('div');
    head.classList.add('head');

    const span = document.createElement('span');
    const titleLink = document.createElement('a');
    const directLink = linkCell.querySelector('a');
    if (directLink) {
      titleLink.href = directLink.href;
    } else {
      titleLink.href = 'javascript:void(0)';
    }
    titleLink.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, titleLink);
    moveInstrumentation(linkCell, titleLink);
    span.append(titleLink);

    const small = document.createElement('small');
    small.setAttribute('data-once', 'footerMobileInner');
    span.append(small);
    head.append(span);

    const sectionLinksUl = sectionLinksCell.querySelector('ul');
    if (sectionLinksUl) {
      const footerInnerList = document.createElement('ul');
      footerInnerList.classList.add('footer-inner-list');
      // Move instrumentation for the section links content
      moveInstrumentation(sectionLinksCell, footerInnerList);
      [...sectionLinksUl.children].forEach((liElement) => {
        const li = document.createElement('li');
        const anchor = liElement.querySelector('a');
        if (anchor) {
          const link = document.createElement('a');
          link.href = anchor.href;
          link.textContent = anchor.textContent.trim();
          li.append(link);
        } else {
          li.textContent = liElement.textContent.trim();
        }
        footerInnerList.append(li);
      });
      head.append(footerInnerList);
      titleLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        head.classList.toggle('active');
        footerInnerList.classList.toggle('active');
      });
    } else {
      // If no UL, it might be a P or other richtext content. Read innerHTML.
      const footerInnerList = document.createElement('ul');
      footerInnerList.classList.add('footer-inner-list');
      const li = document.createElement('li');
      // Use innerHTML for richtext content
      li.innerHTML = sectionLinksCell.innerHTML;
      footerInnerList.append(li);
      head.append(footerInnerList);
    }
    moveInstrumentation(row, linkBlocks);
    linkBlocks.append(head);
    footerMenu.append(linkBlocks);
  });

  footerMenuCol.append(footerMenu);
  footerMenuBox.append(footerMenuCol);
  container.append(footerMenuBox);

  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');

  const secondaryNav = document.createElement('ul');
  secondaryNav.classList.add('secondary-nav');

  legalLinkRows.forEach((row) => {
    // footer-link-item: label (text), link (aem-content)
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, li);
    li.append(anchor);
    secondaryNav.append(li);
  });

  secondaryNavCol.append(secondaryNav);
  copyrightWrap.append(secondaryNavCol);

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  copyrightTextCol.textContent = copyrightRow.textContent.trim();
  moveInstrumentation(copyrightRow, copyrightTextCol);
  copyrightWrap.append(copyrightTextCol);
  container.append(copyrightWrap);

  footerMain.append(container);
  block.replaceChildren(footerMain);
}
