import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...faqItemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Heading
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  heading.textContent = headingRow.firstElementChild?.textContent.trim() || '';
  sectionHeader.append(heading);
  container.append(sectionHeader);
  moveInstrumentation(headingRow, heading);

  // FAQs
  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');
  const ul = document.createElement('ul');

  faqItemRows.forEach((row, index) => {
    const li = document.createElement('li');
    li.classList.add('aos-init', 'aos-animate');
    li.setAttribute('data-aos', 'fade-up');
    if (index === 0) {
      li.classList.add('active');
    }

    // Use content detection instead of first/lastElementChild for robustness
    const cells = [...row.children];
    const questionCell = cells.find(cell => !cell.querySelector('p') && !cell.querySelector('ul')); // Assuming question is plain text
    const answerCell = cells.find(cell => cell.querySelector('p') || cell.querySelector('ul')); // Assuming answer is richtext with p or ul

    const h2 = document.createElement('h2');
    h2.setAttribute('data-once', 'faqsAccordion');
    h2.textContent = questionCell?.textContent.trim() || '';
    li.append(h2);
    moveInstrumentation(questionCell, h2);

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    if (index === 0) {
      accoContentDiv.classList.add('show');
    }
    accoContentDiv.innerHTML = answerCell?.innerHTML || '';
    li.append(accoContentDiv);
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

    ul.append(li);
    moveInstrumentation(row, li);
  });

  accoDiv.append(ul);
  container.append(accoDiv);

  block.replaceWith(section);

  // Image optimization
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
