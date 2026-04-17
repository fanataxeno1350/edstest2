import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Fixed fields
  const [backgroundImageRow, titleRow, questionRow, buttonLabelRow] = children.slice(0, 4);

  const backgroundImageCell = backgroundImageRow.firstElementChild;
  const titleCell = titleRow.firstElementChild;
  const questionCell = questionRow.firstElementChild;
  const buttonLabelCell = buttonLabelRow.firstElementChild;

  // Item rows
  const itemRows = children.slice(4);

  const stepperImageRows = [];
  const questionOptionRows = [];

  itemRows.forEach((row) => {
    // Stepper Image has 1 cell (image)
    // Question Option has 1 cell (optionText)
    // Differentiate by content: Stepper Image has a picture, Question Option has plain text
    if (row.firstElementChild?.querySelector('picture')) {
      stepperImageRows.push(row);
    } else {
      questionOptionRows.push(row);
    }
  });

  // Main container
  const cmpCookiePersonality = document.createElement('div');
  cmpCookiePersonality.classList.add('cmp-cookie-personality');
  moveInstrumentation(block, cmpCookiePersonality);

  // Background Image
  const backgroundPicture = backgroundImageCell.querySelector('picture');
  if (backgroundPicture) {
    const img = backgroundPicture.querySelector('img');
    if (img) {
      cmpCookiePersonality.style.backgroundImage = `url("${img.src}")`;
    }
    // Remove original picture element as it's used for background style
    backgroundImageCell.remove();
  }

  // Title
  if (titleCell && titleCell.textContent.trim()) {
    const titleElement = document.createElement('h2');
    titleElement.textContent = titleCell.textContent.trim();
    cmpCookiePersonality.append(titleElement);
    moveInstrumentation(titleRow, titleElement);
  }

  // Stepper
  if (stepperImageRows.length > 0) {
    const stepper = document.createElement('div');
    stepper.classList.add('cmp-cookie-personality__stepper');

    stepperImageRows.forEach((row, index) => {
      const stepperCell = row.firstElementChild;
      const stepDiv = document.createElement('div');
      stepDiv.classList.add('cmp-cookie-personality__stepper--step');
      if (index === 0) {
        stepDiv.classList.add('active');
      }

      if (index < stepperImageRows.length - 1) {
        const span = document.createElement('span');
        span.textContent = (index + 1).toString();
        stepDiv.append(span);
      } else {
        stepDiv.classList.add('cmp-cookie-personality__stepper--step-4');
        const lazyImageContainer = document.createElement('div');
        lazyImageContainer.classList.add('lazy-image-container');
        const picture = stepperCell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          if (img) {
            const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            lazyImageContainer.append(optimizedPic);
          }
        }
        stepDiv.append(lazyImageContainer);
      }
      stepper.append(stepDiv);
      moveInstrumentation(row, stepDiv);
    });
    cmpCookiePersonality.append(stepper);
  }

  // Question Wrapper
  const questionWrapper = document.createElement('div');
  questionWrapper.classList.add('cmp-cookie-personality__question-wrapper');

  // Question
  if (questionCell && questionCell.textContent.trim()) {
    const questionElement = document.createElement('h3');
    questionElement.textContent = questionCell.textContent.trim();
    questionWrapper.append(questionElement);
    moveInstrumentation(questionRow, questionElement);
  }

  // Options
  if (questionOptionRows.length > 0) {
    const optionsDiv = document.createElement('div');
    optionsDiv.classList.add('cmp-cookie-personality__options', 'body-3');

    questionOptionRows.forEach((row) => {
      const optionCell = row.firstElementChild;
      const optionDiv = document.createElement('div');
      optionDiv.classList.add('cmp-cookie-personality__option', 'false');
      optionDiv.textContent = optionCell.textContent.trim();
      optionsDiv.append(optionDiv);
      moveInstrumentation(row, optionDiv);
    });
    questionWrapper.append(optionsDiv);
  }
  cmpCookiePersonality.append(questionWrapper);

  // Actions (Button)
  let buttonElement;
  if (buttonLabelCell && buttonLabelCell.textContent.trim()) {
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('cmp-cookie-personality__actions');

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button', 'cmp-button--secondary', 'cmp-button--secondary-undefined');

    buttonElement = document.createElement('button');
    buttonElement.type = 'button';
    buttonElement.classList.add('cmp-button');
    buttonElement.disabled = true; // Initially disabled as per original HTML

    const spanText = document.createElement('span');
    spanText.classList.add('cmp-button__text');
    spanText.textContent = buttonLabelCell.textContent.trim();

    buttonElement.append(spanText);
    buttonDiv.append(buttonElement);
    actionsDiv.append(buttonDiv);
    cmpCookiePersonality.append(actionsDiv);
    moveInstrumentation(buttonLabelRow, actionsDiv);
  }

  block.innerHTML = '';
  block.append(cmpCookiePersonality);

  // Interactivity: Option selection and button state
  const options = cmpCookiePersonality.querySelectorAll('.cmp-cookie-personality__option');
  options.forEach((option) => {
    option.addEventListener('click', () => {
      // Remove 'active' class from all options
      options.forEach((opt) => opt.classList.remove('active'));
      // Add 'active' class to the clicked option
      option.classList.add('active');

      // Enable the button if an option is selected
      if (buttonElement) {
        buttonElement.disabled = false;
      }
    });
  });
}
