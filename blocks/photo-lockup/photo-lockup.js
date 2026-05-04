import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CRITICAL FIX: Replaced direct index access with content detection for root fields.
  // This makes the block more robust to content editor changes.
  const cells = [...block.children];

  const backgroundImageCell = cells.find(cell => cell.querySelector('picture'));
  const headingCell = cells.find(cell => !cell.querySelector('picture') && cell.textContent.trim() !== '' && !cell.querySelector('a'));
  const descriptionCell = cells.find(cell => !cell.querySelector('picture') && cell.innerHTML.includes('<p>') && !cell.querySelector('a'));
  const ctaLinkCell = cells.find(cell => cell.querySelector('a') && cell.querySelector('a').href.includes('/content/')); // aem-content type
  const ctaLabelCell = cells.find(cell => !cell.querySelector('picture') && cell.textContent.trim() !== '' && !cell.querySelector('a') && cell !== headingCell);


  const section = document.createElement('section');
  section.classList.add('component-photo-lockup', 'bg-light-gray', 'pad-top-lg');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');
  section.appendChild(container);

  const wrapper = document.createElement('div');
  wrapper.classList.add('wrapper', 'block-left');
  container.appendChild(wrapper);

  if (backgroundImageCell) {
    const picture = backgroundImageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        moveInstrumentation(img, optimizedImg);
        wrapper.style.backgroundImage = `url("${optimizedImg.src}")`;
        // The original HTML has a wrapper-mobile div with the same background image.
        // Replicate this behavior.
        const wrapperMobile = document.createElement('div');
        wrapperMobile.classList.add('wrapper-mobile');
        wrapperMobile.style.backgroundImage = `url("${optimizedImg.src}")`;
        wrapper.appendChild(wrapperMobile);
      }
    }
  }

  const accent = document.createElement('div');
  accent.classList.add('accent');
  wrapper.appendChild(accent);

  const layer1 = document.createElement('div');
  layer1.classList.add('layer', 'layer1', 'bg-secondary-d7-violet');
  accent.appendChild(layer1);

  const layer2 = document.createElement('div');
  layer2.classList.add('layer', 'layer2', 'bg-secondary-d7-violet');
  accent.appendChild(layer2);

  const layer3 = document.createElement('div');
  layer3.classList.add('layer', 'layer3', 'bg-secondary-d7-violet');
  accent.appendChild(layer3);

  const innerContainer = document.createElement('div');
  innerContainer.classList.add('container');
  wrapper.appendChild(innerContainer);

  const row = document.createElement('div');
  row.classList.add('row');
  innerContainer.appendChild(row);

  const blockText = document.createElement('div');
  blockText.classList.add('block-text', 'col-md-12', 'col-lg-6', 'offset-lg-1');
  row.appendChild(blockText);

  const blockWrapper = document.createElement('div');
  blockWrapper.classList.add('block-wrapper', 'col-md-12', 'col-lg-5', 'offset-lg-1');
  row.appendChild(blockWrapper);

  // Heading
  if (headingCell) {
    const h3 = document.createElement('h3');
    h3.textContent = headingCell.textContent.trim();
    blockWrapper.appendChild(h3);
  }

  const separator = document.createElement('div');
  separator.classList.add('separator');
  blockWrapper.appendChild(separator);

  // Description (richtext)
  if (descriptionCell) {
    const tileBody = document.createElement('div');
    tileBody.classList.add('tile-body');
    const descriptionContent = document.createElement('div');
    moveInstrumentation(descriptionCell, descriptionContent);
    // Use innerHTML for richtext content
    descriptionContent.innerHTML = descriptionCell.innerHTML;
    tileBody.appendChild(descriptionContent);
    blockWrapper.appendChild(tileBody);
  }

  // CTA Link and Label
  if (ctaLinkCell && ctaLabelCell) {
    const cta = document.createElement('div');
    cta.classList.add('cta');
    const ctaAnchor = document.createElement('a');
    const foundLink = ctaLinkCell.querySelector('a');
    if (foundLink) {
      // CRITICAL FIX: Use foundLink.href directly for aem-content type
      ctaAnchor.href = foundLink.href;
    }
    ctaAnchor.classList.add('btn', 'bg-secondary-d7-violet');
    ctaAnchor.textContent = ctaLabelCell.textContent.trim();
    moveInstrumentation(ctaLinkCell, ctaAnchor);
    cta.appendChild(ctaAnchor);
    blockWrapper.appendChild(cta);
  }

  block.replaceWith(section);
}
