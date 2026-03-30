import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const section = document.createElement('section');
  section.classList.add('itc-how-shift');

  // Left Image Div
  const leftImageDiv = document.createElement('div');
  leftImageDiv.classList.add('left-image-div');
  leftImageDiv.id = 'leftDivId';

  const mainImage = block.querySelector('[data-aue-prop="mainImage"]');
  if (mainImage) {
    const picture = createOptimizedPicture(mainImage.src, mainImage.alt);
    leftImageDiv.append(picture);
    moveInstrumentation(mainImage, leftImageDiv);
  }
  section.append(leftImageDiv);

  // Container Read More Div
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'read-more');

  // Heading
  const heading = block.querySelector('[data-aue-prop="heading"]');
  if (heading) {
    const h1 = document.createElement('h1');
    h1.classList.add('text-center', 'pb-4', 'rs-heading');
    h1.append(...heading.childNodes);
    containerDiv.append(h1);
    moveInstrumentation(heading, h1);
  }

  // Read More Text (Sub Heading & Description)
  const readMoreTextDiv = document.createElement('div');
  readMoreTextDiv.classList.add('read-more-text');

  const subHeading = block.querySelector('[data-aue-prop="subHeading"]');
  if (subHeading) {
    const h2 = document.createElement('h2');
    h2.append(...subHeading.childNodes);
    readMoreTextDiv.append(h2);
    moveInstrumentation(subHeading, h2);
  }

  const description = block.querySelector('[data-aue-prop="description"]');
  if (description) {
    const p = document.createElement('p');
    p.append(...description.childNodes);
    readMoreTextDiv.append(p);
    moveInstrumentation(description, p);
  }

  if (subHeading || description) {
    containerDiv.append(readMoreTextDiv);
  }

  const readMoreSpan = document.createElement('span');
  readMoreSpan.classList.add('readMore');
  containerDiv.append(readMoreSpan);

  // Categories Wrapper
  const whyShiftWrapper = document.createElement('div');
  whyShiftWrapper.classList.add('d-flex', 'justify-content-evenly', 'flex-wrap', 'why-shift-wrapper');

  const categories = block.querySelectorAll('[data-aue-model="delicacyCategory"]');
  categories.forEach((category) => {
    const categoryWrapper = document.createElement('div');
    categoryWrapper.classList.add('mb-md-0', 'mb-3', 'text-center');

    const itcHealthGoalWrapper = document.createElement('div');
    itcHealthGoalWrapper.classList.add('itc-health-goal-wrapper');

    const categoryImage = category.querySelector('[data-aue-prop="image"]');
    if (categoryImage) {
      const picture = createOptimizedPicture(categoryImage.src, categoryImage.alt);
      itcHealthGoalWrapper.append(picture);
      moveInstrumentation(categoryImage, itcHealthGoalWrapper);
    }
    categoryWrapper.append(itcHealthGoalWrapper);

    const categoryLink = category.querySelector('[data-aue-prop="link"]');
    const categoryLabel = category.querySelector('[data-aue-prop="label"]');

    if (categoryLink || categoryLabel) {
      const linkElement = document.createElement('a');
      linkElement.classList.add('text-center', 'd-block', 'text-capitalize', 'pt-2', 'image-label');

      if (categoryLink) {
        linkElement.href = categoryLink.href;
        linkElement.alt = categoryLink.textContent;
        moveInstrumentation(categoryLink, linkElement);
      }

      if (categoryLabel) {
        linkElement.append(...categoryLabel.childNodes);
        moveInstrumentation(categoryLabel, linkElement);
      }
      categoryWrapper.append(linkElement);
    }
    whyShiftWrapper.append(categoryWrapper);
    moveInstrumentation(category, categoryWrapper);
  });
  containerDiv.append(whyShiftWrapper);

  const mobileSpacer = document.createElement('div');
  mobileSpacer.classList.add('d-md-none', 'd-block');
  containerDiv.append(mobileSpacer);

  // CTA Button
  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'how-shift-button');

  const ctaLink = block.querySelector('[data-aue-prop="ctaLink"]');
  const ctaText = block.querySelector('[data-aue-prop="ctaText"]');

  if (ctaLink || ctaText) {
    const linkElement = document.createElement('a');
    linkElement.classList.add('cmp-button');

    if (ctaLink) {
      linkElement.href = ctaLink.href;
      linkElement.target = '_blank'; // Assuming target blank from sample
      linkElement.alt = ctaLink.textContent;
      moveInstrumentation(ctaLink, linkElement);
    }

    if (ctaText) {
      const spanText = document.createElement('span');
      spanText.classList.add('cmp-button__text');
      spanText.append(...ctaText.childNodes);
      linkElement.append(spanText);
      moveInstrumentation(ctaText, spanText);
    }

    // Add screen reader span if target is blank
    if (linkElement.target === '_blank') {
      const screenReaderSpan = document.createElement('span');
      screenReaderSpan.classList.add('cmp-link__screen-reader-only');
      screenReaderSpan.textContent = 'opens in a new tab';
      linkElement.append(screenReaderSpan);
    }
    buttonDiv.append(linkElement);
  }
  containerDiv.append(buttonDiv);

  section.append(containerDiv);

  block.textContent = '';
  block.append(section);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
