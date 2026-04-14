import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...businessVerticalRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow.firstElementChild, heading);
  heading.textContent = headingRow.firstElementChild.textContent.trim();
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow.firstElementChild, description);
  description.innerHTML = descriptionRow.firstElementChild.innerHTML;
  sectionHeader.append(description);

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  containerDiv.append(sectionHeader);

  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');

  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');

  businessVerticalRows.forEach((row) => {
    const col = document.createElement('div');
    col.classList.add('col', 'aos-init', 'aos-animate');
    moveInstrumentation(row, col);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    // Access cells directly based on BlockJson model order
    const cells = [...row.children];
    const imageCell = cells[0]; // field="image"
    const altCell = cells[1];   // field="alt"
    const titleCell = cells[2]; // field="title"
    const iconCell = cells[3];  // field="icon"
    const linkCell = cells[4];   // field="link"

    if (imageCell) {
      const imageDiv = document.createElement('div');
      imageDiv.classList.add('image');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, altCell?.textContent.trim() || img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageDiv.append(optimizedPic);
      }
      wrap.append(imageDiv);
    }

    if (titleCell || iconCell) {
      const titleDiv = document.createElement('div');
      titleDiv.classList.add('title');
      if (titleCell) {
        moveInstrumentation(titleCell, titleDiv);
        titleDiv.textContent = titleCell.textContent.trim();
      }
      if (iconCell) {
        const iconPicture = iconCell.querySelector('picture');
        if (iconPicture) {
          const iconImg = iconPicture.querySelector('img');
          const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '10' }]);
          moveInstrumentation(iconImg, optimizedIcon.querySelector('img'));
          titleDiv.append(' ', optimizedIcon); // Add a space before the icon
        }
      }
      wrap.append(titleDiv);
    }

    if (linkCell) {
      const link = document.createElement('a');
      link.classList.add('stretched-link');
      const originalLink = linkCell.querySelector('a');
      if (originalLink) {
        link.href = originalLink.href;
        link.setAttribute('aria-label', originalLink.textContent.trim());
      }
      moveInstrumentation(linkCell, link);
      wrap.append(link);
    }

    col.append(wrap);
    desktopRow.append(col);
  });

  desktopContainer.append(desktopRow);
  ourBusinessVerticals.append(desktopContainer);

  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  mobileContainer.setAttribute('data-aos', 'fade-up');
  mobileContainer.setAttribute('data-aos-offset', '100');
  mobileContainer.setAttribute('data-aos-duration', '650');
  mobileContainer.setAttribute('data-aos-easing', 'ease-in-out');

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider');
  // Data attributes are inert, so we don't copy them.
  // The original HTML has flickity-enabled and is-draggable, but these are added by JS.
  // We only add classes that are present on initial load.

  // For mobile, group items into slides (3 items per slide based on original HTML)
  const slides = [];
  for (let i = 0; i < businessVerticalRows.length; i += 3) {
    slides.push(businessVerticalRows.slice(i, i + 3));
  }

  slides.forEach((slideItems, slideIndex) => {
    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');
    if (slideIndex === 0) {
      slideDiv.classList.add('is-selected');
    }

    const row = document.createElement('div');
    row.classList.add('row', 'row-cols-1', 'gy-3');

    slideItems.forEach((itemRow) => {
      const col = document.createElement('div');
      col.classList.add('col');
      moveInstrumentation(itemRow, col);

      const wrap = document.createElement('div');
      wrap.classList.add('wrap');

      // Access cells directly based on BlockJson model order
      const cells = [...itemRow.children];
      const imageCell = cells[0]; // field="image"
      const altCell = cells[1];   // field="alt"
      const titleCell = cells[2]; // field="title"
      const iconCell = cells[3];  // field="icon"
      const linkCell = cells[4];   // field="link"

      if (imageCell) {
        const imageDiv = document.createElement('div');
        imageDiv.classList.add('image');
        const picture = imageCell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          const optimizedPic = createOptimizedPicture(img.src, altCell?.textContent.trim() || img.alt, false, [{ width: '376' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          imageDiv.append(optimizedPic);
        }
        wrap.append(imageDiv);
      }

      if (titleCell || iconCell) {
        const titleDiv = document.createElement('div');
        titleDiv.classList.add('title');
        if (titleCell) {
          moveInstrumentation(titleCell, titleDiv);
          titleDiv.textContent = titleCell.textContent.trim();
        }
        if (iconCell) {
          const iconPicture = iconCell.querySelector('picture');
          if (iconPicture) {
            const iconImg = iconPicture.querySelector('img');
            const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '10' }]);
            moveInstrumentation(iconImg, optimizedIcon.querySelector('img'));
            titleDiv.append(' ', optimizedIcon);
          }
        }
        wrap.append(titleDiv);
      }

      if (linkCell) {
        const link = document.createElement('a');
        link.classList.add('stretched-link');
        const originalLink = linkCell.querySelector('a');
        if (originalLink) {
          link.href = originalLink.href;
          link.setAttribute('aria-label', originalLink.textContent.trim());
        }
        moveInstrumentation(linkCell, link);
        wrap.append(link);
      }

      col.append(wrap);
      row.append(col);
    });
    slideDiv.append(row);
    mobileSlider.append(slideDiv);
  });

  // Add Flickity-like page dots for mobile
  if (slides.length > 1) {
    const pageDots = document.createElement('ol');
    pageDots.classList.add('flickity-page-dots');
    slides.forEach((_, index) => {
      const dot = document.createElement('li');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', `Page dot ${index + 1}`);
      if (index === 0) {
        dot.classList.add('is-selected');
        dot.setAttribute('aria-current', 'step');
      }
      // Add event listener for dot navigation (simplified, full Flickity logic is complex)
      dot.addEventListener('click', () => {
        mobileSlider.querySelectorAll('.slides').forEach(s => s.classList.remove('is-selected'));
        mobileSlider.querySelectorAll('.flickity-page-dots .dot').forEach(d => {
          d.classList.remove('is-selected');
          d.removeAttribute('aria-current');
        });
        mobileSlider.children[index].classList.add('is-selected');
        dot.classList.add('is-selected');
        dot.setAttribute('aria-current', 'step');
      });
      pageDots.append(dot);
    });
    mobileContainer.append(mobileSlider, pageDots);
  } else {
    mobileContainer.append(mobileSlider);
  }


  ourBusinessVerticals.append(mobileContainer);

  block.textContent = '';
  block.append(containerDiv, ourBusinessVerticals);
}
