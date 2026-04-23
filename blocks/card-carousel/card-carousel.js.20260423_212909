import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
      }
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-sub-child');
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
      transformNestedLists(nested); // Recursively transform nested lists
    }
  });
}

export default function decorate(block) {
  const [
    titleRow,
    subtitleRow,
    viewAllLinkRow,
    ...itemRows
  ] = [...block.children];

  block.innerHTML = ''; // Clear block content

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');

  // Title
  const title = document.createElement('h2');
  title.classList.add(
    'card-carousel__title',
    'font-24',
    'leading-28',
    'font-sm-40',
    'leading-sm-50',
    'text-dark-gray-100',
    'text-center',
    'font-baskerville',
  );
  moveInstrumentation(titleRow.firstElementChild, title);
  title.textContent = titleRow.firstElementChild?.textContent.trim() || '';
  container.appendChild(title);

  // Subtitle
  const subtitle = document.createElement('p');
  subtitle.classList.add(
    'card-carousel__subtitle',
    'font-default',
    'leading-24',
    'font-sm-18',
    'leading-sm-32',
    'text-dark-gray-100',
    'text-center',
    'mt-4',
    'fw-medium',
  );
  moveInstrumentation(subtitleRow.firstElementChild, subtitle);
  subtitle.textContent = subtitleRow.firstElementChild?.textContent.trim() || '';
  container.appendChild(subtitle);

  block.appendChild(container);

  // Swiper container
  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('card-carousel__swiper', 'swiper', 'container', 'gx-0');
  swiperContainer.setAttribute('data-loop', 'true');

  const swiperWrapperContainer = document.createElement('div');
  swiperWrapperContainer.classList.add('card-carousel__swiper--container', 'mt-8', 'mt-sm-10');
  swiperContainer.appendChild(swiperWrapperContainer);

  const popularRecipeSection = document.createElement('section');
  popularRecipeSection.classList.add('popular-recipe', 'slide-in-anim');
  swiperWrapperContainer.appendChild(popularRecipeSection);

  const popularRecipeData = document.createElement('div');
  popularRecipeData.classList.add('popular-recipe__data', 'd-none');
  popularRecipeSection.appendChild(popularRecipeData);

  const popularRecipeInnerContainer = document.createElement('div');
  popularRecipeInnerContainer.classList.add(
    'popular-recipe__container',
    'overflow-hidden',
    'swiper-initialized',
    'swiper-horizontal',
    'swiper-backface-hidden',
  );
  popularRecipeInnerContainer.setAttribute('data-swiper-init-async', 'true');
  popularRecipeSection.appendChild(popularRecipeInnerContainer);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper', 'popular-recipe__recipe-wrapper');
  popularRecipeInnerContainer.appendChild(swiperWrapper);

  const socialMediaShareItems = [];
  const recipeCards = [];

  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 9) {
      // Recipe Card
      recipeCards.push(row);
    } else if (cells.length === 3) {
      // Social Media Share Item
      socialMediaShareItems.push(row);
    }
  });

  recipeCards.forEach((row) => {
    const [
      linkCell,
      imageCell,
      imageAltCell,
      tagCell,
      recipeTitleCell,
      descriptionCell,
      timeCell,
      servesCell,
      hierarchyCell,
    ] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');
    moveInstrumentation(row, swiperSlide);

    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card', 'bg-cream-100', 'h-100');
    swiperSlide.appendChild(recipeCard);

    const link = document.createElement('a');
    link.classList.add('recipe-card__link', 'd-block', 'position-relative');
    link.href = linkCell?.querySelector('a')?.href || '#';
    recipeCard.appendChild(link);

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      optimizedPic.classList.add('recipe-card__image', 'object-fit-cover', 'w-100');
      link.appendChild(optimizedPic);
    }

    const content = document.createElement('div');
    content.classList.add('recipe-card__content', 'py-6');
    link.appendChild(content);

    const info = document.createElement('div');
    info.classList.add('recipe-card__info', 'd-flex', 'align-items-center', 'justify-content-between');
    content.appendChild(info);

    const tag = document.createElement('span');
    tag.classList.add(
      'recipe-card__tag',
      'text-uppercase',
      'text-red-100',
      'font-14',
      'font-xl-default',
      'leading-24',
      'fw-semibold',
    );
    tag.textContent = tagCell?.textContent.trim() || '';
    info.appendChild(tag);

    const shareIcon = document.createElement('svg');
    shareIcon.classList.add('icon', 'share', 'text-dark-gray-100');
    shareIcon.innerHTML = `<use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#share"></use>`;
    info.appendChild(shareIcon);

    const textDiv = document.createElement('div');
    textDiv.classList.add('recipe-card__text');
    content.appendChild(textDiv);

    const recipeTitle = document.createElement('h3');
    recipeTitle.classList.add(
      'recipe-card__title',
      'font-20',
      'font-xl-24',
      'leading-24',
      'leading-xl-30',
      'font-baskerville',
      'fw-bold',
      'text-dark-gray-100',
      'mt-4',
    );
    recipeTitle.textContent = recipeTitleCell?.textContent.trim() || '';
    textDiv.appendChild(recipeTitle);

    const description = document.createElement('p');
    description.classList.add(
      'recipe-card__desc',
      'font-default',
      'font-xl-18',
      'leading-24',
      'fw-medium',
      'text-dark-gray-100',
      'mt-4',
    );
    description.textContent = descriptionCell?.textContent.trim() || '';
    textDiv.appendChild(description);

    const wave = document.createElement('div');
    wave.classList.add('recipe-card__wave', 'mt-11', 'mt-xl-7', 'w-100');
    content.appendChild(wave);

    const properties = document.createElement('ul');
    properties.classList.add(
      'recipe-card__properties',
      'mt-4',
      'd-flex',
      'align-items-center',
    );
    content.appendChild(properties);

    const timeProperty = document.createElement('li');
    timeProperty.classList.add(
      'recipe-card__property',
      'recipe-card__property--left',
      'd-flex',
      'align-items-center',
    );
    properties.appendChild(timeProperty);

    const clockIcon = document.createElement('svg');
    clockIcon.classList.add('icon', 'clock', 'text-dark-gray-100');
    clockIcon.innerHTML = `<use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#clock"></use>`;
    timeProperty.appendChild(clockIcon);

    const timeSpan = document.createElement('span');
    timeSpan.classList.add(
      'recipe-card__time',
      'text-dark-gray-100',
      'font-14',
      'font-xl-default',
      'leading-20',
      'fw-medium',
      'ms-2',
      'd-inline-block',
      'text-nowrap',
    );
    timeSpan.textContent = timeCell?.textContent.trim() || '';
    timeProperty.appendChild(timeSpan);

    const servesProperty = document.createElement('li');
    servesProperty.classList.add(
      'recipe-card__property',
      'recipe-card__property--right',
      'flex-fill',
      'd-flex',
      'align-items-center',
      'justify-content-end',
    );
    properties.appendChild(servesProperty);

    const peopleIcon = document.createElement('svg');
    peopleIcon.classList.add('icon', 'people', 'text-dark-gray-100');
    peopleIcon.innerHTML = `<use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#people"></use>`;
    servesProperty.appendChild(peopleIcon);

    const servesSpan = document.createElement('span');
    servesSpan.classList.add(
      'serve-content',
      'recipe-card__serves',
      'text-dark-gray-100',
      'font-14',
      'font-xl-default',
      'leading-20',
      'fw-medium',
      'ms-2',
      'd-inline-block',
    );
    servesSpan.textContent = servesCell?.textContent.trim() || '';
    servesProperty.appendChild(servesSpan);

    // Hierarchy-tree richtext field
    if (hierarchyCell) {
      const hierarchyDiv = document.createElement('div');
      hierarchyDiv.classList.add('recipe-card__hierarchy'); // Add a class for styling if needed
      moveInstrumentation(hierarchyCell, hierarchyDiv);
      hierarchyDiv.innerHTML = hierarchyCell.innerHTML;

      // Apply classes to nested elements from ORIGINAL HTML if they exist
      hierarchyDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('hierarchy-list'));
      hierarchyDiv.querySelectorAll('li').forEach(li => li.classList.add('hierarchy-list-item'));
      hierarchyDiv.querySelectorAll('a').forEach(a => a.classList.add('hierarchy-link'));

      content.appendChild(hierarchyDiv); // Append to content or another appropriate parent
    }

    swiperWrapper.appendChild(swiperSlide);
  });

  const popularRecipeShare = document.createElement('div');
  popularRecipeShare.classList.add('popular-recipe__share');
  popularRecipeSection.appendChild(popularRecipeShare);

  const socialMediaShare = document.createElement('section');
  socialMediaShare.classList.add(
    'social-media-share',
    'd-none',
    'w-100',
    'justify-content-center',
    'align-items-center',
    'position-fixed',
    'top-0',
    'start-0',
    'end-0',
    'bottom-0',
    'z-2',
  );
  popularRecipeShare.appendChild(socialMediaShare);

  // Add event listener to all share icons to open the social media share modal
  block.querySelectorAll('.icon.share').forEach((icon) => {
    icon.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent the link click from firing
      socialMediaShare.classList.remove('d-none');
    });
  });

  const shareWrapper = document.createElement('div');
  shareWrapper.classList.add(
    'social-media-share__wrapper',
    'bg-cream-100',
    'py-8',
    'px-3',
    'px-md-8',
  );
  socialMediaShare.appendChild(shareWrapper);

  const titleCloseDiv = document.createElement('div');
  titleCloseDiv.classList.add(
    'social-media-share__wrapper--title-close',
    'pb-8',
    'd-flex',
    'mx-3',
    'mx-md-0',
    'border-bottom',
    'border-dark-gray-100',
    'align-items-center',
    'justify-content-between',
  );
  shareWrapper.appendChild(titleCloseDiv);

  const closeBtn = document.createElement('div');
  closeBtn.classList.add('social-media-share__wrapper--close');
  closeBtn.innerHTML = `
    <svg class="icon cross text-black h-100 w-100">
      <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#cross"></use>
    </svg>
  `;
  closeBtn.addEventListener('click', () => {
    socialMediaShare.classList.add('d-none');
  });
  titleCloseDiv.appendChild(closeBtn);

  const socialIconsDiv = document.createElement('div');
  socialIconsDiv.classList.add(
    'social-media-share__wrapper--social-icons',
    'pt-8',
    'd-flex',
    'overflow-hidden',
    'swiper-initialized',
    'swiper-horizontal',
  );
  shareWrapper.appendChild(socialIconsDiv);

  socialMediaShareItems.forEach((row) => {
    const [linkCell, platformCell, labelCell] = [...row.children];

    const iconLabelDiv = document.createElement('div');
    iconLabelDiv.classList.add(
      'social-media-share__wrapper--icon-label',
      'swiper-slide',
      'd-flex',
      'align-items-center',
    );
    moveInstrumentation(row, iconLabelDiv);

    const shareLink = document.createElement('a');
    shareLink.classList.add(
      'social-media-share__link',
      'd-flex',
      'align-items-center',
      'text-decoration-none',
      'gap-4',
      'w-fit',
      'flex-md-column',
      'justify-content-center',
    );
    shareLink.href = linkCell?.querySelector('a')?.href || '#';
    shareLink.target = '_blank';
    iconLabelDiv.appendChild(shareLink);

    const iconWrapper = document.createElement('div');
    iconWrapper.classList.add(
      'social-media-share__wrapper--icons',
      'rounded-circle',
      'bg-white',
      'd-flex',
      'justify-content-center',
      'align-items-center',
    );
    shareLink.appendChild(iconWrapper);

    const iconLink = document.createElement('div');
    iconLink.classList.add('social-media-share__wrapper--link', 'text-decoration-none');
    // iconLink.target = '_blank'; // target attribute is not valid for a div
    iconWrapper.appendChild(iconLink);

    const platform = platformCell?.textContent.trim() || '';
    const platformIcon = document.createElement('svg');
    platformIcon.classList.add('icon', 'text-black', platform, 'social-media-share__wrapper--images');
    platformIcon.innerHTML = `<use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#${platform}"></use>`;
    iconLink.appendChild(platformIcon);

    const label = document.createElement('div');
    label.classList.add(
      'social-media-share__wrapper--label',
      'text-center',
      'font-16',
      'leading-22',
      'text-black',
    );
    label.setAttribute('data-socialmedia-name', platform);
    label.textContent = labelCell?.textContent.trim() || '';
    shareLink.appendChild(label);

    const screenReaderOnly = document.createElement('span');
    screenReaderOnly.classList.add('cmp-link__screen-reader-only');
    screenReaderOnly.textContent = 'opens in a new tab';
    shareLink.appendChild(screenReaderOnly);

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.classList.add('social-media-share__wrapper--url');
    hiddenInput.value = platform;
    iconLabelDiv.appendChild(hiddenInput);

    socialIconsDiv.appendChild(iconLabelDiv);
  });

  const inputButtonDiv = document.createElement('div');
  inputButtonDiv.classList.add(
    'social-media-share__wrapper--input-button',
    'd-flex',
    'align-items-center',
    'mt-8',
    'justify-content-md-center',
    'flex-column',
    'flex-md-row',
  );
  shareWrapper.appendChild(inputButtonDiv);

  const input = document.createElement('input');
  input.type = 'text';
  input.classList.add(
    'social-media-share__wrapper--input',
    'bg-white',
    'font-16',
    'leading-22',
    'px-4',
    'py-3',
    'shadow-none',
  );
  inputButtonDiv.appendChild(input);

  const copyButton = document.createElement('button');
  copyButton.classList.add(
    'social-media-share__wrapper--button',
    'font-18',
    'leading-24',
    'py-4',
    'px-8',
    'fw-bold',
    'text-white',
  );
  copyButton.textContent = 'Copy';
  copyButton.addEventListener('click', () => {
    input.select();
    document.execCommand('copy');
  });
  inputButtonDiv.appendChild(copyButton);

  const prevButton = document.createElement('button');
  prevButton.classList.add(
    'card-carousel__swiper--prev',
    'card-carousel__navigation',
    'cursor-pointer',
    'rounded-circle',
    'bg-transparent',
    'text-red-100',
    'text-maroon-600-hover',
    'justify-content-center',
    'align-items-center',
    'position-absolute',
    'd-none',
    'd-sm-flex',
  );
  prevButton.innerHTML = `
    <svg class="icon w-100 h-100">
      <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right_carousel"></use>
    </svg>
  `;
  swiperWrapperContainer.appendChild(prevButton);

  const nextButton = document.createElement('button');
  nextButton.classList.add(
    'card-carousel__swiper--next',
    'card-carousel__navigation',
    'cursor-pointer',
    'rounded-circle',
    'bg-transparent',
    'text-red-100',
    'text-maroon-600-hover',
    'justify-content-center',
    'align-items-center',
    'position-absolute',
    'end-0',
    'd-none',
    'd-sm-flex',
  );
  nextButton.innerHTML = `
    <svg class="icon w-100 h-100">
      <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right_carousel"></use>
    </svg>
  `;
  swiperWrapperContainer.appendChild(nextButton);

  const pagination = document.createElement('div');
  pagination.classList.add(
    'card-carousel__swiper--pagination',
    'mt-10',
    'cursor-pointer',
    'position-relative',
    'swiper-pagination-clickable',
    'swiper-pagination-bullets',
    'swiper-pagination-horizontal',
    'mx-auto',
    'w-fit',
  );
  swiperContainer.appendChild(pagination);

  block.appendChild(swiperContainer);

  const viewAllCtaWrapper = document.createElement('div');
  viewAllCtaWrapper.classList.add(
    'd-flex',
    'justify-content-center',
    'align-items-center',
    'mt-8',
  );

  const viewAllLink = document.createElement('a');
  viewAllLink.classList.add(
    'svasti-cta',
    'cta-analytics',
    'w-fit',
    'text-decoration-none',
    'd-flex',
    'align-items-center',
    'primary',
    'px-8',
    'pb-3',
    'text-cream-100',
    'border',
    'border-2',
    'border-red-100',
    'border-maroon-100-hover',
    'border-red-300-active',
    'bg-red-100',
    'bg-maroon-100-hover',
    'bg-red-300-active',
  );
  viewAllLink.href = viewAllLinkRow?.querySelector('a')?.href || '#';
  moveInstrumentation(viewAllLinkRow.firstElementChild, viewAllLink);

  const viewAllLabel = document.createElement('span');
  viewAllLabel.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
  viewAllLabel.textContent = 'View All';
  viewAllLink.appendChild(viewAllLabel);
  viewAllCtaWrapper.appendChild(viewAllLink);
  block.appendChild(viewAllCtaWrapper);

  // Initialize Swiper (simplified for EDS, actual Swiper JS would be loaded separately)
  let currentIndex = 0;
  const slides = [...swiperWrapper.children];
  const totalSlides = slides.length;

  const updateCarousel = () => {
    slides.forEach((slide, i) => {
      slide.style.display = i === currentIndex ? 'block' : 'none';
    });

    // Update pagination bullets
    pagination.innerHTML = '';
    for (let i = 0; i < totalSlides; i += 1) {
      const bullet = document.createElement('span');
      bullet.classList.add('swiper-pagination-bullet');
      if (i === currentIndex) {
        bullet.classList.add('swiper-pagination-bullet-active', 'swiper-pagination-bullet-active-main');
      }
      bullet.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
      });
      pagination.appendChild(bullet);
    }
  };

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  });

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  });

  if (totalSlides > 0) {
    updateCarousel();
  }
}
