import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const bannerCmpBanner = document.createElement('div');
  bannerCmpBanner.classList.add('banner-cmp-banner');
  bannerCmpBanner.dataset.component = 'banner';
  bannerCmpBanner.dataset.initialized = 'true';

  const backgroundImage = block.querySelector('[data-aue-prop="backgroundImage"]');
  if (backgroundImage) {
    const imgSrc = backgroundImage.querySelector('img')?.src || backgroundImage.textContent.trim();
    if (imgSrc) {
      bannerCmpBanner.style.backgroundImage = `url("${imgSrc}")`;
    }
    moveInstrumentation(backgroundImage, bannerCmpBanner);
  }

  const bannerCmpBannerContent = document.createElement('div');
  bannerCmpBannerContent.classList.add('banner-cmp-banner__content');

  const logo = block.querySelector('[data-aue-prop="logo"]');
  if (logo) {
    const bannerItemLogo = document.createElement('div');
    bannerItemLogo.classList.add('banner-cmp-banner__item-logo');
    const logoImg = logo.querySelector('img');
    if (logoImg) {
      bannerItemLogo.append(logoImg);
      moveInstrumentation(logo, bannerItemLogo);
    }
    bannerCmpBannerContent.append(bannerItemLogo);
  }

  const title = block.querySelector('[data-aue-prop="title"]');
  if (title) {
    const h2 = document.createElement('h2');
    h2.classList.add('banner-cmp-banner__title');
    h2.textContent = title.textContent.trim();
    bannerCmpBannerContent.append(h2);
    moveInstrumentation(title, h2);
  }

  const subTitle = block.querySelector('[data-aue-prop="subTitle"]');
  if (subTitle) {
    const h3 = document.createElement('h3');
    h3.classList.add('banner-cmp-banner__sub-title');
    h3.textContent = subTitle.textContent.trim();
    bannerCmpBannerContent.append(h3);
    moveInstrumentation(subTitle, h3);
  }

  const mainImage = block.querySelector('[data-aue-prop="mainImage"]');
  if (mainImage) {
    const img = mainImage.querySelector('img');
    if (img) {
      const picture = createOptimizedPicture(img.src, img.alt, false, [{
        media: '(max-width: 600px)',
        srcset: img.dataset.mobileSrc || img.src,
      }, {
        media: '(min-width: 601px)',
        srcset: img.dataset.desktopSrc || img.src,
      }]);
      picture.classList.add('banner-w-100', 'banner-d-block');
      const pictureImg = picture.querySelector('img');
      if (pictureImg) {
        pictureImg.classList.add('banner-cmp-banner__image', 'banner-w-100', 'banner-d-block');
        pictureImg.setAttribute('fetchpriority', 'high');
      }
      bannerCmpBannerContent.append(picture);
      moveInstrumentation(mainImage, picture);
    }
  }

  const buttonLink = block.querySelector('[data-aue-prop="buttonLink"]');
  const buttonText = block.querySelector('[data-aue-prop="buttonText"]');

  if (buttonLink || buttonText) {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('banner-null', 'banner-button', 'banner-cmp-button--primary-anchor');

    const a = document.createElement('a');
    a.classList.add('banner-cmp-button');
    a.dataset.request = 'true';
    a.setAttribute('tabindex', '0');

    if (buttonLink) {
      a.href = buttonLink.textContent.trim();
      moveInstrumentation(buttonLink, a);
    } else {
      a.href = '#'; // Fallback if no link is provided
    }

    const span = document.createElement('span');
    span.classList.add('banner-cmp-button__text');
    if (buttonText) {
      span.textContent = buttonText.textContent.trim();
      moveInstrumentation(buttonText, span);
    } else {
      span.textContent = 'Learn More'; // Default button text
    }
    a.append(span);
    buttonContainer.append(a);
    bannerCmpBannerContent.append(buttonContainer);
  }

  bannerCmpBanner.append(bannerCmpBannerContent);

  block.textContent = '';
  block.append(bannerCmpBanner);
  block.className = 'banner-banner banner-cmp-banner--logo block';
  block.dataset.blockStatus = 'loaded';
}