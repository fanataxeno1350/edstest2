import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [prevArrowIconRow, nextArrowIconRow, ...itemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');
  moveInstrumentation(block, section);

  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi');
  section.append(beamSlider);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  beamSlider.append(swiperWrapper);

  const quickLinksParentDiv = document.createElement('div');
  quickLinksParentDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');
  section.append(quickLinksParentDiv);

  const container = document.createElement('div');
  container.classList.add('container');
  quickLinksParentDiv.append(container);

  const quickLinksUl = document.createElement('ul');
  quickLinksUl.classList.add('quick-links-div');
  container.append(quickLinksUl);

  const slides = [];
  const quickLinks = [];

  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 7 && cells[0].querySelector('picture')) {
      // This is a spotlight-slide item
      slides.push(row);
    } else if (cells.length === 2 && cells[0].querySelector('a')) {
      // This is a quick-link item
      quickLinks.push(row);
    }
  });

  slides.forEach((row) => {
    const slideDiv = document.createElement('div');
    slideDiv.classList.add('swiper-slide', 'nogradient');
    moveInstrumentation(row, slideDiv);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');
    slideDiv.append(slideBgImg);

    const mobContent = document.createElement('div');
    mobContent.classList.add('mob-content-home-spotlight');
    slideDiv.append(mobContent);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'text-center', 'text-lg-start');
    mobContent.append(contentDiv);

    const cells = [...row.children];
    const imageCell = cells[0];
    const imageAltCell = cells[1];
    const headingCell = cells[2];
    const subheadingCell = cells[3];
    const descriptionCell = cells[4];
    const ctaLinkCell = cells[5];
    // const ctaLabelCell = cells[6]; // Not directly rendered as a separate element

    // Image
    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1903' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        slideBgImg.append(optimizedPic);
      }
    }

    // Subheading
    const subheadingText = subheadingCell?.textContent?.trim();
    if (subheadingText) {
      const subheading = document.createElement('small');
      subheading.style.fontWeight = 'bold';
      subheading.textContent = subheadingText;
      contentDiv.append(subheading); // Append first, then heading
    }

    // Heading
    const headingText = headingCell?.textContent?.trim();
    if (headingText) {
      const heading = document.createElement('h2');
      heading.classList.add('heading', 'font-medium', 'font-size-tb');
      heading.textContent = headingText;
      contentDiv.append(heading);
    }

    // Description
    if (descriptionCell) {
      const description = document.createElement('p');
      moveInstrumentation(descriptionCell, description);
      while (descriptionCell.firstChild) description.append(descriptionCell.firstChild);
      contentDiv.append(description);
    }

    // CTA Link
    const ctaLink = ctaLinkCell?.querySelector('a');
    if (ctaLink) {
      const ctaBtn = document.createElement('a');
      ctaBtn.classList.add('btn', 'btn-primary');
      ctaBtn.href = ctaLink.href;
      moveInstrumentation(ctaLink, ctaBtn);
      ctaBtn.textContent = ctaLink.textContent;
      contentDiv.append(ctaBtn);
    }
    swiperWrapper.append(slideDiv);
  });

  quickLinks.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const cells = [...row.children];
    const linkCell = cells[0];
    const labelCell = cells[1]; // The label is often the text content of the link itself

    const link = linkCell?.querySelector('a');
    if (link) {
      const quickLinkA = document.createElement('a');
      quickLinkA.classList.add('with-full-underline');
      quickLinkA.href = link.href;
      moveInstrumentation(link, quickLinkA);
      quickLinkA.textContent = labelCell?.textContent?.trim() || link.textContent; // Use label cell if available, otherwise link text
      li.append(quickLinkA);
    }
    quickLinksUl.append(li);
  });

  const prevButton = document.createElement('div');
  prevButton.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  prevButton.setAttribute('tabindex', '0');
  prevButton.setAttribute('role', 'button');
  prevButton.setAttribute('aria-label', 'Previous slide');
  moveInstrumentation(prevArrowIconRow, prevButton);
  const prevIcon = prevArrowIconRow.querySelector('img');
  if (prevIcon) {
    const prevImg = document.createElement('img');
    prevImg.src = prevIcon.src;
    prevImg.alt = prevIcon.alt || 'Previous Arrow Icon';
    prevButton.append(prevImg);
  }
  beamSlider.append(prevButton);

  const nextButton = document.createElement('div');
  nextButton.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  nextButton.setAttribute('tabindex', '0');
  nextButton.setAttribute('role', 'button');
  nextButton.setAttribute('aria-label', 'Next slide');
  moveInstrumentation(nextArrowIconRow, nextButton);
  const nextIcon = nextArrowIconRow.querySelector('img');
  if (nextIcon) {
    const nextImg = document.createElement('img');
    nextImg.src = nextIcon.src;
    nextImg.alt = nextIcon.alt || 'Next Arrow Icon';
    nextButton.append(nextImg);
  }
  beamSlider.append(nextButton);

  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'bullet-bottom');
  beamSlider.append(swiperPagination);

  block.textContent = '';
  block.append(section);

  // Add event listeners for navigation (assuming a Swiper-like functionality)
  // This part would typically involve initializing a Swiper instance,
  // but for a purely JS-driven approach without a library:
  let currentIndex = 0;
  const totalSlides = slides.length;

  function updateSlideVisibility() {
    swiperWrapper.querySelectorAll('.swiper-slide').forEach((slide, index) => {
      if (index === currentIndex) {
        slide.classList.add('swiper-slide-active', 'swiper-slide-visible', 'swiper-slide-fully-visible');
        slide.style.display = 'block'; // Or adjust transform for actual slider
      } else {
        slide.classList.remove('swiper-slide-active', 'swiper-slide-visible', 'swiper-slide-fully-visible');
        slide.style.display = 'none'; // Or adjust transform for actual slider
      }
    });
    // Update pagination dots (simplified)
    swiperPagination.innerHTML = '';
    for (let i = 0; i < totalSlides; i += 1) {
      const bullet = document.createElement('span');
      bullet.classList.add('swiper-pagination-bullet');
      if (i === currentIndex) {
        bullet.classList.add('swiper-pagination-bullet-active');
      }
      bullet.addEventListener('click', () => {
        currentIndex = i;
        updateSlideVisibility();
      });
      swiperPagination.append(bullet);
    }
  }

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlideVisibility();
  });

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlideVisibility();
  });

  // Initial display
  if (totalSlides > 0) {
    updateSlideVisibility();
  }
}
