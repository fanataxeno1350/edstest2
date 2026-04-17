import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  container.append(sectionHeader);

  // Heading and Description are the first two rows
  const headingRow = children[0];
  const descriptionRow = children[1];
  const itemRows = children.slice(2);

  // Heading
  if (headingRow) {
    const headingCell = [...headingRow.children].find((cell) => cell.textContent.trim() !== '');
    if (headingCell) {
      const heading = document.createElement('h2');
      heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
      heading.textContent = headingCell.textContent.trim();
      moveInstrumentation(headingRow, heading);
      sectionHeader.append(heading);
    }
  }

  // Description
  if (descriptionRow) {
    const descriptionCell = [...descriptionRow.children].find((cell) => cell.textContent.trim() !== '');
    if (descriptionCell) {
      const description = document.createElement('p');
      description.classList.add('aos-init', 'aos-animate');
      description.textContent = descriptionCell.textContent.trim();
      moveInstrumentation(descriptionRow, description);
      sectionHeader.append(description);
    }
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

  // Mobile slider view
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

  const mobileSlides = document.createElement('div');
  mobileSlides.classList.add('slides');
  mobileSlider.append(mobileSlides);

  const mobileInnerRow = document.createElement('div');
  mobileInnerRow.classList.add('row', 'row-cols-1', 'gy-3');
  mobileSlides.append(mobileInnerRow);

  itemRows.forEach((row, index) => {
    const cells = [...row.children];
    const imageCell = cells.find((cell) => cell.querySelector('picture'));
    const titleCell = cells.find((cell) => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim() !== '');
    const titleIconCell = cells.find((cell) => cell !== imageCell && cell.querySelector('picture'));
    const linkCell = cells.find((cell) => cell.querySelector('a'));

    // Create item for desktop view
    const colDesktop = document.createElement('div');
    colDesktop.classList.add('col', 'aos-init', 'aos-animate');
    colDesktop.setAttribute('data-aos', 'fade-up');
    colDesktop.setAttribute('data-aos-delay', `${(index % 3) * 300 + 100}`); // Stagger delay
    desktopRow.append(colDesktop);

    const wrapDesktop = document.createElement('div');
    wrapDesktop.classList.add('wrap');
    colDesktop.append(wrapDesktop);

    const imageDivDesktop = document.createElement('div');
    imageDivDesktop.classList.add('image');
    wrapDesktop.append(imageDivDesktop);

    if (imageCell) {
      const pictureDesktop = imageCell.querySelector('picture');
      if (pictureDesktop) {
        const img = pictureDesktop.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageDivDesktop.append(optimizedPic);
      }
    }

    const titleDivDesktop = document.createElement('div');
    titleDivDesktop.classList.add('title');
    if (titleCell) {
      titleDivDesktop.textContent = titleCell.textContent.trim();
    }
    wrapDesktop.append(titleDivDesktop);

    if (titleIconCell) {
      const titleIconPictureDesktop = titleIconCell.querySelector('picture');
      if (titleIconPictureDesktop) {
        const titleIconImg = titleIconPictureDesktop.querySelector('img');
        if (titleIconImg) {
          titleDivDesktop.append(titleIconImg);
        }
      }
    }

    const linkDesktop = document.createElement('a');
    linkDesktop.classList.add('stretched-link');
    if (linkCell) {
      const foundLinkDesktop = linkCell.querySelector('a');
      if (foundLinkDesktop) {
        linkDesktop.href = foundLinkDesktop.href;
        linkDesktop.setAttribute('aria-label', `Learn more about ${titleCell?.textContent.trim() || ''}`);
      }
    }
    moveInstrumentation(row, linkDesktop);
    wrapDesktop.append(linkDesktop);

    // Create item for mobile view
    const colMobile = document.createElement('div');
    colMobile.classList.add('col');
    mobileInnerRow.append(colMobile);

    const wrapMobile = document.createElement('div');
    wrapMobile.classList.add('wrap');
    colMobile.append(wrapMobile);

    const imageDivMobile = document.createElement('div');
    imageDivMobile.classList.add('image');
    wrapMobile.append(imageDivMobile);

    if (imageCell) {
      const pictureMobile = imageCell.querySelector('picture');
      if (pictureMobile) {
        const img = pictureMobile.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageDivMobile.append(optimizedPic);
      }
    }

    const titleDivMobile = document.createElement('div');
    titleDivMobile.classList.add('title');
    if (titleCell) {
      titleDivMobile.textContent = titleCell.textContent.trim();
    }
    wrapMobile.append(titleDivMobile);

    if (titleIconCell) {
      const titleIconPictureMobile = titleIconCell.querySelector('picture');
      if (titleIconPictureMobile) {
        const titleIconImg = titleIconPictureMobile.querySelector('img');
        if (titleIconImg) {
          titleDivMobile.append(titleIconImg);
        }
      }
    }

    const linkMobile = document.createElement('a');
    linkMobile.classList.add('stretched-link');
    if (linkCell) {
      const foundLinkMobile = linkCell.querySelector('a');
      if (foundLinkMobile) {
        linkMobile.href = foundLinkMobile.href;
        linkMobile.setAttribute('aria-label', `Learn more about ${titleCell?.textContent.trim() || ''}`);
      }
    }
    wrapMobile.append(linkMobile);
  });

  block.replaceWith(section);

  // Dynamically load Flickity for mobile slider
  const loadFlickity = async () => {
    const { default: Flickity } = await import('flickity');
    // eslint-disable-next-line no-new
    new Flickity(mobileSlider, {
      wrapAround: false,
      lazyLoad: true,
      pageDots: true,
      prevNextButtons: false,
      imagesLoaded: true,
      cellAlign: 'left',
      adaptiveHeight: true,
    });
  };

  if (window.innerWidth < 992) {
    loadFlickity();
  } else {
    window.addEventListener('resize', () => {
      if (window.innerWidth < 992 && !mobileSlider.flickity) {
        loadFlickity();
      }
    });
  }
}
