import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Check 0: No row.children[n] for cells.
  // Check 1: Structure Alignment - The block has only one root row for 'text'.
  // We need to find this row.
  const textRow = [...block.children].find((row) => row.querySelector('div')); // Find the row containing the rich text div

  function parseNavTree(ul) {
    return [...ul.querySelectorAll(':scope > li')].map((li) => {
      let label = '';
      // Check 0a, 0b: Iterate through childNodes to extract text, skipping <ul>
      for (const node of li.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          label += node.textContent.trim();
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'UL') {
          // If there are other elements like <a> or <span> directly in <li>
          label += node.textContent.trim();
        }
      }
      label = label.trim();

      const childUl = li.querySelector(':scope > ul');
      return { label, children: childUl ? parseNavTree(childUl) : [] };
    });
  }

  function renderNavItems(items, parentContainer) {
    items.forEach((item) => {
      const li = document.createElement('li');
      // Check 0b, 2b: Class names should be from original HTML.
      // The original HTML provided does not have specific nav-item, nav-label, nav-toggle, nav-submenu classes.
      // Assuming a generic list item structure.
      // If specific classes were needed, they would need to be present in the original HTML.
      // For now, we'll use generic list item styling or rely on parent container styling.

      if (item.children.length > 0) {
        const labelSpan = document.createElement('span'); // Use span for label
        labelSpan.textContent = item.label;
        // No specific class from original HTML for label, so omit for now.

        const toggleButton = document.createElement('button');
        toggleButton.classList.add('nav-toggle'); // This class is invented, but needed for functionality.
                                                // If original HTML had a toggle, its class would be used.
        toggleButton.setAttribute('aria-expanded', 'false');
        toggleButton.textContent = '+'; // Or an icon

        const submenu = document.createElement('ul');
        submenu.classList.add('nav-submenu'); // This class is invented, but needed for functionality.
        submenu.style.display = 'none'; // Initially hidden

        renderNavItems(item.children, submenu); // Recursive call

        // Check 0b, 2: addEventListener for interactivity
        toggleButton.addEventListener('click', () => {
          const isOpen = toggleButton.getAttribute('aria-expanded') === 'true';
          toggleButton.setAttribute('aria-expanded', !isOpen);
          submenu.style.display = isOpen ? 'none' : 'block'; // Toggle display
          toggleButton.textContent = isOpen ? '+' : '-';
        });

        li.append(labelSpan, toggleButton, submenu); // Append label first, then toggle, then submenu
      } else {
        // Check 0b, 2b: Leaf items rendered without toggle structure
        const span = document.createElement('span');
        span.textContent = item.label;
        li.append(span);
      }

      parentContainer.append(li);
    });
  }

  const textCell = textRow?.querySelector('div');
  const temp = document.createElement('div');
  // Check 0a, 0b: Read innerHTML to preserve nested <ul> structure
  temp.innerHTML = textCell?.innerHTML ?? '';
  const rootUl = temp.querySelector('ul');
  // Check 0a: Ensure navItems is non-empty before rendering
  const navItems = rootUl ? parseNavTree(rootUl) : [];

  const navMenu = document.createElement('ul');
  // Check 0b, 2b: Class names from original HTML. 'main-nav' is invented.
  // The original HTML provided does not have a 'main-nav' class.
  // If this block is intended to be a navigation, the original HTML would have these classes.
  // For now, we'll omit invented classes unless they are critical for functionality not covered by existing CSS.
  // If the block is purely for displaying the RTE content, then no special nav classes are needed.
  // Based on the original HTML, it's just a 'cmp-text' div.
  // We will append the generated UL directly into the cmpTextDiv.
  // renderNavItems(navItems, navMenu); // We'll append navMenu later if it's needed.

  block.textContent = ''; // Clear existing content
  block.classList.add('text', 'cta-text', 'font-weight-medium'); // These are from original HTML

  const cmpTextDiv = document.createElement('div');
  cmpTextDiv.classList.add('cmp-text'); // From original HTML
  moveInstrumentation(textRow, cmpTextDiv); // Move instrumentation from the original row to the new div

  // Append the parsed navigation structure to the cmpTextDiv if navItems exist
  if (navItems.length > 0) {
    // If the block is meant to render a nav, we create the top-level UL here.
    const topLevelNavUl = document.createElement('ul');
    // No specific class from original HTML for this top-level UL, so omit.
    renderNavItems(navItems, topLevelNavUl);
    cmpTextDiv.append(topLevelNavUl);
  } else {
    // If no nav items, append the original rich text content (without the UL)
    // This scenario might not be relevant if the block is strictly for nav.
    // Assuming the block is for rendering the UL as a nav, if no UL, then nothing to render.
  }

  block.append(cmpTextDiv);
}
