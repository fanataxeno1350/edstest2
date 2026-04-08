import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ourStoryCarousel = document.createElement('section');
  ourStoryCarousel.classList.add('our-story-carousel');
  ourStoryCarousel.id = 'press-release-carousel';

  const imagesWrap = document.createElement('section');
  imagesWrap.classList.add('our-story-imagesWrap', 'press-release-imagesWrap');

  const imagesHome = document.createElement('div');
  imagesHome.classList.add('our-story-images_home', 'slick-initialized', 'slick-slider', 'slick-dotted');

  const slickListImage = document.createElement('div');
  slickListImage.classList.add('slick-list', 'draggable');

  const slickTrackImage = document.createElement('div');
  slickTrackImage.classList.add('slick-track');

  const textWrap = document.createElement('section');
  textWrap.classList.add('our-story-textWrap_home', 'press-release-textWrap_home');

  const textsHome = document.createElement('div');
  textsHome.classList.add('our-story-texts_home', 'slick-initialized', 'slick-slider');

  const prevButton = document.createElement('button');
  prevButton.classList.add('slick-prev', 'slick-arrow');
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.type = 'button';
  prevButton.textContent = 'Previous';

  const slickListText = document.createElement('div');
  slickListText.classList.add('slick-list', 'draggable');

  const slickTrackText = document.createElement('div');
  slickTrackText.classList.add('slick-track');

  const nextButton = document.createElement('button');
  nextButton.classList.add('slick-next', 'slick-arrow');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.type = 'button';
  nextButton.textContent = 'Next';

  const slickDots = document.createElement('ul');
  slickDots.classList.add('slick-dots');
  slickDots.setAttribute('role', 'tablist');

  let currentSlideIndex = 0;
  const totalSlides = block.children.length;

  const updateCarousel = (newIndex) => {
    // Remove active classes from current elements
    imagesHome.querySelector('.slick-slide.slick-current')?.classList.remove('slick-current', 'slick-active');
    textsHome.querySelector('.slick-slide.slick-current')?.classList.remove('slick-current', 'slick-active');
    slickDots.querySelector('li.slick-active')?.classList.remove('slick-active');
    slickDots.querySelector('button[aria-selected="true"]')?.setAttribute('aria-selected', 'false');
    slickDots.querySelector('button[tabindex="0"]')?.setAttribute('tabindex', '-1');

    // Add active classes to new elements
    const newImageSlide = slickTrackImage.querySelector(`[data-slick-index="${newIndex}"]`);
    if (newImageSlide) {
      newImageSlide.classList.add('slick-current', 'slick-active');
      newImageSlide.setAttribute('aria-hidden', 'false');
      newImageSlide.setAttribute('tabindex', '0');
    }

    const newTextSlide = slickTrackText.querySelector(`[data-slick-index="${newIndex}"]`);
    if (newTextSlide) {
      newTextSlide.classList.add('slick-current', 'slick-active');
      newTextSlide.setAttribute('aria-hidden', 'false');
      newTextSlide.setAttribute('tabindex', '0');
    }

    const newDotLi = slickDots.children[newIndex];
    if (newDotLi) {
      newDotLi.classList.add('slick-active');
      const newDotButton = newDotLi.querySelector('button');
      if (newDotButton) {
        newDotButton.setAttribute('aria-selected', 'true');
        newDotButton.setAttribute('tabindex', '0');
      }
    }

    // Update transform for slick-track to show the correct slide
    const slideWidth = 960; // Assuming each slide is 960px wide based on original HTML
    slickTrackImage.style.transform = `translate3d(-${newIndex * slideWidth}px, 0px, 0px)`;
    slickTrackText.style.transform = `translate3d(-${newIndex * slideWidth}px, 0px, 0px)`;

    currentSlideIndex = newIndex;
  };

  [...block.children].forEach((row, index) => {
    const cells = [...row.children];

    // The current content detection logic is robust and correctly identifies cells based on content.
    // No changes needed here.
    const categoryCell = cells.find((cell) => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim().length > 0);
    const headlineCell = cells.find((cell) => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim().length > 0 && cell !== categoryCell);
    const dateCell = cells.find((cell) => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim().length > 0 && cell !== categoryCell && cell !== headlineCell);
    const imageCell = cells.find((cell) => cell.querySelector('picture'));
    const linkCell = cells.find((cell) => cell.querySelector('a'));

    // Image Slide (left side with text overlay)
    const imageSlideDiv = document.createElement('div');
    imageSlideDiv.classList.add('slick-slide');
    imageSlideDiv.setAttribute('data-slick-index', index.toString());
    imageSlideDiv.setAttribute('role', 'tabpanel');
    imageSlideDiv.id = `slick-slide0${index}`;
    imageSlideDiv.setAttribute('aria-describedby', `slick-slide-control0${index}`);
    if (index === 0) {
      imageSlideDiv.classList.add('slick-current', 'slick-active');
      imageSlideDiv.setAttribute('aria-hidden', 'false');
      imageSlideDiv.setAttribute('tabindex', '0');
    } else {
      imageSlideDiv.setAttribute('aria-hidden', 'true');
      imageSlideDiv.setAttribute('tabindex', '-1');
    }

    const innerImageDiv = document.createElement('div');
    const ourStoryImageSlide = document.createElement('div');
    ourStoryImageSlide.classList.add('our-story-imageSlide');
    ourStoryImageSlide.id = 'press-release-imageSlide'; // Note: IDs should be unique if multiple instances exist. Consider dynamic IDs.

    const textBody = document.createElement('div');
    textBody.classList.add('our-story-textBody');

    if (categoryCell) {
      const h4 = document.createElement('h4');
      moveInstrumentation(categoryCell, h4);
      h4.innerHTML = categoryCell.innerHTML; // Use innerHTML to preserve rich text if any
      textBody.append(h4);
    }

    if (headlineCell) {
      const h2 = document.createElement('h2');
      moveInstrumentation(headlineCell, h2);
      h2.innerHTML = headlineCell.innerHTML;
      textBody.append(h2);
    }

    if (dateCell) {
      const small = document.createElement('small');
      moveInstrumentation(dateCell, small);
      small.innerHTML = dateCell.innerHTML;
      textBody.append(small);
    }

    const p = document.createElement('p');
    p.id = 'pressReleaseCarouselDesc'; // Note: IDs should be unique.
    textBody.append(p);

    if (linkCell) {
      const link = linkCell.querySelector('a');
      if (link) {
        const readMoreLink = document.createElement('a');
        readMoreLink.href = link.href;
        moveInstrumentation(linkCell, readMoreLink);
        readMoreLink.innerHTML = linkCell.innerHTML; // Preserve link content including any SVG
        textBody.append(readMoreLink);
      }
    }

    ourStoryImageSlide.append(textBody);
    innerImageDiv.append(ourStoryImageSlide);
    imageSlideDiv.append(innerImageDiv);
    slickTrackImage.append(imageSlideDiv);

    // Text Slide (right side with image)
    const textSlideDiv = document.createElement('div');
    textSlideDiv.classList.add('slick-slide');
    textSlideDiv.setAttribute('data-slick-index', index.toString());
    if (index === 0) {
      textSlideDiv.classList.add('slick-current', 'slick-active');
      textSlideDiv.setAttribute('aria-hidden', 'false');
      textSlideDiv.setAttribute('tabindex', '0');
    } else {
      textSlideDiv.setAttribute('aria-hidden', 'true');
      textSlideDiv.setAttribute('tabindex', '-1');
    }

    const innerTextDiv = document.createElement('div');
    const ourStoryTextSlide = document.createElement('div');
    ourStoryTextSlide.classList.add('our-story-textSlide');
    ourStoryTextSlide.id = 'press-release-textSlide'; // Note: IDs should be unique.

    // Add data-toggle and data-target from original HTML for modal functionality
    // Assuming the modal target is derived from the index or a specific attribute
    // For now, hardcoding based on original HTML pattern. This might need dynamic generation.
    ourStoryTextSlide.setAttribute('data-toggle', 'modal');
    ourStoryTextSlide.setAttribute('data-target', `#StoryVideoModal${index + 1}`); // Assuming StoryVideoModal1, StoryVideoModal2, etc.

    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        // The createOptimizedPicture call below will handle the image optimization.
        // For now, just append the picture element, it will be replaced later.
        ourStoryTextSlide.append(picture.cloneNode(true));
      }
    }

    innerTextDiv.append(ourStoryTextSlide);
    textSlideDiv.append(innerTextDiv);
    slickTrackText.append(textSlideDiv);

    // Slick Dots
    const li = document.createElement('li');
    li.setAttribute('role', 'presentation');
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.id = `slick-slide-control0${index}`;
    button.setAttribute('aria-controls', `slick-slide0${index}`);
    button.setAttribute('aria-label', `${index + 1} of ${totalSlides}`);
    button.textContent = (index + 1).toString();
    if (index === 0) {
      li.classList.add('slick-active');
      button.setAttribute('tabindex', '0');
      button.setAttribute('aria-selected', 'true');
    } else {
      button.setAttribute('tabindex', '-1');
      button.setAttribute('aria-selected', 'false');
    }
    li.append(button);
    slickDots.append(li);

    // Add event listener for slick dots
    button.addEventListener('click', () => {
      updateCarousel(index);
    });
  });

  slickListImage.append(slickTrackImage);
  imagesHome.append(slickListImage, slickDots);
  imagesWrap.append(imagesHome);
  ourStoryCarousel.append(imagesWrap);

  slickListText.append(slickTrackText);
  textsHome.append(prevButton, slickListText, nextButton);
  textWrap.append(textsHome);
  ourStoryCarousel.append(textWrap);

  // Add event listeners for navigation buttons
  prevButton.addEventListener('click', () => {
    let newIndex = currentSlideIndex - 1;
    if (newIndex < 0) {
      newIndex = totalSlides - 1; // Loop to last slide
    }
    updateCarousel(newIndex);
  });

  nextButton.addEventListener('click', () => {
    let newIndex = currentSlideIndex + 1;
    if (newIndex >= totalSlides) {
      newIndex = 0; // Loop to first slide
    }
    updateCarousel(newIndex);
  });

  ourStoryCarousel.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ourStoryCarousel);

  // Initial update to ensure correct state if not handled by default classes
  updateCarousel(0);
}
