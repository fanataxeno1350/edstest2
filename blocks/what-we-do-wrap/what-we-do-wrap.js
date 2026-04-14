import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...businessVerticalRows] = [...block.children];

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const sectionHeaderDiv = document.createElement('div');
  sectionHeaderDiv.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeaderDiv);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.querySelector('div')?.textContent.trim() || '';
  sectionHeaderDiv.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow, description);
  description.innerHTML = descriptionRow.querySelector('div')?.innerHTML || '';
  sectionHeaderDiv.append(description);

  containerDiv.append(sectionHeaderDiv);

  const ourBusinessVerticalsDiv = document.createElement('div');
  ourBusinessVerticalsDiv.classList.add('our-business-verticals');

  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');

  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  mobileContainer.setAttribute('data-aos', 'fade-up');
  mobileContainer.setAttribute('data-aos-offset', '100');
  mobileContainer.setAttribute('data-aos-duration', '650');
  mobileContainer.setAttribute('data-aos-easing', 'ease-in-out');

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider');
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileContainer.append(mobileSlider);

  let mobileSlideIndex = 0;
  let currentMobileSlide = null;
  let currentMobileSlideRow = null;

  businessVerticalRows.forEach((row, index) => {
    const cells = [...row.children];
    const imageCell = cells.find((cell) => cell.querySelector('picture'));
    const titleCell = cells.find((cell) => !cell.querySelector('picture') && !cell.querySelector('a'));
    const iconCell = cells.find((cell) => cell.querySelector('picture') && cell !== imageCell);
    const linkCell = cells.find((cell) => cell.querySelector('a'));

    // Desktop rendering
    const colDivDesktop = document.createElement('div');
    colDivDesktop.classList.add('col', 'aos-init', 'aos-animate');
    colDivDesktop.setAttribute('data-aos', 'fade-up');
    colDivDesktop.setAttribute('data-aos-delay', `${(index % 3) * 300 + 100}`);

    const wrapDivDesktop = document.createElement('div');
    wrapDivDesktop.classList.add('wrap');
    moveInstrumentation(row, wrapDivDesktop); // Move instrumentation from original row to the wrap div

    const imageDivDesktop = document.createElement('div');
    imageDivDesktop.classList.add('image');
    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageDivDesktop.append(optimizedPic);
      }
    }
    wrapDivDesktop.append(imageDivDesktop);

    const titleDivDesktop = document.createElement('div');
    titleDivDesktop.classList.add('title');
    if (titleCell) {
      titleDivDesktop.textContent = titleCell.textContent.trim();
    }
    if (iconCell) {
      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const iconImg = iconPicture.querySelector('img');
        const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '10', height: '29' }]);
        moveInstrumentation(iconImg, optimizedIcon.querySelector('img'));
        titleDivDesktop.append(optimizedIcon);
      }
    }
    wrapDivDesktop.append(titleDivDesktop);

    if (linkCell) {
      const link = document.createElement('a');
      link.classList.add('stretched-link');
      link.href = linkCell.querySelector('a')?.href || '#';
      link.setAttribute('aria-label', linkCell.querySelector('a')?.textContent.trim() || '');
      wrapDivDesktop.append(link);
    }
    colDivDesktop.append(wrapDivDesktop);
    desktopRow.append(colDivDesktop);

    // Mobile rendering (3 items per slide)
    if (index % 3 === 0) {
      currentMobileSlide = document.createElement('div');
      currentMobileSlide.classList.add('slides');
      if (mobileSlideIndex === 0) {
        currentMobileSlide.classList.add('is-selected');
      }
      mobileSlider.append(currentMobileSlide);

      currentMobileSlideRow = document.createElement('div');
      currentMobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentMobileSlide.append(currentMobileSlideRow);
      mobileSlideIndex += 1;
    }

    const colDivMobile = document.createElement('div');
    colDivMobile.classList.add('col');
    const wrapDivMobile = document.createElement('div');
    wrapDivMobile.classList.add('wrap');

    const imageDivMobile = document.createElement('div');
    imageDivMobile.classList.add('image');
    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // No need to move instrumentation for mobile as it's a new element
        imageDivMobile.append(optimizedPic);
      }
    }
    wrapDivMobile.append(imageDivMobile);

    const titleDivMobile = document.createElement('div');
    titleDivMobile.classList.add('title');
    if (titleCell) {
      titleDivMobile.textContent = titleCell.textContent.trim();
    }
    if (iconCell) {
      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const iconImg = iconPicture.querySelector('img');
        const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '10', height: '29' }]);
        titleDivMobile.append(optimizedIcon);
      }
    }
    wrapDivMobile.append(titleDivMobile);

    if (linkCell) {
      const link = document.createElement('a');
      link.classList.add('stretched-link');
      link.href = linkCell.querySelector('a')?.href || '#';
      link.setAttribute('aria-label', linkCell.querySelector('a')?.textContent.trim() || '');
      wrapDivMobile.append(link);
    }
    colDivMobile.append(wrapDivMobile);
    currentMobileSlideRow.append(colDivMobile);
  });

  desktopContainer.append(desktopRow);
  ourBusinessVerticalsDiv.append(desktopContainer, mobileContainer);

  block.textContent = '';
  block.append(containerDiv, ourBusinessVerticalsDiv);

  // Aos init and flickity init needs to be handled by the client-side script loader
  // as they are external libraries. We only add the data attributes and classes.
}
