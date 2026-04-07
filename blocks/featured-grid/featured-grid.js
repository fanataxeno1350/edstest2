import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const gridContainer = document.createElement('div');
  gridContainer.classList.add('grid', 'gap-8', 'lg:gap-grid-gutter', 'featured-grid', 'sm:featured-grid-sm', 'md:featured-grid-md', 'lg:featured-grid-lg');

  [...block.children].forEach((row) => {
    const linkEl = document.createElement('a');
    moveInstrumentation(row, linkEl);
    linkEl.classList.add('grid', 'grid-rows-subgrid', 'row-span-3', 'gap-0', 'group/card', 'no-underline', 'cursor-pointer', 'theme-focus-outline', 'max-w-[650px]');

    const cells = [...row.children];

    // Cell 0: Image
    const imageCell = cells[0];
    const picture = imageCell.querySelector('picture');
    const img = picture ? picture.querySelector('img') : null;
    const imageAltText = cells[1].textContent.trim(); // Cell 1: Image Alt Text
    const caption = cells[2].textContent.trim(); // Cell 2: Caption
    const eyebrow = cells[3].textContent.trim(); // Cell 3: Eyebrow
    const title = cells[4].textContent.trim(); // Cell 4: Title
    const subheading = cells[5].textContent.trim(); // Cell 5: Subheading
    const link = cells[6].querySelector('a'); // Cell 6: Link

    if (link) {
      linkEl.href = link.href;
      linkEl.setAttribute('aria-label', title);
      linkEl.setAttribute('aria-description', subheading);
    }

    // Image container
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('row-start-1', 'w-full');
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('rounded-sm', 'relative', 'overflow-hidden', 'bg-surface-muted', 'aspect-[4/3]');
    cardDiv.setAttribute('data-testid', 'card');

    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, imageAltText, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      optimizedPic.querySelector('img').classList.add('rounded-sm', 'w-full', 'object-cover', 'motion-safe:group-hover/card:scale-105', 'transition-transform', 'duration-400', 'aspect-[4/3]');
      optimizedPic.querySelector('img').setAttribute('height', '300'); // Assuming a default height
      optimizedPic.querySelector('img').setAttribute('width', '400'); // Assuming a default width
      optimizedPic.querySelector('img').setAttribute('loading', 'lazy');
      cardDiv.append(optimizedPic);
    }
    imageWrapper.append(cardDiv);
    linkEl.append(imageWrapper);

    // Caption
    if (caption) {
      const captionWrapper = document.createElement('div');
      captionWrapper.classList.add('row-start-2', 'w-full');
      const captionInner = document.createElement('div');
      captionInner.classList.add('mt-2xs', 'mt-1!');
      const captionP = document.createElement('p');
      captionP.classList.add('z-1', 'relative', 'text-caption-size', 'theme-dark:text-foreground-colored-muted', 'text-foreground-muted');
      captionP.textContent = caption;
      captionInner.append(captionP);
      captionWrapper.append(captionInner);
      linkEl.append(captionWrapper);
    }

    // Text content
    const textWrapper = document.createElement('div');
    textWrapper.classList.add('w-full', 'mt-2.5', 'row-start-3');

    if (eyebrow) {
      const eyebrowP = document.createElement('p');
      eyebrowP.classList.add('text-p2', 'font-bold', 'pb-3xs', 'theme-dark:text-foreground-td', 'theme-medium:text-foreground-tm');
      eyebrowP.setAttribute('data-testid', 'featured-item-eyebrow');
      eyebrowP.textContent = eyebrow;
      textWrapper.append(eyebrowP);
    }

    if (title) {
      const titleH3 = document.createElement('h3');
      titleH3.classList.add('text-card-title-size', 'font-stretch-normal', 'font-semibold', 'inline');
      titleH3.setAttribute('data-testid', 'card-link-title');
      const titleSpan = document.createElement('span');
      titleSpan.classList.add('link-arrow', 'group-hover/card:after:motion-safe:ml-link-arrow-hover-offset', 'inline', 'link', 'text-foreground', 'theme-dark:text-foreground-td', 'theme-medium:text-foreground-tm', 'no-underline', 'hover:text-foreground', 'focus-visible:outline-focus-color', 'group-hover/card:text-foreground', 'group-hover/card:underline', 'group-hover/card:underline-offset-4', 'group-hover/card:decoration-inherit', 'group-hover/card:decoration-[3px]', 'transition-[text-decoration]');
      titleSpan.textContent = title;
      titleH3.append(titleSpan);
      textWrapper.append(titleH3);
    }

    if (subheading) {
      const subheadingP = document.createElement('p');
      subheadingP.classList.add('text-p1', 'pt-1', 'text-foreground', 'theme-dark:text-foreground-td', 'theme-medium:text-foreground-tm');
      subheadingP.setAttribute('data-testid', 'featured-item-subheading');
      subheadingP.textContent = subheading;
      textWrapper.append(subheadingP);
    }

    linkEl.append(textWrapper);
    gridContainer.append(linkEl);
  });

  block.textContent = '';
  block.append(gridContainer);
}
