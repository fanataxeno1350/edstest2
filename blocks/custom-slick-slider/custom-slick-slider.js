import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const sliderContainer = document.createElement('div');
  sliderContainer.classList.add('regular', 'slider', 'hero_banner_height_70', 'slick-initialized', 'slick-slider');
  sliderContainer.setAttribute('role', 'region');
  sliderContainer.setAttribute('aria-roledescription', 'carousel');

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');
  sliderContainer.append(slickList);

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');
  slickList.append(slickTrack);

  [...block.children].forEach((row, index) => {
    const [videoCell, desktopImageCell, mobileImageCell, titleCell, subtitleCell] = [...row.children];

    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slick-slide');
    if (index === 0) {
      slideDiv.classList.add('slick-current', 'slick-active');
    }
    slideDiv.setAttribute('data-slick-index', index);
    slideDiv.setAttribute('role', 'group');
    slideDiv.setAttribute('aria-roledescription', 'slide');

    const bannerSlider = document.createElement('div');
    bannerSlider.classList.add('banner-slider', 'hero_banner_height_70');
    slideDiv.append(bannerSlider);

    const videoElement = videoCell.querySelector('picture');
    if (videoElement) {
      const videoLink = videoElement.querySelector('source')?.getAttribute('srcset') || videoElement.querySelector('img')?.src;
      if (videoLink && /\.(mp4|webm|ogg|mov)$/i.test(videoLink)) {
        const carouselVideo = document.createElement('div');
        carouselVideo.classList.add('carousel-video');
        const video = document.createElement('video');
        video.src = videoLink;
        video.playsInline = true;
        video.preload = 'auto';
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        carouselVideo.append(video);
        bannerSlider.append(carouselVideo);
      }
    }

    const desktopImage = desktopImageCell.querySelector('picture');
    if (desktopImage) {
      const carouselDesktopImage = document.createElement('div');
      carouselDesktopImage.classList.add('carousel-image', 'carousel-desktop-image');
      const img = desktopImage.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1920' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        carouselDesktopImage.style.backgroundImage = `url(${optimizedPic.querySelector('img').src})`;
      }
      bannerSlider.append(carouselDesktopImage);
    }

    const mobileImage = mobileImageCell.querySelector('picture');
    if (mobileImage) {
      const carouselMobileImage = document.createElement('div');
      carouselMobileImage.classList.add('carousel-image', 'carousel-mobile-image');
      const img = mobileImage.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        carouselMobileImage.style.backgroundImage = `url(${optimizedPic.querySelector('img').src})`;
      }
      bannerSlider.append(carouselMobileImage);
    }

    const carouselCaption = document.createElement('div');
    carouselCaption.classList.add('carousel-caption');

    const captionContent = document.createElement('div');
    captionContent.classList.add('caption-content', 'text-align', 'text-align-center');

    const titleText = titleCell.textContent.trim();
    if (titleText) {
      const h1 = document.createElement('h1');
      h1.classList.add('banner-title-medium');
      h1.textContent = titleText;
      captionContent.append(h1);
    }

    const subtitleText = subtitleCell.textContent.trim();
    if (subtitleText) {
      const p = document.createElement('p');
      p.classList.add('yellow-large');
      p.textContent = subtitleText;
      captionContent.append(p);
    }

    carouselCaption.append(captionContent);
    bannerSlider.append(carouselCaption);
    slickTrack.append(slideDiv);
    moveInstrumentation(row, slideDiv);
  });

  block.innerHTML = '';
  block.classList.add('component-custom-slick-slider');
  block.append(sliderContainer);

  // Add basic slick-like functionality for demonstration
  let currentIndex = 0;
  const slides = [...slickTrack.children];
  const totalSlides = slides.length;

  const showSlide = (idx) => {
    slides.forEach((slide, i) => {
      slide.classList.remove('slick-current', 'slick-active');
      slide.style.transform = `translateX(-${idx * 100}%)`;
    });
    slides[idx].classList.add('slick-current', 'slick-active');
  };

  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    showSlide(currentIndex);
  };

  if (totalSlides > 1) {
    setInterval(nextSlide, 3000); // Auto-rotate every 3 seconds
  }
  showSlide(currentIndex);
}
