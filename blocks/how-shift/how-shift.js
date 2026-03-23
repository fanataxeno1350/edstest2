import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const section = document.createElement('section');
  section.classList.add('itc-how-shift');

  const leftImageDiv = document.createElement('div');
  leftImageDiv.classList.add('left-image-div');
  leftImageDiv.id = 'leftDivId';

  const bannerImage = block.querySelector('[data-aue-prop="bannerImage"]');
  if (bannerImage) {
    const picture = createOptimizedPicture(bannerImage.src, bannerImage.alt);
    leftImageDiv.append(picture);
    moveInstrumentation(bannerImage, picture);
  }
  section.append(leftImageDiv);

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'read-more');

  const heading = block.querySelector('[data-aue-prop="heading"]');
  if (heading) {
    const h1 = document.createElement('h1');
    h1.classList.add('text-center', 'pb-4', 'rs-heading');
    h1.append(...heading.childNodes);
    containerDiv.append(h1);
    moveInstrumentation(heading, h1);
  }

  const readMoreTextDiv = document.createElement('div');
  readMoreTextDiv.classList.add('read-more-text');

  const subheading = block.querySelector('[data-aue-prop="subheading"]');
  if (subheading) {
    const h2 = document.createElement('h2');
    h2.append(...subheading.childNodes);
    readMoreTextDiv.append(h2);
    moveInstrumentation(subheading, h2);
  }

  const description = block.querySelector('[data-aue-prop="description"]');
  if (description) {
    const p = document.createElement('p');
    p.append(...description.childNodes);
    readMoreTextDiv.append(p);
    moveInstrumentation(description, p);
  }
  containerDiv.append(readMoreTextDiv);

  const readMoreSpan = document.createElement('span');
  readMoreSpan.classList.add('readMore');
  containerDiv.append(readMoreSpan);

  const whyShiftWrapper = document.createElement('div');
  whyShiftWrapper.classList.add('d-flex', 'justify-content-evenly', 'flex-wrap', 'why-shift-wrapper');

  const items = block.querySelectorAll('[data-aue-model="howShiftItem"]');
  items.forEach((itemNode) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('mb-md-0', 'mb-3', 'text-center');

    const itcHealthGoalWrapper = document.createElement('div');
    itcHealthGoalWrapper.classList.add('itc-health-goal-wrapper');

    const itemImage = itemNode.querySelector('[data-aue-prop="image"]');
    if (itemImage) {
      const picture = createOptimizedPicture(itemImage.src, itemImage.alt);
      itcHealthGoalWrapper.append(picture);
      moveInstrumentation(itemImage, picture);
    }
    itemDiv.append(itcHealthGoalWrapper);

    const itemLink = itemNode.querySelector('[data-aue-prop="link"]');
    const itemLabel = itemNode.querySelector('[data-aue-prop="label"]');

    if (itemLink && itemLabel) {
      const a = document.createElement('a');
      a.href = itemLink.href;
      a.alt = itemLink.alt || '';
      a.classList.add('text-center', 'd-block', 'text-capitalize', 'pt-2', 'image-label');
      a.append(...itemLabel.childNodes);
      itemDiv.append(a);
      moveInstrumentation(itemLink, a);
      moveInstrumentation(itemLabel, a);
    }
    whyShiftWrapper.append(itemDiv);
    moveInstrumentation(itemNode, itemDiv);
  });
  containerDiv.append(whyShiftWrapper);

  const dMdNoneDiv = document.createElement('div');
  dMdNoneDiv.classList.add('d-md-none', 'd-block');
  containerDiv.append(dMdNoneDiv);

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'how-shift-button');

  const ctaLink = block.querySelector('[data-aue-prop="ctaLink"]');
  if (ctaLink) {
    const a = document.createElement('a');
    a.href = ctaLink.href;
    a.target = ctaLink.target;
    a.id = ctaLink.id;
    a.alt = ctaLink.alt;
    a.classList.add('cmp-button');

    const spanText = document.createElement('span');
    spanText.classList.add('cmp-button__text');
    spanText.textContent = ctaLink.textContent;
    a.append(spanText);

    if (ctaLink.target === '_blank') {
      const spanSrOnly = document.createElement('span');
      spanSrOnly.classList.add('cmp-link__screen-reader-only');
      spanSrOnly.textContent = 'opens in a new tab';
      a.append(spanSrOnly);
    }
    buttonDiv.append(a);
    moveInstrumentation(ctaLink, a);
  }
  containerDiv.append(buttonDiv);

  section.append(containerDiv);

  block.textContent = '';
  block.append(section);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
