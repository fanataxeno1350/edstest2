import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    itcLogoRow,
    fssaiLogoRow,
    subscribeImageRow,
    subscribeTitleRow,
    subscribeApiUrlRow,
    subscribeSuccessMessageRow,
    subscribeFailureMessageRow,
    subscribeEmailPlaceholderRow,
    subscribeButtonTextRow,
    subscribeConsentTextRow,
    privacyPolicyLinkRow,
    itcPortalLinkRow,
    copyrightTextRow,
    navigationTextRow,
    ...socialLinkRows
  ] = [...block.children];

  block.innerHTML = ''; // Clear the block content

  const container = document.createElement('div');
  container.classList.add('container');
  const cmpContainer = document.createElement('div');
  cmpContainer.classList.add('cmp-container');
  const footerEl = document.createElement('div');
  footerEl.classList.add('footer');
  footerEl.setAttribute('data-component', 'footer');
  footerEl.setAttribute('aria-label', 'desktop altext');
  cmpContainer.append(footerEl);
  container.append(cmpContainer);
  block.append(container);

  const cmpFooter = document.createElement('div');
  cmpFooter.classList.add('cmp-footer');
  footerEl.append(cmpFooter);

  // Top content
  const cmpFooterTopContent = document.createElement('div');
  cmpFooterTopContent.classList.add('cmp-footer__top-content');
  cmpFooter.append(cmpFooterTopContent);

  // Nav Logo section
  const cmpFooterNavLogo = document.createElement('div');
  cmpFooterNavLogo.classList.add('cmp-footer__nav-logo');
  cmpFooterTopContent.append(cmpFooterNavLogo);

  const cmpFooterNavLogoTop = document.createElement('div');
  cmpFooterNavLogoTop.classList.add('cmp-footer__nav-logo--top');
  cmpFooterNavLogo.append(cmpFooterNavLogoTop);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image', 'cmp-footer__logo');
  const logoLink = logoLinkRow.querySelector('a');
  const logoPicture = logoRow.querySelector('picture');
  if (logoLink && logoPicture) {
    const a = document.createElement('a');
    a.classList.add('cmp-image__link');
    a.href = logoLink.href;
    moveInstrumentation(logoLink, a);
    a.append(logoPicture);
    logoDiv.append(a);
  } else if (logoPicture) {
    logoDiv.append(logoPicture);
  }
  cmpFooterNavLogoTop.append(logoDiv);

  const cmpFooterNavLogoBottom = document.createElement('div');
  cmpFooterNavLogoBottom.classList.add('cmp-footer__nav-logo--bottom');
  cmpFooterNavLogo.append(cmpFooterNavLogoBottom);

  // ITC Logo
  const itcLogoDiv = document.createElement('div');
  itcLogoDiv.classList.add('logoitc', 'logo', 'image', 'cmp-footer__itc_logo');
  const itcLogoPicture = itcLogoRow.querySelector('picture');
  if (itcLogoPicture) {
    itcLogoDiv.append(itcLogoPicture);
  }
  cmpFooterNavLogoBottom.append(itcLogoDiv);

  // FSSAI Logo
  const fssaiLogoDiv = document.createElement('div');
  fssaiLogoDiv.classList.add('logofssai', 'logo', 'image', 'cmp-footer__fssai_logo');
  const fssaiLogoPicture = fssaiLogoRow.querySelector('picture');
  if (fssaiLogoPicture) {
    fssaiLogoDiv.append(fssaiLogoPicture);
  }
  cmpFooterNavLogoBottom.append(fssaiLogoDiv);

  // Subscribe Now section
  const subscribeDiv = document.createElement('div');
  subscribeDiv.classList.add('cmp-footer__nav-subscribe');
  subscribeDiv.setAttribute('data-register-api-url', subscribeApiUrlRow.querySelector('a')?.href || '');
  subscribeDiv.setAttribute('data-popup-success-message', subscribeSuccessMessageRow.textContent.trim());
  subscribeDiv.setAttribute('data-popup-failure-message', subscribeFailureMessageRow.textContent.trim());
  cmpFooterTopContent.append(subscribeDiv);

  const subscribeTextDiv = document.createElement('div');
  subscribeTextDiv.classList.add('cmp-footer__nav-text');
  const subscribeImage = subscribeImageRow.querySelector('picture img');
  if (subscribeImage) {
    const img = document.createElement('img');
    img.src = subscribeImage.src;
    img.alt = subscribeImage.alt;
    img.loading = 'lazy';
    img.fetchpriority = 'low';
    subscribeTextDiv.append(img);
  }
  const subscribeTitle = document.createElement('h3');
  subscribeTitle.textContent = subscribeTitleRow.textContent.trim();
  subscribeTextDiv.append(subscribeTitle);
  subscribeDiv.append(subscribeTextDiv);

  const inputContainer = document.createElement('div');
  inputContainer.classList.add('container', 'responsivegrid', 'cmp-input');
  const emailInputDiv = document.createElement('div');
  emailInputDiv.classList.add('text', 'aem-GridColumn', 'aem-GridColumn--default--12', 'cmp-input__email');
  const formTextDiv = document.createElement('div');
  formTextDiv.classList.add('cmp-form-text');
  formTextDiv.setAttribute('data-cmp-required-message', 'This field is required');
  formTextDiv.setAttribute('data-cmp-valid-email', 'Please enter valid email id');
  const emailInput = document.createElement('input');
  emailInput.classList.add('cmp-form-text__text');
  emailInput.type = 'email';
  emailInput.placeholder = subscribeEmailPlaceholderRow.textContent.trim();
  emailInput.name = 'email';
  formTextDiv.append(emailInput);
  emailInputDiv.append(formTextDiv);
  inputContainer.append(emailInputDiv);
  subscribeDiv.append(inputContainer);

  const errorMessageDiv = document.createElement('div');
  errorMessageDiv.classList.add('cmp-footer__error-message');
  subscribeDiv.append(errorMessageDiv);

  const consentDiv = document.createElement('div');
  consentDiv.classList.add('cmp-footer__consent');
  const consentCheckbox = document.createElement('input');
  consentCheckbox.type = 'checkbox';
  consentCheckbox.id = 'i_agree';
  consentCheckbox.name = 'i_agree';
  consentCheckbox.value = 'i_agree';
  consentCheckbox.classList.add('cmp-footer__consent--checkbox');
  const consentLinkDiv = document.createElement('div');
  consentLinkDiv.classList.add('cmp-footer__consent--link');
  const consentP = document.createElement('p');
  const privacyPolicyAnchor = privacyPolicyLinkRow.querySelector('a');
  if (privacyPolicyAnchor) {
    const privacyLink = document.createElement('a');
    privacyLink.href = privacyPolicyAnchor.href;
    privacyLink.target = '_self';
    privacyLink.rel = 'noopener noreferrer';
    privacyLink.textContent = 'Privacy Policy';
    consentP.innerHTML = `${subscribeConsentTextRow.textContent.trim()} `;
    consentP.append(privacyLink);
    consentP.append(' and to receive marketing emails from the Aashirvaad community');
  } else {
    consentP.textContent = subscribeConsentTextRow.textContent.trim();
  }
  consentLinkDiv.append(consentP);
  consentDiv.append(consentCheckbox, consentLinkDiv);
  subscribeDiv.append(consentDiv);

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'cmp-button--primary', 'cmp-button--primary-anchor-dark');
  const subscribeButton = document.createElement('button');
  subscribeButton.type = 'button';
  subscribeButton.classList.add('cmp-button');
  subscribeButton.setAttribute('data-request', 'true');
  subscribeButton.disabled = true;
  const buttonTextSpan = document.createElement('span');
  buttonTextSpan.classList.add('cmp-button__text');
  buttonTextSpan.textContent = subscribeButtonTextRow.textContent.trim();
  subscribeButton.append(buttonTextSpan);
  buttonDiv.append(subscribeButton);
  subscribeDiv.append(buttonDiv);

  // Enable/disable subscribe button based on checkbox and email input
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const updateButtonState = () => {
    const isChecked = consentCheckbox.checked;
    const isEmailValid = validateEmail(emailInput.value);
    subscribeButton.disabled = !(isChecked && isEmailValid);
  };

  consentCheckbox.addEventListener('change', updateButtonState);
  emailInput.addEventListener('input', updateButtonState);

  subscribeButton.addEventListener('click', async () => {
    if (subscribeButton.disabled) return;

    const email = emailInput.value;
    const apiUrl = subscribeDiv.getAttribute('data-register-api-url');
    const successMessage = subscribeDiv.getAttribute('data-popup-success-message');
    const failureMessage = subscribeDiv.getAttribute('data-popup-failure-message');

    errorMessageDiv.textContent = ''; // Clear previous messages

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        errorMessageDiv.textContent = successMessage;
        errorMessageDiv.style.color = 'green';
        emailInput.value = ''; // Clear email input on success
        consentCheckbox.checked = false; // Uncheck consent checkbox
        updateButtonState(); // Update button state
      } else {
        errorMessageDiv.textContent = failureMessage;
        errorMessageDiv.style.color = 'red';
      }
    } catch (error) {
      errorMessageDiv.textContent = failureMessage;
      errorMessageDiv.style.color = 'red';
    }
  });

  // Nav component for lists (Navigation)
  const cmpFooterNav = document.createElement('div');
  cmpFooterNav.classList.add('cmp-footer__nav');
  cmpFooterTopContent.append(cmpFooterNav);

  const cmpFooterNavItemsLeft = document.createElement('div');
  cmpFooterNavItemsLeft.classList.add('cmp-footer__nav-items', 'cmp-navigation__group--left');
  const navigationLeft = document.createElement('div');
  navigationLeft.classList.add('navigation');
  cmpFooterNavItemsLeft.append(navigationLeft);
  cmpFooterNav.append(cmpFooterNavItemsLeft);

  const cmpFooterNavItemsRight = document.createElement('div');
  cmpFooterNavItemsRight.classList.add('cmp-footer__nav-items', 'cmp-navigation__group--right');
  const navigationRight = document.createElement('div');
  navigationRight.classList.add('navigation');
  cmpFooterNavItemsRight.append(navigationRight);
  cmpFooterNav.append(cmpFooterNavItemsRight);

  // Parse and render navigation from richtext
  function parseNavTree(ul) {
    return [...ul.querySelectorAll(':scope > li')].map((li) => {
      let label = '';
      for (const node of li.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          label += node.textContent.trim();
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'UL') {
          label += node.textContent.trim();
        }
      }
      label = label.trim();

      const childUl = li.querySelector(':scope > ul');
      return { label, children: childUl ? parseNavTree(childUl) : [] };
    });
  }

  function renderNavItems(items, parentContainer) {
    items.forEach((item) => {
      const li = document.createElement('li');
      li.classList.add('cmp-navigation__item'); // Apply classes from ORIGINAL HTML

      if (item.children.length > 0) {
        // Parent item with children: create toggle + nested list
        const labelText = document.createElement('span');
        labelText.textContent = item.label;
        labelText.classList.add('cmp-navigation__item-link'); // Use link class for label in parent

        const toggle = document.createElement('button');
        toggle.classList.add('cmp-navigation__item-link'); // Use existing link class for toggle
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '+'; // Example toggle text

        const ul = document.createElement('ul');
        // ul.classList.add('cmp-navigation__group'); // Submenu class from ORIGINAL HTML - removed, as it's already added to the parent navUl
        ul.style.display = 'none'; // Hidden by default

        // RECURSIVELY render children (handles any depth)
        renderNavItems(item.children, ul);

        // Add toggle behavior
        toggle.addEventListener('click', () => {
          const isOpen = toggle.getAttribute('aria-expanded') === 'true';
          toggle.setAttribute('aria-expanded', !isOpen);
          ul.style.display = isOpen ? 'none' : 'block'; // Toggle display
          toggle.textContent = isOpen ? '+' : '-';
        });

        li.append(toggle, labelText, ul);
      } else {
        // Leaf item: just the label or link
        const link = document.createElement('a');
        link.href = '#'; // Placeholder, actual links would come from model
        link.textContent = item.label;
        link.classList.add('cmp-navigation__item-link'); // from ORIGINAL HTML
        li.append(link);
      }

      parentContainer.append(li);
    });
  }

  const textCell = navigationTextRow?.querySelector('div');
  const temp = document.createElement('div');
  temp.innerHTML = textCell?.innerHTML ?? '';
  const rootUl = temp.querySelector('ul');
  const navItems = rootUl ? parseNavTree(rootUl) : [];

  const navElLeft = document.createElement('nav');
  navElLeft.classList.add('cmp-navigation');
  navElLeft.setAttribute('role', 'navigation');
  const navUlLeft = document.createElement('ul');
  navUlLeft.classList.add('cmp-navigation__group');
  renderNavItems(navItems.slice(0, Math.ceil(navItems.length / 2)), navUlLeft); // Distribute items
  navElLeft.append(navUlLeft);
  navigationLeft.append(navElLeft);

  const navElRight = document.createElement('nav');
  navElRight.classList.add('cmp-navigation');
  navElRight.setAttribute('role', 'navigation');
  const navUlRight = document.createElement('ul');
  navUlRight.classList.add('cmp-navigation__group');
  renderNavItems(navItems.slice(Math.ceil(navItems.length / 2)), navUlRight); // Distribute items
  navElRight.append(navUlRight);
  navigationRight.append(navElRight);

  // Bottom content
  const cmpFooterBottomContent = document.createElement('div');
  cmpFooterBottomContent.classList.add('cmp-footer__bottom-content');
  cmpFooter.append(cmpFooterBottomContent);

  const cmpFooterContainer = document.createElement('div');
  cmpFooterContainer.classList.add('cmp-footer__container');
  cmpFooterBottomContent.append(cmpFooterContainer);

  const cmpFooterITCTitles = document.createElement('div');
  cmpFooterITCTitles.classList.add('cmp-footer__ITC-Titles');
  cmpFooterContainer.append(cmpFooterITCTitles);

  // ITC Portal Link
  const itcPortalLink = itcPortalLinkRow.querySelector('a');
  if (itcPortalLink) {
    const a = document.createElement('a');
    a.href = itcPortalLink.href;
    a.target = '_blank';
    a.classList.add('desc-1');
    a.textContent = 'ITC Portal';
    moveInstrumentation(itcPortalLink, a);
    cmpFooterITCTitles.append(a);
  }

  // Copyright Text
  const copyrightText = document.createElement('span'); // Use span as it's not a link
  copyrightText.classList.add('desc-1');
  copyrightText.textContent = copyrightTextRow.textContent.trim();
  cmpFooterITCTitles.append(copyrightText);

  // Social Media
  const cmpFooterSocialMedia = document.createElement('div');
  cmpFooterSocialMedia.classList.add('cmp-footer__social-media');
  cmpFooterContainer.append(cmpFooterSocialMedia);

  socialLinkRows.forEach((row) => {
    const socialLink = row.querySelector('a');
    if (socialLink) {
      const a = document.createElement('a');
      a.href = socialLink.href;
      a.target = '_blank';
      // Determine icon class based on link text or href
      let iconClass = '';
      if (socialLink.href.includes('instagram')) {
        iconClass = 'icon-instagram';
      } else if (socialLink.href.includes('facebook')) {
        iconClass = 'icon-facebook'; // Corrected from icon-facebok
      } else if (socialLink.href.includes('twitter')) {
        iconClass = 'icon-twitter';
      } else if (socialLink.href.includes('youtube')) {
        iconClass = 'icon-youtube';
      }
      if (iconClass) {
        a.classList.add(iconClass);
        a.setAttribute('data-social', iconClass.replace('icon-', ''));
      }
      moveInstrumentation(socialLink, a);
      cmpFooterSocialMedia.append(a);
    }
  });

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
