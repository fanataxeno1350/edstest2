import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const tsCardsSec = document.createElement('div');
  tsCardsSec.classList.add('ts_cards_sec', 'mt-md-50-acrds');

  const rowThar = document.createElement('div');
  rowThar.classList.add('row-thar', 'mx-0-thar');

  const col = document.createElement('div');
  col.classList.add('col', 'col-md-12', 'ts_cards', 'px-0-thar');

  [...block.children].forEach((row) => {
    const cells = [...row.children];

    // Find cells by content type or position if unambiguous
    const imageCell = cells.find((cell) => cell.querySelector('picture'));
    const linkCell = cells.find((cell) => cell.querySelector('a') && cell !== imageCell); // Find a link cell that's not the image cell
    const headingCell = cells.find((cell) => cell.textContent.trim() !== '' && !cell.querySelector('picture') && !cell.querySelector('a')); // A cell with text, not an image or link
    // The remaining cells are harder to distinguish by content alone, so we'll rely on their relative positions
    // based on the EDS Block Structure, assuming a fixed order for the remaining elements.
    // This is a compromise due to the lack of unique content identifiers for all cells.

    // Re-indexing cells for clarity based on the EDS structure
    const imageRefCell = cells[0]; // Image reference
    const linkRefCell = cells[1]; // Link for the image
    const headingRefCell = cells[2]; // Heading richtext
    const subheadingRefCell = cells[3]; // Subheading richtext
    const pressReleasesLinkRefCell = cells[4]; // Press Releases Link
    const pressReleasesIconRefCell = cells[5]; // Press Releases Icon
    const downloadsLinkRefCell = cells[6]; // Downloads Link
    const downloadsIconRefCell = cells[7]; // Downloads Icon
    const bottomIconRefCell = cells[8]; // Bottom Icon

    const iacInnerWrap = document.createElement('div');
    iacInnerWrap.classList.add('iac-innerWrap');

    // Cell 0: Image and Cell 1: Link
    const imagePicture = imageRefCell?.querySelector('picture');
    const imageLink = linkRefCell?.querySelector('a');

    if (imagePicture && imageLink) {
      const imageAnchor = document.createElement('a');
      imageAnchor.href = imageLink.href;
      moveInstrumentation(imageLink, imageAnchor);
      moveInstrumentation(imageRefCell, imageAnchor);

      const img = imagePicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageAnchor.append(optimizedPic);
      }
      iacInnerWrap.append(imageAnchor);
    } else if (imagePicture) {
      const img = imagePicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        iacInnerWrap.append(optimizedPic);
      }
    }

    // Cell 2: Heading
    if (headingRefCell) {
      const h2 = document.createElement('h2');
      moveInstrumentation(headingRefCell, h2);
      while (headingRefCell.firstChild) h2.append(headingRefCell.firstChild);
      iacInnerWrap.append(h2);
    }
    col.append(iacInnerWrap);

    // Cell 3: Subheading
    if (subheadingRefCell) {
      const pSubheading = document.createElement('p');
      moveInstrumentation(subheadingRefCell, pSubheading);
      while (subheadingRefCell.firstChild) pSubheading.append(subheadingRefCell.firstChild);
      col.append(pSubheading);
    }

    const h5MediaResources = document.createElement('h5');
    h5MediaResources.textContent = 'Media Resources'; // Hardcoded text from original HTML
    col.append(h5MediaResources);

    // Cell 4 & 5: Press Releases Link and Icon
    if (pressReleasesLinkRefCell || pressReleasesIconRefCell) {
      const pressReleasesDiv = document.createElement('div');

      const pressLink = pressReleasesLinkRefCell?.querySelector('a');
      if (pressLink) {
        const newPressLink = document.createElement('a');
        newPressLink.href = pressLink.href;
        moveInstrumentation(pressLink, newPressLink);
        while (pressLink.firstChild) newPressLink.append(pressLink.firstChild);
        pressReleasesDiv.append(newPressLink);
      }

      const pressIconPicture = pressReleasesIconRefCell?.querySelector('picture');
      if (pressIconPicture) {
        const img = pressIconPicture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          pressReleasesDiv.append(optimizedPic);
        }
      }
      col.append(pressReleasesDiv);
    }

    // Cell 6 & 7: Downloads Link and Icon
    if (downloadsLinkRefCell || downloadsIconRefCell) {
      const downloadsDiv = document.createElement('div');

      const downloadLink = downloadsLinkRefCell?.querySelector('a');
      if (downloadLink) {
        const newDownloadLink = document.createElement('a');
        newDownloadLink.href = downloadLink.href;
        moveInstrumentation(downloadLink, newDownloadLink);
        while (downloadLink.firstChild) newDownloadLink.append(downloadLink.firstChild);
        downloadsDiv.append(newDownloadLink);
      }

      const downloadIconPicture = downloadsIconRefCell?.querySelector('picture');
      if (downloadIconPicture) {
        const img = downloadIconPicture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          downloadsDiv.append(optimizedPic);
        }
      }
      col.append(downloadsDiv);
    }

    const pEmpty = document.createElement('p'); // Empty p tag from original HTML
    col.append(pEmpty);

    // Cell 8: Bottom Icon
    if (bottomIconRefCell) {
      const bottomIconPicture = bottomIconRefCell.querySelector('picture');
      if (bottomIconPicture) {
        const bottomIconAnchor = document.createElement('a');
        bottomIconAnchor.target = '_self';
        bottomIconAnchor.href = imageLink ? imageLink.href : '#'; // Reusing the main link for bottom icon if available
        moveInstrumentation(bottomIconRefCell, bottomIconAnchor);

        const img = bottomIconPicture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          bottomIconAnchor.append(optimizedPic);
        }
        col.append(bottomIconAnchor);
      }
    }
  });

  rowThar.append(col);
  tsCardsSec.append(rowThar);

  block.textContent = '';
  block.append(tsCardsSec);
}
