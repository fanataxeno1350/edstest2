import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const section = document.createElement('section');
  section.classList.add('search-search');
  section.setAttribute('role', 'search');
  section.setAttribute('data-cmp-min-length', '3');
  section.setAttribute('data-cmp-results-desktop-size', '8');
  section.setAttribute('data-cmp-results-mobile-size', '5');
  section.setAttribute('data-error-response', '{&quot;noResultsTitle&quot;:&quot;Sorry, we cannot find what you are looking for :(&quot;,&quot;noResultsDescription&quot;:&quot;Please try a new search term or browse through one of our product categories.&quot;,&quot;categories&quot;:[{&quot;categoryName&quot;:&quot;Gluten Free Flour&quot;,&quot;categoryURL&quot;:&quot;https://aashirvaad.com/header-pages/our-products/atta/gluten-free-flour.html&quot;},{&quot;categoryName&quot;:&quot;Aashirvaad Atta&quot;,&quot;categoryURL&quot;:&quot;https://aashirvaad.com/header-pages/our-products/atta/select-atta.html&quot;},{&quot;categoryName&quot;:&quot;Aashirvaad Salt&quot;,&quot;categoryURL&quot;:&quot;https://aashirvaad.com/header-pages/our-products/salt/iodized-salt.html&quot;}]}');
  section.setAttribute('data-input-placeholder', 'Start Typing...');

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    moveInstrumentation(row, item);
    while (row.firstElementChild) item.append(row.firstElementChild);
    [...item.children].forEach((div) => {
    });
    section.append(item);
  });

  block.textContent = '';
  block.append(section);
}
