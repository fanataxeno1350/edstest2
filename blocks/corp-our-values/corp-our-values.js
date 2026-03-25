import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const genericWrapper = document.createElement('section');
  genericWrapper.classList.add('corp-our-values-genericWrapper');

  // Background Image
  const bgImage = block.querySelector('[data-aue-prop="backgroundImage"]');
  if (bgImage) {
    const picture = createOptimizedPicture(bgImage.src, bgImage.alt);
    picture.querySelector('img').classList.add('corp-our-values-img-responsive', 'corp-our-values-bg-image', 'corp-our-values-lazyload');
    genericWrapper.append(picture);
    moveInstrumentation(bgImage, picture);
  }

  const ourValuesWrapper = document.createElement('section');
  ourValuesWrapper.classList.add('corp-our-values-our-values-wrapper');

  const mainHeader = document.createElement('div');
  mainHeader.classList.add('corp-our-values-main-header', 'corp-our-values-container');

  const topBorder = document.createElement('div');
  topBorder.classList.add('corp-our-values-topBorder');
  topBorder.innerHTML = '&nbsp;';
  mainHeader.append(topBorder);

  const mainHeading = block.querySelector('[data-aue-prop="mainHeading"]');
  if (mainHeading) {
    const h2 = document.createElement('h2');
    h2.id = mainHeading.textContent.toLowerCase();
    h2.classList.add('corp-our-values-text-uppercase');
    h2.textContent = mainHeading.textContent;
    mainHeader.append(h2);
    moveInstrumentation(mainHeading, h2);
  }

  const subHeading = block.querySelector('[data-aue-prop="subHeading"]');
  if (subHeading) {
    const h3 = document.createElement('h3');
    h3.id = subHeading.textContent.toLowerCase();
    h3.classList.add('corp-our-values-text-uppercase');
    h3.textContent = subHeading.textContent;
    mainHeader.append(h3);
    moveInstrumentation(subHeading, h3);
  }
  ourValuesWrapper.append(mainHeader);

  const ourValuesComponents = document.createElement('div');
  ourValuesComponents.classList.add('corp-our-values-our-values-components', 'corp-our-values-g-row');

  const ul = document.createElement('ul');
  ul.classList.add('corp-our-values-col-lg-12', 'corp-our-values-col-md-12', 'corp-our-values-col-sm-12');

  const values = block.querySelectorAll('[data-aue-model="value"]');
  values.forEach((valueItem) => {
    const li = document.createElement('li');
    li.classList.add('corp-our-values-sub-holder', 'corp-our-values-col-lg-2', 'corp-our-values-col-sm-2', 'corp-our-values-col-md-3', 'corp-our-values-col-xs-6');

    const imgSpace = document.createElement('div');
    imgSpace.classList.add('corp-our-values-img-space');

    const icon = valueItem.querySelector('[data-aue-prop="icon"]');
    if (icon) {
      const img = document.createElement('img');
      img.classList.add('corp-our-values-lazyload');
      img.src = icon.src;
      img.alt = icon.alt || '';
      imgSpace.append(img);
      moveInstrumentation(icon, img);
    }
    li.append(imgSpace);
    ul.append(li);
    moveInstrumentation(valueItem, li);
  });
  ourValuesComponents.append(ul);
  ourValuesWrapper.append(ourValuesComponents);

  const buttonHolder = document.createElement('div');
  buttonHolder.classList.add('corp-our-values-button-holder');

  const workWithUsLink = block.querySelector('[data-aue-prop="workWithUsLink"]');
  if (workWithUsLink) {
    const link = document.createElement('a');
    link.href = workWithUsLink.href;
    link.title = workWithUsLink.textContent;
    link.classList.add('corp-our-values-button', 'corp-our-values-btns', 'corp-our-values-button-red');
    link.target = '_self';
    link.textContent = workWithUsLink.textContent;
    link.style.marginRight = '10px';
    buttonHolder.append(link);
    moveInstrumentation(workWithUsLink, link);
  }

  const trainWithUsLink = block.querySelector('[data-aue-prop="trainWithUsLink"]');
  if (trainWithUsLink) {
    const link = document.createElement('a');
    link.href = trainWithUsLink.href;
    link.title = trainWithUsLink.textContent;
    link.classList.add('corp-our-values-button', 'corp-our-values-btns', 'corp-our-values-button-red');
    link.target = '_self';
    link.textContent = trainWithUsLink.textContent;
    buttonHolder.append(link);
    moveInstrumentation(trainWithUsLink, link);
  }
  ourValuesWrapper.append(buttonHolder);

  genericWrapper.append(ourValuesWrapper);

  block.textContent = '';
  block.append(genericWrapper);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
