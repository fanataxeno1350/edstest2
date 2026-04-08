import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...faqRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Heading
  if (headingRow) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    moveInstrumentation(headingRow, sectionHeader);

    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.setAttribute('data-aos', 'fade-up');
    while (headingRow.firstChild) heading.append(headingRow.firstChild);
    sectionHeader.append(heading);
    container.append(sectionHeader);
  }

  // FAQs
  if (faqRows.length > 0) {
    const accoDiv = document.createElement('div');
    accoDiv.classList.add('acco-div');
    const ul = document.createElement('ul');
    accoDiv.append(ul);

    faqRows.forEach((row, index) => {
      const li = document.createElement('li');
      moveInstrumentation(row, li);
      li.classList.add('aos-init', 'aos-animate');
      li.setAttribute('data-aos', 'fade-up');
      if (index === 0) {
        li.classList.add('active');
      }

      const cells = [...row.children];
      const questionCell = cells[0]; // Based on BlockJson, question is always the first cell
      const answerCell = cells[1];   // Based on BlockJson, answer is always the second cell

      let questionEl;
      let answerEl;

      if (questionCell) {
        questionEl = document.createElement('h2');
        questionEl.setAttribute('data-once', 'faqsAccordion');
        moveInstrumentation(questionCell, questionEl);
        while (questionCell.firstChild) questionEl.append(questionCell.firstChild);
      }

      if (answerCell) {
        answerEl = document.createElement('div');
        answerEl.classList.add('acco-content-div');
        if (index === 0) {
          answerEl.classList.add('show');
        }
        moveInstrumentation(answerCell, answerEl);
        while (answerCell.firstChild) answerEl.append(answerCell.firstChild);
      }

      if (questionEl) {
        li.append(questionEl);
        questionEl.addEventListener('click', () => {
          const currentActive = ul.querySelector('li.active');
          if (currentActive && currentActive !== li) {
            currentActive.classList.remove('active');
            currentActive.querySelector('.acco-content-div').classList.remove('show');
          }
          li.classList.toggle('active');
          answerEl.classList.toggle('show');
        });
      }
      if (answerEl) {
        li.append(answerEl);
      }
      ul.append(li);
    });
    container.append(accoDiv);
  }

  block.textContent = '';
  block.append(section);
}
