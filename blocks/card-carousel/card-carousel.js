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
  const rows = [...block.children];

  // Root fields: title, subtitle, viewAllLink
  const titleRow = rows[0];
  const subtitleRow = rows[1];
  const viewAllLinkRow = rows[2];
  const itemRows = rows.slice(3); // Remaining rows are item rows

  block.innerHTML = ''; // Clear the block content

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'gx-8', 'gx-sm-0');
  moveInstrumentation(block, containerDiv);

  if (titleRow) {
    const titleCell = [...titleRow.children].find((cell) => cell.textContent.trim());
    if (titleCell) {
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
      title.textContent = titleCell.textContent.trim();
      moveInstrumentation(titleRow, title);
      containerDiv.append(title);
    }
  }

  if (subtitleRow) {
    const subtitleCell = [...subtitleRow.children].find((cell) => cell.textContent.trim());
    if (subtitleCell) {
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
      subtitle.textContent = subtitleCell.textContent.trim();
      moveInstrumentation(subtitleRow, subtitle);
      containerDiv.append(subtitle);
    }
  }

  block.append(containerDiv);

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add(
    'card-carousel__swiper',
    'swiper',
    'container',
    'gx-0',
  );

  const swiperWrapperContainer = document.createElement('div');
  swiperWrapperContainer.classList.add(
    'card-carousel__swiper--container',
    'mt-8',
    'mt-sm-10',
  );
  swiperContainer.append(swiperWrapperContainer);

  const popularRecipeSection = document.createElement('section');
  popularRecipeSection.classList.add('popular-recipe', 'slide-in-anim');
  swiperWrapperContainer.append(popularRecipeSection);

  const popularRecipeContainer = document.createElement('div');
  popularRecipeContainer.classList.add(
    'popular-recipe__container',
    'overflow-hidden',
    'swiper-initialized',
    'swiper-horizontal',
    'swiper-backface-hidden',
  );
  popularRecipeSection.append(popularRecipeContainer);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper', 'popular-recipe__recipe-wrapper');
  popularRecipeContainer.append(swiperWrapper);

  const socialMediaShareItems = [];
  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 9) {
      // Recipe-Card item
      const [
        linkCell,
        imageCell,
        imageAltCell,
        tagCell,
        recipeTitleCell,
        descriptionCell,
        timeCell,
        servesCell,
        hierarchyTreeCell,
      ] = cells;

      const swiperSlide = document.createElement('div');
      swiperSlide.classList.add('swiper-slide');
      moveInstrumentation(row, swiperSlide);

      const recipeCard = document.createElement('div');
      recipeCard.classList.add('recipe-card', 'bg-cream-100', 'h-100');
      swiperSlide.append(recipeCard);

      const recipeLink = document.createElement('a');
      recipeLink.classList.add(
        'recipe-card__link',
        'd-block',
        'position-relative',
      );
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        recipeLink.href = foundLink.href;
      }
      recipeCard.append(recipeLink);

      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(
            img.src,
            imageAltCell?.textContent.trim() || img.alt,
            false,
            [{ width: '750' }],
          );
          optimizedPic.querySelector('img').classList.add(
            'recipe-card__image',
            'object-fit-cover',
            'w-100',
          );
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          recipeLink.append(optimizedPic);
        }
      }

      const recipeContent = document.createElement('div');
      recipeContent.classList.add('recipe-card__content', 'py-6');
      recipeLink.append(recipeContent);

      const recipeInfo = document.createElement('div');
      recipeInfo.classList.add(
        'recipe-card__info',
        'd-flex',
        'align-items-center',
        'justify-content-between',
      );
      recipeContent.append(recipeInfo);

      const recipeTag = document.createElement('span');
      recipeTag.classList.add(
        'recipe-card__tag',
        'text-uppercase',
        'text-red-100',
        'font-14',
        'font-xl-default',
        'leading-24',
        'fw-semibold',
      );
      recipeTag.textContent = tagCell?.textContent.trim();
      recipeInfo.append(recipeTag);

      const shareSvg = `
        <svg class="icon share text-dark-gray-100">
          <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#share"></use>
        </svg>
      `;
      recipeInfo.insertAdjacentHTML('beforeend', shareSvg);

      const recipeText = document.createElement('div');
      recipeText.classList.add('recipe-card__text');
      recipeContent.append(recipeText);

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
      recipeTitle.textContent = recipeTitleCell?.textContent.trim();
      recipeText.append(recipeTitle);

      const recipeDesc = document.createElement('p');
      recipeDesc.classList.add(
        'recipe-card__desc',
        'font-default',
        'font-xl-18',
        'leading-24',
        'fw-medium',
        'text-dark-gray-100',
        'mt-4',
      );
      recipeDesc.textContent = descriptionCell?.textContent.trim();
      recipeText.append(recipeDesc);

      const recipeWave = document.createElement('div');
      recipeWave.classList.add(
        'recipe-card__wave',
        'mt-11',
        'mt-xl-7',
        'w-100',
      );
      recipeContent.append(recipeWave);

      const recipeProperties = document.createElement('ul');
      recipeProperties.classList.add(
        'recipe-card__properties',
        'mt-4',
        'd-flex',
        'align-items-center',
        'mt-4',
      );
      recipeContent.append(recipeProperties);

      const timeProperty = document.createElement('li');
      timeProperty.classList.add(
        'recipe-card__property',
        'recipe-card__property--left',
        'd-flex',
        'align-items-center',
      );
      timeProperty.innerHTML = `
        <svg class="icon clock text-dark-gray-100 ">
          <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#clock"></use>
        </svg>
        <span class="recipe-card__time text-dark-gray-100 font-14 font-xl-default leading-20 fw-medium ms-2 d-inline-block text-nowrap">${
          timeCell?.textContent.trim() || ''
        }</span>
      `;
      recipeProperties.append(timeProperty);

      const servesProperty = document.createElement('li');
      servesProperty.classList.add(
        'recipe-card__property',
        'recipe-card__property--right',
        'flex-fill',
        'd-flex',
        'align-items-center',
        'justify-content-end',
      );
      servesProperty.innerHTML = `
        <svg class="icon people text-dark-gray-100 ">
          <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#people"></use>
        </svg>
        <span class="serve-content recipe-card__serves text-dark-gray-100 font-14 font-xl-default leading-20 fw-medium ms-2 d-inline-block">${
          servesCell?.textContent.trim() || ''
        }</span>
      `;
      recipeProperties.append(servesProperty);

      // Handle hierarchy-tree richtext
      if (hierarchyTreeCell) {
        const hierarchyDiv = document.createElement('div');
        hierarchyDiv.classList.add('recipe-card__hierarchy');
        // Use innerHTML to preserve nested structure
        hierarchyDiv.innerHTML = hierarchyTreeCell.innerHTML;
        moveInstrumentation(hierarchyTreeCell, hierarchyDiv);

        // Apply classes to nested elements as per original HTML or design
        hierarchyDiv.querySelectorAll('ul').forEach((ul) => {
          ul.classList.add('nav-menu', 'list-unstyled');
        });
        hierarchyDiv.querySelectorAll('li').forEach((li) => {
          li.classList.add('nav-menu-item', 'list-item');
        });
        hierarchyDiv.querySelectorAll('a').forEach((a) => {
          a.classList.add('nav-menu-link', 'text-decoration-none');
        });

        recipeContent.append(hierarchyDiv);
        transformNestedLists(hierarchyDiv); // Apply interactivity for nested lists
      }

      swiperWrapper.append(swiperSlide);
    } else if (cells.length === 3) {
      // Social-Media-Share-Item
      socialMediaShareItems.push(row);
    }
  });

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
  popularRecipeSection.append(socialMediaShareSection);

  const shareWrapper = document.createElement('div');
  shareWrapper.classList.add(
    'social-media-share__wrapper',
    'bg-cream-100',
    'py-8',
    'px-3',
    'px-md-8',
  );
  socialMediaShareSection.append(shareWrapper);

  const shareTitleClose = document.createElement('div');
  shareTitleClose.classList.add(
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
  shareWrapper.append(shareTitleClose);

  const closeButton = document.createElement('div');
  closeButton.classList.add('social-media-share__wrapper--close');
  closeButton.innerHTML = `
    <svg class="icon cross text-black h-100 w-100">
      <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#cross"></use>
    </svg>
  `;
  shareTitleClose.append(closeButton);

  closeButton.addEventListener('click', () => {
    socialMediaShareSection.classList.add('d-none');
  });

  const socialIconsWrapper = document.createElement('div');
  socialIconsWrapper.classList.add(
    'social-media-share__wrapper--social-icons',
    'pt-8',
    'd-flex',
    'overflow-hidden',
    'swiper-initialized',
    'swiper-horizontal',
  );
  shareWrapper.append(socialIconsWrapper);

  socialMediaShareItems.forEach((row) => {
    const [socialLinkCell, socialIconCell, socialLabelCell] = [...row.children];

    const iconLabelDiv = document.createElement('div');
    iconLabelDiv.classList.add(
      'social-media-share__wrapper--icon-label',
      'swiper-slide',
      'd-flex',
      'align-items-center',
    );
    moveInstrumentation(row, iconLabelDiv);

    const socialLink = document.createElement('a');
    socialLink.classList.add(
      'social-media-share__link',
      'd-flex',
      'align-items-center',
      'text-decoration-none',
      'gap-4',
      'w-fit',
      'flex-md-column',
      'justify-content-center',
    );
    const foundSocialLink = socialLinkCell.querySelector('a');
    if (foundSocialLink) {
      socialLink.href = foundSocialLink.href;
      socialLink.target = '_blank';
      socialLink.rel = 'noopener noreferrer';
    }
    iconLabelDiv.append(socialLink);

    const iconWrapper = document.createElement('div');
    iconWrapper.classList.add(
      'social-media-share__wrapper--icons',
      'rounded-circle',
      'bg-white',
      'd-flex',
      'justify-content-center',
      'align-items-center',
    );
    socialLink.append(iconWrapper);

    const iconInnerLink = document.createElement('div');
    iconInnerLink.classList.add('social-media-share__wrapper--link', 'text-decoration-none');
    iconInnerLink.innerHTML = `
      <svg class="icon text-black ${socialIconCell?.textContent.trim()} social-media-share__wrapper--images">
        <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#${socialIconCell?.textContent.trim()}"></use>
      </svg>
    `;
    iconWrapper.append(iconInnerLink);

    const labelDiv = document.createElement('div');
    labelDiv.classList.add(
      'social-media-share__wrapper--label',
      'text-center',
      'font-16',
      'leading-22',
      'text-black',
    );
    labelDiv.textContent = socialLabelCell?.textContent.trim();
    socialLink.append(labelDiv);

    const screenReaderOnly = document.createElement('span');
    screenReaderOnly.classList.add('cmp-link__screen-reader-only');
    screenReaderOnly.textContent = 'opens in a new tab';
    socialLink.append(screenReaderOnly);

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.classList.add('social-media-share__wrapper--url');
    hiddenInput.value = socialIconCell?.textContent.trim();
    iconLabelDiv.append(hiddenInput);

    socialIconsWrapper.append(iconLabelDiv);
  });

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
  shareWrapper.append(inputButtonWrapper);

  const shareInput = document.createElement('input');
  shareInput.type = 'text';
  shareInput.classList.add(
    'social-media-share__wrapper--input',
    'bg-white',
    'font-16',
    'leading-22',
    'px-4',
    'py-3',
    'shadow-none',
  );
  inputButtonWrapper.append(shareInput);

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

  // Add share button click listener to open modal
  swiperWrapper.querySelectorAll('.icon.share').forEach((shareIcon) => {
    shareIcon.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      socialMediaShareSection.classList.remove('d-none');
      shareInput.value = window.location.href; // Set current URL to share input
    });
  });

  copyButton.addEventListener('click', () => {
    shareInput.select();
    document.execCommand('copy');
    // Optionally, provide user feedback
    const originalText = copyButton.textContent;
    copyButton.textContent = 'Copied!';
    setTimeout(() => {
      copyButton.textContent = originalText;
    }, 2000);
  });

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
  swiperWrapperContainer.append(prevButton);

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
  swiperWrapperContainer.append(nextButton);

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
  swiperContainer.append(pagination);

  block.append(swiperContainer);

  const ctaWrapper = document.createElement('div');
  ctaWrapper.classList.add(
    'd-flex',
    'justify-content-center',
    'align-items-center',
    'mt-8',
  );
  block.append(ctaWrapper);

  if (viewAllLinkRow) {
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
    const foundViewAllLink = viewAllLinkRow.querySelector('a'); // Use querySelector on the row itself
    if (foundViewAllLink) {
      viewAllLink.href = foundViewAllLink.href;
    }
    const labelSpan = document.createElement('span');
    labelSpan.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
    labelSpan.textContent = 'View All'; // Hardcoded label as per original HTML
    moveInstrumentation(viewAllLinkRow, viewAllLink);
    ctaWrapper.append(viewAllLink);
  }

  // Initialize Swiper after all elements are added to the DOM
  // This part assumes Swiper is loaded globally or imported.
  // For EDS, Swiper is usually loaded as a dependency.
  if (typeof window.Swiper === 'function') {
    // eslint-disable-next-line no-new
    new window.Swiper(swiperContainer, {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 34,
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
      },
      pagination: {
        el: pagination,
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });
  }
}
