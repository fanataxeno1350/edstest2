import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const popUpDiv = document.createElement('div');
  popUpDiv.id = 'pop-up';
  moveInstrumentation(block.querySelector('#pop-up'), popUpDiv);

  const transPopUpDiv = document.createElement('div');
  transPopUpDiv.className = 'stickynavigation-stickyNavigation-trans-pop-up';
  moveInstrumentation(block.querySelector('.stickynavigation-stickyNavigation-trans-pop-up'), transPopUpDiv);

  const section = document.createElement('section');
  section.className = 'stickynavigation-stickyNavigation-sticky-bottom-nav stickynavigation-position-fixed stickynavigation-bottom-0 stickynavigation-p-3 stickynavigation-d-flex stickynavigation-align-items-center stickynavigation-boing-container stickynavigation-bg-boing-primary';

  const ul = document.createElement('ul');
  ul.className = 'stickynavigation-stickyNavigation-sticky-bottom-nav__list stickynavigation-d-flex stickynavigation-justify-content-around stickynavigation-align-items-center stickynavigation-flex-grow-1';

  const items = block.querySelectorAll('[data-aue-model="stickyNavigationItem"]');
  items.forEach((itemNode) => {
    const li = document.createElement('li');
    li.className = 'stickynavigation-stickyNavigation-sticky-bottom-nav__item stickynavigation-position-relative';

    const link = itemNode.querySelector('[data-aue-prop="link"]');
    const linkHref = link ? link.href : '';
    const linkDataConsent = link ? link.dataset.consent : '';
    const linkDataLink = link ? link.dataset.link : '';

    const a = document.createElement('a');
    a.href = linkHref;
    a.className = 'stickynavigation-stickyNavigation-sticky-bottom-nav__link stickynavigation-d-flex stickynavigation-flex-column stickynavigation-align-items-center stickynavigation-gap-1 stickynavigation-analytics_cta_click';
    if (linkDataConsent) {
      a.dataset.consent = linkDataConsent;
    }
    if (linkDataLink) {
      a.dataset.link = linkDataLink;
    }

    const iconImg = itemNode.querySelector('[data-aue-prop="icon"]');
    if (iconImg) {
      const picture = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{
        width: 'auto'
      }]);
      picture.querySelector('img').className = 'stickynavigation-stickyNavigation-sticky-bottom-nav__icon';
      a.append(picture);
      moveInstrumentation(iconImg, picture);
    }

    const labelSpan = document.createElement('span');
    labelSpan.className = 'stickynavigation-stickyNavigation-sticky-bottom-nav__label';
    const labelText = itemNode.querySelector('[data-aue-prop="label"]');
    if (labelText) {
      labelSpan.textContent = labelText.textContent;
      moveInstrumentation(labelText, labelSpan);
    }
    a.append(labelSpan);

    li.append(a);
    moveInstrumentation(itemNode, li);
    ul.append(li);
  });

  section.append(ul);

  block.textContent = '';
  block.append(popUpDiv, transPopUpDiv, section);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
