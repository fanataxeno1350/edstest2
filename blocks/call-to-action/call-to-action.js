import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rowContainer = document.createElement('div');
  rowContainer.classList.add('row', 'row-pad');
  rowContainer.style.padding = '0px 0 0px 0'; // Apply inline style from original HTML

  [...block.children].forEach((row) => {
    const col = document.createElement('div');
    col.classList.add('col-md-4');
    moveInstrumentation(row, col);

    // Reconstruct the full structure based on the original HTML
    const fieldItemCol1Widgets = document.createElement('div');
    fieldItemCol1Widgets.classList.add('field', 'field--name-field-column-1-widgets', 'field--type-entity-reference-revisions', 'field--label-visually_hidden');

    const fieldLabelVisuallyHidden = document.createElement('div');
    fieldLabelVisuallyHidden.classList.add('field__label', 'visually-hidden');
    fieldLabelVisuallyHidden.textContent = 'Column 1:'; // This text is hardcoded in the original HTML

    const fieldItem = document.createElement('div');
    fieldItem.classList.add('field__item');

    const paragraphColumnContent = document.createElement('div');
    paragraphColumnContent.classList.add('paragraph', 'paragraph--type--column-content', 'paragraph--view-mode--default');

    const fieldColumnContent = document.createElement('div');
    fieldColumnContent.classList.add('field', 'field--name-field-column-content', 'field--type-entity-reference-revisions', 'field--label-hidden', 'field__items');

    const fieldItemContent = document.createElement('div');
    fieldItemContent.classList.add('field__item');

    const paragraphText = document.createElement('div');
    paragraphText.classList.add('paragraph', 'paragraph--type--text', 'paragraph--view-mode--default');

    const textFormatted = document.createElement('div');
    textFormatted.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');

    let imageEl = null;
    let linkEl = null;
    let headingEl = null;
    let textEl = null;

    // Use content detection instead of row.children[n]
    const cells = [...row.children];
    imageEl = cells.find(cell => cell.querySelector('picture'));
    linkEl = cells.find(cell => cell.querySelector('a'));
    headingEl = cells.find(cell => cell.querySelector('h1, h2, h3, h4, h5, h6'));
    textEl = cells.find(cell => cell.querySelector('p:not(:has(a))')); // Ensure it's a paragraph not containing the link

    // Reconstruct the content as per the original HTML structure
    const h3 = document.createElement('h3');
    const p = document.createElement('p');

    if (linkEl) {
      const newLink = document.createElement('a');
      newLink.href = linkEl.querySelector('a').href;
      moveInstrumentation(linkEl.querySelector('a'), newLink); // Move instrumentation from the actual link element

      if (imageEl) {
        const img = imageEl.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          h3.append(optimizedPic);
        }
      }

      if (headingEl) {
        moveInstrumentation(headingEl.querySelector('h1, h2, h3, h4, h5, h6'), h3);
        while (headingEl.querySelector('h1, h2, h3, h4, h5, h6').firstChild) h3.append(headingEl.querySelector('h1, h2, h3, h4, h5, h6').firstChild);
      }
      newLink.append(h3);

      if (textEl) {
        moveInstrumentation(textEl.querySelector('p'), p);
        while (textEl.querySelector('p').firstChild) p.append(textEl.querySelector('p').firstChild);
      }
      newLink.append(p);
      textFormatted.append(newLink);

    } else { // Case where there is no link wrapping the entire content
      if (imageEl) {
        const img = imageEl.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          h3.append(optimizedPic);
        }
      }

      if (headingEl) {
        moveInstrumentation(headingEl.querySelector('h1, h2, h3, h4, h5, h6'), h3);
        while (headingEl.querySelector('h1, h2, h3, h4, h5, h6').firstChild) h3.append(headingEl.querySelector('h1, h2, h3, h4, h5, h6').firstChild);
      }
      textFormatted.append(h3);

      if (textEl) {
        moveInstrumentation(textEl.querySelector('p'), p);
        while (textEl.querySelector('p').firstChild) p.append(textEl.querySelector('p').firstChild);
      }
      textFormatted.append(p);
    }

    paragraphText.append(textFormatted);
    fieldItemContent.append(paragraphText);
    fieldColumnContent.append(fieldItemContent);
    paragraphColumnContent.append(fieldColumnContent);
    fieldItem.append(paragraphColumnContent);

    // Append the column structure
    fieldItemCol1Widgets.append(fieldLabelVisuallyHidden);
    fieldItemCol1Widgets.append(fieldItem);
    col.append(fieldItemCol1Widgets);
    rowContainer.append(col);
  });

  block.textContent = '';
  block.append(rowContainer);
}
