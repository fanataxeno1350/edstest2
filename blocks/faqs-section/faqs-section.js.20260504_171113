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
  // Use content detection instead of children[0]
  const headingRow = children.find(row => row.children.length === 1 && !row.querySelector('p') && !row.querySelector('ul'));
  if (headingRow) {
    const headingCell = headingRow.firstElementChild;
    if (headingCell) {
      const sectionHeader = document.createElement('div');
      sectionHeader.classList.add('section-header', 'text-center');
      moveInstrumentation(headingRow, sectionHeader);

      const heading = document.createElement('h2');
      heading.classList.add('heading', 'font-regular'); // Added font-regular from original HTML
      heading.textContent = headingCell.textContent.trim();
      sectionHeader.append(heading);
      container.append(sectionHeader);
    }
  }

  // FAQs
  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');
  const ul = document.createElement('ul');
  accoDiv.append(ul);
  container.append(accoDiv);

  // Filter out the heading row if it was found, then iterate over FAQ item rows
  const faqRows = children.filter(row => row !== headingRow);

  faqRows.forEach((row, index) => {
    // Use destructuring for fixed-field item models as per guide
    const [questionCell, answerCell] = [...row.children];

    const li = document.createElement('li');
    moveInstrumentation(row, li);
    if (index === 0) {
      li.classList.add('active'); // First item is active by default in original HTML
    }

    const h2 = document.createElement('h2');
    h2.textContent = questionCell.textContent.trim();
    li.append(h2);

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    if (index === 0) {
      accoContentDiv.classList.add('show');
    }
    accoContentDiv.innerHTML = answerCell.innerHTML; // Correctly uses innerHTML for richtext
    li.append(accoContentDiv);

    h2.addEventListener('click', () => {
      const isActive = li.classList.contains('active');
      // Close all other open accordions
      ul.querySelectorAll('li.active').forEach((activeLi) => {
        activeLi.classList.remove('active');
        activeLi.querySelector('.acco-content-div').classList.remove('show');
      });

      // Toggle current accordion
      if (!isActive) {
        li.classList.add('active');
        accoContentDiv.classList.add('show');
      }
    });

    ul.append(li);
  });

  block.innerHTML = '';
  block.append(section);
}
