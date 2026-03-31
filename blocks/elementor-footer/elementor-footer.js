import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure root model fields based on BlockJson
  const [
    careersLinkRow,
    termsConditionsRow,
    disclaimerRow,
    followUsRow,
    socialLinksContainerRow, // This is a container for social links, not a social link itself
    siteLogoRow,
    siteLogoLinkRow,
    ...socialLinkItemRows // Remaining rows are social-link items
  ] = [...block.children];

  block.textContent = '';

  const elementorElementFa8725a = document.createElement('div');
  elementorElementFa8725a.classList.add('elementor-element', 'elementor-element-fa8725a', 'e-flex', 'e-con-boxed', 'e-con', 'e-parent', 'e-lazyloaded');
  block.append(elementorElementFa8725a);

  const eConInner = document.createElement('div');
  eConInner.classList.add('e-con-inner');
  elementorElementFa8725a.append(eConInner);

  const elementorElementDbd8f1f = document.createElement('div');
  elementorElementDbd8f1f.classList.add('elementor-element', 'elementor-element-dbd8f1f', 'e-con-full', 'e-flex', 'e-con', 'e-child');
  eConInner.append(elementorElementDbd8f1f);

  // Careers Link
  const careersLinkDiv = document.createElement('div');
  careersLinkDiv.classList.add('elementor-element', 'elementor-element-7aa018b', 'elementor-widget', 'elementor-widget-heading');
  moveInstrumentation(careersLinkRow, careersLinkDiv);
  elementorElementDbd8f1f.append(careersLinkDiv);

  const careersLinkContainer = document.createElement('div');
  careersLinkContainer.classList.add('elementor-widget-container');
  careersLinkDiv.append(careersLinkContainer);

  const careersLinkH2 = document.createElement('h2');
  careersLinkH2.classList.add('elementor-heading-title', 'elementor-size-default');
  const careersLinkAnchor = careersLinkRow.querySelector('a');
  if (careersLinkAnchor) {
    const newAnchor = document.createElement('a');
    newAnchor.href = careersLinkAnchor.href;
    newAnchor.textContent = careersLinkAnchor.textContent;
    careersLinkH2.append(newAnchor);
  } else {
    // Fallback if no anchor, though BlockJson specifies aem-content (link)
    careersLinkH2.textContent = careersLinkRow.textContent.trim();
  }
  careersLinkContainer.append(careersLinkH2);

  // Terms & Conditions
  const termsConditionsDiv = document.createElement('div');
  termsConditionsDiv.classList.add('elementor-element', 'elementor-element-4823a3d', 'elementor-widget', 'elementor-widget-heading');
  moveInstrumentation(termsConditionsRow, termsConditionsDiv);
  elementorElementDbd8f1f.append(termsConditionsDiv);

  const termsConditionsContainer = document.createElement('div');
  termsConditionsContainer.classList.add('elementor-widget-container');
  termsConditionsDiv.append(termsConditionsContainer);

  const termsConditionsH2 = document.createElement('h2');
  termsConditionsH2.classList.add('elementor-heading-title', 'elementor-size-default');
  // Read content from the first child div of the row
  termsConditionsH2.textContent = termsConditionsRow.children[0]?.textContent.trim();
  termsConditionsContainer.append(termsConditionsH2);

  // Disclaimer
  const disclaimerDiv = document.createElement('div');
  disclaimerDiv.classList.add('elementor-element', 'elementor-element-e54b1da', 'elementor-widget', 'elementor-widget-heading');
  moveInstrumentation(disclaimerRow, disclaimerDiv);
  elementorElementDbd8f1f.append(disclaimerDiv);

  const disclaimerContainer = document.createElement('div');
  disclaimerContainer.classList.add('elementor-widget-container');
  disclaimerDiv.append(disclaimerContainer);

  const disclaimerH2 = document.createElement('h2');
  disclaimerH2.classList.add('elementor-heading-title', 'elementor-size-default');
  // Read content from the first child div of the row
  disclaimerH2.textContent = disclaimerRow.children[0]?.textContent.trim();
  disclaimerContainer.append(disclaimerH2);

  const elementorElementDab152e = document.createElement('div');
  elementorElementDab152e.classList.add('elementor-element', 'elementor-element-dab152e', 'elementor-widget', 'elementor-widget-off-canvas');
  elementorElementDbd8f1f.append(elementorElementDab152e);

  const offCanvasContainer = document.createElement('div');
  offCanvasContainer.classList.add('elementor-widget-container');
  elementorElementDab152e.append(offCanvasContainer);

  const offCanvas = document.createElement('div');
  offCanvas.id = 'off-canvas-dab152e';
  offCanvas.classList.add('e-off-canvas');
  offCanvas.setAttribute('role', 'dialog');
  offCanvas.setAttribute('aria-hidden', 'true');
  offCanvas.setAttribute('aria-label', 'Redirection Notice');
  offCanvas.setAttribute('aria-modal', 'true');
  offCanvas.setAttribute('inert', '');
  offCanvas.setAttribute('data-delay-child-handlers', 'true');
  offCanvasContainer.append(offCanvas);

  const offCanvasOverlay = document.createElement('div');
  offCanvasOverlay.classList.add('e-off-canvas__overlay');
  offCanvas.append(offCanvasOverlay);

  const offCanvasMain = document.createElement('div');
  offCanvasMain.classList.add('e-off-canvas__main');
  offCanvas.append(offCanvasMain);

  const offCanvasContent = document.createElement('div');
  offCanvasContent.classList.add('e-off-canvas__content');
  offCanvasMain.append(offCanvasContent);

  const elementorElementE348ddb = document.createElement('div');
  elementorElementE348ddb.classList.add('elementor-element', 'elementor-element-e348ddb', 'e-con-full', 'e-flex', 'e-con', 'e-child');
  offCanvasContent.append(elementorElementE348ddb);

  const elementorElementE403dbb = document.createElement('div');
  elementorElementE403dbb.classList.add('elementor-element', 'elementor-element-e403dbb', 'e-con-full', 'e-flex', 'e-con', 'e-child');
  eConInner.append(elementorElementE403dbb);

  // Follow Us
  const followUsDiv = document.createElement('div');
  followUsDiv.classList.add('elementor-element', 'elementor-element-3c76dc7', 'elementor-widget', 'elementor-widget-heading');
  moveInstrumentation(followUsRow, followUsDiv);
  elementorElementE403dbb.append(followUsDiv);

  const followUsContainer = document.createElement('div');
  followUsContainer.classList.add('elementor-widget-container');
  followUsDiv.append(followUsContainer);

  const followUsH2 = document.createElement('h2');
  followUsH2.classList.add('elementor-heading-title', 'elementor-size-default');
  // Read content from the first child div of the row
  followUsH2.textContent = followUsRow.children[0]?.textContent.trim();
  followUsContainer.append(followUsH2);

  // Social Links
  const socialIconsDiv = document.createElement('div');
  socialIconsDiv.classList.add('elementor-element', 'elementor-element-0744dfb', 'e-grid-align-left', 'elementor-shape-rounded', 'elementor-grid-0', 'elementor-widget', 'elementor-widget-social-icons');
  moveInstrumentation(socialLinksContainerRow, socialIconsDiv); // Instrumentation for the container row
  elementorElementE403dbb.append(socialIconsDiv);

  const socialIconsContainer = document.createElement('div');
  socialIconsContainer.classList.add('elementor-widget-container');
  socialIconsDiv.append(socialIconsContainer);

  const socialIconsWrapper = document.createElement('div');
  socialIconsWrapper.classList.add('elementor-social-icons-wrapper', 'elementor-grid');
  socialIconsWrapper.setAttribute('role', 'list');
  socialIconsContainer.append(socialIconsWrapper);

  socialLinkItemRows.forEach((row) => {
    // Each social-link item row has 3 cells: Label, URL, Icon
    const labelCell = row.children[0];
    const urlCell = row.children[1];
    const iconCell = row.children[2];

    if (labelCell && urlCell && iconCell) {
      const span = document.createElement('span');
      span.classList.add('elementor-grid-item');
      span.setAttribute('role', 'listitem');
      moveInstrumentation(row, span);
      socialIconsWrapper.append(span);

      const link = document.createElement('a');
      link.classList.add('elementor-icon', 'elementor-social-icon'); // Specific social icon class will be added later if needed
      const foundLink = urlCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.target = '_blank';
        // Add specific social icon class based on the link's content or label
        const labelText = labelCell.textContent.trim().toLowerCase();
        if (labelText.includes('facebook')) {
          link.classList.add('elementor-social-icon-facebook', 'elementor-repeater-item-894622b');
        } else if (labelText.includes('instagram')) {
          link.classList.add('elementor-social-icon-instagram', 'elementor-repeater-item-4aedf71');
        } else if (labelText.includes('youtube')) {
          link.classList.add('elementor-social-icon-youtube', 'elementor-repeater-item-6d2e1de');
        } else if (labelText.includes('x-twitter')) {
          link.classList.add('elementor-social-icon-x-twitter', 'elementor-repeater-item-1079e6e');
        }
      }
      span.append(link);

      const screenOnlySpan = document.createElement('span');
      screenOnlySpan.classList.add('elementor-screen-only');
      screenOnlySpan.textContent = labelCell.textContent.trim();
      link.append(screenOnlySpan);

      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        if (img) {
          const newImg = document.createElement('img');
          newImg.src = img.src;
          newImg.alt = img.alt;
          link.append(newImg);
        }
      }
    }
  });

  const elementorElement2779fc3 = document.createElement('div');
  elementorElement2779fc3.classList.add('elementor-element', 'elementor-element-2779fc3', 'e-con-full', 'e-flex', 'e-con', 'e-child');
  eConInner.append(elementorElement2779fc3);

  // Site Logo
  const siteLogoDiv = document.createElement('div');
  siteLogoDiv.classList.add('elementor-element', 'elementor-element-0a043e5', 'elementor-widget', 'elementor-widget-theme-site-logo', 'elementor-widget-image');
  moveInstrumentation(siteLogoRow, siteLogoDiv);
  elementorElement2779fc3.append(siteLogoDiv);

  const siteLogoContainer = document.createElement('div');
  siteLogoContainer.classList.add('elementor-widget-container');
  siteLogoDiv.append(siteLogoContainer);

  const siteLogoLink = document.createElement('a');
  const foundSiteLogoLink = siteLogoLinkRow.querySelector('a'); // This is correct, siteLogoLinkRow is the 7th root row
  if (foundSiteLogoLink) {
    siteLogoLink.href = foundSiteLogoLink.href;
  } else {
    // Default to home if no link is provided
    siteLogoLink.href = '/';
  }
  siteLogoContainer.append(siteLogoLink);

  const siteLogoPicture = siteLogoRow.querySelector('picture'); // This is correct, siteLogoRow is the 6th root row
  if (siteLogoPicture) {
    const img = siteLogoPicture.querySelector('img');
    if (img) {
      const newImg = document.createElement('img');
      newImg.width = '503';
      newImg.height = '72';
      newImg.src = img.src;
      newImg.classList.add('attachment-full', 'size-full', 'wp-image-47');
      newImg.alt = img.alt;
      siteLogoLink.append(newImg);
    }
  }

  // Interactivity: Off-canvas modal
  const careersLinkElement = careersLinkH2.querySelector('a');
  const offCanvasElement = document.getElementById('off-canvas-dab152e');
  const offCanvasOverlayElement = offCanvasElement?.querySelector('.e-off-canvas__overlay');

  if (careersLinkElement && offCanvasElement && offCanvasOverlayElement) {
    careersLinkElement.addEventListener('click', (e) => {
      e.preventDefault();
      offCanvasElement.classList.add('e-off-canvas--open');
      offCanvasElement.removeAttribute('inert');
      offCanvasElement.setAttribute('aria-hidden', 'false');
    });

    offCanvasOverlayElement.addEventListener('click', () => {
      offCanvasElement.classList.remove('e-off-canvas--open');
      offCanvasElement.setAttribute('inert', '');
      offCanvasElement.setAttribute('aria-hidden', 'true');
    });

    // Add keyboard accessibility for closing with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && offCanvasElement.classList.contains('e-off-canvas--open')) {
        offCanvasElement.classList.remove('e-off-canvas--open');
        offCanvasElement.setAttribute('inert', '');
        offCanvasElement.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
