import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    headerImageRow,
    bannerLogoRow,
    bannerTitleRow,
    ...bannerSlideRows
  ] = [...block.children];

  // Header Banner Image
  const headerBanner = document.createElement('div');
  headerBanner.classList.add('header-banner');
  const headerImage = headerImageRow?.querySelector('picture');
  if (headerImage) {
    const img = headerImage.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
    optimizedPic.querySelector('img').classList.add('m-header-banner');
    moveInstrumentation(headerImage, optimizedPic.querySelector('img'));
    headerBanner.append(optimizedPic);
  }
  moveInstrumentation(headerImageRow, headerBanner);

  // Header Content
  const headerContent = document.createElement('div');
  headerContent.classList.add('header-content');

  // Banner Logo
  const bannerLogo = bannerLogoRow?.querySelector('picture');
  if (bannerLogo) {
    const img = bannerLogo.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '250' }]);
    optimizedPic.querySelector('img').classList.add('banner-logo');
    moveInstrumentation(bannerLogo, optimizedPic.querySelector('img'));
    headerContent.append(optimizedPic);
  }
  moveInstrumentation(bannerLogoRow, headerContent);

  // Banner Title
  const bannerTitle = document.createElement('h2');
  bannerTitle.textContent = bannerTitleRow?.textContent.trim() || '';
  moveInstrumentation(bannerTitleRow, bannerTitle);
  headerContent.append(bannerTitle);

  // Home Banner (slider)
  const homeBanner = document.createElement('div');
  homeBanner.classList.add('home-banner');
  const bxWrapper = document.createElement('div');
  bxWrapper.classList.add('bx-wrapper');
  const bxViewport = document.createElement('div');
  bxViewport.classList.add('bx-viewport');
  const bxSlider = document.createElement('ul');
  bxSlider.classList.add('bxslider-2');

  bannerSlideRows.forEach((row) => {
    const [slideImageCell, slideCopyCell] = [...row.children];
    const li = document.createElement('li');

    // Slide Image
    const slideImage = slideImageCell?.querySelector('picture');
    if (slideImage) {
      const img = slideImage.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(slideImage, optimizedPic.querySelector('img'));
      li.append(optimizedPic);
    }

    // Slide Copy
    const bannerCopy = document.createElement('div');
    bannerCopy.classList.add('banner-copy');
    bannerCopy.innerHTML = slideCopyCell?.innerHTML || '';
    li.append(bannerCopy);

    moveInstrumentation(row, li);
    bxSlider.append(li);
  });

  bxViewport.append(bxSlider);
  bxWrapper.append(bxViewport);
  homeBanner.append(bxWrapper);

  headerContent.append(homeBanner);
  block.append(headerBanner, headerContent);
}
