import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, level = 0) {
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
      subWrap.classList.add(level === 0 ? 'has-footer-sub-child' : 'has-footer-inner-sub-child');
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        // Add SVG icon for expand/collapse
        const svgSpan = document.createElement('span');
        svgSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
        trigger.append(svgSpan);

        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
      transformNestedLists(nested, level + 1);
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const logoImageRow = children[0];
  const logoLinkRow = children[1];
  const copyrightTextRow = children.find(
    (row) => row.children.length === 1 && row.querySelector('p'),
  );

  const socialLinkRows = children.filter(
    (row) => row.children.length === 2 && row.querySelector('div:first-child a') && row.querySelector('div:last-child ul'),
  );
  const menuBlockRows = children.filter(
    (row) => row.children.length === 3 && row.querySelector('div:first-child p') && row.querySelector('div:nth-child(2) a'),
  );
  const menuLinkRows = children.filter(
    (row) => row.children.length === 3 && row.querySelector('div:first-child p') && row.querySelector('div:nth-child(2) a') && row.querySelector('div:last-child p'),
  );
  const submenuLinkRows = children.filter(
    (row) => row.children.length === 2 && row.querySelector('div:first-child p') && row.querySelector('div:last-child a') && !socialLinkRows.includes(row),
  );
  const secondaryLinkRows = children.filter(
    (row) => row.children.length === 2 && row.querySelector('div:first-child p') && row.querySelector('div:last-child a') && !socialLinkRows.includes(row) && !submenuLinkRows.includes(row),
  );

  const container = document.createElement('div');
  container.classList.add('container');

  // Footer Header
  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');
  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  const logoLink = document.createElement('a');
  const logoHref = logoLinkRow?.querySelector('a')?.href || '#';
  logoLink.href = logoHref;
  moveInstrumentation(logoLinkRow, logoLink);

  const logoPicture = logoImageRow?.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
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
    const [socialLinkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    const socialAnchor = document.createElement('a');
    const foundSocialLink = socialLinkCell.querySelector('a');
    if (foundSocialLink) {
      socialAnchor.href = foundSocialLink.href;
      socialAnchor.target = '_blank'; // Assuming social links open in new tab
    }
    moveInstrumentation(socialLinkCell, socialAnchor);

    // Add dummy SVG icon for social links
    socialAnchor.innerHTML = '<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink"><image xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAApCAYAAABHomvIAAAAAXNSR0IArs4c6QAAA2NJREFUWEftmF9OIkEQxrtAn+CBR5NuyRxBbrDcYPcE6glWT6CeYPUE4gncPQHeQI9AnB7jI4nwJFA7NaEnTdM9XQNsYjbME2H6z4+vur6qBsQXf+CL84k94LYR2iu4cwWVUleIeMZY+C7LslvGuJUhUsoTIcSj/SUA/NFaX/jWWgtxkiSd+Xz+jIgJY/O+1vqJMa4YcnR0lDSbzSEA2Gu/TCaT/ng8HrMAzUIHBwfPQoiONcmA0HekgsiVHs3n8/77+/soBumDA4DR5+dn5fxgkhwfH39HxDIUi8Xix9vb228CUUoRfAEphHjSWverADudTqfVaj3bynHgaM3KLFZKXedCXS03H89msx6pRWocHh4OzTEAgNs0TS9DkM4PomHlWjFlozajlBrmKn0zIZ1Opz06L0op+o7eFU+j0Th7fX19cDeUUt7naq0kHSL2six7icFFFaQBbtLkYRqkaXpO76SUFwDwy1XYbEyOkH+mKJQPAJynaTrgwLEAlyAnAEBqFUmDiJfGYqSUAwA49Si8BpcfqRut9QpwDDQaYrOAlPIMAO6tBQuL8dgSJRJlvOuRteHYCloho01/GrWMxVDSeGyp/C2ISKbuNeKdKWhBlkkjhChN1kNwMQURH7Is41QmLys7xGZ2lcUopUqFl/Mrq0RMvdohts4jJQ2ZtVGpTBrblkhhrXWPAxIaU1tBC9K2GApl4W11TTwGvzEgLWyH1K7L1LGEFI4Bue+3AnRB7Lrsmjgi9rnVw4bcGNDXABSH2qrLIROvo+JGgATXbrfJbkxHs7Knqctk4rPZzB4X7Xx2EmJfAyCEuDMmTt2KCanHxK+11jdcFWsrWNUAhELq9pZCCHYnXgvQB2c3AJ66XIY01FvGlGQDxuDsSuPU5TKkromX3UXMeizAbrd7ulgs3B4u2J2Ergue3rKyE2eVOo/XsRqAUEiX63l7S1+4KxUMtFHsBiB0XXBMvCyTtQBD18SPj4/iThI73PTeDSkivgCAmVvcc3ipur56Fdz0DuuDjjWz1hyvia8B+qoE9w4bUjXUzK5VDc/11QtIkPZkCik3rCHIJEk4f6WI0Wi08i8Fy2Y45+1fjdkDbqvsXsH/XsG/07ZKSIssn8EAAAAAElFTkSuQmCC" x="0" y="0" width="30" height="30"></image></svg>';
    li.append(socialAnchor);
    socialUl.append(li);
  });
  socialCol.append(socialUl);
  footerHeader.append(socialCol);
  container.append(footerHeader);

  // Footer Menu Box
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  const menuCol = document.createElement('div');
  menuCol.classList.add('col');
  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');

  const linkBlocksContainer = document.createElement('div');
  linkBlocksContainer.classList.add('link-blocks-container'); // Custom wrapper for link blocks

  menuBlockRows.forEach((row) => {
    const [blockTitleCell, blockTitleLinkCell, menuLinksContainerCell] = [...row.children];
    const linkBlock = document.createElement('div');
    linkBlock.classList.add('link-blocks');
    const head = document.createElement('div');
    head.classList.add('head');
    const span = document.createElement('span');

    const blockTitleLink = document.createElement('a');
    const foundBlockTitleLink = blockTitleLinkCell.querySelector('a');
    if (foundBlockTitleLink) {
      blockTitleLink.href = foundBlockTitleLink.href;
    }
    blockTitleLink.textContent = blockTitleCell.textContent.trim();
    moveInstrumentation(blockTitleLinkCell, blockTitleLink);
    span.append(blockTitleLink);

    const small = document.createElement('small');
    small.setAttribute('data-once', 'footerMobileInner');
    span.append(small);
    head.append(span);

    const ul = document.createElement('ul');
    ul.classList.add('footer-inner-list');

    // Filter menuLinkRows that belong to this menuBlock
    const currentMenuLinks = menuLinkRows.splice(0, menuLinksContainerCell.children.length); // Assuming menuLinksContainerCell has children for its links

    currentMenuLinks.forEach((menuLinkRow) => {
      const [linkLabelCell, linkUrlCell, submenuLinksContainerCell] = [...menuLinkRow.children];
      const li = document.createElement('li');
      const menuAnchor = document.createElement('a');
      const foundMenuLink = linkUrlCell.querySelector('a');
      if (foundMenuLink) {
        menuAnchor.href = foundMenuLink.href;
      }
      menuAnchor.textContent = linkLabelCell.textContent.trim();
      moveInstrumentation(linkUrlCell, menuAnchor);
      li.append(menuAnchor);

      const submenuRoot = submenuLinksContainerCell?.querySelector('div'); // Assuming submenuLinks are nested in a div
      if (submenuRoot) {
        const submenuUl = document.createElement('ul');
        submenuUl.classList.add('has-footer-sub-child'); // Use appropriate class

        // Filter submenuLinkRows that belong to this menuLink
        const currentSubmenuLinks = submenuLinkRows.splice(0, submenuLinksContainerCell.children.length); // Assuming submenuLinksContainerCell has children for its links

        currentSubmenuLinks.forEach((submenuLinkRow) => {
          const [submenuLabelCell, submenuUrlCell] = [...submenuLinkRow.children];
          const subLi = document.createElement('li');
          const subAnchor = document.createElement('a');
          const foundSubmenuLink = submenuUrlCell.querySelector('a');
          if (foundSubmenuLink) {
            subAnchor.href = foundSubmenuLink.href;
          }
          subAnchor.textContent = submenuLabelCell.textContent.trim();
          moveInstrumentation(submenuUrlCell, subAnchor);
          subLi.append(subAnchor);
          submenuUl.append(subLi);
        });
        li.append(submenuUl);
      }
      ul.append(li);
    });

    head.append(ul);
    linkBlock.append(head);
    linkBlocksContainer.append(linkBlock);
  });

  footerMenu.append(linkBlocksContainer);
  menuCol.append(footerMenu);
  footerMenuBox.append(menuCol);
  container.append(footerMenuBox);

  // Copyright Wrap
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');

  secondaryLinkRows.forEach((row) => {
    const [linkLabelCell, linkUrlCell] = [...row.children];
    const li = document.createElement('li');
    const secondaryAnchor = document.createElement('a');
    const foundSecondaryLink = linkUrlCell.querySelector('a');
    if (foundSecondaryLink) {
      secondaryAnchor.href = foundSecondaryLink.href;
    }
    secondaryAnchor.textContent = linkLabelCell.textContent.trim();
    moveInstrumentation(linkUrlCell, secondaryAnchor);
    li.append(secondaryAnchor);
    secondaryNavUl.append(li);
  });
  secondaryNavCol.append(secondaryNavUl);
  copyrightWrap.append(secondaryNavCol);

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  if (copyrightTextRow) {
    moveInstrumentation(copyrightTextRow, copyrightTextCol);
    copyrightTextCol.innerHTML = copyrightTextRow.innerHTML;
  }
  copyrightWrap.append(copyrightTextCol);
  container.append(copyrightWrap);

  block.replaceChildren(container);

  // Apply image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Transform nested lists for social links
  socialLinkRows.forEach((row) => {
    // FIXED: Using content detection instead of index access
    const cells = [...row.children];
    const hierarchyTreeCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a')) || cells[1];
    const hierarchyRoot = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyRoot) {
      transformNestedLists(hierarchyRoot);
    }
  });
}
