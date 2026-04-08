import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const products = [...block.children];

  block.textContent = '';
  block.classList.add('CarouselProductsBig-module-scss-module__lT18Ua__CarouselProductsBig');
  block.setAttribute('aria-roledescription', 'carousel');
  block.setAttribute('aria-label', 'Featured products carousel');

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add(
    'swiper',
    'swiper-initialized',
    'swiper-horizontal',
    'swiper-watch-progress',
    'CarouselProductsBig-module-scss-module__lT18Ua__CarouselProductsBigSwiper',
    'swiper-backface-hidden',
  );
  swiperContainer.setAttribute('aria-roledescription', 'carousel');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperWrapper.setAttribute('aria-live', 'polite');
  swiperWrapper.id = `swiper-wrapper-${Math.random().toString(36).substring(2, 15)}`; // Unique ID

  products.forEach((row, index) => {
    const cells = [...row.children];

    // Content detection for cells based on BlockJson and EDS Block Structure
    const backgroundImageCell = cells.find(cell => cell.querySelector('picture') && cell.textContent.trim() === ''); // Assuming background image cell only contains picture
    const backgroundColorCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim().startsWith('#')); // Assuming color is a hex code
    const titleCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim() !== '' && !cell.textContent.trim().startsWith('#')); // Assuming title is plain text
    const productImageCell = cells.find(cell => cell.querySelector('picture') && cell !== backgroundImageCell); // Another picture, not the background one
    const productLinkCell = cells.find(cell => cell.querySelector('a') && cell.querySelector('a').href.includes('/products/')); // Link to a product
    const buttonLinkCell = cells.find(cell => cell.querySelector('a') && cell !== productLinkCell); // Another link, likely the button link
    const buttonLabelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell !== backgroundColorCell && cell !== titleCell); // Remaining text cell for button label

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');
    swiperSlide.setAttribute('role', 'group');
    swiperSlide.setAttribute('aria-roledescription', 'slide');
    swiperSlide.setAttribute('aria-label', `${index + 1} of ${products.length}`);
    swiperSlide.setAttribute('data-swiper-slide-index', index);
    moveInstrumentation(row, swiperSlide);

    const productLink = productLinkCell?.querySelector('a');
    const productAnchor = document.createElement('a');
    productAnchor.classList.add('ThumbnailBig-module-scss-module__2Nk34G__ThumbnailBig');
    if (productLink) {
      productAnchor.href = productLink.href;
    }
    if (backgroundColorCell) {
      productAnchor.style.backgroundColor = backgroundColorCell.textContent.trim();
    }

    const bgWrapper = document.createElement('div');
    bgWrapper.classList.add(
      'ThumbnailBig-module-scss-module__2Nk34G__ThumbnailBigBgWrapper',
      'thumbnail-bg-wrapper',
    );
    const bgPicture = backgroundImageCell?.querySelector('picture');
    if (bgPicture) {
      const img = bgPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1140' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      bgWrapper.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add(
        'img',
        'lazy',
        'ThumbnailBig-module-scss-module__2Nk34G__ThumbnailBigBgImage',
      );
    }

    const title = document.createElement('h3');
    title.classList.add('srt');
    if (titleCell) {
      title.textContent = titleCell.textContent.trim();
    }

    const productImageDiv = document.createElement('div');
    productImageDiv.classList.add('ThumbnailBig-module-scss-module__2Nk34G__ThumbnailBigImage');
    const productPicture = productImageCell?.querySelector('picture');
    if (productPicture) {
      const img = productPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '500' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      productImageDiv.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('img', 'lazy');
    }

    productAnchor.append(bgWrapper, title, productImageDiv);

    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('CarouselProductsBig-module-scss-module__lT18Ua__button');

    const buttonLink = buttonLinkCell?.querySelector('a');
    const buttonElement = document.createElement('a');
    buttonElement.classList.add('Button-module-scss-module__VLzsWq__button');
    if (buttonLink) {
      buttonElement.href = buttonLink.href;
    }
    if (buttonLabelCell) {
      buttonElement.textContent = buttonLabelCell.textContent.trim();
    }

    buttonWrapper.append(buttonElement);
    swiperSlide.append(productAnchor, buttonWrapper);
    swiperWrapper.append(swiperSlide);
  });

  swiperContainer.append(swiperWrapper);
  block.append(swiperContainer);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  swiperContainer.append(swiperNotification);

  const prevButton = document.createElement('button');
  prevButton.classList.add('swiper-button-prev-featured');
  prevButton.setAttribute('aria-label', 'Previous product');
  prevButton.setAttribute('aria-controls', swiperWrapper.id);
  prevButton.type = 'button';
  const prevImg = document.createElement('img');
  prevImg.alt = 'svg file';
  prevImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775569357662.svg+xml'; // Corrected path from ORIGINAL HTML
  prevButton.append(prevImg);
  block.append(prevButton);

  const nextButton = document.createElement('button');
  nextButton.classList.add('swiper-button-next-featured');
  nextButton.setAttribute('aria-label', 'Next product');
  nextButton.setAttribute('aria-controls', swiperWrapper.id);
  nextButton.type = 'button';
  const nextImg = document.createElement('img');
  nextImg.alt = 'svg file';
  nextImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775569357680.svg+xml'; // Corrected path from ORIGINAL HTML
  nextButton.append(nextImg);
  block.append(nextButton);

  // Basic swiper-like functionality (no actual swiper.js loaded)
  let currentIndex = 0;

  const updateCarousel = () => {
    swiperWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    [...swiperWrapper.children].forEach((slide, idx) => {
      if (idx === currentIndex) {
        slide.classList.add('swiper-slide-active', 'swiper-slide-fully-visible');
        slide.setAttribute('aria-hidden', 'false');
        slide.removeAttribute('tabindex');
      } else {
        slide.classList.remove('swiper-slide-active', 'swiper-slide-fully-visible');
        slide.setAttribute('aria-hidden', 'true');
        slide.setAttribute('tabindex', '-1');
      }
      if (idx === currentIndex + 1) {
        slide.classList.add('swiper-slide-next');
      } else {
        slide.classList.remove('swiper-slide-next');
      }
    });
    swiperNotification.textContent = `Slide ${currentIndex + 1} of ${products.length}`;
  };

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + products.length) % products.length;
    updateCarousel();
  });

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % products.length;
    updateCarousel();
  });

  updateCarousel();
}
