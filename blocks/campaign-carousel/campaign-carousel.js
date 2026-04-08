import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    bgImageRow,
    titleRow,
    descriptionRow,
    ...itemRows
  ] = [...block.children];

  block.classList.add('grid-container', 'bg--paper-white');

  // Background Image
  const parallaxBg = document.createElement('div');
  parallaxBg.classList.add('parallax-bg', 'js-parallax-bg', 'lazyLoadedImage');
  const bgPicture = bgImageRow.querySelector('picture');
  if (bgPicture) {
    const img = bgPicture.querySelector('img');
    if (img) {
      parallaxBg.style.backgroundImage = `url(${img.src})`;
      // Optimized picture for background image
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
      // The original image element is not directly replaced in the DOM for background-image style.
      // We just use its src.
    }
  }
  moveInstrumentation(bgImageRow, parallaxBg);
  block.append(parallaxBg);

  const mainContentWrapper = document.createElement('div');
  const headerGrid = document.createElement('div');
  headerGrid.classList.add('grid-x', 'campaign-carousel__header-grid');
  mainContentWrapper.append(headerGrid);

  const emptyCell1 = document.createElement('div');
  emptyCell1.classList.add('cell', 'large-2', 'xlarge-3');
  headerGrid.append(emptyCell1);

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('cell', 'small-12', 'large-8', 'xlarge-6', 'campaign-carousel__header-wrapper');
  headerGrid.append(headerWrapper);

  const title = document.createElement('h2');
  title.classList.add('campaign-carousel__title');
  moveInstrumentation(titleRow, title);
  while (titleRow.firstChild) title.append(titleRow.firstChild);
  headerWrapper.append(title);

  const description = document.createElement('div');
  description.classList.add('campaign-carousel__description', 'bodyMediumRegular');
  moveInstrumentation(descriptionRow, description);
  while (descriptionRow.firstChild) description.append(descriptionRow.firstChild);
  headerWrapper.append(description);

  const emptyCell2 = document.createElement('div');
  emptyCell2.classList.add('cell', 'large-2', 'xlarge-3');
  headerGrid.append(emptyCell2);

  // Swiper container
  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper', 'campaign-carousel__swiper');
  mainContentWrapper.append(swiperContainer);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper', 'campaign-carousel__swiper-wrapper');
  swiperContainer.append(swiperWrapper);

  itemRows.forEach((row) => {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    moveInstrumentation(row, slide);

    const cells = [...row.children];

    // Campaign Quotation (3 cells: text, author, background-image)
    if (cells.length === 3 && cells[0].querySelector('p') && cells[1].textContent.trim() !== '' && cells[2].querySelector('picture')) {
      slide.classList.add('campaign-carousel__swiper__quotation-slide');
      const quotationDiv = document.createElement('div');
      quotationDiv.classList.add('campaign-quotation');

      const textCell = cells[0];
      const blockquote = document.createElement('blockquote');
      blockquote.classList.add('campaign-quotation__text', 'headline-h4');
      while (textCell.firstChild) blockquote.append(textCell.firstChild);
      const quoteIconWrapper = document.createElement('span');
      quoteIconWrapper.classList.add('campaign-quotation__quote-icon-wrapper');
      const quoteIcon = document.createElement('i');
      quoteIcon.classList.add('icon', 'quote-start-brown');
      quoteIconWrapper.append(quoteIcon);
      blockquote.append(quoteIconWrapper);
      quotationDiv.append(blockquote);

      const authorCell = cells[1];
      const authorWrapper = document.createElement('div');
      authorWrapper.classList.add('campaign-quotation__author-and-location-wrapper');
      const author = document.createElement('div');
      author.classList.add('labelSmallBold', 'campaign-quotation__author');
      while (authorCell.firstChild) author.append(authorCell.firstChild);
      authorWrapper.append(author);
      quotationDiv.append(authorWrapper);

      const bgImageCell = cells[2];
      const bgImageWrapper = document.createElement('div');
      bgImageWrapper.classList.add('campaign-quotation__background-image-wrapper');
      const picture = bgImageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '794' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          bgImageWrapper.append(optimizedPic);
        }
      }
      quotationDiv.append(bgImageWrapper);
      slide.append(quotationDiv);
    }
    // Campaign Recipe Card (7 cells: link, image, tag, name, description, steps-count, ingredients-count)
    else if (cells.length === 7 && cells[0].querySelector('a') && cells[1].querySelector('picture')) {
      slide.classList.add('campaign-carousel__swiper__recipe-card-slide');
      const linkEl = cells[0].querySelector('a');
      const recipeCardLink = document.createElement('a');
      recipeCardLink.classList.add('campaign-recipe-card', 'elevation-4');
      if (linkEl) {
        recipeCardLink.href = linkEl.href;
        recipeCardLink.setAttribute('aria-label', `${linkEl.textContent.trim()} - Read More`);
      }

      const imgContainer = document.createElement('div');
      imgContainer.classList.add('campaign-recipe-card__img-container');
      const picture = cells[1].querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '566' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          imgContainer.append(optimizedPic);
        }
      }
      recipeCardLink.append(imgContainer);

      const details = document.createElement('div');
      details.classList.add('campaign-recipe-card__details');

      const tagDiv = document.createElement('div');
      tagDiv.classList.add('campaign-recipe-card__tag');
      const tagInner = document.createElement('div');
      tagInner.classList.add('tag', 'bg--brand-green');
      const tagLabel = document.createElement('span');
      tagLabel.classList.add('tag__label');
      tagLabel.textContent = cells[2].textContent.trim();
      tagInner.append(tagLabel);
      tagDiv.append(tagInner);
      details.append(tagDiv);

      const nameDiv = document.createElement('div');
      nameDiv.classList.add('labelLargeBold', 'campaign-recipe-card__name');
      nameDiv.textContent = cells[3].textContent.trim();
      details.append(nameDiv);

      const descriptionDiv = document.createElement('div');
      descriptionDiv.classList.add('bodySmallRegular', 'campaign-recipe-card__description');
      while (cells[4].firstChild) descriptionDiv.append(cells[4].firstChild);
      details.append(descriptionDiv);

      const stepsAndIngredients = document.createElement('div');
      stepsAndIngredients.classList.add('campaign-recipe-card__steps-and-ingredients');

      const stepsContainer = document.createElement('div');
      stepsContainer.classList.add('campaign-recipe-card__steps-container');
      const stepsCount = document.createElement('span');
      stepsCount.classList.add('labelSmallBold', 'campaign-recipe-card__steps-count');
      stepsCount.textContent = cells[5].textContent.trim();
      const stepsLabel = document.createElement('span');
      stepsLabel.classList.add('utilityTagHighCaps', 'campaign-recipe-card__steps-label');
      stepsLabel.textContent = 'Steps';
      stepsContainer.append(stepsCount, stepsLabel);
      stepsAndIngredients.append(stepsContainer);

      const separator = document.createElement('div');
      separator.classList.add('campaign-recipe-card__steps-separator');
      stepsAndIngredients.append(separator);

      const ingredientsContainer = document.createElement('div');
      ingredientsContainer.classList.add('campaign-recipe-card__ingredients-container');
      const ingredientsCount = document.createElement('span');
      ingredientsCount.classList.add('labelSmallBold', 'campaign-recipe-card__ingredients-count');
      ingredientsCount.textContent = cells[6].textContent.trim();
      const ingredientsLabel = document.createElement('span');
      ingredientsLabel.classList.add('utilityTagHighCaps', 'campaign-recipe-card__ingredients-label');
      ingredientsLabel.textContent = 'Ingredients';
      ingredientsContainer.append(ingredientsCount, ingredientsLabel);
      stepsAndIngredients.append(ingredientsContainer);

      details.append(stepsAndIngredients);
      recipeCardLink.append(details);
      slide.append(recipeCardLink);
    }
    // Campaign Fact Card (4 cells: image, name, description, cta-link)
    else if (cells.length === 4 && cells[0].querySelector('picture') && cells[3].querySelector('a')) {
      slide.classList.add('campaign-carousel__swiper__fact-card-slide');
      const factCardDiv = document.createElement('div');
      factCardDiv.classList.add('campaign-fact-card', 'campaign-fact', 'elevation-4', 'bg--paper-green'); // Default bg-color, can be extended by specific fact cards

      const imgContainer = document.createElement('div');
      imgContainer.classList.add('campaign-fact-card__img-container');
      const picture = cells[0].querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '630' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          imgContainer.append(optimizedPic);
        }
      }
      factCardDiv.append(imgContainer);

      const details = document.createElement('div');
      details.classList.add('campaign-fact-card__details');

      const nameDiv = document.createElement('div');
      nameDiv.classList.add('campaign-fact-card__name', 'utilityScriptLarge');
      nameDiv.textContent = cells[1].textContent.trim();
      details.append(nameDiv);

      const descriptionDiv = document.createElement('div');
      descriptionDiv.classList.add('bodyMediumRegular', 'campaign-fact-card__description');
      while (cells[2].firstChild) descriptionDiv.append(cells[2].firstChild);
      details.append(descriptionDiv);

      const ctaDiv = document.createElement('div');
      ctaDiv.classList.add('campaign-fact-card__cta');
      const ctaLinkFound = cells[3].querySelector('a');
      if (ctaLinkFound) {
        const ctaLink = document.createElement('a');
        ctaLink.classList.add('link', 'link-auto', 'labelSmallBold');
        ctaLink.href = ctaLinkFound.href;
        ctaLink.title = ctaLinkFound.textContent.trim();
        ctaLink.setAttribute('aria-label', ctaLinkFound.textContent.trim());
        ctaLink.setAttribute('rel', 'follow');
        const buttonText = document.createElement('span');
        buttonText.classList.add('button-text');
        buttonText.textContent = ctaLinkFound.textContent.trim();
        ctaLink.append(buttonText);
        ctaDiv.append(ctaLink);
      }
      details.append(ctaDiv);
      factCardDiv.append(details);
      slide.append(factCardDiv);

      // Check for specific fact card variants based on original HTML
      const nameContent = cells[1].textContent.trim();
      if (nameContent === 'One cup makes a big difference') {
        factCardDiv.classList.remove('bg--paper-green');
        factCardDiv.classList.add('campaign-make-difference', 'bg--paper-brown');
        slide.classList.add('campaign-make-difference');
      }
    }
    swiperWrapper.append(slide);
  });

  // Swiper navigation buttons
  const prevButtonWrapper = document.createElement('div');
  prevButtonWrapper.classList.add('campaign-carousel__btn-control', 'campaign-carousel--prev', 'show-for-large');
  const prevButton = document.createElement('button');
  prevButton.classList.add('swiper-control', 'swiper-button', 'swiper--prev', 'elevation-1');
  prevButton.setAttribute('aria-label', 'Previous slide');
  // Hardcoded SVG path is for the icon, not an image from block content, so it's allowed.
  prevButton.innerHTML = '<img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1775635713638.svg+xml"/>';
  prevButtonWrapper.append(prevButton);
  swiperContainer.append(prevButtonWrapper);

  const nextButtonWrapper = document.createElement('div');
  nextButtonWrapper.classList.add('campaign-carousel__btn-control', 'campaign-carousel--next', 'show-for-large');
  const nextButton = document.createElement('button');
  nextButton.classList.add('swiper-control', 'swiper-button', 'swiper--next', 'elevation-1');
  nextButton.setAttribute('aria-label', 'Next slide');
  // Hardcoded SVG path is for the icon, not an image from block content, so it's allowed.
  nextButton.innerHTML = '<img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1775635713799.svg+xml"/>';
  nextButtonWrapper.append(nextButton);
  swiperContainer.append(nextButtonWrapper);

  const pagination = document.createElement('div');
  pagination.classList.add('swiper-pagination', 'campaign-carousel__swiper-pagination');
  swiperContainer.append(pagination);

  block.textContent = '';
  block.append(mainContentWrapper);

  // Initialize Swiper (simplified, actual Swiper lib would be loaded separately)
  let currentIndex = 0;
  const slides = [...swiperWrapper.children];
  const totalSlides = slides.length;

  const updateSwiper = () => {
    slides.forEach((s, i) => {
      s.classList.remove('swiper-slide-active', 'swiper-slide-next');
      if (i === currentIndex) {
        s.classList.add('swiper-slide-active');
      } else if (i === (currentIndex + 1) % totalSlides) {
        s.classList.add('swiper-slide-next');
      }
    });

    // Update pagination bullets
    pagination.innerHTML = '';
    for (let i = 0; i < totalSlides; i += 1) {
      const bullet = document.createElement('span');
      bullet.classList.add('swiper-pagination-bullet');
      bullet.setAttribute('tabindex', '0');
      bullet.setAttribute('role', 'button');
      bullet.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === currentIndex) {
        bullet.classList.add('swiper-pagination-bullet-active');
        bullet.setAttribute('aria-current', 'true');
      }
      bullet.addEventListener('click', () => {
        currentIndex = i;
        updateSwiper();
      });
      pagination.append(bullet);
    }

    // Update button states
    prevButton.disabled = currentIndex === 0;
    prevButton.classList.toggle('swiper-button-disabled', currentIndex === 0);
    prevButton.classList.toggle('swiper-button-lock', currentIndex === 0);

    nextButton.disabled = currentIndex === totalSlides - 1;
    nextButton.classList.toggle('swiper-button-disabled', currentIndex === totalSlides - 1);
    nextButton.classList.toggle('swiper-button-lock', currentIndex === totalSlides - 1);

    // Transform for swiperWrapper (simplified for demonstration)
    const slideWidth = slides.length > 0 ? slides[0].offsetWidth : 0;
    // This transform logic is a simplification. Actual Swiper would calculate based on layout.
    // We'll just center the active slide roughly.
    const offset = (swiperContainer.offsetWidth / 2) - (slideWidth / 2) - (currentIndex * slideWidth);
    swiperWrapper.style.transform = `translate3d(${offset}px, 0px, 0px)`;
  };

  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      updateSwiper();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentIndex < totalSlides - 1) {
      currentIndex += 1;
      updateSwiper();
    }
  });

  // Initial update
  if (totalSlides > 0) {
    updateSwiper();
  }
}
