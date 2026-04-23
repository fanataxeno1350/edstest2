import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...productRows] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('container-xl', 'annualReport_mainBox', 'product-selection-component');
  moveInstrumentation(block, container);

  const accountMainBox = document.createElement('div');
  accountMainBox.classList.add('account-mainBox', 'mx-md-16');
  container.append(accountMainBox);

  const row = document.createElement('div');
  row.classList.add('row', 'gx-5');
  accountMainBox.append(row);

  const leftSection = document.createElement('div');
  leftSection.classList.add('mt-8', 'mt-md-10', 'col-lg-4');
  row.append(leftSection);

  // Heading
  // Check 0 & 1: Replaced direct index access with content detection for heading
  const headingCell = [...headingRow.children].find(cell => cell.textContent.trim());
  const headingP = document.createElement('p');
  headingP.classList.add('font-24', 'font-md-40', 'fw-bold', 'product-container_heading', 'font-baskerville');
  if (headingCell) {
    headingP.textContent = headingCell.textContent.trim();
    moveInstrumentation(headingCell, headingP);
  }
  leftSection.append(headingP);

  const productMainBox = document.createElement('div');
  productMainBox.classList.add('product-mainbox', 'mt-10', 'mt-md-12');
  leftSection.append(productMainBox);

  const rightSection = document.createElement('div');
  rightSection.classList.add('right-section', 'mt-10', 'py-0', 'position-relative', 'col-lg-8');
  row.append(rightSection);

  const gheeBox = document.createElement('div');
  gheeBox.classList.add('ghee_box');
  rightSection.append(gheeBox);

  const milkSectionImage = document.createElement('div');
  milkSectionImage.classList.add('position-relative', 'milk-section_image');
  rightSection.append(milkSectionImage);

  let activeProductSection = gheeBox; // Default to ghee section

  productRows.forEach((productRow, index) => {
    // Check 1: Destructuring for item rows is correct as per BlockJson
    const [imageCell, altTextCell, labelCell] = [...productRow.children];

    const productDiv = document.createElement('div');
    moveInstrumentation(productRow, productDiv);

    const productItemDiv = document.createElement('div');
    productItemDiv.classList.add('milk_ghee_smallImag', 'product-hover');
    let productType = '';
    if (index === 0) {
      productItemDiv.classList.add('ghee-packet');
      productType = 'ghee';
    } else if (index === 1) {
      productItemDiv.classList.add('milk-packet');
      productType = 'milk';
    }
    productDiv.append(productItemDiv);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      // Check 1: altTextCell is type=text, so .textContent.trim() is correct
      const optimizedPic = createOptimizedPicture(img.src, altTextCell.textContent.trim(), false, [{ width: '750' }]);
      optimizedPic.querySelector('img').classList.add('left-section-gheeBox', 'object-fit-contain');
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      productItemDiv.append(optimizedPic);
    }

    const labelP = document.createElement('p');
    labelP.classList.add('product-subnames');
    // Check 1: labelCell is type=text, so .textContent.trim() is correct
    labelP.textContent = labelCell.textContent.trim();
    productItemDiv.append(labelP);

    productMainBox.append(productDiv);

    // Check 2: Add event listener for product selection
    productItemDiv.addEventListener('click', () => {
      // Remove active class from all product items
      [...productMainBox.children].forEach(item => {
        item.querySelector('.milk_ghee_smallImag').classList.remove('product-hover');
      });
      // Add active class to the clicked product item
      productItemDiv.classList.add('product-hover');

      // Toggle visibility of right sections
      if (productType === 'ghee') {
        gheeBox.style.display = 'block';
        milkSectionImage.style.display = 'none';
        activeProductSection = gheeBox;
      } else if (productType === 'milk') {
        gheeBox.style.display = 'none';
        milkSectionImage.style.display = 'block';
        activeProductSection = milkSectionImage;
      }
    });
  });

  // Right section content (copied from original HTML, ensuring class names are from allowlist)
  // Ghee section structure
  const accountMainBgBoxGhee = document.createElement('div');
  accountMainBgBoxGhee.classList.add('account-mainBg-box', 'w-100');
  gheeBox.append(accountMainBgBoxGhee);

  const annualBgDesktopGhee = document.createElement('div');
  annualBgDesktopGhee.classList.add('annual-background_image--overlay', 'd-flex', 'annual-bg-desktop');
  accountMainBgBoxGhee.append(annualBgDesktopGhee);

  const desktopImgGhee = document.createElement('img');
  desktopImgGhee.src = 'https://s7ap1.scene7.com/is/image/itcportalprod/Mask_Group_20176_2x?fmt=webp-alpha';
  desktopImgGhee.classList.add('account-bgImg', 'with-overlay');
  desktopImgGhee.setAttribute('height', '392px');
  desktopImgGhee.setAttribute('loading', 'lazy');
  annualBgDesktopGhee.append(desktopImgGhee);

  const overlayDivGhee = document.createElement('div');
  overlayDivGhee.classList.add('overlay');
  annualBgDesktopGhee.append(overlayDivGhee);

  const annualBgMobileGhee = document.createElement('div');
  annualBgMobileGhee.classList.add('annual-background_image--overlay', 'd-flex', 'annual-bg-mobile');
  accountMainBgBoxGhee.append(annualBgMobileGhee);

  const mobileImgGhee = document.createElement('img');
  mobileImgGhee.src = 'https://s7ap1.scene7.com/is/image/itcportalprod/annual-bg-mobile?fmt=webp-alpha';
  mobileImgGhee.classList.add('account-bgImg', 'with-overlay');
  mobileImgGhee.setAttribute('height', '447px');
  mobileImgGhee.setAttribute('loading', 'lazy');
  annualBgMobileGhee.append(mobileImgGhee);

  const overlayDivMobileGhee = document.createElement('div');
  overlayDivMobileGhee.classList.add('overlay');
  annualBgMobileGhee.append(overlayDivMobileGhee);

  const rightSubtextBeforeDownloadGhee = document.createElement('div');
  rightSubtextBeforeDownloadGhee.classList.add('right-subtext', 'position-absolute', 'start-0', 'end-0', 'bottom-0', 'right-subtext__BeforeDownload');
  gheeBox.append(rightSubtextBeforeDownloadGhee);

  const flexColAlignItemsCenterGhee = document.createElement('div');
  flexColAlignItemsCenterGhee.classList.add('d-flex', 'flex-column', 'align-items-center');
  rightSubtextBeforeDownloadGhee.append(flexColAlignItemsCenterGhee);

  const gheeMobileHeadingGhee = document.createElement('div');
  gheeMobileHeadingGhee.classList.add('ghee-mobile-heading', 'text-center', 'font-md-18', 'font-baskerville', 'leading-32');
  gheeMobileHeadingGhee.innerHTML = '<p class="download_your_monthly_ghee"></p><p></p><h3>Pure and tested—Aashirvaad Svasti Organic Ghee!</h3><p></p>'; // Check 1.5: Richtext handling
  flexColAlignItemsCenterGhee.append(gheeMobileHeadingGhee);

  const downloadBtnGhee = document.createElement('button');
  downloadBtnGhee.classList.add('annual-report_DownloadBtn', 'my-9');
  const downloadIconDivGhee = document.createElement('div');
  downloadIconDivGhee.classList.add('download_icon');
  downloadBtnGhee.append(downloadIconDivGhee);
  const downloadSvgGhee = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  downloadSvgGhee.classList.add('icon-downloaded');
  const downloadUseGhee = document.createElementNS('http://www.w3.org/1999/xlink', 'xlink:href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#download_btn');
  downloadSvgGhee.append(downloadUseGhee);
  downloadIconDivGhee.append(downloadSvgGhee);
  flexColAlignItemsCenterGhee.append(downloadBtnGhee);

  const downloadLinkDivGhee = document.createElement('div');
  downloadLinkDivGhee.classList.add('d-flex', 'mb-6');
  const downloadLinkGhee = document.createElement('a');
  downloadLinkGhee.href = '/content/dam/svasti/annual-reports/ghee/monthly-quality-report-card-organic-ghee-oct.pdf';
  downloadLinkGhee.download = 'report.pdf';
  downloadLinkGhee.classList.add('text-decoration-none', 'download-report_btn', 'cta-analytics', 'download_report_btnBefore', 'text-cream-100', 'border', 'border-2', 'border-red-100', 'border-maroon-100-hover', 'border-red-300-active', 'bg-red-100', 'bg-maroon-100-hover', 'bg-red-300-active');
  downloadLinkGhee.textContent = 'Download report';
  downloadLinkDivGhee.append(downloadLinkGhee);
  flexColAlignItemsCenterGhee.append(downloadLinkDivGhee);

  const whatsappLinkDivGhee = document.createElement('div');
  whatsappLinkDivGhee.classList.add('Whatsapp-link', 'mb-8', 'text-center');
  flexColAlignItemsCenterGhee.append(whatsappLinkDivGhee);

  const rightSubtextAfterDownloadGhee = document.createElement('div');
  rightSubtextAfterDownloadGhee.classList.add('right-subtext', 'position-absolute', 'start-0', 'end-0', 'bottom-0', 'right-section_subtextafter', 'right-subtext__AfterDownload');
  rightSubtextAfterDownloadGhee.style.display = 'none'; // Initially hidden
  gheeBox.append(rightSubtextAfterDownloadGhee);

  const flexColAlignItemsCenterAfterGhee = document.createElement('div');
  flexColAlignItemsCenterAfterGhee.classList.add('d-flex', 'flex-column', 'align-items-center', 'justify-content-around');
  rightSubtextAfterDownloadGhee.append(flexColAlignItemsCenterAfterGhee);

  const gheeMobileHeadingAfterGhee = document.createElement('div');
  gheeMobileHeadingAfterGhee.classList.add('ghee-mobile-heading', 'text-center', 'font-md-18', 'font-baskerville', 'leading-32');
  gheeMobileHeadingAfterGhee.innerHTML = '<p>Your monthly report of svasti ghee has<br>been downloaded!</p>'; // Check 1.5: Richtext handling
  flexColAlignItemsCenterAfterGhee.append(gheeMobileHeadingAfterGhee);

  const downloadBtnAfterGhee = document.createElement('button');
  downloadBtnAfterGhee.classList.add('annual-report_DownloadBtn', 'my-9');
  const tickDownloadDivGhee = document.createElement('div');
  tickDownloadDivGhee.classList.add('tick_download');
  downloadBtnAfterGhee.append(tickDownloadDivGhee);
  const downloadSvgAfterGhee = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  downloadSvgAfterGhee.classList.add('icon-downloaded');
  const downloadUseAfterGhee = document.createElementNS('http://www.w3.org/1999/xlink', 'xlink:href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#Downloaded-btn');
  downloadSvgAfterGhee.append(downloadUseAfterGhee);
  tickDownloadDivGhee.append(downloadSvgAfterGhee);
  flexColAlignItemsCenterAfterGhee.append(downloadBtnAfterGhee);

  const downloadBtnDisabledDivGhee = document.createElement('div');
  downloadBtnDisabledDivGhee.classList.add('d-flex', 'mb-6');
  const downloadBtnDisabledGhee = document.createElement('button');
  downloadBtnDisabledGhee.classList.add('download-report_btn', 'download_report_btnAfter', 'disabled', 'bg-light-pink', 'border-light-pink', 'text-cream-100');
  downloadBtnDisabledGhee.textContent = 'Download report';
  downloadBtnDisabledDivGhee.append(downloadBtnDisabledGhee);
  flexColAlignItemsCenterAfterGhee.append(downloadBtnDisabledDivGhee);

  const whatsappLinkDivAfterGhee = document.createElement('div');
  whatsappLinkDivAfterGhee.classList.add('Whatsapp-link', 'mb-8', 'text-center');
  flexColAlignItemsCenterAfterGhee.append(whatsappLinkDivAfterGhee);

  // Check 2: Add event listener for the download button in ghee section
  downloadLinkGhee.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    // Simulate download (in a real scenario, this would trigger a file download)
    const link = document.createElement('a');
    link.href = downloadLinkGhee.href;
    link.download = downloadLinkGhee.download;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    rightSubtextBeforeDownloadGhee.style.display = 'none';
    rightSubtextAfterDownloadGhee.style.display = 'flex'; // Use flex to match original HTML structure
  });

  // Milk section structure
  const accountMainBgBoxMilk = document.createElement('div');
  accountMainBgBoxMilk.classList.add('w-100', 'account-mainBg-box', 'd-flex');
  milkSectionImage.append(accountMainBgBoxMilk);

  const annualBgDesktopMilk = document.createElement('div');
  annualBgDesktopMilk.classList.add('annual-background_image--overlay', 'd-flex', 'annual-bg-desktop');
  accountMainBgBoxMilk.append(annualBgDesktopMilk);

  const desktopImgMilk = document.createElement('img');
  desktopImgMilk.src = 'https://s7ap1.scene7.com/is/image/itcportalprod/Mask_Group_20176_2x?fmt=webp-alpha';
  desktopImgMilk.classList.add('account-bgImg', 'with-overlay');
  desktopImgMilk.setAttribute('height', '392px');
  desktopImgMilk.setAttribute('loading', 'lazy');
  annualBgDesktopMilk.append(desktopImgMilk);

  const overlayDivMilk = document.createElement('div');
  overlayDivMilk.classList.add('overlay');
  annualBgDesktopMilk.append(overlayDivMilk);

  const annualBgMobileMilk = document.createElement('div');
  annualBgMobileMilk.classList.add('annual-background_image--overlay', 'd-flex', 'annual-bg-mobile');
  accountMainBgBoxMilk.append(annualBgMobileMilk);

  const mobileImgMilk = document.createElement('img');
  mobileImgMilk.src = 'https://s7ap1.scene7.com/is/image/itcportalprod/annual-bg-mobile?fmt=webp-alpha';
  mobileImgMilk.classList.add('account-bgImg', 'with-overlay');
  mobileImgMilk.setAttribute('height', '447px');
  mobileImgMilk.setAttribute('loading', 'lazy');
  annualBgMobileMilk.append(mobileImgMilk);

  const overlayDivMobileMilk = document.createElement('div');
  overlayDivMobileMilk.classList.add('overlay');
  annualBgMobileMilk.append(overlayDivMobileMilk);

  const rightSubtextMilk = document.createElement('div');
  rightSubtextMilk.classList.add('right-subtext', 'position-absolute', 'start-0', 'end-0', 'bottom-0', 'right-subtext-milk');
  milkSectionImage.append(rightSubtextMilk);

  const flexColAlignItemsCenterMilk = document.createElement('div');
  flexColAlignItemsCenterMilk.classList.add('d-flex', 'flex-column', 'align-items-center');
  rightSubtextMilk.append(flexColAlignItemsCenterMilk);

  const gheeMobileHeadingMilk = document.createElement('div');
  gheeMobileHeadingMilk.classList.add('ghee-mobile-heading', 'text-center', 'font-md-18', 'font-baskerville', 'leading-32');
  gheeMobileHeadingMilk.innerHTML = '<p> </p><p><b>Thick, Tasty Milk</b></p><p><b>Selected with care, for you!</b></p><p></p>'; // Check 1.5: Richtext handling
  flexColAlignItemsCenterMilk.append(gheeMobileHeadingMilk);

  const fontMd18Milk = document.createElement('div');
  fontMd18Milk.classList.add('font-md-18', 'mt-6', 'text-center');
  flexColAlignItemsCenterMilk.append(fontMd18Milk);

  const whatsappIconDivMilk = document.createElement('div');
  whatsappIconDivMilk.classList.add('my-9');
  const whatsappSvgMilk = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  whatsappSvgMilk.classList.add('icon-downloaded');
  const whatsappUseMilk = document.createElementNS('http://www.w3.org/1999/xlink', 'xlink:href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#whatsapp_icon');
  whatsappSvgMilk.append(whatsappUseMilk);
  whatsappIconDivMilk.append(whatsappSvgMilk);
  flexColAlignItemsCenterMilk.append(whatsappIconDivMilk);

  const whatsappLinkMilk = document.createElement('div');
  whatsappLinkMilk.classList.add('Whatsapp-link', 'mb-8', 'text-center');
  whatsappLinkMilk.innerHTML = '<p>Check Your Milk Report Card on <a href="https://wa.me/message/GW56YICBZLQGI1" target="_blank" rel="noopener noreferrer">Whatsapp​<span class="cmp-link__screen-reader-only">opens in a new tab</span></a></p>'; // Check 1.5: Richtext handling
  flexColAlignItemsCenterMilk.append(whatsappLinkMilk);

  // Initial state: show ghee section, hide milk section
  milkSectionImage.style.display = 'none';

  // Append the new container to the block
  block.innerHTML = '';
  block.append(container);
}
