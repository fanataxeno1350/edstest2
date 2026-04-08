import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [legalRow, firstTimeBannerRow, ...itemRows] = [...block.children];

  // Content detection for item rows based on BlockJson and EDS structure
  const socialLinks = itemRows.filter((row) => row.children.length === 1 && row.querySelector('a'));
  const footerMenus = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('a'));
  const beLinks = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a'));

  block.textContent = '';

  const section = document.createElement('section');
  section.classList.add('component-global-footer', 'notranslate');
  block.append(section);

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const mainRow = document.createElement('div');
  mainRow.classList.add('row');
  container.append(mainRow);

  // Mobile Social Links
  const mobileSocialCol = document.createElement('div');
  mobileSocialCol.classList.add('col-12');
  mainRow.append(mobileSocialCol);

  const mobileSocial = document.createElement('div');
  mobileSocial.classList.add('footer-social', 'mobile');
  mobileSocialCol.append(mobileSocial);

  socialLinks.forEach((row) => {
    const link = row.querySelector('a');
    if (link) {
      const newLink = document.createElement('a');
      moveInstrumentation(link, newLink);
      newLink.href = link.href;
      newLink.target = '_blank';
      const url = new URL(link.href);
      const host = url.hostname;
      if (host.includes('facebook')) {
        newLink.classList.add('facebook');
        newLink.setAttribute('aria-label', 'facebook - open in a new tab');
        const icon = document.createElement('i');
        icon.classList.add('fa', 'fa-facebook');
        icon.setAttribute('aria-hidden', 'true');
        newLink.append(icon);
      } else if (host.includes('instagram')) {
        newLink.classList.add('instagram');
        newLink.setAttribute('aria-label', 'instagram - open in a new tab');
        const icon = document.createElement('i');
        icon.classList.add('fa', 'fa-instagram');
        icon.setAttribute('aria-hidden', 'true');
        newLink.append(icon);
      } else if (host.includes('linkedin')) {
        newLink.classList.add('linkedin');
        newLink.setAttribute('aria-label', 'linkedin - open in a new tab');
        const icon = document.createElement('i');
        icon.classList.add('fa', 'fa-linkedin');
        icon.setAttribute('aria-hidden', 'true');
        newLink.append(icon);
      } else if (host.includes('twitter')) {
        newLink.classList.add('twitter');
        newLink.setAttribute('aria-label', 'twitter - open in a new tab');
        const icon = document.createElement('i');
        icon.classList.add('fa', 'fa-twitter');
        icon.setAttribute('aria-hidden', 'true');
        newLink.append(icon);
      } else if (host.includes('youtube')) {
        newLink.classList.add('youtube');
        newLink.setAttribute('aria-label', 'youtube - open in a new tab');
        const icon = document.createElement('i');
        icon.classList.add('fa', 'fa-youtube');
        icon.setAttribute('aria-hidden', 'true');
        newLink.append(icon);
      } else if (host.includes('whatsapp')) {
        newLink.classList.add('whatsapp');
        newLink.setAttribute('aria-label', 'whatsapp - open in a new tab');
        const icon = document.createElement('i');
        icon.classList.add('fa', 'fa-whatsapp');
        icon.setAttribute('aria-hidden', 'true');
        newLink.append(icon);
      }
      mobileSocial.append(newLink);
    }
  });

  // Footer Menus
  footerMenus.forEach((row, index) => {
    const col = document.createElement('div');
    col.classList.add('col-lg-2');
    if (index === 0) {
      col.classList.add('offset-lg-1');
    }
    mainRow.append(col);

    const [headingCell, linksCell] = [...row.children]; // Corrected: Destructuring for direct cell access

    const headSpan = document.createElement('span');
    headSpan.classList.add('head');
    headSpan.append(headingCell.textContent);
    const openIcon = document.createElement('div');
    openIcon.classList.add('open-icon');
    headSpan.append(openIcon);
    col.append(headSpan);

    const ul = document.createElement('ul');
    const linksDiv = linksCell.querySelector('div');
    if (linksDiv) {
      [...linksDiv.children].forEach((linkRow) => {
        const li = document.createElement('li');
        moveInstrumentation(linkRow, li);
        li.classList.add('footer-menu-track');
        const link = linkRow.querySelector('a');
        if (link) {
          const newLink = document.createElement('a');
          newLink.href = link.href;
          newLink.textContent = link.textContent;
          li.append(newLink);
        }
        ul.append(li);
      });
    }
    col.append(ul);

    headSpan.addEventListener('click', () => {
      ul.classList.toggle('open');
      openIcon.classList.toggle('open');
    });
  });

  // Desktop Social Links and Footer Info
  const desktopInfoCol = document.createElement('div');
  desktopInfoCol.classList.add('col-lg-3', 'offset-lg-1');
  mainRow.append(desktopInfoCol);

  const desktopSocial = document.createElement('div');
  desktopSocial.classList.add('footer-social', 'desktop');
  desktopInfoCol.append(desktopSocial);

  socialLinks.forEach((row) => {
    const link = row.querySelector('a');
    if (link) {
      const newLink = document.createElement('a');
      moveInstrumentation(link, newLink);
      newLink.href = link.href;
      newLink.target = '_blank';
      const url = new URL(link.href);
      const host = url.hostname;
      if (host.includes('facebook')) {
        newLink.classList.add('facebook');
        newLink.setAttribute('aria-label', 'facebook - open in a new tab');
        const icon = document.createElement('i');
        icon.classList.add('fa', 'fa-facebook');
        icon.setAttribute('aria-hidden', 'true');
        newLink.append(icon);
      } else if (host.includes('instagram')) {
        newLink.classList.add('instagram');
        newLink.setAttribute('aria-label', 'instagram - open in a new tab');
        const icon = document.createElement('i');
        icon.classList.add('fa', 'fa-instagram');
        icon.setAttribute('aria-hidden', 'true');
        newLink.append(icon);
      } else if (host.includes('linkedin')) {
        newLink.classList.add('linkedin');
        newLink.setAttribute('aria-label', 'linkedin - open in a new tab');
        const icon = document.createElement('i');
        icon.classList.add('fa', 'fa-linkedin');
        icon.setAttribute('aria-hidden', 'true');
        newLink.append(icon);
      } else if (host.includes('twitter')) {
        newLink.classList.add('twitter');
        newLink.setAttribute('aria-label', 'twitter - open in a new tab');
        const icon = document.createElement('i');
        icon.classList.add('fa', 'fa-twitter');
        icon.setAttribute('aria-hidden', 'true');
        newLink.append(icon);
      } else if (host.includes('youtube')) {
        newLink.classList.add('youtube');
        newLink.setAttribute('aria-label', 'youtube - open in a new tab');
        const icon = document.createElement('i');
        icon.classList.add('fa', 'fa-youtube');
        icon.setAttribute('aria-hidden', 'true');
        newLink.append(icon);
      } else if (host.includes('whatsapp')) {
        newLink.classList.add('whatsapp');
        newLink.setAttribute('aria-label', 'whatsapp - open in a new tab');
        const icon = document.createElement('i');
        icon.classList.add('fa', 'fa-whatsapp');
        icon.setAttribute('aria-hidden', 'true');
        newLink.append(icon);
      }
      desktopSocial.append(newLink);
    }
  });

  const footerInfo = document.createElement('div');
  footerInfo.classList.add('footer-info');
  desktopInfoCol.append(footerInfo);

  const headline = document.createElement('div');
  headline.classList.add('headline');
  const img = document.createElement('img');
  img.src = '/themes/lionsclubs/images/brand/LI_Signature_1C_White.svg';
  img.setAttribute('role', 'presentation');
  img.alt = '';
  headline.append(img);
  footerInfo.append(headline);

  const addressDiv = document.createElement('div');
  addressDiv.classList.add('address');
  footerInfo.append(addressDiv);

  // Hardcoded address and phone from original HTML
  const addressLink = document.createElement('a');
  addressLink.href = 'https://goo.gl/maps/74BvQXQFC6u';
  addressLink.target = '_blank';
  addressLink.setAttribute('aria-label', '300 W. 22nd Street Oak Brook, IL 60523-8842 USA - open in a new tab');
  const p1 = document.createElement('p');
  p1.textContent = '300 W. 22nd Street';
  const p2 = document.createElement('p');
  p2.textContent = 'Oak Brook, IL 60523-8842 USA';
  addressLink.append(p1, p2);
  addressDiv.append(addressLink);

  const phoneLink = document.createElement('a');
  phoneLink.href = 'tel:+1 (630) 571-5466';
  const p3 = document.createElement('p');
  p3.textContent = '+1 (630) 571-5466';
  phoneLink.append(p3);
  addressDiv.append(phoneLink);

  // Be-Links (Also of Interest)
  if (beLinks.length > 0) {
    const beIxLinkBlock = document.createElement('div');
    beIxLinkBlock.classList.add('be-ix-link-block');
    container.append(beIxLinkBlock);

    const beRelatedLinkContainer = document.createElement('div');
    beRelatedLinkContainer.classList.add('be-related-link-container');
    beIxLinkBlock.append(beRelatedLinkContainer);

    const beLabel = document.createElement('div');
    beLabel.classList.add('be-label');
    beLabel.textContent = 'Also of Interest';
    beRelatedLinkContainer.append(beLabel);

    const beList = document.createElement('ul');
    beList.classList.add('be-list');
    beRelatedLinkContainer.append(beList);

    beLinks.forEach((row) => {
      const [urlCell, textCell] = [...row.children]; // Corrected: Destructuring for direct cell access
      const link = urlCell.querySelector('a');
      if (link && textCell) {
        const li = document.createElement('li');
        moveInstrumentation(row, li);
        li.classList.add('be-list-item');
        const newLink = document.createElement('a');
        newLink.classList.add('be-related-link');
        newLink.href = link.href;
        newLink.textContent = textCell.textContent;
        li.append(newLink);
        beList.append(li);
      }
    });
  }

  // Legal Section
  const footerLegalSection = document.createElement('div');
  footerLegalSection.classList.add('row', 'footer-legal-section');
  container.append(footerLegalSection);

  const legalCol = document.createElement('div');
  legalCol.classList.add('col-xs-11', 'offset-lg-1');
  footerLegalSection.append(legalCol);

  const legalP = document.createElement('p');
  legalP.classList.add('legal');
  moveInstrumentation(legalRow.firstElementChild, legalP);
  legalP.innerHTML = legalRow.firstElementChild.innerHTML;
  legalCol.append(legalP);

  // First Time Banner
  const firstTimeBannerDiv = document.createElement('div');
  firstTimeBannerDiv.classList.add('first-time-banner');
  firstTimeBannerDiv.style.display = 'block'; // Ensure it's visible based on original HTML
  section.append(firstTimeBannerDiv);

  const bannerContainer = document.createElement('div');
  bannerContainer.classList.add('container');
  firstTimeBannerDiv.append(bannerContainer);

  const welcomeDiv = document.createElement('div');
  welcomeDiv.classList.add('welcome');
  bannerContainer.append(welcomeDiv);

  const welcomeH4 = document.createElement('h4');
  welcomeH4.textContent = 'Welcome to Lions International!';
  welcomeDiv.append(welcomeH4);

  const promoBody = document.createElement('div');
  promoBody.classList.add('promo-body');
  moveInstrumentation(firstTimeBannerRow.firstElementChild, promoBody);
  promoBody.innerHTML = firstTimeBannerRow.firstElementChild.innerHTML;
  welcomeDiv.append(promoBody);

  const gdprMessage = document.createElement('div');
  gdprMessage.classList.add('gdpr-message');
  bannerContainer.append(gdprMessage);

  const gdprRow = document.createElement('div');
  gdprRow.classList.add('row');
  gdprMessage.append(gdprRow);

  const cookieBodyCol = document.createElement('div');
  cookieBodyCol.classList.add('col-md-6');
  gdprRow.append(cookieBodyCol);

  const cookieBody = document.createElement('div');
  cookieBody.classList.add('cookie-body');
  cookieBody.innerHTML = `By continuing to use this site, you acknowledge and agree to the storing of cookies on your device. If you do not agree to accept cookies, you must not use this site. <a href="/footer/privacy-policy">View our Privacy Policy</a> to learn more.`;
  cookieBodyCol.append(cookieBody);

  const ctaCol = document.createElement('div');
  ctaCol.classList.add('col-md-6');
  gdprRow.append(ctaCol);

  const ctaDiv = document.createElement('div');
  ctaDiv.classList.add('cta');
  ctaCol.append(ctaDiv);

  const acceptCookieBtn = document.createElement('a');
  acceptCookieBtn.classList.add('btn', 'bg-white', 'accept-cookie');
  acceptCookieBtn.setAttribute('tabindex', '0');
  acceptCookieBtn.textContent = 'Accept and Close';
  ctaDiv.append(acceptCookieBtn);

  acceptCookieBtn.addEventListener('click', () => {
    firstTimeBannerDiv.style.display = 'none';
  });

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
