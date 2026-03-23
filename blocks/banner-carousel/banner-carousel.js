import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carouselId = 'carouselExampleSlidesOnly';

  const section = document.createElement('section');
  section.classList.add('banner-itc-carousel-section');

  const carouselDiv = document.createElement('div');
  carouselDiv.id = carouselId;
  carouselDiv.classList.add('banner-bannerCarousel', 'banner-carousel', 'banner-slide');
  carouselDiv.setAttribute('data-ride', 'carousel');

  const olIndicators = document.createElement('ol');
  olIndicators.classList.add('banner-carousel-indicators');
  carouselDiv.append(olIndicators);

  const carouselInner = document.createElement('div');
  carouselInner.classList.add('banner-carousel-inner');
  carouselDiv.append(carouselInner);

  const slides = block.querySelectorAll('[data-aue-model="bannerSlide"]');

  slides.forEach((slide, index) => {
    const li = document.createElement('li');
    li.setAttribute('data-target', `#${carouselId}`);
    li.setAttribute('data-slide-to', index.toString());
    if (index === 0) {
      li.classList.add('banner-active');
    }
    olIndicators.append(li);
    moveInstrumentation(slide, li);

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('banner-carousel-item');
    if (index === 0) {
      carouselItem.classList.add('banner-active');
    }

    const desktopImageEl = slide.querySelector('[data-aue-prop="desktopImage"]');
    if (desktopImageEl) {
      const desktopPicture = createOptimizedPicture(desktopImageEl.src, desktopImageEl.alt);
      desktopPicture.querySelector('img').classList.add('banner-d-none', 'banner-d-sm-block', 'banner-w-100', 'banner-desktop-image');
      desktopPicture.querySelector('img').setAttribute('loading', index === 0 ? 'eager' : 'lazy');
      desktopPicture.querySelector('img').setAttribute('fetchpriority', index === 0 ? 'high' : 'low');
      carouselItem.append(desktopPicture);
      moveInstrumentation(desktopImageEl, desktopPicture);
    }

    const mobileImageEl = slide.querySelector('[data-aue-prop="mobileImage"]');
    if (mobileImageEl) {
      const mobilePicture = createOptimizedPicture(mobileImageEl.src, mobileImageEl.alt);
      mobilePicture.querySelector('img').classList.add('banner-d-block', 'banner-d-sm-none', 'banner-w-100', 'banner-mobile-image');
      mobilePicture.querySelector('img').setAttribute('loading', index === 0 ? 'eager' : 'lazy');
      mobilePicture.querySelector('img').setAttribute('fetchpriority', index === 0 ? 'high' : 'low');
      carouselItem.append(mobilePicture);
      moveInstrumentation(mobileImageEl, mobilePicture);
    }

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('banner-banner-content-wrapper', 'banner-position-absolute');

    const headingEl = slide.querySelector('[data-aue-prop="heading"]');
    if (headingEl) {
      const h1 = document.createElement('h1');
      h1.classList.add('banner-koi-carousel-heading', 'banner-text-sm-left');
      const color = headingEl.getAttribute('data-color') || '#3c2904';
      h1.style.color = color;
      h1.textContent = headingEl.textContent;
      contentWrapper.append(h1);
      moveInstrumentation(headingEl, h1);
    }

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('banner-koi-carousel-description');
    const descColor = slide.querySelector('[data-aue-prop="subHeading"]') ? slide.querySelector('[data-aue-prop="subHeading"]').getAttribute('data-desc-color') || '#3c2904' : '#3c2904';
    descriptionDiv.setAttribute('data-desc-color', descColor);

    const subHeadingEl = slide.querySelector('[data-aue-prop="subHeading"]');
    if (subHeadingEl) {
      const h3 = document.createElement('h3');
      h3.style.color = descColor;
      const i = document.createElement('i');
      i.style.color = descColor;
      i.innerHTML = subHeadingEl.innerHTML;
      h3.append(i);
      descriptionDiv.append(h3);
      moveInstrumentation(subHeadingEl, h3);
    }

    const descriptionContentEl = slide.querySelector('[data-aue-prop="description"]');
    if (descriptionContentEl) {
      const p = document.createElement('p');
      p.style.color = descColor;
      p.innerHTML = descriptionContentEl.innerHTML;
      descriptionDiv.append(p);
      moveInstrumentation(descriptionContentEl, p);
    }
    contentWrapper.append(descriptionDiv);

    const ctaLinkEl = slide.querySelector('[data-aue-prop="ctaLink"]');
    if (ctaLinkEl) {
      const a = document.createElement('a');
      a.href = ctaLinkEl.href;
      a.classList.add('banner-koi-carousel-cta', 'banner-btn', 'banner-btn-primary', 'banner-btn-start-now');
      a.setAttribute('target', '_blank');
      const bgColor = ctaLinkEl.getAttribute('data-bg-color') || '#6c3003';
      a.style.backgroundColor = bgColor;
      a.textContent = ctaLinkEl.textContent;
      const span = document.createElement('span');
      span.classList.add('banner-cmp-link__screen-reader-only');
      span.textContent = 'opens in a new tab';
      a.append(span);
      contentWrapper.append(a);
      moveInstrumentation(ctaLinkEl, a);
    }

    carouselItem.append(contentWrapper);
    carouselInner.append(carouselItem);
    moveInstrumentation(slide, carouselItem);
  });

  const nextPrevBtnDiv = document.createElement('div');
  nextPrevBtnDiv.classList.add('banner-next-carousel-btn');

  const prevLink = document.createElement('a');
  prevLink.classList.add('banner-carousel-control-prev');
  prevLink.href = `#${carouselId}`;
  prevLink.setAttribute('role', 'button');
  prevLink.setAttribute('data-slide', 'prev');
  const prevSpanIcon = document.createElement('span');
  prevSpanIcon.classList.add('banner-carousel-control-prev-icon');
  prevSpanIcon.setAttribute('aria-hidden', 'true');
  const prevSpanSr = document.createElement('span');
  prevSpanSr.classList.add('banner-sr-only');
  prevSpanSr.textContent = 'Previous';
  prevLink.append(prevSpanIcon, prevSpanSr);
  nextPrevBtnDiv.append(prevLink);

  const nextLink = document.createElement('a');
  nextLink.classList.add('banner-carousel-control-next');
  nextLink.href = `#${carouselId}`;
  nextLink.setAttribute('role', 'button');
  nextLink.setAttribute('data-slide', 'next');
  const nextSpanIcon = document.createElement('span');
  nextSpanIcon.classList.add('banner-carousel-control-next-icon');
  nextSpanIcon.setAttribute('aria-hidden', 'true');
  const nextSpanSr = document.createElement('span');
  nextSpanSr.classList.add('banner-sr-only');
  nextSpanSr.textContent = 'Next';
  nextLink.append(nextSpanIcon, nextSpanSr);
  nextPrevBtnDiv.append(nextLink);

  carouselDiv.append(nextPrevBtnDiv);
  section.append(carouselDiv);

  block.textContent = '';
  block.append(section);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
