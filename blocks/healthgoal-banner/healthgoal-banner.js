import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const section = document.createElement('section');
  section.classList.add('healthgoal-itc-how-shift');

  // Left Image Div
  const leftImageDiv = document.createElement('div');
  leftImageDiv.classList.add('healthgoal-left-image-div');
  leftImageDiv.id = 'leftDivId';
  const mainImage = block.querySelector('[data-aue-prop="mainImage"]');
  if (mainImage) {
    const picture = createOptimizedPicture(mainImage.src, mainImage.alt);
    leftImageDiv.append(picture);
    moveInstrumentation(mainImage, picture);
  }
  section.append(leftImageDiv);

  // Container Div
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('healthgoal-container', 'healthgoal-read-more');

  // Heading
  const heading = block.querySelector('[data-aue-prop="heading"]');
  if (heading) {
    const h1 = document.createElement('h1');
    h1.classList.add('healthgoal-text-center', 'healthgoal-pb-4', 'healthgoal-rs-heading');
    h1.append(...heading.childNodes);
    containerDiv.append(h1);
    moveInstrumentation(heading, h1);
  }

  // Subheading and Description
  const readMoreTextDiv = document.createElement('div');
  readMoreTextDiv.classList.add('healthgoal-read-more-text');
  const subheading = block.querySelector('[data-aue-prop="subheading"]');
  if (subheading) {
    readMoreTextDiv.append(...subheading.childNodes);
    moveInstrumentation(subheading, readMoreTextDiv);
  }
  const description = block.querySelector('[data-aue-prop="description"]');
  if (description) {
    readMoreTextDiv.append(...description.childNodes);
    moveInstrumentation(description, readMoreTextDiv);
  }
  if (subheading || description) {
    containerDiv.append(readMoreTextDiv);
  }

  const readMoreSpan = document.createElement('span');
  readMoreSpan.classList.add('healthgoal-readMore');
  containerDiv.append(readMoreSpan);

  // Items Wrapper
  const itemsWrapper = document.createElement('div');
  itemsWrapper.classList.add('healthgoal-d-flex', 'healthgoal-justify-content-evenly', 'healthgoal-flex-wrap', 'healthgoal-why-shift-wrapper');

  const itemNodes = block.querySelectorAll('[data-aue-model="healthgoalBannerItem"]');
  itemNodes.forEach((itemNode) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('healthgoal-mb-md-0', 'healthgoal-mb-3', 'healthgoal-text-center');

    const itcHealthGoalWrapper = document.createElement('div');
    itcHealthGoalWrapper.classList.add('healthgoal-itc-health-goal-wrapper');

    const itemImage = itemNode.querySelector('[data-aue-prop="image"]');
    if (itemImage) {
      const picture = createOptimizedPicture(itemImage.src, itemImage.alt);
      itcHealthGoalWrapper.append(picture);
      moveInstrumentation(itemImage, picture);
    }
    itemDiv.append(itcHealthGoalWrapper);

    const itemLink = itemNode.querySelector('[data-aue-prop="link"]');
    const itemLabel = itemNode.querySelector('[data-aue-prop="label"]');

    if (itemLink || itemLabel) {
      const linkElement = document.createElement('a');
      linkElement.classList.add('healthgoal-text-center', 'healthgoal-d-block', 'healthgoal-text-capitalize', 'healthgoal-pt-2', 'healthgoal-image-label');
      if (itemLink) {
        linkElement.href = itemLink.href;
        linkElement.alt = itemLink.alt || '';
        moveInstrumentation(itemLink, linkElement);
      }
      if (itemLabel) {
        linkElement.append(...itemLabel.childNodes);
        moveInstrumentation(itemLabel, linkElement);
      }
      itemDiv.append(linkElement);
    }
    itemsWrapper.append(itemDiv);
    moveInstrumentation(itemNode, itemDiv);
  });
  containerDiv.append(itemsWrapper);

  const responsiveDiv = document.createElement('div');
  responsiveDiv.classList.add('healthgoal-d-md-none', 'healthgoal-d-block');
  containerDiv.append(responsiveDiv);

  // CTA Button
  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('healthgoal-button', 'healthgoal-how-shift-button');
  const ctaLink = block.querySelector('[data-aue-prop="ctaLink"]');
  if (ctaLink) {
    const linkElement = document.createElement('a');
    linkElement.href = ctaLink.href;
    linkElement.alt = ctaLink.alt || '';
    linkElement.classList.add('healthgoal-cmp-button');
    if (ctaLink.target === '_blank') {
      linkElement.target = '_blank';
    }
    if (ctaLink.id) {
      linkElement.id = ctaLink.id;
    }

    const spanText = document.createElement('span');
    spanText.classList.add('healthgoal-cmp-button__text');
    spanText.textContent = ctaLink.textContent.trim();
    linkElement.append(spanText);

    if (linkElement.target === '_blank') {
      const screenReaderSpan = document.createElement('span');
      screenReaderSpan.classList.add('healthgoal-cmp-link__screen-reader-only');
      screenReaderSpan.textContent = 'opens in a new tab';
      linkElement.append(screenReaderSpan);
    }
    buttonDiv.append(linkElement);
    moveInstrumentation(ctaLink, linkElement);
  }
  containerDiv.append(buttonDiv);

  section.append(containerDiv);

  block.textContent = '';
  block.append(section);
  block.className = `healthgoal-banner block`;
  block.dataset.blockStatus = 'loaded';
}
