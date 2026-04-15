import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...faqItemRows] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('container');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up'); // Added from original HTML
  moveInstrumentation(headingRow.children[0], heading); // Changed from firstElementChild for consistency
  heading.textContent = headingRow.children[0]?.textContent.trim() || '';
  sectionHeader.appendChild(heading);
  container.appendChild(sectionHeader);

  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');
  const ul = document.createElement('ul');

  faqItemRows.forEach((row, index) => {
    const [questionCell, answerCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('aos-init', 'aos-animate');
    li.setAttribute('data-aos', 'fade-up'); // Added from original HTML
    if (index === 0) {
      li.classList.add('active');
    }

    const h2Question = document.createElement('h2');
    h2Question.setAttribute('data-once', 'faqsAccordion'); // Added from original HTML
    moveInstrumentation(questionCell, h2Question);
    h2Question.textContent = questionCell.textContent.trim();

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    if (index === 0) {
      accoContentDiv.classList.add('show');
    }
    moveInstrumentation(answerCell, accoContentDiv);
    accoContentDiv.innerHTML = answerCell.innerHTML;

    h2Question.addEventListener('click', () => {
      const currentlyActive = ul.querySelector('li.active');
      const currentlyShownContent = ul.querySelector('.acco-content-div.show');

      if (currentlyActive && currentlyActive !== li) {
        currentlyActive.classList.remove('active');
      }
      if (currentlyShownContent && currentlyShownContent !== accoContentDiv) {
        currentlyShownContent.classList.remove('show');
      }

      li.classList.toggle('active');
      accoContentDiv.classList.toggle('show');
    });

    li.appendChild(h2Question);
    li.appendChild(accoContentDiv);
    ul.appendChild(li);
  });

  accoDiv.appendChild(ul);
  container.appendChild(accoDiv);

  block.innerHTML = '';
  block.classList.add('section', 'faqs-section');
  block.appendChild(container);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
