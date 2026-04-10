export default async function decorate(block) {
  const children = block.querySelectorAll(':scope > div');
  
  if (children.length < 4) return;

  // Extract data from the block structure
  const labelDiv = children[0];
  const iconDiv = children[1];
  const linkDiv = children[2];
  const textDiv = children[3];

  // Function to parse nested list structure
  function parseNestedList(element) {
    const items = [];
    const listItems = element.querySelectorAll(':scope > li');
    
    listItems.forEach((li) => {
      // Get the text of the first node (the main item text)
      let itemText = '';
      for (let node of li.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          itemText = node.textContent.trim();
          if (itemText) break;
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'UL') {
          itemText = node.textContent.trim();
          if (itemText) break;
        }
      }

      const subUl = li.querySelector(':scope > ul');
      const subItems = subUl ? parseNestedList(subUl) : [];
      
      items.push({
        text: itemText,
        children: subItems
      });
    });
    
    return items;
  }

  // Clear the block
  block.innerHTML = '';

  // Create header wrapper
  const headerWrapper = document.createElement('div');
  headerWrapper.style.display = 'flex';
  headerWrapper.style.alignItems = 'center';
  headerWrapper.style.padding = '20px 40px';
  headerWrapper.style.gap = '40px';

  // Add label with logo
  const labelContainer = document.createElement('div');
  labelContainer.className = 'rte-header-label';
  
  // Add icon if exists
  if (iconDiv) {
    const icon = iconDiv.querySelector('picture, img');
    if (icon) {
      labelContainer.appendChild(icon.cloneNode(true));
    }
  }

  // Add label text
  const labelText = labelDiv.textContent.trim();
  if (labelText) {
    const label = document.createElement('span');
    label.textContent = labelText;
    labelContainer.appendChild(label);
  }

  headerWrapper.appendChild(labelContainer);

  // Parse navigation items from the nested list structure
  let navItems = [];
  if (textDiv) {
    const ul = textDiv.querySelector('ul');
    if (ul) {
      navItems = parseNestedList(ul);
    }
  }

  // Create navigation list
  const nav = document.createElement('ul');
  nav.className = 'rte-header-nav';

  navItems.forEach((item) => {
    const li = document.createElement('li');
    
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = item.text;
    link.addEventListener('click', (e) => {
      e.preventDefault();
    });
    
    li.appendChild(link);

    // Create dropdown if children exist
    if (item.children && item.children.length > 0) {
      const dropdown = document.createElement('div');
      dropdown.className = 'rte-header-dropdown';

      item.children.forEach((child) => {
        const col = document.createElement('div');
        col.className = 'rte-header-dropdown-col';

        // Add category title
        const title = document.createElement('strong');
        title.textContent = child.text;
        col.appendChild(title);

        // Add sub-items if they exist
        if (child.children && child.children.length > 0) {
          const subList = document.createElement('ul');
          child.children.forEach((grandchild) => {
            const subLi = document.createElement('li');
            subLi.textContent = grandchild.text;
            subList.appendChild(subLi);
          });
          col.appendChild(subList);
        }

        dropdown.appendChild(col);
      });

      li.appendChild(dropdown);
    }

    nav.appendChild(li);
  });

  headerWrapper.appendChild(nav);
  block.appendChild(headerWrapper);
}