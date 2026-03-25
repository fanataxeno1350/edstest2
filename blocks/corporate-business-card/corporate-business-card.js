import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const gContainer = document.createElement('div');
  gContainer.classList.add('corporate-business-card-g-container');

  const titleElement = block.querySelector('p.corporate-business-card-business-card-title');
  if (titleElement) {
    gContainer.append(titleElement);
    moveInstrumentation(titleElement, gContainer);
  }

  const hrElement = block.querySelector('hr.corporate-business-card-business-card-title-hr');
  if (hrElement) {
    gContainer.append(hrElement);
    moveInstrumentation(hrElement, gContainer);
  }

  const businessCardContainer = document.createElement('div');
  businessCardContainer.classList.add('corporate-business-card-business-card-container');

  const businessCardItems = block.querySelectorAll('[data-aue-model="corporateBusinessCardItem"]');
  businessCardItems.forEach((itemNode) => {
    const itemWrapper = document.createElement('div');
    itemWrapper.classList.add('corporate-business-card-business-card-item');

    const overlay = document.createElement('div');
    overlay.classList.add('corporate-business-card-overlay');
    itemWrapper.append(overlay);

    const assetsDiv = document.createElement('div');
    assetsDiv.classList.add('corporate-business-card-business-card-item-assets');

    const videoPoster = itemNode.querySelector('[data-aue-prop="videoPoster"]');
    if (videoPoster) {
      const picture = createOptimizedPicture(videoPoster.src, videoPoster.alt);
      assetsDiv.append(picture);
      moveInstrumentation(videoPoster, picture);
    } else {
      const videoElement = itemNode.querySelector('div[id^="video-"]');
      if (videoElement) {
        const posterImg = videoElement.querySelector('picture img');
        if (posterImg) {
          const picture = createOptimizedPicture(posterImg.src, posterImg.alt);
          assetsDiv.append(picture);
          moveInstrumentation(posterImg, picture);
        }
        moveInstrumentation(videoElement, assetsDiv);
      }
    }
    itemWrapper.append(assetsDiv);

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('corporate-business-card-business-card-item-info');

    const logoDiv = document.createElement('div');
    logoDiv.classList.add('corporate-business-card-business-card-item-logo');
    const logoImg = itemNode.querySelector('[data-aue-prop="logo"]');
    if (logoImg) {
      const picture = createOptimizedPicture(logoImg.src, logoImg.alt);
      logoDiv.append(picture);
      moveInstrumentation(logoImg, picture);
    } else {
      const oldLogoPicture = itemNode.querySelector('.corporate-business-card-business-card-item-logo picture');
      if (oldLogoPicture) {
        logoDiv.append(oldLogoPicture);
        moveInstrumentation(oldLogoPicture, logoDiv);
      }
    }
    infoDiv.append(logoDiv);

    const descDiv = document.createElement('div');
    descDiv.classList.add('corporate-business-card-business-card-item-desc');

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('corporate-business-card-business-card-item-title');
    const title = itemNode.querySelector('[data-aue-prop="title"]');
    if (title) {
      titleDiv.append(title);
      moveInstrumentation(title, titleDiv);
    } else {
      const oldTitle = itemNode.querySelector('.corporate-business-card-business-card-item-title h3');
      if (oldTitle) {
        titleDiv.append(oldTitle);
        moveInstrumentation(oldTitle, titleDiv);
      }
    }
    descDiv.append(titleDiv);

    const subtitle = itemNode.querySelector('[data-aue-prop="subtitle"]');
    if (subtitle) {
      subtitle.classList.add('corporate-business-card-business-card-item-subtitle');
      descDiv.append(subtitle);
      moveInstrumentation(subtitle, descDiv);
    } else {
      const oldSubtitle = itemNode.querySelector('p.corporate-business-card-business-card-item-subtitle');
      if (oldSubtitle) {
        descDiv.append(oldSubtitle);
        moveInstrumentation(oldSubtitle, descDiv);
      }
    }

    const ctaLink = itemNode.querySelector('[data-aue-prop="ctaLink"]');
    if (ctaLink) {
      ctaLink.classList.add('corporate-business-card-button', 'corporate-business-card-button-primary-white');
      descDiv.append(ctaLink);
      moveInstrumentation(ctaLink, descDiv);
    } else {
      const oldCtaLink = itemNode.querySelector('a.corporate-business-card-button');
      if (oldCtaLink) {
        descDiv.append(oldCtaLink);
        moveInstrumentation(oldCtaLink, descDiv);
      }
    }

    infoDiv.append(descDiv);
    itemWrapper.append(infoDiv);

    businessCardContainer.append(itemWrapper);
    moveInstrumentation(itemNode, itemWrapper);
  });

  gContainer.append(businessCardContainer);

  block.textContent = '';
  block.append(gContainer);
  block.className = 'corporate-business-card block';
  block.dataset.blockStatus = 'loaded';
}
