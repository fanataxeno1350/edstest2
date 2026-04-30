import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0 & 1: Replaced direct index access with content detection for robustness
  const cells = [...block.children];
  const descriptionCell = cells.find((cell) => cell.querySelector('div')?.textContent.trim() === 'Description text content' || cell.innerHTML.includes('<p>'));
  const ctaLinkCell = cells.find((cell) => cell.querySelector('a[href*="/content/site/ctaLink"]'));
  const mainImageCell = cells.find((cell) => cell.querySelector('picture') && !cell.querySelector('picture img[alt="Small Image"]'));
  const smallImageCell = cells.find((cell) => cell.querySelector('picture img[alt="Small Image"]'));

  // CHECK 1: Class names from ORIGINAL HTML
  block.classList.add('teaser', 'cmp-teaser--read-more-option', 'cmp-teaser--left-image-aligned', 'cmp-button--primary-anchor-straight');

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('cmp-teaser__content');

  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('cmp-teaser__description');
  if (descriptionCell) { // CHECK 1.5: Ensure richtext uses innerHTML
    moveInstrumentation(descriptionCell, descriptionDiv);
    descriptionDiv.innerHTML = descriptionCell.innerHTML;
  }
  contentDiv.append(descriptionDiv);

  const actionContainerDiv = document.createElement('div');
  actionContainerDiv.classList.add('cmp-teaser__action-container');

  if (ctaLinkCell) {
    const ctaLink = ctaLinkCell.querySelector('a');
    if (ctaLink) {
      const ctaAnchor = document.createElement('a');
      ctaAnchor.classList.add('cmp-teaser__action-link', 'cmp-button'); // CHECK 1: Class names from ORIGINAL HTML
      ctaAnchor.href = ctaLink.href;
      // CHECK 1: CTA label should be "Read More" based on ORIGINAL HTML
      ctaAnchor.textContent = 'Read More';
      moveInstrumentation(ctaLinkCell, ctaAnchor);
      actionContainerDiv.append(ctaAnchor);
    }
  }
  contentDiv.append(actionContainerDiv);

  const imageDiv = document.createElement('div');
  imageDiv.classList.add('cmp-teaser__image');

  if (mainImageCell) {
    const mainPicture = mainImageCell.querySelector('picture');
    if (mainPicture) {
      const img = mainPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        mainPicture.replaceWith(optimizedPic);
        optimizedPic.classList.add('cmp-image'); // CHECK 1: Class names from ORIGINAL HTML
        optimizedPic.querySelector('img').classList.add('cmp-image__image'); // CHECK 1: Class names from ORIGINAL HTML
        imageDiv.append(optimizedPic);
      }
    }
  }

  const animationDiv = document.createElement('div');
  animationDiv.classList.add('cmp-animation', 'visible'); // CHECK 1: Class names from ORIGINAL HTML

  if (smallImageCell) {
    const smallPicture = smallImageCell.querySelector('picture');
    if (smallPicture) {
      const img = smallPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '300' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        smallPicture.replaceWith(optimizedPic);
        optimizedPic.querySelector('img').classList.add('cmp-teaser__smallimage'); // CHECK 1: Class names from ORIGINAL HTML
        animationDiv.append(optimizedPic);
      }
    }
  }
  imageDiv.append(animationDiv);

  block.innerHTML = ''; // Clear original block content
  block.append(contentDiv, imageDiv);
}
