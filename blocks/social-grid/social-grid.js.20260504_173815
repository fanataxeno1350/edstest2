import { createOptimizedPicture, loadScript } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [titleRow, descriptionRow, ...itemRows] = children;

  block.innerHTML = ''; // Clear the block to rebuild

  const blockWrapper = document.createElement('div');
  blockWrapper.classList.add('block-wrapper');
  moveInstrumentation(titleRow, blockWrapper);

  // Title
  const title = document.createElement('h3');
  title.textContent = titleRow?.firstElementChild?.textContent.trim() || '';
  blockWrapper.append(title);

  // Separator
  const separator = document.createElement('div');
  separator.classList.add('separator');
  blockWrapper.append(separator);

  // Description
  const description = document.createElement('div');
  description.innerHTML = descriptionRow?.firstElementChild?.innerHTML || '';
  blockWrapper.append(description);

  block.append(blockWrapper);

  const socialLinksContainer = document.createElement('div');
  socialLinksContainer.classList.add('row', 'd-flex', 'justify-content-left');

  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 3) {
      const [cell0, cell1, cell2] = cells;

      // Detect if it's a social-grid-item or an embed based on content
      const isSocialGridItem = cell0.querySelector('picture') && cell1.querySelector('a') && cell2.textContent.trim();
      const isEmbed = cell0.textContent.includes('Embed URL') && cell1.textContent.includes('Embed Kind');

      if (isSocialGridItem) {
        const iconCell = cell0;
        const linkCell = cell1;
        const labelCell = cell2;

        const col = document.createElement('div');
        col.classList.add('col-sm-4', 'col-md-2', 'col-lg-1', 'text-align-center');
        col.style.paddingTop = '25px';
        moveInstrumentation(row, col);

        const link = document.createElement('a');
        const foundLink = linkCell.querySelector('a');
        if (foundLink && foundLink.href) { // Ensure href exists
          link.href = foundLink.href;
          link.target = '_blank';
          link.rel = 'noopener';
          link.setAttribute('aria-label', `${labelCell.textContent.trim()} - open in a new tab`);
        }

        const picture = iconCell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          if (img) {
            const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '60%' }]);
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            link.append(optimizedPic);
          }
        }
        col.append(link);

        const label = document.createElement('h6');
        label.style.lineHeight = '18px';
        label.style.marginTop = '10px';
        label.textContent = labelCell.textContent.trim();
        col.append(label);

        socialLinksContainer.append(col);
      } else if (isEmbed) {
        const [urlCell, kindCell, configCell] = cells;
        const embedKind = kindCell.textContent.trim();
        const embedConfig = configCell.textContent.trim();

        const embedEl = document.createElement('div');
        moveInstrumentation(row, embedEl);
        embedEl.dataset.embedKind = embedKind;
        embedEl.dataset.embedUrl = urlCell.textContent.trim();

        if (embedKind === 'elfsight-widget') {
          try {
            const config = JSON.parse(embedConfig);
            if (config.app_id) {
              embedEl.classList.add(`elfsight-app-${config.app_id}`);
              // Elfsight platform script is loaded once
              loadScript('https://static.elfsight.com/platform/platform.js');
              embedEl.textContent = ''; // Clear placeholder text
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Failed to parse Elfsight embed config:', e);
          }
        } else {
          embedEl.textContent = `[${embedKind} placeholder]`; // Fallback for unknown embed kinds
        }
        block.append(embedEl); // Appending embeds directly to the block, not socialLinksContainer
      }
    }
  });

  if (socialLinksContainer.children.length > 0) {
    block.append(socialLinksContainer);
  }
}
