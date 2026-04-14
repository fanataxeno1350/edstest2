import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...itemRows] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('container');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  moveInstrumentation(headingRow.firstElementChild, heading);
  heading.textContent = headingRow.firstElementChild?.textContent || '';
  sectionHeader.append(heading);

  const description = document.createElement('p'); // Corrected element creation
  description.classList.add('aos-init', 'aos-animate');
  description.setAttribute('data-aos', 'fade-up');
  description.setAttribute('data-aos-offset', '100');
  description.setAttribute('data-aos-duration', '650');
  description.setAttribute('data-aos-easing', 'ease-in-out');
  moveInstrumentation(descriptionRow.firstElementChild, description);
  description.textContent = descriptionRow.firstElementChild?.textContent || '';
  sectionHeader.append(description);

  container.append(sectionHeader);
  block.textContent = '';
  block.append(container);

  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');

  // Desktop view
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');

  // Mobile view
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  mobileContainer.setAttribute('data-aos', 'fade-up');
  mobileContainer.setAttribute('data-aos-offset', '100');
  mobileContainer.setAttribute('data-aos-duration', '650');
  mobileContainer.setAttribute('data-aos-easing', 'ease-in-out');

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider', 'flickity-enabled', 'is-draggable');
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
  let currentMobileSlideRow = document.createElement('div');
  currentMobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
  currentMobileSlide.append(currentMobileSlideRow);
  mobileSlides.push(currentMobileSlide);

  itemRows.forEach((row, index) => {
    const cells = [...row.children];

    const imageCell = cells.find((c) => c.querySelector('picture'));
    const titleCell = cells.find((c) => !c.querySelector('picture') && !c.querySelector('a'));
    const iconCell = cells.find((c) => c.querySelector('picture') && c !== imageCell);
    const linkCell = cells.find((c) => c.querySelector('a'));

    const col = document.createElement('div');
    col.classList.add('col', 'aos-init', 'aos-animate');
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', `${(index % 3) * 300 + 100}`); // Stagger delays
    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    if (imageCell) {
      const imageDiv = document.createElement('div');
      imageDiv.classList.add('image');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
            { media: '(min-width: 992px)', width: '376' },
            { media: '(min-width: 450px)', width: '376' },
            { width: '376' },
          ]);
          // Ensure img-fluid class is added to the img inside the optimized picture
          optimizedPic.querySelector('img').classList.add('img-fluid');
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          imageDiv.append(optimizedPic);
        }
      }
      wrap.append(imageDiv);
    }

    if (titleCell || iconCell) {
      const titleDiv = document.createElement('div');
      titleDiv.classList.add('title');
      if (titleCell) {
        moveInstrumentation(titleCell, titleDiv);
        titleDiv.innerHTML = titleCell.innerHTML;
      }
      if (iconCell) {
        const iconPicture = iconCell.querySelector('picture');
        if (iconPicture) {
          const iconImg = iconPicture.querySelector('img');
          if (iconImg) {
            const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '10' }]);
            moveInstrumentation(iconImg, optimizedIcon.querySelector('img'));
            titleDiv.append(optimizedIcon);
          }
        }
      }
      wrap.append(titleDiv);
    }

    if (linkCell) {
      const link = document.createElement('a');
      link.classList.add('stretched-link');
      moveInstrumentation(linkCell.firstElementChild, link);
      link.href = linkCell.querySelector('a')?.href || '#';
      link.setAttribute('aria-label', `Learn more about ${titleCell?.textContent || ''}`);
      wrap.append(link);
    }

    col.append(wrap);
    desktopRow.append(col);

    // Mobile slide logic
    if (index > 0 && index % 3 === 0) {
      currentMobileSlide = document.createElement('div');
      currentMobileSlide.classList.add('slides');
      currentMobileSlideRow = document.createElement('div');
      currentMobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentMobileSlide.append(currentMobileSlideRow);
      mobileSlides.push(currentMobileSlide);
    }
    const mobileCol = col.cloneNode(true);
    currentMobileSlideRow.append(mobileCol);
  });

  desktopContainer.append(desktopRow);
  ourBusinessVerticals.append(desktopContainer);

  mobileSlides.forEach((slide) => {
    flickitySlider.append(slide);
  });

  const pageDots = document.createElement('ol');
  pageDots.classList.add('flickity-page-dots');
  mobileSlides.forEach((_, i) => {
    const dot = document.createElement('li');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Page dot ${i + 1}`);
    if (i === 0) {
      dot.classList.add('is-selected');
      dot.setAttribute('aria-current', 'step');
    }
    pageDots.append(dot);
  });
  mobileSlider.append(pageDots);

  mobileContainer.append(mobileSlider);
  ourBusinessVerticals.append(mobileContainer);

  block.append(ourBusinessVerticals);
}
