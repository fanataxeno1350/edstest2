import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
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
      subWrap.classList.add('menu-dropdown-box'); // Using existing class from original HTML
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('is-active-menu'); // Using existing class from original HTML
          subWrap.classList.toggle('active');
        });
      }
      transformNestedLists(nested); // Recursively transform nested lists
    }
  });
}

export default function decorate(block) {
  const header = document.createElement('header');
  header.id = 'header';

  const allRows = [...block.children];

  // Separate item types based on cell count and content
  const bannerImageRows = allRows.filter((row) => row.children.length === 3 && row.querySelector('picture'));
  const logoImageRows = allRows.filter((row) => row.children.length === 3 && row.querySelector('picture') && row.querySelector('a'));
  const navigationItemRows = allRows.filter((row) => row.children.length === 4 && row.querySelector('ul')); // hierarchy-tree is a richtext field with <ul>
  const simpleLinkRows = allRows.filter((row) => row.children.length === 2 && row.querySelector('a') && !row.querySelector('picture'));
  const bookIconsItemRows = allRows.filter((row) => row.children.length === 2 && row.querySelector('a') && !row.querySelector('picture') && row.textContent.includes('Book Icon Label')); // Differentiate from simple links if needed
  const socialLinkItemRows = allRows.filter((row) => row.children.length === 2 && row.querySelector('picture') && row.querySelector('a'));

  // Banner Images
  if (bannerImageRows.length > 0) {
    const prdBanner = document.createElement('div');
    prdBanner.classList.add('prd-banner');
    bannerImageRows.forEach((row) => {
      const [imageCell, altTextCell, hierarchyCell] = [...row.children]; // Destructuring for fixed fields

      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const bannerImg = document.createElement('img');
        bannerImg.src = img.src;
        bannerImg.alt = altTextCell.textContent.trim();
        bannerImg.classList.add('product-banner', 'zoom');
        moveInstrumentation(imageCell, bannerImg);
        prdBanner.append(bannerImg);
        // Optimize picture
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1918' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        picture.replaceWith(optimizedPic);
      }
      // Mobile banner image (assuming it's the same as desktop for now, or a specific mobile field is needed)
      const mBannerResponsive = document.createElement('img');
      mBannerResponsive.src = imageCell.querySelector('img')?.src || ''; // Use same image for mobile
      mBannerResponsive.alt = altTextCell.textContent.trim();
      mBannerResponsive.classList.add('mbanner-responsive');
      prdBanner.append(mBannerResponsive);

      // The hierarchy-tree cell is present in banner-image, but the original HTML doesn't render it directly
      // in the banner div. It's likely for a mobile menu or other navigation.
      // We'll process it later with mainNavigation if needed, or ignore if not used in this context.
      // For now, we ensure moveInstrumentation is called for the hierarchyCell if it's not moved.
      // If it's not moved, it should be removed from the DOM to avoid duplication.
      if (hierarchyCell) {
        // If hierarchyCell content is not explicitly moved, it should be removed.
        // For this block, it seems the hierarchy-tree from banner-image is not used in the banner itself.
        // It's likely a duplicate of the main navigation hierarchy.
        // If it were to be used, it would need to be processed and appended to a relevant element.
        // As per the original HTML, it's not rendered in the banner.
        // To prevent duplication, we'll ensure it's removed from the original block structure.
        hierarchyCell.remove();
      }
    });
    const mOpacityDiv = document.createElement('div');
    mOpacityDiv.classList.add('mopacity-div');
    prdBanner.append(mOpacityDiv);
    header.append(prdBanner);
  }

  const topHeader = document.createElement('div');
  topHeader.classList.add('top_header');
  const topHeaderBg = document.createElement('img');
  // The original HTML has a hardcoded background image for top_header.
  // If this should be configurable, a field in the model is needed.
  // For now, we'll assume it's a CSS background or a decorative image without a content field.
  // As per Rule 16, avoid hardcoding DAM paths.
  // If no field for this image exists in the model, it should be handled by CSS.
  // Since the original HTML has an <img> tag, we'll create one, but without a hardcoded src.
  topHeaderBg.alt = 'top banner';
  topHeaderBg.classList.add('zoom');
  topHeader.append(topHeaderBg);
  header.append(topHeader);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  const container = document.createElement('div');
  container.classList.add('container');
  wrap.append(container);

  const topSection = document.createElement('div');
  topSection.classList.add('top_section');
  container.append(topSection);

  // Logo Images
  const logoBox = document.createElement('div');
  logoBox.classList.add('logo_box');
  logoImageRows.forEach((row) => {
    const [imageCell, altTextCell, linkCell] = [...row.children]; // Destructuring for fixed fields
    const logoLink = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      logoLink.href = foundLink.href;
      moveInstrumentation(foundLink, logoLink); // Move instrumentation from original link
    } else {
      logoLink.href = '#';
    }

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const logoImg = document.createElement('img');
      logoImg.src = img.src;
      logoImg.alt = altTextCell.textContent.trim();
      logoImg.classList.add('ld-hide'); // Assuming first logo is desktop
      moveInstrumentation(imageCell, logoImg);
      logoLink.append(logoImg);

      // Optimize picture
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '100' }]); // Adjust width as needed
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      picture.replaceWith(optimizedPic);
    }
    logoBox.append(logoLink);

    // Assuming a second logo image in the same row or another row for mobile
    // For simplicity, using the same image for mobile with different class
    const mobileLogoLink = document.createElement('a');
    if (foundLink) {
      mobileLogoLink.href = foundLink.href;
      moveInstrumentation(foundLink, mobileLogoLink); // Move instrumentation from original link
    } else {
      mobileLogoLink.href = '#';
    }
    const mobileLogoImg = document.createElement('img');
    mobileLogoImg.src = imageCell.querySelector('img')?.src || ''; // Use same image for mobile
    mobileLogoImg.alt = altTextCell.textContent.trim();
    mobileLogoImg.classList.add('md-hide');
    mobileLogoLink.append(mobileLogoImg);
    logoBox.append(mobileLogoLink);
  });
  topSection.append(logoBox);

  // Main Navigation
  const leftMenu = document.createElement('div');
  leftMenu.classList.add('left_menu', 'main-menu-wrap');
  const navUl = document.createElement('ul');
  navigationItemRows.forEach((row) => {
    const [labelCell, linkCell, iconCell, hierarchyCell] = [...row.children]; // Destructuring for fixed fields
    const li = document.createElement('li');
    li.classList.add('link-item');

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      moveInstrumentation(foundLink, anchor); // Move instrumentation from original link
    } else {
      anchor.href = '#';
    }
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);

    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      const arrowIconSpan = document.createElement('span');
      arrowIconSpan.classList.add('arrow-icon');
      const arrowIconImg = document.createElement('img');
      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const iconImg = iconPicture.querySelector('img');
        arrowIconImg.src = iconImg.src;
        arrowIconImg.alt = iconImg.alt;
        moveInstrumentation(iconCell, arrowIconImg);

        const optimizedIconPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '24' }]); // Adjust width
        moveInstrumentation(iconImg, optimizedIconPic.querySelector('img'));
        iconPicture.replaceWith(optimizedIconPic);
      } else {
        // Fallback or default icon if none provided
        arrowIconImg.src = '/icons/arrow-right.svg'; // Placeholder, ideally from config or CSS
        arrowIconImg.alt = 'arrow icon';
      }
      arrowIconSpan.append(arrowIconImg);
      li.append(arrowIconSpan);

      const menuDropdownBox = document.createElement('div');
      menuDropdownBox.classList.add('menu-dropdown-box');
      const menuDropdownContent = document.createElement('div');
      menuDropdownContent.classList.add('menu-dropdown-content');
      menuDropdownBox.append(menuDropdownContent);

      // Process richtext hierarchy
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML; // Use innerHTML for richtext
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell
      while (tempDiv.firstChild) {
        menuDropdownContent.append(tempDiv.firstChild);
      }

      transformNestedLists(menuDropdownContent.querySelector('ul')); // Transform nested lists within the hierarchy
      li.append(menuDropdownBox);

      // Add event listener for dropdown toggle
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('is-active-menu');
        menuDropdownBox.classList.toggle('active');
      });
      arrowIconSpan.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('is-active-menu');
        menuDropdownBox.classList.toggle('active');
      });
    }
    navUl.append(li);
  });
  leftMenu.append(navUl);
  topSection.append(leftMenu);

  // Nav Button (Hamburger)
  const navButton = document.createElement('div');
  navButton.classList.add('nav-button');
  const hamburger = document.createElement('button');
  hamburger.classList.add('hamburger', 'hamburger--boring');
  hamburger.type = 'button';
  const hamburgerBox = document.createElement('span');
  hamburgerBox.classList.add('hamburger-box');
  const hamburgerInner = document.createElement('span');
  hamburgerInner.classList.add('hamburger-inner');
  hamburgerBox.append(hamburgerInner);
  hamburger.append(hamburgerBox);
  navButton.append(hamburger);
  container.append(navButton);

  // Hero section (mobile navigation)
  const hero = document.createElement('div');
  hero.classList.add('hero');
  const masthead = document.createElement('header');
  masthead.id = 'masthead';
  masthead.role = 'banner';
  hero.append(masthead);

  const siteNav = document.createElement('nav');
  siteNav.id = 'site-nav';
  siteNav.role = 'navigation';
  masthead.append(siteNav);

  const navLogoBox = document.createElement('div');
  navLogoBox.classList.add('nav-logo_box', 'm-logo-box');
  logoImageRows.forEach((row) => {
    const [imageCell, altTextCell, linkCell] = [...row.children]; // Destructuring for fixed fields
    const logoLink = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      logoLink.href = foundLink.href;
      moveInstrumentation(foundLink, logoLink); // Move instrumentation from original link
    } else {
      logoLink.href = '#';
    }

    const img = imageCell.querySelector('img');
    if (img) {
      const desktopLogo = document.createElement('img');
      desktopLogo.src = img.src;
      desktopLogo.alt = altTextCell.textContent.trim();
      desktopLogo.classList.add('ld-hide');
      moveInstrumentation(imageCell, desktopLogo);
      logoLink.append(desktopLogo);

      const mobileLogo = document.createElement('img');
      mobileLogo.src = img.src;
      mobileLogo.alt = altTextCell.textContent.trim();
      mobileLogo.classList.add('md-hide');
      logoLink.append(mobileLogo);
    }
    navLogoBox.append(logoLink);
  });
  siteNav.append(navLogoBox);

  // Mobile navigation links (mainNavigation items)
  const col1 = document.createElement('div');
  col1.classList.add('col');
  const mobileNavUl1 = document.createElement('ul');
  navigationItemRows.forEach((row) => {
    const [labelCell, linkCell, iconCell, hierarchyCell] = [...row.children]; // Destructuring for fixed fields
    const li = document.createElement('li');
    li.classList.add('m-menu', 'menu-btn');

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      moveInstrumentation(foundLink, anchor); // Move instrumentation from original link
    } else {
      anchor.href = '#';
    }
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);

    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      const arrowIconSpan = document.createElement('span');
      arrowIconSpan.classList.add('arrow-icon');
      const arrowIconImg = document.createElement('img');
      const iconImg = iconCell.querySelector('img');
      if (iconImg) {
        arrowIconImg.src = iconImg.src;
        arrowIconImg.alt = iconImg.alt;
        moveInstrumentation(iconCell, arrowIconImg);
      } else {
        arrowIconImg.src = '/icons/arrow-right.svg'; // Placeholder
        arrowIconImg.alt = 'arrow icon';
      }
      arrowIconSpan.append(arrowIconImg);
      li.append(arrowIconSpan);

      const wrapper = document.createElement('div');
      wrapper.classList.add('menu-dropdown-box'); // Reusing class from desktop, adjust if needed

      // Process richtext hierarchy
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML; // Use innerHTML for richtext
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell
      while (tempDiv.firstChild) {
        wrapper.append(tempDiv.firstChild);
      }

      transformNestedLists(wrapper.querySelector('ul'));
      li.append(wrapper);

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        wrapper.classList.toggle('active');
      });
      arrowIconSpan.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        wrapper.classList.toggle('active');
      });
    }
    mobileNavUl1.append(li);
  });
  col1.append(mobileNavUl1);
  siteNav.append(col1);

  // Simple Links
  const col2 = document.createElement('div');
  col2.classList.add('col');
  const simpleLinksUl = document.createElement('ul');
  simpleLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring for fixed fields
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      moveInstrumentation(foundLink, anchor); // Move instrumentation from original link
    } else {
      anchor.href = '#';
    }
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);
    simpleLinksUl.append(li);
  });
  col2.append(simpleLinksUl);
  siteNav.append(col2);

  // Book Icons
  const col3 = document.createElement('div');
  col3.classList.add('col');
  const booksUl = document.createElement('ul');
  booksUl.classList.add('books');
  bookIconsItemRows.forEach((row, index) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring for fixed fields
    const li = document.createElement('li');
    li.classList.add(`icons${index > 0 ? `-${index + 1}` : ''}`); // icons, icons-2, icons-3
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      moveInstrumentation(foundLink, anchor); // Move instrumentation from original link
    } else {
      anchor.href = '#';
    }
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);
    booksUl.append(li);
  });
  col3.append(booksUl);

  // Social Links
  const socialMenus = document.createElement('div');
  socialMenus.classList.add('social_menus');
  const facebookSocialUl = document.createElement('ul'); // Original HTML has facebook_social class on ul
  facebookSocialUl.classList.add('facebook_social');
  socialLinkItemRows.forEach((row) => {
    const [iconCell, linkCell] = [...row.children]; // Destructuring for fixed fields
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.target = '_blank'; // Corrected from _balnk to _blank
      moveInstrumentation(foundLink, anchor); // Move instrumentation from original link
    } else {
      anchor.href = '#';
    }

    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const socialIconImg = document.createElement('img');
      socialIconImg.src = img.src;
      socialIconImg.alt = img.alt;
      moveInstrumentation(iconCell, socialIconImg);
      anchor.append(socialIconImg);

      // Optimize picture
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '32' }]); // Adjust width
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      picture.replaceWith(optimizedPic);
    }
    li.append(anchor);
    facebookSocialUl.append(li);
  });
  socialMenus.append(facebookSocialUl);
  col3.append(socialMenus);
  siteNav.append(col3);

  container.append(hero);
  block.replaceChildren(header);

  // Hamburger menu toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('is-active');
    hero.classList.toggle('active');
  });

  // Optimize all images in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
