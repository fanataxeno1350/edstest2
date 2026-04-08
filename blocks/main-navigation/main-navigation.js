import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const nav = document.createElement('nav');
  nav.classList.add('persistent-navigation--wrapper', 'js-persistent-nav');
  nav.style.marginLeft = '27px'; // Copy inline style from original
  nav.style.opacity = '1';       // Copy inline style from original

  const ul = document.createElement('ul');
  ul.classList.add('persistent-navigation', 'grid-x');
  nav.append(ul);

  [...block.children].forEach((row, index) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add('persistent-navigation--list');

    // Use content detection instead of fragile index access
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a')); // Find cell without a link, assuming it's the label
    const linkCell = cells.find(cell => cell.querySelector('a'));    // Find cell with a link

    const linkEl = linkCell ? linkCell.querySelector('a') : null; // Ensure linkCell exists before querying

    if (linkEl && linkEl.closest('div').children.length > 1) { // Check if it's a button with a submenu (more than just the link)
      const button = document.createElement('button');
      button.id = `nav-title-${index + 1}`;
      button.classList.add(
        'persistent-navigation--link',
        'persistent-nav--level1',
        'level1',
        'utilityTagLowCaps',
        'bold-600',
      );
      button.setAttribute('aria-label', labelCell.textContent.trim());
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', `level-${index + 1}`);
      button.setAttribute('data-nav-wrapper', `level-${index + 1}`);
      button.textContent = labelCell.textContent.trim();
      li.append(button);

      // Add event listener for toggle behavior
      const menuWrapper = document.createElement('div');
      menuWrapper.id = `level-${index + 1}`;
      menuWrapper.classList.add('persistent-navigation--menu-wrapper');
      menuWrapper.setAttribute('aria-labelledby', `nav-title-${index + 1}`);
      menuWrapper.innerHTML = `
        <div class="persistent-nav--level2 level2 grid-x">
          <div class="small-12 large-4 xlarge-3 persistent-nav--level2-items">
            <div class="persistent-nav--level2--close hide-for-large">
              <button class="persistent-nav--control-prev persistent-nav--control js-persistent-nav-l1--close" aria-label="Back to previous navigation">
                <img alt="svg file" src="/icons/arrow-left.svg"/>
              </button>
              <button class="persistent-nav--control-close persistent-nav--control js-persistent-nav-l1--close" aria-label="Close navigation">
                <img alt="svg file" src="/icons/close.svg"/>
              </button>
            </div>
            <p class="persistent-nav--level2--title headline-h2" id="persistent-nav--level2--title--${labelCell.textContent.trim().replace(/\s/g, '-')}}">${labelCell.textContent.trim()}</p>
            <ul class="persistent-nav--level2-list" aria-labelledby="persistent-nav--level2--title--${labelCell.textContent.trim().replace(/\s/g, '-')}}">
              <li class="persistent-nav--level2-list-item grid-x">
                <a href="${linkEl.href}" class="persistent-nav--level2-link js-persistent-nav--level2-link labelMediumRegular text-left no-submenu" aria-label="${labelCell.textContent.trim()}">
                  ${labelCell.textContent.trim()}
                </a>
              </li>
            </ul>
          </div>
          <div class="small-12 large-8 xlarge-offset-1 xlarge-8 persistent-nav--level2-banner show-for-large">
            <picture class="persistent-nav--level2-banner-picture">
              <img class="persistent-nav--level2-banner-img lazyload" data-src="/images/default-banner.jpeg" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="nescafé coffee types" height="640">
            </picture>
            <div class="persistent-nav--level2-banner--info">
              <p class="headline-h4 bodyMediumRegular persistent-nav--level2-banner-desc">Welcome to the world of NESCAFÉ®, where you'll find all your favourited products &amp; recipes.</p>
            </div>
          </div>
        </div>
      `;
      li.append(menuWrapper);

      button.addEventListener('click', () => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !isExpanded);
        menuWrapper.classList.toggle('active', !isExpanded);
      });

      menuWrapper.querySelectorAll('.js-persistent-nav-l1--close').forEach((closeBtn) => {
        closeBtn.addEventListener('click', () => {
          button.setAttribute('aria-expanded', 'false');
          menuWrapper.classList.remove('active');
        });
      });
    } else {
      // If it's just a link without a submenu
      const anchor = document.createElement('a');
      anchor.href = linkEl ? linkEl.href : '#';
      anchor.classList.add(
        'persistent-navigation--link',
        'persistent-nav--level1',
        'level1',
        'utilityTagLowCaps',
        'bold-600',
        'no-submenu',
      );
      anchor.setAttribute('aria-label', labelCell.textContent.trim());
      anchor.textContent = labelCell.textContent.trim();
      li.append(anchor);
    }
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.dataset.src || img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(nav);
}
