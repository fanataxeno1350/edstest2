import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, ...itemRows] = [...block.children];

  // Business Card Title
  const gContainer = document.createElement('div');
  gContainer.classList.add('g-container');

  const titleP = document.createElement('p');
  titleP.classList.add('business-card-title');
  moveInstrumentation(titleRow.firstElementChild, titleP);
  titleP.append(titleRow.firstElementChild.textContent.trim());
  gContainer.append(titleP);

  const hr = document.createElement('hr');
  hr.classList.add('business-card-title-hr');
  gContainer.append(hr);

  // Business Card Items
  const businessCardContainer = document.createElement('div');
  businessCardContainer.classList.add('business-card-container');

  itemRows.forEach((row) => {
    const businessCardItem = document.createElement('div');
    businessCardItem.classList.add('business-card-item');
    moveInstrumentation(row, businessCardItem);

    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    businessCardItem.append(overlay);

    const businessCardItemAssets = document.createElement('div');
    businessCardItemAssets.classList.add('business-card-item-assets');
    businessCardItem.append(businessCardItemAssets);

    const videoJsDiv = document.createElement('div');
    videoJsDiv.classList.add('video-js', 'business-card__video', 'vjs-paused', 'vjs-fill', 'vjs-controls-disabled', 'vjs-workinghover', 'vjs-v8', 'vjs-user-active', 'vjs-error');
    videoJsDiv.setAttribute('playsinline', 'true');
    videoJsDiv.setAttribute('loop', 'true');
    videoJsDiv.setAttribute('muted', 'true');
    videoJsDiv.setAttribute('preload', 'auto');
    videoJsDiv.setAttribute('tabindex', '-1');
    videoJsDiv.setAttribute('role', 'region');
    videoJsDiv.setAttribute('lang', 'en');
    videoJsDiv.setAttribute('translate', 'no');
    videoJsDiv.setAttribute('aria-label', 'Video Player');

    const videoEl = document.createElement('video');
    videoEl.classList.add('vjs-tech', 'video-js', 'business-card__video');
    videoEl.setAttribute('playsinline', '');
    videoEl.setAttribute('tabindex', '-1');
    videoEl.setAttribute('role', 'application');
    videoEl.setAttribute('preload', 'auto');
    videoEl.setAttribute('muted', 'muted');
    videoEl.setAttribute('loop', '');

    const cells = [...row.children];
    // Use content detection instead of index access
    const deskPosterCell = cells.find((cell) => cell.querySelector('picture') && cell.textContent.includes('Desk Poster Image') === false); // Assuming first picture is desk poster
    const mobilePosterCell = cells.find((cell) => cell.querySelector('picture') && cell !== deskPosterCell); // Assuming second picture is mobile poster
    const logoCell = cells.find((cell) => cell.querySelector('picture') && cell !== deskPosterCell && cell !== mobilePosterCell); // Assuming third picture is logo
    const itemTitleCell = cells.find((cell) => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim().length > 0); // First text cell
    const itemSubtitleCell = cells.find((cell) => !cell.querySelector('picture') && !cell.querySelector('a') && cell !== itemTitleCell && cell.textContent.trim().length > 0); // Second text cell
    const ctaLinkCell = cells.find((cell) => cell.querySelector('a'));

    const deskPosterPic = deskPosterCell?.querySelector('picture');
    const mobilePosterPic = mobilePosterCell?.querySelector('picture');

    if (deskPosterPic) {
      const img = deskPosterPic.querySelector('img');
      videoJsDiv.setAttribute('data-desk-poster', img?.src || '');
      videoEl.setAttribute('poster', img?.src || '');
      videoEl.setAttribute('data-desk-poster', img?.src || '');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const posterDiv = document.createElement('div');
      posterDiv.classList.add('vjs-poster');
      posterDiv.setAttribute('aria-disabled', 'false');
      posterDiv.setAttribute('tabindex', '-1');
      posterDiv.append(optimizedPic);
      videoJsDiv.append(posterDiv);
    }
    if (mobilePosterPic) {
      const img = mobilePosterPic.querySelector('img');
      videoJsDiv.setAttribute('data-mob-poster', img?.src || '');
      videoEl.setAttribute('data-mob-poster', img?.src || '');
    }

    videoJsDiv.append(videoEl);
    businessCardItemAssets.append(videoJsDiv);

    const businessCardItemInfo = document.createElement('div');
    businessCardItemInfo.classList.add('business-card-item-info');
    businessCardItem.append(businessCardItemInfo);

    const businessCardItemLogo = document.createElement('div');
    businessCardItemLogo.classList.add('business-card-item-logo');
    const logoPicture = logoCell?.querySelector('picture');
    if (logoPicture) {
      const img = logoPicture.querySelector('img');
      const optimizedLogoPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(logoPicture, optimizedLogoPic.querySelector('img'));
      businessCardItemLogo.append(optimizedLogoPic);
    }
    businessCardItemInfo.append(businessCardItemLogo);

    const businessCardItemDesc = document.createElement('div');
    businessCardItemDesc.classList.add('business-card-item-desc');
    businessCardItemInfo.append(businessCardItemDesc);

    const itemTitleDiv = document.createElement('div');
    itemTitleDiv.classList.add('business-card-item-title');
    const h3 = document.createElement('h3');
    if (itemTitleCell) {
      moveInstrumentation(itemTitleCell.firstElementChild, h3);
      h3.textContent = itemTitleCell.textContent.trim();
    }
    itemTitleDiv.append(h3);
    businessCardItemDesc.append(itemTitleDiv);

    const itemSubtitleP = document.createElement('p');
    itemSubtitleP.classList.add('business-card-item-subtitle');
    if (itemSubtitleCell) {
      moveInstrumentation(itemSubtitleCell.firstElementChild, itemSubtitleP);
      itemSubtitleP.textContent = itemSubtitleCell.textContent.trim();
    }
    businessCardItemDesc.append(itemSubtitleP);

    const ctaLink = ctaLinkCell?.querySelector('a');
    if (ctaLink) {
      const newCtaLink = document.createElement('a');
      newCtaLink.classList.add('button', 'button-primary-white');
      newCtaLink.href = ctaLink.href;
      newCtaLink.textContent = ctaLink.textContent.trim();
      newCtaLink.target = '_blank';
      newCtaLink.rel = 'noopener noreferrer';
      moveInstrumentation(ctaLink, newCtaLink);
      businessCardItemDesc.append(newCtaLink);
    }

    businessCardContainer.append(businessCardItem);

    // Interactivity: Video play/pause on hover/click
    const playPauseVideo = () => {
      if (videoEl.paused) {
        videoEl.play();
        videoJsDiv.classList.remove('vjs-paused');
        videoJsDiv.classList.add('vjs-playing');
      } else {
        videoEl.pause();
        videoJsDiv.classList.remove('vjs-playing');
        videoJsDiv.classList.add('vjs-paused');
      }
    };

    // Add event listeners for hover/click to play/pause video
    businessCardItem.addEventListener('mouseenter', () => {
      if (videoEl.paused) {
        videoEl.play();
        videoJsDiv.classList.remove('vjs-paused');
        videoJsDiv.classList.add('vjs-playing');
      }
    });

    businessCardItem.addEventListener('mouseleave', () => {
      if (!videoEl.paused) {
        videoEl.pause();
        videoJsDiv.classList.remove('vjs-playing');
        videoJsDiv.classList.add('vjs-paused');
      }
    });

    // Click on the overlay to toggle play/pause
    overlay.addEventListener('click', playPauseVideo);
    videoJsDiv.addEventListener('click', playPauseVideo); // Also allow clicking on the video itself
  });

  gContainer.append(businessCardContainer);
  block.textContent = '';
  block.append(gContainer);

  // This part seems to be a generic optimization for all images in the block,
  // not specific to the business card items. Keeping it as is.
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
