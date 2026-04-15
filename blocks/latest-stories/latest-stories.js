import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const headingRow = children.shift();
  const headingText = headingRow.querySelector('div')?.textContent.trim();

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingText;
  sectionHeader.append(heading);

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');

  const flickitySliderMobileWrap = document.createElement('div');
  flickitySliderMobileWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickitySliderMobileWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const twitterSlides = document.createElement('div');
  twitterSlides.classList.add('slides');

  const twitterFeedContainer = document.createElement('div');
  twitterFeedContainer.classList.add('elfsight-app-81878be6-2fc1-4ba6-b776-5fb962097235', 'eapps-twitter-feed', 'eapps-twitter-feed-source-user', 'eapps-twitter-feed-color-scheme--dark');
  twitterFeedContainer.setAttribute('data-elfsight-app-lazy', '');
  twitterFeedContainer.id = 'eapps-twitter-feed-1';

  const eappsTwitterFeedContainer = document.createElement('div');
  eappsTwitterFeedContainer.classList.add('eapps-twitter-feed-container', 'eapps-twitter-feed-post-x-icon-hide', 'eapps-twitter-feed-post-reply-hide', 'eapps-twitter-feed-post-repost-hide', 'eapps-twitter-feed-post-like-hide', 'eapps-twitter-feed-post-share-button-hide', 'eapps-twitter-feed-small', 'eapps-twitter-feed-hide-header');
  eappsTwitterFeedContainer.setAttribute('eapps-link', 'app');

  const eappsTwitterFeedInner = document.createElement('div');
  eappsTwitterFeedInner.classList.add('eapps-twitter-feed-inner');

  const eappsTwitterFeedPosts = document.createElement('div');
  eappsTwitterFeedPosts.classList.add('eapps-twitter-feed-posts');
  eappsTwitterFeedPosts.setAttribute('eapps-link', 'posts');
  eappsTwitterFeedPosts.style.maxHeight = 'none';

  const eappsTwitterFeedPostsContainer = document.createElement('div');
  eappsTwitterFeedPostsContainer.classList.add('eapps-twitter-feed-posts-container');
  eappsTwitterFeedPostsContainer.setAttribute('eapps-link', 'postsContainer');
  eappsTwitterFeedPostsContainer.style.maxHeight = 'none';

  const eappsTwitterFeedPostsInner = document.createElement('div');
  eappsTwitterFeedPostsInner.classList.add('eapps-twitter-feed-posts-inner', 'shuffle');
  eappsTwitterFeedPostsInner.setAttribute('eapps-link', 'posts');
  eappsTwitterFeedPostsInner.style.cssText = 'position: relative; overflow: hidden; height: 4643.24px; transition: height 100ms cubic-bezier(0.4, 0, 0.2, 1);';

  const storyCardsSlides = document.createElement('div');
  storyCardsSlides.classList.add('slides');

  children.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 11) { // Twitter Feed Item
      const [
        profileBannerCell,
        profileImageCell,
        displayNameCell,
        screenNameCell,
        profileLinkCell,
        postDateCell,
        postTextCell,
        mediaItemsCell, // This is a container field, its items appear as separate rows, so we don't directly use this cell
        postLinkCell,
        repostsCell,
        likesCell,
      ] = cells;

      const item = document.createElement('div');
      item.classList.add('eapps-twitter-feed-posts-item', 'eapps-twitter-feed-posts-item-media-items-1', 'eapps-twitter-feed-posts-item-media-show', 'eapps-twitter-feed-posts-item-show', 'shuffle-item', 'shuffle-item--visible');
      item.style.cssText = 'position: absolute; top: 0px; visibility: visible; will-change: transform; left: 0px; opacity: 1; transition-duration: 100ms; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-property: transform, opacity;';

      const itemInner = document.createElement('div');
      itemInner.classList.add('eapps-twitter-feed-posts-item-inner');

      const userDiv = document.createElement('div');
      userDiv.classList.add('eapps-twitter-feed-posts-item-user');

      const profileLink = document.createElement('a');
      profileLink.rel = 'nofollow';
      profileLink.target = '_blank';
      profileLink.href = profileLinkCell.querySelector('a')?.href || '#';

      const profileImageContainer = document.createElement('div');
      profileImageContainer.classList.add('eapps-twitter-feed-posts-item-user-image-container');
      const profileImage = document.createElement('img');
      profileImage.classList.add('eapps-twitter-feed-posts-item-user-image');
      const profilePicture = profileImageCell.querySelector('picture');
      if (profilePicture) {
        const img = profilePicture.querySelector('img');
        if (img) {
          profileImage.src = img.src;
          profileImage.alt = img.alt;
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          profilePicture.replaceWith(optimizedPic);
        }
      }
      profileLink.append(profileImageContainer);
      profileImageContainer.append(profileImage);

      const userNameDiv = document.createElement('div');
      userNameDiv.classList.add('eapps-twitter-feed-posts-item-user-name');
      const displayNameLink = document.createElement('a');
      displayNameLink.rel = 'nofollow';
      displayNameLink.target = '_blank';
      displayNameLink.href = profileLinkCell.querySelector('a')?.href || '#';
      const displayNameSpan = document.createElement('span');
      displayNameSpan.textContent = displayNameCell.textContent.trim();
      displayNameLink.append(displayNameSpan);
      userNameDiv.append(displayNameLink);

      const screenNameDiv = document.createElement('div');
      screenNameDiv.classList.add('eapps-twitter-feed-posts-item-user-screen-name');
      const screenNameLink = document.createElement('a');
      screenNameLink.rel = 'nofollow';
      screenNameLink.target = '_blank';
      screenNameLink.href = profileLinkCell.querySelector('a')?.href || '#';
      const screenNameSpan = document.createElement('span');
      screenNameSpan.textContent = screenNameCell.textContent.trim();
      screenNameLink.append(screenNameSpan);
      screenNameDiv.append(screenNameLink);

      const postDateSpan = document.createElement('span');
      postDateSpan.classList.add('eapps-twitter-feed-posts-item-user-date');
      postDateSpan.textContent = postDateCell.textContent.trim();
      screenNameDiv.append(postDateSpan);
      userNameDiv.append(screenNameDiv);

      userDiv.append(profileLink, userNameDiv);

      const postTextDiv = document.createElement('div');
      postTextDiv.classList.add('eapps-twitter-feed-posts-item-text');
      postTextDiv.innerHTML = postTextCell.innerHTML;

      const mediaDiv = document.createElement('div');
      mediaDiv.classList.add('eapps-twitter-feed-posts-item-media', 'eapps-twitter-feed-posts-item-media-visible');
      mediaDiv.setAttribute('eapps-link', 'media');
      const mediaItemDiv = document.createElement('div');
      mediaItemDiv.classList.add('eapps-twitter-feed-posts-item-media-item-type-image', 'eapps-twitter-feed-posts-item-media-item');
      const mediaImage = document.createElement('img');
      mediaImage.classList.add('eapps-twitter-feed-posts-item-media-item-image');
      mediaImage.setAttribute('eapps-link', 'picture');
      const mediaPicture = profileBannerCell.querySelector('picture'); // Assuming profileBanner is the media image for the post
      if (mediaPicture) {
        const img = mediaPicture.querySelector('img');
        if (img) {
          mediaImage.src = img.src;
          mediaImage.alt = img.alt;
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          mediaPicture.replaceWith(optimizedPic);
        }
      }
      mediaItemDiv.append(mediaImage);
      mediaDiv.append(mediaItemDiv);

      const actionsDiv = document.createElement('div');
      actionsDiv.classList.add('eapps-twitter-feed-posts-item-actions');

      const repostsLink = document.createElement('a');
      repostsLink.rel = 'nofollow';
      repostsLink.href = postLinkCell.querySelector('a')?.href || '#';
      repostsLink.title = 'Repost';
      repostsLink.classList.add('eapps-twitter-feed-posts-item-actions-item', 'eapps-twitter-feed-posts-item-actions-item-repost');
      const repostsText = document.createElement('div');
      repostsText.classList.add('eapps-twitter-feed-posts-item-actions-item-text');
      repostsText.textContent = repostsCell.textContent.trim();
      repostsLink.append(repostsText);

      const likesLink = document.createElement('a');
      likesLink.rel = 'nofollow';
      likesLink.href = postLinkCell.querySelector('a')?.href || '#';
      likesLink.title = 'Like';
      likesLink.classList.add('eapps-twitter-feed-posts-item-actions-item', 'eapps-twitter-feed-posts-item-actions-item-likes');
      const likesText = document.createElement('div');
      likesText.classList.add('eapps-twitter-feed-posts-item-actions-item-text');
      likesText.textContent = likesCell.textContent.trim();
      likesLink.append(likesText);

      actionsDiv.append(repostsLink, likesLink);

      itemInner.append(userDiv, postTextDiv, mediaDiv, actionsDiv);

      const postItemDate = document.createElement('div');
      postItemDate.classList.add('eapps-twitter-feed-posts-item-date');
      postItemDate.textContent = postDateCell.textContent.trim();
      item.append(itemInner, postItemDate);

      eappsTwitterFeedPostsInner.append(item);
      moveInstrumentation(row, item);
    } else if (cells.length === 5) { // Story Card Item
      const [
        imageCell,
        categoryCell,
        descriptionCell,
        linkCell,
        dateCell,
      ] = cells;

      const wrap = document.createElement('div');
      wrap.classList.add('wrap');

      const imageWrap = document.createElement('div');
      imageWrap.classList.add('image-wrap');
      const img = document.createElement('img');
      img.classList.add('thumb-img', 'img-fluid');
      img.loading = 'lazy';
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const source = picture.querySelector('source');
        const originalImg = picture.querySelector('img');
        if (originalImg) {
          img.src = originalImg.src;
          img.alt = originalImg.alt;
          if (source) {
            img.setAttribute('data-img-horizontal', source.srcset);
            img.setAttribute('data-img-vertical', source.srcset);
          }
          const optimizedPic = createOptimizedPicture(originalImg.src, originalImg.alt, false, [{ width: '750' }]);
          moveInstrumentation(originalImg, optimizedPic.querySelector('img'));
          picture.replaceWith(optimizedPic);
        }
      }
      imageWrap.append(img);

      const contentWrap = document.createElement('div');
      contentWrap.classList.add('content-wrap');

      const category = document.createElement('div');
      category.classList.add('category');
      category.textContent = categoryCell.textContent.trim();

      const text = document.createElement('div');
      text.classList.add('text');
      text.textContent = descriptionCell.textContent.trim();

      const readMoreLink = document.createElement('a');
      readMoreLink.classList.add('btn', 'btn-link');
      readMoreLink.textContent = 'Read more';
      readMoreLink.href = linkCell.querySelector('a')?.href || '#';

      const date = document.createElement('div');
      date.classList.add('date');
      const time = document.createElement('time');
      time.setAttribute('datetime', dateCell.textContent.trim()); // Assuming date is in a parseable format
      time.textContent = dateCell.textContent.trim();
      date.append(time);

      contentWrap.append(category, text, readMoreLink, date);
      wrap.append(imageWrap, contentWrap);

      const storyCardSlideItem = document.createElement('div');
      storyCardSlideItem.classList.add('slides'); // This class is correct per original HTML for individual story card slides
      storyCardSlideItem.append(wrap);
      storyCardsSlides.append(storyCardSlideItem);
      moveInstrumentation(row, storyCardSlideItem);
    }
  });

  eappsTwitterFeedPostsContainer.append(eappsTwitterFeedPostsInner);
  eappsTwitterFeedPosts.append(eappsTwitterFeedPostsContainer);
  eappsTwitterFeedInner.append(eappsTwitterFeedPosts);
  eappsTwitterFeedContainer.append(eappsTwitterFeedInner);
  twitterSlides.append(twitterFeedContainer);

  flickitySliderMobileWrap.append(twitterSlides, storyCardsSlides);
  container.append(flickitySliderMobileWrap);

  block.innerHTML = '';
  block.classList.add('latest-stories', 'home-stories');
  block.prepend(sectionHeader, container);
}
