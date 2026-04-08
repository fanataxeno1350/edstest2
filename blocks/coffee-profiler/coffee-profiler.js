import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    headingRow,
    introRow,
    greetingMorningRow,
    greetingAfternoonRow,
    greetingEveningRow,
    greetingNightRow,
    guideTextRow,
    backgroundImageRow,
    errorMessageRow,
    ...questionRows
  ] = [...block.children];

  block.classList.add('grid-container', 'animate-enter', 'in-view');

  // Background images
  const bgPaperBlue = document.createElement('div');
  bgPaperBlue.classList.add('bg--paper-blue', 'dummy-to-load-bg');
  block.append(bgPaperBlue);

  const bgPaperWhiteHeavy = document.createElement('div');
  bgPaperWhiteHeavy.classList.add('bg--paper-white-heavy', 'dummy-to-load-bg');
  block.append(bgPaperWhiteHeavy);

  const parallaxBgImgContainer = document.createElement('div');
  parallaxBgImgContainer.classList.add('parallax-bg-img-container');
  const parallaxImg = document.createElement('div');
  parallaxImg.classList.add('parallax-img', 'lazyLoadedImage');

  const bgPicture = backgroundImageRow.querySelector('picture');
  if (bgPicture) {
    const bgImg = bgPicture.querySelector('img');
    if (bgImg && bgImg.src) {
      parallaxImg.style.backgroundImage = `url(${bgImg.src})`;
    }
    moveInstrumentation(backgroundImageRow, parallaxBgImgContainer);
  }
  parallaxBgImgContainer.append(parallaxImg);
  block.append(parallaxBgImgContainer);

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('max-width-container', 'grid-x');

  const introSection = document.createElement('div');
  introSection.classList.add('cell', 'small-12', 'medium-offset-1', 'medium-10', 'xlarge-offset-2', 'xlarge-8', 'padding-x');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'animate-enter-fade-up-short', 'animate-delay-3');
  const headingCell = [...headingRow.children].find((cell) => cell.textContent.trim() !== '');
  if (headingCell) {
    moveInstrumentation(headingRow, heading);
    heading.append(...headingCell.children);
  }
  introSection.append(heading);

  const introInfo = document.createElement('div');
  introInfo.classList.add('intro-info', 'animate-enter-fade', 'animate-delay-1', 'no-avatar-image');

  const greetingsContainer = document.createElement('div');
  greetingsContainer.classList.add('greetings-container', 'headline-h4', 'animate-enter-fade-up-short', 'animate-delay-3', 'stagger-1');

  const greetingMorning = document.createElement('span');
  greetingMorning.classList.add('greeting--morning');
  const greetingMorningCell = [...greetingMorningRow.children].find((cell) => cell.textContent.trim() !== '');
  if (greetingMorningCell) {
    moveInstrumentation(greetingMorningRow, greetingMorning);
    greetingMorning.append(...greetingMorningCell.children);
  }
  greetingsContainer.append(greetingMorning);

  const greetingAfternoon = document.createElement('span');
  greetingAfternoon.classList.add('hide', 'greeting--afternoon');
  const greetingAfternoonCell = [...greetingAfternoonRow.children].find((cell) => cell.textContent.trim() !== '');
  if (greetingAfternoonCell) {
    moveInstrumentation(greetingAfternoonRow, greetingAfternoon);
    greetingAfternoon.append(...greetingAfternoonCell.children);
  }
  greetingsContainer.append(greetingAfternoon);

  const greetingEvening = document.createElement('span');
  greetingEvening.classList.add('hide', 'greeting--evening');
  const greetingEveningCell = [...greetingEveningRow.children].find((cell) => cell.textContent.trim() !== '');
  if (greetingEveningCell) {
    moveInstrumentation(greetingEveningRow, greetingEvening);
    greetingEvening.append(...greetingEveningCell.children);
  }
  greetingsContainer.append(greetingEvening);

  const greetingNight = document.createElement('span');
  greetingNight.classList.add('hide', 'greeting--night');
  const greetingNightCell = [...greetingNightRow.children].find((cell) => cell.textContent.trim() !== '');
  if (greetingNightCell) {
    moveInstrumentation(greetingNightRow, greetingNight);
    greetingNight.append(...greetingNightCell.children);
  }
  greetingsContainer.append(greetingNight);

  introInfo.append(greetingsContainer);

  const guideText = document.createElement('div');
  guideText.classList.add('guide-text', 'labelMediumRegular', 'animate-enter-fade-up-short', 'animate-delay-6');
  const guideTextCell = [...guideTextRow.children].find((cell) => cell.textContent.trim() !== '');
  if (guideTextCell) {
    moveInstrumentation(guideTextRow, guideText);
    guideText.append(...guideTextCell.children);
  }
  introInfo.append(guideText);

  introSection.append(introInfo);
  maxWidthContainer.append(introSection);

  const paginationContainer = document.createElement('div');
  paginationContainer.classList.add('cell', 'small-12', 'medium-offset-1', 'medium-10', 'xlarge-offset-2', 'xlarge-8', 'swiper-pagination-container', 'padding-x', 'animate-enter-fade-up-short', 'animate-delay-15');
  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'swiper-pagination-progressbar', 'swiper-pagination-horizontal');
  const swiperPaginationFill = document.createElement('span');
  swiperPaginationFill.classList.add('swiper-pagination-progressbar-fill');
  swiperPagination.append(swiperPaginationFill);
  paginationContainer.append(swiperPagination);
  maxWidthContainer.append(paginationContainer);

  const swiperWrapperCell = document.createElement('div');
  swiperWrapperCell.classList.add('cell', 'small-12');
  const swiper = document.createElement('div');
  swiper.classList.add('swiper', 'coffee-profiler-swiper', 'swiper-initialized', 'swiper-horizontal', 'swiper-backface-hidden');
  swiper.style.minHeight = '563px'; // This is a hardcoded style from original HTML, not a dimension.

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperWrapper.setAttribute('aria-live', 'polite');

  questionRows.forEach((row, index) => {
    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');
    if (index === 0) {
      swiperSlide.classList.add('initial-slide', 'swiper-slide-active');
    } else if (index === 1) {
      swiperSlide.classList.add('swiper-slide-next');
    }
    if (index === questionRows.length - 1) {
      swiperSlide.classList.add('last-slide');
    }
    swiperSlide.setAttribute('data-slide-index', index.toString());
    swiperSlide.setAttribute('aria-label', `${index + 1} / ${questionRows.length}`);
    swiperSlide.style.width = '1440px'; // This is a hardcoded style from original HTML, not a dimension.

    const cells = [...row.children];
    const questionLabelCell = cells.find(cell => !cell.querySelector('picture') && cell.textContent.trim() !== '');
    const optionsCell = cells.find(cell => cell.querySelector('picture') || cell.children.length > 0);

    const slideTypeNo = document.createElement('div');
    slideTypeNo.classList.add('slide-type--no');
    const coffeeProfilerSlideNo = document.createElement('div');
    coffeeProfilerSlideNo.classList.add('coffee-profiler-slide', 'animate-enter-fade-up-short', 'animate-delay-7');
    coffeeProfilerSlideNo.setAttribute('data-slide-index', index.toString());

    const questionLabelNo = document.createElement('h3');
    questionLabelNo.classList.add('question-label');
    if (questionLabelCell) {
      moveInstrumentation(questionLabelCell, questionLabelNo);
      questionLabelNo.append(...questionLabelCell.children);
    }
    coffeeProfilerSlideNo.append(questionLabelNo);

    const optionsContainerNo = document.createElement('div');
    optionsContainerNo.classList.add('options-container');

    if (optionsCell) {
      const optionsContentNo = optionsCell.cloneNode(true);
      const optionItemsNo = [...optionsContentNo.children];
      optionsContainerNo.classList.add(`options-count--${optionItemsNo.length}`);

      optionItemsNo.forEach((optionItem) => {
        const optionButton = document.createElement('button');
        optionButton.classList.add('option', 'elevation-2', 'has-hover', 'bg--paper-white');
        optionButton.setAttribute('role', 'radio');
        optionButton.setAttribute('aria-checked', 'false');
        optionButton.setAttribute('disabled', 'disabled');

        const optionIcon = optionItem.querySelector('picture');
        if (optionIcon) {
          const img = optionIcon.querySelector('img');
          if (img) {
            const newImg = document.createElement('img');
            newImg.classList.add('option-icon', 'lazyload');
            newImg.alt = img.alt;
            newImg.src = img.src;
            optionButton.append(newImg);
          }
        }

        const optionLabel = document.createElement('span');
        optionLabel.classList.add('option-label', 'labelMediumRegular');
        const labelText = optionItem.textContent.trim();
        if (optionIcon) {
          const labelEl = optionItem.cloneNode(true);
          labelEl.querySelector('picture').remove();
          optionLabel.textContent = labelEl.textContent.trim();
        } else {
          optionLabel.textContent = labelText;
        }
        optionButton.setAttribute('aria-label', optionLabel.textContent);
        optionButton.append(optionLabel);
        optionsContainerNo.append(optionButton);
      });
    }

    coffeeProfilerSlideNo.append(optionsContainerNo);
    slideTypeNo.append(coffeeProfilerSlideNo);
    swiperSlide.append(slideTypeNo);

    // Add slide-type--yes for the second set of questions if needed, mimicking the original HTML
    if (index > 0) {
      const slideTypeYes = document.createElement('div');
      slideTypeYes.classList.add('slide-type--yes', 'hide');
      const coffeeProfilerSlideYes = document.createElement('div');
      coffeeProfilerSlideYes.classList.add('coffee-profiler-slide', 'animate-enter-fade-up-short', 'animate-delay-7');
      coffeeProfilerSlideYes.setAttribute('data-slide-index', index.toString());

      const questionLabelYes = document.createElement('h3');
      questionLabelYes.classList.add('question-label');
      if (questionLabelCell) {
        questionLabelYes.append(...questionLabelCell.cloneNode(true).children); // Clone content
      }
      coffeeProfilerSlideYes.append(questionLabelYes);

      const optionsContainerYes = document.createElement('div');
      optionsContainerYes.classList.add('options-container');
      if (optionsCell) {
        const optionsContentYes = optionsCell.cloneNode(true);
        const optionItemsYes = [...optionsContentYes.children];
        optionsContainerYes.classList.add(`options-count--${optionItemsYes.length}`);

        optionItemsYes.forEach((optionItem) => {
          const optionButton = document.createElement('button');
          optionButton.classList.add('option', 'elevation-2', 'has-hover', 'bg--paper-white');
          optionButton.setAttribute('role', 'radio');
          optionButton.setAttribute('aria-checked', 'false');
          optionButton.setAttribute('disabled', 'disabled');

          const optionIcon = optionItem.querySelector('picture');
          if (optionIcon) {
            const img = optionIcon.querySelector('img');
            if (img) {
              const newImg = document.createElement('img');
              newImg.classList.add('option-icon', 'lazyload');
              newImg.alt = img.alt;
              newImg.src = img.src;
              optionButton.append(newImg);
            }
          }

          const optionLabel = document.createElement('span');
          optionLabel.classList.add('option-label', 'labelMediumRegular');
          const labelText = optionItem.textContent.trim();
          if (optionIcon) {
            const labelEl = optionItem.cloneNode(true);
            labelEl.querySelector('picture').remove();
            optionLabel.textContent = labelEl.textContent.trim();
          } else {
            optionLabel.textContent = labelText;
          }
          optionButton.setAttribute('aria-label', optionLabel.textContent);
          optionButton.append(optionLabel);
          optionsContainerYes.append(optionButton);
        });
      }

      coffeeProfilerSlideYes.append(optionsContainerYes);
      slideTypeYes.append(coffeeProfilerSlideYes);
      swiperSlide.append(slideTypeYes);
    }

    swiperWrapper.append(swiperSlide);
  });

  swiper.append(swiperWrapper);

  const swiperControls = document.createElement('div');
  swiperControls.classList.add('swiper-controls', 'animate-enter-fade', 'animate-delay-15');

  const prevButton = document.createElement('button');
  prevButton.classList.add('swiper-control', 'swiper-button', 'swiper-control--prev', 'elevation-1', 'animate-enter-fade-right-short', 'animate-delay-15', 'swiper-button-disabled');
  prevButton.setAttribute('disabled', '');
  prevButton.setAttribute('tabindex', '-1');
  prevButton.setAttribute('aria-label', 'Previous slide');
  prevButton.setAttribute('aria-disabled', 'true');
  const prevImg = document.createElement('img');
  prevImg.setAttribute('alt', 'svg file');
  prevImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775635713924.svg+xml'; // Example path, replace if dynamic
  prevButton.append(prevImg);
  swiperControls.append(prevButton);

  const nextButton = document.createElement('button');
  nextButton.classList.add('swiper-control', 'swiper-button', 'swiper-control--next', 'elevation-1', 'animate-enter-fade-left-short', 'animate-delay-15');
  nextButton.setAttribute('tabindex', '0');
  nextButton.setAttribute('aria-label', 'Next slide');
  nextButton.setAttribute('aria-disabled', 'false');
  nextButton.setAttribute('disabled', 'disabled');
  const nextImg = document.createElement('img');
  nextImg.setAttribute('alt', 'svg file');
  nextImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775635714038.svg+xml'; // Example path, replace if dynamic
  nextButton.append(nextImg);
  swiperControls.append(nextButton);

  swiper.append(swiperControls);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  swiper.append(swiperNotification);

  swiperWrapperCell.append(swiper);
  maxWidthContainer.append(swiperWrapperCell);

  block.append(maxWidthContainer);

  const errorMessageDiv = document.createElement('div');
  errorMessageDiv.classList.add('error-message');
  errorMessageDiv.setAttribute('data-default-message', 'Error! Please try again.');
  const errorMessageText = document.createElement('span');
  errorMessageText.classList.add('error-message-text', 'bodyLargeRegular');
  const errorMessageCell = [...errorMessageRow.children].find((cell) => cell.textContent.trim() !== '');
  if (errorMessageCell) {
    moveInstrumentation(errorMessageRow, errorMessageText);
    errorMessageText.append(...errorMessageCell.children);
  }
  errorMessageDiv.append(errorMessageText);
  block.append(errorMessageDiv);

  const form = document.createElement('form');
  form.classList.add('hide', 'coffee-profiler-form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', 'https://www.nescafe.com/in/coffee-profiler/result');

  const inputNames = ['type', 'intensity', 'format', 'features', 'exc-type', 'exc-intensity', 'exc-format', 'exc-features'];
  inputNames.forEach((name) => {
    const input = document.createElement('input');
    input.setAttribute('name', name);
    input.setAttribute('value', '');
    input.setAttribute('type', 'hidden');
    form.append(input);
  });
  block.append(form);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Event listeners for swiper controls (simplified for static content)
  let currentSlideIndex = 0;
  const totalSlides = questionRows.length;

  const updateSwiperButtons = () => {
    prevButton.disabled = currentSlideIndex === 0;
    nextButton.disabled = currentSlideIndex === totalSlides - 1;
    prevButton.classList.toggle('swiper-button-disabled', currentSlideIndex === 0);
    nextButton.classList.toggle('swiper-button-disabled', currentSlideIndex === totalSlides - 1);

    swiperWrapper.style.transform = `translate3d(-${currentSlideIndex * 1440}px, 0px, 0px)`;
    [...swiperWrapper.children].forEach((slide, i) => {
      slide.classList.remove('swiper-slide-active', 'swiper-slide-next');
      if (i === currentSlideIndex) {
        slide.classList.add('swiper-slide-active');
      } else if (i === currentSlideIndex + 1) {
        slide.classList.add('swiper-slide-next');
      }
    });

    // Update progress bar (simplified)
    swiperPaginationFill.style.transform = `translate3d(0px, 0px, 0px) scaleX(${(currentSlideIndex + 1) / totalSlides}) scaleY(1)`;
    swiperPaginationFill.style.transitionDuration = '1000ms';
  };

  prevButton.addEventListener('click', () => {
    if (currentSlideIndex > 0) {
      currentSlideIndex -= 1;
      updateSwiperButtons();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentSlideIndex < totalSlides - 1) {
      currentSlideIndex += 1;
      updateSwiperButtons();
    }
  });

  updateSwiperButtons(); // Initial state
}
