import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure the first two rows for heading and description, and slice the rest for cards
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const headingCell = headingRow.children[0]; // Access first cell of headingRow
  if (headingCell) {
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    // Add data-aos attributes from original HTML
    heading.dataset.aosEasing = 'ease-in-out';
    heading.dataset.aos = 'fade-up';
    heading.dataset.aosDelay = '200';

    heading.textContent = headingCell.textContent.trim();
    moveInstrumentation(headingRow, heading);
    sectionHeader.append(heading);
  }

  const descriptionCell = descriptionRow.children[0]; // Access first cell of descriptionRow
  if (descriptionCell) {
    const description = document.createElement('p');
    description.classList.add('aos-init', 'aos-animate');
    // Add data-aos attributes from original HTML
    description.dataset.aos = 'fade-up';
    description.dataset.aosOffset = '100';
    description.dataset.aosDuration = '650';
    description.dataset.aosEasing = 'ease-in-out';

    description.textContent = descriptionCell.textContent.trim();
    moveInstrumentation(descriptionRow, description);
    sectionHeader.append(description);
  }

  section.append(sectionHeader);

  // Performance Driven Cards
  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    // Destructure cells for fixed schema card items
    const [imageMobileCell, imageDesktopCell, descriptionCell, linkCell] = [...row.children];

    const linkEl = document.createElement('a');
    linkEl.classList.add('performace-driven-cards-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      // Copy target attribute if present in original link
      if (foundLink.target) {
        linkEl.target = foundLink.target;
      }
    }
    moveInstrumentation(row, linkEl);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureMobile = imageMobileCell?.querySelector('picture');
    const pictureDesktop = imageDesktopCell?.querySelector('picture');

    if (pictureMobile && pictureDesktop) {
      const newPicture = document.createElement('picture');

      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      // Use the srcset from the mobile picture's source if available, otherwise img.src
      sourceMobile.srcset = pictureMobile.querySelector('source')?.srcset || pictureMobile.querySelector('img').src;
      newPicture.append(sourceMobile);

      const imgDesktop = pictureDesktop.querySelector('img');
      const optimizedPic = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
      const newImg = optimizedPic.querySelector('img');
      moveInstrumentation(imgDesktop, newImg); // Move instrumentation from original img to new img
      newPicture.append(newImg); // Append the optimized img to the new picture
      cardImage.append(newPicture);
    } else if (pictureDesktop) {
      const imgDesktop = pictureDesktop.querySelector('img');
      const optimizedPic = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
      const newImg = optimizedPic.querySelector('img');
      moveInstrumentation(imgDesktop, newImg);
      cardImage.append(newImg.closest('picture')); // Append the entire optimized picture element
    }

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const descP = document.createElement('p');
    descP.classList.add('desc');
    // Read innerHTML for richtext-like content, then clean up if it's just a single paragraph
    const descriptionContent = descriptionCell?.innerHTML || '';
    if (descriptionContent.startsWith('<p>') && descriptionContent.endsWith('</p>')) {
      descP.innerHTML = descriptionContent; // Preserve potential <br/> tags
    } else {
      descP.textContent = descriptionCell?.textContent.trim() || '';
    }

    homeBoxCard.append(descP);
    cardWrapper.append(cardImage, homeBoxCard);
    linkEl.append(cardWrapper);
    cardsContainer.append(linkEl);
  });

  container.append(cardsContainer);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);
}
