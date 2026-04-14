import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...faqItemRows] = [...block.children];

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  // Heading
  const sectionHeaderDiv = document.createElement('div');
  sectionHeaderDiv.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');

  const headingCell = headingRow.firstElementChild;
  if (headingCell) {
    moveInstrumentation(headingCell, heading);
    heading.textContent = headingCell.textContent.trim();
  }
  sectionHeaderDiv.append(heading);
  containerDiv.append(sectionHeaderDiv);

  // FAQs Accordion
  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');
  const ul = document.createElement('ul');

  faqItemRows.forEach((row, index) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add('aos-init', 'aos-animate');
    li.setAttribute('data-aos', 'fade-up');
    if (index === 0) {
      li.classList.add('active');
    }

    const [questionCell, answerCell] = [...row.children];

    const h2 = document.createElement('h2');
    h2.setAttribute('data-once', 'faqsAccordion');
    if (questionCell) {
      moveInstrumentation(questionCell, h2);
      h2.textContent = questionCell.textContent.trim();
    }
    li.append(h2);

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    if (index === 0) {
      accoContentDiv.classList.add('show');
    }

    if (answerCell) {
      moveInstrumentation(answerCell, accoContentDiv);
      accoContentDiv.innerHTML = answerCell.innerHTML;
    }
    li.append(accoContentDiv);
    ul.append(li);

    // Add event listener for accordion functionality
    h2.addEventListener('click', () => {
      const currentlyActive = ul.querySelector('li.active');
      if (currentlyActive && currentlyActive !== li) {
        currentlyActive.classList.remove('active');
        currentlyActive.querySelector('.acco-content-div').classList.remove('show');
      }
      li.classList.toggle('active');
      accoContentDiv.classList.toggle('show');
    });
  });

  accoDiv.append(ul);
  containerDiv.append(accoDiv);

  block.textContent = '';
  block.append(containerDiv);
}
