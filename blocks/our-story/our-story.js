import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const backgroundImageDesktopRow = children[0];
  const backgroundImageMobileRow = children[1];
  const teaserRows = children.slice(2);

  const cmpOurStory = document.createElement('div');
  cmpOurStory.classList.add('cmp-our-story');
  moveInstrumentation(block, cmpOurStory);

  // Background Image (Desktop)
  const desktopPicture = backgroundImageDesktopRow?.querySelector('picture');
  if (desktopPicture) {
    const img = desktopPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
    cmpOurStory.style.backgroundImage = `url(${optimizedPic.querySelector('img').src})`;
  }

  // Background Image (Mobile) - handled by CSS media queries or JS for responsive background
  // For now, we'll just ensure the mobile picture is optimized if it exists,
  // but the style is applied to the main container. CSS should handle showing/hiding.
  const mobilePicture = backgroundImageMobileRow?.querySelector('picture');
  if (mobilePicture) {
    const img = mobilePicture.querySelector('img');
    createOptimizedPicture(img.src, img.alt, false, [{ width: '767' }]); // Optimize, but CSS will apply
  }

  teaserRows.forEach((row, index) => {
    const cells = [...row.children];

    // Use content detection instead of index access for teaser cells
    const descriptionCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.innerHTML.includes('<p>'));
    const mainImageCell = cells.find(cell => cell.querySelector('picture') && !cell.querySelector('.cmp-teaser__smallimage')); // Main image
    const smallImageCell = cells.find(cell => cell.querySelector('picture') && cell.querySelector('img.cmp-teaser__smallimage')); // Small image (animation)
    const ctaLinkCell = cells.find(cell => cell.querySelector('a') && cell.querySelector('a').href.startsWith('/content/')); // CTA Link (aem-content)
    const ctaLabelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim() !== '' && cell !== descriptionCell); // CTA Label (text)

    const teaser = document.createElement('div');
    teaser.classList.add(`story_${index}`, 'teaser', 'cmp-teaser');
    // Add alignment classes based on index for alternating layout
    if (index % 2 === 0) {
      teaser.classList.add('cmp-teaser--right-image-aligned');
    } else {
      teaser.classList.add('cmp-teaser--left-image-aligned');
    }

    // Add read-more-option and primary-anchor-straight if CTA exists
    if (ctaLinkCell?.querySelector('a')) {
      teaser.classList.add('cmp-teaser--read-more-option', 'cmp-button--primary-anchor-straight');
    }

    const teaserContent = document.createElement('div');
    teaserContent.classList.add('cmp-teaser__content');

    const teaserDescription = document.createElement('div');
    teaserDescription.classList.add('cmp-teaser__description');
    if (descriptionCell) {
      teaserDescription.innerHTML = descriptionCell.innerHTML;
    }
    teaserContent.append(teaserDescription);

    const ctaLink = ctaLinkCell?.querySelector('a');
    const ctaLabel = ctaLabelCell?.textContent.trim();

    if (ctaLink && ctaLabel) {
      const ctaActionContainer = document.createElement('div');
      ctaActionContainer.classList.add('cmp-teaser__action-container');

      const ctaAnchor = document.createElement('a');
      ctaAnchor.classList.add('cmp-teaser__action-link', 'cmp-button');
      ctaAnchor.href = ctaLink.href;
      ctaAnchor.textContent = ctaLabel;
      moveInstrumentation(ctaLinkCell, ctaAnchor); // Move instrumentation from original link cell
      ctaActionContainer.append(ctaAnchor);
      teaserContent.append(ctaActionContainer);
    }

    teaser.append(teaserContent);

    const teaserImage = document.createElement('div');
    teaserImage.classList.add('cmp-teaser__image');

    // Main Image
    const mainPicture = mainImageCell?.querySelector('picture');
    if (mainPicture) {
      const img = mainPicture.querySelector('img');
      const cmpImage = document.createElement('div');
      cmpImage.classList.add('cmp-image');
      const optimizedMainPic = createOptimizedPicture(img.src, img.alt, false, [
        { media: '(max-width: 767px)', width: '767' },
        { width: '2000' },
      ]);
      optimizedMainPic.querySelector('img').classList.add('cmp-image__image');
      moveInstrumentation(mainPicture, optimizedMainPic.querySelector('img'));
      cmpImage.append(optimizedMainPic);
      teaserImage.append(cmpImage);
    }

    // Small Image (animation)
    const smallPicture = smallImageCell?.querySelector('picture');
    if (smallPicture) {
      const img = smallPicture.querySelector('img');
      const cmpAnimation = document.createElement('div');
      cmpAnimation.classList.add('cmp-animation', 'visible');
      const optimizedSmallPic = createOptimizedPicture(img.src, img.alt, false, [
        { media: '(max-width: 300px)', width: '300' },
        { width: '600' },
      ]);
      optimizedSmallPic.querySelector('img').classList.add('cmp-teaser__smallimage');
      moveInstrumentation(smallPicture, optimizedSmallPic.querySelector('img'));
      cmpAnimation.append(optimizedSmallPic);
      teaserImage.append(cmpAnimation);
    }

    teaser.append(teaserImage);
    moveInstrumentation(row, teaser); // Move instrumentation from original item row
    cmpOurStory.append(teaser);
  });

  block.innerHTML = '';
  block.append(cmpOurStory);
}
