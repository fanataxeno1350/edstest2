import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, ...itemRows] = [...block.children];

  const gContainer = document.createElement('div');
  gContainer.classList.add('g-container');

  const titleP = document.createElement('p');
  moveInstrumentation(titleRow.firstElementChild, titleP);
  titleP.classList.add('business-card-title');
  titleP.append(...titleRow.firstElementChild.childNodes);
  gContainer.append(titleP);

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

    [...row.children].forEach((cell, index) => {
      if (index === 0) { // business-card-item-assets
        const picture = cell.querySelector('picture');
        const videoContainer = cell.querySelector('div[playsinline="true"]');
        if (picture) {
          businessCardItemAssets.append(picture);
        } else if (videoContainer) {
          // Handle video element if present
          businessCardItemAssets.append(videoContainer);
          const video = videoContainer.querySelector('video');
          const bigPlayButton = videoContainer.querySelector('.vjs-big-play-button');
          const playPauseButton = videoContainer.querySelector('.vjs-play-control');

          if (video) {
            // Add click listener to the entire item to play/pause video
            businessCardItem.addEventListener('click', () => {
              if (video.paused) {
                video.play();
                videoContainer.classList.remove('vjs-paused');
                videoContainer.classList.add('vjs-playing');
                if (bigPlayButton) bigPlayButton.style.display = 'none';
                if (playPauseButton) playPauseButton.title = 'Pause';
              } else {
                video.pause();
                videoContainer.classList.remove('vjs-playing');
                videoContainer.classList.add('vjs-paused');
                if (bigPlayButton) bigPlayButton.style.display = 'block';
                if (playPauseButton) playPauseButton.title = 'Play';
              }
            });

            // Handle video ending to reset state
            video.addEventListener('ended', () => {
              videoContainer.classList.remove('vjs-playing');
              videoContainer.classList.add('vjs-paused');
              if (bigPlayButton) bigPlayButton.style.display = 'block';
              if (playPauseButton) playPauseButton.title = 'Play';
            });
          }
        }
      } else if (index === 1) { // business-card-item-logo
        const picture = cell.querySelector('picture');
        if (picture) {
          businessCardItemLogo.append(picture);
        }
      } else if (index === 2) { // business-card-item-title
        const titleDiv = document.createElement('div');
        titleDiv.classList.add('business-card-item-title');
        moveInstrumentation(cell, titleDiv);
        const h3 = document.createElement('h3');
        h3.append(...cell.childNodes);
        titleDiv.append(h3);
        businessCardItemDesc.append(titleDiv);
      } else if (index === 3) { // business-card-item-subtitle
        const subtitleP = document.createElement('p');
        subtitleP.classList.add('business-card-item-subtitle');
        moveInstrumentation(cell, subtitleP);
        subtitleP.append(...cell.childNodes);
        businessCardItemDesc.append(subtitleP);
      } else if (index === 4) { // business-card-item-link
        const link = cell.querySelector('a');
        if (link) {
          const button = document.createElement('a');
          button.classList.add('button', 'button-primary-white');
          button.href = link.href;
          button.textContent = link.textContent;
          if (link.target) button.target = link.target;
          if (link.rel) button.rel = link.rel;
          moveInstrumentation(cell, button);
          businessCardItemDesc.append(button);
        }
      }
    });

    businessCardItem.append(businessCardItemAssets);
    businessCardItemInfo.append(businessCardItemLogo, businessCardItemDesc);
    businessCardItem.append(businessCardItemInfo);
    businessCardContainer.append(businessCardItem);
  });

  gContainer.append(businessCardContainer);

  block.textContent = '';
  block.append(gContainer);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
