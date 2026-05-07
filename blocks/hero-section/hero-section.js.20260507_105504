import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [
    star1Row,
    star2Row,
    headlineRow,
    headlineSpanRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
    heroImageRow,
  ] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('hero-section');
  // The block's own class 'hero-section' is already on the outer block div.
  // Adding it here would cause double padding/CSS. Removed.
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');

  const row = document.createElement('div');
  row.classList.add('row', 'align-items-center');

  const heroDescription = document.createElement('div');
  heroDescription.classList.add('hero-description', 'col-lg-6', 'col-12');

  // Star 1
  const star1Picture = star1Row.querySelector('picture');
  if (star1Picture) {
    const star1Img = star1Picture.querySelector('img');
    const optimizedStar1 = createOptimizedPicture(star1Img.src, star1Img.alt, false, [{ width: '750' }]);
    optimizedStar1.querySelector('img').classList.add('star-1');
    moveInstrumentation(star1Row, optimizedStar1.querySelector('img'));
    heroDescription.append(optimizedStar1);
  }

  // Star 2
  const star2Picture = star2Row.querySelector('picture');
  if (star2Picture) {
    const star2Img = star2Picture.querySelector('img');
    const optimizedStar2 = createOptimizedPicture(star2Img.src, star2Img.alt, false, [{ width: '750' }]);
    optimizedStar2.querySelector('img').classList.add('star-2');
    moveInstrumentation(star2Row, optimizedStar2.querySelector('img'));
    heroDescription.append(optimizedStar2);
  }

  // Headline
  const h1 = document.createElement('h1');
  moveInstrumentation(headlineRow, h1);
  h1.textContent = headlineRow.textContent.trim();

  // Headline Span
  const span = document.createElement('span');
  moveInstrumentation(headlineSpanRow, span);
  span.textContent = headlineSpanRow.textContent.trim();
  h1.append(span);
  heroDescription.append(h1);

  // Description
  const p = document.createElement('p');
  moveInstrumentation(descriptionRow, p);
  p.textContent = descriptionRow.textContent.trim();
  heroDescription.append(p);

  // CTA Link
  const ctaLink = ctaLinkRow.querySelector('a');
  const ctaLabel = ctaLabelRow.textContent.trim();
  if (ctaLink && ctaLabel) {
    const anchor = document.createElement('a');
    anchor.href = ctaLink.href;
    anchor.textContent = ctaLabel;
    anchor.classList.add('btn', 'btn-primary', 'shadow');
    moveInstrumentation(ctaLinkRow, anchor);
    moveInstrumentation(ctaLabelRow, anchor);
    heroDescription.append(anchor);
  }

  row.append(heroDescription);

  // Hero Image
  const heroImageDiv = document.createElement('div');
  heroImageDiv.classList.add('hero-image', 'col-lg-6', 'col-12');
  const heroImagePicture = heroImageRow.querySelector('picture');
  if (heroImagePicture) {
    const heroImg = heroImagePicture.querySelector('img');
    const optimizedHeroImage = createOptimizedPicture(heroImg.src, heroImg.alt, false, [{ width: '750' }]);
    optimizedHeroImage.querySelector('img').classList.add('img-fluid');
    moveInstrumentation(heroImageRow, optimizedHeroImage.querySelector('img'));
    heroImageDiv.append(optimizedHeroImage);
  }
  row.append(heroImageDiv);

  container.append(row);
  section.append(container);
  block.replaceChildren(section);
}
