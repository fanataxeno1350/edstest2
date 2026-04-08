import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    countrySelectorImageRow,
    countrySelectorLinkRow,
    countryLabelRow,
    socialTitleRow,
    ...itemRows
  ] = [...block.children];

  // Check 0 & 1: Structure Alignment - using content detection for item rows
  const footerSocialLinks = itemRows.filter((row) => row.children.length === 2 && row.querySelector('picture'));
  const footerSiteLinks = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture'));
  // Fix: Replaced row.children[0] with content detection for legalLinkRow
  const legalLinkRowContent = itemRows.find((row) => row.children.length === 1 && row.querySelector('a'));

  block.textContent = '';
  block.classList.add('grid-container');

  const footerSection = document.createElement('section');
  footerSection.classList.add('footer-section', 'grid-container');
  footerSection.setAttribute('aria-label', 'Global Footer Module');

  const logoLangContainer = document.createElement('div');
  logoLangContainer.classList.add('logo-lang-container');

  // Logo
  const footerLogo = document.createElement('div');
  footerLogo.classList.add('footer-logo');
  const logoLink = document.createElement('a');
  const logoA = logoLinkRow.querySelector('a');
  if (logoA) {
    logoLink.href = logoA.href;
    logoLink.title = 'Nescafe Logo';
    logoLink.setAttribute('aria-label', 'Nescafe logo links to the home page');
  }
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    const optimizedLogoPic = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(logoImg, optimizedLogoPic.querySelector('img'));
    logoLink.append(optimizedLogoPic);
  }
  moveInstrumentation(logoRow, footerLogo);
  moveInstrumentation(logoLinkRow, logoLink);
  footerLogo.append(logoLink);
  logoLangContainer.append(footerLogo);

  // Country Selector
  const countrySelectorLink = document.createElement('a');
  const countryLinkA = countrySelectorLinkRow.querySelector('a');
  if (countryLinkA) {
    countrySelectorLink.href = countryLinkA.href;
    countrySelectorLink.title = 'India';
    countrySelectorLink.classList.add('link--underlined', 'country-selector');
    countrySelectorLink.setAttribute('aria-label', 'Link to select language and country');
  }
  const countryPicture = countrySelectorImageRow.querySelector('picture');
  if (countryPicture) {
    const countryImg = countryPicture.querySelector('img');
    const optimizedCountryPic = createOptimizedPicture(countryImg.src, countryImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(countryImg, optimizedCountryPic.querySelector('img'));
    countrySelectorLink.append(optimizedCountryPic);
  }
  const countryLabelSpan = document.createElement('span');
  countryLabelSpan.classList.add('labelMediumRegular');
  moveInstrumentation(countryLabelRow, countryLabelSpan);
  while (countryLabelRow.firstChild) countryLabelSpan.append(countryLabelRow.firstChild);
  countrySelectorLink.append(countryLabelSpan);
  moveInstrumentation(countrySelectorImageRow, countrySelectorLink);
  moveInstrumentation(countrySelectorLinkRow, countrySelectorLink);
  logoLangContainer.append(countrySelectorLink);
  footerSection.append(logoLangContainer);

  // Social Links
  const footerSocial = document.createElement('div');
  footerSocial.classList.add('footer-social');
  const socialTitleSpan = document.createElement('span');
  socialTitleSpan.classList.add('utilityLegend', 'footer-social-title');
  moveInstrumentation(socialTitleRow, socialTitleSpan);
  while (socialTitleRow.firstChild) socialTitleSpan.append(socialTitleRow.firstChild);
  footerSocial.append(socialTitleSpan);

  const socialUl = document.createElement('ul');
  socialUl.classList.add('footer-social-links');
  footerSocialLinks.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    const cells = [...row.children];
    const linkCell = cells.find((cell) => cell.querySelector('a'));
    const iconCell = cells.find((cell) => cell.querySelector('picture'));

    if (linkCell) {
      const socialLink = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        socialLink.href = foundLink.href;
        socialLink.setAttribute('aria-label', foundLink.textContent);
        socialLink.title = foundLink.textContent;
      }
      if (iconCell) {
        const iconPicture = iconCell.querySelector('picture');
        const iconImg = iconPicture ? iconPicture.querySelector('img') : null;
        if (iconImg) {
          const optimizedIconPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
          moveInstrumentation(iconImg, optimizedIconPic.querySelector('img'));
          socialLink.append(optimizedIconPic);
        }
      }
      li.append(socialLink);
    }
    socialUl.append(li);
  });
  footerSocial.append(socialUl);
  footerSection.append(footerSocial);

  // Site Links
  const footerSiteLinksContainer = document.createElement('div');
  footerSiteLinksContainer.classList.add('footer-site-links');

  const footerLinksDiv = document.createElement('div');
  footerLinksDiv.classList.add('footer-links');
  const siteUl = document.createElement('ul');
  footerSiteLinks.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    const cells = [...row.children];
    const linkCell = cells.find((cell) => cell.querySelector('a'));
    const labelCell = cells.find((cell) => !cell.querySelector('a') && !cell.querySelector('picture'));

    if (linkCell) {
      const siteLink = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        siteLink.href = foundLink.href;
        siteLink.title = foundLink.textContent;
        siteLink.classList.add('labelMediumRegular');
        if (foundLink.textContent.includes('Nestlé Professional')) {
          siteLink.classList.add('external');
          siteLink.target = '_blank';
          siteLink.setAttribute('data-once', 'ln_datalayer_outbound_link');
        }
      }
      if (labelCell) {
        while (labelCell.firstChild) siteLink.append(labelCell.firstChild);
      }
      li.append(siteLink);
    }
    siteUl.append(li);
  });
  footerLinksDiv.append(siteUl);
  footerSiteLinksContainer.append(footerLinksDiv);

  // Legal Link
  const legalLinksDiv = document.createElement('div');
  legalLinksDiv.classList.add('legal-links');
  const legalA = document.createElement('a');
  if (legalLinkRowContent) { // Use the content-detected row
    const foundLegalLink = legalLinkRowContent.querySelector('a');
    if (foundLegalLink) {
      legalA.href = foundLegalLink.href;
      legalA.title = foundLegalLink.textContent;
      legalA.classList.add('utilityNav');
      legalA.setAttribute('aria-label', '');
      while (foundLegalLink.firstChild) legalA.append(foundLegalLink.firstChild);
    }
    moveInstrumentation(legalLinkRowContent, legalA);
  }
  legalLinksDiv.append(legalA);
  footerSiteLinksContainer.append(legalLinksDiv);
  footerSection.append(footerSiteLinksContainer);

  const feedbackDiv = document.createElement('div');
  feedbackDiv.classList.add('feedback_alt_text');
  feedbackDiv.setAttribute('data-alttext', 'qsiFeedback Button');
  footerSection.append(feedbackDiv);

  block.append(footerSection);

  // This part is for optimizing pictures that might be added directly to the block,
  // not necessarily part of the structured content.
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
