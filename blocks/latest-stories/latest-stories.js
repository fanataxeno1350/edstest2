import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...itemRows] = [...block.children];

  // Section wrapper
  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');
  moveInstrumentation(block, section);

  // Section header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.firstElementChild.textContent.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

  // Container for stories and twitter feed
  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');

  const flickityWrap = document.createElement('div');
  flickityWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickityWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('slides');

  const twitterFeedItems = itemRows.filter((row) => [...row.children].length === 10);
  const storyItems = itemRows.filter((row) => [...row.children].length === 5);

  // Twitter Feed
  if (twitterFeedItems.length > 0) {
    const twitterFeedWrapper = document.createElement('div');
    twitterFeedWrapper.classList.add('elfsight-app-81878be6-2fc1-4ba6-b776-5fb962097235', 'eapps-twitter-feed', 'eapps-twitter-feed-source-user', 'eapps-twitter-feed-color-scheme--dark');
    twitterFeedWrapper.setAttribute('data-elfsight-app-lazy', '');
    twitterFeedWrapper.id = 'eapps-twitter-feed-1';

    const feedContainer = document.createElement('div');
    feedContainer.classList.add('eapps-twitter-feed-container', 'eapps-twitter-feed-post-x-icon-hide', 'eapps-twitter-feed-post-reply-hide', 'eapps-twitter-feed-post-repost-hide', 'eapps-twitter-feed-post-like-hide', 'eapps-twitter-feed-post-share-button-hide', 'eapps-twitter-feed-small', 'eapps-twitter-feed-hide-header');
    feedContainer.setAttribute('eapps-link', 'app');

    const feedInner = document.createElement('div');
    feedInner.classList.add('eapps-twitter-feed-inner');

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
    postsInner.style.cssText = 'position: relative; overflow: hidden; height: 4643.24px; transition: height 100ms cubic-bezier(0.4, 0, 0.2, 1);';

    twitterFeedItems.forEach((row) => {
      const [userImageCell, userNameCell, userScreenNameCell, isVerifiedCell, tweetLinkCell, tweetTextCell, mediaCell, repostCountCell, likeCountCell, tweetDateCell] = [...row.children];

      const postItem = document.createElement('div');
      postItem.classList.add('eapps-twitter-feed-posts-item', 'eapps-twitter-feed-posts-item-media-items-1', 'eapps-twitter-feed-posts-item-media-show', 'eapps-twitter-feed-posts-item-show', 'shuffle-item', 'shuffle-item--visible');
      postItem.style.cssText = 'position: absolute; top: 0px; visibility: visible; will-change: transform; left: 0px; opacity: 1; transition-duration: 100ms; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-property: transform, opacity;';
      moveInstrumentation(row, postItem);

      const postItemInner = document.createElement('div');
      postItemInner.classList.add('eapps-twitter-feed-posts-item-inner');

      const userDiv = document.createElement('div');
      userDiv.classList.add('eapps-twitter-feed-posts-item-user');

      const tweetLinkAnchor = tweetLinkCell.querySelector('a');
      const tweetHref = tweetLinkAnchor ? tweetLinkAnchor.href : '#';
      const tweetId = tweetHref.split('/').pop(); // Extract tweet ID from URL

      const userLink = document.createElement('a');
      userLink.rel = 'nofollow';
      userLink.target = '_blank';
      userLink.href = tweetHref;

      const userImageContainer = document.createElement('div');
      userImageContainer.classList.add('eapps-twitter-feed-posts-item-user-image-container');
      const userImage = userImageCell.querySelector('img');
      if (userImage) {
        const userImgEl = document.createElement('img');
        userImgEl.classList.add('eapps-twitter-feed-posts-item-user-image');
        userImgEl.src = userImage.src;
        userImgEl.alt = userImage.alt;
        userImageContainer.append(userImgEl);
      }
      userLink.append(userImageContainer);
      userDiv.append(userLink);

      const userNameDiv = document.createElement('div');
      userNameDiv.classList.add('eapps-twitter-feed-posts-item-user-name');
      const userNameLink = document.createElement('a');
      userNameLink.rel = 'nofollow';
      userNameLink.target = '_blank';
      userNameLink.href = tweetHref;
      const userNameSpan = document.createElement('span');
      userNameSpan.textContent = userNameCell.textContent.trim();
      userNameLink.append(userNameSpan);

      if (isVerifiedCell.textContent.trim() === 'true') {
        const verifiedSpan = document.createElement('span');
        verifiedSpan.classList.add('eapps-twitter-feed-posts-item-user-name-verified');
        verifiedSpan.title = 'Verified account';
        const verifiedImg = document.createElement('img');
        verifiedImg.alt = 'svg file';
        // The original HTML uses a specific SVG for verified icon, but we should not hardcode paths.
        // If the model does not provide a field for this icon, we cannot render it.
        // For now, we'll leave it as a placeholder.
        verifiedSpan.append(verifiedImg); // No direct source in block for this SVG
        userNameLink.append(verifiedSpan);
      }
      userNameDiv.append(userNameLink);

      const userScreenNameDiv = document.createElement('div');
      userScreenNameDiv.classList.add('eapps-twitter-feed-posts-item-user-screen-name');
      const userScreenNameLink = document.createElement('a');
      userScreenNameLink.rel = 'nofollow';
      userScreenNameLink.target = '_blank';
      userScreenNameLink.href = tweetHref;
      userScreenNameLink.textContent = userScreenNameCell.textContent.trim();
      userScreenNameDiv.append(userScreenNameLink);

      const userDateSpan = document.createElement('span');
      userDateSpan.classList.add('eapps-twitter-feed-posts-item-user-date');
      userDateSpan.textContent = tweetDateCell.textContent.trim();
      userScreenNameDiv.append(userDateSpan);

      userNameDiv.append(userScreenNameDiv);
      userDiv.append(userNameDiv);

      const userPostDiv = document.createElement('div');
      userPostDiv.classList.add('eapps-twitter-feed-posts-item-user-post');
      const userPostLink = document.createElement('a');
      userPostLink.rel = 'nofollow';
      userPostLink.href = tweetHref;
      userPostLink.target = '_blank';
      userPostLink.title = 'View on X';
      const userPostImg = document.createElement('img');
      userPostImg.alt = 'svg file';
      // No direct source in block for this SVG
      userPostLink.append(userPostImg);
      userPostDiv.append(userPostLink);
      userDiv.append(userPostDiv);
      postItemInner.append(userDiv);

      const tweetTextDiv = document.createElement('div');
      tweetTextDiv.classList.add('eapps-twitter-feed-posts-item-text');
      tweetTextDiv.innerHTML = tweetTextCell.innerHTML;
      postItemInner.append(tweetTextDiv);

      const tweetMediaDiv = document.createElement('div');
      tweetMediaDiv.classList.add('eapps-twitter-feed-posts-item-media', 'eapps-twitter-feed-posts-item-media-visible');
      tweetMediaDiv.setAttribute('eapps-link', 'media');

      // Assuming media cell might contain an image directly or as a child of a div
      const mediaImage = mediaCell.querySelector('picture > img');
      if (mediaImage) {
        const mediaItemDiv = document.createElement('div');
        mediaItemDiv.classList.add('eapps-twitter-feed-posts-item-media-item-type-image', 'eapps-twitter-feed-posts-item-media-item');
        const mediaImgEl = document.createElement('img');
        mediaImgEl.classList.add('eapps-twitter-feed-posts-item-media-item-image');
        mediaImgEl.setAttribute('eapps-link', 'picture');
        mediaImgEl.src = mediaImage.src;
        mediaImgEl.alt = mediaImage.alt;
        mediaItemDiv.append(mediaImgEl);
        tweetMediaDiv.append(mediaItemDiv);
      }
      postItemInner.append(tweetMediaDiv);

      const actionsDiv = document.createElement('div');
      actionsDiv.classList.add('eapps-twitter-feed-posts-item-actions');

      const repostLink = document.createElement('a');
      repostLink.rel = 'nofollow';
      repostLink.href = `https://x.com/intent/retweet?tweet_id=${tweetId}&related=${userNameCell.textContent.trim()}`;
      repostLink.title = 'Repost';
      repostLink.classList.add('eapps-twitter-feed-posts-item-actions-item', 'eapps-twitter-feed-posts-item-actions-item-repost');
      const repostIconDiv = document.createElement('div');
      repostIconDiv.classList.add('eapps-twitter-feed-posts-item-actions-item-icon');
      const repostImg = document.createElement('img');
      repostImg.alt = 'svg file';
      repostIconDiv.append(repostImg); // No direct source in block for this SVG
      repostLink.append(repostIconDiv);
      const repostTextDiv = document.createElement('div');
      repostTextDiv.classList.add('eapps-twitter-feed-posts-item-actions-item-text');
      repostTextDiv.textContent = repostCountCell.textContent.trim();
      repostLink.append(repostTextDiv);
      actionsDiv.append(repostLink);

      const likeLink = document.createElement('a');
      likeLink.rel = 'nofollow';
      likeLink.href = `https://x.com/intent/like?tweet_id=${tweetId}&related=${userNameCell.textContent.trim()}`;
      likeLink.title = 'Like';
      likeLink.classList.add('eapps-twitter-feed-posts-item-actions-item', 'eapps-twitter-feed-posts-item-actions-item-likes');
      const likeIconDiv = document.createElement('div');
      likeIconDiv.classList.add('eapps-twitter-feed-posts-item-actions-item-icon');
      const likeImg = document.createElement('img');
      likeImg.alt = 'svg file';
      likeIconDiv.append(likeImg); // No direct source in block for this SVG
      likeLink.append(likeIconDiv);
      const likeTextDiv = document.createElement('div');
      likeTextDiv.classList.add('eapps-twitter-feed-posts-item-actions-item-text');
      likeTextDiv.textContent = likeCountCell.textContent.trim();
      likeLink.append(likeTextDiv);
      actionsDiv.append(likeLink);

      postItemInner.append(actionsDiv);

      const postDateDiv = document.createElement('div');
      postDateDiv.classList.add('eapps-twitter-feed-posts-item-date');
      postDateDiv.textContent = tweetDateCell.textContent.trim();
      postItemInner.append(postDateDiv);

      postItem.append(postItemInner);
      postsInner.append(postItem);
    });

    postsContainer.append(postsInner);
    postsDiv.append(postsContainer);
    feedInner.append(postsDiv);
    feedContainer.append(feedInner);
    twitterFeedWrapper.append(feedContainer);
    slidesContainer.append(twitterFeedWrapper);
  }

  // Story Items
  storyItems.forEach((row) => {
    const [imageCell, categoryCell, textCell, readMoreLinkCell, dateCell] = [...row.children];

    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');
    moveInstrumentation(row, slideDiv);

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    const imageWrapDiv = document.createElement('div');
    imageWrapDiv.classList.add('image-wrap');
    const image = imageCell.querySelector('picture > img');
    if (image) {
      const imgEl = document.createElement('img');
      imgEl.src = image.src;
      imgEl.alt = image.alt;
      imgEl.classList.add('thumb-img', 'img-fluid');
      imgEl.loading = 'lazy';
      // Original HTML has data-img-horizontal and data-img-vertical, but these are not in EDS model.
      // If needed, these would need to be added to the model.
      imageWrapDiv.append(imgEl);
    }
    wrapDiv.append(imageWrapDiv);

    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');

    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category');
    categoryDiv.textContent = categoryCell.textContent.trim();
    contentWrapDiv.append(categoryDiv);

    const textDiv = document.createElement('div');
    textDiv.classList.add('text');
    textDiv.textContent = textCell.textContent.trim();
    contentWrapDiv.append(textDiv);

    const readMoreLink = readMoreLinkCell.querySelector('a');
    if (readMoreLink) {
      const linkEl = document.createElement('a');
      linkEl.href = readMoreLink.href;
      linkEl.classList.add('btn', 'btn-link');
      linkEl.textContent = 'Read more';
      contentWrapDiv.append(linkEl);
    }

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    const timeEl = document.createElement('time');
    timeEl.datetime = dateCell.textContent.trim(); // Assuming dateCell content is a valid datetime string
    timeEl.textContent = dateCell.textContent.trim();
    dateDiv.append(timeEl);
    contentWrapDiv.append(dateDiv);

    wrapDiv.append(contentWrapDiv);
    slideDiv.append(wrapDiv);
    slidesContainer.append(slideDiv);
  });

  flickityWrap.append(slidesContainer);
  container.append(flickityWrap);
  section.append(container);

  // Image optimization
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(section);
}
