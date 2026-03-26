import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, ...itemRows] = [...block.children];

  const gContainer = document.createElement('div');
  gContainer.classList.add('g-container');

  // The original HTML shows the title is wrapped in a <p> tag, but the block structure
  // indicates it's a div. We should append the original element to preserve its content
  // and instrumentation, rather than creating a new <p> and just taking textContent.
  const titleElement = titleRow.firstElementChild;
  moveInstrumentation(titleElement, titleElement); // Move instrumentation to itself if needed, or ensure it's on the correct element
  titleElement.classList.add('business-card-title');
  gContainer.append(titleElement);

  const hr = document.createElement('hr');
  hr.classList.add('business-card-title-hr');
  gContainer.append(hr);

  const businessCardContainer = document.createElement('div');
  businessCardContainer.classList.add('business-card-container');

  itemRows.forEach((row) => {
    const businessCardItem = document.createElement('div');
    moveInstrumentation(row, businessCardItem);
    businessCardItem.classList.add('business-card-item');

    // BlockJson and EDS Block Structure confirm 5 cells per item row.
    const [backgroundImageCell, logoCell, headingCell, subtitleCell, ctaLinkCell] = [...row.children];

    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    businessCardItem.append(overlay);

    const assetsDiv = document.createElement('div');
    assetsDiv.classList.add('business-card-item-assets');

    // Check if the background image cell contains a video element, as seen in original HTML
    const videoElement = backgroundImageCell.querySelector('.video-js');
    if (videoElement) {
      // If it's a video, append the video element directly
      moveInstrumentation(backgroundImageCell.firstElementChild, videoElement);
      assetsDiv.append(videoElement);
    } else {
      // Otherwise, assume it's a picture and optimize it
      const backgroundPicture = backgroundImageCell.querySelector('picture');
      if (backgroundPicture) {
        const optimizedPic = createOptimizedPicture(
          backgroundPicture.querySelector('img').src,
          backgroundPicture.querySelector('img').alt,
          false,
          [{ width: '750' }],
        );
        moveInstrumentation(backgroundPicture, optimizedPic.querySelector('img'));
        assetsDiv.append(optimizedPic);
      }
    }
    businessCardItem.append(assetsDiv);

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('business-card-item-info');

    const logoDiv = document.createElement('div');
    logoDiv.classList.add('business-card-item-logo');
    const logoPicture = logoCell.querySelector('picture');
    if (logoPicture) {
      const optimizedPic = createOptimizedPicture(
        logoPicture.querySelector('img').src,
        logoPicture.querySelector('img').alt,
        false,
        [{ width: '210' }],
      );
      moveInstrumentation(logoPicture, optimizedPic.querySelector('img'));
      logoDiv.append(optimizedPic);
    }
    infoDiv.append(logoDiv);

    const descDiv = document.createElement('div');
    descDiv.classList.add('business-card-item-desc');

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('business-card-item-title');
    // The original HTML shows an h3 inside a div for the title, and the block structure
    // indicates the headingCell contains the heading value.
    const h3 = headingCell.querySelector('h3') || document.createElement('h3');
    moveInstrumentation(headingCell.firstElementChild, h3);
    h3.textContent = headingCell.textContent;
    titleDiv.append(h3);
    descDiv.append(titleDiv);

    const subtitleP = subtitleCell.querySelector('p') || document.createElement('p');
    moveInstrumentation(subtitleCell.firstElementChild, subtitleP);
    subtitleP.classList.add('business-card-item-subtitle');
    subtitleP.textContent = subtitleCell.textContent;
    descDiv.append(subtitleP);

    const ctaLink = ctaLinkCell.querySelector('a');
    if (ctaLink) {
      // The original HTML already has the correct classes and attributes on the <a> tag.
      // We should append the existing <a> tag directly, rather than creating a new one
      // and copying properties.
      moveInstrumentation(ctaLink, ctaLink); // Ensure instrumentation is on the correct element
      ctaLink.classList.add('button', 'button-primary-white'); // Ensure classes are present
      descDiv.append(ctaLink);
    }
    infoDiv.append(descDiv);
    businessCardItem.append(infoDiv);
    businessCardContainer.append(businessCardItem);
  });

  gContainer.append(businessCardContainer);

  block.textContent = '';
  block.append(gContainer);

  // This part of the code seems to be a general picture optimization,
  // but it might re-optimize pictures that were already handled or
  // interfere with video elements. Given the specific handling above,
  // this general optimization might be redundant or problematic.
  // For now, keeping it as is, assuming it's intended for any remaining
  // pictures not explicitly handled.
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
