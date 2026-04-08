import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  containerDiv.setAttribute('data-aos', 'fade-up');
  containerDiv.setAttribute('data-aos-offset', '-100');
  containerDiv.setAttribute('data-aos-duration', '650');
  containerDiv.setAttribute('data-aos-easing', 'ease-in-out');

  const ul = document.createElement('ul');
  ul.classList.add('quick-links-div');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    // According to BlockJson, each row has two cells: link (aem-content) and text (text)
    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a')); // cell[0] - Link
    const textCell = cells.find(cell => !cell.querySelector('a')); // cell[1] - Text

    if (linkCell && textCell) {
      const foundLink = linkCell.querySelector('a');
      const linkEl = document.createElement('a');
      if (foundLink) {
        linkEl.href = foundLink.href;
        if (foundLink.target) linkEl.target = foundLink.target;
      }
      linkEl.classList.add('with-full-underline');
      moveInstrumentation(linkCell, linkEl);
      
      // Append content from the link cell (which is the link text)
      while (linkCell.firstChild) linkEl.append(linkCell.firstChild);

      // Append content from the text cell (which is the actual text to display)
      // This effectively replaces the link text with the content from the text cell,
      // as seen in the original HTML where the <a> tag contains the display text.
      moveInstrumentation(textCell, linkEl);
      while (textCell.firstChild) linkEl.append(textCell.firstChild);

      li.append(linkEl);
    } else {
      // Fallback if structure is unexpected, append all children directly
      // This case should ideally not be hit if the block structure is consistent
      while (row.firstChild) li.append(row.firstChild);
    }
    ul.append(li);
  });

  containerDiv.append(ul);
  wrapperDiv.append(containerDiv);

  block.textContent = '';
  block.append(wrapperDiv);
}
