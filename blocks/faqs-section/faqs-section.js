import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...faqItemRows] = [...block.children];

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  // CHECK 0 & 1.5 FIX: Use content detection for the heading cell instead of firstElementChild
  const headingCell = [...headingRow.children].find(cell => cell.textContent.trim());
  if (headingCell) {
    heading.textContent = headingCell.textContent.trim();
  }
  sectionHeader.append(heading);

  // Accordion Container
  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');

  const ul = document.createElement('ul');

  faqItemRows.forEach((row) => {
    // CHECK 0: This destructuring is correct as per EDS block structure for fixed-field item models.
    const [questionCell, answerCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('aos-init', 'aos-animate');
    li.setAttribute('data-aos', 'fade-up');
    moveInstrumentation(row, li);

    const questionHeading = document.createElement('h2');
    questionHeading.setAttribute('data-once', 'faqsAccordion');
    questionHeading.textContent = questionCell.textContent.trim();
    li.append(questionHeading);

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    // CHECK 1.5: Correctly using innerHTML for richtext field 'answer'
    accoContentDiv.innerHTML = answerCell.innerHTML;
    li.append(accoContentDiv);

    // CHECK 2: Add click listener for accordion behavior
    questionHeading.addEventListener('click', () => {
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

  accoDiv.append(ul);

  const container = document.createElement('div');
  container.classList.add('container');
  container.append(sectionHeader, accoDiv);

  block.textContent = '';
  block.classList.add('section', 'faqs-section'); // Add section class to the block itself
  block.append(container);
}
