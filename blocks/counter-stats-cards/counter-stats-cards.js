import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...statsCardRows] = [...block.children];

  // Main container setup
  const section = document.createElement('section');
  section.classList.add('paragraph', 'paragraph--type--counter-stats-cards', 'paragraph--view-mode--default');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Heading
  if (headingRow) {
    const headingWrapperRow = document.createElement('div');
    headingWrapperRow.classList.add('row', 'justify-content-center');
    const headingCol = document.createElement('div');
    headingCol.classList.add('col-md-10');
    const heading = document.createElement('h2');
    heading.classList.add('border-yellow');
    // The heading content is in the first (and only) cell of the headingRow
    const headingCell = headingRow.children[0];
    if (headingCell) {
      moveInstrumentation(headingCell, heading);
      while (headingCell.firstChild) heading.append(headingCell.firstChild);
    }
    headingCol.append(heading);
    headingWrapperRow.append(headingCol);
    container.append(headingWrapperRow);
  }

  // Stats Cards
  if (statsCardRows.length > 0) {
    const statsCardsWrapperRow = document.createElement('div');
    statsCardsWrapperRow.classList.add('row', 'justify-content-center');
    const statsCardsCol = document.createElement('div');
    statsCardsCol.classList.add('col-md-10');
    const statsCardsInnerRow = document.createElement('div');
    statsCardsInnerRow.classList.add('row', 'm-0');

    statsCardRows.forEach((row, index) => {
      const col = document.createElement('div');
      col.classList.add('col-xl', 'col-lg-6', 'stats-card-column');

      // Apply background colors based on index or a pattern
      const bgClasses = [
        'bg-secondary-d5-navy',
        'bg-secondary-d7-violet',
        'bg-primary-d2-blue',
        'bg-gradient',
      ];
      col.classList.add(bgClasses[index % bgClasses.length]);

      const cardNumberStats = document.createElement('div');
      cardNumberStats.classList.add('card-number-stats');

      const numberStatsGroup = document.createElement('div');
      numberStatsGroup.classList.add('number-stats-group', 'text-primary-d1-yellow');

      const numberStats = document.createElement('div');
      numberStats.classList.add('number-stats');

      // Access cells by index as per Block JSON structure
      const cells = [...row.children];
      const valueCell = cells[0];
      const valueSuffixCell = cells[1];
      const descriptionCell = cells[2];

      if (valueCell) {
        const span = document.createElement('span');
        span.classList.add('odometer', 'odometer-theme-default');
        moveInstrumentation(valueCell, span);
        while (valueCell.firstChild) span.append(valueCell.firstChild);
        numberStats.append(span);
      }

      numberStatsGroup.append(numberStats);

      if (valueSuffixCell) {
        const p = document.createElement('p');
        moveInstrumentation(valueSuffixCell, p);
        while (valueSuffixCell.firstChild) p.append(valueSuffixCell.firstChild);
        numberStatsGroup.append(p);
      }

      cardNumberStats.append(numberStatsGroup);

      const cardText = document.createElement('div');
      cardText.classList.add('card-text', 'text-white');
      if (descriptionCell) {
        const p = document.createElement('p');
        moveInstrumentation(descriptionCell, p);
        while (descriptionCell.firstChild) p.append(descriptionCell.firstChild);
        cardText.append(p);
      }
      cardNumberStats.append(cardText);

      col.append(cardNumberStats);
      statsCardsInnerRow.append(col);
    });

    statsCardsCol.append(statsCardsInnerRow);
    statsCardsWrapperRow.append(statsCardsCol);
    container.append(statsCardsWrapperRow);
  }

  block.textContent = '';
  block.append(section);
}
