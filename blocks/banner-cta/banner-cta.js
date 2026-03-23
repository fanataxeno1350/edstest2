import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const bannerCtaTextCenterDiv = document.createElement('div');
  bannerCtaTextCenterDiv.className = 'banner-cta-text-center';

  const ctaLink = block.querySelector('[data-aue-prop="ctaLink"]');
  const ctaText = block.querySelector('[data-aue-prop="ctaText"]');

  const anchor = document.createElement('a');
  anchor.id = 'cta-5b69d7d699'; // Hardcoded ID from example, consider dynamic if needed
  anchor.className = 'banner-cta-cmp-button banner-cta-analytics_cta_click banner-cta-text-center banner-cta-layout';
  anchor.dataset.linkRegion = 'CTA';
  anchor.dataset.isInternal = 'true';
  anchor.dataset.enableGating = 'false';

  if (ctaLink) {
    anchor.href = ctaLink.href;
    anchor.target = ctaLink.target || '_blank'; // Default to _blank if not specified
    moveInstrumentation(ctaLink, anchor);
  }

  const span = document.createElement('span');
  span.className = 'banner-cta-cmp-button__text banner-cta-primary-btn banner-cta-w-75 banner-cta-p-5 banner-cta-rounded-pill banner-cta-d-inline-flex banner-cta-justify-content-center banner-cta-align-items-center banner-cta-famlf-cta-btn';

  if (ctaText) {
    span.textContent = ctaText.textContent.trim();
    moveInstrumentation(ctaText, span);
  } else if (ctaLink) {
    // Fallback to link text if ctaText is not explicitly defined
    span.textContent = ctaLink.textContent.trim();
  }

  anchor.append(span);
  bannerCtaTextCenterDiv.append(anchor);

  // Recreate the pop-up div structure as it's part of the static layout
  const popUpDiv = document.createElement('div');
  popUpDiv.className = 'banner-cta-pop-up banner-cta-d-none';

  const popupMessageInput = document.createElement('input');
  popupMessageInput.type = 'hidden';
  popupMessageInput.className = 'banner-cta-popup-message';
  popUpDiv.append(popupMessageInput);

  const proceedButtonInput = document.createElement('input');
  proceedButtonInput.type = 'hidden';
  proceedButtonInput.className = 'banner-cta-proceed-button-label';
  popUpDiv.append(proceedButtonInput);

  const cancelButtonInput = document.createElement('input');
  cancelButtonInput.type = 'hidden';
  cancelButtonInput.className = 'banner-cta-cancel-button-label';
  popUpDiv.append(cancelButtonInput);

  const backgroundColorInput = document.createElement('input');
  backgroundColorInput.type = 'hidden';
  backgroundColorInput.className = 'banner-cta-background-color';
  popUpDiv.append(backgroundColorInput);

  bannerCtaTextCenterDiv.append(popUpDiv);

  block.textContent = '';
  block.append(bannerCtaTextCenterDiv);
  block.className = 'banner-cta block';
  block.dataset.blockStatus = 'loaded';
}
