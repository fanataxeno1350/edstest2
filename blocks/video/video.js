import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const videoCmpVideo = document.createElement('div');
  videoCmpVideo.classList.add('video-cmp-video');

  const youtubeWrapper = document.createElement('div');
  youtubeWrapper.classList.add('video-cmp-video__youtube-wrapper');
  youtubeWrapper.style.minHeight = '200px';

  const iframeWrapper = document.createElement('div');
  iframeWrapper.classList.add('video-cmp-video__iframe-wrapper');

  const iframe = block.querySelector('iframe[data-aue-prop="src"]') || block.querySelector('a[href*="youtube.com/embed/"]');

  if (iframe) {
    if (iframe.tagName === 'A') {
      const link = iframe;
      const src = link.href;
      const title = link.textContent || 'Video';
      const newIframe = document.createElement('iframe');
      newIframe.setAttribute('src', src);
      newIframe.setAttribute('title', title);
      newIframe.setAttribute('frameborder', '0');
      newIframe.setAttribute('allowfullscreen', '');
      newIframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      newIframe.setAttribute('loading', 'lazy');
      newIframe.classList.add('video-cmp-video__iframe');
      iframeWrapper.append(newIframe);
      moveInstrumentation(link, newIframe);
    } else {
      iframe.classList.add('video-cmp-video__iframe');
      iframeWrapper.append(iframe);
    }
  }

  youtubeWrapper.append(iframeWrapper);
  videoCmpVideo.append(youtubeWrapper);

  block.textContent = '';
  block.append(videoCmpVideo);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
