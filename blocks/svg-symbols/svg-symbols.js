import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const svg = document.createElement('svg');

  // The original HTML contains a series of <symbol> elements directly inside <svg>.
  // We need to extract these symbols from the original HTML and append them to the
  // newly created SVG element.
  const parser = new DOMParser();
  const doc = parser.parseFromString(block.innerHTML, 'image/svg+xml');
  const symbols = doc.querySelectorAll('symbol');
  symbols.forEach((symbol) => {
    svg.append(symbol);
  });

  block.textContent = '';
  block.append(svg);
}

