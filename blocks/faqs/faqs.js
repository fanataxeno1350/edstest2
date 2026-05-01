import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...faqItemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  if (headingRow) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    moveInstrumentation(headingRow, sectionHeader);

    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.setAttribute('data-aos', 'fade-up');
    // Access the text content from the first cell of the headingRow
    const headingCell = headingRow.children[0];
    heading.textContent = headingCell?.textContent.trim() || '';
    sectionHeader.append(heading);
    container.append(sectionHeader);
  }

  if (faqItemRows.length > 0) {
    const accoDiv = document.createElement('div');
    accoDiv.classList.add('acco-div');
    container.append(accoDiv);

    const ul = document.createElement('ul');
    accoDiv.append(ul);

    faqItemRows.forEach((row, index) => {
      const [questionCell, answerCell] = [...row.children];

      const li = document.createElement('li');
      li.classList.add('aos-init', 'aos-animate');
      li.setAttribute('data-aos', 'fade-up');
      moveInstrumentation(row, li);

      const question = document.createElement('h2');
      question.setAttribute('data-once', 'faqsAccordion'); // Added from ORIGINAL HTML
      question.textContent = questionCell?.textContent.trim() || '';
      li.append(question);

      const accoContentDiv = document.createElement('div');
      accoContentDiv.classList.add('acco-content-div');
      accoContentDiv.innerHTML = answerCell?.innerHTML || '';
      li.append(accoContentDiv);

      // Add click listener for accordion behavior
      question.addEventListener('click', () => {
        const isActive = li.classList.contains('active');
        // Close all other open accordions
        ul.querySelectorAll('li.active').forEach((activeLi) => {
          activeLi.classList.remove('active');
          activeLi.querySelector('.acco-content-div')?.classList.remove('show');
        });

        // Toggle current accordion
        if (!isActive) {
          li.classList.add('active');
          accoContentDiv.classList.add('show');
        }
      });

      // Set the first item to be active by default if no item is active
      if (index === 0) {
        li.classList.add('active');
        accoContentDiv.classList.add('show');
      }

      ul.append(li);
    });
  }

  block.replaceChildren(section);

  // Image optimization for any pictures inside the rich text answers
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
