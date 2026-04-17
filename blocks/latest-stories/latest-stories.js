import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const sectionHeaderRow = children.shift(); // First row is always the section heading

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  moveInstrumentation(sectionHeaderRow.firstElementChild, heading);
  heading.textContent = sectionHeaderRow.firstElementChild.textContent.trim();
  sectionHeader.append(heading);

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickitySliderWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const twitterFeedSlides = document.createElement('div');
  twitterFeedSlides.classList.add('slides');

  const twitterFeedItems = children.filter((row) => [...row.children].length === 9);
  const storyCardItems = children.filter((row) => [...row.children].length === 5);

  if (twitterFeedItems.length > 0) {
    const twitterFeedContainer = document.createElement('div');
    twitterFeedContainer.classList.add('elfsight-app-81878be6-2fc1-4ba6-b776-5fb962097235', 'eapps-twitter-feed', 'eapps-twitter-feed-source-user', 'eapps-twitter-feed-color-scheme--dark');
    twitterFeedContainer.setAttribute('data-elfsight-app-lazy', '');
    twitterFeedContainer.id = 'eapps-twitter-feed-1';

    const twitterFeedInner = document.createElement('div');
    twitterFeedInner.classList.add('eapps-twitter-feed-container', 'eapps-twitter-feed-post-x-icon-hide', 'eapps-twitter-feed-post-reply-hide', 'eapps-twitter-feed-post-repost-hide', 'eapps-twitter-feed-post-like-hide', 'eapps-twitter-feed-post-share-button-hide', 'eapps-twitter-feed-small', 'eapps-twitter-feed-hide-header');
    twitterFeedInner.setAttribute('eapps-link', 'app');

    const twitterFeedHeader = document.createElement('div');
    twitterFeedHeader.classList.add('eapps-twitter-feed-header', 'eapps-twitter-feed-header-show');
    twitterFeedHeader.setAttribute('eapps-link', 'header');

    const twitterFeedHeaderInner = document.createElement('div');
    twitterFeedHeaderInner.classList.add('eapps-twitter-feed-header-inner');

    // Destructure cells for the first twitterFeedItem to get header data
    const [bannerImageCell, profileImageCell, userNameCell, screenNameCell, userProfileLinkCell, postsCountCell, followingCountCell, followersCountCell] = [...twitterFeedItems[0].children];

    if (bannerImageCell) {
      const bannerContainer = document.createElement('div');
      bannerContainer.classList.add('eapps-twitter-feed-header-banner-container');
      const bannerImg = bannerImageCell.querySelector('picture > img');
      if (bannerImg) {
        const optimizedBannerPic = createOptimizedPicture(bannerImg.src, bannerImg.alt, false, [{ width: '750' }]);
        moveInstrumentation(bannerImg.closest('picture'), optimizedBannerPic.querySelector('img'));
        bannerImg.closest('picture').replaceWith(optimizedBannerPic);
        optimizedBannerPic.querySelector('img').classList.add('eapps-twitter-feed-header-banner');
        bannerContainer.append(optimizedBannerPic);
      }
      twitterFeedHeaderInner.append(bannerContainer);
    }

    const userDiv = document.createElement('div');
    userDiv.classList.add('eapps-twitter-feed-header-user');
    const userLink = document.createElement('a');
    userLink.rel = 'nofollow';
    userLink.target = '_blank';
    userLink.classList.add('eapps-twitter-feed-header-user-image-container');
    if (userProfileLinkCell) {
      const link = userProfileLinkCell.querySelector('a');
      if (link) userLink.href = link.href;
    }

    if (profileImageCell) {
      const profileImg = profileImageCell.querySelector('picture > img');
      if (profileImg) {
        const optimizedProfilePic = createOptimizedPicture(profileImg.src, profileImg.alt, false, [{ width: '750' }]);
        moveInstrumentation(profileImg.closest('picture'), optimizedProfilePic.querySelector('img'));
        profileImg.closest('picture').replaceWith(optimizedProfilePic);
        optimizedProfilePic.querySelector('img').classList.add('eapps-twitter-feed-header-user-image');
        userLink.append(optimizedProfilePic);
      }
    }
    userDiv.append(userLink);

    const userInfo = document.createElement('div');
    userInfo.classList.add('eapps-twitter-feed-header-user-info');
    const nameWrapper = document.createElement('div');
    nameWrapper.classList.add('eapps-twitter-feed-header-user-info-name-wrapper');

    const nameDiv = document.createElement('div');
    nameDiv.classList.add('eapps-twitter-feed-header-user-info-name');
    const nameLink = document.createElement('a');
    nameLink.rel = 'nofollow';
    nameLink.target = '_blank';
    if (userProfileLinkCell) {
      const link = userProfileLinkCell.querySelector('a');
      if (link) nameLink.href = link.href;
    }
    nameLink.textContent = userNameCell ? userNameCell.textContent.trim() : '';
    nameDiv.append(nameLink);

    const screenNameDiv = document.createElement('div');
    screenNameDiv.classList.add('eapps-twitter-feed-header-user-info-screen-name');
    const screenNameLink = document.createElement('a');
    screenNameLink.rel = 'nofollow';
    screenNameLink.target = '_blank';
    if (userProfileLinkCell) {
      const link = userProfileLinkCell.querySelector('a');
      if (link) screenNameLink.href = link.href;
    }
    screenNameLink.textContent = screenNameCell ? screenNameCell.textContent.trim() : '';
    screenNameDiv.append(screenNameLink);

    nameWrapper.append(nameDiv, screenNameDiv);
    userInfo.append(nameWrapper);
    userDiv.append(userInfo);
    twitterFeedHeaderInner.append(userDiv);

    const statsDiv = document.createElement('div');
    statsDiv.classList.add('eapps-twitter-feed-header-statistics');

    const createStatItem = (name, count) => {
      const item = document.createElement('div');
      item.classList.add(`eapps-twitter-feed-header-statistics-${name.toLowerCase()}`, 'eapps-twitter-feed-header-statistics-item');
      const itemName = document.createElement('div');
      itemName.classList.add('eapps-twitter-feed-header-statistics-item-name');
      itemName.textContent = name;
      const itemData = document.createElement('div');
      itemData.classList.add('eapps-twitter-feed-header-statistics-item-data');
      itemData.textContent = count;
      item.append(itemName, itemData);
      return item;
    };

    statsDiv.append(
      createStatItem('Posts', postsCountCell ? postsCountCell.textContent.trim() : ''),
      createStatItem('Following', followingCountCell ? followingCountCell.textContent.trim() : ''),
      createStatItem('Followers', followersCountCell ? followersCountCell.textContent.trim() : ''),
    );
    twitterFeedHeaderInner.append(statsDiv);
    twitterFeedHeader.append(twitterFeedHeaderInner);
    twitterFeedInner.append(twitterFeedHeader);

    const twitterPosts = document.createElement('div');
    twitterPosts.classList.add('eapps-twitter-feed-posts');
    twitterPosts.setAttribute('eapps-link', 'posts');
    twitterPosts.style.maxHeight = 'none';

    const twitterPostsContainer = document.createElement('div');
    twitterPostsContainer.classList.add('eapps-twitter-feed-posts-container');
    twitterPostsContainer.setAttribute('eapps-link', 'postsContainer');
    twitterPostsContainer.style.maxHeight = 'none';

    const twitterPostsInner = document.createElement('div');
    twitterPostsInner.classList.add('eapps-twitter-feed-posts-inner', 'shuffle');
    twitterPostsInner.setAttribute('eapps-link', 'posts');
    twitterPostsInner.style.cssText = 'position: relative; overflow: hidden; height: 4439.14px; transition: height 100ms cubic-bezier(0.4, 0, 0.2, 1); transition-property: transform, opacity;';

    twitterFeedItems.forEach((row) => {
      const [
        postBannerImageCell,
        postProfileImageCell,
        postUserNameCell,
        postScreenNameCell,
        postUserProfileLinkCell,
        postPostsCountCell,
        postFollowingCountCell,
        postFollowersCountCell,
        tweetTextCell,
      ] = [...row.children];

      const postItem = document.createElement('div');
      postItem.classList.add('eapps-twitter-feed-posts-item', 'eapps-twitter-feed-posts-item-media-items-1', 'eapps-twitter-feed-posts-item-media-show', 'eapps-twitter-feed-posts-item-show', 'shuffle-item', 'shuffle-item--visible');

      const postItemInner = document.createElement('div');
      postItemInner.classList.add('eapps-twitter-feed-posts-item-inner');

      const postUserDiv = document.createElement('div');
      postUserDiv.classList.add('eapps-twitter-feed-posts-item-user');

      const postUserLink = document.createElement('a');
      postUserLink.rel = 'nofollow';
      postUserLink.target = '_blank';
      const postUserLinkEl = postUserProfileLinkCell.querySelector('a');
      if (postUserLinkEl) postUserLink.href = postUserLinkEl.href;

      const postUserImageContainer = document.createElement('div');
      postUserImageContainer.classList.add('eapps-twitter-feed-posts-item-user-image-container');
      const postProfileImage = postProfileImageCell.querySelector('picture > img');
      if (postProfileImage) {
        const optimizedPostProfilePic = createOptimizedPicture(postProfileImage.src, postProfileImage.alt, false, [{ width: '750' }]);
        moveInstrumentation(postProfileImage.closest('picture'), optimizedPostProfilePic.querySelector('img'));
        postProfileImage.closest('picture').replaceWith(optimizedPostProfilePic);
        optimizedPostProfilePic.querySelector('img').classList.add('eapps-twitter-feed-posts-item-user-image');
        postUserImageContainer.append(optimizedPostProfilePic);
      }
      postUserLink.append(postUserImageContainer);
      postUserDiv.append(postUserLink);

      const postUserNameDiv = document.createElement('div');
      postUserNameDiv.classList.add('eapps-twitter-feed-posts-item-user-name');
      const postUserNameLink = document.createElement('a');
      postUserNameLink.rel = 'nofollow';
      postUserNameLink.target = '_blank';
      if (postUserLinkEl) postUserNameLink.href = postUserLinkEl.href;
      const postUserNameSpan = document.createElement('span');
      postUserNameSpan.textContent = postUserNameCell.textContent.trim();
      postUserNameLink.append(postUserNameSpan);
      postUserNameDiv.append(postUserNameLink);

      const postUserScreenNameDiv = document.createElement('div');
      postUserScreenNameDiv.classList.add('eapps-twitter-feed-posts-item-user-screen-name');
      const postUserScreenNameLink = document.createElement('a');
      postUserScreenNameLink.rel = 'nofollow';
      postUserScreenNameLink.target = '_blank';
      if (postUserLinkEl) postUserScreenNameLink.href = postUserLinkEl.href;
      const postUserScreenNameSpan = document.createElement('span');
      postUserScreenNameSpan.textContent = postScreenNameCell.textContent.trim();
      postUserScreenNameLink.append(postUserScreenNameSpan);
      postUserScreenNameDiv.append(postUserScreenNameLink);

      postUserNameDiv.append(postUserScreenNameDiv);
      postUserDiv.append(postUserNameDiv);
      postItemInner.append(postUserDiv);

      const tweetTextDiv = document.createElement('div');
      tweetTextDiv.classList.add('eapps-twitter-feed-posts-item-text');
      tweetTextDiv.innerHTML = tweetTextCell.innerHTML; // Tweets field is richtext

      postItemInner.append(tweetTextDiv);

      const postItemDate = document.createElement('div');
      postItemDate.classList.add('eapps-twitter-feed-posts-item-date');
      // Assuming tweetDate is not directly available in the current block structure for individual tweets,
      // but if it were, it would be read from a dedicated cell.
      // For now, we'll leave it empty or add a placeholder.
      postItemDate.textContent = 'Apr 15'; // Placeholder, actual date would come from tweet-item model

      postItemInner.append(postItemDate);
      postItem.append(postItemInner);
      twitterPostsInner.append(postItem);
      moveInstrumentation(row, postItem); // Move instrumentation from original row to new postItem
    });

    twitterPostsContainer.append(twitterPostsInner);
    twitterPosts.append(twitterPostsContainer);
    twitterFeedInner.append(twitterPosts);
    twitterFeedContainer.append(twitterFeedInner);
    twitterFeedSlides.append(twitterFeedContainer);
  }

  const storySlides = document.createElement('div');
  storySlides.classList.add('slides');

  storyCardItems.forEach((row) => {
    const [imageCell, categoryCell, textCell, linkCell, dateCell] = [...row.children];

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');
    const image = imageCell.querySelector('picture > img');
    if (image) {
      const optimizedPic = createOptimizedPicture(image.src, image.alt, false, [{ width: '750' }]);
      moveInstrumentation(image.closest('picture'), optimizedPic.querySelector('img'));
      image.closest('picture').replaceWith(optimizedPic);
      optimizedPic.querySelector('img').classList.add('thumb-img', 'img-fluid');
      imageWrap.append(optimizedPic);
    }
    wrap.append(imageWrap);

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const category = document.createElement('div');
    category.classList.add('category');
    category.textContent = categoryCell.textContent.trim();
    contentWrap.append(category);

    const text = document.createElement('div');
    text.classList.add('text');
    text.textContent = textCell.textContent.trim();
    contentWrap.append(text);

    const readMoreLink = document.createElement('a');
    readMoreLink.classList.add('btn', 'btn-link');
    const linkEl = linkCell.querySelector('a');
    if (linkEl) readMoreLink.href = linkEl.href;
    readMoreLink.textContent = 'Read more';
    contentWrap.append(readMoreLink);

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    const time = document.createElement('time');
    time.setAttribute('datetime', dateCell.textContent.trim()); // Assuming date is in a parseable format
    time.textContent = dateCell.textContent.trim();
    dateDiv.append(time);
    contentWrap.append(dateDiv);

    wrap.append(contentWrap);
    storySlides.append(wrap);
    moveInstrumentation(row, wrap); // Move instrumentation from original row to new wrap
  });

  flickitySliderWrap.append(twitterFeedSlides, storySlides);
  container.append(flickitySliderWrap);

  block.innerHTML = ''; // Clear the block
  block.append(sectionHeader, container);
  block.classList.add('grey-bg', 'latest-stories', 'home-stories');
}
