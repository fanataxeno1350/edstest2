import { moveInstrumentation } from '../../scripts/scripts.js';

// Function to generate the SVG icon
function createQuestionCircleSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('fill', 'currentColor');
  svg.classList.add('bi', 'bi-question-circle');
  svg.setAttribute('viewBox', '0 0 16 16');

  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttribute('d', 'M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z');
  svg.append(path1);

  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path2.setAttribute('d', 'M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z');
  svg.append(path2);

  return svg;
}

export default function decorate(block) {
  const children = [...block.children];

  const sectionTitleRow = children[0];
  const faqItemRows = children.slice(1);

  const root = document.createElement('section');
  // root.classList.add('faqs'); // Removed: block already has this class from AEM

  // FAQs Section Title
  const title = document.createElement('h2');
  moveInstrumentation(sectionTitleRow, title);
  title.textContent = sectionTitleRow.textContent.trim();
  root.append(title);

  const container = document.createElement('div');
  container.classList.add('container', 'faq-accordion');

  const accordion = document.createElement('div');
  accordion.classList.add('accordion');
  accordion.id = 'accordionExample';

  faqItemRows.forEach((row, index) => {
    const [questionCell, answerCell] = [...row.children];

    const accordionItem = document.createElement('div');
    accordionItem.classList.add('accordion-item', 'shadow');

    const accordionHeader = document.createElement('h2');
    accordionHeader.classList.add('accordion-header');
    accordionHeader.id = `heading${index + 1}`;

    const accordionButton = document.createElement('button');
    accordionButton.classList.add('accordion-button', 'd-flex', 'align-items-center');
    accordionButton.type = 'button';
    accordionButton.setAttribute('data-bs-toggle', 'collapse'); // Added for Bootstrap compatibility
    accordionButton.setAttribute('data-bs-target', `#collapse${index + 1}`); // Added for Bootstrap compatibility
    accordionButton.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
    accordionButton.setAttribute('aria-controls', `collapse${index + 1}`);

    // Append SVG icon
    accordionButton.append(createQuestionCircleSVG());

    const questionText = document.createElement('p');
    questionText.classList.add('m-0', 'ms-3');
    questionText.textContent = questionCell.textContent.trim();
    accordionButton.append(questionText);

    if (index !== 0) {
      accordionButton.classList.add('collapsed');
    }

    accordionHeader.append(accordionButton);

    const accordionCollapse = document.createElement('div');
    accordionCollapse.classList.add('accordion-collapse', 'collapse');
    accordionCollapse.id = `collapse${index + 1}`;
    accordionCollapse.setAttribute('aria-labelledby', `heading${index + 1}`);
    accordionCollapse.setAttribute('data-bs-parent', '#accordionExample');

    if (index === 0) {
      accordionCollapse.classList.add('show');
    }

    const accordionBody = document.createElement('div');
    accordionBody.classList.add('accordion-body');
    accordionBody.innerHTML = answerCell.innerHTML; // richtext content

    accordionCollapse.append(accordionBody);

    accordionItem.append(accordionHeader, accordionCollapse);
    accordion.append(accordionItem);

    moveInstrumentation(row, accordionItem); // Move instrumentation from original row to new accordion item

    // Add event listener for collapse toggle (manual toggle for non-bootstrap JS)
    accordionButton.addEventListener('click', () => {
      const isExpanded = accordionButton.getAttribute('aria-expanded') === 'true';
      accordionButton.setAttribute('aria-expanded', !isExpanded);
      accordionButton.classList.toggle('collapsed', isExpanded);
      accordionCollapse.classList.toggle('show');

      // Close other open accordions
      accordion.querySelectorAll('.accordion-collapse.show').forEach((openCollapse) => {
        if (openCollapse !== accordionCollapse) {
          openCollapse.classList.remove('show');
          const correspondingButton = openCollapse.previousElementSibling.querySelector('.accordion-button');
          if (correspondingButton) {
            correspondingButton.setAttribute('aria-expanded', 'false');
            correspondingButton.classList.add('collapsed');
          }
        }
      });
    });
  });

  container.append(accordion);
  root.append(container);

  block.replaceChildren(root);
}
