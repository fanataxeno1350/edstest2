import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const headingRow = children[0];
  const itemRows = children.slice(1);

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');
  moveInstrumentation(block, section);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.textContent.trim();
  moveInstrumentation(headingRow, heading);
  sectionHeader.appendChild(heading);
  section.appendChild(sectionHeader);

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');

  const flickitySlider = document.createElement('div');
  flickitySlider.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickitySlider.setAttribute(
    'data-flickity',
    '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }',
  );

  const twitterFeedItems = itemRows.filter((row) => row.children.length === 9);
  const storyItems = itemRows.filter((row) => row.children.length === 5);

  if (twitterFeedItems.length > 0) {
    const twitterSlides = document.createElement('div');
    twitterSlides.classList.add('slides');

    twitterFeedItems.forEach((row) => {
      const [
        bannerImageCell,
        profileImageCell,
        profileNameCell,
        profileHandleCell,
        profileLinkCell,
        postsCountCell,
        followingCountCell,
        followersCountCell,
        tweetsCell,
      ] = [...row.children];

      const twitterFeedContainer = document.createElement('div');
      twitterFeedContainer.classList.add(
        'elfsight-app-81878be6-2fc1-4ba6-b776-5fb962097235',
        'eapps-twitter-feed',
        'eapps-twitter-feed-source-user',
        'eapps-twitter-feed-color-scheme--dark',
      );
      twitterFeedContainer.setAttribute('data-elfsight-app-lazy', '');
      twitterFeedContainer.id = 'eapps-twitter-feed-1';

      const innerContainer = document.createElement('div');
      innerContainer.classList.add(
        'eapps-twitter-feed-container',
        'eapps-twitter-feed-post-x-icon-hide',
        'eapps-twitter-feed-post-reply-hide',
        'eapps-twitter-feed-post-repost-hide',
        'eapps-twitter-feed-post-like-hide',
        'eapps-twitter-feed-post-share-button-hide',
        'eapps-twitter-feed-small',
        'eapps-twitter-feed-hide-header',
      );
      innerContainer.setAttribute('eapps-link', 'app');

      const header = document.createElement('div');
      header.classList.add('eapps-twitter-feed-header', 'eapps-twitter-feed-header-show');
      header.setAttribute('eapps-link', 'header');

      const headerInner = document.createElement('div');
      headerInner.classList.add('eapps-twitter-feed-header-inner');

      const bannerContainer = document.createElement('div');
      bannerContainer.classList.add('eapps-twitter-feed-header-banner-container');
      const bannerImg = bannerImageCell.querySelector('img');
      if (bannerImg) {
        const bannerPicture = createOptimizedPicture(bannerImg.src, bannerImg.alt, false, [{ width: '750' }]);
        moveInstrumentation(bannerImg.closest('picture'), bannerPicture.querySelector('img'));
        bannerPicture.querySelector('img').classList.add('eapps-twitter-feed-header-banner');
        bannerContainer.appendChild(bannerPicture);
      }

      const userHeader = document.createElement('div');
      userHeader.classList.add('eapps-twitter-feed-header-user');

      const profileLink = profileLinkCell.querySelector('a'); // Correctly reading aem-content type
      const userImageLink = document.createElement('a');
      userImageLink.rel = 'nofollow';
      userImageLink.href = profileLink?.href || '#';
      userImageLink.target = '_blank';
      userImageLink.classList.add('eapps-twitter-feed-header-user-image-container');

      const profileImg = profileImageCell.querySelector('img');
      if (profileImg) {
        const profilePicture = createOptimizedPicture(profileImg.src, profileImg.alt, false, [{ width: '750' }]);
        moveInstrumentation(profileImg.closest('picture'), profilePicture.querySelector('img'));
        profilePicture.querySelector('img').classList.add('eapps-twitter-feed-header-user-image');
        userImageLink.appendChild(profilePicture);
      }
      userHeader.appendChild(userImageLink);

      const userInfo = document.createElement('div');
      userInfo.classList.add('eapps-twitter-feed-header-user-info');

      const nameWrapper = document.createElement('div');
      nameWrapper.classList.add('eapps-twitter-feed-header-user-info-name-wrapper');

      const nameDiv = document.createElement('div');
      nameDiv.classList.add('eapps-twitter-feed-header-user-info-name');
      const nameLink = document.createElement('a');
      nameLink.rel = 'nofollow';
      nameLink.href = profileLink?.href || '#';
      nameLink.title = `Visit ${profileNameCell.textContent.trim()} on X (formerly Twitter)`;
      nameLink.target = '_blank';
      nameLink.textContent = profileNameCell.textContent.trim();
      nameDiv.appendChild(nameLink);
      nameWrapper.appendChild(nameDiv);

      const screenNameDiv = document.createElement('div');
      screenNameDiv.classList.add('eapps-twitter-feed-header-user-info-screen-name');
      const screenNameLink = document.createElement('a');
      screenNameLink.rel = 'nofollow';
      screenNameLink.href = profileLink?.href || '#';
      screenNameLink.target = '_blank';
      screenNameLink.textContent = profileHandleCell.textContent.trim();
      screenNameDiv.appendChild(screenNameLink);
      nameWrapper.appendChild(screenNameDiv);
      userInfo.appendChild(nameWrapper);

      const followLink = document.createElement('a');
      followLink.rel = 'nofollow';
      followLink.href = `https://x.com/intent/follow?screen_name=${profileHandleCell.textContent.trim().replace('@', '')}`;
      followLink.target = '_blank';
      followLink.classList.add('eapps-twitter-feed-header-user-info-follow');
      const followLabel = document.createElement('span');
      followLabel.classList.add('eapps-twitter-feed-header-user-info-follow-label');
      followLabel.textContent = 'Follow';
      followLink.appendChild(followLabel);
      userInfo.appendChild(followLink);
      userHeader.appendChild(userInfo);
      headerInner.appendChild(bannerContainer);
      headerInner.appendChild(userHeader);

      const statistics = document.createElement('div');
      statistics.classList.add('eapps-twitter-feed-header-statistics');

      const createStatItem = (name, data) => {
        const item = document.createElement('div');
        item.classList.add('eapps-twitter-feed-header-statistics-item');
        const itemName = document.createElement('div');
        itemName.classList.add('eapps-twitter-feed-header-statistics-item-name');
        itemName.textContent = name;
        const itemData = document.createElement('div');
        itemData.classList.add('eapps-twitter-feed-header-statistics-item-data');
        itemData.textContent = data;
        item.appendChild(itemName);
        item.appendChild(itemData);
        return item;
      };

      statistics.appendChild(createStatItem('Posts', postsCountCell.textContent.trim()));
      statistics.appendChild(createStatItem('Following', followingCountCell.textContent.trim()));
      statistics.appendChild(createStatItem('Followers', followersCountCell.textContent.trim()));
      headerInner.appendChild(statistics);
      header.appendChild(headerInner);
      innerContainer.appendChild(header);

      const postsDiv = document.createElement('div');
      postsDiv.classList.add('eapps-twitter-feed-posts');
      postsDiv.setAttribute('eapps-link', 'posts');
      postsDiv.style.maxHeight = 'none';

      const postsContainer = document.createElement('div');
      postsContainer.classList.add('eapps-twitter-feed-posts-container');
      postsContainer.setAttribute('eapps-link', 'postsContainer');
      postsContainer.style.maxHeight = 'none';

      const postsInner = document.createElement('div');
      postsInner.classList.add('eapps-twitter-feed-posts-inner', 'shuffle');
      postsInner.setAttribute('eapps-link', 'posts');
      postsInner.style.cssText = 'position: relative; overflow: hidden; height: auto; transition: height 100ms cubic-bezier(0.4, 0, 0.2, 1);';

      // Tweets are nested within the 'tweets' cell, not separate rows.
      // The EDS structure shows 'tweets' as a container field, but the original HTML
      // implies it's rendered as a single cell containing text "Tweets value".
      // Assuming 'tweets' cell contains the actual tweet content if it were richtext.
      // For now, we'll just add the tweetsCell content directly as a placeholder
      // since the provided EDS structure for 'tweets' is a simple text cell.
      // If 'tweets' contained nested tweet-item rows, we would iterate those.
      const tweetItem = document.createElement('div');
      tweetItem.classList.add('eapps-twitter-feed-posts-item', 'eapps-twitter-feed-posts-item-media-items-1', 'eapps-twitter-feed-posts-item-media-show', 'eapps-twitter-feed-posts-item-show', 'shuffle-item', 'shuffle-item--visible');
      tweetItem.style.cssText = 'position: relative; top: 0px; visibility: visible; will-change: transform; left: 0px; opacity: 1; transition-duration: 100ms; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-property: transform, opacity;';

      const tweetItemInner = document.createElement('div');
      tweetItemInner.classList.add('eapps-twitter-feed-posts-item-inner');

      const tweetItemUser = document.createElement('div');
      tweetItemUser.classList.add('eapps-twitter-feed-posts-item-user');
      const tweetUserLink = document.createElement('a');
      tweetUserLink.rel = 'nofollow';
      tweetUserLink.target = '_blank';
      tweetUserLink.href = profileLink?.href || '#';
      const tweetUserImageContainer = document.createElement('div');
      tweetUserImageContainer.classList.add('eapps-twitter-feed-posts-item-user-image-container');
      if (profileImg) {
        const tweetProfilePicture = createOptimizedPicture(profileImg.src, profileImg.alt, false, [{ width: '750' }]);
        moveInstrumentation(profileImg.closest('picture'), tweetProfilePicture.querySelector('img'));
        tweetProfilePicture.querySelector('img').classList.add('eapps-twitter-feed-posts-item-user-image');
        tweetUserImageContainer.appendChild(tweetProfilePicture);
      }
      tweetUserLink.appendChild(tweetUserImageContainer);
      tweetItemUser.appendChild(tweetUserLink);

      const tweetUserName = document.createElement('div');
      tweetUserName.classList.add('eapps-twitter-feed-posts-item-user-name');
      const tweetUserNameLink = document.createElement('a');
      tweetUserNameLink.rel = 'nofollow';
      tweetUserNameLink.target = '_blank';
      tweetUserNameLink.href = profileLink?.href || '#';
      const tweetUserNameSpan = document.createElement('span');
      tweetUserNameSpan.textContent = profileNameCell.textContent.trim();
      tweetUserNameLink.appendChild(tweetUserNameSpan);
      tweetUserName.appendChild(tweetUserNameLink);

      const tweetUserScreenName = document.createElement('div');
      tweetUserScreenName.classList.add('eapps-twitter-feed-posts-item-user-screen-name');
      const tweetUserScreenNameLink = document.createElement('a');
      tweetUserScreenNameLink.rel = 'nofollow';
      tweetUserScreenNameLink.target = '_blank';
      tweetUserScreenNameLink.href = profileLink?.href || '#';
      const tweetUserScreenNameSpan = document.createElement('span');
      tweetUserScreenNameSpan.textContent = profileHandleCell.textContent.trim();
      tweetUserScreenNameLink.appendChild(tweetUserScreenNameSpan);
      tweetUserScreenName.appendChild(tweetUserScreenNameLink);
      tweetUserName.appendChild(tweetUserScreenName);
      tweetItemUser.appendChild(tweetUserName);
      tweetItemInner.appendChild(tweetItemUser);

      const tweetTextDiv = document.createElement('div');
      tweetTextDiv.classList.add('eapps-twitter-feed-posts-item-text');
      tweetTextDiv.innerHTML = tweetsCell.innerHTML; // Assuming tweets cell contains rich text

      tweetItemInner.appendChild(tweetTextDiv);
      tweetItem.appendChild(tweetItemInner);
      postsInner.appendChild(tweetItem);

      postsContainer.appendChild(postsInner);
      postsDiv.appendChild(postsContainer);
      innerContainer.appendChild(postsDiv);

      moveInstrumentation(row, twitterFeedContainer);
      twitterFeedContainer.appendChild(innerContainer);
      twitterSlides.appendChild(twitterFeedContainer);
    });
    flickitySlider.appendChild(twitterSlides);
  }

  if (storyItems.length > 0) {
    storyItems.forEach((row) => {
      const [imageCell, categoryCell, textCell, linkCell, dateCell] = [...row.children];

      const slide = document.createElement('div');
      slide.classList.add('slides');

      const wrap = document.createElement('div');
      wrap.classList.add('wrap');

      const imageWrap = document.createElement('div');
      imageWrap.classList.add('image-wrap');
      const img = imageCell.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
          { width: '750' },
        ]);
        moveInstrumentation(img.closest('picture'), optimizedPic.querySelector('img'));
        optimizedPic.querySelector('img').classList.add('thumb-img', 'img-fluid');
        imageWrap.appendChild(optimizedPic);
      }
      wrap.appendChild(imageWrap);

      const contentWrap = document.createElement('div');
      contentWrap.classList.add('content-wrap');

      const category = document.createElement('div');
      category.classList.add('category');
      category.textContent = categoryCell.textContent.trim();
      contentWrap.appendChild(category);

      const text = document.createElement('div');
      text.classList.add('text');
      text.textContent = textCell.textContent.trim();
      contentWrap.appendChild(text);

      const link = document.createElement('a');
      link.classList.add('btn', 'btn-link');
      const foundLink = linkCell.querySelector('a'); // Correctly reading aem-content type
      if (foundLink) {
        link.href = foundLink.href;
      }
      link.textContent = 'Read more';
      moveInstrumentation(linkCell, link);
      contentWrap.appendChild(link);

      const date = document.createElement('div');
      date.classList.add('date');
      const time = document.createElement('time');
      time.setAttribute('datetime', dateCell.textContent.trim()); // Assuming date cell contains valid datetime string
      time.textContent = dateCell.textContent.trim();
      date.appendChild(time);
      contentWrap.appendChild(date);

      wrap.appendChild(contentWrap);
      moveInstrumentation(row, wrap);
      slide.appendChild(wrap);
      flickitySlider.appendChild(slide);
    });
  }

  container.appendChild(flickitySlider);
  section.appendChild(container);
  block.replaceWith(section);
}
