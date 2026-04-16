import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add('big_box');

  const container = document.createElement('div');
  container.classList.add('container');
  moveInstrumentation(block, container);

  const cartBox = document.createElement('div');
  cartBox.classList.add('cart_box');
  container.append(cartBox);

  const ul = document.createElement('ul');
  cartBox.append(ul);

  [...block.children].forEach((row) => {
    // Destructuring is correct here as per EDS Block Structure for fixed-field item models
    const [imageCell, imageLinkCell, titleCell, viewAllLinkCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('aos-item', 'aos-init', 'aos-animate'); // Assuming these are always present
    li.setAttribute('data-aos', 'fade-up');
    moveInstrumentation(row, li);

    const behindBox = document.createElement('div');
    behindBox.classList.add('behind_box');

    const imageLink = document.createElement('a');
    imageLink.classList.add('bike');
    // Correctly extract href from aem-content cell
    const originalImageLinkAnchor = imageLinkCell.querySelector('a');
    if (originalImageLinkAnchor) {
      imageLink.href = originalImageLinkAnchor.href;
    }

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '550' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageLink.append(optimizedPic);
      }
    }
    behindBox.append(imageLink);
    li.append(behindBox);

    const h4 = document.createElement('h4');
    h4.textContent = titleCell.textContent.trim();
    // Replicate the onclick behavior from the original HTML
    if (originalImageLinkAnchor) {
      h4.addEventListener('click', () => {
        window.location.href = originalImageLinkAnchor.href;
      });
    }
    li.append(h4);

    const viewAllLink = document.createElement('a');
    viewAllLink.classList.add('m-hide');
    // Correctly extract href from aem-content cell
    const originalViewAllLinkAnchor = viewAllLinkCell.querySelector('a');
    if (originalViewAllLinkAnchor) {
      viewAllLink.href = originalViewAllLinkAnchor.href;
    }
    viewAllLink.textContent = 'View all'; // Hardcoded label from original HTML
    li.append(viewAllLink);

    ul.append(li);
  });

  block.innerHTML = '';
  block.append(container);
}
