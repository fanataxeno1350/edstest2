import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('media-inner-video-media-inner-video');

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    moveInstrumentation(row, item);
    item.classList.add('media-inner-video-media-cmp-media');
    while (row.firstElementChild) item.append(row.firstElementChild);
    [...item.children].forEach((div) => {
      if (div.querySelector('video') || div.querySelector('a[href$=".mp4"]')) {
        div.className = 'media-inner-video-media-video';
      } else {
        div.classList.add('media-inner-video-media-viewport-video', 'media-inner-video-media-cmp-media__background', 'media-inner-video-media-cmp-media__wrapper');
      }
    });
    wrapper.append(item);
  });

  block.textContent = '';
  block.append(wrapper);
}
