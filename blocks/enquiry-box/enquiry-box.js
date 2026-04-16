import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure block.children directly as per BlockJson model
  const [iconRow, imageDetailsRow, buttonLabelRow, buttonIconRow] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('enquiryBox');
  moveInstrumentation(block, section);

  const enquiryBoxLeft = document.createElement('div');
  enquiryBoxLeft.classList.add('enquiryBoxLeft');

  const enquiryBoxImg = document.createElement('div');
  enquiryBoxImg.classList.add('enquiryBoxImg');

  // iconRow: field="icon" type=reference
  const iconPicture = iconRow?.querySelector('picture');
  if (iconPicture) {
    const img = iconPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      enquiryBoxImg.appendChild(optimizedPic);
      optimizedPic.querySelector('img').classList.add('imageTransition', 'active');
    }
  }
  enquiryBoxLeft.appendChild(enquiryBoxImg);

  const imgDetails = document.createElement('div');
  imgDetails.classList.add('imgDetails');
  // imageDetailsRow: field="image-details" type=richtext
  if (imageDetailsRow) {
    const imageDetailsCell = [...imageDetailsRow.children].find((cell) => cell.innerHTML.trim() !== '');
    if (imageDetailsCell) {
      imgDetails.innerHTML = imageDetailsCell.innerHTML; // Use innerHTML for richtext
      moveInstrumentation(imageDetailsCell, imgDetails);
    }
  }
  enquiryBoxLeft.appendChild(imgDetails);
  section.appendChild(enquiryBoxLeft);

  const buttonGroup = document.createElement('div');
  buttonGroup.classList.add('buttonGroup', 'logoBtn');

  const enquiryBtn = document.createElement('button');
  enquiryBtn.type = 'button';
  enquiryBtn.classList.add('enquiryBtn');

  // buttonLabelRow: field="button-label" type=text
  if (buttonLabelRow) {
    const buttonLabelCell = [...buttonLabelRow.children].find((cell) => cell.textContent.trim() !== '');
    if (buttonLabelCell) {
      enquiryBtn.textContent = buttonLabelCell.textContent.trim();
      moveInstrumentation(buttonLabelCell, enquiryBtn);
    }
  }

  // buttonIconRow: field="button-icon" type=reference
  const buttonIconPicture = buttonIconRow?.querySelector('picture');
  if (buttonIconPicture) {
    const img = buttonIconPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      enquiryBtn.appendChild(optimizedPic.querySelector('img'));
    }
  }
  buttonGroup.appendChild(enquiryBtn);
  section.appendChild(buttonGroup);

  block.replaceWith(section);
}
