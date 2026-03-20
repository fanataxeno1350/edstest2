import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('footer-wrapper');

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    moveInstrumentation(row, item);
    while (row.firstElementChild) item.append(row.firstElementChild);
    [...item.children].forEach((div) => {
      if (div.querySelector('a')) {
        div.className = 'footer-navigation-logo';
      } else if (div.querySelector('ul.footer-social-links-list')) {
        div.classList.add('footer-socialLinks', 'footer-social-links', 'footer-social-css-from-wrapper');
      } else if (div.querySelector('ul.footer-navigation-links')) {
        div.className = 'footer-navigation-links';
      } else if (div.querySelector('ul.footer-language-selector')) {
        div.classList.add('footer-language-selector', 'footer-lang-css-from-wrapper');
      } else if (div.querySelector('div.footer-policy-links-content')) {
        div.className = 'footer-policy-links-content';
      } else if (div.querySelector('p.footer-policy-links-copyright')) {
        div.className = 'footer-policy-links-copyright';
      }
    });
    wrapper.append(item);
  });

  block.textContent = '';
  block.append(wrapper);
}
