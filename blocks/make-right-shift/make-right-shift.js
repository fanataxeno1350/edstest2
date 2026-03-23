import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const section = document.createElement('section');
  section.classList.add('makeRightShift-itc-how-shift');

  const leftImageDiv = document.createElement('div');
  leftImageDiv.classList.add('makeRightShift-makeRightShift-left-image-div');
  leftImageDiv.id = 'leftDivId';
  const bannerImage = block.querySelector('[data-aue-prop="bannerImage"]');
  if (bannerImage) {
    const picture = createOptimizedPicture(bannerImage.src, bannerImage.alt);
    leftImageDiv.append(picture);
    moveInstrumentation(bannerImage, picture);
  }
  section.append(leftImageDiv);

  const container = document.createElement('div');
  container.classList.add('makeRightShift-makeRightShift-container', 'makeRightShift-read-more');

  const heading = block.querySelector('[data-aue-prop="heading"]');
  if (heading) {
    const h1 = document.createElement('h1');
    h1.classList.add('makeRightShift-makeRightShift-text-center', 'makeRightShift-makeRightShift-pb-4', 'makeRightShift-makeRightShift-rs-heading');
    h1.append(...heading.childNodes);
    container.append(h1);
    moveInstrumentation(heading, h1);
  }

  const readMoreText = document.createElement('div');
  readMoreText.classList.add('makeRightShift-makeRightShift-read-more-text');

  const subheading = block.querySelector('[data-aue-prop="subheading"]');
  if (subheading) {
    const h2 = document.createElement('h2');
    h2.style.textAlign = 'center';
    h2.append(...subheading.childNodes);
    readMoreText.append(h2);
    moveInstrumentation(subheading, h2);
  }

  const description = block.querySelector('[data-aue-prop="description"]');
  if (description) {
    const p = document.createElement('p');
    p.style.textAlign = 'center';
    p.append(...description.childNodes);
    readMoreText.append(p);
    moveInstrumentation(description, p);
  }
  container.append(readMoreText);

  const spanReadMore = document.createElement('span');
  spanReadMore.classList.add('makeRightShift-makeRightShift-readMore');
  container.append(spanReadMore);

  const whyShiftWrapper = document.createElement('div');
  whyShiftWrapper.classList.add('makeRightShift-makeRightShift-d-flex', 'makeRightShift-makeRightShift-justify-content-evenly', 'makeRightShift-makeRightShift-flex-wrap', 'makeRightShift-makeRightShift-why-shift-wrapper');

  const categories = block.querySelectorAll('[data-aue-model="category"]');
  categories.forEach((categoryNode) => {
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('makeRightShift-makeRightShift-mb-md-0', 'makeRightShift-makeRightShift-mb-3', 'makeRightShift-makeRightShift-text-center');

    const itcHealthGoalWrapper = document.createElement('div');
    itcHealthGoalWrapper.classList.add('makeRightShift-makeRightShift-itc-health-goal-wrapper');
    const image = categoryNode.querySelector('[data-aue-prop="image"]');
    if (image) {
      const picture = createOptimizedPicture(image.src, image.alt);
      itcHealthGoalWrapper.append(picture);
      moveInstrumentation(image, picture);
    }
    categoryDiv.append(itcHealthGoalWrapper);

    const link = categoryNode.querySelector('[data-aue-prop="link"]');
    const label = categoryNode.querySelector('[data-aue-prop="label"]');
    if (link && label) {
      const a = document.createElement('a');
      a.href = link.href || '#';
      a.alt = link.alt || '';
      a.classList.add('makeRightShift-makeRightShift-text-center', 'makeRightShift-makeRightShift-d-block', 'makeRightShift-makeRightShift-text-capitalize', 'makeRightShift-makeRightShift-pt-2', 'makeRightShift-makeRightShift-image-label');
      a.append(...label.childNodes);
      categoryDiv.append(a);
      moveInstrumentation(link, a);
      moveInstrumentation(label, a);
    }
    whyShiftWrapper.append(categoryDiv);
    moveInstrumentation(categoryNode, categoryDiv);
  });
  container.append(whyShiftWrapper);

  const dMdNoneDiv = document.createElement('div');
  dMdNoneDiv.classList.add('makeRightShift-makeRightShift-d-md-none', 'makeRightShift-makeRightShift-d-block');
  container.append(dMdNoneDiv);

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('makeRightShift-makeRightShift-button', 'makeRightShift-makeRightShift-how-shift-button');

  const buttonLink = block.querySelector('[data-aue-prop="buttonLink"]');
  const buttonLabel = block.querySelector('[data-aue-prop="buttonLabel"]');

  if (buttonLink && buttonLabel) {
    const a = document.createElement('a');
    a.href = buttonLink.href || '#';
    a.target = '_blank';
    a.alt = buttonLink.alt || '';
    a.classList.add('makeRightShift-makeRightShift-cmp-button');

    const spanText = document.createElement('span');
    spanText.classList.add('makeRightShift-makeRightShift-cmp-button__text');
    spanText.append(...buttonLabel.childNodes);
    a.append(spanText);
    moveInstrumentation(buttonLabel, spanText);

    const spanScreenReader = document.createElement('span');
    spanScreenReader.classList.add('makeRightShift-makeRightShift-cmp-link__screen-reader-only');
    spanScreenReader.textContent = 'opens in a new tab';
    a.append(spanScreenReader);

    buttonDiv.append(a);
    moveInstrumentation(buttonLink, a);
  }
  container.append(buttonDiv);

  section.append(container);

  block.textContent = '';
  block.append(section);
  block.className = 'make-right-shift block';
  block.dataset.blockStatus = 'loaded';
}
