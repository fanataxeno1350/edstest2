import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Heading is always the first row
  const headingRow = children.find((row) => row.children.length === 1 && !row.querySelector('picture') && !row.querySelector('a'));
  const headingText = headingRow ? headingRow.querySelector('div').textContent.trim() : '';

  // Product rows have 2 cells (image, label)
  const productRows = children.filter((row) => row.children.length === 2 && row.querySelector('picture'));
  // Ghee section rows have 7 cells
  const gheeSectionRows = children.filter((row) => row.children.length === 7 && row.querySelector('picture'));
  // Milk section rows have 5 cells
  const milkSectionRows = children.filter((row) => row.children.length === 5 && row.querySelector('picture'));

  block.innerHTML = '';
  block.classList.add('container-xl', 'annualReport_mainBox');

  const accountMainBox = document.createElement('div');
  accountMainBox.classList.add('account-mainBox', 'mx-md-16');
  block.append(accountMainBox);

  const row = document.createElement('div');
  row.classList.add('row', 'gx-5');
  accountMainBox.append(row);

  const leftSection = document.createElement('div');
  leftSection.classList.add('mt-8', 'mt-md-10', 'col-lg-4');
  row.append(leftSection);

  const heading = document.createElement('p');
  heading.classList.add(
    'font-24',
    'font-md-40',
    'fw-bold',
    'product-container_heading',
    'font-baskerville',
  );
  heading.textContent = headingText;
  if (headingRow) {
    moveInstrumentation(headingRow, heading);
  }
  leftSection.append(heading);

  const productMainBox = document.createElement('div');
  productMainBox.classList.add('product-mainbox', 'mt-10', 'mt-md-12');
  leftSection.append(productMainBox);

  productRows.forEach((productRow) => {
    const cells = [...productRow.children];
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const labelCell = cells.find(cell => !cell.querySelector('picture'));

    const productDiv = document.createElement('div');
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('milk_ghee_smallImag', 'product-hover');

    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      const img = picture ? picture.querySelector('img') : null;
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        optimizedImg.classList.add('left-section-gheeBox', 'object-fit-contain');
        moveInstrumentation(img, optimizedImg);
        imageWrapper.append(optimizedPic);
      }
    }

    if (labelCell) {
      const label = document.createElement('p');
      label.classList.add('product-subnames');
      label.textContent = labelCell.textContent.trim();
      moveInstrumentation(labelCell, label);
      imageWrapper.append(label);
    }

    moveInstrumentation(productRow, productDiv);
    productDiv.append(imageWrapper);
    productMainBox.append(productDiv);
  });

  // Assign specific classes based on product type (first image in productMainBox)
  const productItems = productMainBox.querySelectorAll('.milk_ghee_smallImag');
  if (productItems.length > 0) {
    productItems[0].classList.add('ghee-packet');
  }
  if (productItems.length > 1) {
    productItems[1].classList.add('milk-packet');
  }

  const rightSection = document.createElement('div');
  rightSection.classList.add(
    'right-section',
    'mt-10',
    'py-0',
    'position-relative',
    'col-lg-8',
  );
  row.append(rightSection);

  // Ghee Section
  if (gheeSectionRows.length > 0) {
    const gheeBox = document.createElement('div');
    gheeBox.classList.add('ghee_box');
    rightSection.append(gheeBox);

    gheeSectionRows.forEach((gheeRow) => {
      const cells = [...gheeRow.children];
      const desktopBgImageCell = cells[0];
      const mobileBgImageCell = cells[1];
      const mainTextCell = cells[2];
      const downloadIconCell = cells[3];
      const downloadLinkCell = cells[4];
      const afterDownloadTextCell = cells[5];
      const afterDownloadIconCell = cells[6];

      const accountMainBgBox = document.createElement('div');
      accountMainBgBox.classList.add('account-mainBg-box', 'w-100');
      gheeBox.append(accountMainBgBox);

      // Desktop Background
      const desktopBgOverlay = document.createElement('div');
      desktopBgOverlay.classList.add(
        'annual-background_image--overlay',
        'd-flex',
        'annual-bg-desktop',
      );
      const desktopPicture = desktopBgImageCell.querySelector('picture');
      const desktopImg = desktopPicture ? desktopPicture.querySelector('img') : null;
      if (desktopImg) {
        const optimizedPic = createOptimizedPicture(
          desktopImg.src,
          desktopImg.alt,
          false,
          [{ width: '750' }],
        );
        const optimizedImg = optimizedPic.querySelector('img');
        optimizedImg.classList.add('account-bgImg', 'with-overlay');
        optimizedImg.setAttribute('height', '392px');
        moveInstrumentation(desktopImg, optimizedImg);
        desktopBgOverlay.append(optimizedPic);
      }
      const desktopOverlayDiv = document.createElement('div');
      desktopOverlayDiv.classList.add('overlay');
      desktopBgOverlay.append(desktopOverlayDiv);
      accountMainBgBox.append(desktopBgOverlay);

      // Mobile Background
      const mobileBgOverlay = document.createElement('div');
      mobileBgOverlay.classList.add(
        'annual-background_image--overlay',
        'd-flex',
        'annual-bg-mobile',
      );
      const mobilePicture = mobileBgImageCell.querySelector('picture');
      const mobileImg = mobilePicture ? mobilePicture.querySelector('img') : null;
      if (mobileImg) {
        const optimizedPic = createOptimizedPicture(
          mobileImg.src,
          mobileImg.alt,
          false,
          [{ width: '750' }],
        );
        const optimizedImg = optimizedPic.querySelector('img');
        optimizedImg.classList.add('account-bgImg', 'with-overlay');
        optimizedImg.setAttribute('height', '447px');
        moveInstrumentation(mobileImg, optimizedImg);
        mobileBgOverlay.append(optimizedPic);
      }
      const mobileOverlayDiv = document.createElement('div');
      mobileOverlayDiv.classList.add('overlay');
      mobileBgOverlay.append(mobileOverlayDiv);
      accountMainBgBox.append(mobileBgOverlay);

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
      beforeContentWrapper.classList.add(
        'd-flex',
        'flex-column',
        'align-items-center',
      );
      rightSubtextBefore.append(beforeContentWrapper);

      const gheeMobileHeadingBefore = document.createElement('div');
      gheeMobileHeadingBefore.classList.add(
        'ghee-mobile-heading',
        'text-center',
        'font-md-18',
        'font-baskerville',
        'leading-32',
      );
      const mainTextP = document.createElement('p');
      mainTextP.textContent = mainTextCell.textContent.trim();
      gheeMobileHeadingBefore.append(mainTextP);
      moveInstrumentation(mainTextCell, gheeMobileHeadingBefore);
      beforeContentWrapper.append(gheeMobileHeadingBefore);

      const downloadButton = document.createElement('button');
      downloadButton.classList.add('annual-report_DownloadBtn', 'my-9');
      const downloadIconDiv = document.createElement('div');
      downloadIconDiv.classList.add('download_icon');
      const downloadIconPicture = downloadIconCell.querySelector('picture');
      const downloadIconImg = downloadIconPicture ? downloadIconPicture.querySelector('img') : null;
      if (downloadIconImg) {
        const optimizedPic = createOptimizedPicture(
          downloadIconImg.src,
          downloadIconImg.alt,
          false,
          [{ width: '750' }],
        );
        moveInstrumentation(downloadIconImg, optimizedPic.querySelector('img'));
        downloadIconDiv.append(optimizedPic);
      }
      downloadButton.append(downloadIconDiv);
      moveInstrumentation(downloadIconCell, downloadButton);
      beforeContentWrapper.append(downloadButton);

      const downloadLinkWrapper = document.createElement('div');
      downloadLinkWrapper.classList.add('d-flex', 'mb-6');
      const downloadLinkDiv = document.createElement('div');
      const downloadLinkAnchor = document.createElement('a');
      const foundDownloadLink = downloadLinkCell.querySelector('a');
      if (foundDownloadLink) {
        downloadLinkAnchor.href = foundDownloadLink.href;
        downloadLinkAnchor.textContent = 'Download report'; // Hardcoded label from original HTML
        downloadLinkAnchor.setAttribute('download', 'report.pdf'); // Hardcoded attribute from original HTML
        downloadLinkAnchor.classList.add(
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
        moveInstrumentation(foundDownloadLink, downloadLinkAnchor);
      }
      downloadLinkDiv.append(downloadLinkAnchor);
      downloadLinkWrapper.append(downloadLinkDiv);
      beforeContentWrapper.append(downloadLinkWrapper);
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
      const afterContentWrapper = document.createElement('div');
      afterContentWrapper.classList.add(
        'd-flex',
        'flex-column',
        'align-items-center',
        'justify-content-around',
      );
      rightSubtextAfter.append(afterContentWrapper);

      const gheeMobileHeadingAfter = document.createElement('div');
      gheeMobileHeadingAfter.classList.add(
        'ghee-mobile-heading',
        'text-center',
        'font-md-18',
        'font-baskerville',
        'leading-32',
      );
      const afterDownloadTextP = document.createElement('p');
      afterDownloadTextP.textContent = afterDownloadTextCell.textContent.trim();
      gheeMobileHeadingAfter.append(afterDownloadTextP);
      moveInstrumentation(afterDownloadTextCell, gheeMobileHeadingAfter);
      afterContentWrapper.append(gheeMobileHeadingAfter);

      const afterDownloadButton = document.createElement('button');
      afterDownloadButton.classList.add('annual-report_DownloadBtn', 'my-9');
      const tickDownloadDiv = document.createElement('div');
      tickDownloadDiv.classList.add('tick_download');
      const afterDownloadIconPicture = afterDownloadIconCell.querySelector('picture');
      const afterDownloadIconImg = afterDownloadIconPicture ? afterDownloadIconPicture.querySelector('img') : null;
      if (afterDownloadIconImg) {
        const optimizedPic = createOptimizedPicture(
          afterDownloadIconImg.src,
          afterDownloadIconImg.alt,
          false,
          [{ width: '750' }],
        );
        moveInstrumentation(afterDownloadIconImg, optimizedPic.querySelector('img'));
        tickDownloadDiv.append(optimizedPic);
      }
      afterDownloadButton.append(tickDownloadDiv);
      moveInstrumentation(afterDownloadIconCell, afterDownloadButton);
      afterContentWrapper.append(afterDownloadButton);

      const afterDownloadLinkWrapper = document.createElement('div');
      afterDownloadLinkWrapper.classList.add('d-flex', 'mb-6');
      const afterDownloadLinkDiv = document.createElement('div');
      const afterDownloadLinkButton = document.createElement('button'); // This is a button in original HTML
      afterDownloadLinkButton.classList.add(
        'download-report_btn',
        'download_report_btnAfter',
        'disabled',
        'bg-light-pink',
        'border-light-pink',
        'text-cream-100',
      );
      afterDownloadLinkButton.textContent = 'Download report'; // Hardcoded label from original HTML
      afterDownloadLinkDiv.append(afterDownloadLinkButton);
      afterDownloadLinkWrapper.append(afterDownloadLinkDiv);
      afterContentWrapper.append(afterDownloadLinkWrapper);

      const whatsappLinkPlaceholder = document.createElement('div');
      whatsappLinkPlaceholder.classList.add('Whatsapp-link', 'mb-8', 'text-center');
      afterContentWrapper.append(whatsappLinkPlaceholder);

      accountMainBgBox.append(rightSubtextAfter);

      // Toggle logic for before/after download sections
      downloadButton.addEventListener('click', () => {
        rightSubtextBefore.style.display = 'none';
        rightSubtextAfter.style.display = 'flex';
      });
      moveInstrumentation(gheeRow, gheeBox);
    });
  }

  // Milk Section
  if (milkSectionRows.length > 0) {
    const milkSectionImage = document.createElement('div');
    milkSectionImage.classList.add('position-relative', 'milk-section_image');
    rightSection.append(milkSectionImage);

    milkSectionRows.forEach((milkRow) => {
      const cells = [...milkRow.children];
      const desktopBgImageCell = cells[0];
      const mobileBgImageCell = cells[1];
      const mainTextCell = cells[2];
      const iconCell = cells[3];
      const whatsappLinkCell = cells[4];

      const accountMainBgBox = document.createElement('div');
      accountMainBgBox.classList.add('w-100', 'account-mainBg-box', 'd-flex');
      milkSectionImage.append(accountMainBgBox);

      // Desktop Background
      const desktopBgOverlay = document.createElement('div');
      desktopBgOverlay.classList.add(
        'annual-background_image--overlay',
        'd-flex',
        'annual-bg-desktop',
      );
      const desktopPicture = desktopBgImageCell.querySelector('picture');
      const desktopImg = desktopPicture ? desktopPicture.querySelector('img') : null;
      if (desktopImg) {
        const optimizedPic = createOptimizedPicture(
          desktopImg.src,
          desktopImg.alt,
          false,
          [{ width: '750' }],
        );
        const optimizedImg = optimizedPic.querySelector('img');
        optimizedImg.classList.add('account-bgImg', 'with-overlay');
        optimizedImg.setAttribute('height', '392px');
        moveInstrumentation(desktopImg, optimizedImg);
        desktopBgOverlay.append(optimizedPic);
      }
      const desktopOverlayDiv = document.createElement('div');
      desktopOverlayDiv.classList.add('overlay');
      desktopBgOverlay.append(desktopOverlayDiv);
      accountMainBgBox.append(desktopBgOverlay);

      // Mobile Background
      const mobileBgOverlay = document.createElement('div');
      mobileBgOverlay.classList.add(
        'annual-background_image--overlay',
        'd-flex',
        'annual-bg-mobile',
      );
      const mobilePicture = mobileBgImageCell.querySelector('picture');
      const mobileImg = mobilePicture ? mobilePicture.querySelector('img') : null;
      if (mobileImg) {
        const optimizedPic = createOptimizedPicture(
          mobileImg.src,
          mobileImg.alt,
          false,
          [{ width: '750' }],
        );
        const optimizedImg = optimizedPic.querySelector('img');
        optimizedImg.classList.add('account-bgImg', 'with-overlay');
        optimizedImg.setAttribute('height', '447px');
        moveInstrumentation(mobileImg, optimizedImg);
        mobileBgOverlay.append(optimizedPic);
      }
      const mobileOverlayDiv = document.createElement('div');
      mobileOverlayDiv.classList.add('overlay');
      mobileBgOverlay.append(mobileOverlayDiv);
      accountMainBgBox.append(mobileBgOverlay);

      const rightSubtextMilk = document.createElement('div');
      rightSubtextMilk.classList.add(
        'right-subtext',
        'position-absolute',
        'start-0',
        'end-0',
        'bottom-0',
        'right-subtext-milk',
      );
      const milkContentWrapper = document.createElement('div');
      milkContentWrapper.classList.add(
        'd-flex',
        'flex-column',
        'align-items-center',
      );
      rightSubtextMilk.append(milkContentWrapper);

      const gheeMobileHeadingMilk = document.createElement('div');
      gheeMobileHeadingMilk.classList.add(
        'ghee-mobile-heading',
        'text-center',
        'font-md-18',
        'font-baskerville',
        'leading-32',
      );
      // Use innerHTML for richtext field
      gheeMobileHeadingMilk.innerHTML = mainTextCell.innerHTML;
      moveInstrumentation(mainTextCell, gheeMobileHeadingMilk);
      milkContentWrapper.append(gheeMobileHeadingMilk);

      const fontMd18Div = document.createElement('div');
      fontMd18Div.classList.add('font-md-18', 'mt-6', 'text-center');
      milkContentWrapper.append(fontMd18Div);

      const iconDiv = document.createElement('div');
      iconDiv.classList.add('my-9');
      const iconPicture = iconCell.querySelector('picture');
      const iconImg = iconPicture ? iconPicture.querySelector('img') : null;
      if (iconImg) {
        const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
        moveInstrumentation(iconImg, optimizedPic.querySelector('img'));
        iconDiv.append(optimizedPic);
      }
      moveInstrumentation(iconCell, iconDiv);
      milkContentWrapper.append(iconDiv);

      const whatsappLinkDiv = document.createElement('div');
      whatsappLinkDiv.classList.add('Whatsapp-link', 'mb-8', 'text-center');
      const whatsappAnchor = document.createElement('a');
      const foundWhatsappLink = whatsappLinkCell.querySelector('a');
      if (foundWhatsappLink) {
        whatsappAnchor.href = foundWhatsappLink.href;
        whatsappAnchor.textContent = 'Whatsapp'; // Hardcoded label from original HTML
        whatsappAnchor.setAttribute('target', '_blank');
        whatsappAnchor.setAttribute('rel', 'noopener noreferrer');
        const screenReaderSpan = document.createElement('span');
        screenReaderSpan.classList.add('cmp-link__screen-reader-only');
        screenReaderSpan.textContent = 'opens in a new tab';
        whatsappAnchor.append(screenReaderSpan);
        whatsappLinkDiv.append(document.createTextNode('Check Your Milk Report Card on '));
        whatsappLinkDiv.append(whatsappAnchor);
        moveInstrumentation(foundWhatsappLink, whatsappLinkDiv);
      }
      milkContentWrapper.append(whatsappLinkDiv);

      accountMainBgBox.append(rightSubtextMilk);
      moveInstrumentation(milkRow, milkSectionImage);
    });
  }
}
