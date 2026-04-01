import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundImageDesktopRow,
    backgroundImageMobileRow,
    linkRow,
    buttonTextRow,
  ] = [...block.children];

  const linkEl = linkRow.querySelector('a');
  const buttonText = buttonTextRow.textContent.trim();

  const teaserLink = document.createElement('a');
  teaserLink.classList.add('cmp-teaser__link');
  if (linkEl) {
    teaserLink.href = linkEl.href;
    if (linkEl.target) teaserLink.target = linkEl.target;
  }
  moveInstrumentation(linkRow, teaserLink);

  const teaserContent = document.createElement('div');
  teaserContent.classList.add('cmp-teaser__content');

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('cmp-teaser__action-container');

  const buttonWrapper = document.createElement('div');
  // Corrected class names to match original HTML
  buttonWrapper.classList.add('button', 'cmp-button--primary-anchor');

  const button = document.createElement('button');
  // Corrected class name to match original HTML
  button.classList.add('cmp-button');
  button.type = 'button';
  moveInstrumentation(buttonTextRow, button);

  const buttonSpan = document.createElement('span');
  buttonSpan.classList.add('cmp-button__text');
  buttonSpan.textContent = buttonText;
  button.append(buttonSpan);

  buttonWrapper.append(button);
  actionContainer.append(buttonWrapper);
  teaserContent.append(actionContainer);
  teaserLink.append(teaserContent);

  const desktopPicture = backgroundImageDesktopRow.querySelector('picture');
  const mobilePicture = backgroundImageMobileRow.querySelector('picture');

  if (desktopPicture) {
    const desktopImg = desktopPicture.querySelector('img');
    if (desktopImg) {
      const optimizedPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '2000' }]);
      moveInstrumentation(desktopImg, optimizedPic.querySelector('img'));
      desktopImg.closest('picture').replaceWith(optimizedPic);
      teaserLink.style.backgroundImage = `url(${optimizedPic.querySelector('img').src})`;
      teaserLink.classList.add('cmp-teaser'); // Add the base teaser class here
    }
  }

  if (mobilePicture) {
    const mobileImg = mobilePicture.querySelector('img');
    if (mobileImg) {
      const optimizedPic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(mobileImg, optimizedPic.querySelector('img'));
      mobileImg.closest('picture').replaceWith(optimizedPic);
      // For simplicity, we apply desktop image as background.
      // In a real scenario, you might use media queries or JS to swap background based on screen size.
    }
  }

  block.textContent = '';
  block.classList.add('cmp-teaser--cta');
  block.append(teaserLink);
}
