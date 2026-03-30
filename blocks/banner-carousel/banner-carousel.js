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

  const indicatorsOl = document.createElement('ol');
  indicatorsOl.classList.add('banner-carousel-indicators');

  const carouselInnerDiv = document.createElement('div');
  carouselInnerDiv.classList.add('banner-carousel-inner');

  const items = block.querySelectorAll('[data-aue-model="bannerCarouselItem"]');
  items.forEach((itemNode, index) => {
    const indicatorLi = document.createElement('li');
    indicatorLi.setAttribute('data-target', `#${carouselId}`);
    indicatorLi.setAttribute('data-slide-to', index.toString());
    if (index === 0) {
      indicatorLi.classList.add('banner-active');
    }
    indicatorsOl.append(indicatorLi);
    moveInstrumentation(itemNode, indicatorLi);

    const carouselItemDiv = document.createElement('div');
    carouselItemDiv.classList.add('banner-carousel-item');
    if (index === 0) {
      carouselItemDiv.classList.add('banner-active');
    }

    const desktopImage = itemNode.querySelector('[data-aue-prop="desktopImage"]');
    if (desktopImage) {
      const picture = createOptimizedPicture(desktopImage.src, desktopImage.alt, index === 0, [{ media: '(min-width: 600px)', width: '2000' }, { width: '750' }]);
      picture.querySelector('img').classList.add('banner-d-none', 'banner-d-sm-block', 'banner-w-100', 'banner-desktop-image');
      carouselItemDiv.append(picture);
      moveInstrumentation(desktopImage, picture);
    }

    const mobileImage = itemNode.querySelector('[data-aue-prop="mobileImage"]');
    if (mobileImage) {
      const picture = createOptimizedPicture(mobileImage.src, mobileImage.alt, index === 0, [{ width: '750' }]);
      picture.querySelector('img').classList.add('banner-d-block', 'banner-d-sm-none', 'banner-w-100', 'banner-mobile-image');
      carouselItemDiv.append(picture);
      moveInstrumentation(mobileImage, picture);
    }

    const contentWrapperDiv = document.createElement('div');
    contentWrapperDiv.classList.add('banner-content-wrapper', 'banner-position-absolute');

    const heading = itemNode.querySelector('[data-aue-prop="heading"]');
    if (heading) {
      const h1 = document.createElement('h1');
      h1.classList.add('banner-koi-carousel-heading', 'banner-text-sm-left');
      h1.style.color = heading.dataset.color || '';
      h1.innerHTML = heading.innerHTML;
      contentWrapperDiv.append(h1);
      moveInstrumentation(heading, h1);
    }

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('banner-koi-carousel-description');

    const subheading = itemNode.querySelector('[data-aue-prop="subheading"]');
    if (subheading) {
      const h3 = document.createElement('h3');
      h3.style.color = subheading.dataset.descColor || '';
      h3.innerHTML = subheading.innerHTML;
      descriptionDiv.append(h3);
      moveInstrumentation(subheading, h3);
    }

    const description = itemNode.querySelector('[data-aue-prop="description"]');
    if (description) {
      const p = document.createElement('p');
      p.style.color = description.dataset.descColor || '';
      p.innerHTML = description.innerHTML;
      descriptionDiv.append(p);
      moveInstrumentation(description, p);
    }
    if (subheading || description) {
      contentWrapperDiv.append(descriptionDiv);
    }

    const ctaLink = itemNode.querySelector('[data-aue-prop="ctaLink"]');
    if (ctaLink) {
      const link = document.createElement('a');
      link.href = ctaLink.href;
      link.classList.add('banner-koi-carousel-cta', 'banner-btn', 'banner-btn-primary', 'banner-btn-start-now');
      link.style.backgroundColor = ctaLink.dataset.bgColor || '';
      link.textContent = ctaLink.textContent.replace(/\s*opens in a new tab\s*$/, ''); // Remove screen reader text
      if (ctaLink.target) {
        link.target = ctaLink.target;
      }
      if (ctaLink.alt) {
        link.alt = ctaLink.alt;
      }
      const screenReaderSpan = document.createElement('span');
      screenReaderSpan.classList.add('banner-cmp-link__screen-reader-only');
      screenReaderSpan.textContent = 'opens in a new tab';
      link.append(screenReaderSpan);

      contentWrapperDiv.append(link);
      moveInstrumentation(ctaLink, link);
    }

    carouselItemDiv.append(contentWrapperDiv);
    carouselInnerDiv.append(carouselItemDiv);
    moveInstrumentation(itemNode, carouselItemDiv);
  });

  const nextCarouselBtnDiv = document.createElement('div');
  nextCarouselBtnDiv.classList.add('banner-next-carousel-btn');

  const prevLink = document.createElement('a');
  prevLink.classList.add('banner-carousel-control-prev');
  prevLink.href = `#${carouselId}`;
  prevLink.setAttribute('role', 'button');
  prevLink.setAttribute('data-slide', 'prev');
  prevLink.innerHTML = '<span class="banner-carousel-control-prev-icon" aria-hidden="true"></span><span class="banner-sr-only">Previous</span>';

  const nextLink = document.createElement('a');
  nextLink.classList.add('banner-carousel-control-next');
  nextLink.href = `#${carouselId}`;
  nextLink.setAttribute('role', 'button');
  nextLink.setAttribute('data-slide', 'next');
  nextLink.innerHTML = '<span class="banner-carousel-control-next-icon" aria-hidden="true"></span><span class="banner-sr-only">Next</span>';

  nextCarouselBtnDiv.append(prevLink, nextLink);

  carouselDiv.append(indicatorsOl, carouselInnerDiv, nextCarouselBtnDiv);
  section.append(carouselDiv);

  block.textContent = '';
  block.append(section);
  block.classList.add('banner-banner', 'banner-aem-GridColumn', 'banner-aem-GridColumn--default--12');
  block.dataset.blockStatus = 'loaded';
}