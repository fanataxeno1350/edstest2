import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Use array destructuring for root rows as per fixed schema
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  // The block's own class 'future-ready' is already on the outer div.
  // 'spirit-of-rise' is from original HTML, 'section', 'grey-bg' are also from original.
  section.classList.add('section', 'grey-bg', 'spirit-of-rise');

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

  section.append(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    // Use array destructuring for card item rows as per fixed schema
    const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

    const linkEl = document.createElement('a');
    linkEl.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.target = '_blank';
    }
    moveInstrumentation(row, linkEl);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    const pictureMobile = imageMobileCell.querySelector('picture');

    if (pictureDesktop && pictureMobile) {
      const imgDesktop = pictureDesktop.querySelector('img');
      const imgMobile = pictureMobile.querySelector('img');

      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      sourceMobile.srcset = imgMobile.src;

      // createOptimizedPicture returns a <picture> element, not just an <img>
      // We need to extract the <img> from it to append to our new picture element
      const optimizedPictureDesktop = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
      const optimizedImgDesktop = optimizedPictureDesktop.querySelector('img');
      optimizedImgDesktop.alt = imgDesktop.alt; // Ensure alt is set correctly

      const newPicture = document.createElement('picture');
      newPicture.append(sourceMobile, optimizedImgDesktop); // Append source and the optimized img
      cardImage.append(newPicture);
    } else if (pictureDesktop) {
      const optimizedPicture = createOptimizedPicture(pictureDesktop.querySelector('img').src, pictureDesktop.querySelector('img').alt, false, [{ width: '750' }]);
      cardImage.append(optimizedPicture); // Append the entire optimized picture element
    } else if (pictureMobile) {
      const optimizedPicture = createOptimizedPicture(pictureMobile.querySelector('img').src, pictureMobile.querySelector('img').alt, false, [{ width: '750' }]);
      cardImage.append(optimizedPicture); // Append the entire optimized picture element
    }
    cardWrapper.append(cardImage);

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const description = document.createElement('p');
    description.classList.add('desc');
    // descriptionCell is richtext, so innerHTML is correct.
    // Assigning to <p> will create <p><p>...</p></p> if descriptionCell.innerHTML contains <p>.
    // It's safer to use a <div> for richtext content if the target element is not guaranteed to be a <div>.
    // However, the original HTML uses <p class="desc"> directly containing text, so this is acceptable
    // if descriptionCell.innerHTML is guaranteed to be just text or simple inline elements.
    // If it could contain block elements like another <p>, a <div> would be better here.
    // Based on the example HTML, it's <p>text</p>, so assigning to <p> is okay here.
    description.innerHTML = descriptionCell.innerHTML;
    homeBoxCard.append(description);

    cardWrapper.append(homeBoxCard);
    linkEl.append(cardWrapper);
    cardsWrapper.append(linkEl);
  });

  container.append(cardsWrapper);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);
}
