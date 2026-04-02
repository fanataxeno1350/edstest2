import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [copyrightRow, ...itemRows] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('container');

  const innerFooter = document.createElement('div');
  innerFooter.classList.add('inner-footer', 'row');

  const footerSponsorWrapper = document.createElement('div');
  footerSponsorWrapper.classList.add('row', 'footer-sponsor-wrapper');

  const copyrightWrapper = document.createElement('div');
  copyrightWrapper.classList.add('row');

  const copyrightColumn = document.createElement('div');
  copyrightColumn.classList.add('column');
  const copyrightP = document.createElement('p');
  copyrightP.classList.add('source-org', 'copyright');
  moveInstrumentation(copyrightRow, copyrightP);
  while (copyrightRow.firstChild) copyrightP.append(copyrightRow.firstChild);
  copyrightColumn.append(copyrightP);
  copyrightWrapper.append(copyrightColumn);

  // Filter itemRows into footerWidgets and footerSponsors based on content
  const footerWidgets = itemRows.filter((row) => {
    const cells = [...row.children];
    // A footer widget row has two cells: one for title (text) and one for body (richtext, often with p or ul)
    // It does NOT contain a picture directly in its cells.
    return cells.length === 2 && !cells.some(cell => cell.querySelector('picture'));
  });

  const footerSponsors = itemRows.filter((row) => {
    const cells = [...row.children];
    // A footer sponsor row has two cells: one for image (picture) and one for alt text (text)
    // It MUST contain a picture in one of its cells.
    return cells.length === 2 && cells.some(cell => cell.querySelector('picture'));
  });

  footerWidgets.forEach((row) => {
    const widgetDiv = document.createElement('div');
    moveInstrumentation(row, widgetDiv);
    widgetDiv.classList.add('widget', 'column', 'widget_text');

    const cells = [...row.children];
    // Find title cell: text content, no picture or link
    const titleCell = cells.find((cell) => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim());
    // Find body cell: contains a paragraph or unordered list
    const bodyCell = cells.find((cell) => !cell.querySelector('picture') && (cell.querySelector('p') || cell.querySelector('ul')));

    if (titleCell) {
      const h4 = document.createElement('h4');
      h4.classList.add('widgettitle', 'svart_strek');
      moveInstrumentation(titleCell, h4);
      while (titleCell.firstChild) h4.append(titleCell.firstChild);
      widgetDiv.append(h4);
    }

    if (bodyCell) {
      const textwidgetDiv = document.createElement('div');
      textwidgetDiv.classList.add('textwidget');
      moveInstrumentation(bodyCell, textwidgetDiv);
      while (bodyCell.firstChild) textwidgetDiv.append(bodyCell.firstChild);
      widgetDiv.append(textwidgetDiv);
    }
    innerFooter.append(widgetDiv);
  });

  if (footerSponsors.length > 0) {
    const sponsorColumn = document.createElement('div');
    sponsorColumn.classList.add('column');

    const h4 = document.createElement('h4');
    h4.classList.add('widgettitle', 'svart_strek');
    h4.textContent = 'Proud sponsor of';
    sponsorColumn.append(h4);

    const sponsorImagesDiv = document.createElement('div');
    sponsorImagesDiv.classList.add('footer-sponsor-images');

    footerSponsors.forEach((row) => {
      const cells = [...row.children];
      // Find image cell: contains a picture
      const imageCell = cells.find((cell) => cell.querySelector('picture'));
      // Find alt text cell: text content, no picture or link
      const altTextCell = cells.find((cell) => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim());

      if (imageCell) {
        const picture = imageCell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          const altText = altTextCell ? altTextCell.textContent.trim() : img?.alt || '';
          const optimizedPic = createOptimizedPicture(img.src, altText, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          picture.replaceWith(optimizedPic);
          sponsorImagesDiv.append(optimizedPic);
        }
      }
    });
    sponsorColumn.append(sponsorImagesDiv);
    footerSponsorWrapper.append(sponsorColumn);
  }

  container.append(innerFooter);
  if (footerSponsors.length > 0) {
    container.append(footerSponsorWrapper);
  }
  container.append(copyrightWrapper);

  block.textContent = '';
  block.classList.add('footer');
  block.setAttribute('role', 'contentinfo');
  block.append(container);
}
