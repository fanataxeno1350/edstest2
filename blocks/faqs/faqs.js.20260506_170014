import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Section Heading
  const headingRow = children.shift();
  if (headingRow) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');

    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.setAttribute('data-aos', 'fade-up');
    moveInstrumentation(headingRow, heading);
    // FIX: headingRow is a row, not a cell. Read textContent from the cell directly.
    heading.textContent = headingRow.children[0]?.textContent.trim() || '';
    sectionHeader.append(heading);
    container.append(sectionHeader);
  }

  // FAQ Items
  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');
  container.append(accoDiv);

  const ul = document.createElement('ul');
  accoDiv.append(ul);

  children.forEach((row, index) => {
    const [questionCell, answerCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('aos-init', 'aos-animate');
    li.setAttribute('data-aos', 'fade-up');
    if (index === 0) {
      li.classList.add('active');
    }

    const question = document.createElement('h2');
    question.setAttribute('data-once', 'faqsAccordion');
    question.textContent = questionCell?.textContent.trim() || '';
    moveInstrumentation(questionCell, question);
    li.append(question);

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    if (index === 0) {
      accoContentDiv.classList.add('show');
    }
    moveInstrumentation(answerCell, accoContentDiv);
    accoContentDiv.innerHTML = answerCell?.innerHTML || '';
    li.append(accoContentDiv);

    ul.append(li);
  });

  // Add event listener for accordion behavior
  ul.querySelectorAll('li h2').forEach((h2) => {
    h2.addEventListener('click', () => {
      const li = h2.closest('li');
      const accoContentDiv = li.querySelector('.acco-content-div');

      if (li.classList.contains('active')) {
        li.classList.remove('active');
        accoContentDiv.classList.remove('show');
      } else {
        // Close other open accordions
        ul.querySelectorAll('li.active').forEach((activeLi) => {
          activeLi.classList.remove('active');
          activeLi.querySelector('.acco-content-div').classList.remove('show');
        });

        li.classList.add('active');
        accoContentDiv.classList.add('show');
      }
    });
  });

  block.replaceChildren(section);

  // Image optimization (if any images were present)
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
