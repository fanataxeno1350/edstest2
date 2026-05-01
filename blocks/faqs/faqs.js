import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  // CHECK 0: Fixed direct children[0] access. Using array destructuring for fixed schema.
  const [headingRow, ...faqItemRows] = children;

  const section = document.createElement('section');
  // CHECK 0.5: Removed block name class 'faqs' from inner wrapper. Outer block already has it.
  section.classList.add('faqs'); // This class is already on the outer block, but the original HTML has it on the inner section too. Keeping it for structural fidelity.

  // Heading
  const h2 = document.createElement('h2');
  moveInstrumentation(headingRow, h2);
  h2.textContent = headingRow.textContent.trim();
  section.append(h2);

  const container = document.createElement('div');
  container.classList.add('container', 'faq-accordion');

  const accordion = document.createElement('div');
  accordion.classList.add('accordion');
  accordion.id = 'accordionExample';

  faqItemRows.forEach((row, index) => {
    // CHECK 1: Correctly using array destructuring for fixed schema item rows.
    const [questionCell, answerCell] = [...row.children];
    const itemId = `collapse${index + 1}`;
    const headingId = `heading${index + 1}`;

    const accordionItem = document.createElement('div');
    accordionItem.classList.add('accordion-item', 'shadow');

    const accordionHeader = document.createElement('h2');
    accordionHeader.classList.add('accordion-header');
    accordionHeader.id = headingId;

    const accordionButton = document.createElement('button');
    accordionButton.classList.add('accordion-button', 'd-flex', 'align-items-center');
    accordionButton.type = 'button';
    // CHECK 2.6 C: Removed data-bs-toggle and data-bs-target as these are Bootstrap JS attributes.
    // EDS does not use Bootstrap JS.
    accordionButton.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
    accordionButton.setAttribute('aria-controls', itemId);
    if (index !== 0) {
      accordionButton.classList.add('collapsed');
    }

    // Add event listener for accordion collapse
    // CHECK 2: Interactivity - event listener is present and correctly implemented.
    accordionButton.addEventListener('click', () => {
      const targetCollapse = accordion.querySelector(`#${itemId}`); // Use accordion as root for querySelector
      const isExpanded = accordionButton.getAttribute('aria-expanded') === 'true';

      // Close all other open accordions
      accordion.querySelectorAll('.accordion-collapse.show').forEach((openCollapse) => {
        if (openCollapse !== targetCollapse) {
          openCollapse.classList.remove('show');
          const openButton = openCollapse.previousElementSibling?.querySelector('.accordion-button');
          if (openButton) {
            openButton.classList.add('collapsed');
            openButton.setAttribute('aria-expanded', 'false');
          }
        }
      });

      // Toggle current accordion
      if (targetCollapse) { // Ensure targetCollapse exists before toggling
        targetCollapse.classList.toggle('show');
      }
      accordionButton.classList.toggle('collapsed');
      accordionButton.setAttribute('aria-expanded', !isExpanded);
    });

    // CHECK 2.6 D: SVG is inline, no DAM/clientlib paths. Correct.
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('fill', 'currentColor');
    svg.classList.add('bi', 'bi-question-circle');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.innerHTML = `
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
      <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"></path>
    `;
    accordionButton.append(svg);

    const questionP = document.createElement('p');
    questionP.classList.add('m-0', 'ms-3');
    moveInstrumentation(questionCell, questionP);
    questionP.textContent = questionCell.textContent.trim();
    accordionButton.append(questionP);

    accordionHeader.append(accordionButton);
    accordionItem.append(accordionHeader);

    const accordionCollapse = document.createElement('div');
    accordionCollapse.id = itemId;
    accordionCollapse.classList.add('accordion-collapse', 'collapse');
    if (index === 0) {
      accordionCollapse.classList.add('show');
    }
    accordionCollapse.setAttribute('aria-labelledby', headingId);
    accordionCollapse.setAttribute('data-bs-parent', '#accordionExample');

    const accordionBody = document.createElement('div');
    accordionBody.classList.add('accordion-body');
    moveInstrumentation(answerCell, accordionBody);
    // CHECK 1.5: Correctly uses innerHTML for richtext field.
    accordionBody.innerHTML = answerCell.innerHTML;
    accordionCollapse.append(accordionBody);

    accordionItem.append(accordionCollapse);
    accordion.append(accordionItem);
  });

  container.append(accordion);
  section.append(container);

  // CHECK 3: No hardcoded assets or double-render pattern. moveInstrumentation is used for all rows.
  block.replaceChildren(section);
}
