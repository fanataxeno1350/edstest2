import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const [headingRow, ...accordionItemRows] = children;

  const section = document.createElement('section');
  // section.classList.add('faqs'); // Removed: block already has 'faqs' class from AEM
  moveInstrumentation(block, section);

  // Section Heading
  const heading = document.createElement('h2');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  section.append(heading);

  const container = document.createElement('div');
  container.classList.add('container', 'faq-accordion');

  const accordionDiv = document.createElement('div');
  accordionDiv.classList.add('accordion');
  accordionDiv.id = 'accordionExample';

  accordionItemRows.forEach((row, index) => {
    const [questionCell, answerCell] = [...row.children];

    const accordionItem = document.createElement('div');
    accordionItem.classList.add('accordion-item', 'shadow');
    moveInstrumentation(row, accordionItem);

    const headingId = `heading${index + 1}`;
    const collapseId = `collapse${index + 1}`;

    const h2 = document.createElement('h2');
    h2.classList.add('accordion-header');
    h2.id = headingId;

    const button = document.createElement('button');
    button.classList.add('accordion-button', 'd-flex', 'align-items-center');
    if (index !== 0) { // Add 'collapsed' class for all but the first item
      button.classList.add('collapsed');
    }
    button.type = 'button';
    button.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
    button.setAttribute('aria-controls', collapseId);

    // Add event listener for accordion collapse functionality
    button.addEventListener('click', () => {
      const targetCollapse = document.getElementById(collapseId);
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      // Close all other open accordions
      accordionDiv.querySelectorAll('.accordion-collapse.show').forEach((openCollapse) => {
        if (openCollapse !== targetCollapse) {
          openCollapse.classList.remove('show');
          const openButton = openCollapse.previousElementSibling.querySelector('.accordion-button');
          if (openButton) {
            openButton.classList.add('collapsed'); // Ensure other buttons are collapsed
            openButton.setAttribute('aria-expanded', 'false');
          }
        }
      });

      // Toggle current accordion
      targetCollapse.classList.toggle('show');
      button.classList.toggle('collapsed', isExpanded); // Toggle 'collapsed' class based on new state
      button.setAttribute('aria-expanded', (!isExpanded).toString());
    });

    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-circle" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
        <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"></path>
      </svg>
    `;
    button.innerHTML = svgIcon;

    const questionP = document.createElement('p');
    questionP.classList.add('m-0', 'ms-3');
    questionP.textContent = questionCell.textContent.trim();
    button.append(questionP);

    h2.append(button);

    const collapseDiv = document.createElement('div');
    collapseDiv.id = collapseId;
    collapseDiv.classList.add('accordion-collapse', 'collapse');
    if (index === 0) {
      collapseDiv.classList.add('show');
    }
    collapseDiv.setAttribute('aria-labelledby', headingId);
    collapseDiv.setAttribute('data-bs-parent', '#accordionExample');

    const accordionBody = document.createElement('div');
    accordionBody.classList.add('accordion-body');
    accordionBody.innerHTML = answerCell.innerHTML;
    collapseDiv.append(accordionBody);

    accordionItem.append(h2, collapseDiv);
    accordionDiv.append(accordionItem);
  });

  container.append(accordionDiv);
  section.append(container);

  block.replaceChildren(section);

  // Removed unnecessary picture optimization as there are no pictures in this block's model
  // section.querySelectorAll('picture > img').forEach((img) => {
  //   const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  //   moveInstrumentation(img, optimizedPic.querySelector('img'));
  //   img.closest('picture').replaceWith(optimizedPic);
  // });
}
