import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const sectionHeadingRow = children.shift();
  const sectionHeading = sectionHeadingRow.querySelector('div').textContent.trim();

  const sectionHeaderDiv = document.createElement('div');
  sectionHeaderDiv.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.textContent = sectionHeading;
  moveInstrumentation(sectionHeadingRow, heading);
  sectionHeaderDiv.appendChild(heading);

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'aos-init', 'aos-animate');
  containerDiv.setAttribute('data-aos', 'fade-up');
  containerDiv.setAttribute('data-aos-offset', '100');
  containerDiv.setAttribute('data-aos-duration', '650');
  containerDiv.setAttribute('data-aos-easing', 'ease-in-out');

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickitySliderWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const twitterSlides = document.createElement('div');
  twitterSlides.classList.add('slides');
  const twitterFeedContainer = document.createElement('div');
  twitterFeedContainer.classList.add('elfsight-app-81878be6-2fc1-4ba6-b776-5fb962097235', 'eapps-twitter-feed', 'eapps-twitter-feed-source-user', 'eapps-twitter-feed-color-scheme--dark');
  twitterFeedContainer.setAttribute('data-elfsight-app-lazy', '');
  twitterFeedContainer.id = 'eapps-twitter-feed-1';

  const twitterFeedInner = document.createElement('div');
  twitterFeedInner.classList.add('eapps-twitter-feed-container', 'eapps-twitter-feed-post-x-icon-hide', 'eapps-twitter-feed-post-reply-hide', 'eapps-twitter-feed-post-repost-hide', 'eapps-twitter-feed-post-like-hide', 'eapps-twitter-feed-post-share-button-hide', 'eapps-twitter-feed-small', 'eapps-twitter-feed-hide-header');
  twitterFeedInner.setAttribute('eapps-link', 'app');

  const twitterPosts = document.createElement('div');
  twitterPosts.classList.add('eapps-twitter-feed-posts');

  const storySlides = document.createElement('div');
  storySlides.classList.add('slides');

  children.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 11) { // Twitter-Feed-Item
      const [
        profileBannerCell,
        profileImageCell,
        profileNameCell,
        profileScreenNameCell,
        tweetDateCell,
        tweetUrlCell,
        tweetTextCell,
        mediaImagesCell,
        replyCountCell,
        repostCountCell,
        likeCountCell,
      ] = cells;

      const tweetUrl = tweetUrlCell.querySelector('a')?.href || '#';
      const tweetId = tweetUrl.split('/').pop();
      const profileName = profileNameCell.textContent.trim();

      const twitterPostItem = document.createElement('div');
      twitterPostItem.classList.add('eapps-twitter-feed-posts-item', 'eapps-twitter-feed-posts-item-media-items-1', 'eapps-twitter-feed-posts-item-media-show', 'eapps-twitter-feed-posts-item-show', 'shuffle-item', 'shuffle-item--visible');

      const twitterPostInner = document.createElement('div');
      twitterPostInner.classList.add('eapps-twitter-feed-posts-item-inner');

      const userDiv = document.createElement('div');
      userDiv.classList.add('eapps-twitter-feed-posts-item-user');

      const userLink = document.createElement('a');
      userLink.rel = 'nofollow';
      userLink.target = '_blank';
      userLink.href = tweetUrl;

      const userImageContainer = document.createElement('div');
      userImageContainer.classList.add('eapps-twitter-feed-posts-item-user-image-container');

      const profileImage = profileImageCell.querySelector('picture > img');
      if (profileImage) {
        const userImage = document.createElement('img');
        userImage.classList.add('eapps-twitter-feed-posts-item-user-image');
        userImage.src = profileImage.src;
        userImage.alt = profileImage.alt;
        userImageContainer.appendChild(userImage);
      }
      userLink.appendChild(userImageContainer);
      userDiv.appendChild(userLink);

      const userNameDiv = document.createElement('div');
      userNameDiv.classList.add('eapps-twitter-feed-posts-item-user-name');

      const userNameLink = document.createElement('a');
      userNameLink.rel = 'nofollow';
      userNameLink.target = '_blank';
      userNameLink.href = tweetUrl;
      const userNameSpan = document.createElement('span');
      userNameSpan.textContent = profileName;
      userNameLink.appendChild(userNameSpan);

      const verifiedSpan = document.createElement('span');
      verifiedSpan.classList.add('eapps-twitter-feed-posts-item-user-name-verified');
      verifiedSpan.title = 'Verified account';
      verifiedSpan.innerHTML = `<svg width="13" height="13" viewBox="0 0 20 20">
          <path style="fill:#1da1f2;fill-opacity:1" d="m 14.5436,18.0924 c -0.160467,0 -0.3878,-0.03 -0.682,-0.09 -0.2942,-0.06 -0.488133,-0.1102 -0.5818,-0.1506 -0.33428,0.669333 -0.78895,1.194767 -1.36401,1.5763 -0.57506,0.381533 -1.216987,0.5723 -1.92578,0.5723 -0.7087933,0 -1.3674367,-0.210833 -1.97593,-0.6325 -0.6084933,-0.421733 -1.0331,-0.9271 -1.27382,-1.5161 -0.4145733,0.160667 -0.8425233,0.241 -1.28385,0.241 -1.0030067,0 -1.8589067,-0.3782 -2.5677,-1.1346 -0.7087933,-0.756333 -1.0565033,-1.6499 -1.04313,-2.6807 -0.0134,-0.04 -0.0134,-0.08017 0,-0.1205 l 0,-0.1205 c -0.0134,-0.04013 -0.0134,-0.08028 0,-0.12044 0.0134,-0.04013 0.0134,-0.08029 0,-0.12048 C 1.27052,13.420747 0.81916333,12.942167 0.49151,12.35984 0.16383667,11.77724 0,11.147923 0,10.47189 0,9.79585 0.17719667,9.1398933 0.53159,8.50402 0.88599,7.86814 1.39084,7.3828633 2.04614,7.04819 L 1.96594,6.72691 C 1.8857,6.5261033 1.84558,6.2985267 1.84558,6.04418 1.8188467,5.93708 1.8188467,5.82329 1.84558,5.70281 1.83218,4.68541 2.1732033,3.7951833 2.86865,3.03213 3.56407,2.2690767 4.4266567,1.88755 5.45641,1.88755 c 0.4413267,0 0.8692767,0.08032 1.28385,0.24096 C 6.9943533,1.5261033 7.4156167,1.02075 8.00405,0.61245 8.5924567,0.20415 9.25443,0 9.98997,0 c 1.47108,0 2.56769,0.70950333 3.28983,2.12851 0.3544,-0.16064 0.775667,-0.24096 1.2638,-0.24096 1.003,0 1.855567,0.3748333 2.5577,1.1245 0.702133,0.7496667 1.066567,1.6465867 1.0933,2.69076 -0.01333,0.08032 -0.02,0.19411 -0.02,0.34137 l -0.1203,0.68273 c -0.02667,0.12048 -0.0668,0.2275733 -0.1204,0.32128 0.6018,0.2811267 1.089933,0.7195467 1.4644,1.31526 0.374467,0.59572 0.575067,1.2951867 0.6018,2.0984 -0.02667,0.749667 -0.2072,1.41901 -0.5416,2.00803 -0.334333,0.58902 -0.775667,1.030787 -1.324,1.3253 0.02667,0.05353 0.04,0.09369 0.04,0.12048 l 0.02,0.24094 c -0.02667,0.04 -0.02667,0.08017 0,0.1205 -0.02667,1.070933 -0.394433,1.974567 -1.1033,2.7109 -0.7088,0.736267 -1.558033,1.1044 -2.5477,1.1044"></path>
          <path style="fill:#ffffff;fill-opacity:1;" d="M 13.2598,6.58635 8.42528,11.40562 6.76028,9.71888 C 6.51956,9.5180733 6.28218,9.41767 6.04814,9.41767 5.8141067,9.41767 5.5633567,9.5180733 5.29589,9.71888 5.0952833,10 4.9983267,10.271083 5.00502,10.53213 c 0.00667,0.26104 0.11031,0.471883 0.31093,0.63253 l 2.38716,2.40964 c 0.24072,0.2008 0.5015033,0.3012 0.78235,0.3012 0.28084,0 0.5015,-0.1004 0.66198,-0.3012 l 0.0201,0 5.524341,-5.6675353 C 15.199662,7.3478056 14.827995,6.7252711 14.674931,6.5787563 14.521867,6.4322415 13.835901,6.0147732 13.2598,6.58635 z"></path>
      </svg>`;
      userNameLink.appendChild(verifiedSpan);
      userNameDiv.appendChild(userNameLink);

      const screenNameDiv = document.createElement('div');
      screenNameDiv.classList.add('eapps-twitter-feed-posts-item-user-screen-name');
      const screenNameLink = document.createElement('a');
      screenNameLink.rel = 'nofollow';
      screenNameLink.target = '_blank';
      screenNameLink.href = tweetUrl;
      const screenNameSpan = document.createElement('span');
      screenNameSpan.textContent = profileScreenNameCell.textContent.trim();
      screenNameLink.appendChild(screenNameSpan);
      screenNameDiv.appendChild(screenNameLink);

      const dateSpan = document.createElement('span');
      dateSpan.classList.add('eapps-twitter-feed-posts-item-user-date');
      dateSpan.textContent = tweetDateCell.textContent.trim();
      screenNameDiv.appendChild(dateSpan);
      userNameDiv.appendChild(screenNameDiv);
      userDiv.appendChild(userNameDiv);

      const userPostDiv = document.createElement('div');
      userPostDiv.classList.add('eapps-twitter-feed-posts-item-user-post');
      const userPostLink = document.createElement('a');
      userPostLink.rel = 'nofollow';
      userPostLink.href = tweetUrl;
      userPostLink.target = '_blank';
      userPostLink.title = 'View on X';
      userPostLink.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 12" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.6424 0.269775H12.5847L8.34131 5.12425L13.3333 11.7301H9.42461L6.36319 7.72369L2.86023 11.7301H0.916753L5.45545 6.53769L0.666626 0.269775H4.67454L7.44179 3.93179L10.6424 0.269775ZM9.96068 10.5664H11.0369L4.08973 1.37232H2.9348L9.96068 10.5664Z"></path>
      </svg>`;
      userPostDiv.appendChild(userPostLink);
      userDiv.appendChild(userPostDiv);
      twitterPostInner.appendChild(userDiv);

      const tweetTextDiv = document.createElement('div');
      tweetTextDiv.classList.add('eapps-twitter-feed-posts-item-text');
      tweetTextDiv.innerHTML = tweetTextCell.innerHTML;
      twitterPostInner.appendChild(tweetTextDiv);

      const mediaDiv = document.createElement('div');
      mediaDiv.classList.add('eapps-twitter-feed-posts-item-media', 'eapps-twitter-feed-posts-item-media-visible');
      mediaDiv.setAttribute('eapps-link', 'media');

      const mediaImage = mediaImagesCell.querySelector('picture > img');
      if (mediaImage) {
        const mediaItemDiv = document.createElement('div');
        mediaItemDiv.classList.add('eapps-twitter-feed-posts-item-media-item-type-image', 'eapps-twitter-feed-posts-item-media-item');
        const mediaItemLink = document.createElement('a');
        mediaItemLink.rel = 'nofollow';
        mediaItemLink.href = tweetUrl;
        mediaItemLink.classList.add('');
        mediaItemLink.target = '_blank';
        mediaItemLink.setAttribute('aria-label', `Watch ${profileName}'s video post on X`);

        const img = document.createElement('img');
        img.classList.add('eapps-twitter-feed-posts-item-media-item-image');
        img.setAttribute('eapps-link', 'picture');
        img.src = mediaImage.src;
        img.alt = mediaImage.alt;
        mediaItemLink.appendChild(img);

        if (/\.(mp4|webm|ogg|mov)$/i.test(mediaImage.src)) {
          const videoPlayIcon = document.createElement('svg');
          videoPlayIcon.classList.add('eapps-twitter-feed-posts-item-media-item-play-icon');
          videoPlayIcon.setAttribute('viewBox', '0 0 24 24');
          videoPlayIcon.innerHTML = `<g>
              <circle cx="12" cy="12" r="10"></circle>
              <path fill="#FFF" d="M16.036 11.58l-6-3.82a.5.5 0 0 0-.77.42v7.64a.498.498 0 0 0 .77.419l6-3.817c.145-.092.23-.25.23-.422s-.085-.33-.23-.42z"></path>
              <path fill="#FFF" d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12S6.072 1.25 12 1.25 22.75 6.072 22.75 12 17.928 22.75 12 22.75zm0-20C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25S17.1 2.75 12 2.75z"></path>
          </g>`;
          mediaItemLink.appendChild(videoPlayIcon);
        }
        mediaItemDiv.appendChild(mediaItemLink);
        mediaDiv.appendChild(mediaItemDiv);
      }
      twitterPostInner.appendChild(mediaDiv);

      const actionsDiv = document.createElement('div');
      actionsDiv.classList.add('eapps-twitter-feed-posts-item-actions');

      const replyLink = document.createElement('a');
      replyLink.rel = 'nofollow';
      replyLink.href = `https://x.com/intent/tweet?in_reply_to=${tweetId}&related=${profileName}`;
      replyLink.title = 'Reply';
      replyLink.classList.add('eapps-twitter-feed-posts-item-actions-item', 'eapps-twitter-feed-posts-item-actions-item-comments');
      replyLink.innerHTML = `<div class="eapps-twitter-feed-posts-item-actions-item-icon">
          <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M13.359 11.545c-.747.632-3.2 2.242-4.458 3.056v-2.098a.493.493 0 0 0-.493-.493H7.146c-2.41 0-4.159-1.63-4.159-3.874 0-2.327 1.822-4.148 4.147-4.148l3.729.006c2.326 0 4.147 1.821 4.149 4.144 0 1.257-.619 2.531-1.653 3.407zM7.136 3C4.255 3 2 5.256 2 8.136c0 2.685 2.079 4.727 4.877 4.851h1.037v2.52a.49.49 0 0 0 .759.416c.174-.111 4.261-2.725 5.324-3.625 1.252-1.06 2-2.612 2.003-4.154-.004-2.886-2.258-5.136-5.134-5.137L7.136 3z"></path>
          </svg>
      </div>`;
      actionsDiv.appendChild(replyLink);

      const repostLink = document.createElement('a');
      repostLink.rel = 'nofollow';
      repostLink.href = `https://x.com/intent/retweet?tweet_id=${tweetId}&related=${profileName}`;
      repostLink.title = 'Repost';
      repostLink.classList.add('eapps-twitter-feed-posts-item-actions-item', 'eapps-twitter-feed-posts-item-actions-item-repost');
      repostLink.innerHTML = `<div class="eapps-twitter-feed-posts-item-actions-item-icon">
          <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.712 11.961a.493.493 0 0 1 0 .698l-2.518 2.517a.491.491 0 0 1-.698 0l-2.517-2.517a.493.493 0 1 1 .698-.698l1.675 1.674V6.468c0-.817-.665-1.481-1.481-1.481H8.494a.494.494 0 1 1 0-.987h4.377a2.471 2.471 0 0 1 2.468 2.468v7.168l1.675-1.675a.493.493 0 0 1 .698 0zm-8.348 2.373a.494.494 0 0 1 0 .988H4.986a2.471 2.471 0 0 1-2.468-2.47V5.686L.843 7.36a.493.493 0 1 1-.698-.698l2.518-2.518a.493.493 0 0 1 .698 0l2.517 2.518a.493.493 0 1 1-.698.698L3.505 5.685v7.168c0 .817.665 1.48 1.48 1.48h4.379z"></path>
          </svg>
      </div>
      <div class="eapps-twitter-feed-posts-item-actions-item-text">${repostCountCell.textContent.trim()}</div>`;
      actionsDiv.appendChild(repostLink);

      const likeLink = document.createElement('a');
      likeLink.rel = 'nofollow';
      likeLink.href = `https://x.com/intent/like?tweet_id=${tweetId}&related=${profileName}`;
      likeLink.title = 'Like';
      likeLink.classList.add('eapps-twitter-feed-posts-item-actions-item', 'eapps-twitter-feed-posts-item-actions-item-likes');
      likeLink.innerHTML = `<div class="eapps-twitter-feed-posts-item-actions-item-icon">
          <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M5.556 4.988c-1.368 0-2.569 1.309-2.569 2.801 0 3.778 4.63 6.632 5.628 6.673.998-.041 5.628-2.895 5.628-6.673 0-1.492-1.201-2.801-2.57-2.801-1.665 0-2.593 1.932-2.602 1.951-.152.371-.761.371-.913 0-.008-.019-.937-1.951-2.602-1.951zM2 7.789C2 5.771 3.662 4 5.556 4c1.508 0 2.522 1.041 3.059 1.797C9.152 5.041 10.165 4 11.673 4c1.895 0 3.557 1.771 3.557 3.789 0 4.197-4.906 7.629-6.606 7.661C6.906 15.418 2 11.986 2 7.789z"></path>
          </svg>
      </div>
      <div class="eapps-twitter-feed-posts-item-actions-item-text">${likeCountCell.textContent.trim()}</div>`;
      actionsDiv.appendChild(likeLink);

      twitterPostInner.appendChild(actionsDiv);

      const postDateDiv = document.createElement('div');
      postDateDiv.classList.add('eapps-twitter-feed-posts-item-date');
      postDateDiv.textContent = tweetDateCell.textContent.trim();
      twitterPostInner.appendChild(postDateDiv);

      twitterPostItem.appendChild(twitterPostInner);
      moveInstrumentation(row, twitterPostItem);
      twitterPosts.appendChild(twitterPostItem);
    } else if (cells.length === 5) { // Story-Card
      const [imageCell, categoryCell, textCell, linkCell, dateCell] = cells;

      const wrapDiv = document.createElement('div');
      wrapDiv.classList.add('wrap');

      const imageWrapDiv = document.createElement('div');
      imageWrapDiv.classList.add('image-wrap');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          imageWrapDiv.appendChild(optimizedPic);
        }
      }
      wrapDiv.appendChild(imageWrapDiv);

      const contentWrapDiv = document.createElement('div');
      contentWrapDiv.classList.add('content-wrap');

      const categoryDiv = document.createElement('div');
      categoryDiv.classList.add('category');
      categoryDiv.textContent = categoryCell.textContent.trim();
      contentWrapDiv.appendChild(categoryDiv);

      const textDiv = document.createElement('div');
      textDiv.classList.add('text');
      textDiv.textContent = textCell.textContent.trim();
      contentWrapDiv.appendChild(textDiv);

      const readMoreLink = document.createElement('a');
      readMoreLink.classList.add('btn', 'btn-link');
      readMoreLink.textContent = 'Read more';
      readMoreLink.href = linkCell.querySelector('a')?.href || '#';
      contentWrapDiv.appendChild(readMoreLink);

      const dateDiv = document.createElement('div');
      dateDiv.classList.add('date');
      const timeElement = document.createElement('time');
      timeElement.setAttribute('datetime', dateCell.textContent.trim());
      timeElement.textContent = dateCell.textContent.trim();
      dateDiv.appendChild(timeElement);
      contentWrapDiv.appendChild(dateDiv);

      wrapDiv.appendChild(contentWrapDiv);
      moveInstrumentation(row, wrapDiv);
      storySlides.appendChild(wrapDiv);
    }
  });

  twitterFeedContainer.appendChild(twitterFeedInner);
  twitterFeedInner.appendChild(twitterPosts);
  twitterSlides.appendChild(twitterFeedContainer);
  flickitySliderWrap.appendChild(twitterSlides);
  flickitySliderWrap.appendChild(storySlides);
  containerDiv.appendChild(flickitySliderWrap);

  block.innerHTML = '';
  block.appendChild(sectionHeaderDiv);
  block.appendChild(containerDiv);
}
