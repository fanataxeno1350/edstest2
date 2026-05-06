import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];
  const [headingRow, descriptionRow, ...businessVerticalRows] = children;

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  container.append(sectionHeader);

  if (headingRow) {
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    moveInstrumentation(headingRow, heading);
    heading.textContent = headingRow.children[0]?.textContent.trim() || '';
    sectionHeader.append(heading);
  }

  if (descriptionRow) {
    const description = document.createElement('p');
    description.classList.add('aos-init', 'aos-animate');
    moveInstrumentation(descriptionRow, description);
    description.innerHTML = descriptionRow.children[0]?.innerHTML || '';
    sectionHeader.append(description);
  }

  // Our Business Verticals
  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');
  section.append(ourBusinessVerticals);

  // Desktop view
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  ourBusinessVerticals.append(desktopContainer);

  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');
  desktopContainer.append(desktopRow);

  // Mobile view (Flickity Carousel)
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  mobileContainer.setAttribute('data-aos', 'fade-up');
  mobileContainer.setAttribute('data-aos-offset', '100');
  mobileContainer.setAttribute('data-aos-duration', '650');
  mobileContainer.setAttribute('data-aos-easing', 'ease-in-out');
  ourBusinessVerticals.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider', 'flickity-enabled', 'is-draggable');
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileSlider.setAttribute('tabindex', '0');
  mobileContainer.append(mobileSlider);

  const flickityViewport = document.createElement('div');
  flickityViewport.classList.add('flickity-viewport');
  mobileSlider.append(flickityViewport);

  const flickitySlider = document.createElement('div');
  flickitySlider.classList.add('flickity-slider');
  flickityViewport.append(flickitySlider);

  const mobileSlides = [];
  const itemsPerSlide = 3;
  let currentSlide = null;
  let currentRow = null;

  businessVerticalRows.forEach((row, index) => {
    const [imageDesktopCell, imageMobileCell, titleCell, arrowIconCell, linkCell] = [...row.children];

    // Desktop Item
    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col', 'aos-init', 'aos-animate');
    desktopCol.setAttribute('data-aos', 'fade-up');
    desktopCol.setAttribute('data-aos-delay', `${(index % 3) * 300 + 100}`); // Stagger delay
    desktopRow.append(desktopCol);

    const desktopWrap = document.createElement('div');
    desktopWrap.classList.add('wrap');
    desktopCol.append(desktopWrap);

    const desktopImageDiv = document.createElement('div');
    desktopImageDiv.classList.add('image');
    desktopWrap.append(desktopImageDiv);

    if (imageDesktopCell) {
      const picture = imageDesktopCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { width: '376' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        desktopImageDiv.append(optimizedPic);
      }
    }

    const desktopTitleDiv = document.createElement('div');
    desktopTitleDiv.classList.add('title');
    desktopTitleDiv.textContent = titleCell?.textContent.trim() || '';
    desktopWrap.append(desktopTitleDiv);

    if (arrowIconCell) {
      const arrowIcon = arrowIconCell.querySelector('picture');
      if (arrowIcon) {
        const img = arrowIcon.querySelector('img');
        const optimizedArrow = createOptimizedPicture(img.src, img.alt, false, [{ width: '10' }]);
        moveInstrumentation(img, optimizedArrow.querySelector('img'));
        desktopTitleDiv.append(optimizedArrow);
      }
    }

    const desktopLink = document.createElement('a');
    desktopLink.classList.add('stretched-link');
    desktopLink.href = linkCell?.querySelector('a')?.href || '#';
    desktopLink.setAttribute('aria-label', `Learn more about ${titleCell?.textContent.trim() || ''}`);
    moveInstrumentation(row, desktopLink); // Move instrumentation from original row to the link
    desktopWrap.append(desktopLink);

    // Mobile Item (for Flickity carousel)
    if (index % itemsPerSlide === 0) {
      currentSlide = document.createElement('div');
      currentSlide.classList.add('slides');
      if (index === 0) currentSlide.classList.add('is-selected');
      mobileSlides.push(currentSlide);

      currentRow = document.createElement('div');
      currentRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentSlide.append(currentRow);
    }

    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    currentRow.append(mobileCol);

    const mobileWrap = document.createElement('div');
    mobileWrap.classList.add('wrap');
    mobileCol.append(mobileWrap);

    const mobileImageDiv = document.createElement('div');
    mobileImageDiv.classList.add('image');
    mobileWrap.append(mobileImageDiv);

    if (imageMobileCell) {
      const picture = imageMobileCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        mobileImageDiv.append(optimizedPic);
      }
    }

    const mobileTitleDiv = document.createElement('div');
    mobileTitleDiv.classList.add('title');
    mobileTitleDiv.textContent = titleCell?.textContent.trim() || '';
    mobileWrap.append(mobileTitleDiv);

    if (arrowIconCell) {
      const arrowIcon = arrowIconCell.querySelector('picture');
      if (arrowIcon) {
        const img = arrowIcon.querySelector('img');
        const optimizedArrow = createOptimizedPicture(img.src, img.alt, false, [{ width: '10' }]);
        moveInstrumentation(img, optimizedArrow.querySelector('img'));
        mobileTitleDiv.append(optimizedArrow);
      }
    }

    const mobileLink = document.createElement('a');
    mobileLink.classList.add('stretched-link');
    mobileLink.href = linkCell?.querySelector('a')?.href || '#';
    mobileLink.setAttribute('aria-label', `Learn more about ${titleCell?.textContent.trim() || ''}`);
    mobileWrap.append(mobileLink);
  });

  mobileSlides.forEach((slide) => flickitySlider.append(slide));

  // Flickity initialization
  await loadCSS('https://unpkg.com/flickity@2/dist/flickity.min.css');
  await loadScript('https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js');

  // eslint-disable-next-line no-undef
  if (typeof Flickity !== 'undefined') {
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

  block.replaceChildren(section);

  // Image optimization for all pictures in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
