import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const prevLabel = block.querySelector('[data-aue-prop="prevLabel"]');
  const nextLabel = block.querySelector('[data-aue-prop="nextLabel"]');

  block.textContent = '';

  const prevButton = document.createElement('button');
  prevButton.className = 'button-carousel-control-prev';
  prevButton.type = 'button';
  prevButton.dataset.target = '#carousel';
  prevButton.dataset.slide = 'prev';

  const prevIconSpan = document.createElement('span');
  prevIconSpan.className = 'button-carousel-control-prev-icon';
  prevIconSpan.setAttribute('aria-hidden', 'true');
  prevButton.append(prevIconSpan);

  const prevSrOnlySpan = document.createElement('span');
  prevSrOnlySpan.className = 'button-sr-only';
  if (prevLabel) {
    prevSrOnlySpan.append(prevLabel);
    moveInstrumentation(prevLabel, prevSrOnlySpan);
  } else {
    prevSrOnlySpan.textContent = 'Previous';
  }
  prevButton.append(prevSrOnlySpan);

  block.append(prevButton);
  moveInstrumentation(prevLabel, prevButton);

  const nextButton = document.createElement('button');
  nextButton.className = 'button-carousel-control-next';
  nextButton.type = 'button';
  nextButton.dataset.target = '#carousel';
  nextButton.dataset.slide = 'next';

  const nextIconSpan = document.createElement('span');
  nextIconSpan.className = 'button-carousel-control-next-icon';
  nextIconSpan.setAttribute('aria-hidden', 'true');
  nextButton.append(nextIconSpan);

  const nextSrOnlySpan = document.createElement('span');
  nextSrOnlySpan.className = 'button-sr-only';
  if (nextLabel) {
    nextSrOnlySpan.append(nextLabel);
    moveInstrumentation(nextLabel, nextSrOnlySpan);
  } else {
    nextSrOnlySpan.textContent = 'Next';
  }
  nextButton.append(nextSrOnlySpan);

  block.append(nextButton);
  moveInstrumentation(nextLabel, nextButton);

  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
