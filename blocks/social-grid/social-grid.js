import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, bodyRow, ...itemRows] = [...block.children];

  const blockWrapper = document.createElement('div');
  blockWrapper.classList.add('block-wrapper');

  const heading = document.createElement('h3');
  moveInstrumentation(headingRow.firstElementChild, heading);
  while (headingRow.firstElementChild.firstChild) {
    heading.append(headingRow.firstElementChild.firstChild);
  }
  blockWrapper.append(heading);

  const separator = document.createElement('div');
  separator.classList.add('separator');
  separator.innerHTML = '&nbsp;';
  blockWrapper.append(separator);

  const body = document.createElement('p');
  moveInstrumentation(bodyRow.firstElementChild, body);
  while (bodyRow.firstElementChild.firstChild) {
    body.append(bodyRow.firstElementChild.firstChild);
  }
  blockWrapper.append(body);

  const socialGridRow = document.createElement('div');
  socialGridRow.classList.add('row', 'd-flex', 'justify-content-left');

  itemRows.forEach((row) => {
    const col = document.createElement('div');
    col.classList.add('col-sm-4', 'col-md-2', 'col-lg-1', 'text-align-center');
    col.style.paddingTop = '25px'; // This is from the original HTML, but should ideally be in CSS.

    moveInstrumentation(row, col);

    let imageLinkElement = null;
    let titleElement = null;

    const cells = [...row.children];
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a') && !cell.querySelector('picture')); // Link might be separate
    const titleCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim() !== '');

    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      const img = picture ? picture.querySelector('img') : null;
      const link = imageCell.querySelector('a'); // Link is often wrapped around the image

      if (link && img) {
        imageLinkElement = document.createElement('a');
        imageLinkElement.href = link.href;
        imageLinkElement.rel = 'noopener';
        imageLinkElement.target = '_blank';
        imageLinkElement.setAttribute('aria-label', link.getAttribute('aria-label') || img.alt);
        
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '60%' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.querySelector('img').setAttribute('align', 'center'); // From original HTML
        imageLinkElement.append(optimizedPic);
      } else if (img) { // If there's an image but no link wrapper
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '60%' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.querySelector('img').setAttribute('align', 'center'); // From original HTML
        imageLinkElement = optimizedPic; // Treat the picture itself as the primary element
      }
    } else if (linkCell) { // If there's a link but no image
      const link = linkCell.querySelector('a');
      if (link) {
        imageLinkElement = document.createElement('a');
        imageLinkElement.href = link.href;
        imageLinkElement.rel = 'noopener';
        imageLinkElement.target = '_blank';
        imageLinkElement.setAttribute('aria-label', link.getAttribute('aria-label') || link.textContent);
        moveInstrumentation(linkCell, imageLinkElement);
        while (linkCell.firstChild) imageLinkElement.append(linkCell.firstChild);
      }
    }

    if (titleCell) {
      const p = titleCell.querySelector('p');
      if (p) {
        titleElement = document.createElement('h6');
        titleElement.style.lineHeight = '18px'; // From original HTML, should be in CSS
        titleElement.style.marginTop = '10px'; // From original HTML, should be in CSS
        moveInstrumentation(p, titleElement);
        while (p.firstChild) titleElement.append(p.firstChild);
      }
    }

    if (imageLinkElement) {
      col.append(imageLinkElement);
    }
    if (titleElement) {
      col.append(titleElement);
    }
    socialGridRow.append(col);
  });

  const wallsIoDiv = document.createElement('div');
  wallsIoDiv.classList.add('walls-io');
  wallsIoDiv.innerHTML = `<iframe id="wallsio-iframe-wallsio-widget-script" class="wallsio-iframe wallsio-iframe-wallsio-widget-script" allowfullscreen="" style="border: 0px; width: 100%; height: 1177px;" title="wallsio-iframe wallsio-iframe-wallsio-widget-script" data-uw-rm-iframe="gn"></iframe><button type="button" id="wallsio-load-more-button-wallsio-widget-script" class="wallsio-load-more-button wallsio-load-more-button-wallsio-widget-script">See More</button><script id="wallsio-widget-script" src="https://walls.io/js/wallsio-widget-1.2.js" data-wallurl="https://walls.io/j7aqx?nobackground=1&amp;show_header=0&amp;initial_posts=6" data-width="100%" data-autoheight="1" data-injectloadmorebutton="1" data-loadmoretext="See More" data-loadmorecount="" data-height="800" data-lazyload="1" data-wallsio-was-fired="true"></script>`;
  
  block.textContent = '';
  block.append(blockWrapper, socialGridRow, wallsIoDiv);

  // Interactivity: Add event listener for the "See More" button
  const seeMoreButton = block.querySelector('.wallsio-load-more-button');
  if (seeMoreButton) {
    seeMoreButton.addEventListener('click', (e) => {
      // The walls.io script handles the actual loading, this just ensures the button is clickable
      // and potentially triggers the script's internal logic if it's not already bound.
      // In a real scenario, you might need to call a method on the walls.io widget directly
      // if it exposes one, or simulate a click on an internal element.
      // For now, simply preventing default and letting the script handle it is sufficient.
      e.preventDefault();
      // If walls.io widget doesn't automatically bind to this button,
      // you might need to manually trigger its load more function here.
      // As per the original HTML, the script has data-injectloadmorebutton="1",
      // so it should handle the click itself.
      console.log('See More button clicked (walls.io)');
    });
  }
}
