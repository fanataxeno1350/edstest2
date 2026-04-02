import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructuring block.children is a form of index access, but it's acceptable
  // when the block structure is strictly defined and known to have a fixed number of rows,
  // and each row corresponds to a distinct field.
  // The EDS BLOCK STRUCTURE and BLOCK JSON confirm this fixed structure.
  const [star1Row, star2Row, headingRow, descriptionRow, ctaRow, heroImageRow] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('container');

  const row = document.createElement('div');
  row.classList.add('row', 'align-items-center');

  const heroDescription = document.createElement('div');
  heroDescription.classList.add('hero-description', 'col-lg-6', 'col-12');

  // Star 1
  // Accessing the first child of star1Row, which is the div containing the picture,
  // then querying for the picture element within that div.
  const star1Picture = star1Row.querySelector('div')?.querySelector('picture');
  if (star1Picture) {
    const star1Img = star1Picture.querySelector('img');
    const star1El = document.createElement('img');
    star1El.src = star1Img.src;
    star1El.alt = star1Img.alt;
    star1El.classList.add('star-1');
    moveInstrumentation(star1Row, star1El);
    heroDescription.append(star1El);
  }

  // Star 2
  const star2Picture = star2Row.querySelector('div')?.querySelector('picture');
  if (star2Picture) {
    const star2Img = star2Picture.querySelector('img');
    const star2El = document.createElement('img');
    star2El.src = star2Img.src;
    star2El.alt = star2Img.alt;
    star2El.classList.add('star-2');
    moveInstrumentation(star2Row, star2El);
    heroDescription.append(star2El);
  }

  // Heading
  const h1 = document.createElement('h1');
  // The headingRow's first child is the div, and its first child is the text node or other content.
  // We want to move all children from the inner div.
  const headingContentDiv = headingRow.querySelector('div');
  if (headingContentDiv) {
    moveInstrumentation(headingContentDiv, h1);
    while (headingContentDiv.firstChild) h1.append(headingContentDiv.firstChild);
  }
  heroDescription.append(h1);

  // Description
  const descriptionP = document.createElement('p');
  const descriptionContentDiv = descriptionRow.querySelector('div');
  if (descriptionContentDiv) {
    moveInstrumentation(descriptionContentDiv, descriptionP);
    while (descriptionContentDiv.firstChild) descriptionP.append(descriptionContentDiv.firstChild);
  }
  heroDescription.append(descriptionP);

  // CTA
  const ctaContentDiv = ctaRow.querySelector('div');
  const ctaLink = ctaContentDiv?.querySelector('a');
  if (ctaLink) {
    const ctaButton = document.createElement('a');
    ctaButton.href = ctaLink.href;
    // Corrected class names based on ORIGINAL HTML
    ctaButton.classList.add('btn', 'btn-primary', 'shadow');
    moveInstrumentation(ctaContentDiv, ctaButton);
    // Move all children from the original CTA link into the new button element
    while (ctaLink.firstChild) ctaButton.append(ctaLink.firstChild);
    heroDescription.append(ctaButton);
  }

  row.append(heroDescription);

  const heroImage = document.createElement('div');
  heroImage.classList.add('hero-image', 'col-lg-6', 'col-12');

  // Hero Image
  const heroImagePicture = heroImageRow.querySelector('div')?.querySelector('picture');
  if (heroImagePicture) {
    const heroImageImg = heroImagePicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(heroImageImg.src, heroImageImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(heroImageImg, optimizedPic.querySelector('img'));
    // Corrected class name based on ORIGINAL HTML
    optimizedPic.querySelector('img').classList.add('img-fluid');
    heroImage.append(optimizedPic);
  }
  moveInstrumentation(heroImageRow, heroImage);
  row.append(heroImage);

  container.append(row);
  block.textContent = '';
  block.append(container);
}
