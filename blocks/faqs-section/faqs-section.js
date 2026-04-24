import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');

  const container = document.createElement('div');
  container.classList.add('container');

  // Heading row - detect by checking if it's the only row with a single cell
  const headingRow = children.find(row => row.children.length === 1);
  if (headingRow) {
    const headingCell = headingRow.querySelector('div');
    if (headingCell) {
      const sectionHeader = document.createElement('div');
      sectionHeader.classList.add('section-header', 'text-center');

      const h2 = document.createElement('h2');
      h2.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
      h2.setAttribute('data-aos', 'fade-up');
      h2.textContent = headingCell.textContent.trim();
      moveInstrumentation(headingRow, h2);

      sectionHeader.append(h2);
      container.append(sectionHeader);
    }
  }

  // FAQs items
  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');
  const ul = document.createElement('ul');

  // Filter out the heading row to process only FAQ items
  const faqRows = children.filter(row => row.children.length === 2);

  faqRows.forEach((row, index) => {
    const [questionCell, answerCell] = [...row.children]; // Corrected: using destructuring

    const li = document.createElement('li');
    li.classList.add('aos-init', 'aos-animate');
    li.setAttribute('data-aos', 'fade-up');
    if (index === 0) {
      li.classList.add('active');
    }

    const h2Question = document.createElement('h2');
    h2Question.textContent = questionCell.textContent.trim();
    h2Question.setAttribute('data-once', 'faqsAccordion');
    moveInstrumentation(questionCell, h2Question);

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    if (index === 0) {
      accoContentDiv.classList.add('show');
    }
    accoContentDiv.innerHTML = answerCell.innerHTML; // Correctly using innerHTML for richtext
    moveInstrumentation(answerCell, accoContentDiv);

    h2Question.addEventListener('click', () => {
      const currentActive = ul.querySelector('li.active');
      const currentShow = ul.querySelector('.acco-content-div.show');

      if (currentActive && currentActive !== li) {
        currentActive.classList.remove('active');
        currentShow.classList.remove('show');
      }

      li.classList.toggle('active');
      accoContentDiv.classList.toggle('show');
    });

    li.append(h2Question, accoContentDiv);
    ul.append(li);
  });

  accoDiv.append(ul);
  container.append(accoDiv);
  section.append(container);
  block.replaceWith(section);
}
