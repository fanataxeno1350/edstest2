import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...faqRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  if (headingRow) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    moveInstrumentation(headingRow, sectionHeader);

    // CRITICAL FIX: Replaced headingRow.children[0] with content detection
    const headingCell = [...headingRow.children].find(cell => cell.textContent.trim());
    if (headingCell) {
      const heading = document.createElement('h2');
      heading.classList.add('heading', 'font-regular');
      heading.textContent = headingCell.textContent.trim();
      sectionHeader.append(heading);
    }
    container.append(sectionHeader);
  }

  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');
  container.append(accoDiv);

  const ul = document.createElement('ul');
  accoDiv.append(ul);

  faqRows.forEach((row, index) => {
    // This destructuring is correct because the model defines fixed fields for faq-item
    const [questionCell, answerCell] = [...row.children];

    const li = document.createElement('li');
    moveInstrumentation(row, li);
    ul.append(li);

    const question = document.createElement('h2');
    question.textContent = questionCell?.textContent.trim();
    li.append(question);

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    accoContentDiv.innerHTML = answerCell?.innerHTML; // Correctly using innerHTML for richtext
    li.append(accoContentDiv);

    if (index === 0) {
      li.classList.add('active');
      accoContentDiv.classList.add('show');
    }

    question.addEventListener('click', () => {
      const isActive = li.classList.contains('active');

      // Close all other active items
      ul.querySelectorAll('li.active').forEach((activeLi) => {
        activeLi.classList.remove('active');
        activeLi.querySelector('.acco-content-div').classList.remove('show');
      });

      // Toggle current item
      if (!isActive) {
        li.classList.add('active');
        accoContentDiv.classList.add('show');
      }
    });
  });

  block.innerHTML = '';
  block.append(section);
}
