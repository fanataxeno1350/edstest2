import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(children[0], sectionHeader); // move instrumentation from heading row

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = children[0].children[0].textContent.trim();
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.textContent = children[1].children[0].textContent.trim();
  sectionHeader.append(description);

  section.append(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  const cardItems = children.slice(2); // All remaining rows are card items

  cardItems.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, linkCell, cardTextCell] = [...row.children];

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

    const picture = document.createElement('picture');

    const sourceMobile = document.createElement('source');
    sourceMobile.media = '(max-width: 576px)';
    const mobileImg = imageMobileCell.querySelector('img');
    if (mobileImg) {
      sourceMobile.srcset = mobileImg.src;
    }
    picture.append(sourceMobile);

    const desktopImg = imageDesktopCell.querySelector('img');
    if (desktopImg) {
      const optimizedDesktopPic = createOptimizedPicture(
        desktopImg.src,
        desktopImg.alt,
        false,
        [{ width: '750' }],
      );
      // Move instrumentation from the original img to the optimized one
      moveInstrumentation(desktopImg, optimizedDesktopPic.querySelector('img'));
      picture.append(optimizedDesktopPic.querySelector('img'));
    }

    cardImage.append(picture);
    cardWrapper.append(cardImage);

    const cardBox = document.createElement('div');
    cardBox.classList.add('performace-driven-home-box-card');

    const cardText = document.createElement('p');
    cardText.classList.add('desc');
    cardText.innerHTML = cardTextCell.innerHTML; // Richtext content

    cardBox.append(cardText);
    cardWrapper.append(cardBox);
    cardLink.append(cardWrapper);
    cardsWrapper.append(cardLink);
  });

  container.append(cardsWrapper);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);
}
