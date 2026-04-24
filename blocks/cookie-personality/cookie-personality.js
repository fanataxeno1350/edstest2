import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundImageRow,
    titleRow,
    questionRow,
    buttonTextRow,
    ...itemRows
  ] = [...block.children];

  block.innerHTML = ''; // Clear the block content

  const cmpCookiePersonality = document.createElement('div');
  cmpCookiePersonality.classList.add('cmp-cookie-personality');
  moveInstrumentation(backgroundImageRow, cmpCookiePersonality);

  // Background Image
  const backgroundImagePicture = backgroundImageRow.querySelector('picture');
  if (backgroundImagePicture) {
    const img = backgroundImagePicture.querySelector('img');
    if (img) {
      cmpCookiePersonality.style.backgroundImage = `url("${img.src}")`;
      // Optimize image
      createOptimizedPicture(img.src, img.alt, false, [{ width: '1366' }]);
      // The original HTML does not have the picture element directly in the background,
      // so we don't need to append it. We just use the src for the background-image style.
      // If the image was intended to be visible in the DOM, we would do:
      // moveInstrumentation(img, optimizedPic.querySelector('img'));
      // backgroundImagePicture.replaceWith(optimizedPic);
    }
  }

  // Title
  const titleH2 = document.createElement('h2');
  titleH2.textContent = titleRow.textContent.trim();
  moveInstrumentation(titleRow, titleH2);
  cmpCookiePersonality.append(titleH2);

  // Stepper
  const stepperDiv = document.createElement('div');
  stepperDiv.classList.add('cmp-cookie-personality__stepper');
  cmpCookiePersonality.append(stepperDiv);

  // Filter itemRows for stepper-step items (2 cells: label, image)
  const stepperSteps = itemRows.filter((row) => row.children.length === 2);
  stepperSteps.forEach((stepRow, index) => {
    const cells = [...stepRow.children];
    const stepLabelCell = cells.find(cell => !cell.querySelector('picture'));
    const stepImageCell = cells.find(cell => cell.querySelector('picture'));

    const stepDiv = document.createElement('div');
    stepDiv.classList.add('cmp-cookie-personality__stepper--step');
    if (index === 0) {
      stepDiv.classList.add('active'); // First step is active by default
    }

    const span = document.createElement('span');
    span.textContent = stepLabelCell.textContent.trim();
    moveInstrumentation(stepLabelCell, span);
    stepDiv.append(span);

    if (stepImageCell) {
      const stepImagePicture = stepImageCell.querySelector('picture');
      if (stepImagePicture) {
        stepDiv.classList.add('cmp-cookie-personality__stepper--step-4'); // This class is for the image step
        const lazyImageContainer = document.createElement('div');
        lazyImageContainer.classList.add('lazy-image-container');

        const img = stepImagePicture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          lazyImageContainer.append(optimizedPic);
        }
        moveInstrumentation(stepImageCell, lazyImageContainer);
        stepDiv.append(lazyImageContainer);
      }
    }
    moveInstrumentation(stepRow, stepDiv);
    stepperDiv.append(stepDiv);
  });

  // Question Wrapper
  const questionWrapper = document.createElement('div');
  questionWrapper.classList.add('cmp-cookie-personality__question-wrapper');
  cmpCookiePersonality.append(questionWrapper);

  // Question
  const questionH3 = document.createElement('h3');
  questionH3.textContent = questionRow.textContent.trim();
  moveInstrumentation(questionRow, questionH3);
  questionWrapper.append(questionH3);

  // Options
  const optionsDiv = document.createElement('div');
  optionsDiv.classList.add('cmp-cookie-personality__options', 'body-3');
  questionWrapper.append(optionsDiv);

  // Filter itemRows for option-item items (1 cell: label)
  const optionItems = itemRows.filter((row) => row.children.length === 1);
  optionItems.forEach((optionRow) => {
    const optionLabelCell = optionRow.children[0]; // Only one cell, so direct access is fine here
    const optionDiv = document.createElement('div');
    optionDiv.classList.add('cmp-cookie-personality__option', 'false'); // 'false' is from original HTML
    optionDiv.textContent = optionLabelCell.textContent.trim();
    moveInstrumentation(optionRow, optionDiv);
    optionsDiv.append(optionDiv);
  });

  // Actions
  const actionsDiv = document.createElement('div');
  actionsDiv.classList.add('cmp-cookie-personality__actions');
  cmpCookiePersonality.append(actionsDiv);

  // Button
  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'cmp-button--secondary', 'cmp-button--secondary-undefined'); // 'cmp-button--secondary-undefined' from original HTML
  const button = document.createElement('button');
  button.classList.add('cmp-button');
  button.type = 'button';
  button.disabled = true; // Disabled by default as per original HTML
  const buttonSpan = document.createElement('span');
  buttonSpan.classList.add('cmp-button__text');
  buttonSpan.textContent = buttonTextRow.textContent.trim();
  moveInstrumentation(buttonTextRow, buttonSpan);
  button.append(buttonSpan);
  buttonDiv.append(button);
  actionsDiv.append(buttonDiv);

  block.append(cmpCookiePersonality);

  // --- Interactivity ---
  const stepperStepsElements = stepperDiv.querySelectorAll('.cmp-cookie-personality__stepper--step');
  const optionElements = optionsDiv.querySelectorAll('.cmp-cookie-personality__option');

  let currentStepIndex = 0;
  let selectedOption = null;

  function updateStepper() {
    stepperStepsElements.forEach((step, index) => {
      if (index === currentStepIndex) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }

  function enableButton() {
    button.disabled = false;
  }

  function disableButton() {
    button.disabled = true;
  }

  optionElements.forEach((option, index) => {
    option.addEventListener('click', () => {
      // Deselect previous option
      if (selectedOption) {
        selectedOption.classList.remove('true');
        selectedOption.classList.add('false');
      }

      // Select current option
      option.classList.remove('false');
      option.classList.add('true');
      selectedOption = option;
      enableButton();
    });
  });

  button.addEventListener('click', () => {
    if (!button.disabled) {
      // Logic to proceed to next step or submit
      // For now, let's just simulate moving to the next stepper step
      currentStepIndex = (currentStepIndex + 1) % stepperStepsElements.length;
      updateStepper();

      // Reset options and disable button for the next "question"
      if (selectedOption) {
        selectedOption.classList.remove('true');
        selectedOption.classList.add('false');
        selectedOption = null;
      }
      disableButton();

      // In a real scenario, you would load the next question and options here
      // This is a placeholder for the actual block logic.
      console.log('Next button clicked. Current step:', currentStepIndex);
    }
  });

  updateStepper(); // Initialize stepper state
}
