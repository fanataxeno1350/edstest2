import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nestedUl = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Ensure anchor exists or create a span for text content
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

    // Apply classes from ORIGINAL HTML to <a>, <ul>, <li> elements
    if (anchor) {
      anchor.classList.add('alProducts'); // Example class from ORIGINAL HTML
    }
    li.classList.add('subMenuItem'); // Example class from ORIGINAL HTML

    if (nestedUl) {
      // Move instrumentation from the original <ul> to the new <ul>
      moveInstrumentation(nestedUl, nestedUl);

      nestedUl.remove(); // Remove original nested UL to re-wrap
      const subWrap = document.createElement('div');
      subWrap.classList.add('deepSideMenu'); // Use original HTML class: deepSideMenu
      subWrap.append(nestedUl);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // Use original HTML class
          subWrap.classList.toggle('active'); // Use original HTML class
        });
      }
      // Recursively transform nested lists
      transformNestedLists(nestedUl);
    }
  });

  // Handle submenu-category and submenu-product within the hierarchy-tree
  // These are expected to be nested within the <ul> structure from the richtext.
  // The original HTML shows a specific structure for these:
  // <li class="subMenuItem active"><a href="..." class="alProducts">Category Label</a>
  //   <ul class="deepSideMenu">
  //     <li class="btnBox"><div class="titleSubMenu">Category Label</div><a href="..." class="viewMoreBtn">View More</a></li>
  //     <li><ul class="deepSideMenuItem">
  //       <li><a href="..."><div class="imageContainer"><img ...></div><span class="modalName">Product Name</span></a></li>
  //     </ul></li>
  //   </ul>
  // </li>

  rootUl.querySelectorAll('li').forEach((li) => {
    // Check if this li represents a submenu-category or submenu-product based on its content
    // This part assumes the richtext already contains the structure for these,
    // and we just need to apply classes and event listeners.
    const anchor = li.querySelector('a');
    const imageContainer = li.querySelector('.imageContainer'); // From ORIGINAL HTML for submenu-product

    if (anchor && !imageContainer) { // Likely a submenu-category or simple link
      anchor.classList.add('alProducts'); // From ORIGINAL HTML
    }
    if (imageContainer) { // Likely a submenu-product
      const modalNameSpan = li.querySelector('.modalName'); // From ORIGINAL HTML
      if (!modalNameSpan) {
        const span = document.createElement('span');
        span.classList.add('modalName');
        span.textContent = anchor?.textContent.trim() || '';
        anchor?.textContent = '';
        anchor?.appendChild(span);
      }
    }

    // Apply classes to nested elements as per ORIGINAL HTML
    li.querySelectorAll('ul.deepSideMenu').forEach(ul => ul.classList.add('deepSideMenu'));
    li.querySelectorAll('li.btnBox').forEach(liBtn => liBtn.classList.add('btnBox'));
    li.querySelectorAll('div.titleSubMenu').forEach(div => div.classList.add('titleSubMenu'));
    li.querySelectorAll('a.viewMoreBtn').forEach(a => a.classList.add('viewMoreBtn'));
    li.querySelectorAll('ul.deepSideMenuItem').forEach(ul => ul.classList.add('deepSideMenuItem'));
    li.querySelectorAll('div.imageContainer').forEach(div => div.classList.add('imageContainer'));
    li.querySelectorAll('span.modalName').forEach(span => span.classList.add('modalName'));
  });
}

