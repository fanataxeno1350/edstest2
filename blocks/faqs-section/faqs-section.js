import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...faqRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');

  const container = document.createElement('div');
  container.classList.add('container');

  // Heading
  if (headingRow) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    moveInstrumentation(headingRow, sectionHeader);

    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.setAttribute('data-aos', 'fade-up');
    const headingText = headingRow.querySelector('div')?.textContent.trim();
    if (headingText) {
      heading.textContent = headingText;
    }
    sectionHeader.append(heading);
    container.append(sectionHeader);
  }

  // FAQs Accordion
  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');
  const ul = document.createElement('ul');

  faqRows.forEach((row, index) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add('aos-init', 'aos-animate');
    li.setAttribute('data-aos', 'fade-up');

    // Make the first item active by default
    if (index === 0) {
      li.classList.add('active');
    }

    const cells = [...row.children];
    const questionCell = cells.find(cell => !cell.querySelector('p')); // Question is plain text
    const answerCell = cells.find(cell => cell.querySelector('p'));    // Answer contains <p>

    if (questionCell) {
      const questionHeading = document.createElement('h2');
      questionHeading.setAttribute('data-once', 'faqsAccordion');
      questionHeading.textContent = questionCell.textContent.trim();
      li.append(questionHeading);

      questionHeading.addEventListener('click', () => {
        const isOpen = li.classList.contains('active');
        // Close all other open items
        ul.querySelectorAll('li.active').forEach((activeLi) => {
          if (activeLi !== li) {
            activeLi.classList.remove('active');
            activeLi.querySelector('.acco-content-div')?.classList.remove('show');
          }
        });

        // Toggle current item
        li.classList.toggle('active', !isOpen);
        const contentDiv = li.querySelector('.acco-content-div');
        if (contentDiv) {
          contentDiv.classList.toggle('show', !isOpen);
        }
      });
    }

    if (answerCell) {
      const accoContentDiv = document.createElement('div');
      accoContentDiv.classList.add('acco-content-div');
      if (index === 0) {
        accoContentDiv.classList.add('show');
      }
      while (answerCell.firstChild) {
        accoContentDiv.append(answerCell.firstChild);
      }
      li.append(accoContentDiv);
    }

    ul.append(li);
  });

  accoDiv.append(ul);
  container.append(accoDiv);
  section.append(container);

  block.textContent = '';
  block.append(section);

  // No images to optimize in this block
}
