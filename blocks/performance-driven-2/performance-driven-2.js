import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const headingRow = children[0];
  const subheadingRow = children[1];
  const cardRows = children.slice(2);

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

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const performaceDrivenCards = document.createElement('div');
  performaceDrivenCards.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const [imageMobileCell, imageDesktopCell, descriptionCell, linkCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // Assuming target blank from original HTML
    }
    moveInstrumentation(row, cardLink);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureMobile = imageMobileCell.querySelector('picture');
    const pictureDesktop = imageDesktopCell.querySelector('picture');

    if (pictureMobile && pictureDesktop) {
      const sourceMobile = pictureMobile.querySelector('source');
      const imgMobile = pictureMobile.querySelector('img');
      const imgDesktop = pictureDesktop.querySelector('img');

      const combinedPicture = document.createElement('picture');
      if (sourceMobile) {
        const newSource = document.createElement('source');
        newSource.media = '(max-width: 576px)';
        newSource.srcset = sourceMobile.srcset;
        combinedPicture.append(newSource);
      }
      if (imgDesktop) {
        const newImg = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
        combinedPicture.append(newImg.querySelector('img'));
      } else if (imgMobile) {
        const newImg = createOptimizedPicture(imgMobile.src, imgMobile.alt, false, [{ width: '750' }]);
        combinedPicture.append(newImg.querySelector('img'));
      }
      cardImage.append(combinedPicture);
    } else if (pictureDesktop) {
      const imgDesktop = pictureDesktop.querySelector('img');
      const optimizedPic = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
      cardImage.append(optimizedPic);
    } else if (pictureMobile) {
      const imgMobile = pictureMobile.querySelector('img');
      const optimizedPic = createOptimizedPicture(imgMobile.src, imgMobile.alt, false, [{ width: '750' }]);
      cardImage.append(optimizedPic);
    }

    cardWrapper.append(cardImage);

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const description = document.createElement('p');
    description.classList.add('desc');
    // FIX: Changed from textContent.trim().replace(/\n/g, '<br/>') to innerHTML
    // to correctly handle potential richtext and preserve line breaks as authored HTML.
    description.innerHTML = descriptionCell.innerHTML;
    homeBoxCard.append(description);

    cardWrapper.append(homeBoxCard);
    cardLink.append(cardWrapper);
    performaceDrivenCards.append(cardLink);
  });

  container.append(performaceDrivenCards);
  performanceDriven.append(container);

  const root = document.createElement('section');
  root.classList.add('section', 'grey-bg', 'spirit-of-rise');
  root.append(sectionHeader, performanceDriven);

  block.replaceChildren(root);
}
