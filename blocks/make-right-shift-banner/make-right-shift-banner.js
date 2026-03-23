import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const section = document.createElement('section');
  section.classList.add('makeRightShift-itc-how-shift');

  const leftImageDiv = document.createElement('div');
  leftImageDiv.classList.add('makeRightShift-makeRightShift-left-image-div');
  leftImageDiv.id = 'leftDivId';

  const mainImage = block.querySelector('[data-aue-prop="mainImage"]');
  if (mainImage) {
    const picture = createOptimizedPicture(mainImage.src, mainImage.alt);
    leftImageDiv.append(picture);
    moveInstrumentation(mainImage, picture);
  }

  const container = document.createElement('div');
  container.classList.add('makeRightShift-container', 'makeRightShift-read-more');

  const heading = block.querySelector('[data-aue-prop="heading"]');
  if (heading) {
    const h1 = document.createElement('h1');
    h1.classList.add('makeRightShift-text-center', 'makeRightShift-pb-4', 'makeRightShift-makeRightShift-rs-heading');
    h1.append(...heading.childNodes);
    container.append(h1);
    moveInstrumentation(heading, h1);
  }

  const readMoreTextDiv = document.createElement('div');
  readMoreTextDiv.classList.add('makeRightShift-read-more-text');

  const subheading = block.querySelector('[data-aue-prop="subheading"]');
  if (subheading) {
    readMoreTextDiv.append(...subheading.children);
    moveInstrumentation(subheading, readMoreTextDiv);
  }

  const description = block.querySelector('[data-aue-prop="description"]');
  if (description) {
    readMoreTextDiv.append(...description.children);
    moveInstrumentation(description, readMoreTextDiv);
  }
  if (subheading || description) {
    container.append(readMoreTextDiv);
  }

  const readMoreSpan = document.createElement('span');
  readMoreSpan.classList.add('makeRightShift-readMore');
  container.append(readMoreSpan);

  const categoriesWrapper = document.createElement('div');
  categoriesWrapper.classList.add('makeRightShift-d-flex', 'makeRightShift-justify-content-evenly', 'makeRightShift-flex-wrap', 'makeRightShift-makeRightShift-why-shift-wrapper');

  const categories = block.querySelectorAll('[data-aue-model="category"]');
  categories.forEach((categoryNode) => {
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('makerightshift-mb-md-0', 'makerightshift-mb-3', 'makerightshift-text-center');

    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('makeRightShift-makeRightShift-itc-health-goal-wrapper');

    const image = categoryNode.querySelector('[data-aue-prop="image"]');
    if (image) {
      const picture = createOptimizedPicture(image.src, image.alt);
      imageWrapper.append(picture);
      moveInstrumentation(image, picture);
    }
    categoryDiv.append(imageWrapper);

    const link = categoryNode.querySelector('[data-aue-prop="link"]');
    if (link && link.tagName === 'A') {
      const linkElement = document.createElement('a');
      linkElement.href = link.href;
      linkElement.alt = link.alt;
      linkElement.classList.add('makeRightShift-text-center', 'makeRightShift-d-block', 'makeRightShift-text-capitalize', 'makeRightShift-pt-2', 'makeRightShift-image-label');
      linkElement.innerHTML = link.innerHTML; // InnerHTML is acceptable for link text as it may contain <br>
      categoryDiv.append(linkElement);
      moveInstrumentation(link, linkElement);
    }
    categoriesWrapper.append(categoryDiv);
    moveInstrumentation(categoryNode, categoryDiv);
  });
  container.append(categoriesWrapper);

  const mobileSpacer = document.createElement('div');
  mobileSpacer.classList.add('makeRightShift-d-md-none', 'makeRightShift-d-block');
  container.append(mobileSpacer);

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('makeRightShift-button', 'makeRightShift-makeRightShift-how-shift-button');

  const viewAllLink = block.querySelector('[data-aue-prop="viewAllLink"]');
  if (viewAllLink && viewAllLink.tagName === 'A') {
    const linkElement = document.createElement('a');
    linkElement.href = viewAllLink.href;
    if (viewAllLink.getAttribute('target')) {
      linkElement.target = viewAllLink.getAttribute('target');
    }
    if (viewAllLink.getAttribute('id')) {
      linkElement.id = viewAllLink.getAttribute('id');
    }
    if (viewAllLink.getAttribute('alt')) {
      linkElement.alt = viewAllLink.getAttribute('alt');
    }
    if (viewAllLink.dataset.cmpDataLayer) {
      linkElement.dataset.cmpDataLayer = viewAllLink.dataset.cmpDataLayer;
    }
    linkElement.classList.add('makeRightShift-cmp-button');

    const spanText = document.createElement('span');
    spanText.classList.add('makeRightShift-cmp-button__text');
    const authoredSpanText = viewAllLink.querySelector('.makerightshift-cmp-button__text');
    if (authoredSpanText) {
      spanText.append(...authoredSpanText.childNodes);
      moveInstrumentation(authoredSpanText, spanText);
    } else {
      spanText.textContent = viewAllLink.textContent;
    }
    linkElement.append(spanText);

    const screenReaderSpan = viewAllLink.querySelector('.makerightshift-cmp-link__screen-reader-only');
    if (screenReaderSpan) {
      const newScreenReaderSpan = document.createElement('span');
      newScreenReaderSpan.classList.add('makeRightShift-cmp-link__screen-reader-only');
      newScreenReaderSpan.append(...screenReaderSpan.childNodes);
      linkElement.append(newScreenReaderSpan);
      moveInstrumentation(screenReaderSpan, newScreenReaderSpan);
    }

    buttonDiv.append(linkElement);
    moveInstrumentation(viewAllLink, linkElement);
  }
  container.append(buttonDiv);

  section.append(leftImageDiv, container);

  block.textContent = '';
  block.append(section);
  block.className = 'make-right-shift-banner block';
  block.dataset.blockStatus = 'loaded';
}
