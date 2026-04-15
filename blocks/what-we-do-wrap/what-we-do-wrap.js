import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...itemRows] = [...block.children];

  block.innerHTML = '';
  block.classList.add('section', 'what-we-do-wrap'); // Added 'what-we-do-wrap' class from original HTML

  const container = document.createElement('div');
  container.classList.add('container');
  block.append(container);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);
  container.append(sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.firstElementChild.textContent.trim();
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow, description);
  description.textContent = descriptionRow.firstElementChild.textContent.trim();
  sectionHeader.append(description);

  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');
  block.append(ourBusinessVerticals);

  // Desktop view
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  ourBusinessVerticals.append(desktopContainer);

  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');
  desktopContainer.append(desktopRow);

  // Mobile view (slider)
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  ourBusinessVerticals.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider', 'flickity-enabled', 'is-draggable');
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileContainer.append(mobileSlider);

  const mobileSlides = document.createElement('div');
  mobileSlides.classList.add('flickity-viewport');
  mobileSlider.append(mobileSlides);

  const mobileSliderInner = document.createElement('div');
  mobileSliderInner.classList.add('flickity-slider');
  mobileSlides.append(mobileSliderInner);

  const mobileSlideGroups = [];
  let currentMobileSlideGroup = null;

  itemRows.forEach((row, index) => {
    // Use content detection instead of index access for robustness
    const cells = [...row.children];
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const titleCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));
    const iconCell = cells.find(cell => cell.querySelector('picture') && cell !== imageCell); // Find the other picture cell
    const linkCell = cells.find(cell => cell.querySelector('a'));

    // Desktop item
    const col = document.createElement('div');
    col.classList.add('col', 'aos-init', 'aos-animate');
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', `${(index % 3) * 300 + 100}`);
    desktopRow.append(col);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');
    col.append(wrap);

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    wrap.append(imageDiv);

    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageDiv.append(optimizedPic);
      }
    }

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    if (titleCell) {
      titleDiv.textContent = titleCell.textContent.trim();
    }
    wrap.append(titleDiv);

    if (iconCell) {
      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const iconImg = iconPicture.querySelector('img');
        const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '10' }]);
        moveInstrumentation(iconImg, optimizedIcon.querySelector('img'));
        titleDiv.append(optimizedIcon);
      }
    }

    const link = document.createElement('a');
    link.classList.add('stretched-link');
    if (linkCell) {
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.setAttribute('aria-label', `Learn more about ${titleCell ? titleCell.textContent.trim() : 'item'}`);
      }
      moveInstrumentation(linkCell, link);
    }
    wrap.append(link);

    // Mobile item (grouped into slides of 3)
    if (index % 3 === 0) {
      currentMobileSlideGroup = document.createElement('div');
      currentMobileSlideGroup.classList.add('slides');
      if (index === 0) {
        currentMobileSlideGroup.classList.add('is-selected');
      }
      mobileSlideGroups.push(currentMobileSlideGroup);
      mobileSliderInner.append(currentMobileSlideGroup);

      const mobileRow = document.createElement('div');
      mobileRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentMobileSlideGroup.append(mobileRow);
    }

    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    currentMobileSlideGroup.querySelector('.row').append(mobileCol);

    const mobileWrap = document.createElement('div');
    mobileWrap.classList.add('wrap');
    mobileCol.append(mobileWrap);

    const mobileImageDiv = document.createElement('div');
    mobileImageDiv.classList.add('image');
    mobileWrap.append(mobileImageDiv);

    if (imageCell) {
      const mobilePicture = imageCell.querySelector('picture');
      if (mobilePicture) {
        const mobileImg = mobilePicture.querySelector('img');
        const optimizedMobilePic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '750' }]);
        mobileImageDiv.append(optimizedMobilePic);
      }
    }

    const mobileTitleDiv = document.createElement('div');
    mobileTitleDiv.classList.add('title');
    if (titleCell) {
      mobileTitleDiv.textContent = titleCell.textContent.trim();
    }
    mobileWrap.append(mobileTitleDiv);

    if (iconCell) {
      const mobileIconPicture = iconCell.querySelector('picture');
      if (mobileIconPicture) {
        const mobileIconImg = mobileIconPicture.querySelector('img');
        const optimizedMobileIcon = createOptimizedPicture(mobileIconImg.src, mobileIconImg.alt, false, [{ width: '10' }]);
        mobileTitleDiv.append(optimizedMobileIcon);
      }
    }

    const mobileLink = document.createElement('a');
    mobileLink.classList.add('stretched-link');
    if (linkCell) {
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        mobileLink.href = foundLink.href;
        mobileLink.setAttribute('aria-label', `Learn more about ${titleCell ? titleCell.textContent.trim() : 'item'}`);
      }
    }
    mobileWrap.append(mobileLink);
  });

  if (mobileSlideGroups.length > 1) {
    const pageDots = document.createElement('ol');
    pageDots.classList.add('flickity-page-dots');
    mobileSlider.append(pageDots);

    mobileSlideGroups.forEach((_, i) => {
      const dot = document.createElement('li');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', `Page dot ${i + 1}`);
      if (i === 0) {
        dot.classList.add('is-selected');
        dot.setAttribute('aria-current', 'step');
      }
      pageDots.append(dot);
    });
  }
}
