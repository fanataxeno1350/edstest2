import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  const headingRow = rows.shift(); // First row is the heading

  const container = document.createElement('div');
  container.classList.add('container');
  moveInstrumentation(block, container);

  const headingWrapper = document.createElement('div');
  headingWrapper.classList.add('row', 'justify-content-center');

  const headingCol = document.createElement('div');
  headingCol.classList.add('col-md-10');

  const heading = document.createElement('h2');
  heading.classList.add('border-yellow');
  // FIX: Correctly read heading text from the headingRow directly, as it's a plain text cell.
  heading.textContent = headingRow.textContent.trim();
  moveInstrumentation(headingRow, heading);

  headingCol.append(heading);
  headingWrapper.append(headingCol);
  container.append(headingWrapper);

  const statsCardsRow = document.createElement('div');
  statsCardsRow.classList.add('row', 'justify-content-center');

  const statsCardsCol = document.createElement('div');
  statsCardsCol.classList.add('col-md-10');

  const statsCardsContainer = document.createElement('div');
  statsCardsContainer.classList.add('row', 'm-0');

  const colors = [
    'bg-secondary-d5-navy',
    'bg-secondary-d7-violet',
    'bg-primary-d2-blue',
    'bg-gradient',
  ];

  rows.forEach((row, index) => {
    const [numberCell, numberLabelCell, descriptionCell] = [...row.children];

    const statsCardColumn = document.createElement('div');
    statsCardColumn.classList.add(
      'col-xl',
      'col-lg-6',
      'stats-card-column',
      colors[index % colors.length],
    );

    const cardNumberStats = document.createElement('div');
    cardNumberStats.classList.add('card-number-stats');

    const numberStatsGroup = document.createElement('div');
    numberStatsGroup.classList.add('number-stats-group', 'text-primary-d1-yellow');

    const numberStats = document.createElement('div');
    numberStats.classList.add('number-stats');

    const odometerSpan = document.createElement('span');
    odometerSpan.classList.add('odometer', 'odometer-theme-default');
    odometerSpan.textContent = numberCell.textContent.trim();
    moveInstrumentation(numberCell, odometerSpan);

    numberStats.append(odometerSpan);
    numberStatsGroup.append(numberStats);

    if (numberLabelCell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = numberLabelCell.textContent.trim();
      moveInstrumentation(numberLabelCell, p);
      numberStatsGroup.append(p);
    }

    const cardText = document.createElement('div');
    cardText.classList.add('card-text', 'text-white');

    if (descriptionCell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = descriptionCell.textContent.trim();
      moveInstrumentation(descriptionCell, p);
      cardText.append(p);
    }

    cardNumberStats.append(numberStatsGroup, cardText);
    statsCardColumn.append(cardNumberStats);
    statsCardsContainer.append(statsCardColumn);
    moveInstrumentation(row, statsCardColumn);
  });

  statsCardsCol.append(statsCardsContainer);
  statsCardsRow.append(statsCardsCol);
  container.append(statsCardsRow);

  block.textContent = '';
  block.append(container);
}
