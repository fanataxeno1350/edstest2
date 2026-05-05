import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Heading row
  const [headingRow] = children; // Fixed: using destructuring for the heading row
  const headingText = headingRow?.children[0]?.textContent.trim();
  if (headingText) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    moveInstrumentation(headingRow, sectionHeader);

    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.setAttribute('data-aos', 'fade-up');
    heading.textContent = headingText;
    sectionHeader.append(heading);
    container.append(sectionHeader);
  }

  // FAQ Items
  const faqItems = children.slice(1);
  if (faqItems.length > 0) {
    const accoDiv = document.createElement('div');
    accoDiv.classList.add('acco-div');
    container.append(accoDiv);

    const ul = document.createElement('ul');
    accoDiv.append(ul);

    faqItems.forEach((row, index) => {
      const [questionCell, answerCell] = [...row.children];

      const li = document.createElement('li');
      li.classList.add('aos-init', 'aos-animate');
      li.setAttribute('data-aos', 'fade-up');
      if (index === 0) {
        li.classList.add('active'); // First item is active by default
      }
      moveInstrumentation(row, li);

      const question = document.createElement('h2');
      question.textContent = questionCell?.textContent.trim() || '';
      question.setAttribute('data-once', 'faqsAccordion'); // Add data-once attribute
      li.append(question);

      const accoContentDiv = document.createElement('div');
      accoContentDiv.classList.add('acco-content-div');
      if (index === 0) {
        accoContentDiv.classList.add('show'); // First item content is shown by default
      }
      accoContentDiv.innerHTML = answerCell?.innerHTML || '';
      li.append(accoContentDiv);
      ul.append(li);

      // Add click listener for accordion behavior
      question.addEventListener('click', () => {
        const isActive = li.classList.contains('active');

        // Close all other active items
        ul.querySelectorAll('li.active').forEach((activeLi) => {
          activeLi.classList.remove('active');
          activeLi.querySelector('.acco-content-div').classList.remove('show');
        });

        // Toggle current item
        if (!isActive) {
          li.classList.add('active');
          accoContentDiv.classList.add('show');
        }
      });
    });
  }

  block.replaceChildren(section);

  // Image optimization
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
