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
  if (headingRow) {
    const headingCell = [...headingRow.children].find(cell => cell.textContent.trim() !== ''); // Content detection
    if (headingCell) {
      const sectionHeader = document.createElement('div');
      sectionHeader.classList.add('section-header', 'text-center');

      const heading = document.createElement('h2');
      heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
      heading.textContent = headingCell.textContent.trim();
      sectionHeader.appendChild(heading);
      container.appendChild(sectionHeader);
    }
  }

  // FAQs Accordion
  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');

  const ul = document.createElement('ul');

  faqRows.forEach((row, index) => {
    const [questionCell, answerCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('aos-init', 'aos-animate'); // Add initial AOS classes

    const h2 = document.createElement('h2');
    h2.textContent = questionCell.textContent.trim();
    h2.setAttribute('data-once', 'faqsAccordion'); // Copy attribute from original HTML
    li.appendChild(h2);

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    accoContentDiv.innerHTML = answerCell.innerHTML;
    li.appendChild(accoContentDiv);

    // Add click listener for accordion behavior
    h2.addEventListener('click', () => {
      const isActive = li.classList.contains('active');

      // Close all other active accordions
      ul.querySelectorAll('li.active').forEach((activeLi) => {
        if (activeLi !== li) {
          activeLi.classList.remove('active');
          activeLi.querySelector('.acco-content-div').classList.remove('show');
        }
      });

      // Toggle current accordion
      li.classList.toggle('active', !isActive);
      accoContentDiv.classList.toggle('show', !isActive);
    });

    // If this is the first item, make it active by default
    if (index === 0) {
      li.classList.add('active');
      accoContentDiv.classList.add('show');
    }

    moveInstrumentation(row, li);
    ul.appendChild(li);
  });

  accoDiv.appendChild(ul);
  container.appendChild(accoDiv);
  section.appendChild(container);
  block.replaceWith(section);

  // Optimize images within the block
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
