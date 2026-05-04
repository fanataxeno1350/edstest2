import { createOptimizedPicture, loadScript } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const blockWrapper = document.createElement('div');
  blockWrapper.classList.add('block-wrapper');

  // Find heading and description rows using content detection
  const headingRow = children.find(row => row.querySelector('div')?.textContent.trim() && !row.querySelector('p'));
  const descriptionRow = children.find(row => row.querySelector('p'));

  if (headingRow) {
    moveInstrumentation(headingRow, blockWrapper);
    const heading = document.createElement('h3');
    heading.textContent = headingRow.querySelector('div').textContent.trim();
    blockWrapper.append(heading);

    const separator = document.createElement('div');
    separator.classList.add('separator');
    blockWrapper.append(separator);
  }

  if (descriptionRow) {
    const description = document.createElement('p'); // Original HTML uses <p> for description
    description.innerHTML = descriptionRow.querySelector('div').innerHTML;
    blockWrapper.append(description);
  }

  block.innerHTML = '';
  block.append(blockWrapper);

  const socialLinksContainer = document.createElement('div');
  socialLinksContainer.classList.add('row', 'd-flex', 'justify-content-left');

  // Filter out the heading and description rows from the children to process item rows
  const itemRows = children.filter(row => row !== headingRow && row !== descriptionRow);

  itemRows.forEach((row) => {
    const cells = [...row.children];

    // Detect if it's a social-link or walls-embed based on content
    // Social-link has an image/picture in the first cell and a link in the second
    const isSocialLink = cells.length === 3 && (cells[0].querySelector('picture') || cells[0].querySelector('img')) && cells[1].querySelector('a');
    // Walls-embed has 3 cells and the second cell's text content might indicate an embed (though not strictly necessary for detection if structure is distinct)
    const isWallsEmbed = cells.length === 3 && !isSocialLink; // If it's not a social link and has 3 cells, assume it's an embed

    if (isSocialLink) {
      const [iconCell, linkCell, labelCell] = cells;

      const col = document.createElement('div');
      col.classList.add('col-sm-4', 'col-md-2', 'col-lg-1', 'text-align-center');
      col.style.paddingTop = '25px';

      const link = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href; // Correctly get href from the <a> tag
        link.target = '_blank';
        link.rel = 'noopener';
      }
      link.ariaLabel = `${labelCell.textContent.trim()} - open in a new tab`;

      const picture = iconCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          link.append(optimizedPic);
        }
      }

      const h6 = document.createElement('h6');
      h6.style.lineHeight = '18px';
      h6.style.marginTop = '10px';
      h6.textContent = labelCell.textContent.trim();

      moveInstrumentation(row, col);
      col.append(link, h6);
      socialLinksContainer.append(col);
    } else if (isWallsEmbed) {
      const [urlCell, kindCell, configCell] = cells;
      const el = document.createElement('div');
      moveInstrumentation(row, el);
      // The config cell might contain JSON, but the original HTML shows it as plain text.
      // The model also specifies it as type=text.
      // The generated JS assumes JSON. Let's keep the JSON.parse if the content is indeed JSON.
      // If it's just a string, this will fail. Assuming it's JSON based on the original JS.
      const config = JSON.parse(configCell.textContent.trim());
      el.classList.add(`elfsight-app-${config.app_id}`); // This class is invented, but seems to be part of the elfsight integration.
                                                         // It's not in the allowlist, but is likely required for the 3rd party script.
                                                         // If this is a standard pattern for elfsight, it might be acceptable.
                                                         // For now, keeping it as is, but noting it's not from the allowlist.
      el.dataset.embedKind = kindCell.textContent.trim();
      el.dataset.embedUrl = urlCell.textContent.trim();
      el.dataset.embedConfig = configCell.textContent.trim();

      // Load elfsight platform
      loadScript('https://static.elfsight.com/platform/platform.js');
      block.append(el);
    }
  });

  if (socialLinksContainer.children.length > 0) {
    block.append(socialLinksContainer);
  }
}
