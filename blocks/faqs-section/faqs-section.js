import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...faqItemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  container.append(sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  moveInstrumentation(headingRow.firstElementChild, heading);
  heading.textContent = headingRow.firstElementChild.textContent.trim();
  sectionHeader.append(heading);

  // FAQs Accordion
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
    if (index === 0) {
      li.classList.add('active');
    }
    moveInstrumentation(row, li);
    ul.append(li);

    const questionHeading = document.createElement('h2');
    questionHeading.setAttribute('data-once', 'faqsAccordion');
    moveInstrumentation(questionCell, questionHeading);
    questionHeading.textContent = questionCell.textContent.trim();
    li.append(questionHeading);

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    if (index === 0) {
      accoContentDiv.classList.add('show');
    }
    moveInstrumentation(answerCell, accoContentDiv);
    accoContentDiv.innerHTML = answerCell.innerHTML;
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
  });

  block.replaceWith(section);

  // Image optimization
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
