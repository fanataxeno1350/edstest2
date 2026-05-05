import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const mainHeadingRow = children[0];
  const productItemRows = children.filter(
    (row) => row.querySelector('picture') && row.children.length === 2,
  );
  const gheePanelRows = children.filter(
    (row) => row.querySelector('picture') && row.children.length === 8,
  );
  const milkPanelRows = children.filter(
    (row) => row.querySelector('picture') && row.children.length === 4,
  );

  const mainBox = document.createElement('div');
  mainBox.classList.add('account-mainBox', 'mx-md-16');

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row', 'gx-5');

  const leftSection = document.createElement('div');
  leftSection.classList.add('mt-8', 'mt-md-10', 'col-lg-4');

  const heading = document.createElement('p');
  heading.classList.add(
    'font-24',
    'font-md-40',
    'fw-bold',
    'product-container_heading',
    'font-baskerville',
  );
  moveInstrumentation(mainHeadingRow, heading);
  heading.textContent = mainHeadingRow.textContent.trim();
  leftSection.append(heading);

  const productMainBox = document.createElement('div');
  productMainBox.classList.add('product-mainbox', 'mt-10', 'mt-md-12');

  productItemRows.forEach((row) => {
    const productItemDiv = document.createElement('div');
    moveInstrumentation(row, productItemDiv);

    const productIconCell = row.querySelector('picture');
    // FIXED: Using content detection instead of index access
    const cells = [...row.children];
    const productLabelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a')) || cells[1];

    const productDiv = document.createElement('div');
    productDiv.classList.add('milk_ghee_smallImag', 'ghee-packet', 'product-hover');

    if (productIconCell) {
      const picture = productIconCell.closest('picture');
      const img = picture ? picture.querySelector('img') : null;
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        productDiv.append(optimizedPic);
        optimizedPic.classList.add('left-section-gheeBox', 'object-fit-contain');
      }
    }

    const productLabel = document.createElement('p');
    productLabel.classList.add('product-subnames');
    productLabel.textContent = productLabelCell ? productLabelCell.textContent.trim() : '';
    productDiv.append(productLabel);
    productItemDiv.append(productDiv);
    productMainBox.append(productItemDiv);
  });

  leftSection.append(productMainBox);
  rowDiv.append(leftSection);

  const rightSection = document.createElement('div');
  rightSection.classList.add(
    'right-section',
    'mt-10',
    'py-0',
    'position-relative',
    'col-lg-8',
  );

  const gheeBox = document.createElement('div');
  gheeBox.classList.add('ghee_box');

  gheePanelRows.forEach((row) => {
    const [
      backgroundDesktopCell,
      backgroundMobileCell,
      headlineBeforeCell,
      ctaIconCell,
      ctaLinkCell,
      ctaLabelCell,
      headlineAfterCell,
      confirmationIconCell,
    ] = [...row.children];

    const accountMainBgBox = document.createElement('div');
    accountMainBgBox.classList.add('account-mainBg-box', 'w-100');
    moveInstrumentation(row, accountMainBgBox);

    // Desktop Background
    const annualBgDesktop = document.createElement('div');
    annualBgDesktop.classList.add(
      'annual-background_image--overlay',
      'd-flex',
      'annual-bg-desktop',
    );
    if (backgroundDesktopCell) {
      const picture = backgroundDesktopCell.querySelector('picture');
      const img = picture ? picture.querySelector('img') : null;
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.classList.add('account-bgImg', 'with-overlay');
        annualBgDesktop.append(optimizedPic);
      }
    }
    const desktopOverlay = document.createElement('div');
    desktopOverlay.classList.add('overlay');
    annualBgDesktop.append(desktopOverlay);
    accountMainBgBox.append(annualBgDesktop);

    // Mobile Background
    const annualBgMobile = document.createElement('div');
    annualBgMobile.classList.add(
      'annual-background_image--overlay',
      'd-flex',
      'annual-bg-mobile',
    );
    if (backgroundMobileCell) {
      const picture = backgroundMobileCell.querySelector('picture');
      const img = picture ? picture.querySelector('img') : null;
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.classList.add('account-bgImg', 'with-overlay');
        annualBgMobile.append(optimizedPic);
      }
    }
    const mobileOverlay = document.createElement('div');
    mobileOverlay.classList.add('overlay');
    annualBgMobile.append(mobileOverlay);
    accountMainBgBox.append(annualBgMobile);

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
    const beforeContent = document.createElement('div');
    beforeContent.classList.add('d-flex', 'flex-column', 'align-items-center');

    const gheeMobileHeadingBefore = document.createElement('div');
    gheeMobileHeadingBefore.classList.add(
      'ghee-mobile-heading',
      'text-center',
      'font-md-18',
      'font-baskerville',
      'leading-32',
    );
    if (headlineBeforeCell) {
      gheeMobileHeadingBefore.innerHTML = headlineBeforeCell.innerHTML;
    }
    beforeContent.append(gheeMobileHeadingBefore);

    const downloadButton = document.createElement('button');
    downloadButton.classList.add('annual-report_DownloadBtn', 'my-9');
    const downloadIconDiv = document.createElement('div');
    downloadIconDiv.classList.add('download_icon');
    downloadIconDiv.innerHTML = `
      <svg class="icon-downloaded">
        <use xlink:href="#download_btn"></use>
      </svg>
    `; // Placeholder for SVG, actual path from sprite.svg
    downloadButton.append(downloadIconDiv);
    beforeContent.append(downloadButton);

    const downloadLinkDiv = document.createElement('div');
    downloadLinkDiv.classList.add('d-flex', 'mb-6');
    const downloadLinkInnerDiv = document.createElement('div');
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
    const foundCtaLink = ctaLinkCell ? ctaLinkCell.querySelector('a') : null;
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
      ctaLink.download = 'report.pdf'; // Assuming download attribute
    }
    ctaLink.textContent = ctaLabelCell ? ctaLabelCell.textContent.trim() : '';
    downloadLinkInnerDiv.append(ctaLink);
    downloadLinkDiv.append(downloadLinkInnerDiv);
    beforeContent.append(downloadLinkDiv);

    const whatsappLinkBefore = document.createElement('div');
    whatsappLinkBefore.classList.add('Whatsapp-link', 'mb-8', 'text-center');
    beforeContent.append(whatsappLinkBefore);

    rightSubtextBefore.append(beforeContent);
    accountMainBgBox.append(rightSubtextBefore);

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
    const afterContent = document.createElement('div');
    afterContent.classList.add(
      'd-flex',
      'flex-column',
      'align-items-center',
      'justify-content-around',
    );

    const gheeMobileHeadingAfter = document.createElement('div');
    gheeMobileHeadingAfter.classList.add(
      'ghee-mobile-heading',
      'text-center',
      'font-md-18',
      'font-baskerville',
      'leading-32',
    );
    if (headlineAfterCell) {
      gheeMobileHeadingAfter.innerHTML = headlineAfterCell.innerHTML;
    }
    afterContent.append(gheeMobileHeadingAfter);

    const downloadedButton = document.createElement('button');
    downloadedButton.classList.add('annual-report_DownloadBtn', 'my-9');
    const tickDownloadDiv = document.createElement('div');
    tickDownloadDiv.classList.add('tick_download');
    tickDownloadDiv.innerHTML = `
      <svg class="icon-downloaded">
        <use xlink:href="#Downloaded-btn"></use>
      </svg>
    `; // Placeholder for SVG
    downloadedButton.append(tickDownloadDiv);
    afterContent.append(downloadedButton);

    const afterDownloadLinkDiv = document.createElement('div');
    afterDownloadLinkDiv.classList.add('d-flex', 'mb-6');
    const afterDownloadLinkInnerDiv = document.createElement('div');
    const afterDownloadButton = document.createElement('button');
    afterDownloadButton.classList.add(
      'download-report_btn',
      'download_report_btnAfter',
      'disabled',
      'bg-light-pink',
      'border-light-pink',
      'text-cream-100',
    );
    afterDownloadButton.textContent = ctaLabelCell ? ctaLabelCell.textContent.trim() : '';
    afterDownloadLinkInnerDiv.append(afterDownloadButton);
    afterDownloadLinkDiv.append(afterDownloadLinkInnerDiv);
    afterContent.append(afterDownloadLinkDiv);

    const whatsappLinkAfter = document.createElement('div');
    whatsappLinkAfter.classList.add('Whatsapp-link', 'mb-8', 'text-center');
    afterContent.append(whatsappLinkAfter);

    rightSubtextAfter.append(afterContent);
    accountMainBgBox.append(rightSubtextAfter);

    gheeBox.append(accountMainBgBox);

    // Toggle logic for download
    downloadButton.addEventListener('click', (e) => {
      e.preventDefault();
      rightSubtextBefore.classList.add('d-none');
      rightSubtextAfter.classList.remove('d-none');
    });
    // Initial state
    rightSubtextAfter.classList.add('d-none');
  });

  rightSection.append(gheeBox);

  const milkSectionImage = document.createElement('div');
  milkSectionImage.classList.add('position-relative', 'milk-section_image');

  milkPanelRows.forEach((row) => {
    const [backgroundDesktopCell, backgroundMobileCell, headlineCell, whatsappLinkCell] = [
      ...row.children,
    ];

    const accountMainBgBox = document.createElement('div');
    accountMainBgBox.classList.add('w-100', 'account-mainBg-box', 'd-flex');
    moveInstrumentation(row, accountMainBgBox);

    // Desktop Background
    const annualBgDesktop = document.createElement('div');
    annualBgDesktop.classList.add(
      'annual-background_image--overlay',
      'd-flex',
      'annual-bg-desktop',
    );
    if (backgroundDesktopCell) {
      const picture = backgroundDesktopCell.querySelector('picture');
      const img = picture ? picture.querySelector('img') : null;
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.classList.add('account-bgImg', 'with-overlay');
        annualBgDesktop.append(optimizedPic);
      }
    }
    const desktopOverlay = document.createElement('div');
    desktopOverlay.classList.add('overlay');
    annualBgDesktop.append(desktopOverlay);
    accountMainBgBox.append(annualBgDesktop);

    // Mobile Background
    const annualBgMobile = document.createElement('div');
    annualBgMobile.classList.add(
      'annual-background_image--overlay',
      'd-flex',
      'annual-bg-mobile',
    );
    if (backgroundMobileCell) {
      const picture = backgroundMobileCell.querySelector('picture');
      const img = picture ? picture.querySelector('img') : null;
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.classList.add('account-bgImg', 'with-overlay');
        annualBgMobile.append(optimizedPic);
      }
    }
    const mobileOverlay = document.createElement('div');
    mobileOverlay.classList.add('overlay');
    annualBgMobile.append(mobileOverlay);
    accountMainBgBox.append(annualBgMobile);

    milkSectionImage.append(accountMainBgBox);

    const rightSubtextMilk = document.createElement('div');
    rightSubtextMilk.classList.add(
      'right-subtext',
      'position-absolute',
      'start-0',
      'end-0',
      'bottom-0',
      'right-subtext-milk',
    );
    const milkContent = document.createElement('div');
    milkContent.classList.add('d-flex', 'flex-column', 'align-items-center');

    const gheeMobileHeadingMilk = document.createElement('div');
    gheeMobileHeadingMilk.classList.add(
      'ghee-mobile-heading',
      'text-center',
      'font-md-18',
      'font-baskerville',
      'leading-32',
    );
    if (headlineCell) {
      gheeMobileHeadingMilk.innerHTML = headlineCell.innerHTML;
    }
    milkContent.append(gheeMobileHeadingMilk);

    const mt6Div = document.createElement('div');
    mt6Div.classList.add('font-md-18', 'mt-6', 'text-center');
    milkContent.append(mt6Div);

    const whatsappIconDiv = document.createElement('div');
    whatsappIconDiv.classList.add('my-9');
    whatsappIconDiv.innerHTML = `
      <svg class="icon-downloaded">
        <use xlink:href="#whatsapp_icon"></use>
      </svg>
    `; // Placeholder for SVG
    milkContent.append(whatsappIconDiv);

    const whatsappLinkDiv = document.createElement('div');
    whatsappLinkDiv.classList.add('Whatsapp-link', 'mb-8', 'text-center');
    const whatsappLink = whatsappLinkCell ? whatsappLinkCell.querySelector('a') : null;
    if (whatsappLink) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = whatsappLink.href;
      a.textContent = 'Whatsapp'; // Assuming generic text, actual text from original HTML
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      const span = document.createElement('span');
      span.classList.add('cmp-link__screen-reader-only');
      span.textContent = 'opens in a new tab';
      a.append(span);
      p.append('Check Your Milk Report Card on ');
      p.append(a);
      whatsappLinkDiv.append(p);
    }
    milkContent.append(whatsappLinkDiv);

    rightSubtextMilk.append(milkContent);
    milkSectionImage.append(rightSubtextMilk);
  });

  rightSection.append(milkSectionImage);
  rowDiv.append(rightSection);
  mainBox.append(rowDiv);

  const container = document.createElement('div');
  container.classList.add('container-xl', 'annualReport_mainBox', 'product-selection-component');
  container.append(mainBox);

  block.replaceChildren(container);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
