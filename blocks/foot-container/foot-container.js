import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Fixed fields
  // According to BlockJson: itc-logo, itc-logo-link, foot-links (container), copyright, social-title, social-links (container)
  // The first two rows are fixed fields, the rest are item rows and other fixed fields.
  const itcLogoRow = children[0];
  const itcLogoLinkRow = children[1];

  const itcSection = document.createElement('section');
  itcSection.classList.add('itc');

  const itcLogoLink = document.createElement('a');
  const foundItcLogoLink = itcLogoLinkRow.querySelector('a');
  if (foundItcLogoLink) {
    itcLogoLink.href = foundItcLogoLink.href;
  }
  moveInstrumentation(itcLogoLinkRow, itcLogoLink);

  const itcLogoPicture = itcLogoRow.querySelector('picture');
  if (itcLogoPicture) {
    const img = itcLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    itcLogoLink.append(optimizedPic);
  }
  moveInstrumentation(itcLogoRow, itcLogoLink);
  itcSection.append(itcLogoLink);

  // Footer Links
  const footLinksSection = document.createElement('section');
  footLinksSection.classList.add('foot-links');

  // All rows after the first two fixed fields are item rows or other fixed fields.
  const remainingRows = children.slice(2);

  // Identify foot-link-item rows and social-link-item rows
  // foot-link-item: 2 cells, no picture
  // social-link-item: 2 cells, with picture in the first cell
  const footLinkItems = remainingRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && !cells[0].querySelector('picture');
  });

  const socialLinkItems = remainingRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('picture');
  });

  // Identify copyright and social title rows from the remaining rows that are not item rows
  const otherFixedRows = remainingRows.filter((row) =>
    !footLinkItems.includes(row) && !socialLinkItems.includes(row)
  );

  // The order of otherFixedRows should be: copyright, social-title
  const copyrightRow = otherFixedRows.find(row => !row.querySelector('h4') && !row.querySelector('a') && row.textContent.trim().length > 0);
  const socialTitleRow = otherFixedRows.find(row => row.textContent.trim().length > 0 && !footLinkItems.includes(row) && !socialLinkItems.includes(row) && row !== copyrightRow);


  footLinkItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      if (foundLink.getAttribute('target')) {
        anchor.target = foundLink.getAttribute('target');
      }
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, anchor);
    footLinksSection.append(anchor);
  });

  // Copyright Text
  if (copyrightRow) {
    const copyrightText = document.createElement('p');
    copyrightText.textContent = copyrightRow.textContent.trim();
    moveInstrumentation(copyrightRow, copyrightText);
    footLinksSection.append(copyrightText);
  }


  // Social Section Title
  const socialSection = document.createElement('section');
  socialSection.classList.add('footer-social-list-block');

  if (socialTitleRow) {
    const socialTitle = document.createElement('h4');
    socialTitle.classList.add('text-color-3', 'mb-20');
    socialTitle.textContent = socialTitleRow.textContent.trim();
    moveInstrumentation(socialTitleRow, socialTitle);
    socialSection.append(socialTitle);
  }

  // Social Links
  const socialIconList = document.createElement('div');
  socialIconList.classList.add('socialicon-list');
  const socialParagraph = document.createElement('p');
  socialParagraph.classList.add('mobi_paddBtm30');

  socialLinkItems.forEach((row) => {
    const [iconCell, linkCell] = [...row.children];
    const anchor = document.createElement('a');
    anchor.classList.add('text-color-4');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.target = '_blank'; // Original HTML has target="_blank" for social links
    }
    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '30' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      anchor.append(optimizedPic);
    }
    moveInstrumentation(row, anchor);
    socialParagraph.append(anchor);
  });
  socialIconList.append(socialParagraph);
  socialSection.append(socialIconList);

  block.innerHTML = ''; // Clear the block content
  block.classList.add('foot-container'); // Add back the block's own class
  block.append(itcSection, footLinksSection, socialSection);
}
