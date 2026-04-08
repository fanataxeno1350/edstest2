import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [logoRow, copyrightRow, ...itemRows] = [...block.children];

  block.textContent = '';
  block.classList.add('footer-wrp');

  const containerWrp = document.createElement('div');
  containerWrp.classList.add('container-1600-wrp');
  block.append(containerWrp);

  // Logo
  if (logoRow) {
    const mobLogoWr = document.createElement('div');
    mobLogoWr.classList.add('mob-logo-wr');
    moveInstrumentation(logoRow, mobLogoWr);

    const picture = logoRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        mobLogoWr.append(optimizedPic);
        optimizedPic.querySelector('img').classList.add('img-fluid');
      }
    }
    containerWrp.append(mobLogoWr);
  }

  const linkGroupRows = itemRows.filter((row) => row.children.length === 2 && row.querySelector('div:first-child:not(:has(a))'));
  const socialLinkRows = itemRows.filter((row) => row.children.length === 1 && row.querySelector('a'));
  const bottomLinkRows = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a'));

  // Link Groups
  if (linkGroupRows.length > 0) {
    const rowF1 = document.createElement('div');
    rowF1.classList.add('row', 'f1');
    containerWrp.append(rowF1);

    linkGroupRows.forEach((row) => {
      const col = document.createElement('div');
      col.classList.add('col', 'col-xl-3');
      moveInstrumentation(row, col);

      const headingCell = [...row.children].find(cell => !cell.querySelector('a') && !cell.querySelector('picture'));
      const linksCell = [...row.children].find(cell => cell.querySelector('a') || cell.children.length > 0 && !cell.querySelector('picture'));

      if (headingCell) {
        const headingText = headingCell.textContent.trim();
        const accordionHead = document.createElement('a');
        accordionHead.href = 'javascript:void(0)';
        accordionHead.classList.add('ttle', 'accordion_head2');
        accordionHead.innerHTML = `${headingText} <span class="plusminus2">+</span>`;
        col.append(accordionHead);

        const ftrSubLinksCvr = document.createElement('div');
        ftrSubLinksCvr.classList.add('ftr-sub-links-cvr', 'accordion_body2');
        col.append(ftrSubLinksCvr);

        // Extract individual links from the linksCell
        if (linksCell) {
          [...linksCell.children].forEach((linkWrapper) => {
            const link = linkWrapper.querySelector('a');
            if (link) {
              const ftrLink = document.createElement('a');
              ftrLink.href = link.href;
              ftrLink.classList.add('ftr-link');
              ftrLink.textContent = link.textContent;
              ftrSubLinksCvr.append(ftrLink);
            }
          });
        }

        accordionHead.addEventListener('click', () => {
          ftrSubLinksCvr.classList.toggle('show');
          accordionHead.classList.toggle('active'); // Add/remove active class for styling if needed
          const plusMinus = accordionHead.querySelector('.plusminus2');
          if (plusMinus) {
            plusMinus.textContent = ftrSubLinksCvr.classList.contains('show') ? '-' : '+';
          }
        });
      }
      rowF1.append(col);
    });
  }

  // Social Links
  if (socialLinkRows.length > 0) {
    const rowF2 = document.createElement('div');
    rowF2.classList.add('row', 'f2', 'justify-content-between');
    containerWrp.append(rowF2);

    const colSocial = document.createElement('div');
    colSocial.classList.add('col', 'col-xl-2', 'ftr-drop-wrp');
    rowF2.append(colSocial);

    const socialHeading = document.createElement('p');
    socialHeading.classList.add('ttle', 'accordion_head2');
    socialHeading.innerHTML = 'Social Media <span class="plusminus2">+</span>';
    colSocial.append(socialHeading);

    const socialIconsCvr = document.createElement('div');
    socialIconsCvr.classList.add('ftr-sub-links-cvr', 'accordion_body2', 'socialIcons');
    colSocial.append(socialIconsCvr);

    socialLinkRows.forEach((row) => {
      const linkCell = [...row.children].find(cell => cell.querySelector('a'));
      if (linkCell) {
        const link = linkCell.querySelector('a');
        if (link) {
          const socialLink = document.createElement('a');
          socialLink.href = link.href;
          socialLink.classList.add('ftr-link');
          socialLink.target = '_blank';
          // Add appropriate social media icon class based on href
          if (link.href.includes('facebook')) {
            socialLink.innerHTML = '<i class="fab fa-facebook-square"></i>';
          } else if (link.href.includes('instagram')) {
            socialLink.innerHTML = '<i class="fab fa-instagram"></i>';
          } else if (link.href.includes('twitter')) {
            socialLink.innerHTML = '<i class="fa-brands fa-square-x-twitter"></i>';
          } else if (link.href.includes('linkedin')) {
            socialLink.innerHTML = '<i class="fab fa-linkedin"></i>';
          } else if (link.href.includes('youtube')) {
            socialLink.innerHTML = '<i class="fab fa-youtube-square"></i>';
          } else {
            socialLink.textContent = link.textContent; // Fallback
          }
          socialIconsCvr.append(socialLink);
        }
      }
      moveInstrumentation(row, socialIconsCvr); // Move instrumentation for social link rows
    });

    socialHeading.addEventListener('click', () => {
      socialIconsCvr.classList.toggle('show');
      socialHeading.classList.toggle('active');
      const plusMinus = socialHeading.querySelector('.plusminus2');
      if (plusMinus) {
        plusMinus.textContent = socialIconsCvr.classList.contains('show') ? '-' : '+';
      }
    });
  }

  // Bottom Links and Copyright
  const rowF3 = document.createElement('div');
  rowF3.classList.add('row', 'mt25', 'f3');
  containerWrp.append(rowF3);

  const colBottomLinks = document.createElement('div');
  colBottomLinks.classList.add('col-12', 'col-md-6');
  rowF3.append(colBottomLinks);

  bottomLinkRows.forEach((row) => {
    const urlCell = [...row.children].find(cell => cell.querySelector('a'));
    const labelCell = [...row.children].find(cell => !cell.querySelector('a') && !cell.querySelector('picture'));

    if (urlCell && labelCell) {
      const link = urlCell.querySelector('a');
      if (link) {
        const bottomLink = document.createElement('a');
        bottomLink.href = link.href;
        bottomLink.textContent = labelCell.textContent.trim() || link.textContent.trim();
        colBottomLinks.append(bottomLink);
      }
    }
    moveInstrumentation(row, colBottomLinks); // Move instrumentation for bottom link rows
  });

  if (copyrightRow) {
    const colCopyright = document.createElement('div');
    colCopyright.classList.add('col-12', 'col-md-6');
    moveInstrumentation(copyrightRow, colCopyright);

    const copyrightP = document.createElement('p');
    copyrightP.classList.add('copy-txt', 'text-md-end');
    while (copyrightRow.firstChild) copyrightP.append(copyrightRow.firstChild);
    colCopyright.append(copyrightP);
    rowF3.append(colCopyright);
  }

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
