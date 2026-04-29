import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...faqRows] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('container');
  moveInstrumentation(block, container);

  if (headingRow) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    moveInstrumentation(headingRow, sectionHeader);

    const headingCell = [...headingRow.children].find((cell) => cell.textContent.trim());
    if (headingCell) {
      const heading = document.createElement('h2');
      heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
      heading.textContent = headingCell.textContent.trim();
      sectionHeader.append(heading);
    }
    container.append(sectionHeader);
  }

  if (faqRows.length > 0) {
    const accoDiv = document.createElement('div');
    accoDiv.classList.add('acco-div');

    const ul = document.createElement('ul');

    faqRows.forEach((row, index) => {
      const [questionCell, answerCell] = [...row.children];

      const li = document.createElement('li');
      li.classList.add('aos-init', 'aos-animate');
      moveInstrumentation(row, li);

      const h2 = document.createElement('h2');
      h2.textContent = questionCell?.textContent.trim();
      h2.addEventListener('click', () => {
        li.classList.toggle('active');
        const accoContentDiv = li.querySelector('.acco-content-div');
        if (accoContentDiv) {
          accoContentDiv.classList.toggle('show');
        }
      });
      li.append(h2);

      const accoContentDiv = document.createElement('div');
      accoContentDiv.classList.add('acco-content-div');
      accoContentDiv.innerHTML = answerCell?.innerHTML;
      li.append(accoContentDiv);

      if (index === 0) {
        li.classList.add('active');
        accoContentDiv.classList.add('show');
      }

      ul.append(li);
    });
    accoDiv.append(ul);
    container.append(accoDiv);
  }

  block.innerHTML = '';
  block.classList.add('section', 'faqs-section');
  block.append(container);
}
