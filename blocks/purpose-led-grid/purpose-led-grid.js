import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0.5: The block's own class 'purpose-led-grid' is NOT added to gridContainer.
  // It's already on the outer block div.
  const gridContainer = document.createElement('div');
  gridContainer.classList.add('row', 'g-4', 'pt-3'); // Classes from ORIGINAL HTML

  [...block.children].forEach((row) => {
    // CHECK 0: No direct .children[n] bracket access for variable assignment.
    // Array destructuring is used, which is correct for fixed-schema rows.
    const [imageMobileCell, imageDesktopCell, linkCell, descriptionCell] = [...row.children];

    const colDiv = document.createElement('div');
    colDiv.classList.add('col-md-6', 'aos-init', 'aos-animate'); // Classes from ORIGINAL HTML
    colDiv.setAttribute('data-aos-easing', 'ease-in-out');
    colDiv.setAttribute('data-aos', 'fade-up');
    colDiv.setAttribute('data-aos-delay', '700');

    const cardWrap = document.createElement('a');
    cardWrap.classList.add('card-wrap'); // Class from ORIGINAL HTML
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardWrap.href = foundLink.href;
      // Assuming target="_blank" is a default behavior for external links or can be added if needed
      cardWrap.setAttribute('target', '_blank');
    }
    moveInstrumentation(row, cardWrap);

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image'); // Class from ORIGINAL HTML

    const picture = document.createElement('picture');
    const mobilePicture = imageMobileCell.querySelector('picture');
    const desktopPicture = imageDesktopCell.querySelector('picture');

    if (mobilePicture) {
      const mobileImg = mobilePicture.querySelector('img');
      if (mobileImg) {
        const source = document.createElement('source');
        source.setAttribute('media', '(max-width: 576px)');
        source.setAttribute('srcset', mobileImg.src);
        picture.append(source);
      }
    }

    if (desktopPicture) {
      const desktopImg = desktopPicture.querySelector('img');
      if (desktopImg) {
        // createOptimizedPicture handles alt text and optimization.
        // The original HTML has img-fluid on the <img> tag, so we add it here.
        const optimizedPicture = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
        const imgElement = optimizedPicture.querySelector('img');
        if (imgElement) {
          imgElement.classList.add('img-fluid'); // Class from ORIGINAL HTML
          picture.append(imgElement);
        }
      }
    }
    cardImageDiv.append(picture);

    const cardTextDiv = document.createElement('div');
    cardTextDiv.classList.add('card-text'); // Class from ORIGINAL HTML

    const descP = document.createElement('p');
    descP.classList.add('desc'); // Class from ORIGINAL HTML
    // CHECK 0.6 & 0.7B: Fixed <p>-inside-<p> violation.
    // descriptionCell.innerHTML would be "<p>content</p>", assigning it to descP creates <p><p>content</p></p>.
    // Instead, extract the innerHTML of the first <p> or fallback to textContent.
    descP.innerHTML = descriptionCell.querySelector('p')?.innerHTML ?? descriptionCell.textContent.trim() ?? '';

    cardTextDiv.append(descP);
    cardWrap.append(cardImageDiv, cardTextDiv);
    colDiv.append(cardWrap);
    gridContainer.append(colDiv);
  });

  block.replaceChildren(gridContainer);
}
