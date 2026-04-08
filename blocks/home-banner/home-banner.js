import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundImageRow,
    headingRow,
    bannerTextRow,
    rotatorImage1Row,
    rotatorImage2Row,
    rotatorImage3Row,
  ] = [...block.children];

  block.classList.add('home-banner');

  const pentionBnr = document.createElement('div');
  pentionBnr.classList.add('pention_bnr');

  const bannerHld = document.createElement('div');
  bannerHld.classList.add('banner-hld');

  // Background Image
  const animBg = document.createElement('div');
  animBg.classList.add('anim-bg');
  const bgFigure = document.createElement('figure');
  const bgPicture = backgroundImageRow.querySelector('picture'); // Corrected: use querySelector
  if (bgPicture) {
    const bgImg = bgPicture.querySelector('img');
    if (bgImg) {
      const optimizedBgPic = createOptimizedPicture(bgImg.src, bgImg.alt, false, [{ width: '1920' }]);
      moveInstrumentation(bgImg, optimizedBgPic.querySelector('img'));
      optimizedBgPic.querySelector('img').classList.add('bg-cover');
      bgFigure.append(optimizedBgPic);
    }
  }
  moveInstrumentation(backgroundImageRow, bgFigure);
  animBg.append(bgFigure);
  bannerHld.append(animBg);

  const containerWrp = document.createElement('div');
  containerWrp.classList.add('container-1600-wrp');

  // Heading
  const captionWrp = document.createElement('div');
  captionWrp.classList.add('caption-wrp');
  const heading = document.createElement('h2');
  moveInstrumentation(headingRow, heading);
  while (headingRow.firstElementChild) heading.append(headingRow.firstElementChild);
  captionWrp.append(heading);
  containerWrp.append(captionWrp);

  // Banner Text
  const bannerText = document.createElement('div');
  bannerText.classList.add('banner-text');
  moveInstrumentation(bannerTextRow, bannerText);
  while (bannerTextRow.firstElementChild) {
    const span = document.createElement('span');
    span.style.display = 'block';
    span.style.opacity = '1'; // Default to visible, JS will handle rotation
    moveInstrumentation(bannerTextRow.firstElementChild, span);
    while (bannerTextRow.firstElementChild.firstChild) span.append(bannerTextRow.firstElementChild.firstChild);
    bannerText.append(span);
  }
  containerWrp.append(bannerText);
  bannerHld.append(containerWrp);

  // Rotator Images
  const rotator = document.createElement('div');
  rotator.classList.add('rotator');
  const rotatorFigure = document.createElement('figure');

  const rotatorImages = [rotatorImage1Row, rotatorImage2Row, rotatorImage3Row];
  rotatorImages.forEach((row, index) => {
    const picture = row.querySelector('picture'); // Corrected: use querySelector
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1920' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.querySelector('img').classList.add('bg-cover');
        if (index === 0) {
          optimizedPic.querySelector('img').style.display = 'block';
          optimizedPic.querySelector('img').style.opacity = '1'; // Matches original HTML
        } else {
          optimizedPic.querySelector('img').style.display = 'block';
          optimizedPic.querySelector('img').style.opacity = '0.7'; // Matches original HTML
        }
        rotatorFigure.append(optimizedPic);
      }
    }
    moveInstrumentation(row, rotatorFigure);
  });
  rotator.append(rotatorFigure);
  bannerHld.append(rotator);

  const bannerOverlay = document.createElement('div');
  bannerOverlay.classList.add('banner-overlay');
  bannerHld.append(bannerOverlay);

  pentionBnr.append(bannerHld);
  block.textContent = '';
  block.append(pentionBnr);

  // Implement banner text rotation
  const bannerTextSpans = [...bannerText.querySelectorAll('span')];
  let currentTextIndex = 0;

  const rotateBannerText = () => {
    bannerTextSpans.forEach((span, index) => {
      if (index === currentTextIndex) {
        span.style.opacity = '1';
      } else {
        span.style.opacity = '0';
      }
    });
    currentTextIndex = (currentTextIndex + 1) % bannerTextSpans.length;
  };

  if (bannerTextSpans.length > 1) {
    // Hide all but the first initially
    bannerTextSpans.forEach((span, index) => {
      span.style.transition = 'opacity 1s ease-in-out';
      if (index !== 0) {
        span.style.opacity = '0';
      }
    });
    setInterval(rotateBannerText, 3000); // Rotate every 3 seconds
  }

  // Implement rotator image rotation
  const rotatorImagesElements = [...rotatorFigure.querySelectorAll('img')];
  let currentRotatorIndex = 0;

  const rotateRotatorImages = () => {
    rotatorImagesElements.forEach((img, index) => {
      img.style.transition = 'opacity 1s ease-in-out';
      if (index === currentRotatorIndex) {
        img.style.opacity = '1';
      } else {
        img.style.opacity = '0.7';
      }
    });
    currentRotatorIndex = (currentRotatorIndex + 1) % rotatorImagesElements.length;
  };

  if (rotatorImagesElements.length > 1) {
    // Hide all but the first initially
    rotatorImagesElements.forEach((img, index) => {
      if (index !== 0) {
        img.style.opacity = '0.7'; // Matches original HTML initial state
      }
    });
    setInterval(rotateRotatorImages, 3000); // Rotate every 3 seconds
  }
}
