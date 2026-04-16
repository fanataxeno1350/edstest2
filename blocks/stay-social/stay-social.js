import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('stay-social', 'pt-14', 'py-lg-11', 'bg-cream-300');

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');
  section.append(container);

  // Root fields: Title and Subtext
  // Use content detection instead of fixed index access for root fields
  // based on the BlockJson model and expected content.
  // Title is the first text-only row.
  const titleRow = children.find(row => row.children.length === 1 && !row.querySelector('picture') && !row.querySelector('a'));
  if (titleRow) {
    const titleCell = titleRow.firstElementChild;
    const title = document.createElement('h2');
    title.classList.add('stay-social__title', 'font-24', 'leading-34', 'text-dark-gray-100', 'font-baskerville', 'font-sm-40', 'text-center', 'fw-bold');
    moveInstrumentation(titleCell, title);
    title.textContent = titleCell.textContent.trim();
    container.append(title);
  }

  // Subtext is the second text-only row.
  const subtextRow = children.filter(row => row.children.length === 1 && !row.querySelector('picture') && !row.querySelector('a'))[1];
  if (subtextRow) {
    const subtextCell = subtextRow.firstElementChild;
    const subtext = document.createElement('h3');
    subtext.classList.add('stay-social__subtext', 'font-16', 'leading-24', 'text-dark-gray-100', 'font-sm-18', 'text-center', 'fw-medium', 'mt-4');
    moveInstrumentation(subtextCell, subtext);
    subtext.textContent = subtextCell.textContent.trim();
    container.append(subtext);
  }

  const mainDiv = document.createElement('div');
  mainDiv.classList.add('stay-social__main', 'mt-8');
  container.append(mainDiv);

  const cardsList = document.createElement('ul');
  cardsList.classList.add('stay-social__cards', 'd-grid', 'gap-5', 'gap-sm-8', 'w-fit', 'mx-auto');
  mainDiv.append(cardsList);

  const ctaDiv = document.createElement('div');
  ctaDiv.classList.add('d-flex', 'align-items-center', 'justify-content-center', 'mt-8', 'mt-lg-10');
  section.append(ctaDiv);

  // Process item rows (cards and CTA)
  // Filter out the root title and subtext rows already processed
  const itemRows = children.filter(row => row.children.length > 1);

  itemRows.forEach((row) => {
    const cells = [...row.children];

    // Stay-Social-Card (2 cells: image, link)
    if (cells.length === 2 && cells[0].querySelector('picture')) {
      const li = document.createElement('li');
      li.classList.add('stay-social__card', 'overflow-hidden', 'ratio-1x1', 'ratio');

      const imageCell = cells[0];
      const linkCell = cells[1];

      const link = document.createElement('a');
      link.classList.add('stay-social__card--link', 'd-block', 'w-100', 'h-100');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.target = '_blank'; // Assuming target blank for social links
        const screenReaderSpan = document.createElement('span');
        screenReaderSpan.classList.add('cmp-link__screen-reader-only');
        screenReaderSpan.textContent = 'opens in a new tab';
        link.append(screenReaderSpan);
      }

      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          optimizedPic.querySelector('img').classList.add('stay-social__card--image', 'w-100', 'h-100', 'object-fit-cover');
          moveInstrumentation(picture, optimizedPic);
          link.prepend(optimizedPic);
        }
      }
      moveInstrumentation(row, li);
      li.append(link);
      cardsList.append(li);
    }
    // Stay-Social-Cta (2 cells: label, link)
    else if (cells.length === 2 && !cells[0].querySelector('picture')) {
      const labelCell = cells[0];
      const linkCell = cells[1];

      const ctaLink = document.createElement('a');
      ctaLink.classList.add('svasti-cta', 'w-fit', 'text-decoration-none', 'd-flex', 'align-items-center', 'primary', 'px-8', 'pb-3', 'text-cream-100', 'border', 'border-2', 'border-red-100', 'border-maroon-100-hover', 'border-red-300-active', 'bg-red-100', 'bg-maroon-100-hover', 'bg-red-300-active');

      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        ctaLink.href = foundLink.href;
        ctaLink.target = '_blank'; // Assuming target blank for social links
        const screenReaderSpan = document.createElement('span');
        screenReaderSpan.classList.add('cmp-link__screen-reader-only');
        screenReaderSpan.textContent = 'opens in a new tab';
        ctaLink.append(screenReaderSpan);
      }

      const labelSpan = document.createElement('span');
      labelSpan.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
      labelSpan.textContent = labelCell.textContent.trim();
      ctaLink.prepend(labelSpan);

      moveInstrumentation(row, ctaLink);
      ctaDiv.append(ctaLink);
    }
  });

  block.replaceWith(section);
}
