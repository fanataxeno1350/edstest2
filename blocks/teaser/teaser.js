import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const teaserCmpTeaser = block.querySelector('.teaser-cmp-teaser');
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('teaser-cmp-teaser__content');

  // Extract and move title
  const title = block.querySelector('[data-aue-prop="title"]');
  if (title) {
    const h2 = document.createElement('h2');
    h2.classList.add('teaser-cmp-teaser__title');
    h2.append(title);
    moveInstrumentation(title, h2);
    contentDiv.append(h2);
  }

  // Extract and move description
  const description = block.querySelector('[data-aue-prop="description"]');
  if (description) {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('teaser-cmp-teaser__description');
    descriptionDiv.append(description);
    moveInstrumentation(description, descriptionDiv);
    contentDiv.append(descriptionDiv);
  }

  // Extract and move CTA
  const ctaLink = block.querySelector('[data-aue-prop="ctaLink"]');
  const ctaText = block.querySelector('[data-aue-prop="ctaText"]');
  const buttonContainer = block.querySelector('.teaser-cmp-teaser__action-container');

  if (ctaLink || ctaText || buttonContainer) {
    const actionContainer = document.createElement('div');
    actionContainer.classList.add('teaser-cmp-teaser__action-container');

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('teaser-button', 'teaser-cmp-button--primary-anchor');

    const a = document.createElement('a');
    a.classList.add('teaser-cmp-button');

    if (ctaLink) {
      a.href = ctaLink.href;
      if (ctaLink.target) {
        a.target = ctaLink.target;
      }
      moveInstrumentation(ctaLink, a);
    } else if (buttonContainer) {
      const authoredLink = buttonContainer.querySelector('a');
      if (authoredLink) {
        a.href = authoredLink.href;
        if (authoredLink.target) {
          a.target = authoredLink.target;
        }
        moveInstrumentation(authoredLink, a);
      }
    }

    const span = document.createElement('span');
    span.classList.add('teaser-cmp-button__text');
    if (ctaText) {
      span.append(ctaText);
      moveInstrumentation(ctaText, span);
    } else if (buttonContainer) {
      const authoredSpan = buttonContainer.querySelector('.teaser-cmp-button__text');
      if (authoredSpan) {
        span.append(...authoredSpan.childNodes);
        moveInstrumentation(authoredSpan, span);
      }
    }

    a.append(span);
    buttonDiv.append(a);
    actionContainer.append(buttonDiv);
    contentDiv.append(actionContainer);
  }

  // Set background image
  const backgroundImageDesktop = block.querySelector('[data-aue-prop="backgroundImageDesktop"]');
  const backgroundImageMobile = block.querySelector('[data-aue-prop="backgroundImageMobile"]');

  let desktopSrc = backgroundImageDesktop ? backgroundImageDesktop.textContent.trim() : '';
  let mobileSrc = backgroundImageMobile ? backgroundImageMobile.textContent.trim() : '';

  // Fallback to data attributes if not found as direct content
  if (!desktopSrc && teaserCmpTeaser) {
    desktopSrc = teaserCmpTeaser.dataset.backgroundImageDesktop || '';
  }
  if (!mobileSrc && teaserCmpTeaser) {
    mobileSrc = teaserCmpTeaser.dataset.backgroundImageMobile || '';
  }

  if (desktopSrc || mobileSrc) {
    const picture = createOptimizedPicture(desktopSrc || mobileSrc, '', true, [
      { media: '(min-width: 600px)', srcset: desktopSrc },
      { srcset: mobileSrc || desktopSrc },
    ]);
    picture.classList.add('teaser-cmp-teaser__image');
    block.prepend(picture);
  }

  // Clear the block and append the new structure
  block.textContent = '';
  if (teaserCmpTeaser) {
    block.classList.add(...teaserCmpTeaser.classList);
    block.dataset.component = teaserCmpTeaser.dataset.component;
    block.dataset.showMediaUrl = teaserCmpTeaser.dataset.showMediaUrl;
    if (teaserCmpTeaser.id) {
      block.id = teaserCmpTeaser.id;
    }
    moveInstrumentation(teaserCmpTeaser, block);
  }
  block.append(contentDiv);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
