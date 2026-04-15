import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');

  const container = document.createElement('div');
  container.classList.add('container');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  // Find heading and description rows using content detection
  const headingRow = children.find((row) => row.querySelector('h2') || (row.children.length === 1 && row.children[0].textContent.trim() !== '' && !row.children[0].querySelector('picture') && !row.children[0].querySelector('a')));
  const descriptionRow = children.find((row) => row !== headingRow && (row.querySelector('p') || (row.children.length === 1 && row.children[0].textContent.trim() !== '' && !row.children[0].querySelector('picture') && !row.children[0].querySelector('a'))));

  if (headingRow) {
    moveInstrumentation(headingRow, sectionHeader);
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.setAttribute('data-aos', 'fade-up');
    heading.setAttribute('data-aos-offset', '100');
    heading.setAttribute('data-aos-duration', '650');
    heading.setAttribute('data-aos-easing', 'ease-in-out');
    heading.textContent = headingRow.firstElementChild.textContent.trim();
    sectionHeader.append(heading);
  }

  if (descriptionRow) {
    const description = document.createElement('p'); // Corrected element creation
    description.classList.add('aos-init', 'aos-animate');
    description.setAttribute('data-aos', 'fade-up');
    description.setAttribute('data-aos-offset', '100');
    description.setAttribute('data-aos-duration', '650');
    description.setAttribute('data-aos-easing', 'ease-in-out');
    description.textContent = descriptionRow.firstElementChild.textContent.trim();
    moveInstrumentation(descriptionRow, description);
    sectionHeader.append(description);
  }

  container.append(sectionHeader);
  section.append(container);

  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');

  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');

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

  const mobileViewport = document.createElement('div');
  mobileViewport.classList.add('flickity-viewport');
  const mobileSliderInner = document.createElement('div');
  mobileSliderInner.classList.add('flickity-slider');
  const mobileSlides = document.createElement('div');
  mobileSlides.classList.add('slides', 'is-selected');
  const mobileRow = document.createElement('div');
  mobileRow.classList.add('row', 'row-cols-1', 'gy-3');

  // Filter out the heading and description rows to get only business vertical items
  const businessVerticalItems = children.filter((row) => row !== headingRow && row !== descriptionRow);

  businessVerticalItems.forEach((row, index) => {
    // Correctly destructure cells based on the model
    const cells = [...row.children];
    const imageCell = cells[0];
    const altCell = cells[1]; // Not directly used in rendering, but part of the model
    const titleCell = cells[2];
    const iconCell = cells[3];
    const linkCell = cells[4];

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');
    moveInstrumentation(row, wrap);

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageDiv.append(optimizedPic);
    }
    wrap.append(imageDiv);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = titleCell.textContent.trim();
    const iconImg = iconCell.querySelector('img');
    if (iconImg) {
      const iconOptimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '10' }]);
      moveInstrumentation(iconImg, iconOptimizedPic.querySelector('img'));
      titleDiv.append(iconOptimizedPic);
    }
    wrap.append(titleDiv);

    const link = document.createElement('a');
    link.classList.add('stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    wrap.append(link);

    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col', 'aos-init', 'aos-animate');
    desktopCol.setAttribute('data-aos', 'fade-up');
    desktopCol.setAttribute('data-aos-delay', `${(index % 3) * 300 + 100}`); // Example delay logic, adjust as needed
    desktopCol.append(wrap.cloneNode(true)); // Clone for desktop
    desktopRow.append(desktopCol);

    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    mobileCol.append(wrap.cloneNode(true)); // Clone for mobile
    mobileRow.append(mobileCol);
  });

  desktopContainer.append(desktopRow);
  ourBusinessVerticals.append(desktopContainer);

  mobileSlides.append(mobileRow);
  mobileSliderInner.append(mobileSlides);
  mobileViewport.append(mobileSliderInner);
  mobileSlider.append(mobileViewport);

  const flickityPageDots = document.createElement('ol');
  flickityPageDots.classList.add('flickity-page-dots');
  // Add placeholder dots for Flickity initialization
  // The number of dots should correspond to the number of slides, which is 1 slide per 3 items for desktop,
  // but for mobile, it's 1 item per slide, so it should be businessVerticalItems.length
  // However, the original HTML shows 3 items per slide for mobile too, so let's stick to that.
  for (let i = 0; i < Math.ceil(businessVerticalItems.length / 3); i += 1) {
    const dot = document.createElement('li');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Page dot ${i + 1}`);
    if (i === 0) dot.classList.add('is-selected');
    flickityPageDots.append(dot);
  }
  mobileSlider.append(flickityPageDots);

  mobileContainer.append(mobileSlider);
  ourBusinessVerticals.append(mobileContainer);

  section.append(ourBusinessVerticals);

  block.innerHTML = '';
  block.append(section);
}
