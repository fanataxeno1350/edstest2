import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const appId = block.dataset.appId || '109052'; // Default or get from block.dataset if available
  const appIdentifier = block.dataset.appIdentifier || '109052'; // Default or get from block.dataset if available

  block.id = `pubble_app_${appId}`;
  block.classList.add('pubble-app');
  block.setAttribute('data-app-id', appId);
  block.setAttribute('data-app-identifier', appIdentifier);
  block.setAttribute('data-app-loaded', 'true');

  const iframe = document.createElement('iframe');
  iframe.title = 'Livechat widget frame';
  iframe.classList.add('pubble-iframe');
  iframe.style.cssText = 'border: none; display: block;  position: fixed; top: auto;  bottom: 0px; visibility: visible; z-index: 2147483647; max-height: 100vh; max-width: 100vw; transition: none 0s ease 0s; background: none transparent; opacity: 1;left: auto; right: 0px;height: 330px !important; width: 330px !important;';
  iframe.id = 'pubble-livechat-iframe';
  iframe.setAttribute('aria-label', 'Live chat - techatom');

  block.textContent = '';
  block.append(iframe);
}
