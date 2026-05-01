import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'work-with-us', 'pb-0');
  moveInstrumentation(block, section);

  // Block Title
  const [blockTitleRow] = children; // Fixed: Use destructuring for blockTitleRow
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(blockTitleRow, sectionHeader);

  const h2 = document.createElement('h2');
  h2.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  h2.textContent = blockTitleRow.children[0]?.textContent.trim() || '';
  sectionHeader.append(h2);
  section.append(sectionHeader);

  // Slides
  const slidesWrapper = document.createElement('div');
  slidesWrapper.classList.add('position-relative', 'aos-init', 'aos-animate');
  const container = document.createElement('div');
  container.classList.add('container');
  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');

  const slideRows = children.slice(1); // All rows after the block title are slides

  slideRows.forEach((row) => {
    const [
      desktopImageCell,
      mobileImage576Cell,
      mobileImage799Cell,
      slideTitleCell,
      slideDescriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');
    moveInstrumentation(row, slideDiv);

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const picture = document.createElement('picture');

    // Mobile Image (max-width: 576px)
    const mobileImage576 = mobileImage576Cell?.querySelector('img');
    if (mobileImage576) {
      const source576 = document.createElement('source');
      source576.media = '(max-width: 576px)';
      source576.srcset = mobileImage576.src;
      picture.append(source576);
    }

    // Mobile Image (max-width: 799px)
    const mobileImage799 = mobileImage799Cell?.querySelector('img');
    if (mobileImage799) {
      const source799 = document.createElement('source');
      source799.media = '(max-width: 799px)';
      source799.srcset = mobileImage799.src;
      picture.append(source779);
    }

    // Desktop Image
    const desktopImage = desktopImageCell?.querySelector('img');
    if (desktopImage) {
      // Fixed: createOptimizedPicture returns the <picture> element directly.
      // No need to query for 'source' and 'img' children.
      const optimizedPicture = createOptimizedPicture(desktopImage.src, desktopImage.alt, false, [{ width: '750' }]);
      optimizedPicture.querySelector('img').classList.add('img-fluid');
      picture.append(...optimizedPicture.children); // Append all children (source and img)
    }

    imageWrap.append(picture);
    wrapDiv.append(imageWrap);

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const slideTitle = document.createElement('h3');
    slideTitle.classList.add('heading', 'font-regular');
    slideTitle.textContent = slideTitleCell?.textContent.trim() || '';
    contentSectionHeader.append(slideTitle);

    const slideDescription = document.createElement('div'); // Fixed: Use div for richtext to avoid <p> inside <p>
    slideDescription.classList.add('text-size-body');
    slideDescription.innerHTML = slideDescriptionCell?.innerHTML || '';
    contentSectionHeader.append(slideDescription);

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
    const ctaAnchor = ctaLinkCell?.querySelector('a');
    if (ctaAnchor) {
      ctaLink.href = ctaAnchor.href;
    }
    ctaLink.textContent = ctaLabelCell?.textContent.trim() || '';
    contentSectionHeader.append(ctaLink);

    contentWrap.append(contentSectionHeader);
    wrapDiv.append(contentWrap);
    slideDiv.append(wrapDiv);
    gridLayout.append(slideDiv);
  });

  container.append(gridLayout);
  slidesWrapper.append(container);
  section.append(slidesWrapper);

  block.replaceChildren(section);

  // Removed redundant createOptimizedPicture call here.
  // Images are already optimized and added to the picture element within the loop.
  // The original loop was replacing the picture element with a new one,
  // potentially losing instrumentation or causing issues.
}
