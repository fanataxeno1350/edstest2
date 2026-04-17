import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const headingRow = children[0];
  const itemRows = children.slice(1);

  // Section header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow.firstElementChild, heading);
  heading.textContent = headingRow.firstElementChild.textContent.trim();
  sectionHeader.append(heading);

  // Container for items
  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickitySliderWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const slidesWrapper = document.createElement('div');
  slidesWrapper.classList.add('slides');

  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 10) { // Twitter Feed Item
      const [
        userImageCell,
        userNameCell,
        userScreenNameCell,
        dateCell,
        tweetTextCell,
        mediaCell, // This is a container, but it's empty in the EDS structure.
        replyCountCell,
        repostCountCell,
        likeCountCell,
        tweetLinkCell,
      ] = cells;

      const tweetSlide = document.createElement('div');
      tweetSlide.classList.add('elfsight-app-81878be6-2fc1-4ba6-b776-5fb962097235', 'eapps-twitter-feed', 'eapps-twitter-feed-source-user', 'eapps-twitter-feed-color-scheme--dark');
      tweetSlide.setAttribute('data-elfsight-app-lazy', '');
      tweetSlide.id = 'eapps-twitter-feed-1'; // ID from original HTML

      const tweetContainer = document.createElement('div');
      tweetContainer.classList.add('eapps-twitter-feed-container', 'eapps-twitter-feed-post-x-icon-hide', 'eapps-twitter-feed-post-reply-hide', 'eapps-twitter-feed-post-repost-hide', 'eapps-twitter-feed-post-like-hide', 'eapps-twitter-feed-post-share-button-hide', 'eapps-twitter-feed-small', 'eapps-twitter-feed-hide-header');
      tweetContainer.setAttribute('eapps-link', 'app');

      const tweetInner = document.createElement('div');
      tweetInner.classList.add('eapps-twitter-feed-inner');

      const tweetPosts = document.createElement('div');
      tweetPosts.classList.add('eapps-twitter-feed-posts');
      tweetPosts.setAttribute('eapps-link', 'posts');

      const tweetPostsContainer = document.createElement('div');
      tweetPostsContainer.classList.add('eapps-twitter-feed-posts-container');
      tweetPostsContainer.setAttribute('eapps-link', 'postsContainer');

      const tweetPostsInner = document.createElement('div');
      tweetPostsInner.classList.add('eapps-twitter-feed-posts-inner', 'shuffle');
      tweetPostsInner.setAttribute('eapps-link', 'posts');

      const tweetPostItem = document.createElement('div');
      tweetPostItem.classList.add('eapps-twitter-feed-posts-item', 'eapps-twitter-feed-posts-item-media-items-1', 'eapps-twitter-feed-posts-item-media-show', 'eapps-twitter-feed-posts-item-show', 'shuffle-item', 'shuffle-item--visible');

      const tweetPostItemInner = document.createElement('div');
      tweetPostItemInner.classList.add('eapps-twitter-feed-posts-item-inner');

      const tweetUser = document.createElement('div');
      tweetUser.classList.add('eapps-twitter-feed-posts-item-user');

      const userLink = document.createElement('a');
      userLink.setAttribute('rel', 'nofollow');
      userLink.setAttribute('target', '_blank');
      const tweetHref = tweetLinkCell.querySelector('a')?.href; // Correctly read href for aem-content
      if (tweetHref) {
        userLink.href = tweetHref;
      }

      const userImageContainer = document.createElement('div');
      userImageContainer.classList.add('eapps-twitter-feed-posts-item-user-image-container');
      const userImage = userImageCell.querySelector('picture');
      if (userImage) {
        const img = userImage.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('eapps-twitter-feed-posts-item-user-image');
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        userImageContainer.append(optimizedPic);
      }
      userLink.append(userImageContainer);
      tweetUser.append(userLink);

      const userNameWrapper = document.createElement('div');
      userNameWrapper.classList.add('eapps-twitter-feed-posts-item-user-name');
      const userNameLink = document.createElement('a');
      userNameLink.setAttribute('rel', 'nofollow');
      userNameLink.setAttribute('target', '_blank');
      if (tweetHref) {
        userNameLink.href = tweetHref;
      }
      const userNameSpan = document.createElement('span');
      userNameSpan.textContent = userNameCell.textContent.trim();
      userNameLink.append(userNameSpan);
      userNameWrapper.append(userNameLink);

      const userScreenNameDiv = document.createElement('div');
      userScreenNameDiv.classList.add('eapps-twitter-feed-posts-item-user-screen-name');
      const userScreenNameLink = document.createElement('a');
      userScreenNameLink.setAttribute('rel', 'nofollow');
      userScreenNameLink.setAttribute('target', '_blank');
      if (tweetHref) {
        userScreenNameLink.href = tweetHref;
      }
      const userScreenNameSpan = document.createElement('span');
      userScreenNameSpan.textContent = userScreenNameCell.textContent.trim();
      userScreenNameLink.append(userScreenNameSpan);
      userScreenNameDiv.append(userScreenNameLink);

      const postDateSpan = document.createElement('span');
      postDateSpan.classList.add('eapps-twitter-feed-posts-item-user-date');
      postDateSpan.textContent = dateCell.textContent.trim();
      userScreenNameDiv.append(postDateSpan);
      userNameWrapper.append(userScreenNameDiv);
      tweetUser.append(userNameWrapper);

      const tweetTextDiv = document.createElement('div');
      tweetTextDiv.classList.add('eapps-twitter-feed-posts-item-text');
      tweetTextDiv.innerHTML = tweetTextCell.innerHTML;

      const tweetActions = document.createElement('div');
      tweetActions.classList.add('eapps-twitter-feed-posts-item-actions');

      const replyAction = document.createElement('a');
      replyAction.classList.add('eapps-twitter-feed-posts-item-actions-item', 'eapps-twitter-feed-posts-item-actions-item-comments');
      replyAction.setAttribute('rel', 'nofollow');
      replyAction.title = 'Reply';
      if (tweetHref) {
        replyAction.href = tweetHref; // Placeholder, real tweet ID needed for actual reply link
      }
      const replyIcon = document.createElement('div');
      replyIcon.classList.add('eapps-twitter-feed-posts-item-actions-item-icon');
      replyIcon.innerHTML = `<img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1776285863034.svg+xml"/>`;
      replyAction.append(replyIcon);
      if (replyCountCell.textContent.trim() !== '0') {
        const replyText = document.createElement('div');
        replyText.classList.add('eapps-twitter-feed-posts-item-actions-item-text');
        replyText.textContent = replyCountCell.textContent.trim();
        replyAction.append(replyText);
      }
      tweetActions.append(replyAction);

      const repostAction = document.createElement('a');
      repostAction.classList.add('eapps-twitter-feed-posts-item-actions-item', 'eapps-twitter-feed-posts-item-actions-item-repost');
      repostAction.setAttribute('rel', 'nofollow');
      repostAction.title = 'Repost';
      if (tweetHref) {
        repostAction.href = tweetHref; // Placeholder
      }
      const repostIcon = document.createElement('div');
      repostIcon.classList.add('eapps-twitter-feed-posts-item-actions-item-icon');
      repostIcon.innerHTML = `<img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1776285863118.svg+xml"/>`;
      repostAction.append(repostIcon);
      if (repostCountCell.textContent.trim() !== '0') {
        const repostText = document.createElement('div');
        repostText.classList.add('eapps-twitter-feed-posts-item-actions-item-text');
        repostText.textContent = repostCountCell.textContent.trim();
        repostAction.append(repostText);
      }
      tweetActions.append(repostAction);

      const likeAction = document.createElement('a');
      likeAction.classList.add('eapps-twitter-feed-posts-item-actions-item', 'eapps-twitter-feed-posts-item-actions-item-likes');
      likeAction.setAttribute('rel', 'nofollow');
      likeAction.title = 'Like';
      if (tweetHref) {
        likeAction.href = tweetHref; // Placeholder
      }
      const likeIcon = document.createElement('div');
      likeIcon.classList.add('eapps-twitter-feed-posts-item-actions-item-icon');
      likeIcon.innerHTML = `<img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1776285863236.svg+xml"/>`;
      likeAction.append(likeIcon);
      if (likeCountCell.textContent.trim() !== '0') {
        const likeText = document.createElement('div');
        likeText.classList.add('eapps-twitter-feed-posts-item-actions-item-text');
        likeText.textContent = likeCountCell.textContent.trim();
        likeAction.append(likeText);
      }
      tweetActions.append(likeAction);

      tweetPostItemInner.append(tweetUser, tweetTextDiv, tweetActions);
      tweetPostItem.append(tweetPostItemInner);
      tweetPostsInner.append(tweetPostItem);
      tweetPostsContainer.append(tweetPostsInner);
      tweetPosts.append(tweetPostsContainer);
      tweetInner.append(tweetPosts);
      tweetContainer.append(tweetInner);
      tweetSlide.append(tweetContainer);

      slidesWrapper.append(tweetSlide);
      moveInstrumentation(row, tweetSlide);
    } else if (cells.length === 5) { // Story Item
      const [imageCell, categoryCell, textCell, linkCell, dateCell] = cells;

      const storySlide = document.createElement('div');
      storySlide.classList.add('slides');

      const wrap = document.createElement('div');
      wrap.classList.add('wrap');

      const imageWrap = document.createElement('div');
      imageWrap.classList.add('image-wrap');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('thumb-img', 'img-fluid');
        moveInstrumentation(img, optimizedPic.querySelector('img'));
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

      const link = document.createElement('a');
      link.classList.add('btn', 'btn-link');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      }
      link.textContent = 'Read more'; // Hardcoded label from original HTML
      contentWrap.append(link);

      const date = document.createElement('div');
      date.classList.add('date');
      date.textContent = dateCell.textContent.trim();
      contentWrap.append(date);

      wrap.append(contentWrap);
      storySlide.append(wrap);
      slidesWrapper.append(storySlide);
      moveInstrumentation(row, storySlide);
    }
  });

  flickitySliderWrap.append(slidesWrapper);
  container.append(flickitySliderWrap);

  block.innerHTML = '';
  block.classList.add('grey-bg', 'latest-stories', 'home-stories');
  block.append(sectionHeader, container);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
