import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const [sectionTitleRow, ...blogCardRows] = children; // Destructuring for root rows

  // The outer block div already has 'blog-section' class.
  // We create a root div to hold the new structure, not a section.
  const root = document.createElement('div');

  // Section Title
  const h2 = document.createElement('h2');
  moveInstrumentation(sectionTitleRow, h2);
  h2.textContent = sectionTitleRow.children[0]?.textContent.trim() || ''; // Access content from the cell
  root.append(h2);

  const container = document.createElement('div');
  container.classList.add('container', 'mt-6');

  const row = document.createElement('div');
  row.classList.add('row', 'justify-content-around');

  blogCardRows.forEach((blogCardRow) => {
    const [
      mainLinkCell,
      cardImageCell,
      categoryLinkCell,
      categoryLabelCell,
      titleCell,
      descriptionCell,
      dateCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...blogCardRow.children];

    const blogCard = document.createElement('div');
    blogCard.classList.add('blog-card', 'col-lg-4', 'col-md-6', 'col-12');
    moveInstrumentation(blogCardRow, blogCard);

    // Main Link Wrapper
    const mainLinkWrapper = document.createElement('a');
    const mainLink = mainLinkCell.querySelector('a');
    if (mainLink) {
      mainLinkWrapper.href = mainLink.href;
    }
    blogCard.append(mainLinkWrapper);

    // Card Image
    const picture = cardImageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      // moveInstrumentation(img, optimizedPic.querySelector('img')); // img is not an authored row, no need for instrumentation
      mainLinkWrapper.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('img-fluid');
    }

    // Categories
    const categoriesDiv = document.createElement('div');
    categoriesDiv.classList.add('categories', 'align-items-center', 'gap-3', 'flex-wrap');
    blogCard.append(categoriesDiv);

    const categoryLink = document.createElement('a');
    const categoryLinkFound = categoryLinkCell.querySelector('a');
    if (categoryLinkFound) {
      categoryLink.href = categoryLinkFound.href;
    }
    categoryLink.textContent = categoryLabelCell.textContent.trim();
    categoriesDiv.append(categoryLink);

    // Title and Description Link Wrapper
    const titleDescriptionLinkWrapper = document.createElement('a');
    if (mainLink) { // Use the same mainLink href
      titleDescriptionLinkWrapper.href = mainLink.href;
    }
    blogCard.append(titleDescriptionLinkWrapper);

    // Title
    const h5 = document.createElement('h5');
    h5.textContent = titleCell.textContent.trim();
    titleDescriptionLinkWrapper.append(h5);

    // Description
    const p = document.createElement('p');
    p.textContent = descriptionCell.textContent.trim();
    titleDescriptionLinkWrapper.append(p);

    // Date and CTA
    const dateReadDiv = document.createElement('div');
    dateReadDiv.classList.add('d-flex', 'date-read', 'justify-content-between', 'align-items-center');
    blogCard.append(dateReadDiv);

    const time = document.createElement('time');
    time.setAttribute('datetime', dateCell.textContent.trim()); // Assuming date format is suitable for datetime
    time.textContent = dateCell.textContent.trim();
    dateReadDiv.append(time);

    const ctaLink = document.createElement('a');
    const ctaLinkFound = ctaLinkCell.querySelector('a');
    if (ctaLinkFound) {
      ctaLink.href = ctaLinkFound.href;
    }
    ctaLink.classList.add('btn', 'btn-primary');
    ctaLink.textContent = ctaLabelCell.textContent.trim();
    dateReadDiv.append(ctaLink);

    row.append(blogCard);
  });

  container.append(row);
  root.append(container);
  block.replaceChildren(root);
}
