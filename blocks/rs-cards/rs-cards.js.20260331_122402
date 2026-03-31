import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('row');

  // The first child is the "Rs Cards" container field, which we can ignore as it's just a wrapper.
  // All subsequent children are the actual "rs-card" items.
  const itemRows = [...block.children].slice(1);

  itemRows.forEach((row) => {
    const colDiv = document.createElement('div');
    colDiv.classList.add('col-xl-4', 'col-lg-6', 'pb-md-0', 'pb-4', 'row-gap-4', 'koi-rscard-padding');
    moveInstrumentation(row, colDiv);

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'rs-card');

    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('card-body');

    // Create the 'explore-btn-hide-id' link and image as per original HTML
    const exploreLink = document.createElement('a');
    exploreLink.setAttribute('aria-label', `Read more about '${row.children[1].textContent.trim()}'`); // Use heading text for aria-label
    exploreLink.setAttribute('target', '_self');
    exploreLink.setAttribute('id', 'explore-btn-hide-id');
    // The first card in the original HTML has display: none, others don't.
    // For consistency, we'll assume it should be present but potentially hidden by CSS.
    // We'll not set display:none here, as it might be controlled by CSS or JS later.
    const exploreImg = document.createElement('img');
    exploreImg.loading = 'lazy';
    exploreImg.src = '/content/dam/aemigrate/uploaded-folder/image/1774935172662.svg+xml'; // Hardcoded as per original HTML
    exploreLink.append(exploreImg);
    cardBodyDiv.append(exploreLink);


    [...row.children].forEach((cell, index) => {
      if (index === 0) { // Image cell
        const picture = cell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          if (img) {
            const newImg = document.createElement('img');
            newImg.src = img.src;
            newImg.alt = img.alt;
            newImg.loading = 'lazy';
            newImg.classList.add('w-100', 'kitchens-image'); // Use kitchens-image for the displayed image
            newImg.style.display = 'block'; // As per original HTML

            // The original HTML also has a 'rightshift-image' with display:none.
            // We'll create it for consistency, but it won't be visible.
            const rightshiftImg = document.createElement('img');
            rightshiftImg.loading = 'lazy';
            rightshiftImg.classList.add('w-100', 'rightshift-image');
            rightshiftImg.alt = img.alt; // Use the same alt text
            rightshiftImg.style.display = 'none';
            rightshiftImg.src = img.src; // Use the same image source for rightshift-image

            cardDiv.append(rightshiftImg, newImg);
          }
        }
      } else if (index === 1) { // Heading cell
        const h5 = document.createElement('h5');
        h5.classList.add('blog-card-title');
        h5.style.display = 'block'; // As per original HTML
        moveInstrumentation(cell, h5);
        // Append all children from the cell to the h5
        while (cell.firstChild) h5.append(cell.firstChild);
        cardBodyDiv.append(h5);
      } else if (index === 2) { // Body cell
        const h5 = document.createElement('h5'); // Original HTML uses h5 for the card-title
        h5.classList.add('card-title');
        moveInstrumentation(cell, h5);
        // Append all children from the cell to the h5 (which should contain a p tag)
        while (cell.firstChild) h5.append(cell.firstChild);
        cardBodyDiv.append(h5);
      }
    });

    cardDiv.append(cardBodyDiv);
    colDiv.append(cardDiv);
    wrapper.append(colDiv);
  });

  // Add the tab-para div at the end of the wrapper as per original HTML
  const tabParaDiv = document.createElement('div');
  tabParaDiv.classList.add('tab-para');
  wrapper.append(tabParaDiv);

  wrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(wrapper);
}
