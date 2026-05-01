import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Identify root fields based on content and position
  const itcLogoRow = children.find(row => row.querySelector('picture'));
  const itcLogoLinkRow = children.find(row => row.querySelector('a') && !row.querySelector('picture'));
  const copyrightRow = children.find(row => !row.querySelector('a') && !row.querySelector('picture') && row.textContent.trim().toLowerCase().includes('copyright'));

  // Filter out the identified root rows to get only item rows
  const itemRows = children.filter(row => row !== itcLogoRow && row !== itcLogoLinkRow && row !== copyrightRow);

  // Distinguish item rows based on their content
  const footerLinkRows = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture'));
  const socialLinkRows = itemRows.filter((row) => row.children.length === 2 && row.querySelector('picture'));

  block.innerHTML = '';
  block.classList.add('foot-container');

  // ITC Section
  const itcSection = document.createElement('section');
  itcSection.classList.add('itc');
  if (itcLogoRow) {
    moveInstrumentation(itcLogoRow, itcSection);
  }

  const itcLogoLink = document.createElement('a');
  if (itcLogoLinkRow) {
    const itcLogoAnchor = itcLogoLinkRow.querySelector('a');
    if (itcLogoAnchor) {
      itcLogoLink.href = itcLogoAnchor.href;
    }
  }

  if (itcLogoRow) {
    const itcLogoPicture = itcLogoRow.querySelector('picture');
    if (itcLogoPicture) {
      const img = itcLogoPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      itcLogoLink.append(optimizedPic);
    }
  }
  itcSection.append(itcLogoLink);
  block.append(itcSection);

  // Footer Links Section
  const footLinksSection = document.createElement('section');
  footLinksSection.classList.add('foot-links');

  footerLinkRows.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a')); // Label cell is plain text
    const linkCell = cells.find(cell => cell.querySelector('a')); // Link cell contains an anchor

    const link = document.createElement('a');
    if (linkCell) {
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      }
    }
    if (labelCell) {
      link.textContent = labelCell.textContent.trim();
    }
    moveInstrumentation(row, link);
    footLinksSection.append(link);
  });

  // Copyright
  if (copyrightRow) {
    const copyrightP = document.createElement('p');
    copyrightP.textContent = copyrightRow.textContent.trim();
    moveInstrumentation(copyrightRow, copyrightP);
    footLinksSection.append(copyrightP);
  }
  block.append(footLinksSection);

  // Social Links Section
  const socialSection = document.createElement('section');
  socialSection.classList.add('footer-social-list-block');

  const socialTitle = document.createElement('h4');
  socialTitle.classList.add('text-color-3', 'mb-20');
  socialTitle.textContent = 'Follow us on'; // Hardcoded as per original HTML

  const socialIconListDiv = document.createElement('div');
  socialIconListDiv.classList.add('socialicon-list');

  const socialIconP = document.createElement('p');
  socialIconP.classList.add('mobi_paddBtm30');

  socialLinkRows.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture')); // Icon cell contains a picture
    const linkCell = cells.find(cell => cell.querySelector('a') && !cell.querySelector('picture')); // Link cell contains an anchor

    const link = document.createElement('a');
    link.classList.add('text-color-4');
    if (linkCell) {
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      }
    }

    if (iconCell) {
      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '30' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        link.append(optimizedPic);
      }
    }
    moveInstrumentation(row, link);
    socialIconP.append(link);
  });

  socialIconListDiv.append(socialIconP);
  socialSection.append(socialTitle, socialIconListDiv);
  block.append(socialSection);
}
