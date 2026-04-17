import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  container.append(sectionHeader);

  const [headingRow, descriptionRow, ...itemRows] = [...block.children];

  // Heading
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.textContent.trim();
  moveInstrumentation(headingRow, heading);
  sectionHeader.append(heading);

  // Description
  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.textContent = descriptionRow.textContent.trim();
  moveInstrumentation(descriptionRow, description);
  sectionHeader.append(description);

  // Business Verticals
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

  // Mobile view (Flickity slider)
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  mobileContainer.setAttribute('data-aos', 'fade-up');
  mobileContainer.setAttribute('data-aos-offset', '100');
  mobileContainer.setAttribute('data-aos-duration', '650');
  mobileContainer.setAttribute('data-aos-easing', 'ease-in-out');
  ourBusinessVerticals.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider');
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileContainer.append(mobileSlider);

  const slidesWrapper = document.createElement('div');
  slidesWrapper.classList.add('slides');
  mobileSlider.append(slidesWrapper);

  const mobileSlidesRow = document.createElement('div');
  mobileSlidesRow.classList.add('row', 'row-cols-1', 'gy-3');
  slidesWrapper.append(mobileSlidesRow);

  itemRows.forEach((row, index) => {
    // Use content detection instead of direct index access for item cells
    const cells = [...row.children];
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const titleCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('img') && !cell.querySelector('a'));
    const iconCell = cells.find(cell => cell.querySelector('img') && !cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    // Desktop item
    const colDesktop = document.createElement('div');
    colDesktop.classList.add('col', 'aos-init', 'aos-animate');
    colDesktop.setAttribute('data-aos', 'fade-up');
    colDesktop.setAttribute('data-aos-delay', `${(index % 3) * 300 + 100}`); // Staggered animation
    desktopRow.append(colDesktop);

    const wrapDesktop = document.createElement('div');
    wrapDesktop.classList.add('wrap');
    colDesktop.append(wrapDesktop);

    const imageDivDesktop = document.createElement('div');
    imageDivDesktop.classList.add('image');
    if (imageCell) { // Ensure imageCell exists
      const pictureDesktop = imageCell.querySelector('picture');
      if (pictureDesktop) {
        const imgDesktop = pictureDesktop.querySelector('img');
        const optimizedPic = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
        moveInstrumentation(imgDesktop, optimizedPic.querySelector('img'));
        imageDivDesktop.append(optimizedPic);
      }
    }
    wrapDesktop.append(imageDivDesktop);

    const titleDivDesktop = document.createElement('div');
    titleDivDesktop.classList.add('title');
    if (titleCell) { // Ensure titleCell exists
      titleDivDesktop.textContent = titleCell.textContent.trim();
    }
    if (iconCell) { // Ensure iconCell exists
      const iconImageDesktop = iconCell.querySelector('img');
      if (iconImageDesktop) {
        const iconImg = document.createElement('img');
        iconImg.src = iconImageDesktop.src;
        iconImg.alt = iconImageDesktop.alt;
        titleDivDesktop.append(iconImg);
      }
    }
    wrapDesktop.append(titleDivDesktop);

    const linkDesktop = document.createElement('a');
    linkDesktop.classList.add('stretched-link');
    if (linkCell) { // Ensure linkCell exists
      const authoredLinkDesktop = linkCell.querySelector('a');
      if (authoredLinkDesktop) {
        linkDesktop.href = authoredLinkDesktop.href;
        linkDesktop.setAttribute('aria-label', `Learn more about ${titleCell ? titleCell.textContent.trim() : ''}`);
      }
    }
    wrapDesktop.append(linkDesktop);
    moveInstrumentation(row, wrapDesktop);


    // Mobile item (for slider)
    const colMobile = document.createElement('div');
    colMobile.classList.add('col');
    mobileSlidesRow.append(colMobile);

    const wrapMobile = document.createElement('div');
    wrapMobile.classList.add('wrap');
    colMobile.append(wrapMobile);

    const imageDivMobile = document.createElement('div');
    imageDivMobile.classList.add('image');
    if (imageCell) { // Ensure imageCell exists
      const pictureMobile = imageCell.querySelector('picture');
      if (pictureMobile) {
        const imgMobile = pictureMobile.querySelector('img');
        const optimizedPic = createOptimizedPicture(imgMobile.src, imgMobile.alt, false, [{ width: '750' }]);
        moveInstrumentation(imgMobile, optimizedPic.querySelector('img'));
        imageDivMobile.append(optimizedPic);
      }
    }
    wrapMobile.append(imageDivMobile);

    const titleDivMobile = document.createElement('div');
    titleDivMobile.classList.add('title');
    if (titleCell) { // Ensure titleCell exists
      titleDivMobile.textContent = titleCell.textContent.trim();
    }
    if (iconCell) { // Ensure iconCell exists
      const iconImageMobile = iconCell.querySelector('img');
      if (iconImageMobile) {
        const iconImg = document.createElement('img');
        iconImg.src = iconImageMobile.src;
        iconImg.alt = iconImageMobile.alt;
        titleDivMobile.append(iconImg);
      }
    }
    wrapMobile.append(titleDivMobile);

    const linkMobile = document.createElement('a');
    linkMobile.classList.add('stretched-link');
    if (linkCell) { // Ensure linkCell exists
      const authoredLinkMobile = linkCell.querySelector('a');
      if (authoredLinkMobile) {
        linkMobile.href = authoredLinkMobile.href;
        linkMobile.setAttribute('aria-label', `Learn more about ${titleCell ? titleCell.textContent.trim() : ''}`);
      }
    }
    wrapMobile.append(linkMobile);
  });

  block.innerHTML = '';
  block.append(section);
}
