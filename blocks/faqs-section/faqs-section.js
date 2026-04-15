import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Heading
  const headingRow = rows.shift(); // First row is always the heading
  if (headingRow) {
    const headingCell = headingRow.firstElementChild;
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.textContent = headingCell.textContent.trim();
    moveInstrumentation(headingRow, heading);
    sectionHeader.append(heading);
    container.append(sectionHeader);
  }

  // FAQs
  if (rows.length > 0) {
    const accoDiv = document.createElement('div');
    accoDiv.classList.add('acco-div');
    const ul = document.createElement('ul');
    accoDiv.append(ul);

    rows.forEach((row, index) => {
      const [questionCell, answerCell] = [...row.children];

      const li = document.createElement('li');
      li.classList.add('aos-init', 'aos-animate');
      if (index === 0) {
        li.classList.add('active'); // First item is active by default
      }

      const h2 = document.createElement('h2');
      h2.textContent = questionCell.textContent.trim();
      moveInstrumentation(questionCell, h2);
      li.append(h2);

      const accoContentDiv = document.createElement('div');
      accoContentDiv.classList.add('acco-content-div');
      if (index === 0) {
        accoContentDiv.classList.add('show'); // First item content is shown by default
      }
      accoContentDiv.innerHTML = answerCell.innerHTML;
      moveInstrumentation(answerCell, accoContentDiv);
      li.append(accoContentDiv);

      h2.addEventListener('click', () => {
        const currentlyActive = ul.querySelector('li.active');
        if (currentlyActive && currentlyActive !== li) {
          currentlyActive.classList.remove('active');
          currentlyActive.querySelector('.acco-content-div').classList.remove('show');
        }
        li.classList.toggle('active');
        accoContentDiv.classList.toggle('show');
      });

      ul.append(li);
    });
    container.append(accoDiv);
  }

  block.innerHTML = '';
  block.append(section);
}
