import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [imageRow, linkRow] = [...block.children];

  const link = linkRow.querySelector('a');
  const picture = imageRow.querySelector('picture');
  // const img = picture ? picture.querySelector('img') : null; // img is not used after this, can be removed

  const logoLink = document.createElement('a');
  logoLink.classList.add('logo__picture'); // Class name from allowlist
  if (link) {
    logoLink.href = link.href;
    moveInstrumentation(linkRow, logoLink);
  } else {
    // If no link is provided, default to homepage
    logoLink.href = '/';
  }

  if (picture) {
    moveInstrumentation(imageRow, logoLink);
    logoLink.append(picture);
  }

  const span = document.createElement('span');
  span.classList.add('arena'); // Class name from allowlist
  span.append(logoLink);

  block.textContent = '';
  block.append(span);

  // Optimize image
  block.querySelectorAll('picture > img').forEach((image) => {
    const optimizedPic = createOptimizedPicture(image.src, image.alt, false, [{ width: '750' }]);
    moveInstrumentation(image, optimizedPic.querySelector('img'));
    image.closest('picture').replaceWith(optimizedPic);
  });
}
