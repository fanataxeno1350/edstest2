import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...cardRows] = [...block.children];

  // Heading
  const h2 = document.createElement('h2');
  moveInstrumentation(headingRow, h2);
  h2.append(headingRow.firstElementChild.textContent);
  block.append(h2);

  // Cards container
  const container = document.createElement('div');
  container.classList.add('container', 'mt-6');
  const row = document.createElement('div');
  row.classList.add('row', 'justify-content-around');

  cardRows.forEach((cardRow) => {
    const cells = [...cardRow.children];

    // Use content detection instead of index access
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const imageLinkCell = cells.find(cell => cell.textContent.includes('Image Link') && cell.querySelector('a'));
    const categoryLinkCell = cells.find(cell => cell.textContent.includes('Category Link') && cell.querySelector('a'));
    const categoryCell = cells.find(cell => cell.textContent.includes('Category') && !cell.querySelector('a'));
    const titleLinkCell = cells.find(cell => cell.textContent.includes('Title Link') && cell.querySelector('a'));
    const titleCell = cells.find(cell => cell.textContent.includes('Title') && !cell.querySelector('a'));
    const descriptionCell = cells.find(cell => cell.querySelector('p'));
    const dateCell = cells.find(cell => cell.textContent.includes('Date'));
    const readMoreLinkCell = cells.find(cell => cell.textContent.includes('Read More Link') && cell.querySelector('a'));

    const blogCard = document.createElement('div');
    blogCard.classList.add('blog-card', 'col-lg-4', 'col-md-6', 'col-12');
    moveInstrumentation(cardRow, blogCard);

    // Image and Image Link
    const imageLink = document.createElement('a');
    const originalImageLink = imageLinkCell?.querySelector('a');
    if (originalImageLink) {
      imageLink.href = originalImageLink.href;
    }
    const picture = imageCell?.querySelector('picture');
    if (picture) {
      imageLink.append(picture);
    }
    blogCard.append(imageLink);

    // Categories
    const categoriesDiv = document.createElement('div');
    categoriesDiv.classList.add('categories', 'align-items-center', 'gap-3', 'flex-wrap');
    const categoryLink = document.createElement('a');
    const originalCategoryLink = categoryLinkCell?.querySelector('a');
    if (originalCategoryLink) {
      categoryLink.href = originalCategoryLink.href;
    }
    if (categoryCell) {
      moveInstrumentation(categoryCell, categoryLink);
      while (categoryCell.firstChild) categoryLink.append(categoryCell.firstChild);
    }
    categoriesDiv.append(categoryLink);
    blogCard.append(categoriesDiv);

    // Title and Description
    const titleAndDescriptionLink = document.createElement('a');
    const originalTitleLink = titleLinkCell?.querySelector('a');
    if (originalTitleLink) {
      titleAndDescriptionLink.href = originalTitleLink.href;
    }

    const h5 = document.createElement('h5');
    if (titleCell) {
      moveInstrumentation(titleCell, h5);
      while (titleCell.firstChild) h5.append(titleCell.firstChild);
    }
    titleAndDescriptionLink.append(h5);

    const p = document.createElement('p');
    if (descriptionCell) {
      moveInstrumentation(descriptionCell, p);
      while (descriptionCell.firstChild) p.append(descriptionCell.firstChild);
    }
    titleAndDescriptionLink.append(p);
    blogCard.append(titleAndDescriptionLink);

    // Date and Read More
    const dateReadDiv = document.createElement('div');
    dateReadDiv.classList.add('d-flex', 'date-read', 'justify-content-between', 'align-items-center');

    const time = document.createElement('time');
    if (dateCell) {
      moveInstrumentation(dateCell, time);
      time.setAttribute('datetime', dateCell.textContent.trim()); // Assuming dateCell content is a valid date string
      while (dateCell.firstChild) time.append(dateCell.firstChild);
    }
    dateReadDiv.append(time);

    const readMoreLink = document.createElement('a');
    readMoreLink.classList.add('btn', 'btn-primary');
    const originalReadMoreLink = readMoreLinkCell?.querySelector('a');
    if (originalReadMoreLink) {
      readMoreLink.href = originalReadMoreLink.href;
      moveInstrumentation(readMoreLinkCell, readMoreLink);
      while (readMoreLinkCell.firstChild) readMoreLink.append(readMoreLinkCell.firstChild);
    }
    dateReadDiv.append(readMoreLink);
    blogCard.append(dateReadDiv);

    row.append(blogCard);
  });

  block.append(container); // Append container to block first
  container.append(row); // Then append row to container

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
    optimizedPic.querySelector('img').classList.add('img-fluid');
  });
}