export default function decorate(block) {
  const [logoRow, logoLinkRow, ...itemRows] = [...block.children];

  const header = document.createElement('header');
  const container = document.createElement('div');
  container.classList.add('container');
  const nav = document.createElement('div');
  nav.classList.add('nav');
  const navBar = document.createElement('div');
  navBar.classList.add('navBar');

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  const originalLogoLink = logoLinkRow.querySelector('a');
  if (originalLogoLink) {
    logoLink.href = originalLogoLink.href;
  }
  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '169' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  moveInstrumentation(logoRow, logoLink);
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);
  navBar.append(logoDiv);

  // Navigation Menu
  const navigation = document.createElement('nav');
  const navList = document.createElement('ul');
  navList.classList.add('navList');

  itemRows.forEach((row) => {
    const cells = [...row.children];
    // Detect item type by cell count and content
    if (cells.length === 3) {
      // navigation-item: label, link, hierarchy-tree
      const [labelCell, linkCell, hierarchyCell] = cells;
      const li = document.createElement('li');
      li.classList.add('navBarItem'); // From ORIGINAL HTML

      const foundLink = linkCell?.querySelector('a');
      let rootEl;
      if (foundLink) {
        rootEl = document.createElement('a');
        rootEl.href = foundLink.href;
      } else {
        rootEl = document.createElement('span');
      }
      rootEl.textContent = labelCell?.textContent.trim() || '';
      moveInstrumentation(row, rootEl);
      li.appendChild(rootEl);

      const hierarchyRootHtml = hierarchyCell?.innerHTML;
      if (hierarchyRootHtml) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyRootHtml;
        const hierarchyRootUl = tempDiv.querySelector('ul');

        if (hierarchyRootUl) {
          moveInstrumentation(hierarchyCell, hierarchyRootUl); // Move instrumentation from original cell to the new UL

          const submenu = document.createElement('div');
          submenu.classList.add('submenu'); // From ORIGINAL HTML
          const submenuContainer = document.createElement('div');
          submenuContainer.classList.add('container'); // From ORIGINAL HTML
          const newUl = document.createElement('ul');
          newUl.classList.add('newUl'); // From ORIGINAL HTML

          // Move all children from hierarchyRootUl to newUl
          while (hierarchyRootUl.firstChild) {
            newUl.appendChild(hierarchyRootUl.firstChild);
          }
          transformNestedLists(newUl); // Transform the nested lists within the newUl

          submenuContainer.appendChild(newUl);
          submenu.appendChild(submenuContainer);
          li.appendChild(submenu);

          rootEl.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            li.classList.toggle('active'); // From ORIGINAL HTML
            submenu.classList.toggle('active'); // From ORIGINAL HTML
          });
        }
      }
      navList.appendChild(li);
    } else if (cells.length === 4) {
      // submenu-category: label, link, active, products (container)
      // These are expected to be nested within the 'hierarchy-tree' of a 'navigation-item'.
      // If they appear as top-level itemRows, it indicates a structural mismatch.
      // For now, we'll log a warning and skip, assuming they are handled by transformNestedLists.
      console.warn('Top-level submenu-category detected. Expected to be nested within hierarchy-tree.');
    } else if (cells.length === 3 && cells[0].querySelector('picture')) {
      // submenu-product: image, label, link
      // These are expected to be nested within the 'hierarchy-tree' of a 'navigation-item'.
      // For now, we'll log a warning and skip, assuming they are handled by transformNestedLists.
      console.warn('Top-level submenu-product detected. Expected to be nested within hierarchy-tree.');
    }
  });

  navigation.append(navList);
  navBar.append(navigation);

  // Right Top (Search Bar)
  const rightTop = document.createElement('div');
  rightTop.classList.add('rightTop'); // From ORIGINAL HTML
  const searchBar = document.createElement('div');
  searchBar.classList.add('searchBar'); // From ORIGINAL HTML
  const searchIcon = document.createElement('img');
  searchIcon.classList.add('searchIcon'); // From ORIGINAL HTML
  searchIcon.alt = 'search-icon.svg';
  searchIcon.height = '20';
  searchIcon.width = '20';
  searchIcon.src = '/content/dam/aemigrate/uploaded-folder/image/1776316534548.svg+xml'; // From original HTML
  searchBar.append(searchIcon);
  rightTop.append(searchBar);
  navBar.append(rightTop);

  container.append(nav);
  container.append(navBar);
  header.append(container);

  block.textContent = ''; // Clear original block content
  block.append(header);

  // Optimize images within the header
  header.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
