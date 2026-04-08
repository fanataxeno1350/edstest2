import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrap = document.createElement('div');
  wrap.classList.add('wrap');

  [...block.children].forEach((row) => {
    const content = document.createElement('div');
    content.classList.add('content');
    moveInstrumentation(row, content);

    const desc = document.createElement('div');
    desc.classList.add('desc');

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');

    // EDS Block Structure defines the order of cells: Link, Text, Date, Category
    const cells = [...row.children];
    const linkCell = cells[0];
    const textCell = cells[1];
    const dateCell = cells[2];
    const categoryCell = cells[3];

    let linkElement;
    if (linkCell && linkCell.querySelector('a')) {
      linkElement = linkCell.querySelector('a');
    }

    if (linkElement) {
      const p = document.createElement('p');
      const newLink = document.createElement('a');
      newLink.href = linkElement.href;
      newLink.textContent = linkElement.textContent;
      moveInstrumentation(linkCell, p); // Use linkCell for instrumentation
      p.append(newLink);
      desc.append(p);
    }

    // The 'Text' field from EDS structure is present but not explicitly rendered
    // as a separate element in the provided original HTML.
    // If it needs to be displayed, it would require a distinct element here.
    // For now, it's implicitly skipped as per the original HTML's rendering.
    // if (textCell && textCell.textContent.trim() !== '') {
    //   const pText = document.createElement('p');
    //   pText.textContent = textCell.textContent.trim();
    //   moveInstrumentation(textCell, pText);
    //   desc.append(pText);
    // }

    if (dateCell && dateCell.textContent.trim() !== '') {
      const emDate = document.createElement('em');
      const time = document.createElement('time');
      // The date value from EDS is just text, so we can't parse it into a datetime attribute directly
      // without more information on its format. We'll just put the text content.
      // If the original HTML provides a datetime attribute, we should try to parse the date.
      // For now, we'll use the text content.
      time.textContent = dateCell.textContent.trim();
      // If a specific datetime format is guaranteed, e.g., 'YYYY-MM-DDTHH:mm:ssZ',
      // you could set time.setAttribute('datetime', parsedDate);
      emDate.append(time);
      moveInstrumentation(dateCell, emDate);
      dateDiv.append(emDate);
    }

    if (categoryCell && categoryCell.textContent.trim() !== '') {
      const emCategory = document.createElement('em');
      emCategory.textContent = categoryCell.textContent.trim();
      moveInstrumentation(categoryCell, emCategory);
      dateDiv.append(emCategory);
    }

    if (dateDiv.children.length > 0) {
      desc.append(dateDiv);
    }

    if (desc.children.length > 0) {
      content.append(desc);
    }

    wrap.append(content);
  });

  block.textContent = '';
  block.append(wrap);
}
