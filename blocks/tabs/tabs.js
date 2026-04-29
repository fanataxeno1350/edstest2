import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const allRows = [...block.children];
  const tabPanelsData = [];
  const productCardsData = [];

  // Separate tab panels from product cards based on cell count
  allRows.forEach((row) => {
    if (row.children.length === 5) { // Tab Panel has 5 cells
      tabPanelsData.push(row);
    } else if (row.children.length === 3) { // Product Card has 3 cells
      productCardsData.push(row);
    }
  });

  block.innerHTML = ''; // Clear the block content

  const cmpTabs = document.createElement('div');
  cmpTabs.classList.add('cmp-tabs');
  cmpTabs.setAttribute('data-placeholder-text', 'false');

  const tabList = document.createElement('ol');
  tabList.classList.add('cmp-tabs__tablist');
  tabList.setAttribute('role', 'tablist');
  tabList.setAttribute('aria-multiselectable', 'false');

  const tabPanelsContainer = document.createElement('div');
  tabPanelsContainer.classList.add('panelcontainer'); // Add panelcontainer class to the wrapper

  tabPanelsData.forEach((tabPanelRow, index) => {
    const [titleCell, cardsCell, descriptionCell, exploreAllLinkCell, exploreAllLabelCell] = [...tabPanelRow.children];

    // Tab button
    const tabButton = document.createElement('li');
    tabButton.classList.add('cmp-tabs__tab');
    tabButton.setAttribute('role', 'tab');
    tabButton.setAttribute('tabindex', '-1');
    tabButton.setAttribute('data-cmp-hook-tabs', 'tab');
    tabButton.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, tabButton);

    // Tab panel content
    const tabContentPanel = document.createElement('div');
    tabContentPanel.classList.add('cmp-tabs__tabpanel');
    tabContentPanel.setAttribute('role', 'tabpanel');
    tabContentPanel.setAttribute('tabindex', '0');
    tabContentPanel.setAttribute('data-cmp-hook-tabs', 'tabpanel');
    tabContentPanel.setAttribute('aria-hidden', 'true');
    moveInstrumentation(tabPanelRow, tabContentPanel);

    const cardsWrapper = document.createElement('div');
    cardsWrapper.classList.add('cards');

    const cmpCardImageHover = document.createElement('div');
    cmpCardImageHover.classList.add('cmp-card--image-hover', 'cmp-card--default');
    cmpCardImageHover.setAttribute('data-component', 'cards');

    const cmpCardContainer = document.createElement('div');
    cmpCardContainer.classList.add('cmp-card__container');

    // Filter product cards relevant to the current tab panel
    // The cardsCell content is the raw JCR path, which is used to filter the product cards.
    // This assumes that the product cards are directly associated with the tab panel
    // based on the content of the cardsCell.
    // In a real scenario, this might involve more complex logic or a data attribute.
    // For this review, we'll assume cardsCell.textContent is a unique identifier for the cards.
    const relevantProductCards = productCardsData.filter((cardRow) => {
      // This is a placeholder for actual filtering logic.
      // In a real scenario, cardsCell.textContent would likely contain a reference
      // to the specific set of product cards for this tab.
      // For now, we'll just add all product cards to each tab as the model implies
      // 'cards' is a container field, meaning the product-card rows are siblings
      // to the tab-panel rows, not children.
      // The original JS also added all product cards to each tab.
      // To correctly implement the 'cards' container field, the product cards
      // should be nested under the tab-panel in the HTML, or there should be
      // a mechanism to link them. Since they are siblings, we'll keep the
      // original behavior of adding all product cards to each tab for now,
      // as the model implies a container but the HTML structure does not reflect it.
      // A more robust solution would require a change in the block structure or model.
      return true; // For now, add all product cards to each tab as per original JS behavior
    });

    // Add product cards to the current tab panel
    relevantProductCards.forEach((cardRow) => {
      const [imageDefaultCell, imageHoverCell, linkCell] = [...cardRow.children];

      const link = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.target = '_self'; // Assuming target self from original HTML
      }
      moveInstrumentation(linkCell, link);

      const cmpCardContent = document.createElement('div');
      cmpCardContent.classList.add('cmp-card__content');
      cmpCardContent.setAttribute('tabindex', '0');

      // Default Image
      const defaultPicture = imageDefaultCell.querySelector('picture');
      if (defaultPicture) {
        const img = defaultPicture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          optimizedPic.querySelector('img').classList.add('cmp-image__image', 'cmp-image__default');
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          cmpCardContent.appendChild(optimizedPic);
        }
      }

      // Hover Image
      const hoverPicture = imageHoverCell.querySelector('picture');
      if (hoverPicture) {
        const img = hoverPicture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          optimizedPic.querySelector('img').classList.add('cmp-image__image', 'cmp-image__hover');
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          cmpCardContent.appendChild(optimizedPic);
        }
      }

      link.appendChild(cmpCardContent);
      cmpCardContainer.appendChild(link);
    });

    cmpCardImageHover.appendChild(cmpCardContainer);
    cardsWrapper.appendChild(cmpCardImageHover);
    tabContentPanel.appendChild(cardsWrapper);

    // Description
    const cardsDescription = document.createElement('div');
    cardsDescription.classList.add('cards__description', 'text');
    const cmpText = document.createElement('div');
    cmpText.classList.add('cmp-text');
    cmpText.innerHTML = descriptionCell.innerHTML; // Use innerHTML for richtext
    moveInstrumentation(descriptionCell, cmpText);
    cardsDescription.appendChild(cmpText);
    tabContentPanel.appendChild(cardsDescription);

    // Explore All Link
    const exploreMore = document.createElement('div');
    exploreMore.classList.add('exploremore', 'button', 'cmp-button--secondary');
    const exploreLink = document.createElement('a');
    exploreLink.classList.add('cmp-button');
    const foundExploreLink = exploreAllLinkCell.querySelector('a');
    if (foundExploreLink) {
      exploreLink.href = foundExploreLink.href;
    }
    exploreLink.textContent = exploreAllLabelCell.textContent.trim(); // Use label cell for text
    moveInstrumentation([exploreAllLinkCell, exploreAllLabelCell], exploreLink); // Pass both cells for instrumentation
    exploreMore.appendChild(exploreLink);
    tabContentPanel.appendChild(exploreMore);

    // Append tab button and panel to their respective containers
    tabList.appendChild(tabButton);
    tabPanelsContainer.appendChild(tabContentPanel);

    // Set first tab as active
    if (index === 0) {
      tabButton.classList.add('cmp-tabs__tab--active');
      tabButton.setAttribute('aria-selected', 'true');
      tabButton.setAttribute('tabindex', '0');
      tabContentPanel.classList.add('cmp-tabs__tabpanel--active');
      tabContentPanel.setAttribute('aria-hidden', 'false');
    }

    // Add event listener for tab switching
    tabButton.addEventListener('click', () => {
      // Deactivate all tabs
      tabList.querySelectorAll('.cmp-tabs__tab').forEach((tab) => {
        tab.classList.remove('cmp-tabs__tab--active');
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
      });
      tabPanelsContainer.querySelectorAll('.cmp-tabs__tabpanel').forEach((panel) => {
        panel.classList.remove('cmp-tabs__tabpanel--active');
        panel.setAttribute('aria-hidden', 'true');
      });

      // Activate clicked tab
      tabButton.classList.add('cmp-tabs__tab--active');
      tabButton.setAttribute('aria-selected', 'true');
      tabButton.setAttribute('tabindex', '0');
      tabContentPanel.classList.add('cmp-tabs__tabpanel--active');
      tabContentPanel.setAttribute('aria-hidden', 'false');
    });
  });

  cmpTabs.appendChild(tabList);
  cmpTabs.appendChild(tabPanelsContainer);
  block.appendChild(cmpTabs);
}
