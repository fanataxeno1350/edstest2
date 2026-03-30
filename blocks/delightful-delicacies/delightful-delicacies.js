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

  const container = document.createElement('div');
  container.classList.add('container', 'read-more');

  const heading = block.querySelector('[data-aue-prop="heading"]');
  if (heading) {
    const h1 = document.createElement('h1');
    h1.classList.add('text-center', 'pb-4', 'rs-heading');
    h1.append(heading);
    container.append(h1);
    moveInstrumentation(heading, h1);
  }

  const readMoreTextDiv = document.createElement('div');
  readMoreTextDiv.classList.add('read-more-text');

  const subheading = block.querySelector('[data-aue-prop="subheading"]');
  if (subheading) {
    readMoreTextDiv.append(subheading);
    moveInstrumentation(subheading, readMoreTextDiv);
  }

  const description = block.querySelector('[data-aue-prop="description"]');
  if (description) {
    readMoreTextDiv.append(description);
    moveInstrumentation(description, readMoreTextDiv);
  }
  container.append(readMoreTextDiv);

  const spanReadMore = document.createElement('span');
  spanReadMore.classList.add('readMore');
  container.append(spanReadMore);

  const categoriesWrapper = document.createElement('div');
  categoriesWrapper.classList.add('d-flex', 'justify-content-evenly', 'flex-wrap', 'why-shift-wrapper');

  const categories = block.querySelectorAll('[data-aue-model="category"]');
  categories.forEach((categoryNode) => {
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('mb-md-0', 'mb-3', 'text-center');

    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('itc-health-goal-wrapper');

    const image = categoryNode.querySelector('[data-aue-prop="image"]');
    if (image) {
      const picture = createOptimizedPicture(image.src, image.alt);
      imageWrapper.append(picture);
      moveInstrumentation(image, picture);
    }
    categoryDiv.append(imageWrapper);

    const link = categoryNode.querySelector('[data-aue-prop="link"]');
    const label = categoryNode.querySelector('[data-aue-prop="label"]');

    if (link) {
      const anchor = document.createElement('a');
      anchor.classList.add('text-center', 'd-block', 'text-capitalize', 'pt-2', 'image-label');
      anchor.href = link.href;
      anchor.alt = link.alt || '';
      if (label) {
        anchor.append(label);
        moveInstrumentation(label, anchor);
      }
      categoryDiv.append(anchor);
      moveInstrumentation(link, anchor);
    }

    categoriesWrapper.append(categoryDiv);
    moveInstrumentation(categoryNode, categoryDiv);
  });
  container.append(categoriesWrapper);

  const dMdNoneDiv = document.createElement('div');
  dMdNoneDiv.classList.add('d-md-none', 'd-block');
  container.append(dMdNoneDiv);

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'how-shift-button');

  const cta = block.querySelector('[data-aue-prop="cta"]');
  if (cta) {
    // The authored CTA is already an anchor with span inside, just move it.
    buttonDiv.append(cta);
    moveInstrumentation(cta, buttonDiv);
  }
  container.append(buttonDiv);

  section.append(leftImageDiv);
  section.append(container);

  block.textContent = '';
  block.append(section);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
