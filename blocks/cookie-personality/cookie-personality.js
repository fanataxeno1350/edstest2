import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Use content detection for root fields instead of fragile index access
  const backgroundImageRow = children.find(row => row.querySelector('picture'));
  const headingRow = children.find(row => row.textContent.trim() === 'Heading label text'); // Assuming unique text for detection
  const questionRow = children.find(row => row.textContent.trim() === 'Question label text'); // Assuming unique text for detection
  const buttonLabelRow = children.find(row => row.textContent.trim() === 'Button Label label text'); // Assuming unique text for detection

  // Filter item rows based on content
  const stepperImageRows = children.filter((row) => row.children.length === 1 && row.querySelector('picture'));
  const optionItemRows = children.filter((row) => row.children.length === 1 && !row.querySelector('picture') && row.textContent.trim().startsWith('Option Label')); // Refined detection

  const cmpCookiePersonality = document.createElement('div');
  cmpCookiePersonality.classList.add('cmp-cookie-personality');
  moveInstrumentation(block, cmpCookiePersonality);

  // Background Image
  if (backgroundImageRow) {
    const backgroundPicture = backgroundImageRow.querySelector('picture');
    if (backgroundPicture) {
      const img = backgroundPicture.querySelector('img');
      if (img) {
        cmpCookiePersonality.style.backgroundImage = `url(${img.src})`;
      }
    }
  }

  // Heading
  if (headingRow) {
    const heading = document.createElement('h2');
    heading.textContent = headingRow.textContent.trim();
    moveInstrumentation(headingRow, heading);
    cmpCookiePersonality.append(heading);
  }

  // Stepper
  const cmpCookiePersonalityStepper = document.createElement('div');
  cmpCookiePersonalityStepper.classList.add('cmp-cookie-personality__stepper');

  stepperImageRows.forEach((row, index) => {
    const stepDiv = document.createElement('div');
    stepDiv.classList.add('cmp-cookie-personality__stepper--step');
    if (index === 0) {
      stepDiv.classList.add('active');
    }

    if (index === stepperImageRows.length - 1) {
      stepDiv.classList.add('cmp-cookie-personality__stepper--step-4');
      const lazyImageContainer = document.createElement('div');
      lazyImageContainer.classList.add('lazy-image-container');
      const picture = row.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          lazyImageContainer.append(optimizedPic);
          optimizedPic.querySelector('img').classList.add('lazy-image', 'loaded');
        }
      }
      moveInstrumentation(row, lazyImageContainer);
      stepDiv.append(lazyImageContainer);
    } else {
      const span = document.createElement('span');
      span.textContent = (index + 1).toString();
      stepDiv.append(span);
    }
    cmpCookiePersonalityStepper.append(stepDiv);
  });
  cmpCookiePersonality.append(cmpCookiePersonalityStepper);

  // Question Wrapper
  const cmpCookiePersonalityQuestionWrapper = document.createElement('div');
  cmpCookiePersonalityQuestionWrapper.classList.add('cmp-cookie-personality__question-wrapper');

  if (questionRow) {
    const question = document.createElement('h3');
    question.textContent = questionRow.textContent.trim();
    moveInstrumentation(questionRow, question);
    cmpCookiePersonalityQuestionWrapper.append(question);
  }

  // Options
  const cmpCookiePersonalityOptions = document.createElement('div');
  cmpCookiePersonalityOptions.classList.add('cmp-cookie-personality__options', 'body-3');

  optionItemRows.forEach((row) => {
    const optionDiv = document.createElement('div');
    optionDiv.classList.add('cmp-cookie-personality__option', 'false');
    optionDiv.textContent = row.textContent.trim();
    moveInstrumentation(row, optionDiv);
    cmpCookiePersonalityOptions.append(optionDiv);
  });
  cmpCookiePersonalityQuestionWrapper.append(cmpCookiePersonalityOptions);
  cmpCookiePersonality.append(cmpCookiePersonalityQuestionWrapper);

  // Actions
  const cmpCookiePersonalityActions = document.createElement('div');
  cmpCookiePersonalityActions.classList.add('cmp-cookie-personality__actions');

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'cmp-button--secondary', 'cmp-button--secondary-undefined');

  const button = document.createElement('button');
  button.classList.add('cmp-button');
  button.type = 'button';
  button.disabled = true;

  if (buttonLabelRow) {
    const buttonSpan = document.createElement('span');
    buttonSpan.classList.add('cmp-button__text');
    buttonSpan.textContent = buttonLabelRow.textContent.trim();
    moveInstrumentation(buttonLabelRow, buttonSpan);
    button.append(buttonSpan);
  }

  buttonDiv.append(button);
  cmpCookiePersonalityActions.append(buttonDiv);
  cmpCookiePersonality.append(cmpCookiePersonalityActions);

  // Replace the original block with the new structure
  block.innerHTML = '';
  block.append(cmpCookiePersonality);

  // Add event listeners for stepper and options interaction
  const stepperSteps = cmpCookiePersonality.querySelectorAll('.cmp-cookie-personality__stepper--step:not(.cmp-cookie-personality__stepper--step-4)');
  const options = cmpCookiePersonality.querySelectorAll('.cmp-cookie-personality__option');
  const nextButton = cmpCookiePersonality.querySelector('.cmp-button');

  let currentStep = 0;
  let selectedOption = null;

  function updateUI() {
    stepperSteps.forEach((step, index) => {
      if (index <= currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    options.forEach((option) => {
      if (option === selectedOption) {
        option.classList.add('active');
        option.classList.remove('false');
      } else {
        option.classList.remove('active');
        option.classList.add('false');
      }
    });

    if (selectedOption !== null) {
      nextButton.disabled = false;
    } else {
      nextButton.disabled = true;
    }
  }

  options.forEach((option) => {
    option.addEventListener('click', () => {
      selectedOption = option;
      updateUI();
    });
  });

  nextButton.addEventListener('click', () => {
    if (selectedOption !== null && currentStep < stepperSteps.length - 1) {
      currentStep++;
      selectedOption = null; // Reset selection for the next step
      updateUI();
      // In a real scenario, you'd load new question/options here
    } else if (selectedOption !== null && currentStep === stepperSteps.length - 1) {
      // Handle completion or submission
    }
  });

  updateUI(); // Initial UI update
}
