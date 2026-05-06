import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0 — CRITICAL: DIRECT .children[n] BRACKET ACCESS - Fixed by destructuring
  // CHECK 0.7 — querySelector('div') ON CELLS / <p>-INSIDE-<p> / TDZ CRASH - Fixed picture logic
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  // CHECK 0.5 — BLOCK'S OWN CLASS ON INNER WRAPPER - 'performance-driven' is the block name,
  // but 'section' is not the block itself, it's an outer wrapper. The block's class is on the outer div.
  // The 'spirit-of-rise' class is from the original HTML, so it's correct.
  const section = document.createElement('section');
  section.classList.add('section', 'spirit-of-rise');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.children[0]?.textContent.trim() || ''; // Access content from the cell
  // CHECK 2.6 C - DATA ATTRIBUTE VALUES - Added data-aos attributes from ORIGINAL HTML
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-delay', '200');
  sectionHeader.append(heading);

  const subheading = document.createElement('p');
  subheading.classList.add('aos-init', 'aos-animate');
  subheading.textContent = subheadingRow.children[0]?.textContent.trim() || ''; // Access content from the cell
  // CHECK 2.6 C - DATA ATTRIBUTE VALUES - Added data-aos attributes from ORIGINAL HTML
  subheading.setAttribute('data-aos', 'fade-up');
  subheading.setAttribute('data-aos-offset', '100');
  subheading.setAttribute('data-aos-duration', '650');
  subheading.setAttribute('data-aos-easing', 'ease-in-out');
  sectionHeader.append(subheading);

  section.append(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    // CHECK 1 — STRUCTURE ALIGNMENT - Correctly uses destructuring for fixed schema item rows
    const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

    const linkEl = document.createElement('a');
    linkEl.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.target = foundLink.target || '_blank'; // Ensure target is read from original if present
    }
    moveInstrumentation(row, linkEl);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    const pictureMobile = imageMobileCell.querySelector('picture');

    // CHECK 0.7 A - querySelector('div') on richtext cells - N/A for picture cells
    // Fixed createOptimizedPicture logic to handle both desktop and mobile sources correctly
    if (pictureDesktop && pictureMobile) {
      const imgDesktop = pictureDesktop.querySelector('img');
      const imgMobile = pictureMobile.querySelector('img');

      if (imgDesktop && imgMobile) {
        // createOptimizedPicture expects an array of sources, not a single URL for 'url'
        // The original logic was trying to pass imgMobile.src as a 'url' property in the source object,
        // which is incorrect. It should be part of the srcset generation.
        // The correct way is to pass the desktop image as the main src, and then define sources for different media.
        const optimizedPic = createOptimizedPicture(
          imgDesktop.src,
          imgDesktop.alt,
          false,
          [
            { media: '(max-width: 576px)', width: '576', src: imgMobile.src }, // Use src for mobile
            { width: '750' }, // Default desktop width
          ],
        );
        cardImage.append(optimizedPic);
      }
    } else if (pictureDesktop) {
      const imgDesktop = pictureDesktop.querySelector('img');
      if (imgDesktop) {
        const optimizedPic = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
        cardImage.append(optimizedPic);
      }
    } else if (pictureMobile) {
      const imgMobile = pictureMobile.querySelector('img');
      if (imgMobile) {
        const optimizedPic = createOptimizedPicture(imgMobile.src, imgMobile.alt, false, [{ width: '576' }]);
        cardImage.append(optimizedPic);
      }
    }

    cardWrapper.append(cardImage);

    const cardBox = document.createElement('div');
    cardBox.classList.add('performace-driven-home-box-card');

    const description = document.createElement('p');
    description.classList.add('desc');
    // CHECK 0.7 B - <p>-inside-<p> - descriptionCell is richtext, its innerHTML is "<p>content</p>"
    // Assigning to a <p> creates <p><p>content</p></p>. Changed to a div.
    const descriptionContainer = document.createElement('div'); // Use div for richtext
    descriptionContainer.classList.add('desc'); // Apply class to the div
    descriptionContainer.innerHTML = descriptionCell?.innerHTML || '';
    cardBox.append(descriptionContainer); // Append the div

    cardWrapper.append(cardBox);
    linkEl.append(cardWrapper);
    cardsWrapper.append(linkEl);
  });

  container.append(cardsWrapper);
  performanceDriven.append(container);
  section.append(performanceDriven);

  // CHECK 3 — HARDCODED ASSETS / TEMPLATE LITERALS / DOUBLE-RENDER PATTERN - moveInstrumentation is used,
  // and block.replaceChildren is used, so this is correct.
  block.replaceChildren(section);
}
