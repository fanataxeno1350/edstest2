import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // block.classList.add('faqs'); // The outer block div already carries this class from AEM.

  const children = [...block.children];
  const root = document.createElement('div');
  root.classList.add('container'); // From ORIGINAL HTML

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center'); // From ORIGINAL HTML
  root.append(sectionHeader);

  const [headingRow, ...faqItemRows] = children;

  if (headingRow) {
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate'); // From ORIGINAL HTML
    heading.setAttribute('data-aos', 'fade-up'); // From ORIGINAL HTML
    moveInstrumentation(headingRow, heading);
    heading.textContent = headingRow.textContent.trim();
    sectionHeader.append(heading);
  }

  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div'); // From ORIGINAL HTML
  root.append(accoDiv);

  const ul = document.createElement('ul');
  accoDiv.append(ul);

  faqItemRows.forEach((row, index) => {
    const [questionCell, answerCell] = [...row.children]; // Correct: index destructuring for fixed schema

    const li = document.createElement('li');
    li.classList.add('aos-init', 'aos-animate'); // From ORIGINAL HTML
    li.setAttribute('data-aos', 'fade-up'); // From ORIGINAL HTML
    if (index === 0) {
      li.classList.add('active'); // From ORIGINAL HTML
    }
    moveInstrumentation(row, li);

    const questionHeading = document.createElement('h2');
    questionHeading.setAttribute('data-once', 'faqsAccordion'); // From ORIGINAL HTML
    questionHeading.textContent = questionCell?.textContent.trim() || '';
    li.append(questionHeading);

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div'); // From ORIGINAL HTML
    if (index === 0) {
      accoContentDiv.classList.add('show'); // From ORIGINAL HTML
    }
    accoContentDiv.innerHTML = answerCell?.innerHTML || ''; // Correct: richtext field uses innerHTML
    li.append(accoContentDiv);

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

  block.replaceChildren(root);

  root.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
