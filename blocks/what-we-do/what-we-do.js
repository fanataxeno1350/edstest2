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

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  container.append(sectionHeader);

  // Section Heading
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  // Section Description
  const description = document.createElement('p');
  moveInstrumentation(descriptionRow, description);
  description.innerHTML = descriptionRow.innerHTML;
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
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block');
  ourBusinessVerticals.append(mobileContainer);

  const swiperEl = document.createElement('div');
  swiperEl.classList.add('mobile-slider', 'swiper');
  mobileContainer.append(swiperEl);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperEl.append(swiperWrapper);

  const paginationEl = document.createElement('div');
  paginationEl.classList.add('swiper-pagination');
  swiperEl.append(paginationEl);

  businessVerticalRows.forEach((row) => {
    const [imageDesktopCell, imageTabletMobileCell, mainImageCell, titleCell, arrowIconCell, linkCell] = [...row.children];

    // Desktop item
    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col');
    moveInstrumentation(row, desktopCol); // Move instrumentation for the desktop item

    const desktopWrap = document.createElement('div');
    desktopWrap.classList.add('wrap');

    const desktopImageDiv = document.createElement('div');
    desktopImageDiv.classList.add('image');

    const desktopTitleDiv = document.createElement('div');
    desktopTitleDiv.classList.add('title');
    desktopTitleDiv.textContent = titleCell.textContent.trim();

    const desktopArrowIcon = arrowIconCell.querySelector('picture');
    if (desktopArrowIcon) {
      const optimizedArrowIcon = createOptimizedPicture(
        desktopArrowIcon.querySelector('img').src,
        desktopArrowIcon.querySelector('img').alt,
        false,
        [{ width: '10' }],
      );
      moveInstrumentation(desktopArrowIcon, optimizedArrowIcon.querySelector('img'));
      desktopTitleDiv.append(optimizedArrowIcon);
    }

    const desktopLink = document.createElement('a');
    desktopLink.classList.add('stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      desktopLink.href = foundLink.href;
      desktopLink.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    moveInstrumentation(linkCell, desktopLink); // Move instrumentation for the link cell

    const desktopImage = imageDesktopCell.querySelector('picture');
    if (desktopImage) {
      const optimizedPic = createOptimizedPicture(
        desktopImage.querySelector('img').src,
        desktopImage.querySelector('img').alt,
        false,
        [{ media: '(min-width: 992px)', width: '376' }],
        [{ media: '(min-width: 450px)', width: '376' }],
        [{ width: '376' }],
      );
      moveInstrumentation(desktopImage, optimizedPic.querySelector('img'));
      desktopImageDiv.append(optimizedPic);
    }
    desktopWrap.append(desktopImageDiv, desktopTitleDiv, desktopLink);
    desktopCol.append(desktopWrap);
    desktopRow.append(desktopCol);

    // Mobile item (Swiper slide)
    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');

    const mobileWrap = document.createElement('div');
    mobileWrap.classList.add('wrap');

    const mobileImageDiv = document.createElement('div');
    mobileImageDiv.classList.add('image');

    const mobileTitleDiv = document.createElement('div');
    mobileTitleDiv.classList.add('title');
    mobileTitleDiv.textContent = titleCell.textContent.trim();

    const mobileArrowIcon = arrowIconCell.querySelector('picture');
    if (mobileArrowIcon) {
      const optimizedArrowIcon = createOptimizedPicture(
        mobileArrowIcon.querySelector('img').src,
        mobileArrowIcon.querySelector('img').alt,
        false,
        [{ width: '10' }],
      );
      mobileTitleDiv.append(optimizedArrowIcon);
    }

    const mobileLink = document.createElement('a');
    mobileLink.classList.add('stretched-link');
    if (foundLink) { // Use the same foundLink from desktop
      mobileLink.href = foundLink.href;
      mobileLink.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }

    const mobileImage = imageTabletMobileCell.querySelector('picture') || mainImageCell.querySelector('picture');
    if (mobileImage) {
      const optimizedPic = createOptimizedPicture(
        mobileImage.querySelector('img').src,
        mobileImage.querySelector('img').alt,
        false,
        [{ media: '(min-width: 992px)', width: '376' }],
        [{ media: '(min-width: 450px)', width: '376' }],
        [{ width: '376' }],
      );
      moveInstrumentation(mobileImage, optimizedPic.querySelector('img')); // Add instrumentation for mobile image
      mobileImageDiv.append(optimizedPic);
    }

    mobileWrap.append(mobileImageDiv, mobileTitleDiv, mobileLink);
    swiperSlide.append(mobileWrap);
    swiperWrapper.append(swiperSlide);
  });

  block.replaceChildren(section);

  // Load Swiper and initialize
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
    slidesPerView: 1,
    spaceBetween: 16,
    loop: false,
    pagination: {
      el: paginationEl,
      clickable: true,
    },
  });
}
