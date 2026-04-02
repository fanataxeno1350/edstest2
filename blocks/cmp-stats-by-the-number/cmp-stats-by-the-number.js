import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, tabsContainerRow, ...itemRows] = [...block.children];

  block.classList.add('animate-ready', 'animate-in');
  block.setAttribute('role', 'region');
  block.setAttribute('aria-label', 'Statistics by the numbers');

  const container = document.createElement('div');
  container.classList.add('cmp-stats-by-the-number__container');

  // Title Section
  const titleSection = document.createElement('div');
  titleSection.classList.add('cmp-stats-by-the-number__title');
  moveInstrumentation(titleRow, titleSection);
  while (titleRow.firstChild) titleSection.append(titleRow.firstChild);
  container.append(titleSection);

  // Tabs Section
  const tabsSection = document.createElement('div');
  tabsSection.classList.add('cmp-stats-by-the-number__tabs');
  moveInstrumentation(tabsContainerRow, tabsSection);
  tabsContainerRow.remove(); // Remove the empty tabs container row

  // Filter item rows based on the number of children (cells)
  // Tab items have 5 cells, Card items have 4 cells
  const tabItems = itemRows.filter((row) => row.children.length === 5);
  const cardItems = itemRows.filter((row) => row.children.length === 4);

  const mainContent = document.createElement('div');
  mainContent.classList.add('cmp-stats-by-the-number__main-content');

  const imageSection = document.createElement('div');
  imageSection.classList.add('cmp-stats-by-the-number__image-section');

  const contentSection = document.createElement('div');
  contentSection.classList.add('cmp-stats-by-the-number__content-section');

  tabItems.forEach((tabRow, index) => {
    // Destructure all 5 cells for a tab item
    const [labelCell, imageCell, descriptionCell, cardsContainerCell, ctaLinkCell] = [...tabRow.children];

    // Create tab button
    const tabButton = document.createElement('button');
    tabButton.classList.add('cmp-stats-by-the-number__tab');
    if (index === 0) {
      tabButton.classList.add('cmp-stats-by-the-number__tab--active');
    }
    tabButton.setAttribute('data-tab', labelCell.textContent.trim());
    tabButton.setAttribute('data-tab-index', index);
    moveInstrumentation(labelCell, tabButton);
    tabButton.append(labelCell.textContent.trim());
    tabsSection.append(tabButton);

    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('cmp-stats-by-the-number__image-container');
    if (index === 0) {
      imageContainer.classList.add('cmp-stats-by-the-number__image-container--active');
    }
    imageContainer.setAttribute('data-tab-content', index);
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      imageContainer.setAttribute('data-image-path', img.src);
      const mainImage = document.createElement('img');
      mainImage.classList.add('cmp-stats-by-the-number__main-image');
      mainImage.src = img.src;
      mainImage.alt = img.alt;
      mainImage.setAttribute('data-tab-image', index);
      // The opacity is handled by the tab switching logic, no need to set it here initially
      moveInstrumentation(img, mainImage);
      imageContainer.append(mainImage);
    }
    imageSection.append(imageContainer);

    // Create tab content container
    const tabContent = document.createElement('div');
    tabContent.classList.add('cmp-stats-by-the-number__tab-content');
    if (index === 0) {
      tabContent.classList.add('cmp-stats-by-the-number__tab-content--active');
    }
    tabContent.setAttribute('data-tab-content', index);

    // Description
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('cmp-stats-by-the-number__description');
    moveInstrumentation(descriptionCell, descriptionDiv);
    while (descriptionCell.firstChild) descriptionDiv.append(descriptionCell.firstChild);
    tabContent.append(descriptionDiv);

    // Cards Grid
    const cardsGrid = document.createElement('div');
    cardsGrid.classList.add('cmp-stats-by-the-number__cards');
    cardsGrid.setAttribute('role', 'list');
    moveInstrumentation(cardsContainerCell, cardsGrid); // move instrumentation from the 'cards' container cell

    // The cardsContainerCell contains text like "1-4" to indicate which card items belong to this tab.
    // Parse this range to select the correct cards from the `cardItems` array.
    const cardRangeText = cardsContainerCell.textContent.trim();
    const [startIndex, endIndex] = cardRangeText.split('-').map(Number);
    const currentTabCards = cardItems.slice(startIndex - 1, endIndex);

    currentTabCards.forEach((cardRow) => {
      const [numberCell, cardDescriptionCell, hoverImageCell, hoverDetailsCell] = [...cardRow.children];

      const card = document.createElement('div');
      card.classList.add('cmp-stats-by-the-number__card');
      card.setAttribute('role', 'img');
      card.setAttribute('tabindex', '0');

      const hoverImage = hoverImageCell.querySelector('picture img');
      if (hoverImage) {
        card.setAttribute('data-hover-image', hoverImage.src);
      }
      card.setAttribute('data-hover-details', hoverDetailsCell.innerHTML);
      card.setAttribute('aria-label', `${numberCell.textContent.trim()}: ${cardDescriptionCell.textContent.trim()}`);
      moveInstrumentation(cardRow, card);

      const numberDiv = document.createElement('div');
      numberDiv.classList.add('cmp-stats-by-the-number__card__number');
      numberDiv.setAttribute('data-count', numberCell.innerHTML);
      while (numberCell.firstChild) numberDiv.append(numberCell.firstChild);
      card.append(numberDiv);

      const cardDescriptionDiv = document.createElement('div');
      cardDescriptionDiv.classList.add('cmp-stats-by-the-number__card__description');
      while (cardDescriptionCell.firstChild) cardDescriptionDiv.append(cardDescriptionCell.firstChild);
      card.append(cardDescriptionDiv);

      cardsGrid.append(card);

      // Hover functionality for cards
      let hoverTimeout;
      card.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        const hoverImgSrc = card.getAttribute('data-hover-image');
        const hoverDetailsHtml = card.getAttribute('data-hover-details');

        const tooltip = document.createElement('div');
        tooltip.classList.add('cmp-stats-by-the-number__card-tooltip');

        const hoverImageEl = document.createElement('img');
        hoverImageEl.classList.add('cmp-stats-by-the-number__main-image'); // Reusing class for styling
        hoverImageEl.src = hoverImgSrc;
        hoverImageEl.style.opacity = '0'; // Start hidden

        const hoverDetailsEl = document.createElement('div');
        hoverDetailsEl.classList.add('cmp-stats-by-the-number__description'); // Reusing class for styling
        hoverDetailsEl.innerHTML = hoverDetailsHtml;
        hoverDetailsEl.style.opacity = '0'; // Start hidden

        tooltip.append(hoverImageEl, hoverDetailsEl);
        document.body.append(tooltip);

        // Calculate position after appending to get dimensions
        const cardRect = card.getBoundingClientRect();
        const imgWidth = hoverImageEl.offsetWidth; // Get width after appending
        const imgHeight = hoverImageEl.offsetHeight; // Get height after appending
        const detailsHeight = hoverDetailsEl.offsetHeight; // Get height after appending

        tooltip.style.left = `${cardRect.left + (cardRect.width / 2) - (imgWidth / 2)}px`;
        tooltip.style.top = `${cardRect.top - imgHeight - detailsHeight - 20}px`; // 20px padding

        // Animate in
        setTimeout(() => {
          hoverImageEl.style.opacity = '1';
          hoverDetailsEl.style.opacity = '1';
        }, 10);
      });

      card.addEventListener('mouseleave', () => {
        hoverTimeout = setTimeout(() => {
          const tooltip = document.querySelector('.cmp-stats-by-the-number__card-tooltip');
          if (tooltip) {
            tooltip.remove();
          }
        }, 300); // Delay removal
      });
    });

    tabContent.append(cardsGrid);

    // CTA Button
    const ctaDiv = document.createElement('div');
    ctaDiv.classList.add('cmp-stats-by-the-number__cta');
    const ctaLink = ctaLinkCell.querySelector('a');
    if (ctaLink) {
      const newCtaLink = document.createElement('a');
      newCtaLink.classList.add('cta', 'cta__primary');
      newCtaLink.href = ctaLink.href;
      if (ctaLink.target) newCtaLink.target = ctaLink.target;
      if (ctaLink.getAttribute('aria-label')) newCtaLink.setAttribute('aria-label', ctaLink.getAttribute('aria-label'));
      if (ctaLink.getAttribute('data-palette')) newCtaLink.setAttribute('data-palette', ctaLink.getAttribute('data-palette'));

      const iconSpan = document.createElement('span');
      iconSpan.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
      iconSpan.setAttribute('aria-hidden', 'true');
      newCtaLink.append(iconSpan);

      const labelSpan = document.createElement('span');
      labelSpan.classList.add('cta__label');
      labelSpan.textContent = ctaLink.textContent.trim();
      newCtaLink.append(labelSpan);

      moveInstrumentation(ctaLinkCell, newCtaLink);
      ctaDiv.append(newCtaLink);
    }
    tabContent.append(ctaDiv);
    contentSection.append(tabContent);
  });

  container.append(tabsSection);
  mainContent.append(imageSection, contentSection);
  container.append(mainContent);

  block.textContent = '';
  block.append(container);

  // Add event listeners for tab switching
  const tabButtons = block.querySelectorAll('.cmp-stats-by-the-number__tab');
  const tabContents = block.querySelectorAll('.cmp-stats-by-the-number__tab-content');
  const imageContainers = block.querySelectorAll('.cmp-stats-by-the-number__image-container');

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tabIndex = button.getAttribute('data-tab-index');

      tabButtons.forEach((btn) => btn.classList.remove('cmp-stats-by-the-number__tab--active'));
      button.classList.add('cmp-stats-by-the-number__tab--active');

      tabContents.forEach((content) => {
        if (content.getAttribute('data-tab-content') === tabIndex) {
          content.classList.add('cmp-stats-by-the-number__tab-content--active');
        } else {
          content.classList.remove('cmp-stats-by-the-number__tab-content--active');
        }
      });

      imageContainers.forEach((imgContainer) => {
        const img = imgContainer.querySelector('img');
        if (imgContainer.getAttribute('data-tab-content') === tabIndex) {
          imgContainer.classList.add('cmp-stats-by-the-number__image-container--active');
          if (img) img.style.opacity = '1'; // Ensure image is visible
        } else {
          imgContainer.classList.remove('cmp-stats-by-the-number__image-container--active');
          if (img) img.style.opacity = '0'; // Ensure image is hidden
        }
      });
    });
  });

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
