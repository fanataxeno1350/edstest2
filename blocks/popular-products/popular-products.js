import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, subtitleRow, ...itemRows] = [...block.children];

  const cmpPopularProducts = document.createElement('div');
  cmpPopularProducts.classList.add('cmp-popular-products');

  const headerSection = document.createElement('div');
  headerSection.classList.add('cmp-popular-products__header-section');

  const title = document.createElement('h2');
  title.classList.add('cmp-popular-products__title');
  moveInstrumentation(titleRow.firstElementChild, title);
  title.textContent = titleRow.firstElementChild.textContent.trim();

  const subtitle = document.createElement('div');
  subtitle.classList.add('cmp-popular-products__subtitle');
  moveInstrumentation(subtitleRow.firstElementChild, subtitle);
  subtitle.textContent = subtitleRow.firstElementChild.textContent.trim();

  headerSection.append(title, subtitle);
  cmpPopularProducts.append(headerSection);

  const carouselSection = document.createElement('div');
  carouselSection.classList.add('cmp-popular-products__carousel');

  const cmpCarousel = document.createElement('div');
  cmpCarousel.classList.add('cmp-carousel');
  cmpCarousel.setAttribute('data-component', 'carousel');
  cmpCarousel.setAttribute('data-show-infinite-scroll', 'false');
  cmpCarousel.setAttribute('data-show-arrows', 'true');
  cmpCarousel.setAttribute('data-show-dots', 'true');
  cmpCarousel.setAttribute('data-item-count-per-slide', '1');
  cmpCarousel.setAttribute('data-auto-play-is-enabled', 'true');
  cmpCarousel.setAttribute('data-auto-play-speed-in-ms', '3000');
  cmpCarousel.setAttribute('data-reveal-next-item-partially', 'false');
  cmpCarousel.setAttribute('data-show-center-zoom', 'false');
  cmpCarousel.setAttribute('data-slides-to-scroll', '1');

  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container', 'slick-initialized', 'slick-slider', 'slick-dotted');

  const prevButton = document.createElement('button');
  prevButton.classList.add('slick-prev', 'slick-arrow', 'slick-disabled');
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('aria-disabled', 'true');
  prevButton.textContent = 'Previous';

  const nextButton = document.createElement('button');
  nextButton.classList.add('slick-next', 'slick-arrow');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('aria-disabled', 'false');
  nextButton.textContent = 'Next';

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');
  slickTrack.style.opacity = '1';
  // Width and transform will be set by the carousel library

  itemRows.forEach((row, index) => {
    const item = document.createElement('div');
    moveInstrumentation(row, item);
    item.classList.add('cmp-popular-products__carousel-item', 'cmp-carousel__item', 'slick-slide');
    if (index === 0) {
      item.classList.add('slick-current', 'slick-active');
      item.setAttribute('aria-hidden', 'false');
      item.setAttribute('tabindex', '0');
    } else {
      item.setAttribute('aria-hidden', 'true');
      item.setAttribute('tabindex', '-1');
    }
    item.setAttribute('data-slick-index', index);
    item.setAttribute('role', 'tabpanel');
    item.setAttribute('id', `slick-slide3${index}`);
    item.setAttribute('aria-describedby', `slick-slide-control3${index}`);

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('cmp-popular-products__content-wrapper');

    // Content detection for cells
    const cells = [...row.children];
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const productLinkCell = cells.find(cell => cell.querySelector('a') && !cell.querySelector('picture'));
    const productNameCell = cells.find(cell => cell.textContent.trim() && !cell.querySelector('a') && !cell.querySelector('picture') && !cell.querySelector('p'));
    const productDetailsCell = cells.find(cell => cell.querySelector('p'));
    const ctaLabelCell = cells.find(cell => cell.textContent.trim() && cell !== productNameCell && cell !== productDetailsCell && cell !== productLinkCell && cell !== imageCell);


    const imageDiv = document.createElement('div');
    imageDiv.classList.add('cmp-popular-products__image');
    imageDiv.style.backgroundImage = 'url("/etc.clientlibs/itc-foods-brands/clientlibs/clientlib-aashirvaad/resources/images/product-background.svg")';

    const productLink = document.createElement('a');
    moveInstrumentation(productLinkCell?.querySelector('a'), productLink);
    productLink.href = productLinkCell?.querySelector('a')?.href || '#';
    productLink.setAttribute('tabindex', index === 0 ? '0' : '-1');

    const lazyImageContainer = document.createElement('div');
    lazyImageContainer.classList.add('lazy-image-container');

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.querySelector('img').classList.add('cmp-popular-products__prod-image', 'lazy-image', 'loaded');
        lazyImageContainer.append(optimizedPic);
      }
    }
    productLink.append(lazyImageContainer);
    imageDiv.append(productLink);

    const productDescription = document.createElement('div');
    productDescription.classList.add('cmp-popular-products__product-description');

    const productName = document.createElement('div');
    productName.classList.add('cmp-popular-products__product-name');
    if (productNameCell) {
      moveInstrumentation(productNameCell, productName);
      productName.textContent = productNameCell.textContent.trim();
      productName.setAttribute('data-title', productNameCell.textContent.trim());
    }


    const mobileWeightSpan = document.createElement('span');
    mobileWeightSpan.classList.add('cmp-popular-products__mobile-weight');
    productName.append(mobileWeightSpan);

    const quantityContainer = document.createElement('div');
    quantityContainer.classList.add('cmp-popular-products__quantity-container');

    const productDetails = document.createElement('div');
    productDetails.classList.add('cmp-popular-products__product-details');
    if (productDetailsCell) {
      moveInstrumentation(productDetailsCell, productDetails);
      productDetails.innerHTML = productDetailsCell.innerHTML;
    }

    const actionDiv = document.createElement('div');
    actionDiv.classList.add('cmp-popular-products__action');

    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('button', 'cmp-button--secondary', 'cmp-button--secondary-light');

    const ctaButton = document.createElement('button');
    ctaButton.classList.add('cmp-button');
    ctaButton.setAttribute('type', 'button');
    ctaButton.setAttribute('tabindex', index === 0 ? '0' : '-1');
    if (ctaLabelCell) {
      moveInstrumentation(ctaLabelCell, ctaButton); // Move instrumentation from ctaLabelCell to ctaButton
      const ctaSpan = document.createElement('span');
      ctaSpan.classList.add('cmp-button__text');
      ctaSpan.textContent = ctaLabelCell.textContent.trim();
      ctaButton.append(ctaSpan);
    }
    buttonWrapper.append(ctaButton);
    actionDiv.append(buttonWrapper);

    productDescription.append(productName, quantityContainer, productDetails, actionDiv);
    contentWrapper.append(imageDiv, productDescription);
    item.append(contentWrapper);
    slickTrack.append(item);
  });

  slickList.append(slickTrack);
  carouselContainer.append(prevButton, slickList, nextButton);

  const slickDots = document.createElement('ul');
  slickDots.classList.add('slick-dots');
  slickDots.setAttribute('role', 'tablist');

  itemRows.forEach((_, index) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'presentation');
    if (index === 0) {
      li.classList.add('slick-active');
    }

    const dotButton = document.createElement('button');
    dotButton.setAttribute('type', 'button');
    dotButton.setAttribute('role', 'tab');
    dotButton.setAttribute('id', `slick-slide-control3${index}`);
    dotButton.setAttribute('aria-controls', `slick-slide3${index}`);
    dotButton.setAttribute('aria-label', `${index + 1} of ${itemRows.length}`);
    dotButton.setAttribute('tabindex', index === 0 ? '0' : '-1');
    if (index === 0) {
      dotButton.setAttribute('aria-selected', 'true');
    } else {
      dotButton.setAttribute('aria-selected', 'false');
    }
    dotButton.textContent = index + 1;
    li.append(dotButton);
    slickDots.append(li);
  });

  carouselContainer.append(slickDots);
  cmpCarousel.append(carouselContainer);
  carouselSection.append(cmpCarousel);
  cmpPopularProducts.append(carouselSection);

  block.textContent = '';
  block.append(cmpPopularProducts);

  // Simple carousel logic (replace with actual slick carousel if needed)
  let currentIndex = 0;
  const items = [...slickTrack.children];
  const totalItems = items.length;
  let autoPlayInterval;

  function updateCarousel() {
    items.forEach((item, i) => {
      if (i === currentIndex) {
        item.classList.add('slick-current', 'slick-active');
        item.setAttribute('aria-hidden', 'false');
        item.setAttribute('tabindex', '0');
        item.style.display = 'block'; // Show current item
      } else {
        item.classList.remove('slick-current', 'slick-active');
        item.setAttribute('aria-hidden', 'true');
        item.setAttribute('tabindex', '-1');
        item.style.display = 'none'; // Hide other items
      }
    });

    [...slickDots.children].forEach((dotLi, i) => {
      const dotButton = dotLi.querySelector('button');
      if (i === currentIndex) {
        dotLi.classList.add('slick-active');
        dotButton.setAttribute('aria-selected', 'true');
        dotButton.setAttribute('tabindex', '0');
      } else {
        dotLi.classList.remove('slick-active');
        dotButton.setAttribute('aria-selected', 'false');
        dotButton.setAttribute('tabindex', '-1');
      }
    });

    if (totalItems > 1) {
      prevButton.setAttribute('aria-disabled', currentIndex === 0);
      prevButton.classList.toggle('slick-disabled', currentIndex === 0);
      nextButton.setAttribute('aria-disabled', currentIndex === totalItems - 1);
      nextButton.classList.toggle('slick-disabled', currentIndex === totalItems - 1);
    } else {
      prevButton.setAttribute('aria-disabled', 'true');
      prevButton.classList.add('slick-disabled');
      nextButton.setAttribute('aria-disabled', 'true');
      nextButton.classList.add('slick-disabled');
    }
  }

  function startAutoPlay() {
    const autoPlayEnabled = cmpCarousel.getAttribute('data-auto-play-is-enabled') === 'true';
    const autoPlaySpeed = parseInt(cmpCarousel.getAttribute('data-auto-play-speed-in-ms'), 10) || 3000;

    if (autoPlayEnabled && totalItems > 1) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
      }, autoPlaySpeed);
    }
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  prevButton.addEventListener('click', () => {
    stopAutoPlay();
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
    startAutoPlay();
  });

  nextButton.addEventListener('click', () => {
    stopAutoPlay();
    if (currentIndex < totalItems - 1) {
      currentIndex++;
      updateCarousel();
    }
    startAutoPlay();
  });

  slickDots.querySelectorAll('button').forEach((dotButton, i) => {
    dotButton.addEventListener('click', () => {
      stopAutoPlay();
      currentIndex = i;
      updateCarousel();
      startAutoPlay();
    });
  });

  // Pause autoplay on hover
  cmpCarousel.addEventListener('mouseenter', stopAutoPlay);
  cmpCarousel.addEventListener('mouseleave', startAutoPlay);

  updateCarousel(); // Initialize carousel state
  startAutoPlay(); // Start autoplay on load
}
