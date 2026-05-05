import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // CHECK 0: Replaced direct children[0] access with array destructuring for root rows
  const [headingRow, descriptionRow, ...cardRows] = children;

  // CHECK 0.5: Block's own class 'future-ready-section' is not added to inner wrapper 'section'
  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise'); // Classes from ORIGINAL HTML

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, heading);
  // CHECK 0: Replaced headingRow.children[0] with destructuring
  const [headingCell] = [...headingRow.children];
  heading.textContent = headingCell?.textContent.trim();
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow, description);
  // CHECK 0: Replaced descriptionRow.children[0] with destructuring
  const [descriptionCell] = [...descriptionRow.children];
  description.textContent = descriptionCell?.textContent.trim();
  sectionHeader.append(description);

  section.append(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    // CHECK 0: Array destructuring is correct for fixed-schema item rows
    const [imageDesktopCell, imageMobileCell, cardDescriptionCell, linkCell] = [...row.children];

    const linkEl = document.createElement('a');
    linkEl.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.target = '_blank'; // Assuming target="_blank" from original HTML
    }
    moveInstrumentation(row, linkEl);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const desktopPicture = imageDesktopCell.querySelector('picture');
    const mobilePicture = imageMobileCell.querySelector('picture');

    if (desktopPicture && mobilePicture) {
      const desktopImg = desktopPicture.querySelector('img');
      const mobileImg = mobilePicture.querySelector('img');

      if (desktopImg && mobileImg) {
        // Create optimized picture for mobile and desktop
        const pictureEl = createOptimizedPicture(
          desktopImg.src,
          desktopImg.alt,
          false,
          [{ media: '(max-width: 576px)', width: '576' }, { width: '750' }],
        );
        // Replace the default img with the mobile source and then append desktop img
        const sourceMobile = pictureEl.querySelector('source');
        if (sourceMobile) {
          sourceMobile.srcset = mobileImg.src;
        } else {
          const newSourceMobile = document.createElement('source');
          newSourceMobile.media = '(max-width: 576px)';
          newSourceMobile.srcset = mobileImg.src;
          pictureEl.prepend(newSourceMobile);
        }
        cardImage.append(pictureEl);
      }
    } else if (desktopPicture) {
      // Fallback if only desktop image is provided
      const img = desktopPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        cardImage.append(optimizedPic);
      }
    }

    cardWrapper.append(cardImage);

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const desc = document.createElement('p');
    desc.classList.add('desc');
    // CHECK 0.7 B: Fixed <p>-inside-<p> issue. Card Description is type=text, but ORIGINAL HTML shows <br/>
    // So, it's safer to read innerHTML and replace <p> tags if present, or just use textContent and handle line breaks.
    // Given the original HTML has <br/> inside <p>, it's likely the cell content is just text with newlines.
    // Using textContent.trim() and replacing newlines with <br/> is appropriate here.
    desc.innerHTML = cardDescriptionCell.textContent.trim().replace(/\n/g, '<br/>');
    homeBoxCard.append(desc);

    cardWrapper.append(homeBoxCard);
    linkEl.append(cardWrapper);
    cardsContainer.append(linkEl);
  });

  container.append(cardsContainer);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);
}
