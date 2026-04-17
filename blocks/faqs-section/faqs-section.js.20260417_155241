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
  const headingRow = children.shift();
  if (headingRow) {
    const headingCell = [...headingRow.children].find((cell) => cell.textContent.trim()); // Content detection for heading cell
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

  // FAQs
  if (children.length > 0) {
    const accoDiv = document.createElement('div');
    accoDiv.classList.add('acco-div');
    const ul = document.createElement('ul');
    accoDiv.append(ul);

    children.forEach((row, index) => {
      const [questionCell, answerCell] = [...row.children];

      const li = document.createElement('li');
      li.classList.add('aos-init', 'aos-animate');
      li.setAttribute('data-aos', 'fade-up');
      if (index === 0) {
        li.classList.add('active'); // First item is active by default
      }

      const h2 = document.createElement('h2');
      h2.setAttribute('data-once', 'faqsAccordion');
      h2.textContent = questionCell?.textContent.trim() || '';
      moveInstrumentation(questionCell, h2);
      li.append(h2);

      const accoContentDiv = document.createElement('div');
      accoContentDiv.classList.add('acco-content-div');
      if (index === 0) {
        accoContentDiv.classList.add('show');
      }
      accoContentDiv.innerHTML = answerCell?.innerHTML || '';
      moveInstrumentation(answerCell, accoContentDiv);
      li.append(accoContentDiv);

      h2.addEventListener('click', () => {
        const isActive = li.classList.contains('active');

        // Close all other active items
        ul.querySelectorAll('li.active').forEach((activeLi) => {
          activeLi.classList.remove('active');
          activeLi.querySelector('.acco-content-div')?.classList.remove('show');
        });

        // Toggle current item
        if (!isActive) {
          li.classList.add('active');
          accoContentDiv.classList.add('show');
        }
      });

      ul.append(li);
      moveInstrumentation(row, li);
    });

    container.append(accoDiv);
  }

  // Replace the block with the new section
  block.replaceWith(section);

  // Image optimization (if any images were present, though none in this block)
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
