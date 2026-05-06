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
      subWrap.classList.add('has-footer-inner-sub-child');
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '-23.5 -23.5 122.80 122.80');
        svg.setAttribute('fill', '#000000');
        svg.setAttribute('stroke', '#000000');
        svg.setAttribute('stroke-width', '4.851456000000001');
        svg.innerHTML = `
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g>
          <g id="SVGRepo_iconCarrier">
            <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)">
              <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path>
            </g>
          </g>
        `;
        const span = document.createElement('span');
        trigger.append(span);
        span.append(svg); // Append SVG to span, then span to trigger

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
  const [logoRow, logoLinkRow, copyrightRow, ...itemRows] = [...block.children];

  const socialLinkRows = [];
  const navSectionRows = [];
  const legalLinkRows = [];

  itemRows.forEach((row) => {
    // Determine row type based on cell count and content
    // footer-social-item: 2 cells, first cell has an 'a'
    // footer-section-item: 3 cells, third cell has a 'ul'
    // footer-link-item: 2 cells, second cell has an 'a'
    const cells = [...row.children];
    if (cells.length === 2 && cells[0].querySelector('a') && cells[1].querySelector('ul')) {
      socialLinkRows.push(row); // This is actually the social item with hierarchy-tree
    } else if (cells.length === 3 && cells[2].querySelector('ul')) {
      navSectionRows.push(row);
    } else if (cells.length === 2 && cells[1].querySelector('a')) {
      legalLinkRows.push(row);
    }
  });

  const footerMain = document.createElement('footer');
  footerMain.classList.add('footer-main');

  const container = document.createElement('div');
  container.classList.add('container');
  footerMain.append(container);

  // Footer Header Section
  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');
  container.append(footerHeader);

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  footerHeader.append(logoCol);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  logoCol.append(logoDiv);

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoLink); // Move instrumentation from logoRow to logoLink

  const socialWrapCol = document.createElement('div');
  socialWrapCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeader.append(socialWrapCol);

  const socialWrapUl = document.createElement('ul');
  socialWrapUl.classList.add('social-wrap');
  socialWrapCol.append(socialWrapUl);

  socialLinkRows.forEach((row) => {
    const [socialLinkCell, hierarchyTreeCell] = [...row.children]; // Destructure for social item
    const socialLink = socialLinkCell.querySelector('a');
    const listItem = document.createElement('li');
    const anchor = document.createElement('a');
    if (socialLink) {
      anchor.href = socialLink.href;
      anchor.target = '_blank';
      const url = new URL(socialLink.href);
      if (url.hostname.includes('facebook')) listItem.classList.add('fb');
      else if (url.hostname.includes('twitter')) listItem.classList.add('tw');
      else if (url.hostname.includes('instagram')) listItem.classList.add('inst');
      else if (url.hostname.includes('youtube')) listItem.classList.add('yt');
      else if (url.hostname.includes('linkedin')) listItem.classList.add('in');
    }
    moveInstrumentation(row, listItem);
    // The socialLinkCell content is just the <a> tag, so append it directly
    if (socialLink) {
      anchor.append(socialLink.cloneNode(true)); // Clone to avoid moving original
    }
    listItem.append(anchor);
    socialWrapUl.append(listItem);
    // NOTE: The hierarchy-tree cell is part of the social-item model, but the original HTML
    // does not render it in the social links section. It's ignored here as per original HTML.
  });

  // Footer Menu Box
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  container.append(footerMenuBox);

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  footerMenuBox.append(footerMenuCol);

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');
  footerMenuCol.append(footerMenu);

  navSectionRows.forEach((row) => {
    const [titleCell, linkCell, sectionLinksCell] = [...row.children];
    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    footerMenu.append(linkBlocks);

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');
    linkBlocks.append(headDiv);

    const span = document.createElement('span');
    headDiv.append(span);

    const titleLink = document.createElement('a');
    const directLink = linkCell.querySelector('a');
    if (directLink) {
      titleLink.href = directLink.href;
    } else {
      titleLink.href = 'javascript:void(0)';
    }
    titleLink.textContent = titleCell.textContent.trim();
    span.append(titleLink);

    const subList = sectionLinksCell.querySelector('ul');
    if (subList) {
      const small = document.createElement('small');
      small.setAttribute('data-once', 'footerMobileInner');
      span.append(small);

      const ul = document.createElement('ul');
      ul.classList.add('footer-inner-list');
      // Use innerHTML for richtext content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = sectionLinksCell.innerHTML;
      // Move instrumentation for the richtext cell
      moveInstrumentation(sectionLinksCell, tempDiv);

      // Append children from tempDiv to ul
      while (tempDiv.firstChild) {
        ul.append(tempDiv.firstChild);
      }

      transformNestedLists(ul);
      headDiv.append(ul);

      const toggleAccordion = () => {
        ul.classList.toggle('active');
        headDiv.classList.toggle('active');
      };

      titleLink.addEventListener('click', (e) => {
        e.preventDefault();
        toggleAccordion();
      });
      small.addEventListener('click', toggleAccordion);
    }
    moveInstrumentation(row, linkBlocks);
  });

  // Copyright Section
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightWrap);

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  copyrightWrap.append(secondaryNavCol);

  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');
  secondaryNavCol.append(secondaryNavUl);

  legalLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const listItem = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, listItem);
    listItem.append(anchor);
    secondaryNavUl.append(listItem);
  });

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  copyrightTextCol.textContent = copyrightRow.textContent.trim();
  moveInstrumentation(copyrightRow, copyrightTextCol);
  copyrightWrap.append(copyrightTextCol);

  block.replaceChildren(footerMain);
}
