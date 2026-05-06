import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap'); // 'what-we-do-wrap' is from original HTML, not block name

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  container.append(sectionHeader);

  // Section Heading
  const headingRow = children[0];
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  // Section Description
  const descriptionRow = children[1];
  const description = document.createElement('div'); // Use div for richtext to avoid <p> inside <p>
  moveInstrumentation(descriptionRow, description);
  description.innerHTML = descriptionRow.children[0]?.innerHTML || ''; // Read from cell, not row
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
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block');
  ourBusinessVerticals.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider');
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileContainer.append(mobileSlider);

  const businessVerticals = children.slice(2); // All remaining rows are business verticals

  businessVerticals.forEach((row, index) => {
    // Fixed schema for business-vertical-item: image, title, arrowIcon, link
    const [imageCell, titleCell, arrowIconCell, linkCell] = [...row.children];

    // Desktop item
    const colDesktop = document.createElement('div');
    colDesktop.classList.add('col');
    colDesktop.setAttribute('data-aos', 'fade-up');
    colDesktop.setAttribute('data-aos-delay', `${100 + (index % 3) * 300}`); // Example delay logic
    desktopRow.append(colDesktop);

    const wrapDesktop = document.createElement('div');
    wrapDesktop.classList.add('wrap');
    moveInstrumentation(row, wrapDesktop); // Move instrumentation from original row to the desktop wrap
    colDesktop.append(wrapDesktop);

    const imageDivDesktop = document.createElement('div');
    imageDivDesktop.classList.add('image');
    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        imageDivDesktop.append(optimizedPic);
      }
    }
    wrapDesktop.append(imageDivDesktop);

    const titleDivDesktop = document.createElement('div');
    titleDivDesktop.classList.add('title');
    if (titleCell) {
      titleDivDesktop.textContent = titleCell.textContent.trim();
    }
    if (arrowIconCell) {
      const picture = arrowIconCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const arrowImg = document.createElement('img');
        arrowImg.loading = 'lazy';
        arrowImg.src = img.src;
        arrowImg.alt = img.alt;
        arrowImg.width = img.width;
        arrowImg.height = img.height;
        titleDivDesktop.append(' ', arrowImg);
      }
    }
    wrapDesktop.append(titleDivDesktop);

    const linkDesktop = document.createElement('a');
    linkDesktop.classList.add('stretched-link');
    if (linkCell && linkCell.querySelector('a')) {
      linkDesktop.href = linkCell.querySelector('a').href;
      linkDesktop.setAttribute('aria-label', `Learn more about ${titleCell ? titleCell.textContent.trim() : 'Business Vertical'}`);
    } else {
      linkDesktop.href = '#';
    }
    wrapDesktop.append(linkDesktop);

    // Mobile item (each mobile slide contains one item)
    const slideMobile = document.createElement('div');
    slideMobile.classList.add('slides');
    mobileSlider.append(slideMobile);

    const rowMobile = document.createElement('div');
    rowMobile.classList.add('row', 'row-cols-1', 'gy-3');
    slideMobile.append(rowMobile);

    const colMobile = document.createElement('div');
    colMobile.classList.add('col');
    rowMobile.append(colMobile);

    const wrapMobile = document.createElement('div');
    wrapMobile.classList.add('wrap');
    colMobile.append(wrapMobile);

    const imageDivMobile = document.createElement('div');
    imageDivMobile.classList.add('image');
    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        imageDivMobile.append(optimizedPic);
      }
    }
    wrapMobile.append(imageDivMobile);

    const titleDivMobile = document.createElement('div');
    titleDivMobile.classList.add('title');
    if (titleCell) {
      titleDivMobile.textContent = titleCell.textContent.trim();
    }
    if (arrowIconCell) {
      const picture = arrowIconCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const arrowImg = document.createElement('img');
        arrowImg.loading = 'lazy';
        arrowImg.src = img.src;
        arrowImg.alt = img.alt;
        arrowImg.width = img.width;
        arrowImg.height = img.height;
        titleDivMobile.append(' ', arrowImg);
      }
    }
    wrapMobile.append(titleDivMobile);

    const linkMobile = document.createElement('a');
    linkMobile.classList.add('stretched-link');
    if (linkCell && linkCell.querySelector('a')) {
      linkMobile.href = linkCell.querySelector('a').href;
      linkMobile.setAttribute('aria-label', `Learn more about ${titleCell ? titleCell.textContent.trim() : 'Business Vertical'}`);
    } else {
      linkMobile.href = '#';
    }
    wrapMobile.append(linkMobile);
  });

  block.replaceChildren(section);

  // Initialize Flickity if present
  if (mobileSlider) {
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
    } else {
      // Fallback for Flickity not loaded (e.g., in editor)
      console.warn('Flickity not loaded. Mobile slider may not function correctly.');
    }
  }
}
