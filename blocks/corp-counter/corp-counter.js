import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const genericWrapper = document.createElement('div');
  genericWrapper.classList.add('genericWrapper');

  const backgroundImageMobile = block.querySelector('[data-aue-prop="backgroundImageMobile"]');
  if (backgroundImageMobile) {
    const mobilePicture = createOptimizedPicture(backgroundImageMobile.src, backgroundImageMobile.alt, false, [{
      width: '750'
    }]);
    mobilePicture.classList.add('generic-mobile');
    moveInstrumentation(backgroundImageMobile, mobilePicture);
    genericWrapper.append(mobilePicture);
  }

  const backgroundImageDesktop = block.querySelector('[data-aue-prop="backgroundImageDesktop"]');
  if (backgroundImageDesktop) {
    const desktopPicture = createOptimizedPicture(backgroundImageDesktop.src, backgroundImageDesktop.alt, false, [{
      width: '2000'
    }]);
    desktopPicture.classList.add('generic-desktop');
    moveInstrumentation(backgroundImageDesktop, desktopPicture);
    genericWrapper.append(desktopPicture);
  }

  const innerCounterContainer = document.createElement('div');
  innerCounterContainer.classList.add('inner-counter-container');

  const gRow = document.createElement('div');
  gRow.classList.add('g-row');

  const col12 = document.createElement('div');
  col12.classList.add('col-12', 'col-sm-12', 'col-md-12', 'col-lg-6', 'col-xl-6', 'text-center', 'col-lg-12', 'col-xl-12');

  const customerCount = document.createElement('div');
  customerCount.classList.add('customer-count', 'clearfix');

  const numscroller = document.createElement('div');
  numscroller.classList.add('numscroller');

  const bgImageWrapper = document.createElement('div');
  bgImageWrapper.classList.add('bg-image-wrapper');

  const counterBgImage = block.querySelector('[data-aue-prop="counterBgImage"]');
  if (counterBgImage) {
    // Replicate the multiple picture elements as seen in the authored HTML
    // This is a specific pattern from the provided HTML, assuming it's intentional.
    // If it should only be one picture, the logic would be simpler.
    for (let i = 0; i < 8; i += 1) { // 8 pictures in the sample HTML
      const picture = createOptimizedPicture(counterBgImage.src, counterBgImage.alt, false, [{
        media: '(min-width: 768px)',
        width: '2000'
      }, {
        media: '(max-width: 767px)',
        width: '750'
      }]);
      moveInstrumentation(counterBgImage, picture);
      bgImageWrapper.append(picture);
    }
  }
  numscroller.append(bgImageWrapper);

  const counterValueSpan = document.createElement('span');
  const counterValue = block.querySelector('[data-aue-prop="counterValue"]');
  if (counterValue) {
    counterValueSpan.textContent = counterValue.textContent;
    counterValueSpan.setAttribute('data-delay', '20000');
    counterValueSpan.setAttribute('data-increment', '111111');
    counterValueSpan.setAttribute('data-min', '0');
    counterValueSpan.setAttribute('data-max', counterValue.textContent);
    moveInstrumentation(counterValue, counterValueSpan);
  } else {
    counterValueSpan.setAttribute('data-delay', '20000');
    counterValueSpan.setAttribute('data-increment', '111111');
    counterValueSpan.setAttribute('data-min', '0');
    counterValueSpan.setAttribute('data-max', '0');
    counterValueSpan.textContent = '0';
  }
  numscroller.append(counterValueSpan);
  customerCount.append(numscroller);

  const countLabelSpan = document.createElement('span');
  countLabelSpan.classList.add('count-label');
  const counterLabel = block.querySelector('[data-aue-prop="counterLabel"]');
  if (counterLabel) {
    countLabelSpan.textContent = counterLabel.textContent;
    moveInstrumentation(counterLabel, countLabelSpan);
  }
  col12.append(customerCount, countLabelSpan);
  gRow.append(col12);

  // Empty middle component (as per authored HTML, it's empty in the source)
  const col6_1 = document.createElement('div');
  col6_1.classList.add('col-6', 'col-sm-6', 'col-md-6', 'col-lg-3', 'col-xl-3', 'text-center');
  const middleComponent = document.createElement('div');
  middleComponent.classList.add('middle-component', 'col-divider');
  const h2_1 = document.createElement('h2');
  h2_1.classList.add('count-number');
  const span_1 = document.createElement('span');
  span_1.classList.add('count-label');
  middleComponent.append(h2_1, span_1);
  col6_1.append(middleComponent);
  gRow.append(col6_1);

  // Empty last component (as per authored HTML, it's empty in the source)
  const col6_2 = document.createElement('div');
  col6_2.classList.add('col-6', 'col-sm-6', 'col-md-6', 'col-lg-3', 'col-xl-3', 'text-center');
  const h2_2 = document.createElement('h2');
  h2_2.classList.add('count-number');
  const span_2 = document.createElement('span');
  span_2.classList.add('count-label');
  col6_2.append(h2_2, span_2);
  gRow.append(col6_2);

  innerCounterContainer.append(gRow);

  const buttonGutter = document.createElement('div');
  buttonGutter.classList.add('button-gutter', 'text-center');

  const button1Link = block.querySelector('[data-aue-prop="button1Link"]');
  const button1Text = block.querySelector('[data-aue-prop="button1Text"]');
  if (button1Link && button1Text) {
    const a1 = document.createElement('a');
    a1.classList.add('button', 'button-red', 'button-180');
    a1.id = 'BaSV-Home-red'; // Assuming this ID is static or needs to be extracted if dynamic
    a1.target = '_self';
    a1.href = button1Link.href;
    a1.textContent = button1Text.textContent;
    moveInstrumentation(button1Link, a1);
    moveInstrumentation(button1Text, a1);
    buttonGutter.append(a1);
  }

  const button2Link = block.querySelector('[data-aue-prop="button2Link"]');
  const button2Text = block.querySelector('[data-aue-prop="button2Text"]');
  if (button2Link && button2Text) {
    const a2 = document.createElement('a');
    a2.classList.add('button', 'button-red', 'button-180', 'bookAServiceAppointmentButton');
    a2.id = 'BSV-Home-red'; // Assuming this ID is static or needs to be extracted if dynamic
    a2.target = '_self';
    a2.href = button2Link.href;
    a2.textContent = button2Text.textContent;
    moveInstrumentation(button2Link, a2);
    moveInstrumentation(button2Text, a2);
    buttonGutter.append(a2);
  }

  innerCounterContainer.append(buttonGutter);
  genericWrapper.append(innerCounterContainer);

  block.textContent = '';
  block.append(genericWrapper);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
