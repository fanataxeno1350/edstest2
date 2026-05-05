import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'work-with-us', 'pb-0');
  moveInstrumentation(block, section);

  // Destructure the first row for the section heading
  const [sectionHeadingRow] = children;
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(sectionHeadingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // Access the cell content correctly
  heading.textContent = sectionHeadingRow.children[0]?.textContent.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');

  const container = document.createElement('div');
  container.classList.add('container');
  positionRelativeDiv.append(container);

  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');
  container.append(gridLayout);

  const slideRows = children.slice(1);

  slideRows.forEach((row) => {
    const [
      imageDesktopCell,
      imageMobile576Cell,
      imageMobile799Cell,
      headingCell,
      descriptionCell,
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

    // Mobile 576px source
    const mobile576Picture = imageMobile576Cell.querySelector('picture');
    if (mobile576Picture) {
      const mobile576Img = mobile576Picture.querySelector('img');
      if (mobile576Img) {
        const source576 = document.createElement('source');
        source576.media = '(max-width: 576px)';
        source576.srcset = mobile576Img.src; // Use img.src for srcset
        picture.append(source576);
      }
    }

    // Mobile 799px source
    const mobile799Picture = imageMobile799Cell.querySelector('picture');
    if (mobile799Picture) {
      const mobile799Img = mobile799Picture.querySelector('img');
      if (mobile799Img) {
        const source799 = document.createElement('source');
        source799.media = '(max-width: 799px)';
        source799.srcset = mobile799Img.src; // Use img.src for srcset
        picture.append(source799);
      }
    }

    // Desktop image
    const desktopPicture = imageDesktopCell.querySelector('picture');
    if (desktopPicture) {
      const desktopImg = desktopPicture.querySelector('img');
      if (desktopImg) {
        // createOptimizedPicture returns a <picture> element, so we need to append its children
        const optimizedDesktopPicture = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
        // Move instrumentation from the original img to the new optimized img
        moveInstrumentation(desktopImg, optimizedDesktopPicture.querySelector('img'));
        // Append all children of the optimized picture to our new picture element
        while (optimizedDesktopPicture.firstChild) {
          picture.append(optimizedDesktopPicture.firstChild);
        }
      }
    }
    imageWrap.append(picture);
    wrapDiv.append(imageWrap);

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const slideHeading = document.createElement('h3');
    slideHeading.classList.add('heading', 'font-regular');
    slideHeading.textContent = headingCell.textContent.trim();
    contentSectionHeader.append(slideHeading);

    const description = document.createElement('p');
    description.classList.add('text-size-body');
    description.innerHTML = descriptionCell.innerHTML;
    contentSectionHeader.append(description);

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
    const foundCtaLink = ctaLinkCell.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
    }
    ctaLink.textContent = ctaLabelCell.textContent.trim();
    contentSectionHeader.append(ctaLink);

    contentWrap.append(contentSectionHeader);
    wrapDiv.append(contentWrap);
    slideDiv.append(wrapDiv);
    gridLayout.append(slideDiv);
  });

  section.append(positionRelativeDiv);
  block.replaceChildren(section);

  // Removed the redundant createOptimizedPicture loop at the end.
  // Image optimization is handled within the slideRows.forEach loop.
}
