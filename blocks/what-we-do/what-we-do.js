import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [headingRow, descriptionRow, ...businessVerticalRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  section.append(containerDiv);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);
  moveInstrumentation(descriptionRow, sectionHeader);
  containerDiv.append(sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  const [headingCell] = [...headingRow.children]; // Fixed: Destructuring
  heading.textContent = headingCell?.textContent.trim() || '';
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  const [descriptionCell] = [...descriptionRow.children]; // Fixed: Destructuring
  description.innerHTML = descriptionCell?.innerHTML || ''; // Fixed: Use innerHTML for richtext
  sectionHeader.append(description);

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

  // Mobile view
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  ourBusinessVerticals.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider'); // Removed flickity-enabled, is-draggable - Flickity adds these
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileContainer.append(mobileSlider);

  const flickityViewport = document.createElement('div');
  flickityViewport.classList.add('flickity-viewport');
  mobileSlider.append(flickityViewport);

  const flickitySlider = document.createElement('div');
  flickitySlider.classList.add('flickity-slider');
  flickityViewport.append(flickitySlider);

  const flickityPageDots = document.createElement('ol');
  flickityPageDots.classList.add('flickity-page-dots');
  mobileSlider.append(flickityPageDots);

  let mobileSlideIndex = 0;
  let currentMobileSlide = null;
  let currentMobileRow = null;

  businessVerticalRows.forEach((row, index) => {
    const [desktopImageCell, mobileImageCell, titleCell, arrowIconCell, linkCell] = [...row.children];

    // Desktop item
    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col', 'aos-init', 'aos-animate');
    desktopCol.setAttribute('data-aos', 'fade-up');
    desktopCol.setAttribute('data-aos-delay', (100 + (index % 3) * 300).toString()); // Simple delay logic
    moveInstrumentation(row, desktopCol);

    const desktopWrap = document.createElement('div');
    desktopWrap.classList.add('wrap');
    desktopCol.append(desktopWrap);

    const desktopImageDiv = document.createElement('div');
    desktopImageDiv.classList.add('image');
    if (desktopImageCell) {
      const picture = desktopImageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
          optimizedPic.querySelector('img').classList.add('img-fluid');
          desktopImageDiv.append(optimizedPic);
        }
      }
    }
    desktopWrap.append(desktopImageDiv);

    const desktopTitleDiv = document.createElement('div');
    desktopTitleDiv.classList.add('title');
    desktopTitleDiv.textContent = titleCell?.textContent.trim() || '';
    if (arrowIconCell) {
      const arrowPicture = arrowIconCell.querySelector('picture');
      if (arrowPicture) {
        const arrowImg = arrowPicture.querySelector('img');
        if (arrowImg) {
          const optimizedArrow = createOptimizedPicture(arrowImg.src, arrowImg.alt, false, [{ width: '10' }]);
          optimizedArrow.querySelector('img').setAttribute('width', '10');
          optimizedArrow.querySelector('img').setAttribute('height', '29');
          desktopTitleDiv.append(optimizedArrow);
        }
      }
    }
    desktopWrap.append(desktopTitleDiv);

    const desktopLink = document.createElement('a');
    desktopLink.classList.add('stretched-link');
    desktopLink.href = linkCell?.querySelector('a')?.href || '#';
    desktopLink.setAttribute('aria-label', `Learn more about ${titleCell?.textContent.trim() || 'Business Vertical'}`);
    desktopWrap.append(desktopLink);
    desktopRow.append(desktopCol);

    // Mobile item (grouped 3 per slide)
    if (index % 3 === 0) {
      mobileSlideIndex += 1;
      currentMobileSlide = document.createElement('div');
      currentMobileSlide.classList.add('slides');
      if (mobileSlideIndex === 1) {
        currentMobileSlide.classList.add('is-selected');
        flickityPageDots.innerHTML = ''; // Clear existing dots for the first slide
      }
      flickitySlider.append(currentMobileSlide);

      const dot = document.createElement('li');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', `Page dot ${mobileSlideIndex}`);
      if (mobileSlideIndex === 1) {
        dot.classList.add('is-selected');
        dot.setAttribute('aria-current', 'step');
      }
      flickityPageDots.append(dot);

      currentMobileRow = document.createElement('div');
      currentMobileRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentMobileSlide.append(currentMobileRow);
    }

    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    moveInstrumentation(row, mobileCol); // Move instrumentation for mobile item
    currentMobileRow.append(mobileCol);

    const mobileWrap = document.createElement('div');
    mobileWrap.classList.add('wrap');
    mobileCol.append(mobileWrap);

    const mobileImageDiv = document.createElement('div');
    mobileImageDiv.classList.add('image');
    if (mobileImageCell) {
      const picture = mobileImageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
          optimizedPic.querySelector('img').classList.add('img-fluid');
          mobileImageDiv.append(optimizedPic);
        }
      }
    }
    mobileWrap.append(mobileImageDiv);

    const mobileTitleDiv = document.createElement('div');
    mobileTitleDiv.classList.add('title');
    mobileTitleDiv.textContent = titleCell?.textContent.trim() || '';
    if (arrowIconCell) {
      const arrowPicture = arrowIconCell.querySelector('picture');
      if (arrowPicture) {
        const arrowImg = arrowPicture.querySelector('img');
        if (arrowImg) {
          const optimizedArrow = createOptimizedPicture(arrowImg.src, arrowImg.alt, false, [{ width: '10' }]);
          optimizedArrow.querySelector('img').setAttribute('width', '10');
          optimizedArrow.querySelector('img').setAttribute('height', '29');
          mobileTitleDiv.append(optimizedArrow);
        }
      }
    }
    mobileWrap.append(mobileTitleDiv);

    const mobileLink = document.createElement('a');
    mobileLink.classList.add('stretched-link');
    mobileLink.href = linkCell?.querySelector('a')?.href || '#';
    mobileLink.setAttribute('aria-label', `Learn more about ${titleCell?.textContent.trim() || 'Business Vertical'}`);
    mobileWrap.append(mobileLink);
  });

  // Optimize all pictures in the block
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(section);

  // Flickity.js initialization
  await loadCSS('/libs/flickity/flickity.min.css'); // Assuming Flickity CSS is available
  await loadScript('/libs/flickity/flickity.pkgd.min.js'); // Assuming Flickity JS is available

  // eslint-disable-next-line no-undef
  if (typeof Flickity !== 'undefined') {
    // eslint-disable-next-line no-new, no-undef
    new Flickity(mobileSlider, {
      wrapAround: mobileSlider.dataset.flickity.includes('"wrapAround": true'),
      lazyLoad: mobileSlider.dataset.flickity.includes('"lazyLoad": true'),
      pageDots: mobileSlider.dataset.flickity.includes('"pageDots": true'),
      prevNextButtons: mobileSlider.dataset.flickity.includes('"prevNextButtons": true'),
      imagesLoaded: mobileSlider.dataset.flickity.includes('"imagesLoaded": true'),
      cellAlign: 'left',
      adaptiveHeight: mobileSlider.dataset.flickity.includes('"adaptiveHeight": true'),
    });
  }
}
