import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const genericWrapper = document.createElement('div');
  genericWrapper.classList.add('corp-counter-genericWrapper');

  const mobileBackground = block.querySelector('[data-aue-prop="mobileBackground"]');
  if (mobileBackground) {
    const mobileImg = createOptimizedPicture(mobileBackground.src, mobileBackground.alt);
    mobileImg.querySelector('img').classList.add('corp-counter-generic-mobile');
    genericWrapper.append(mobileImg);
    moveInstrumentation(mobileBackground, mobileImg);
  }

  const desktopBackground = block.querySelector('[data-aue-prop="desktopBackground"]');
  if (desktopBackground) {
    const desktopImg = createOptimizedPicture(desktopBackground.src, desktopBackground.alt);
    desktopImg.querySelector('img').classList.add('corp-counter-generic-desktop');
    genericWrapper.append(desktopImg);
    moveInstrumentation(desktopBackground, desktopImg);
  }

  const innerCounterContainer = document.createElement('div');
  innerCounterContainer.classList.add('corp-counter-inner-counter-container');

  const gRow = document.createElement('div');
  gRow.classList.add('corp-counter-g-row');

  const customerCountCol = document.createElement('div');
  customerCountCol.classList.add('corp-counter-col-12', 'corp-counter-col-sm-12', 'corp-counter-col-md-12', 'corp-counter-col-lg-6', 'corp-counter-col-xl-6', 'corp-counter-text-center', 'corp-counter-col-lg-12', 'corp-counter-col-xl-12');

  const customerCountDiv = document.createElement('div');
  customerCountDiv.classList.add('corp-counter-customer-count', 'corp-counter-clearfix');

  const numscrollerDiv = document.createElement('div');
  numscrollerDiv.classList.add('corp-counter-numscroller');

  const bgImageWrapper = document.createElement('div');
  bgImageWrapper.classList.add('corp-counter-bg-image-wrapper');

  const backgroundImages = block.querySelectorAll('[data-aue-model="counterBackgroundImage"]');
  backgroundImages.forEach((imageNode) => {
    const img = imageNode.querySelector('[data-aue-prop="backgroundImage"]');
    if (img) {
      const picture = createOptimizedPicture(img.src, img.alt);
      bgImageWrapper.append(picture);
      moveInstrumentation(img, picture);
    }
    moveInstrumentation(imageNode, bgImageWrapper);
  });

  numscrollerDiv.append(bgImageWrapper);

  const counterValueSpan = document.createElement('span');
  const counterValue = block.querySelector('[data-aue-prop="counterValue"]');
  if (counterValue) {
    counterValueSpan.textContent = counterValue.textContent;
    counterValueSpan.dataset.delay = '20000'; // Assuming static values from authored HTML
    counterValueSpan.dataset.increment = '111111';
    counterValueSpan.dataset.min = '0';
    counterValueSpan.dataset.max = '29777748';
    moveInstrumentation(counterValue, counterValueSpan);
  } else {
    // Fallback to first p element if data-aue-prop not found
    const p = block.querySelector('p');
    if (p) {
      counterValueSpan.textContent = p.textContent;
    }
  }
  numscrollerDiv.append(counterValueSpan);

  customerCountDiv.append(numscrollerDiv);

  const counterLabelSpan = document.createElement('span');
  counterLabelSpan.classList.add('corp-counter-count-label');
  const counterLabel = block.querySelector('[data-aue-prop="counterLabel"]');
  if (counterLabel) {
    counterLabelSpan.textContent = counterLabel.textContent;
    moveInstrumentation(counterLabel, counterLabelSpan);
  } else {
    // Fallback to next p element if data-aue-prop not found
    const p = block.querySelector('p:nth-of-type(2)'); // Assuming it's the second p
    if (p) {
      counterLabelSpan.textContent = p.textContent;
    }
  }
  customerCountCol.append(customerCountDiv, counterLabelSpan);
  gRow.append(customerCountCol);

  // Placeholder for middle and right components (as they are empty in authored HTML)
  const middleCol = document.createElement('div');
  middleCol.classList.add('corp-counter-col-6', 'corp-counter-col-sm-6', 'corp-counter-col-md-6', 'corp-counter-col-lg-3', 'corp-counter-col-xl-3', 'corp-counter-text-center');
  const middleComponent = document.createElement('div');
  middleComponent.classList.add('corp-counter-middle-component', 'corp-counter-col-divider');
  middleComponent.append(document.createElement('h2'), document.createElement('span'));
  middleCol.append(middleComponent);
  gRow.append(middleCol);

  const rightCol = document.createElement('div');
  rightCol.classList.add('corp-counter-col-6', 'corp-counter-col-sm-6', 'corp-counter-col-md-6', 'corp-counter-col-lg-3', 'corp-counter-col-xl-3', 'corp-counter-text-center');
  rightCol.append(document.createElement('h2'), document.createElement('span'));
  gRow.append(rightCol);

  innerCounterContainer.append(gRow);

  const buttonGutter = document.createElement('div');
  buttonGutter.classList.add('corp-counter-button-gutter', 'corp-counter-text-center');

  const buttons = block.querySelectorAll('[data-aue-model="counterButton"]');
  buttons.forEach((buttonNode) => {
    const buttonLink = buttonNode.querySelector('[data-aue-prop="buttonLink"]');
    const buttonText = buttonNode.querySelector('[data-aue-prop="buttonText"]');
    if (buttonLink && buttonText) {
      const a = document.createElement('a');
      a.classList.add('corp-counter-button', 'corp-counter-button-red', 'corp-counter-button-180');
      a.href = buttonLink.href || '#';
      a.textContent = buttonText.textContent;
      a.target = '_self'; // Assuming default target

      // Add specific IDs/classes if they exist in the authored HTML
      if (buttonLink.id) a.id = buttonLink.id;
      if (buttonLink.classList.contains('corp-counter-bookAServiceAppointmentButton')) {
        a.classList.add('corp-counter-bookAServiceAppointmentButton');
      }
      buttonGutter.append(a);
      moveInstrumentation(buttonLink, a);
      moveInstrumentation(buttonText, a);
    }
    moveInstrumentation(buttonNode, buttonGutter);
  });

  innerCounterContainer.append(buttonGutter);
  genericWrapper.append(innerCounterContainer);

  block.textContent = '';
  block.append(genericWrapper);
  block.classList.add('corp-counter-block');
  block.dataset.blockStatus = 'loaded';
}
