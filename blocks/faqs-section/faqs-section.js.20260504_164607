import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...faqItemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');

  // Heading
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  
  // Fix for CHECK 0: Avoid row.children[0] for heading
  const headingCell = [...headingRow.children].find(cell => cell.textContent.trim() !== '');
  if (headingCell) {
    heading.textContent = headingCell.textContent.trim();
    moveInstrumentation(headingCell, heading);
  }
  sectionHeader.append(heading);
  container.append(sectionHeader);

  // FAQs Accordion
  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');
  const ul = document.createElement('ul');

  faqItemRows.forEach((row, index) => {
    // Fix for CHECK 0: Avoid row.children[n] for faq items
    const cells = [...row.children];
    const questionCell = cells.find(cell => !cell.querySelector('p') && !cell.querySelector('ul')); // Assuming question is plain text
    const answerCell = cells.find(cell => cell.querySelector('p') || cell.querySelector('ul') || cell.innerHTML.trim() !== ''); // Assuming answer is richtext

    const li = document.createElement('li');
    li.classList.add('aos-init', 'aos-animate');
    li.setAttribute('data-aos', 'fade-up');
    moveInstrumentation(row, li);

    const h2 = document.createElement('h2');
    h2.setAttribute('data-once', 'faqsAccordion');
    if (questionCell) {
      h2.textContent = questionCell.textContent.trim();
      moveInstrumentation(questionCell, h2);
    }

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    if (answerCell) {
      accoContentDiv.innerHTML = answerCell.innerHTML; // CHECK 1.5: Correctly using innerHTML for richtext
      moveInstrumentation(answerCell, accoContentDiv);
    }

    li.append(h2, accoContentDiv);
    ul.append(li);

    // CHECK 2: Interactivity - Accordion toggle
    h2.addEventListener('click', () => {
      const isActive = li.classList.contains('active');
      ul.querySelectorAll('li').forEach((item) => {
        item.classList.remove('active');
        const contentDiv = item.querySelector('.acco-content-div');
        if (contentDiv) {
          contentDiv.classList.remove('show');
        }
      });

      if (!isActive) {
        li.classList.add('active');
        accoContentDiv.classList.add('show');
      }
    });

    // Set the first item as active by default, matching original HTML
    if (index === 0) {
      li.classList.add('active');
      accoContentDiv.classList.add('show');
    }
  });

  accoDiv.append(ul);
  container.append(accoDiv);
  section.append(container);
  block.replaceWith(section);

  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
