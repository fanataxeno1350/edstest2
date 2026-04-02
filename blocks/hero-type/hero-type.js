import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Use content detection instead of direct index access
  const cells = [...block.children].map((row) => [...row.children]);

  const videoCell = cells[0][0]; // First row, first cell for video
  const headingCell = cells[1][0]; // Second row, first cell for heading
  const supportingTextCell = cells[2][0]; // Third row, first cell for supporting text
  const ctaLinkCell = cells[3][0]; // Fourth row, first cell for CTA link

  const videoElement = document.createElement('video');
  videoElement.classList.add('hero-type-video');
  videoElement.setAttribute('autoplay', '');
  videoElement.setAttribute('loop', '');
  videoElement.setAttribute('muted', '');

  const videoPicture = videoCell.querySelector('picture');
  if (videoPicture) {
    const videoSrc = videoPicture.querySelector('img').src;
    const source = document.createElement('source');
    source.src = videoSrc;
    source.type = 'video/mp4';
    videoElement.append(source);
    moveInstrumentation(videoCell.closest('div'), videoElement); // Pass the parent div of the cell
    videoCell.closest('div').remove(); // Remove the parent div of the cell
  }

  const heroImageDiv = document.createElement('div');
  heroImageDiv.classList.add('hero-type-image');

  const heroBackgroundSpan = document.createElement('span');
  heroBackgroundSpan.classList.add('hero-type-background');
  heroImageDiv.append(heroBackgroundSpan);

  const heroBackgroundPlaceholderSpan = document.createElement('span');
  heroBackgroundPlaceholderSpan.classList.add('hero-type-background-placeholder');
  heroImageDiv.append(heroBackgroundPlaceholderSpan);

  const pauseButton = document.createElement('button');
  pauseButton.classList.add('hero-type-pause');
  pauseButton.textContent = 'Stop Video';
  pauseButton.addEventListener('click', () => {
    if (videoElement.paused) {
      videoElement.play();
      pauseButton.textContent = 'Stop Video';
    } else {
      videoElement.pause();
      pauseButton.textContent = 'Resume Video';
    }
  });

  const heroTypeTextDiv = document.createElement('div');
  heroTypeTextDiv.classList.add('hero-type-text');

  const heading = document.createElement('h1');
  heading.classList.add('heading-h1', 'home-hero-title', '-white');
  moveInstrumentation(headingCell.closest('div'), heading); // Pass the parent div of the cell
  heading.innerHTML = headingCell.textContent.trim();
  headingCell.closest('div').remove(); // Remove the parent div of the cell

  const supportingTextDiv = document.createElement('div');
  supportingTextDiv.classList.add('supporting-text');
  moveInstrumentation(supportingTextCell.closest('div'), supportingTextDiv); // Pass the parent div of the cell
  while (supportingTextCell.firstChild) supportingTextDiv.append(supportingTextCell.firstChild);
  supportingTextCell.closest('div').remove(); // Remove the parent div of the cell

  const ctaLinkWrapper = document.createElement('p');
  ctaLinkWrapper.classList.add('u-text-centered');
  const ctaLink = document.createElement('a');
  ctaLink.classList.add('u-button', 'u-button-reversed-white');
  const originalCtaLink = ctaLinkCell.querySelector('a');
  if (originalCtaLink) {
    ctaLink.href = originalCtaLink.href;
    ctaLink.textContent = originalCtaLink.textContent;
  }
  moveInstrumentation(ctaLinkCell.closest('div'), ctaLink); // Pass the parent div of the cell
  ctaLinkCell.closest('div').remove(); // Remove the parent div of the cell
  ctaLinkWrapper.append(ctaLink);
  supportingTextDiv.append(ctaLinkWrapper);

  heroTypeTextDiv.append(heading, supportingTextDiv);

  block.textContent = '';
  block.classList.add('-tall');
  block.append(videoElement, heroImageDiv, pauseButton, heroTypeTextDiv);

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
