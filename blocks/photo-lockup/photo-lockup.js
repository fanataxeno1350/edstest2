import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, bodyRow, linkRow] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('component-photo-lockup', 'bg-light-gray', 'pad-top-lg');

  const container = document.createElement('div');
  container.classList.add('container');

  const wrapper = document.createElement('div');
  wrapper.classList.add('wrapper', 'block-left');
  // Original HTML has inline style for background-image, which EDS does not support directly.
  // Assuming the background image is handled by CSS or a different mechanism.
  // For now, we'll omit setting the style directly in JS.

  const accent = document.createElement('div');
  accent.classList.add('accent');

  const layer1 = document.createElement('div');
  layer1.classList.add('layer', 'layer1', 'bg-secondary-d7-violet');
  accent.append(layer1);

  const layer2 = document.createElement('div');
  layer2.classList.add('layer', 'layer2', 'bg-secondary-d7-violet');
  accent.append(layer2);

  const layer3 = document.createElement('div');
  layer3.classList.add('layer', 'layer3', 'bg-secondary-d7-violet');
  accent.append(layer3);

  const wrapperMobile = document.createElement('div');
  wrapperMobile.classList.add('wrapper-mobile');
  // Original HTML has inline style for background-image, which EDS does not support directly.
  // Assuming the background image is handled by CSS or a different mechanism.
  // For now, we'll omit setting the style directly in JS.

  const innerContainer = document.createElement('div');
  innerContainer.classList.add('container');

  const row = document.createElement('div');
  row.classList.add('row');

  const blockText = document.createElement('div');
  blockText.classList.add('block-text', 'col-md-12', 'col-lg-6', 'offset-lg-1');
  // Original HTML has this div empty, so we'll leave it empty as well.

  const blockWrapper = document.createElement('div');
  blockWrapper.classList.add('block-wrapper', 'col-md-12', 'col-lg-5', 'offset-lg-1');

  // Heading
  const headingEl = document.createElement('h3');
  moveInstrumentation(headingRow.firstElementChild, headingEl);
  while (headingRow.firstElementChild.firstChild) {
    headingEl.append(headingRow.firstElementChild.firstChild);
  }
  blockWrapper.append(headingEl);

  const separator = document.createElement('div');
  separator.classList.add('separator');
  blockWrapper.append(separator);

  // Body
  const tileBody = document.createElement('div');
  tileBody.classList.add('tile-body');
  moveInstrumentation(bodyRow.firstElementChild, tileBody);
  while (bodyRow.firstElementChild.firstChild) {
    tileBody.append(bodyRow.firstElementChild.firstChild);
  }
  blockWrapper.append(tileBody);

  // Link
  const cta = document.createElement('div');
  cta.classList.add('cta');
  const link = linkRow.querySelector('a');
  if (link) {
    const linkEl = document.createElement('a');
    linkEl.href = link.href;
    linkEl.classList.add('btn', 'bg-secondary-d7-violet');
    moveInstrumentation(link, linkEl);
    linkEl.textContent = link.textContent;
    cta.append(linkEl);
  }
  blockWrapper.append(cta);

  row.append(blockText, blockWrapper);
  innerContainer.append(row);
  wrapper.append(accent, wrapperMobile, innerContainer);
  container.append(wrapper);
  section.append(container);

  block.textContent = '';
  block.append(section);
}
