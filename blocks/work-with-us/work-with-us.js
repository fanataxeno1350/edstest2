import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'work-with-us', 'pb-0');
  // The block already has 'work-with-us' class. Adding it to an inner wrapper is a double-padding issue.
  // However, in this case, the 'section' element is replacing the block, so it's correct.
  moveInstrumentation(block, section); // Move instrumentation from block to new section

  // Section Header
  const [sectionTitleRow, ...slideRows] = children; // Destructure root rows

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(sectionTitleRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = sectionTitleRow.children[0]?.textContent.trim() || ''; // Access cell content
  sectionHeader.append(heading);
  section.append(sectionHeader);

  // Slides Container
  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const gridLayoutDiv = document.createElement('div');
  gridLayoutDiv.classList.add('grid-layout');

  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('slides');

  slideRows.forEach((row) => { // Iterate over slideRows
    const [
      imageMobile576Cell,
      imageMobile799Cell,
      imageDesktopCell,
      titleCell,
      descriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children]; // Correct: named destructuring for fixed schema

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');
    moveInstrumentation(row, wrapDiv); // Move instrumentation from row to new wrapDiv

    // Image Wrap
    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const picture = document.createElement('picture');

    const imgMobile576 = imageMobile576Cell.querySelector('img');
    if (imgMobile576) {
      const sourceMobile576 = document.createElement('source');
      sourceMobile576.media = '(max-width: 576px)';
      sourceMobile576.srcset = imgMobile576.src;
      picture.append(sourceMobile576);
    }

    const imgMobile799 = imageMobile799Cell.querySelector('img');
    if (imgMobile799) {
      const sourceMobile799 = document.createElement('source');
      sourceMobile799.media = '(max-width: 799px)';
      sourceMobile799.srcset = imgMobile799.src;
      picture.append(sourceMobile799);
    }

    const imgDesktop = imageDesktopCell.querySelector('img');
    if (imgDesktop) {
      // createOptimizedPicture returns a <picture> element, not just an <img>.
      // We need to append the <img> from the optimized picture.
      const optimizedPictureElement = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPictureElement.querySelector('img');
      if (optimizedImg) {
        optimizedImg.classList.add('img-fluid');
        picture.append(optimizedImg);
      }
    }

    if (picture.children.length > 0) {
      imageWrap.append(picture);
      wrapDiv.append(imageWrap);
    }

    // Content Wrap
    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const contentHeader = document.createElement('div');
    contentHeader.classList.add('section-header');

    const slideTitle = document.createElement('h3');
    slideTitle.classList.add('heading', 'font-regular');
    slideTitle.textContent = titleCell?.textContent.trim() || '';
    contentHeader.append(slideTitle);

    const description = document.createElement('p'); // Correct: description is richtext, but original HTML uses <p>
    description.classList.add('text-size-body');
    description.innerHTML = descriptionCell?.innerHTML || ''; // Correct: richtext uses innerHTML
    contentHeader.append(description);

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
    const ctaAnchor = ctaLinkCell.querySelector('a');
    if (ctaAnchor) {
      ctaLink.href = ctaAnchor.href; // Correct: aem-content reads href
    }
    ctaLink.textContent = ctaLabelCell?.textContent.trim() || '';
    contentHeader.append(ctaLink);

    contentWrap.append(contentHeader);
    wrapDiv.append(contentWrap);
    slidesContainer.append(wrapDiv);
  });

  gridLayoutDiv.append(slidesContainer);
  containerDiv.append(gridLayoutDiv);
  positionRelativeDiv.append(containerDiv);
  section.append(positionRelativeDiv);

  block.replaceChildren(section);

  // The final image optimization loop is redundant and incorrect.
  // createOptimizedPicture should be called once when the image is first processed.
  // Removing this loop.
}
