import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...itemRows] = [...block.children];

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const sectionHeaderDiv = document.createElement('div');
  sectionHeaderDiv.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeaderDiv);
  moveInstrumentation(descriptionRow, sectionHeaderDiv);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.textContent = headingRow.firstElementChild.textContent.trim();
  sectionHeaderDiv.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.setAttribute('data-aos', 'fade-up');
  description.setAttribute('data-aos-offset', '100');
  description.setAttribute('data-aos-duration', '650');
  description.setAttribute('data-aos-easing', 'ease-in-out');
  description.textContent = descriptionRow.firstElementChild.textContent.trim();
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
  mobileSlider.classList.add('mobile-slider', 'flickity-enabled', 'is-draggable');
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');

  const mobileFlickityViewport = document.createElement('div');
  mobileFlickityViewport.classList.add('flickity-viewport');
  const mobileFlickitySlider = document.createElement('div');
  mobileFlickitySlider.classList.add('flickity-slider');

  // Group items for mobile slider (3 items per slide)
  const mobileSlides = [];
  let currentSlide = null;
  itemRows.forEach((row, index) => {
    if (index % 3 === 0) {
      currentSlide = document.createElement('div');
      currentSlide.classList.add('slides');
      if (index === 0) currentSlide.classList.add('is-selected');
      const slideRow = document.createElement('div');
      slideRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentSlide.append(slideRow);
      mobileSlides.push(currentSlide);
    }
    const slideRow = currentSlide.querySelector('.row');
    const col = document.createElement('div');
    col.classList.add('col');
    slideRow.append(col);
    // Temporarily move row content to col for processing, will be re-parented later
    while (row.firstChild) {
      col.append(row.firstChild);
    }
  });

  itemRows.forEach((originalRow, index) => {
    // Re-read cells from the temporarily moved content within the mobileSlides structure
    // This ensures we are processing the actual content, not the original empty row
    const tempCol = mobileSlides[Math.floor(index / 3)].querySelector(`.row > .col:nth-child(${((index % 3) + 1)})`);
    const cells = [...tempCol.children];

    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const titleCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim() !== '');
    const iconCell = cells.find(cell => cell.querySelector('img') && !cell.querySelector('picture')); // Assuming icon is an img, not a picture
    const linkCell = cells.find(cell => cell.querySelector('a'));

    // Desktop item
    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col', 'aos-init', 'aos-animate');
    desktopCol.setAttribute('data-aos', 'fade-up');
    desktopCol.setAttribute('data-aos-delay', `${(index % 3) * 300 + 100}`); // Stagger delay

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');
    moveInstrumentation(originalRow, wrapDiv); // Move instrumentation from original row to the new wrapDiv

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageDiv.append(optimizedPic);
    }
    wrapDiv.append(imageDiv);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = titleCell?.textContent.trim() || '';
    const iconImg = iconCell?.querySelector('img');
    if (iconImg) {
      const newIcon = document.createElement('img');
      newIcon.src = iconImg.src;
      newIcon.alt = iconImg.alt;
      newIcon.classList.add(...iconImg.classList);
      titleDiv.append(' ', newIcon);
    }
    wrapDiv.append(titleDiv);

    const anchor = document.createElement('a');
    anchor.classList.add('stretched-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      // Use title as aria-label if available, otherwise link text
      anchor.setAttribute('aria-label', titleCell?.textContent.trim() || foundLink.textContent.trim());
    }
    wrapDiv.append(anchor);

    desktopCol.append(wrapDiv);
    desktopRow.append(desktopCol);

    // Mobile item (re-parent the content from temporary col to a new wrapDiv)
    const mobileCol = mobileSlides[Math.floor(index / 3)].querySelector(`.row > .col:nth-child(${((index % 3) + 1)})`);
    const mobileWrapDiv = document.createElement('div');
    mobileWrapDiv.classList.add('wrap');
    // Move content from the temporary col into the new mobileWrapDiv
    while (mobileCol.firstChild) {
      mobileWrapDiv.append(mobileCol.firstChild);
    }
    mobileCol.append(mobileWrapDiv);
  });

  desktopContainer.append(desktopRow);
  ourBusinessVerticalsDiv.append(desktopContainer);

  mobileSlides.forEach(slide => mobileFlickitySlider.append(slide));
  mobileFlickityViewport.append(mobileFlickitySlider);
  mobileSlider.append(mobileFlickityViewport);

  const pageDots = document.createElement('ol');
  pageDots.classList.add('flickity-page-dots');
  for (let i = 0; i < mobileSlides.length; i += 1) {
    const dot = document.createElement('li');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Page dot ${i + 1}`);
    if (i === 0) dot.classList.add('is-selected');
    pageDots.append(dot);
  }
  mobileSlider.append(pageDots);

  mobileContainer.append(mobileSlider);
  ourBusinessVerticalsDiv.append(mobileContainer);

  block.textContent = '';
  block.append(containerDiv, ourBusinessVerticalsDiv);

  // This block.querySelectorAll('picture > img') loop is redundant as createOptimizedPicture is already used
  // and the original pictures are replaced. Removing it to avoid unnecessary processing.
}
