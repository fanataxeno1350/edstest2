import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [backgroundImageRow, overlayImageRow, imageCaptionRow, ...columnRows] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('container');

  const gridFull = document.createElement('div');
  gridFull.classList.add('grid-full');
  container.append(gridFull);

  const gridCentered = document.createElement('div');
  gridCentered.classList.add('grid-centered-12');
  gridFull.append(gridCentered);

  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add('relative', 'mb-lg', 'mt-6', 'lg:mt-8', 'w-full', 'h-auto');
  gridCentered.append(imageWrapper);

  // Background Image
  const backgroundPicture = backgroundImageRow.querySelector('picture');
  if (backgroundPicture) {
    const img = backgroundPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1280' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    optimizedPic.querySelector('img').classList.add('rounded-sm', 'relative', 'z-1', 'w-full', 'aspect-[4/3]', 'md:aspect-2/1', 'object-cover');
    imageWrapper.append(optimizedPic);
  }
  moveInstrumentation(backgroundImageRow, imageWrapper);

  // Overlay Image
  const overlayPicture = overlayImageRow.querySelector('picture');
  if (overlayPicture) {
    const overlayDiv = document.createElement('div');
    overlayDiv.classList.add('absolute', 'right-8', 'md:right-12', 'lg:right-16', '-top-10', 'md:-top-16', 'z-2', 'w-2/3', 'md:w-1/2', 'max-w-[630px]', 'aspect-square', 'rounded-full', 'overflow-hidden', 'shadow-md');
    const img = overlayPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '630' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    optimizedPic.querySelector('img').classList.add('w-full', 'h-full', 'object-cover');
    overlayDiv.append(optimizedPic);
    imageWrapper.append(overlayDiv);
  }
  moveInstrumentation(overlayImageRow, imageWrapper);

  // Image Caption
  const captionDiv = document.createElement('div');
  captionDiv.classList.add('mt-2xs');
  const captionP = imageCaptionRow.querySelector('p');
  if (captionP) {
    captionP.classList.add('z-1', 'relative', 'text-caption-size', 'theme-dark:text-foreground-colored-muted', 'text-foreground-muted');
    moveInstrumentation(imageCaptionRow, captionP);
    captionDiv.append(captionP);
  } else {
    moveInstrumentation(imageCaptionRow, captionDiv);
  }
  imageWrapper.append(captionDiv);

  // Columns
  if (columnRows.length > 0) {
    const columnsGrid = document.createElement('div');
    columnsGrid.classList.add('grid', 'grid-cols-1', 'gap-grid-gutter', 'mt-lg', 'md:grid-cols-3');
    gridCentered.append(columnsGrid);

    columnRows.forEach((row) => {
      const columnDiv = document.createElement('div');
      columnDiv.classList.add('flex', 'flex-col', 'items-start', 'justify-start', 'p-0');
      moveInstrumentation(row, columnDiv);

      // Use content detection for column cells instead of index access
      const cells = [...row.children];
      const headingCell = cells.find(cell => cell.querySelector('h3') || (!cell.querySelector('p') && !cell.querySelector('a')));
      const textCell = cells.find(cell => cell.querySelector('p'));
      const linkCell = cells.find(cell => cell.querySelector('a'));

      if (headingCell) { // Heading
        const h3 = headingCell.querySelector('h3') || document.createElement('h3');
        h3.classList.add('text-h4', 'font-bold', 'mb-xs', 'theme-dark:text-foreground-td', 'theme-medium:text-foreground-tm', 'text-foreground');
        moveInstrumentation(headingCell, h3);
        while (headingCell.firstChild) h3.append(headingCell.firstChild);
        columnDiv.append(h3);
      }
      if (textCell) { // Text
        const p = textCell.querySelector('p') || document.createElement('p');
        p.classList.add('text-p1', 'mb-md', 'prose', 'theme-dark:prose-td', 'theme-medium:prose-tm');
        moveInstrumentation(textCell, p);
        while (textCell.firstChild) p.append(textCell.firstChild);
        columnDiv.append(p);
      }
      if (linkCell) { // Link
        const foundLink = linkCell.querySelector('a');
        const link = document.createElement('a');
        link.href = foundLink.href;
        link.classList.add('button', 'button--dark', 'theme-dark:button--light');
        moveInstrumentation(linkCell, link);
        while (linkCell.firstChild) link.append(linkCell.firstChild);
        columnDiv.append(link);
      }
      columnsGrid.append(columnDiv);
    });
  }

  // Optimize all images in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(container);
}
