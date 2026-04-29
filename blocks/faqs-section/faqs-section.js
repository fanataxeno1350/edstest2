import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...faqRows] = [...block.children];

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
  // FIX: Replaced headingRow.children[0] with content detection
  const headingCell = [...headingRow.children].find(cell => cell.textContent.trim());
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

  faqRows.forEach((row, index) => {
    const [questionCell, answerCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('aos-init', 'aos-animate');
    li.setAttribute('data-aos', 'fade-up');
    if (index === 0) {
      li.classList.add('active');
    }

    const h2 = document.createElement('h2');
    h2.setAttribute('data-once', 'faqsAccordion');
    h2.textContent = questionCell?.textContent.trim() || '';
    moveInstrumentation(questionCell, h2);

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    if (index === 0) {
      accoContentDiv.classList.add('show');
    }
    accoContentDiv.innerHTML = answerCell?.innerHTML || '';
    moveInstrumentation(answerCell, accoContentDiv);

    h2.addEventListener('click', () => {
      const currentlyActive = ul.querySelector('li.active');
      if (currentlyActive && currentlyActive !== li) {
        currentlyActive.classList.remove('active');
        currentlyActive.querySelector('.acco-content-div').classList.remove('show');
      }
      li.classList.toggle('active');
      accoContentDiv.classList.toggle('show');
    });

    li.append(h2, accoContentDiv);
    moveInstrumentation(row, li);
    ul.append(li);
  });

  accoDiv.append(ul);
  container.append(accoDiv);
  section.append(container);
  block.replaceWith(section);

  // Optimize images if any are found within the rich text answers
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
