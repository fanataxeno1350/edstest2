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

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const description = document.createElement('p');
  moveInstrumentation(descriptionRow, description);
  description.innerHTML = descriptionRow.innerHTML;
  sectionHeader.append(description);

  const businessVerticalsSection = document.createElement('div');
  businessVerticalsSection.classList.add('our-business-verticals');
  section.append(businessVerticalsSection);

  // Desktop view
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  businessVerticalsSection.append(desktopContainer);

  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');
  desktopContainer.append(desktopRow);

  // Mobile view - Flickity setup
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block');
  businessVerticalsSection.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider');
  // data-flickity attribute is handled by Flickity init, no need to set it here
  mobileContainer.append(mobileSlider);

  const slides = document.createElement('div');
  slides.classList.add('slides');
  mobileSlider.append(slides);

  const mobileRow = document.createElement('div');
  mobileRow.classList.add('row', 'row-cols-1', 'gy-3');
  slides.append(mobileRow);

  businessVerticalRows.forEach((row, index) => {
    const [
      imageDesktopCell,
      imageTabletCell,
      imageMobileCell,
      titleCell,
      arrowIconCell,
      businessLinkCell,
    ] = [...row.children];

    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col');
    desktopCol.setAttribute('data-aos', 'fade-up');
    desktopCol.setAttribute('data-aos-delay', `${100 + (index % 3) * 300}`); // Adjusted delay
    desktopRow.append(desktopCol);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');
    desktopCol.append(wrap);

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    wrap.append(imageDiv);

    if (imageDesktopCell && imageTabletCell) {
      const picture = imageDesktopCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(
          img.src,
          img.alt,
          false,
          [
            { media: '(min-width: 992px)', width: '376' },
            { media: '(min-width: 450px)', width: '376' },
            { width: '376' },
          ],
        );

        // Update sources for desktop and tablet
        const desktopSource = optimizedPic.querySelector('source[media="(min-width: 992px)"]');
        if (desktopSource) desktopSource.setAttribute('srcset', img.src);

        const tabletSource = optimizedPic.querySelector('source[media="(min-width: 450px)"]');
        if (tabletSource && imageTabletCell.querySelector('img')) {
          tabletSource.setAttribute('srcset', imageTabletCell.querySelector('img').src);
        }

        moveInstrumentation(imageDesktopCell, optimizedPic.querySelector('img'));
        imageDiv.append(optimizedPic);
      }
    }

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = titleCell.textContent.trim();
    wrap.append(titleDiv);

    if (arrowIconCell) {
      const arrowIcon = arrowIconCell.querySelector('picture');
      if (arrowIcon) {
        moveInstrumentation(arrowIconCell, arrowIcon.querySelector('img'));
        titleDiv.append(arrowIcon);
      }
    }

    const link = document.createElement('a');
    link.classList.add('stretched-link');
    const foundLink = businessLinkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    moveInstrumentation(businessLinkCell, link);
    wrap.append(link);

    // Mobile slider item
    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    mobileRow.append(mobileCol);

    const mobileWrap = document.createElement('div');
    mobileWrap.classList.add('wrap');
    mobileCol.append(mobileWrap);

    const mobileImageDiv = document.createElement('div');
    mobileImageDiv.classList.add('image');
    mobileWrap.append(mobileImageDiv);

    if (imageMobileCell && imageTabletCell) {
      const picture = imageMobileCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(
          img.src,
          img.alt,
          false,
          [
            { media: '(min-width: 992px)', width: '376' },
            { media: '(min-width: 450px)', width: '376' },
            { width: '376' },
          ],
        );

        // Update sources for desktop and tablet
        const desktopSource = optimizedPic.querySelector('source[media="(min-width: 992px)"]');
        if (desktopSource && imageDesktopCell.querySelector('img')) {
          desktopSource.setAttribute('srcset', imageDesktopCell.querySelector('img').src);
        }

        const tabletSource = optimizedPic.querySelector('source[media="(min-width: 450px)"]');
        if (tabletSource && imageTabletCell.querySelector('img')) {
          tabletSource.setAttribute('srcset', imageTabletCell.querySelector('img').src);
        }

        moveInstrumentation(imageMobileCell, optimizedPic.querySelector('img'));
        mobileImageDiv.append(optimizedPic);
      }
    }

    const mobileTitleDiv = document.createElement('div');
    mobileTitleDiv.classList.add('title');
    mobileTitleDiv.textContent = titleCell.textContent.trim();
    mobileWrap.append(mobileTitleDiv);

    if (arrowIconCell) {
      const arrowIcon = arrowIconCell.querySelector('picture');
      if (arrowIcon) {
        mobileTitleDiv.append(arrowIcon.cloneNode(true)); // Clone for mobile
      }
    }

    const mobileLink = document.createElement('a');
    mobileLink.classList.add('stretched-link');
    if (foundLink) {
      mobileLink.href = foundLink.href;
      mobileLink.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    // moveInstrumentation for mobile link is not needed as it's a clone/re-creation
    mobileWrap.append(mobileLink);
  });

  block.replaceChildren(section);

  // Load Flickity for mobile slider
  await loadCSS('/libs/flickity/flickity.min.css');
  await loadScript('/libs/flickity/flickity.pkgd.min.js');
  // eslint-disable-next-line no-undef, no-new
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
