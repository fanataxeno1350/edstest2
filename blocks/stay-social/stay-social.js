import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('stay-social', 'pt-14', 'py-lg-11', 'bg-cream-300');

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');
  section.append(container);

  // Root fields: title, subtext, cta-label, cta-link, followed by item rows
  // The BlockJson model defines 5 root fields: title, subtext, cards (container), cta-label, cta-link.
  // The EDS block structure shows:
  // children[0]: title
  // children[1]: subtext
  // children[2]: cta-label
  // children[3]: cta-link
  // children[4+]: item rows

  // Title
  const titleRow = children.find((row, index) => index === 0 && row.firstElementChild && !row.firstElementChild.querySelector('a') && !row.firstElementChild.querySelector('picture'));
  if (titleRow) {
    const titleCell = titleRow.firstElementChild;
    const title = document.createElement('h2');
    title.classList.add('stay-social__title', 'font-24', 'leading-34', 'text-dark-gray-100', 'font-baskerville', 'font-sm-40', 'text-center', 'fw-bold');
    title.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleRow, title);
    container.append(title);
  }

  // Subtext
  const subtextRow = children.find((row, index) => index === 1 && row.firstElementChild && !row.firstElementChild.querySelector('a') && !row.firstElementChild.querySelector('picture'));
  if (subtextRow) {
    const subtextCell = subtextRow.firstElementChild;
    const subtext = document.createElement('h3');
    subtext.classList.add('stay-social__subtext', 'font-16', 'leading-24', 'text-dark-gray-100', 'font-sm-18', 'text-center', 'fw-medium', 'mt-4');
    subtext.textContent = subtextCell.textContent.trim();
    moveInstrumentation(subtextRow, subtext);
    container.append(subtext);
  }

  const mainDiv = document.createElement('div');
  mainDiv.classList.add('stay-social__main', 'mt-8');
  container.append(mainDiv);

  const cardsList = document.createElement('ul');
  cardsList.classList.add('stay-social__cards', 'd-grid', 'gap-5', 'gap-sm-8', 'w-fit', 'mx-auto');
  mainDiv.append(cardsList);

  // CTA Label and Link are before item rows in the block structure
  const ctaLabelRow = children.find((row, index) => index === 2 && row.firstElementChild && !row.firstElementChild.querySelector('a') && !row.firstElementChild.querySelector('picture'));
  const ctaLinkRow = children.find((row, index) => index === 3 && row.firstElementChild && row.firstElementChild.querySelector('a'));

  // Social Cards (item rows start from index 4)
  const itemRows = children.slice(4);

  itemRows.forEach((row) => {
    const [imageCell, linkCell] = [...row.children]; // Destructuring is safe here as per EDS structure for item rows

    const li = document.createElement('li');
    li.classList.add('stay-social__card', 'overflow-hidden', 'ratio-1x1', 'ratio'); // Default to 1x1, adjust if needed by content

    const cardLink = document.createElement('a');
    cardLink.classList.add('stay-social__card--link', 'd-block', 'w-100', 'h-100');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // Assuming external links from original HTML
    }
    moveInstrumentation(linkCell, cardLink);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('stay-social__card--image', 'w-100', 'h-100', 'object-fit-cover');
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardLink.append(optimizedPic);
      }
    }
    moveInstrumentation(imageCell, cardLink);

    const screenReaderSpan = document.createElement('span');
    screenReaderSpan.classList.add('cmp-link__screen-reader-only');
    screenReaderSpan.textContent = 'opens in a new tab';
    cardLink.append(screenReaderSpan);

    li.append(cardLink);
    cardsList.append(li);
  });

  // CTA Button
  const ctaWrapper = document.createElement('div');
  ctaWrapper.classList.add('d-flex', 'align-items-center', 'justify-content-center', 'mt-8', 'mt-lg-10');
  section.append(ctaWrapper);

  const ctaLink = document.createElement('a');
  ctaLink.classList.add('svasti-cta', 'w-fit', 'text-decoration-none', 'd-flex', 'align-items-center',
    'primary', 'px-8', 'pb-3', 'text-cream-100', 'border', 'border-2', 'border-red-100',
    'border-maroon-100-hover', 'border-red-300-active', 'bg-red-100', 'bg-maroon-100-hover', 'bg-red-300-active');

  if (ctaLinkRow) {
    const foundCtaLink = ctaLinkRow.firstElementChild.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
      ctaLink.target = '_blank';
    }
    moveInstrumentation(ctaLinkRow, ctaLink);
  }


  if (ctaLabelRow) {
    const ctaLabelSpan = document.createElement('span');
    ctaLabelSpan.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
    ctaLabelSpan.textContent = ctaLabelRow.firstElementChild.textContent.trim();
    moveInstrumentation(ctaLabelRow, ctaLabelSpan);
    ctaLink.append(ctaLabelSpan);
  }


  const ctaScreenReaderSpan = document.createElement('span');
  ctaScreenReaderSpan.classList.add('cmp-link__screen-reader-only');
  ctaScreenReaderSpan.textContent = 'opens in a new tab';
  ctaLink.append(ctaScreenReaderSpan);

  ctaWrapper.append(ctaLink);

  block.innerHTML = '';
  block.append(section);
}
