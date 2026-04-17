import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const [headingRow, descriptionRow, ...businessVerticalRows] = children;

  // The block itself should have the class 'what-we-do-wrap' from the original HTML,
  // not 'section' which is a parent element.
  block.classList.add('what-we-do-wrap');

  // Section Header
  const containerHeader = document.createElement('div');
  containerHeader.classList.add('container');
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular');
  heading.textContent = headingRow?.firstElementChild?.textContent.trim() || '';
  // Add AOS attributes from original HTML
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.classList.add('aos-init', 'aos-animate'); // Add initial AOS classes
  moveInstrumentation(headingRow, heading);
  sectionHeader.appendChild(heading);

  const description = document.createElement('p');
  description.textContent = descriptionRow?.firstElementChild?.textContent.trim() || '';
  // Add AOS attributes from original HTML
  description.setAttribute('data-aos', 'fade-up');
  description.setAttribute('data-aos-offset', '100');
  description.setAttribute('data-aos-duration', '650');
  description.setAttribute('data-aos-easing', 'ease-in-out');
  description.classList.add('aos-init', 'aos-animate'); // Add initial AOS classes
  moveInstrumentation(descriptionRow, description);
  sectionHeader.appendChild(description);

  containerHeader.appendChild(sectionHeader);
  block.appendChild(containerHeader);

  // Business Verticals
  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');

  // Desktop view
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');

  businessVerticalRows.forEach((row, index) => {
    const [imageCell, titleCell, iconCell, linkCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col', 'aos-init', 'aos-animate'); // Add AOS classes
    col.setAttribute('data-aos', 'fade-up');
    // Apply staggered delay based on original HTML pattern
    const delay = (index % 3 === 0 || index % 3 === 2) ? 100 : (index % 3 === 1 ? 400 : 700);
    col.setAttribute('data-aos-delay', delay.toString());
    moveInstrumentation(row, col); // Move instrumentation from original row to the new column

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      // Add img-fluid class to the img inside the optimized picture
      optimizedPic.querySelector('img').classList.add('img-fluid');
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageDiv.appendChild(optimizedPic);
    }
    wrap.appendChild(imageDiv);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = titleCell.textContent.trim();
    const icon = iconCell.querySelector('picture');
    if (icon) {
      const iconImg = icon.querySelector('img');
      const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '10' }]);
      moveInstrumentation(iconImg, optimizedIcon.querySelector('img'));
      titleDiv.appendChild(optimizedIcon);
    }
    wrap.appendChild(titleDiv);

    const link = document.createElement('a');
    link.classList.add('stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.setAttribute('aria-label', foundLink.getAttribute('aria-label') || `Learn more about ${titleCell.textContent.trim()}`);
    }
    wrap.appendChild(link);

    col.appendChild(wrap);
    desktopRow.appendChild(col);
  });

  desktopContainer.appendChild(desktopRow);
  ourBusinessVerticals.appendChild(desktopContainer);

  // Mobile view (slider)
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate'); // Add AOS classes
  mobileContainer.setAttribute('data-aos', 'fade-up');
  mobileContainer.setAttribute('data-aos-offset', '100');
  mobileContainer.setAttribute('data-aos-duration', '650');
  mobileContainer.setAttribute('data-aos-easing', 'ease-in-out');

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider');
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');

  // Create slides for mobile
  const slides = [];
  let currentSlide = document.createElement('div');
  currentSlide.classList.add('slides');
  let currentRow = document.createElement('div');
  currentRow.classList.add('row', 'row-cols-1', 'gy-3');

  businessVerticalRows.forEach((row, index) => {
    const [imageCell, titleCell, iconCell, linkCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col');

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      // Add img-fluid class to the img inside the optimized picture
      optimizedPic.querySelector('img').classList.add('img-fluid');
      imageDiv.appendChild(optimizedPic);
    }
    wrap.appendChild(imageDiv);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = titleCell.textContent.trim();
    const icon = iconCell.querySelector('picture');
    if (icon) {
      const iconImg = icon.querySelector('img');
      const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '10' }]);
      titleDiv.appendChild(optimizedIcon);
    }
    wrap.appendChild(titleDiv);

    const link = document.createElement('a');
    link.classList.add('stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.setAttribute('aria-label', foundLink.getAttribute('aria-label') || `Learn more about ${titleCell.textContent.trim()}`);
    }
    wrap.appendChild(link);

    col.appendChild(wrap);
    currentRow.appendChild(col);

    // Group 3 items per slide for mobile
    if ((index + 1) % 3 === 0 || index === businessVerticalRows.length - 1) {
      currentSlide.appendChild(currentRow);
      slides.push(currentSlide);
      currentSlide = document.createElement('div');
      currentSlide.classList.add('slides');
      currentRow = document.createElement('div');
      currentRow.classList.add('row', 'row-cols-1', 'gy-3');
    }
  });

  slides.forEach((slide, index) => {
    if (index === 0) {
      slide.classList.add('is-selected');
    }
    mobileSlider.appendChild(slide);
  });

  mobileContainer.appendChild(mobileSlider);
  ourBusinessVerticals.appendChild(mobileContainer);

  block.appendChild(ourBusinessVerticals);
}
