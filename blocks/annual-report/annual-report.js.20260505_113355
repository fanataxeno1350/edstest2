import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Destructure mainHeadlineRow to avoid direct children[0] access
  const [mainHeadlineRow, ...remainingRows] = children;

  const productItemRows = remainingRows.filter((row) => row.children.length === 2);
  const productDetailItemRows = remainingRows.filter((row) => row.children.length === 9);

  const root = document.createElement('div');
  root.classList.add('container-xl', 'annualReport_mainBox', 'product-selection-component');

  const accountMainBox = document.createElement('div');
  accountMainBox.classList.add('account-mainBox', 'mx-md-16');

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row', 'gx-5');

  const leftSection = document.createElement('div');
  leftSection.classList.add('mt-8', 'mt-md-10', 'col-lg-4');

  const headlineP = document.createElement('p');
  headlineP.classList.add('font-24', 'font-md-40', 'fw-bold', 'product-container_heading', 'font-baskerville');
  moveInstrumentation(mainHeadlineRow, headlineP);
  // Access the cell via destructuring or direct children[0] if it's the only cell in the row
  const [mainHeadlineCell] = [...mainHeadlineRow.children];
  headlineP.textContent = mainHeadlineCell?.textContent.trim();
  leftSection.append(headlineP);

  const productMainBox = document.createElement('div');
  productMainBox.classList.add('product-mainbox', 'mt-10', 'mt-md-12');

  productItemRows.forEach((row, index) => {
    const [productIconCell, productLabelCell] = [...row.children];

    const productDiv = document.createElement('div');
    const classNames = ['milk_ghee_smallImag'];
    if (index === 0) {
      classNames.push('ghee-packet', 'product-hover');
    } else {
      classNames.push('milk-packet');
    }
    productDiv.classList.add(...classNames);

    const picture = productIconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        productDiv.append(optimizedPic);
      }
    }

    const productLabelP = document.createElement('p');
    productLabelP.classList.add('product-subnames');
    productLabelP.textContent = productLabelCell.textContent.trim();
    productDiv.append(productLabelP);

    moveInstrumentation(row, productDiv);
    productMainBox.append(productDiv);
  });

  leftSection.append(productMainBox);
  rowDiv.append(leftSection);

  const rightSection = document.createElement('div');
  rightSection.classList.add('right-section', 'mt-10', 'py-0', 'position-relative', 'col-lg-8');

  productDetailItemRows.forEach((row, index) => {
    const [
      backgroundDesktopCell,
      backgroundMobileCell,
      headlineBeforeCell,
      ctaIconCell,
      ctaLinkCell,
      ctaLabelCell,
      headlineAfterCell,
      confirmationIconCell,
      whatsappLinkCell,
    ] = [...row.children];

    const productDetailBox = document.createElement('div');
    if (index === 0) {
      productDetailBox.classList.add('ghee_box');
    } else {
      productDetailBox.classList.add('position-relative', 'milk-section_image');
    }

    const accountMainBgBox = document.createElement('div');
    accountMainBgBox.classList.add('account-mainBg-box', 'w-100');
    if (index !== 0) {
      accountMainBgBox.classList.add('d-flex');
    }

    const desktopBgOverlay = document.createElement('div');
    desktopBgOverlay.classList.add('annual-background_image--overlay', 'd-flex', 'annual-bg-desktop');
    const desktopPicture = backgroundDesktopCell.querySelector('picture');
    if (desktopPicture) {
      const img = desktopPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.querySelector('img').classList.add('account-bgImg', 'with-overlay');
        desktopBgOverlay.append(optimizedPic);
      }
    }
    const desktopOverlayDiv = document.createElement('div');
    desktopOverlayDiv.classList.add('overlay');
    desktopBgOverlay.append(desktopOverlayDiv);
    accountMainBgBox.append(desktopBgOverlay);

    const mobileBgOverlay = document.createElement('div');
    mobileBgOverlay.classList.add('annual-background_image--overlay', 'd-flex', 'annual-bg-mobile');
    const mobilePicture = backgroundMobileCell.querySelector('picture');
    if (mobilePicture) {
      const img = mobilePicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.querySelector('img').classList.add('account-bgImg', 'with-overlay');
        mobileBgOverlay.append(optimizedPic);
      }
    }
    const mobileOverlayDiv = document.createElement('div');
    mobileOverlayDiv.classList.add('overlay');
    mobileBgOverlay.append(mobileOverlayDiv);
    accountMainBgBox.append(mobileBgOverlay);

    productDetailBox.append(accountMainBgBox);

    // Before Download Section
    const rightSubtextBefore = document.createElement('div');
    rightSubtextBefore.classList.add(
      'right-subtext',
      'position-absolute',
      'start-0',
      'end-0',
      'bottom-0',
      'right-subtext__BeforeDownload',
    );
    const beforeContentWrapper = document.createElement('div');
    beforeContentWrapper.classList.add('d-flex', 'flex-column', 'align-items-center');

    const gheeMobileHeadingBefore = document.createElement('div'); // Changed from p to div for richtext
    gheeMobileHeadingBefore.classList.add(
      'ghee-mobile-heading',
      'text-center',
      'font-md-18',
      'font-baskerville',
      'leading-32',
    );
    // Use innerHTML for richtext content
    gheeMobileHeadingBefore.innerHTML = headlineBeforeCell?.innerHTML || '';
    beforeContentWrapper.append(gheeMobileHeadingBefore);

    const downloadButton = document.createElement('button');
    downloadButton.classList.add('annual-report_DownloadBtn', 'my-9');
    const downloadIconDiv = document.createElement('div');
    downloadIconDiv.classList.add('download_icon');
    // Replaced hardcoded SVG path with inline SVG
    downloadIconDiv.innerHTML = `
      <svg class="icon-downloaded" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
      </svg>
    `;
    downloadButton.append(downloadIconDiv);
    beforeContentWrapper.append(downloadButton);

    const downloadLinkWrapper = document.createElement('div');
    downloadLinkWrapper.classList.add('d-flex', 'mb-6');
    const downloadLinkDiv = document.createElement('div');
    const ctaLink = document.createElement('a');
    ctaLink.classList.add(
      'text-decoration-none',
      'download-report_btn',
      'cta-analytics',
      'download_report_btnBefore',
      'text-cream-100',
      'border',
      'border-2',
      'border-red-100',
      'border-maroon-100-hover',
      'border-red-300-active',
      'bg-red-100',
      'bg-maroon-100-hover',
      'bg-red-300-active',
    );
    const foundCtaLink = ctaLinkCell.querySelector('a');
    if (foundCtaLink) ctaLink.href = foundCtaLink.href;
    ctaLink.textContent = ctaLabelCell.textContent.trim(); // Read text from ctaLabelCell
    ctaLink.setAttribute('download', 'report.pdf'); // Assuming this is for a report download
    downloadLinkDiv.append(ctaLink);
    downloadLinkWrapper.append(downloadLinkDiv);
    beforeContentWrapper.append(downloadLinkWrapper);

    const whatsappLinkDivBefore = document.createElement('div');
    whatsappLinkDivBefore.classList.add('Whatsapp-link', 'mb-8', 'text-center');
    beforeContentWrapper.append(whatsappLinkDivBefore);

    rightSubtextBefore.append(beforeContentWrapper);
    productDetailBox.append(rightSubtextBefore);

    // After Download Section
    const rightSubtextAfter = document.createElement('div');
    rightSubtextAfter.classList.add(
      'right-subtext',
      'position-absolute',
      'start-0',
      'end-0',
      'bottom-0',
      'right-section_subtextafter',
      'right-subtext__AfterDownload',
    );
    const afterContentWrapper = document.createElement('div');
    afterContentWrapper.classList.add('d-flex', 'flex-column', 'align-items-center', 'justify-content-around');

    const gheeMobileHeadingAfter = document.createElement('div'); // Changed from p to div for richtext
    gheeMobileHeadingAfter.classList.add(
      'ghee-mobile-heading',
      'text-center',
      'font-md-18',
      'font-baskerville',
      'leading-32',
    );
    // Use innerHTML for richtext content
    gheeMobileHeadingAfter.innerHTML = headlineAfterCell?.innerHTML || '';
    afterContentWrapper.append(gheeMobileHeadingAfter);

    const confirmationButton = document.createElement('button');
    confirmationButton.classList.add('annual-report_DownloadBtn', 'my-9');
    const tickDownloadDiv = document.createElement('div');
    tickDownloadDiv.classList.add('tick_download');
    // Replaced hardcoded SVG path with inline SVG
    tickDownloadDiv.innerHTML = `
      <svg class="icon-downloaded" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
      </svg>
    `;
    confirmationButton.append(tickDownloadDiv);
    afterContentWrapper.append(confirmationButton);

    const downloadReportBtnAfterWrapper = document.createElement('div');
    downloadReportBtnAfterWrapper.classList.add('d-flex', 'mb-6');
    const downloadReportBtnAfterDiv = document.createElement('div');
    const downloadReportBtnAfter = document.createElement('button');
    downloadReportBtnAfter.classList.add(
      'download-report_btn',
      'download_report_btnAfter',
      'disabled',
      'bg-light-pink',
      'border-light-pink',
      'text-cream-100',
    );
    downloadReportBtnAfter.textContent = 'Download report'; // This text is hardcoded in original HTML, so it's fine.
    downloadReportBtnAfterDiv.append(downloadReportBtnAfter);
    downloadReportBtnAfterWrapper.append(downloadReportBtnAfterDiv);
    afterContentWrapper.append(downloadReportBtnAfterWrapper);

    const whatsappLinkDivAfter = document.createElement('div');
    whatsappLinkDivAfter.classList.add('Whatsapp-link', 'mb-8', 'text-center');
    const whatsappLink = whatsappLinkCell.querySelector('a');
    if (whatsappLink) {
      const whatsappAnchor = document.createElement('a');
      whatsappAnchor.href = whatsappLink.href;
      // Extract text from the anchor in the cell, or use a default if not present
      whatsappAnchor.textContent = whatsappLink.textContent.trim() || 'Check Your Milk Report Card on Whatsapp';
      whatsappAnchor.target = '_blank';
      whatsappAnchor.rel = 'noopener noreferrer';
      whatsappLinkDivAfter.append(whatsappAnchor);
    }
    afterContentWrapper.append(whatsappLinkDivAfter);

    rightSubtextAfter.append(afterContentWrapper);
    productDetailBox.append(rightSubtextAfter);

    moveInstrumentation(row, productDetailBox);
    rightSection.append(productDetailBox);

    // Event listeners for toggle behavior
    downloadButton.addEventListener('click', () => {
      rightSubtextBefore.style.display = 'none';
      rightSubtextAfter.style.display = 'flex';
      // Trigger download if needed
      if (ctaLink.href && ctaLink.href !== '#') {
        const link = document.createElement('a');
        link.href = ctaLink.href;
        link.download = ctaLink.download || 'report.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });

    // Initial state
    rightSubtextAfter.style.display = 'none';
    rightSubtextBefore.style.display = 'flex';
  });

  rowDiv.append(rightSection);
  accountMainBox.append(rowDiv);
  root.append(accountMainBox);

  block.replaceChildren(root);

  // This part of the code seems to be a generic optimization for all images within the block.
  // It should be fine as it is, as it's re-optimizing images after the block structure is built.
  root.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
