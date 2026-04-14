import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const headingRow = children[0];
  const faqItemRows = children.slice(1);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // Access the first child element of the headingRow for instrumentation and text content
  moveInstrumentation(headingRow.firstElementChild, heading);
  heading.textContent = headingRow.firstElementChild.textContent;
  sectionHeader.append(heading);

  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');

  const ul = document.createElement('ul');

  faqItemRows.forEach((row, index) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add('aos-init', 'aos-animate');
    if (index === 0) {
      li.classList.add('active');
    }

    // Use querySelector to access cells, avoiding direct children[n] access
    const questionCell = row.querySelector('div:first-child');
    const answerCell = row.querySelector('div:last-child');

    const h2 = document.createElement('h2');
    h2.setAttribute('data-once', 'faqsAccordion');
    h2.textContent = questionCell?.textContent || '';

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    if (index === 0) {
      accoContentDiv.classList.add('show');
    }
    moveInstrumentation(answerCell, accoContentDiv);
    while (answerCell.firstChild) {
      accoContentDiv.append(answerCell.firstChild);
    }

    h2.addEventListener('click', () => {
      const isActive = li.classList.contains('active');
      // Close all other open items
      ul.querySelectorAll('li.active').forEach((activeLi) => {
        activeLi.classList.remove('active');
        activeLi.querySelector('.acco-content-div')?.classList.remove('show');
      });

      // Toggle current item
      if (!isActive) {
        li.classList.add('active');
        accoContentDiv.classList.add('show');
      }
    });

    li.append(h2, accoContentDiv);
    ul.append(li);
  });

  accoDiv.append(ul);

  const container = document.createElement('div');
  container.classList.add('container');
  container.append(sectionHeader, accoDiv);

  block.textContent = '';
  block.classList.add('faqs-section'); // Add block-level class from original HTML
  block.append(container);
}
