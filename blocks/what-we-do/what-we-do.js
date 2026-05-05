import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];
  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  container.append(sectionHeader);

  // Heading and Description
  const [headingRow, descriptionRow, ...businessVerticalRows] = children;

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow, description);
  description.textContent = descriptionRow.textContent.trim();
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

  // Mobile view (slider)
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  mobileContainer.setAttribute('data-aos', 'fade-up');
  mobileContainer.setAttribute('data-aos-offset', '100');
  mobileContainer.setAttribute('data-aos-duration', '650');
  mobileContainer.setAttribute('data-aos-easing', 'ease-in-out');
  ourBusinessVerticals.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider'); // Flickity classes added by JS
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileSlider.setAttribute('tabindex', '0');
  mobileContainer.append(mobileSlider);

  const flickityViewport = document.createElement('div');
  flickityViewport.classList.add('flickity-viewport');
  mobileSlider.append(flickityViewport);

  const flickitySlider = document.createElement('div');
  flickitySlider.classList.add('flickity-slider');
  flickityViewport.append(flickitySlider);

  const flickityPageDots = document.createElement('ol');
  flickityPageDots.classList.add('flickity-page-dots');
  mobileSlider.append(flickityPageDots);

  // Group items for mobile slider (3 items per slide)
  const mobileSlides = [];
  for (let i = 0; i < businessVerticalRows.length; i += 3) {
    mobileSlides.push(businessVerticalRows.slice(i, i + 3));
  }

  businessVerticalRows.forEach((row, index) => {
    const [imageDesktopCell, imageTabletCell, imageMobileCell, titleCell, arrowIconCell, linkCell] = [...row.children];
    moveInstrumentation(row, row); // Instrument the row itself

    const col = document.createElement('div');
    col.classList.add('col', 'aos-init', 'aos-animate');
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', `${(index % 3) * 300 + 100}`); // Stagger delays
    desktopRow.append(col);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');
    col.append(wrap);

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    wrap.append(imageDiv);

    // Desktop image
    const pictureDesktop = imageDesktopCell.querySelector('picture');
    if (pictureDesktop) {
      const optimizedPicDesktop = createOptimizedPicture(
        pictureDesktop.querySelector('img').src,
        pictureDesktop.querySelector('img').alt,
        false,
        [{ media: '(min-width: 992px)', width: '376' }],
      );
      moveInstrumentation(pictureDesktop, optimizedPicDesktop.querySelector('img'));
      imageDiv.append(optimizedPicDesktop);
    }

    // Tablet image (for desktop view, as per original HTML structure)
    const pictureTablet = imageTabletCell.querySelector('picture');
    if (pictureTablet) {
      const optimizedPicTablet = createOptimizedPicture(
        pictureTablet.querySelector('img').src,
        pictureTablet.querySelector('img').alt,
        false,
        [{ media: '(min-width: 450px)', width: '376' }],
      );
      moveInstrumentation(pictureTablet, optimizedPicTablet.querySelector('img'));
      imageDiv.append(optimizedPicTablet);
    }

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = titleCell.textContent.trim();
    wrap.append(titleDiv);

    const arrowIcon = arrowIconCell.querySelector('picture');
    if (arrowIcon) {
      const optimizedArrow = createOptimizedPicture(
        arrowIcon.querySelector('img').src,
        arrowIcon.querySelector('img').alt,
        false,
        [{ width: '10' }],
      );
      moveInstrumentation(arrowIcon, optimizedArrow.querySelector('img'));
      titleDiv.append(optimizedArrow);
    }

    const link = document.createElement('a');
    link.classList.add('stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    moveInstrumentation(linkCell, link);
    wrap.append(link);
  });

  mobileSlides.forEach((slideItems, slideIndex) => {
    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');
    if (slideIndex === 0) {
      slideDiv.classList.add('is-selected');
      const dot = document.createElement('li');
      dot.classList.add('dot', 'is-selected');
      flickityPageDots.append(dot);
    } else {
      const dot = document.createElement('li');
      dot.classList.add('dot');
      flickityPageDots.append(dot);
    }
    flickitySlider.append(slideDiv);

    const slideRow = document.createElement('div');
    slideRow.classList.add('row', 'row-cols-1', 'gy-3');
    slideDiv.append(slideRow);

    slideItems.forEach((row) => {
      const [imageDesktopCell, imageTabletCell, imageMobileCell, titleCell, arrowIconCell, linkCell] = [...row.children];
      // moveInstrumentation(row, row); // Row already instrumented in the desktop loop

      const col = document.createElement('div');
      col.classList.add('col');
      slideRow.append(col);

      const wrap = document.createElement('div');
      wrap.classList.add('wrap');
      col.append(wrap);

      const imageDiv = document.createElement('div');
      imageDiv.classList.add('image');
      wrap.append(imageDiv);

      // Mobile image (for mobile slider)
      const pictureMobile = imageMobileCell.querySelector('picture');
      if (pictureMobile) {
        const optimizedPicMobile = createOptimizedPicture(
          pictureMobile.querySelector('img').src,
          pictureMobile.querySelector('img').alt,
          false,
          [{ media: '(max-width: 449px)', width: '376' }], // Corrected media query for mobile
        );
        moveInstrumentation(pictureMobile, optimizedPicMobile.querySelector('img'));
        imageDiv.append(optimizedPicMobile);
      }

      // Desktop image (for mobile slider, as per original HTML structure)
      const pictureDesktop = imageDesktopCell.querySelector('picture');
      if (pictureDesktop) {
        const optimizedPicDesktop = createOptimizedPicture(
          pictureDesktop.querySelector('img').src,
          pictureDesktop.querySelector('img').alt,
          false,
          [{ media: '(min-width: 992px)', width: '376' }],
        );
        moveInstrumentation(pictureDesktop, optimizedPicDesktop.querySelector('img'));
        imageDiv.append(optimizedPicDesktop);
      }

      const titleDiv = document.createElement('div');
      titleDiv.classList.add('title');
      titleDiv.textContent = titleCell.textContent.trim();
      wrap.append(titleDiv);

      const arrowIcon = arrowIconCell.querySelector('picture');
      if (arrowIcon) {
        const optimizedArrow = createOptimizedPicture(
          arrowIcon.querySelector('img').src,
          arrowIcon.querySelector('img').alt,
          false,
          [{ width: '10' }],
        );
        moveInstrumentation(arrowIcon, optimizedArrow.querySelector('img'));
        titleDiv.append(optimizedArrow);
      }

      const link = document.createElement('a');
      link.classList.add('stretched-link');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
      }
      moveInstrumentation(linkCell, link);
      wrap.append(link);
    });
  });

  block.replaceChildren(section);

  // Load Flickity for mobile slider
  await loadCSS('/blocks/what-we-do/flickity.min.css'); // Assuming flickity.min.css is local to the block
  await loadScript('/blocks/what-we-do/flickity.pkgd.min.js'); // Assuming flickity.pkgd.min.js is local to the block

  // eslint-disable-next-line no-undef
  if (typeof Flickity === 'function') {
    // eslint-disable-next-line no-new, no-undef
    new Flickity(mobileSlider, {
      wrapAround: mobileSlider.dataset.flickity.includes('"wrapAround": true'),
      lazyLoad: mobileSlider.dataset.flickity.includes('"lazyLoad": true'),
      pageDots: mobileSlider.dataset.flickity.includes('"pageDots": true'),
      prevNextButtons: mobileSlider.dataset.flickity.includes('"prevNextButtons": true'),
      imagesLoaded: mobileSlider.dataset.flickity.includes('"imagesLoaded": true'),
      cellAlign: mobileSlider.dataset.flickity.includes('"cellAlign": "left"') ? 'left' : 'center',
      adaptiveHeight: mobileSlider.dataset.flickity.includes('"adaptiveHeight": true'),
    });
  }
}
