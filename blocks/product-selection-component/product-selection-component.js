import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...productRows] = [...block.children];

  block.innerHTML = '';
  block.classList.add('container-xl', 'annualReport_mainBox');

  const accountMainBox = document.createElement('div');
  accountMainBox.classList.add('account-mainBox', 'mx-md-16');
  block.append(accountMainBox);

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row', 'gx-5');
  accountMainBox.append(rowDiv);

  const leftSection = document.createElement('div');
  leftSection.classList.add('mt-8', 'mt-md-10', 'col-lg-4');
  rowDiv.append(leftSection);

  // Heading
  const headingP = document.createElement('p');
  headingP.classList.add(
    'font-24',
    'font-md-40',
    'fw-bold',
    'product-container_heading',
    'font-baskerville'
  );
  moveInstrumentation(headingRow.firstElementChild, headingP);
  headingP.textContent = headingRow.firstElementChild.textContent.trim();
  leftSection.append(headingP);

  const productMainbox = document.createElement('div');
  productMainbox.classList.add('product-mainbox', 'mt-10', 'mt-md-12');
  leftSection.append(productMainbox);

  const productSections = []; // To store references for interactivity

  productRows.forEach((row) => {
    const cells = [...row.children];
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const labelCell = cells.find(cell => !cell.querySelector('picture')); // Assuming label cell doesn't contain a picture

    const productDiv = document.createElement('div');
    moveInstrumentation(row, productDiv);

    const productItemDiv = document.createElement('div');
    productItemDiv.classList.add(
      'milk_ghee_smallImag',
      'product-hover'
    );

    // Determine product type based on image alt or content
    const imgAlt = imageCell?.querySelector('img')?.alt?.toLowerCase();
    if (imgAlt && imgAlt.includes('ghee')) {
      productItemDiv.classList.add('ghee-packet');
    } else if (imgAlt && imgAlt.includes('milk')) {
      productItemDiv.classList.add('milk-packet');
    } else {
      // Fallback or default if neither is detected
      productItemDiv.classList.add('ghee-packet'); // Default to ghee if not explicitly milk
    }

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('left-section-gheeBox', 'object-fit-contain');
        productItemDiv.append(optimizedPic);
      }
    }

    const labelP = document.createElement('p');
    labelP.classList.add('product-subnames');
    labelP.textContent = labelCell.textContent.trim();
    productItemDiv.append(labelP);

    productDiv.append(productItemDiv);
    productMainbox.append(productDiv);
    productSections.push({ element: productItemDiv, type: productItemDiv.classList.contains('ghee-packet') ? 'ghee' : 'milk' });
  });

  // Right Section (placeholder for now, as it's not part of the EDS block model)
  const rightSection = document.createElement('div');
  rightSection.classList.add('right-section', 'mt-10', 'py-0', 'position-relative', 'col-lg-8');
  rowDiv.append(rightSection);

  // --- Start of Right Section Content (from Original HTML) ---
  const gheeBox = document.createElement('div');
  gheeBox.classList.add('ghee_box');
  rightSection.append(gheeBox);

  const accountMainBgBoxGhee = document.createElement('div');
  accountMainBgBoxGhee.classList.add('account-mainBg-box', 'w-100');
  gheeBox.append(accountMainBgBoxGhee);

  // Desktop BG Image Ghee
  const annualBgDesktopGhee = document.createElement('div');
  annualBgDesktopGhee.classList.add('annual-background_image--overlay', 'd-flex', 'annual-bg-desktop');
  accountMainBgBoxGhee.append(annualBgDesktopGhee);
  const imgDesktopGhee = document.createElement('img');
  imgDesktopGhee.src = '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/mask-group-20176-2x-fmt-webp-alpha-ca5647.webp';
  imgDesktopGhee.classList.add('account-bgImg', 'with-overlay');
  imgDesktopGhee.height = 392;
  imgDesktopGhee.loading = 'lazy';
  annualBgDesktopGhee.append(imgDesktopGhee);
  const overlayDesktopGhee = document.createElement('div');
  overlayDesktopGhee.classList.add('overlay');
  annualBgDesktopGhee.append(overlayDesktopGhee);

  // Mobile BG Image Ghee
  const annualBgMobileGhee = document.createElement('div');
  annualBgMobileGhee.classList.add('annual-background_image--overlay', 'd-flex', 'annual-bg-mobile');
  accountMainBgBoxGhee.append(annualBgMobileGhee);
  const imgMobileGhee = document.createElement('img');
  imgMobileGhee.src = '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/annual-bg-mobile-fmt-webp-alpha-636496.webp';
  imgMobileGhee.classList.add('account-bgImg', 'with-overlay');
  imgMobileGhee.height = 447;
  imgMobileGhee.loading = 'lazy';
  annualBgMobileGhee.append(imgMobileGhee);
  const overlayMobileGhee = document.createElement('div');
  overlayMobileGhee.classList.add('overlay');
  annualBgMobileGhee.append(overlayMobileGhee);

  // Right Subtext Before Download Ghee
  const rightSubtextBeforeDownloadGhee = document.createElement('div');
  rightSubtextBeforeDownloadGhee.classList.add('right-subtext', 'position-absolute', 'start-0', 'end-0', 'bottom-0', 'right-subtext__BeforeDownload');
  gheeBox.append(rightSubtextBeforeDownloadGhee);

  const dFlexColumnGheeBefore = document.createElement('div');
  dFlexColumnGheeBefore.classList.add('d-flex', 'flex-column', 'align-items-center');
  rightSubtextBeforeDownloadGhee.append(dFlexColumnGheeBefore);

  const gheeMobileHeadingBefore = document.createElement('div');
  gheeMobileHeadingBefore.classList.add('ghee-mobile-heading', 'text-center', 'font-md-18', 'font-baskerville', 'leading-32');
  gheeMobileHeadingBefore.innerHTML = `<p class="download_your_monthly_ghee"></p><p></p><h3>Pure and tested—Aashirvaad Svasti Organic Ghee!</h3><p></p>`;
  dFlexColumnGheeBefore.append(gheeMobileHeadingBefore);

  const downloadButtonBefore = document.createElement('button');
  downloadButtonBefore.classList.add('annual-report_DownloadBtn', 'my-9');
  downloadButtonBefore.innerHTML = `
    <div class="download_icon">
      <svg class="icon-downloaded">
        <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#download_btn"></use>
      </svg>
    </div>
  `;
  dFlexColumnGheeBefore.append(downloadButtonBefore);

  const downloadLinkDiv = document.createElement('div');
  downloadLinkDiv.classList.add('d-flex', 'mb-6');
  dFlexColumnGheeBefore.append(downloadLinkDiv);

  const downloadLinkContainer = document.createElement('div');
  downloadLinkDiv.append(downloadLinkContainer);

  const downloadLink = document.createElement('a');
  downloadLink.href = '/content/dam/svasti/annual-reports/ghee/monthly-quality-report-card-organic-ghee-oct.pdf';
  downloadLink.download = 'report.pdf';
  downloadLink.classList.add('text-decoration-none', 'download-report_btn', 'cta-analytics', 'download_report_btnBefore', 'text-cream-100', 'border', 'border-2', 'border-red-100', 'border-maroon-100-hover', 'border-red-300-active', 'bg-red-100', 'bg-maroon-100-hover', 'bg-red-300-active');
  downloadLink.textContent = 'Download report';
  downloadLinkContainer.append(downloadLink);

  const whatsappLinkDivGhee = document.createElement('div');
  whatsappLinkDivGhee.classList.add('Whatsapp-link', 'mb-8', 'text-center');
  dFlexColumnGheeBefore.append(whatsappLinkDivGhee);

  // Right Subtext After Download Ghee
  const rightSubtextAfterDownloadGhee = document.createElement('div');
  rightSubtextAfterDownloadGhee.classList.add('right-subtext', 'position-absolute', 'start-0', 'end-0', 'bottom-0', 'right-section_subtextafter', 'right-subtext__AfterDownload');
  gheeBox.append(rightSubtextAfterDownloadGhee);
  rightSubtextAfterDownloadGhee.style.display = 'none'; // Initially hidden

  const dFlexColumnGheeAfter = document.createElement('div');
  dFlexColumnGheeAfter.classList.add('d-flex', 'flex-column', 'align-items-center', 'justify-content-around');
  rightSubtextAfterDownloadGhee.append(dFlexColumnGheeAfter);

  const gheeMobileHeadingAfter = document.createElement('div');
  gheeMobileHeadingAfter.classList.add('ghee-mobile-heading', 'text-center', 'font-md-18', 'font-baskerville', 'leading-32');
  gheeMobileHeadingAfter.innerHTML = `<p>Your monthly report of svasti ghee has<br>been downloaded!</p>`;
  dFlexColumnGheeAfter.append(gheeMobileHeadingAfter);

  const downloadButtonAfter = document.createElement('button');
  downloadButtonAfter.classList.add('annual-report_DownloadBtn', 'my-9');
  downloadButtonAfter.innerHTML = `
    <div class="tick_download">
      <svg class="icon-downloaded">
        <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#Downloaded-btn"></use>
      </svg>
    </div>
  `;
  dFlexColumnGheeAfter.append(downloadButtonAfter);

  const downloadButtonAfterDiv = document.createElement('div');
  downloadButtonAfterDiv.classList.add('d-flex', 'mb-6');
  dFlexColumnGheeAfter.append(downloadButtonAfterDiv);

  const downloadButtonAfterContainer = document.createElement('div');
  downloadButtonAfterDiv.append(downloadButtonAfterContainer);

  const downloadButtonAfterDisabled = document.createElement('button');
  downloadButtonAfterDisabled.classList.add('download-report_btn', 'download_report_btnAfter', 'disabled', 'bg-light-pink', 'border-light-pink', 'text-cream-100');
  downloadButtonAfterDisabled.textContent = 'Download report';
  downloadButtonAfterContainer.append(downloadButtonAfterDisabled);

  const whatsappLinkDivGheeAfter = document.createElement('div');
  whatsappLinkDivGheeAfter.classList.add('Whatsapp-link', 'mb-8', 'text-center');
  dFlexColumnGheeAfter.append(whatsappLinkDivGheeAfter);


  // Milk Section
  const milkSectionImage = document.createElement('div');
  milkSectionImage.classList.add('position-relative', 'milk-section_image');
  rightSection.append(milkSectionImage);
  milkSectionImage.style.display = 'none'; // Initially hidden

  const accountMainBgBoxMilk = document.createElement('div');
  accountMainBgBoxMilk.classList.add('w-100', 'account-mainBg-box', 'd-flex');
  milkSectionImage.append(accountMainBgBoxMilk);

  // Desktop BG Image Milk
  const annualBgDesktopMilk = document.createElement('div');
  annualBgDesktopMilk.classList.add('annual-background_image--overlay', 'd-flex', 'annual-bg-desktop');
  accountMainBgBoxMilk.append(annualBgDesktopMilk);
  const imgDesktopMilk = document.createElement('img');
  imgDesktopMilk.src = '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/mask-group-20176-2x-fmt-webp-alpha-ca5647.webp';
  imgDesktopMilk.classList.add('account-bgImg', 'with-overlay');
  imgDesktopMilk.height = 392;
  imgDesktopMilk.loading = 'lazy';
  annualBgDesktopMilk.append(imgDesktopMilk);
  const overlayDesktopMilk = document.createElement('div');
  overlayDesktopMilk.classList.add('overlay');
  annualBgDesktopMilk.append(overlayDesktopMilk);

  // Mobile BG Image Milk
  const annualBgMobileMilk = document.createElement('div');
  annualBgMobileMilk.classList.add('annual-background_image--overlay', 'd-flex', 'annual-bg-mobile');
  accountMainBgBoxMilk.append(annualBgMobileMilk);
  const imgMobileMilk = document.createElement('img');
  imgMobileMilk.src = '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/annual-bg-mobile-fmt-webp-alpha-636496.webp';
  imgMobileMilk.classList.add('account-bgImg', 'with-overlay');
  imgMobileMilk.height = 447;
  imgMobileMilk.loading = 'lazy';
  annualBgMobileMilk.append(imgMobileMilk);
  const overlayMobileMilk = document.createElement('div');
  overlayMobileMilk.classList.add('overlay');
  annualBgMobileMilk.append(overlayMobileMilk);

  // Right Subtext Milk
  const rightSubtextMilk = document.createElement('div');
  rightSubtextMilk.classList.add('right-subtext', 'position-absolute', 'start-0', 'end-0', 'bottom-0', 'right-subtext-milk');
  milkSectionImage.append(rightSubtextMilk);

  const dFlexColumnMilk = document.createElement('div');
  dFlexColumnMilk.classList.add('d-flex', 'flex-column', 'align-items-center');
  rightSubtextMilk.append(dFlexColumnMilk);

  const milkMobileHeading = document.createElement('div');
  milkMobileHeading.classList.add('ghee-mobile-heading', 'text-center', 'font-md-18', 'font-baskerville', 'leading-32');
  milkMobileHeading.innerHTML = `<p> </p><p><b>Thick, Tasty Milk</b></p><p><b>Selected with care, for you!</b></p><p></p>`;
  dFlexColumnMilk.append(milkMobileHeading);

  const fontMd18Mt6 = document.createElement('div');
  fontMd18Mt6.classList.add('font-md-18', 'mt-6', 'text-center');
  dFlexColumnMilk.append(fontMd18Mt6);

  const whatsappIconDiv = document.createElement('div');
  whatsappIconDiv.classList.add('my-9');
  whatsappIconDiv.innerHTML = `
    <svg class="icon-downloaded">
      <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#whatsapp_icon"></use>
    </svg>
  `;
  dFlexColumnMilk.append(whatsappIconDiv);

  const whatsappLinkDivMilk = document.createElement('div');
  whatsappLinkDivMilk.classList.add('Whatsapp-link', 'mb-8', 'text-center');
  whatsappLinkDivMilk.innerHTML = `<p>Check Your Milk Report Card on <a href="https://wa.me/message/GW56YICBZLQGI1" target="_blank" rel="noopener noreferrer">Whatsapp​<span class="cmp-link__screen-reader-only">opens in a new tab</span></a></p>`;
  dFlexColumnMilk.append(whatsappLinkDivMilk);
  // --- End of Right Section Content ---

  // Interactivity
  const showGheeSection = () => {
    gheeBox.style.display = 'block';
    milkSectionImage.style.display = 'none';
  };

  const showMilkSection = () => {
    gheeBox.style.display = 'none';
    milkSectionImage.style.display = 'block';
  };

  // Initial state: show ghee section if available, otherwise milk
  if (productSections.some(p => p.type === 'ghee')) {
    showGheeSection();
  } else if (productSections.some(p => p.type === 'milk')) {
    showMilkSection();
  }

  productSections.forEach(product => {
    product.element.addEventListener('click', () => {
      // Remove active class from all product items
      productSections.forEach(p => p.element.classList.remove('active'));
      // Add active class to the clicked product item
      product.element.classList.add('active');

      if (product.type === 'ghee') {
        showGheeSection();
      } else if (product.type === 'milk') {
        showMilkSection();
      }
    });
  });

  // Download button functionality
  downloadLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link navigation
    // Simulate download
    const link = document.createElement('a');
    link.href = downloadLink.href;
    link.download = downloadLink.download;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Toggle visibility
    rightSubtextBeforeDownloadGhee.style.display = 'none';
    rightSubtextAfterDownloadGhee.style.display = 'block';
  });
}
