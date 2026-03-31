import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [businessCardTitleRow, ...itemRows] = [...block.children];

  const gContainer = document.createElement('div');
  gContainer.classList.add('g-container');

  const businessCardTitle = document.createElement('p');
  moveInstrumentation(businessCardTitleRow.firstElementChild, businessCardTitle);
  businessCardTitle.classList.add('business-card-title');
  businessCardTitle.append(...businessCardTitleRow.firstElementChild.children);
  gContainer.append(businessCardTitle);

  const hr = document.createElement('hr');
  hr.classList.add('business-card-title-hr');
  gContainer.append(hr);

  const businessCardContainer = document.createElement('div');
  businessCardContainer.classList.add('business-card-container');

  itemRows.forEach((row) => {
    const businessCardItem = document.createElement('div');
    moveInstrumentation(row, businessCardItem);
    businessCardItem.classList.add('business-card-item');

    const [videoPosterCell, logoCell, titleCell, subtitleCell, linkCell] = [...row.children];

    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    businessCardItem.append(overlay);

    const businessCardItemAssets = document.createElement('div');
    businessCardItemAssets.classList.add('business-card-item-assets');

    // Video Poster
    const videoContainer = document.createElement('div');
    // Corrected class names for videoContainer
    videoContainer.classList.add('video-js', 'business-card__video');
    const picture = videoPosterCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        videoContainer.append(optimizedPic);
      }
    }
    businessCardItemAssets.append(videoContainer);
    businessCardItem.append(businessCardItemAssets);

    const businessCardItemInfo = document.createElement('div');
    businessCardItemInfo.classList.add('business-card-item-info');

    const businessCardItemLogo = document.createElement('div');
    businessCardItemLogo.classList.add('business-card-item-logo');
    const logoPicture = logoCell.querySelector('picture');
    if (logoPicture) {
      const logoImg = logoPicture.querySelector('img');
      if (logoImg) {
        const optimizedLogoPic = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '750' }]);
        moveInstrumentation(logoImg, optimizedLogoPic.querySelector('img'));
        businessCardItemLogo.append(optimizedLogoPic);
      }
    }
    businessCardItemInfo.append(businessCardItemLogo);

    const businessCardItemDesc = document.createElement('div');
    businessCardItemDesc.classList.add('business-card-item-desc');

    const businessCardItemTitle = document.createElement('div');
    businessCardItemTitle.classList.add('business-card-item-title');
    moveInstrumentation(titleCell, businessCardItemTitle);
    businessCardItemTitle.append(...titleCell.children);
    businessCardItemDesc.append(businessCardItemTitle);

    const businessCardItemSubtitle = document.createElement('p');
    businessCardItemSubtitle.classList.add('business-card-item-subtitle');
    moveInstrumentation(subtitleCell, businessCardItemSubtitle);
    businessCardItemSubtitle.append(...subtitleCell.children);
    businessCardItemDesc.append(businessCardItemSubtitle);

    const link = linkCell.querySelector('a');
    if (link) {
      const buttonLink = document.createElement('a');
      moveInstrumentation(link, buttonLink);
      buttonLink.href = link.href;
      // Corrected class names for buttonLink
      buttonLink.classList.add('button', 'button-primary-white');
      buttonLink.textContent = link.textContent;
      businessCardItemDesc.append(buttonLink);
    }

    businessCardItemInfo.append(businessCardItemDesc);
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
