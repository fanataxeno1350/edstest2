import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...productRows] = [...block.children];

  block.classList.add('container-xl', 'annualReport_mainBox');

  const accountMainBox = document.createElement('div');
  accountMainBox.classList.add('account-mainBox', 'mx-md-16');
  block.append(accountMainBox);

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row', 'gx-5');
  accountMainBox.append(rowDiv);

  // Left Section
  const leftSection = document.createElement('div');
  leftSection.classList.add('mt-8', 'mt-md-10', 'col-lg-4');
  rowDiv.append(leftSection);

  const headingP = document.createElement('p');
  headingP.classList.add(
    'font-24',
    'font-md-40',
    'fw-bold',
    'product-container_heading',
    'font-baskerville',
  );
  // CRITICAL FIX: Use content detection for heading cell
  const headingCell = [...headingRow.children].find((cell) => cell.textContent.trim());
  if (headingCell) {
    moveInstrumentation(headingCell, headingP);
    headingP.textContent = headingCell.textContent.trim();
  }
  leftSection.append(headingP);

  const productMainBox = document.createElement('div');
  productMainBox.classList.add('product-mainbox', 'mt-10', 'mt-md-12');
  leftSection.append(productMainBox);

  const gheeBox = document.createElement('div');
  gheeBox.classList.add('ghee_box'); // This is the main ghee content box
  const milkSectionImage = document.createElement('div');
  milkSectionImage.classList.add('position-relative', 'milk-section_image'); // This is the main milk content box

  productRows.forEach((row, index) => {
    // CRITICAL FIX: Use content detection for product item cells
    const cells = [...row.children];
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const labelCell = cells.find(cell => !cell.querySelector('picture') && cell.textContent.trim());

    const productItemDiv = document.createElement('div');
    moveInstrumentation(row, productItemDiv);

    const productHoverDiv = document.createElement('div');
    productHoverDiv.classList.add('milk_ghee_smallImag', 'product-hover');
    if (index === 0) {
      productHoverDiv.classList.add('ghee-packet');
      productHoverDiv.dataset.productType = 'ghee'; // Custom attribute for interactivity
    } else {
      productHoverDiv.classList.add('milk-packet');
      productHoverDiv.dataset.productType = 'milk'; // Custom attribute for interactivity
    }
    productItemDiv.append(productHoverDiv);

    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          optimizedPic.classList.add('left-section-gheeBox', 'object-fit-contain');
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          productHoverDiv.append(optimizedPic);
        }
      }
    }

    if (labelCell) {
      const labelP = document.createElement('p');
      labelP.classList.add('product-subnames'); // Ensure this class is from ORIGINAL HTML
      labelP.textContent = labelCell.textContent.trim();
      productHoverDiv.append(labelP);
    }

    productMainBox.append(productItemDiv);
  });

  // Right Section (placeholder structure based on original HTML, without specific content)
  const rightSection = document.createElement('div');
  rightSection.classList.add(
    'right-section',
    'mt-10',
    'py-0',
    'position-relative',
    'col-lg-8',
  );
  rowDiv.append(rightSection);

  // Ghee Box
  // const gheeBox = document.createElement('div'); // Already declared above
  gheeBox.classList.add('ghee_box');
  rightSection.append(gheeBox);

  const accountMainBgBoxGhee = document.createElement('div');
  accountMainBgBoxGhee.classList.add('account-mainBg-box', 'w-100');
  gheeBox.append(accountMainBgBoxGhee);

  const annualBgDesktopGhee = document.createElement('div');
  annualBgDesktopGhee.classList.add(
    'annual-background_image--overlay',
    'd-flex',
    'annual-bg-desktop',
  );
  accountMainBgBoxGhee.append(annualBgDesktopGhee);
  const imgGheeDesktop = document.createElement('img');
  imgGheeDesktop.src = 'https://s7ap1.scene7.com/is/image/itcportalprod/Mask_Group_20176_2x?fmt=webp-alpha';
  imgGheeDesktop.classList.add('account-bgImg', 'with-overlay');
  imgGheeDesktop.setAttribute('height', '392px');
  imgGheeDesktop.setAttribute('loading', 'lazy');
  annualBgDesktopGhee.append(imgGheeDesktop);
  const overlayGheeDesktop = document.createElement('div');
  overlayGheeDesktop.classList.add('overlay');
  annualBgDesktopGhee.append(overlayGheeDesktop);

  const annualBgMobileGhee = document.createElement('div');
  annualBgMobileGhee.classList.add(
    'annual-background_image--overlay',
    'd-flex',
    'annual-bg-mobile',
  );
  accountMainBgBoxGhee.append(annualBgMobileGhee);
  const imgGheeMobile = document.createElement('img');
  imgGheeMobile.src = 'https://s7ap1.scene7.com/is/image/itcportalprod/annual-bg-mobile?fmt=webp-alpha';
  imgGheeMobile.classList.add('account-bgImg', 'with-overlay');
  imgGheeMobile.setAttribute('height', '447px');
  imgGheeMobile.setAttribute('loading', 'lazy');
  annualBgMobileGhee.append(imgGheeMobile);
  const overlayGheeMobile = document.createElement('div');
  overlayGheeMobile.classList.add('overlay');
  annualBgMobileGhee.append(overlayGheeMobile);

  const rightSubtextBeforeDownload = document.createElement('div');
  rightSubtextBeforeDownload.classList.add(
    'right-subtext',
    'position-absolute',
    'start-0',
    'end-0',
    'bottom-0',
    'right-subtext__BeforeDownload',
  );
  accountMainBgBoxGhee.append(rightSubtextBeforeDownload);

  const flexColDivBefore = document.createElement('div');
  flexColDivBefore.classList.add('d-flex', 'flex-column', 'align-items-center');
  rightSubtextBeforeDownload.append(flexColDivBefore);

  const gheeMobileHeadingBefore = document.createElement('div');
  gheeMobileHeadingBefore.classList.add(
    'ghee-mobile-heading',
    'text-center',
    'font-md-18',
    'font-baskerville',
    'leading-32',
  );
  gheeMobileHeadingBefore.innerHTML = `
    <p class="download_your_monthly_ghee"></p>
    <p></p><h3>Pure and tested—Aashirvaad Svasti Organic Ghee!</h3><p></p>
  `;
  flexColDivBefore.append(gheeMobileHeadingBefore);

  const downloadBtnBefore = document.createElement('button');
  downloadBtnBefore.classList.add('annual-report_DownloadBtn', 'my-9');
  downloadBtnBefore.innerHTML = `
    <div class="download_icon">
      <svg class="icon-downloaded">
        <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#download_btn"></use>
      </svg>
    </div>
  `;
  flexColDivBefore.append(downloadBtnBefore);

  const downloadLinkDiv = document.createElement('div');
  downloadLinkDiv.classList.add('d-flex', 'mb-6');
  const downloadAnchorDiv = document.createElement('div');
  downloadLinkDiv.append(downloadAnchorDiv);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.href = '/content/dam/svasti/annual-reports/ghee/monthly-quality-report-card-organic-ghee-oct.pdf';
  downloadAnchor.setAttribute('download', 'report.pdf');
  downloadAnchor.classList.add(
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
  downloadAnchor.textContent = 'Download report';
  downloadAnchorDiv.append(downloadAnchor);
  flexColDivBefore.append(downloadLinkDiv);

  const whatsappLinkBefore = document.createElement('div');
  whatsappLinkBefore.classList.add('Whatsapp-link', 'mb-8', 'text-center');
  flexColDivBefore.append(whatsappLinkBefore);

  const rightSubtextAfterDownload = document.createElement('div');
  rightSubtextAfterDownload.classList.add(
    'right-subtext',
    'position-absolute',
    'start-0',
    'end-0',
    'bottom-0',
    'right-section_subtextafter',
    'right-subtext__AfterDownload',
  );
  accountMainBgBoxGhee.append(rightSubtextAfterDownload);
  rightSubtextAfterDownload.style.display = 'none'; // Initially hidden

  const flexColDivAfter = document.createElement('div');
  flexColDivAfter.classList.add(
    'd-flex',
    'flex-column',
    'align-items-center',
    'justify-content-around',
  );
  rightSubtextAfterDownload.append(flexColDivAfter);

  const gheeMobileHeadingAfter = document.createElement('div');
  gheeMobileHeadingAfter.classList.add(
    'ghee-mobile-heading',
    'text-center',
    'font-md-18',
    'font-baskerville',
    'leading-32',
  );
  gheeMobileHeadingAfter.innerHTML = `
    <p>Your monthly report of svasti ghee has<br>been downloaded!</p>
  `;
  flexColDivAfter.append(gheeMobileHeadingAfter);

  const downloadBtnAfter = document.createElement('button');
  downloadBtnAfter.classList.add('annual-report_DownloadBtn', 'my-9');
  downloadBtnAfter.innerHTML = `
    <div class="tick_download">
      <svg class="icon-downloaded">
        <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#Downloaded-btn"></use>
      </svg>
    </div>
  `;
  flexColDivAfter.append(downloadBtnAfter);

  const downloadBtnAfterDiv = document.createElement('div');
  downloadBtnAfterDiv.classList.add('d-flex', 'mb-6');
  const downloadBtnAfterInnerDiv = document.createElement('div');
  downloadBtnAfterDiv.append(downloadBtnAfterInnerDiv);
  const downloadBtnAfterEl = document.createElement('button');
  downloadBtnAfterEl.classList.add(
    'download-report_btn',
    'download_report_btnAfter',
    'disabled',
    'bg-light-pink',
    'border-light-pink',
    'text-cream-100',
  );
  downloadBtnAfterEl.textContent = 'Download report';
  downloadBtnAfterInnerDiv.append(downloadBtnAfterEl);
  flexColDivAfter.append(downloadBtnAfterDiv);

  const whatsappLinkAfter = document.createElement('div');
  whatsappLinkAfter.classList.add('Whatsapp-link', 'mb-8', 'text-center');
  flexColDivAfter.append(whatsappLinkAfter);

  // Milk Section
  // const milkSectionImage = document.createElement('div'); // Already declared above
  milkSectionImage.classList.add('position-relative', 'milk-section_image');
  rightSection.append(milkSectionImage);
  milkSectionImage.style.display = 'none'; // Initially hidden

  const accountMainBgBoxMilk = document.createElement('div');
  accountMainBgBoxMilk.classList.add('w-100', 'account-mainBg-box', 'd-flex');
  milkSectionImage.append(accountMainBgBoxMilk);

  const annualBgDesktopMilk = document.createElement('div');
  annualBgDesktopMilk.classList.add(
    'annual-background_image--overlay',
    'd-flex',
    'annual-bg-desktop',
  );
  accountMainBgBoxMilk.append(annualBgDesktopMilk);
  const imgMilkDesktop = document.createElement('img');
  imgMilkDesktop.src = 'https://s7ap1.scene7.com/is/image/itcportalprod/Mask_Group_20176_2x?fmt=webp-alpha';
  imgMilkDesktop.classList.add('account-bgImg', 'with-overlay');
  imgMilkDesktop.setAttribute('height', '392px');
  imgMilkDesktop.setAttribute('loading', 'lazy');
  annualBgDesktopMilk.append(imgMilkDesktop);
  const overlayMilkDesktop = document.createElement('div');
  overlayMilkDesktop.classList.add('overlay');
  annualBgDesktopMilk.append(overlayMilkDesktop);

  const annualBgMobileMilk = document.createElement('div');
  annualBgMobileMilk.classList.add(
    'annual-background_image--overlay',
    'd-flex',
    'annual-bg-mobile',
  );
  accountMainBgBoxMilk.append(annualBgMobileMilk);
  const imgMilkMobile = document.createElement('img');
  imgMilkMobile.src = 'https://s7ap1.scene7.com/is/image/itcportalprod/annual-bg-mobile?fmt=webp-alpha';
  imgMilkMobile.classList.add('account-bgImg', 'with-overlay');
  imgMilkMobile.setAttribute('height', '447px');
  imgMilkMobile.setAttribute('loading', 'lazy');
  annualBgMobileMilk.append(imgMilkMobile);
  const overlayMilkMobile = document.createElement('div');
  overlayMilkMobile.classList.add('overlay');
  annualBgMobileMilk.append(overlayMilkMobile);

  const rightSubtextMilk = document.createElement('div');
  rightSubtextMilk.classList.add(
    'right-subtext',
    'position-absolute',
    'start-0',
    'end-0',
    'bottom-0',
    'right-subtext-milk',
  );
  milkSectionImage.append(rightSubtextMilk);

  const flexColDivMilk = document.createElement('div');
  flexColDivMilk.classList.add('d-flex', 'flex-column', 'align-items-center');
  rightSubtextMilk.append(flexColDivMilk);

  const gheeMobileHeadingMilk = document.createElement('div');
  gheeMobileHeadingMilk.classList.add(
    'ghee-mobile-heading',
    'text-center',
    'font-md-18',
    'font-baskerville',
    'leading-32',
  );
  gheeMobileHeadingMilk.innerHTML = `
    <p> </p><p><b>Thick, Tasty Milk</b></p>
    <p><b>Selected with care, for you!</b></p>
    <p></p>
  `;
  flexColDivMilk.append(gheeMobileHeadingMilk);

  const fontMd18Div = document.createElement('div');
  fontMd18Div.classList.add('font-md-18', 'mt-6', 'text-center');
  flexColDivMilk.append(fontMd18Div);

  const whatsappIconDiv = document.createElement('div');
  whatsappIconDiv.classList.add('my-9');
  whatsappIconDiv.innerHTML = `
    <svg class="icon-downloaded">
      <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#whatsapp_icon"></use>
    </svg>
  `;
  flexColDivMilk.append(whatsappIconDiv);

  const whatsappLinkMilk = document.createElement('div');
  whatsappLinkMilk.classList.add('Whatsapp-link', 'mb-8', 'text-center');
  whatsappLinkMilk.innerHTML = `
    <p>Check Your Milk Report Card on <a href="https://wa.me/message/GW56YICBZLQGI1" target="_blank" rel="noopener noreferrer">Whatsapp​<span class="cmp-link__screen-reader-only">opens in a new tab</span></a></p>
  `;
  flexColDivMilk.append(whatsappLinkMilk);

  // Interactivity: Toggle right section content based on left product hover/click
  const productHoverItems = productMainBox.querySelectorAll('.product-hover');

  function showGheeContent() {
    gheeBox.style.display = 'block';
    milkSectionImage.style.display = 'none';
  }

  function showMilkContent() {
    gheeBox.style.display = 'none';
    milkSectionImage.style.display = 'block';
  }

  // Initial state: show ghee content
  showGheeContent();

  productHoverItems.forEach((item) => {
    item.addEventListener('click', () => {
      productHoverItems.forEach(p => p.classList.remove('ghee-packet', 'milk-packet')); // Remove active classes
      const productType = item.dataset.productType;
      if (productType === 'ghee') {
        item.classList.add('ghee-packet');
        showGheeContent();
      } else if (productType === 'milk') {
        item.classList.add('milk-packet');
        showMilkContent();
      }
    });
  });

  // Interactivity: Download button for Ghee
  downloadAnchor.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default download behavior for a moment
    // Simulate download (in a real scenario, this would trigger a file download)
    // For now, just toggle the UI
    rightSubtextBeforeDownload.style.display = 'none';
    rightSubtextAfterDownload.style.display = 'flex'; // Use flex to center content
    // Trigger actual download
    const tempLink = document.createElement('a');
    tempLink.href = downloadAnchor.href;
    tempLink.download = downloadAnchor.download;
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
  });
}
