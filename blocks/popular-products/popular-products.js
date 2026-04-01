import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // BlockJson has 3 root fields: title, subtitle, products (container)
  // The 'products' field is a container, its items are the subsequent rows.
  // So, we expect 3 root rows, and then the item rows.
  const [titleRow, subtitleRow, productsContainerRow, ...itemRows] = [...block.children];

  // Create header section
  const headerSection = document.createElement('div');
  headerSection.classList.add('cmp-popular-products__header-section');

  const title = document.createElement('h2');
  title.classList.add('cmp-popular-products__title');
  moveInstrumentation(titleRow.firstElementChild, title);
  title.append(...titleRow.firstElementChild.children);
  headerSection.append(title);

  const subtitle = document.createElement('div');
  subtitle.classList.add('cmp-popular-products__subtitle');
  moveInstrumentation(subtitleRow.firstElementChild, subtitle);
  subtitle.append(...subtitleRow.firstElementChild.children);
  headerSection.append(subtitle);

  // Create carousel section
  const carouselSection = document.createElement('div');
  carouselSection.classList.add('cmp-popular-products__carousel'); // Use block-specific class
  // The original HTML shows these classes on a div *inside* cmp-popular-products__carousel
  // <div class="slickcarousel carousel panelcontainer ">
  const slickCarouselWrapper = document.createElement('div');
  slickCarouselWrapper.classList.add('slickcarousel', 'carousel', 'panelcontainer');
  carouselSection.append(slickCarouselWrapper);


  const cmpCarousel = document.createElement('div');
  cmpCarousel.classList.add('cmp-carousel');
  // Add data attributes from original HTML if needed, but not for interactive behavior
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
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.setAttribute('aria-disabled', 'true');
  prevButton.textContent = 'Previous';

  const nextButton = document.createElement('button');
  nextButton.classList.add('slick-next', 'slick-arrow');
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.setAttribute('aria-disabled', 'false');
  nextButton.textContent = 'Next';

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');
  slickTrack.style.opacity = '1'; // Styles from original HTML
  slickTrack.style.width = `${itemRows.length * 1012}px`; // Assuming 1012px width per item

  const slickDots = document.createElement('ul');
  slickDots.classList.add('slick-dots');
  slickDots.setAttribute('role', 'tablist');

  itemRows.forEach((row, index) => {
    // BlockJson for popular-product-item has 4 fields: image, link, product-name, product-details
    const [imageCell, linkCell, nameCell, detailsCell] = [...row.children];

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('cmp-popular-products__carousel-item', 'cmp-carousel__item', 'slick-slide');
    carouselItem.setAttribute('data-slick-index', index);
    carouselItem.setAttribute('aria-hidden', index !== 0);
    carouselItem.setAttribute('tabindex', index === 0 ? '0' : '-1');
    carouselItem.setAttribute('role', 'tabpanel');
    carouselItem.setAttribute('id', `slick-slide3${index}`);
    carouselItem.setAttribute('aria-describedby', `slick-slide-control3${index}`);
    carouselItem.style.width = '1012px'; // From original HTML

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('cmp-popular-products__content-wrapper');

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('cmp-popular-products__image');
    imageDiv.style.backgroundImage = 'url("/etc.clientlibs/itc-foods-brands/clientlibs/clientlib-aashirvaad/resources/images/product-background.svg")'; // From original HTML

    const productLink = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      productLink.href = foundLink.href;
      productLink.setAttribute('tabindex', index === 0 ? '0' : '-1');
    }
    moveInstrumentation(linkCell, productLink);

    const lazyImageContainer = document.createElement('div');
    lazyImageContainer.classList.add('lazy-image-container');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      lazyImageContainer.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('cmp-popular-products__prod-image', 'lazy-image', 'loaded');
      optimizedPic.querySelector('img').style.opacity = '1';
      optimizedPic.querySelector('img').style.transition = 'opacity 0.3s ease-in-out';
    }
    productLink.append(lazyImageContainer);
    imageDiv.append(productLink);

    const productDescription = document.createElement('div');
    productDescription.classList.add('cmp-popular-products__product-description');

    const productName = document.createElement('div');
    productName.classList.add('cmp-popular-products__product-name');
    productName.setAttribute('data-title', nameCell.textContent.trim());
    moveInstrumentation(nameCell, productName);
    productName.append(...nameCell.children);

    const mobileWeightSpan = document.createElement('span');
    mobileWeightSpan.classList.add('cmp-popular-products__mobile-weight');
    productName.append(mobileWeightSpan);

    const quantityContainer = document.createElement('div');
    quantityContainer.classList.add('cmp-popular-products__quantity-container');

    const productDetails = document.createElement('div');
    productDetails.classList.add('cmp-popular-products__product-details');
    moveInstrumentation(detailsCell, productDetails);
    productDetails.append(...detailsCell.children);

    const actionDiv = document.createElement('div');
    actionDiv.classList.add('cmp-popular-products__action');

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button', 'cmp-button--secondary', 'cmp-button--secondary-light');

    const button = document.createElement('button');
    button.classList.add('cmp-button');
    button.setAttribute('type', 'button');
    button.setAttribute('tabindex', index === 0 ? '0' : '-1');

    const buttonText = document.createElement('span');
    buttonText.classList.add('cmp-button__text');
    buttonText.textContent = 'Buy Now';
    button.append(buttonText);
    buttonDiv.append(button);
    actionDiv.append(buttonDiv);

    productDescription.append(productName, quantityContainer, productDetails, actionDiv);
    contentWrapper.append(imageDiv, productDescription);
    carouselItem.append(contentWrapper);
    slickTrack.append(carouselItem);

    const dotLi = document.createElement('li');
    dotLi.setAttribute('role', 'presentation');
    if (index === 0) {
      dotLi.classList.add('slick-active');
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
    }
    dotButton.textContent = index + 1;
    dotLi.append(dotButton);
    slickDots.append(dotLi);
  });

  slickList.append(slickTrack);
  carouselContainer.append(prevButton, slickList, nextButton, slickDots);
  cmpCarousel.append(carouselContainer);
  slickCarouselWrapper.append(cmpCarousel); // Append cmpCarousel to the wrapper

  block.textContent = '';
  block.classList.add('cmp-popular-products'); // Add main block class
  block.append(headerSection, carouselSection);

  // Basic carousel functionality (simplified - full slick.js functionality would be more complex)
  let currentIndex = 0;
  const totalItems = itemRows.length;
  const itemWidth = 1012; // From original HTML

  const updateCarousel = () => {
    slickTrack.style.transform = `translate3d(-${currentIndex * itemWidth}px, 0px, 0px)`;

    [...slickTrack.children].forEach((item, i) => {
      item.setAttribute('aria-hidden', i !== currentIndex);
      item.setAttribute('tabindex', i === currentIndex ? '0' : '-1');
      item.classList.toggle('slick-current', i === currentIndex);
      item.classList.toggle('slick-active', i === currentIndex);

      const itemLink = item.querySelector('.cmp-popular-products__image a');
      const itemButton = item.querySelector('.cmp-popular-products__action .cmp-button');
      if (itemLink) itemLink.setAttribute('tabindex', i === currentIndex ? '0' : '-1');
      if (itemButton) itemButton.setAttribute('tabindex', i === currentIndex ? '0' : '-1');
    });

    [...slickDots.children].forEach((dot, i) => {
      dot.classList.toggle('slick-active', i === currentIndex);
      dot.querySelector('button').setAttribute('aria-selected', i === currentIndex);
      dot.querySelector('button').setAttribute('tabindex', i === currentIndex ? '0' : '-1');
    });

    prevButton.classList.toggle('slick-disabled', currentIndex === 0);
    prevButton.setAttribute('aria-disabled', currentIndex === 0);
    nextButton.classList.toggle('slick-disabled', currentIndex === totalItems - 1);
    nextButton.setAttribute('aria-disabled', currentIndex === totalItems - 1);
  };

  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentIndex < totalItems - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  slickDots.querySelectorAll('button').forEach((dotButton, index) => {
    dotButton.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
  });

  // Auto-play functionality
  const autoPlayEnabled = cmpCarousel.getAttribute('data-auto-play-is-enabled') === 'true';
  const autoPlaySpeed = parseInt(cmpCarousel.getAttribute('data-auto-play-speed-in-ms'), 10) || 3000;
  let autoPlayInterval;

  const startAutoPlay = () => {
    if (autoPlayEnabled && totalItems > 1) {
      autoPlayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
      }, autoPlaySpeed);
    }
  };

  const stopAutoPlay = () => {
    clearInterval(autoPlayInterval);
  };

  // Pause auto-play on hover
  carouselContainer.addEventListener('mouseenter', stopAutoPlay);
  carouselContainer.addEventListener('mouseleave', startAutoPlay);

  updateCarousel(); // Initial state
  startAutoPlay(); // Start auto-play
}
