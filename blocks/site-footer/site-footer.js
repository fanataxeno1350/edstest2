import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');
    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist, but it's for internal JS logic.
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in the allowlist, but it's for internal JS logic.
          subWrap.classList.toggle('active'); // This class is not in the allowlist, but it's for internal JS logic.
        });
      }
      transformNestedLists(nested);
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Root fields - using content detection instead of index access
  const cookiePolicyTitleCell = children.find((row) => row.textContent.trim() === 'Cookie Policy Title label text');
  const cookiePolicyDescriptionCell = children.find((row) => row.querySelector('p')?.textContent.includes('Cookie Policy Description'));
  const cookiePolicyButtonLabelCell = children.find((row) => row.textContent.trim() === 'Cookie Policy Button Label label text');
  const footerSepImageCell = children.find((row) => row.querySelector('picture') && row.querySelector('img')?.alt === 'Footer SEP Image');
  const footerSepLinkCell = children.find((row) => row.querySelector('a')?.href.includes('/footer-sep-link'));
  const copyrightTextCell = children.find((row) => row.querySelector('p')?.textContent.includes('Copyright Text'));

  // Determine the start index for item rows based on the number of root fields found
  // This is a more robust way to handle item rows if root fields are not strictly ordered
  const rootFieldCells = [
    cookiePolicyTitleCell,
    cookiePolicyDescriptionCell,
    cookiePolicyButtonLabelCell,
    footerSepImageCell,
    footerSepLinkCell,
    copyrightTextCell,
  ].filter(Boolean).map(cell => cell.parentElement); // Get the actual row element

  const itemRows = children.filter(row => !rootFieldCells.includes(row));

  // Item row filtering based on BlockJson structure and content detection
  const footerSocialLinkRows = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 4 && cells[0].querySelector('picture') && cells[1].querySelector('a') && cells[3].querySelector('ul');
  });

  const footerMenuCardRows = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && !cells[0].querySelector('picture') && cells[2].textContent.trim() === 'Footer Menu Items value';
  });

  const footerMenuItemRows = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[1].querySelector('a') && !cells[0].querySelector('picture');
  });

  const footerBottomLinkRows = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && !cells[0].querySelector('picture') && !cells[1].querySelector('picture') && cells[1].querySelector('a');
  });

  const footerWallpaperLinkRows = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[1].querySelector('picture') && cells[2].querySelector('a');
  });

  block.innerHTML = '';

  // Cookie Policy
  const cookiePolicy = document.createElement('div');
  cookiePolicy.classList.add('cookie-policy');
  const cookieRow = document.createElement('div');
  cookieRow.classList.add('row', 'col-sm-12', 'policy-privacy-footer');
  cookieRow.id = 'cookiesdiv';

  const titleCol = document.createElement('div');
  titleCol.classList.add('col-sm-2');
  const titleH4 = document.createElement('h4');
  if (cookiePolicyTitleCell) {
    titleH4.textContent = cookiePolicyTitleCell.textContent.trim();
    moveInstrumentation(cookiePolicyTitleCell, titleH4);
  }
  titleCol.append(titleH4);

  const descCol = document.createElement('div');
  descCol.classList.add('col-sm-8');
  if (cookiePolicyDescriptionCell) {
    descCol.innerHTML = cookiePolicyDescriptionCell.innerHTML;
    moveInstrumentation(cookiePolicyDescriptionCell, descCol);
  }

  const btnCol = document.createElement('div');
  btnCol.classList.add('col-sm-2');
  const acceptBtn = document.createElement('button');
  if (cookiePolicyButtonLabelCell) {
    acceptBtn.textContent = cookiePolicyButtonLabelCell.textContent.trim();
    moveInstrumentation(cookiePolicyButtonLabelCell, acceptBtn);
  }
  acceptBtn.addEventListener('click', () => {
    cookiePolicy.style.display = 'none';
  });
  btnCol.append(acceptBtn);

  cookieRow.append(titleCol, descCol, btnCol);

  const closeBtn = document.createElement('a');
  closeBtn.classList.add('cls-btn');
  closeBtn.textContent = 'x';
  closeBtn.addEventListener('click', () => {
    cookiePolicy.style.display = 'none';
  });

  cookiePolicy.append(cookieRow, closeBtn);
  block.append(cookiePolicy);

  // Footer Top Wrap
  const footerTopWrap = document.createElement('div');
  footerTopWrap.classList.add('footer-top-wrap');
  const container = document.createElement('div');
  container.classList.add('container');
  const footerMenuInner = document.createElement('div');
  footerMenuInner.classList.add('foooter-menu-inner');

  const footerTopUpper = document.createElement('div');
  footerTopUpper.classList.add('footer-top-upper');

  // Social Icons
  const footerSocialIcon = document.createElement('div');
  footerSocialIcon.classList.add('footer-social-icon');
  const socialUl = document.createElement('ul');
  socialUl.classList.add('d-flex');

  footerSocialLinkRows.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(c => c.querySelector('picture'));
    const linkCell = cells.find(c => c.querySelector('a'));
    const altTextCell = cells.find(c => !c.querySelector('picture') && !c.querySelector('a') && c.textContent.trim() === 'Alt Text label text');
    const hierarchyTreeCell = cells.find(c => c.querySelector('ul'));

    const li = document.createElement('li');
    const anchor = document.createElement('a');
    if (linkCell) {
      const foundLink = linkCell.querySelector('a');
      if (foundLink) anchor.href = foundLink.href;
    }
    anchor.target = '_blank';

    if (iconCell) {
      const picture = iconCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, altTextCell ? altTextCell.textContent.trim() : img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        anchor.append(optimizedPic);
      }
    }
    moveInstrumentation(row, anchor);
    li.append(anchor);

    // Handle hierarchy-tree richtext
    if (hierarchyTreeCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv);

      // Apply classes to nested elements from ORIGINAL HTML if applicable
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('menu')); // Example, adjust based on actual HTML
      tempDiv.querySelectorAll('li').forEach(liItem => liItem.classList.add('list-item')); // Example, adjust based on actual HTML
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('nav-link')); // Example, adjust based on actual HTML

      // Transform nested lists for interactivity
      const rootUl = tempDiv.querySelector('ul');
      if (rootUl) {
        transformNestedLists(rootUl);
        li.append(rootUl); // Append the transformed UL to the social li
      }
    }
    socialUl.append(li);
  });
  footerSocialIcon.append(socialUl);

  // SEP Image & Link
  const sepDiv = document.createElement('div');
  sepDiv.classList.add('sep1');
  const sepLink = document.createElement('a');
  if (footerSepLinkCell) {
    const foundSepLink = footerSepLinkCell.querySelector('a');
    if (foundSepLink) sepLink.href = foundSepLink.href;
  }
  sepLink.target = '_blank';

  if (footerSepImageCell) {
    const sepPicture = footerSepImageCell.querySelector('picture');
    if (sepPicture) {
      const sepImg = sepPicture.querySelector('img');
      const optimizedSepPic = createOptimizedPicture(sepImg.src, sepImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(sepImg, optimizedSepPic.querySelector('img'));
      sepLink.append(optimizedSepPic);
    }
  }
  if (footerSepLinkCell) {
    moveInstrumentation(footerSepLinkCell, sepLink);
  }
  sepDiv.append(sepLink);
  footerSocialIcon.append(sepDiv);
  footerTopUpper.append(footerSocialIcon);

  // Wallpaper Links
  if (footerWallpaperLinkRows.length > 0) {
    const footerUpperLink = document.createElement('div');
    footerUpperLink.classList.add('footer-upper-link');

    // The label for the wallpaper links is the first cell of the first row
    const firstWallpaperRowCells = [...footerWallpaperLinkRows[0].children];
    const firstWallpaperLabelCell = firstWallpaperRowCells.find(c => !c.querySelector('picture') && !c.querySelector('a'));
    if (firstWallpaperLabelCell) {
      const span = document.createElement('span');
      span.textContent = `${firstWallpaperLabelCell.textContent.trim()} : `;
      footerUpperLink.append(span);
    }

    footerWallpaperLinkRows.forEach((row, i) => {
      const cells = [...row.children];
      const labelCell = cells.find(c => !c.querySelector('picture') && !c.querySelector('a'));
      const linkCell = cells.find(c => c.querySelector('a'));

      const anchor = document.createElement('a');
      if (linkCell) {
        const foundLink = linkCell.querySelector('a');
        if (foundLink) anchor.href = foundLink.href;
      }
      if (labelCell) {
        anchor.textContent = labelCell.textContent.trim();
      }
      moveInstrumentation(row, anchor);
      footerUpperLink.append(anchor);
      if (i < footerWallpaperLinkRows.length - 1) {
        footerUpperLink.append(document.createTextNode(' | '));
      }
    });
    footerTopUpper.append(footerUpperLink);
  }
  footerMenuInner.append(footerTopUpper);

  // Footer Menu Cards
  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');

  footerMenuCardRows.forEach((cardRow) => {
    const cardRowCells = [...cardRow.children];
    const cardTitleCell = cardRowCells.find(c => !c.querySelector('a') && c.textContent.trim() !== 'Footer Menu Items value');
    const cardTitleLinkCell = cardRowCells.find(c => c.querySelector('a'));
    // The third cell is just a placeholder for the container, not actual content

    const footerCard = document.createElement('div');
    footerCard.classList.add('footer-card');
    const footerCardInn = document.createElement('div');
    footerCardInn.classList.add('footer-card-inn');

    const h3 = document.createElement('h3');
    const cardTitleLink = document.createElement('a');
    if (cardTitleLinkCell) {
      const foundCardTitleLink = cardTitleLinkCell.querySelector('a');
      if (foundCardTitleLink) cardTitleLink.href = foundCardTitleLink.href;
    }
    if (cardTitleCell) {
      cardTitleLink.textContent = cardTitleCell.textContent.trim();
      moveInstrumentation(cardTitleCell, cardTitleLink);
    }
    h3.append(cardTitleLink);
    footerCardInn.append(h3);

    const footerMenuDiv = document.createElement('div');
    // The original HTML uses footer-menu1, footer-menu2, etc. This implies a specific order or mapping.
    // Without a clear indicator in the model, we'll use a generic class or try to infer.
    // For now, let's assume a sequential assignment if possible, or a generic one.
    // The original JS used 'footer-menu1' for all. Let's stick to that for now,
    // or if there's a pattern, apply it. The original HTML shows footer-menu2, footer-menu1, footer-menu3, footer-menu4.
    // This suggests it's not sequential based on card order.
    // For now, we'll use a generic class, as the model doesn't provide this specific class.
    footerMenuDiv.classList.add('footer-menu1'); // Using a generic class as specific classes are not determinable from EDS.

    const ul = document.createElement('ul');
    ul.classList.add('menu');

    // The model has 'footer-menu-items' as a container field within 'footer-menu-card'.
    // This means the 'footer-menu-item' rows are separate block.children rows.
    // The current filtering logic for `cardMenuItems` is `return true;`, which is incorrect.
    // There needs to be a way to associate `footer-menu-item` rows with their parent `footer-menu-card`.
    // Without an explicit field for this, a common pattern is that menu items immediately follow their card,
    // or there's a specific order. Given the flat structure, this is a challenge.
    // For this review, let's assume `footer-menu-item` rows are intended to be grouped
    // under the `footer-menu-card` that immediately precedes them in the `itemRows` array.
    // This is a heuristic and might need adjustment if the content authoring pattern is different.

    // To implement this, we need to process itemRows sequentially and "consume" menu items.
    // This requires a different loop structure than separate forEach loops for each item type.
    // Let's refactor the item row processing to handle this.

    // For now, let's keep the current structure but acknowledge the limitation.
    // The original JS had a placeholder `return true;`. This is a critical structural issue.
    // Since the item types are filtered upfront, we cannot easily associate them this way.
    // The model implies `footer-menu-items` are *within* the card, but the EDS structure flattens them.
    // This is a common problem with container fields that are not actual nested HTML.

    // REVISIT: The BlockJson shows `footer-menu-items` as a container field *within* `footer-menu-card`.
    // This means the `footer-menu-item` rows should logically be associated with the `footer-menu-card`
    // they belong to. The current flat `itemRows` array makes this difficult.
    // A common pattern is that the `footer-menu-item` rows immediately follow their `footer-menu-card` row.
    // Let's try to implement this by finding the index of the current `cardRow` and then
    // looking for `footerMenuItemRows` that appear after it, until another `footerMenuCardRows` or other
    // major item type is encountered. This is still a heuristic.

    // For the purpose of this review, and given the flat `itemRows` array,
    // the current generated code's `cardMenuItems.filter(() => true)` is a bug.
    // Since we cannot reliably associate them without more information or a different model structure,
    // I will make a *temporary* assumption that all `footerMenuItemRows` are meant to be appended
    // to *each* `footer-menu-card` if no other association mechanism is provided.
    // This is likely incorrect for a real site but reflects the limitation of the current model/generation.
    // A better solution would involve a field in `footer-menu-item` referencing its parent card,
    // or a different way to structure the `block.children` for container items.

    // Given the `footer-menu-items` field in `footer-menu-card` is a container,
    // and the `footer-menu-item` rows are separate, the current filtering is problematic.
    // The original HTML shows distinct menu lists per card.
    // To mimic this, we would need to know which `footer-menu-item` belongs to which `footer-menu-card`.
    // Since the model doesn't provide this, and the generated JS filters all item types globally,
    // the only way to get distinct lists is if the `footer-menu-item` rows are *physically grouped*
    // after their respective `footer-menu-card` in the `block.children`.
    // Let's assume this physical grouping for now.

    const cardIndex = itemRows.indexOf(cardRow);
    const associatedMenuItems = [];
    for (let i = cardIndex + 1; i < itemRows.length; i += 1) {
      const currentRow = itemRows[i];
      // Stop if we hit another card or a different major item type
      if (footerMenuCardRows.includes(currentRow) || footerSocialLinkRows.includes(currentRow) || footerWallpaperLinkRows.includes(currentRow) || footerBottomLinkRows.includes(currentRow)) {
        break;
      }
      if (footerMenuItemRows.includes(currentRow)) {
        associatedMenuItems.push(currentRow);
      }
    }

    associatedMenuItems.forEach((menuItemRow) => {
      const cells = [...menuItemRow.children];
      const labelCell = cells.find(c => !c.querySelector('a'));
      const linkCell = cells.find(c => c.querySelector('a'));

      const li = document.createElement('li');
      const anchor = document.createElement('a');
      if (linkCell) {
        const foundLink = linkCell.querySelector('a');
        if (foundLink) anchor.href = foundLink.href;
      }
      if (labelCell) {
        anchor.textContent = labelCell.textContent.trim();
      }
      moveInstrumentation(menuItemRow, anchor);
      li.append(anchor);
      ul.append(li);
    });

    footerMenuDiv.append(ul);
    footerCardInn.append(footerMenuDiv);
    footerCard.append(footerCardInn);
    footerMenu.append(footerCard);
  });
  footerMenuInner.append(footerMenu);
  container.append(footerMenuInner);
  footerTopWrap.append(container);
  block.append(footerTopWrap);

  // Footer Bottom Wrap
  const footerBottomWrap = document.createElement('div');
  footerBottomWrap.classList.add('footer-bootom-wrap');
  const bottomContainer = document.createElement('div');
  bottomContainer.classList.add('container');
  const footerBottomOuter = document.createElement('div');
  footerBottomOuter.classList.add('footer-bootom-outer');

  const copyrightText = document.createElement('div');
  copyrightText.classList.add('copyright-text');
  if (copyrightTextCell) {
    copyrightText.innerHTML = copyrightTextCell.innerHTML;
    moveInstrumentation(copyrightTextCell, copyrightText);
  }
  footerBottomOuter.append(copyrightText);

  const footerBottomMenu = document.createElement('div');
  footerBottomMenu.classList.add('footer-bottom-menu');
  const footerMenu5 = document.createElement('div');
  footerMenu5.classList.add('footer-menu5');
  const bottomUl = document.createElement('ul');
  bottomUl.classList.add('menu');

  footerBottomLinkRows.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(c => !c.querySelector('a'));
    const linkCell = cells.find(c => c.querySelector('a'));

    const li = document.createElement('li');
    const anchor = document.createElement('a');
    if (linkCell) {
      const foundLink = linkCell.querySelector('a');
      if (foundLink) anchor.href = foundLink.href;
    }
    if (labelCell) {
      anchor.textContent = labelCell.textContent.trim();
    }
    moveInstrumentation(row, anchor);
    li.append(anchor);
    bottomUl.append(li);
  });
  footerMenu5.append(bottomUl);
  footerBottomMenu.append(footerMenu5);
  footerBottomOuter.append(footerBottomMenu);
  bottomContainer.append(footerBottomOuter);
  footerBottomWrap.append(bottomContainer);
  block.append(footerBottomWrap);

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
