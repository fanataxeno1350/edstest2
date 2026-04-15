import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...itemRows] = [...block.children];

  block.innerHTML = '';
  block.classList.add('section', 'what-we-do-wrap');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  block.append(containerDiv);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);
  containerDiv.append(sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow ? headingRow.firstElementChild.textContent.trim() : '';
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.textContent = descriptionRow ? descriptionRow.firstElementChild.textContent.trim() : '';
  moveInstrumentation(descriptionRow, description);
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

  // Mobile view
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  ourBusinessVerticals.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider', 'flickity-enabled', 'is-draggable');
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
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
  mobileSlides.push(currentMobileSlide);

  let currentMobileRow = document.createElement('div');
  currentMobileRow.classList.add('row', 'row-cols-1', 'gy-3');
  currentMobileSlide.append(currentMobileRow);

  itemRows.forEach((row, index) => {
    const cells = [...row.children];
    // Use content detection for cells instead of index access
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const imageAltCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim().includes('Alt Text'));
    const imageTitleCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim().includes('Title'));
    const titleCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim().length > 0 && !cell.textContent.trim().includes('Alt Text') && !cell.textContent.trim().includes('Title'));
    const iconCell = cells.find(cell => cell.querySelector('picture') && cell !== imageCell);
    const linkCell = cells.find(cell => cell.querySelector('a'));

    // Desktop item
    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col', 'aos-init', 'aos-animate');
    desktopCol.setAttribute('data-aos', 'fade-up');
    desktopCol.setAttribute('data-aos-delay', `${100 + (index % 3) * 300}`); // Stagger delay
    desktopRow.append(desktopCol);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');
    desktopCol.append(wrap);

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    const picture = imageCell ? imageCell.querySelector('picture') : null;
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
      moveInstrumentation(picture, optimizedPic.querySelector('img'));
      imageDiv.append(optimizedPic);
    }
    wrap.append(imageDiv);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = titleCell ? titleCell.textContent.trim() : '';
    const iconPicture = iconCell ? iconCell.querySelector('picture') : null;
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '10' }]);
      moveInstrumentation(iconPicture, optimizedIcon.querySelector('img'));
      titleDiv.append(optimizedIcon);
    }
    wrap.append(titleDiv);

    const anchor = document.createElement('a');
    anchor.classList.add('stretched-link');
    const foundLink = linkCell ? linkCell.querySelector('a') : null;
    if (foundLink) {
      anchor.href = foundLink.href; // Read href for aem-content type
      anchor.setAttribute('aria-label', `Learn more about ${titleCell ? titleCell.textContent.trim() : ''}`);
    }
    moveInstrumentation(row, anchor);
    wrap.append(anchor);

    // Mobile item (3 items per slide)
    if (index > 0 && index % 3 === 0) {
      currentMobileSlide = document.createElement('div');
      currentMobileSlide.classList.add('slides');
      currentMobileSlide.setAttribute('aria-hidden', 'true');
      flickitySlider.append(currentMobileSlide);
      mobileSlides.push(currentMobileSlide);

      currentMobileRow = document.createElement('div');
      currentMobileRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentMobileSlide.append(currentMobileRow);
    }

    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    currentMobileRow.append(mobileCol);

    const mobileWrap = document.createElement('div');
    mobileWrap.classList.add('wrap');
    mobileCol.append(mobileWrap);

    const mobileImageDiv = document.createElement('div');
    mobileImageDiv.classList.add('image');
    const mobilePicture = imageCell ? imageCell.querySelector('picture') : null;
    if (mobilePicture) {
      const mobileImg = mobilePicture.querySelector('img');
      const optimizedMobilePic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
      moveInstrumentation(mobilePicture, optimizedMobilePic.querySelector('img'));
      mobileImageDiv.append(optimizedMobilePic);
    }
    mobileWrap.append(mobileImageDiv);

    const mobileTitleDiv = document.createElement('div');
    mobileTitleDiv.classList.add('title');
    mobileTitleDiv.textContent = titleCell ? titleCell.textContent.trim() : '';
    const mobileIconPicture = iconCell ? iconCell.querySelector('picture') : null;
    if (mobileIconPicture) {
      const mobileIconImg = mobileIconPicture.querySelector('img');
      const optimizedMobileIcon = createOptimizedPicture(mobileIconImg.src, mobileIconImg.alt, false, [{ width: '10' }]);
      moveInstrumentation(mobileIconPicture, optimizedMobileIcon.querySelector('img'));
      mobileTitleDiv.append(optimizedMobileIcon);
    }
    mobileWrap.append(mobileTitleDiv);

    const mobileAnchor = document.createElement('a');
    mobileAnchor.classList.add('stretched-link');
    if (foundLink) {
      mobileAnchor.href = foundLink.href;
      mobileAnchor.setAttribute('aria-label', `Learn more about ${titleCell ? titleCell.textContent.trim() : ''}`);
    }
    mobileWrap.append(mobileAnchor);
  });

  const pageDots = document.createElement('ol');
  pageDots.classList.add('flickity-page-dots');
  mobileSlider.append(pageDots);

  mobileSlides.forEach((slide, i) => {
    const dot = document.createElement('li');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Page dot ${i + 1}`);
    if (i === 0) {
      dot.classList.add('is-selected');
      dot.setAttribute('aria-current', 'step');
    }
    dot.addEventListener('click', () => {
      // Simulate Flickity dot click behavior
      mobileSlides.forEach((s) => s.classList.remove('is-selected'));
      mobileSlides.forEach((s) => s.setAttribute('aria-hidden', 'true'));
      pageDots.querySelectorAll('.dot').forEach((d) => {
        d.classList.remove('is-selected');
        d.removeAttribute('aria-current');
      });

      slide.classList.add('is-selected');
      slide.removeAttribute('aria-hidden');
      dot.classList.add('is-selected');
      dot.setAttribute('aria-current', 'step');
      // In a real Flickity setup, you'd call flickityInstance.select(i) here.
      // For this EDS block, we only simulate the class changes.
      flickitySlider.style.transform = `translateX(-${i * 100}%)`; // Basic slide simulation
    });
    pageDots.append(dot);
  });

  // Flickity initialization (simplified, as EDS doesn't load Bootstrap JS)
  // This part would typically be handled by a separate script loading Flickity.
  // For EDS, we only render the structure. If Flickity is needed, it must be
  // loaded as a library and initialized explicitly.
  // Example:
  // if (typeof Flickity !== 'undefined') {
  //   new Flickity(mobileSlider, {
  //     wrapAround: false,
  //     lazyLoad: true,
  //     pageDots: true,
  //     prevNextButtons: false,
  //     imagesLoaded: true,
  //     cellAlign: 'left',
  //     adaptiveHeight: true,
  //   });
  // }
}
