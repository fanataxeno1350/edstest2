import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...faqItemRows] = [...block.children];

  // Section wrapper
  block.classList.add('section', 'faqs-section');
  const container = document.createElement('div');
  container.classList.add('container');

  // Heading
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // CHECK 0 & 1.5: Changed from .firstElementChild to .children[0] as per EDS block structure for fixed fields
  moveInstrumentation(headingRow.children[0], heading);
  heading.textContent = headingRow.children[0].textContent.trim();
  sectionHeader.append(heading);
  container.append(sectionHeader);

  // FAQs Accordion
  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');
  const ul = document.createElement('ul');

  faqItemRows.forEach((row, index) => {
    // CHECK 0: Correctly uses array destructuring for fixed fields
    const [questionCell, answerCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('aos-init', 'aos-animate');
    if (index === 0) {
      li.classList.add('active'); // First item is active by default
    }

    const h2 = document.createElement('h2');
    // CHECK 1.5: Correctly uses moveInstrumentation for text content
    moveInstrumentation(questionCell, h2);
    h2.textContent = questionCell.textContent.trim();

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    if (index === 0) {
      accoContentDiv.classList.add('show');
    }
    // CHECK 1.5: Correctly uses moveInstrumentation for richtext content
    moveInstrumentation(answerCell, accoContentDiv);
    // CHECK 1.5: Correctly uses innerHTML for richtext content
    accoContentDiv.innerHTML = answerCell.innerHTML;

    // CHECK 2: Interactivity - Accordion click listener
    h2.addEventListener('click', () => {
      const currentlyActive = ul.querySelector('li.active');
      const currentlyOpenContent = ul.querySelector('.acco-content-div.show');

      if (currentlyActive && currentlyActive !== li) {
        currentlyActive.classList.remove('active');
        currentlyOpenContent.classList.remove('show');
      }

      li.classList.toggle('active');
      accoContentDiv.classList.toggle('show');
    });

    li.append(h2, accoContentDiv);
    ul.append(li);
  });

  accoDiv.append(ul);
  container.append(accoDiv);
  block.replaceChildren(container);

  // Image optimization (if any images were present, though not in this specific block structure)
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
