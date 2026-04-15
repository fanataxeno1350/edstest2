import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Heading
  // The first row is the heading. Find the cell containing the heading text.
  const headingRow = children[0];
  if (headingRow) {
    const headingCell = [...headingRow.children].find(cell => cell.textContent.trim() !== '');
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.setAttribute('data-aos', 'fade-up');
    heading.textContent = headingCell?.textContent.trim() || '';
    moveInstrumentation(headingRow, heading);
    sectionHeader.append(heading);
    container.append(sectionHeader);
  }

  // FAQs Accordion
  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');
  container.append(accoDiv);

  const ul = document.createElement('ul');
  accoDiv.append(ul);

  // FAQ items start from the second row
  const faqItems = children.slice(1);

  faqItems.forEach((row, index) => {
    // Destructure cells for question and answer
    const [questionCell, answerCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('aos-init', 'aos-animate');
    li.setAttribute('data-aos', 'fade-up');
    if (index === 0) {
      li.classList.add('active'); // First item is active by default
    }

    const h2 = document.createElement('h2');
    h2.textContent = questionCell?.textContent.trim() || '';
    h2.setAttribute('data-once', 'faqsAccordion');
    moveInstrumentation(questionCell, h2);
    li.append(h2);

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    if (index === 0) {
      accoContentDiv.classList.add('show'); // First item content is shown by default
    }
    accoContentDiv.innerHTML = answerCell?.innerHTML || ''; // Use innerHTML for richtext
    moveInstrumentation(answerCell, accoContentDiv);
    li.append(accoContentDiv);

    h2.addEventListener('click', () => {
      const parentLi = h2.closest('li');
      const content = parentLi.querySelector('.acco-content-div');

      // Close all other open accordions
      ul.querySelectorAll('li.active').forEach((activeLi) => {
        if (activeLi !== parentLi) {
          activeLi.classList.remove('active');
          activeLi.querySelector('.acco-content-div')?.classList.remove('show');
        }
      });

      // Toggle current accordion
      parentLi.classList.toggle('active');
      content.classList.toggle('show');
    });

    ul.append(li);
  });

  block.replaceWith(section);

  // Image optimization (if any images were present, though not in this specific block)
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
