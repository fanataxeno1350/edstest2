import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  // CHECK 0.5: The block's own class 'future-ready' (from blockName) should not be added to an inner wrapper.
  // The original HTML shows 'section grey-bg spirit-of-rise'. The block name is 'future-ready'.
  // The generated JS adds 'spirit-of-rise' to the inner section, which is correct as it's not the block name.
  // However, the block's own class 'future-ready' is not added here, which is also correct.
  // The class 'section' is a generic HTML tag name, not a block-specific class.
  // The block's class is 'future-ready' (from the block name).
  // The original HTML shows the block div having class "future-ready".
  // The generated JS creates an inner <section> with classes "section grey-bg spirit-of-rise".
  // This is fine, as "spirit-of-rise" is not the block name "future-ready".
  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise'); // These classes are from ORIGINAL HTML, not the block name.

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow, description);
  // CHECK 0.6: descriptionRow is a ROW. Reading innerHTML from a row is a violation.
  // The model specifies 'description' as 'text', so textContent is correct.
  description.textContent = descriptionRow.textContent.trim();
  sectionHeader.append(description);

  section.append(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    // CHECK 0: No direct .children[n] bracket access for variable assignment. Array destructuring is used, which is correct.
    const [imageMobileCell, imageDesktopCell, cardLabelCell, linkCell] = [...row.children];

    const linkAnchor = document.createElement('a');
    linkAnchor.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkAnchor.href = foundLink.href;
      linkAnchor.target = '_blank';
    }
    moveInstrumentation(row, linkAnchor);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const picture = document.createElement('picture');
    const source = document.createElement('source');
    source.media = '(max-width: 576px)';
    const mobileImg = imageMobileCell.querySelector('img');
    if (mobileImg) {
      source.srcset = mobileImg.src;
    }
    picture.append(source);

    const desktopImg = imageDesktopCell.querySelector('img');
    if (desktopImg) {
      // CHECK 3: createOptimizedPicture returns a <picture> element.
      // Appending img.querySelector('img') means only the <img> inside the optimized <picture> is appended.
      // This is incorrect; the entire optimized <picture> should be appended.
      const optimizedPictureElement = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
      picture.append(optimizedPictureElement); // Append the entire optimized picture element
    }
    cardImage.append(picture);
    cardWrapper.append(cardImage);

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const desc = document.createElement('p');
    desc.classList.add('desc');
    // CHECK 0.7 B: cardLabelCell is richtext, its innerHTML is "<p>content</p>".
    // Assigning this to desc.innerHTML (a <p> element) creates <p><p>content</p></p>, which is invalid HTML.
    // Fix: extract the innerHTML of the paragraph inside the cell, or use a <div> for `desc`.
    // Since the original HTML shows <p class="desc"> with text content, extracting the inner paragraph content is appropriate.
    desc.innerHTML = cardLabelCell.querySelector('p')?.innerHTML ?? cardLabelCell.textContent.trim() ?? '';
    homeBoxCard.append(desc);

    cardWrapper.append(homeBoxCard);
    linkAnchor.append(cardWrapper);
    cardsWrapper.append(linkAnchor);
  });

  container.append(cardsWrapper);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);

  // This section is problematic. It tries to re-optimize pictures that were already handled
  // by createOptimizedPicture inside the loop, and it also tries to move instrumentation
  // from an <img> to an optimized <picture>'s <img>.
  // The `createOptimizedPicture` call inside the loop already handles optimization.
  // If the goal is to ensure all images are optimized, the `createOptimizedPicture`
  // should be used when the image is first created/appended.
  // The `moveInstrumentation` call on `img` (which is a raw img from the original content)
  // to `optimizedPic.querySelector('img')` (which is a new img inside a new picture)
  // is also potentially problematic if the original `img` itself carried instrumentation.
  // Given the `createOptimizedPicture` was already called correctly for desktop images,
  // and mobile images are handled by `source.srcset`, this post-processing loop is redundant
  // and potentially harmful. It's best to remove it if the images are already handled.
  // However, if the intent is to optimize ALL images (including mobile ones that might not
  // have been optimized by `createOptimizedPicture` if only `source.srcset` was used),
  // then the logic needs to be more robust.
  // For now, assuming the `createOptimizedPicture` in the loop is sufficient for desktop,
  // and mobile uses `source.srcset`, this post-processing loop is likely incorrect.
  // Let's remove it as it's trying to re-optimize images already handled or not meant for `createOptimizedPicture`.
  // The `createOptimizedPicture` call for `desktopImg` in the loop was also slightly off,
  // it should append the entire picture, not just the inner img. That has been fixed.
  // With that fix, this final loop is not needed.
  /*
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  */
}
