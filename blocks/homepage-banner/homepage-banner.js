import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    videoLargeRow,
    videoLargePosterRow,
    videoSmallRow,
    videoSmallPosterRow,
    primaryTitleRow,
    primaryCtaLinkRow,
    primaryCtaTextRow,
    secondaryTitleRow,
    secondaryCtaLinkRow,
    secondaryCtaTextRow,
    greetingMorningRow,
    greetingAfternoonRow,
    greetingEveningRow,
    greetingNightRow,
  ] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('grid-container', 'homepage-banner-wrapper', 'variation--banner', 'bg--paper-white');
  section.setAttribute('data-is-banner', 'true');

  const homepageBannerDiv = document.createElement('div');
  homepageBannerDiv.classList.add('homepage-banner', 'reveal-effect-container');
  moveInstrumentation(block, homepageBannerDiv);

  const mediaContainer = document.createElement('div');
  mediaContainer.classList.add('media-container');

  const getVideoSrc = (row) => {
    const picture = row.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      return img ? img.getAttribute('src') : '';
    }
    return '';
  };

  const videoLargeSrc = getVideoSrc(videoLargeRow);
  const videoLargePosterSrc = getVideoSrc(videoLargePosterRow);
  const videoSmallSrc = getVideoSrc(videoSmallRow);
  const videoSmallPosterSrc = getVideoSrc(videoSmallPosterRow);

  // Hidden images for preloading posters
  const hiddenImgLarge = document.createElement('img');
  hiddenImgLarge.src = videoLargePosterSrc;
  hiddenImgLarge.setAttribute('fetchpriority', 'high');
  hiddenImgLarge.alt = '';
  hiddenImgLarge.style.display = 'none';
  hiddenImgLarge.width = '1';
  hiddenImgLarge.height = '1';
  hiddenImgLarge.setAttribute('aria-hidden', 'true');
  mediaContainer.append(hiddenImgLarge);

  const hiddenImgSmall = document.createElement('img');
  hiddenImgSmall.src = videoSmallPosterSrc;
  hiddenImgSmall.setAttribute('fetchpriority', 'high');
  hiddenImgSmall.alt = '';
  hiddenImgSmall.style.display = 'none';
  hiddenImgSmall.width = '1';
  hiddenImgSmall.height = '1';
  hiddenImgSmall.setAttribute('aria-hidden', 'true');
  mediaContainer.append(hiddenImgSmall);


  const createVideoElement = (src, poster, classes) => {
    const video = document.createElement('video');
    video.muted = true;
    video.classList.add(...classes);
    video.playsInline = true;
    video.preload = 'auto'; // Changed from 'preload' which is a boolean attribute
    video.poster = poster;
    video.setAttribute('data-poster', poster);

    const source = document.createElement('source');
    source.src = src;
    source.type = 'video/mp4';
    video.append(source);
    return video;
  };

  const videoLarge = createVideoElement(videoLargeSrc, videoLargePosterSrc, ['video--large', 'show-for-large']);
  const videoSmall = createVideoElement(videoSmallSrc, videoSmallPosterSrc, ['video--small', 'hide-for-large']);

  mediaContainer.append(videoLarge, videoSmall);
  homepageBannerDiv.append(mediaContainer);

  const contentContainer = document.createElement('div');
  contentContainer.classList.add('content-container', 'animate-enter', 'in-view');

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('max-width-container');

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('content-wrapper');

  // Primary Title
  const primaryTitle = document.createElement('h1');
  primaryTitle.classList.add('primary-title');
  moveInstrumentation(primaryTitleRow.firstElementChild, primaryTitle);
  while (primaryTitleRow.firstElementChild.firstChild) {
    primaryTitle.append(primaryTitleRow.firstElementChild.firstChild);
  }
  contentWrapper.append(primaryTitle);

  // Primary CTA
  const primaryCtaContainer = document.createElement('div');
  primaryCtaContainer.classList.add('cta-container', 'primary-title-cta-container');

  const primaryCtaLinkEl = document.createElement('a');
  primaryCtaLinkEl.classList.add('button', 'red');
  const foundPrimaryLink = primaryCtaLinkRow.querySelector('a');
  if (foundPrimaryLink) {
    primaryCtaLinkEl.href = foundPrimaryLink.href;
    primaryCtaLinkEl.setAttribute('aria-label', '');
    primaryCtaLinkEl.rel = 'follow';
  }
  moveInstrumentation(primaryCtaLinkRow.firstElementChild, primaryCtaLinkEl);

  const primaryCtaTextSpan = document.createElement('span');
  primaryCtaTextSpan.classList.add('button-text');
  moveInstrumentation(primaryCtaTextRow.firstElementChild, primaryCtaTextSpan);
  primaryCtaTextSpan.textContent = primaryCtaTextRow.firstElementChild.textContent.trim();
  primaryCtaLinkEl.append(primaryCtaTextSpan);
  primaryCtaContainer.append(primaryCtaLinkEl);
  contentWrapper.append(primaryCtaContainer);

  // Secondary Title
  const secondaryTitleDiv = document.createElement('div');
  secondaryTitleDiv.classList.add('secondary-title');
  secondaryTitleDiv.style.display = 'none'; // Initially hidden

  const secondaryHeadline = document.createElement('div');
  secondaryHeadline.classList.add('headline-h1', 'font-weight-bold');
  moveInstrumentation(secondaryTitleRow.firstElementChild, secondaryHeadline);
  while (secondaryTitleRow.firstElementChild.firstChild) {
    secondaryHeadline.append(secondaryTitleRow.firstElementChild.firstChild);
  }
  secondaryTitleDiv.append(secondaryHeadline);

  // Secondary CTA
  const secondaryCtaContainer = document.createElement('div');
  secondaryCtaContainer.classList.add('cta-container');

  const secondaryCtaLinkEl = document.createElement('a');
  secondaryCtaLinkEl.classList.add('button', 'red');
  const foundSecondaryLink = secondaryCtaLinkRow.querySelector('a');
  if (foundSecondaryLink) {
    secondaryCtaLinkEl.href = foundSecondaryLink.href;
    secondaryCtaLinkEl.setAttribute('aria-label', '');
    secondaryCtaLinkEl.rel = 'follow';
  }
  moveInstrumentation(secondaryCtaLinkRow.firstElementChild, secondaryCtaLinkEl);

  const secondaryCtaTextSpan = document.createElement('span');
  secondaryCtaTextSpan.classList.add('button-text');
  moveInstrumentation(secondaryCtaTextRow.firstElementChild, secondaryCtaTextSpan);
  secondaryCtaTextSpan.textContent = secondaryCtaTextRow.firstElementChild.textContent.trim();
  secondaryCtaLinkEl.append(secondaryCtaTextSpan);
  secondaryCtaContainer.append(secondaryCtaLinkEl);
  secondaryTitleDiv.append(secondaryCtaContainer);
  contentWrapper.append(secondaryTitleDiv);

  maxWidthContainer.append(contentWrapper);
  contentContainer.append(maxWidthContainer);
  homepageBannerDiv.append(contentContainer);

  section.append(homepageBannerDiv);

  // Greeting Container
  const greetingContainer = document.createElement('div');
  greetingContainer.classList.add('greeting-container', 'bodyLargeRegular');

  const greetingWrapper = document.createElement('div');
  greetingWrapper.classList.add('greeting-wrapper', 'animate');

  const createGreetingSpan = (row, className) => {
    const span = document.createElement('span');
    span.classList.add('greeting', className);
    moveInstrumentation(row.firstElementChild, span);
    span.textContent = row.firstElementChild.textContent.trim();
    return span;
  };

  const greetingMorningSpan = createGreetingSpan(greetingMorningRow, 'greeting--morning');
  greetingMorningSpan.style.display = 'block'; // Default active greeting
  const greetingAfternoonSpan = createGreetingSpan(greetingAfternoonRow, 'greeting--afternoon');
  const greetingEveningSpan = createGreetingSpan(greetingEveningRow, 'greeting--evening');
  const greetingNightSpan = createGreetingSpan(greetingNightRow, 'greeting--night');

  greetingWrapper.append(
    greetingMorningSpan,
    greetingAfternoonSpan,
    greetingEveningSpan,
    greetingNightSpan,
  );
  greetingContainer.append(greetingWrapper);
  section.append(greetingContainer);

  // Replace block content
  block.textContent = '';
  block.append(section);

  // Optimization for posters (if any picture elements were left, though videos handle them)
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Video autoplay and greeting logic
  const updateGreeting = () => {
    const now = new Date();
    const hour = now.getHours();

    [greetingMorningSpan, greetingAfternoonSpan, greetingEveningSpan, greetingNightSpan].forEach(span => {
      span.style.display = 'none';
    });

    if (hour >= 5 && hour < 12) { // 5 AM to 11:59 AM
      greetingMorningSpan.style.display = 'block';
    } else if (hour >= 12 && hour < 17) { // 12 PM to 4:59 PM
      greetingAfternoonSpan.style.display = 'block';
    } else if (hour >= 17 && hour < 21) { // 5 PM to 8:59 PM
      greetingEveningSpan.style.display = 'block';
    } else { // 9 PM to 4:59 AM
      greetingNightSpan.style.display = 'block';
    }
  };

  const playVideos = () => {
    videoLarge.play().catch((e) => console.error('Video large autoplay failed:', e));
    videoSmall.play().catch((e) => console.error('Video small autoplay failed:', e));
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        playVideos();
        observer.disconnect(); // Stop observing once played
      }
    });
  }, { threshold: 0.5 }); // Trigger when 50% of the banner is visible

  observer.observe(homepageBannerDiv);

  // Initial greeting update
  updateGreeting();
  // Update greeting every minute (or more frequently if needed)
  setInterval(updateGreeting, 60 * 1000);
}
