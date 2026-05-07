import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    decorStar1Row,
    decorStar2Row,
    headlineRow,
    descriptionRow,
    ctaLabelRow,
    ctaLinkRow,
    heroImageRow,
  ] = [...block.children];

  const heroSection = document.createElement('section');
  heroSection.classList.add('hero-section');

  const container = document.createElement('div');
  container.classList.add('container');
  heroSection.append(container);

  const row = document.createElement('div');
  row.classList.add('row', 'align-items-center');
  container.append(row);

  // Hero Description
  const heroDescription = document.createElement('div');
  heroDescription.classList.add('hero-description', 'col-lg-6', 'col-12');
  row.append(heroDescription);

  // Decorative Star 1
  const decorStar1 = decorStar1Row.children[0]?.querySelector('picture');
  if (decorStar1) {
    const star1Img = decorStar1.querySelector('img');
    const optimizedPic = createOptimizedPicture(star1Img.src, star1Img.alt, false, [{ width: '750' }]);
    const newStar1Img = optimizedPic.querySelector('img');
    newStar1Img.classList.add('star-1');
    moveInstrumentation(decorStar1Row, newStar1Img);
    heroDescription.append(newStar1Img);
  }

  // Decorative Star 2
  const decorStar2 = decorStar2Row.children[0]?.querySelector('picture');
  if (decorStar2) {
    const star2Img = decorStar2.querySelector('img');
    const optimizedPic = createOptimizedPicture(star2Img.src, star2Img.alt, false, [{ width: '750' }]);
    const newStar2Img = optimizedPic.querySelector('img');
    newStar2Img.classList.add('star-2');
    moveInstrumentation(decorStar2Row, newStar2Img);
    heroDescription.append(newStar2Img);
  }

  // Headline
  const headline = document.createElement('h1');
  moveInstrumentation(headlineRow, headline);
  headline.innerHTML = headlineRow.children[0]?.innerHTML || ''; // Changed from textContent to innerHTML for potential rich text
  heroDescription.append(headline);

  // Description
  const description = document.createElement('p');
  moveInstrumentation(descriptionRow, description);
  description.innerHTML = descriptionRow.children[0]?.innerHTML || '';
  heroDescription.append(description);

  // CTA Link
  const ctaLink = document.createElement('a');
  ctaLink.classList.add('btn', 'btn-primary', 'shadow');
  moveInstrumentation(ctaLinkRow, ctaLink); // Instrumentation for the link row
  const foundLink = ctaLinkRow.children[0]?.querySelector('a');
  if (foundLink) {
    ctaLink.href = foundLink.href;
  }
  ctaLink.innerHTML = ctaLabelRow.children[0]?.innerHTML || ''; // Changed from textContent to innerHTML for potential rich text
  heroDescription.append(ctaLink);

  // Hero Image
  const heroImageDiv = document.createElement('div');
  heroImageDiv.classList.add('hero-image', 'col-lg-6', 'col-12');
  row.append(heroImageDiv);

  const heroPicture = heroImageRow.children[0]?.querySelector('picture');
  if (heroPicture) {
    const heroImg = heroPicture.querySelector('img');
    const optimizedHeroPic = createOptimizedPicture(heroImg.src, heroImg.alt, false, [{ width: '750' }]);
    const newHeroImg = optimizedHeroPic.querySelector('img');
    newHeroImg.classList.add('img-fluid');
    moveInstrumentation(heroImageRow, newHeroImg);
    heroImageDiv.append(newHeroImg);
  }

  block.replaceChildren(heroSection);
}
