import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    decorStar1Row,
    decorStar2Row,
    headlineRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
    mainImageRow,
  ] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('container');

  const row = document.createElement('div');
  row.classList.add('row', 'align-items-center');

  const heroDescription = document.createElement('div');
  heroDescription.classList.add('hero-description', 'col-lg-6', 'col-12');

  // Decorative Star 1
  const decorStar1Picture = decorStar1Row?.querySelector('picture');
  if (decorStar1Picture) {
    const decorStar1Img = decorStar1Picture.querySelector('img');
    const star1 = document.createElement('img');
    star1.src = decorStar1Img?.src || '';
    star1.alt = decorStar1Img?.alt || '';
    star1.classList.add('star-1');
    moveInstrumentation(decorStar1Row, star1);
    heroDescription.append(star1);
  }

  // Decorative Star 2
  const decorStar2Picture = decorStar2Row?.querySelector('picture');
  if (decorStar2Picture) {
    const decorStar2Img = decorStar2Picture.querySelector('img');
    const star2 = document.createElement('img');
    star2.src = decorStar2Img?.src || '';
    star2.alt = decorStar2Img?.alt || '';
    star2.classList.add('star-2');
    moveInstrumentation(decorStar2Row, star2);
    heroDescription.append(star2);
  }

  // Headline
  const headline = document.createElement('h1');
  moveInstrumentation(headlineRow, headline);
  // Headline is richtext, so use innerHTML from the cell itself
  headline.innerHTML = headlineRow.children[0]?.innerHTML || '';
  heroDescription.append(headline);

  // Description
  const description = document.createElement('p');
  moveInstrumentation(descriptionRow, description);
  // Description is text, so use textContent from the cell itself
  description.textContent = descriptionRow.children[0]?.textContent.trim() || '';
  heroDescription.append(description);

  // CTA Link and Label
  const ctaLink = document.createElement('a');
  const foundCtaLink = ctaLinkRow?.querySelector('a');
  if (foundCtaLink) {
    ctaLink.href = foundCtaLink.href;
  }
  // CTA Label is text, so use textContent from the cell itself
  ctaLink.textContent = ctaLabelRow?.children[0]?.textContent.trim() || '';
  ctaLink.classList.add('btn', 'btn-primary', 'shadow');
  moveInstrumentation(ctaLinkRow, ctaLink);
  moveInstrumentation(ctaLabelRow, ctaLink);
  heroDescription.append(ctaLink);

  row.append(heroDescription);

  // Main Image
  const heroImage = document.createElement('div');
  heroImage.classList.add('hero-image', 'col-lg-6', 'col-12');
  const mainImagePicture = mainImageRow?.querySelector('picture');
  if (mainImagePicture) {
    const mainImg = mainImagePicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(mainImg.src, mainImg.alt, false, [{ width: '750' }]);
    // moveInstrumentation should be on the picture element, not just the img inside it
    moveInstrumentation(mainImageRow, optimizedPic);
    optimizedPic.classList.add('img-fluid'); // Apply img-fluid to the picture element
    heroImage.append(optimizedPic);
  }
  row.append(heroImage);

  container.append(row);
  block.replaceChildren(container);

  // This block.querySelectorAll('picture > img') loop is redundant and should be removed.
  // createOptimizedPicture is already called for the main image, and the decorative stars
  // are SVGs or already handled. This would re-optimize images that are already optimized
  // or not meant for optimization in this context.
}
