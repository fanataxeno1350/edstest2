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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist but is essential for the JS functionality.
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
    }
  });
}

export default function decorate(block) {
  const rows = [...block.children];
  const futureCards = [];
  const futurePlantImages = [];
  const manufacturingCards = [];
  const futureListItems = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 6) {
      // future-card
      futureCards.push(row);
    } else if (cells.length === 2 && cells[0].querySelector('a') && cells[1].querySelector('picture')) {
      // future-plant-image
      futurePlantImages.push(row);
    } else if (cells.length === 4) {
      // manufacturing-card
      manufacturingCards.push(row);
    } else if (cells.length === 2 && cells[0].querySelector('picture') && !cells[1].querySelector('a')) {
      // future-list-item
      futureListItems.push(row);
    }
  });

  block.innerHTML = '';
  block.classList.add('inovativeBanner');

  // Process the first future card
  if (futureCards.length > 0) {
    const [linkCell, cardImageCell, headingCell, headingIconCell, descriptionCell, hierarchyCell] = [...futureCards[0].children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('futureCard');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.title = headingCell.textContent.trim();
    }
    moveInstrumentation(futureCards[0], cardLink);

    const cardImage = cardImageCell.querySelector('picture');
    if (cardImage) {
      const img = cardImage.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      cardLink.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('imageTransition', 'active');
    }

    const cardHeadingDiv = document.createElement('div');
    cardHeadingDiv.classList.add('cardHeading');

    const headingLink = document.createElement('h2');
    headingLink.classList.add('headinglink');
    headingLink.textContent = headingCell.textContent.trim();

    const headingIcon = headingIconCell.querySelector('picture');
    if (headingIcon) {
      const img = headingIcon.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      headingLink.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('imageTransition', 'active');
    }

    cardHeadingDiv.append(headingLink);

    const description = document.createElement('p');
    description.textContent = descriptionCell.textContent.trim();
    cardHeadingDiv.append(description);

    cardLink.append(cardHeadingDiv);
    block.append(cardLink);

    // Handle hierarchy-tree
    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      const hierarchyWrapper = document.createElement('div');
      hierarchyWrapper.classList.add('hierarchy-wrapper'); // Custom class for styling
      hierarchyWrapper.appendChild(hierarchyRoot);
      cardLink.append(hierarchyWrapper);
      transformNestedLists(hierarchyRoot);
    }
  }

  if (manufacturingCards.length > 0 || futurePlantImages.length > 0 || futureListItems.length > 0) {
    const futruePlantsDiv = document.createElement('div');
    futruePlantsDiv.classList.add('futureCard', 'futruePlants');

    if (futurePlantImages.length > 0) {
      const cssCarouselDiv = document.createElement('div');
      cssCarouselDiv.classList.add('posR');

      const futurePlantsUl = document.createElement('ul');
      futurePlantsUl.id = 'futurePlants';
      futurePlantsUl.classList.add('scrollSmooth', 'boxshoadowInset');

      futurePlantImages.forEach((row) => {
        const [linkCell, imageCell] = [...row.children];

        const li = document.createElement('li');
        const plantLink = document.createElement('a');
        const foundLink = linkCell.querySelector('a');
        if (foundLink) {
          plantLink.href = foundLink.href;
          plantLink.title = 'Manufacturing Plants';
        }
        moveInstrumentation(row, plantLink);

        const image = imageCell.querySelector('picture');
        if (image) {
          const img = image.querySelector('img');
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          plantLink.append(optimizedPic);
          optimizedPic.querySelector('img').classList.add('imageTransition', 'active');
        }
        li.append(plantLink);
        futurePlantsUl.append(li);
      });
      cssCarouselDiv.append(futurePlantsUl);
      futruePlantsDiv.append(cssCarouselDiv);
    }

    manufacturingCards.forEach((row) => {
      const [linkCell, headingCell, headingIconCell, descriptionCell] = [...row.children];

      const cardHeadingDiv = document.createElement('a');
      cardHeadingDiv.classList.add('cardHeading', 'cardH');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        cardHeadingDiv.href = foundLink.href;
        cardHeadingDiv.title = headingCell.textContent.trim();
      }
      moveInstrumentation(row, cardHeadingDiv);

      const headingLink = document.createElement('h2');
      headingLink.classList.add('headinglink');
      headingLink.textContent = headingCell.textContent.trim();

      const headingIcon = headingIconCell.querySelector('picture');
      if (headingIcon) {
        const img = headingIcon.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        headingLink.append(optimizedPic);
        optimizedPic.querySelector('img').classList.add('imageTransition', 'active');
      }

      cardHeadingDiv.append(headingLink);

      const description = document.createElement('p');
      description.textContent = descriptionCell.textContent.trim();
      cardHeadingDiv.append(description);

      futruePlantsDiv.append(cardHeadingDiv);
    });

    if (futureListItems.length > 0) {
      const futureListsUl = document.createElement('ul');
      futureListsUl.classList.add('futureLists', 'container');

      futureListItems.forEach((row) => {
        const [iconCell, labelCell] = [...row.children];

        const li = document.createElement('li');
        moveInstrumentation(row, li);

        const icon = iconCell.querySelector('picture');
        if (icon) {
          const img = icon.querySelector('img');
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          li.append(optimizedPic);
          optimizedPic.querySelector('img').classList.add('imageTransition', 'active');
        }

        const span = document.createElement('span');
        span.textContent = labelCell.textContent.trim();
        li.append(span);
        futureListsUl.append(li);
      });
      futruePlantsDiv.append(futureListsUl);
    }
    block.append(futruePlantsDiv);
  }

  // Add sustainability card if present (remaining futureCards)
  futureCards.slice(1).forEach((row) => {
    const [linkCell, cardImageCell, headingCell, headingIconCell, descriptionCell, hierarchyCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('futureCard', 'sustainabilityCard');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.title = headingCell.textContent.trim();
    }
    moveInstrumentation(row, cardLink);

    const cardImage = cardImageCell.querySelector('picture');
    if (cardImage) {
      const img = cardImage.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      cardLink.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('imageTransition', 'active');
    }

    const cardHeadingDiv = document.createElement('div');
    cardHeadingDiv.classList.add('cardHeading');

    const headingLink = document.createElement('h2');
    headingLink.classList.add('headinglink');
    headingLink.textContent = headingCell.textContent.trim();

    const headingIcon = headingIconCell.querySelector('picture');
    if (headingIcon) {
      const img = headingIcon.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      headingLink.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('imageTransition', 'active');
    }

    cardHeadingDiv.append(headingLink);

    const description = document.createElement('p');
    description.textContent = descriptionCell.textContent.trim();
    cardHeadingDiv.append(description);

    cardLink.append(cardHeadingDiv);
    block.append(cardLink);

    // Handle hierarchy-tree
    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      const hierarchyWrapper = document.createElement('div');
      hierarchyWrapper.classList.add('hierarchy-wrapper'); // Custom class for styling
      hierarchyWrapper.appendChild(hierarchyRoot);
      cardLink.append(hierarchyWrapper);
      transformNestedLists(hierarchyRoot);
    }
  });
}
