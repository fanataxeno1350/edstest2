import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...faqRows] = [...block.children];

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  // Heading
  const sectionHeaderDiv = document.createElement('div');
  sectionHeaderDiv.classList.add('section-header', 'text-center');
  const h2Heading = document.createElement('h2');
  h2Heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow.firstElementChild, h2Heading);
  h2Heading.textContent = headingRow.firstElementChild.textContent;
  h2Heading.setAttribute('data-aos', 'fade-up');
  sectionHeaderDiv.append(h2Heading);
  containerDiv.append(sectionHeaderDiv);

  // FAQs Accordion
  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');
  const ul = document.createElement('ul');

  faqRows.forEach((row, index) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add('aos-init', 'aos-animate');
    li.setAttribute('data-aos', 'fade-up');

    const [questionCell, answerCell] = [...row.children];

    const h2Question = document.createElement('h2');
    h2Question.setAttribute('data-once', 'faqsAccordion');
    moveInstrumentation(questionCell, h2Question);
    h2Question.textContent = questionCell.textContent;

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    moveInstrumentation(answerCell, accoContentDiv);
    // Use innerHTML for richtext to preserve any nested HTML (e.g., <p>, <a>)
    accoContentDiv.innerHTML = answerCell.innerHTML;

    li.append(h2Question, accoContentDiv);
    ul.append(li);

    // Add click listener for accordion behavior
    h2Question.addEventListener('click', () => {
      const isActive = li.classList.contains('active');

      // Close all other open accordions
      ul.querySelectorAll('li.active').forEach((activeLi) => {
        if (activeLi !== li) {
          activeLi.classList.remove('active');
          activeLi.querySelector('.acco-content-div').classList.remove('show');
        }
      });

      // Toggle current accordion
      li.classList.toggle('active', !isActive);
      accoContentDiv.classList.toggle('show', !isActive);
    });

    // Set the first item as active initially if it's the first one
    if (index === 0) {
      li.classList.add('active');
      accoContentDiv.classList.add('show');
    }
  });

  accoDiv.append(ul);
  containerDiv.append(accoDiv);

  block.textContent = '';
  block.append(containerDiv);
}
