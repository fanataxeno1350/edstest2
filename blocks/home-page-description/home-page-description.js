import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [imageRow, description1Row, signInLinkRow, registerLinkRow] = [...block.children];

  block.classList.add('grid-container', 'padding', 'animate-enter', 'in-view');
  block.setAttribute('aria-label', 'Home Page Description Module');

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x', 'max-width-container');

  const cellWrapper = document.createElement('div');
  cellWrapper.classList.add('cell', 'large-offset-1', 'large-10', 'xlarge-offset-2', 'xlarge-8', 'text-center', 'wrapper');

  // Image
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('image-container', 'animate-enter-fade-up-short', 'animate-delay-3');
  const picture = imageRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    imageContainer.append(optimizedPic);
  }
  moveInstrumentation(imageRow, imageContainer);
  cellWrapper.append(imageContainer);

  // Description1
  const description1Div = document.createElement('div');
  description1Div.classList.add('description1', 'bodyMediumRegular', 'animate-enter-fade-up-short', 'animate-delay-5');
  moveInstrumentation(description1Row, description1Div);
  while (description1Row.firstChild) {
    description1Div.append(description1Row.firstChild);
  }
  cellWrapper.append(description1Div);

  // CTA Container
  const ctaContainer = document.createElement('div');
  ctaContainer.classList.add('cta-container');

  // Sign In Link
  const signInLink = document.createElement('a');
  signInLink.classList.add('link', 'small', 'black', 'sign-in', 'animate-enter-fade-up-short', 'animate-delay-9');
  signInLink.setAttribute('aria-label', 'Sign in');
  signInLink.setAttribute('rel', 'follow');
  const originalSignInLink = signInLinkRow.querySelector('a');
  if (originalSignInLink) {
    signInLink.href = originalSignInLink.href;
    const span = document.createElement('span');
    span.classList.add('button-text');
    span.textContent = originalSignInLink.textContent;
    signInLink.append(span);
  }
  moveInstrumentation(signInLinkRow, signInLink);
  ctaContainer.append(signInLink);

  // Separator
  const separator = document.createElement('span');
  separator.classList.add('labelSmallBold', 'separator', 'animate-enter-fade-up-short', 'animate-delay-9');
  separator.textContent = ' / ';
  ctaContainer.append(separator);

  // Register Link
  const registerLink = document.createElement('a');
  registerLink.classList.add('link', 'small', 'black', 'register', 'animate-enter-fade-up-short', 'animate-delay-9');
  registerLink.setAttribute('aria-label', 'Register');
  registerLink.setAttribute('rel', 'follow');
  const originalRegisterLink = registerLinkRow.querySelector('a');
  if (originalRegisterLink) {
    registerLink.href = originalRegisterLink.href;
    const span = document.createElement('span');
    span.classList.add('button-text');
    span.textContent = originalRegisterLink.textContent;
    registerLink.append(span);
  }
  moveInstrumentation(registerLinkRow, registerLink);
  ctaContainer.append(registerLink);

  cellWrapper.append(ctaContainer);

  const productCardWtb = document.createElement('div');
  productCardWtb.classList.add('product-card__wtb');
  cellWrapper.append(productCardWtb);

  gridX.append(cellWrapper);
  block.textContent = '';
  block.append(gridX);
}
