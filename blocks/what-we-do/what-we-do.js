import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [headingRow, descriptionRow, ...businessVerticalRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);
  container.append(sectionHeader);

  if (headingRow) {
    const [headingCell] = [...headingRow.children]; // Fixed: Use destructuring for heading cell
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.textContent = headingCell?.textContent.trim() || '';
    sectionHeader.append(heading);
  }

  if (descriptionRow) {
    const [descriptionCell] = [...descriptionRow.children]; // Fixed: Use destructuring for description cell
    const description = document.createElement('p');
    description.classList.add('aos-init', 'aos-animate');
    description.innerHTML = descriptionCell?.innerHTML || ''; // Fixed: Read innerHTML from cell
    moveInstrumentation(descriptionRow, description);
    sectionHeader.append(description);
  }

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

  // Mobile view (Swiper based)
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  ourBusinessVerticals.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider', 'swiper'); // Added 'swiper' class for Swiper initialization
  mobileContainer.append(mobileSlider);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  mobileSlider.append(swiperWrapper);

  let currentMobileSlide = null;
  let mobileSlideRow = null;
  let itemsInCurrentSlide = 0;

  const createNewMobileSlide = () => {
    currentMobileSlide = document.createElement('div');
    currentMobileSlide.classList.add('slides', 'swiper-slide');
    mobileSlideRow = document.createElement('div');
    mobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
    currentMobileSlide.append(mobileSlideRow);
    swiperWrapper.append(currentMobileSlide); // Append to swiperWrapper directly
    itemsInCurrentSlide = 0;
  };

  createNewMobileSlide(); // Create the first slide

  businessVerticalRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, titleCell, arrowIconCell, linkCell] = [...row.children];

    // Desktop item
    const colDesktop = document.createElement('div');
    colDesktop.classList.add('col', 'aos-init', 'aos-animate');
    desktopRow.append(colDesktop);

    const wrapDesktop = document.createElement('div');
    wrapDesktop.classList.add('wrap');
    moveInstrumentation(row, wrapDesktop);
    colDesktop.append(wrapDesktop);

    const imageDesktopDiv = document.createElement('div');
    imageDesktopDiv.classList.add('image');
    if (imageDesktopCell) {
      const picture = imageDesktopCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageDesktopDiv.append(optimizedPic);
      }
    }
    wrapDesktop.append(imageDesktopDiv);

    const titleDesktopDiv = document.createElement('div');
    titleDesktopDiv.classList.add('title');
    titleDesktopDiv.textContent = titleCell?.textContent.trim() || '';
    if (arrowIconCell) {
      const arrowImg = arrowIconCell.querySelector('img');
      if (arrowImg) {
        const optimizedArrow = createOptimizedPicture(arrowImg.src, arrowImg.alt, false, [{ width: '10' }]);
        moveInstrumentation(arrowImg, optimizedArrow.querySelector('img'));
        titleDesktopDiv.append(optimizedArrow);
      }
    }
    wrapDesktop.append(titleDesktopDiv);

    const linkDesktop = document.createElement('a');
    linkDesktop.classList.add('stretched-link');
    const foundLinkDesktop = linkCell?.querySelector('a');
    if (foundLinkDesktop) {
      linkDesktop.href = foundLinkDesktop.href;
      linkDesktop.setAttribute('aria-label', `Learn more about ${titleCell?.textContent.trim() || ''}`);
    }
    wrapDesktop.append(linkDesktop);

    // Mobile item
    if (itemsInCurrentSlide === 3) { // Fixed: Check items in current slide, not row.children.length
      createNewMobileSlide();
    }

    const colMobile = document.createElement('div');
    colMobile.classList.add('col');
    mobileSlideRow.append(colMobile);

    const wrapMobile = document.createElement('div');
    wrapMobile.classList.add('wrap');
    colMobile.append(wrapMobile);

    const imageMobileDiv = document.createElement('div');
    imageMobileDiv.classList.add('image');
    if (imageMobileCell) {
      const picture = imageMobileCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageMobileDiv.append(optimizedPic);
      }
    }
    wrapMobile.append(imageMobileDiv);

    const titleMobileDiv = document.createElement('div');
    titleMobileDiv.classList.add('title');
    titleMobileDiv.textContent = titleCell?.textContent.trim() || '';
    if (arrowIconCell) {
      const arrowImg = arrowIconCell.querySelector('img');
      if (arrowImg) {
        const optimizedArrow = createOptimizedPicture(arrowImg.src, arrowImg.alt, false, [{ width: '10' }]);
        moveInstrumentation(arrowImg, optimizedArrow.querySelector('img'));
        titleMobileDiv.append(optimizedArrow);
      }
    }
    wrapMobile.append(titleMobileDiv);

    const linkMobile = document.createElement('a');
    linkMobile.classList.add('stretched-link');
    const foundLinkMobile = linkCell?.querySelector('a');
    if (foundLinkMobile) {
      linkMobile.href = foundLinkMobile.href;
      linkMobile.setAttribute('aria-label', `Learn more about ${titleCell?.textContent.trim() || ''}`);
    }
    wrapMobile.append(linkMobile);
    itemsInCurrentSlide += 1; // Increment count for current slide
  });

  // Swiper pagination
  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'flickity-page-dots');
  mobileSlider.append(swiperPagination);

  block.replaceChildren(section);

  // Initialize Swiper for mobile slider
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  // eslint-disable-next-line no-undef
  new Swiper(mobileSlider, {
    slidesPerView: 1,
    spaceBetween: 16,
    loop: false,
    pagination: {
      el: swiperPagination,
      clickable: true,
      renderBullet: (index, className) => `<li class="${className}" aria-label="Page dot ${index + 1}"></li>`,
    },
    breakpoints: {
      // You might need to adjust these breakpoints based on the original site's mobile slider behavior
      // 576: { slidesPerView: 1 }, // Example breakpoint
    },
  });
}
