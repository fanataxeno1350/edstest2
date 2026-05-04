import { createOptimizedPicture, loadScript } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const blockWrapper = document.createElement('div');
  blockWrapper.classList.add('block-wrapper');

  // Find heading and description cells using content detection
  // Heading is the first row with a single text cell
  const headingRow = children.find(row => row.children.length === 1 && !row.querySelector('p') && !row.querySelector('picture') && !row.querySelector('a'));
  const headingCell = headingRow ? [...headingRow.children][0] : null;

  if (headingCell) {
    const heading = document.createElement('h3');
    heading.textContent = headingCell.textContent.trim();
    moveInstrumentation(headingCell, heading);
    blockWrapper.append(heading);
    headingRow.remove(); // Remove processed row from children
  }

  // Separator
  const separator = document.createElement('div');
  separator.classList.add('separator');
  blockWrapper.append(separator);

  // Description is the first remaining row with a single richtext cell (contains <p>)
  const descriptionRow = children.find(row => row.children.length === 1 && row.querySelector('p'));
  const descriptionCell = descriptionRow ? [...descriptionRow.children][0] : null;

  if (descriptionCell) {
    const description = document.createElement('div');
    description.innerHTML = descriptionCell.innerHTML;
    moveInstrumentation(descriptionCell, description);
    blockWrapper.append(description);
    descriptionRow.remove(); // Remove processed row from children
  }

  block.prepend(blockWrapper);

  const socialLinksContainer = document.createElement('div');
  socialLinksContainer.classList.add('row', 'd-flex', 'justify-content-left');

  // All remaining rows are item rows
  const itemRows = [...block.children]; // Re-evaluate children after removing heading/description

  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 3) {
      // Differentiate between social-link-item and walls-io-embed
      // social-link-item has a picture in the first cell and an anchor in the second
      // walls-io-embed has text content in all cells, and the second cell's text is 'walls-io'
      const isSocialLinkItem = cells[0].querySelector('picture') && cells[1].querySelector('a');
      const isWallsIoEmbed = cells[1].textContent.trim() === 'walls-io';

      if (isSocialLinkItem) {
        // This is a social-link-item
        const [iconCell, linkCell, labelCell] = cells;

        const col = document.createElement('div');
        col.classList.add('col-sm-4', 'col-md-2', 'col-lg-1', 'text-align-center');
        col.style.paddingTop = '25px'; // Copy inline style from original HTML

        const anchor = document.createElement('a');
        const foundLink = linkCell.querySelector('a');
        if (foundLink) {
          anchor.href = foundLink.href; // Read href from the <a> tag as per aem-content type
          anchor.rel = 'noopener';
          anchor.target = '_blank';
          anchor.setAttribute('aria-label', `${labelCell.textContent.trim()} - open in a new tab`);
        }

        const picture = iconCell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          if (img) {
            const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            anchor.append(optimizedPic);
          }
        }

        const h6 = document.createElement('h6');
        h6.style.lineHeight = '18px';
        h6.style.marginTop = '10px';
        h6.textContent = labelCell.textContent.trim();

        moveInstrumentation(row, col);
        col.append(anchor, h6);
        socialLinksContainer.append(col);
      } else if (isWallsIoEmbed) {
        // This is a walls-io-embed
        const [embedUrlCell, embedKindCell, embedConfigCell] = cells;
        const kind = embedKindCell.textContent.trim();
        const embedUrl = embedUrlCell.textContent.trim();

        const embedDiv = document.createElement('div');
        moveInstrumentation(row, embedDiv);
        embedDiv.setAttribute('data-embed-kind', kind);
        embedDiv.setAttribute('data-embed-url', embedUrl);
        embedDiv.setAttribute('data-embed-config', embedConfigCell.textContent.trim());

        if (kind === 'walls-io') {
          const wallScript = document.createElement('script');
          wallScript.src = 'https://walls.io/js/wallsio-widget-1.2.js';
          wallScript.dataset.wallurl = embedUrl;
          wallScript.dataset.width = '100%';
          wallScript.dataset.autoheight = '1';
          wallScript.async = true;
          embedDiv.append(wallScript);
        } else {
          embedDiv.textContent = `[${kind} placeholder for ${embedUrl}]`;
        }
        block.append(embedDiv);
      }
    }
  });

  block.append(socialLinksContainer);
}
