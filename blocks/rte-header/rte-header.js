export default async function decorate(block) {
  const children = block.querySelectorAll(':scope > div');
  
  if (children.length < 4) return;

  // Extract data from the block structure
  const labelDiv = children[0];
  const iconDiv = children[1];
  const linkDiv = children[2];
  const textDiv = children[3];

  // Clear the block
  block.textContent = '';

  // Create header navigation structure
  const headerNav = document.createElement('nav');
  headerNav.className = 'rte-header';

  // Create top bar with logo and branding
  const topBar = document.createElement('div');
  topBar.className = 'rte-header-topbar';

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

  topBar.appendChild(labelContainer);

  // Parse and create navigation from the richtext content
  const navItems = [];
  if (textDiv) {
    const ul = textDiv.querySelector('ul');
    if (ul) {
      const listItems = ul.querySelectorAll(':scope > li');
      listItems.forEach((li) => {
        const text = li.querySelector('a')?.href ? 
          li.querySelector('a').textContent : 
          li.childNodes[0].textContent.trim();
        
        const subUl = li.querySelector(':scope > ul');
        const children = subUl ? subUl.querySelectorAll(':scope > li') : [];
        
        navItems.push({
          text: text,
          children: Array.from(children).map(child => {
            const childText = child.childNodes[0].textContent.trim();
            const grandchildUl = child.querySelector(':scope > ul');
            const grandchildren = grandchildUl ? grandchildUl.querySelectorAll(':scope > li') : [];
            
            return {
              text: childText,
              children: Array.from(grandchildren).map(gc => ({
                text: gc.textContent.trim()
              }))
            };
          })
        });
      });
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
      // Toggle active state if needed
    });
    
    li.appendChild(link);

    // Create dropdown if children exist
    if (item.children.length > 0) {
      const dropdown = document.createElement('div');
      dropdown.className = 'rte-header-dropdown';

      item.children.forEach((child) => {
        const col = document.createElement('div');
        col.className = 'rte-header-dropdown-col';

        const title = document.createElement('strong');
        title.textContent = child.text;
        col.appendChild(title);

        if (child.children.length > 0) {
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

  topBar.appendChild(nav);
  headerNav.appendChild(topBar);
  block.appendChild(headerNav);

  // Hide the link element if needed
  const linkElement = blockDiv => {
    const link = blockDiv.querySelector('.rte-header-link');
    if (link) link.style.display = 'none';
  };
  linkElement(block);
}