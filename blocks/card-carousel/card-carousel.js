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
      subWrap.classList.add('has-sub-child'); // Use original HTML class
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
  // Root rows: title, subtitle, viewAllLink, then item rows
  const rows = [...block.children];
  const titleRow = rows.find((row) => row.querySelector('div')?.textContent.trim() === 'Carousel Title label text');
  const subtitleRow = rows.find((row) => row.querySelector('div')?.textContent.trim() === 'Carousel Subtitle label text');
  const viewAllLinkRow = rows.find((row) => row.querySelector('a[href*="viewAllLink"]'));
  const itemRows = rows.filter((row) => row !== titleRow && row !== subtitleRow && row !== viewAllLinkRow);

  block.innerHTML = ''; // Clear block content

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');
  block.append(container);

  if (titleRow) {
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
    title.textContent = titleRow.firstElementChild.textContent.trim();
    container.append(title);
  }

  if (subtitleRow) {
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
    subtitle.textContent = subtitleRow.firstElementChild.textContent.trim();
    container.append(subtitle);
  }

  const cardCarouselSwiper = document.createElement('div');
  cardCarouselSwiper.classList.add('card-carousel__swiper', 'swiper', 'container', 'gx-0');
  cardCarouselSwiper.setAttribute('data-loop', 'true');
  block.append(cardCarouselSwiper);

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('card-carousel__swiper--container', 'mt-8', 'mt-sm-10');
  cardCarouselSwiper.append(swiperContainer);

  const popularRecipeSection = document.createElement('section');
  popularRecipeSection.classList.add('popular-recipe', 'slide-in-anim');
  swiperContainer.append(popularRecipeSection);

  const popularRecipeContainer = document.createElement('div');
  popularRecipeContainer.classList.add(
    'popular-recipe__container',
    'overflow-hidden',
    'swiper-initialized',
    'swiper-horizontal',
    'swiper-backface-hidden',
  );
  popularRecipeContainer.setAttribute('data-swiper-init-async', 'true');
  popularRecipeSection.append(popularRecipeContainer);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper', 'popular-recipe__recipe-wrapper');
  popularRecipeContainer.append(swiperWrapper);

  const socialMediaShareItems = [];

  itemRows.forEach((row) => {
    const cells = [...row.children];
    // Recipe Card item has 9 cells
    if (cells.length === 9) {
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
      ] = cells;

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
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, imageAltCell.textContent.trim(), false, [{ width: '750' }]);
          optimizedPic.classList.add('recipe-card__image', 'object-fit-cover', 'w-100');
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
      recipeTag.textContent = tagCell.textContent.trim();
      recipeInfo.append(recipeTag);

      const shareSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      shareSvg.classList.add('icon', 'share', 'text-dark-gray-100');
      const shareUse = document.createElementNS('http://www.w3.org/1999/xlink', 'href', '#share');
      shareSvg.append(shareUse);
      recipeInfo.append(shareSvg);

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
      recipeTitle.textContent = recipeTitleCell.textContent.trim();
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
      recipeDesc.textContent = descriptionCell.textContent.trim();
      recipeText.append(recipeDesc);

      const recipeWave = document.createElement('div');
      recipeWave.classList.add('recipe-card__wave', 'mt-11', 'mt-xl-7', 'w-100');
      recipeContent.append(recipeWave);

      const recipeProperties = document.createElement('ul');
      recipeProperties.classList.add(
        'recipe-card__properties',
        'mt-4',
        'd-flex',
        'align-items-center',
      );
      recipeContent.append(recipeProperties);

      const timeProperty = document.createElement('li');
      timeProperty.classList.add(
        'recipe-card__property',
        'recipe-card__property--left',
        'd-flex',
        'align-items-center',
      );
      recipeProperties.append(timeProperty);

      const clockSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      clockSvg.classList.add('icon', 'clock', 'text-dark-gray-100');
      const clockUse = document.createElementNS('http://www.w3.org/1999/xlink', 'href', '#clock');
      clockSvg.append(clockUse);
      timeProperty.append(clockSvg);

      const recipeTime = document.createElement('span');
      recipeTime.classList.add(
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
      recipeTime.textContent = timeCell.textContent.trim();
      timeProperty.append(recipeTime);

      const servesProperty = document.createElement('li');
      servesProperty.classList.add(
        'recipe-card__property',
        'recipe-card__property--right',
        'flex-fill',
        'd-flex',
        'align-items-center',
        'justify-content-end',
      );
      recipeProperties.append(servesProperty);

      const peopleSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      peopleSvg.classList.add('icon', 'people', 'text-dark-gray-100');
      const peopleUse = document.createElementNS('http://www.w3.org/1999/xlink', 'href', '#people');
      peopleSvg.append(peopleUse);
      servesProperty.append(peopleSvg);

      const recipeServes = document.createElement('span');
      recipeServes.classList.add(
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
      recipeServes.textContent = servesCell.textContent.trim();
      servesProperty.append(recipeServes);

      // Hierarchy-tree richtext field
      const hierarchyRoot = hierarchyCell.querySelector('ul');
      if (hierarchyRoot) {
        // Create a temporary div to hold the parsed HTML and apply classes
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML;
        moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell

        // Apply classes to nested elements as per original HTML structure if needed for styling
        tempDiv.querySelectorAll('ul').forEach((ul) => ul.classList.add('nav-menu', 'list-unstyled'));
        tempDiv.querySelectorAll('li').forEach((li) => li.classList.add('nav-menu-item', 'list-item'));
        tempDiv.querySelectorAll('a').forEach((a) => a.classList.add('nav-menu-link', 'text-decoration-none'));

        // Example of how hierarchy could be processed if needed elsewhere
        // For now, it's just processed and not appended to the recipe card itself,
        // but the structure is preserved and classes applied.
        // If it were to be rendered, it would be appended to a suitable parent.
        // For instance, if it was a sub-navigation:
        // someNavElement.append(tempDiv);
        // transformNestedLists(tempDiv.querySelector('ul')); // If interactive behavior is needed
      }
    } else if (cells.length === 3) {
      // Social Media Share item
      const [socialLinkCell, iconCell, labelCell] = cells;
      socialMediaShareItems.push({ socialLinkCell, iconCell, labelCell });
      moveInstrumentation(row, document.createElement('div')); // Move instrumentation for item row
    }
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
  const prevSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  prevSvg.classList.add('icon', 'w-100', 'h-100');
  const prevUse = document.createElementNS('http://www.w3.org/1999/xlink', 'href', '#arrow_right_carousel');
  prevSvg.append(prevUse);
  prevButton.append(prevSvg);
  swiperContainer.append(prevButton);

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
  const nextSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  nextSvg.classList.add('icon', 'w-100', 'h-100');
  const nextUse = document.createElementNS('http://www.w3.org/1999/xlink', 'href', '#arrow_right_carousel');
  nextSvg.append(nextUse);
  nextButton.append(nextSvg);
  swiperContainer.append(nextButton);

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
  cardCarouselSwiper.append(pagination);

  const viewAllWrapper = document.createElement('div');
  viewAllWrapper.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'mt-8');
  block.append(viewAllWrapper);

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
    const foundViewAllLink = viewAllLinkRow.firstElementChild.querySelector('a');
    if (foundViewAllLink) {
      viewAllLink.href = foundViewAllLink.href;
    }

    const viewAllLabel = document.createElement('span');
    viewAllLabel.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
    viewAllLabel.textContent = 'View All'; // Hardcoded label from original HTML
    viewAllLink.append(viewAllLabel);
    viewAllWrapper.append(viewAllLink);
    moveInstrumentation(viewAllLinkRow, viewAllLink);
  }

  // Social Media Share Modal
  if (socialMediaShareItems.length > 0) {
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

    const closeButtonWrapper = document.createElement('div');
    closeButtonWrapper.classList.add('social-media-share__wrapper--close');
    titleCloseWrapper.append(closeButtonWrapper);

    const crossSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    crossSvg.classList.add('icon', 'cross', 'text-black', 'h-100', 'w-100');
    const crossUse = document.createElementNS('http://www.w3.org/1999/xlink', 'href', '#cross');
    crossSvg.append(crossUse);
    closeButtonWrapper.append(crossSvg);

    const socialIconsWrapper = document.createElement('div');
    socialIconsWrapper.classList.add(
      'social-media-share__wrapper--social-icons',
      'pt-8',
      'd-flex',
      'overflow-hidden',
      'swiper-initialized',
      'swiper-horizontal',
    );
    socialMediaShareWrapper.append(socialIconsWrapper);

    const swiperIconsWrapper = document.createElement('div');
    swiperIconsWrapper.classList.add(
      'social-media-share__wrapper--social-icons-wrapper',
      'swiper-wrapper',
      'px-3',
      'px-md-0',
    );
    swiperIconsWrapper.setAttribute('data-page-url', '#');
    socialIconsWrapper.append(swiperIconsWrapper);

    socialMediaShareItems.forEach(({ socialLinkCell, iconCell, labelCell }) => {
      const iconLabelWrapper = document.createElement('div');
      iconLabelWrapper.classList.add(
        'social-media-share__wrapper--icon-label',
        'swiper-slide',
        'd-flex',
        'align-items-center',
      );
      swiperIconsWrapper.append(iconLabelWrapper);

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
      socialLink.target = '_blank';
      const foundSocialLink = socialLinkCell.querySelector('a');
      if (foundSocialLink) {
        socialLink.href = foundSocialLink.href;
      }
      iconLabelWrapper.append(socialLink);

      const iconsContainer = document.createElement('div');
      iconsContainer.classList.add(
        'social-media-share__wrapper--icons',
        'rounded-circle',
        'bg-white',
        'd-flex',
        'justify-content-center',
        'align-items-center',
      );
      socialLink.append(iconsContainer);

      const iconLink = document.createElement('div'); // This was a div in original HTML, not an anchor
      iconLink.classList.add('social-media-share__wrapper--link', 'text-decoration-none');
      iconsContainer.append(iconLink);

      const iconImg = iconCell.querySelector('img');
      if (iconImg) {
        const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        iconSvg.classList.add('icon', 'text-black', iconImg.alt.toLowerCase(), 'social-media-share__wrapper--images');
        const iconUse = document.createElementNS('http://www.w3.org/1999/xlink', 'href', `#${iconImg.alt.toLowerCase()}`);
        iconSvg.append(iconUse);
        iconLink.append(iconSvg);
      }

      const labelDiv = document.createElement('div');
      labelDiv.classList.add(
        'social-media-share__wrapper--label',
        'text-center',
        'font-16',
        'leading-22',
        'text-black',
      );
      labelDiv.setAttribute('data-socialmedia-name', labelCell.textContent.trim().toLowerCase());
      labelDiv.textContent = labelCell.textContent.trim();
      socialLink.append(labelDiv);

      const screenReaderOnly = document.createElement('span');
      screenReaderOnly.classList.add('cmp-link__screen-reader-only');
      screenReaderOnly.textContent = 'opens in a new tab';
      socialLink.append(screenReaderOnly);

      const hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.classList.add('social-media-share__wrapper--url');
      hiddenInput.value = labelCell.textContent.trim().toLowerCase();
      iconLabelWrapper.append(hiddenInput);
    });

    const sharePrevButton = document.createElement('button');
    sharePrevButton.classList.add(
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
    const sharePrevSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    sharePrevSvg.classList.add('icon', 'carousel-right-arrow-v2', 'h-100', 'w-100', 'text-red-100');
    const sharePrevUse = document.createElementNS('http://www.w3.org/1999/xlink', 'href', '#arrow_right_carousel_v2');
    sharePrevSvg.append(sharePrevUse);
    sharePrevButton.append(sharePrevSvg);
    socialIconsWrapper.append(sharePrevButton);

    const shareNextButton = document.createElement('button');
    shareNextButton.classList.add(
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
    const shareNextSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    shareNextSvg.classList.add('icon', 'carousel-right-arrow-v2', 'h-100', 'w-100', 'text-red-100');
    const shareNextUse = document.createElementNS('http://www.w3.org/1999/xlink', 'href', '#arrow_right_carousel_v2');
    shareNextSvg.append(shareNextUse);
    shareNextButton.append(shareNextSvg);
    socialIconsWrapper.append(shareNextButton);

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

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.classList.add(
      'social-media-share__wrapper--input',
      'bg-white',
      'font-16',
      'leading-22',
      'px-4',
      'py-3',
      'shadow-none',
    );
    inputButtonWrapper.append(inputField);

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

    // Event listeners for share modal
    const shareButtons = block.querySelectorAll('.recipe-card__info .share');
    shareButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        socialMediaShareSection.classList.remove('d-none');
      });
    });

    closeButtonWrapper.addEventListener('click', () => {
      socialMediaShareSection.classList.add('d-none');
    });

    socialMediaShareSection.addEventListener('click', (e) => {
      if (e.target === socialMediaShareSection) {
        socialMediaShareSection.classList.add('d-none');
      }
    });

    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(inputField.value);
        // Optionally, provide user feedback that text has been copied
        // console.log('Text copied to clipboard');
      } catch (err) {
        // console.error('Failed to copy text: ', err);
      }
    });
  }

  // This part of the code is generic and applies to all pictures in the block,
  // but it's better to handle picture optimization directly when creating elements
  // as done for recipe card images. If there are other pictures not handled,
  // this might be needed. For now, it's redundant if all pictures are handled above.
  block.querySelectorAll('picture > img').forEach((img) => {
    // Check if the image has already been processed by createOptimizedPicture
    // to avoid re-processing or replacing already optimized pictures.
    // This is a simple check, more robust checks might be needed depending on context.
    if (!img.closest('picture').dataset.optimized) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
      optimizedPic.dataset.optimized = 'true'; // Mark as optimized
    }
  });
}
