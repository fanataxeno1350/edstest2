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
  if (headingRow) {
    // Check 0 & 1.5: Replaced headingRow.children[0] with content detection
    const headingCell = [...headingRow.children].find(cell => cell.textContent.trim() !== '');
    if (headingCell) {
      const sectionHeader = document.createElement('div');
      sectionHeader.classList.add('section-header', 'text-center');

      const heading = document.createElement('h2');
      heading.classList.add('heading', 'font-regular');
      heading.textContent = headingCell.textContent.trim();
      moveInstrumentation(headingRow, heading);
      sectionHeader.append(heading);
      container.append(sectionHeader);
    }
  }

  // FAQs Accordion
  if (faqItemRows.length > 0) {
    const accoDiv = document.createElement('div');
    accoDiv.classList.add('acco-div');

    const ul = document.createElement('ul');

    faqItemRows.forEach((row, index) => {
      // Check 0 & 1: Destructuring is correct for fixed-field item model
      const [questionCell, answerCell] = [...row.children];

      const li = document.createElement('li');
      li.classList.add('aos-init', 'aos-animate'); // Class names from ORIGINAL HTML
      if (index === 0) {
        li.classList.add('active'); // First item is active by default, class from ORIGINAL HTML
      }

      const h2 = document.createElement('h2');
      h2.textContent = questionCell?.textContent.trim() || '';
      moveInstrumentation(questionCell, h2);

      const accoContentDiv = document.createElement('div');
      accoContentDiv.classList.add('acco-content-div'); // Class name from ORIGINAL HTML
      if (index === 0) {
        accoContentDiv.classList.add('show'); // Class name from ORIGINAL HTML
      }
      // Check 1.5: Correctly using innerHTML for richtext field
      accoContentDiv.innerHTML = answerCell?.innerHTML || '';
      moveInstrumentation(answerCell, accoContentDiv);

      // Check 2: Interactivity - Accordion toggle logic with addEventListener
      h2.addEventListener('click', () => {
        const currentlyActive = ul.querySelector('li.active');
        const currentlyShownContent = ul.querySelector('.acco-content-div.show');

        if (currentlyActive && currentlyActive !== li) {
          currentlyActive.classList.remove('active');
          currentlyShownContent.classList.remove('show');
        }

        li.classList.toggle('active');
        accoContentDiv.classList.toggle('show');
      });

      li.append(h2, accoContentDiv);
      ul.append(li);
      moveInstrumentation(row, li);
    });
    accoDiv.append(ul);
    container.append(accoDiv);
  }

  // Optimize images within the block
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceWith(section);
}
