import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure block.children to access rows by their semantic meaning
  const [
    backgroundImageRow,
    subtitleRow,
    titleRow,
    descriptionRow,
    linkRow,
  ] = [...block.children];

  // Background Image
  const figure = document.createElement('figure');
  const picture = backgroundImageRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      // Apply original classes to the image
      img.classList.add('bg-cover'); // Class from ORIGINAL HTML
      figure.append(picture);
    }
  }
  moveInstrumentation(backgroundImageRow, figure);

  // Section Details
  const sectDet = document.createElement('div');
  sectDet.classList.add('sect-det'); // Class from ORIGINAL HTML

  // Subtitle
  const subTtle = document.createElement('div');
  moveInstrumentation(subtitleRow, subTtle);
  // Classes from ORIGINAL HTML
  subTtle.classList.add('sub-ttle', 'wow', 'animate__', 'animate__fadeInUp', 'animated');
  while (subtitleRow.firstChild) subTtle.append(subtitleRow.firstChild);
  sectDet.append(subTtle);

  // Title
  const commonTtle = document.createElement('h2');
  moveInstrumentation(titleRow, commonTtle);
  // Classes from ORIGINAL HTML
  commonTtle.classList.add('common-ttle', 'wow', 'animate__', 'animate__fadeInUp', 'animated');
  while (titleRow.firstChild) commonTtle.append(titleTtle.firstChild); // Corrected: titleRow.firstChild
  sectDet.append(commonTtle);

  // Description
  const descriptionDiv = document.createElement('p');
  moveInstrumentation(descriptionRow, descriptionDiv);
  // Classes from ORIGINAL HTML
  descriptionDiv.classList.add('wow', 'animate__', 'animate__fadeInUp', 'animated');
  while (descriptionRow.firstChild) descriptionDiv.append(descriptionRow.firstChild);
  sectDet.append(descriptionDiv);

  // Link
  const link = linkRow.querySelector('a');
  if (link) {
    const btnBox = document.createElement('a');
    moveInstrumentation(linkRow, btnBox);
    // Classes from ORIGINAL HTML
    btnBox.classList.add('btn-box', 'wow', 'animate__', 'animate__fadeInUp', 'animated');
    btnBox.href = link.href;
    btnBox.textContent = link.textContent;
    sectDet.append(btnBox);
  }

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1920' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(figure, sectDet);
}
