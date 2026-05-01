import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    star1Row,
    star2Row,
    headlineRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
    heroImageRow,
  ] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('hero-section');
  // moveInstrumentation(block, section); // Instrumentation for the block itself is handled by replaceChildren

  const container = document.createElement('div');
  container.classList.add('container');

  const row = document.createElement('div');
  row.classList.add('row', 'align-items-center');

  const heroDescription = document.createElement('div');
  heroDescription.classList.add('hero-description', 'col-lg-6', 'col-12');

  // Star Decoration 1
  const star1Picture = star1Row.children[0]?.querySelector('picture');
  if (star1Picture) {
    const star1Img = star1Picture.querySelector('img');
    const optimizedStar1 = createOptimizedPicture(star1Img.src, star1Img.alt, false, [{ width: '750' }]);
    optimizedStar1.classList.add('star-1');
    moveInstrumentation(star1Row.children[0], optimizedStar1.querySelector('img')); // Instrumentation on the cell
    heroDescription.append(optimizedStar1);
  }

  // Star Decoration 2
  const star2Picture = star2Row.children[0]?.querySelector('picture');
  if (star2Picture) {
    const star2Img = star2Picture.querySelector('img');
    const optimizedStar2 = createOptimizedPicture(star2Img.src, star2Img.alt, false, [{ width: '750' }]);
    optimizedStar2.classList.add('star-2');
    moveInstrumentation(star2Row.children[0], optimizedStar2.querySelector('img')); // Instrumentation on the cell
    heroDescription.append(optimizedStar2);
  }

  // Headline
  const headline = document.createElement('h1');
  moveInstrumentation(headlineRow.children[0], headline); // Instrumentation on the cell
  headline.textContent = headlineRow.children[0]?.textContent.trim() || '';
  heroDescription.append(headline);

  // Description
  const description = document.createElement('p');
  moveInstrumentation(descriptionRow.children[0], description); // Instrumentation on the cell
  description.textContent = descriptionRow.children[0]?.textContent.trim() || '';
  heroDescription.append(description);

  // CTA Link and Label
  const ctaLink = document.createElement('a');
  ctaLink.classList.add('btn', 'btn-primary', 'shadow');
  const foundCtaLink = ctaLinkRow.children[0]?.querySelector('a');
  if (foundCtaLink) {
    ctaLink.href = foundCtaLink.href;
  }
  moveInstrumentation(ctaLinkRow.children[0], ctaLink); // Instrumentation on the cell
  ctaLink.textContent = ctaLabelRow.children[0]?.textContent.trim() || '';
  moveInstrumentation(ctaLabelRow.children[0], ctaLink); // Move instrumentation for label cell to the link as well
  heroDescription.append(ctaLink);

  row.append(heroDescription);

  const heroImageDiv = document.createElement('div');
  heroImageDiv.classList.add('hero-image', 'col-lg-6', 'col-12');

  // Hero Image
  const heroPicture = heroImageRow.children[0]?.querySelector('picture');
  if (heroPicture) {
    const heroImg = heroPicture.querySelector('img');
    const optimizedHero = createOptimizedPicture(heroImg.src, heroImg.alt, false, [{ width: '750' }]);
    optimizedHero.classList.add('img-fluid');
    moveInstrumentation(heroImageRow.children[0], optimizedHero.querySelector('img')); // Instrumentation on the cell
    heroImageDiv.append(optimizedHero);
  }

  row.append(heroImageDiv);
  container.append(row);
  section.append(container);

  block.replaceChildren(section);
}
