import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  // Destructure the first two rows for heading and description, the rest are vertical items
  const [headingRow, descriptionRow, ...verticalRows] = children;

  if (headingRow) {
    const headingCell = [...headingRow.children].find((cell) => cell.textContent.trim());
    if (headingCell) {
      const heading = document.createElement('h2');
      heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
      heading.textContent = headingCell.textContent.trim();
      moveInstrumentation(headingRow, heading);
      sectionHeader.appendChild(heading);
    }
  }

  if (descriptionRow) {
    const descriptionCell = [...descriptionRow.children].find((cell) => cell.textContent.trim());
    if (descriptionCell) {
      const description = document.createElement('p');
      description.classList.add('aos-init', 'aos-animate');
      description.textContent = descriptionCell.textContent.trim();
      moveInstrumentation(descriptionRow, description);
      sectionHeader.appendChild(description);
    }
  }

  container.appendChild(sectionHeader);
  section.appendChild(container);

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

  const mobileSlidesWrapper = document.createElement('div');
  mobileSlidesWrapper.classList.add('flickity-viewport');
  const mobileSliderInner = document.createElement('div');
  mobileSliderInner.classList.add('flickity-slider');
  mobileSlidesWrapper.appendChild(mobileSliderInner);
  mobileSlider.appendChild(mobileSlidesWrapper);

  const mobilePageDots = document.createElement('ol');
  mobilePageDots.classList.add('flickity-page-dots');
  // mobileSlider.appendChild(mobilePageDots); // Append later after dots are created

  const mobileSlides = [];
  let currentMobileSlide = document.createElement('div');
  currentMobileSlide.classList.add('slides');
  let currentMobileSlideRow = document.createElement('div');
  currentMobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
  currentMobileSlide.appendChild(currentMobileSlideRow);
  mobileSlides.push(currentMobileSlide);

  verticalRows.forEach((row, index) => {
    // Use content detection for item cells
    const cells = [...row.children];
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const titleCell = cells.find(cell => cell !== imageCell && cell !== linkCell);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageDiv.appendChild(optimizedPic);
      }
    }
    wrap.appendChild(imageDiv);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    if (titleCell) {
      titleDiv.textContent = titleCell.textContent.trim();
    }
    // Add the SVG arrow from the original HTML
    // The original HTML uses an <img> tag for the arrow, not an inline SVG.
    // Replicating the original HTML structure for the arrow.
    const arrowImg = document.createElement('img');
    arrowImg.loading = 'lazy';
    arrowImg.src = '/content/dam/aemigrate/uploaded-folder/www-mahindra-com/image/tilt-white-arrow-2e81f5.svg';
    arrowImg.alt = titleCell?.textContent.trim() ? `Mahindra Group - ${titleCell.textContent.trim()}` : 'Arrow'; // Use title for alt if available
    arrowImg.width = '10';
    arrowImg.height = '29';
    titleDiv.appendChild(arrowImg);
    wrap.appendChild(titleDiv);

    const link = document.createElement('a');
    link.classList.add('stretched-link');
    if (linkCell) {
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.setAttribute('aria-label', `Learn more about ${titleCell?.textContent.trim() || ''}`);
      }
    }
    wrap.appendChild(link);

    moveInstrumentation(row, wrap);

    // Desktop item
    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col', 'aos-init', 'aos-animate');
    desktopCol.setAttribute('data-aos', 'fade-up');
    desktopCol.setAttribute('data-aos-delay', `${(index % 3) * 300 + 100}`); // Simple delay logic
    desktopCol.appendChild(wrap.cloneNode(true)); // Clone for desktop
    desktopRow.appendChild(desktopCol);

    // Mobile item
    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    mobileCol.appendChild(wrap);

    if (currentMobileSlideRow.children.length < 3) {
      currentMobileSlideRow.appendChild(mobileCol);
    } else {
      currentMobileSlide = document.createElement('div');
      currentMobileSlide.classList.add('slides');
      currentMobileSlideRow = document.createElement('div');
      currentMobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentMobileSlide.appendChild(currentMobileSlideRow);
      currentMobileSlideRow.appendChild(mobileCol);
      mobileSlides.push(currentMobileSlide);
    }
  });

  desktopContainer.appendChild(desktopRow);
  ourBusinessVerticals.appendChild(desktopContainer);

  mobileSlides.forEach((slide, idx) => {
    mobileSliderInner.appendChild(slide);
    const dot = document.createElement('li');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Page dot ${idx + 1}`);
    if (idx === 0) {
      slide.classList.add('is-selected');
      dot.classList.add('is-selected');
      dot.setAttribute('aria-current', 'step');
    }
    mobilePageDots.appendChild(dot);
  });
  mobileSlider.appendChild(mobilePageDots); // Append page dots here after they are created

  mobileContainer.appendChild(mobileSlider);
  ourBusinessVerticals.appendChild(mobileContainer);

  section.appendChild(ourBusinessVerticals);

  block.replaceWith(section);
}
