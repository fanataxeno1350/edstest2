import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add('cmp-our-story');

  const [backgroundDesktopRow, backgroundMobileRow, ...teaserRows] = [...block.children];

  const backgroundDesktopPicture = backgroundDesktopRow.querySelector('picture');
  const backgroundMobilePicture = backgroundMobileRow.querySelector('picture');

  if (backgroundDesktopPicture) {
    const desktopImg = backgroundDesktopPicture.querySelector('img');
    const optimizedDesktopPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '2000' }]);
    moveInstrumentation(desktopImg, optimizedDesktopPic.querySelector('img'));
    backgroundDesktopPicture.replaceWith(optimizedDesktopPic);
    block.style.setProperty('--background-desktop-image', `url(${optimizedDesktopPic.querySelector('img').src})`);
  }
  if (backgroundMobilePicture) {
    const mobileImg = backgroundMobilePicture.querySelector('img');
    const optimizedMobilePic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '767' }]);
    moveInstrumentation(mobileImg, optimizedMobilePic.querySelector('img'));
    backgroundMobilePicture.replaceWith(optimizedMobilePic);
    block.style.setProperty('--background-mobile-image', `url(${optimizedMobilePic.querySelector('img').src})`);
  }

  backgroundDesktopRow.remove();
  backgroundMobileRow.remove();

  teaserRows.forEach((row, index) => {
    const [descriptionCell, mainImageCell, smallImageCell, ctaLinkCell] = [...row.children];

    const teaserDiv = document.createElement('div');
    teaserDiv.classList.add('teaser', 'cmp-teaser');
    teaserDiv.classList.add(`story_${index}`);
    moveInstrumentation(row, teaserDiv);

    if (index % 2 === 0) {
      teaserDiv.classList.add('cmp-teaser--right-image-aligned');
    } else {
      teaserDiv.classList.add('cmp-teaser--left-image-aligned');
    }

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('cmp-teaser__content');

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('cmp-teaser__description');
    moveInstrumentation(descriptionCell, descriptionDiv);
    descriptionDiv.innerHTML = descriptionCell.innerHTML;
    contentDiv.append(descriptionDiv);

    const ctaLink = ctaLinkCell.querySelector('a');
    if (ctaLink) {
      const actionContainer = document.createElement('div');
      actionContainer.classList.add('cmp-teaser__action-container');
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-teaser__action-link', 'cmp-button');
      anchor.href = ctaLink.href;
      // Dynamically set text from original CTA link, or default to 'Read More'
      anchor.textContent = ctaLink.textContent.trim() || 'Read More'; 
      moveInstrumentation(ctaLinkCell, anchor);
      actionContainer.append(anchor);
      contentDiv.append(actionContainer);
      teaserDiv.classList.add('cmp-button--primary-anchor-straight', 'cmp-teaser--read-more-option');
    }

    teaserDiv.append(contentDiv);

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('cmp-teaser__image');

    const mainImagePicture = mainImageCell.querySelector('picture');
    if (mainImagePicture) {
      const mainImage = mainImagePicture.querySelector('img');
      const optimizedMainPic = createOptimizedPicture(mainImage.src, mainImage.alt, false, [{ width: '2344' }]);
      const imageWrapper = document.createElement('div');
      imageWrapper.classList.add('cmp-image');
      moveInstrumentation(mainImage, optimizedMainPic.querySelector('img'));
      optimizedMainPic.querySelector('img').classList.add('cmp-image__image');
      imageWrapper.append(optimizedMainPic);
      imageDiv.append(imageWrapper);
    }

    const smallImagePicture = smallImageCell.querySelector('picture');
    if (smallImagePicture) {
      const smallImage = smallImagePicture.querySelector('img');
      const animationDiv = document.createElement('div');
      animationDiv.classList.add('cmp-animation', 'visible');
      const optimizedSmallPic = createOptimizedPicture(smallImage.src, smallImage.alt, false, [{ width: '600' }]);
      moveInstrumentation(smallImage, optimizedSmallPic.querySelector('img'));
      optimizedSmallPic.querySelector('img').classList.add('cmp-teaser__smallimage');
      animationDiv.append(optimizedSmallPic);
      imageDiv.append(animationDiv);
    }

    teaserDiv.append(imageDiv);
    block.append(teaserDiv);
    row.remove();
  });
}
