import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...statsCardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('paragraph', 'paragraph--type--counter-stats-cards', 'paragraph--view-mode--default');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');

  // Heading
  if (headingRow) {
    const headingDiv = document.createElement('div');
    headingDiv.classList.add('row', 'justify-content-center');
    const colDiv = document.createElement('div');
    colDiv.classList.add('col-md-10');
    const heading = document.createElement('h2');
    heading.classList.add('border-yellow');
    // FIX: Use content detection for the heading cell instead of index access
    const headingCell = [...headingRow.children].find(cell => cell.textContent.trim());
    if (headingCell) {
      heading.textContent = headingCell.textContent.trim();
      moveInstrumentation(headingRow, heading);
      colDiv.append(heading);
      headingDiv.append(colDiv);
      container.append(headingDiv);
    }
  }

  // Stats Cards
  if (statsCardRows.length > 0) {
    const statsRowWrapper = document.createElement('div');
    statsRowWrapper.classList.add('row', 'justify-content-center');
    const statsColWrapper = document.createElement('div');
    statsColWrapper.classList.add('col-md-10');
    const statsCardsContainer = document.createElement('div');
    statsCardsContainer.classList.add('row', 'm-0');

    const backgroundClasses = [
      'bg-secondary-d5-navy',
      'bg-secondary-d7-violet',
      'bg-primary-d2-blue',
      'bg-gradient',
    ];

    statsCardRows.forEach((row, index) => {
      // This destructuring is correct as per the BlockJson model for 'stats-card' item rows,
      // which have fixed fields: statNumber, statNumberSuffix, statDescription.
      const [statNumberCell, statNumberSuffixCell, statDescriptionCell] = [...row.children];

      const col = document.createElement('div');
      col.classList.add('col-xl', 'col-lg-6', 'stats-card-column', backgroundClasses[index % backgroundClasses.length]);

      const cardNumberStats = document.createElement('div');
      cardNumberStats.classList.add('card-number-stats');

      const numberStatsGroup = document.createElement('div');
      numberStatsGroup.classList.add('number-stats-group', 'text-primary-d1-yellow');

      const numberStats = document.createElement('div');
      numberStats.classList.add('number-stats');

      const odometerSpan = document.createElement('span');
      odometerSpan.classList.add('odometer', 'odometer-theme-default');
      // Original HTML shows a 'US$' span before the odometer for the last card.
      // The current model doesn't explicitly define a currency field.
      // Assuming statNumberCell contains the full content including currency if present.
      // For now, just taking textContent. If currency needs to be separate, model needs update.
      odometerSpan.textContent = statNumberCell?.textContent.trim(); // Initial value, will be updated by odometer.js

      // Check if the statNumberCell contains "US$" and if so, add a span for it
      if (statNumberCell?.textContent.trim().startsWith('US$')) {
        const currencySpan = document.createElement('span');
        currencySpan.textContent = 'US$';
        numberStats.append(currencySpan);
        odometerSpan.textContent = statNumberCell.textContent.trim().replace('US$', '').trim();
      }

      numberStats.append(odometerSpan);
      numberStatsGroup.append(numberStats);

      if (statNumberSuffixCell?.textContent.trim()) {
        const suffixP = document.createElement('p');
        suffixP.textContent = statNumberSuffixCell.textContent.trim();
        numberStatsGroup.append(suffixP);
      }

      const cardText = document.createElement('div');
      cardText.classList.add('card-text', 'text-white');
      if (statDescriptionCell?.textContent.trim()) {
        const descriptionP = document.createElement('p');
        descriptionP.textContent = statDescriptionCell.textContent.trim();
        cardText.append(descriptionP);
      }

      cardNumberStats.append(numberStatsGroup, cardText);
      col.append(cardNumberStats);
      moveInstrumentation(row, col); // Move instrumentation from original row to the new column
      statsCardsContainer.append(col);
    });

    statsColWrapper.append(statsCardsContainer);
    statsRowWrapper.append(statsColWrapper);
    container.append(statsRowWrapper);
  }

  section.append(container);
  block.replaceWith(section);
}
