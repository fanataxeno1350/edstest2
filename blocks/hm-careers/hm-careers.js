import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add('hm-careers');

  const hmCareersCon = document.createElement('div');
  hmCareersCon.classList.add('hm-careers-con');

  // Use content detection instead of index access
  const rows = [...block.children];
  const imageRow = rows.find(row => row.querySelector('picture'));
  const subTitleRow = rows.find(row => row.textContent.includes('Sub Title value')); // Assuming unique text for detection
  const headingRow = rows.find(row => row.textContent.includes('Heading value')); // Assuming unique text for detection
  const linkRow = rows.find(row => row.querySelector('a'));

  // Image
  if (imageRow) {
    const figure = document.createElement('figure');
    const picture = imageRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1920' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        figure.append(optimizedPic);
        optimizedPic.querySelector('img').classList.add('bg-cover');
      }
    }
    moveInstrumentation(imageRow, figure);
    hmCareersCon.append(figure);
  }


  // Section Details
  const sectDet = document.createElement('div');
  sectDet.classList.add('sect-det');

  // Sub Title
  if (subTitleRow) {
    const subTtle = document.createElement('div');
    subTtle.classList.add('sub-ttle', 'wow', 'animate__', 'animate__fadeInUp', 'animated');
    moveInstrumentation(subTitleRow, subTtle);
    while (subTitleRow.firstChild) subTtle.append(subTitleRow.firstChild);
    sectDet.append(subTtle);
  }

  // Heading
  if (headingRow) {
    const commonTtle = document.createElement('h2');
    commonTtle.classList.add('common-ttle', 'wow', 'animate__', 'animate__fadeInUp', 'animated');
    moveInstrumentation(headingRow, commonTtle);
    while (headingRow.firstChild) commonTtle.append(headingRow.firstChild);
    sectDet.append(commonTtle);
  }

  // Link
  if (linkRow) {
    const link = linkRow.querySelector('a');
    if (link) {
      const btnBox = document.createElement('a');
      btnBox.classList.add('btn-box', 'wow', 'animate__', 'animate__fadeInUp', 'animated');
      btnBox.href = link.href;
      moveInstrumentation(linkRow, btnBox);
      while (linkRow.firstChild) btnBox.append(linkRow.firstChild);
      sectDet.append(btnBox);
    }
  }

  hmCareersCon.append(sectDet);
  block.textContent = '';
  block.append(hmCareersCon);
}
