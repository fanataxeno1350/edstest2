import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...faqItemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Section Header
  if (headingRow) {
    const headingCell = headingRow.firstElementChild;
    if (headingCell) {
      const sectionHeader = document.createElement('div');
      sectionHeader.classList.add('section-header', 'text-center');

      const heading = document.createElement('h2');
      heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
      heading.setAttribute('data-aos', 'fade-up');
      heading.textContent = headingCell.textContent.trim();
      moveInstrumentation(headingRow, heading); // Move instrumentation from headingRow to heading
      sectionHeader.append(heading);
      container.append(sectionHeader);
    }
  }

  // FAQs Accordion
  if (faqItemRows.length > 0) {
    const accoDiv = document.createElement('div');
    accoDiv.classList.add('acco-div');

    const ul = document.createElement('ul');

    faqItemRows.forEach((row, index) => {
      // Use content detection for question and answer cells
      const cells = [...row.children];
      const questionCell = cells.find(cell => cell.textContent.trim() !== '' && !cell.querySelector('p'));
      const answerCell = cells.find(cell => cell.querySelector('p') || cell.innerHTML.trim() !== '');

      if (!questionCell || !answerCell) {
        // Skip malformed rows
        return;
      }

      const li = document.createElement('li');
      li.classList.add('aos-init', 'aos-animate');
      li.setAttribute('data-aos', 'fade-up');
      if (index === 0) {
        li.classList.add('active');
      }

      const h2 = document.createElement('h2');
      h2.textContent = questionCell.textContent.trim();
      h2.setAttribute('data-once', 'faqsAccordion');
      moveInstrumentation(questionCell, h2); // Move instrumentation from questionCell to h2

      const accoContentDiv = document.createElement('div');
      accoContentDiv.classList.add('acco-content-div');
      if (index === 0) {
        accoContentDiv.classList.add('show');
      }
      accoContentDiv.innerHTML = answerCell.innerHTML;
      moveInstrumentation(answerCell, accoContentDiv); // Move instrumentation from answerCell to accoContentDiv

      h2.addEventListener('click', () => {
        const isActive = li.classList.contains('active');

        // Close all other open accordions
        ul.querySelectorAll('li.active').forEach((activeLi) => {
          activeLi.classList.remove('active');
          activeLi.querySelector('.acco-content-div').classList.remove('show');
        });

        // Toggle current accordion
        if (!isActive) {
          li.classList.add('active');
          accoContentDiv.classList.add('show');
        }
      });

      li.append(h2, accoContentDiv);
      ul.append(li);
    });
    accoDiv.append(ul);
    container.append(accoDiv);
  }

  block.replaceWith(section);
}
