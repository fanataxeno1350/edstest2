import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  // section.classList.add('blog-section'); // Removed: block already has this class from AEM

  const [sectionTitleRow, ...blogCardRows] = children;

  if (sectionTitleRow) {
    const sectionTitle = document.createElement('h2');
    moveInstrumentation(sectionTitleRow, sectionTitle);
    sectionTitle.textContent = sectionTitleRow.textContent.trim();
    section.append(sectionTitle);
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
    const foundImageLink = imageLinkCell?.querySelector('a');
    if (foundImageLink) {
      imageLink.href = foundImageLink.href;
    }

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('img-fluid');
        imageLink.append(optimizedPic);
      }
    }
    blogCard.append(imageLink);

    // Categories
    const categoriesDiv = document.createElement('div');
    categoriesDiv.classList.add('categories', 'align-items-center', 'gap-3', 'flex-wrap');

    const categoryAnchor = document.createElement('a');
    const foundCategoryLink = categoryLinkCell?.querySelector('a');
    if (foundCategoryLink) {
      categoryAnchor.href = foundCategoryLink.href;
    }
    categoryAnchor.textContent = categoryCell?.textContent.trim() || '';
    categoriesDiv.append(categoryAnchor);
    blogCard.append(categoriesDiv);

    // Title and Description
    const titleAndDescLink = document.createElement('a');
    const foundTitleLink = titleLinkCell?.querySelector('a');
    if (foundTitleLink) {
      titleAndDescLink.href = foundTitleLink.href;
    }

    const title = document.createElement('h5');
    title.textContent = titleCell?.textContent.trim() || '';
    titleAndDescLink.append(title);

    const description = document.createElement('p');
    description.textContent = descriptionCell?.textContent.trim() || '';
    titleAndDescLink.append(description);
    blogCard.append(titleAndDescLink);

    // Date and Read More Link
    const dateReadDiv = document.createElement('div');
    dateReadDiv.classList.add('d-flex', 'date-read', 'justify-content-between', 'align-items-center');

    const date = document.createElement('time');
    date.textContent = dateCell?.textContent.trim() || '';
    dateReadDiv.append(date);

    const readMoreLink = document.createElement('a');
    readMoreLink.classList.add('btn', 'btn-primary');
    const foundReadMoreLink = readMoreLinkCell?.querySelector('a');
    if (foundReadMoreLink) {
      readMoreLink.href = foundReadMoreLink.href;
    }
    readMoreLink.textContent = readMoreLabelCell?.textContent.trim() || '';
    dateReadDiv.append(readMoreLink);
    blogCard.append(dateReadDiv);

    row.append(blogCard);
  });

  container.append(row);
  section.append(container);

  block.replaceChildren(section);
}
