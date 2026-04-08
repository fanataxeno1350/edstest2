import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ctaLinkRow, ...tileRows] = [...block.children];

  block.classList.add('pad-top-lg');

  const containerXl = document.createElement('div');
  containerXl.classList.add('container-xl');

  const container = document.createElement('div');
  container.classList.add('container');
  containerXl.append(container);

  const tileContainerWrapper = document.createElement('div');
  tileContainerWrapper.classList.add('tile-container');
  container.append(tileContainerWrapper);

  // Heading
  const heading = document.createElement('h3');
  moveInstrumentation(headingRow, heading);
  while (headingRow.firstChild) heading.append(headingRow.firstChild);
  tileContainerWrapper.append(heading);

  // Separator
  const separator = document.createElement('div');
  separator.classList.add('separator');
  tileContainerWrapper.append(separator);

  const tileContainer = document.createElement('div');
  tileContainer.classList.add('tile-container');
  tileContainerWrapper.append(tileContainer);

  const row = document.createElement('div');
  row.classList.add('row', 'tile-slider');
  tileContainer.append(row);

  tileRows.forEach((tileRow) => {
    const col = document.createElement('div');
    col.classList.add('col-md-6');
    moveInstrumentation(tileRow, col);

    const linkEl = tileRow.querySelector('a');
    const tileBlockLink = document.createElement('a');
    tileBlockLink.classList.add('tile-block-link');
    if (linkEl) {
      tileBlockLink.href = linkEl.href;
      moveInstrumentation(linkEl, tileBlockLink);
    }

    const tile = document.createElement('div');
    tile.classList.add('tile');
    tileBlockLink.append(tile);

    let imageCell;
    let flagCell;
    let titleCell;
    let linkCell;

    // Use content detection to identify cells
    const cells = [...tileRow.children];
    imageCell = cells.find((cell) => cell.querySelector('picture'));
    linkCell = cells.find((cell) => cell.querySelector('a'));
    // Find flag and title cells, assuming flag comes before title and both are text-only
    const textCells = cells.filter(
      (cell) => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim() !== '',
    );
    if (textCells.length > 0) {
      flagCell = textCells[0];
    }
    if (textCells.length > 1) {
      titleCell = textCells[1];
    }

    if (imageCell) {
      const tileImage = document.createElement('div');
      tileImage.classList.add('tile-image', 'show-overlay');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          picture.replaceWith(optimizedPic);
          tileImage.append(optimizedPic);
        }
      }
      const tileOverlay = document.createElement('div');
      tileOverlay.classList.add('tile-overlay');
      tileImage.append(tileOverlay);
      tile.append(tileImage);
    }

    if (flagCell) {
      const flag = document.createElement('div');
      // Determine flag class based on content or a default if not specified
      // Assuming the flag text might indicate the color, or a default is used.
      // For now, using the class from the original HTML example.
      const flagText = flagCell.textContent.trim().toLowerCase();
      if (flagText.includes('learn more') && tileBlockLink.href.includes('/en/join')) {
        flag.classList.add('flag', 'bg-secondary-d8-spearmint');
      } else if (flagText.includes('learn more') && tileBlockLink.href.includes('/en/node/14991')) {
        flag.classList.add('flag', 'bg-secondary-d4-cornflower');
      } else {
        flag.classList.add('flag', 'bg-secondary-d8-spearmint'); // Default if no specific match
      }

      const text = document.createElement('div');
      text.classList.add('text');
      moveInstrumentation(flagCell, text);
      while (flagCell.firstChild) text.append(flagCell.firstChild);
      flag.append(text);
      // Ensure tile-image exists before appending flag
      const existingTileImage = tile.querySelector('.tile-image');
      if (existingTileImage) {
        existingTileImage.append(flag);
      } else {
        // If no image, append flag directly to tile or handle as needed
        tile.append(flag);
      }
    }

    if (titleCell) {
      const tileCaption = document.createElement('h4');
      tileCaption.classList.add('tile-caption');
      moveInstrumentation(titleCell, tileCaption);
      while (titleCell.firstChild) tileCaption.append(titleCell.firstChild);
      tile.append(tileCaption);
    }

    if (linkCell) {
      const readMore = document.createElement('div');
      readMore.classList.add('read-more');
      moveInstrumentation(linkCell, readMore);
      const anchor = linkCell.querySelector('a');
      if (anchor) {
        readMore.textContent = anchor.textContent.toUpperCase();
      }
      tile.append(readMore);
    }
    row.append(col);
    col.append(tileBlockLink);
  });

  // CTA Link
  const ctaDiv = document.createElement('div');
  ctaDiv.classList.add('cta');
  const ctaAnchor = ctaLinkRow.querySelector('a');
  if (ctaAnchor) {
    const btn = document.createElement('a');
    btn.classList.add('btn', 'transparent', 'border-white');
    btn.href = ctaAnchor.href;
    moveInstrumentation(ctaLinkRow, btn);
    btn.textContent = ctaAnchor.textContent;
    ctaDiv.append(btn);
  }
  container.append(ctaDiv);

  block.textContent = '';
  block.append(containerXl);
}
