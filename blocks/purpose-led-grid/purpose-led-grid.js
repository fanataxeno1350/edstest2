import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...itemRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  // Heading
  if (headingRow) {
    const headingCell = headingRow.querySelector('div');
    if (headingCell) {
      const h2 = document.createElement('h2');
      h2.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
      h2.setAttribute('data-aos-easing', 'ease-in-out');
      h2.setAttribute('data-aos', 'fade-up');
      h2.setAttribute('data-aos-delay', '200');
      moveInstrumentation(headingCell, h2);
      h2.innerHTML = headingCell.innerHTML;
      sectionHeader.append(h2);
    }
  }

  // Description
  if (descriptionRow) {
    const descriptionCell = descriptionRow.querySelector('div');
    if (descriptionCell) {
      const p = document.createElement('p');
      p.classList.add('aos-init', 'aos-animate');
      p.setAttribute('data-aos', 'fade-up');
      p.setAttribute('data-aos-offset', '100');
      p.setAttribute('data-aos-duration', '650');
      p.setAttribute('data-aos-easing', 'ease-in-out');
      moveInstrumentation(descriptionCell, p);
      p.innerHTML = descriptionCell.innerHTML;
      sectionHeader.append(p);
    }
  }

  const gridContainer = document.createElement('div');
  gridContainer.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');

  itemRows.forEach((row) => {
    const col = document.createElement('div');
    col.classList.add('col-md-6', 'aos-init', 'aos-animate');
    col.setAttribute('data-aos-easing', 'ease-in-out');
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', '700');
    moveInstrumentation(row, col);

    const cells = [...row.children];
    const imageCell = cells.find((cell) => cell.querySelector('picture'));
    const linkCell = cells.find((cell) => cell.querySelector('a'));
    const altTextCell = cells.find((cell) => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim() !== '' && !cell.querySelector('ul'));
    const textCell = cells.find((cell) => cell.querySelector('ul')); // Richtext for the nav tree

    if (linkCell) {
      const link = linkCell.querySelector('a');
      const cardWrap = document.createElement('a');
      cardWrap.classList.add('card-wrap');
      cardWrap.href = link?.href || '#';
      cardWrap.target = '_blank'; // Original HTML uses target="_blank"
      moveInstrumentation(linkCell, cardWrap);

      if (imageCell) {
        const cardImage = document.createElement('div');
        cardImage.classList.add('card-image');
        const picture = imageCell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          // Use img.alt as fallback for altTextCell if it's empty
          const altText = altTextCell?.textContent.trim() || img.alt;
          const optimizedPic = createOptimizedPicture(img.src, altText, false, [{ width: '576' }], [{ media: '(max-width: 576px)', width: '576' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          cardImage.append(optimizedPic);
        }
        cardWrap.append(cardImage);
      }

      if (textCell) {
        const cardText = document.createElement('div');
        cardText.classList.add('card-text');

        // The original HTML only shows <p class="desc"> within card-text.
        // It does not show a nested navigation tree.
        // Therefore, we will extract the text content from the first <li> of the root <ul>
        // and render it as a simple <p> tag, preserving line breaks.
        const temp = document.createElement('div');
        temp.innerHTML = textCell?.innerHTML ?? '';
        const rootUl = temp.querySelector('ul');

        if (rootUl) {
          const firstLi = rootUl.querySelector(':scope > li');
          if (firstLi) {
            let label = '';
            for (const node of firstLi.childNodes) {
              if (node.nodeType === Node.TEXT_NODE) {
                label += node.textContent.trim();
              } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'UL') {
                label += node.textContent.trim();
              }
            }
            label = label.trim();
            const p = document.createElement('p');
            p.classList.add('desc');
            p.innerHTML = label.replace(/\n/g, '<br>'); // Preserve line breaks
            cardText.append(p);
          }
        } else {
          // Fallback if no list is parsed, or if it's just plain text
          const p = document.createElement('p');
          p.classList.add('desc');
          moveInstrumentation(textCell, p);
          p.innerHTML = textCell.innerHTML; // Copy original content if not a list
          cardText.append(p);
        }
        cardWrap.append(cardText);
      }
      col.append(cardWrap);
    }
    gridContainer.append(col);
  });

  block.textContent = '';
  block.append(sectionHeader, gridContainer);
}
