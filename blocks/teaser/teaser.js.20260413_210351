import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundImageDesktopRow,
    backgroundImageMobileRow,
    linkRow,
    buttonTextRow,
  ] = [...block.children];

  block.classList.add('cmp-teaser--cta');
  const cmpTeaser = document.createElement('div');
  cmpTeaser.classList.add('cmp-teaser');
  moveInstrumentation(block, cmpTeaser);

  const linkEl = document.createElement('a');
  linkEl.classList.add('cmp-teaser__link');
  const originalLink = linkRow.querySelector('a');
  if (originalLink) {
    linkEl.href = originalLink.href;
    if (originalLink.target) {
      linkEl.target = originalLink.target;
    }
  }
  moveInstrumentation(linkRow, linkEl);

  const cmpTeaserContent = document.createElement('div');
  cmpTeaserContent.classList.add('cmp-teaser__content');

  const cmpTeaserActionContainer = document.createElement('div');
  cmpTeaserActionContainer.classList.add('cmp-teaser__action-container');

  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('button', 'cmp-button--primary-anchor');

  const buttonEl = document.createElement('button');
  buttonEl.classList.add('cmp-button'); // Ensure cmp-button class is added
  // buttonEl.type = 'button'; // The original HTML does not explicitly set type="button" on the button, it's the default.
  moveInstrumentation(buttonTextRow, buttonEl);

  const buttonTextSpan = document.createElement('span');
  buttonTextSpan.classList.add('cmp-button__text');
  // Extract text content from the buttonTextRow's div, not the row itself
  const buttonTextDiv = buttonTextRow.querySelector('div');
  if (buttonTextDiv) {
    buttonTextSpan.textContent = buttonTextDiv.textContent.trim();
  }
  buttonEl.append(buttonTextSpan);

  buttonWrapper.append(buttonEl);
  cmpTeaserActionContainer.append(buttonWrapper);
  cmpTeaserContent.append(cmpTeaserActionContainer);
  linkEl.append(cmpTeaserContent);
  cmpTeaser.append(linkEl);

  // Set background images
  const desktopPicture = backgroundImageDesktopRow.querySelector('picture');
  const mobilePicture = backgroundImageMobileRow.querySelector('picture');

  let desktopSrc = '';
  if (desktopPicture) {
    const img = desktopPicture.querySelector('img');
    if (img) {
      desktopSrc = img.src;
      // Optimize desktop image
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
    }
  }

  let mobileSrc = '';
  if (mobilePicture) {
    const img = mobilePicture.querySelector('img');
    if (img) {
      mobileSrc = img.src;
      // Optimize mobile image
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
    }
  }

  // Set inline style for background image
  if (desktopSrc) {
    cmpTeaser.style.backgroundImage = `url("${desktopSrc}")`;
  }

  // Handle responsive background images
  const updateBackgroundImage = () => {
    if (window.innerWidth <= 768 && mobileSrc) { // Example breakpoint for mobile
      cmpTeaser.style.backgroundImage = `url("${mobileSrc}")`;
    } else if (desktopSrc) {
      cmpTeaser.style.backgroundImage = `url("${desktopSrc}")`;
    }
  };

  updateBackgroundImage();
  window.addEventListener('resize', updateBackgroundImage);

  block.textContent = '';
  block.append(cmpTeaser);
}
