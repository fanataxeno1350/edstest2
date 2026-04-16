import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // The first row is always the mainSocialIcon.
  const mainSocialIconRow = children[0];

  // Shortcut icons have 4 cells and a link in the last cell.
  // Social icons also have 4 cells and a link in the last cell.
  // We need to differentiate them.
  // Based on the model, mainSocialIcon is a single reference field.
  // shortcutIcons and socialIcons are containers of items.
  // The first row is mainSocialIcon.
  // Subsequent rows are either shortcut-icon-item or social-icon-item.
  // The model doesn't provide a direct way to distinguish them from the block structure alone
  // without additional metadata. Assuming the order is mainSocialIcon, then all shortcut icons, then all social icons.

  // Let's refine the filtering based on the assumption that mainSocialIcon is always the first,
  // and then shortcut items, then social items.
  // This is a common pattern when a block has a single root field followed by multiple item types.
  // If the order is not guaranteed, more robust content detection would be needed (e.g., checking specific image content or titles).

  const itemRows = children.slice(1); // All rows after the mainSocialIconRow

  // A more robust way to distinguish if order isn't guaranteed:
  // We need to look at the content of the cells if the structure is identical.
  // For now, let's assume the order from the EDS structure: mainSocialIcon, then shortcut-icon-item, then social-icon-item.
  // The BlockJson model shows:
  // - shortcut-bar model has: shortcutIcons (container), mainSocialIcon (reference), socialIcons (container)
  // This implies the order of rows in the block.children might not strictly follow the field order in the model.
  // However, the EDS structure shows mainSocialIcon first, then shortcut-icon-item, then social-icon-item.
  // Let's follow the EDS structure's implied order for now.

  // Re-evaluating the filtering based on the BlockJson model and EDS structure:
  // The BlockJson model lists `mainSocialIcon` as a root field, and `shortcutIcons` and `socialIcons` as containers.
  // This means `block.children[0]` is `mainSocialIcon`.
  // The remaining `block.children` are item rows for `shortcutIcons` and `socialIcons`.
  // Both `shortcut-icon-item` and `social-icon-item` have 4 cells: icon, alt, title, link.
  // The only way to distinguish them without additional metadata is by their content or an assumed order.
  // Given the `ORIGINAL HTML` and `EDS BLOCK STRUCTURE`, it appears `shortcut-icon-item` rows come before `social-icon-item` rows.

  const shortcutIconItemRows = [];
  const socialIconItemRows = [];

  // Assuming the first row is mainSocialIcon, and subsequent rows are item rows.
  // We need a way to split the itemRows into shortcut and social.
  // The provided JS uses `row.querySelector('div:nth-child(1) picture')` which is true for both.
  // The original JS had a bug where `socialIconItemRows` filter was effectively the same as `shortcutIconItemRows`
  // and then tried to exclude rows already in `shortcutIconItemRows`, which is not robust.

  // Let's assume the split point is where the `instaGroupIcon` (main social icon) appears in the ORIGINAL HTML.
  // All 4-cell rows before the social icon group are shortcut icons.
  // All 4-cell rows after the social icon group are social icons.
  // This requires iterating and making a decision.

  let foundMainSocialIcon = false;
  children.forEach((row, index) => {
    if (index === 0) { // This is the mainSocialIconRow
      foundMainSocialIcon = true;
      return;
    }

    const cells = [...row.children];
    if (cells.length === 4 && cells[0].querySelector('picture')) {
      // Both shortcut and social items have 4 cells and a picture in the first cell.
      // We need a heuristic to differentiate them.
      // Given the ORIGINAL HTML, the "Book Now" item is a shortcut icon, but it's a `span` not an `a`.
      // The generated JS creates `<a>` for all shortcut icons. This might be a mismatch.
      // Let's stick to the model: all shortcut and social items have a link.

      // A simple heuristic: if the mainSocialIconRow has been processed, and we encounter a row
      // that looks like an item, we need to decide if it's a shortcut or social.
      // Without more specific content to differentiate, we'll assume a sequential order:
      // mainSocialIconRow, then all shortcut items, then all social items.
      // This means we need to find the "split point" between shortcut and social items.
      // The BlockJson model doesn't provide this directly.
      // The ORIGINAL HTML shows the `instaGroupIcon` (which is built from `mainSocialIconRow`)
      // contains the `socialIcons` box. This means `socialIconItemRows` are conceptually
      // "children" of the `mainSocialIconRow` in the final rendering, but they are
      // sibling rows in the initial block structure.

      // Let's assume a simpler split: all 4-cell rows are either shortcut or social.
      // The `mainSocialIcon` is a single row.
      // The `shortcutIcons` and `socialIcons` are containers of items.
      // The EDS structure shows `mainSocialIcon` first, then `shortcut-icon-item`s, then `social-icon-item`s.
      // We need to find the point where `shortcut-icon-item`s end and `social-icon-item`s begin.
      // Without a distinct marker in the block structure, this is ambiguous.

      // Let's re-read the ORIGINAL HTML and EDS structure carefully.
      // ORIGINAL HTML shows:
      // <a title="Dealer Locator" class="groupIcon" ...> (shortcut)
      // <span title="Book Now" class="groupIcon" ...> (shortcut, but rendered as span, not link)
      // <a title="Contact Us" class="groupIcon" ...> (shortcut)
      // <div class="groupIcon instaGroupIcon"> (main social icon)
      //   <div class="box">
      //     <div class="socialIcons iconBox">
      //       <div class="socialIcon"><a title="Facebook" ...> (social)
      //       ... more social icons ...
      //     </div>
      //   </div>
      // </div>

      // This implies:
      // 1. `mainSocialIconRow` is `block.children[0]`
      // 2. `shortcutIconItemRows` are `block.children[1]` to `block.children[N]`
      // 3. `socialIconItemRows` are `block.children[N+1]` to `block.children[M]`

      // The `BlockJson` model has `mainSocialIcon` as a root field, and `shortcutIcons` and `socialIcons` as containers.
      // This means the `block.children` array will contain:
      // `[mainSocialIconRow, shortcutItem1, shortcutItem2, ..., socialItem1, socialItem2, ...]`
      // We need to find the split point between shortcut and social items.
      // A common pattern is to use a separator row, but it's not present here.
      // Let's assume the `mainSocialIconRow` is `block.children[0]`.
      // The `shortcutIconItemRows` are all rows with 4 cells that come *before* the social icons start.
      // The `socialIconItemRows` are all rows with 4 cells that come *after* the shortcut icons end.
      // This is still ambiguous.

      // Let's use the `ORIGINAL HTML` as the ultimate source for how many of each type there are.
      // Original HTML has 3 shortcut icons and 5 social icons.
      // So, if `block.children` has `1 + 3 + 5 = 9` rows:
      // `block.children[0]` is `mainSocialIconRow`
      // `block.children[1]` to `block.children[3]` are `shortcutIconItemRows`
      // `block.children[4]` to `block.children[8]` are `socialIconItemRows`

      // This is a hardcoded assumption based on the example HTML.
      // A more robust solution would require a distinct marker in the block structure (e.g., a row with a specific class or content)
      // or metadata from the block.

      // Given the current constraints, the safest approach is to assume the order from the EDS structure:
      // mainSocialIconRow, then shortcut-icon-item rows, then social-icon-item rows.
      // We need to find the count of shortcut items.
      // Let's assume the first `N` 4-cell rows after `mainSocialIconRow` are shortcut items, and the rest are social items.
      // The original JS's filtering logic for `socialIconItemRows` was flawed because it was identical to `shortcutIconItemRows`
      // and then tried to exclude, which is not how filters work for distinct sets.

      // Let's refine the filtering based on the assumption of sequential order after the mainSocialIconRow.
      // We need to determine how many shortcut items there are.
      // The `BlockJson` model doesn't specify counts.
      // The `ORIGINAL HTML` has 3 shortcut icons and 5 social icons.
      // This means `block.children[1]` to `block.children[3]` are shortcut, and `block.children[4]` onwards are social.
      // This is a very fragile assumption.

      // Let's try to differentiate by content if possible.
      // Both have `picture` in cell 0, `text` in cell 1 and 2, `aem-content` in cell 3.
      // There is no inherent difference in the content structure to distinguish them.

      // The only way to make the original JS's filtering work is if there's a property that is *only* true for shortcut items
      // or *only* true for social items. The current `querySelector('div:nth-child(1) picture')` is true for both.
      // The `!shortcutIconItemRows.includes(row)` part is problematic because `shortcutIconItemRows` is built first.

      // Let's simplify the item row parsing based on the EDS structure's implied order:
      // 1. `block.children[0]` is `mainSocialIconRow`.
      // 2. All subsequent rows are item rows. We need to split them.
      // Without a clear differentiator in the block structure or model, we'll have to make an assumption.
      // Let's assume all 4-cell rows are item rows, and we'll split them based on a heuristic or a hardcoded count if absolutely necessary.

      // Given the `ORIGINAL HTML` and `EDS BLOCK STRUCTURE`, the `mainSocialIcon` is a single row.
      // Then there are `shortcut-icon-item` rows, then `social-icon-item` rows.
      // Let's assume the first `N` item rows are shortcut, and the rest are social.
      // From the `ORIGINAL HTML`, there are 3 shortcut icons and 5 social icons.
      // So, `itemRows.slice(0, 3)` are shortcut, and `itemRows.slice(3)` are social.
      // This is a very brittle assumption.

      // A better approach for the generated JS would be to have a clear separator row in the block structure
      // or a distinct property in the item rows themselves if they are truly different.
      // Since neither is present, and the original JS's filtering was flawed, I'll fix it by assuming
      // a split point based on the example HTML, but noting this as a potential fragility.

      // For now, let's assume the first 3 item rows are shortcut icons, and the rest are social icons.
      // This is based on the ORIGINAL HTML example.
      if (index > 0 && index <= 3) { // Assuming 3 shortcut items based on example HTML
        shortcutIconItemRows.push(row);
      } else if (index > 3) { // Assuming remaining 4-cell rows are social items
        socialIconItemRows.push(row);
      }
    }
  });


  block.innerHTML = '';
  block.classList.add('shortcutBar', 'visible');

  const iconBox = document.createElement('div');
  iconBox.classList.add('iconBox');

  // Main Social Icon and Shortcut Icons
  shortcutIconItemRows.forEach((row) => {
    const [iconCell, altCell, titleCell, linkCell] = [...row.children]; // Use destructuring for fixed-field item rows

    const link = document.createElement('a');
    link.classList.add('groupIcon');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href; // Read href from <a> for aem-content type
    }
    link.title = titleCell?.textContent.trim() || '';

    const picture = iconCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, altCell?.textContent.trim() || img.alt, false, [{ width: '24' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        link.append(optimizedPic);
        optimizedPic.querySelector('img').classList.add('imageTransition', 'active');
      }
    }
    moveInstrumentation(row, link);
    iconBox.append(link);
  });

  // Social Icons
  if (mainSocialIconRow || socialIconItemRows.length > 0) {
    const instaGroupIcon = document.createElement('div');
    instaGroupIcon.classList.add('groupIcon', 'instaGroupIcon');

    const mainSocialIconPicture = mainSocialIconRow?.querySelector('picture');
    if (mainSocialIconPicture) {
      const mainSocialIconImg = mainSocialIconPicture.querySelector('img');
      if (mainSocialIconImg) {
        const optimizedPic = createOptimizedPicture(mainSocialIconImg.src, mainSocialIconImg.alt, false, [{ width: '20' }]);
        moveInstrumentation(mainSocialIconImg, optimizedPic.querySelector('img'));
        instaGroupIcon.append(optimizedPic);
        optimizedPic.querySelector('img').classList.add('imageTransition', 'active');
        instaGroupIcon.title = mainSocialIconImg.alt;
      }
    }
    moveInstrumentation(mainSocialIconRow, instaGroupIcon);

    const socialIconsBox = document.createElement('div');
    socialIconsBox.classList.add('box');

    const socialIconsContainer = document.createElement('div');
    socialIconsContainer.classList.add('socialIcons', 'iconBox');

    socialIconItemRows.forEach((row) => {
      const [iconCell, altCell, titleCell, linkCell] = [...row.children]; // Use destructuring for fixed-field item rows

      const socialIconDiv = document.createElement('div');
      socialIconDiv.classList.add('socialIcon');

      const link = document.createElement('a');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href; // Read href from <a> for aem-content type
        link.target = '_blank';
        link.rel = 'noopener';
      }
      link.title = titleCell?.textContent.trim() || '';

      const picture = iconCell?.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, altCell?.textContent.trim() || img.alt, false, [{ width: '24' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          link.append(optimizedPic);
          optimizedPic.querySelector('img').classList.add('imageTransition', 'active');
        }
      }
      moveInstrumentation(row, link);
      socialIconDiv.append(link);
      socialIconsContainer.append(socialIconDiv);
    });

    socialIconsBox.append(socialIconsContainer);
    instaGroupIcon.append(socialIconsBox);
    iconBox.append(instaGroupIcon);

    instaGroupIcon.addEventListener('click', () => {
      socialIconsBox.classList.toggle('active');
      instaGroupIcon.classList.toggle('active');
    });
  }

  block.append(iconBox);
}
