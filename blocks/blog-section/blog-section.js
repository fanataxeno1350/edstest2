import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  // The block already has the 'blog-section' class from AEM.
  // Do NOT add 'blog-section' to the inner section element.
  moveInstrumentation(block, section);

  // CHECK 0: Replaced direct bracket access for sectionTitleRow
  const [sectionTitleRow, ...blogCardRows] = children;

  const sectionTitle = document.createElement('h2');
  moveInstrumentation(sectionTitleRow, sectionTitle);
  sectionTitle.textContent = sectionTitleRow.textContent.trim();
  section.append(sectionTitle);

  const container = document.createElement('div');
  container.classList.add('container', 'mt-6');

  const row = document.createElement('div');
  row.classList.add('row', 'justify-content-around');

  blogCardRows.forEach((blogCardRow) => {
    // CHECK 0: Array destructuring is correct for fixed-schema rows
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
        // Add img-fluid class to the img element inside the optimized picture
        optimizedPic.querySelector('img').classList.add('img-fluid');
        moveInstrumentation(img, optimizedPic.querySelector('img'));
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
    categoryAnchor.textContent = categoryCell?.textContent.trim();
    categoriesDiv.append(categoryAnchor);
    blogCard.append(categoriesDiv);

    // Title and Description
    const titleDescriptionLink = document.createElement('a');
    const foundTitleLink = titleLinkCell?.querySelector('a');
    if (foundTitleLink) {
      titleDescriptionLink.href = foundTitleLink.href;
    }

    const title = document.createElement('h5');
    title.textContent = titleCell?.textContent.trim();
    titleDescriptionLink.append(title);

    // CHECK 0.7 B: description cell is type=text, so its innerHTML is "<p>content</p>"
    // Assigning to <p> creates <p><p>...</p></p>. Use a div or extract inner text.
    // Given the original HTML uses <p> for description, we extract the inner text.
    const description = document.createElement('p');
    description.textContent = descriptionCell?.textContent.trim();
    titleDescriptionLink.append(description);

    blogCard.append(titleDescriptionLink);

    // Date and Read More
    const dateReadDiv = document.createElement('div');
    dateReadDiv.classList.add('d-flex', 'date-read', 'justify-content-between', 'align-items-center');

    const time = document.createElement('time');
    time.setAttribute('datetime', dateCell?.textContent.trim()); // Assuming date is in a parseable format
    time.textContent = dateCell?.textContent.trim();
    dateReadDiv.append(time);

    const readMoreAnchor = document.createElement('a');
    readMoreAnchor.classList.add('btn', 'btn-primary');
    const foundReadMoreLink = readMoreLinkCell?.querySelector('a');
    if (foundReadMoreLink) {
      readMoreAnchor.href = foundReadMoreLink.href;
    }
    readMoreAnchor.textContent = readMoreLabelCell?.textContent.trim();
    dateReadDiv.append(readMoreAnchor);

    blogCard.append(dateReadDiv);
    row.append(blogCard);
  });

  container.append(row);
  section.append(container);

  block.replaceChildren(section);
}
