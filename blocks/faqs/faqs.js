import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...accordionItemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('faqs');
  moveInstrumentation(block, section);

  const h2 = document.createElement('h2');
  moveInstrumentation(headingRow.firstElementChild, h2);
  h2.append(headingRow.firstElementChild.textContent);
  section.append(h2);

  const container = document.createElement('div');
  container.classList.add('container', 'faq-accordion');

  const accordion = document.createElement('div');
  accordion.classList.add('accordion');
  accordion.id = 'accordionExample';

  accordionItemRows.forEach((row, index) => {
    const cells = [...row.children]; // Get all cells for content detection
    const accordionItem = document.createElement('div');
    accordionItem.classList.add('accordion-item', 'shadow');
    moveInstrumentation(row, accordionItem);

    const headingId = `heading${index + 1}`;
    const collapseId = `collapse${index + 1}`;

    const h2Header = document.createElement('h2');
    h2Header.classList.add('accordion-header');
    h2Header.id = headingId;

    const button = document.createElement('button');
    button.classList.add('accordion-button', 'd-flex', 'align-items-center');
    button.type = 'button';
    button.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
    button.setAttribute('aria-controls', collapseId);
    if (index !== 0) { // Add 'collapsed' class for non-first items
      button.classList.add('collapsed');
    }

    const collapseDiv = document.createElement('div');
    collapseDiv.classList.add('accordion-collapse', 'collapse');
    if (index === 0) {
      collapseDiv.classList.add('show');
    }
    collapseDiv.id = collapseId;
    collapseDiv.setAttribute('aria-labelledby', headingId);
    collapseDiv.setAttribute('data-bs-parent', '#accordionExample');

    const accordionBody = document.createElement('div');
    accordionBody.classList.add('accordion-body');

    // Content detection for cells
    const imageCell = cells.find((cell) => cell.querySelector('picture') || cell.querySelector('img'));
    const questionCell = cells.find((cell) => !cell.querySelector('picture') && cell.textContent.trim() && cell.children.length === 1 && cell.firstElementChild.tagName === 'DIV'); // Assuming question is a simple text div
    const answerCell = cells.find((cell) => !cell.querySelector('picture') && !cell.querySelector('img') && cell !== questionCell); // The remaining cell is the answer

    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          button.append(optimizedPic);
        }
      } else { // If it's an SVG, just append it directly
        const img = imageCell.querySelector('img'); // Check for direct img (e.g., SVG)
        if (img) {
          moveInstrumentation(imageCell, button);
          button.append(img);
        }
      }
    }

    if (questionCell) {
      const p = document.createElement('p');
      p.classList.add('m-0', 'ms-3');
      moveInstrumentation(questionCell, p);
      while (questionCell.firstChild) p.append(questionCell.firstChild);
      button.append(p);
    }

    if (answerCell) {
      moveInstrumentation(answerCell, accordionBody);
      while (answerCell.firstChild) accordionBody.append(answerCell.firstChild);
    }

    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', !isExpanded);
      button.classList.toggle('collapsed', isExpanded);
      collapseDiv.classList.toggle('show');

      // Close other open accordions
      accordion.querySelectorAll('.accordion-collapse.show').forEach((openCollapse) => {
        if (openCollapse !== collapseDiv) {
          openCollapse.classList.remove('show');
          const correspondingButton = accordion.querySelector(`[aria-controls="${openCollapse.id}"]`);
          if (correspondingButton) {
            correspondingButton.classList.add('collapsed');
            correspondingButton.setAttribute('aria-expanded', 'false');
          }
        }
      });
    });

    h2Header.append(button);
    collapseDiv.append(accordionBody);
    accordionItem.append(h2Header, collapseDiv);
    accordion.append(accordionItem);
  });

  container.append(accordion);
  section.append(container);

  block.textContent = '';
  block.append(section);
}
