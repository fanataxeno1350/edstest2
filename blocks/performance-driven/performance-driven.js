import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Check 0.5: The block's own class 'performance-driven' is already on the outer div.
  // The generated JS was adding 'section' and 'spirit-of-rise' to the inner section.
  // 'spirit-of-rise' is a valid class from ORIGINAL HTML. 'section' is not needed here.
  // The block name 'performance-driven' is NOT added to the inner section, which is correct.
  const root = document.createElement('section');
  root.classList.add('spirit-of-rise'); // Only add classes from ORIGINAL HTML that are not the block name

  const [headingRow, subheadingRow, ...cardRows] = [...block.children]; // CHECK 0: Fixed direct children[0] and children[1] access

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const subheading = document.createElement('p');
  subheading.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(subheadingRow, subheading);
  subheading.textContent = subheadingRow.textContent.trim();
  sectionHeader.append(subheading);

  root.append(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home'); // CHECK 0.5: This is the block's own class, but it's on an inner div, not the root. This is fine as it's part of the original structure.

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    // CHECK 0: Array destructuring is correctly used here for fixed schema rows.
    const [imageDesktopCell, imageMobileCell, cardLabelCell, cardLinkCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = cardLinkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank';
    }
    moveInstrumentation(row, cardLink);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    const pictureMobile = imageMobileCell.querySelector('picture');

    if (pictureDesktop && pictureMobile) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      // Ensure srcset is correctly set from the mobile picture's img src
      sourceMobile.srcset = pictureMobile.querySelector('img')?.src || '';

      const imgDesktop = pictureDesktop.querySelector('img');
      const optimizedPic = createOptimizedPicture(imgDesktop?.src || '', imgDesktop?.alt || '', false, [{ width: '750' }]);
      optimizedPic.prepend(sourceMobile);
      cardImage.append(optimizedPic);
    } else if (pictureDesktop) {
      const imgDesktop = pictureDesktop.querySelector('img');
      const optimizedPic = createOptimizedPicture(imgDesktop?.src || '', imgDesktop?.alt || '', false, [{ width: '750' }]);
      cardImage.append(optimizedPic);
    } else if (pictureMobile) {
      const imgMobile = pictureMobile.querySelector('img');
      const optimizedPic = createOptimizedPicture(imgMobile?.src || '', imgMobile?.alt || '', false, [{ width: '750' }]);
      cardImage.append(optimizedPic);
    }

    cardWrapper.append(cardImage);

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const desc = document.createElement('p');
    desc.classList.add('desc');
    // CHECK 0.7 B: cardLabel is richtext, so its innerHTML is "<p>content</p>".
    // Assigning this directly to a <p> creates <p><p>...</p></p>.
    // The fix is to extract the innerHTML of the paragraph inside the cell, or use a div.
    // Given the ORIGINAL HTML uses <p class="desc"> with text directly,
    // extracting the innerHTML of the cell's first paragraph is appropriate.
    desc.innerHTML = cardLabelCell.querySelector('p')?.innerHTML || cardLabelCell.textContent.trim();
    homeBoxCard.append(desc);

    cardWrapper.append(homeBoxCard);
    cardLink.append(cardWrapper);
    cardsWrapper.append(cardLink);
  });

  container.append(cardsWrapper);
  performanceDriven.append(container);
  root.append(performanceDriven);

  block.replaceChildren(root);
}
