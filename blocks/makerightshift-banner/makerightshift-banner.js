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
    const mainImageAlt = block.querySelector('[data-aue-prop="mainImageAlt"]')?.textContent || '';
    const picture = createOptimizedPicture(mainImage.src, mainImageAlt);
    leftImageDiv.append(picture);
    moveInstrumentation(mainImage, picture);
  }
  section.append(leftImageDiv);

  const container = document.createElement('div');
  container.classList.add('makeRightShift-container', 'makeRightShift-read-more');

  const heading = block.querySelector('[data-aue-prop="heading"]');
  if (heading) {
    const h1 = document.createElement('h1');
    h1.classList.add('makeRightShift-text-center', 'makeRightShift-pb-4', 'makeRightShift-makeRightShift-rs-heading');
    h1.append(heading);
    container.append(h1);
    moveInstrumentation(heading, h1);
  }

  const readMoreTextDiv = document.createElement('div');
  readMoreTextDiv.classList.add('makeRightShift-read-more-text');

  const subheading = block.querySelector('[data-aue-prop="subheading"]');
  if (subheading) {
    const h2 = document.createElement('h2');
    h2.append(subheading);
    readMoreTextDiv.append(h2);
    moveInstrumentation(subheading, h2);
  }

  const description = block.querySelector('[data-aue-prop="description"]');
  if (description) {
    const p = document.createElement('p');
    p.append(description);
    readMoreTextDiv.append(p);
    moveInstrumentation(description, p);
  }
  container.append(readMoreTextDiv);

  const spanReadMore = document.createElement('span');
  spanReadMore.classList.add('makeRightShift-readMore');
  container.append(spanReadMore);

  const flexWrapper = document.createElement('div');
  flexWrapper.classList.add('makeRightShift-d-flex', 'makeRightShift-justify-content-evenly', 'makeRightShift-flex-wrap', 'makeRightShift-makeRightShift-why-shift-wrapper');

  const items = block.querySelectorAll('[data-aue-model="makeRightShiftItem"]');
  items.forEach((itemNode) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('makeRightShift-mb-md-0', 'makeRightShift-mb-3', 'makeRightShift-text-center');

    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('makeRightShift-makeRightShift-itc-health-goal-wrapper');

    const itemImage = itemNode.querySelector('[data-aue-prop="image"]');
    if (itemImage) {
      const itemImageAlt = itemNode.querySelector('[data-aue-prop="alt"]')?.textContent || '';
      const picture = createOptimizedPicture(itemImage.src, itemImageAlt);
      imageWrapper.append(picture);
      moveInstrumentation(itemImage, picture);
    }
    itemDiv.append(imageWrapper);

    const itemLink = itemNode.querySelector('[data-aue-prop="link"]');
    const itemLabel = itemNode.querySelector('[data-aue-prop="label"]');

    if (itemLink && itemLabel) {
      const a = document.createElement('a');
      a.href = itemLink.href;
      a.alt = itemLink.alt || '';
      a.classList.add('makerightshift-text-center', 'makerightshift-d-block', 'makerightshift-text-capitalize', 'makerightshift-pt-2', 'makerightshift-makeRightShift-image-label');
      a.append(itemLabel);
      itemDiv.append(a);
      moveInstrumentation(itemLink, a);
      moveInstrumentation(itemLabel, a);
    }
    flexWrapper.append(itemDiv);
    moveInstrumentation(itemNode, itemDiv);
  });
  container.append(flexWrapper);

  const dMdNoneDiv = document.createElement('div');
  dMdNoneDiv.classList.add('makeRightShift-d-md-none', 'makeRightShift-d-block');
  container.append(dMdNoneDiv);

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('makeRightShift-button', 'makeRightShift-makeRightShift-how-shift-button');

  const ctaLink = block.querySelector('[data-aue-prop="ctaLink"]');
  const ctaLabel = block.querySelector('[data-aue-prop="ctaLabel"]');

  if (ctaLink && ctaLabel) {
    const a = document.createElement('a');
    a.href = ctaLink.href;
    a.alt = ctaLink.alt || '';
    a.classList.add('makerightshift-cmp-button');
    a.target = '_blank'; // Assuming target blank from sample HTML

    const spanText = document.createElement('span');
    spanText.classList.add('makerightshift-cmp-button__text');
    spanText.append(ctaLabel);
    a.append(spanText);
    moveInstrumentation(ctaLabel, spanText);

    const spanScreenReader = document.createElement('span');
    spanScreenReader.classList.add('makerightshift-cmp-link__screen-reader-only');
    spanScreenReader.textContent = 'opens in a new tab';
    a.append(spanScreenReader);

    buttonDiv.append(a);
    moveInstrumentation(ctaLink, a);
  }
  container.append(buttonDiv);
  section.append(container);

  block.textContent = '';
  block.append(section);
  block.className = 'makeRightShift-Banner block';
  block.dataset.blockStatus = 'loaded';
}