import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [desktopImageCell, mobileImageCell, ctaLinkCell, ctaLabelCell] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('banner-section');

  const wrapper = document.createElement('div');
  wrapper.classList.add(
    'position-relative',
    'banner-section__wrapper',
    'asp-ratio-9x16',
    'asp-ratio-sm-16x9',
    'd-flex',
    'justify-content-center',
  );

  const picture = document.createElement('picture');
  picture.classList.add('d-block', 'w-100', 'h-100');

  const desktopPicture = desktopImageCell?.querySelector('picture');
  const mobilePicture = mobileImageCell?.querySelector('picture');

  if (mobilePicture) {
    const mobileImg = mobilePicture.querySelector('img');
    if (mobileImg) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width:600px)';
      sourceMobile.srcset = mobileImg.src;
      picture.append(sourceMobile);
    }
  }

  if (desktopPicture) {
    const desktopImg = desktopPicture.querySelector('img');
    if (desktopImg) {
      const sourceDesktop = document.createElement('source');
      sourceDesktop.srcset = desktopImg.src;
      picture.append(sourceDesktop);

      const img = document.createElement('img');
      img.src = desktopImg.src;
      img.alt = desktopImg.alt || '';
      img.loading = 'eager';
      img.fetchPriority = 'high';
      img.classList.add('w-100', 'h-100', 'object-fit-cover', 'banner-media', 'd-block');
      picture.append(img);
      moveInstrumentation(desktopImageCell, img);
    }
  }

  const overlayDiv = document.createElement('div');
  overlayDiv.classList.add('position-absolute', 'start-0', 'bottom-0', 'w-100', 'h-100');

  const bannerContent = document.createElement('div');
  bannerContent.classList.add('position-absolute', 'banner-content');

  const container = document.createElement('div');
  container.classList.add(
    'container',
    'sticky-element',
    'gx-8',
    'gx-lg-0',
    'd-flex',
    'justify-content-center',
    'align-items-center',
    'flex-column',
    'start-0',
    'end-0',
    'bottom-0',
  );

  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('text-capitalize', 'mt-6', 'mt-md-3', 'mt-lg-9', 'mb-7');

  const ctaAnchor = document.createElement('a');
  ctaAnchor.classList.add(
    'svasti-cta',
    'cta-analytics',
    'w-fit',
    'text-decoration-none',
    'd-flex',
    'align-items-center',
    'primary',
    'px-8',
    'pb-3',
    'text-cream-100',
    'border',
    'border-2',
    'border-red-100',
    'border-maroon-100-hover',
    'border-red-300-active',
    'bg-red-100',
    'bg-maroon-100-hover',
    'bg-red-300-active',
  );
  const foundCtaLink = ctaLinkCell?.querySelector('a');
  if (foundCtaLink) {
    ctaAnchor.href = foundCtaLink.href;
  }
  moveInstrumentation(ctaLinkCell, ctaAnchor);

  const ctaLabelSpan = document.createElement('span');
  ctaLabelSpan.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
  ctaLabelSpan.textContent = ctaLabelCell?.textContent.trim() || '';
  moveInstrumentation(ctaLabelCell, ctaLabelSpan);

  ctaAnchor.append(ctaLabelSpan);
  ctaSpan.append(ctaAnchor);
  container.append(ctaSpan);
  bannerContent.append(container);

  wrapper.append(picture, overlayDiv, bannerContent);
  section.append(wrapper);

  block.replaceChildren(section);

  // Swiper.js related changes
  // The original HTML does not contain Swiper classes, but the presence of
  // multiple images and a CTA suggests a potential carousel or dynamic banner.
  // Assuming Swiper might be needed for a more complex banner if it were interactive.
  // For this static banner, Swiper is not strictly necessary based on the provided HTML,
  // but if it were an interactive banner, these would be the steps.
  // Since the original HTML does not show Swiper, I will remove the Swiper-related
  // additions from the initial fix, as they are not justified by the provided HTML.
  // The only remaining fix is the `async` keyword for `decorate` and `loadScript`/`loadCSS`
  // if they were needed for other parts of the block, but for this specific block,
  // they are not.

  // Re-evaluating based on the provided HTML, there are no Swiper classes or interactive
  // elements that would require Swiper.js. Therefore, the `async` and `loadScript`/`loadCSS`
  // are not needed for this block. The `createOptimizedPicture` is already imported.
  // The initial fix was based on a misinterpretation of "Swiper Carousel Initialization"
  // as a general requirement for all blocks, rather than conditional on the HTML.

  // The final block.querySelectorAll('picture > img').forEach loop is for optimizing pictures,
  // which is a standard AEM practice and not related to Swiper.
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
