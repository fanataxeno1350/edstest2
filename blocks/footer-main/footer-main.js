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
      transformNestedLists(nested); // Recursively transform nested lists
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Root fields
  const logoRow = children.find((row) => row.querySelector('picture') && !row.querySelector('a'));
  const logoLinkRow = children.find((row) => row.querySelector('a') && row.querySelector('a').href.includes('/content/site/logoLink'));
  const copyrightTextRow = children.find((row) => !row.querySelector('picture') && !row.querySelector('a') && row.textContent.trim().startsWith('Copyright Text label text'));

  // Item rows
  const itemRows = children.filter((row) => row !== logoRow && row !== logoLinkRow && row !== copyrightTextRow);

  const socialLinkRows = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('picture') && cells[1].querySelector('a');
  });

  const navigationBlockRows = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 4 && cells[2].textContent.trim() === 'Navigation Items value' && cells[3].querySelector('ul');
  });

  const secondaryNavItemRows = itemRows.filter((row) => {
    const cells = [...row.children];
    // Distinguish from navigationBlockRows by length and content, and from footer-navigation-item by model
    // Assuming footer-secondary-nav-item has 2 cells (label, link) and footer-navigation-item has 3 cells (label, link, hierarchy-tree)
    // The BlockJson shows footer-secondary-nav-item has 3 fields (label, link, hierarchy-tree)
    // Let's refine based on the BlockJson and original HTML.
    // The original HTML shows secondary-nav items are simple <li><a>, not nested hierarchy.
    // The BlockJson for `footer-secondary-nav-item` has `label`, `link`, `hierarchy-tree`.
    // This implies the `hierarchy-tree` for secondary nav might be empty or not rendered.
    // Let's assume secondaryNavItemRows are those with 3 cells, but the 3rd cell (hierarchy-tree) is not a primary differentiator for this list.
    // The key is that they are not `footer-navigation-block` (which has 4 cells and "Navigation Items value").
    // And they are not `footer-social-link` (which has 2 cells and a picture).
    // So, `footer-navigation-item` and `footer-secondary-nav-item` both have 3 cells.
    // The current filter `row.querySelector('div:nth-child(3)').textContent.trim() !== 'Navigation Items value'` is problematic.
    // Let's use the presence of a UL in the 3rd cell for `footer-navigation-item` and absence for `footer-secondary-nav-item` if possible,
    // or rely on the number of cells and the content of the first two cells.

    // Re-evaluating based on BlockJson:
    // footer-social-link: 2 cells (icon, link)
    // footer-navigation-block: 4 cells (blockTitle, blockTitleLink, navigationItems, hierarchy-tree)
    // footer-navigation-item: 3 cells (label, link, hierarchy-tree)
    // footer-secondary-nav-item: 3 cells (label, link, hierarchy-tree)

    // The current code has:
    // socialLinkRows: row.children.length === 2 && row.querySelector('picture') -> Correct for footer-social-link
    // navigationBlockRows: row.children.length === 4 && row.querySelector('div:nth-child(3)').textContent.trim() === 'Navigation Items value' -> Correct for footer-navigation-block
    // secondaryNavItemRows: row.children.length === 3 && row.querySelector('div:nth-child(3)').textContent.trim() !== 'Navigation Items value' -> This will catch both footer-navigation-item and footer-secondary-nav-item.
    // The original HTML for secondary-nav shows simple <li><a>, implying the hierarchy-tree for secondary-nav-item is likely empty or not used for rendering nested lists.
    // Let's assume `secondaryNavItemRows` are the ones with 3 cells where the 3rd cell (hierarchy-tree) does NOT contain a `ul` (or is empty for this purpose).
    // And `footer-navigation-item` (which is a sub-item of `footer-navigation-block`) is not directly processed here, but its content is part of the `hierarchy-tree` of `footer-navigation-block`.
    // The BlockJson shows `footer-navigation-item` as a sub-item of `footer-navigation-block`'s `navigationItems` container.
    // However, the EDS structure shows `footer-navigation-item` and `footer-secondary-nav-item` as direct `block.children` rows. This is a discrepancy.
    // Given the `decorate` function processes all `block.children` directly, we must assume `footer-navigation-item` and `footer-secondary-nav-item` are top-level item rows.

    // Let's refine the filters based on the `hierarchy-tree` content and the original HTML rendering.
    // Original HTML shows `secondary-nav` has simple `<li><a>` items, no nested `ul`.
    // Original HTML shows `footer-menu` `link-blocks` have nested `ul`s.

    const cells = [...row.children];
    if (cells.length === 3) {
      // Check if the 3rd cell (hierarchy-tree) contains a UL for navigation-item, or not for secondary-nav-item
      const hasUl = cells[2].querySelector('ul');
      // If the 3rd cell has a UL, it's a footer-navigation-item (which is not directly rendered as a separate block, but its content is used within footer-navigation-block)
      // If it does NOT have a UL, it's a footer-secondary-nav-item.
      // This is a tricky distinction. The provided JS has `secondaryNavItemRows` as a top-level filter.
      // Let's assume `secondaryNavItemRows` are the 3-cell rows where the 3rd cell (hierarchy-tree) is NOT meant to be rendered as a nested list,
      // or is empty/simple text, unlike the rich hierarchy in `navigationBlockRows`.
      // The original HTML for secondary-nav items are simple links, so their `hierarchy-tree` field is likely empty or ignored.
      return !hasUl; // If the 3rd cell does not have a UL, it's a secondary nav item.
    }
    return false;
  });

  // The `footer-navigation-item` rows from BlockJson are not explicitly filtered and processed as separate blocks in the provided JS.
  // They are likely meant to be part of the `hierarchy-tree` of `footer-navigation-block`.
  // The current JS processes `navigationBlockRows` and `secondaryNavItemRows`.
  // The `footer-navigation-item` model has `label`, `link`, `hierarchy-tree`.
  // If these were meant to be separate top-level items, they would be caught by `row.children.length === 3`.
  // The current `secondaryNavItemRows` filter `row.children.length === 3 && row.querySelector('div:nth-child(3)').textContent.trim() !== 'Navigation Items value'`
  // would catch both `footer-navigation-item` and `footer-secondary-nav-item` if both exist as top-level rows.
  // Given the `transformNestedLists` function is called on `hierarchyRoot` from `navigationBlockRows`,
  // it implies that the `hierarchy-tree` field from `footer-navigation-block` is the primary source of nested navigation.
  // The `footer-navigation-item` model might be for a different context or not used as a top-level item in this block.
  // For now, we will stick to the existing filters and assume `secondaryNavItemRows` correctly identifies the simple secondary nav links.

  block.innerHTML = '';
  block.classList.add('footer-main');

  const container = document.createElement('div');
  container.classList.add('container');
  block.append(container);

  const footerHeaderRow = document.createElement('div');
  footerHeaderRow.classList.add('row', 'footer-header');
  container.append(footerHeaderRow);

  // Logo Section
  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  footerHeaderRow.append(logoCol);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  logoCol.append(logoDiv);

  const logoLink = document.createElement('a');
  const logoLinkAnchor = logoLinkRow.querySelector('a'); // Use logoLinkRow for the anchor
  if (logoLinkAnchor) {
    logoLink.href = logoLinkAnchor.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);

  const logoPicture = logoRow.querySelector('picture'); // Use logoRow for the picture
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
    optimizedPic.querySelector('img').classList.add('hiddenlogo1');
    optimizedPic.querySelector('img').setAttribute('width', '200');
    optimizedPic.querySelector('img').setAttribute('height', '30');
    optimizedPic.querySelector('img').style.width = 'auto';
    optimizedPic.querySelector('img').setAttribute('loading', 'lazy');
  }

  // Social Links Section
  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeaderRow.append(socialCol);

  const socialWrap = document.createElement('ul');
  socialWrap.classList.add('social-wrap');
  socialCol.append(socialWrap);

  socialLinkRows.forEach((row) => {
    const [iconCell, linkCell] = [...row.children];
    const li = document.createElement('li');

    const socialLink = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      socialLink.href = foundLink.href;
      socialLink.target = '_blank';
    }
    moveInstrumentation(linkCell, socialLink);

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '32' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      socialLink.append(optimizedPic);
      optimizedPic.querySelector('img').setAttribute('alt', 'svg file');
    }
    li.append(socialLink);
    socialWrap.append(li);
  });

  // Footer Navigation Blocks
  const footerMenuBoxRow = document.createElement('div');
  footerMenuBoxRow.classList.add('row', 'footer-menu-box');
  container.append(footerMenuBoxRow);

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  footerMenuBoxRow.append(footerMenuCol);

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');
  footerMenuCol.append(footerMenu);

  navigationBlockRows.forEach((row) => {
    const [blockTitleCell, blockTitleLinkCell, , hierarchyTreeCell] = [...row.children];

    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    footerMenu.append(linkBlocks);

    const head = document.createElement('div');
    head.classList.add('head');
    linkBlocks.append(head);

    const span = document.createElement('span');
    head.append(span);

    const blockTitleLink = document.createElement('a');
    const foundBlockTitleLink = blockTitleLinkCell.querySelector('a');
    if (foundBlockTitleLink) {
      blockTitleLink.href = foundBlockTitleLink.href;
    }
    blockTitleLink.textContent = blockTitleCell.textContent.trim();
    moveInstrumentation(blockTitleLinkCell, blockTitleLink);
    span.append(blockTitleLink);

    const small = document.createElement('small');
    span.append(small);

    // Handle hierarchy-tree richtext content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell.innerHTML; // Use innerHTML to preserve structure
    moveInstrumentation(hierarchyTreeCell, tempDiv);

    const hierarchyRoot = tempDiv.querySelector('ul');
    if (hierarchyRoot) {
      hierarchyRoot.classList.add('footer-inner-list');
      // Apply classes to nested elements as per original HTML if needed
      hierarchyRoot.querySelectorAll('li').forEach(li => {
        // Add any specific classes from original HTML if li had them
        // e.g., li.classList.add('some-class');
      });
      hierarchyRoot.querySelectorAll('a').forEach(a => {
        // Add any specific classes from original HTML if a had them
        // e.g., a.classList.add('some-other-class');
      });

      head.append(hierarchyRoot);
      transformNestedLists(hierarchyRoot);
    }
  });

  // Copyright and Secondary Nav
  const copyrightWrapRow = document.createElement('div');
  copyrightWrapRow.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightWrapRow);

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  copyrightWrapRow.append(secondaryNavCol);

  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');
  secondaryNavCol.append(secondaryNavUl);

  secondaryNavItemRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Assuming 3rd cell (hierarchy-tree) is ignored or empty for secondary nav
    const li = document.createElement('li');
    const secondaryNavLink = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      secondaryNavLink.href = foundLink.href;
    }
    secondaryNavLink.textContent = labelCell.textContent.trim();
    moveInstrumentation(linkCell, secondaryNavLink);
    li.append(secondaryNavLink);
    secondaryNavUl.append(li);
  });

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  copyrightTextCol.textContent = copyrightTextRow.querySelector('div').textContent.trim();
  moveInstrumentation(copyrightTextRow, copyrightTextCol);
  copyrightWrapRow.append(copyrightTextCol);
}
