import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add('grid-container', 'js-burger-navigation');
  block.setAttribute('aria-label', 'Burger Navigation Section');

  const navWrapper = document.createElement('nav');
  navWrapper.classList.add('persistent-navigation--wrapper', 'js-persistent-nav', 'burger-nav');

  const ul = document.createElement('ul');
  ul.classList.add('persistent-navigation', 'grid-x');

  const listItem = document.createElement('li');
  listItem.classList.add('persistent-navigation--list');

  const menuWrapper = document.createElement('div');
  menuWrapper.classList.add('persistent-navigation--menu-wrapper', 'burger-nav');
  menuWrapper.id = 'burger-nav-wrapper';
  menuWrapper.setAttribute('aria-labelledby', 'burger-nav');

  const level2Div = document.createElement('div');
  level2Div.classList.add('persistent-nav--level2', 'level2', 'grid-x');

  const level2Items = document.createElement('div');
  level2Items.classList.add('small-12', 'large-4', 'xlarge-3', 'persistent-nav--level2-items');

  const level2Close = document.createElement('div');
  level2Close.classList.add('persistent-nav--level2--close', 'hide-for-large');

  const controlPrev = document.createElement('div');
  controlPrev.classList.add('persistent-nav--control-prev', 'persistent-nav--control');
  level2Close.append(controlPrev);

  const closeButton = document.createElement('button');
  closeButton.classList.add('persistent-nav--control-close', 'persistent-nav--control', 'js-persistent-nav-l1--close');
  closeButton.setAttribute('aria-label', 'Close navigation');
  const closeImg = document.createElement('img');
  closeImg.alt = 'svg file';
  closeImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775635709821.svg+xml'; // Placeholder, replace with actual SVG path if needed
  closeButton.append(closeImg);
  level2Close.append(closeButton);
  level2Items.append(level2Close);

  const level2List = document.createElement('ul');
  level2List.classList.add('persistent-nav--level2-list', 'burger-nav');
  level2List.setAttribute('aria-labelledby', 'persistent-nav--level2--title--');

  const [bannerImageRow, bannerInfoRow, ...itemRows] = [...block.children];

  itemRows.forEach((row, index) => {
    const level2ListItem = document.createElement('li');
    moveInstrumentation(row, level2ListItem);
    level2ListItem.classList.add('persistent-nav--level2-list-item', 'grid-x', 'burger-nav');

    const cells = [...row.children];
    // Use content detection instead of index access for item cells
    const labelCell = cells.find(cell => cell.textContent.trim() && !cell.querySelector('a') && !cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const submenuBannerImageCell = cells.find(cell => cell.querySelector('picture'));
    const submenuBannerTitleCell = cells.find(cell => cell.textContent.trim() && !cell.querySelector('a') && !cell.querySelector('picture') && cell !== labelCell);
    const submenuBannerDescCell = cells.find(cell => cell.textContent.trim() && !cell.querySelector('a') && !cell.querySelector('picture') && cell !== labelCell && cell !== submenuBannerTitleCell);
    const submenuBannerLinkCell = cells.find(cell => cell.querySelector('a') && cell !== linkCell);

    const link = linkCell?.querySelector('a');
    const labelText = labelCell?.textContent.trim() || '';

    const hasSubmenu = submenuBannerImageCell?.querySelector('picture') || submenuBannerTitleCell?.textContent.trim() || submenuBannerDescCell?.textContent.trim() || submenuBannerLinkCell?.querySelector('a');

    if (link && !hasSubmenu) {
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left');
      if (link.href.includes('login') || link.href.includes('register')) {
        anchor.classList.add('no-submenu');
      }
      anchor.setAttribute('aria-label', labelText);
      anchor.textContent = labelText;
      level2ListItem.append(anchor);
    } else if (link && hasSubmenu) {
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left');
      anchor.setAttribute('aria-label', labelText);
      anchor.textContent = labelText;
      level2ListItem.append(anchor);
    } else if (hasSubmenu) {
      const button = document.createElement('button');
      button.classList.add('persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'js-persistent-nav--level2-link');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', `persistentNavLevel3List-burger-nav-wrapper-burger-${index + 1}`);
      button.setAttribute('aria-label', labelText);
      button.textContent = labelText;
      level2ListItem.append(button);

      const level3Wrapper = document.createElement('div');
      level3Wrapper.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level3-wrapper');
      level3Wrapper.id = `level-burger-nav-${index + 1}`;

      const level3Div = document.createElement('div');
      level3Div.classList.add('persistent-nav--level3', 'grid-x', 'burger-nav');
      level3Div.setAttribute('role', 'list');

      if (submenuBannerImageCell?.querySelector('picture')) {
        level3Div.classList.add('full-width');
        level3Div.setAttribute('data-full-banner', '1');
      }

      const level3Close = document.createElement('div');
      level3Close.classList.add('persistent-nav--level2--close', 'level3', 'hide-for-large');
      level3Close.setAttribute('role', 'listitem');

      const prevButton = document.createElement('button');
      prevButton.classList.add('persistent-nav--control-prev', 'persistent-nav--control', 'js-persistent-nav-l2--close');
      prevButton.setAttribute('aria-label', 'Back to previous navigation');
      const prevImg = document.createElement('img');
      prevImg.alt = 'svg file';
      prevImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775635709877.svg+xml';
      prevButton.append(prevImg);
      level3Close.append(prevButton);

      const controlTitle = document.createElement('span');
      controlTitle.classList.add('persistent-nav--control-title', 'utilityTagHighCaps', 'js-persistent-nav-l2--close');
      level3Close.append(controlTitle);

      const closeButtonL3 = document.createElement('button');
      closeButtonL3.classList.add('persistent-nav--control-close', 'persistent-nav--control', 'js-persistent-nav-l1--close');
      closeButtonL3.setAttribute('aria-label', 'Close navigation');
      const closeImgL3 = document.createElement('img');
      closeImgL3.alt = 'svg file';
      closeImgL3.src = '/content/dam/aemigrate/uploaded-folder/image/1775635709941.svg+xml';
      closeButtonL3.append(closeImgL3);
      level3Close.append(closeButtonL3);
      level3Div.append(level3Close);

      const level3Title = document.createElement('p');
      level3Title.classList.add('persistent-nav--level3--title', 'text-center', 'hide-for-large', 'headline-h2');
      level3Title.setAttribute('role', 'listitem');
      level3Title.textContent = labelText;
      level3Div.append(level3Title);

      if (submenuBannerImageCell?.querySelector('picture')) {
        const bannerCell = document.createElement('div');
        bannerCell.classList.add('cell', 'small-12', 'large-12', 'full-width', 'persistent-nav--level3', 'burger-nav');
        bannerCell.setAttribute('role', 'listitem');

        const picture = submenuBannerImageCell.querySelector('picture');
        if (picture) {
          const bannerPicture = document.createElement('picture');
          bannerPicture.classList.add('persistent-nav--level3-banner-picture');
          const img = picture.querySelector('img');
          if (img) {
            const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            bannerPicture.append(...optimizedPic.children);
          }
          bannerCell.append(bannerPicture);
        }

        const bannerDesc = document.createElement('div');
        bannerDesc.classList.add('persistent-nav--level3-banner-desc', 'grid-x', 'align-middle', 'full-width');

        const bannerTitle = document.createElement('div');
        bannerTitle.classList.add('bodyLargeBold');
        if (submenuBannerTitleCell) {
          moveInstrumentation(submenuBannerTitleCell, bannerTitle);
          while (submenuBannerTitleCell.firstChild) bannerTitle.append(submenuBannerTitleCell.firstChild);
        }
        bannerDesc.append(bannerTitle);

        const bannerText = document.createElement('div');
        bannerText.classList.add('bodySmallRegular');
        if (submenuBannerDescCell) {
          moveInstrumentation(submenuBannerDescCell, bannerText);
          while (submenuBannerDescCell.firstChild) bannerText.append(submenuBannerDescCell.firstChild);
        }
        bannerDesc.append(bannerText);

        const bannerLink = submenuBannerLinkCell?.querySelector('a');
        if (bannerLink) {
          const linkEl = document.createElement('a');
          linkEl.href = bannerLink.href;
          linkEl.classList.add('labelMediumRegular', 'persistent-nav--level3-banner-desc-link');
          if (submenuBannerLinkCell) {
            moveInstrumentation(submenuBannerLinkCell, linkEl);
            while (submenuBannerLinkCell.firstChild) linkEl.append(submenuBannerLinkCell.firstChild);
          }
          bannerDesc.append(linkEl);
        }
        bannerCell.append(bannerDesc);
        level3Div.append(bannerCell);
      } else {
        const level3ListWrapper = document.createElement('div');
        level3ListWrapper.classList.add('cell', 'small-12', 'large-12', 'xlarge-8', 'persistent-nav--level3-list', 'burger-nav');
        level3ListWrapper.id = `persistentNavLevel3List-burger-nav-wrapper-burger-${index + 1}`;
        level3Div.append(level3ListWrapper);
      }
      level3Wrapper.append(level3Div);
      level2ListItem.append(level3Wrapper);

      // Add event listener for button to toggle submenu
      button.addEventListener('click', () => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !isExpanded);
        level3Wrapper.classList.toggle('is-active', !isExpanded); // Changed 'show' to 'is-active'
      });

      // Add event listeners for back/close buttons in submenu
      prevButton.addEventListener('click', () => {
        button.setAttribute('aria-expanded', 'false');
        level3Wrapper.classList.remove('is-active'); // Changed 'show' to 'is-active'
      });

      closeButtonL3.addEventListener('click', () => {
        button.setAttribute('aria-expanded', 'false');
        level3Wrapper.classList.remove('is-active'); // Changed 'show' to 'is-active'
        // Also close the main burger nav if needed
        navWrapper.classList.remove('is-active'); // Changed 'show' to 'is-active'
      });
    }

    level2List.append(level2ListItem);
  });

  level2Items.append(level2List);
  level2Div.append(level2Items);

  const level2Banner = document.createElement('div');
  level2Banner.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level2-banner', 'show-for-large');

  const bannerPicture = document.createElement('picture');
  bannerPicture.classList.add('persistent-nav--level2-banner-picture', 'burger-nav');
  const bannerImg = bannerImageRow.querySelector('img');
  if (bannerImg) {
    const optimizedPic = createOptimizedPicture(bannerImg.src, bannerImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(bannerImg, optimizedPic.querySelector('img'));
    bannerPicture.append(...optimizedPic.children);
  }
  level2Banner.append(bannerPicture);

  const bannerInfoDiv = document.createElement('div');
  bannerInfoDiv.classList.add('persistent-nav--level2-banner--info', 'burger-nav');
  const bannerInfoP = document.createElement('p');
  bannerInfoP.classList.add('headline-h4');
  moveInstrumentation(bannerInfoRow.firstElementChild, bannerInfoP);
  while (bannerInfoRow.firstElementChild.firstChild) bannerInfoP.append(bannerInfoRow.firstElementChild.firstChild);
  bannerInfoDiv.append(bannerInfoP);
  level2Banner.append(bannerInfoDiv);

  level2Div.append(level2Banner);
  menuWrapper.append(level2Div);
  listItem.append(menuWrapper);
  ul.append(listItem);
  navWrapper.append(ul);
  block.textContent = '';
  block.append(navWrapper);

  // Add event listener for the main close button (js-persistent-nav-l1--close)
  closeButton.addEventListener('click', () => {
    navWrapper.classList.remove('is-active'); // Assuming 'is-active' controls the visibility of the main nav
  });

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
