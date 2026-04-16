import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, ...itemRows] = [...block.children];

  const titleText = titleRow?.firstElementChild?.textContent.trim();
  if (titleText) {
    const titleElement = document.createElement('h2');
    titleElement.textContent = titleText;
    moveInstrumentation(titleRow, titleElement);
    block.prepend(titleElement);
  }
  titleRow.remove(); // Remove the original title row

  const gallerySection = document.createElement('div');
  gallerySection.id = 'gallerySection';

  const gholder = document.createElement('div');
  gholder.classList.add('gholder');

  const itemsList = document.createElement('ul');
  itemsList.classList.add('items');

  itemRows.forEach((row, index) => {
    // The EDS Block Structure and Block JSON confirm fixed fields per row,
    // so direct destructuring is appropriate here.
    const [labelCell, linkCell, imageCell, iconCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('aldiscoveryCard');
    if (index === 0) {
      li.classList.add('itemActive');
      li.style.flexBasis = '200%'; // Apply initial style for the first active item
    } else {
      li.style.flexBasis = '20%'; // Apply initial style for other items
    }

    const cardWithLink = document.createElement('div');
    cardWithLink.classList.add('cardWithLink');

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href; // Correctly read href for aem-content type
      anchor.title = labelCell?.textContent.trim();
    }

    const imagePicture = imageCell?.querySelector('picture');
    if (imagePicture) {
      const img = imagePicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        optimizedImg.classList.add('imageTransition', 'active');
        optimizedImg.title = img.title || img.alt; // Copy title from original img
        moveInstrumentation(img, optimizedImg);
        imagePicture.replaceWith(optimizedPic);
        anchor.append(optimizedPic);
      }
    }

    const spanHolder = document.createElement('span');
    spanHolder.classList.add('holder');
    spanHolder.textContent = labelCell?.textContent.trim();

    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      if (iconImg) {
        const optimizedIconPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '48' }]);
        const optimizedIconImg = optimizedIconPic.querySelector('img');
        optimizedIconImg.classList.add('icon');
        moveInstrumentation(iconImg, optimizedIconImg);
        iconPicture.replaceWith(optimizedIconPic);
        spanHolder.append(optimizedIconPic);
      }
    }

    anchor.append(spanHolder);
    cardWithLink.append(anchor);
    moveInstrumentation(row, li); // Move instrumentation from the original row to the new li
    li.append(cardWithLink);
    itemsList.append(li);

    // Add click event listener for gallery interaction
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const currentActive = itemsList.querySelector('.itemActive');
      if (currentActive) {
        currentActive.classList.remove('itemActive');
        currentActive.style.flexBasis = '20%';
        const currentActiveImg = currentActive.querySelector('.imageTransition');
        if (currentActiveImg) currentActiveImg.classList.remove('active');
      }
      li.classList.add('itemActive');
      li.style.flexBasis = '200%';
      const newActiveImg = li.querySelector('.imageTransition');
      if (newActiveImg) newActiveImg.classList.add('active');
    });
  });

  gholder.append(itemsList);
  gallerySection.append(gholder);
  block.append(gallerySection);
  block.classList.add('gallery'); // Ensure block retains its main class
}
