import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');

  const container = document.createElement('div');
  container.classList.add('container');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  // Destructure the first two rows for heading and description
  const [headingRow, descriptionRow, ...businessVerticalRows] = children;

  moveInstrumentation(headingRow, sectionHeader);
  moveInstrumentation(descriptionRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  // Description is richtext, use div and innerHTML
  const description = document.createElement('div'); // Changed from p to div for richtext
  description.classList.add('aos-init', 'aos-animate'); // Added classes from original HTML
  description.innerHTML = descriptionRow.children[0]?.innerHTML || ''; // Access cell content
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
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider');
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileSlider.setAttribute('tabindex', '0');

  const flickityViewport = document.createElement('div');
  flickityViewport.classList.add('flickity-viewport');
  const flickitySlider = document.createElement('div');
  flickitySlider.classList.add('flickity-slider');
  flickityViewport.append(flickitySlider);
  mobileSlider.append(flickityViewport);

  const mobileSlides = [];
  let currentMobileSlide = document.createElement('div');
  currentMobileSlide.classList.add('slides');
  let mobileSlideRow = document.createElement('div'); // Declared with let for re-assignment
  mobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
  currentMobileSlide.append(mobileSlideRow);
  mobileSlides.push(currentMobileSlide);

  businessVerticalRows.forEach((row, index) => {
    // Destructure cells for fixed schema
    const [desktopImageCell, tabletImageCell, titleCell, arrowIconCell, linkCell] = [...row.children];

    // Desktop item
    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col', 'aos-init', 'aos-animate');
    desktopCol.setAttribute('data-aos', 'fade-up');
    desktopCol.setAttribute('data-aos-delay', `${100 + (index % 3) * 300}`);

    const desktopWrap = document.createElement('div');
    desktopWrap.classList.add('wrap');

    const desktopImageDiv = document.createElement('div');
    desktopImageDiv.classList.add('image');
    const desktopPicture = desktopImageCell.querySelector('picture');
    if (desktopPicture) {
      const img = desktopPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
      moveInstrumentation(desktopPicture, optimizedPic.querySelector('img'));
      desktopImageDiv.append(optimizedPic);
    }
    desktopWrap.append(desktopImageDiv);

    const desktopTitleDiv = document.createElement('div');
    desktopTitleDiv.classList.add('title');
    desktopTitleDiv.textContent = titleCell.textContent.trim();
    const arrowIcon = arrowIconCell.querySelector('picture');
    if (arrowIcon) {
      const arrowImg = arrowIcon.querySelector('img');
      const optimizedArrow = createOptimizedPicture(arrowImg.src, arrowImg.alt, false, [{ width: '10' }]);
      moveInstrumentation(arrowIcon, optimizedArrow.querySelector('img'));
      desktopTitleDiv.append(optimizedArrow);
    }
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
    desktopCol.append(desktopWrap);
    desktopRow.append(desktopCol);

    // Mobile item
    // Check if the current mobile slide row is full (3 items)
    if (mobileSlideRow.children.length === 3) {
      currentMobileSlide = document.createElement('div');
      currentMobileSlide.classList.add('slides');
      mobileSlideRow = document.createElement('div'); // Re-initialize mobileSlideRow
      mobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentMobileSlide.append(mobileSlideRow);
      mobileSlides.push(currentMobileSlide);
    }

    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    const mobileWrap = document.createElement('div');
    mobileWrap.classList.add('wrap');

    const mobileImageDiv = document.createElement('div');
    mobileImageDiv.classList.add('image');
    const mobilePicture = tabletImageCell.querySelector('picture');
    if (mobilePicture) {
      const img = mobilePicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
      moveInstrumentation(mobilePicture, optimizedPic.querySelector('img'));
      mobileImageDiv.append(optimizedPic);
    }
    mobileWrap.append(mobileImageDiv);

    const mobileTitleDiv = document.createElement('div');
    mobileTitleDiv.classList.add('title');
    mobileTitleDiv.textContent = titleCell.textContent.trim();
    if (arrowIcon) {
      const arrowImg = arrowIcon.querySelector('img');
      const optimizedArrow = createOptimizedPicture(arrowImg.src, arrowImg.alt, false, [{ width: '10' }]);
      mobileTitleDiv.append(optimizedArrow);
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
    mobileSlideRow.append(mobileCol);
  });

  desktopContainer.append(desktopRow);
  ourBusinessVerticals.append(desktopContainer);

  mobileSlides.forEach((slide) => flickitySlider.append(slide));
  mobileContainer.append(mobileSlider);
  ourBusinessVerticals.append(mobileContainer);

  section.append(ourBusinessVerticals);
  block.replaceChildren(section);

  // Initialize Flickity for mobile slider
  if (mobileSlider && mobileSlides.length > 0) {
    await loadCSS('https://unpkg.com/flickity@2/dist/flickity.min.css');
    await loadScript('https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js');
    // eslint-disable-next-line no-undef
    const flkty = new Flickity(mobileSlider, {
      wrapAround: false,
      lazyLoad: true,
      pageDots: false, // Flickity will create its own, or we create custom ones
      prevNextButtons: false,
      imagesLoaded: true,
      cellAlign: 'left',
      adaptiveHeight: true,
    });

    // Custom page dots creation and event listeners
    const pageDotsContainer = document.createElement('ol');
    pageDotsContainer.classList.add('flickity-page-dots');
    for (let i = 0; i < flkty.cells.length; i += 1) { // Use flkty.cells.length for correct dot count
      const dot = document.createElement('li');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', `Page dot ${i + 1}`);
      if (i === flkty.selectedIndex) {
        dot.classList.add('is-selected');
        dot.setAttribute('aria-current', 'step');
      }
      dot.addEventListener('click', () => flkty.select(i));
      pageDotsContainer.append(dot);
    }
    mobileSlider.append(pageDotsContainer);

    flkty.on('select', (index) => {
      [...pageDotsContainer.children].forEach((dot, i) => {
        if (i === index) {
          dot.classList.add('is-selected');
          dot.setAttribute('aria-current', 'step');
        } else {
          dot.classList.remove('is-selected');
          dot.removeAttribute('aria-current');
        }
      });
    });
  }

  // This part seems to be a generic picture optimization that might be better in aem.js or a separate utility.
  // For now, keeping it as is, but noting it's not directly related to the block's core structure.
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
