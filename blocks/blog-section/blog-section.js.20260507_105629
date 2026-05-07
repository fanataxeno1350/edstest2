import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const sectionTitleRow = children[0];
  const blogCardRows = children.slice(1);

  const section = document.createElement('section');
  // section.classList.add('blog-section'); // Removed: block already has this class from AEM

  // Section Title
  if (sectionTitleRow) {
    const h2 = document.createElement('h2');
    moveInstrumentation(sectionTitleRow, h2);
    h2.textContent = sectionTitleRow.textContent.trim();
    section.append(h2);
  }

  const container = document.createElement('div');
  container.classList.add('container', 'mt-6');

  const row = document.createElement('div');
  row.classList.add('row', 'justify-content-around');

  blogCardRows.forEach((blogCardRow) => {
    const [
      imageCell,
      imageLinkCell,
      categoryCell,
      categoryLinkCell,
      titleCell,
      titleLinkCell,
      descriptionCell,
      dateCell,
      readMoreLinkCell,
      readMoreLabelCell,
    ] = [...blogCardRow.children];

    const blogCard = document.createElement('div');
    blogCard.classList.add('blog-card', 'col-lg-4', 'col-md-6', 'col-12');
    moveInstrumentation(blogCardRow, blogCard);

    // Image and Image Link
    const imageLink = document.createElement('a');
    const foundImageLink = imageLinkCell.querySelector('a');
    if (foundImageLink) {
      imageLink.href = foundImageLink.href;
    }
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageLink.append(optimizedPic);
      // Add img-fluid class to the image inside the picture tag, as per original HTML
      optimizedPic.querySelector('img').classList.add('img-fluid');
    }
    blogCard.append(imageLink);

    // Categories
    const categoriesDiv = document.createElement('div');
    categoriesDiv.classList.add('categories', 'align-items-center', 'gap-3', 'flex-wrap');
    const categoryAnchor = document.createElement('a');
    const foundCategoryLink = categoryLinkCell.querySelector('a');
    if (foundCategoryLink) {
      categoryAnchor.href = foundCategoryLink.href;
    }
    categoryAnchor.textContent = categoryCell.textContent.trim();
    categoriesDiv.append(categoryAnchor);
    blogCard.append(categoriesDiv);

    // Title and Title Link, Description
    const titleAndDescriptionLink = document.createElement('a');
    const foundTitleLink = titleLinkCell.querySelector('a');
    if (foundTitleLink) {
      titleAndDescriptionLink.href = foundTitleLink.href;
    }

    const h5 = document.createElement('h5');
    h5.textContent = titleCell.textContent.trim();
    titleAndDescriptionLink.append(h5);

    const p = document.createElement('p');
    p.textContent = descriptionCell.textContent.trim();
    titleAndDescriptionLink.append(p);
    blogCard.append(titleAndDescriptionLink);

    // Date and Read More Link
    const dateReadDiv = document.createElement('div');
    dateReadDiv.classList.add('d-flex', 'date-read', 'justify-content-between', 'align-items-center');

    const time = document.createElement('time');
    time.setAttribute('datetime', dateCell.textContent.trim());
    time.textContent = dateCell.textContent.trim();
    dateReadDiv.append(time);

    const readMoreAnchor = document.createElement('a');
    const foundReadMoreLink = readMoreLinkCell.querySelector('a');
    if (foundReadMoreLink) {
      readMoreAnchor.href = foundReadMoreLink.href;
    }
    readMoreAnchor.classList.add('btn', 'btn-primary');
    readMoreAnchor.textContent = readMoreLabelCell.textContent.trim();
    dateReadDiv.append(readMoreAnchor);

    blogCard.append(dateReadDiv);
    row.append(blogCard);
  });

  container.append(row);
  section.append(container);
  block.replaceChildren(section);
}
