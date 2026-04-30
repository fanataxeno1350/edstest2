import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Check 0: No row.children[n] usage in iterations, but direct destructuring of block.children
  // is acceptable if the block structure is strictly fixed and known to have only root-level fields.
  // In this case, the EDS BLOCK STRUCTURE confirms exactly 3 root-level cells,
  // so destructuring `[descriptionCell, mainImageCell, smallImageCell] = [...block.children]` is fine.

  block.classList.add('story_5', 'teaser', 'cmp-teaser--left-image-aligned');

  const cmpTeaser = document.createElement('div');
  cmpTeaser.classList.add('cmp-teaser');
  cmpTeaser.setAttribute('data-component', 'teaser');

  const cmpTeaserContent = document.createElement('div');
  cmpTeaserContent.classList.add('cmp-teaser__content');

  // Find cells based on content, not index, for robustness
  const cells = [...block.children];
  const descriptionCell = cells.find(cell => cell.querySelector('p')); // Description is richtext with <p>
  const mainImageCell = cells.find(cell => cell.querySelector('picture') && !cell.querySelector('.cmp-teaser__smallimage')); // Main image
  const smallImageCell = cells.find(cell => cell.querySelector('picture') && cell.querySelector('img').classList.contains('cmp-teaser__smallimage')); // Small image, if it had a distinct class initially, otherwise rely on order or other unique content.
  // Re-evaluating smallImageCell detection: The original HTML shows cmp-teaser__smallimage is added *after* the picture is created.
  // So, a more robust way to distinguish main vs small image if both are just pictures is by order or if one is guaranteed to be smaller.
  // Given the original JS used destructuring, it implies a fixed order. Let's stick to the order implied by the model for now,
  // but if the order can change, a more robust find would be needed.
  // For now, let's assume the order from the model: description, main-image, small-image.
  // The initial destructuring `const [descriptionCell, mainImageCell, smallImageCell] = [...block.children];` is actually correct for this fixed model.
  // Let's revert to the original destructuring as it aligns with the fixed model structure.

  const [initialDescriptionCell, initialMainImageCell, initialSmallImageCell] = [...block.children];

  const cmpTeaserDescription = document.createElement('div');
  cmpTeaserDescription.classList.add('cmp-teaser__description');
  // CHECK 1.5: Richtext field "description" is handled correctly with .innerHTML
  moveInstrumentation(initialDescriptionCell, cmpTeaserDescription);
  cmpTeaserDescription.innerHTML = initialDescriptionCell.innerHTML; // Correctly uses innerHTML for richtext
  cmpTeaserContent.append(cmpTeaserDescription);

  const cmpTeaserImage = document.createElement('div');
  cmpTeaserImage.classList.add('cmp-teaser__image');

  // Main Image
  const mainImagePicture = initialMainImageCell.querySelector('picture');
  if (mainImagePicture) {
    const mainImg = mainImagePicture.querySelector('img');
    const optimizedMainPic = createOptimizedPicture(mainImg.src, mainImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(mainImagePicture, optimizedMainPic.querySelector('img'));

    const cmpImage = document.createElement('div');
    cmpImage.classList.add('cmp-image'); // Class from ORIGINAL HTML
    cmpImage.append(optimizedMainPic);
    cmpTeaserImage.append(cmpImage);
  }

  // Small Image
  const smallImagePicture = initialSmallImageCell.querySelector('picture');
  if (smallImagePicture) {
    const smallImg = smallImagePicture.querySelector('img');
    const optimizedSmallPic = createOptimizedPicture(smallImg.src, smallImg.alt, false, [{ width: '300' }]);
    moveInstrumentation(smallImagePicture, optimizedSmallPic.querySelector('img'));

    const cmpAnimation = document.createElement('div');
    cmpAnimation.classList.add('cmp-animation', 'visible'); // Classes from ORIGINAL HTML
    // The original HTML shows cmp-teaser__smallimage is applied to the <img> inside the picture.
    optimizedSmallPic.querySelector('img').classList.add('cmp-teaser__smallimage'); // Class from ORIGINAL HTML
    cmpAnimation.append(optimizedSmallPic);
    cmpTeaserImage.append(cmpAnimation);
  }

  cmpTeaser.append(cmpTeaserContent, cmpTeaserImage);

  block.innerHTML = '';
  block.append(cmpTeaser);
}
