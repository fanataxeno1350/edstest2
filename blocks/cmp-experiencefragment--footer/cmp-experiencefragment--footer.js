import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    // Handle label-only nodes
    const anchor = li.querySelector(':scope > a');
    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
      }
    }
    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('navigation-v2-sub-list__body'); // use ORIGINAL HTML class
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add(
          'navigation-v2-item-list-item-link__text',
          'navigation-v2-item-list-span__text',
          'navigation-aria-select',
        );
        trigger.setAttribute('role', 'button');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
          trigger.setAttribute(
            'aria-expanded',
            subWrap.classList.contains('active'),
          );
        });
      }
    } else if (anchor) {
      anchor.classList.add('navigation-v2-item-list-item-link');
      const span = document.createElement('span');
      span.classList.add('navigation-v2-item-list-item-link__text');
      moveInstrumentation(anchor, span);
      while (anchor.firstChild) span.append(anchor.firstChild);
      anchor.append(span);
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Root fields detection
  const logoRow = children.find((row) => row.querySelector('picture'));
  const logoLinkRow = children.find((row) => row.querySelector('a[href*="/content/site/logoLink"]'));
  const newsHeadingRow = children.find((row) => row.textContent.trim() === 'News Heading label text');
  const footerDisclaimerRow = children.find((row) => row.innerHTML.includes('<p>Footer Disclaimer text content</p>'));

  // Item rows detection
  const footerNavItems = children.filter((row) => row.children.length === 2 && row.querySelector('ul'));
  const footerLinkItems = children.filter((row) => row.children.length === 2 && row.querySelector('a') && !row.querySelector('ul'));
  const footerSocialLinkItems = children.filter((row) => row.children.length === 2 && row.querySelector('a') && (row.querySelector('a').classList.contains('facebook-icon') || row.querySelector('a').classList.contains('instagram-icon')));

  block.innerHTML = '';
  block.classList.add('cmp-experiencefragment--footer');

  const footerMain = document.createElement('div');
  footerMain.classList.add(
    'cmp-container',
    'container-f02528313b',
    'container',
    'responsivegrid',
    'footer-main',
  );

  const footerPrimary = document.createElement('div');
  footerPrimary.classList.add(
    'cmp-container',
    'container-e9c94565ed',
    'container',
    'responsivegrid',
    'container--max-wrapper',
    'footer-primary',
  );

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('tabimage', 'image');
  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link', 'external-link-icon');
  const originalLogoLink = logoLinkRow?.querySelector('a'); // Use optional chaining
  if (originalLogoLink) {
    logoLink.href = originalLogoLink.href;
    logoLink.target = '_blank';
    logoLink.rel = 'noopener noreferrer';
    logoLink.title = 'Unilever Logo'; // From original HTML
    logoLink.setAttribute('aria-label', 'Unilever Logo'); // From original HTML
  }

  const picture = logoRow?.querySelector('picture'); // Use optional chaining
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(
      img.src,
      img.alt,
      false,
      [{ width: '90' }],
    );
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  logoWrapper.append(logoLink);
  footerPrimary.append(logoWrapper);

  // Footer Navigation
  if (footerNavItems.length > 0) {
    const navWrapper = document.createElement('div');
    navWrapper.classList.add('navigationlinks', 'footer-nav-menu', 'cmp--navigation-v2', 'ma-page_list');
    const navV2Wrapper = document.createElement('div');
    navV2Wrapper.classList.add('navigation-v2__wrapper');
    const navV2Item = document.createElement('div');
    navV2Item.classList.add('navigation-v2-item');
    const navV2ItemBody = document.createElement('div');
    navV2ItemBody.classList.add('navigation-v2-item__body');
    const navList = document.createElement('ul');
    navList.classList.add('navigation-v2-item-list__group');

    footerNavItems.forEach((row) => {
      const cells = [...row.children];
      const labelCell = cells.find(c => !c.querySelector('ul')); // Label cell is text, no UL
      const hierarchyCell = cells.find(c => c.querySelector('ul')); // Hierarchy cell has UL

      const li = document.createElement('li');
      li.classList.add('navigation-v2-item-list-item', 'navigation-v2-item-list-item', '__group');

      const subListBody = document.createElement('div');
      subListBody.classList.add('navigation-v2-sub-list__body');

      const headingDiv = document.createElement('div');
      headingDiv.classList.add('navigation-il-heading');

      if (hierarchyCell) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML; // Use innerHTML for richtext
        const hierarchyRoot = tempDiv.querySelector('ul');

        if (hierarchyRoot) {
          const rootEl = document.createElement('span');
          rootEl.textContent = labelCell?.textContent.trim() || '';
          moveInstrumentation(labelCell, rootEl);
          headingDiv.appendChild(rootEl);

          const wrapper = document.createElement('ul');
          wrapper.classList.add('navigation-v2-sub-list__group', 'navigation-v2-item-list');
          
          // Move children from tempDiv to wrapper
          while (hierarchyRoot.firstChild) {
            wrapper.append(hierarchyRoot.firstChild);
          }

          rootEl.classList.add(
            'navigation-v2-item-list-item-link__text',
            'navigation-v2-item-list-span__text',
            'navigation-aria-select',
          );
          rootEl.setAttribute('role', 'button');
          rootEl.setAttribute('aria-expanded', 'false');
          rootEl.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            li.classList.toggle('active');
            wrapper.classList.toggle('active');
            rootEl.setAttribute(
              'aria-expanded',
              wrapper.classList.contains('active'),
            );
          });
          subListBody.appendChild(headingDiv);
          subListBody.appendChild(wrapper);
          transformNestedLists(wrapper); // Pass the new wrapper to transform
        }
      } else {
        const anchor = document.createElement('a');
        const foundLink = labelCell?.querySelector('a'); // Check if label cell itself contains a link
        if (foundLink) {
          anchor.href = foundLink.href;
          anchor.textContent = foundLink.textContent.trim();
        } else {
          anchor.href = '#'; // Fallback or if no link is present
          anchor.textContent = labelCell?.textContent.trim() || '';
        }
        anchor.classList.add('navigation-v2-item-list-item-link');
        const span = document.createElement('span');
        span.classList.add('navigation-v2-item-list-item-link__text');
        moveInstrumentation(labelCell, span);
        while (labelCell.firstChild) span.append(labelCell.firstChild);
        anchor.append(span);
        subListBody.appendChild(anchor);
      }
      li.appendChild(subListBody);
      navList.appendChild(li);
    });

    navV2ItemBody.appendChild(navList);
    navV2Item.appendChild(navV2ItemBody);
    navV2Wrapper.appendChild(navV2Item);
    navWrapper.appendChild(navV2Wrapper);
    footerPrimary.append(navWrapper);
  }

  // News Heading and Social Links
  const socialLinksContainer = document.createElement('div');
  socialLinksContainer.classList.add(
    'cmp-container',
    'container-37170c5cb6',
    'container',
    'responsivegrid',
    'footer-social-links',
  );

  const newsHeadingDiv = document.createElement('div');
  newsHeadingDiv.classList.add('text');
  const newsHeadingText = document.createElement('div');
  newsHeadingText.classList.add('cmp-text', 'cmp-text-login-detail');
  const newsHeadingNonLoggedIn = document.createElement('div');
  newsHeadingNonLoggedIn.classList.add('nonLoggedIn');
  newsHeadingNonLoggedIn.innerHTML = `<p><strong>${newsHeadingRow?.textContent.trim()}</strong></p>`; // Use optional chaining
  newsHeadingText.append(newsHeadingNonLoggedIn);
  newsHeadingDiv.append(newsHeadingText);
  socialLinksContainer.append(newsHeadingDiv);

  if (footerSocialLinkItems.length > 0) {
    const socialLinksWrapper = document.createElement('div');
    socialLinksWrapper.classList.add('container', 'responsivegrid');
    const socialLinksCmpContainer = document.createElement('div');
    socialLinksCmpContainer.classList.add('cmp-container', 'container-9115528e05');
    const socialLinksTextDiv = document.createElement('div');
    socialLinksTextDiv.classList.add('text');
    const socialLinksCmpText = document.createElement('div');
    socialLinksCmpText.classList.add('cmp-text', 'cmp-text-login-detail');
    const socialLinksNonLoggedIn = document.createElement('div');
    socialLinksNonLoggedIn.classList.add('nonLoggedIn');
    const socialLinksUl = document.createElement('ul');

    footerSocialLinkItems.forEach((row) => {
      const cells = [...row.children];
      const socialLabelCell = cells.find(c => !c.querySelector('a')); // Label cell is text, no A
      const socialLinkCell = cells.find(c => c.querySelector('a')); // Link cell has A

      const li = document.createElement('li');
      const socialLink = document.createElement('a');
      const originalSocialLink = socialLinkCell?.querySelector('a'); // Use optional chaining
      if (originalSocialLink) {
        socialLink.href = originalSocialLink.href;
        socialLink.textContent = socialLabelCell?.textContent.trim() || ''; // Use optional chaining
        socialLink.target = '_blank';
        socialLink.rel = 'noopener noreferrer';
        if (originalSocialLink.classList.contains('facebook-icon')) {
          socialLink.classList.add('facebook-icon', 'external-link-icon');
          socialLink.title = 'This link open in new window Facebook page';
        } else if (originalSocialLink.classList.contains('instagram-icon')) {
          socialLink.classList.add('instagram-icon', 'external-link-icon');
          socialLink.title = 'This link open in new window twitter';
        }
      }
      moveInstrumentation(row, li);
      li.append(socialLink);
      socialLinksUl.append(li);
    });
    socialLinksNonLoggedIn.append(socialLinksUl);
    socialLinksCmpText.append(socialLinksNonLoggedIn);
    socialLinksTextDiv.append(socialLinksCmpText);
    socialLinksCmpContainer.append(socialLinksTextDiv);
    socialLinksWrapper.append(socialLinksCmpContainer);
    socialLinksContainer.append(socialLinksWrapper);
  }
  footerPrimary.append(socialLinksContainer);
  footerMain.append(footerPrimary);

  // Footer Secondary (Disclaimer and Footer Links)
  const footerSecondary = document.createElement('div');
  footerSecondary.classList.add(
    'cmp-container',
    'container-a223d1e1e0',
    'container',
    'responsivegrid',
    'container--max-wrapper',
    'footer-secondary',
  );

  // Disclaimer
  const disclaimerDiv = document.createElement('div');
  disclaimerDiv.classList.add('text', 'red-cross-disclaimer');
  const disclaimerCmpText = document.createElement('div');
  disclaimerCmpText.classList.add('cmp-text', 'cmp-text-login-detail');
  const disclaimerNonLoggedIn = document.createElement('div');
  disclaimerNonLoggedIn.classList.add('nonLoggedIn');
  disclaimerNonLoggedIn.innerHTML = footerDisclaimerRow?.innerHTML || ''; // Use innerHTML for richtext, optional chaining
  disclaimerCmpText.append(disclaimerNonLoggedIn);
  disclaimerDiv.append(disclaimerCmpText);
  footerSecondary.append(disclaimerDiv);

  // Footer Links
  if (footerLinkItems.length > 0) {
    const footerLinksNav = document.createElement('div');
    footerLinksNav.classList.add('navigationlinks', 'cmp--navigation-v2', 'ma-page_list');
    const footerLinksNavWrapper = document.createElement('div');
    footerLinksNavWrapper.classList.add('navigation-v2__wrapper');
    const footerLinksNavV2Item = document.createElement('div');
    footerLinksNavV2Item.classList.add('navigation-v2-item');
    const footerLinksNavV2ItemBody = document.createElement('div');
    footerLinksNavV2ItemBody.classList.add('navigation-v2-item__body');
    const footerLinksUl = document.createElement('ul');
    footerLinksUl.classList.add('navigation-v2-item-list__group');
    const footerLinksLi = document.createElement('li');
    footerLinksLi.classList.add('navigation-v2-item-list-item', 'navigation-v2-item-list-item', '__group');
    const footerLinksSubListBody = document.createElement('div');
    footerLinksSubListBody.classList.add('navigation-v2-sub-list__body');
    const footerLinksSubListUl = document.createElement('ul');
    footerLinksSubListUl.classList.add('navigation-v2-sub-list__group', 'navigation-v2-item-list');

    footerLinkItems.forEach((row) => {
      const cells = [...row.children];
      const labelCell = cells.find(c => !c.querySelector('a')); // Label cell is text, no A
      const linkCell = cells.find(c => c.querySelector('a')); // Link cell has A

      const li = document.createElement('li');
      li.classList.add('navigation-v2-item-list-item', 'navigation-v2-item-list-item--level-');

      if (!linkCell) {
        // Handle cookie settings button
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('ot-cookie-btn');
        button.style.cssText = `
          all: unset;
          padding: inherit;
          font-size: inherit;
          border: inherit;
          cursor: pointer;
        `;
        button.textContent = labelCell?.textContent.trim() || ''; // Use optional chaining
        button.addEventListener('click', () => {
          // Placeholder for cookie settings functionality
          // console.log('Cookie settings button clicked');
          if (window.OneTrust && window.OneTrust.ToggleInfoDisplay) {
            window.OneTrust.ToggleInfoDisplay();
          }
        });
        li.append(button);
        moveInstrumentation(row, li);
        footerLinksSubListUl.append(li);
        return; // Skip adding to link span for button
      }

      const link = document.createElement('a');
      const originalLink = linkCell.querySelector('a');
      if (originalLink) {
        link.href = originalLink.href;
        link.textContent = labelCell?.textContent.trim() || ''; // Use optional chaining
        link.classList.add('navigation-v2-item-list-item-link');
        if (originalLink.classList.contains('external-link-icon')) {
          link.classList.add('external-link-icon');
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
      }

      const span = document.createElement('span');
      span.classList.add('navigation-v2-item-list-item-link__text');
      moveInstrumentation(row, span);
      // Move content from link to span
      while (link.firstChild) span.append(link.firstChild);
      link.append(span);
      li.append(link);
      moveInstrumentation(row, li);
      footerLinksSubListUl.append(li);
    });
    footerLinksSubListBody.append(footerLinksSubListUl);
    footerLinksLi.append(footerLinksSubListBody);
    footerLinksUl.append(footerLinksLi);
    footerLinksNavV2ItemBody.append(footerLinksUl);
    footerLinksNavV2Item.append(footerLinksNavV2ItemBody);
    footerLinksNavWrapper.append(footerLinksNavV2Item);
    footerLinksNav.append(footerLinksNavWrapper);
    footerSecondary.append(footerLinksNav);
  }

  footerMain.append(footerSecondary);
  block.append(footerMain);
}
