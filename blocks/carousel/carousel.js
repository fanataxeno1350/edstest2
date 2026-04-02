import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, ...itemRows] = [...block.children];

  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('u-container', 'u-width-10', 'carousel-title-parent');
  moveInstrumentation(titleRow, carouselContainer);

  const titleEl = document.createElement('h2');
  titleEl.classList.add('carousel-title', 'fade-in', 'appear');
  while (titleRow.firstChild) titleEl.append(titleRow.firstChild);
  carouselContainer.append(titleEl);

  const prevButton = document.createElement('button');
  prevButton.classList.add('carousel-button-prev');
  prevButton.textContent = 'Previous';

  const nextButton = document.createElement('button');
  nextButton.classList.add('carousel-button-next');
  nextButton.textContent = 'Next';

  const carouselList = document.createElement('ul');
  carouselList.classList.add('carousel-list');
  carouselList.setAttribute('data-carousel', 'list');

  itemRows.forEach((row, index) => {
    const item = document.createElement('li');
    moveInstrumentation(row, item);
    item.classList.add('carousel-item');
    item.setAttribute('data-carousel', 'item');
    if (index === 0) {
      item.setAttribute('data-item', 'first');
    } else if (index === itemRows.length - 1) {
      item.setAttribute('data-item', 'last');
      item.setAttribute('aria-hidden', 'true');
    } else {
      item.setAttribute('aria-hidden', 'true');
    }

    const itemInner = document.createElement('div');
    itemInner.classList.add('carousel-item-inner');

    const cells = [...row.children];

    // Image cell
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    if (imageCell) {
      const imageWrapper = document.createElement('div');
      imageWrapper.classList.add('carousel-item-image');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        picture.replaceWith(optimizedPic);
      }
      while (imageCell.firstChild) imageWrapper.append(imageCell.firstChild);
      itemInner.append(imageWrapper);
    }

    // Heading cell (h3)
    const headingCell = cells.find(cell => cell.querySelector('h3') || (!cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim().length > 0 && cell.children.length === 0)); // Heuristic for heading if no h3 is present
    if (headingCell) {
      const heading = document.createElement('h3');
      heading.classList.add('carousel-item-heading');
      while (headingCell.firstChild) heading.append(headingCell.firstChild);
      itemInner.append(heading);
    }

    // Text cell (richtext)
    const textCell = cells.find(cell => cell.querySelector('p') || cell.querySelector('a') || (!cell.querySelector('picture') && !cell.querySelector('h3') && cell.textContent.trim().length > 0)); // Heuristic for text if no p/a is present
    if (textCell) {
      const textContent = document.createElement('div');
      textContent.classList.add('carousel-item-text');
      textContent.setAttribute('data-carousel', 'text');
      while (textCell.firstChild) textContent.append(textCell.firstChild);
      itemInner.append(textContent);
    }

    item.append(itemInner);
    carouselList.append(item);
  });

  let currentItemIndex = 0;

  const updateCarousel = () => {
    carouselList.querySelectorAll('.carousel-item').forEach((item, index) => {
      item.classList.remove('active');
      item.setAttribute('aria-hidden', 'true');
      item.removeAttribute('data-item');
      if (index === currentItemIndex) {
        item.classList.add('active');
        item.removeAttribute('aria-hidden');
        item.setAttribute('data-item', 'first');
      } else if (index === (currentItemIndex + 1) % itemRows.length) {
        item.setAttribute('data-item', 'second');
      } else if (index === (currentItemIndex - 1 + itemRows.length) % itemRows.length) {
        item.setAttribute('data-item', 'last');
      }
    });
  };

  prevButton.addEventListener('click', () => {
    currentItemIndex = (currentItemIndex - 1 + itemRows.length) % itemRows.length;
    updateCarousel();
  });

  nextButton.addEventListener('click', () => {
    currentItemIndex = (currentItemIndex + 1) % itemRows.length;
    updateCarousel();
  });

  block.textContent = '';
  block.classList.add('carousel');
  block.setAttribute('data-module', 'carousel');
  block.append(carouselContainer, prevButton, carouselList, nextButton);

  updateCarousel(); // Initialize carousel state
}
