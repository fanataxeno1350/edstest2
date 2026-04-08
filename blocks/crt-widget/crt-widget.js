import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add('crt-no-touch', 'crt-widget-theme-sydney', 'crt-grid', 'crt-widget-grid', 'crt-widget-unbranded');

  const crtViewportTracker = document.createElement('div');
  crtViewportTracker.classList.add('crt-viewport-tracker');
  block.append(crtViewportTracker);

  const crtGridCol6 = document.createElement('div');
  crtGridCol6.classList.add('crt-grid-col6');
  block.append(crtGridCol6);

  const crtFeedWindow = document.createElement('div');
  crtFeedWindow.classList.add('crt-feed-window');
  crtFeedWindow.setAttribute('role', 'feed');
  crtFeedWindow.style.height = '565px'; // This seems to be a fixed height in the original HTML
  crtFeedWindow.style.overflow = 'hidden';
  crtGridCol6.append(crtFeedWindow);

  const crtFeed = document.createElement('div');
  crtFeed.classList.add('crt-feed');
  crtFeedWindow.append(crtFeed);

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 8) { // This row is a 'crt-grid-post' item
      const postDiv = document.createElement('div');
      moveInstrumentation(row, postDiv);
      postDiv.classList.add('crt-grid-post', 'crt-post-has-image', 'crt-post-has-text', 'crt-post-has-video', 'crt-post-instagram');
      postDiv.setAttribute('tabindex', '0');
      postDiv.setAttribute('role', 'article');
      postDiv.style.padding = '0px 7.5px 15px';
      postDiv.style.opacity = '1';

      const crtPostC = document.createElement('div');
      crtPostC.classList.add('crt-post-c');
      postDiv.append(crtPostC);

      const innerDiv = document.createElement('div');
      crtPostC.append(innerDiv);

      const crtGridPostContent = document.createElement('div');
      crtGridPostContent.classList.add('crt-grid-post-content');
      crtGridPostContent.style.paddingBottom = '100%';
      innerDiv.append(crtGridPostContent);

      const crtSocialIcon = document.createElement('span');
      crtSocialIcon.classList.add('crt-social-icon');
      crtSocialIcon.setAttribute('role', 'link');
      crtSocialIcon.setAttribute('tabindex', '0');
      const socialIconImg = document.createElement('img');
      socialIconImg.alt = 'svg file';
      // Original HTML uses a specific SVG path, extract if available, otherwise use placeholder
      socialIconImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775569357735.svg+xml'; // Placeholder, replace if a real SVG is provided via EDS
      crtSocialIcon.append(socialIconImg);
      crtGridPostContent.append(crtSocialIcon);

      // Use content detection for cells
      const imageCell = cells.find(cell => cell.querySelector('picture img[alt="Image"]'));
      const videoCell = cells.find(cell => cell.querySelector('picture img[alt="Video"]'));
      const textCell = cells.find(cell => cell.querySelector('p'));
      const fullnameCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('p') && !cell.querySelector('a') && cell.textContent.trim() === 'Fullname value'); // More specific detection needed if multiple text cells
      const userImageCell = cells.find(cell => cell.querySelector('picture img[alt="User Image"]'));
      const usernameCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('p') && !cell.querySelector('a') && cell.textContent.trim() === 'Username value'); // More specific detection needed
      const dateLinkCell = cells.find(cell => cell.querySelector('a[href*="date-link"]'));
      const dateCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('p') && !cell.querySelector('a') && cell.textContent.trim() === 'Date value'); // More specific detection needed

      // Image
      const crtGridPostImage = document.createElement('div');
      crtGridPostImage.classList.add('crt-grid-post-image');
      crtGridPostImage.setAttribute('tabindex', '0');
      crtGridPostImage.setAttribute('role', 'img');
      const imgPicture = imageCell?.querySelector('picture');
      if (imgPicture) {
        const img = imgPicture.querySelector('img');
        if (img) {
          crtGridPostImage.setAttribute('aria-label', `Image posted by ${usernameCell?.textContent.trim() || 'user'} to instagram`);
          crtGridPostImage.style.backgroundImage = `url("${img.src}")`;
          // Optimize image
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '480' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          img.closest('picture').replaceWith(optimizedPic);
        }
      }
      crtGridPostContent.append(crtGridPostImage);

      // Video
      const crtVideoContainer = document.createElement('div');
      crtVideoContainer.classList.add('crt-video-container');
      const videoPicture = videoCell?.querySelector('picture');
      if (videoPicture) {
        const videoImg = videoPicture.querySelector('img');
        if (videoImg) {
          const crtPlaySpan = document.createElement('span');
          crtPlaySpan.classList.add('crt-play');
          crtPlaySpan.setAttribute('tabindex', '0');
          crtPlaySpan.setAttribute('aria-label', 'play video');
          crtPlaySpan.setAttribute('role', 'button');
          const crtPlayIcon = document.createElement('i');
          crtPlayIcon.classList.add('crt-play-icon');
          crtPlaySpan.append(crtPlayIcon);
          crtVideoContainer.append(crtPlaySpan);

          const videoEl = document.createElement('video');
          videoEl.setAttribute('preload', 'none');
          videoEl.setAttribute('playsinline', '');
          videoEl.setAttribute('loop', '');
          videoEl.setAttribute('aria-label', `Video posted by ${usernameCell?.textContent.trim() || 'user'} to instagram`);
          videoEl.poster = videoImg.src; // Use the image as poster
          const videoSource = document.createElement('source');
          // Assuming video source is derived from the video image src, but with .mp4 extension
          // This needs to be robust if the video reference is a direct video file.
          // For now, derive from img src.
          const videoSrc = videoImg.src.replace(/\.(jpg|jpeg|png|gif)$/i, '.mp4');
          videoSource.src = videoSrc;
          videoSource.type = 'video/mp4';
          videoEl.append(videoSource);
          crtVideoContainer.append(videoEl);

          crtPlaySpan.addEventListener('click', () => {
            if (videoEl.paused) {
              videoEl.play();
              crtPlaySpan.classList.add('playing');
            } else {
              videoEl.pause();
              crtPlaySpan.classList.remove('playing');
            }
          });
        }
      }
      crtGridPostContent.append(crtVideoContainer);

      const crtPostHover = document.createElement('div');
      crtPostHover.classList.add('crt-post-hover');
      innerDiv.append(crtPostHover);

      const hoverInnerDiv = document.createElement('div');
      crtPostHover.append(hoverInnerDiv);

      const crtPostHeader = document.createElement('div');
      crtPostHeader.classList.add('crt-post-header');
      hoverInnerDiv.append(crtPostHeader);

      const crtPostFullname = document.createElement('div');
      crtPostFullname.classList.add('crt-post-fullname');
      const fullnameLink = document.createElement('a');
      fullnameLink.href = '#'; // Placeholder, original HTML has instagram link
      fullnameLink.target = '_blank';
      fullnameLink.setAttribute('aria-label', `Visit ${fullnameCell?.textContent.trim() || 'profile'}`);
      fullnameLink.setAttribute('aria-hidden', 'true');
      fullnameLink.textContent = fullnameCell?.textContent.trim() || '';
      crtPostFullname.append(fullnameLink);
      crtPostHeader.append(crtPostFullname);

      const crtPostText = document.createElement('div');
      crtPostText.classList.add('crt-post-text');
      if (textCell) {
        moveInstrumentation(textCell, crtPostText);
        while (textCell.firstChild) crtPostText.append(textCell.firstChild);
      }
      hoverInnerDiv.append(crtPostText);

      const crtPostReadMore = document.createElement('div');
      crtPostReadMore.classList.add('crt-post-read-more');
      const readMoreButton = document.createElement('button');
      readMoreButton.classList.add('crt-post-read-more-button');
      readMoreButton.textContent = 'Read more';
      crtPostReadMore.append(readMoreButton);
      hoverInnerDiv.append(crtPostReadMore);

      readMoreButton.addEventListener('click', () => {
        crtPostText.classList.toggle('expanded'); // Toggle a class to show/hide more text
        readMoreButton.textContent = crtPostText.classList.contains('expanded') ? 'Read less' : 'Read more';
      });

      const crtPostFooter = document.createElement('div');
      crtPostFooter.classList.add('crt-post-footer');
      hoverInnerDiv.append(crtPostFooter);

      // User Image
      const userImage = userImageCell?.querySelector('picture > img');
      if (userImage) {
        const crtPostUserimage = document.createElement('img');
        crtPostUserimage.classList.add('crt-post-userimage');
        crtPostUserimage.setAttribute('aria-label', `Profile image for ${fullnameCell?.textContent.trim() || 'user'}`);
        crtPostUserimage.setAttribute('aria-hidden', 'true');
        crtPostUserimage.alt = userImage.alt;
        crtPostUserimage.src = userImage.src;
        crtPostFooter.append(crtPostUserimage);
        // Optimize user image
        const optimizedUserPic = createOptimizedPicture(userImage.src, userImage.alt, false, [{ width: '50' }]);
        moveInstrumentation(userImage, optimizedUserPic.querySelector('img'));
        userImage.closest('picture').replaceWith(optimizedUserPic);
      }

      // Username
      const crtPostUsername = document.createElement('span');
      crtPostUsername.classList.add('crt-post-username');
      crtPostUsername.style.padding = '0px 10px';
      const usernameLink = document.createElement('a');
      usernameLink.href = '#'; // Placeholder, original HTML has instagram link
      usernameLink.target = '_blank';
      usernameLink.setAttribute('aria-label', `Visit @${usernameCell?.textContent.trim() || 'user'} profile`);
      usernameLink.setAttribute('aria-hidden', 'true');
      usernameLink.textContent = `@${usernameCell?.textContent.trim() || ''}`;
      crtPostUsername.append(usernameLink);
      crtPostFooter.append(crtPostUsername);

      // Date
      const crtPostDate = document.createElement('span');
      crtPostDate.classList.add('crt-post-date');
      const dateLink = document.createElement('a');
      const foundDateLink = dateLinkCell?.querySelector('a');
      if (foundDateLink) {
        dateLink.href = foundDateLink.href;
        dateLink.target = '_blank';
        dateLink.setAttribute('aria-hidden', 'true');
        dateLink.setAttribute('aria-label', `Posted on ${dateCell?.textContent.trim() || 'date'}, click to visit post on Instagram`);
        dateLink.textContent = dateCell?.textContent.trim() || '';
      } else if (dateCell) {
        dateLink.textContent = dateCell.textContent.trim();
      }
      crtPostDate.append(dateLink);
      crtPostFooter.append(crtPostDate);

      // Share section (assuming a generic share icon and buttons)
      const crtPostShare = document.createElement('div');
      crtPostShare.classList.add('crt-post-share');
      crtPostShare.setAttribute('role', 'group');
      crtPostShare.setAttribute('aria-label', 'Share icon, press tab to proceed with the share buttons');
      crtPostShare.setAttribute('aria-hidden', 'true');

      const crtShareHint = document.createElement('span');
      crtShareHint.classList.add('crt-share-hint');
      crtPostShare.append(crtShareHint);

      const crtShareButton = document.createElement('span');
      crtShareButton.classList.add('crt-share-button');
      const shareButtonImg = document.createElement('img');
      shareButtonImg.alt = 'svg file';
      shareButtonImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775569357803.svg+xml'; // Placeholder
      crtShareButton.append(shareButtonImg);
      crtPostShare.append(crtShareButton);

      const crtPopupShareIconContainer = document.createElement('div');
      crtPopupShareIconContainer.classList.add('crt-popup-share-icon-container');
      const shareP = document.createElement('p');
      shareP.textContent = 'Share';
      crtPopupShareIconContainer.append(shareP);

      const crtPopupShareIconContainerIcons = document.createElement('div');
      crtPopupShareIconContainerIcons.classList.add('crt-popup-share-icon-container-icons');

      const facebookShare = document.createElement('a');
      facebookShare.classList.add('crt-share-facebook');
      facebookShare.setAttribute('role', 'link');
      facebookShare.setAttribute('aria-label', 'Click to share to facebook');
      facebookShare.setAttribute('aria-hidden', 'true');
      const facebookImg = document.createElement('img');
      facebookImg.alt = 'svg file';
      facebookImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775569357843.svg+xml'; // Placeholder
      facebookShare.append(facebookImg);
      crtPopupShareIconContainerIcons.append(facebookShare);

      const twitterShare = document.createElement('a');
      twitterShare.classList.add('crt-share-twitter');
      twitterShare.setAttribute('role', 'link');
      twitterShare.setAttribute('aria-label', 'Click to share to twitter');
      twitterShare.setAttribute('aria-hidden', 'true');
      const twitterImg = document.createElement('img');
      twitterImg.alt = 'svg file';
      twitterImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775569357866.svg+xml'; // Placeholder
      twitterShare.append(twitterImg);
      crtPopupShareIconContainerIcons.append(twitterImg);

      crtPopupShareIconContainer.append(crtPopupShareIconContainerIcons);
      crtPostShare.append(crtPopupShareIconContainer);
      crtPostFooter.append(crtPostShare);

      // Event listener for share button
      crtShareButton.addEventListener('click', () => {
        crtPopupShareIconContainer.classList.toggle('active'); // Assuming 'active' class shows the popup
      });

      crtFeed.append(postDiv);
    }
  });

  // Remove the original block content
  block.textContent = '';
  block.append(crtViewportTracker, crtGridCol6);

  // Add the "Powered by Curator.io" link
  const crtLogo = document.createElement('a');
  crtLogo.classList.add('crt-logo', 'crt-tag');
  crtLogo.href = 'https://curator.io';
  crtLogo.target = '_blank';
  crtLogo.textContent = 'Powered by Curator.io';
  block.append(crtLogo);
}
