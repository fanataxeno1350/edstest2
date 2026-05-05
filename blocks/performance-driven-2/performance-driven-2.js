import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure root rows based on BlockJson model
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  // Block's own class 'performance-driven-2' is already on the outer block div.
  // Do not add it to an inner wrapper.
  section.classList.add('section', 'grey-bg', 'spirit-of-rise');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // Access cell content via destructuring or direct cell reference, not row.children[0]
  const [headingCell] = [...headingRow.children];
  heading.textContent = headingCell ? headingCell.textContent.trim() : '';
  sectionHeader.append(heading);

  const subheading = document.createElement('p');
  subheading.classList.add('aos-init', 'aos-animate');
  // Access cell content via destructuring or direct cell reference, not row.children[0]
  const [subheadingCell] = [...subheadingRow.children];
  subheading.textContent = subheadingCell ? subheadingCell.textContent.trim() : '';
  sectionHeader.append(subheading);

  section.append(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');
  performanceDriven.append(container);

  const performaceDrivenCards = document.createElement('div');
  performaceDrivenCards.classList.add('performace-driven-cards');
  container.append(performaceDrivenCards);

  cardRows.forEach((row) => {
    // Fixed schema for card rows, use destructuring
    const [imageMobileCell, imageDesktopCell, descriptionCell, linkCell] = [...row.children];

    const linkAnchor = document.createElement('a');
    linkAnchor.classList.add('performace-driven-cards-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      linkAnchor.href = foundLink.href;
      linkAnchor.target = '_blank'; // From original HTML
    }
    moveInstrumentation(row, linkAnchor);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');
    linkAnchor.append(cardWrapper);

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    cardWrapper.append(cardImage);

    // Mobile image
    const mobilePicture = imageMobileCell?.querySelector('picture');
    if (mobilePicture) {
      // The original HTML has <source> and <img> directly inside <picture>
      // We need to reconstruct this structure or append the picture directly.
      // For mobile, we extract the source for media query.
      const mobileSource = mobilePicture.querySelector('source[media="(max-width: 576px)"]');
      if (mobileSource) {
        cardImage.append(mobileSource.cloneNode(true)); // Clone to move it
      }
    }

    // Desktop image
    const desktopPicture = imageDesktopCell?.querySelector('picture');
    if (desktopPicture) {
      const desktopImg = desktopPicture.querySelector('img');
      if (desktopImg) {
        // createOptimizedPicture handles the <img> and its sources
        // We need to ensure the mobile source is also present if it was extracted separately.
        // If mobile source was appended, add desktop img directly or via createOptimizedPicture
        // For simplicity, let's append the desktop picture directly if mobile source was handled.
        // Or, better, create a single optimized picture for both.
        // Given the original HTML has separate sources, let's append the desktop img.
        const optimizedPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
        // If mobile source was already added, ensure the img is also added.
        // The createOptimizedPicture function usually creates the whole picture element.
        // Let's assume createOptimizedPicture handles the img tag, and we've already added the source.
        // If the mobile source was added, we need to ensure the img from desktopPicture is also added.
        // A simpler approach is to append the entire desktop picture, and let CSS handle display.
        // However, the original JS tried to combine them. Let's ensure the desktop image is added.
        const desktopImgElement = optimizedPic.querySelector('img');
        if (desktopImgElement) {
          cardImage.append(desktopImgElement);
        }
      }
    }

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');
    cardWrapper.append(homeBoxCard);

    const description = document.createElement('p');
    description.classList.add('desc');
    // Description is type=text but can contain line breaks, so innerHTML is safer than textContent
    description.innerHTML = descriptionCell ? descriptionCell.innerHTML.trim() : '';
    homeBoxCard.append(description);

    performaceDrivenCards.append(linkAnchor);
  });

  section.append(performanceDriven);
  block.replaceChildren(section);
}
