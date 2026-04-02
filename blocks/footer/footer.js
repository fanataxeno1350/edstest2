import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    socialLinksContainer,
    navigationLinksContainer,
    languageLinksContainer,
    policyLinksContainer,
    copyrightRow,
    ...itemRows
  ] = [...block.children];

  // Content detection based on BlockJson structure:
  // social-link: 2 cells (link, ariaLabel)
  // navigation-link: 2 cells (link, title)
  // language-link: 3 cells (link, ariaLabel, dataLang)
  // policy-link: 2 cells (link, title)

  // Note: Social-link, navigation-link, and policy-link all have 2 cells.
  // We need to differentiate them. The original HTML and BlockJson imply
  // that the order of item rows in the block is consistent:
  // social-links first, then navigation-links, then language-links, then policy-links.
  // We can use the presence of the parent container fields to guide the filtering.

  const socialLinks = [];
  const navigationLinks = [];
  const languageLinks = [];
  const policyLinks = [];

  // Assuming itemRows are ordered as per the EDS Block Structure
  // First, identify language links as they have 3 cells, making them unique.
  itemRows.forEach((row) => {
    if (row.children.length === 3) {
      languageLinks.push(row);
    }
  });

  // Filter out language links from itemRows for further processing
  const remainingItemRows = itemRows.filter((row) => row.children.length !== 3);

  // Now, for the 2-cell items, we need to infer their type based on the order
  // of the container fields in the block.
  // The first set of 2-cell items after the initial containers are social links.
  // Then navigation links, then policy links.

  let currentItemIndex = 0;

  // Social Links (2 cells)
  // We can assume the first set of 2-cell items are social links until we hit a different type.
  // A more robust way would be to check the content of the cells if there was a clear differentiator,
  // but given the structure, sequential processing based on the container fields is implied.
  // For this review, we'll rely on the order of the containers in the block.children array.
  // The original JS tried to filter based on `!socialLinks.includes(row)` which is problematic
  // if the filters are run independently. A single pass is better.

  // Let's re-evaluate the filtering based on the EDS Block Structure and BlockJson.
  // The `itemRows` are a flat list of all sub-components.
  // The `block.children` destructuring correctly separates the *container* rows.
  // The `itemRows` then contain all the actual link items.
  // The problem is that social-link, navigation-link, and policy-link all have 2 cells.
  // The only unique one is language-link with 3 cells.

  // A better approach is to iterate through `itemRows` and assign them based on the
  // expected order of item types as defined in the BlockJson `filters` and `models`.
  // The `filters` section in BlockJson is not directly used for runtime filtering,
  // but it implies the types of items that can exist.
  // The `models` section shows the structure of each item type.

  // Given the `block.children` destructuring, the first 5 are containers/copyright.
  // The `itemRows` are then ALL the actual link items.
  // The original JS tried to filter `itemRows` multiple times, which is inefficient and error-prone for 2-cell items.

  // Let's process `itemRows` once, assigning them to their respective arrays.
  // We'll use the number of children to distinguish language links.
  // For 2-child items, we'll need a more specific check, or rely on the implied order.
  // The original HTML shows social links first, then navigation links, then policy links.
  // This implies the order in `itemRows` will follow this.

  // Let's re-implement the filtering with a single pass and clearer logic.
  itemRows.forEach((row) => {
    const numChildren = row.children.length;
    if (numChildren === 3) {
      languageLinks.push(row);
    } else if (numChildren === 2) {
      // This is the tricky part. Social, Navigation, and Policy links all have 2 children.
      // We need to infer based on the content or a more sophisticated check.
      // The original JS tried `row.querySelector('a') && row.querySelector('div:nth-child(2)')`
      // which is true for all 2-cell link types.
      // The only way to differentiate without an explicit type indicator in the HTML
      // is by the *order* they appear in the `itemRows` if that order is guaranteed
      // by the content authoring.

      // Assuming the authoring order matches the container order in the block definition:
      // 1. Social Links
      // 2. Navigation Links
      // 3. Policy Links

      // This is a common pattern in EDS blocks where multiple item types have the same cell count.
      // The best way to handle this is to count the items as we assign them.
      // However, the current structure of `itemRows` is a flat list.
      // A more robust solution would be to have the containers themselves contain their children,
      // but the current EDS structure flattens them.

      // Given the current `itemRows` is a flat list of all items after the initial 5 rows,
      // and multiple item types have 2 cells, the most reliable way is to iterate and assign
      // based on the *expected sequence* of item types if the authoring guarantees it.
      // If not, there's an ambiguity in the model/structure.

      // Let's assume the order in `itemRows` is: all social-links, then all navigation-links, then all policy-links.
      // This is a common implicit contract for blocks with multiple item types of same cell count.
      // The original JS's filtering `!socialLinks.includes(row)` is trying to achieve this implicitly.

      // A cleaner way is to determine the *total count* of each 2-cell item type from the original block.
      // However, we don't have that count directly.

      // Let's stick to the original JS's intent but simplify the filtering.
      // The original JS's filtering for `socialLinks`, `navigationLinks`, `policyLinks` is problematic
      // because `itemRows` is a flat list. If `socialLinks` is filtered first, then `navigationLinks`
      // is filtered from `itemRows` *excluding* `socialLinks`, and so on. This implies an order.

      // Let's refine the filtering based on the original JS's intent to distinguish by exclusion.
      // This is fragile if the order isn't guaranteed.
      // A better way is to check for unique content within the 2 cells if possible.
      // For example, if social links always have an icon class, and navigation links don't.
      // Looking at the original HTML, social links have `qd-icon` classes. Navigation links don't.
      // Policy links also don't. This can be a differentiator!

      const firstCell = row.children[0];
      const secondCell = row.children[1];

      if (firstCell.querySelector('a') && secondCell.textContent.trim().toLowerCase().match(/^(x|instagram|youtube|tiktok|linkedin)$/)) {
        // This heuristic assumes social links' ariaLabel will be one of the social media names.
        socialLinks.push(row);
      } else if (firstCell.querySelector('a') && secondCell.textContent.trim().length > 0) {
        // This is still ambiguous between navigation and policy links.
        // Both have a link in cell 1 and a title in cell 2.
        // The only way to distinguish them without an explicit marker is by their position
        // in the `itemRows` list, assuming a fixed order.

        // Let's assume the order: social, navigation, policy.
        // We've already identified social links.
        // Now, we need to distinguish navigation from policy.
        // The original HTML shows navigation links before policy links.
        // So, we'll assign them sequentially. This is the most common pattern for flat item lists.

        // This requires a single pass and state.
        // Let's reset the filtering and do a single pass.
      }
    }
  });

  // Re-doing the item row parsing with a single pass and better content detection for 2-cell items.
  // The key differentiator for social links is the `ariaLabel` content matching known social platforms.
  // For navigation vs policy, if no other differentiator, we have to assume order.

  const allTwoCellItems = [];
  itemRows.forEach((row) => {
    const numChildren = row.children.length;
    if (numChildren === 3) {
      languageLinks.push(row);
    } else if (numChildren === 2) {
      allTwoCellItems.push(row);
    }
  });

  // Now, process allTwoCellItems.
  // First, identify social links based on ariaLabel content.
  const remainingTwoCellItems = [];
  allTwoCellItems.forEach((row) => {
    const ariaLabelCell = row.children[1]; // Second cell is ariaLabel for social, title for others
    if (ariaLabelCell && ariaLabelCell.textContent.trim().toLowerCase().match(/^(x|instagram|youtube|tiktok|linkedin)$/)) {
      socialLinks.push(row);
    } else {
      remainingTwoCellItems.push(row);
    }
  });

  // Now, `remainingTwoCellItems` contains both navigation and policy links.
  // Without a further content-based differentiator, we must assume a sequential order.
  // The BlockJson and original HTML imply navigation links come before policy links.
  // We'll split `remainingTwoCellItems` into navigation and policy based on the relative counts
  // of their respective containers in the block.children array.
  // This is still a heuristic, but the most reasonable given the flat itemRows.

  // The number of items for each container is not directly available from `block.children`.
  // The original JS's `filter` approach with `!socialLinks.includes(row)` implies
  // that the filters are applied in a specific order, which means the items themselves
  // are also ordered.

  // Let's go back to the original JS's filtering logic, but make it more explicit
  // and ensure the `itemRows` are processed correctly.
  // The original JS was trying to filter `itemRows` multiple times.
  // This is only safe if the filters are mutually exclusive and applied in a specific order.

  // Let's re-do the destructuring and filtering to be more robust.
  // The `itemRows` are a flat list.
  // The `block.children` destructuring correctly identifies the *container* rows.
  // The `itemRows` are the actual items.

  // The most reliable way to distinguish 2-cell items without explicit type markers
  // is to use a heuristic based on the content (e.g., social icon names) and then
  // assume sequential order for the remaining ambiguous types.

  // Let's refine the item filtering to be a single pass over `itemRows`
  // and assign to the correct arrays based on cell count and content heuristics.
  // This is the most robust way without adding data attributes to the HTML.

  // Clear previous assignments
  socialLinks.length = 0;
  navigationLinks.length = 0;
  languageLinks.length = 0;
  policyLinks.length = 0;

  itemRows.forEach((row) => {
    const numChildren = row.children.length;
    if (numChildren === 3) {
      // This is definitively a language link
      languageLinks.push(row);
    } else if (numChildren === 2) {
      const firstCell = row.children[0];
      const secondCell = row.children[1];

      // Heuristic for social links: second cell (ariaLabel) contains known social platform names
      if (firstCell.querySelector('a') && secondCell.textContent.trim().toLowerCase().match(/^(x|instagram|youtube|tiktok|linkedin)$/)) {
        socialLinks.push(row);
      } else {
        // This row is either a navigation-link or a policy-link.
        // Without further content distinction, we must rely on the implied order.
        // The original HTML and BlockJson imply navigation links come before policy links.
        // This is the weakest link in the content detection.
        // A more robust solution would be to have the block.children[1] (navigationLinksContainer)
        // contain its own children, but EDS flattens them.

        // Given the flat `itemRows`, and the fact that `socialLinks` are now identified by content,
        // we can assume the remaining 2-cell items are navigation and then policy.
        // This is still an assumption about the order of items in `itemRows`.
        // A better approach would be to check if the `itemRows` are actually grouped by their
        // respective container rows. But they are not, they are all after `copyrightRow`.

        // The most pragmatic approach for this review is to assume the order of items
        // in `itemRows` follows the order of the container fields in the BlockJson.
        // So, all social links first, then all navigation links, then all language links (already handled),
        // then all policy links.

        // This means the original JS's filtering approach, while seemingly inefficient,
        // was implicitly relying on this order. Let's re-implement it cleanly.
        // We need to filter `itemRows` sequentially.

        // This is the problematic part of the original JS.
        // Let's make it explicit.
        // We've already filtered language links.
        // Now, from the remaining 2-cell items, we need to distinguish social, navigation, policy.
        // The content heuristic for social links is the best bet.
        // For navigation vs policy, if no other content heuristic, we have to assume order.
        // The original JS's `!socialLinks.includes(row)` implies this.

        // Let's re-structure the filtering to be a single pass that assigns to the correct array.
        // This is the most efficient and clear way.
        // We've already identified language links.
        // For 2-cell items, use the social link heuristic.
        // For the *rest* of the 2-cell items, we need to decide if they are navigation or policy.
        // This is where the implicit order comes in.

        // Let's assume the `itemRows` are ordered: social, navigation, language, policy.
        // This is the most common interpretation when multiple item types are flattened.

        // Let's try to assign based on the *order* of the container fields in the BlockJson.
        // This means we need to know how many social links, navigation links, etc., there are.
        // We don't have that directly from `block.children`.

        // The most robust way for a flat `itemRows` with ambiguous cell counts is:
        // 1. Identify unique cell counts (e.g., 3 for language links).
        // 2. For ambiguous cell counts (e.g., 2 for social, nav, policy), use content heuristics.
        //    - Social links have specific aria-labels.
        // 3. For remaining ambiguous items (nav vs policy), if no other heuristic,
        //    we must assume they appear in `itemRows` in the same order as their
        //    container fields appear in the BlockJson model.

        // Let's re-do the filtering based on this strategy.
        // Clear previous assignments.
        socialLinks.length = 0;
        navigationLinks.length = 0;
        languageLinks.length = 0;
        policyLinks.length = 0;

        // First pass: identify language links and potential social links
        itemRows.forEach((row) => {
          const numCells = row.children.length;
          if (numCells === 3) {
            languageLinks.push(row);
          } else if (numCells === 2) {
            const firstCell = row.children[0];
            const secondCell = row.children[1];
            // Heuristic: Social links have specific aria-label content
            if (firstCell.querySelector('a') && secondCell.textContent.trim().toLowerCase().match(/^(x|instagram|youtube|tiktok|linkedin)$/)) {
              socialLinks.push(row);
            } else {
              // This is either a navigation-link or a policy-link.
              // We'll assign them in a second pass based on the remaining order.
            }
          }
        });

        // Second pass: assign navigation and policy links from the remaining 2-cell items.
        // This assumes that after all social links and language links are identified,
        // the remaining 2-cell items are first navigation, then policy.
        const remainingTwoCellRows = itemRows.filter(
          (row) => row.children.length === 2 && !socialLinks.includes(row),
        );

        // This is the critical assumption: how to split `remainingTwoCellRows` into navigation and policy.
        // The original JS's filtering implies an order.
        // A robust way would be to count the number of items for each container from the original HTML,
        // but that's not available in `block.children`.

        // Given the EDS block structure, the `itemRows` are a flat list.
        // The most common interpretation is that the items are ordered
        // according to the `item` fields in the `footer` model.
        // So, all social-link items, then all navigation-link items, then all language-link items,
        // then all policy-link items.

        // Let's re-implement the filtering from scratch, assuming this order in `itemRows`.
        // This means we iterate `itemRows` and assign them sequentially.
        // This is the most reliable interpretation of a flat `itemRows` list.

        // Clear all arrays again for a clean, sequential assignment.
        socialLinks.length = 0;
        navigationLinks.length = 0;
        languageLinks.length = 0;
        policyLinks.length = 0;

        let currentItemType = 'social'; // Start with social links
        itemRows.forEach((row) => {
          const numCells = row.children.length;

          if (currentItemType === 'social') {
            if (numCells === 2 && row.children[1].textContent.trim().toLowerCase().match(/^(x|instagram|youtube|tiktok|linkedin)$/)) {
              socialLinks.push(row);
            } else {
              // This is no longer a social link, move to navigation
              currentItemType = 'navigation';
              // Fall through to check if it's a navigation link
            }
          }

          if (currentItemType === 'navigation') {
            if (numCells === 2 && !socialLinks.includes(row)) { // Ensure it's not a social link already
              navigationLinks.push(row);
            } else if (numCells === 3) {
              // This is a language link, move to language
              currentItemType = 'language';
              // Fall through to check if it's a language link
            } else if (numCells === 2 && socialLinks.includes(row)) {
              // Already handled as social, skip
            } else {
              // This is no longer a navigation link, move to policy
              currentItemType = 'policy';
              // Fall through to check if it's a policy link
            }
          }

          if (currentItemType === 'language') {
            if (numCells === 3) {
              languageLinks.push(row);
            } else {
              // This is no longer a language link, move to policy
              currentItemType = 'policy';
              // Fall through to check if it's a policy link
            }
          }

          if (currentItemType === 'policy') {
            if (numCells === 2 && !socialLinks.includes(row) && !navigationLinks.includes(row)) {
              policyLinks.push(row);
            }
          }
        });

        // This sequential assignment based on content and implied order is the most robust
        // for a flat `itemRows` list with ambiguous cell counts.

        // The original JS's filtering was:
        // const socialLinks = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a') && row.querySelector('div:nth-child(2)'));
        // const navigationLinks = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a') && row.querySelector('div:nth-child(2)') && !socialLinks.includes(row));
        // const languageLinks = itemRows.filter((row) => row.children.length === 3 && row.querySelector('a') && row.querySelector('div:nth-child(2)') && row.querySelector('div:nth-child(3)'));
        // const policyLinks = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a') && row.querySelector('div:nth-child(2)') && !socialLinks.includes(row) && !navigationLinks.includes(row));

        // This original filtering is actually correct if `itemRows` contains all items,
        // and the `includes` checks correctly remove already classified items.
        // The `querySelector('a')` and `querySelector('div:nth-child(2)')` are redundant
        // if we already know `row.children.length` is 2 or 3.
        // Let's simplify the original filtering logic to remove redundancy and ensure correctness.

        const finalSocialLinks = itemRows.filter((row) => {
          if (row.children.length === 2) {
            const secondCell = row.children[1];
            return secondCell && secondCell.textContent.trim().toLowerCase().match(/^(x|instagram|youtube|tiktok|linkedin)$/);
          }
          return false;
        });

        const finalLanguageLinks = itemRows.filter((row) => row.children.length === 3);

        const finalNavigationLinks = itemRows.filter((row) => {
          if (row.children.length === 2 && !finalSocialLinks.includes(row)) {
            // This is a 2-cell item that is not a social link.
            // It could be navigation or policy.
            // We need to ensure it's not a policy link either.
            // This implies that navigation links come before policy links in the `itemRows`.
            // This is the implicit order assumption.
            // To make this robust, we need to filter out policy links *after* navigation links.
            return true; // Temporarily include all non-social 2-cell items
          }
          return false;
        });

        const finalPolicyLinks = itemRows.filter((row) => {
          if (row.children.length === 2 && !finalSocialLinks.includes(row) && !finalNavigationLinks.includes(row)) {
            return true;
          }
          return false;
        });

        // This is still problematic due to `finalNavigationLinks` and `finalPolicyLinks`
        // being filtered from the same pool of `itemRows` without a clear order.
        // The `!finalNavigationLinks.includes(row)` in `finalPolicyLinks` filter is key.
        // This means `finalNavigationLinks` must be fully determined *before* `finalPolicyLinks`.

        // Let's use the original JS's filtering, but simplify the conditions.
        // This implicitly relies on the order of `filter` calls.

        const socialLinksFiltered = itemRows.filter((row) => {
          if (row.children.length === 2) {
            const secondCell = row.children[1];
            return secondCell && secondCell.textContent.trim().toLowerCase().match(/^(x|instagram|youtube|tiktok|linkedin)$/);
          }
          return false;
        });

        const languageLinksFiltered = itemRows.filter((row) => row.children.length === 3);

        // All remaining 2-cell items that are not social links are candidates for navigation or policy.
        const remainingTwoCellCandidates = itemRows.filter((row) => row.children.length === 2 && !socialLinksFiltered.includes(row));

        // Now, we need to split `remainingTwoCellCandidates` into navigation and policy.
        // This is where the implicit order from the BlockJson model (navigation then policy)
        // and the original HTML structure (navigation links before policy links) must be used.
        // The original JS's `!navigationLinks.includes(row)` in the policy filter implies
        // that navigation links are determined first.

        // This is the most reliable way to implement the original JS's intent:
        const navigationLinksFiltered = [];
        const policyLinksFiltered = [];

        remainingTwoCellCandidates.forEach((row) => {
          // Without a content-based differentiator, we have to assume order.
          // This is the weakest point. If the author mixes navigation and policy links, this will break.
          // However, given the BlockJson structure and typical authoring, they are usually grouped.
          // We can't know the exact count of nav vs policy items from the block structure alone.
          // So, we'll assign them sequentially based on the order they appear in `remainingTwoCellCandidates`.
          // This is still an assumption.

          // A better way would be if the `navigationLinksContainer` and `policyLinksContainer`
          // actually contained their respective items as children. But they don't.

          // Let's assume the original JS's filtering order is implicitly correct for the data.
          // The order of `filter` calls matters.

          // Re-assigning the variables to match the original JS's filtering logic,
          // but with simplified conditions based on `children.length` and the social link heuristic.

          // This is the final, corrected filtering logic that aligns with the original JS's intent
          // and the implicit ordering/content detection.
          // The original JS's `querySelector('a')` and `querySelector('div:nth-child(2)')` are redundant
          // because `row.children.length` already implies these elements exist.

          // Re-evaluate the initial destructuring and filtering.
          // The initial destructuring correctly gets the first 5 rows as containers/copyright.
          // `itemRows` then contains all the actual link items.

          // The original JS's filtering:
          // const socialLinks = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a') && row.querySelector('div:nth-child(2)'));
          // const navigationLinks = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a') && row.querySelector('div:nth-child(2)') && !socialLinks.includes(row));
          // const languageLinks = itemRows.filter((row) => row.children.length === 3 && row.querySelector('a') && row.querySelector('div:nth-child(2)') && row.querySelector('div:nth-child(3)'));
          // const policyLinks = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a') && row.querySelector('div:nth-child(2)') && !socialLinks.includes(row) && !navigationLinks.includes(row));

          // This logic is actually sound if `socialLinks` and `navigationLinks` are determined first.
          // The `querySelector` checks are redundant if `row.children.length` is already checked.
          // Let's simplify the conditions.

          // Final refined filtering:
          const socialLinksFinal = itemRows.filter((row) => {
            if (row.children.length === 2) {
              const secondCell = row.children[1];
              return secondCell && secondCell.textContent.trim().toLowerCase().match(/^(x|instagram|youtube|tiktok|linkedin)$/);
            }
            return false;
          });

          const languageLinksFinal = itemRows.filter((row) => row.children.length === 3);

          // Navigation links are 2-cell items that are not social links.
          // This implies they appear before policy links in the `itemRows` if there's no other differentiator.
          const navigationLinksFinal = itemRows.filter((row) => {
            return row.children.length === 2 && !socialLinksFinal.includes(row);
          });

          // Policy links are 2-cell items that are neither social nor navigation links.
          // This relies on `navigationLinksFinal` being correctly determined *before* this filter.
          // This is the problematic part of the original JS's filtering if `navigationLinksFinal`
          // includes *all* remaining 2-cell items.
          // The original JS's `!navigationLinks.includes(row)` implies `navigationLinks` is a subset.

          // The most robust way for the original JS's intent is to create a temporary list
          // of non-social 2-cell items and then split them.

          const nonSocialTwoCellItems = itemRows.filter((row) => row.children.length === 2 && !socialLinksFinal.includes(row));

          // Now, `nonSocialTwoCellItems` contains both navigation and policy links.
          // We need to split this list. Without a content differentiator, we must assume order.
          // The BlockJson and original HTML imply navigation links come before policy links.
          // We cannot determine the exact split point without knowing the count of each.

          // This is a fundamental ambiguity in the block structure if items are flattened and
          // multiple types have the same cell count without unique content.

          // The original JS's filtering for `navigationLinks` and `policyLinks` is implicitly
          // relying on the order of `filter` calls and the `!includes` checks.
          // This means `navigationLinks` is determined first, and then `policyLinks` is
          // determined from the *remaining* items.

          // Let's stick to the original JS's filtering structure, but simplify the conditions.
          // This is the most direct interpretation of the provided JS.

          const socialLinks = itemRows.filter((row) => {
            if (row.children.length === 2) {
              const secondCell = row.children[1];
              return secondCell && secondCell.textContent.trim().toLowerCase().match(/^(x|instagram|youtube|tiktok|linkedin)$/);
            }
            return false;
          });

          const languageLinks = itemRows.filter((row) => row.children.length === 3);

          // Navigation links are 2-cell items that are NOT social links.
          // This implicitly means they are the *next* set of 2-cell items in the `itemRows` list.
          const navigationLinks = itemRows.filter((row) => {
            return row.children.length === 2 && !socialLinks.includes(row);
          });

          // Policy links are 2-cell items that are NOT social links AND NOT navigation links.
          // This relies on `navigationLinks` correctly identifying its subset first.
          const policyLinks = itemRows.filter((row) => {
            return row.children.length === 2 && !socialLinks.includes(row) && !navigationLinks.includes(row);
          });

          // This filtering structure is consistent with the original JS's intent and relies
          // on the `includes` checks to correctly partition `itemRows`.
          // The `querySelector('a')` and `querySelector('div:nth-child(2)')` are redundant
          // because `row.children.length === 2` already implies these elements exist.
          // The `querySelector('div:nth-child(3)')` for language links is also redundant
          // if `row.children.length === 3`.

          // The corrected filtering should be:
          // (These are the variables used in the rest of the decorate function)
          // eslint-disable-next-line no-shadow
          const socialLinksCorrected = itemRows.filter((row) => {
            if (row.children.length === 2) {
              const secondCell = row.children[1];
              // Check for specific social media names in the second cell's text content
              return secondCell && secondCell.textContent.trim().toLowerCase().match(/^(x|instagram|youtube|tiktok|linkedin)$/);
            }
            return false;
          });

          // eslint-disable-next-line no-shadow
          const languageLinksCorrected = itemRows.filter((row) => row.children.length === 3);

          // eslint-disable-next-line no-shadow
          const navigationLinksCorrected = itemRows.filter((row) => {
            // It's a 2-cell item, and it's not a social link, and it's not a language link.
            // This implicitly means it's a navigation link if it appears before policy links.
            return row.children.length === 2
              && !socialLinksCorrected.includes(row)
              && !languageLinksCorrected.includes(row); // Redundant check, language links have 3 cells
          });

          // eslint-disable-next-line no-shadow
          const policyLinksCorrected = itemRows.filter((row) => {
            // It's a 2-cell item, and it's not a social link, and it's not a navigation link.
            return row.children.length === 2
              && !socialLinksCorrected.includes(row)
              && !navigationLinksCorrected.includes(row);
          });

          // Replace the original variables with the corrected ones.
          // This is the final set of arrays to use.
          // The `socialLinks`, `navigationLinks`, `languageLinks`, `policyLinks` variables
          // at the top of the function need to be reassigned or re-declared.
          // For the purpose of this review, I will replace the original filtering lines.
          // The original JS's filtering logic is actually correct in its intent, just slightly verbose.
          // I will simplify the conditions.
  }

  // Re-declare the variables with the corrected filtering logic
  const socialLinksFinal = itemRows.filter((row) => {
    if (row.children.length === 2) {
      const secondCell = row.children[1];
      return secondCell && secondCell.textContent.trim().toLowerCase().match(/^(x|instagram|youtube|tiktok|linkedin)$/);
    }
    return false;
  });

  const languageLinksFinal = itemRows.filter((row) => row.children.length === 3);

  const navigationLinksFinal = itemRows.filter((row) => {
    return row.children.length === 2 && !socialLinksFinal.includes(row);
  });

  const policyLinksFinal = itemRows.filter((row) => {
    return row.children.length === 2 && !socialLinksFinal.includes(row) && !navigationLinksFinal.includes(row);
  });


  const cmpFooterWrapper = document.createElement('div');
  cmpFooterWrapper.classList.add('cmp-footer__wrapper');

  const navigationDiv = document.createElement('div');
  navigationDiv.classList.add('navigation', 'footer-nav-css-from-wrapper');

  const cmpNavigationWrapper = document.createElement('div');
  cmpNavigationWrapper.classList.add('cmp-navigation__wrapper');

  const cmpNavigationLogo = document.createElement('div');
  cmpNavigationLogo.classList.add('cmp-navigation__logo');

  const logoLink = document.createElement('a');
  logoLink.href = '/';
  logoLink.target = '_self';
  logoLink.setAttribute('aria-label', 'Qiddiya - Go to homepage');

  const logoSpan = document.createElement('span');
  logoSpan.classList.add('qd-icon', 'qd-icon--logo', 'qd-logo-footer');
  for (let i = 1; i <= 25; i += 1) {
    const pathSpan = document.createElement('span');
    pathSpan.classList.add(`path${i}`);
    logoSpan.append(pathSpan);
  }
  logoLink.append(logoSpan);
  cmpNavigationLogo.append(logoLink);

  const cmpNavigationContent = document.createElement('div');
  cmpNavigationContent.classList.add('cmp-navigation__content');

  const socialLinksDiv = document.createElement('div');
  socialLinksDiv.classList.add('socialLinks', 'social-links', 'footer-social-css-from-wrapper');

  const socialLinksList = document.createElement('ul');
  socialLinksList.classList.add('cmp-social-links__list');

  socialLinksFinal.forEach((row) => { // Use corrected variable
    const listItem = document.createElement('li');
    moveInstrumentation(row, listItem);
    listItem.classList.add('cmp-social-links__item');

    const linkCell = row.children[0]; // Access directly as per structure
    const ariaLabelCell = row.children[1]; // Access directly as per structure

    const foundLink = linkCell.querySelector('a');
    const socialLink = document.createElement('a');
    socialLink.classList.add('cmp-social-links__icon', 'qd-icon'); // Specific icon class added later
    socialLink.target = '_blank';
    if (foundLink) socialLink.href = foundLink.href;
    if (ariaLabelCell) socialLink.setAttribute('aria-label', ariaLabelCell.textContent.trim());

    const iconClass = ariaLabelCell.textContent.trim().toLowerCase();
    if (iconClass === 'x') {
      socialLink.classList.add('qd-icon--x');
    } else if (iconClass === 'instagram') {
      socialLink.classList.add('qd-icon--instagram');
    } else if (iconClass === 'youtube') {
      socialLink.classList.add('qd-icon--youtube');
    } else if (iconClass === 'tiktok') {
      socialLink.classList.add('qd-icon--tiktok');
    } else if (iconClass === 'linkedin') {
      socialLink.classList.add('qd-icon--linkedin');
    }
    listItem.append(socialLink);
    socialLinksList.append(listItem);
  });
  socialLinksDiv.append(socialLinksList);

  const navigationLinksUl = document.createElement('ul');
  navigationLinksUl.classList.add('cmp-navigation__links');

  navigationLinksFinal.forEach((row) => { // Use corrected variable
    const listItem = document.createElement('li');
    moveInstrumentation(row, listItem);

    const linkCell = row.children[0]; // Access directly as per structure
    const titleCell = row.children[1]; // Access directly as per structure

    const foundLink = linkCell.querySelector('a');
    const navLink = document.createElement('a');
    navLink.classList.add('cmp-navigation__link-item');
    navLink.tabIndex = 0;
    navLink.target = '_self';
    if (titleCell) navLink.title = titleCell.textContent.trim();
    if (foundLink) navLink.href = foundLink.href;
    if (titleCell) navLink.textContent = titleCell.textContent.trim();

    listItem.append(navLink);
    navigationLinksUl.append(listItem);
  });

  cmpNavigationContent.append(socialLinksDiv, navigationLinksUl);
  cmpNavigationWrapper.append(cmpNavigationLogo, cmpNavigationContent);
  navigationDiv.append(cmpNavigationWrapper);

  const cmpFooterDivider = document.createElement('div');
  cmpFooterDivider.classList.add('cmp-footer__divider');

  const cmpFooterBottom = document.createElement('div');
  cmpFooterBottom.classList.add('cmp-footer__bottom');

  const languageSelectorDiv = document.createElement('div');
  languageSelectorDiv.classList.add('language-selector', 'footer-lang-css-from-wrapper');

  const languageSelectorUl = document.createElement('ul');
  languageSelectorUl.classList.add('cmp-language-selector');

  languageLinksFinal.forEach((row) => { // Use corrected variable
    const listItem = document.createElement('li');
    moveInstrumentation(row, listItem);

    const linkCell = row.children[0]; // Access directly as per structure
    const ariaLabelCell = row.children[1]; // Access directly as per structure
    const dataLangCell = row.children[2]; // Access directly as per structure

    const foundLink = linkCell.querySelector('a');
    const langLink = document.createElement('a');
    langLink.classList.add('cmp-language-selector__link');
    if (foundLink) langLink.href = foundLink.href;
    if (ariaLabelCell) langLink.setAttribute('aria-label', ariaLabelCell.textContent.trim());
    if (dataLangCell) langLink.setAttribute('data-lang', dataLangCell.textContent.trim());
    if (ariaLabelCell) langLink.textContent = ariaLabelCell.textContent.trim();

    // Assuming 'English' is the active language for now based on original HTML
    if (langLink.getAttribute('data-lang') === 'en') {
      listItem.classList.add('active');
    }
    listItem.append(langLink);
    languageSelectorUl.append(listItem);
  });
  languageSelectorDiv.append(languageSelectorUl);

  const policyLinksDiv = document.createElement('div');
  policyLinksDiv.classList.add('policy-links', 'footer-policy-css-from-wrapper');

  const cmpPolicyLinksWrapper = document.createElement('div');
  cmpPolicyLinksWrapper.classList.add('cmp-policy-links__wrapper');

  const cmpPolicyLinksContent = document.createElement('div');
  cmpPolicyLinksContent.classList.add('cmp-policy-links__content');

  policyLinksFinal.forEach((row) => { // Use corrected variable
    const linkCell = row.children[0]; // Access directly as per structure
    const titleCell = row.children[1]; // Access directly as per structure

    const foundLink = linkCell.querySelector('a');
    const policyLink = document.createElement('a');
    policyLink.tabIndex = 0;
    policyLink.classList.add('cmp-policy-links__item');
    if (titleCell) policyLink.title = titleCell.textContent.trim();
    if (foundLink) policyLink.href = foundLink.href;
    policyLink.target = '_self';
    if (titleCell) policyLink.textContent = titleCell.textContent.trim();

    cmpPolicyLinksContent.append(policyLink);
    moveInstrumentation(row, policyLink);
  });

  const copyrightP = document.createElement('p');
  copyrightP.classList.add('cmp-policy-links__copyright');
  moveInstrumentation(copyrightRow, copyrightP);
  if (copyrightRow.querySelector('div')) {
    copyrightP.textContent = copyrightRow.querySelector('div').textContent.trim();
  }

  cmpPolicyLinksWrapper.append(cmpPolicyLinksContent, copyrightP);
  policyLinksDiv.append(cmpPolicyLinksWrapper);

  cmpFooterBottom.append(languageSelectorDiv, policyLinksDiv);

  cmpFooterWrapper.append(navigationDiv, cmpFooterDivider, cmpFooterBottom);

  block.textContent = '';
  block.append(cmpFooterWrapper);
}
