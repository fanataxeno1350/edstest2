import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const [headingRow, descriptionRow, ...businessVerticalRows] = children;

  block.classList.add('section');

  const container = document.createElement('div');
  container.classList.add('container');
  moveInstrumentation(headingRow, container);
  moveInstrumentation(descriptionRow, container);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.textContent = descriptionRow.textContent.trim();
  sectionHeader.append(description);

  container.append(sectionHeader);
  block.append(container);

  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');

  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  ourBusinessVerticals.append(desktopContainer);

  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');
  desktopContainer.append(desktopRow);

  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  ourBusinessVerticals.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider');
  mobileSlider.dataset.flickity = '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }';
  mobileContainer.append(mobileSlider);

  const mobileSlides = document.createElement('div');
  mobileSlides.classList.add('slides');
  mobileSlider.append(mobileSlides);

  const mobileRow = document.createElement('div');
  mobileRow.classList.add('row', 'row-cols-1', 'gy-3');
  mobileSlides.append(mobileRow);

  businessVerticalRows.forEach((row, index) => {
    const [imageCell, altTextCell, titleCell, linkCell] = [...row.children];

    // Desktop item
    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col', 'aos-init', 'aos-animate');
    desktopCol.dataset.aos = 'fade-up';
    desktopCol.dataset.aosDelay = `${100 + (index % 3) * 300}`; // Example delay logic

    const desktopWrap = document.createElement('div');
    desktopWrap.classList.add('wrap');
    desktopCol.append(desktopWrap);

    const desktopImageDiv = document.createElement('div');
    desktopImageDiv.classList.add('image');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, altTextCell.textContent.trim(), false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      desktopImageDiv.append(optimizedPic);
    }
    desktopWrap.append(desktopImageDiv);

    const desktopTitleDiv = document.createElement('div');
    desktopTitleDiv.classList.add('title');
    desktopTitleDiv.textContent = titleCell.textContent.trim();
    const arrowImg = document.createElement('img');
    arrowImg.loading = 'lazy';
    arrowImg.src = '/content/dam/aemigrate/uploaded-folder/www-mahindra-com/image/tilt-white-arrow-2e81f5.svg'; // Static SVG icon
    arrowImg.alt = altTextCell.textContent.trim();
    arrowImg.width = '10';
    arrowImg.height = '29';
    desktopTitleDiv.append(arrowImg);
    desktopWrap.append(desktopTitleDiv);

    const desktopLink = document.createElement('a');
    desktopLink.classList.add('stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      desktopLink.href = foundLink.href;
      desktopLink.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    desktopWrap.append(desktopLink);
    moveInstrumentation(row, desktopCol);
    desktopRow.append(desktopCol);

    // Mobile item
    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');

    const mobileWrap = document.createElement('div');
    mobileWrap.classList.add('wrap');
    mobileCol.append(mobileWrap);

    const mobileImageDiv = document.createElement('div');
    mobileImageDiv.classList.add('image');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, altTextCell.textContent.trim(), false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      mobileImageDiv.append(optimizedPic);
    }
    mobileWrap.append(mobileImageDiv);

    const mobileTitleDiv = document.createElement('div');
    mobileTitleDiv.classList.add('title');
    mobileTitleDiv.textContent = titleCell.textContent.trim();
    const mobileArrowImg = document.createElement('img');
    mobileArrowImg.loading = 'lazy';
    mobileArrowImg.src = '/content/dam/aemigrate/uploaded-folder/www-mahindra-com/image/tilt-white-arrow-2e81f5.svg'; // Static SVG icon
    mobileArrowImg.alt = altTextCell.textContent.trim();
    mobileArrowImg.width = '10';
    mobileArrowImg.height = '29';
    mobileTitleDiv.append(mobileArrowImg);
    mobileWrap.append(mobileTitleDiv);

    const mobileLink = document.createElement('a');
    mobileLink.classList.add('stretched-link');
    if (foundLink) {
      mobileLink.href = foundLink.href;
      mobileLink.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    mobileWrap.append(mobileLink);
    mobileRow.append(mobileCol);
  });

  block.append(ourBusinessVerticals);
}
