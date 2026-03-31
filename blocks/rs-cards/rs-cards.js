import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('row');

  // The first row is the container field, which we can ignore for rendering
  // BlockJson indicates a 'cards' container field, which is block.children[0].
  // The actual card items start from block.children[1].
  const cardRows = [...block.children].slice(1);

  cardRows.forEach((row) => {
    const col = document.createElement('div');
    col.classList.add('col-xl-4', 'col-lg-6', 'pb-md-0', 'pb-4', 'row-gap-4', 'koi-rscard-padding');
    moveInstrumentation(row, col);

    const card = document.createElement('div');
    card.classList.add('card', 'rs-card');

    // BlockJson model for 'rs-card' has 5 fields: image, alt, title, description, cta
    const [imageCell, altTextCell, titleCell, descriptionCell, ctaCell] = [...row.children];

    // Image
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        // Use the src from the authored picture and alt text from the altTextCell.
        // The original HTML has two image elements, one with rightshift-image and one with kitchens-image.
        // The 'kitchens-image' is the one displayed.
        const optimizedPic = createOptimizedPicture(img.src, altTextCell.textContent.trim(), false, [{ width: '750' }]);
        const newImg = optimizedPic.querySelector('img');
        newImg.classList.add('w-100', 'kitchens-image'); // Apply the correct class from original HTML
        moveInstrumentation(img, newImg); // Move instrumentation from original img to the new one
        card.append(optimizedPic);
      }
    }

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Title (Original HTML uses blog-card-title for the title itself)
    const title = document.createElement('h5');
    title.classList.add('blog-card-title');
    moveInstrumentation(titleCell, title);
    while (titleCell.firstChild) title.append(titleCell.firstChild);
    cardBody.append(title);

    // Description (Original HTML uses card-title for the description)
    const description = document.createElement('h5');
    description.classList.add('card-title');
    moveInstrumentation(descriptionCell, description);
    while (descriptionCell.firstChild) description.append(descriptionCell.firstChild);
    cardBody.append(description);

    // CTA Link
    const ctaLink = ctaCell.querySelector('a');
    if (ctaLink) {
      const newCta = document.createElement('a');
      newCta.href = ctaLink.href;
      newCta.setAttribute('aria-label', `Read more about '${titleCell.textContent.trim()}'`);
      newCta.target = ctaLink.target || '_self'; // Preserve target if present, default to _self
      // The original HTML has an img inside the anchor, but EDS model provides text.
      // We need to move all children from the original ctaLink to newCta.
      moveInstrumentation(ctaLink, newCta);
      while (ctaLink.firstChild) newCta.append(ctaLink.firstChild);
      cardBody.append(newCta);
    }

    card.append(cardBody);
    col.append(card);
    wrapper.append(col);
  });

  const tabPara = document.createElement('div');
  tabPara.classList.add('tab-para');
  wrapper.append(tabPara);

  block.textContent = '';
  block.append(wrapper);
}
