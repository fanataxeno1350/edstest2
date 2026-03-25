import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const genericWrapper = document.createElement('section');
  genericWrapper.classList.add('genericWrapper');

  // Background Image Desktop
  const bgImageDesktop = block.querySelector('[data-aue-prop="backgroundImageDesktop"]');
  const bgImageMobile = block.querySelector('[data-aue-prop="backgroundImageMobile"]');

  if (bgImageDesktop || bgImageMobile) {
    const picture = document.createElement('picture');
    if (bgImageDesktop) {
      const sourceDesktop = document.createElement('source');
      sourceDesktop.setAttribute('media', '(min-width: 1024px)');
      sourceDesktop.setAttribute('srcset', bgImageDesktop.src);
      sourceDesktop.setAttribute('loading', 'lazy');
      picture.append(sourceDesktop);
      moveInstrumentation(bgImageDesktop, sourceDesktop);
    }
    if (bgImageMobile) {
      const sourceMobile = document.createElement('source');
      sourceMobile.setAttribute('media', '(min-width: 768px)');
      sourceMobile.setAttribute('srcset', bgImageMobile.src);
      sourceMobile.setAttribute('loading', 'lazy');
      picture.append(sourceMobile);
      moveInstrumentation(bgImageMobile, sourceMobile);

      const img = document.createElement('img');
      img.setAttribute('src', bgImageMobile.src);
      img.setAttribute('alt', bgImageMobile.alt || 'bg-img');
      img.classList.add('img-responsive', 'bg-image', 'lazyload');
      picture.append(img);
    }
    genericWrapper.append(picture);
  }

  const ourValuesWrapper = document.createElement('section');
  ourValuesWrapper.classList.add('our-values-wrapper');

  const mainHeaderContainer = document.createElement('div');
  mainHeaderContainer.classList.add('main-header', 'container');

  const topBorder = document.createElement('div');
  topBorder.classList.add('topBorder');
  topBorder.innerHTML = '&nbsp;';
  mainHeaderContainer.append(topBorder);

  const mainHeader1 = block.querySelector('[data-aue-prop="mainHeader1"]');
  if (mainHeader1) {
    const h2 = document.createElement('h2');
    h2.id = mainHeader1.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    h2.classList.add('text-uppercase');
    h2.textContent = mainHeader1.textContent;
    mainHeaderContainer.append(h2);
    moveInstrumentation(mainHeader1, h2);
  }

  const mainHeader2 = block.querySelector('[data-aue-prop="mainHeader2"]');
  if (mainHeader2) {
    const h3 = document.createElement('h3');
    h3.id = mainHeader2.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    h3.classList.add('text-uppercase');
    h3.textContent = mainHeader2.textContent;
    mainHeaderContainer.append(h3);
    moveInstrumentation(mainHeader2, h3);
  }
  ourValuesWrapper.append(mainHeaderContainer);

  const ourValuesComponents = document.createElement('div');
  ourValuesComponents.classList.add('our-values-components', 'g-row');

  const ul = document.createElement('ul');
  ul.classList.add('col-lg-12', 'col-md-12', 'col-sm-12');

  const valueItems = block.querySelectorAll('[data-aue-model="valueItem"]');
  valueItems.forEach((itemNode) => {
    const li = document.createElement('li');
    li.classList.add('sub-holder', 'col-lg-2', 'col-sm-2', 'col-md-3', 'col-xs-6');

    const imgSpace = document.createElement('div');
    imgSpace.classList.add('img-space');

    const image = itemNode.querySelector('[data-aue-prop="image"]');
    if (image) {
      const picture = createOptimizedPicture(image.src, image.alt || '');
      imgSpace.append(picture);
      moveInstrumentation(image, picture);
    }
    li.append(imgSpace);
    ul.append(li);
    moveInstrumentation(itemNode, li);
  });
  ourValuesComponents.append(ul);
  ourValuesWrapper.append(ourValuesComponents);

  const buttonHolder = document.createElement('div');
  buttonHolder.classList.add('button-holder');

  const workWithUsLink = block.querySelector('[data-aue-prop="workWithUsLink"]');
  if (workWithUsLink) {
    const a = document.createElement('a');
    a.href = workWithUsLink.href;
    a.title = workWithUsLink.textContent;
    a.classList.add('button', 'btns', 'button-red');
    a.target = '_self';
    a.style.marginRight = '10px';
    a.textContent = workWithUsLink.textContent;
    buttonHolder.append(a);
    moveInstrumentation(workWithUsLink, a);
  }

  const trainWithUsLink = block.querySelector('[data-aue-prop="trainWithUsLink"]');
  if (trainWithUsLink) {
    const a = document.createElement('a');
    a.href = trainWithUsLink.href;
    a.title = trainWithUsLink.textContent;
    a.classList.add('button', 'btns', 'button-red');
    a.target = '_self';
    a.textContent = trainWithUsLink.textContent;
    buttonHolder.append(a);
    moveInstrumentation(trainWithUsLink, a);
  }
  ourValuesWrapper.append(buttonHolder);

  genericWrapper.append(ourValuesWrapper);

  block.textContent = '';
  block.append(genericWrapper);
  block.className = 'corp-our-values block';
  block.dataset.blockStatus = 'loaded';
}
