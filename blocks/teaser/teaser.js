import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructuring rows is valid. No cell-level .children[n] here.
  const [
    backgroundImageDesktopRow,
    backgroundImageMobileRow,
    linkRow,
    ctaTextRow,
  ] = [...block.children];

  // Accessing cells using querySelector, not .children[n]
  const link = linkRow.querySelector('a');
  const ctaText = ctaTextRow.querySelector('div')?.textContent.trim();

  const teaserLink = document.createElement('a');
  teaserLink.classList.add('cmp-teaser__link');
  if (link) {
    teaserLink.href = link.href;
    if (link.target) teaserLink.target = link.target;
  }
  moveInstrumentation(linkRow, teaserLink);

  const teaserContent = document.createElement('div');
  teaserContent.classList.add('cmp-teaser__content');

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('cmp-teaser__action-container');

  const buttonWrapper = document.createElement('div');
  // Ensure class names are from ORIGINAL HTML. 'button' and 'cmp-button--primary-anchor' are correct.
  buttonWrapper.classList.add('button', 'cmp-button--primary-anchor');

  const button = document.createElement('button');
  // Ensure class names are from ORIGINAL HTML. 'cmp-button' is correct.
  button.classList.add('cmp-button');
  button.type = 'button';

  const buttonText = document.createElement('span');
  // Ensure class names are from ORIGINAL HTML. 'cmp-button__text' is correct.
  buttonText.classList.add('cmp-button__text');
  buttonText.textContent = ctaText;
  moveInstrumentation(ctaTextRow, buttonText);

  button.append(buttonText);
  buttonWrapper.append(button);
  actionContainer.append(buttonWrapper);
  teaserContent.append(actionContainer);
  teaserLink.append(teaserContent);

  const backgroundImageDesktop = backgroundImageDesktopRow.querySelector('picture');
  const backgroundImageMobile = backgroundImageMobileRow.querySelector('picture');

  block.textContent = '';
  // Ensure class names are from ORIGINAL HTML. 'cmp-teaser--cta' is correct.
  block.classList.add('cmp-teaser--cta');
  // Add the base 'cmp-teaser' class as seen in the original HTML
  block.classList.add('cmp-teaser');


  // Optimize pictures
  [backgroundImageDesktop, backgroundImageMobile].forEach((picture) => {
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        // The width '750' might need to be dynamic or based on actual design requirements.
        // For now, keeping it as is, assuming it's a placeholder.
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        picture.replaceWith(optimizedPic);
      }
    }
  });

  block.append(teaserLink);

  // Add event listener for responsive background image
  const updateBackgroundImage = () => {
    // Ensure the picture elements are the optimized ones after replacement
    const currentBackgroundImageDesktop = block.querySelector('picture'); // This will find the first picture
    const currentBackgroundImageMobile = [...block.children].find(row => row.querySelector('picture') && row !== backgroundImageDesktopRow)?.querySelector('picture');


    if (window.innerWidth <= 768 && currentBackgroundImageMobile) { // Assuming 768px for mobile breakpoint
      const mobileImg = currentBackgroundImageMobile.querySelector('img');
      if (mobileImg) {
        block.style.backgroundImage = `url("${mobileImg.src}")`;
      }
    } else if (currentBackgroundImageDesktop) {
      const desktopImg = currentBackgroundImageDesktop.querySelector('img');
      if (desktopImg) {
        block.style.backgroundImage = `url("${desktopImg.src}")`;
      }
    }
  };

  window.addEventListener('resize', updateBackgroundImage);
  updateBackgroundImage(); // Initial call
}
