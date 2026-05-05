import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  // The outer block div already has 'section', 'grey-bg', 'spirit-of-rise' from AEM.
  // Adding them again to an inner wrapper causes double padding/CSS.
  // We create a root element for the block's content, but it should not duplicate the block's own classes.
  const section = document.createElement('section');
  // section.classList.add('section', 'grey-bg', 'spirit-of-rise'); // Removed - block already has these classes

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-delay', '200');
  // headingRow is a root row, its content is directly in the first cell, not wrapped in another div.
  // Use textContent.trim() for plain text cells.
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const subheading = document.createElement('p');
  subheading.classList.add('aos-init', 'aos-animate');
  subheading.setAttribute('data-aos', 'fade-up');
  subheading.setAttribute('data-aos-offset', '100');
  subheading.setAttribute('data-aos-duration', '650');
  subheading.setAttribute('data-aos-easing', 'ease-in-out');
  // subheadingRow is a root row, its content is directly in the first cell, not wrapped in another div.
  // Use textContent.trim() for plain text cells.
  subheading.textContent = subheadingRow.textContent.trim();
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
    const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

    const linkEl = document.createElement('a');
    linkEl.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.target = '_blank'; // Assuming target blank from original HTML
    }
    moveInstrumentation(row, linkEl);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');
    linkEl.append(cardWrapper);

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    cardWrapper.append(cardImage);

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    const pictureMobile = imageMobileCell.querySelector('picture');

    if (pictureDesktop || pictureMobile) {
      const picture = document.createElement('picture');
      if (pictureMobile) {
        const sourceMobile = document.createElement('source');
        sourceMobile.media = '(max-width: 576px)';
        sourceMobile.srcset = pictureMobile.querySelector('img')?.src;
        picture.append(sourceMobile);
      }
      if (pictureDesktop) {
        const img = document.createElement('img');
        img.src = pictureDesktop.querySelector('img')?.src;
        img.alt = pictureDesktop.querySelector('img')?.alt || '';
        picture.append(img);
      }
      cardImage.append(picture);
    }

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');
    cardWrapper.append(homeBoxCard);

    const desc = document.createElement('p');
    desc.classList.add('desc');
    // descriptionCell is type=text, but its content might contain <br/> tags as seen in ORIGINAL HTML.
    // Using innerHTML is safer than textContent.trim() to preserve such formatting.
    desc.innerHTML = descriptionCell.innerHTML;
    homeBoxCard.append(desc);

    performaceDrivenCards.append(linkEl);
  });

  section.append(performanceDriven);

  block.replaceChildren(section);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
