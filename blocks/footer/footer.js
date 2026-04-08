import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    backToTopIconRow,
    backToTopLabelRow,
    copyrightRow,
    ...itemRows
  ] = [...block.children];

  block.textContent = '';
  block.setAttribute('role', 'contentinfo');

  const container = document.createElement('div');
  container.classList.add('container');
  block.append(container);

  // Logo and Back to Top
  const footerLogoBtp = document.createElement('div');
  footerLogoBtp.classList.add('footer__logo-btp');
  container.append(footerLogoBtp);

  const logoLink = document.createElement('a');
  logoLink.classList.add('footer__logo');
  moveInstrumentation(logoLinkRow, logoLink);
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
    logoLink.setAttribute('aria-label', 'PEPSICO');
  }

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  } else {
    moveInstrumentation(logoRow, logoLink);
    while (logoRow.firstChild) logoLink.append(logoRow.firstChild);
  }
  footerLogoBtp.append(logoLink);

  const backToTopButton = document.createElement('button');
  backToTopButton.classList.add('back-to-top__button');
  backToTopButton.setAttribute('data-function', 'back-to-top');
  backToTopButton.setAttribute('aria-label', 'Back to top');
  moveInstrumentation(backToTopLabelRow, backToTopButton);
  backToTopButton.textContent = backToTopLabelRow.textContent.trim();

  const backToTopSpan = document.createElement('span');
  const backToTopIconPicture = backToTopIconRow.querySelector('picture');
  if (backToTopIconPicture) {
    const img = backToTopIconPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    backToTopSpan.append(optimizedPic);
  } else {
    moveInstrumentation(backToTopIconRow, backToTopSpan);
    while (backToTopIconRow.firstChild) backToTopSpan.append(backToTopIconRow.firstChild);
  }
  backToTopButton.append(backToTopSpan);
  footerLogoBtp.append(backToTopButton);

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Footer Links
  const footerLinks = document.createElement('div');
  footerLinks.classList.add('footer__links');
  container.append(footerLinks);

  const footerLinksRow = document.createElement('div');
  footerLinksRow.classList.add('footer__links-row');
  footerLinks.append(footerLinksRow);

  // Content detection for different item types
  const footerLinkGroups = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && !cells[0].querySelector('a') && !cells[1].querySelector('a');
  });
  const footerSocialLinks = itemRows.filter((row) => row.children.length === 3);
  const footerLinksItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('a') && !footerSocialLinks.includes(row);
  });
  const footerMoreSites = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('a') && !footerLinksItems.includes(row) && !footerSocialLinks.includes(row);
  });


  footerLinkGroups.forEach((groupRow) => {
    const groupDiv = document.createElement('div');
    moveInstrumentation(groupRow, groupDiv);

    const cells = [...groupRow.children];
    const titleCell = cells[0];
    const linksCell = cells[1];

    const title = document.createElement('h6');
    title.classList.add('footer__column-title');
    moveInstrumentation(titleCell, title);
    while (titleCell.firstChild) title.append(titleCell.firstChild);
    groupDiv.append(title);

    const ul = document.createElement('ul');
    ul.classList.add('footer__links-list');
    moveInstrumentation(linksCell, ul);
    // Assuming links in the linksCell are direct children, otherwise need to parse
    [...linksCell.children].forEach((linkEl) => {
      const li = document.createElement('li');
      li.classList.add('footer__link');
      moveInstrumentation(linkEl, li);
      while (linkEl.firstChild) li.append(linkEl.firstChild);
      ul.append(li);
    });
    groupDiv.append(ul);
    footerLinksRow.append(groupDiv);
  });

  // Social Links
  const socialLinksDiv = document.createElement('div');
  socialLinksDiv.classList.add('footer__social-links');
  container.append(socialLinksDiv);

  footerSocialLinks.forEach((socialLinkRow) => {
    const cells = [...socialLinkRow.children];
    const urlCell = cells[0];
    const iconCell = cells[1];
    const labelCell = cells[2];

    const link = document.createElement('a');
    link.classList.add('social-link');
    moveInstrumentation(socialLinkRow, link);

    const foundLink = urlCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.target = '_blank';
      link.setAttribute('aria-label', labelCell.textContent.trim().toLowerCase());
      // Add specific social link class based on label or URL
      if (link.href.includes('facebook')) link.classList.add('social-link--facebook');
      if (link.href.includes('twitter')) link.classList.add('social-link--twitter');
      if (link.href.includes('youtube')) link.classList.add('social-link--youtube');
      if (link.href.includes('linkedin')) link.classList.add('social-link--linkedin');
      if (link.href.includes('instagram')) link.classList.add('social-link--instagram');
    }

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      link.append(optimizedPic);
    } else {
      moveInstrumentation(iconCell, link);
      while (iconCell.firstChild) link.append(iconCell.firstChild);
    }
    socialLinksDiv.append(link);
  });

  // Auxiliary Links and Copyright
  const auxiliaryDiv = document.createElement('div');
  auxiliaryDiv.classList.add('footer__auxilliaries');
  container.append(auxiliaryDiv);

  const copyrightSpan = document.createElement('span');
  copyrightSpan.classList.add('footer__copyright');
  moveInstrumentation(copyrightRow, copyrightSpan);
  while (copyrightRow.firstChild) copyrightSpan.append(copyrightRow.firstChild);
  auxiliaryDiv.append(copyrightSpan);

  footerLinksItems.forEach((linkRow) => {
    const cells = [...linkRow.children];
    const urlCell = cells[0];
    const labelCell = cells[1];

    const link = document.createElement('a');
    moveInstrumentation(linkRow, link);

    const foundLink = urlCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.setAttribute('aria-label', labelCell.textContent.trim());
    }
    link.textContent = labelCell.textContent.trim();
    auxiliaryDiv.append(link);
  });

  // More Sites
  const moreSitesDiv = document.createElement('div');
  moreSitesDiv.classList.add('footer__more-sites');
  container.append(moreSitesDiv);

  const moreSitesList = document.createElement('ul');
  moreSitesList.classList.add('more-sites__list');
  moreSitesDiv.append(moreSitesList);

  footerMoreSites.forEach((siteRow) => {
    const cells = [...siteRow.children];
    const urlCell = cells[0];
    const labelCell = cells[1];

    const li = document.createElement('li');
    moveInstrumentation(siteRow, li);

    const link = document.createElement('a');
    const foundLink = urlCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.target = '_blank';
    }
    link.textContent = labelCell.textContent.trim();
    li.append(link);
    moreSitesList.append(li);
  });

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
