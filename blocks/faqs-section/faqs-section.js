import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const [headingRow, ...faqRows] = [...block.children];

  // Heading
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  
  // FIX: Replaced headingRow.children[0] with content detection
  const headingCell = [...headingRow.children].find(cell => cell.textContent.trim());
  if (headingCell) {
    heading.textContent = headingCell.textContent.trim();
    moveInstrumentation(headingRow, heading);
  }
  
  sectionHeader.append(heading);
  container.append(sectionHeader);

  // FAQs Accordion
  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');
  const ul = document.createElement('ul');
  accoDiv.append(ul);

  faqRows.forEach((row, index) => {
    const [questionCell, answerCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('aos-init', 'aos-animate');
    li.setAttribute('data-aos', 'fade-up');
    if (index === 0) {
      li.classList.add('active');
    }

    const h2 = document.createElement('h2');
    h2.setAttribute('data-once', 'faqsAccordion');
    h2.textContent = questionCell.textContent.trim();
    moveInstrumentation(questionCell, h2);

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    if (index === 0) {
      accoContentDiv.classList.add('show');
    }
    accoContentDiv.innerHTML = answerCell.innerHTML;
    moveInstrumentation(answerCell, accoContentDiv);

    li.append(h2, accoContentDiv);
    ul.append(li);

    h2.addEventListener('click', () => {
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
  });

  container.append(accoDiv);
  block.replaceWith(section);
}
