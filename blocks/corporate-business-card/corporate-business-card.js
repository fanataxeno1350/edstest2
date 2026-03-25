import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const isVideo = (url) => url.endsWith('.mp4') || url.endsWith('.m3u8');

function createVideoElement(src, poster) {
  const video = document.createElement('video');
  video.setAttribute('playsinline', '');
  video.setAttribute('loop', '');
  video.setAttribute('muted', '');
  video.setAttribute('autoplay', '');
  video.setAttribute('preload', 'auto');
  if (poster) {
    video.setAttribute('poster', poster);
  }
  const source = document.createElement('source');
  source.setAttribute('src', src);
  source.setAttribute('type', `video/${src.split('.').pop()}`);
  video.append(source);
  return video;
}

export default function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('g-container');

  const titleElement = block.querySelector('p.business-card-title');
  if (titleElement) {
    container.append(titleElement);
    moveInstrumentation(titleElement, container);
  }

  const hrElement = block.querySelector('hr.business-card-title-hr');
  if (hrElement) {
    container.append(hrElement);
    moveInstrumentation(hrElement, container);
  }

  const businessCardContainer = document.createElement('div');
  businessCardContainer.classList.add('business-card-container');

  const businessCardItems = block.querySelectorAll('[data-aue-model="businessCardItem"]');
  businessCardItems.forEach((itemNode) => {
    const businessCardItem = document.createElement('div');
    businessCardItem.classList.add('business-card-item');

    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    businessCardItem.append(overlay);
    moveInstrumentation(itemNode.querySelector('.overlay'), overlay);

    const assetsDiv = document.createElement('div');
    assetsDiv.classList.add('business-card-item-assets');

    const videoPosterProp = itemNode.querySelector('[data-aue-prop="videoPoster"]');
    const videoPosterUrl = videoPosterProp ? videoPosterProp.textContent.trim() : '';

    const videoLink = itemNode.querySelector('a[href$=".mp4"], a[href$=".m3u8"]');
    if (videoLink) {
      const video = createVideoElement(videoLink.href, videoPosterUrl);
      assetsDiv.append(video);
      moveInstrumentation(videoLink, assetsDiv);
    } else if (videoPosterUrl) {
      const picture = createOptimizedPicture(videoPosterUrl, 'Business Card Item Poster');
      assetsDiv.append(picture);
      if (videoPosterProp) {
        moveInstrumentation(videoPosterProp, assetsDiv);
      }
    }
    businessCardItem.append(assetsDiv);

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('business-card-item-info');

    const logoDiv = document.createElement('div');
    logoDiv.classList.add('business-card-item-logo');
    const logoImg = itemNode.querySelector('[data-aue-prop="logo"] img');
    if (logoImg) {
      const picture = createOptimizedPicture(logoImg.src, logoImg.alt);
      logoDiv.append(picture);
      moveInstrumentation(logoImg, logoDiv);
    }
    infoDiv.append(logoDiv);

    const descDiv = document.createElement('div');
    descDiv.classList.add('business-card-item-desc');

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('business-card-item-title');
    const title = itemNode.querySelector('[data-aue-prop="title"]');
    if (title) {
      titleDiv.append(title);
      moveInstrumentation(title, titleDiv);
    } else {
      const firstP = itemNode.querySelector('p');
      if (firstP) {
        titleDiv.append(firstP);
        moveInstrumentation(firstP, titleDiv);
      }
    }
    descDiv.append(titleDiv);

    const subtitleP = itemNode.querySelector('[data-aue-prop="subtitle"]');
    if (subtitleP) {
      subtitleP.classList.add('business-card-item-subtitle');
      descDiv.append(subtitleP);
      moveInstrumentation(subtitleP, descDiv);
    }

    const link = itemNode.querySelector('[data-aue-prop="link"] a');
    if (link) {
      link.classList.add('button', 'button-primary-white');
      descDiv.append(link);
      moveInstrumentation(link, descDiv);
    }

    infoDiv.append(descDiv);
    businessCardItem.append(infoDiv);

    businessCardContainer.append(businessCardItem);
    moveInstrumentation(itemNode, businessCardItem);
  });

  container.append(businessCardContainer);

  block.textContent = '';
  block.append(container);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
