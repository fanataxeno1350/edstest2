import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    heroLargeImageRow,
    heroSmallImageRow,
    headingRow,
    logoImageRow,
    ...navItemRows
  ] = [...block.children];

  // Hero Large Image
  const heroLargeImageDiv = document.createElement('div');
  const heroLargeImagePicture = heroLargeImageRow.querySelector('picture');
  if (heroLargeImagePicture) {
    const img = heroLargeImagePicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      heroLargeImageDiv.append(optimizedPic);
      optimizedPic.classList.add('hero-large--lg');
    }
  }
  moveInstrumentation(heroLargeImageRow, heroLargeImageDiv);

  // Hero Small Image
  const heroSmallImageDiv = document.createElement('div');
  const heroSmallImagePicture = heroSmallImageRow.querySelector('picture');
  if (heroSmallImagePicture) {
    const img = heroSmallImagePicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      heroSmallImageDiv.append(optimizedPic);
      optimizedPic.classList.add('hero-small--sm');
    }
  }
  moveInstrumentation(heroSmallImageRow, heroSmallImageDiv);

  // Heading
  const banTransTextDiv = document.createElement('div');
  banTransTextDiv.classList.add('ban_trans_text');
  const h2 = document.createElement('h2');
  moveInstrumentation(headingRow, h2);
  // Clear headingRow content and reconstruct h2
  const headingP = headingRow.querySelector('p');
  if (headingP) {
    const textContent = headingP.textContent;
    if (textContent.includes('smiles')) {
      const parts = textContent.split('smiles');
      h2.append(parts[0]);
      const a = document.createElement('a');
      a.classList.add('Leadershipyellowbar');
      a.textContent = 'smiles';
      h2.append(a);
      h2.append(parts[1]);
    } else {
      h2.textContent = textContent;
    }
  }
  banTransTextDiv.append(h2);

  // Transparent Header Wrapper
  const transparentHeaderWrapper = document.createElement('div');
  transparentHeaderWrapper.classList.add('wrapper', 'cf', 'transparent_header', 'transparent_nav_header');
  transparentHeaderWrapper.id = 'TransDiv';

  // Logo Image
  const headLogoDiv = document.createElement('div');
  headLogoDiv.classList.add('head_logo');
  const navHeaderLogo = document.createElement('a');
  navHeaderLogo.classList.add('navheader_logo');
  navHeaderLogo.href = '/';
  navHeaderLogo.setAttribute('aria-label', 'PepsiCo Home Logo');
  const logoPicture = logoImageRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '100' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      navHeaderLogo.append(optimizedPic); // Append optimized picture directly to navHeaderLogo
    }
  }
  moveInstrumentation(logoImageRow, navHeaderLogo);
  headLogoDiv.append(navHeaderLogo);

  // Navigation
  const nav = document.createElement('nav');
  nav.id = 'main-nav';
  nav.classList.add('blue_nav', 'hc-nav', 'hc-nav-1');
  const ul = document.createElement('ul');
  ul.classList.add('second-nav');

  navItemRows.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const cells = [...row.children];
    let linkEl;
    let labelEl;
    let iconEl;

    cells.forEach((cell) => {
      const link = cell.querySelector('a');
      const picture = cell.querySelector('picture');
      if (link) {
        linkEl = link;
      } else if (picture) {
        iconEl = picture;
      } else if (cell.textContent.trim()) {
        labelEl = cell;
      }
    });

    if (linkEl && labelEl) {
      const a = document.createElement('a');
      a.href = linkEl.href;
      a.textContent = labelEl.textContent.trim();
      a.setAttribute('tabindex', '0');
      li.append(a);
    } else if (linkEl) { // Case where only link is present, use its text as label
      const a = document.createElement('a');
      a.href = linkEl.href;
      a.textContent = linkEl.textContent.trim();
      a.setAttribute('tabindex', '0');
      li.append(a);
    }

    if (iconEl) {
      const img = iconEl.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '20' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        li.append(optimizedPic); // Append optimized picture directly to li
      }
    }

    // Add dummy classes for demonstration based on original HTML structure
    // In a real scenario, these would be determined by content or specific row structures
    if (li.textContent.includes('Who We Are')) {
      li.classList.add('whoweare', 'active');
      const ulOuter = document.createElement('div');
      ulOuter.classList.add('ul_outer');
      ulOuter.innerHTML = `
        <div class="Headerclassclose">
          <div class="SecondnavClose">
            <span><img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1775626483884.svg+xml"></span>
          </div>
        </div>
        <ul class="heading"><li><h1>Who We Are</h1></li></ul>
        <ul><li><h2>Who We Are</h2></li><li><a href="/who-we-are/about-pepsico-india">About PepsiCo India</a></li><li><a href="/who-we-are/mission-vision">Mission &amp; Vision</a></li><li><a href="/who-we-are/leadership">Leadership</a></li></ul>
        <ul><li><h2>Our Commitments</h2></li><li><a href="/our-commitments/global-code-of-conduct">Global Code of Conduct</a></li></ul>
        <ul><li><h2>Learn More</h2></li><li><a href="/careers">Careers</a></li></ul>
      `;
      li.append(ulOuter);
      li.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        li.classList.toggle('active');
      });
      ulOuter.querySelector('.SecondnavClose').addEventListener('click', () => {
        li.classList.remove('active');
      });
    } else if (li.textContent.includes('Our Impact')) {
      li.classList.add('ourimpacts', 'active');
      const ulOuter = document.createElement('div');
      ulOuter.classList.add('ul_outer');
      ulOuter.innerHTML = `
        <div class="Headerclassclose">
          <div class="SecondnavClose">
            <span><img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1775626483884.svg+xml"></span>
          </div>
        </div>
        <ul class="heading"><li><h1>Our Impact</h1></li></ul>
        <ul><li><h2>Sustainability</h2></li><li><a href="/our-impact/sustainability/pepsico-positive">PepsiCo Positive</a>&nbsp;</li></ul>
        <ul><li><h2>Community</h2></li><li><a href="/our-impact/community/pepsico-foundation">PepsiCo Foundation</a></li></ul>
      `;
      li.append(ulOuter);
      li.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        li.classList.toggle('active');
      });
      ulOuter.querySelector('.SecondnavClose').addEventListener('click', () => {
        li.classList.remove('active');
      });
    } else if (li.textContent.includes('Our Brands') || li.textContent.includes('Our Stories')) {
      li.classList.add('no-arw');
    } else if (li.textContent.includes('Resources')) {
      li.classList.add('devices');
      const span = document.createElement('span');
      span.classList.add('nav-down');
      li.querySelector('a').append(span);
      const ulOuter = document.createElement('div');
      ulOuter.classList.add('ul_outer', 'resourcesClass');
      ulOuter.innerHTML = `
        <div class="Headerclassclose">
          <div class="SecondnavClose">
            <span><img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1775626483884.svg+xml"></span>
          </div>
        </div>
        <ul class="heading"><li><h1>Resources</h1></li></ul>
        <ul class="right_border">
          <li><a href="#">Contact <img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1775626483923.svg+xml"></a><ul><li><a href="/contact">Contact</a></li></ul></li>
          <li><a href="#">Careers <img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1775626483953.svg+xml"></a><ul><li><a href="/careers">Careers</a></li><li><a href="https://www.linkedin.com/company/pepsico" target="_blank">PepsiCo LinkedIn<img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1775626483982.svg+xml"></a></li><li><a href="https://www.instagram.com/pepsicojobs" target="_blank">PepsiCo Jobs Instagram<img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1775626484123.svg+xml"></a></li></ul></li>
          <li><a href="#">Media Resources <img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1775626484168.svg+xml"></a><ul><li><a href="/our-stories/press-releases">Press Releases</a></li><li><a href="/media-contacts">Media Contact</a></li></ul></li>
          <li><a href="#">Downloads <img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1775626484196.svg+xml"></a><ul><li><a href="/downloads">Downloads</a></li></ul></li>
        </ul>
      `;
      li.append(ulOuter);
      li.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        li.classList.toggle('active');
      });
      ulOuter.querySelector('.SecondnavClose').addEventListener('click', () => {
        li.classList.remove('active');
      });
    }
    ul.append(li);
  });
  nav.append(ul);

  const displayMobiUl = document.createElement('ul');
  displayMobiUl.classList.add('display_mobi');
  displayMobiUl.innerHTML = `
    <li>
      <img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1775626484235.svg+xml"/><a href="/global-sites" tabindex="0" aria-label="PepsiCo Country">
        <img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1775626484295.svg+xml"/> India
      </a>
    </li>
    <li><a href="/contact" tabindex="0" aria-label="PepsiCo Contact">Contact</a></li>
    <li class="mobile-dropdown"></li>
  `;
  nav.append(displayMobiUl);

  transparentHeaderWrapper.append(headLogoDiv, nav);

  const toggle = document.createElement('a');
  toggle.classList.add('toggle', 'hc-nav-trigger', 'hc-nav-1');
  toggle.innerHTML = '<span></span>';
  toggle.addEventListener('click', () => {
    nav.classList.toggle('hc-nav-open');
    toggle.classList.toggle('hc-nav-open');
  });
  transparentHeaderWrapper.append(toggle);

  const headRightNav = document.createElement('div');
  headRightNav.classList.add('head_right_nav');
  headRightNav.innerHTML = `
    <ul>
      <li class="mobi_dropdown"></li>
      <li class="cont_act"><a href="/contact" tabindex="0" aria-label="PepsiCo Contact">Contact</a></li>
      <li class="us">
        <img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1775626484321.svg+xml"/> <a href="/global-sites" tabindex="0">India</a>
      </li>
      <li class="sea_rch_icon">
        <a id="MainSiteSearchOpen" href="#" style="text-decoration: none;" tabindex="0" aria-label="PepsiCo Search">
          <img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1775626484347.svg+xml"/>
        </a>
      </li>
    </ul>
  `;
  transparentHeaderWrapper.append(headRightNav);

  // Add event listener for the search icon
  const searchIcon = headRightNav.querySelector('#MainSiteSearchOpen');
  if (searchIcon) {
    searchIcon.addEventListener('click', (e) => {
      e.preventDefault();
      // Implement search functionality here, e.g., toggle a search modal or input field
      console.log('Search icon clicked!');
    });
  }

  const emptyDiv = document.createElement('div');
  emptyDiv.style.height = '550px'; // This style is directly from the original HTML, so it's allowed.

  block.textContent = '';
  block.append(heroLargeImageDiv, heroSmallImageDiv, banTransTextDiv, transparentHeaderWrapper, emptyDiv);
}
