import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [headingRow, descriptionRow, ...businessVerticalRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');

  const container = document.createElement('div');
  container.classList.add('container');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const description = document.createElement('p');
  moveInstrumentation(descriptionRow, description);
  description.textContent = descriptionRow.textContent.trim();
  sectionHeader.append(description);

  container.append(sectionHeader);
  section.append(container);

  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');

  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');

  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block');
  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider');
  // Flickity will add flickity-enabled is-draggable, flickity-viewport, flickity-slider
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');

  // Flickity expects slides directly inside the .flickity-slider
  const mobileFlickitySlider = document.createElement('div');
  mobileFlickitySlider.classList.add('flickity-slider'); // This class is added by Flickity, but we need the container

  const mobileSlideGroups = [];
  let currentMobileSlideGroup = document.createElement('div');
  currentMobileSlideGroup.classList.add('slides');
  let currentMobileRow = document.createElement('div');
  currentMobileRow.classList.add('row', 'row-cols-1', 'gy-3');
  currentMobileSlideGroup.append(currentMobileRow);
  mobileSlideGroups.push(currentMobileSlideGroup);

  businessVerticalRows.forEach((row, index) => {
    const [imageDesktopCell, imageTabletCell, titleCell, arrowIconCell, linkCell] = [...row.children];

    // Desktop card
    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col');
    const desktopWrap = document.createElement('div');
    desktopWrap.classList.add('wrap');

    const desktopImageDiv = document.createElement('div');
    desktopImageDiv.classList.add('image');
    const desktopPicture = imageDesktopCell.querySelector('picture');
    if (desktopPicture) {
      const img = desktopPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { width: '376' }]);
      moveInstrumentation(desktopPicture, optimizedPic.querySelector('img'));
      desktopImageDiv.append(optimizedPic);
    }
    desktopWrap.append(desktopImageDiv);

    const desktopTitleDiv = document.createElement('div');
    desktopTitleDiv.classList.add('title');
    desktopTitleDiv.textContent = titleCell.textContent.trim();
    const desktopArrowIcon = arrowIconCell.querySelector('picture');
    if (desktopArrowIcon) {
      const img = desktopArrowIcon.querySelector('img');
      const arrowImg = document.createElement('img');
      arrowImg.loading = 'lazy';
      arrowImg.src = img.src;
      arrowImg.alt = img.alt;
      arrowImg.width = '10';
      arrowImg.height = '29';
      desktopTitleDiv.append(arrowImg);
    }
    desktopWrap.append(desktopTitleDiv);

    const desktopLink = document.createElement('a');
    desktopLink.classList.add('stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      desktopLink.href = foundLink.href;
      desktopLink.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    moveInstrumentation(row, desktopLink); // Move instrumentation from the row to the link
    desktopWrap.append(desktopLink);
    desktopCol.append(desktopWrap);
    desktopRow.append(desktopCol);

    // Mobile card
    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    const mobileWrap = document.createElement('div');
    mobileWrap.classList.add('wrap');

    const mobileImageDiv = document.createElement('div');
    mobileImageDiv.classList.add('image');
    const mobilePicture = imageTabletCell.querySelector('picture');
    if (mobilePicture) {
      const img = mobilePicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
      mobileImageDiv.append(optimizedPic);
    }
    mobileWrap.append(mobileImageDiv);

    const mobileTitleDiv = document.createElement('div');
    mobileTitleDiv.classList.add('title');
    mobileTitleDiv.textContent = titleCell.textContent.trim();
    const mobileArrowIcon = arrowIconCell.querySelector('picture');
    if (mobileArrowIcon) {
      const img = mobileArrowIcon.querySelector('img');
      const arrowImg = document.createElement('img');
      arrowImg.loading = 'lazy';
      arrowImg.src = img.src;
      arrowImg.alt = img.alt;
      arrowImg.width = '10';
      arrowImg.height = '29';
      mobileTitleDiv.append(arrowImg);
    }
    mobileWrap.append(mobileTitleDiv);

    const mobileLink = document.createElement('a');
    mobileLink.classList.add('stretched-link');
    if (foundLink) {
      mobileLink.href = foundLink.href;
      mobileLink.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    mobileWrap.append(mobileLink);
    mobileCol.append(mobileWrap);

    // Add to mobile slide group
    if (currentMobileRow.children.length === 3) {
      currentMobileSlideGroup = document.createElement('div');
      currentMobileSlideGroup.classList.add('slides');
      currentMobileRow = document.createElement('div');
      currentMobileRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentMobileSlideGroup.append(currentMobileRow);
      mobileSlideGroups.push(currentMobileSlideGroup);
    }
    currentMobileRow.append(mobileCol);
  });

  desktopContainer.append(desktopRow);
  ourBusinessVerticals.append(desktopContainer);

  mobileSlideGroups.forEach((slideGroup) => {
    mobileFlickitySlider.append(slideGroup);
  });
  mobileSlider.append(mobileFlickitySlider); // Append the flickity-slider to mobileSlider
  mobileContainer.append(mobileSlider);
  ourBusinessVerticals.append(mobileContainer);

  section.append(ourBusinessVerticals);

  // Optimize images
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(section);

  // Load Flickity for mobile slider
  if (mobileSlideGroups.length > 0) {
    await loadCSS('/libs/flickity/flickity.min.css'); // Assuming Flickity CSS is available in /libs
    await loadScript('/libs/flickity/flickity.pkgd.min.js'); // Assuming Flickity JS is available in /libs

    // eslint-disable-next-line no-undef
    if (typeof Flickity === 'function') {
      // eslint-disable-next-line no-new, no-undef
      new Flickity(mobileSlider, {
        wrapAround: false,
        lazyLoad: true,
        pageDots: true,
        prevNextButtons: false,
        imagesLoaded: true,
        cellAlign: 'left',
        adaptiveHeight: true,
      });
    }
  }
}
