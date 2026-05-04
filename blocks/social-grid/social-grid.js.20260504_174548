import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation, loadScript } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Fixed fields: heading and description
  const headingRow = children[0];
  const descriptionRow = children[1];

  const heading = document.createElement('h3');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.firstElementChild?.textContent.trim() || '';

  const description = document.createElement('div');
  moveInstrumentation(descriptionRow, description);
  description.innerHTML = descriptionRow.firstElementChild?.innerHTML || '';

  const blockWrapper = document.createElement('div');
  blockWrapper.classList.add('block-wrapper');
  blockWrapper.append(heading, description);

  const separator = document.createElement('div');
  separator.classList.add('separator');
  blockWrapper.insertBefore(separator, description);

  // Social Links and Embeds
  const socialLinksContainer = document.createElement('div');
  socialLinksContainer.classList.add('row', 'd-flex', 'justify-content-left');

  const embedsContainer = document.createElement('div');

  children.slice(2).forEach((row) => {
    const cells = [...row.children];

    if (cells.length === 3) {
      // Differentiate between social-link-item and walls-io-embed
      // social-link-item has an image in the first cell
      // walls-io-embed has plain text in the first cell (data-embed-url)
      if (cells[0].querySelector('picture')) {
        // Social Link Item
        const [iconCell, linkCell, labelCell] = cells; // CORRECT: Using destructuring

        const col = document.createElement('div');
        col.classList.add('col-sm-4', 'col-md-2', 'col-lg-1', 'text-align-center');
        col.style.paddingTop = '25px';

        const link = document.createElement('a');
        const foundLink = linkCell.querySelector('a');
        if (foundLink) {
          link.href = foundLink.href; // CORRECT: Reading href from <a> tag
          link.target = '_blank';
          link.rel = 'noopener';
          link.ariaLabel = `${labelCell.textContent.trim()} - open in a new tab`;
        }

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

        // Optimize images within the social link
        col.querySelectorAll('picture > img').forEach((img) => {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          img.closest('picture').replaceWith(optimizedPic);
        });
      } else if (cells[1].textContent.trim() === 'Embed Kind label text') { // CORRECT: Differentiating by actual content from EDS structure
        // Walls-io Embed
        const [urlCell, kindCell, configCell] = cells; // CORRECT: Using destructuring
        const embedDiv = document.createElement('div');
        moveInstrumentation(row, embedDiv);

        const embedKind = kindCell.textContent.trim();
        const embedUrl = urlCell.textContent.trim();
        let embedConfig = {};
        try {
          embedConfig = JSON.parse(configCell.textContent.trim());
        } catch (e) {
          console.error('Error parsing embed config:', e);
        }

        embedDiv.dataset.embedKind = embedKind;
        embedDiv.dataset.embedUrl = embedUrl;
        Object.keys(embedConfig).forEach((key) => {
          embedDiv.dataset[`embed${key.charAt(0).toUpperCase() + key.slice(1)}`] = embedConfig[key];
        });

        // Specific handling for walls-io
        if (embedKind === 'walls-io') {
          embedDiv.textContent = '[walls-io placeholder]'; // Placeholder text as in original HTML
          loadScript('https://walls.io/js/wallsio-widget-1.2.js').then(() => {
            // Initialize Walls.io widget after script loads
            window.WallsIO = window.WallsIO || [];
            window.WallsIO.push({
              id: embedUrl.split('/').pop().split('?')[0], // Extract ID from URL
              el: embedDiv,
              url: embedUrl,
              ...embedConfig,
            });
          });
        }
        embedsContainer.append(embedDiv);
      }
    }
  });

  block.textContent = ''; // Clear original content
  block.append(blockWrapper, socialLinksContainer, embedsContainer);
}
