import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...faqItemRows] = [...block.children];

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);
  containerDiv.append(sectionHeader);

  // Accordion Div
  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');
  const ul = document.createElement('ul');

  faqItemRows.forEach((row, index) => {
    const [questionCell, answerCell] = [...row.children];

    const li = document.createElement('li');
    if (index === 0) {
      li.classList.add('active'); // First item is active by default
    }

    const questionHeading = document.createElement('h2');
    questionHeading.setAttribute('data-once', 'faqsAccordion');
    moveInstrumentation(questionCell, questionHeading);
    questionHeading.textContent = questionCell.textContent.trim();

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    if (index === 0) {
      accoContentDiv.classList.add('show');
    }
    moveInstrumentation(answerCell, accoContentDiv);
    accoContentDiv.innerHTML = answerCell.innerHTML;

    questionHeading.addEventListener('click', () => {
      const currentlyActive = ul.querySelector('li.active');
      if (currentlyActive && currentlyActive !== li) {
        currentlyActive.classList.remove('active');
        currentlyActive.querySelector('.acco-content-div').classList.remove('show');
      }
      li.classList.toggle('active');
      accoContentDiv.classList.toggle('show');
    });

    li.append(questionHeading, accoContentDiv);
    ul.append(li);
  });

  accoDiv.append(ul);
  containerDiv.append(accoDiv);

  block.replaceChildren(containerDiv);

  // Image optimization (if any images were present in the answer richtext)
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
