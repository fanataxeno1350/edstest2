import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    itcLogoRow,
    itcLogoLinkRow,
    copyrightRow,
    followUsHeadingRow,
    ...itemRows
  ] = [...block.children];

  block.innerHTML = ''; // Clear the block content

  const footer = document.createElement('footer');
  const footContainer = document.createElement('div');
  footContainer.classList.add('foot-container');

  // ITC Logo Section
  const itcSection = document.createElement('section');
  itcSection.classList.add('itc');
  const itcLogoLink = document.createElement('a');
  const itcLogoHref = itcLogoLinkRow.querySelector('a')?.href || '#';
  itcLogoLink.href = itcLogoHref;

  const itcLogoPicture = itcLogoRow.querySelector('picture');
  if (itcLogoPicture) {
    const img = itcLogoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      itcLogoLink.append(optimizedPic);
    }
  }
  moveInstrumentation(itcLogoLinkRow, itcLogoLink);
  itcSection.append(itcLogoLink);
  footContainer.append(itcSection);

  // Footer Links Section
  const footLinksSection = document.createElement('section');
  footLinksSection.classList.add('foot-links');

  const footerLinks = itemRows.filter((row) => {
    const cells = [...row.children];
    // A footer link item has a text label and an aem-content link, no picture
    return cells.length === 2 && !cells.some(cell => cell.querySelector('picture'));
  });

  footerLinks.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    if (labelCell && linkCell) {
      const link = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        if (foundLink.getAttribute('target')) {
          link.target = foundLink.getAttribute('target');
        }
      }
      link.textContent = labelCell.textContent.trim();
      moveInstrumentation(row, link);
      footLinksSection.append(link);
    }
  });

  // Copyright
  const copyrightP = document.createElement('p');
  copyrightP.textContent = copyrightRow.textContent.trim();
  moveInstrumentation(copyrightRow, copyrightP);
  footLinksSection.append(copyrightP);
  footContainer.append(footLinksSection);

  // Social Links Section
  const footerSocialListBlock = document.createElement('section');
  footerSocialListBlock.classList.add('footer-social-list-block');

  const followUsHeading = document.createElement('h4');
  followUsHeading.classList.add('text-color-3', 'mb-20');
  followUsHeading.textContent = followUsHeadingRow.textContent.trim();
  moveInstrumentation(followUsHeadingRow, followUsHeading);
  footerSocialListBlock.append(followUsHeading);

  const socialIconListDiv = document.createElement('div');
  socialIconListDiv.classList.add('socialicon-list');
  const socialP = document.createElement('p');
  socialP.classList.add('mobi_paddBtm30');

  const socialLinks = itemRows.filter((row) => {
    const cells = [...row.children];
    // A social link item has a picture icon and an aem-content link
    return cells.length === 2 && cells.some(cell => cell.querySelector('picture'));
  });

  socialLinks.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    if (iconCell && linkCell) {
      const socialLink = document.createElement('a');
      socialLink.classList.add('text-color-4');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        socialLink.href = foundLink.href;
        socialLink.target = '_blank';
      }

      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '30' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          socialLink.append(optimizedPic);
        }
      }
      moveInstrumentation(row, socialLink);
      socialP.append(socialLink);
    }
  });

  socialIconListDiv.append(socialP);
  footerSocialListBlock.append(socialIconListDiv);
  footContainer.append(footerSocialListBlock);

  footer.append(footContainer);
  block.append(footer);
}
