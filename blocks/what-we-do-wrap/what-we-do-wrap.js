import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  // Heading
  // Use content detection instead of index access for robustness
  const headingRow = children.find(row => row.querySelector('h2') || (row.children.length === 1 && !row.querySelector('picture') && !row.querySelector('a') && row.textContent.trim().length > 50));
  const headingCell = headingRow ? headingRow.firstElementChild : null;
  if (headingCell) {
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.textContent = headingCell.textContent.trim();
    moveInstrumentation(headingRow, heading);
    sectionHeader.append(heading);
  }

  // Description
  // Use content detection instead of index access for robustness
  const descriptionRow = children.find(row => row !== headingRow && row.children.length === 1 && !row.querySelector('picture') && !row.querySelector('a') && row.textContent.trim().length < 200);
  const descriptionCell = descriptionRow ? descriptionRow.firstElementChild : null;
  if (descriptionCell) {
    const description = document.createElement('p');
    description.classList.add('aos-init', 'aos-animate');
    description.textContent = descriptionCell.textContent.trim();
    moveInstrumentation(descriptionRow, description);
    sectionHeader.append(description);
  }

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  containerDiv.append(sectionHeader);

  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');

  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');
  desktopContainer.append(desktopRow);

  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  mobileContainer.setAttribute('data-aos', 'fade-up');
  mobileContainer.setAttribute('data-aos-offset', '100');
  mobileContainer.setAttribute('data-aos-duration', '650');
  mobileContainer.setAttribute('data-aos-easing', 'ease-in-out');

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider');
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileContainer.append(mobileSlider);

  const mobileSlides = document.createElement('div');
  mobileSlides.classList.add('slides', 'is-selected');
  const mobileRow = document.createElement('div');
  mobileRow.classList.add('row', 'row-cols-1', 'gy-3');
  mobileSlides.append(mobileRow);
  mobileSlider.append(mobileSlides);

  // Filter out heading and description rows to get only business vertical items
  const businessVerticalItems = children.filter(row => row !== headingRow && row !== descriptionRow);

  businessVerticalItems.forEach((row, index) => {
    // Use destructuring for fixed-field item models as per guide
    const [imageCell, titleCell, linkCell] = [...row.children];

    // Desktop item
    const colDesktop = document.createElement('div');
    colDesktop.classList.add('col', 'aos-init', 'aos-animate');
    colDesktop.setAttribute('data-aos', 'fade-up');
    colDesktop.setAttribute('data-aos-delay', `${100 * (index % 3)}`);

    const wrapDesktop = document.createElement('div');
    wrapDesktop.classList.add('wrap');

    const imageDivDesktop = document.createElement('div');
    imageDivDesktop.classList.add('image');
    const pictureDesktop = imageCell.querySelector('picture');
    if (pictureDesktop) {
      const imgDesktop = pictureDesktop.querySelector('img');
      const optimizedPic = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
      optimizedPic.querySelector('img').classList.add('img-fluid'); // Add img-fluid class
      moveInstrumentation(imgDesktop, optimizedPic.querySelector('img'));
      imageDivDesktop.append(optimizedPic);
    }
    wrapDesktop.append(imageDivDesktop);

    const titleDivDesktop = document.createElement('div');
    titleDivDesktop.classList.add('title');
    titleDivDesktop.textContent = titleCell.textContent.trim();
    // Add the SVG icon
    const svgIconDesktop = document.createElement('img');
    svgIconDesktop.loading = 'lazy';
    svgIconDesktop.src = '/content/dam/aemigrate/uploaded-folder/www-mahindra-com/image/tilt-white-arrow-2e81f5.svg'; // Static SVG from original HTML
    svgIconDesktop.alt = titleCell.textContent.trim();
    svgIconDesktop.width = '10';
    svgIconDesktop.height = '29';
    titleDivDesktop.append(svgIconDesktop);
    wrapDesktop.append(titleDivDesktop);

    const linkDesktop = document.createElement('a');
    linkDesktop.classList.add('stretched-link');
    const foundLinkDesktop = linkCell.querySelector('a');
    if (foundLinkDesktop) {
      linkDesktop.href = foundLinkDesktop.href; // Correctly read href, not textContent
      linkDesktop.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    moveInstrumentation(row, wrapDesktop); // Instrument the whole item row
    wrapDesktop.append(linkDesktop);
    colDesktop.append(wrapDesktop);
    desktopRow.append(colDesktop);

    // Mobile item
    const colMobile = document.createElement('div');
    colMobile.classList.add('col');

    const wrapMobile = document.createElement('div');
    wrapMobile.classList.add('wrap');

    const imageDivMobile = document.createElement('div');
    imageDivMobile.classList.add('image');
    const pictureMobile = imageCell.querySelector('picture');
    if (pictureMobile) {
      const imgMobile = pictureMobile.querySelector('img');
      const optimizedPic = createOptimizedPicture(imgMobile.src, imgMobile.alt, false, [{ width: '750' }]);
      optimizedPic.querySelector('img').classList.add('img-fluid'); // Add img-fluid class
      moveInstrumentation(imgMobile, optimizedPic.querySelector('img'));
      imageDivMobile.append(optimizedPic);
    }
    wrapMobile.append(imageDivMobile);

    const titleDivMobile = document.createElement('div');
    titleDivMobile.classList.add('title');
    titleDivMobile.textContent = titleCell.textContent.trim();
    // Add the SVG icon
    const svgIconMobile = document.createElement('img');
    svgIconMobile.loading = 'lazy';
    svgIconMobile.src = '/content/dam/aemigrate/uploaded-folder/www-mahindra-com/image/tilt-white-arrow-2e81f5.svg'; // Static SVG from original HTML
    svgIconMobile.alt = titleCell.textContent.trim();
    svgIconMobile.width = '10';
    svgIconMobile.height = '29';
    titleDivMobile.append(svgIconMobile);
    wrapMobile.append(titleDivMobile);

    const linkMobile = document.createElement('a');
    linkMobile.classList.add('stretched-link');
    const foundLinkMobile = linkCell.querySelector('a');
    if (foundLinkMobile) {
      linkMobile.href = foundLinkMobile.href; // Correctly read href, not textContent
      linkMobile.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    wrapMobile.append(linkMobile);
    colMobile.append(wrapMobile);
    mobileRow.append(colMobile);
  });

  ourBusinessVerticals.append(desktopContainer);
  ourBusinessVerticals.append(mobileContainer);

  block.innerHTML = '';
  block.classList.add('section', 'what-we-do-wrap');
  block.append(containerDiv);
  block.append(ourBusinessVerticals);
}
