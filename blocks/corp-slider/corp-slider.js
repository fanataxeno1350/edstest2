import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rangeComponent = document.createElement('div');
  rangeComponent.classList.add('range-component');

  // Slider Header
  const sliderHeaderWrapper = document.createElement('div');
  sliderHeaderWrapper.classList.add('row');
  const sliderHeaderCol = document.createElement('div');
  sliderHeaderCol.classList.add('col-md12', 'col-sm-12', 'col-md-12', 'gallery-header');
  const sliderHeaderContent = block.querySelector('[data-aue-prop="sliderHeader"]');
  if (sliderHeaderContent) {
    sliderHeaderCol.append(sliderHeaderContent);
    moveInstrumentation(sliderHeaderContent, sliderHeaderCol);
  } else {
    const defaultHeader = block.querySelector('.gallery-header p');
    if (defaultHeader) {
      sliderHeaderCol.append(defaultHeader);
      moveInstrumentation(defaultHeader, sliderHeaderCol);
    }
  }
  sliderHeaderWrapper.append(sliderHeaderCol);
  rangeComponent.append(sliderHeaderWrapper);

  // Slider Title
  const sliderTitleWrapper = document.createElement('div');
  sliderTitleWrapper.classList.add('slider-title');
  const sliderTitleContent = block.querySelector('[data-aue-prop="sliderTitle"]');
  if (sliderTitleContent) {
    sliderTitleWrapper.append(sliderTitleContent);
    moveInstrumentation(sliderTitleContent, sliderTitleWrapper);
  } else {
    const defaultTitle = block.querySelector('.slider-title h4');
    if (defaultTitle) {
      sliderTitleWrapper.append(defaultTitle);
      moveInstrumentation(defaultTitle, sliderTitleWrapper);
    }
  }
  rangeComponent.append(sliderTitleWrapper);

  // Desktop Slider
  const desktopSlider = document.createElement('div');
  desktopSlider.id = 'range-slider-arena-desktop';
  desktopSlider.classList.add('carousel', 'slide', 'd-none', 'd-sm-block');
  desktopSlider.setAttribute('data-ride', 'carousel');

  const desktopCarouselInner = document.createElement('div');
  desktopCarouselInner.classList.add('carousel-inner');
  desktopSlider.append(desktopCarouselInner);

  // Mobile Slider
  const mobileSlider = document.createElement('div');
  mobileSlider.id = 'range-slider-arena-mobile';
  mobileSlider.classList.add('carousel', 'slide', 'd-sm-none');
  mobileSlider.setAttribute('data-ride', 'carousel');

  const mobileCarouselInner = document.createElement('div');
  mobileCarouselInner.classList.add('carousel-inner');
  mobileSlider.append(mobileCarouselInner);

  const items = block.querySelectorAll('[data-aue-model="sliderItem"]');
  const itemsPerDesktopSlide = 4;
  const itemsPerMobileSlide = 2;

  let desktopItemIndex = 0;
  let mobileItemIndex = 0;

  let desktopCarouselItem;
  let desktopRow;
  let mobileCarouselItem;
  let mobileRow;

  items.forEach((itemNode, index) => {
    // Desktop slide logic
    if (index % itemsPerDesktopSlide === 0) {
      desktopCarouselItem = document.createElement('div');
      desktopCarouselItem.classList.add('carousel-item');
      if (index === 0) {
        // The authored HTML has the 'active' class on the *third* item for desktop.
        // We'll mimic this behavior for the first item in the authored list.
        // However, for programmatic generation, it's more common to have the first item active.
        // For now, we'll keep the first generated item active.
        // If the requirement is to strictly match the authored 'active' class position,
        // additional logic would be needed to find the original active item.
        // For this exercise, we'll make the first *generated* item active for simplicity.
        // To match the authored HTML's active item, we'd need to find the original authored
        // carousel-item that had 'active' and apply it to the corresponding generated one.
        // Given the prompt's focus on content extraction and structure, we'll assume
        // the first item should be active unless explicitly told otherwise for the generated output.
        // Looking at the provided HTML, the *third* carousel-item has 'active'.
        // Let's replicate that by setting the active class on the item that corresponds to the 3rd authored group.
        if (Math.floor(index / itemsPerDesktopSlide) === 2) { // Assuming 0-indexed, 2 is the third group
          desktopCarouselItem.classList.add('active');
        }
      }
      desktopRow = document.createElement('div');
      desktopRow.classList.add('row');
      desktopCarouselItem.append(desktopRow);
      desktopCarouselInner.append(desktopCarouselItem);
      desktopItemIndex = 0;
    }

    // Mobile slide logic
    if (index % itemsPerMobileSlide === 0) {
      mobileCarouselItem = document.createElement('div');
      mobileCarouselItem.classList.add('carousel-item');
      if (index === 0) {
        mobileCarouselItem.classList.add('active');
      }
      mobileRow = document.createElement('div');
      mobileRow.classList.add('row');
      mobileCarouselItem.append(mobileRow);
      mobileCarouselInner.append(mobileCarouselItem);
      mobileItemIndex = 0;
    }

    const linkElement = itemNode.querySelector('[data-aue-prop="link"]') || itemNode.querySelector('.image-area');
    const imageElement = itemNode.querySelector('[data-aue-prop="image"]') || itemNode.querySelector('.image-container img');
    const titleElement = itemNode.querySelector('[data-aue-prop="title"]') || itemNode.querySelector('.img-title');

    const createCard = (colClass) => {
      const colDiv = document.createElement('div');
      colDiv.classList.add(colClass);

      const cardLink = document.createElement('a');
      cardLink.classList.add('image-area');
      if (linkElement) {
        cardLink.href = linkElement.href || '#';
        moveInstrumentation(linkElement, cardLink);
      }

      const imageContainer = document.createElement('div');
      imageContainer.classList.add('image-container');
      imageContainer.setAttribute('target', '_self');

      if (imageElement) {
        const picture = createOptimizedPicture(imageElement.src, imageElement.alt, false, [{ width: '750' }]);
        imageContainer.append(picture);
        moveInstrumentation(imageElement, picture);
      }

      const titleH6 = document.createElement('h6');
      titleH6.classList.add('img-title');
      if (titleElement) {
        titleH6.append(titleElement.textContent);
        moveInstrumentation(titleElement, titleH6);
      }

      cardLink.append(imageContainer, titleH6);
      colDiv.append(cardLink);
      moveInstrumentation(itemNode, colDiv);
      return colDiv;
    };

    // Append to desktop slider
    if (desktopRow) {
      desktopRow.append(createCard('col-6', 'col-sm-6', 'col-lg-3'));
      desktopItemIndex++;
    }

    // Append to mobile slider
    if (mobileRow) {
      mobileRow.append(createCard('col-6', 'col-sm-6', 'col-lg-3'));
      mobileItemIndex++;
    }
  });

  // Add controls for desktop slider
  const desktopPrevControl = document.createElement('a');
  desktopPrevControl.classList.add('carousel-control-prev');
  desktopPrevControl.href = '#range-slider-arena-desktop';
  desktopPrevControl.setAttribute('role', 'button');
  desktopPrevControl.setAttribute('data-slide', 'prev');
  desktopPrevControl.innerHTML = '<span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">previous</span>';
  desktopSlider.append(desktopPrevControl);

  const desktopNextControl = document.createElement('a');
  desktopNextControl.classList.add('carousel-control-next');
  desktopNextControl.href = '#range-slider-arena-desktop';
  desktopNextControl.setAttribute('role', 'button');
  desktopNextControl.setAttribute('data-slide', 'next');
  desktopNextControl.innerHTML = '<span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">next</span>';
  desktopSlider.append(desktopNextControl);

  // Add controls for mobile slider
  const mobilePrevControl = document.createElement('a');
  mobilePrevControl.classList.add('carousel-control-prev');
  mobilePrevControl.href = '#range-slider-arena-mobile';
  mobilePrevControl.setAttribute('role', 'button');
  mobilePrevControl.setAttribute('data-slide', 'prev');
  mobilePrevControl.innerHTML = '<span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">previous</span>';
  mobileSlider.append(mobilePrevControl);

  const mobileNextControl = document.createElement('a');
  mobileNextControl.classList.add('carousel-control-next');
  mobileNextControl.href = '#range-slider-arena-mobile';
  mobileNextControl.setAttribute('role', 'button');
  mobileNextControl.setAttribute('data-slide', 'next');
  mobileNextControl.innerHTML = '<span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">next</span>';
  mobileSlider.append(mobileNextControl);

  rangeComponent.append(desktopSlider, mobileSlider);

  block.textContent = '';
  block.append(rangeComponent);
  block.className = 'corp-slider block';
  block.dataset.blockStatus = 'loaded';
}
