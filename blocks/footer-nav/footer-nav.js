import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [addressBlockRow, legalText1Row, legalText2Row, ...itemRows] = [...block.children];

  // Refined content detection to avoid row.children[n]
  const sections = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && !cells[0].querySelector('picture') && !cells[1].querySelector('picture') && !cells[0].querySelector('a') && !cells[1].querySelector('a');
  });
  const buttons = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('a') && cells[1].querySelector('picture') && !cells[0].textContent.toLowerCase().includes('profile');
  });
  const socialLinks = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('a') && cells[1].querySelector('picture') && cells[0].textContent.toLowerCase().includes('profile');
  });
  const secondaryLinks = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 1 && cells[0].querySelector('a');
  });

  block.textContent = '';

  const footer = document.createElement('footer');
  footer.classList.add('bg-surface-footer');

  const borderDiv = document.createElement('div');
  borderDiv.classList.add('border-t', 'border-stroke-muted');
  footer.append(borderDiv);

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'overflow-hidden', 'relative');
  borderDiv.append(containerDiv);

  const ptDiv = document.createElement('div');
  ptDiv.classList.add('pt-3xl', 'relative', 'z-1', 'lg:pb-5xl');
  containerDiv.append(ptDiv);

  const nav = document.createElement('nav');
  nav.classList.add('text-p1', 'grid', 'grid-cols-2', 'md:grid-cols-3', 'xl:grid-full');
  nav.setAttribute('aria-label', 'Primary footer');
  ptDiv.append(nav);

  const pandaDiv = document.createElement('div');
  pandaDiv.classList.add('absolute', '-z-1', 'bg-[url(\'../images/cssBackgrounds/panda.svg\')]', 'opacity-5', 'bg-no-repeat', 'inset-[0_-10%_0_0]', 'bg-position-[center_left]', 'bg-size-[130%]', 'sm:bg-size-[75%]', 'md:bg-top-left', 'md:inset-[24px_0_0_-24px]', 'lg:bg-size-[60%]');
  nav.append(pandaDiv);

  sections.forEach((row) => {
    const sectionDiv = document.createElement('div');
    moveInstrumentation(row, sectionDiv);
    sectionDiv.classList.add('not-last:mb-md', 'md:mb-0', 'flex', 'flex-col', 'xl:col-span-3');

    const cells = [...row.children]; // Use content detection
    const headingCell = cells[0];
    if (headingCell) {
      const heading = document.createElement('p');
      heading.classList.add('mb-xs', 'text-15', 'xl:text-p2', 'font-stretch-normal', 'font-bold', 'text-sm');
      moveInstrumentation(headingCell, heading);
      while (headingCell.firstChild) heading.append(headingCell.firstChild);
      sectionDiv.append(heading);
    }

    const linksCell = cells[1];
    if (linksCell) {
      const ul = document.createElement('ul');
      ul.classList.add('flex', 'flex-col', 'gap-xs');
      moveInstrumentation(linksCell, ul);
      [...linksCell.children].forEach((linkEl) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.classList.add('link', 'text-foreground', 'text-p2', 'xl:text-p1', 'transition-display', 'hocus:underline', 'hocus:text-foreground', 'motion-safe:not-focus-visible:transition-underline', 'no-underline');
        a.setAttribute('data-desktop-nav-link', '');
        const foundLink = linkEl.querySelector('a');
        if (foundLink) {
          a.href = foundLink.href;
          a.textContent = foundLink.textContent;
        }
        li.append(a);
        ul.append(li);
      });
      sectionDiv.append(ul);
    }
    nav.append(sectionDiv);
  });

  const buttonSocialContainer = document.createElement('div');
  buttonSocialContainer.classList.add('col-span-full', 'pt-[200px]', 'lg:pt-0', 'lg:col-start-10', 'lg:col-span-5', 'lg:ml-auto');
  nav.append(buttonSocialContainer);

  if (buttons.length > 0) {
    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('flex', 'flex-col', 'items-start', 'gap-md');
    buttonSocialContainer.append(buttonWrapper);

    buttons.forEach((row) => {
      const cells = [...row.children]; // Use content detection
      const linkCell = cells.find(cell => cell.querySelector('a'));
      const iconCell = cells.find(cell => cell.querySelector('picture'));

      const linkEl = linkCell?.querySelector('a');
      const iconPic = iconCell?.querySelector('picture');

      if (linkEl) {
        const buttonLink = document.createElement('a');
        buttonLink.classList.add('button', linkEl.textContent.toLowerCase().includes('email') ? 'button--dark' : 'button--dark-outline', 'group');
        buttonLink.href = linkEl.href;
        buttonLink.textContent = linkEl.textContent;
        moveInstrumentation(linkCell, buttonLink);

        if (iconPic) {
          const img = iconPic.querySelector('img');
          if (img) {
            const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            buttonLink.append(optimizedPic);
          }
        }
        buttonWrapper.append(buttonLink);
      }
    });
  }

  if (socialLinks.length > 0) {
    const socialWrapper = document.createElement('div');
    socialWrapper.classList.add('flex', 'gap-sm', 'py-2xs', 'mt-sm', 'mb-lg', 'items-center');
    buttonSocialContainer.append(socialWrapper);

    socialLinks.forEach((row) => {
      const cells = [...row.children]; // Use content detection
      const linkCell = cells.find(cell => cell.querySelector('a'));
      const iconCell = cells.find(cell => cell.querySelector('picture'));

      const linkEl = linkCell?.querySelector('a');
      const iconPic = iconCell?.querySelector('picture');

      if (linkEl) {
        const socialLink = document.createElement('a');
        socialLink.classList.add('transition-colors', 'hover:cursor-pointer', 'theme-focus-outline', 'outline-none', 'fill-foreground', 'hocus:fill-foreground-accent');
        socialLink.target = '_blank';
        socialLink.rel = 'nofollow noopener';
        socialLink.href = linkEl.href;
        moveInstrumentation(linkCell, socialLink);

        const srOnlySpan = document.createElement('span');
        srOnlySpan.classList.add('sr-only');
        srOnlySpan.textContent = `${linkEl.textContent} profile`;
        socialLink.append(srOnlySpan);

        if (iconPic) {
          const img = iconPic.querySelector('img');
          if (img) {
            const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            socialLink.append(optimizedPic);
          }
        }
        socialWrapper.append(socialLink);
      }
    });
  }

  const legalSection = document.createElement('div');
  legalSection.classList.add('py-2xl', 'text-foreground-invert', 'bg-punaluu-500');
  footer.append(legalSection);

  const legalContainer = document.createElement('div');
  legalContainer.classList.add('grid-full', 'container');
  legalSection.append(legalContainer);

  const legalContentDiv = document.createElement('div');
  legalContentDiv.classList.add('md:col-span-11', 'space-y-sm', '[&>p]:text-p2');
  legalContainer.append(legalContentDiv);

  if (addressBlockRow) {
    moveInstrumentation(addressBlockRow, legalContentDiv);
    const p = document.createElement('p');
    while (addressBlockRow.firstChild) p.append(addressBlockRow.firstChild);
    legalContentDiv.append(p);
  }

  if (legalText1Row) {
    moveInstrumentation(legalText1Row, legalContentDiv);
    const p = document.createElement('p');
    while (legalText1Row.firstChild) p.append(legalText1Row.firstChild);
    legalContentDiv.append(p);
  }

  if (legalText2Row) {
    moveInstrumentation(legalText2Row, legalContentDiv);
    const p = document.createElement('p');
    while (legalText2Row.firstChild) p.append(legalText2Row.firstChild);
    legalContentDiv.append(p);
  }

  if (secondaryLinks.length > 0) {
    const secondaryNavDiv = document.createElement('div');
    legalContentDiv.append(secondaryNavDiv);

    const secondaryNav = document.createElement('nav');
    secondaryNav.setAttribute('aria-label', 'Secondary footer');
    secondaryNavDiv.append(secondaryNav);

    const ul = document.createElement('ul');
    ul.classList.add('md:flex', 'flex-wrap', 'gap-sm');
    secondaryNav.append(ul);

    secondaryLinks.forEach((row) => {
      const cells = [...row.children]; // Use content detection
      const linkCell = cells[0];
      const linkEl = linkCell?.querySelector('a');

      if (linkEl) {
        const li = document.createElement('li');
        li.classList.add('text-p2', 'mb-sm', 'md:mb-0');
        moveInstrumentation(row, li);

        const a = document.createElement('a');
        a.classList.add('link', 'text-cta-size', 'font-semibold', 'decoration-2', 'underline-offset-8', 'text-foreground-invert', 'hocus:text-foreground-strong-invert');
        a.href = linkEl.href;
        a.textContent = linkEl.textContent;

        if (linkEl.target) a.target = linkEl.target;
        if (linkEl.rel) a.rel = linkEl.rel;

        if (a.textContent.toLowerCase().includes('cookie settings')) {
          const button = document.createElement('button');
          button.type = 'button';
          button.classList.add('ot-sdk-show-settings', 'cursor-pointer', 'link', 'text-cta-size', 'font-semibold', 'decoration-2', 'underline-offset-8', 'text-foreground-invert', 'hocus:text-foreground-strong-invert');
          button.textContent = a.textContent;
          li.append(button);

          // Add event listener for the cookie settings button
          button.addEventListener('click', (e) => {
            e.preventDefault();
            // Assuming OneTrust or similar cookie consent platform is used
            // and has a global function to show settings.
            // Replace with actual function if different.
            if (window.OneTrust && window.OneTrust.ToggleInfoDisplay) {
              window.OneTrust.ToggleInfoDisplay();
            } else {
              console.warn('OneTrust or cookie settings function not found.');
            }
          });
        } else {
          li.append(a);
        }
        ul.append(li);
      }
    });
  }

  block.append(footer);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
