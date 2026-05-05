import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
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
    }
  });
}

export default async function decorate(block) {
  const [
    titleRow,
    subtitleRow,
    ctaLinkRow,
    ctaLabelRow,
    ...itemRows
  ] = [...block.children];

  const recipeCardItems = itemRows.filter((row) => row.children.length === 8);
  const socialMediaShareItems = itemRows.filter((row) => row.children.length === 2);

  const section = document.createElement('section');
  section.classList.add('card-carousel');

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');
  section.append(container);

  if (titleRow) {
    const title = document.createElement('h2');
    moveInstrumentation(titleRow, title);
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
    title.textContent = titleRow.textContent.trim();
    container.append(title);
  }

  if (subtitleRow) {
    const subtitle = document.createElement('p');
    moveInstrumentation(subtitleRow, subtitle);
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
    subtitle.textContent = subtitleRow.textContent.trim();
    container.append(subtitle);
  }

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add(
    'card-carousel__swiper',
    'swiper',
    'container',
    'gx-0',
  );
  swiperContainer.dataset.loop = 'true';
  section.append(swiperContainer);

  const swiperWrapperContainer = document.createElement('div');
  swiperWrapperContainer.classList.add(
    'card-carousel__swiper--container',
    'mt-8',
    'mt-sm-10',
  );
  swiperContainer.append(swiperWrapperContainer);

  const popularRecipeContainer = document.createElement('div');
  popularRecipeContainer.classList.add(
    'popular-recipe__container',
    'overflow-hidden',
  );
  swiperWrapperContainer.append(popularRecipeContainer);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper', 'popular-recipe__recipe-wrapper');
  popularRecipeContainer.append(swiperWrapper);

  recipeCardItems.forEach((row) => {
    const [
      linkCell,
      imageCell,
      tagCell,
      titleCell,
      descriptionCell,
      timeCell,
      servesCell,
      hierarchyTreeCell,
    ] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');
    moveInstrumentation(row, swiperSlide);
    swiperWrapper.append(swiperSlide);

    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card', 'bg-cream-100', 'h-100');
    swiperSlide.append(recipeCard);

    const recipeLink = document.createElement('a');
    recipeLink.classList.add('recipe-card__link', 'd-block', 'position-relative');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      recipeLink.href = foundLink.href;
    }
    recipeCard.append(recipeLink);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      recipeLink.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('recipe-card__image', 'object-fit-cover', 'w-100');
    }

    const content = document.createElement('div');
    content.classList.add('recipe-card__content', 'py-6');
    recipeLink.append(content);

    const info = document.createElement('div');
    info.classList.add('recipe-card__info', 'd-flex', 'align-items-center', 'justify-content-between');
    content.append(info);

    const tag = document.createElement('span');
    tag.classList.add('recipe-card__tag', 'text-uppercase', 'text-red-100', 'font-14', 'font-xl-default', 'leading-24', 'fw-semibold');
    tag.textContent = tagCell.textContent.trim();
    info.append(tag);

    const shareIcon = document.createElement('svg');
    shareIcon.classList.add('icon', 'share', 'text-dark-gray-100');
    shareIcon.innerHTML = '<use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#share"></use>';
    info.append(shareIcon);

    const text = document.createElement('div');
    text.classList.add('recipe-card__text');
    content.append(text);

    const titleEl = document.createElement('h3');
    titleEl.classList.add('recipe-card__title', 'font-20', 'font-xl-24', 'leading-24', 'leading-xl-30', 'font-baskerville', 'fw-bold', 'text-dark-gray-100', 'mt-4');
    titleEl.textContent = titleCell.textContent.trim();
    text.append(titleEl);

    const description = document.createElement('p');
    description.classList.add('recipe-card__desc', 'font-default', 'font-xl-18', 'leading-24', 'fw-medium', 'text-dark-gray-100', 'mt-4');
    description.textContent = descriptionCell.textContent.trim();
    text.append(description);

    const wave = document.createElement('div');
    wave.classList.add('recipe-card__wave', 'mt-11', 'mt-xl-7', 'w-100');
    content.append(wave);

    const properties = document.createElement('ul');
    properties.classList.add('recipe-card__properties', 'mt-4', 'd-flex', 'align-items-center');
    content.append(properties);

    const timeProperty = document.createElement('li');
    timeProperty.classList.add('recipe-card__property', 'recipe-card__property--left', 'd-flex', 'align-items-center');
    properties.append(timeProperty);

    const clockIcon = document.createElement('svg');
    clockIcon.classList.add('icon', 'clock', 'text-dark-gray-100');
    clockIcon.innerHTML = '<use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#clock"></use>';
    timeProperty.append(clockIcon);

    const timeSpan = document.createElement('span');
    timeSpan.classList.add('recipe-card__time', 'text-dark-gray-100', 'font-14', 'font-xl-default', 'leading-20', 'fw-medium', 'ms-2', 'd-inline-block', 'text-nowrap');
    timeSpan.textContent = timeCell.textContent.trim();
    timeProperty.append(timeSpan);

    const servesProperty = document.createElement('li');
    servesProperty.classList.add('recipe-card__property', 'recipe-card__property--right', 'flex-fill', 'd-flex', 'align-items-center', 'justify-content-end');
    properties.append(servesProperty);

    const peopleIcon = document.createElement('svg');
    peopleIcon.classList.add('icon', 'people', 'text-dark-gray-100');
    peopleIcon.innerHTML = '<use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#people"></use>';
    servesProperty.append(peopleIcon);

    const servesSpan = document.createElement('span');
    servesSpan.classList.add('serve-content', 'recipe-card__serves', 'text-dark-gray-100', 'font-14', 'font-xl-default', 'leading-20', 'fw-medium', 'ms-2', 'd-inline-block');
    servesSpan.textContent = servesCell.textContent.trim();
    servesProperty.append(servesSpan);
  });

  const prevBtn = document.createElement('button');
  prevBtn.classList.add(
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
  prevBtn.innerHTML = '<svg class="icon w-100 h-100"><use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right_carousel"></use></svg>';
  swiperWrapperContainer.append(prevBtn);

  const nextBtn = document.createElement('button');
  nextBtn.classList.add(
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
  nextBtn.innerHTML = '<svg class="icon w-100 h-100"><use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right_carousel"></use></svg>';
  swiperWrapperContainer.append(nextBtn);

  const paginationEl = document.createElement('div');
  paginationEl.classList.add(
    'card-carousel__swiper--pagination',
    'mt-10',
    'cursor-pointer',
    'position-relative',
    'mx-auto',
    'w-fit',
  );
  swiperContainer.append(paginationEl);

  const ctaWrapper = document.createElement('div');
  ctaWrapper.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'mt-8');
  section.append(ctaWrapper);

  if (ctaLinkRow && ctaLabelRow) {
    const ctaLink = document.createElement('a');
    ctaLink.classList.add(
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
    const foundCtaLink = ctaLinkRow.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
    }
    moveInstrumentation(ctaLinkRow, ctaLink);
    moveInstrumentation(ctaLabelRow, ctaLink);

    const ctaLabel = document.createElement('span');
    ctaLabel.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
    ctaLabel.textContent = ctaLabelRow.textContent.trim();
    ctaLink.append(ctaLabel);
    ctaWrapper.append(ctaLink);
  }

  const socialMediaShareSection = document.createElement('section');
  socialMediaShareSection.classList.add(
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
  section.append(socialMediaShareSection);

  const socialMediaShareWrapper = document.createElement('div');
  socialMediaShareWrapper.classList.add(
    'social-media-share__wrapper',
    'bg-cream-100',
    'py-8',
    'px-3',
    'px-md-8',
  );
  socialMediaShareSection.append(socialMediaShareWrapper);

  const titleCloseWrapper = document.createElement('div');
  titleCloseWrapper.classList.add(
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
  socialMediaShareWrapper.append(titleCloseWrapper);

  const closeButton = document.createElement('div');
  closeButton.classList.add('social-media-share__wrapper--close');
  closeButton.innerHTML = '<svg class="icon cross text-black h-100 w-100"><use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#cross"></use></svg>';
  titleCloseWrapper.append(closeButton);

  const socialIconsWrapper = document.createElement('div');
  socialIconsWrapper.classList.add(
    'social-media-share__wrapper--social-icons',
    'pt-8',
    'd-flex',
    'overflow-hidden',
  );
  socialMediaShareWrapper.append(socialIconsWrapper);

  const socialIconsSwiperWrapper = document.createElement('div');
  socialIconsSwiperWrapper.classList.add(
    'social-media-share__wrapper--social-icons-wrapper',
    'swiper-wrapper',
    'px-3',
    'px-md-0',
  );
  socialIconsWrapper.append(socialIconsSwiperWrapper);

  socialMediaShareItems.forEach((row) => {
    const [linkCell, labelCell] = [...row.children];

    const iconLabelWrapper = document.createElement('div');
    iconLabelWrapper.classList.add(
      'social-media-share__wrapper--icon-label',
      'swiper-slide',
      'd-flex',
      'align-items-center',
    );
    moveInstrumentation(row, iconLabelWrapper);
    socialIconsSwiperWrapper.append(iconLabelWrapper);

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
    const foundShareLink = linkCell.querySelector('a');
    if (foundShareLink) {
      shareLink.href = foundShareLink.href;
      shareLink.target = '_blank';
    }
    iconLabelWrapper.append(shareLink);

    const iconsCircle = document.createElement('div');
    iconsCircle.classList.add(
      'social-media-share__wrapper--icons',
      'rounded-circle',
      'bg-white',
      'd-flex',
      'justify-content-center',
      'align-items-center',
    );
    shareLink.append(iconsCircle);

    const iconSvgWrapper = document.createElement('div');
    iconSvgWrapper.classList.add('social-media-share__wrapper--link', 'text-decoration-none');
    iconsCircle.append(iconSvgWrapper);

    const labelText = labelCell.textContent.trim().toLowerCase();
    let iconName = '';
    if (labelText === 'facebook') {
      iconName = 'facebook';
    } else if (labelText === 'whatsapp') {
      iconName = 'whatsapp_icon';
    } else if (labelText === 'x') {
      iconName = 'twitterX';
    }

    const iconSvg = document.createElement('svg');
    iconSvg.classList.add('icon', 'text-black', iconName, 'social-media-share__wrapper--images');
    iconSvg.innerHTML = `<use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#${iconName}"></use>`;
    iconSvgWrapper.append(iconSvg);

    const labelDiv = document.createElement('div');
    labelDiv.classList.add('social-media-share__wrapper--label', 'text-center', 'font-16', 'leading-22', 'text-black');
    labelDiv.dataset.socialmediaName = labelText;
    labelDiv.textContent = labelCell.textContent.trim();
    shareLink.append(labelDiv);

    const screenReaderOnly = document.createElement('span');
    screenReaderOnly.classList.add('cmp-link__screen-reader-only');
    screenReaderOnly.textContent = 'opens in a new tab';
    shareLink.append(screenReaderOnly);

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.classList.add('social-media-share__wrapper--url');
    hiddenInput.value = labelText;
    iconLabelWrapper.append(hiddenInput);
  });

  const sharePrevBtn = document.createElement('button');
  sharePrevBtn.classList.add(
    'social-media-share__button',
    'bg-transparent',
    'border-0',
    'social-media-share__prev',
    'd-none',
    'z-2',
    'd-md-block',
    'position-absolute',
    'swiper-button-prev',
  );
  sharePrevBtn.innerHTML = '<svg class="icon carousel-right-arrow-v2 h-100 w-100 text-red-100"><use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right_carousel_v2"></use></svg>';
  socialIconsWrapper.append(sharePrevBtn);

  const shareNextBtn = document.createElement('button');
  shareNextBtn.classList.add(
    'social-media-share__button',
    'bg-transparent',
    'border-0',
    'social-media-share__next',
    'd-none',
    'z-2',
    'd-md-block',
    'position-absolute',
    'swiper-button-next',
  );
  shareNextBtn.innerHTML = '<svg class="icon carousel-right-arrow-v2 h-100 w-100 text-red-100"><use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right_carousel_v2"></use></svg>';
  socialIconsWrapper.append(shareNextBtn);

  const inputButtonWrapper = document.createElement('div');
  inputButtonWrapper.classList.add(
    'social-media-share__wrapper--input-button',
    'd-flex',
    'align-items-center',
    'mt-8',
    'justify-content-md-center',
    'flex-column',
    'flex-md-row',
  );
  socialMediaShareWrapper.append(inputButtonWrapper);

  const inputEl = document.createElement('input');
  inputEl.type = 'text';
  inputEl.classList.add(
    'social-media-share__wrapper--input',
    'bg-white',
    'font-16',
    'leading-22',
    'px-4',
    'py-3',
    'shadow-none',
  );
  inputButtonWrapper.append(inputEl);

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
  inputButtonWrapper.append(copyButton);

  block.replaceChildren(section);

  // Swiper initialization
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(popularRecipeContainer, {
    slidesPerView: 'auto',
    spaceBetween: 34,
    loop: swiperContainer.dataset.loop === 'true',
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: paginationEl,
      clickable: true,
    },
    breakpoints: {
      576: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 4 },
    },
  });

  // eslint-disable-next-line no-undef
  new Swiper(socialIconsWrapper, {
    slidesPerView: 'auto',
    spaceBetween: 16,
    loop: false,
    navigation: {
      prevEl: sharePrevBtn,
      nextEl: shareNextBtn,
    },
  });

  // Event listener for share icon
  const shareIcons = block.querySelectorAll('.recipe-card__info .share');
  shareIcons.forEach((icon) => {
    icon.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      socialMediaShareSection.classList.toggle('d-none');
    });
  });

  // Event listener for close button
  closeButton.addEventListener('click', () => {
    socialMediaShareSection.classList.add('d-none');
  });

  // Event listener for copy button
  copyButton.addEventListener('click', () => {
    inputEl.select();
    document.execCommand('copy');
  });
}
