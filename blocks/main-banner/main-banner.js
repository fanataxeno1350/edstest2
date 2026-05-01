import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const headerBannerWrapper = document.createElement('div');
  headerBannerWrapper.classList.add('header-banner');

  // Root field: headerImage
  const headerImageRow = children[0];
  const headerImageCell = headerImageRow.firstElementChild;
  const headerPicture = headerImageCell.querySelector('picture');
  if (headerPicture) {
    const headerImg = headerPicture.querySelector('img');
    if (headerImg) {
      const optimizedHeaderPic = createOptimizedPicture(headerImg.src, headerImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(headerImg, optimizedHeaderPic.querySelector('img'));
      headerPicture.replaceWith(optimizedHeaderPic);
      optimizedHeaderPic.querySelector('img').classList.add('m-header-banner');
      headerBannerWrapper.append(optimizedHeaderPic);
    }
  }
  moveInstrumentation(headerImageRow, headerBannerWrapper);

  const headerContent = document.createElement('div');
  headerContent.classList.add('header-content');

  // Root field: bannerLogo
  const bannerLogoRow = children[1];
  const bannerLogoCell = bannerLogoRow.firstElementChild;
  const bannerLogoPicture = bannerLogoCell.querySelector('picture');
  if (bannerLogoPicture) {
    const bannerLogoImg = bannerLogoPicture.querySelector('img');
    if (bannerLogoImg) {
      const optimizedBannerLogoPic = createOptimizedPicture(bannerLogoImg.src, bannerLogoImg.alt, false, [{ width: '200' }]);
      moveInstrumentation(bannerLogoImg, optimizedBannerLogoPic.querySelector('img'));
      bannerLogoPicture.replaceWith(optimizedBannerLogoPic);
      optimizedBannerLogoPic.querySelector('img').classList.add('banner-logo');
      headerContent.append(optimizedBannerLogoPic);
    }
  }
  moveInstrumentation(bannerLogoRow, headerContent);

  // Root field: headline
  const headlineRow = children[2];
  const headlineCell = headlineRow.firstElementChild;
  const headline = document.createElement('h2');
  headline.textContent = headlineCell.textContent.trim();
  headline.style.cssText = 'color: #ff9416; text-transform: inherit; font-family: \'DINPro-Bold\'; font-style: inherit;';
  headerContent.append(headline);
  moveInstrumentation(headlineRow, headerContent);

  headerBannerWrapper.append(headerContent);

  const homeBanner = document.createElement('div');
  homeBanner.classList.add('home-banner');

  const bxWrapper = document.createElement('div');
  bxWrapper.classList.add('bx-wrapper');

  const bxViewport = document.createElement('div');
  bxViewport.classList.add('bx-viewport');

  const bxslider = document.createElement('ul');
  bxslider.classList.add('bxslider-2');

  const slideRows = children.slice(3); // All remaining children are slide item rows

  slideRows.forEach((row) => {
    // Item fields: slideImage, slideCopy
    const cells = [...row.children];
    const slideImageCell = cells[0]; // First cell is always slideImage
    const slideCopyCell = cells[1]; // Second cell is always slideCopy

    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const slideImagePicture = slideImageCell.querySelector('picture');
    if (slideImagePicture) {
      const slideImg = slideImagePicture.querySelector('img');
      if (slideImg) {
        const optimizedSlidePic = createOptimizedPicture(slideImg.src, slideImg.alt, false, [{ width: '750' }]);
        moveInstrumentation(slideImg, optimizedSlidePic.querySelector('img'));
        slideImagePicture.replaceWith(optimizedSlidePic);
        const videoDiv = document.createElement('div');
        videoDiv.id = 'video';
        videoDiv.append(optimizedSlidePic);
        li.append(videoDiv);
      }
    } else if (slideImageCell.querySelector('a')) {
      const link = slideImageCell.querySelector('a');
      if (link && /\.(mp4|webm|ogg|mov)$/i.test(link.href)) {
        const video = document.createElement('video');
        video.src = link.href;
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        video.loop = false;
        video.classList.add('mobile-only'); // Assuming this class is for video styling
        const videoDiv = document.createElement('div');
        videoDiv.id = 'video';
        videoDiv.append(video);
        li.append(videoDiv);
      }
    }

    if (slideCopyCell && slideCopyCell.innerHTML.trim()) {
      const bannerCopy = document.createElement('div');
      bannerCopy.classList.add('banner-copy');
      bannerCopy.innerHTML = slideCopyCell.innerHTML; // Use innerHTML for richtext
      li.append(bannerCopy);
    }

    bxslider.append(li);
  });

  bxViewport.append(bxslider);
  bxWrapper.append(bxViewport);

  const bxControls = document.createElement('div');
  bxControls.classList.add('bx-controls');
  bxWrapper.append(bxControls);

  homeBanner.append(bxWrapper);

  block.innerHTML = '';
  block.append(headerBannerWrapper, homeBanner);

  // Simple carousel logic for demonstration (EDS doesn't load bxslider JS)
  let currentSlide = 0;
  const slides = [...bxslider.children];
  const slideCount = slides.length;

  if (slideCount > 0) {
    const updateSlide = () => {
      slides.forEach((slide, i) => {
        slide.style.display = (i === currentSlide) ? 'block' : 'none';
      });
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % slideCount;
      updateSlide();
    };

    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + slideCount) % slideCount;
      updateSlide();
    };

    // Initial display
    updateSlide();

    // Add navigation buttons if needed (example)
    if (slideCount > 1) {
      const prevButton = document.createElement('button');
      prevButton.textContent = 'Prev';
      prevButton.classList.add('bx-prev'); // Add a class for styling if needed
      prevButton.addEventListener('click', prevSlide);
      bxControls.append(prevButton);

      const nextButton = document.createElement('button');
      nextButton.textContent = 'Next';
      nextButton.classList.add('bx-next'); // Add a class for styling if needed
      nextButton.addEventListener('click', nextSlide);
      bxControls.append(nextButton);
    }
  }
}
