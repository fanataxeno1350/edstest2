import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    imageRow,
    imageAltRow,
    creditRow,
    headlineLinkRow,
    headlineRow,
    summaryRow,
  ] = [...block.children];

  const header = document.createElement('header');
  header.classList.add('theme-dark', 'theme-bg', 'theme-section-spacing', 'first:pt-0!');
  header.setAttribute('aria-labelledby', 'hero-headline');

  const figure = document.createElement('figure');

  // Image
  const imageDiv = document.createElement('div');
  imageDiv.classList.add('w-full', 'h-[clamp(300px,65svh,500px)]', 'md:h-[clamp(420px,68svh,660px)]', 'lg:h-[clamp(420px,70svh,768px)]', 'xl:h-[clamp(420px,70svh,1020px)]');
  moveInstrumentation(imageRow, imageDiv);
  const picture = imageRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, true, [{ width: '2560' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      optimizedPic.querySelector('img').classList.add('z-1', 'w-full', 'h-full', 'object-cover');
      imageDiv.append(optimizedPic);
    }
  }
  figure.append(imageDiv);

  // Credit
  const creditContainer = document.createElement('div');
  creditContainer.classList.add('container', 'z-3');
  const creditGrid = document.createElement('div');
  creditGrid.classList.add('grid', 'grid-cols-4', 'sm:grid-cols-2', 'sm:gap-grid-gutter');
  const creditWrapper = document.createElement('div');
  creditWrapper.classList.add('mt-2xs', 'flex', 'flex-col', 'justify-start', 'max-lg:mb-lg', 'lg:pb-5', 'lg:items-end', 'col-span-3', 'sm:col-span-1', 'lg:col-start-2');
  const creditP = document.createElement('p');
  creditP.classList.add('z-1', 'relative', 'text-caption-size', 'theme-dark:text-foreground-colored-muted', 'text-foreground-muted');
  creditP.setAttribute('data-testid', 'hero-credit');
  moveInstrumentation(creditRow, creditP);
  while (creditRow.firstChild) creditP.append(creditRow.firstChild);
  creditWrapper.append(creditP);
  creditGrid.append(creditWrapper);
  creditContainer.append(creditGrid);
  figure.append(creditContainer);

  header.append(figure);

  // Headline and Summary
  const contentContainer = document.createElement('div');
  contentContainer.classList.add('container');
  const contentGrid = document.createElement('div');
  contentGrid.classList.add('grid-cols-4', 'md:grid-cols-14', 'grid-full');
  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('col-span-4', 'md:col-span-12', 'xl:col-span-11', 'space-y-xs');

  // Headline Link and Headline
  const headlineLink = document.createElement('a');
  headlineLink.classList.add('text-h4', 'link-arrow', 'col-span-4', 'md:col-span-12', 'xl:col-span-11', 'text-foreground', 'theme-dark:text-foreground-td', 'hover:underline', 'hocus:underline-offset-4', 'hocus:decoration-[3px]', 'hover:cursor-pointer', 'theme-focus-outline', 'transition-underline');
  headlineLink.setAttribute('id', 'hero-headline');
  headlineLink.setAttribute('data-testid', 'hero-headline');
  const foundHeadlineLink = headlineLinkRow.querySelector('a');
  if (foundHeadlineLink) {
    headlineLink.href = foundHeadlineLink.href;
    moveInstrumentation(headlineLinkRow, headlineLink);
    while (headlineLinkRow.firstChild) headlineLink.append(headlineLinkRow.firstChild);
  } else {
    moveInstrumentation(headlineRow, headlineLink);
    while (headlineRow.firstChild) headlineLink.append(headlineRow.firstChild);
  }
  contentWrapper.append(headlineLink);

  // Summary
  const summaryDiv = document.createElement('div');
  summaryDiv.classList.add('text-p1', 'md:col-span-12', 'xl:col-span-11', 'text-pretty', 'prose', 'theme-dark:prose-td', 'theme-medium:prose-tm');
  summaryDiv.setAttribute('data-testid', 'hero-link-summary');
  moveInstrumentation(summaryRow, summaryDiv);
  while (summaryRow.firstChild) summaryDiv.append(summaryRow.firstChild);
  contentWrapper.append(summaryDiv);

  contentGrid.append(contentWrapper);
  contentContainer.append(contentGrid);
  header.append(contentContainer);

  block.textContent = '';
  block.append(header);
}
