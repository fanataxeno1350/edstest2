import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  container.append(sectionHeader);

  // Heading
  const headingRow = children.shift();
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  // Description
  const descriptionRow = children.shift();
  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow, description);
  description.textContent = descriptionRow.textContent.trim();
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

  // Mobile view (Swiper)
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  ourBusinessVerticals.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider');
  mobileContainer.append(mobileSlider);

  const flickityViewport = document.createElement('div');
  flickityViewport.classList.add('flickity-viewport');
  mobileSlider.append(flickityViewport);

  const flickitySlider = document.createElement('div');
  flickitySlider.classList.add('flickity-slider');
  flickityViewport.append(flickitySlider);

  const mobileSlides = [];
  let currentMobileSlide = document.createElement('div');
  currentMobileSlide.classList.add('slides');
  flickitySlider.append(currentMobileSlide);
  let mobileSlideRowCount = 0;

  const mobileSlideRow = document.createElement('div');
  mobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
  currentMobileSlide.append(mobileSlideRow);

  // Business Vertical Items
  children.forEach((row, index) => {
    const [imageDesktopCell, imageMobileCell, titleCell, arrowIconCell, linkCell] = [...row.children];

    // Desktop item
    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col', 'aos-init', 'aos-animate');
    desktopCol.setAttribute('data-aos', 'fade-up');
    desktopCol.setAttribute('data-aos-delay', (index % 3) * 300 + 100);
    desktopRow.append(desktopCol);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');
    desktopCol.append(wrap);

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    wrap.append(imageDiv);

    const desktopPicture = imageDesktopCell.querySelector('picture');
    if (desktopPicture) {
      const optimizedPic = createOptimizedPicture(desktopPicture.querySelector('img').src, desktopPicture.querySelector('img').alt, false, [{ media: '(min-width: 992px)', width: '376' }, { width: '376' }]);
      moveInstrumentation(desktopPicture.querySelector('img'), optimizedPic.querySelector('img'));
      imageDiv.append(optimizedPic);
    }

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = titleCell.textContent.trim();
    const arrowIcon = arrowIconCell.querySelector('img');
    if (arrowIcon) {
      const clonedArrow = arrowIcon.cloneNode(true);
      clonedArrow.removeAttribute('width');
      clonedArrow.removeAttribute('height');
      titleDiv.append(' ', clonedArrow);
    }
    wrap.append(titleDiv);

    const link = document.createElement('a');
    link.classList.add('stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    moveInstrumentation(row, link);
    wrap.append(link);

    // Mobile item (for Flickity slider)
    if (mobileSlideRowCount < 3) {
      const mobileCol = document.createElement('div');
      mobileCol.classList.add('col');
      mobileSlideRow.append(mobileCol);

      const mobileWrap = document.createElement('div');
      mobileWrap.classList.add('wrap');
      mobileCol.append(mobileWrap);

      const mobileImageDiv = document.createElement('div');
      mobileImageDiv.classList.add('image');
      mobileWrap.append(mobileImageDiv);

      const mobilePicture = imageMobileCell.querySelector('picture');
      if (mobilePicture) {
        const optimizedMobilePic = createOptimizedPicture(mobilePicture.querySelector('img').src, mobilePicture.querySelector('img').alt, false, [{ media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
        moveInstrumentation(mobilePicture.querySelector('img'), optimizedMobilePic.querySelector('img'));
        mobileImageDiv.append(optimizedMobilePic);
      }

      const mobileTitleDiv = document.createElement('div');
      mobileTitleDiv.classList.add('title');
      mobileTitleDiv.textContent = titleCell.textContent.trim();
      if (arrowIcon) {
        const clonedArrow = arrowIcon.cloneNode(true);
        clonedArrow.removeAttribute('width');
        clonedArrow.removeAttribute('height');
        mobileTitleDiv.append(' ', clonedArrow);
      }
      mobileWrap.append(mobileTitleDiv);

      const mobileLink = document.createElement('a');
      mobileLink.classList.add('stretched-link');
      if (foundLink) {
        mobileLink.href = foundLink.href;
        mobileLink.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
      }
      mobileWrap.append(mobileLink);

      mobileSlideRowCount += 1;
    } else {
      currentMobileSlide = document.createElement('div');
      currentMobileSlide.classList.add('slides');
      flickitySlider.append(currentMobileSlide);
      mobileSlideRowCount = 0;

      mobileSlideRow = document.createElement('div');
      mobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentMobileSlide.append(mobileSlideRow);

      const mobileCol = document.createElement('div');
      mobileCol.classList.add('col');
      mobileSlideRow.append(mobileCol);

      const mobileWrap = document.createElement('div');
      mobileWrap.classList.add('wrap');
      mobileCol.append(mobileWrap);

      const mobileImageDiv = document.createElement('div');
      mobileImageDiv.classList.add('image');
      mobileWrap.append(mobileImageDiv);

      const mobilePicture = imageMobileCell.querySelector('picture');
      if (mobilePicture) {
        const optimizedMobilePic = createOptimizedPicture(mobilePicture.querySelector('img').src, mobilePicture.querySelector('img').alt, false, [{ media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
        mobileImageDiv.append(optimizedMobilePic);
      }

      const mobileTitleDiv = document.createElement('div');
      mobileTitleDiv.classList.add('title');
      mobileTitleDiv.textContent = titleCell.textContent.trim();
      if (arrowIcon) {
        const clonedArrow = arrowIcon.cloneNode(true);
        clonedArrow.removeAttribute('width');
        clonedArrow.removeAttribute('height');
        mobileTitleDiv.append(' ', clonedArrow);
      }
      mobileWrap.append(mobileTitleDiv);

      const mobileLink = document.createElement('a');
      mobileLink.classList.add('stretched-link');
      if (foundLink) {
        mobileLink.href = foundLink.href;
        mobileLink.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
      }
      mobileWrap.append(mobileLink);

      mobileSlideRowCount += 1;
    }
  });

  // Flickity pagination
  const flickityPageDots = document.createElement('ol');
  flickityPageDots.classList.add('flickity-page-dots');
  mobileSlider.append(flickityPageDots);

  for (let i = 0; i < flickitySlider.children.length; i += 1) {
    const dot = document.createElement('li');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Page dot ${i + 1}`);
    if (i === 0) {
      dot.classList.add('is-selected');
      dot.setAttribute('aria-current', 'step');
    }
    flickityPageDots.append(dot);
  }

  // Flickity initialization (simplified for EDS)
  let currentSlideIndex = 0;
  const slides = [...flickitySlider.children];

  const updateSlider = () => {
    slides.forEach((slide, i) => {
      if (i === currentSlideIndex) {
        slide.classList.add('is-selected');
        slide.removeAttribute('aria-hidden');
      } else {
        slide.classList.remove('is-selected');
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    [...flickityPageDots.children].forEach((dot, i) => {
      if (i === currentSlideIndex) {
        dot.classList.add('is-selected');
        dot.setAttribute('aria-current', 'step');
      } else {
        dot.classList.remove('is-selected');
        dot.removeAttribute('aria-current');
      }
    });

    flickitySlider.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    flickityViewport.style.height = `${slides[currentSlideIndex].offsetHeight}px`;
  };

  flickityPageDots.addEventListener('click', (e) => {
    const dot = e.target.closest('.dot');
    if (dot) {
      const index = [...flickityPageDots.children].indexOf(dot);
      if (index !== -1 && index !== currentSlideIndex) {
        currentSlideIndex = index;
        updateSlider();
      }
    }
  });

  if (slides.length > 0) {
    updateSlider(); // Initial update
    window.addEventListener('resize', updateSlider); // Responsive height
  }

  block.replaceChildren(section);
}
