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

  const [logoRow, logoLinkRow, copyrightRow, ...itemRows] = children;

  const footerMain = document.createElement('footer');
  footerMain.classList.add('footer-main');
  moveInstrumentation(block, footerMain);

  const container = document.createElement('div');
  container.classList.add('container');
  footerMain.append(container);

  // Footer Header (Logo and Social Links)
  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');
  container.append(footerHeader);

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  footerHeader.append(logoCol);

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo');
  logoCol.append(logoWrapper);

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);
  logoWrapper.append(logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
    optimizedPic.querySelector('img').classList.add('hiddenlogo1');
  }
  moveInstrumentation(logoRow, logoPicture);

  const socialLinkRows = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a') && row.querySelector('ul'));
  const footerSectionRows = itemRows.filter((row) => row.children.length === 3);
  const legalLinkRows = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('ul'));

  if (socialLinkRows.length > 0) {
    const socialCol = document.createElement('div');
    socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
    footerHeader.append(socialCol);

    const socialWrap = document.createElement('ul');
    socialWrap.classList.add('social-wrap');
    socialCol.append(socialWrap);

    socialLinkRows.forEach((row) => {
      const [socialLinkCell, hierarchyTreeCell] = [...row.children];
      const socialLink = socialLinkCell.querySelector('a');

      if (socialLink && hierarchyTreeCell) {
        const li = document.createElement('li');
        // Add specific classes based on the social link content if needed, e.g., 'fb', 'tw'
        // For now, just add a generic class or none if not specified in original HTML for this context
        // Example: if (socialLink.href.includes('facebook')) li.classList.add('fb');
        moveInstrumentation(row, li); // Move instrumentation for the entire row to the li

        const anchor = document.createElement('a');
        anchor.href = socialLink.href;
        anchor.target = '_blank';
        // Placeholder SVG - ensure this is handled correctly, ideally from an icon sprite or aem.js helper
        anchor.innerHTML = `
          <svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink">
            <image xlink:href="data:stripped" x="0" y="0" width="30" height="30"></image>
          </svg>
        `;
        moveInstrumentation(socialLinkCell, anchor);
        li.append(anchor);

        // Handle the hierarchy-tree richtext content
        const hierarchyTreeTempDiv = document.createElement('div');
        hierarchyTreeTempDiv.innerHTML = hierarchyTreeCell.innerHTML;
        moveInstrumentation(hierarchyTreeCell, hierarchyTreeTempDiv);

        const rootUl = hierarchyTreeTempDiv.querySelector('ul');
        if (rootUl) {
          // Apply classes to the root UL and its children as per ORIGINAL HTML if needed
          // For example, if the original HTML had specific classes on these nested ULs/LIs/As
          rootUl.querySelectorAll('a').forEach((a) => a.classList.add('social-link-item')); // Example class
          rootUl.querySelectorAll('li').forEach((liItem) => liItem.classList.add('social-list-item')); // Example class
          transformNestedLists(rootUl); // Apply transformations for nested lists
          li.append(rootUl); // Append the transformed hierarchy
        }
        socialWrap.append(li);
      }
    });
  }

  // Footer Menu Box (Section Links)
  if (footerSectionRows.length > 0) {
    const footerMenuBox = document.createElement('div');
    footerMenuBox.classList.add('row', 'footer-menu-box');
    container.append(footerMenuBox);

    const menuCol = document.createElement('div');
    menuCol.classList.add('col');
    footerMenuBox.append(menuCol);

    const footerMenu = document.createElement('div');
    footerMenu.classList.add('footer-menu');
    menuCol.append(footerMenu);

    footerSectionRows.forEach((row) => {
      const [titleCell, linkCell, sectionLinksCell] = [...row.children];
      const linkBlocks = document.createElement('div');
      linkBlocks.classList.add('link-blocks');
      moveInstrumentation(row, linkBlocks); // Move instrumentation for the row to linkBlocks
      footerMenu.append(linkBlocks);

      const head = document.createElement('div');
      head.classList.add('head');
      linkBlocks.append(head);

      const span = document.createElement('span');
      head.append(span);

      const titleAnchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        titleAnchor.href = foundLink.href;
      } else {
        titleAnchor.href = 'javascript:void(0)';
      }
      titleAnchor.textContent = titleCell.textContent.trim();
      moveInstrumentation(titleCell, titleAnchor);
      moveInstrumentation(linkCell, titleAnchor);
      span.append(titleAnchor);

      const sectionLinksUlTempDiv = document.createElement('div');
      sectionLinksUlTempDiv.innerHTML = sectionLinksCell.innerHTML;
      moveInstrumentation(sectionLinksCell, sectionLinksUlTempDiv);

      const sectionLinksUl = sectionLinksUlTempDiv.querySelector('ul');
      if (sectionLinksUl) {
        const small = document.createElement('small');
        small.setAttribute('data-once', 'footerMobileInner');
        span.append(small);

        const footerInnerList = document.createElement('ul');
        footerInnerList.classList.add('footer-inner-list');
        // moveInstrumentation already handled for sectionLinksCell to sectionLinksUlTempDiv
        head.append(footerInnerList);

        [...sectionLinksUl.children].forEach((liElement) => {
          const li = document.createElement('li');
          moveInstrumentation(liElement, li); // Move instrumentation from original li to new li

          const anchor = liElement.querySelector('a');
          if (anchor) {
            const newAnchor = document.createElement('a');
            newAnchor.href = anchor.href;
            newAnchor.textContent = anchor.textContent.trim();
            moveInstrumentation(anchor, newAnchor); // Move instrumentation from original anchor to new anchor
            li.append(newAnchor);
          } else {
            const textContent = liElement.textContent.trim();
            if (textContent) {
              const spanText = document.createElement('span');
              spanText.textContent = textContent;
              li.append(spanText);
            }
          }

          const nestedUl = liElement.querySelector('ul');
          if (nestedUl) {
            const arrowSpan = document.createElement('span');
            arrowSpan.setAttribute('data-once', 'footerClickEvent');
            arrowSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
            li.append(arrowSpan);

            const subChildDiv = document.createElement('div');
            subChildDiv.classList.add('has-footer-sub-child');
            subChildDiv.setAttribute('data-once', 'hideFooterSubChild');
            subChildDiv.append(nestedUl);
            li.append(subChildDiv);
            transformNestedLists(nestedUl);

            arrowSpan.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              li.classList.toggle('active');
              subChildDiv.classList.toggle('active');
            });
          }
          footerInnerList.append(li);
        });
      }
    });
  }

  // Copyright and Legal Links
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightWrap);

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  copyrightWrap.append(secondaryNavCol);

  if (legalLinkRows.length > 0) {
    const secondaryNav = document.createElement('ul');
    secondaryNav.classList.add('secondary-nav');
    secondaryNavCol.append(secondaryNav);

    legalLinkRows.forEach((row) => {
      const [labelCell, linkCell] = [...row.children];
      const li = document.createElement('li');
      moveInstrumentation(row, li); // Move instrumentation for the row to the li
      const anchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
      }
      anchor.textContent = labelCell.textContent.trim();
      moveInstrumentation(labelCell, anchor); // Move instrumentation for labelCell to anchor
      moveInstrumentation(linkCell, anchor); // Move instrumentation for linkCell to anchor
      li.append(anchor);
      secondaryNav.append(li);
    });
  }

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  moveInstrumentation(copyrightRow, copyrightTextCol);
  // Correctly extract innerHTML from the cell div, not the row div
  copyrightTextCol.innerHTML = copyrightRow.querySelector('div')?.innerHTML || '';
  copyrightWrap.append(copyrightTextCol);

  block.replaceChildren(footerMain);
}
