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
    readMoreTextDiv.append(...subheading.childNodes);
    moveInstrumentation(subheading, readMoreTextDiv);
  }

  const description = block.querySelector('[data-aue-prop="description"]');
  if (description) {
    readMoreTextDiv.append(...description.childNodes);
    moveInstrumentation(description, readMoreTextDiv);
  }

  containerDiv.append(readMoreTextDiv);

  const readMoreSpan = document.createElement('span');
  readMoreSpan.classList.add('readMore');
  containerDiv.append(readMoreSpan);

  const whyShiftWrapper = document.createElement('div');
  whyShiftWrapper.classList.add('d-flex', 'justify-content-evenly', 'flex-wrap', 'why-shift-wrapper');

  const categories = block.querySelectorAll('[data-aue-model="category"]');
  categories.forEach((category) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('mb-md-0', 'mb-3', 'text-center');

    const itcHealthGoalWrapper = document.createElement('div');
    itcHealthGoalWrapper.classList.add('itc-health-goal-wrapper');

    const image = category.querySelector('[data-aue-prop="image"]');
    if (image) {
      const picture = createOptimizedPicture(image.src, image.alt);
      itcHealthGoalWrapper.append(picture);
      moveInstrumentation(image, picture);
    }
    itemDiv.append(itcHealthGoalWrapper);

    const link = category.querySelector('[data-aue-prop="link"]');
    const label = category.querySelector('[data-aue-prop="label"]');

    if (link && label) {
      const a = document.createElement('a');
      a.href = link.href;
      a.alt = link.alt || '';
      a.classList.add('text-center', 'd-block', 'text-capitalize', 'pt-2', 'image-label');
      a.append(...label.childNodes);
      itemDiv.append(a);
      moveInstrumentation(link, a);
      moveInstrumentation(label, a);
    } else if (link) {
      // Fallback for link without label, use link text if available
      const a = document.createElement('a');
      a.href = link.href;
      a.alt = link.alt || '';
      a.classList.add('text-center', 'd-block', 'text-capitalize', 'pt-2', 'image-label');
      a.textContent = link.textContent || link.href;
      itemDiv.append(a);
      moveInstrumentation(link, a);
    }

    whyShiftWrapper.append(itemDiv);
    moveInstrumentation(category, itemDiv);
  });

  containerDiv.append(whyShiftWrapper);

  const mobileSpacerDiv = document.createElement('div');
  mobileSpacerDiv.classList.add('d-md-none', 'd-block');
  containerDiv.append(mobileSpacerDiv);

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'how-shift-button');

  const buttonLink = block.querySelector('[data-aue-prop="buttonLink"]');
  const buttonLabel = block.querySelector('[data-aue-prop="buttonLabel"]');

  if (buttonLink && buttonLabel) {
    const a = document.createElement('a');
    a.href = buttonLink.href;
    a.target = '_blank';
    a.alt = buttonLink.alt || '';
    a.classList.add('cmp-button');

    const spanText = document.createElement('span');
    spanText.classList.add('cmp-button__text');
    spanText.append(...buttonLabel.childNodes);
    a.append(spanText);

    const spanScreenReader = document.createElement('span');
    spanScreenReader.classList.add('cmp-link__screen-reader-only');
    spanScreenReader.textContent = 'opens in a new tab';
    a.append(spanScreenReader);

    buttonDiv.append(a);
    moveInstrumentation(buttonLink, a);
    moveInstrumentation(buttonLabel, a);
  } else if (buttonLink) {
    // Fallback for link without label
    const a = document.createElement('a');
    a.href = buttonLink.href;
    a.target = '_blank';
    a.alt = buttonLink.alt || '';
    a.classList.add('cmp-button');

    const spanText = document.createElement('span');
    spanText.classList.add('cmp-button__text');
    spanText.textContent = buttonLink.textContent || 'View All';
    a.append(spanText);

    const spanScreenReader = document.createElement('span');
    spanScreenReader.classList.add('cmp-link__screen-reader-only');
    spanScreenReader.textContent = 'opens in a new tab';
    a.append(spanScreenReader);

    buttonDiv.append(a);
    moveInstrumentation(buttonLink, a);
  }

  containerDiv.append(buttonDiv);
  section.append(containerDiv);

  block.textContent = '';
  block.append(section);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
