import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const root = document.createElement('section');
  root.classList.add('faqs-section'); // Removed 'section' as it's redundant with the element type

  const container = document.createElement('div');
  container.classList.add('container');
  root.append(container);

  // Heading
  const [headingRow, ...faqItemRows] = children; // Destructure headingRow and remaining faqItemRows
  const [headingCell] = [...headingRow.children]; // Destructure headingCell from headingRow
  if (headingCell) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.setAttribute('data-aos', 'fade-up');
    heading.textContent = headingCell.textContent.trim();
    moveInstrumentation(headingRow, heading); // Instrumentation moved from row to heading
    sectionHeader.append(heading);
    container.append(sectionHeader);
  }

  // FAQ Items
  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');
  const ul = document.createElement('ul');
  accoDiv.append(ul);

  faqItemRows.forEach((row, index) => {
    const [questionCell, answerCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('aos-init', 'aos-animate');
    li.setAttribute('data-aos', 'fade-up');
    if (index === 0) {
      li.classList.add('active'); // First item is active by default
    }

    const questionHeading = document.createElement('h2');
    questionHeading.textContent = questionCell.textContent.trim();
    questionHeading.setAttribute('data-once', 'faqsAccordion'); // From original HTML
    moveInstrumentation(questionCell, questionHeading); // Instrumentation moved from cell to heading
    li.append(questionHeading);

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    if (index === 0) {
      accoContentDiv.classList.add('show'); // First item content is shown by default
    }
    accoContentDiv.innerHTML = answerCell.innerHTML;
    moveInstrumentation(answerCell, accoContentDiv); // Instrumentation moved from cell to content div
    li.append(accoContentDiv);

    ul.append(li);

    questionHeading.addEventListener('click', () => {
      const isActive = li.classList.contains('active');
      // Close all other open accordions
      ul.querySelectorAll('li.active').forEach((activeLi) => {
        activeLi.classList.remove('active');
        activeLi.querySelector('.acco-content-div').classList.remove('show');
      });

      // Toggle current accordion
      if (!isActive) {
        li.classList.add('active');
        accoContentDiv.classList.add('show');
      }
    });
  });

  container.append(accoDiv);

  block.replaceChildren(root);

  root.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
