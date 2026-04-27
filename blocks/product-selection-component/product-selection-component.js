import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure root fields based on BlockJson model
  const [
    headingCell,
    gheeBgDesktopCell,
    gheeBgMobileCell,
    gheeDescriptionCell,
    gheeDownloadLinkCell,
    gheeDownloadedMessageCell,
    milkBgDesktopCell,
    milkBgMobileCell,
    milkDescriptionCell,
    milkWhatsappLinkCell,
    ...productItemRows
  ] = [...block.children];

  block.innerHTML = '';
  block.classList.add('container-xl', 'annualReport_mainBox');

  const accountMainBox = document.createElement('div');
  accountMainBox.classList.add('account-mainBox', 'mx-md-16');
  block.append(accountMainBox);

  const row = document.createElement('div');
  row.classList.add('row', 'gx-5');
  accountMainBox.append(row);

  // Left Section
  const leftSection = document.createElement('div');
  leftSection.classList.add('mt-8', 'mt-md-10', 'col-lg-4');
  row.append(leftSection);

  const heading = document.createElement('p');
  heading.classList.add('font-24', 'font-md-40', 'fw-bold', 'product-container_heading', 'font-baskerville');
  heading.textContent = headingCell.textContent.trim();
  moveInstrumentation(headingCell, heading);
  leftSection.append(heading);

  const productMainBox = document.createElement('div');
  productMainBox.classList.add('product-mainbox', 'mt-10', 'mt-md-12');
  leftSection.append(productMainBox);

  const productItems = [];
  productItemRows.forEach((itemRow) => {
    // Use content detection for item cells, as per CHECK 0
    const cells = [...itemRow.children];
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const nameCell = cells.find(cell => !cell.querySelector('picture')); // Assuming name cell is plain text without picture

    const productDiv = document.createElement('div');
    moveInstrumentation(itemRow, productDiv);

    const productInnerDiv = document.createElement('div');
    productInnerDiv.classList.add('milk_ghee_smallImag', 'product-hover');
    productDiv.append(productInnerDiv);

    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
        optimizedPic.classList.add('left-section-gheeBox', 'object-fit-contain');
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        productInnerDiv.append(optimizedPic);
      }
    }

    if (nameCell) {
      const productName = document.createElement('p');
      productName.classList.add('product-subnames');
      productName.textContent = nameCell.textContent.trim();
      moveInstrumentation(nameCell, productName);
      productInnerDiv.append(productName);
      productItems.push({ element: productDiv, name: nameCell.textContent.trim().toLowerCase() });
    }
    productMainBox.append(productDiv);
  });

  // Right Section
  const rightSection = document.createElement('div');
  rightSection.classList.add('right-section', 'mt-10', 'py-0', 'position-relative', 'col-lg-8');
  row.append(rightSection);

  // Ghee Box
  const gheeBox = document.createElement('div');
  gheeBox.classList.add('ghee_box');
  rightSection.append(gheeBox);

  const gheeAccountMainBgBox = document.createElement('div');
  gheeAccountMainBgBox.classList.add('account-mainBg-box', 'w-100');
  gheeBox.append(gheeAccountMainBgBox);

  // Ghee Desktop Background Image
  const gheeDesktopBgDiv = document.createElement('div');
  gheeDesktopBgDiv.classList.add('annual-background_image--overlay', 'd-flex', 'annual-bg-desktop');
  gheeAccountMainBgBox.append(gheeDesktopBgDiv);
  const gheeDesktopPicture = gheeBgDesktopCell.querySelector('picture');
  if (gheeDesktopPicture) {
    const img = gheeDesktopPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1200' }]);
    optimizedPic.classList.add('account-bgImg', 'with-overlay');
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    gheeDesktopBgDiv.append(optimizedPic);
  }
  const gheeDesktopOverlay = document.createElement('div');
  gheeDesktopOverlay.classList.add('overlay');
  gheeDesktopBgDiv.append(gheeDesktopOverlay);

  // Ghee Mobile Background Image
  const gheeMobileBgDiv = document.createElement('div');
  gheeMobileBgDiv.classList.add('annual-background_image--overlay', 'd-flex', 'annual-bg-mobile');
  gheeAccountMainBgBox.append(gheeMobileBgDiv);
  const gheeMobilePicture = gheeBgMobileCell.querySelector('picture');
  if (gheeMobilePicture) {
    const img = gheeMobilePicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    optimizedPic.classList.add('account-bgImg', 'with-overlay');
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    gheeMobileBgDiv.append(optimizedPic);
  }
  const gheeMobileOverlay = document.createElement('div');
  gheeMobileOverlay.classList.add('overlay');
  gheeMobileBgDiv.append(gheeMobileOverlay);

  // Ghee Before Download section
  const gheeRightSubtextBefore = document.createElement('div');
  gheeRightSubtextBefore.classList.add('right-subtext', 'position-absolute', 'start-0', 'end-0', 'bottom-0', 'right-subtext__BeforeDownload');
  gheeBox.append(gheeRightSubtextBefore);

  const gheeBeforeContent = document.createElement('div');
  gheeBeforeContent.classList.add('d-flex', 'flex-column', 'align-items-center');
  gheeRightSubtextBefore.append(gheeBeforeContent);

  const gheeMobileHeading = document.createElement('div');
  gheeMobileHeading.classList.add('ghee-mobile-heading', 'text-center', 'font-md-18', 'font-baskerville', 'leading-32');
  gheeMobileHeading.innerHTML = gheeDescriptionCell.innerHTML; // Correctly using innerHTML for richtext
  moveInstrumentation(gheeDescriptionCell, gheeMobileHeading);
  gheeBeforeContent.append(gheeMobileHeading);

  const downloadButton = document.createElement('button');
  downloadButton.classList.add('annual-report_DownloadBtn', 'my-9');
  gheeBeforeContent.append(downloadButton);

  const downloadIconDiv = document.createElement('div');
  downloadIconDiv.classList.add('download_icon');
  downloadButton.append(downloadIconDiv);

  const downloadSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  downloadSvg.classList.add('icon-downloaded');
  const downloadUse = document.createElementNS('http://www.w3.org/1999/xlink', 'xlink:href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#download_btn');
  downloadSvg.append(downloadUse);
  downloadIconDiv.append(downloadSvg);

  const downloadLinkDiv = document.createElement('div');
  downloadLinkDiv.classList.add('d-flex', 'mb-6');
  gheeBeforeContent.append(downloadLinkDiv);

  const downloadLinkInnerDiv = document.createElement('div');
  downloadLinkDiv.append(downloadLinkInnerDiv);

  const downloadLink = document.createElement('a');
  downloadLink.classList.add('text-decoration-none', 'download-report_btn', 'cta-analytics', 'download_report_btnBefore', 'text-cream-100', 'border', 'border-2', 'border-red-100', 'border-maroon-100-hover', 'border-red-300-active', 'bg-red-100', 'bg-maroon-100-hover', 'bg-red-300-active');
  downloadLink.textContent = 'Download report';
  const authoredLink = gheeDownloadLinkCell.querySelector('a');
  if (authoredLink) {
    downloadLink.href = authoredLink.href;
    downloadLink.setAttribute('download', 'report.pdf'); // Assuming a PDF download
  }
  moveInstrumentation(gheeDownloadLinkCell, downloadLink);
  downloadLinkInnerDiv.append(downloadLink);

  // Ghee After Download section
  const gheeRightSubtextAfter = document.createElement('div');
  gheeRightSubtextAfter.classList.add('right-subtext', 'position-absolute', 'start-0', 'end-0', 'bottom-0', 'right-section_subtextafter', 'right-subtext__AfterDownload');
  gheeBox.append(gheeRightSubtextAfter);
  gheeRightSubtextAfter.style.display = 'none'; // Initially hidden

  const gheeAfterContent = document.createElement('div');
  gheeAfterContent.classList.add('d-flex', 'flex-column', 'align-items-center', 'justify-content-around');
  gheeRightSubtextAfter.append(gheeAfterContent);

  const gheeAfterHeading = document.createElement('div');
  gheeAfterHeading.classList.add('ghee-mobile-heading', 'text-center', 'font-md-18', 'font-baskerville', 'leading-32');
  gheeAfterHeading.innerHTML = `<p>${gheeDownloadedMessageCell.textContent.trim()}</p>`; // Correctly using textContent for plain text
  moveInstrumentation(gheeDownloadedMessageCell, gheeAfterHeading);
  gheeAfterContent.append(gheeAfterHeading);

  const downloadedButton = document.createElement('button');
  downloadedButton.classList.add('annual-report_DownloadBtn', 'my-9');
  gheeAfterContent.append(downloadedButton);

  const tickDownloadDiv = document.createElement('div');
  tickDownloadDiv.classList.add('tick_download');
  downloadedButton.append(tickDownloadDiv);

  const downloadedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  downloadedSvg.classList.add('icon-downloaded');
  const downloadedUse = document.createElementNS('http://www.w3.org/1999/xlink', 'xlink:href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#Downloaded-btn');
  downloadedSvg.append(downloadedUse);
  tickDownloadDiv.append(downloadedSvg);

  const downloadedLinkDiv = document.createElement('div');
  downloadedLinkDiv.classList.add('d-flex', 'mb-6');
  gheeAfterContent.append(downloadedLinkDiv);

  const downloadedLinkInnerDiv = document.createElement('div');
  downloadedLinkDiv.append(downloadedLinkInnerDiv);

  const downloadedLink = document.createElement('button');
  downloadedLink.classList.add('download-report_btn', 'download_report_btnAfter', 'disabled', 'bg-light-pink', 'border-light-pink', 'text-cream-100');
  downloadedLink.textContent = 'Download report';
  downloadedLinkInnerDiv.append(downloadedLink);

  // Download functionality
  downloadButton.addEventListener('click', () => {
    downloadLink.click();
  });

  downloadLink.addEventListener('click', (e) => {
    e.preventDefault();
    const tempLink = document.createElement('a');
    tempLink.href = downloadLink.href;
    tempLink.download = downloadLink.getAttribute('download');
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);

    gheeRightSubtextBefore.style.display = 'none';
    gheeRightSubtextAfter.style.display = 'flex';
  });

  // Milk Section
  const milkSection = document.createElement('div');
  milkSection.classList.add('position-relative', 'milk-section_image');
  rightSection.append(milkSection);
  milkSection.style.display = 'none'; // Initially hidden

  const milkAccountMainBgBox = document.createElement('div');
  milkAccountMainBgBox.classList.add('w-100', 'account-mainBg-box', 'd-flex');
  milkSection.append(milkAccountMainBgBox);

  // Milk Desktop Background Image
  const milkDesktopBgDiv = document.createElement('div');
  milkDesktopBgDiv.classList.add('annual-background_image--overlay', 'd-flex', 'annual-bg-desktop');
  milkAccountMainBgBox.append(milkDesktopBgDiv);
  const milkDesktopPicture = milkBgDesktopCell.querySelector('picture');
  if (milkDesktopPicture) {
    const img = milkDesktopPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1200' }]);
    optimizedPic.classList.add('account-bgImg', 'with-overlay');
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    milkDesktopBgDiv.append(optimizedPic);
  }
  const milkDesktopOverlay = document.createElement('div');
  milkDesktopOverlay.classList.add('overlay');
  milkDesktopBgDiv.append(milkDesktopOverlay);

  // Milk Mobile Background Image
  const milkMobileBgDiv = document.createElement('div');
  milkMobileBgDiv.classList.add('annual-background_image--overlay', 'd-flex', 'annual-bg-mobile');
  milkAccountMainBgBox.append(milkMobileBgDiv);
  const milkMobilePicture = milkBgMobileCell.querySelector('picture');
  if (milkMobilePicture) {
    const img = milkMobilePicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    optimizedPic.classList.add('account-bgImg', 'with-overlay');
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    milkMobileBgDiv.append(optimizedPic);
  }
  const milkMobileOverlay = document.createElement('div');
  milkMobileOverlay.classList.add('overlay');
  milkMobileBgDiv.append(milkMobileOverlay);

  const milkRightSubtext = document.createElement('div');
  milkRightSubtext.classList.add('right-subtext', 'position-absolute', 'start-0', 'end-0', 'bottom-0', 'right-subtext-milk');
  milkSection.append(milkRightSubtext);

  const milkContent = document.createElement('div');
  milkContent.classList.add('d-flex', 'flex-column', 'align-items-center');
  milkRightSubtext.append(milkContent);

  const milkMobileHeading = document.createElement('div');
  milkMobileHeading.classList.add('ghee-mobile-heading', 'text-center', 'font-md-18', 'font-baskerville', 'leading-32');
  milkMobileHeading.innerHTML = milkDescriptionCell.innerHTML; // Correctly using innerHTML for richtext
  moveInstrumentation(milkDescriptionCell, milkMobileHeading);
  milkContent.append(milkMobileHeading);

  const milkTextDiv = document.createElement('div');
  milkTextDiv.classList.add('font-md-18', 'mt-6', 'text-center');
  milkContent.append(milkTextDiv);

  const whatsappIconDiv = document.createElement('div');
  whatsappIconDiv.classList.add('my-9');
  milkContent.append(whatsappIconDiv);

  const whatsappSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  whatsappSvg.classList.add('icon-downloaded');
  const whatsappUse = document.createElementNS('http://www.w3.org/1999/xlink', 'xlink:href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#whatsapp_icon');
  whatsappSvg.append(whatsappUse);
  whatsappIconDiv.append(whatsappSvg);

  const whatsappLinkDiv = document.createElement('div');
  whatsappLinkDiv.classList.add('Whatsapp-link', 'mb-8', 'text-center');
  const authoredWhatsappLink = milkWhatsappLinkCell.querySelector('a');
  if (authoredWhatsappLink) {
    const whatsappAnchor = document.createElement('a');
    whatsappAnchor.href = authoredWhatsappLink.href;
    whatsappAnchor.target = '_blank';
    whatsappAnchor.rel = 'noopener noreferrer';
    // The original HTML shows the text "Check Your Milk Report Card on Whatsapp" and then the <a> tag.
    // The model says type=aem-content, which means the cell itself contains only the <a> tag.
    // So, we should read the innerHTML of the cell and append it, or reconstruct it as per original HTML.
    // The original HTML has <p>Check Your Milk Report Card on <a ...>Whatsapp​<span ...></a></p>
    // So, we should replicate that structure.
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = milkWhatsappLinkCell.innerHTML;
    // Find the 'a' tag within the tempDiv and add the screen reader span if not present
    const linkInCell = tempDiv.querySelector('a');
    if (linkInCell && !linkInCell.querySelector('.cmp-link__screen-reader-only')) {
      const span = document.createElement('span');
      span.classList.add('cmp-link__screen-reader-only');
      span.textContent = 'opens in a new tab';
      linkInCell.append(span);
    }
    while (tempDiv.firstChild) {
      whatsappLinkDiv.append(tempDiv.firstChild);
    }
  }
  moveInstrumentation(milkWhatsappLinkCell, whatsappLinkDiv);
  milkContent.append(whatsappLinkDiv);

  // Product selection logic
  productItems.forEach((item) => {
    item.element.addEventListener('click', () => {
      productItems.forEach((p) => p.element.querySelector('.milk_ghee_smallImag').classList.remove('ghee-packet', 'milk-packet'));
      if (item.name === 'ghee') {
        item.element.querySelector('.milk_ghee_smallImag').classList.add('ghee-packet');
        gheeBox.style.display = 'block';
        milkSection.style.display = 'none';
      } else if (item.name === 'milk') {
        item.element.querySelector('.milk_ghee_smallImag').classList.add('milk-packet');
        gheeBox.style.display = 'none';
        milkSection.style.display = 'block';
      }
    });
  });

  // Set initial active product
  const initialProduct = productItems.find((item) => item.name === 'ghee');
  if (initialProduct) {
    initialProduct.element.querySelector('.milk_ghee_smallImag').classList.add('ghee-packet');
    gheeBox.style.display = 'block';
    milkSection.style.display = 'none';
  } else if (productItems.length > 0) {
    // Fallback to first product if ghee not found
    productItems[0].element.querySelector('.milk_ghee_smallImag').classList.add('ghee-packet');
    gheeBox.style.display = 'block';
    milkSection.style.display = 'none';
  }

  // Optimize images
  // This block-level optimization is redundant if createOptimizedPicture is used for each image
  // and can cause issues if not handled carefully. Removing for now, assuming individual image handling is sufficient.
  // block.querySelectorAll('picture > img').forEach((img) => {
  //   const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  //   moveInstrumentation(img, optimizedPic.querySelector('img'));
  //   img.closest('picture').replaceWith(optimizedPic);
  // });
}
