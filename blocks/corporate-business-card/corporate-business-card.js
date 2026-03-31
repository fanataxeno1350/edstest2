import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, ...itemRows] = [...block.children];

  const gContainer = document.createElement('div');
  gContainer.classList.add('g-container');

  // Title
  const titleP = document.createElement('p');
  // The title content is in the first div of the titleRow
  moveInstrumentation(titleRow.firstElementChild, titleP);
  titleP.classList.add('business-card-title');
  titleP.append(titleRow.firstElementChild.textContent);
  gContainer.append(titleP);

  // Horizontal Rule
  const hr = document.createElement('hr');
  hr.classList.add('business-card-title-hr');
  gContainer.append(hr);

  const businessCardContainer = document.createElement('div');
  businessCardContainer.classList.add('business-card-container');

  itemRows.forEach((row) => {
    const businessCardItem = document.createElement('div');
    moveInstrumentation(row, businessCardItem);
    businessCardItem.classList.add('business-card-item');

    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    businessCardItem.append(overlay);

    const businessCardItemAssets = document.createElement('div');
    businessCardItemAssets.classList.add('business-card-item-assets');

    const businessCardItemInfo = document.createElement('div');
    businessCardItemInfo.classList.add('business-card-item-info');

    const businessCardItemLogo = document.createElement('div');
    businessCardItemLogo.classList.add('business-card-item-logo');

    const businessCardItemDesc = document.createElement('div');
    businessCardItemDesc.classList.add('business-card-item-desc');

    const businessCardItemTitle = document.createElement('div');
    businessCardItemTitle.classList.add('business-card-item-title');

    const businessCardItemSubtitle = document.createElement('p');
    businessCardItemSubtitle.classList.add('business-card-item-subtitle');

    let videoPosterPicture;
    let logoPicture;
    let headingText;
    let subtitleText;
    let linkElement;

    // Destructure cells based on BlockJson model
    const cells = [...row.children];
    if (cells.length >= 5) { // Ensure there are enough cells
      videoPosterPicture = cells[0].querySelector('picture');
      logoPicture = cells[1].querySelector('picture');
      headingText = cells[2].textContent;
      subtitleText = cells[3].textContent;
      linkElement = cells[4].querySelector('a');
    }

    // Handle video poster image and video playback
    if (videoPosterPicture) {
      const videoDiv = document.createElement('div');
      videoDiv.classList.add('video-js', 'business-card__video');
      videoDiv.setAttribute('playsinline', 'true');
      videoDiv.setAttribute('loop', 'true');
      videoDiv.setAttribute('muted', 'true');
      videoDiv.setAttribute('preload', 'auto');
      videoDiv.setAttribute('poster', videoPosterPicture.querySelector('img').src);

      const video = document.createElement('video');
      video.classList.add('vjs-tech', 'video-js', 'business-card__video');
      video.setAttribute('playsinline', '');
      video.setAttribute('muted', 'muted');
      video.setAttribute('loop', '');
      video.setAttribute('preload', 'auto');
      video.setAttribute('poster', videoPosterPicture.querySelector('img').src);
      videoDiv.append(video);

      const posterDiv = document.createElement('div');
      posterDiv.classList.add('vjs-poster');
      posterDiv.setAttribute('aria-disabled', 'false');
      posterDiv.setAttribute('tabindex', '-1');

      const optimizedPosterPic = createOptimizedPicture(
        videoPosterPicture.querySelector('img').src,
        videoPosterPicture.querySelector('img').alt,
        false,
        [{ width: '750' }],
      );
      moveInstrumentation(videoPosterPicture.querySelector('img'), optimizedPosterPic.querySelector('img'));
      posterDiv.append(optimizedPosterPic);
      videoDiv.append(posterDiv);

      // Add play/pause functionality
      businessCardItem.addEventListener('mouseenter', () => {
        video.play();
        videoDiv.classList.remove('vjs-paused');
        videoDiv.classList.add('vjs-playing');
      });

      businessCardItem.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0; // Reset video to start
        videoDiv.classList.remove('vjs-playing');
        videoDiv.classList.add('vjs-paused');
      });

      businessCardItemAssets.append(videoDiv);
    }

    // Handle logo
    if (logoPicture) {
      const optimizedLogoPic = createOptimizedPicture(
        logoPicture.querySelector('img').src,
        logoPicture.querySelector('img').alt,
        false,
        [{ width: '210' }],
      );
      moveInstrumentation(logoPicture.querySelector('img'), optimizedLogoPic.querySelector('img'));
      businessCardItemLogo.append(optimizedLogoPic);
    }
    businessCardItemInfo.append(businessCardItemLogo);

    // Handle heading
    if (headingText) {
      const h3 = document.createElement('h3');
      h3.textContent = headingText;
      businessCardItemTitle.append(h3);
    }
    businessCardItemDesc.append(businessCardItemTitle);

    // Handle subtitle
    if (subtitleText) {
      businessCardItemSubtitle.textContent = subtitleText;
      businessCardItemDesc.append(businessCardItemSubtitle);
    }

    // Handle link
    if (linkElement) {
      const newLink = document.createElement('a');
      newLink.href = linkElement.href;
      newLink.textContent = linkElement.textContent;
      newLink.classList.add('button', 'button-primary-white');
      if (linkElement.target) newLink.target = linkElement.target;
      if (linkElement.rel) newLink.rel = linkElement.rel;
      businessCardItemDesc.append(newLink);
    }
    businessCardItemInfo.append(businessCardItemDesc);

    businessCardItem.append(businessCardItemAssets, businessCardItemInfo);
    businessCardContainer.append(businessCardItem);
  });

  gContainer.append(businessCardContainer);
  block.textContent = '';
  block.append(gContainer);

  // Image optimization (this part was already correct)
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
