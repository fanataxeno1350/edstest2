import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  const eyebrowRow = rows[0];
  const headingRow = rows[1];
  const descriptionRow = rows[2];
  const ctaRow = rows[3];
  const ctaImageRow = rows[4];

  const wrapper = document.createElement('div');
  wrapper.classList.add('row', 'sf_colsIn', 'col-lg-12', 'our_brands_bg'); // Copied from ORIGINAL HTML

  const contentBlock = document.createElement('div');
  contentBlock.classList.add('sfContentBlock', 'sf-Long-text'); // Copied from ORIGINAL HTML

  const bulletDisplayUl = document.createElement('div');
  bulletDisplayUl.classList.add('bullet_display_ul'); // Copied from ORIGINAL HTML

  const eyebrow = document.createElement('h5');
  const eyebrowContent = eyebrowRow.querySelector('div'); // Content detection
  if (eyebrowContent) {
    moveInstrumentation(eyebrowContent, eyebrow);
    eyebrow.style.textAlign = 'center';
    const strongEyebrow = document.createElement('strong');
    while (eyebrowContent.firstChild) strongEyebrow.append(eyebrowContent.firstChild);
    eyebrow.append(strongEyebrow);
  }


  const heading = document.createElement('h2');
  const headingContent = headingRow.querySelector('div'); // Content detection
  if (headingContent) {
    moveInstrumentation(headingContent, heading);
    heading.style.textAlign = 'center';
    const spanHeading = document.createElement('span');
    spanHeading.style.color = 'rgb(0, 0, 0)';
    const strongHeading = document.createElement('strong');
    while (headingContent.firstChild) strongHeading.append(headingContent.firstChild);
    spanHeading.append(strongHeading);
    heading.append(spanHeading);
  }


  const description = document.createElement('p');
  const descriptionContent = descriptionRow.querySelector('div'); // Content detection
  if (descriptionContent) {
    moveInstrumentation(descriptionContent, description);
    description.style.textAlign = 'center';
    while (descriptionContent.firstChild) description.append(descriptionContent.firstChild);
  }


  const ctaParagraph = document.createElement('p');
  const ctaContent = ctaRow.querySelector('div'); // Content detection
  if (ctaContent) {
    moveInstrumentation(ctaContent, ctaParagraph);
    ctaParagraph.style.textAlign = 'center';
    const ctaLink = document.createElement('a');
    const originalCtaLink = ctaContent.querySelector('a');
    if (originalCtaLink) {
      ctaLink.href = originalCtaLink.href;
      ctaLink.tabIndex = 0;
      ctaLink.contentEditable = false;
      ctaLink.style.cursor = 'pointer';
    }
    const strongCta = document.createElement('strong');
    const spanCta = document.createElement('span');
    spanCta.style.color = 'rgb(0, 0, 0)';
    if (originalCtaLink) {
      spanCta.textContent = originalCtaLink.textContent;
    }
    strongCta.append(spanCta);

    const ctaImagePicture = ctaImageRow.querySelector('picture');
    if (ctaImagePicture) {
      const ctaImage = ctaImagePicture.querySelector('img');
      if (ctaImage) {
        const optimizedPic = createOptimizedPicture(ctaImage.src, ctaImage.alt, false, [{ width: '750' }]);
        moveInstrumentation(ctaImage, optimizedPic.querySelector('img'));
        strongCta.append(optimizedPic);
      }
    }

    ctaLink.append(strongCta);
    ctaParagraph.append(ctaLink);
  }


  bulletDisplayUl.append(eyebrow, heading, description, ctaParagraph);
  contentBlock.append(bulletDisplayUl);
  wrapper.append(contentBlock);

  block.textContent = '';
  block.append(wrapper);
}
