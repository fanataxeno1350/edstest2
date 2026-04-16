import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...serviceCardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('otherServices');
  moveInstrumentation(block, section);

  // Heading
  const headingCell = headingRow.firstElementChild;
  if (headingCell) {
    const h2 = document.createElement('h2');
    h2.textContent = headingCell.textContent.trim();
    moveInstrumentation(headingCell, h2);
    section.append(h2);
  }

  // Service Cards List
  const ul = document.createElement('ul');

  serviceCardRows.forEach((row) => {
    const cells = [...row.children];

    // Use content detection for cells, especially for aem-content and reference types
    const imageCell = cells[0]; // Fixed position for image
    const imageAltCell = cells[1]; // Fixed position for image alt text
    const tagCell = cells[2]; // Fixed position for tag
    const titleCell = cells[3]; // Fixed position for title
    const descriptionCell = cells[4]; // Fixed position for description
    const ctaLinkCell = cells[5]; // Fixed position for CTA Link (aem-content)
    const ctaLabelCell = cells[6]; // Fixed position for CTA Label
    const ctaIconCell = cells[7]; // Fixed position for CTA Icon (reference)

    const li = document.createElement('li');
    const serviceCardDiv = document.createElement('div');
    serviceCardDiv.classList.add('serviceCard');
    moveInstrumentation(row, serviceCardDiv);

    // Image
    const imagesDiv = document.createElement('div');
    imagesDiv.classList.add('images');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, imageAltCell?.textContent.trim() || img.alt, false, [{ width: '750' }]);
        const newImg = optimizedPic.querySelector('img');
        if (newImg) {
          // Apply classes from the original img to the new img
          newImg.classList.add('imageTransition', 'active');
          moveInstrumentation(img, newImg);
        }
        imagesDiv.append(optimizedPic);
      }
    }
    serviceCardDiv.append(imagesDiv);

    // Holder
    const holderDiv = document.createElement('div');
    holderDiv.classList.add('holder');

    // Tag
    if (tagCell && tagCell.textContent.trim()) {
      const spanTag = document.createElement('span');
      spanTag.classList.add('tagal');
      spanTag.textContent = tagCell.textContent.trim();
      moveInstrumentation(tagCell, spanTag);
      holderDiv.append(spanTag);
    }

    // Title
    if (titleCell && titleCell.textContent.trim()) {
      const h3 = document.createElement('h3');
      h3.textContent = titleCell.textContent.trim();
      moveInstrumentation(titleCell, h3);
      holderDiv.append(h3);
    }

    // Description
    if (descriptionCell && descriptionCell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = descriptionCell.textContent.trim();
      moveInstrumentation(descriptionCell, p);
      holderDiv.append(p);
    }

    // CTA Link and Icon
    const ctaLinkElement = ctaLinkCell.querySelector('a');
    const ctaButtonElement = ctaLinkCell.querySelector('button'); // Check for button as well

    if ((ctaLinkElement || ctaButtonElement) && ctaLabelCell) {
      let interactiveElement;
      if (ctaLinkElement) {
        interactiveElement = document.createElement('a');
        interactiveElement.href = ctaLinkElement.href;
      } else if (ctaButtonElement) {
        interactiveElement = document.createElement('button');
      }

      if (interactiveElement) {
        interactiveElement.classList.add('bottomlink');
        interactiveElement.title = ctaLabelCell.textContent.trim();
        interactiveElement.textContent = ctaLabelCell.textContent.trim();
        moveInstrumentation(ctaLinkCell, interactiveElement);
        moveInstrumentation(ctaLabelCell, interactiveElement);

        const ctaIconPicture = ctaIconCell.querySelector('picture');
        if (ctaIconPicture) {
          const ctaIconImg = ctaIconPicture.querySelector('img');
          if (ctaIconImg) {
            const optimizedCtaIcon = createOptimizedPicture(ctaIconImg.src, ctaIconImg.alt, false, [{ width: '24' }]);
            moveInstrumentation(ctaIconImg, optimizedCtaIcon.querySelector('img'));
            interactiveElement.append(optimizedCtaIcon);
          }
        }
        holderDiv.append(interactiveElement);
      }
    }

    serviceCardDiv.append(holderDiv);
    li.append(serviceCardDiv);
    ul.append(li);
  });

  section.append(ul);
  block.replaceWith(section);

  // Image optimization for all images within the section
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    const newImg = optimizedPic.querySelector('img');
    if (newImg) {
      newImg.classList.add(...img.classList);
      moveInstrumentation(img, newImg);
    }
    img.closest('picture').replaceWith(optimizedPic);
  });
}
