import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ctaLinkRow, ctaLabelRow, ...tileRows] = [...block.children];

  // Main container
  const containerXl = document.createElement('div');
  containerXl.classList.add('container-xl');
  moveInstrumentation(block, containerXl);

  const container = document.createElement('div');
  container.classList.add('container');
  containerXl.append(container);

  const tileContainer = document.createElement('div');
  tileContainer.classList.add('tile-container');
  container.append(tileContainer);

  // Heading
  if (headingRow) {
    const heading = document.createElement('h3');
    moveInstrumentation(headingRow, heading);
    heading.textContent = headingRow.firstElementChild.textContent.trim();
    tileContainer.append(heading);
  }

  // Separator
  const separator = document.createElement('div');
  separator.classList.add('separator');
  tileContainer.append(separator);

  // Tiles container
  const innerTileContainer = document.createElement('div');
  innerTileContainer.classList.add('tile-container');
  container.append(innerTileContainer);

  const row = document.createElement('div');
  row.classList.add('row', 'tile-slider');
  innerTileContainer.append(row);

  tileRows.forEach((tileRow) => {
    const cells = [...tileRow.children];
    // Content detection for tile-item fields
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const flagTextCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim().length > 0 && cell.nextElementSibling?.textContent.trim().length > 0); // Heuristic: text cell before caption
    const captionCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim().length > 0 && cell.previousElementSibling?.textContent.trim().length > 0); // Heuristic: text cell after flag
    const readMoreLabelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim().toLowerCase() === 'read more');


    const col = document.createElement('div');
    col.classList.add('col-md-6');
    moveInstrumentation(tileRow, col);

    const link = document.createElement('a');
    link.classList.add('tile-block-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }
    col.append(link);

    const tile = document.createElement('div');
    tile.classList.add('tile');
    link.append(tile);

    const tileImage = document.createElement('div');
    tileImage.classList.add('tile-image', 'show-overlay');
    tile.append(tileImage);

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        tileImage.append(optimizedPic);
      }
    }

    const tileOverlay = document.createElement('div');
    tileOverlay.classList.add('tile-overlay');
    tileImage.append(tileOverlay);

    if (flagTextCell?.textContent.trim()) {
      const flag = document.createElement('div');
      // Determine flag class based on content if possible, or use a default from allowlist
      // For now, using bg-secondary-d8-spearmint as a placeholder from original HTML
      flag.classList.add('flag', 'bg-secondary-d8-spearmint');
      const flagText = document.createElement('div');
      flagText.classList.add('text');
      flagText.textContent = flagTextCell.textContent.trim();
      flag.append(flagText);
      tileImage.append(flag);
    }

    if (captionCell?.textContent.trim()) {
      const caption = document.createElement('h4');
      caption.classList.add('tile-caption');
      caption.textContent = captionCell.textContent.trim();
      tile.append(caption);
    }

    if (readMoreLabelCell?.textContent.trim()) {
      const readMore = document.createElement('div');
      readMore.classList.add('read-more');
      readMore.textContent = readMoreLabelCell.textContent.trim();
      tile.append(readMore);
    }

    row.append(col);
  });

  // CTA
  const ctaDiv = document.createElement('div');
  ctaDiv.classList.add('cta');
  container.append(ctaDiv);

  if (ctaLinkRow && ctaLabelRow) {
    const ctaLink = document.createElement('a');
    ctaLink.classList.add('btn', 'transparent', 'border-white');
    const foundCtaLink = ctaLinkRow.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
    }
    // Correctly get the text content for the CTA label
    ctaLink.textContent = ctaLabelRow.firstElementChild.textContent.trim();
    moveInstrumentation(ctaLinkRow, ctaLink);
    moveInstrumentation(ctaLabelRow, ctaLink);
    ctaDiv.append(ctaLink);
  }

  block.textContent = '';
  block.classList.add('pad-top-lg'); // Add section classes from original HTML
  block.append(containerXl);
}
