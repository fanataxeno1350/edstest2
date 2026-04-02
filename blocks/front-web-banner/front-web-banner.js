import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const containerFluid = document.createElement('div');
  containerFluid.classList.add('container-fluid', 'advanced-widget-row-no-pad');
  containerFluid.id = 'front-web-banner-wrapper';

  const rowPad = document.createElement('div');
  rowPad.classList.add('row', 'row-pad', 'container-fluid');
  rowPad.id = 'content-front-web-banner';
  rowPad.style.padding = '0px 0 0px 0';

  const colMd12 = document.createElement('div');
  colMd12.classList.add('col-md-12');

  const frontWebBannerDiv = document.createElement('div');
  frontWebBannerDiv.id = 'front-web-banner';

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('text-align-center');
  contentWrapper.id = 'front-web-banner-content-wrapper';

  const captionDiv = document.createElement('div');
  captionDiv.id = 'front-web-banner-content-caption';

  [...block.children].forEach((row) => {
    let headingEl;
    let videoSrc = '';
    let posterSrc = '';

    const cells = [...row.children];

    // Find heading cell
    const headingCell = cells.find(cell => cell.querySelector('p'));
    if (headingCell) {
      headingEl = headingCell.querySelector('p');
    }

    // Find video and poster cells
    const pictureCells = cells.filter(cell => cell.querySelector('picture'));
    pictureCells.forEach(cell => {
      const img = cell.querySelector('img');
      if (img) {
        if (img.alt === 'Video') {
          videoSrc = img.src;
        } else if (img.alt === 'Poster') {
          posterSrc = img.src;
        }
      }
    });

    if (headingEl) {
      const h2 = document.createElement('h2');
      h2.id = 'front-web-banner-content';
      moveInstrumentation(headingEl, h2);
      while (headingEl.firstChild) h2.append(headingEl.firstChild);
      captionDiv.append(h2);
    }

    if (videoSrc || posterSrc) {
      const video = document.createElement('video');
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.preload = 'metadata';
      if (posterSrc) {
        video.poster = posterSrc;
      }
      if (videoSrc) {
        const source = document.createElement('source');
        source.src = videoSrc;
        source.type = 'video/mp4'; // Assuming mp4 based on example
        video.append(source);
      }
      frontWebBannerDiv.append(video);
    }
  });

  contentWrapper.append(captionDiv);
  frontWebBannerDiv.prepend(contentWrapper); // Prepend so content is above video

  colMd12.append(frontWebBannerDiv);
  rowPad.append(colMd12);
  containerFluid.append(rowPad);

  block.textContent = '';
  block.append(containerFluid);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
