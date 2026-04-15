import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');

  // Heading
  const headingRow = children.shift();
  if (headingRow) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.textContent = headingRow.firstElementChild.textContent.trim();
    moveInstrumentation(headingRow, heading);
    sectionHeader.append(heading);
    section.append(sectionHeader);
  }

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickitySliderWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const slidesWrapper = document.createElement('div');
  slidesWrapper.classList.add('slides');

  const socialFeedItems = children.filter((row) => row.children.length === 9);
  const storyCardItems = children.filter((row) => row.children.length === 5);

  if (socialFeedItems.length > 0) {
    const elfsightApp = document.createElement('div');
    elfsightApp.classList.add(
      'elfsight-app-81878be6-2fc1-4ba6-b776-5fb962097235',
      'eapps-twitter-feed',
      'eapps-twitter-feed-source-user',
      'eapps-twitter-feed-color-scheme--dark',
    );
    elfsightApp.setAttribute('data-elfsight-app-lazy', '');
    elfsightApp.id = 'eapps-twitter-feed-1';

    const eappsTwitterFeedContainer = document.createElement('div');
    eappsTwitterFeedContainer.classList.add(
      'eapps-twitter-feed-container',
      'eapps-twitter-feed-post-x-icon-hide',
      'eapps-twitter-feed-post-reply-hide',
      'eapps-twitter-feed-post-repost-hide',
      'eapps-twitter-feed-post-like-hide',
      'eapps-twitter-feed-post-share-button-hide',
      'eapps-twitter-feed-small',
      'eapps-twitter-feed-hide-header',
    );
    eappsTwitterFeedContainer.setAttribute('eapps-link', 'app');

    const eappsTwitterFeedTitle = document.createElement('div');
    eappsTwitterFeedTitle.classList.add('eapps-twitter-feed-title');
    eappsTwitterFeedTitle.setAttribute('eapps-link', 'title');
    const euiWidgetTitle = document.createElement('div');
    euiWidgetTitle.classList.add('eui-widget-title', 'es-widget-title');
    euiWidgetTitle.style.display = 'none';
    eappsTwitterFeedTitle.append(euiWidgetTitle);
    eappsTwitterFeedContainer.append(eappsTwitterFeedTitle);

    const eappsTwitterFeedInner = document.createElement('div');
    eappsTwitterFeedInner.classList.add('eapps-twitter-feed-inner');
    eappsTwitterFeedContainer.append(eappsTwitterFeedInner);

    socialFeedItems.forEach((row) => {
      const [
        profileBannerCell,
        profileImageCell,
        displayNameCell,
        screenNameCell,
        profileUrlCell,
        postsCountCell,
        followingCountCell,
        followersCountCell,
        postsCell,
      ] = [...row.children];

      const header = document.createElement('div');
      header.classList.add('eapps-twitter-feed-header', 'eapps-twitter-feed-header-show');
      header.setAttribute('eapps-link', 'header');
      const headerInner = document.createElement('div');
      headerInner.classList.add('eapps-twitter-feed-header-inner');
      header.append(headerInner);

      const bannerContainer = document.createElement('div');
      bannerContainer.classList.add('eapps-twitter-feed-header-banner-container');
      const bannerPicture = profileBannerCell.querySelector('picture');
      if (bannerPicture) {
        const bannerImg = bannerPicture.querySelector('img');
        const optimizedBannerPic = createOptimizedPicture(bannerImg.src, bannerImg.alt, false, [{ width: '750' }]);
        moveInstrumentation(bannerImg, optimizedBannerPic.querySelector('img'));
        optimizedBannerPic.querySelector('img').classList.add('eapps-twitter-feed-header-banner');
        bannerContainer.append(optimizedBannerPic);
      }
      headerInner.append(bannerContainer);

      const userDiv = document.createElement('div');
      userDiv.classList.add('eapps-twitter-feed-header-user');
      const profileLink = document.createElement('a');
      profileLink.rel = 'nofollow';
      profileLink.target = '_blank';
      profileLink.href = profileUrlCell.querySelector('a')?.href || '#'; // Corrected to use .querySelector('a')?.href
      profileLink.classList.add('eapps-twitter-feed-header-user-image-container');
      const profilePicture = profileImageCell.querySelector('picture');
      if (profilePicture) {
        const profileImg = profilePicture.querySelector('img');
        const optimizedProfilePic = createOptimizedPicture(profileImg.src, profileImg.alt, false, [{ width: '750' }]);
        moveInstrumentation(profileImg, optimizedProfilePic.querySelector('img'));
        optimizedProfilePic.querySelector('img').classList.add('eapps-twitter-feed-header-user-image');
        profileLink.append(optimizedProfilePic);
      }
      userDiv.append(profileLink);

      const userInfo = document.createElement('div');
      userInfo.classList.add('eapps-twitter-feed-header-user-info');
      const nameWrapper = document.createElement('div');
      nameWrapper.classList.add('eapps-twitter-feed-header-user-info-name-wrapper');
      const nameDiv = document.createElement('div');
      nameDiv.classList.add('eapps-twitter-feed-header-user-info-name');
      const nameAnchor = document.createElement('a');
      nameAnchor.rel = 'nofollow';
      nameAnchor.href = profileUrlCell.querySelector('a')?.href || '#'; // Corrected to use .querySelector('a')?.href
      nameAnchor.target = '_blank';
      nameAnchor.textContent = displayNameCell.textContent.trim();
      nameDiv.append(nameAnchor);
      nameWrapper.append(nameDiv);

      const screenNameDiv = document.createElement('div');
      screenNameDiv.classList.add('eapps-twitter-feed-header-user-info-screen-name');
      const screenNameAnchor = document.createElement('a');
      screenNameAnchor.rel = 'nofollow';
      screenNameAnchor.href = profileUrlCell.querySelector('a')?.href || '#'; // Corrected to use .querySelector('a')?.href
      screenNameAnchor.target = '_blank';
      screenNameAnchor.textContent = screenNameCell.textContent.trim();
      screenNameDiv.append(screenNameAnchor);
      nameWrapper.append(screenNameDiv);
      userInfo.append(nameWrapper);

      const followAnchor = document.createElement('a');
      followAnchor.rel = 'nofollow';
      followAnchor.href = '#'; // Placeholder, actual follow link not in model
      followAnchor.target = '_blank';
      followAnchor.classList.add('eapps-twitter-feed-header-user-info-follow');
      followAnchor.setAttribute('eapps-link', 'follow');
      const followLabel = document.createElement('span');
      followLabel.classList.add('eapps-twitter-feed-header-user-info-follow-label');
      followLabel.textContent = 'Follow';
      followAnchor.append(followLabel);
      userInfo.append(followAnchor);
      userDiv.append(userInfo);
      headerInner.append(userDiv);

      const statistics = document.createElement('div');
      statistics.classList.add('eapps-twitter-feed-header-statistics');
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
      statistics.append(
        createStatItem('Posts', postsCountCell.textContent.trim()),
        createStatItem('Following', followingCountCell.textContent.trim()),
        createStatItem('Followers', followersCountCell.textContent.trim()),
      );
      headerInner.append(statistics);
      eappsTwitterFeedInner.append(header);

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
      postsInner.style.cssText = 'position: relative; overflow: hidden; height: auto; transition: height 100ms cubic-bezier(0.4, 0, 0.2, 1); transition-property: transform, opacity;';

      // Posts are nested in the original HTML, but in EDS they are separate rows.
      // This means the 'posts' field in the social-feed-item model is a container
      // for social-feed-post items. However, the provided EDS structure does not
      // show social-feed-post items, only social-feed-item.
      // Assuming 'posts' cell is just a placeholder and individual posts are not
      // directly rendered from EDS for this block.
      // If social-feed-post items were present, they would be separate rows with 9 cells.

      postsDiv.append(postsContainer);
      eappsTwitterFeedInner.append(postsDiv);

      moveInstrumentation(row, elfsightApp);
    });
    slidesWrapper.append(elfsightApp);
  }

  storyCardItems.forEach((row) => {
    const [imageCell, categoryCell, textCell, linkCell, dateCell] = [...row.children];

    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      optimizedPic.querySelector('img').classList.add('thumb-img', 'img-fluid');
      optimizedPic.querySelector('img').loading = 'lazy';
      imageWrap.append(optimizedPic);
    }
    wrapDiv.append(imageWrap);

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category');
    categoryDiv.textContent = categoryCell.textContent.trim();
    contentWrap.append(categoryDiv);

    const textDiv = document.createElement('div');
    textDiv.classList.add('text');
    textDiv.textContent = textCell.textContent.trim();
    contentWrap.append(textDiv);

    const linkAnchor = document.createElement('a');
    linkAnchor.classList.add('btn', 'btn-link');
    linkAnchor.textContent = 'Read more'; // Fixed text from original HTML
    linkAnchor.href = linkCell.querySelector('a')?.href || '#'; // Corrected to use .querySelector('a')?.href
    contentWrap.append(linkAnchor);

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    const time = document.createElement('time');
    time.datetime = dateCell.textContent.trim(); // Assuming date-time field provides ISO format
    time.textContent = dateCell.textContent.trim();
    dateDiv.append(time);
    contentWrap.append(dateDiv);

    wrapDiv.append(contentWrap);
    slideDiv.append(wrapDiv);
    slidesWrapper.append(slideDiv);

    moveInstrumentation(row, slideDiv);
  });

  flickitySliderWrap.append(slidesWrapper);
  container.append(flickitySliderWrap);
  section.append(container);

  block.innerHTML = '';
  block.append(section);
}
