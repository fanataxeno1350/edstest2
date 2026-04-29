import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [sectionHeadingRow, ...slideRows] = [...block.children];

  const rootDiv = document.createElement('div');
  rootDiv.classList.add('position-relative', 'aos-init', 'aos-animate');
  rootDiv.setAttribute('data-aos', 'fade-up');
  rootDiv.setAttribute('data-aos-offset', '100');
  rootDiv.setAttribute('data-aos-duration', '650');
  rootDiv.setAttribute('data-aos-easing', 'ease-in-out');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  rootDiv.append(containerDiv);

  const gridLayoutDiv = document.createElement('div');
  gridLayoutDiv.classList.add('grid-layout');
  containerDiv.append(gridLayoutDiv);

  const slidesDiv = document.createElement('div');
  slidesDiv.classList.add('slides');
  gridLayoutDiv.append(slidesDiv);

  const sectionHeaderDiv = document.createElement('div');
  sectionHeaderDiv.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  moveInstrumentation(sectionHeadingRow, heading);
  heading.textContent = sectionHeadingRow.textContent.trim();
  sectionHeaderDiv.append(heading);

  slideRows.forEach((row) => {
    const [
      imageMobileXSCell,
      imageMobileCell,
      imageDesktopCell,
      headingCell,
      descriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');
    moveInstrumentation(row, wrapDiv);

    const imageWrapDiv = document.createElement('div');
    imageWrapDiv.classList.add('image-wrap');

    const picture = document.createElement('picture');
    const imgMobileXS = imageMobileXSCell.querySelector('picture > img');
    const imgMobile = imageMobileCell.querySelector('picture > img');
    const imgDesktop = imageDesktopCell.querySelector('picture > img');

    if (imgMobileXS) {
      const sourceXS = document.createElement('source');
      sourceXS.setAttribute('media', '(max-width: 576px)');
      sourceXS.setAttribute('srcset', imgMobileXS.src);
      picture.append(sourceXS);
    }

    if (imgMobile) {
      const sourceMobile = document.createElement('source');
      sourceMobile.setAttribute('media', '(max-width: 799px)');
      sourceMobile.setAttribute('srcset', imgMobile.src);
      picture.append(sourceMobile);
    }

    if (imgDesktop) {
      const sourceDesktop = document.createElement('source');
      sourceDesktop.setAttribute('media', '(min-width: 800px)');
      sourceDesktop.setAttribute('srcset', imgDesktop.src);
      picture.append(sourceDesktop);

      // Corrected createOptimizedPicture usage
      const optimizedPicture = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
      const img = optimizedPicture.querySelector('img');
      if (img) {
        img.classList.add('img-fluid');
        img.setAttribute('loading', 'lazy');
        img.setAttribute('title', imgDesktop.alt);
        picture.append(img); // Append the img element directly
      }
    }

    if (picture.children.length > 0) {
      imageWrapDiv.append(picture);
      wrapDiv.append(imageWrapDiv);
    }

    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');

    const slideSectionHeaderDiv = document.createElement('div');
    slideSectionHeaderDiv.classList.add('section-header');

    const slideHeading = document.createElement('h3');
    slideHeading.classList.add('heading', 'font-regular');
    slideHeading.textContent = headingCell.textContent.trim();
    slideSectionHeaderDiv.append(slideHeading);

    const descriptionP = document.createElement('p');
    descriptionP.classList.add('text-size-body');
    descriptionP.innerHTML = descriptionCell.innerHTML;
    slideSectionHeaderDiv.append(descriptionP);

    const ctaLink = document.createElement('a');
    const foundCtaLink = ctaLinkCell.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
    }
    ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
    ctaLink.textContent = ctaLabelCell.textContent.trim();
    slideSectionHeaderDiv.append(ctaLink);

    contentWrapDiv.append(slideSectionHeaderDiv);
    wrapDiv.append(contentWrapDiv);
    slidesDiv.append(wrapDiv);
  });

  block.replaceChildren(sectionHeaderDiv, rootDiv);
}
