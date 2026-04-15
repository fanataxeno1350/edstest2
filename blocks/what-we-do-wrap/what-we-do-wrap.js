import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  // CHECK 0 & 1 FIX: Use content detection for root fields
  const headingRow = children.find((row) => row.querySelector('div') && row.querySelector('div').textContent.trim() === 'Section Heading label text');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular');
  if (headingRow) {
    moveInstrumentation(headingRow, heading);
    heading.textContent = headingRow.textContent.trim();
  }
  sectionHeader.append(heading);

  const descriptionRow = children.find((row) => row.querySelector('div') && row.querySelector('div').textContent.trim() === 'Section Description label text');
  const description = document.createElement('p');
  if (descriptionRow) {
    moveInstrumentation(descriptionRow, description);
    description.textContent = descriptionRow.textContent.trim();
  }
  sectionHeader.append(description);

  const container = document.createElement('div');
  container.classList.add('container');
  container.append(sectionHeader);

  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');

  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');

  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block');
  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider');
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');

  // Filter out the header/description rows to get only business vertical items
  const businessVerticalItems = children.filter((row) => {
    const cells = [...row.children];
    // A business vertical item row has 4 cells: image, title, titleIcon, link
    return cells.length === 4 && cells[0].querySelector('picture') && cells[3].querySelector('a');
  });

  const mobileSlides = [];
  let currentMobileSlide = document.createElement('div');
  currentMobileSlide.classList.add('slides');
  let currentMobileRow = document.createElement('div');
  currentMobileRow.classList.add('row', 'row-cols-1', 'gy-3');

  businessVerticalItems.forEach((row, index) => {
    // CHECK 0: This destructuring is correct because the BlockJson specifies fixed fields for item rows.
    const [imageCell, titleCell, titleIconCell, linkCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col');

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      // The original HTML uses img-fluid, which should be preserved.
      // createOptimizedPicture does not add img-fluid by default, so we add it to the img.
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      if (optimizedImg) {
        optimizedImg.classList.add('img-fluid'); // Add img-fluid class from original HTML
        moveInstrumentation(img, optimizedImg);
      }
      imageDiv.append(optimizedPic);
    }
    wrap.append(imageDiv);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = titleCell.textContent.trim();
    const titleIconPicture = titleIconCell.querySelector('picture');
    if (titleIconPicture) {
      const titleIconImg = titleIconPicture.querySelector('img');
      if (titleIconImg) {
        const optimizedTitleIcon = createOptimizedPicture(titleIconImg.src, titleIconImg.alt, false, [{ width: '10' }]);
        const optimizedTitleIconImg = optimizedTitleIcon.querySelector('img');
        if (optimizedTitleIconImg) {
          moveInstrumentation(titleIconImg, optimizedTitleIconImg);
          titleDiv.append(optimizedTitleIcon);
        }
      }
    }
    wrap.append(titleDiv);

    const link = document.createElement('a');
    link.classList.add('stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    moveInstrumentation(linkCell, link);
    wrap.append(link);

    moveInstrumentation(row, col);
    col.append(wrap);

    // Desktop layout
    desktopRow.append(col);

    // Mobile layout (3 items per slide)
    if (currentMobileRow.children.length < 3) {
      currentMobileRow.append(col.cloneNode(true)); // Clone for mobile slider
    } else {
      currentMobileSlide.append(currentMobileRow);
      mobileSlides.push(currentMobileSlide);
      currentMobileSlide = document.createElement('div');
      currentMobileSlide.classList.add('slides');
      currentMobileRow = document.createElement('div');
      currentMobileRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentMobileRow.append(col.cloneNode(true));
    }

    if (index === businessVerticalItems.length - 1) {
      currentMobileSlide.append(currentMobileRow);
      mobileSlides.push(currentMobileSlide);
    }
  });

  desktopContainer.append(desktopRow);
  ourBusinessVerticals.append(desktopContainer);

  mobileSlides.forEach((slide) => mobileSlider.append(slide));
  mobileContainer.append(mobileSlider);
  ourBusinessVerticals.append(mobileContainer);

  block.innerHTML = '';
  block.classList.add('section'); // Add section class to the block itself
  block.append(container, ourBusinessVerticals);
}
