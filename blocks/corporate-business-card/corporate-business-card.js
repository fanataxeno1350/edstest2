import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, ...itemRows] = [...block.children];

  const gContainer = document.createElement('div');
  gContainer.classList.add('g-container');

  // Title
  const titleP = document.createElement('p');
  titleP.classList.add('business-card-title');
  moveInstrumentation(titleRow, titleP);
  titleP.textContent = titleRow.firstElementChild?.textContent?.trim() || '';
  gContainer.append(titleP);

  const hr = document.createElement('hr');
  hr.classList.add('business-card-title-hr');
  gContainer.append(hr);

  const businessCardContainer = document.createElement('div');
  businessCardContainer.classList.add('business-card-container');

  itemRows.forEach((row) => {
    const businessCardItem = document.createElement('div');
    businessCardItem.classList.add('business-card-item');
    moveInstrumentation(row, businessCardItem);

    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    businessCardItem.append(overlay);

    const assetsDiv = document.createElement('div');
    assetsDiv.classList.add('business-card-item-assets');

    const cells = [...row.children];
    // Use content detection instead of index access
    const videoPosterDesktopCell = cells.find(cell => cell.querySelector('picture') && cell.textContent.includes('Video Poster Desktop')) || cells[0];
    const videoPosterMobileCell = cells.find(cell => cell.querySelector('picture') && cell.textContent.includes('Video Poster Mobile')) || cells[1];
    const logoCell = cells.find(cell => cell.querySelector('picture') && !cell.textContent.includes('Video Poster')) || cells[2];
    const headingCell = cells.find(cell => cell.querySelector('h3')) || cells[3];
    const subtitleCell = cells.find(cell => cell.querySelector('p')) || cells[4];
    const ctaLinkCell = cells.find(cell => cell.querySelector('a')) || cells[5];
    const ctaTextCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('p') && !cell.querySelector('h3') && !cell.querySelector('picture')) || cells[6];


    // Video placeholder (no video JS loaded, just poster image)
    const videoDiv = document.createElement('div');
    videoDiv.classList.add('video-js', 'business-card__video');
    // For simplicity, we'll only use the desktop poster for the placeholder image
    const desktopPic = videoPosterDesktopCell?.querySelector('picture');
    if (desktopPic) {
      const img = desktopPic.querySelector('img');
      if (img) {
        const posterImg = document.createElement('img');
        posterImg.loading = 'lazy';
        posterImg.alt = img.alt;
        posterImg.src = img.src;
        videoDiv.append(posterImg);
      }
    }
    assetsDiv.append(videoDiv);
    businessCardItem.append(assetsDiv);

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('business-card-item-info');

    const logoDiv = document.createElement('div');
    logoDiv.classList.add('business-card-item-logo');
    const logoPicture = logoCell?.querySelector('picture');
    if (logoPicture) {
      const newLogoPicture = document.createElement('picture');
      const img = logoPicture.querySelector('img');
      if (img) {
        const optimizedLogo = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
        moveInstrumentation(img, optimizedLogo.querySelector('img'));
        newLogoPicture.replaceWith(optimizedLogo);
        logoDiv.append(optimizedLogo);
      }
    }
    infoDiv.append(logoDiv);

    const descDiv = document.createElement('div');
    descDiv.classList.add('business-card-item-desc');

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('business-card-item-title');
    const h3 = document.createElement('h3');
    h3.textContent = headingCell?.textContent.trim() || '';
    titleDiv.append(h3);
    descDiv.append(titleDiv);

    const subtitleP = document.createElement('p');
    subtitleP.classList.add('business-card-item-subtitle');
    subtitleP.textContent = subtitleCell?.textContent.trim() || '';
    descDiv.append(subtitleP);

    const ctaLink = ctaLinkCell?.querySelector('a');
    if (ctaLink) {
      const newCtaLink = document.createElement('a');
      newCtaLink.classList.add('button', 'button-primary-white');
      newCtaLink.href = ctaLink.href;
      newCtaLink.textContent = ctaTextCell?.textContent.trim() || '';
      if (ctaLink.target) newCtaLink.target = ctaLink.target;
      if (ctaLink.rel) newCtaLink.rel = ctaLink.rel;
      descDiv.append(newCtaLink);
    }
    infoDiv.append(descDiv);
    businessCardItem.append(infoDiv);
    businessCardContainer.append(businessCardItem);
  });

  gContainer.append(businessCardContainer);

  block.textContent = '';
  block.append(gContainer);

  // Optimize images within the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
